import { api } from "@/lib/api"
import type {
  CandidatureSummary,
  CandidatureStatus,
  CandidatureMovePayload,
  CandidatureMoveResponse,
} from "@/types"

/**
 * Changes the column of a candidature without choosing a rank.
 *
 * The path is singular: `candidature/` covers operations on one resource,
 * `candidatures/` the list. It used to point at the plural form, where no
 * route existed — every call 404'd and silently rolled back its optimistic
 * update.
 *
 * Currently without a caller: the dashboard moves cards by drag & drop, and
 * the /candidatures table has no status control yet. Kept because that table
 * is the one place a status still has to be changed without a board.
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
