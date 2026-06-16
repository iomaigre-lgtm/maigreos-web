'use client'
import { useState } from 'react'
import { Glass } from '@/components/ui/glass'
import { StreamOutput } from '@/components/output/stream-output'

interface CarrosselFormProps {
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

export function CarrosselForm({ clientId, onClose }: CarrosselFormProps) {
  const [tema, setTema] = useState('')
  const [slides, setSlides] = useState('6')
  const [submitted, setSubmitted] = useState(false)

  if (submitted) {
    return (
      <StreamOutput
        skill="carrossel"
        input={{ tema, slides }}
        clientId={clientId}
        onClose={onClose}
      />
    )
  }

  return (
    <Glass style={{ borderRadius: 20, padding: 28, maxWidth: 440 }}>
      <div style={{ fontSize: 14, fontWeight: 800, color: 'rgba(255,255,255,0.9)', marginBottom: 20 }}>
        Carrossel Instagram
      </div>
      <form onSubmit={e => { e.preventDefault(); setSubmitted(true) }}>
        <label style={labelStyle}>Tema / Mensagem principal</label>
        <input style={inputStyle} value={tema} onChange={e => setTema(e.target.value)}
          placeholder="ex: 5 erros que as PMEs cometem no digital" required />
        <label style={labelStyle}>Número de slides</label>
        <select style={{ ...inputStyle, appearance: 'none' }}
          value={slides} onChange={e => setSlides(e.target.value)}>
          {[4, 5, 6, 7, 8, 10].map(n => (
            <option key={n} value={n}>{n} slides</option>
          ))}
        </select>
        <button type="submit" style={{
          width: '100%', padding: 12, borderRadius: 12, background: '#C1FF72',
          border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer',
          fontFamily: 'var(--font-poppins), sans-serif', color: '#000',
        }}>
          Gerar carrossel →
        </button>
      </form>
    </Glass>
  )
}
