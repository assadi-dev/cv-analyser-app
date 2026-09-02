"use client"

import type { CandidatureSummary } from "@/types"

interface BoardCardGhostProps {
  card: CandidatureSummary
}

/**
 * The card that follows the cursor during a drag.
 *
 * Without it KanbanOverlay renders null: nothing tracks the pointer and the
 * drag reads as broken even when it is working. Deliberately stripped down —
 * no handle, no button — since nothing inside it is interactive while flying.
 */
export default function BoardCardGhost({ card }: BoardCardGhostProps) {
  return (
    <div className="flex w-[240px] rotate-2 flex-col gap-2 rounded-[10px] border border-border bg-white p-3 shadow-xl">
      <div className="flex items-center gap-2">
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
      </div>
    </div>
  )
}
