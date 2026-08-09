"use client"

import { useState } from "react"
import { useAnalyseStore } from "@/store/analyse.store"

/** Gère la saisie de la fiche de poste et sa validation. */
export function useJobDescription() {

  const currentAnalyse = useAnalyseStore(s => s.currentAnalyse)

  const [jobDescription, setJobDescription] = useState<string>(currentAnalyse?.job_description ?? "")

  function clearJobDescription() {
    setJobDescription("")
  }

  return {
    jobDescription,
    setJobDescription,
    clearJobDescription,
    isJobDescriptionValid: jobDescription.trim().length > 0,
  }
}
