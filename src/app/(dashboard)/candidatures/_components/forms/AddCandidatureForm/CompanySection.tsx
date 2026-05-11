"use client"

import { useFormContext } from "react-hook-form"
import { Building2 } from "lucide-react"
import type { AddCandidatureFormValues } from "../../../_lib/add-candidature.schema"

const FIELD = "w-full h-[38px] px-3 rounded-[8px] bg-[#F8FAFC] border border-[#E2E8F0] text-[12px] text-[#374151] placeholder:text-[#94A3B8] outline-none"

export function CompanySection() {
  const { register, formState: { errors } } = useFormContext<AddCandidatureFormValues>()

  return (
    <div className="flex flex-col gap-[10px]">
      <p className="text-[12px] font-bold text-[#374151] tracking-[0.3px]">Entreprise</p>

      <div className="flex gap-[10px]">
        <div className="w-[44px] h-[44px] rounded-[10px] bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center shrink-0">
          <Building2 size={20} className="text-[#94A3B8]" />
        </div>

        <div className="flex flex-col gap-[8px] flex-1 min-w-0">
          <input
            {...register("company_name")}
            placeholder="Nom de l'entreprise"
            className={FIELD}
          />
          {errors.company_name && (
            <p className="text-[11px] text-[#EF4444]">{errors.company_name.message}</p>
          )}
          <input
            {...register("company_city")}
            placeholder="Ville"
            className={FIELD}
          />
        </div>
      </div>
    </div>
  )
}
