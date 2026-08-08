"use client"

import { Target } from "lucide-react"

export function ResultsEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-8 gap-2 text-[var(--color-text-subtle)]">
      <Target size={32} className="opacity-30" />
      <p className="text-[13px]">Lancez une analyse pour voir les résultats</p>
    </div>
  )
}
