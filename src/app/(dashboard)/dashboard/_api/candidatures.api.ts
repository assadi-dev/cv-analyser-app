import { api } from "@/lib/api"
import type {
  CandidatureSummary,
  CandidatureStatus,
  CandidatureMovePayload,
  CandidatureMoveResponse,
} from "@/types"

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

/**
 * Changes the column of a candidature without choosing a rank.
 *
 * The path is singular: `candidature/` covers operations on one resource,
 * `candidatures/` the list. It used to point at the plural form, where no
 * route existed — every call 404'd and silently rolled back its optimistic
 * update.
 */
export const patchCandidatureStatus = (
  id: string,
  status: CandidatureStatus
): Promise<CandidatureSummary> =>
  api.patch<CandidatureSummary>(`/api/candidature/${id}/status`, { status })

/**
 * Moves a candidature on the board, at an explicit rank.
 *
 * Sends the cards framing the drop point rather than a position — the server
 * reads their live ranks, so a stale cache cannot reorder the column wrongly.
 */
export const moveCandidature = (
  id: string,
  payload: CandidatureMovePayload
): Promise<CandidatureMoveResponse> =>
  api.patch<CandidatureMoveResponse>(`/api/candidature/${id}/move`, payload)
