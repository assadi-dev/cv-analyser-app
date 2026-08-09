"use client"

import { useSSE } from "@/hooks/useSSE"
import { useToast } from "@/hooks/useToast"
import { logError } from "@/lib/logger"
import { useAnalyseStore } from "@/store/analyse.store"
import type { SSEEvent, SSEResultEvent } from "@/types"
import { ANALYSE_STREAM_ENDPOINT } from "../_api/analyse.api"
import type { AnalyseResult } from "../_types"
import { string } from "zod"

interface UseAnalyseParams {
  cvFile: File | null
  jobDescription: string
}

/**
 * Orchestre le lancement de l'analyse :
 * upload CV + fiche de poste → stream SSE → store d'analyse.
 */
export function useAnalyse({ cvFile, jobDescription }: UseAnalyseParams) {
  const toast = useToast()
  const liveResult = useAnalyseStore((s) => s.liveResult)
  const currentAnalyse = useAnalyseStore((s) => s.currentAnalyse)
  const setLiveResult = useAnalyseStore((s) => s.setLiveResult)
  const setSavedAnalyseId = useAnalyseStore((s) => s.setSavedAnalyseId)
  const resetAnalyseStore = useAnalyseStore((s) => s.reset)

  function handleEvent(event: SSEEvent) {
    if (event.type === "result") {
      setLiveResult(event as SSEResultEvent)
    } else if (event.type === "done") {
      setSavedAnalyseId(event.analyse_id)
    } else if (event.type === "error") {
      logError(event.message, "useAnalyse")
      toast.error("L'analyse a échoué", event.message ?? "Erreur lors de l'analyse")
    }
  }

  const { state, start, reset: resetStream } = useSSE(handleEvent)

  const isStreaming = state.status === "streaming" || state.status === "connecting"
  const canAnalyse = cvFile !== null && jobDescription.trim().length > 0 && !isStreaming

  async function analyse() {
    if (!cvFile || !canAnalyse) return

    resetAnalyseStore()
    resetStream()

    try {
      await start(ANALYSE_STREAM_ENDPOINT, {
        job_description: jobDescription,
        cv_file: cvFile,
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
    recommandations: currentAnalyse?.recommandations ?? [],
    analyse_id: liveResult?.analyse_id ?? currentAnalyse?.id ?? null,



  } as AnalyseResult | null

  return {
    result: finalResult,
    isStreaming,
    canAnalyse,
    progress: state.progress,
    currentStep: state.currentStep,
    error: state.error,
    analyse,
  }
}
