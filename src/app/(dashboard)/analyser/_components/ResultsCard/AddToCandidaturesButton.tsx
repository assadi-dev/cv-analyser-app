"use client"

import { Save } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

const LABEL = "Ajouter à mes candidatures"

interface AddToCandidaturesButtonProps {
  onClick: () => void
}

export function AddToCandidaturesButton({ onClick }: AddToCandidaturesButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          aria-label={LABEL}
          onClick={onClick}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-[8px] bg-primary-light text-primary transition-opacity hover:opacity-80"
        >
          <Save size={15} aria-hidden="true" />
        </button>
      </TooltipTrigger>
      <TooltipContent>{LABEL}</TooltipContent>
    </Tooltip>
  )
}
