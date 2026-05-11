import { type Table } from "@tanstack/react-table"
import { cn } from "@/lib/utils"
import type { CandidatureSummary } from "@/types"
import { PAGE_SIZE } from "../../_api/candidatures.api"

interface CandidaturesPaginationProps {
  table: Table<CandidatureSummary>
  total: number
}

export function CandidaturesPagination({ table, total }: CandidaturesPaginationProps) {
  const { pageIndex } = table.getState().pagination
  const page = pageIndex + 1
  const pageCount = table.getPageCount()
  const start = Math.min(pageIndex * PAGE_SIZE + 1, total)
  const end = Math.min(page * PAGE_SIZE, total)
  const pageNumbers = Array.from({ length: pageCount }, (_, i) => i + 1).slice(0, 5)

  return (
    <div
      className="flex items-center gap-3 px-5 h-[52px] border-t"
      style={{ borderColor: "var(--color-border)" }}
    >
      <span className="text-[12px]" style={{ color: "var(--color-text-muted)" }}>
        Affichage {start}–{end} sur {total} candidatures
      </span>
      <div className="flex-1" />

      <button
        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-[8px] text-[12px] border disabled:opacity-40"
        style={{ borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}
        disabled={!table.getCanPreviousPage()}
        onClick={() => table.previousPage()}
      >
        Précédent
      </button>

      {pageNumbers.map((p) => (
        <button
          key={p}
          onClick={() => table.setPageIndex(p - 1)}
          className={cn(
            "w-8 h-8 rounded-[8px] text-[12px] font-semibold transition-colors",
            p === page
              ? "bg-[var(--color-primary)] text-white"
              : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface-muted)]"
          )}
        >
          {p}
        </button>
      ))}

      <button
        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-[8px] text-[12px] border disabled:opacity-40"
        style={{ borderColor: "var(--color-border)", color: "var(--color-text-muted)" }}
        disabled={!table.getCanNextPage()}
        onClick={() => table.nextPage()}
      >
        Suivant
      </button>
    </div>
  )
}
