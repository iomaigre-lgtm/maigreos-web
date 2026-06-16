import { createServiceClient } from '@/lib/supabase/service'
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

  const supabase = createServiceClient()

  const [agencyRes, clientRes, clientCtxRes, workspaceRes] = await Promise.all([
    supabase.from('agency_context').select('*').limit(1).maybeSingle(),
    clientId ? supabase.from('clients').select('*').eq('id', clientId).single() : Promise.resolve({ data: null }),
    clientId ? supabase.from('client_context').select('*').eq('client_id', clientId).single() : Promise.resolve({ data: null }),
    supabase.from('workspaces').select('id').order('created_at', { ascending: true }).limit(1).maybeSingle(),
  ])

  const agency = agencyRes.data as AgencyContext | null
  const client = clientRes.data as Client | null
  const clientContext = clientCtxRes.data as ClientContext | null
  const workspaceId = workspaceRes.data?.id ?? null

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
      userPrompt = `Executa a skill "${skill}" com os seguintes parâmetros:\n${JSON.stringify(input, null, 2)}\n\nSe houver um cliente, personaliza para ${clientName}.`
  }

  const anthropic = createAnthropic({ apiKey })

  const result = streamText({
    model: anthropic('claude-haiku-4-5-20251001'),
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
    onFinish: async ({ text }) => {
      if (!workspaceId) return
      await supabase.from('generations').insert({
        workspace_id: workspaceId,
        client_id: clientId ?? null,
        skill,
        input,
        output: text,
      })
    },
  })

  return result.toTextStreamResponse()
}
