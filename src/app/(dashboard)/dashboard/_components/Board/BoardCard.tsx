"use client"

import { KanbanItem, KanbanItemHandle } from "@/components/ui/kanban"
import { cn, formatDate } from "@/lib/utils"
import type { CandidatureSummary } from "@/types"

interface BoardCardProps {
  card: CandidatureSummary
  onOpen?: (id: string) => void
}

/**
 * One card on the board.
 *
 * The whole upper block is the drag handle, not a small grip icon: KanbanItem
 * only attaches drag listeners to itself when `asHandle` is set, otherwise
 * they live on the handle alone. A discreet handle therefore makes the card
 * look broken — you grab it and nothing happens.
 *
 * The footer stays outside the handle so "Revoir" remains clickable. That
 * separation is required here: the Kanban wires MouseSensor with no
 * activation constraint, so any mousedown inside the handle starts a drag
 * immediately.
 */
export default function BoardCard({ card, onOpen }: BoardCardProps) {
  return (
    <KanbanItem
      value={card.id}
      className={cn(
        "flex flex-col gap-2 rounded-[10px] border border-border bg-white p-3",
        "transition-shadow hover:shadow-md",
        // The component sets data-dragging="" — an empty value, so a
        // [data-dragging=true] selector would never match.
        "data-dragging:opacity-60 data-dragging:shadow-lg"
      )}
    >
      <KanbanItemHandle
        aria-label={`Déplacer la candidature ${card.company_name}`}
        className={cn(
          "flex w-full items-center gap-2 rounded-[6px] text-left",
          "cursor-grab active:cursor-grabbing",
          "focus-visible:outline-2 focus-visible:outline-offset-2"
        )}
      >
        <span
          className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-[6px] bg-primary-light text-[13px] font-bold text-primary"
          aria-hidden="true"
        >
          {card.company_name[0]?.toUpperCase()}
        </span>

        <span className="flex min-w-0 flex-col">
          <span className="truncate text-[12px] font-bold text-slate-900">
            {card.company_name}
          </span>
          <span className="truncate text-[11px] text-slate-500">
            {card.job_title}
          </span>
        </span>
      </KanbanItemHandle>

      <div className="flex items-center gap-1.5">
        <span className="text-[10px] text-slate-400">
          {formatDate(card.created_at)}
        </span>
        <div className="flex-1" />
        <button
          type="button"
          onClick={() => onOpen?.(card.id)}
          // The visible label repeats across every card; screen readers need
          // to know which application this one opens.
          aria-label={`Revoir la candidature ${card.company_name}`}
          className="rounded-[6px] bg-primary-light px-2 py-0.5 text-[10px] font-semibold text-primary hover:brightness-95"
        >
          Revoir
        </button>
      </div>
    </KanbanItem>
  )
}
