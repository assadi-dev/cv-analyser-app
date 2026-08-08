"use client"

import { useFormContext } from "react-hook-form"
import { Textarea } from "@/components/ui/textarea"
import { FormField, FormItem, FormControl } from "@/components/ui/form"
import type { AddCandidatureFormValues } from "../../../_lib/add-candidature.schema"

export function JobDescriptionSection() {
  const form = useFormContext<AddCandidatureFormValues>()

  return (
    <div className="flex flex-col gap-3">
      <p className="text-[12px] font-bold text-[#374151] tracking-[0.3px]">Fiche de poste</p>
      <FormField
        control={form.control}
        name="job_description"
        render={({ field }) => (
          <FormItem className="space-y-0">
            <FormControl>
              <Textarea
                {...field}
                placeholder="Collez la description du poste ici (missions, compétences, expérience requise)..."
                rows={7}
                className="rounded-[10px] bg-white border-[#E2E8F0] text-[12px] text-[#374151] placeholder:text-[#94A3B8] focus-visible:ring-1 focus-visible:ring-[#7C3AED]/30 focus-visible:ring-offset-0 resize-none leading-[1.5]"
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  )
}
