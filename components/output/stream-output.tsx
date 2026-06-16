'use client'
import { useState, useRef, useEffect } from 'react'
import { Glass } from '@/components/ui/glass'

interface StreamOutputProps {
  skill: string
  input: Record<string, string>
  clientId?: string
  onClose: () => void
}

export function StreamOutput({ skill, input, clientId, onClose }: StreamOutputProps) {
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    const ctrl = new AbortController()
    abortRef.current = ctrl

    async function run() {
      try {
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ skill, input, clientId }),
          signal: ctrl.signal,
        })
        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: 'Erro desconhecido' }))
          setOutput(err.error ?? 'Erro ao gerar conteúdo.')
          setLoading(false)
          return
        }
        const reader = res.body?.getReader()
        if (!reader) return
        const decoder = new TextDecoder()
        let accumulated = ''
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = decoder.decode(value, { stream: true })
          // Vercel AI SDK text stream: lines prefixed with "0:" contain text chunks
          for (const line of chunk.split('\n')) {
            if (line.startsWith('0:')) {
              try {
                const text = JSON.parse(line.slice(2))
                accumulated += text
                setOutput(accumulated)
              } catch {}
            }
          }
        }
      } catch (e: unknown) {
        if (e instanceof Error && e.name !== 'AbortError') {
          setOutput('Erro de ligação. Tenta novamente.')
        }
      } finally {
        setLoading(false)
      }
    }

    run()
    return () => ctrl.abort()
  }, [skill, input, clientId])

  function copyToClipboard() {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, height: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)',
          textTransform: 'uppercase', letterSpacing: '1.5px' }}>
          {loading ? 'A gerar...' : 'Pronto'}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {!loading && output && (
            <button onClick={copyToClipboard} style={{
              padding: '6px 14px', borderRadius: 20, background: copied ? 'rgba(193,255,114,0.15)' : 'rgba(255,255,255,0.07)',
              border: '1px solid ' + (copied ? 'rgba(193,255,114,0.3)' : 'rgba(255,255,255,0.1)'),
              color: copied ? '#C1FF72' : 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'var(--font-poppins), sans-serif',
            }}>
              {copied ? 'Copiado ✓' : 'Copiar'}
            </button>
          )}
          <button onClick={onClose} style={{
            padding: '6px 14px', borderRadius: 20, background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            color: 'rgba(255,255,255,0.4)', fontSize: 11, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'var(--font-poppins), sans-serif',
          }}>
            Fechar
          </button>
        </div>
      </div>

      {/* Output */}
      <Glass style={{ borderRadius: 16, flex: 1, padding: '18px 20px', overflow: 'auto', minHeight: 0 }}>
        {loading && !output && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,0.3)', fontSize: 12 }}>
            <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%',
              background: '#C1FF72', animation: 'pulse 1s infinite' }} />
            A gerar conteúdo...
          </div>
        )}
        <pre style={{
          margin: 0, fontFamily: 'var(--font-poppins), sans-serif',
          fontSize: 12, lineHeight: 1.7, color: 'rgba(255,255,255,0.8)',
          whiteSpace: 'pre-wrap', wordBreak: 'break-word',
        }}>
          {output}
          {loading && output && <span style={{ animation: 'blink 0.8s infinite', color: '#C1FF72' }}>▋</span>}
        </pre>
      </Glass>
    </div>
  )
}
