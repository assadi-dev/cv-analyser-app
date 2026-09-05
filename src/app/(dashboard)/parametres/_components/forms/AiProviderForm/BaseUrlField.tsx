"use client"

import { useFormContext } from "react-hook-form"
import { Globe } from "lucide-react"
import { Input } from "@/components/ui/input"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import type { AiProviderFormValues } from "../../../_lib/ai-provider.schema"

export function BaseUrlField() {
  const form = useFormContext<AiProviderFormValues>()

  return (
    <FormField
      control={form.control}
      name="ai_base_url"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-[12px] font-semibold" style={{ color: "var(--color-text-secondary)" }}>
            URL du serveur local
          </FormLabel>
          <FormControl>
            <div className="relative">
              <Globe size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--color-text-subtle)" }} />
              <Input placeholder="http://localhost:11434" className="pl-9" {...field} />
            </div>
          </FormControl>
          <FormMessage className="text-[11px]" />
        </FormItem>
      )}
    />
  )
}
