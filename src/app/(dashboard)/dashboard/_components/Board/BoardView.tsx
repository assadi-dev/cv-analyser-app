"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import {
  Kanban,
  KanbanBoard,
  KanbanColumn,
  KanbanOverlay,
} from "@/components/ui/kanban"
import { cn } from "@/lib/utils"
import type { CandidatureMovePayload } from "@/types"
import { BOARD_COLUMNS } from "../../_lib/columns.config"
import {
  hasCardMoved,
  resolveMovePayload,
  type KanbanColumns,
} from "../../_lib/board"
import BoardCard from "./BoardCard"
import BoardCardGhost from "./BoardCardGhost"

interface BoardViewProps {
  columns: KanbanColumns
  /**
   * Reports a drop. `board` is the settled state the user is looking at —
   * handed over so the caller can persist it as-is instead of rebuilding the
   * same ordering from the payload.
   */
  onMove?: (
    cardId: string,
    payload: CandidatureMovePayload,
    board: KanbanColumns
  ) => void
  onOpenCard?: (id: string) => void
}

/**
 * The Kanban board.
 *
 * Persistence is derived from the board's final state at drop time, not from
 * Dice UI's `onMove`. `onMove` only fires when a card stays inside its column:
 * a cross-column drop is applied through `onValueChange` during `onDragOver`
 * and never reaches it. Reading the settled state covers both cases with one
 * code path.
 *
 * The drop is handled in an effect rather than inside `onDragEnd` because the
 * component may still emit a final `onValueChange` in the same commit —
 * running after the re-render guarantees we read the state the user sees.
 */
export default function BoardView({
  columns,
  onMove,
  onOpenCard,
}: BoardViewProps) {
  const [board, setBoard] = useState<KanbanColumns>(columns)
  const beforeDragRef = useRef<KanbanColumns>(columns)
  const [droppedCardId, setDroppedCardId] = useState<string | null>(null)

  // The server stays the source of truth: a refetch replaces local state,
  // except mid-drag where it would yank the card out of the user's hand.
  useEffect(() => {
    if (droppedCardId) return
    setBoard(columns)
  }, [columns, droppedCardId])

  useEffect(() => {
    if (!droppedCardId) return
    setDroppedCardId(null)

    if (!hasCardMoved(beforeDragRef.current, board, droppedCardId)) return

    const payload = resolveMovePayload(board, droppedCardId)
    if (payload) onMove?.(droppedCardId, payload, board)
  }, [droppedCardId, board, onMove])

  const handleDragStart = useCallback(() => {
    beforeDragRef.current = board
  }, [board])

  return (
    <Kanban
      value={board}
      onValueChange={setBoard}
      getItemValue={(card) => card.id}
      onDragStart={handleDragStart}
      onDragEnd={(event) => setDroppedCardId(String(event.active.id))}
    >
      <KanbanBoard className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {BOARD_COLUMNS.map((column) => {
          const cards = board[column.status] ?? []
          return (
            <KanbanColumn
              key={column.status}
              value={column.status}
              className={cn(
                "flex min-h-[400px] flex-col gap-2.5 rounded-[12px] p-3",
                column.surface
              )}
            >
              <div className="flex items-center gap-2 pb-1">
                <span
                  className={cn("h-2 w-2 shrink-0 rounded-full", column.dot)}
                  aria-hidden="true"
                />
                <span className={cn("text-[12px] font-bold", column.text)}>
                  {column.label}
                </span>
                <span
                  className={cn(
                    "ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold",
                    column.badge
                  )}
                >
                  {cards.length}
                </span>
              </div>

              {cards.map((card) => (
                <BoardCard key={card.id} card={card} onOpen={onOpenCard} />
              ))}

              {cards.length === 0 && (
                // Keeps the column a visible drop target once it empties out.
                <p className="px-1 py-6 text-center text-[11px] text-slate-400">
                  Déposez une candidature ici
                </p>
              )}
            </KanbanColumn>
          )
        })}
      </KanbanBoard>

      {/*
        Without children KanbanOverlay renders null, so nothing follows the
        cursor and the drag reads as broken even when it works. This is the
        card the user actually drags around.
      */}
      <KanbanOverlay>
        {({ value }) => {
          const card = Object.values(board)
            .flat()
            .find((item) => item.id === String(value))
          return card ? <BoardCardGhost card={card} /> : null
        }}
      </KanbanOverlay>
    </Kanban>
  )
}
