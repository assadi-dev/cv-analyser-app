"use client"

import { useState } from "react"

/** Gère la saisie de la fiche de poste et sa validation. */
export function useJobDescription() {
  const [jobDescription, setJobDescription] = useState("")

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
