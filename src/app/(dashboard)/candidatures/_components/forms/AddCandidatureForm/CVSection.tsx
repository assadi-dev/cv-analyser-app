"use client"

import { useFormContext } from "react-hook-form"
import { FileText, Upload } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { FormField, FormItem, FormControl } from "@/components/ui/form"
import type { AddCandidatureFormValues } from "../../../_lib/add-candidature.schema"

export function CVSection() {
  const form = useFormContext<AddCandidatureFormValues>()

  return (
    <div className="flex flex-col gap-3">
      <p className="text-[12px] font-bold text-[#374151] tracking-[0.3px]">CV utilisé</p>

      <FormField
        control={form.control}
        name="cv_id"
        render={({ field }) => (
          <FormItem className="space-y-0">
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className="h-[44px] rounded-[10px] bg-white border-[#E2E8F0] text-[12px] text-[#374151] focus:ring-1 focus:ring-[#7C3AED]/30 focus:ring-offset-0">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <FileText size={16} className="text-[#7C3AED] shrink-0" />
                    <SelectValue placeholder="Sélectionner un CV" />
                  </div>
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-white border-[#E2E8F0] rounded-[8px] shadow-[var(--shadow-md)]">
                <SelectItem value="none" className="text-[12px] text-[#94A3B8] focus:bg-[#EDE9FE]">
                  Aucun CV sélectionné
                </SelectItem>
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />

      <div className="flex items-center gap-3">
        <Separator className="flex-1 bg-[#E2E8F0]" />
        <span className="text-[11px] text-[#94A3B8] whitespace-nowrap">ou importer un nouveau CV</span>
        <Separator className="flex-1 bg-[#E2E8F0]" />
      </div>

      <div className="flex items-center justify-center gap-2 h-[64px] rounded-[10px] bg-[#F8FAFC] border-2 border-dashed border-[#C7D2FE] cursor-pointer hover:bg-[#EDE9FE]/20 transition-colors">
        <Upload size={18} className="text-[#A78BFA]" />
        <span className="text-[12px] font-medium text-[#7C3AED]">Glisser ou cliquer pour importer</span>
      </div>
    </div>
  )
}
