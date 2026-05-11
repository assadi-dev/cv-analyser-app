"use client"

import { useFormContext } from "react-hook-form"
import { Layers, ChevronDown, Link, ExternalLink } from "lucide-react"
import type { AddCandidatureFormValues } from "../../../_lib/add-candidature.schema"

const SOURCE_PLATFORMS = [
  "LinkedIn",
  "Welcome to the Jungle",
  "Indeed",
  "Monster",
  "JobTeaser",
  "Autre",
]

export function SourceSection() {
  const { register } = useFormContext<AddCandidatureFormValues>()

  return (
    <div className="flex flex-col gap-[8px]">
      <p className="text-[12px] font-bold text-[#374151] tracking-[0.3px]">Source de l'offre</p>

      <div className="flex gap-[8px]">
        <div className="relative w-[150px] shrink-0">
          <Layers size={13} className="absolute left-[10px] top-1/2 -translate-y-1/2 pointer-events-none text-[#7C3AED]" />
          <select
            {...register("source_platform")}
            className="w-full h-[38px] pl-8 pr-7 rounded-[8px] bg-[#F8FAFC] border border-[#E2E8F0] text-[12px] text-[#374151] outline-none appearance-none cursor-pointer"
          >
            {SOURCE_PLATFORMS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
          <ChevronDown size={12} className="absolute right-[10px] top-1/2 -translate-y-1/2 pointer-events-none text-[#94A3B8]" />
        </div>

        <input
          {...register("source_name")}
          placeholder="Nom de l'offre (optionnel)"
          className="flex-1 h-[38px] px-3 rounded-[8px] bg-[#F8FAFC] border border-[#E2E8F0] text-[12px] text-[#374151] placeholder:text-[#94A3B8] outline-none"
        />
      </div>

      <div className="flex items-center gap-[8px] h-[38px] px-[10px] rounded-[8px] bg-[#F8FAFC] border border-[#E2E8F0]">
        <Link size={13} className="text-[#94A3B8] shrink-0" />
        <input
          {...register("source_url")}
          placeholder="https://linkedin.com/jobs/..."
          className="flex-1 text-[12px] text-[#374151] placeholder:text-[#94A3B8] bg-transparent outline-none"
        />
        <button
          type="button"
          className="w-[26px] h-[26px] rounded-[6px] bg-[#EDE9FE] flex items-center justify-center shrink-0"
        >
          <ExternalLink size={12} className="text-[#7C3AED]" />
        </button>
      </div>
    </div>
  )
}
