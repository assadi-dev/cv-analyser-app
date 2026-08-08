"use client"

import { MAX_FOUND_KEYWORDS, MAX_MISSING_KEYWORDS } from "../../_lib/analyse.config"

interface KeywordsSummaryProps {
  missing: string[]
  found: string[]
}

export function KeywordsSummary({ missing, found }: KeywordsSummaryProps) {
  if (missing.length === 0) return null

  return (
    <div className="flex flex-col gap-2">
      <span className="text-[12px] font-semibold text-[var(--color-text-muted)]">
        Mots-clés manquants
      </span>
      <div className="flex flex-wrap gap-1.5">
        {missing.slice(0, MAX_MISSING_KEYWORDS).map((keyword) => (
          <span
            key={keyword}
            className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[var(--color-danger-light)] text-[var(--color-danger-text)]"
          >
            {keyword}
          </span>
        ))}
        {found.slice(0, MAX_FOUND_KEYWORDS).map((keyword) => (
          <span
            key={keyword}
            className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[var(--color-success-light)] text-[var(--color-success-text)]"
          >
            {keyword} ✓
          </span>
        ))}
      </div>
    </div>
  )
}
