import { createClient } from '@/lib/supabase/server'
import { getApiKey } from '@/lib/ai/decrypt-key'
import { buildSystemPrompt } from '@/lib/prompts/system'
import { createAnthropic } from '@ai-sdk/anthropic'
import { streamText } from 'ai'
import type { AgencyContext, Client, ClientContext } from '@/types'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  const body = await req.json() as {
    messages: Array<{ role: 'user' | 'assistant'; content: string }>
    workspaceId?: string
    activeClientId?: string
  }
  const { messages, activeClientId } = body

  const supabase = await createClient()

  const [agencyRes, clientRes, clientCtxRes] = await Promise.all([
    supabase.from('agency_context').select('*').single(),
    activeClientId ? supabase.from('clients').select('*').eq('id', activeClientId).single() : Promise.resolve({ data: null }),
    activeClientId ? supabase.from('client_context').select('*').eq('client_id', activeClientId).single() : Promise.resolve({ data: null }),
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
  const anthropic = createAnthropic({ apiKey })

  const result = streamText({
    model: anthropic('claude-sonnet-4-6'),
    system: systemPrompt,
    messages,
  })

  return result.toTextStreamResponse()
}
