import { Eye, Trash2 } from "lucide-react"
import { StatusBadge } from "@/components/ui/Badge"
import { formatDate } from "@/lib/utils"
import type { CandidatureSummary } from "@/types"
import { TABLE_GRID } from "./CandidaturesTableHeader"

interface CandidaturesTableRowProps {
  item: CandidatureSummary
  index: number
  onDelete: (id: string) => void
  onView: (id: string) => void
}

export function CandidaturesTableRow({ item, index, onDelete, onView }: CandidaturesTableRowProps) {
  return (
    <div
      className="grid h-16 px-5 items-center border-b hover:bg-[var(--color-surface-muted)] transition-colors"
      style={{
        gridTemplateColumns: TABLE_GRID,
        borderColor: "var(--color-border-muted)",
        background: index % 2 === 1 ? "var(--color-surface-muted)" : "white",
      }}
    >
      <div className="flex items-center gap-2.5">
        <div
          className="w-[34px] h-[34px] rounded-[8px] flex items-center justify-center shrink-0 text-[14px] font-bold"
          style={{ background: "var(--color-primary-light)", color: "var(--color-primary)" }}
        >
          {item.company_name[0]?.toUpperCase()}
        </div>
        <div className="min-w-0">
          <p className="text-[13px] font-bold truncate" style={{ color: "var(--color-text-primary)" }}>
            {item.company_name}
          </p>
          <p className="text-[11px] truncate" style={{ color: "var(--color-text-subtle)" }}>
            {item.work_mode}
          </p>
        </div>
      </div>

      <div className="min-w-0">
        <p className="text-[13px] font-medium truncate" style={{ color: "var(--color-text-secondary)" }}>
          {item.job_title}
        </p>
        <p className="text-[11px] truncate" style={{ color: "var(--color-text-subtle)" }}>
          {item.contract_type}
        </p>
      </div>

      <span className="text-[12px]" style={{ color: "var(--color-text-subtle)" }}>—</span>

      <span className="text-[12px]" style={{ color: "var(--color-text-subtle)" }}>—</span>

      <span className="text-[12px]" style={{ color: "var(--color-text-muted)" }}>
        {formatDate(item.created_at)}
      </span>

      <StatusBadge status={item.status} />

      <div className="flex items-center gap-2 justify-center">
        <button
          className="w-7 h-7 rounded-[6px] flex items-center justify-center hover:opacity-80 transition-opacity"
          style={{ background: "var(--color-primary-light)" }}
          onClick={() => onView(item.id)}
          aria-label="Voir"
        >
          <Eye size={13} style={{ color: "var(--color-primary)" }} />
        </button>
        <button
          className="w-7 h-7 rounded-[6px] flex items-center justify-center hover:opacity-80 transition-opacity"
          style={{ background: "var(--color-surface-muted)" }}
          onClick={() => onDelete(item.id)}
          aria-label="Supprimer"
        >
          <Trash2 size={13} style={{ color: "var(--color-text-subtle)" }} />
        </button>
      </div>
    </div>
  )
}
