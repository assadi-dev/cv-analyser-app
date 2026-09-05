"use client"

import { cn } from "@/lib/utils"
import { SETTINGS_NAV } from "../_lib/settings-nav.config"
import type { SettingsSectionId } from "../_types"

interface SettingsNavProps {
  active: SettingsSectionId
  onChange: (id: SettingsSectionId) => void
}

export function SettingsNav({ active, onChange }: SettingsNavProps) {
  return (
    <nav
      className="w-full md:w-[220px] shrink-0 border-b md:border-b-0 md:border-r p-4 flex md:flex-col gap-1 overflow-x-auto"
      style={{ borderColor: "var(--color-border)", background: "white" }}
    >
      <span className="hidden md:block text-[9px] font-bold tracking-widest px-2 mb-1" style={{ color: "var(--color-text-subtle)" }}>
        PARAMÈTRES
      </span>
      {SETTINGS_NAV.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={cn(
            "flex items-center gap-2.5 h-[38px] rounded-[8px] px-3 text-[13px] text-left transition-colors whitespace-nowrap shrink-0",
            active === id
              ? "bg-[var(--color-primary-light)] text-[var(--color-primary)] font-semibold"
              : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface-muted)]"
          )}
        >
          <Icon size={15} />
          {label}
        </button>
      ))}
    </nav>
  )
}
