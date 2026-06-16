import { createClient } from '@/lib/supabase/server'
import { Glass } from '@/components/ui/glass'
import Link from 'next/link'
import type { Client } from '@/types'

export default async function ClientsPage() {
  const supabase = await createClient()
  const { data } = await supabase.from('clients').select('*').order('name')
  const clients = (data ?? []) as Client[]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, height: '100%' }}>
      <Glass style={{ borderRadius: 16, padding: '0 18px', height: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.85)' }}>Clientes</div>
        <Link href="/clients/new" style={{
          display: 'inline-flex', alignItems: 'center',
          padding: '0 16px', height: 32, borderRadius: 20,
          background: '#C1FF72', color: '#000', fontSize: 11, fontWeight: 700,
          textDecoration: 'none',
        }}>+ Novo cliente</Link>
      </Glass>
      <Glass style={{ borderRadius: 16, flex: 1, padding: '14px 16px', overflow: 'auto' }}>
        {clients.map(c => (
          <Link key={c.id} href={`/clients/${c.id}/contexto`} style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0',
              borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer' }}>
              <div style={{ width: 36, height: 36, borderRadius: 9,
                background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)', flexShrink: 0 }}>
                {c.name.slice(0,2).toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.75)' }}>{c.name}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>{c.industry ?? '—'}</div>
              </div>
            </div>
          </Link>
        ))}
        {clients.length === 0 && (
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', padding: '40px 0', textAlign: 'center' }}>
            Nenhum cliente ainda
          </div>
        )}
      </Glass>
    </div>
  )
}
