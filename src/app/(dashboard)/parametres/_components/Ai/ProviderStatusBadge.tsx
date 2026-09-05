import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import type { AiProviderTestResult } from "../../_api/ai-provider.api"

interface ProviderStatusBadgeProps {
  result: AiProviderTestResult | null | undefined
}

export function ProviderStatusBadge({ result }: ProviderStatusBadgeProps) {
  if (!result) return null

  return (
    <span
      className={cn(
        "ml-auto flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold",
        result.success
          ? "bg-[var(--color-success-light)] text-[var(--color-success-text)]"
          : "bg-[var(--color-danger-light)] text-[var(--color-danger-text)]"
      )}
    >
      {result.success ? (
        <>
          <Check size={11} /> Active
        </>
      ) : (
        "Erreur"
      )}
    </span>
  )
}
