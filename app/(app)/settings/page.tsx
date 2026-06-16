'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Glass } from '@/components/ui/glass'
import type { AgencyContext } from '@/types'

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', borderRadius: 12, boxSizing: 'border-box',
  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
  color: '#fff', fontSize: 12, fontFamily: 'var(--font-poppins), sans-serif',
  outline: 'none', marginBottom: 12,
}
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
  letterSpacing: '1.2px', color: 'rgba(255,255,255,0.3)', marginBottom: 6,
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
      letterSpacing: '1.5px', color: 'rgba(255,255,255,0.25)', marginBottom: 16 }}>
      {children}
    </div>
  )
}

export default function SettingsPage() {
  const [claudeKey, setClaudeKey] = useState('')
  const [openaiKey, setOpenaiKey] = useState('')
  const [keySaving, setKeySaving] = useState<string | null>(null)
  const [keySaved, setKeySaved] = useState<string | null>(null)

  const [agency, setAgency] = useState<Partial<AgencyContext>>({})
  const [agencySaved, setAgencySaved] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    supabase.from('agency_context').select('*').single()
      .then(({ data }) => { if (data) setAgency(data as Partial<AgencyContext>) })
  }, [])

  async function saveKey(provider: 'claude' | 'openai', key: string) {
    setKeySaving(provider)
    const res = await fetch('/api/keys', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider, key }),
    })
    setKeySaving(null)
    if (res.ok) {
      setKeySaved(provider)
      setTimeout(() => setKeySaved(null), 2000)
    }
  }

  async function saveAgency(e: React.FormEvent) {
    e.preventDefault()
    await supabase.from('agency_context').upsert(agency)
    setAgencySaved(true)
    setTimeout(() => setAgencySaved(false), 2000)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, height: '100%', overflow: 'auto' }}>
      {/* Topbar */}
      <Glass style={{ borderRadius: 16, padding: '0 18px', height: 50,
        display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.85)' }}>Definições</div>
      </Glass>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {/* API Keys */}
        <Glass style={{ borderRadius: 16, padding: '20px 22px' }}>
          <SectionTitle>Chaves de API</SectionTitle>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: 20, lineHeight: 1.6, marginTop: 0 }}>
            As chaves são encriptadas antes de serem guardadas. Nunca chegam ao browser nas chamadas às APIs.
          </p>

          {/* Claude */}
          <label style={labelStyle}>Claude API Key</label>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <input
              type="password"
              style={{ ...inputStyle, flex: 1, marginBottom: 0 }}
              value={claudeKey}
              onChange={e => setClaudeKey(e.target.value)}
              placeholder="sk-ant-..."
            />
            <button
              onClick={() => claudeKey && saveKey('claude', claudeKey)}
              disabled={!claudeKey || keySaving === 'claude'}
              style={{
                padding: '0 16px', borderRadius: 12, flexShrink: 0,
                background: keySaved === 'claude' ? 'rgba(193,255,114,0.15)' : '#C1FF72',
                border: keySaved === 'claude' ? '1px solid rgba(193,255,114,0.3)' : 'none',
                color: keySaved === 'claude' ? '#C1FF72' : '#000',
                fontSize: 11, fontWeight: 700, cursor: 'pointer',
                fontFamily: 'var(--font-poppins), sans-serif',
                opacity: (!claudeKey || keySaving === 'claude') ? 0.5 : 1,
              }}
            >
              {keySaved === 'claude' ? '✓' : keySaving === 'claude' ? '...' : 'Guardar'}
            </button>
          </div>

          {/* OpenAI */}
          <label style={labelStyle}>OpenAI API Key</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="password"
              style={{ ...inputStyle, flex: 1, marginBottom: 0 }}
              value={openaiKey}
              onChange={e => setOpenaiKey(e.target.value)}
              placeholder="sk-..."
            />
            <button
              onClick={() => openaiKey && saveKey('openai', openaiKey)}
              disabled={!openaiKey || keySaving === 'openai'}
              style={{
                padding: '0 16px', borderRadius: 12, flexShrink: 0,
                background: keySaved === 'openai' ? 'rgba(193,255,114,0.15)' : '#C1FF72',
                border: keySaved === 'openai' ? '1px solid rgba(193,255,114,0.3)' : 'none',
                color: keySaved === 'openai' ? '#C1FF72' : '#000',
                fontSize: 11, fontWeight: 700, cursor: 'pointer',
                fontFamily: 'var(--font-poppins), sans-serif',
                opacity: (!openaiKey || keySaving === 'openai') ? 0.5 : 1,
              }}
            >
              {keySaved === 'openai' ? '✓' : keySaving === 'openai' ? '...' : 'Guardar'}
            </button>
          </div>
        </Glass>

        {/* Agency context */}
        <Glass style={{ borderRadius: 16, padding: '20px 22px' }}>
          <SectionTitle>Contexto da agência</SectionTitle>
          <form onSubmit={saveAgency}>
            {([
              { key: 'mission' as const, label: 'Missão', rows: 2, ph: 'O que fazemos e para quem' },
              { key: 'voice' as const, label: 'Tom de voz', rows: 2, ph: 'Como comunicamos' },
              { key: 'services' as const, label: 'Serviços', rows: 2, ph: 'O que oferecemos' },
              { key: 'icp' as const, label: 'Cliente ideal', rows: 2, ph: 'Quem é o nosso cliente' },
            ]).map(f => (
              <div key={f.key}>
                <label style={labelStyle}>{f.label}</label>
                <textarea
                  rows={f.rows}
                  placeholder={f.ph}
                  style={{ ...inputStyle, resize: 'none' } as React.CSSProperties}
                  value={(agency as Record<string, string>)[f.key] ?? ''}
                  onChange={e => setAgency(p => ({ ...p, [f.key]: e.target.value }))}
                />
              </div>
            ))}
            <button type="submit" style={{
              padding: '10px 24px', borderRadius: 12,
              background: agencySaved ? 'rgba(193,255,114,0.12)' : '#C1FF72',
              border: agencySaved ? '1px solid rgba(193,255,114,0.3)' : 'none',
              color: agencySaved ? '#C1FF72' : '#000',
              fontSize: 12, fontWeight: 700, cursor: 'pointer',
              fontFamily: 'var(--font-poppins), sans-serif',
            }}>
              {agencySaved ? 'Guardado ✓' : 'Guardar contexto'}
            </button>
          </form>
        </Glass>
      </div>
    </div>
  )
}
