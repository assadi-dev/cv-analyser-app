import { api } from "@/lib/api"
import type { CandidatureSummary, CandidatureStatus } from "@/types"

export const CANDIDATURES_QUERY_KEY = "dashboard-candidatures"

export interface CandidaturesResponse {
  items: CandidatureSummary[]
  total: number
  page: number
  page_size: number
  pages: number
}

export const fetchCandidatures = (): Promise<CandidaturesResponse> =>
  api.get<CandidaturesResponse>("/api/candidatures?page_size=100")

export const patchCandidatureStatus = (
  id: string,
  status: CandidatureStatus
): Promise<void> =>
  api.patch(`/api/candidatures/${id}/status`, { status })
