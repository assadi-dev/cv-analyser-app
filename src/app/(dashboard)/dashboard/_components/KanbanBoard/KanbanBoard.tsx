import type { CandidatureSummary, CandidatureStatus } from "@/types"
import { KANBAN_COLUMNS } from "../../_lib/kanban.config"
import { KanbanHeader } from "./KanbanHeader"
import { KanbanColumn } from "./KanbanColumn"

interface KanbanBoardProps {
  candidatures: CandidatureSummary[]
  isLoading: boolean
  onStatusChange: (id: string, status: CandidatureStatus) => void
  onNewAnalysis: () => void
}

export function KanbanBoard({
  candidatures,
  isLoading,
  onStatusChange,
  onNewAnalysis,
}: KanbanBoardProps) {
  const byStatus = (status: CandidatureStatus) =>
    candidatures.filter((c) => c.status === status)

  return (
    <div className="flex flex-col gap-4">
      <KanbanHeader total={candidatures.length} onNewAnalysis={onNewAnalysis} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {KANBAN_COLUMNS.map((col) => (
          <KanbanColumn
            key={col.status}
            column={col}
            items={byStatus(col.status)}
            isLoading={isLoading}
            onStatusChange={onStatusChange}
          />
        ))}
      </div>
    </div>
  )
}
