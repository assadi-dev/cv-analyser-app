"use client"

import { useFormContext } from "react-hook-form"
import { Layers, Link, ExternalLink } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  FormField,
  FormItem,
  FormControl,
} from "@/components/ui/form"
import type { AddCandidatureFormValues } from "../../../_lib/add-candidature.schema"

const SOURCE_PLATFORMS = [
  "LinkedIn",
  "Welcome to the Jungle",
  "Indeed",
  "Monster",
  "JobTeaser",
  "Autre",
]

const SELECT_TRIGGER_CLS = "h-[38px] rounded-[8px] bg-[#F8FAFC] border-[#E2E8F0] text-[12px] text-[#374151] focus:ring-1 focus:ring-[#7C3AED]/30 focus:ring-offset-0"
const SELECT_CONTENT_CLS = "bg-white border-[#E2E8F0] rounded-[8px] shadow-[var(--shadow-md)]"
const SELECT_ITEM_CLS = "text-[12px] text-[#374151] focus:bg-[#EDE9FE] focus:text-[#7C3AED] cursor-pointer"
const FIELD_CLS = "h-[38px] rounded-[8px] bg-[#F8FAFC] border-[#E2E8F0] text-[12px] text-[#374151] placeholder:text-[#94A3B8] focus-visible:ring-1 focus-visible:ring-[#7C3AED]/30 focus-visible:ring-offset-0"

export function SourceSection() {
  const form = useFormContext<AddCandidatureFormValues>()

  return (
    <div className="flex flex-col gap-3">
      <p className="text-[12px] font-bold text-[#374151] tracking-[0.3px]">Source de l'offre</p>

      <div className="flex gap-2">
        <FormField
          control={form.control}
          name="source_platform"
          render={({ field }) => (
            <FormItem className="w-[150px] shrink-0 space-y-0">
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className={SELECT_TRIGGER_CLS}>
                    <div className="flex items-center gap-1.5 flex-1 min-w-0">
                      <Layers size={13} className="text-[#7C3AED] shrink-0" />
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                </FormControl>
                <SelectContent className={SELECT_CONTENT_CLS}>
                  {SOURCE_PLATFORMS.map((p) => (
                    <SelectItem key={p} value={p} className={SELECT_ITEM_CLS}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="source_name"
          render={({ field }) => (
            <FormItem className="flex-1 space-y-0">
              <FormControl>
                <Input
                  placeholder="Nom de l'offre (optionnel)"
                  className={FIELD_CLS}
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="source_url"
        render={({ field }) => (
          <FormItem className="space-y-0">
            <FormControl>
              <div className="flex items-center gap-2 h-[38px] px-3 rounded-[8px] bg-[#F8FAFC] border border-[#E2E8F0] focus-within:ring-1 focus-within:ring-[#7C3AED]/30">
                <Link size={13} className="text-[#94A3B8] shrink-0" />
                <input
                  {...field}
                  placeholder="https://linkedin.com/jobs/..."
                  className="flex-1 text-[12px] text-[#374151] placeholder:text-[#94A3B8] bg-transparent outline-none"
                />
                <button
                  type="button"
                  className="w-[26px] h-[26px] rounded-[6px] bg-[#EDE9FE] flex items-center justify-center shrink-0"
                >
                  <ExternalLink size={12} className="text-[#7C3AED]" />
                </button>
              </div>
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  )
}
