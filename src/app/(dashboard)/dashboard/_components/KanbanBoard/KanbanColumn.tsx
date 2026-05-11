import type { KanbanColumnConfig } from "../../_types"
import type { CandidatureSummary, CandidatureStatus } from "@/types"
import { CandidatureCard } from "./CandidatureCard"
import { KanbanColumnSkeleton } from "./KanbanColumnSkeleton"

interface KanbanColumnProps {
  column: KanbanColumnConfig
  items: CandidatureSummary[]
  isLoading: boolean
  onStatusChange: (id: string, status: CandidatureStatus) => void
}

export function KanbanColumn({
  column,
  items,
  isLoading,
  onStatusChange,
}: KanbanColumnProps) {
  return (
    <div
      className="flex flex-col gap-2.5 p-3 rounded-[12px] min-h-[400px]"
      style={{ background: column.bg }}
    >
      <div className="flex items-center gap-2 pb-1">
        <span
          className="w-2 h-2 rounded-full shrink-0"
          style={{ background: column.dotColor }}
        />
        <span
          className="text-[12px] font-bold"
          style={{ color: column.textColor }}
        >
          {column.label}
        </span>
        <span
          className="ml-auto px-2 py-0.5 rounded-full text-[10px] font-bold"
          style={{ background: column.countBg, color: column.textColor }}
        >
          {items.length}
        </span>
      </div>

      {isLoading ? (
        <KanbanColumnSkeleton />
      ) : (
        items.map((item) => (
          <CandidatureCard
            key={item.id}
            item={item}
            onStatusChange={onStatusChange}
          />
        ))
      )}
    </div>
  )
}
