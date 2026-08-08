"use client"

import { useFormContext } from "react-hook-form"
import { Building2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import type { AddCandidatureFormValues } from "../../../_lib/add-candidature.schema"

const FIELD_CLS = "h-[38px] rounded-[8px] bg-[#F8FAFC] border-[#E2E8F0] text-[12px] text-[#374151] placeholder:text-[#94A3B8] focus-visible:ring-1 focus-visible:ring-[#7C3AED]/30 focus-visible:ring-offset-0"

export function CompanySection() {
  const form = useFormContext<AddCandidatureFormValues>()

  return (
    <div className="flex flex-col gap-3">
      <p className="text-[12px] font-bold text-[#374151] tracking-[0.3px]">Entreprise</p>

      <div className="flex gap-[10px]">
        <div className="w-[44px] h-[44px] rounded-[10px] bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center shrink-0">
          <Building2 size={20} className="text-[#94A3B8]" />
        </div>

        <div className="flex flex-col gap-2 flex-1 min-w-0">
          <FormField
            control={form.control}
            name="company_name"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormControl>
                  <Input placeholder="Nom de l'entreprise" className={FIELD_CLS} {...field} />
                </FormControl>
                <FormMessage className="text-[11px]" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="company_city"
            render={({ field }) => (
              <FormItem className="space-y-0">
                <FormControl>
                  <Input placeholder="Ville" className={FIELD_CLS} {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  )
}
