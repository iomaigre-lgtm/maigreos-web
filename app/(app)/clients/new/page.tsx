'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Glass } from '@/components/ui/glass'

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

export default function NewClientPage() {
  const [name, setName] = useState('')
  const [industry, setIndustry] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const { data: member } = await supabase.from('workspace_members').select('workspace_id').single()
    if (!member) { setLoading(false); return }
    const { data: client } = await supabase
      .from('clients')
      .insert({ name, industry: industry || null, workspace_id: member.workspace_id })
      .select().single()
    if (client) {
      await supabase.from('client_context').insert({ client_id: client.id })
      router.push(`/clients/${client.id}/contexto`)
    }
    setLoading(false)
  }

  return (
    <div style={{ padding: 24 }}>
      <Glass style={{ borderRadius: 20, padding: 32, maxWidth: 480 }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: 'rgba(255,255,255,0.9)', marginBottom: 24 }}>
          Novo cliente
        </div>
        <form onSubmit={handleSubmit}>
          <label style={labelStyle}>Nome do cliente</label>
          <input style={inputStyle} value={name} onChange={e => setName(e.target.value)}
            placeholder="ex: Dental Coimbra" required />
          <label style={labelStyle}>Sector / Indústria</label>
          <input style={inputStyle} value={industry} onChange={e => setIndustry(e.target.value)}
            placeholder="ex: Clínica dentária" />
          <button type="submit" disabled={loading} style={{
            width: '100%', padding: 12, borderRadius: 12, background: '#C1FF72',
            border: 'none', fontSize: 12, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: 'var(--font-poppins), sans-serif', opacity: loading ? 0.7 : 1, color: '#000',
          }}>
            {loading ? 'A criar...' : 'Criar cliente'}
          </button>
        </form>
      </Glass>
    </div>
  )
}
