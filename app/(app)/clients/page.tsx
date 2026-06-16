import { createServiceClient } from '@/lib/supabase/service'
import { Glass } from '@/components/ui/glass'
import Link from 'next/link'
import type { Client } from '@/types'

export default async function ClientsPage() {
  const supabase = createServiceClient()
  const { data } = await supabase.from('clients').select('*').order('name')
  const clients = (data ?? []) as Client[]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, height: '100%' }}>
      <Glass style={{ borderRadius: 16, padding: '0 18px', height: 52,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 800, color: 'rgba(255,255,255,0.92)', letterSpacing: -0.3 }}>Clientes</div>
          <div style={{ fontSize: 9, fontWeight: 500, color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', letterSpacing: '1.2px' }}>
            {clients.length} {clients.length === 1 ? 'cliente' : 'clientes'}
          </div>
        </div>
        <Link href="/clients/new" style={{
          display: 'inline-flex', alignItems: 'center',
          padding: '0 16px', height: 32, borderRadius: 20,
          background: '#C1FF72', color: '#000', fontSize: 11, fontWeight: 700,
          textDecoration: 'none',
        }}>+ Novo cliente</Link>
      </Glass>

      <Glass style={{ borderRadius: 16, flex: 1, padding: '16px', overflow: 'auto' }}>
        {clients.map(c => (
          <Link key={c.id} href={`/clients/${c.id}/contexto`} style={{ textDecoration: 'none' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '12px 10px',
              borderRadius: 12, cursor: 'pointer', marginBottom: 2,
              transition: 'background 0.15s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{
                width: 40, height: 40, borderRadius: 11, flexShrink: 0,
                background: 'rgba(193,255,114,0.08)', border: '1px solid rgba(193,255,114,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 800, color: 'rgba(193,255,114,0.7)',
              }}>
                {c.name.slice(0, 2).toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.82)' }}>{c.name}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 2 }}>{c.industry ?? '—'}</div>
              </div>
              <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.15)' }}>›</div>
            </div>
          </Link>
        ))}

        {clients.length === 0 && (
          <div style={{ padding: '60px 0', textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 14, opacity: 0.3 }}>◻</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.55)', marginBottom: 8 }}>
              Ainda sem clientes
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.28)', marginBottom: 24, lineHeight: 1.6 }}>
              Cria o perfil de cada cliente para que o MazyOS<br/>gere conteúdo com a voz e contexto certos.
            </div>
            <Link href="/clients/new" style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '10px 22px', borderRadius: 22,
              background: '#C1FF72', color: '#000', fontSize: 12, fontWeight: 700,
              textDecoration: 'none',
            }}>
              + Criar primeiro cliente
            </Link>
          </div>
        )}
      </Glass>
    </div>
  )
}
