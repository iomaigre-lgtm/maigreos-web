import { createClient } from '@/lib/supabase/server'
import { getApiKey } from '@/lib/ai/decrypt-key'
import { buildSystemPrompt } from '@/lib/prompts/system'
import { carrosselPrompt } from '@/lib/prompts/carrossel'
import { emailPrompt } from '@/lib/prompts/email'
import { createAnthropic } from '@ai-sdk/anthropic'
import { streamText } from 'ai'
import type { AgencyContext, Client, ClientContext } from '@/types'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  const body = await req.json() as {
    skill: string
    input: Record<string, string>
    clientId?: string
  }
  const { skill, input, clientId } = body

  const supabase = await createClient()

  const [agencyRes, clientRes, clientCtxRes] = await Promise.all([
    supabase.from('agency_context').select('*').single(),
    clientId ? supabase.from('clients').select('*').eq('id', clientId).single() : Promise.resolve({ data: null }),
    clientId ? supabase.from('client_context').select('*').eq('client_id', clientId).single() : Promise.resolve({ data: null }),
  ])

  const agency = agencyRes.data as AgencyContext | null
  const client = clientRes.data as Client | null
  const clientContext = clientCtxRes.data as ClientContext | null

  const apiKey = await getApiKey(supabase, 'claude')
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'Chave Claude não configurada. Vai a Definições.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const systemPrompt = buildSystemPrompt({ agency, client, clientContext })
  const clientName = client?.name ?? 'o cliente'

  let userPrompt: string
  switch (skill) {
    case 'carrossel':
      userPrompt = carrosselPrompt({
        tema: input.tema ?? '',
        slides: Number(input.slides) || 6,
        clientName,
      })
      break
    case 'email-profissional':
      userPrompt = emailPrompt({
        destinatario: input.destinatario ?? '',
        objetivo: input.objetivo ?? '',
        clientName,
      })
      break
    default:
      userPrompt = `Executa a skill "${skill}" com os seguintes parâmetros:\n${JSON.stringify(input, null, 2)}`
  }

  const anthropic = createAnthropic({ apiKey })

  const result = streamText({
    model: anthropic('claude-sonnet-4-6'),
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
    onFinish: async ({ text }) => {
      await supabase.from('generations').insert({
        client_id: clientId ?? null,
        skill,
        input,
        output: text,
      })
    },
  })

  return result.toTextStreamResponse()
}
