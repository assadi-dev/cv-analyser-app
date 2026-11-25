import { api } from "@/lib/api"
import type {
  CandidatureSummary,
  CandidatureStatus,
  ContractType,
  WorkMode,
  ContactType,
  PaginatedResponse,
} from "@/types"

export interface CreateCandidaturePayload {
  company_name: string
  company_city?: string | null
  job_title: string
  contract_type: ContractType
  work_mode: WorkMode
  source_platform?: string | null
  source_name?: string | null
  source_url?: string | null
  status: CandidatureStatus
  notes?: string | null
  cv_id?: string | null
  /** Required: it is what the candidature's analyses are pre-filled from. */
  job_description: string
  contacts?: { name: string; contact_type: ContactType; value: string }[]
}

/**
 * Partial update: a field that is absent is left as it is, and `null` clears
 * an optional one. Mirrors the API's `CandidatureUpdate`.
 */
export interface UpdateCandidaturePayload {
  company_name?: string
  company_city?: string | null
  job_title?: string
  contract_type?: ContractType
  work_mode?: WorkMode
  source_platform?: string | null
  source_url?: string | null
  job_description?: string | null
  cv_id?: string | null
  status?: CandidatureStatus
  notes?: string | null
  /** Replaces the whole contact list when present; leave out to keep it. */
  contacts?: { name: string; contact_type: ContactType; value: string }[]
}

export const CANDIDATURES_QUERY_KEY = "candidatures"
/** One candidature, read in full — the list rows do not carry the job description. */
export const CANDIDATURE_QUERY_KEY = "candidature"
export const PAGE_SIZE = 10

export interface FetchCandidaturesParams {
  page: number
  status: CandidatureStatus | "all"
}

export const fetchCandidatures = ({
  page,
  status,
}: FetchCandidaturesParams): Promise<PaginatedResponse<CandidatureSummary>> => {
  const params = new URLSearchParams({
    page: String(page),
    page_size: String(PAGE_SIZE),
    ...(status !== "all" ? { status } : {}),
  })
  return api.get<PaginatedResponse<CandidatureSummary>>(`/api/candidatures?${params}`)
}

export const deleteCandidature = (ids: string[]): Promise<void> =>
  api.delete(`/api/candidature`, { ids })

export const createCandidature = (
  payload: CreateCandidaturePayload
): Promise<CandidatureSummary> =>
  api.post<CandidatureSummary>("/api/candidature", payload)

export const updateCandidature = (
  id: string,
  payload: UpdateCandidaturePayload
): Promise<CandidatureSummary> =>
  api.patch<CandidatureSummary>(`/api/candidature/${id}`, payload)

export const fetchCandidature = (id: string): Promise<CandidatureSummary> =>
  api.get<CandidatureSummary>(`/api/candidature/${id}`)
