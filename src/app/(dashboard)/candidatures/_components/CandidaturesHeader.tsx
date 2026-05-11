import { Plus } from "lucide-react"
import { Button } from "@/components/ui/Button"

interface CandidaturesHeaderProps {
  onAdd: () => void
}

export function CandidaturesHeader({ onAdd }: CandidaturesHeaderProps) {
  return (
    <div className="flex items-center">
      <div className="flex-1" />
      <Button size="sm" onClick={onAdd}>
        <Plus size={14} /> Ajouter
      </Button>
    </div>
  )
}
