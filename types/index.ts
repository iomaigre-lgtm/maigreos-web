export type Workspace = {
  id: string
  name: string
  slug: string
  created_at: string
}

export type Client = {
  id: string
  workspace_id: string
  name: string
  industry: string | null
  created_at: string
}

export type ClientContext = {
  client_id: string
  briefing: string | null
  voice: string | null
  services: string | null
  icp: string | null
  visual_identity: {
    primary_color?: string
    secondary_color?: string
    font?: string
    logo_url?: string
    notes?: string
  }
}

export type AgencyContext = {
  workspace_id: string
  mission: string | null
  voice: string | null
  services: string | null
  icp: string | null
}

export type Generation = {
  id: string
  workspace_id: string
  client_id: string | null
  skill: string
  input: Record<string, unknown>
  output: string
  created_at: string
}

export type SkillId =
  | 'carrossel'
  | 'email-profissional'
  | 'relatorio-metricas'
  | 'responder-avaliacoes'
  | 'seo'
  | 'relatorio-ads'
  | 'anuncio-google'
  | 'roteiro-reel'
