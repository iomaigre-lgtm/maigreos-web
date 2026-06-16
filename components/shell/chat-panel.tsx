'use client'
import { useState, useRef, useEffect } from 'react'
import { Glass } from '@/components/ui/glass'

type Message = { role: 'user' | 'assistant'; content: string; id: string }

const SUGGESTIONS = [
  'Que skill devo usar para criar conteúdo para Instagram?',
  'Como configuro o contexto do meu cliente?',
  'Gera um carrossel sobre automação para PMEs',
]

export function ChatPanel({ workspaceId, activeClientId }: {
  workspaceId: string
  activeClientId?: string
}) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [hasKey, setHasKey] = useState(true)
  const abortRef = useRef<AbortController | null>(null)
  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function send(text: string) {
    if (!text.trim() || loading) return

    const userMsg: Message = { role: 'user', content: text, id: Date.now().toString() }
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

      if (res.status === 400) {
        const { error } = await res.json()
        setMessages(prev => prev.map(m =>
          m.id === assistantId ? { ...m, content: error ?? 'Chave não configurada.' } : m
        ))
        setHasKey(false)
        return
      }

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
            } catch { /* ignore */ }
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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    send(input)
  }

  return (
    <div className="app-chat-panel">
      <Glass style={{ borderRadius: 16, padding: '11px 14px', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{
            width: 7, height: 7, borderRadius: '50%', background: '#C1FF72',
            boxShadow: '0 0 8px rgba(193,255,114,0.5)', flexShrink: 0,
          }}/>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.85)' }}>Assistente</div>
            <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.22)', letterSpacing: '0.5px' }}>IA contextual · MazyOS</div>
          </div>
        </div>
      </Glass>

      <Glass style={{ borderRadius: 18, flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <div style={{
          height: '100%', overflowY: 'auto', padding: 12,
          display: 'flex', flexDirection: 'column', gap: 8,
        }}>
          {messages.length === 0 && (
            <>
              <div style={{
                padding: '10px 13px', fontSize: 11, lineHeight: 1.6,
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '4px 14px 14px 14px', color: 'rgba(255,255,255,0.5)',
              }}>
                {hasKey
                  ? 'Olá! Posso ajudar a escolher a skill certa, explicar como usar o MazyOS, ou gerar conteúdo directamente.'
                  : 'Para usar o assistente, adiciona a tua Claude API Key em Configurações.'
                }
              </div>
              {hasKey && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 4 }}>
                  {SUGGESTIONS.map(s => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      style={{
                        textAlign: 'left', padding: '8px 11px', borderRadius: 10, cursor: 'pointer',
                        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                        fontSize: 10, color: 'rgba(255,255,255,0.38)', fontFamily: 'inherit',
                        lineHeight: 1.4,
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
          {messages.map(m => (
            <div key={m.id} style={{
              padding: '9px 12px', fontSize: 11, lineHeight: 1.6, maxWidth: '90%',
              alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
              background: m.role === 'user' ? 'rgba(193,255,114,0.08)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${m.role === 'user' ? 'rgba(193,255,114,0.14)' : 'rgba(255,255,255,0.07)'}`,
              color: m.role === 'user' ? 'rgba(193,255,114,0.88)' : 'rgba(255,255,255,0.62)',
              borderRadius: m.role === 'user' ? '14px 4px 14px 14px' : '4px 14px 14px 14px',
              whiteSpace: 'pre-wrap',
            }}>
              {m.content}
              {loading && m.role === 'assistant' && m.content === '' && (
                <span style={{ color: '#C1FF72', opacity: 0.5, animation: 'pulse 1s infinite' }}>▋</span>
              )}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </Glass>

      <Glass style={{ borderRadius: 16, padding: '10px 12px', flexShrink: 0 }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Pergunta ou pede algo..."
            disabled={loading}
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              fontSize: 11, color: 'rgba(255,255,255,0.65)',
              fontFamily: 'var(--font-poppins), sans-serif',
            }}
          />
          <button type="submit" disabled={loading || !input.trim()} style={{
            width: 26, height: 26, background: input.trim() ? '#C1FF72' : 'rgba(255,255,255,0.08)',
            border: 'none', borderRadius: 8, cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, fontSize: 13, fontWeight: 900, color: input.trim() ? '#000' : 'rgba(255,255,255,0.2)',
            transition: 'all 0.15s',
            opacity: loading ? 0.5 : 1,
          }}>↑</button>
        </form>
      </Glass>
    </div>
  )
}
