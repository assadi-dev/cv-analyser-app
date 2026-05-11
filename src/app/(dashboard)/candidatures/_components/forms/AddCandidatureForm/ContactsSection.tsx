"use client"

import { useFormContext, useFieldArray } from "react-hook-form"
import { Plus, Trash2, User, Phone, Mail, ChevronDown } from "lucide-react"
import type { AddCandidatureFormValues } from "../../../_lib/add-candidature.schema"

function ContactTypeIcon({ index }: { index: number }) {
  const { watch } = useFormContext<AddCandidatureFormValues>()
  const type = watch(`contacts.${index}.contact_type`)
  return type === "email"
    ? <Mail size={13} className="text-[#7C3AED]" />
    : <Phone size={13} className="text-[#7C3AED]" />
}

export function ContactsSection() {
  const { register, control } = useFormContext<AddCandidatureFormValues>()
  const { fields, append, remove } = useFieldArray({ control, name: "contacts" })

  return (
    <div className="flex flex-col gap-[10px]">
      <div className="flex items-center">
        <p className="text-[12px] font-bold text-[#374151] tracking-[0.3px]">Contacts</p>
        <div className="flex-1" />
        <button
          type="button"
          onClick={() => append({ name: "", contact_type: "phone", value: "" })}
          className="flex items-center gap-1 px-[10px] py-1 rounded-[6px] bg-[#EDE9FE]"
        >
          <Plus size={12} className="text-[#7C3AED]" />
          <span className="text-[11px] font-semibold text-[#7C3AED]">Ajouter</span>
        </button>
      </div>

      {fields.map((field, i) => (
        <div
          key={field.id}
          className="flex flex-col gap-[8px] p-3 rounded-[10px] bg-[#F8FAFC] border border-[#E2E8F0]"
        >
          {/* Name + delete */}
          <div className="flex gap-[8px]">
            <div className="flex items-center gap-[8px] flex-1 h-[36px] px-[10px] rounded-[8px] bg-white border border-[#E2E8F0]">
              <User size={13} className="text-[#94A3B8] shrink-0" />
              <input
                {...register(`contacts.${i}.name`)}
                placeholder="Nom du contact"
                className="flex-1 text-[12px] text-[#374151] placeholder:text-[#94A3B8] bg-transparent outline-none"
              />
            </div>
            <button
              type="button"
              onClick={() => remove(i)}
              className="w-[30px] h-[30px] rounded-[6px] bg-[#FEE2E2] flex items-center justify-center shrink-0"
            >
              <Trash2 size={13} className="text-[#EF4444]" />
            </button>
          </div>

          {/* Type + value */}
          <div className="flex gap-[8px]">
            <div className="relative w-[130px] shrink-0">
              <div className="absolute left-[10px] top-1/2 -translate-y-1/2 pointer-events-none">
                <ContactTypeIcon index={i} />
              </div>
              <select
                {...register(`contacts.${i}.contact_type`)}
                className="w-full h-[36px] pl-8 pr-7 rounded-[8px] bg-white border border-[#E2E8F0] text-[12px] text-[#374151] outline-none appearance-none cursor-pointer"
              >
                <option value="phone">Téléphone</option>
                <option value="email">Email</option>
              </select>
              <ChevronDown size={12} className="absolute right-[10px] top-1/2 -translate-y-1/2 pointer-events-none text-[#94A3B8]" />
            </div>
            <input
              {...register(`contacts.${i}.value`)}
              placeholder="+33 6 00 00 00 00"
              className="flex-1 h-[36px] px-[10px] rounded-[8px] bg-white border border-[#E2E8F0] text-[12px] text-[#374151] placeholder:text-[#94A3B8] outline-none"
            />
          </div>
        </div>
      ))}
    </div>
  )
}
