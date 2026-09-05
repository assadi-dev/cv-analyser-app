"use client"

import { useFormContext, useWatch } from "react-hook-form"
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Combobox } from "@/components/ui/combobox"
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
            <Combobox
              value={field.value}
              onChange={field.onChange}
              options={models}
              placeholder="Sélectionner un modèle"
              searchPlaceholder="Rechercher ou saisir un modèle..."
              emptyText="Aucun modèle correspondant — vous pouvez saisir le vôtre."
            />
          </FormControl>
          <FormMessage className="text-[11px]" />
        </FormItem>
      )}
    />
  )
}
