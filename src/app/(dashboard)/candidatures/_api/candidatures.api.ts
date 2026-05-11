import { api } from "@/lib/api"
import type { CandidatureSummary, CandidatureStatus, PaginatedResponse } from "@/types"

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

export const deleteCandidature = (id: string): Promise<void> =>
  api.delete(`/api/candidatures/${id}`)
