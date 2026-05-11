import { cn } from "@/lib/utils"
import { STATUS_TABS } from "../../_lib/status-tabs.config"
import type { CandidatureStatus } from "@/types"

interface StatusTabsProps {
  active: CandidatureStatus | "all"
  total: number
  onTabChange: (value: CandidatureStatus | "all") => void
}

export function StatusTabs({ active, total, onTabChange }: StatusTabsProps) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {STATUS_TABS.map((tab) => {
        const isActive = active === tab.value
        return (
          <button
            key={tab.value}
            onClick={() => onTabChange(tab.value)}
            className={cn(
              "flex items-center gap-2 px-4 py-1.5 rounded-[8px] text-[13px] transition-colors",
              isActive
                ? "bg-[var(--color-primary)] text-white font-semibold"
                : "bg-white border border-[var(--color-border)] text-[var(--color-text-muted)] hover:bg-[var(--color-surface-muted)]"
            )}
          >
            {tab.label}
            {tab.value === "all" && (
              <span
                className={cn(
                  "px-2 py-0.5 rounded-full text-[10px] font-bold",
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-[var(--color-surface-muted)] text-[var(--color-text-muted)]"
                )}
              >
                {total}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
