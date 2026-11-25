"use client"

import { useCallback, useMemo, useState } from "react"
import { useAddCandidature } from "@/app/(dashboard)/candidatures/_hooks/useAddCandidature"
import {
  CANDIDATURE_FORM_DEFAULTS,
  type CandidatureFormValues,
} from "@/app/(dashboard)/candidatures/_lib/candidature.schema"
import { logError } from "@/lib/logger"

/** Where the "add to my candidatures" flow is: nothing, asking, or filling the form. */
type AddToCandidaturesStep = "closed" | "confirm" | "form"

interface UseAddToCandidaturesParams {
  /** The offer the analysis ran on: pre-fills the candidature's job description. */
  jobDescription: string
  /** The CV the analysis ran on, when it is a stored one. */
  cvId?: string | null
}

/**
 * Turns the current analysis into a candidature in two moves: a confirmation,
 * then the usual "add candidature" form, pre-filled from the analysis.
 */
export function useAddToCandidatures({ jobDescription, cvId }: UseAddToCandidaturesParams) {
  const [step, setStep] = useState<AddToCandidaturesStep>("closed")
  const { mutate: addCandidature, isPending } = useAddCandidature()

  const initialValues = useMemo<CandidatureFormValues>(
    () => ({
      ...CANDIDATURE_FORM_DEFAULTS,
      job_description: jobDescription,
      cv_id: cvId ?? "",
    }),
    [jobDescription, cvId]
  )

  const start = useCallback(() => setStep("confirm"), [])
  const close = useCallback(() => setStep("closed"), [])
  const confirm = useCallback(() => setStep("form"), [])

  const submit = useCallback(
    (values: CandidatureFormValues) => {
      try {
        addCandidature(values, { onSuccess: close })
      } catch (error) {
        logError(error, "useAddToCandidatures.submit")
      }
    },
    [addCandidature, close]
  )

  return {
    isConfirmOpen: step === "confirm",
    isFormOpen: step === "form",
    initialValues,
    isPending,
    start,
    close,
    confirm,
    submit,
  }
}
