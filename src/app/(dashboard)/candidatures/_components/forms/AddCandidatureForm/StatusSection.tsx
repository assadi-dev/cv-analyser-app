"use client"

import { useFormContext } from "react-hook-form"
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

const STATUS_OPTIONS = [
  { value: "to_send",   label: "À envoyer",  dot: "#64748B" },
  { value: "sent",      label: "Envoyée",    dot: "#3B82F6" },
  { value: "interview", label: "Entretien",  dot: "#8B5CF6" },
  { value: "rejected",  label: "Refusée",    dot: "#EF4444" },
  { value: "accepted",  label: "Acceptée",   dot: "#10B981" },
]

const SELECT_TRIGGER_CLS = "h-[38px] rounded-[8px] bg-[#F8FAFC] border-[#E2E8F0] text-[12px] text-[#374151] focus:ring-1 focus:ring-[#7C3AED]/30 focus:ring-offset-0"
const SELECT_CONTENT_CLS = "bg-white border-[#E2E8F0] rounded-[8px] shadow-[var(--shadow-md)]"
const SELECT_ITEM_CLS = "text-[12px] text-[#374151] focus:bg-[#EDE9FE] focus:text-[#7C3AED] cursor-pointer"

export function StatusSection() {
  const form = useFormContext<AddCandidatureFormValues>()

  return (
    <div className="flex flex-col gap-3">
      <p className="text-[12px] font-bold text-[#374151] tracking-[0.3px]">Statut initial</p>

      <FormField
        control={form.control}
        name="status"
        render={({ field }) => {
          const dot = STATUS_OPTIONS.find((o) => o.value === field.value)?.dot ?? "#64748B"
          return (
            <FormItem className="space-y-0">
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className={SELECT_TRIGGER_CLS}>
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span
                        className="w-[7px] h-[7px] rounded-full shrink-0"
                        style={{ background: dot }}
                      />
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                </FormControl>
                <SelectContent className={SELECT_CONTENT_CLS}>
                  {STATUS_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value} className={SELECT_ITEM_CLS}>
                      <span className="flex items-center gap-2">
                        <span className="w-[7px] h-[7px] rounded-full shrink-0" style={{ background: o.dot }} />
                        {o.label}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )
        }}
      />
    </div>
  )
}
