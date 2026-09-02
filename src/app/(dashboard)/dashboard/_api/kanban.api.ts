import { api } from "@/lib/api"
import type { KanbanBoardResponse } from "@/types"

export const KANBAN_QUERY_KEY = "dashboard-kanban"

/**
 * Reads the whole board in one request.
 *
 * Grouping and ordering are the API's job: it owns the ranks, so deriving the
 * columns client-side from a flat list would mean re-implementing the sort in
 * a second place — and getting it wrong the moment ranks and `created_at`
 * disagree.
 */
export const fetchKanbanBoard = (): Promise<KanbanBoardResponse> =>
  api.get<KanbanBoardResponse>("/api/kanban")
