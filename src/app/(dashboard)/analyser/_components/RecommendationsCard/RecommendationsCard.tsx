"use client"

import { Lightbulb } from "lucide-react"
import { Badge } from "@/components/ui/Badge"
import { Card, CardHeader } from "@/components/ui/Card"
import type { Recommendation } from "@/types"
import { RecommendationItem } from "./RecommendationItem"

interface RecommendationsCardProps {
  recommendations: Recommendation[]
}

export function RecommendationsCard({ recommendations }: RecommendationsCardProps) {
  if (recommendations.length === 0) return null

  return (
    <Card>
      <CardHeader
        icon={<Lightbulb size={15} className="text-[var(--color-primary)]" />}
        title="Recommandations IA"
        action={<Badge variant="purple">{recommendations.length} conseils</Badge>}
      />
      <div className="flex flex-col gap-2.5">
        {recommendations.map((recommendation, index) => (
          <RecommendationItem
            key={`${recommendation.title}-${index}`}
            recommendation={recommendation}
          />
        ))}
      </div>
    </Card>
  )
}
