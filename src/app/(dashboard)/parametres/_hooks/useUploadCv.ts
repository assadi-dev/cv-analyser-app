"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { logError } from "@/lib/logger"
import { useToast } from "@/hooks/useToast"
import type { CVSummary } from "@/types"
import { CVS_QUERY_KEY, uploadCv } from "../_api/cvs.api"

/** Imports a CV and adds it to the list of the user's CVs. */
export function useUploadCv() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: uploadCv,
    onSuccess: (cv) => {
      // Put it in the list right away: a form that selects the new CV must find
      // it there, and the refetch below can take a moment.
      queryClient.setQueryData<CVSummary[]>([CVS_QUERY_KEY], (existing = []) =>
        existing.some((item) => item.id === cv.id) ? existing : [...existing, cv]
      )
      queryClient.invalidateQueries({ queryKey: [CVS_QUERY_KEY] })
      toast.success("CV importé", cv.name)
    },
    onError: (error) => {
      logError(error, "useUploadCv")
      toast.error("Impossible d'importer le CV")
    },
  })
}
