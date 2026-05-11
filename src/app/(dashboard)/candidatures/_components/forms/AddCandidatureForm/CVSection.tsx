"use client"

import { useFormContext } from "react-hook-form"
import { FileText, ChevronDown, Upload } from "lucide-react"
import type { AddCandidatureFormValues } from "../../../_lib/add-candidature.schema"

export function CVSection() {
  const { register } = useFormContext<AddCandidatureFormValues>()

  return (
    <div className="flex flex-col gap-[8px]">
      <p className="text-[12px] font-bold text-[#374151] tracking-[0.3px]">CV utilisé</p>

      <div className="relative">
        <FileText size={16} className="absolute left-[14px] top-1/2 -translate-y-1/2 pointer-events-none text-[#7C3AED]" />
        <select
          {...register("cv_id")}
          className="w-full h-[44px] pl-10 pr-8 rounded-[10px] bg-white border border-[#E2E8F0] text-[12px] text-[#374151] outline-none appearance-none cursor-pointer"
        >
          <option value="">Sélectionner un CV</option>
        </select>
        <ChevronDown size={14} className="absolute right-[14px] top-1/2 -translate-y-1/2 pointer-events-none text-[#94A3B8]" />
      </div>

      <div className="flex items-center gap-[6px]">
        <div className="flex-1 h-px bg-[#E2E8F0]" />
        <span className="text-[11px] text-[#94A3B8] whitespace-nowrap">ou importer un nouveau CV</span>
        <div className="flex-1 h-px bg-[#E2E8F0]" />
      </div>

      <div className="flex items-center justify-center gap-[6px] h-[64px] rounded-[10px] bg-[#F8FAFC] border-2 border-dashed border-[#C7D2FE] cursor-pointer hover:bg-[#EDE9FE]/20 transition-colors">
        <Upload size={18} className="text-[#A78BFA]" />
        <span className="text-[12px] font-medium text-[#7C3AED]">Glisser ou cliquer pour importer</span>
      </div>
    </div>
  )
}
