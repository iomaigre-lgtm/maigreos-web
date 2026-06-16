'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Glass } from '@/components/ui/glass'
import Link from 'next/link'

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '11px 14px', borderRadius: 12, boxSizing: 'border-box',
  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
  color: '#fff', fontSize: 13, fontFamily: 'var(--font-poppins), sans-serif',
  outline: 'none', marginBottom: 16,
}
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 9, fontWeight: 700, textTransform: 'uppercase',
  letterSpacing: '1.5px', color: 'rgba(255,255,255,0.28)', marginBottom: 7,
}

export default function NewClientPage() {
  const [name, setName] = useState('')
  const [industry, setIndustry] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Get or create workspace via service-role API (bypasses RLS)
      const wsRes = await fetch('/api/workspace')
      const { workspaceId, error: wsError } = await wsRes.json()
      if (wsError || !workspaceId) {
        setError('Erro ao obter workspace. Tenta novamente.')
        return
      }

      const { data: client, error: clientError } = await supabase
        .from('clients')
        .insert({ name, industry: industry || null, workspace_id: workspaceId })
        .select().single()

      if (clientError) {
        setError('Erro ao criar cliente: ' + clientError.message)
        return
      }

      await supabase.from('client_context').insert({ client_id: client.id })
      router.push(`/clients/${client.id}/contexto`)
    } catch {
      setError('Erro inesperado. Tenta novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ height: '100%', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 40 }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        <div style={{ marginBottom: 20 }}>
          <Link href="/clients" style={{ fontSize: 11, color: 'rgba(255,255,255,0.28)', textDecoration: 'none' }}>
            ← Clientes
          </Link>
        </div>
        <Glass style={{ borderRadius: 20, padding: 32 }}>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: 'rgba(255,255,255,0.92)', marginBottom: 6, letterSpacing: -0.5 }}>
              Novo cliente
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', lineHeight: 1.5 }}>
              O contexto do cliente vai guiar toda a geração de conteúdo
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <label style={labelStyle}>Nome do cliente *</label>
            <input
              style={inputStyle}
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="ex: Clínica Dental Coimbra"
              required
              autoFocus
            />

            <label style={labelStyle}>Sector / Indústria</label>
            <input
              style={inputStyle}
              value={industry}
              onChange={e => setIndustry(e.target.value)}
              placeholder="ex: Clínica dentária, Agência de marketing, Imobiliária..."
            />

            {error && (
              <div style={{ fontSize: 11, color: '#ff6b6b', marginBottom: 12, padding: '8px 12px',
                background: 'rgba(255,107,107,0.08)', borderRadius: 8, border: '1px solid rgba(255,107,107,0.15)' }}>
                {error}
              </div>
            )}

            <div style={{ display: 'flex', gap: 10 }}>
              <Link href="/clients" style={{
                flex: 1, padding: '11px 0', borderRadius: 12, textAlign: 'center',
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)',
                fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.4)',
                textDecoration: 'none',
              }}>
                Cancelar
              </Link>
              <button type="submit" disabled={loading} style={{
                flex: 2, padding: '11px 0', borderRadius: 12, background: loading ? 'rgba(193,255,114,0.5)' : '#C1FF72',
                border: 'none', fontSize: 12, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'var(--font-poppins), sans-serif', color: '#000',
              }}>
                {loading ? 'A criar...' : 'Criar cliente →'}
              </button>
            </div>
          </form>
        </Glass>
      </div>
    </div>
  )
}
