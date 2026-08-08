"use client"

import { cn } from "@/lib/utils"
import type { Recommendation } from "@/types"
import { RECOMMENDATION_STYLES } from "../../_lib/analyse.config"

interface RecommendationItemProps {
  recommendation: Recommendation
}

export function RecommendationItem({ recommendation }: RecommendationItemProps) {
  const { container, text, Icon } =
    RECOMMENDATION_STYLES[recommendation.type] ?? RECOMMENDATION_STYLES.info

  return (
    <div className={cn("flex gap-2.5 p-3 rounded-[10px] items-start border", container)}>
      <Icon size={15} className={cn("shrink-0 mt-0.5", text)} />
      <p className={cn("text-[12px] leading-relaxed", text)}>
        <strong>{recommendation.title}</strong> — {recommendation.description}
      </p>
    </div>
  )
}
