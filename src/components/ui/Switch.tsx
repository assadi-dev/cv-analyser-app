"use client"

import { cn } from "@/lib/utils"

interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  disabled?: boolean
  className?: string
}

export function Switch({ checked, onChange, label, disabled, className }: SwitchProps) {
  return (
    <label className={cn("flex items-center gap-2.5 cursor-pointer select-none", disabled && "opacity-50 cursor-not-allowed", className)}>
      <button
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={cn(
          "relative w-[38px] h-[22px] rounded-full transition-colors duration-200",
          checked ? "bg-[var(--color-primary)]" : "bg-[var(--color-border)]",
        )}
      >
        <span
          className={cn(
            "absolute top-[3px] w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200",
            checked ? "translate-x-[19px]" : "translate-x-[3px]",
          )}
        />
      </button>
      {label && (
        <span className="text-[13px] font-semibold" style={{ color: "var(--color-text-secondary)" }}>
          {label}
        </span>
      )}
    </label>
  )
}
