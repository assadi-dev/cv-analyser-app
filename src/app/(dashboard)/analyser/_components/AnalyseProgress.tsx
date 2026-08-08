"use client"

import type { AnalyseStep } from "@/types"
import { getStepLabel } from "../_lib/analyse.config"

interface AnalyseProgressProps {
  progress: number
  currentStep: AnalyseStep | null
}

export function AnalyseProgress({ progress, currentStep }: AnalyseProgressProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between text-[11px] text-[var(--color-text-subtle)]">
        <span className="animate-pulse-soft">{getStepLabel(currentStep, "Initialisation...")}</span>
        <span>{progress}%</span>
      </div>
      <div className="h-1.5 rounded-full w-full bg-[var(--color-border)]">
        <div
          className="h-full rounded-full bg-gradient-primary transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
