"use client"

import { useFormContext } from "react-hook-form"
import { Textarea } from "@/components/ui/textarea"
import { FormField, FormItem, FormControl } from "@/components/ui/form"
import type { CandidatureFormValues } from "../../../_lib/candidature.schema"

export function NotesSection() {
  const form = useFormContext<CandidatureFormValues>()

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <p className="text-[12px] font-bold text-[#374151] tracking-[0.3px]">Notes personnelles</p>
      <FormField
        control={form.control}
        name="notes"
        render={({ field }) => (
          <FormItem className="flex min-h-0 flex-1 flex-col space-y-0">
            <FormControl>
              <Textarea
                {...field}
                placeholder="Remarques, motivations, points à préparer..."
                className="min-h-[160px] flex-1 rounded-[10px] bg-white border-[#E2E8F0] text-[12px] text-[#374151] placeholder:text-[#94A3B8] focus-visible:ring-1 focus-visible:ring-[#7C3AED]/30 focus-visible:ring-offset-0 resize-none"
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  )
}
