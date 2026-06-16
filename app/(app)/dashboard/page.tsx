import { createClient } from '@/lib/supabase/server'
import { Glass } from '@/components/ui/glass'
import Link from 'next/link'
import type { Client, Generation } from '@/types'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: clients } = await supabase
    .from('clients').select('*').order('created_at', { ascending: false })
  const { data: generations } = await supabase
    .from('generations').select('*').order('created_at', { ascending: false }).limit(5)

  const c = (clients ?? []) as Client[]
  const g = (generations ?? []) as Generation[]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, height: '100%' }}>
      {/* Topbar */}
      <Glass style={{ borderRadius: 16, padding: '0 18px', height: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.85)' }}>Dashboard</div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>
            {new Date().toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
        </div>
        <Link href="/clients/new" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '0 16px', height: 32, borderRadius: 20,
          background: '#C1FF72', color: '#000', fontSize: 11, fontWeight: 700,
          textDecoration: 'none',
        }}>
          + Criar conteúdo
        </Link>
      </Glass>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, flexShrink: 0 }}>
        {[
          { label: 'Clientes', value: c.length, sub: 'todos ativos' },
          { label: 'Criações', value: g.length, sub: 'neste mês' },
          { label: 'Skills', value: 8, sub: 'disponíveis' },
        ].map(s => (
          <Glass key={s.label} style={{ borderRadius: 14, padding: '14px 16px' }}>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '1.5px', color: 'rgba(255,255,255,0.25)', marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontSize: 28, fontWeight: 800, color: 'rgba(255,255,255,0.85)',
              lineHeight: 1, letterSpacing: -1.5 }}>{s.value}</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 6 }}>{s.sub}</div>
          </Glass>
        ))}
      </div>

      {/* Two columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, flex: 1, minHeight: 0 }}>
        {/* Clients */}
        <Glass style={{ borderRadius: 16, padding: '14px 16px', overflow: 'auto' }}>
          <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '1.5px', color: 'rgba(255,255,255,0.3)', marginBottom: 12 }}>Clientes</div>
          {c.map(client => (
            <Link key={client.id} href={`/clients/${client.id}/contexto`} style={{ textDecoration: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0',
                borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer' }}>
                <div style={{ width: 28, height: 28, borderRadius: 7,
                  background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.5)', flexShrink: 0 }}>
                  {client.name.slice(0,2).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.7)',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{client.name}</div>
                  <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)' }}>{client.industry ?? '—'}</div>
                </div>
              </div>
            </Link>
          ))}
          {c.length === 0 && (
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', padding: '20px 0', textAlign: 'center' }}>
              Nenhum cliente —{' '}
              <Link href="/clients/new" style={{ color: '#C1FF72', textDecoration: 'none' }}>criar</Link>
            </div>
          )}
        </Glass>

        {/* Recent generations */}
        <Glass style={{ borderRadius: 16, padding: '14px 16px', overflow: 'auto' }}>
          <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '1.5px', color: 'rgba(255,255,255,0.3)', marginBottom: 12 }}>Últimas criações</div>
          {g.map(gen => (
            <div key={gen.id} style={{ padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  fontSize: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px',
                  padding: '2px 7px', borderRadius: 20, flexShrink: 0,
                  background: 'rgba(193,255,114,0.08)', color: 'rgba(193,255,114,0.8)',
                  border: '1px solid rgba(193,255,114,0.15)',
                }}>{gen.skill}</span>
                <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)' }}>
                  {new Date(gen.created_at).toLocaleDateString('pt-PT')}
                </span>
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 4,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {gen.output.slice(0, 80)}
              </div>
            </div>
          ))}
          {g.length === 0 && (
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', padding: '20px 0', textAlign: 'center' }}>
              Ainda sem criações
            </div>
          )}
        </Glass>
      </div>
    </div>
  )
}
