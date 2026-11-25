import { Link2, TriangleAlert } from "lucide-react"
import type { CandidatureSummary } from "@/types"

interface CandidatureContextBannerProps {
  candidature: CandidatureSummary | undefined
  isLoading: boolean
  isError: boolean
}

/**
 * Says what the analysis about to be launched will be attached to.
 *
 * Shown only when the page was opened from a candidature. A failed lookup is
 * reported instead of ignored: the analysis still works, but standalone, and
 * the user should know before running it.
 */
export function CandidatureContextBanner({
  candidature,
  isLoading,
  isError,
}: CandidatureContextBannerProps) {
  if (isLoading) {
    return (
      <div
        className="h-[52px] animate-pulse rounded-[12px] bg-surface-muted"
        aria-hidden="true"
      />
    )
  }

  if (isError) {
    return (
      <div
        role="status"
        className="flex items-start gap-3 rounded-[12px] border border-warning-light bg-warning-light/60 px-4 py-3 text-[12px] text-warning-text"
      >
        <TriangleAlert size={15} className="mt-0.5 shrink-0" aria-hidden="true" />
        <p>
          Candidature introuvable : l&apos;analyse ne sera rattachée à aucune
          candidature.
        </p>
      </div>
    )
  }

  if (!candidature) return null

  return (
    <div
      role="status"
      className="flex items-center gap-3 rounded-[12px] border border-primary-light bg-primary-light/50 px-4 py-3"
    >
      <Link2 size={15} className="shrink-0 text-primary" aria-hidden="true" />
      <p className="min-w-0 text-[12px] text-text-secondary">
        Analyse rattachée à{" "}
        <span className="font-bold text-text-primary">{candidature.company_name}</span>
        <span className="text-text-muted"> · {candidature.job_title}</span>
      </p>
    </div>
  )
}
