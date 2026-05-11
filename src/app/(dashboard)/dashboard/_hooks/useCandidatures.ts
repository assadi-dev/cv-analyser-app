"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type { CandidatureStatus } from "@/types"
import { logError } from "@/lib/logger"
import { useToast } from "@/hooks/useToast"
import {
  CANDIDATURES_QUERY_KEY,
  fetchCandidatures,
  patchCandidatureStatus,
  type CandidaturesResponse,
} from "../_api/candidatures.api"

export function useCandidatures() {
  const { data, isLoading, error } = useQuery({
    queryKey: [CANDIDATURES_QUERY_KEY],
    queryFn: fetchCandidatures,
  })

  return {
    candidatures: data?.items ?? [],
    isLoading,
    error,
  }
}

export function useUpdateCandidatureStatus() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: CandidatureStatus }) =>
      patchCandidatureStatus(id, status),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: [CANDIDATURES_QUERY_KEY] })

      const previous = queryClient.getQueryData<CandidaturesResponse>([
        CANDIDATURES_QUERY_KEY,
      ])

      queryClient.setQueryData<CandidaturesResponse>(
        [CANDIDATURES_QUERY_KEY],
        (old) => {
          if (!old) return old
          return {
            ...old,
            items: old.items.map((c) =>
              c.id === id ? { ...c, status } : c
            ),
          }
        }
      )

      return { previous }
    },
    onError: (error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData([CANDIDATURES_QUERY_KEY], context.previous)
      }
      logError(error, "useUpdateCandidatureStatus")
      toast.error("Impossible de mettre à jour le statut")
    },
    onSuccess: () => {
      toast.success("Statut mis à jour")
    },
  })
}
