"use client"

import { useState } from "react"

/** Gère la sélection du fichier CV (PDF) côté client. */
export function useCvUpload() {
  const [cvFile, setCvFile] = useState<File | null>(null)

  function selectCv(file: File | null) {
    setCvFile(file)
  }

  function clearCv() {
    setCvFile(null)
  }

  return { cvFile, hasCv: cvFile !== null, selectCv, clearCv }
}
