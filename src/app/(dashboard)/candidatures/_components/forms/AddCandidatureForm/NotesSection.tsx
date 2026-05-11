"use client"

import { useFormContext } from "react-hook-form"
import type { AddCandidatureFormValues } from "../../../_lib/add-candidature.schema"

export function NotesSection() {
  const { register } = useFormContext<AddCandidatureFormValues>()

  return (
    <div className="flex flex-col gap-[8px]">
      <p className="text-[12px] font-bold text-[#374151] tracking-[0.3px]">Notes personnelles</p>
      <textarea
        {...register("notes")}
        placeholder="Remarques, motivations, points à préparer..."
        rows={4}
        className="w-full p-3 rounded-[10px] bg-white border border-[#E2E8F0] text-[12px] text-[#374151] placeholder:text-[#94A3B8] outline-none resize-none"
      />
    </div>
  )
}
