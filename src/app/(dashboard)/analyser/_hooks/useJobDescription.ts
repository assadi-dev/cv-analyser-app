"use client"

import { useEffect, useState } from "react"
import { useAnalyseStore } from "@/store/analyse.store"

/** Gère la saisie de la fiche de poste et sa validation. */
export function useJobDescription() {

  const currentAnalyse = useAnalyseStore(s => s.currentAnalyse)
  const [jobDescription, setJobDescription] = useState<string>("")

  function clearJobDescription() {
    setJobDescription("")
  }

  useEffect(() => {
    if (currentAnalyse?.job_description) {
      setJobDescription(currentAnalyse.job_description)
    }
  }, [currentAnalyse?.job_description])

  return {
    jobDescription,
    setJobDescription,
    clearJobDescription,
    isJobDescriptionValid: jobDescription.trim().length > 0,
  }
}
