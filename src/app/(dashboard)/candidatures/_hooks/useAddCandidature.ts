"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { logError } from "@/lib/logger"
import { useToast } from "@/hooks/useToast"
import {
  CANDIDATURES_QUERY_KEY,
  createCandidature,
  type CreateCandidaturePayload,
} from "../_api/candidatures.api"
import type { AddCandidatureFormValues } from "../_lib/add-candidature.schema"

function toPayload(values: AddCandidatureFormValues): CreateCandidaturePayload {
  return {
    company_name:    values.company_name,
    company_city:    values.company_city || null,
    job_title:       values.job_title,
    contract_type:   values.contract_type,
    work_mode:       values.work_mode,
    source_platform: values.source_platform || null,
    source_name:     values.source_name || null,
    source_url:      values.source_url || null,
    status:          values.status,
    notes:           values.notes || null,
    cv_id:           values.cv_id || null,
    contacts:        values.contacts,
  }
}

export function useAddCandidature() {
  const queryClient = useQueryClient()
  const toast = useToast()

  return useMutation({
    mutationFn: (values: AddCandidatureFormValues) =>
      createCandidature(toPayload(values)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CANDIDATURES_QUERY_KEY] })
      toast.success("Candidature ajoutée")
    },
    onError: (error) => {
      logError(error, "useAddCandidature")
      toast.error("Impossible d'ajouter la candidature")
    },
  })
}
