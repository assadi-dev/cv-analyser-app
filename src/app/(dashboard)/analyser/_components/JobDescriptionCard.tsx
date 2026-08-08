"use client"

import { Briefcase, Zap } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Card, CardHeader } from "@/components/ui/Card"
import { Textarea } from "@/components/ui/textarea"
import type { AnalyseStep } from "@/types"
import { getStepLabel } from "../_lib/analyse.config"
import { AnalyseProgress } from "./AnalyseProgress"

interface JobDescriptionCardProps {
  value: string
  onChange: (value: string) => void
  onAnalyse: () => void
  canAnalyse: boolean
  isStreaming: boolean
  progress: number
  currentStep: AnalyseStep | null
}

export function JobDescriptionCard({
  value,
  onChange,
  onAnalyse,
  canAnalyse,
  isStreaming,
  progress,
  currentStep,
}: JobDescriptionCardProps) {
  return (
    <Card className="flex-1 flex flex-col gap-4 justify-between">
      <CardHeader
        icon={<Briefcase size={15} className="text-[#8B5CF6]" />}
        title="Fiche de Poste"
      />

      <Textarea
        placeholder="Collez la description du poste (missions, compétences requises, expérience)..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 min-h-[160px]"
      />
      {isStreaming && <AnalyseProgress progress={progress} currentStep={currentStep} />}
      <Button
        size="lg"
        className="w-full"
        onClick={onAnalyse}
        loading={isStreaming}
        disabled={!canAnalyse}
      >
        <Zap size={20} />
        {isStreaming
          ? getStepLabel(currentStep, "Analyse en cours...")
          : "Analyser la compatibilité"}
      </Button>

    </Card>
  )
}
