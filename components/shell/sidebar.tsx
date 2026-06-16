'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Glass } from '@/components/ui/glass'

const NAV = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/agency',    label: 'Agência' },
  { href: '/clients',   label: 'Clientes' },
]

const SKILLS = [
  { id: 'carrossel',            label: 'Carrossel',            desc: 'Slides Instagram' },
  { id: 'roteiro-reel',         label: 'Roteiro Reel',         desc: 'Script de vídeo' },
  { id: 'relatorio-metricas',   label: 'Relatório Métricas',   desc: 'Analytics' },
  { id: 'email-profissional',   label: 'Email Profissional',   desc: 'Prospecção' },
  { id: 'responder-avaliacoes', label: 'Responder Avaliações', desc: 'Reviews' },
  { id: 'seo',                  label: 'SEO',                  desc: 'Optimização' },
  { id: 'relatorio-ads',        label: 'Relatório Ads',        desc: 'Performance' },
  { id: 'anuncio-google',       label: 'Anúncio Google',       desc: 'Google Ads' },
]

export function Sidebar({ onSkillClick }: { onSkillClick?: (skillId: string) => void }) {
  const path = usePathname()

  return (
    <div style={{ width: 220, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 8, height: '100%' }}>
      {/* Brand */}
      <Glass style={{ borderRadius: 16, padding: '12px 14px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8, background: '#C1FF72',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 900, color: '#000', flexShrink: 0,
          }}>M</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: 'rgba(255,255,255,0.9)' }}>MazyOS</div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)' }}>by Maigre IA</div>
          </div>
        </div>
      </Glass>

      {/* Nav */}
      <Glass style={{ borderRadius: 18, flexShrink: 0 }}>
        <div style={{ padding: 8 }}>
          <div style={{
            padding: '6px 8px 3px', fontSize: 8, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '1.8px', color: 'rgba(255,255,255,0.2)',
          }}>Workspace</div>
          {NAV.map(n => (
            <Link key={n.href} href={n.href} style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 9,
                padding: '8px 9px', borderRadius: 10,
                fontSize: 11, fontWeight: path === n.href ? 600 : 500,
                color: path === n.href ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.4)',
                background: path === n.href ? 'rgba(255,255,255,0.07)' : 'transparent',
              }}>
                {path === n.href && (
                  <div style={{ width: 2, height: 12, background: '#C1FF72', borderRadius: 2, flexShrink: 0 }}/>
                )}
                {n.label}
              </div>
            </Link>
          ))}
        </div>
      </Glass>

      {/* Skills panel */}
      <Glass style={{ borderRadius: 18, flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <div style={{ height: '100%', overflowY: 'auto', padding: '10px 8px' }}>
          <div style={{
            padding: '0 9px 8px', fontSize: 8, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '1.8px', color: 'rgba(255,255,255,0.2)',
          }}>Skills</div>
          {SKILLS.map(s => (
            <div
              key={s.id}
              onClick={() => onSkillClick?.(s.id)}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: 9,
                padding: '7px 9px', borderRadius: 10, cursor: 'pointer', marginBottom: 1,
              }}
            >
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.45)' }}>{s.label}</div>
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.22)', marginTop: 1 }}>{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </Glass>

      {/* Settings */}
      <Glass style={{ borderRadius: 14, padding: 4, flexShrink: 0 }}>
        <Link href="/settings" style={{ textDecoration: 'none' }}>
          <div style={{
            padding: '7px 9px', borderRadius: 10, fontSize: 11,
            fontWeight: 500, color: 'rgba(255,255,255,0.3)', cursor: 'pointer',
          }}>Configurações</div>
        </Link>
      </Glass>
    </div>
  )
}
