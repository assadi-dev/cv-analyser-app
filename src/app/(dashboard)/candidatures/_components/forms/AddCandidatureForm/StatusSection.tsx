"use client"

import { useFormContext } from "react-hook-form"
import { ChevronDown } from "lucide-react"
import type { AddCandidatureFormValues } from "../../../_lib/add-candidature.schema"

const STATUS_OPTIONS = [
  { value: "to_send",   label: "À envoyer",  dot: "#64748B" },
  { value: "sent",      label: "Envoyée",    dot: "#3B82F6" },
  { value: "interview", label: "Entretien",  dot: "#8B5CF6" },
  { value: "rejected",  label: "Refusée",    dot: "#EF4444" },
  { value: "accepted",  label: "Acceptée",   dot: "#10B981" },
]

export function StatusSection() {
  const { register, watch } = useFormContext<AddCandidatureFormValues>()
  const current = watch("status")
  const dot = STATUS_OPTIONS.find((o) => o.value === current)?.dot ?? "#64748B"

  return (
    <div className="flex flex-col gap-[8px]">
      <p className="text-[12px] font-bold text-[#374151] tracking-[0.3px]">Statut initial</p>

      <div className="relative">
        <div
          className="absolute left-3 top-1/2 -translate-y-1/2 w-[7px] h-[7px] rounded-full pointer-events-none"
          style={{ background: dot }}
        />
        <select
          {...register("status")}
          className="w-full h-[38px] pl-8 pr-8 rounded-[8px] bg-[#F8FAFC] border border-[#E2E8F0] text-[12px] text-[#374151] outline-none appearance-none cursor-pointer"
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#94A3B8]" />
      </div>
    </div>
  )
}
