import { cn } from "@/lib/utils"
import { PAGE_SIZE } from "../../_api/candidatures.api"

interface CandidaturesPaginationProps {
  page: number
  total: number
  onPageChange: (page: number) => void
}

export function CandidaturesPagination({
  page,
  total,
  onPageChange,
}: CandidaturesPaginationProps) {
  const totalPages = Math.ceil(total / PAGE_SIZE)
  const start = Math.min((page - 1) * PAGE_SIZE + 1, total)
  const end = Math.min(page * PAGE_SIZE, total)
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 5)

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
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        Précédent
      </button>

      {pageNumbers.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
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
        disabled={page * PAGE_SIZE >= total}
        onClick={() => onPageChange(page + 1)}
      >
        Suivant
      </button>
    </div>
  )
}
