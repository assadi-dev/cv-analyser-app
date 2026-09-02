/**
 * Zustand store for the ongoing analysis session.
 * Persists the latest result so the UI stays populated after streaming.
 */

import { create } from "zustand"
import type { Analyse, SSEResultEvent } from "@/types"

interface AnalyseStore {
  // Live result (built from SSE events)
  liveResult: SSEResultEvent | null
  // Persisted analyse ID after streaming completes
  savedAnalyseId: string | null
  // Full analyse loaded from API (for chat, re-viewing)
  currentAnalyse: Analyse | null

  setLiveResult: (result: SSEResultEvent) => void
  setSavedAnalyseId: (id: string) => void
  setCurrentAnalyse: (analyse: Analyse) => void
  reset: () => void
}

export const useAnalyseStore = create<AnalyseStore>((set) => ({
  liveResult: null,
  savedAnalyseId: null,
  currentAnalyse: null,

  setLiveResult: (result) => set({ liveResult: result }),
  setSavedAnalyseId: (id) => set({ savedAnalyseId: id }),
  setCurrentAnalyse: (analyse) => set({ currentAnalyse: analyse }),
  reset: () => set({ liveResult: null, savedAnalyseId: null, currentAnalyse: null }),
}))
