import type { SSEResultEvent } from "@/types"

/** Résultat d'analyse affiché par l'UI (construit à partir des événements SSE). */
export type AnalyseResult = SSEResultEvent

/** Entrée du détail des scores (ATS, compétences, expérience). */
export interface ScoreItem {
  label: string
  value: number
}
