"use client"

import { Layers, Check } from "lucide-react"
import { Card, CardHeader } from "@/components/ui/Card"
import { cn } from "@/lib/utils"
import { PLATFORMS } from "../_lib/platforms.config"

interface PlatformsSectionProps {
  favPlatforms: string[]
  onToggle: (platform: string) => void
}

export function PlatformsSection({ favPlatforms, onToggle }: PlatformsSectionProps) {
  return (
    <Card>
      <CardHeader icon={<Layers size={15} style={{ color: "var(--color-primary)" }} />} title="Plateformes favorites"
        subtitle="Ces plateformes seront proposées en priorité lors de l'ajout d'une candidature" />
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {PLATFORMS.map((platform) => {
          const active = favPlatforms.includes(platform)
          return (
            <button
              key={platform}
              onClick={() => onToggle(platform)}
              className={cn(
                "flex items-center gap-2 h-11 px-3.5 rounded-[10px] text-[13px] transition-all border",
                active
                  ? "border-[var(--color-info)] bg-[var(--color-info-light)] text-[var(--color-info-text)] font-semibold"
                  : "border-[var(--color-border)] bg-[var(--color-surface-muted)] text-[var(--color-text-muted)]"
              )}
            >
              <span className="flex-1 text-left truncate">{platform}</span>
              {active && <Check size={14} />}
            </button>
          )
        })}
      </div>
    </Card>
  )
}
