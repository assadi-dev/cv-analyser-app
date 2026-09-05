import { cn } from "@/lib/utils"
import { ProviderBadge } from "./ProviderBadge"
import type { AIProviderConfig } from "../../_lib/ai-providers.config"

interface ProviderListItemProps {
  provider: AIProviderConfig
  active: boolean
  onSelect: () => void
}

export function ProviderListItem({ provider, active, onSelect }: ProviderListItemProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex items-center gap-2.5 h-[46px] px-3 rounded-[8px] text-[13px] transition-colors shrink-0 whitespace-nowrap",
        active
          ? "bg-[var(--color-primary)] text-white font-semibold"
          : "text-[var(--color-text-secondary)] hover:bg-white"
      )}
    >
      <ProviderBadge label={provider.label} color={provider.color} />
      <span className="flex-1 text-left">{provider.label}</span>
      {provider.local && (
        <span
          className="text-[9px] px-1.5 py-0.5 rounded-[4px]"
          style={{
            background: active ? "rgba(255,255,255,0.2)" : "var(--color-surface-muted)",
            color: active ? "white" : "var(--color-text-subtle)",
          }}
        >
          Local
        </span>
      )}
    </button>
  )
}
