"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { logError } from "@/lib/logger"
import { useToast } from "@/hooks/useToast"
import { CANDIDATURES_QUERY_KEY, deleteCandidature } from "../_api/candidatures.api"

export function useDeleteCandidature() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: (ids: string[]) => deleteCandidature(ids),
    onError: (error) => {
      logError(error, "useDeleteCandidature")
      toast.error("Impossible de supprimer la candidature")
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CANDIDATURES_QUERY_KEY] })
      toast.success("Candidature supprimée")
    },
  })
}
