"use client"

import { useCallback } from "react"
import { useRouter } from "next/navigation"
import type { CandidatureMovePayload } from "@/types"
import { Button } from "@/components/ui/Button"
import { useKanbanBoard, useMoveCandidature } from "../_hooks/useKanbanBoard"
import { useDashboardStats } from "../_hooks/useDashboardStats"
import type { KanbanColumns } from "../_lib/board"
import { StatsSection } from "./StatsSection/StatsSection"
import BoardView from "./Board/BoardView"
import { BoardHeader } from "./Board/BoardHeader"
import { BoardSkeleton } from "./Board/BoardSkeleton"

export function DashboardClient() {
  const router = useRouter()
  const { columns, candidatures, isLoading, isError, refetch } = useKanbanBoard()
  const { mutate: move } = useMoveCandidature()
  const stats = useDashboardStats(candidatures)

  const handleMove = useCallback(
    (id: string, payload: CandidatureMovePayload, board: KanbanColumns) => {
      move({ id, payload, board })
    },
    [move]
  )

  const handleNewAnalysis = useCallback(() => router.push("/analyser"), [router])

  const handleOpenCard = useCallback((_id: string) => {
    // TODO: navigate to candidature detail — no such route yet, same gap as
    // the "voir" action of the /candidatures table.
  }, [])

  return (
    // From `lg` the page is exactly one viewport tall (the layout's <main> has
    // a fixed height): the board takes whatever the stats leave and scrolls
    // inside its columns, so the page itself never grows past the screen.
    <div className="flex flex-col gap-6 p-4 sm:p-8 lg:h-full">
      <StatsSection stats={stats} />

      <div className="flex flex-col gap-4 lg:min-h-[360px] lg:flex-1">
        <BoardHeader
          total={candidatures.length}
          onNewAnalysis={handleNewAnalysis}
        />

        {isError ? (
          // An empty board and an unreachable API look identical once
          // rendered, so the failure has to say so rather than show five
          // empty columns.
          <div className="flex flex-col items-center gap-3 rounded-[12px] border border-dashed border-border px-4 py-12">
            <p className="text-[13px] text-text-muted">
              Le tableau n&apos;a pas pu être chargé.
            </p>
            <Button size="sm" variant="secondary" onClick={() => refetch()}>
              Réessayer
            </Button>
          </div>
        ) : isLoading ? (
          <BoardSkeleton />
        ) : (
          <BoardView
            columns={columns}
            onMove={handleMove}
            onOpenCard={handleOpenCard}
          />
        )}
      </div>
    </div>
  )
}
