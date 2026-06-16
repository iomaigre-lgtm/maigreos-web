'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Glass } from '@/components/ui/glass'
import { useState } from 'react'

const NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: '⊡' },
  { href: '/agency', label: 'Agência', icon: '◈' },
  { href: '/clients', label: 'Clientes', icon: '◻' },
]

export const SKILLS = [
  { id: 'carrossel', label: 'Carrossel', desc: 'Slides Instagram' },
  { id: 'roteiro-reel', label: 'Roteiro Reel', desc: 'Script de vídeo' },
  { id: 'email-profissional', label: 'Email', desc: 'Prospecção' },
  { id: 'responder-avaliacoes', label: 'Avaliações', desc: 'Responder reviews' },
  { id: 'seo', label: 'SEO', desc: 'Texto optimizado' },
  { id: 'relatorio-metricas', label: 'Métricas', desc: 'Relatório analytics' },
  { id: 'relatorio-ads', label: 'Ads Report', desc: 'Performance paga' },
  { id: 'anuncio-google', label: 'Google Ads', desc: 'Headlines e copy' },
]

export function Sidebar({ onSkillClick }: { onSkillClick?: (skillId: string) => void }) {
  const path = usePathname()
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null)

  return (
    <div className="app-sidebar">
      {/* Brand */}
      <Glass style={{ borderRadius: 16, padding: '11px 14px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8, background: '#C1FF72',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 900, color: '#000', flexShrink: 0,
          }}>M</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: 'rgba(255,255,255,0.9)', letterSpacing: -0.3 }}>MazyOS</div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.5px' }}>by Maigre IA</div>
          </div>
        </div>
      </Glass>

      {/* Nav */}
      <Glass style={{ borderRadius: 18, flexShrink: 0 }}>
        <div style={{ padding: '6px' }}>
          <div style={{
            padding: '4px 10px 6px', fontSize: 8, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '1.8px', color: 'rgba(255,255,255,0.18)',
          }}>Workspace</div>
          {NAV.map(n => {
            const active = path === n.href || (n.href !== '/dashboard' && path.startsWith(n.href))
            return (
              <Link key={n.href} href={n.href} style={{ textDecoration: 'none' }}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 9,
                  padding: '8px 10px', borderRadius: 11, marginBottom: 1,
                  fontSize: 12, fontWeight: active ? 700 : 500,
                  color: active ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.38)',
                  background: active ? 'rgba(255,255,255,0.08)' : 'transparent',
                  transition: 'all 0.15s',
                }}>
                  {active && (
                    <div style={{ width: 3, height: 14, background: '#C1FF72', borderRadius: 2, flexShrink: 0 }}/>
                  )}
                  {!active && (
                    <div style={{ width: 3, height: 14, flexShrink: 0 }}/>
                  )}
                  <span style={{ fontSize: 11, opacity: active ? 0.7 : 0.4 }}>{n.icon}</span>
                  {n.label}
                </div>
              </Link>
            )
          })}
        </div>
      </Glass>

      {/* Skills panel */}
      <Glass style={{ borderRadius: 18, flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <div style={{ height: '100%', overflowY: 'auto', padding: '6px' }}>
          <div style={{
            padding: '4px 10px 8px', fontSize: 8, fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '1.8px', color: 'rgba(255,255,255,0.18)',
          }}>Skills</div>
          {SKILLS.map(s => (
            <div
              key={s.id}
              onClick={() => onSkillClick?.(s.id)}
              onMouseEnter={() => setHoveredSkill(s.id)}
              onMouseLeave={() => setHoveredSkill(null)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '8px 10px', borderRadius: 11, cursor: 'pointer', marginBottom: 1,
                background: hoveredSkill === s.id ? 'rgba(193,255,114,0.07)' : 'transparent',
                transition: 'background 0.12s',
              }}
            >
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: hoveredSkill === s.id ? 'rgba(255,255,255,0.82)' : 'rgba(255,255,255,0.48)' }}>{s.label}</div>
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.2)', marginTop: 1 }}>{s.desc}</div>
              </div>
              {hoveredSkill === s.id && (
                <div style={{
                  width: 18, height: 18, borderRadius: 6, background: '#C1FF72',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, color: '#000', fontWeight: 900, flexShrink: 0,
                }}>↗</div>
              )}
            </div>
          ))}
        </div>
      </Glass>

      {/* Settings */}
      <Glass style={{ borderRadius: 14, padding: 4, flexShrink: 0 }}>
        <Link href="/settings" style={{ textDecoration: 'none' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '7px 10px', borderRadius: 11, fontSize: 11,
            fontWeight: 500, color: path === '/settings' ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.28)',
            background: path === '/settings' ? 'rgba(255,255,255,0.06)' : 'transparent',
          }}>
            <span style={{ fontSize: 11 }}>⚙</span>
            Configurações
          </div>
        </Link>
      </Glass>
    </div>
  )
}
