import { NextResponse, type NextRequest } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'

export async function GET(req: NextRequest) {
  const workspaceId = req.nextUrl.searchParams.get('workspace_id')
  if (!workspaceId) return NextResponse.json({ data: null })

  const supabase = createServiceClient()
  const { data } = await supabase
    .from('agency_context')
    .select('*')
    .eq('workspace_id', workspaceId)
    .maybeSingle()

  return NextResponse.json({ data })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { workspace_id, mission, voice, services, icp } = body

  if (!workspace_id) {
    return NextResponse.json({ error: 'workspace_id obrigatório' }, { status: 400 })
  }

  const supabase = createServiceClient()
  const { error } = await supabase
    .from('agency_context')
    .upsert({ workspace_id, mission, voice, services, icp }, { onConflict: 'workspace_id' })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
