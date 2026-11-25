"use client"

import { useCallback, useState } from "react"
import { useCvs } from "@/app/(dashboard)/parametres/_hooks/useCvs"

/**
 * Which of the user's stored CVs the analysis runs on.
 *
 * Until the user picks one, the selection follows the CV linked to the
 * candidature the page was opened from (if any). Once they pick, their
 * choice wins, even if the linked CV arrives later.
 */
export function useStoredCvSelection(linkedCvId: string | undefined) {
  const { cvs, isLoading } = useCvs()
  const [chosenCvId, setChosenCvId] = useState<string | undefined>(undefined)

  const selectStoredCv = useCallback((id: string) => setChosenCvId(id), [])

  return {
    /** The user's stored CVs. The select is only worth showing when there are some. */
    cvs,
    isLoading,
    selectedCvId: chosenCvId ?? linkedCvId,
    selectStoredCv,
  }
}
