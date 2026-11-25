"use client"

import type { CandidatureSummary } from "@/types"
import { useCandidaturesTable } from "../../_hooks/useCandidaturesTable"
import { CandidaturesTableHeader } from "./CandidaturesTableHeader"
import { CandidaturesTableRow } from "./CandidaturesTableRow"
import { CandidaturesTableSkeleton } from "./CandidaturesTableSkeleton"
import { CandidaturesEmptyState } from "./CandidaturesEmptyState"
import { CandidaturesPagination } from "./CandidaturesPagination"

interface CandidaturesTableProps {
  items: CandidatureSummary[]
  isLoading: boolean
  page: number
  total: number
  onPageChange: (page: number) => void
  onDelete: (id: string) => void
  onView: (id: string) => void
  onEdit: (id: string) => void
  onAnalyse: (id: string) => void
}

export function CandidaturesTable({
  items,
  isLoading,
  page,
  total,
  onPageChange,
  onDelete,
  onView,
  onEdit,
  onAnalyse,
}: CandidaturesTableProps) {
  const table = useCandidaturesTable({
    data: items,
    total,
    page,
    onPageChange,
    onDelete,
    onView,
    onEdit,
    onAnalyse,
  })

  return (
    // flex-1: the card takes the height the page leaves, whatever the row count.
    <div
      className="flex min-h-[280px] flex-1 flex-col overflow-hidden rounded-[14px] border shadow-[var(--shadow-card)]"
      style={{ borderColor: "var(--color-border)", background: "white" }}
    >
      {/*
        One scroll area for the header and the rows: the header sticks to its
        top while the rows scroll, and the pagination stays below it. The
        min-width keeps the columns readable on a narrow screen, where the
        area scrolls sideways instead of clipping them.
      */}
      <div className="min-h-0 flex-1 overflow-auto">
        <div className="min-w-[1100px]">
          <CandidaturesTableHeader headerGroups={table.getHeaderGroups()} />

          {isLoading ? (
            <CandidaturesTableSkeleton />
          ) : items.length === 0 ? (
            <CandidaturesEmptyState />
          ) : (
            items.map((item, i) => (
              <CandidaturesTableRow
                key={item.id}
                item={item}
                index={i}
                onDelete={onDelete}
                onView={onView}
                onEdit={onEdit}
                onAnalyse={onAnalyse}
              />
            ))
          )}
        </div>
      </div>

      <CandidaturesPagination table={table} total={total} />
    </div>
  )
}
