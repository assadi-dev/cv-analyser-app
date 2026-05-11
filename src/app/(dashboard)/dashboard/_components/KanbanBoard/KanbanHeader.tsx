import { Plus } from "lucide-react"
import { Button } from "@/components/ui/Button"

interface KanbanHeaderProps {
  total: number
  onNewAnalysis: () => void
}

export function KanbanHeader({ total, onNewAnalysis }: KanbanHeaderProps) {
  return (
    <div className="flex items-center gap-3">
      <h2
        className="text-[15px] font-bold"
        style={{ color: "var(--color-text-primary)" }}
      >
        Suivi des candidatures
      </h2>
      <span
        className="px-3 py-1 rounded-full text-[11px] font-semibold"
        style={{
          background: "var(--color-surface-muted)",
          color: "var(--color-text-muted)",
        }}
      >
        {total} candidatures
      </span>
      <div className="flex-1" />
      <Button size="sm" onClick={onNewAnalysis}>
        <Plus size={14} /> Nouvelle analyse
      </Button>
    </div>
  )
}
