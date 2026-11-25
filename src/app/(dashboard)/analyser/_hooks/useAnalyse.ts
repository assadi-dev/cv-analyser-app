"use client"

import { useRef, useState } from "react"
import { useSSE } from "@/hooks/useSSE"
import { useToast } from "@/hooks/useToast"
import { logError } from "@/lib/logger"
import { useAnalyseStore } from "@/store/analyse.store"
import type { SSEEvent, SSEResultEvent } from "@/types"
import { ANALYSE_STREAM_ENDPOINT } from "../_api/analyse.api"
import { CV_TEXT_UNREADABLE, describeAnalyseError } from "../_lib/analyse-errors"
import type { AnalyseResult } from "../_types"
import { string } from "zod"

interface UseAnalyseParams {
  cvFile: File | null
  jobDescription: string
  /** Candidature to attach the analysis to. Omit for a standalone analysis. */
  candidatureId?: string
  /**
   * The CV already stored for that candidature. Used when no file is chosen,
   * so launching from a candidature does not mean uploading its CV again.
   */
  linkedCvId?: string
}

/**
 * Orchestre le lancement de l'analyse :
 * upload CV + fiche de poste → stream SSE → store d'analyse.
 */
export function useAnalyse({ cvFile, jobDescription, candidatureId, linkedCvId }: UseAnalyseParams) {
  const toast = useToast()
  const liveResult = useAnalyseStore((s) => s.liveResult)
  const currentAnalyse = useAnalyseStore((s) => s.currentAnalyse)
  const setLiveResult = useAnalyseStore((s) => s.setLiveResult)
  const setSavedAnalyseId = useAnalyseStore((s) => s.setSavedAnalyseId)
  const resetAnalyseStore = useAnalyseStore((s) => s.reset)

  // The stored CV the last request went out with — `undefined` when a file was
  // sent. Tells an error about "the linked CV" from one about "this PDF".
  const sentStoredCvRef = useRef<string | undefined>(undefined)
  // A linked CV the server could not read: it is not worth sending again.
  const [unreadableCvId, setUnreadableCvId] = useState<string | null>(null)

  function handleEvent(event: SSEEvent) {
    if (event.type === "result") {
      setLiveResult(event as SSEResultEvent)
    } else if (event.type === "done") {
      setSavedAnalyseId(event.analyse_id)
      if (candidatureId) toast.success("Analyse rattachée à la candidature")
    } else if (event.type === "error") {
      const code = "error_code" in event ? event.error_code : undefined
      // An unreadable CV is something the user fixes, already explained below:
      // logging it as an error would only raise a false alarm in development.
      if (code !== CV_TEXT_UNREADABLE) logError(event.message, "useAnalyse")
      const usedStoredCv = sentStoredCvRef.current !== undefined
      const { title, description } = describeAnalyseError(
        code,
        event.message ?? "Erreur lors de l'analyse",
        { usedStoredCv }
      )
      toast.error(title, description)
      if (code === CV_TEXT_UNREADABLE && sentStoredCvRef.current) {
        setUnreadableCvId(sentStoredCvRef.current)
      }
    }
  }

  const { state, start, reset: resetStream } = useSSE(handleEvent)

  const isStreaming = state.status === "streaming" || state.status === "connecting"
  const isLinkedCvUnreadable = Boolean(linkedCvId) && linkedCvId === unreadableCvId
  // An unreadable linked CV only counts again once the user brings a file.
  const hasCv = cvFile !== null || (Boolean(linkedCvId) && !isLinkedCvUnreadable)
  const canAnalyse = hasCv && jobDescription.trim().length > 0 && !isStreaming

  async function analyse() {
    if (!canAnalyse) return

    resetAnalyseStore()
    resetStream()
    sentStoredCvRef.current = cvFile ? undefined : linkedCvId

    try {
      await start(ANALYSE_STREAM_ENDPOINT, {
        job_description: jobDescription,
        // A file chosen for this analysis replaces the stored CV.
        cv_file: cvFile ?? undefined,
        cv_id: cvFile ? undefined : linkedCvId,
        candidature_id: candidatureId,
      })
    } catch (error) {
      logError(error, "useAnalyse.analyse")
      toast.error("Impossible de lancer l'analyse")
    }
  }

  const finalResult = {

    type: "result",
    score_global: liveResult?.score_global ?? currentAnalyse?.score_global ?? 0,
    score_ats: liveResult?.score_ats ?? currentAnalyse?.score_ats ?? 0,
    score_competences: liveResult?.score_competences ?? currentAnalyse?.score_competences ?? 0,
    score_experience: liveResult?.score_experience ?? currentAnalyse?.score_experience ?? 0,
    keywords_found: liveResult?.keywords_found ?? currentAnalyse?.keywords_found ?? [],
    keywords_missing: liveResult?.keywords_missing ?? currentAnalyse?.keywords_missing ?? [],
    recommandations: liveResult?.recommandations ?? currentAnalyse?.recommandations ?? [],
    analyse_id: liveResult?.analyse_id ?? currentAnalyse?.id ?? null,



  } as AnalyseResult | null

  return {
    result: finalResult,
    isStreaming,
    canAnalyse,
    /** The CV linked to the candidature could not be read: a file is needed. */
    isLinkedCvUnreadable,
    progress: state.progress,
    currentStep: state.currentStep,
    error: state.error,
    analyse,
  }
}
