"use client"

import type { LucideIcon } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

type RowActionTone = "primary" | "accent" | "neutral"

const TONES: Record<RowActionTone, string> = {
  primary: "bg-primary-light text-primary",
  accent: "bg-gradient-primary text-white",
  neutral: "bg-surface-muted text-text-subtle",
}

interface RowActionButtonProps {
  /** Accessible name, and the tooltip text unless `hint` says otherwise. */
  label: string
  icon: LucideIcon
  tone?: RowActionTone
  disabled?: boolean
  /** Tooltip text when it should say more than the label. */
  hint?: string
  onClick?: () => void
}

export function RowActionButton({
  label,
  icon: Icon,
  tone = "neutral",
  disabled = false,
  hint,
  onClick,
}: RowActionButtonProps) {
  const button = (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "flex h-7 w-7 items-center justify-center rounded-[6px] transition-opacity",
        TONES[tone],
        disabled ? "cursor-not-allowed opacity-45" : "hover:opacity-80"
      )}
    >
      <Icon size={13} aria-hidden="true" />
    </button>
  )

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {/*
          A disabled <button> swallows pointer events, so the tooltip would
          never open on it. The wrapper receives them instead — which is also
          what lets the hint explain why the button does nothing.
        */}
        {disabled ? <span className="inline-flex">{button}</span> : button}
      </TooltipTrigger>
      <TooltipContent>{hint ?? label}</TooltipContent>
    </Tooltip>
  )
}
