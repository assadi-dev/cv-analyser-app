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
  contacts?: { name: string; contact_type: ContactType; value: string }[]
}

export const CANDIDATURES_QUERY_KEY = "candidatures"
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
