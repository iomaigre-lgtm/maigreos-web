'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/auth/callback` },
    })
    setSent(true)
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#111111',
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 24,
        padding: '40px 36px',
        width: 360,
        boxShadow: 'inset 1px 1px 0 rgba(255,255,255,0.1), 0 8px 32px rgba(0,0,0,0.5)',
      }}>
        <div style={{ fontFamily: 'var(--font-poppins), sans-serif', color: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 9, background: '#C1FF72',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 900, color: '#000',
            }}>M</div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800 }}>MazyOS Web</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>by Maigre IA</div>
            </div>
          </div>
          {sent ? (
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.8)', marginBottom: 8 }}>
                Link enviado ✓
              </div>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>
                Verifica o teu email — enviámos o link de acesso. Podes fechar esta janela.
              </p>
            </div>
          ) : (
            <form onSubmit={handleLogin}>
              <label style={{
                display: 'block', fontSize: 10, fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '1.2px',
                color: 'rgba(255,255,255,0.35)', marginBottom: 8,
              }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="o-teu@email.com"
                required
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: 12,
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  color: '#fff', fontSize: 13,
                  fontFamily: 'var(--font-poppins), sans-serif',
                  outline: 'none', marginBottom: 14, boxSizing: 'border-box',
                }}
              />
              <button type="submit" style={{
                width: '100%', padding: '11px', borderRadius: 12,
                background: '#C1FF72', border: 'none', fontSize: 13, fontWeight: 700,
                fontFamily: 'var(--font-poppins), sans-serif', cursor: 'pointer',
                color: '#000',
              }}>
                Entrar com email
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
