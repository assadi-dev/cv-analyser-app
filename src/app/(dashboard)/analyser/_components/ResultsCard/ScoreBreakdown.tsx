"use client"

import { cn, scoreColor } from "@/lib/utils"
import { SCORE_TEXT_CLASS } from "../../_lib/analyse.config"
import type { ScoreItem } from "../../_types"

interface ScoreBreakdownProps {
  items: ScoreItem[]
}

export function ScoreBreakdown({ items }: ScoreBreakdownProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex flex-col gap-1.5 p-3 rounded-[10px] bg-[var(--color-surface-muted)]"
        >
          <span className="text-[11px] text-[var(--color-text-subtle)]">{item.label}</span>
          <span className={cn("text-[22px] font-black", SCORE_TEXT_CLASS[scoreColor(item.value)])}>
            {item.value}
          </span>
          <div className="h-1.5 rounded-full bg-[var(--color-border)]">
            <div
              className="h-full rounded-full bg-gradient-primary"
              style={{ width: `${item.value}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
