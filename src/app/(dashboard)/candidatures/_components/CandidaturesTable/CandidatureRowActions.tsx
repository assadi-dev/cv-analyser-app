"use client"

import { Eye, MessageSquare, Pencil, Sparkles, Trash2 } from "lucide-react"
import { RowActionButton } from "./RowActionButton"

interface CandidatureRowActionsProps {
  id: string
  onView: (id: string) => void
  onEdit: (id: string) => void
  onAnalyse: (id: string) => void
  onDelete: (id: string) => void
}

/** The actions of one candidature row — shared by the table rows and columns. */
export function CandidatureRowActions({
  id,
  onView,
  onEdit,
  onAnalyse,
  onDelete,
}: CandidatureRowActionsProps) {
  return (
    <div className="flex items-center justify-center gap-1.5">
      <RowActionButton label="Voir" icon={Eye} tone="primary" onClick={() => onView(id)} />
      <RowActionButton label="Modifier" icon={Pencil} onClick={() => onEdit(id)} />
      <RowActionButton
        label="Lancer une analyse"
        icon={Sparkles}
        tone="accent"
        onClick={() => onAnalyse(id)}
      />
      <RowActionButton
        label="Chat"
        hint="Chat — bientôt disponible"
        icon={MessageSquare}
        disabled
      />
      <RowActionButton label="Supprimer" icon={Trash2} onClick={() => onDelete(id)} />
    </div>
  )
}
