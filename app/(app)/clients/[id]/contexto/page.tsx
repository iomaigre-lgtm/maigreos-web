'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Glass } from '@/components/ui/glass'
import Link from 'next/link'
import type { Client, ClientContext } from '@/types'

const fieldStyle: React.CSSProperties = {
  width: '100%', padding: '10px 14px', borderRadius: 12, boxSizing: 'border-box',
  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
  color: '#fff', fontSize: 12, fontFamily: 'var(--font-poppins), sans-serif',
  outline: 'none', marginBottom: 12, resize: 'vertical',
}
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
  letterSpacing: '1.2px', color: 'rgba(255,255,255,0.3)', marginBottom: 6,
}

const TABS = ['contexto', 'identidade', 'historico'] as const

export default function ClientContextoPage({ params }: { params: { id: string } }) {
  const [client, setClient] = useState<Client | null>(null)
  const [ctx, setCtx] = useState<Partial<ClientContext>>({})
  const [saved, setSaved] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    supabase.from('clients').select('*').eq('id', params.id).single()
      .then(({ data }) => { if (data) setClient(data as Client) })
    supabase.from('client_context').select('*').eq('client_id', params.id).single()
      .then(({ data }) => { if (data) setCtx(data as Partial<ClientContext>) })
  }, [params.id])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    await supabase.from('client_context').upsert({ ...ctx, client_id: params.id })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, height: '100%' }}>
      <Glass style={{ borderRadius: 16, padding: '0 18px', height: 50,
        display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.85)' }}>
          {client?.name ?? '...'}
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {TABS.map(t => (
            <Link key={t} href={`/clients/${params.id}/${t}`} style={{ textDecoration: 'none' }}>
              <div style={{
                padding: '5px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600,
                background: t === 'contexto' ? 'rgba(255,255,255,0.08)' : 'transparent',
                color: t === 'contexto' ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.35)',
              }}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </div>
            </Link>
          ))}
        </div>
      </Glass>
      <Glass style={{ borderRadius: 16, flex: 1, padding: '20px 24px', overflow: 'auto' }}>
        <form onSubmit={handleSave}>
          {([
            { key: 'briefing', label: 'Briefing / Quem são', rows: 3 },
            { key: 'voice', label: 'Tom de voz', rows: 2 },
            { key: 'services', label: 'Serviços / Produtos', rows: 2 },
            { key: 'icp', label: 'Cliente ideal (ICP)', rows: 2 },
          ] as const).map(f => (
            <div key={f.key}>
              <label style={labelStyle}>{f.label}</label>
              <textarea
                rows={f.rows}
                style={fieldStyle as React.CSSProperties}
                value={(ctx as Record<string, string>)[f.key] ?? ''}
                onChange={e => setCtx(prev => ({ ...prev, [f.key]: e.target.value }))}
              />
            </div>
          ))}
          <button type="submit" style={{
            padding: '10px 24px', borderRadius: 12, background: '#C1FF72',
            border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer',
            fontFamily: 'var(--font-poppins), sans-serif', color: '#000',
          }}>
            {saved ? 'Guardado ✓' : 'Guardar'}
          </button>
        </form>
      </Glass>
    </div>
  )
}
