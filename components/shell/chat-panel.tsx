'use client'
import { useState, useRef } from 'react'
import { Glass } from '@/components/ui/glass'

type Message = { role: 'user' | 'assistant'; content: string; id: string }

export function ChatPanel({ workspaceId, activeClientId }: {
  workspaceId: string
  activeClientId?: string
}) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMsg: Message = { role: 'user', content: input, id: Date.now().toString() }
    const allMessages = [...messages, userMsg]
    setMessages(allMessages)
    setInput('')
    setLoading(true)

    const ctrl = new AbortController()
    abortRef.current = ctrl
    const assistantId = (Date.now() + 1).toString()
    setMessages(prev => [...prev, { role: 'assistant', content: '', id: assistantId }])

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: allMessages.map(m => ({ role: m.role, content: m.content })),
          workspaceId,
          activeClientId,
        }),
        signal: ctrl.signal,
      })

      if (!res.ok || !res.body) {
        setMessages(prev => prev.map(m =>
          m.id === assistantId ? { ...m, content: 'Erro ao obter resposta.' } : m
        ))
        return
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        for (const line of chunk.split('\n')) {
          if (line.startsWith('0:')) {
            try {
              accumulated += JSON.parse(line.slice(2))
              setMessages(prev => prev.map(m =>
                m.id === assistantId ? { ...m, content: accumulated } : m
              ))
            } catch {}
          }
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setMessages(prev => prev.map(m =>
          m.id === assistantId ? { ...m, content: 'Erro de ligação.' } : m
        ))
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ width: 260, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 8, height: '100%' }}>
      <Glass style={{ borderRadius: 16, padding: '12px 14px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{
            width: 6, height: 6, borderRadius: '50%', background: '#C1FF72',
            boxShadow: '0 0 6px rgba(193,255,114,0.6)', flexShrink: 0,
          }}/>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.85)' }}>Assistente</div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)' }}>IA contextual</div>
          </div>
        </div>
      </Glass>

      <Glass style={{ borderRadius: 18, flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <div style={{
          height: '100%', overflowY: 'auto', padding: 14,
          display: 'flex', flexDirection: 'column', gap: 10,
        }}>
          {messages.length === 0 && (
            <div style={{
              padding: '10px 13px', fontSize: 11, lineHeight: 1.55,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '4px 14px 14px 14px',
              color: 'rgba(255,255,255,0.55)',
            }}>
              Selecciona um cliente ou pede directamente — carrossel, relatório, email...
            </div>
          )}
          {messages.map(m => (
            <div key={m.id} style={{
              padding: '10px 13px', fontSize: 11, lineHeight: 1.55, maxWidth: '88%',
              alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
              background: m.role === 'user' ? 'rgba(193,255,114,0.07)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${m.role === 'user' ? 'rgba(193,255,114,0.15)' : 'rgba(255,255,255,0.08)'}`,
              color: m.role === 'user' ? 'rgba(193,255,114,0.9)' : 'rgba(255,255,255,0.65)',
              borderRadius: m.role === 'user' ? '14px 4px 14px 14px' : '4px 14px 14px 14px',
              whiteSpace: 'pre-wrap',
            }}>
              {m.content}
              {loading && m.role === 'assistant' && m.content === '' && (
                <span style={{ color: '#C1FF72', opacity: 0.6 }}>▋</span>
              )}
            </div>
          ))}
        </div>
      </Glass>

      <Glass style={{ borderRadius: 16, padding: '10px 12px', flexShrink: 0 }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Pede o que precisas..."
            disabled={loading}
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              fontSize: 11, color: 'rgba(255,255,255,0.6)',
              fontFamily: 'var(--font-poppins), sans-serif',
            }}
          />
          <button type="submit" disabled={loading || !input.trim()} style={{
            width: 26, height: 26, background: '#C1FF72', border: 'none', borderRadius: 8,
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, fontSize: 14, fontWeight: 700, color: '#000',
            boxShadow: '0 2px 8px rgba(193,255,114,0.2)',
            opacity: loading ? 0.5 : 1,
          }}>↑</button>
        </form>
      </Glass>
    </div>
  )
}
