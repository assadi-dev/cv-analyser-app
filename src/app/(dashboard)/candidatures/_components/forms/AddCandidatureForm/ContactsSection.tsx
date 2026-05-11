"use client"

import { useFormContext, useFieldArray } from "react-hook-form"
import { Plus, Trash2, User, Phone, Mail } from "lucide-react"
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

const INPUT_CLS = "h-[36px] rounded-[8px] bg-white border-[#E2E8F0] text-[12px] text-[#374151] placeholder:text-[#94A3B8] focus-visible:ring-1 focus-visible:ring-[#7C3AED]/30 focus-visible:ring-offset-0"
const SELECT_TRIGGER_CLS = "h-[36px] rounded-[8px] bg-white border-[#E2E8F0] text-[12px] text-[#374151] focus:ring-1 focus:ring-[#7C3AED]/30 focus:ring-offset-0"
const SELECT_CONTENT_CLS = "bg-white border-[#E2E8F0] rounded-[8px] shadow-[var(--shadow-md)]"
const SELECT_ITEM_CLS = "text-[12px] text-[#374151] focus:bg-[#EDE9FE] focus:text-[#7C3AED] cursor-pointer"

function ContactTypeIcon({ index }: { index: number }) {
  const { watch } = useFormContext<AddCandidatureFormValues>()
  const type = watch(`contacts.${index}.contact_type`)
  return type === "email"
    ? <Mail size={13} className="text-[#7C3AED]" />
    : <Phone size={13} className="text-[#7C3AED]" />
}

export function ContactsSection() {
  const form = useFormContext<AddCandidatureFormValues>()
  const { fields, append, remove } = useFieldArray({ control: form.control, name: "contacts" })

  return (
    <div className="flex flex-col gap-3">
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
          className="flex flex-col gap-2 p-3 rounded-[10px] bg-[#F8FAFC] border border-[#E2E8F0]"
        >
          {/* Name + delete */}
          <div className="flex gap-2">
            <FormField
              control={form.control}
              name={`contacts.${i}.name`}
              render={({ field: f }) => (
                <FormItem className="flex-1 space-y-0">
                  <FormControl>
                    <div className="flex items-center gap-2 h-[36px] px-[10px] rounded-[8px] bg-white border border-[#E2E8F0] focus-within:ring-1 focus-within:ring-[#7C3AED]/30">
                      <User size={13} className="text-[#94A3B8] shrink-0" />
                      <input
                        {...f}
                        placeholder="Nom du contact"
                        className="flex-1 text-[12px] text-[#374151] placeholder:text-[#94A3B8] bg-transparent outline-none"
                      />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
            <button
              type="button"
              onClick={() => remove(i)}
              className="w-[30px] h-[30px] rounded-[6px] bg-[#FEE2E2] flex items-center justify-center shrink-0"
            >
              <Trash2 size={13} className="text-[#EF4444]" />
            </button>
          </div>

          {/* Type + value */}
          <div className="flex gap-2">
            <FormField
              control={form.control}
              name={`contacts.${i}.contact_type`}
              render={({ field: f }) => (
                <FormItem className="w-[130px] shrink-0 space-y-0">
                  <Select onValueChange={f.onChange} value={f.value}>
                    <FormControl>
                      <SelectTrigger className={SELECT_TRIGGER_CLS}>
                        <div className="flex items-center gap-1.5 flex-1 min-w-0">
                          <ContactTypeIcon index={i} />
                          <SelectValue />
                        </div>
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className={SELECT_CONTENT_CLS}>
                      <SelectItem value="phone" className={SELECT_ITEM_CLS}>Téléphone</SelectItem>
                      <SelectItem value="email" className={SELECT_ITEM_CLS}>Email</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`contacts.${i}.value`}
              render={({ field: f }) => (
                <FormItem className="flex-1 space-y-0">
                  <FormControl>
                    <Input
                      {...f}
                      placeholder="+33 6 00 00 00 00"
                      className={INPUT_CLS}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
