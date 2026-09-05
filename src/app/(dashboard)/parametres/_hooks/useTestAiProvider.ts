"use client"

import { useMutation } from "@tanstack/react-query"
import { logError } from "@/lib/logger"
import { useToast } from "@/hooks/useToast"
import { testAiProvider } from "../_api/ai-provider.api"

export function useTestAiProvider() {
  const toast = useToast()

  return useMutation({
    mutationFn: testAiProvider,
    onError: (error) => {
      logError(error, "useTestAiProvider")
      toast.error("Impossible de tester la connexion")
    },
  })
}
