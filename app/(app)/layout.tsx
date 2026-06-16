'use client'
import { useState } from 'react'
import { Sidebar } from '@/components/shell/sidebar'
import { ChatPanel } from '@/components/shell/chat-panel'
import { MobileNav } from '@/components/shell/mobile-nav'
import { Glass } from '@/components/ui/glass'
import { CarrosselForm } from '@/components/skills/carrossel-form'
import { EmailForm } from '@/components/skills/email-form'
import { GenericSkillForm, GENERIC_SKILL_CONFIGS } from '@/components/skills/generic-form'

const SKILL_LABELS: Record<string, string> = {
  carrossel: 'Carrossel',
  'email-profissional': 'Email Profissional',
  'roteiro-reel': 'Roteiro Reel',
  'relatorio-metricas': 'Relatório Métricas',
  'responder-avaliacoes': 'Responder Avaliações',
  seo: 'SEO',
  'relatorio-ads': 'Relatório Ads',
  'anuncio-google': 'Anúncio Google',
}

function SkillOverlay({
  skillId,
  clientId,
  onClose,
}: {
  skillId: string
  clientId?: string
  onClose: () => void
}) {
  function renderForm() {
    if (skillId === 'carrossel') return <CarrosselForm clientId={clientId} onClose={onClose} />
    if (skillId === 'email-profissional') return <EmailForm clientId={clientId} onClose={onClose} />
    if (GENERIC_SKILL_CONFIGS[skillId]) {
      return <GenericSkillForm skillId={skillId} clientId={clientId} onClose={onClose} />
    }
    return (
      <Glass style={{ width: 380, borderRadius: 20, padding: 28 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.9)', marginBottom: 8 }}>
          {SKILL_LABELS[skillId] ?? skillId}
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 20 }}>
          Disponível em breve.
        </div>
        <button onClick={onClose} style={{
          padding: '8px 20px', borderRadius: 10, background: 'rgba(255,255,255,0.07)',
          border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)',
          fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
        }}>Fechar</button>
      </Glass>
    )
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
      }}
    >
      <div onClick={e => e.stopPropagation()}>
        {renderForm()}
      </div>
    </div>
  )
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [activeSkill, setActiveSkill] = useState<string | null>(null)

  return (
    <div className="app-shell">
      <div className="app-shell-inner">
        <Sidebar onSkillClick={setActiveSkill} />
        <main className="app-main">
          {children}
        </main>
        <ChatPanel workspaceId="" />
      </div>

      <MobileNav onSkillsOpen={() => setActiveSkill('carrossel')} />

      {activeSkill && (
        <SkillOverlay
          skillId={activeSkill}
          onClose={() => setActiveSkill(null)}
        />
      )}
    </div>
  )
}
