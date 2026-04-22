// ─────────────────────────────────────────────────────────────────────────────
// Shared TypeScript types for the Job Optimizer application
// ─────────────────────────────────────────────────────────────────────────────

// ─── Auth ────────────────────────────────────────────────────────────────────

export interface User {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  professional_title: string | null
  avatar_url: string | null
  auth_provider: string
  ai_provider: AIProvider
  ai_model: string
  preferred_language: "fr" | "en"
  ats_threshold: number
  recommendation_detail: "concise" | "detailed"
  is_active: boolean
  created_at: string
  updated_at: string
}

// ─── AI Providers ────────────────────────────────────────────────────────────

export type AIProvider = "openai" | "anthropic" | "groq" | "mistral" | "openrouter" | "ollama"

// ─── CV ──────────────────────────────────────────────────────────────────────

export interface CV {
  id: string
  user_id: string
  name: string
  file_size_kb: number
  mime_type: string
  is_default: boolean
  created_at: string
  updated_at: string
}

// ─── Candidature ─────────────────────────────────────────────────────────────

export type CandidatureStatus = "to_send" | "sent" | "interview" | "rejected" | "accepted"
export type ContractType = "CDI" | "CDD" | "Freelance" | "Stage" | "Alternance"
export type WorkMode = "remote" | "hybrid" | "on-site"
export type ContactType = "email" | "phone"

export interface Contact {
  id: string
  candidature_id: string
  name: string
  contact_type: ContactType
  value: string
  created_at: string
  updated_at: string
}

export interface Candidature {
  id: string
  user_id: string
  cv_id: string | null
  company_name: string
  company_city: string | null
  job_title: string
  contract_type: ContractType
  work_mode: WorkMode
  source_platform: string | null
  source_name: string | null
  source_url: string | null
  status: CandidatureStatus
  notes: string | null
  contacts: Contact[]
  created_at: string
  updated_at: string
}

export interface CandidatureSummary {
  id: string
  company_name: string
  job_title: string
  status: CandidatureStatus
  contract_type: ContractType
  work_mode: WorkMode
  source_platform: string | null
  created_at: string
  updated_at: string
}

// ─── Analyse ─────────────────────────────────────────────────────────────────

export type RecommendationType = "warning" | "success" | "info"
export type RecommendationImpact = "high" | "medium" | "low"

export interface Recommendation {
  type: RecommendationType
  title: string
  description: string
  impact: RecommendationImpact
}

export interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

export interface Analyse {
  id: string
  candidature_id: string
  cv_id: string | null
  score_global: number
  score_ats: number
  score_competences: number
  score_experience: number
  keywords_found: string[]
  keywords_missing: string[]
  recommandations: Recommendation[]
  chat_history: ChatMessage[]
  ai_provider: string
  ai_model: string
  created_at: string
  updated_at: string
}

// ─── SSE Events ──────────────────────────────────────────────────────────────

export type SSEEventType = "progress" | "result" | "error" | "done"
export type AnalyseStep = "parsing" | "ats" | "scoring" | "recommendations"

export interface SSEProgressEvent {
  type: "progress"
  step: AnalyseStep
  progress: number
  data: Record<string, unknown>
}

export interface SSEResultEvent {
  type: "result"
  score_global: number
  score_ats: number
  score_competences: number
  score_experience: number
  keywords_found: string[]
  keywords_missing: string[]
  recommandations: Recommendation[]
}

export interface SSEErrorEvent {
  type: "error"
  message: string
  error_code: string
}

export interface SSEDoneEvent {
  type: "done"
  analyse_id: string
}

export type SSEEvent = SSEProgressEvent | SSEResultEvent | SSEErrorEvent | SSEDoneEvent

// ─── API responses ───────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  page_size: number
  pages: number
}

export interface ApiError {
  error: {
    code: string
    message: string
    context: Record<string, unknown>
  }
  request_id: string
}
