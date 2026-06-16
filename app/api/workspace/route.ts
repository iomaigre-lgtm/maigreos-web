import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/service'

export async function GET() {
  const supabase = createServiceClient()

  const { data: existing } = await supabase
    .from('workspaces')
    .select('id')
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ workspaceId: existing.id })
  }

  const { data: created, error } = await supabase
    .from('workspaces')
    .insert({ name: 'Principal', slug: 'default' })
    .select('id')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ workspaceId: created.id })
}
