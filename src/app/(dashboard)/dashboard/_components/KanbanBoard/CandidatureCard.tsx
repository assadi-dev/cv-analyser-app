import { formatDate } from "@/lib/utils"
import type { CandidatureSummary, CandidatureStatus } from "@/types"

interface CandidatureCardProps {
  item: CandidatureSummary
  onStatusChange: (id: string, status: CandidatureStatus) => void
}

export function CandidatureCard({ item, onStatusChange }: CandidatureCardProps) {
  return (
    <div
      className="flex flex-col gap-2 p-3 rounded-[10px] bg-white border cursor-pointer hover:shadow-md transition-shadow"
      style={{ borderColor: "var(--color-border)" }}
    >
      <div className="flex items-center gap-2">
        <div
          className="w-[30px] h-[30px] rounded-[6px] flex items-center justify-center shrink-0 text-[13px] font-bold"
          style={{
            background: "var(--color-primary-light)",
            color: "var(--color-primary)",
          }}
        >
          {item.company_name[0]?.toUpperCase()}
        </div>
        <div className="min-w-0">
          <p
            className="text-[12px] font-bold truncate"
            style={{ color: "var(--color-text-primary)" }}
          >
            {item.company_name}
          </p>
          <p
            className="text-[11px] truncate"
            style={{ color: "var(--color-text-muted)" }}
          >
            {item.job_title}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <span
          className="text-[10px]"
          style={{ color: "var(--color-text-subtle)" }}
        >
          {formatDate(item.created_at)}
        </span>
        <div className="flex-1" />
        <button
          className="text-[10px] font-semibold px-2 py-0.5 rounded-[6px]"
          style={{
            background: "var(--color-primary-light)",
            color: "var(--color-primary)",
          }}
        >
          Revoir
        </button>
      </div>
    </div>
  )
}
