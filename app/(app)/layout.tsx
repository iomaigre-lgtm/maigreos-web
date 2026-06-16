'use client'
import { useState } from 'react'
import { Sidebar } from '@/components/shell/sidebar'
import { ChatPanel } from '@/components/shell/chat-panel'
import { Glass } from '@/components/ui/glass'
import { CarrosselForm } from '@/components/skills/carrossel-form'
import { EmailForm } from '@/components/skills/email-form'

function SkillOverlay({
  skillId,
  clientId,
  onClose,
}: {
  skillId: string
  clientId?: string
  onClose: () => void
}) {
  const labelMap: Record<string, string> = {
    'carrossel': 'Carrossel',
    'email-profissional': 'Email Profissional',
    'relatorio-metricas': 'Relatório Métricas',
    'responder-avaliacoes': 'Responder Avaliações',
    'seo': 'SEO',
    'relatorio-ads': 'Relatório Ads',
    'anuncio-google': 'Anúncio Google',
    'roteiro-reel': 'Roteiro Reel',
  }

  function renderForm() {
    if (skillId === 'carrossel') {
      return <CarrosselForm clientId={clientId} onClose={onClose} />
    }
    if (skillId === 'email-profissional') {
      return <EmailForm clientId={clientId} onClose={onClose} />
    }
    // Fallback for skills not yet implemented
    return (
      <Glass style={{ width: 480, maxWidth: '100%', borderRadius: 20, padding: 32 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: 'rgba(255,255,255,0.9)', marginBottom: 8 }}>
          {labelMap[skillId] ?? skillId}
        </div>
        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 24 }}>
          Formulário desta skill em desenvolvimento — disponível em breve.
        </div>
        <button
          onClick={onClose}
          style={{
            padding: '8px 20px', borderRadius: 10, background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.5)',
            fontSize: 12, cursor: 'pointer', fontFamily: 'inherit',
          }}
        >Fechar</button>
      </Glass>
    )
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 50,
        background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24,
      }}
    >
      {/* Wrapper div stops propagation so clicks inside don't close the overlay */}
      <div onClick={(e) => e.stopPropagation()}>
        {renderForm()}
      </div>
    </div>
  )
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [activeSkill, setActiveSkill] = useState<string | null>(null)
  const [activeClientId, setActiveClientId] = useState<string | undefined>(undefined)

  // Expose setter so child pages can optionally set a clientId before a skill is opened.
  // For now it's unused but wired for future use.
  void setActiveClientId

  return (
    <div style={{ minHeight: '100vh', padding: 14, background: '#111111' }}>
      <div style={{ height: 'calc(100vh - 28px)', display: 'flex', gap: 10 }}>
        <Sidebar onSkillClick={setActiveSkill} />
        <main style={{ flex: 1, minWidth: 0 }}>
          {children}
        </main>
        <ChatPanel workspaceId="" />
      </div>
      {activeSkill && (
        <SkillOverlay
          skillId={activeSkill}
          clientId={activeClientId}
          onClose={() => setActiveSkill(null)}
        />
      )}
    </div>
  )
}
