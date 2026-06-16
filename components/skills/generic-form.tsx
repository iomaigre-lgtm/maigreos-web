'use client'
import { useState } from 'react'
import { Glass } from '@/components/ui/glass'
import { StreamOutput } from '@/components/output/stream-output'

type Field = {
  key: string
  label: string
  placeholder: string
  rows?: number
  type?: 'text' | 'number'
}

type SkillDef = {
  label: string
  desc: string
  fields: Field[]
}

export const GENERIC_SKILL_CONFIGS: Record<string, SkillDef> = {
  'roteiro-reel': {
    label: 'Roteiro de Reel',
    desc: 'Script para vídeo curto no Instagram ou TikTok',
    fields: [
      { key: 'tema', label: 'Tema do vídeo', placeholder: 'ex: Como automatizámos a prospecção desta agência' },
      { key: 'duracao', label: 'Duração (seg)', placeholder: '60', type: 'number' },
    ],
  },
  'responder-avaliacoes': {
    label: 'Responder Avaliações',
    desc: 'Responde a reviews do Google Maps com o tom da marca',
    fields: [
      { key: 'avaliacao', label: 'Texto da avaliação', placeholder: 'Cola aqui a avaliação do cliente...', rows: 4 },
      { key: 'estrelas', label: 'Classificação (1–5)', placeholder: '5', type: 'number' },
    ],
  },
  'seo': {
    label: 'Optimização SEO',
    desc: 'Texto optimizado para motores de busca',
    fields: [
      { key: 'pagina', label: 'Página / tema', placeholder: 'ex: Página de serviços de limpeza em Lisboa' },
      { key: 'keywords', label: 'Palavras-chave', placeholder: 'ex: limpeza Lisboa, empresa de limpeza' },
    ],
  },
  'relatorio-metricas': {
    label: 'Relatório de Métricas',
    desc: 'Analisa dados e gera insights accionáveis',
    fields: [
      { key: 'dados', label: 'Dados a analisar', placeholder: 'Cola aqui as métricas (alcance, cliques, conversões...)', rows: 5 },
      { key: 'periodo', label: 'Período', placeholder: 'ex: Junho 2026' },
    ],
  },
  'relatorio-ads': {
    label: 'Relatório de Ads',
    desc: 'Análise de performance de campanhas pagas',
    fields: [
      { key: 'dados', label: 'Dados da campanha', placeholder: 'Impressões, cliques, CPC, ROAS...', rows: 5 },
      { key: 'plataforma', label: 'Plataforma', placeholder: 'Google Ads / Meta Ads' },
    ],
  },
  'anuncio-google': {
    label: 'Anúncio Google',
    desc: 'Headlines e descrições para Google Ads',
    fields: [
      { key: 'produto', label: 'Produto / serviço', placeholder: 'ex: Automação de prospecção para agências' },
      { key: 'objetivo', label: 'Objectivo', placeholder: 'ex: Gerar leads qualificados' },
    ],
  },
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

interface Props {
  skillId: string
  clientId?: string
  onClose: () => void
}

export function GenericSkillForm({ skillId, clientId, onClose }: Props) {
  const config = GENERIC_SKILL_CONFIGS[skillId]
  const [values, setValues] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  if (!config) return null

  if (submitted) {
    return (
      <StreamOutput
        skill={skillId}
        input={values}
        clientId={clientId}
        onClose={onClose}
      />
    )
  }

  return (
    <Glass style={{ borderRadius: 20, padding: 28, maxWidth: 440, width: '100%' }}>
      <div style={{ fontSize: 14, fontWeight: 800, color: 'rgba(255,255,255,0.9)', marginBottom: 4 }}>
        {config.label}
      </div>
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: 20 }}>
        {config.desc}
      </div>
      <form onSubmit={e => { e.preventDefault(); setSubmitted(true) }}>
        {config.fields.map(field => (
          <div key={field.key}>
            <label style={labelStyle}>{field.label}</label>
            {field.rows ? (
              <textarea
                style={{ ...inputStyle, resize: 'none' } as React.CSSProperties}
                rows={field.rows}
                placeholder={field.placeholder}
                value={values[field.key] ?? ''}
                onChange={e => setValues(p => ({ ...p, [field.key]: e.target.value }))}
                required
              />
            ) : (
              <input
                style={inputStyle}
                type={field.type === 'number' ? 'number' : 'text'}
                placeholder={field.placeholder}
                value={values[field.key] ?? ''}
                onChange={e => setValues(p => ({ ...p, [field.key]: e.target.value }))}
                required
              />
            )}
          </div>
        ))}
        <button type="submit" style={{
          width: '100%', padding: 12, borderRadius: 12, background: '#C1FF72',
          border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer',
          fontFamily: 'var(--font-poppins), sans-serif', color: '#000',
        }}>
          Gerar →
        </button>
      </form>
    </Glass>
  )
}
