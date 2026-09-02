"use client"

import { useMemo } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { CandidatureMovePayload, KanbanBoardResponse } from "@/types"
import { logError } from "@/lib/logger"
import { useToast } from "@/hooks/useToast"
import { CANDIDATURES_QUERY_KEY } from "@/app/(dashboard)/candidatures/_api/candidatures.api"
import { KANBAN_QUERY_KEY, fetchKanbanBoard } from "../_api/kanban.api"
import { moveCandidature } from "../_api/candidatures.api"
import { BOARD_COLUMNS } from "../_lib/columns.config"
import { syncCardStatuses, type KanbanColumns } from "../_lib/board"

/**
 * Board rendered before the first response lands.
 *
 * A module constant, not an inline literal: a fresh object on every render
 * would break the memo below and re-run every consumer that depends on it.
 */
const EMPTY_BOARD: KanbanColumns = Object.fromEntries(
  BOARD_COLUMNS.map((column) => [column.status, []])
)

export function useKanbanBoard() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [KANBAN_QUERY_KEY],
    queryFn: fetchKanbanBoard,
  })

  const columns = data?.columns ?? EMPTY_BOARD

  // Flattened once for the counters, in column order. Recomputing it inside
  // each consumer would hand `useDashboardStats` a new array every render.
  const candidatures = useMemo(
    () => BOARD_COLUMNS.flatMap((column) => columns[column.status] ?? []),
    [columns]
  )

  return { columns, candidatures, isLoading, isError, refetch }
}

interface MoveVariables {
  id: string
  payload: CandidatureMovePayload
  /** The board as the user sees it right after the drop. */
  board: KanbanColumns
}

/**
 * Persists a drop.
 *
 * The optimistic state is the board itself rather than a recomputation from
 * the payload: the view has already applied the move, and re-deriving it here
 * from `before_id`/`after_id` would be a second implementation of the same
 * ordering — free to drift from the first.
 *
 * Writing it into the cache matters beyond the round trip. The view mirrors
 * `columns` back into local state, so a cache still holding the old order
 * would snap the card back under the user's cursor the moment anything
 * re-renders.
 */
export function useMoveCandidature() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: ({ id, payload }: MoveVariables) => moveCandidature(id, payload),

    onMutate: async ({ board }: MoveVariables) => {
      // Stops an in-flight refetch from landing after this write and
      // resurrecting the pre-drop order.
      await queryClient.cancelQueries({ queryKey: [KANBAN_QUERY_KEY] })

      const previous = queryClient.getQueryData<KanbanBoardResponse>([
        KANBAN_QUERY_KEY,
      ])

      queryClient.setQueryData<KanbanBoardResponse>(
        [KANBAN_QUERY_KEY],
        (old) => ({ ...old, columns: syncCardStatuses(board) })
      )

      return { previous }
    },

    onError: (error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData([KANBAN_QUERY_KEY], context.previous)
      }
      logError(error, "useMoveCandidature")
      toast.error("Impossible de déplacer la candidature")
    },

    onSettled: () => {
      // Both caches, because both show a status the move just changed: the
      // board here, and the table on /candidatures. Invalidating only this one
      // leaves the table showing the previous column until its own refetch.
      queryClient.invalidateQueries({ queryKey: [KANBAN_QUERY_KEY] })
      queryClient.invalidateQueries({ queryKey: [CANDIDATURES_QUERY_KEY] })
    },
  })
}
