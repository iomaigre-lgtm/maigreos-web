import { createServiceClient } from '@/lib/supabase/service'
import { Glass } from '@/components/ui/glass'
import Link from 'next/link'
import type { Client, Generation } from '@/types'

export default async function DashboardPage() {
  const supabase = createServiceClient()
  const { data: clients } = await supabase
    .from('clients').select('*').order('created_at', { ascending: false })
  const { data: generations } = await supabase
    .from('generations').select('*').order('created_at', { ascending: false }).limit(5)

  const c = (clients ?? []) as Client[]
  const g = (generations ?? []) as Generation[]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, height: '100%' }}>
      {/* Topbar */}
      <Glass style={{ borderRadius: 16, padding: '0 18px', height: 52,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 800, color: 'rgba(255,255,255,0.92)', letterSpacing: -0.3 }}>Dashboard</div>
          <div style={{ fontSize: 9, fontWeight: 500, color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', letterSpacing: '1.2px' }}>
            {new Date().toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
        </div>
        <Link href="/clients/new" style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '0 16px', height: 32, borderRadius: 20,
          background: '#C1FF72', color: '#000', fontSize: 11, fontWeight: 700,
          textDecoration: 'none', letterSpacing: 0,
        }}>
          + Criar conteúdo
        </Link>
      </Glass>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, flexShrink: 0 }}>
        {[
          {
            label: 'Clientes',
            value: c.length,
            sub: c.length === 0 ? 'adiciona o primeiro' : c.length === 1 ? 'cliente activo' : 'clientes activos',
            action: c.length === 0 ? { href: '/clients/new', text: '+ Novo' } : null,
          },
          {
            label: 'Criações',
            value: g.length,
            sub: g.length === 0 ? 'escolhe uma skill para começar' : 'este mês',
            action: null,
          },
          {
            label: 'Skills',
            value: 8,
            sub: 'disponíveis agora',
            action: null,
          },
        ].map(s => (
          <Glass key={s.label} style={{ borderRadius: 14, padding: '14px 16px' }}>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '1.5px', color: 'rgba(255,255,255,0.22)', marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 32, fontWeight: 900, color: 'rgba(255,255,255,0.9)',
              lineHeight: 1, letterSpacing: -2, marginBottom: 6 }}>{s.value}</div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.28)' }}>{s.sub}</div>
            {s.action && (
              <Link href={s.action.href} style={{
                display: 'inline-block', marginTop: 8, fontSize: 10, fontWeight: 700,
                color: '#C1FF72', textDecoration: 'none',
              }}>{s.action.text} →</Link>
            )}
          </Glass>
        ))}
      </div>

      {/* Two columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, flex: 1, minHeight: 0 }}>
        {/* Clients */}
        <Glass style={{ borderRadius: 16, padding: '16px', overflow: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
              letterSpacing: '1.5px', color: 'rgba(255,255,255,0.25)' }}>Clientes</div>
            {c.length > 0 && (
              <Link href="/clients/new" style={{ fontSize: 10, fontWeight: 700, color: '#C1FF72', textDecoration: 'none' }}>+ Novo</Link>
            )}
          </div>
          {c.map(client => (
            <Link key={client.id} href={`/clients/${client.id}/contexto`} style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '9px 0',
                borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer',
              }}>
                <div style={{
                  width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                  background: 'rgba(193,255,114,0.08)', border: '1px solid rgba(193,255,114,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontWeight: 800, color: 'rgba(193,255,114,0.7)',
                }}>
                  {client.name.slice(0, 2).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.78)',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{client.name}</div>
                  <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.28)', marginTop: 1 }}>{client.industry ?? '—'}</div>
                </div>
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.15)' }}>›</div>
              </div>
            </Link>
          ))}
          {c.length === 0 && (
            <div style={{ padding: '28px 0', textAlign: 'center' }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>◻</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.45)', marginBottom: 6 }}>
                Ainda sem clientes
              </div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginBottom: 14, lineHeight: 1.5 }}>
                Adiciona o contexto de cada cliente<br/>para gerar conteúdo personalizado
              </div>
              <Link href="/clients/new" style={{
                display: 'inline-flex', alignItems: 'center', padding: '7px 16px',
                borderRadius: 20, background: 'rgba(193,255,114,0.1)', border: '1px solid rgba(193,255,114,0.2)',
                fontSize: 11, fontWeight: 700, color: '#C1FF72', textDecoration: 'none',
              }}>
                + Criar primeiro cliente
              </Link>
            </div>
          )}
        </Glass>

        {/* Recent generations */}
        <Glass style={{ borderRadius: 16, padding: '16px', overflow: 'auto' }}>
          <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
            letterSpacing: '1.5px', color: 'rgba(255,255,255,0.25)', marginBottom: 14 }}>Últimas criações</div>
          {g.map(gen => (
            <div key={gen.id} style={{ padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{
                  fontSize: 8, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px',
                  padding: '2px 8px', borderRadius: 20,
                  background: 'rgba(193,255,114,0.08)', color: 'rgba(193,255,114,0.75)',
                  border: '1px solid rgba(193,255,114,0.14)',
                }}>{gen.skill}</span>
                <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.22)' }}>
                  {new Date(gen.created_at).toLocaleDateString('pt-PT')}
                </span>
              </div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', lineHeight: 1.4,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {gen.output.slice(0, 90)}
              </div>
            </div>
          ))}
          {g.length === 0 && (
            <div style={{ padding: '28px 0', textAlign: 'center' }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>✦</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.45)', marginBottom: 6 }}>
                Ainda sem criações
              </div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', lineHeight: 1.5 }}>
                Escolhe uma skill na barra lateral<br/>para gerar o teu primeiro conteúdo
              </div>
            </div>
          )}
        </Glass>
      </div>
    </div>
  )
}
