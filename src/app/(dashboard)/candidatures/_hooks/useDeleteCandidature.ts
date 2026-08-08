"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { logError } from "@/lib/logger"
import { useToast } from "@/hooks/useToast"
import { CANDIDATURES_QUERY_KEY, deleteCandidature } from "../_api/candidatures.api"
import type { PaginatedResponse, CandidatureSummary } from "@/types"

export function useDeleteCandidature() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: (ids: string[]) => deleteCandidature(ids),
    onSuccess: (_data, ids) => {
      queryClient.setQueriesData<PaginatedResponse<CandidatureSummary>>(
        { queryKey: [CANDIDATURES_QUERY_KEY] },
        (old) => {
          if (!old) return old
          return {
            ...old,
            items: old.items.filter((item) => !ids.includes(item.id)),
            total: Math.max(0, old.total - ids.length),
          }
        }
      )
      queryClient.invalidateQueries({ queryKey: [CANDIDATURES_QUERY_KEY] })
      toast.success("Candidature supprimée")
    },
    onError: (error) => {
      logError(error, "useDeleteCandidature")
      toast.error("Impossible de supprimer la candidature")
    },
  })
}
