import { createServiceClient } from '@/lib/supabase/service'
import { encrypt } from '@/lib/ai/decrypt-key'

export async function POST(req: Request) {
  const { provider, key } = await req.json() as { provider: 'claude' | 'openai'; key: string }

  if (!provider || !key) {
    return new Response(JSON.stringify({ error: 'provider e key são obrigatórios' }), {
      status: 400, headers: { 'Content-Type': 'application/json' },
    })
  }

  if (!['claude', 'openai'].includes(provider)) {
    return new Response(JSON.stringify({ error: 'provider inválido' }), {
      status: 400, headers: { 'Content-Type': 'application/json' },
    })
  }

  const supabase = createServiceClient()

  const { data: workspace } = await supabase
    .from('workspaces')
    .select('id')
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle()

  if (!workspace) {
    return new Response(JSON.stringify({ error: 'Workspace não encontrado. Tenta recarregar a página.' }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    })
  }

  const encrypted = encrypt(key)

  const { error } = await supabase
    .from('api_keys')
    .upsert(
      { provider, encrypted_key: encrypted, workspace_id: workspace.id },
      { onConflict: 'workspace_id,provider' }
    )

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
  })
}
