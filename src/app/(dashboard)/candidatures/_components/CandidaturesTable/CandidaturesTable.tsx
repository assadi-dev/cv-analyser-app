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
}

export function CandidaturesTable({
  items,
  isLoading,
  page,
  total,
  onPageChange,
  onDelete,
  onView,
}: CandidaturesTableProps) {
  const table = useCandidaturesTable({
    data: items,
    total,
    page,
    onPageChange,
    onDelete,
    onView,
  })

  const rows = table.getRowModel().rows

  return (
    <div
      className="rounded-[14px] border overflow-hidden shadow-[var(--shadow-card)]"
      style={{ borderColor: "var(--color-border)", background: "white" }}
    >
      <CandidaturesTableHeader headerGroups={table.getHeaderGroups()} />

      {isLoading ? (
        <CandidaturesTableSkeleton />
      ) : rows.length === 0 ? (
        <CandidaturesEmptyState />
      ) : (
        rows.map((row, i) => (
          <CandidaturesTableRow key={row.id} row={row} index={i} />
        ))
      )}

      <CandidaturesPagination table={table} total={total} />
    </div>
  )
}
