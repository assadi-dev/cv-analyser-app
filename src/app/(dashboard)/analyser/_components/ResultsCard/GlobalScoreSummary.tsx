"use client"

import { cn, scoreColor } from "@/lib/utils"
import { SCORE_TEXT_CLASS, SCORE_VERDICT } from "../../_lib/analyse.config"
import type { AnalyseResult } from "../../_types"

interface GlobalScoreSummaryProps {
  result: AnalyseResult
}

export function GlobalScoreSummary({ result }: GlobalScoreSummaryProps) {
  const tone = scoreColor(result.score_global)

  return (
    <div className="flex items-center gap-4 p-4 rounded-[10px] mb-4 bg-[var(--color-surface-muted)]">
      <div className="w-[72px] h-[72px] rounded-full flex items-center justify-center shrink-0 bg-gradient-primary shadow-[var(--shadow-primary)]">
        <span className="text-white text-[18px] font-black">{result.score_global}%</span>
      </div>
      <div>
        <p className="text-[12px] text-[var(--color-text-muted)]">Score Global de Matching</p>
        <p className={cn("text-[15px] font-bold", SCORE_TEXT_CLASS[tone])}>
          {SCORE_VERDICT[tone]}
        </p>
        <p className="text-[11px] text-[var(--color-text-subtle)]">
          ATS: {result.score_ats}% · Compétences: {result.score_competences}% · Exp.:{" "}
          {result.score_experience}%
        </p>
      </div>
    </div>
  )
}
