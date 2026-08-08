"use client"

import { useFormContext } from "react-hook-form"
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
  FormMessage,
} from "@/components/ui/form"
import type { AddCandidatureFormValues } from "../../../_lib/add-candidature.schema"

const FIELD_CLS = "h-[38px] rounded-[8px] bg-[#F8FAFC] border-[#E2E8F0] text-[12px] text-[#374151] placeholder:text-[#94A3B8] focus-visible:ring-1 focus-visible:ring-[#7C3AED]/30 focus-visible:ring-offset-0"
const SELECT_TRIGGER_CLS = "h-[38px] rounded-[8px] bg-[#F8FAFC] border-[#E2E8F0] text-[12px] text-[#374151] focus:ring-1 focus:ring-[#7C3AED]/30 focus:ring-offset-0"
const SELECT_CONTENT_CLS = "bg-white border-[#E2E8F0] rounded-[8px] shadow-[var(--shadow-md)] text-[12px]"
const SELECT_ITEM_CLS = "text-[12px] text-[#374151] focus:bg-[#EDE9FE] focus:text-[#7C3AED] cursor-pointer"

export function JobSection() {
  const form = useFormContext<AddCandidatureFormValues>()

  return (
    <div className="flex flex-col gap-3">
      <p className="text-[12px] font-bold text-[#374151] tracking-[0.3px]">Poste</p>

      <FormField
        control={form.control}
        name="job_title"
        render={({ field }) => (
          <FormItem className="space-y-1">
            <FormControl>
              <Input placeholder="Intitulé du poste" className={FIELD_CLS} {...field} />
            </FormControl>
            <FormMessage className="text-[11px]" />
          </FormItem>
        )}
      />

      <div className="flex gap-2">
        <FormField
          control={form.control}
          name="contract_type"
          render={({ field }) => (
            <FormItem className="flex-1 space-y-0">
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className={SELECT_TRIGGER_CLS}>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className={SELECT_CONTENT_CLS}>
                  {["CDI", "CDD", "Freelance", "Stage", "Alternance"].map((v) => (
                    <SelectItem key={v} value={v} className={SELECT_ITEM_CLS}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="work_mode"
          render={({ field }) => (
            <FormItem className="flex-1 space-y-0">
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className={SELECT_TRIGGER_CLS}>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className={SELECT_CONTENT_CLS}>
                  <SelectItem value="remote" className={SELECT_ITEM_CLS}>Télétravail</SelectItem>
                  <SelectItem value="hybrid" className={SELECT_ITEM_CLS}>Hybride</SelectItem>
                  <SelectItem value="on-site" className={SELECT_ITEM_CLS}>Présentiel</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
