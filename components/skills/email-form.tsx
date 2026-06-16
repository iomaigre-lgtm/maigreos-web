'use client'
import { useState } from 'react'
import { Glass } from '@/components/ui/glass'
import { StreamOutput } from '@/components/output/stream-output'

interface EmailFormProps {
  clientId?: string
  onClose: () => void
}

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

export function EmailForm({ clientId, onClose }: EmailFormProps) {
  const [destinatario, setDestinatario] = useState('')
  const [objetivo, setObjetivo] = useState('')
  const [submitted, setSubmitted] = useState(false)

  if (submitted) {
    return (
      <StreamOutput
        skill="email-profissional"
        input={{ destinatario, objetivo }}
        clientId={clientId}
        onClose={onClose}
      />
    )
  }

  return (
    <Glass style={{ borderRadius: 20, padding: 28, maxWidth: 440 }}>
      <div style={{ fontSize: 14, fontWeight: 800, color: 'rgba(255,255,255,0.9)', marginBottom: 20 }}>
        Email Profissional
      </div>
      <form onSubmit={e => { e.preventDefault(); setSubmitted(true) }}>
        <label style={labelStyle}>Para quem vai o email</label>
        <input style={inputStyle} value={destinatario} onChange={e => setDestinatario(e.target.value)}
          placeholder="ex: potencial parceiro, cliente VIP" required />
        <label style={labelStyle}>Objetivo do email</label>
        <textarea rows={3} style={{ ...inputStyle, resize: 'vertical' }}
          value={objetivo} onChange={e => setObjetivo(e.target.value)}
          placeholder="ex: marcar reunião para apresentar proposta de SEO" required />
        <button type="submit" style={{
          width: '100%', padding: 12, borderRadius: 12, background: '#C1FF72',
          border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer',
          fontFamily: 'var(--font-poppins), sans-serif', color: '#000',
        }}>
          Gerar email →
        </button>
      </form>
    </Glass>
  )
}
