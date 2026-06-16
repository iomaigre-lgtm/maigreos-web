'use client'
import { useState, useEffect } from 'react'
import { Glass } from '@/components/ui/glass'
import type { AgencyContext } from '@/types'

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '11px 14px', borderRadius: 12, boxSizing: 'border-box',
  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
  color: '#fff', fontSize: 12, fontFamily: 'var(--font-poppins), sans-serif',
  outline: 'none', marginBottom: 14, resize: 'none' as const,
}
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
  letterSpacing: '1.5px', color: 'rgba(255,255,255,0.28)', marginBottom: 7,
}

type AgencyState = Partial<AgencyContext & { workspace_id: string }>

export default function AgencyPage() {
  const [agency, setAgency] = useState<AgencyState>({})
  const [workspaceId, setWorkspaceId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/workspace')
      .then(r => r.json())
      .then(({ workspaceId: wid }) => {
        setWorkspaceId(wid)
        if (!wid) return
        fetch(`/api/agency?workspace_id=${wid}`)
          .then(r => r.json())
          .then(({ data }) => { if (data) setAgency(data) })
      })
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!workspaceId) return
    setSaving(true)
    await fetch('/api/agency', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...agency, workspace_id: workspaceId }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const fields: Array<{ key: keyof AgencyState; label: string; placeholder: string; rows: number }> = [
    { key: 'mission', label: 'Missão', placeholder: 'O que fazemos e para quem — uma frase directa', rows: 2 },
    { key: 'voice', label: 'Tom de voz', placeholder: 'Como comunicamos: directo, técnico, descontraído, formal...', rows: 2 },
    { key: 'services', label: 'Serviços', placeholder: 'O que oferecemos — lista os principais', rows: 3 },
    { key: 'icp', label: 'Cliente ideal (ICP)', placeholder: 'Quem é o nosso cliente: sector, tamanho, dor principal', rows: 3 },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, height: '100%' }}>
      {/* Header */}
      <Glass style={{ borderRadius: 16, padding: '0 18px', height: 52,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 800, color: 'rgba(255,255,255,0.92)', letterSpacing: -0.3 }}>Agência</div>
          <div style={{ fontSize: 9, fontWeight: 500, color: 'rgba(255,255,255,0.28)', textTransform: 'uppercase', letterSpacing: '1.2px' }}>
            Contexto base para toda a geração
          </div>
        </div>
        <div style={{
          fontSize: 9, fontWeight: 700, padding: '4px 10px', borderRadius: 20,
          background: 'rgba(193,255,114,0.08)', border: '1px solid rgba(193,255,114,0.15)',
          color: 'rgba(193,255,114,0.7)', textTransform: 'uppercase', letterSpacing: '1px',
        }}>
          Maigre IA
        </div>
      </Glass>

      {/* Info banner */}
      <Glass variant="accent" style={{ borderRadius: 14, padding: '12px 16px', flexShrink: 0 }}>
        <div style={{ fontSize: 11, color: 'rgba(193,255,114,0.8)', lineHeight: 1.55 }}>
          <strong style={{ fontWeight: 700 }}>Este contexto é o ADN da agência.</strong>{' '}
          Quanto mais completo, mais preciso é o conteúdo gerado para qualquer cliente.
        </div>
      </Glass>

      {/* Form */}
      <Glass style={{ borderRadius: 16, flex: 1, padding: '20px 22px', overflow: 'auto' }}>
        <form onSubmit={handleSave}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {fields.map(f => (
              <div key={f.key}>
                <label style={labelStyle}>{f.label}</label>
                <textarea
                  style={inputStyle}
                  rows={f.rows}
                  placeholder={f.placeholder}
                  value={(agency[f.key] as string) ?? ''}
                  onChange={e => setAgency(p => ({ ...p, [f.key]: e.target.value }))}
                />
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
            <button type="submit" disabled={saving} style={{
              padding: '11px 28px', borderRadius: 12,
              background: saved ? 'rgba(193,255,114,0.12)' : '#C1FF72',
              border: saved ? '1px solid rgba(193,255,114,0.3)' : 'none',
              color: saved ? '#C1FF72' : '#000',
              fontSize: 12, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-poppins), sans-serif', opacity: saving ? 0.7 : 1,
            }}>
              {saved ? 'Guardado ✓' : saving ? 'A guardar...' : 'Guardar contexto'}
            </button>
          </div>
        </form>
      </Glass>
    </div>
  )
}
