"use client"

import { useFormContext } from "react-hook-form"
import { ChevronDown } from "lucide-react"
import type { AddCandidatureFormValues } from "../../../_lib/add-candidature.schema"

const FIELD = "w-full h-[38px] px-3 rounded-[8px] bg-[#F8FAFC] border border-[#E2E8F0] text-[12px] text-[#374151] placeholder:text-[#94A3B8] outline-none"
const SELECT = `${FIELD} appearance-none pr-8 cursor-pointer`

export function JobSection() {
  const { register, formState: { errors } } = useFormContext<AddCandidatureFormValues>()

  return (
    <div className="flex flex-col gap-[10px]">
      <p className="text-[12px] font-bold text-[#374151] tracking-[0.3px]">Poste</p>

      <input
        {...register("job_title")}
        placeholder="Intitulé du poste"
        className={FIELD}
      />
      {errors.job_title && (
        <p className="text-[11px] text-[#EF4444]">{errors.job_title.message}</p>
      )}

      <div className="flex gap-[8px]">
        <div className="relative flex-1">
          <select {...register("contract_type")} className={SELECT}>
            <option value="CDI">CDI</option>
            <option value="CDD">CDD</option>
            <option value="Freelance">Freelance</option>
            <option value="Stage">Stage</option>
            <option value="Alternance">Alternance</option>
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#94A3B8]" />
        </div>

        <div className="relative flex-1">
          <select {...register("work_mode")} className={SELECT}>
            <option value="remote">Télétravail</option>
            <option value="hybrid">Hybride</option>
            <option value="on-site">Présentiel</option>
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#94A3B8]" />
        </div>
      </div>
    </div>
  )
}
