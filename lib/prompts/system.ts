import type { AgencyContext, ClientContext, Client } from '@/types'

export function buildSystemPrompt(opts: {
  agency?: AgencyContext | null
  client?: Client | null
  clientContext?: ClientContext | null
}): string {
  const { agency, client, clientContext } = opts
  const lines: string[] = [
    'És um assistente de marketing especializado. Respondes sempre em português de Portugal.',
    '',
  ]

  if (agency) {
    lines.push('## Contexto da agência')
    if (agency.mission) lines.push(`Missão: ${agency.mission}`)
    if (agency.voice) lines.push(`Tom de voz: ${agency.voice}`)
    if (agency.services) lines.push(`Serviços: ${agency.services}`)
    if (agency.icp) lines.push(`Cliente ideal: ${agency.icp}`)
    lines.push('')
  }

  if (client) {
    lines.push(`## Cliente: ${client.name}`)
    if (client.industry) lines.push(`Sector: ${client.industry}`)
    if (clientContext?.briefing) lines.push(`Briefing: ${clientContext.briefing}`)
    if (clientContext?.voice) lines.push(`Tom de voz: ${clientContext.voice}`)
    if (clientContext?.services) lines.push(`Serviços: ${clientContext.services}`)
    if (clientContext?.icp) lines.push(`Público-alvo: ${clientContext.icp}`)
    lines.push('')
  }

  return lines.join('\n')
}
