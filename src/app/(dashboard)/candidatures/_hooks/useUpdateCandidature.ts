"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { logError } from "@/lib/logger"
import { useToast } from "@/hooks/useToast"
import { KANBAN_QUERY_KEY } from "@/app/(dashboard)/dashboard/_api/kanban.api"
import {
  CANDIDATURES_QUERY_KEY,
  updateCandidature,
  type UpdateCandidaturePayload,
} from "../_api/candidatures.api"
import type { PaginatedResponse, CandidatureSummary } from "@/types"

interface UpdateCandidatureVariables {
  id: string
  payload: UpdateCandidaturePayload
}

export function useUpdateCandidature() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: ({ id, payload }: UpdateCandidatureVariables) =>
      updateCandidature(id, payload),
    onSuccess: (updated) => {
      // Patch the row in place so the table shows the change right away,
      // then refetch to settle on the server's version.
      queryClient.setQueriesData<PaginatedResponse<CandidatureSummary>>(
        { queryKey: [CANDIDATURES_QUERY_KEY] },
        (old) =>
          old && {
            ...old,
            items: old.items.map((item) =>
              item.id === updated.id ? { ...item, ...updated } : item
            ),
          }
      )
      queryClient.invalidateQueries({ queryKey: [CANDIDATURES_QUERY_KEY] })
      // The dashboard board shows the same candidatures: a renamed company or
      // a new status must not wait for its next refresh.
      queryClient.invalidateQueries({ queryKey: [KANBAN_QUERY_KEY] })
      toast.success("Candidature modifiée")
    },
    onError: (error) => {
      logError(error, "useUpdateCandidature")
      toast.error("Impossible de modifier la candidature")
    },
  })
}
