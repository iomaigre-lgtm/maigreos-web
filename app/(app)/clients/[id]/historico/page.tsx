import { createClient } from '@/lib/supabase/server'
import { Glass } from '@/components/ui/glass'
import Link from 'next/link'
import type { Client, Generation } from '@/types'

const TABS = ['contexto', 'identidade', 'historico'] as const

export default async function ClientHistoricoPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: clientData } = await supabase.from('clients').select('*').eq('id', params.id).single()
  const { data: genData } = await supabase.from('generations').select('*')
    .eq('client_id', params.id).order('created_at', { ascending: false })

  const client = clientData as Client | null
  const generations = (genData ?? []) as Generation[]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, height: '100%' }}>
      <Glass style={{ borderRadius: 16, padding: '0 18px', height: 50,
        display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.85)' }}>
          {client?.name ?? '...'}
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {TABS.map(t => (
            <Link key={t} href={`/clients/${params.id}/${t}`} style={{ textDecoration: 'none' }}>
              <div style={{
                padding: '5px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                background: t === 'historico' ? 'rgba(255,255,255,0.08)' : 'transparent',
                color: t === 'historico' ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.35)',
              }}>{t.charAt(0).toUpperCase() + t.slice(1)}</div>
            </Link>
          ))}
        </div>
      </Glass>
      <Glass style={{ borderRadius: 16, flex: 1, padding: '14px 16px', overflow: 'auto' }}>
        {generations.map(g => (
          <div key={g.id} style={{ padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{
                fontSize: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px',
                padding: '2px 7px', borderRadius: 20, flexShrink: 0,
                background: 'rgba(193,255,114,0.08)', color: 'rgba(193,255,114,0.8)',
                border: '1px solid rgba(193,255,114,0.15)',
              }}>{g.skill}</span>
              <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)' }}>
                {new Date(g.created_at).toLocaleDateString('pt-PT')}
              </span>
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {g.output.slice(0, 120)}
            </div>
          </div>
        ))}
        {generations.length === 0 && (
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', padding: '40px 0', textAlign: 'center' }}>
            Nenhuma criação ainda para este cliente
          </div>
        )}
      </Glass>
    </div>
  )
}
