"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { logError } from "@/lib/logger"
import { useToast } from "@/hooks/useToast"
import { ME_QUERY_KEY } from "../_api/profil.api"
import { updateAiProvider } from "../_api/ai-provider.api"
import type { User } from "@/types"
import type { AiProviderFormValues } from "../_lib/ai-provider.schema"

export function useUpdateAiProvider() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: (values: AiProviderFormValues) => updateAiProvider(values),
    onSuccess: (updated) => {
      queryClient.setQueryData<User>([ME_QUERY_KEY], (old) =>
        old
          ? { ...old, ai_provider: updated.ai_provider, ai_model: updated.ai_model, ai_base_url: updated.ai_base_url }
          : old
      )
      toast.success("Provider IA mis à jour")
    },
    onError: (error) => {
      logError(error, "useUpdateAiProvider")
      toast.error("Impossible de sauvegarder le provider IA")
    },
  })
}
