import { Plus } from "lucide-react"
import { Button } from "@/components/ui/Button"

interface BoardHeaderProps {
  total: number
  onNewAnalysis: () => void
}

export function BoardHeader({ total, onNewAnalysis }: BoardHeaderProps) {
  return (
    <div className="flex items-center gap-3">
      <h2 className="text-[15px] font-bold text-text-primary">
        Suivi des candidatures
      </h2>
      <span className="rounded-full bg-surface-muted px-3 py-1 text-[11px] font-semibold text-text-muted">
        {total} candidature{total > 1 ? "s" : ""}
      </span>
      <div className="flex-1" />
      <Button size="sm" onClick={onNewAnalysis}>
        <Plus size={14} /> Nouvelle analyse
      </Button>
    </div>
  )
}
