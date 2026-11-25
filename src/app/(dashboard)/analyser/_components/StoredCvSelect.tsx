"use client"

import { FileText } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { CVSummary } from "@/types"

interface StoredCvSelectProps {
  cvs: CVSummary[]
  /** The selected CV's id. `undefined` shows the placeholder. */
  value: string | undefined
  onChange: (id: string) => void
}

/** Lets the user run the analysis on a CV they already imported. */
export function StoredCvSelect({ cvs, value, onChange }: StoredCvSelectProps) {
  return (
    <div className="flex flex-col gap-1.5 px-3 pb-3">
      <label
        htmlFor="stored-cv"
        className="text-[12px] font-bold tracking-[0.3px] text-text-secondary"
      >
        Mes CV
      </label>
      <Select
        value={value ?? ""}
        onValueChange={(next) => {
          // Radix reports "" when it resets: never a real choice.
          if (next) onChange(next)
        }}
      >
        <SelectTrigger
          id="stored-cv"
          className="h-[44px] rounded-[10px] border-[#E2E8F0] bg-white text-[12px] text-[#374151] focus:ring-1 focus:ring-[#7C3AED]/30 focus:ring-offset-0"
        >
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <FileText size={16} className="shrink-0 text-primary" aria-hidden="true" />
            <SelectValue placeholder="Sélectionner un CV existant" />
          </div>
        </SelectTrigger>
        <SelectContent className="rounded-[8px] border-[#E2E8F0] bg-white shadow-[var(--shadow-md)]">
          {cvs.map((cv) => (
            <SelectItem
              key={cv.id}
              value={cv.id}
              className="text-[12px] text-[#374151] focus:bg-[#EDE9FE] focus:text-[#7C3AED]"
            >
              {cv.name}
              {cv.is_default && <span className="ml-2 text-[#94A3B8]">par défaut</span>}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
