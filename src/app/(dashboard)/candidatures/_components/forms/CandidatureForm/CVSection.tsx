"use client"

import { useFormContext } from "react-hook-form"
import { FileText } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FormField, FormItem, FormControl } from "@/components/ui/form"
import { useCvs } from "@/app/(dashboard)/parametres/_hooks/useCvs"
import type { CandidatureFormValues } from "../../../_lib/candidature.schema"
import { CVUploadZone } from "./CVUploadZone"

/** Radix Select cannot hold an empty value, so "no CV" needs a stand-in. */
const NO_CV = "none"

export function CVSection() {
  const form = useFormContext<CandidatureFormValues>()
  const { cvs, isLoading } = useCvs()

  return (
    <div className="flex flex-col gap-3">
      <p className="text-[12px] font-bold text-[#374151] tracking-[0.3px]">CV utilisé</p>

      {/* Existing CV selector */}
      <FormField
        control={form.control}
        name="cv_id"
        render={({ field }) => (
          <FormItem className="space-y-0">
            <Select
              // The form keeps "no CV" as an empty string, which is what the
              // payload turns into null.
              onValueChange={(value) => {
                // Radix's hidden native <select> reports "" when it is handed a
                // value whose option has not mounted yet — right after a CV is
                // imported and selected, before the list has caught up. No item
                // carries "", so it is never a choice: taking it would unselect
                // the CV that was just linked.
                if (!value) return
                field.onChange(value === NO_CV ? "" : value)
              }}
              value={field.value || NO_CV}
            >
              <FormControl>
                <SelectTrigger className="h-[44px] rounded-[10px] bg-white border-[#E2E8F0] text-[12px] text-[#374151] focus:ring-1 focus:ring-[#7C3AED]/30 focus:ring-offset-0">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <FileText size={16} className="text-[#7C3AED] shrink-0" />
                    <SelectValue placeholder={isLoading ? "Chargement des CV…" : "Sélectionner un CV existant"} />
                  </div>
                </SelectTrigger>
              </FormControl>
              <SelectContent className="bg-white border-[#E2E8F0] rounded-[8px] shadow-[var(--shadow-md)]">
                <SelectItem
                  value={NO_CV}
                  className="text-[12px] text-[#94A3B8] focus:bg-[#EDE9FE]"
                >
                  Aucun CV sélectionné
                </SelectItem>
                {cvs.map((cv) => (
                  <SelectItem
                    key={cv.id}
                    value={cv.id}
                    className="text-[12px] text-[#374151] focus:bg-[#EDE9FE] focus:text-[#7C3AED]"
                  >
                    {cv.name}
                    {cv.is_default && <span className="ml-2 text-[#94A3B8]">par défaut</span>}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItem>
        )}
      />

      <CVUploadZone />
    </div>
  )
}
