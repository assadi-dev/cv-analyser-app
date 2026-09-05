"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/Button"
import { getAIProvider } from "../../../_lib/ai-providers.config"
import {
  aiProviderSchema,
  getAiProviderDefaults,
  type AiProviderFormValues,
} from "../../../_lib/ai-provider.schema"
import { useTestAiProvider } from "../../../_hooks/useTestAiProvider"
import { ProviderList } from "../../Ai/ProviderList"
import { ProviderBadge } from "../../Ai/ProviderBadge"
import { ProviderStatusBadge } from "../../Ai/ProviderStatusBadge"
import { ApiKeyField } from "./ApiKeyField"
import { BaseUrlField } from "./BaseUrlField"
import { ModelSelectField } from "./ModelSelectField"
import { TestConnectionButton } from "./TestConnectionButton"
import type { AIProvider, User } from "@/types"

interface AiProviderFormProps {
  profil: User | undefined
  onSubmit: (values: AiProviderFormValues) => void
  isPending: boolean
}

export function AiProviderForm({ profil, onSubmit, isPending }: AiProviderFormProps) {
  const form = useForm<AiProviderFormValues>({
    resolver: zodResolver(aiProviderSchema),
    defaultValues: getAiProviderDefaults(),
  })
  const testMutation = useTestAiProvider()

  useEffect(() => {
    if (!profil) return
    form.reset(
      getAiProviderDefaults({
        ai_provider: profil.ai_provider,
        ai_model: profil.ai_model,
        ai_base_url: profil.ai_base_url,
      })
    )
  }, [profil, form])

  const providerId = form.watch("ai_provider")
  const provider = getAIProvider(providerId)

  function handleSelectProvider(id: AIProvider) {
    const next = getAIProvider(id)
    form.setValue("ai_provider", id, { shouldDirty: true })
    form.setValue("ai_model", next.models[0] ?? "", { shouldDirty: true })
    form.setValue("ai_api_key", "", { shouldDirty: true })
    form.setValue("ai_base_url", next.local ? next.defaultBaseUrl ?? "" : "", { shouldDirty: true })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col md:flex-row gap-0 rounded-[10px] overflow-hidden border" style={{ borderColor: "var(--color-border)" }}>
        <ProviderList selected={providerId} onSelect={handleSelectProvider} />

        <div className="flex-1 p-6 flex flex-col gap-5">
          <div className="flex items-center gap-3">
            <ProviderBadge label={provider.label} color={provider.color} size="md" />
            <div>
              <p className="text-[16px] font-bold" style={{ color: "var(--color-text-primary)" }}>{provider.label}</p>
              <p className="text-[12px]" style={{ color: "var(--color-text-muted)" }}>
                {provider.models.join(" · ")}
              </p>
            </div>
            <ProviderStatusBadge result={testMutation.data} />
          </div>

          <div className="h-px" style={{ background: "var(--color-border)" }} />

          {provider.local && <BaseUrlField />}
          <ApiKeyField />
          <ModelSelectField />

          <TestConnectionButton
            onTest={() => testMutation.mutate()}
            isPending={testMutation.isPending}
            result={testMutation.data}
          />

          {provider.local && (
            <div className="flex items-center gap-2 p-3 rounded-[8px]" style={{ background: "var(--color-surface-muted)" }}>
              <span className="text-[11px]" style={{ color: "var(--color-text-muted)" }}>
                Un serveur Ollama local ne nécessite pas de clé API. Renseignez-la uniquement si vous utilisez Ollama Cloud.
              </span>
            </div>
          )}

          <div className="flex justify-end">
            <Button type="submit" size="md" loading={isPending}>
              Sauvegarder
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}
