"use client"

import { useFormContext, useWatch } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { getAIProvider } from "../../../_lib/ai-providers.config"
import type { AiProviderFormValues } from "../../../_lib/ai-provider.schema"

export function ModelSelectField() {
  const form = useFormContext<AiProviderFormValues>()
  const providerId = useWatch({ control: form.control, name: "ai_provider" })
  const models = getAIProvider(providerId).models

  return (
    <FormField
      control={form.control}
      name="ai_model"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-[12px] font-semibold" style={{ color: "var(--color-text-secondary)" }}>
            Modèle par défaut
          </FormLabel>
          <FormControl>
            <select
              {...field}
              className="h-10 px-3 rounded-[8px] text-[13px] border outline-none w-full"
              style={{ background: "var(--color-surface-muted)", borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}
            >
              {models.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </FormControl>
          <FormMessage className="text-[11px]" />
        </FormItem>
      )}
    />
  )
}
