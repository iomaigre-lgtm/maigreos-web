'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Glass } from '@/components/ui/glass'
import Link from 'next/link'

type VisualIdentity = {
  primary_color: string
  secondary_color: string
  font: string
  logo_url: string
  notes: string
}

const TABS = ['contexto', 'identidade', 'historico'] as const

export default function ClientIdentidadePage({ params }: { params: { id: string } }) {
  const [visual, setVisual] = useState<VisualIdentity>({
    primary_color: '', secondary_color: '', font: '', logo_url: '', notes: '',
  })
  const [saved, setSaved] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    supabase.from('client_context').select('visual_identity').eq('client_id', params.id).single()
      .then(({ data }) => {
        if (data?.visual_identity) setVisual(data.visual_identity as VisualIdentity)
      })
  }, [params.id])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    await supabase.from('client_context').upsert({ client_id: params.id, visual_identity: visual })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const fieldStyle: React.CSSProperties = {
    width: '100%', padding: '10px 14px', borderRadius: 12, boxSizing: 'border-box',
    background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
    color: '#fff', fontSize: 12, fontFamily: 'var(--font-poppins), sans-serif',
    outline: 'none', marginBottom: 12,
  }
  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
    letterSpacing: '1.2px', color: 'rgba(255,255,255,0.3)', marginBottom: 6,
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, height: '100%' }}>
      <Glass style={{ borderRadius: 16, padding: '0 18px', height: 50,
        display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.85)' }}>Identidade Visual</div>
        <div style={{ display: 'flex', gap: 4 }}>
          {TABS.map(t => (
            <Link key={t} href={`/clients/${params.id}/${t}`} style={{ textDecoration: 'none' }}>
              <div style={{
                padding: '5px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                background: t === 'identidade' ? 'rgba(255,255,255,0.08)' : 'transparent',
                color: t === 'identidade' ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.35)',
              }}>{t.charAt(0).toUpperCase() + t.slice(1)}</div>
            </Link>
          ))}
        </div>
      </Glass>
      <Glass style={{ borderRadius: 16, flex: 1, padding: '20px 24px', overflow: 'auto' }}>
        <form onSubmit={handleSave}>
          {([
            { key: 'primary_color' as const, label: 'Cor primária', ph: '#C1FF72' },
            { key: 'secondary_color' as const, label: 'Cor secundária', ph: '#7ED957' },
            { key: 'font' as const, label: 'Fonte', ph: 'Poppins, Inter...' },
            { key: 'logo_url' as const, label: 'URL do logótipo', ph: 'https://...' },
          ]).map(f => (
            <div key={f.key}>
              <label style={labelStyle}>{f.label}</label>
              <input style={fieldStyle} placeholder={f.ph} value={visual[f.key]}
                onChange={e => setVisual(p => ({ ...p, [f.key]: e.target.value }))} />
            </div>
          ))}
          <label style={labelStyle}>Notas adicionais</label>
          <textarea rows={3} style={{ ...fieldStyle, resize: 'vertical' }}
            value={visual.notes}
            onChange={e => setVisual(p => ({ ...p, notes: e.target.value }))} />
          <button type="submit" style={{
            padding: '10px 24px', borderRadius: 12, background: '#C1FF72',
            border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer',
            fontFamily: 'var(--font-poppins), sans-serif', color: '#000',
          }}>{saved ? 'Guardado ✓' : 'Guardar'}</button>
        </form>
      </Glass>
    </div>
  )
}
