"use client"

import { useFormContext } from "react-hook-form"
import { Textarea } from "@/components/ui/textarea"
import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form"
import type { CandidatureFormValues } from "../../../_lib/candidature.schema"

interface JobDescriptionSectionProps {
  /** Shows the required marker. The field is required when creating, not when editing. */
  required?: boolean
}

export function JobDescriptionSection({ required = true }: JobDescriptionSectionProps) {
  const form = useFormContext<CandidatureFormValues>()

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <p className="text-[12px] font-bold text-[#374151] tracking-[0.3px]">
        Fiche de poste
        {required && (
          <span className="ml-1 text-[#EF4444]" aria-hidden="true">*</span>
        )}
      </p>
      <FormField
        control={form.control}
        name="job_description"
        render={({ field }) => (
          <FormItem className="flex min-h-0 flex-1 flex-col space-y-0">
            <FormControl>
              <Textarea
                {...field}
                placeholder="Collez la description du poste ici (missions, compétences, expérience requise)..."
                aria-required={required}
                className="min-h-[200px] flex-1 rounded-[10px] bg-white border-[#E2E8F0] text-[12px] text-[#374151] placeholder:text-[#94A3B8] focus-visible:ring-1 focus-visible:ring-[#7C3AED]/30 focus-visible:ring-offset-0 resize-none leading-[1.5]"
              />
            </FormControl>
            <FormMessage className="mt-1 text-[11px]" />
          </FormItem>
        )}
      />
    </div>
  )
}
