"use client"

import { useSSE } from "@/hooks/useSSE"
import { useToast } from "@/hooks/useToast"
import { logError } from "@/lib/logger"
import { useAnalyseStore } from "@/store/analyse.store"
import type { SSEEvent, SSEResultEvent } from "@/types"
import { ANALYSE_STREAM_ENDPOINT } from "../_api/analyse.api"
import type { AnalyseResult } from "../_types"

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
      toast.error("L'analyse a échoué", event.message)
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

  return {
    result: liveResult as AnalyseResult | null,
    isStreaming,
    canAnalyse,
    progress: state.progress,
    currentStep: state.currentStep,
    error: state.error,
    analyse,
  }
}
