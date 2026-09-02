"use client"

import { Target } from "lucide-react"
import { Card, CardHeader } from "@/components/ui/Card"
import type { AnalyseResult, ScoreItem } from "../../_types"
import { GlobalScoreSummary } from "./GlobalScoreSummary"
import { KeywordsSummary } from "./KeywordsSummary"
import { ResultsEmptyState } from "./ResultsEmptyState"
import { ScoreBreakdown } from "./ScoreBreakdown"

interface ResultsCardProps {
  result: AnalyseResult | null
}

function toScoreItems(result: AnalyseResult): ScoreItem[] {
  return [
    { label: "Score ATS", value: result.score_ats },
    { label: "Compétences", value: result.score_competences },
    { label: "Expérience", value: result.score_experience },
  ]
}

export function ResultsCard({ result }: ResultsCardProps) {
  return (
    <Card>
      <CardHeader
        icon={<Target size={15} className="text-[var(--color-success-text)]" />}
        iconBg="var(--color-success-light)"
        title="Résultats de l'analyse"
      />

      {result && result.analyse_id ? (
        <>
          <GlobalScoreSummary result={result} />
          <ScoreBreakdown items={toScoreItems(result)} />
          <KeywordsSummary
            missing={result.keywords_missing}
            found={result.keywords_found}
          />
        </>
      ) : (
        <ResultsEmptyState />
      )}
    </Card>
  )
}
