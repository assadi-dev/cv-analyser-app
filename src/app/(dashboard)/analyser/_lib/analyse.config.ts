import { AlertTriangle, CheckCircle, Lightbulb } from "lucide-react"
import type { scoreColor } from "@/lib/utils"
import type { AnalyseStep, RecommendationType } from "@/types"

type ScoreTone = ReturnType<typeof scoreColor>

/** Libellés affichés pendant le streaming, par étape d'analyse. */
export const STEP_LABELS: Record<AnalyseStep, string> = {
  parsing: "Analyse des documents...",
  ats: "Calcul du score ATS...",
  scoring: "Évaluation sémantique...",
  recommendations: "Génération des recommandations...",
}

export function getStepLabel(step: AnalyseStep | null, fallback: string): string {
  return step ? STEP_LABELS[step] : fallback
}

/** Classe de couleur du texte selon le palier de score. */
export const SCORE_TEXT_CLASS: Record<ScoreTone, string> = {
  success: "text-[var(--color-success-text)]",
  warning: "text-[var(--color-warning-text)]",
  danger: "text-[var(--color-danger-text)]",
}

/** Verdict associé au score global. */
export const SCORE_VERDICT: Record<ScoreTone, string> = {
  success: "Excellent match !",
  warning: "Bon profil",
  danger: "Profil à améliorer",
}

/** Styles d'une recommandation IA selon son type. */
export const RECOMMENDATION_STYLES: Record<
  RecommendationType,
  { container: string; text: string; Icon: typeof Lightbulb }
> = {
  warning: {
    container: "bg-[var(--color-warning-light)] border-[#FED7AA]",
    text: "text-[var(--color-warning-text)]",
    Icon: AlertTriangle,
  },
  success: {
    container: "bg-[var(--color-success-light)] border-[#BBF7D0]",
    text: "text-[var(--color-success-text)]",
    Icon: CheckCircle,
  },
  info: {
    container: "bg-[var(--color-primary-light)] border-[#C7D2FE]",
    text: "text-[var(--color-primary)]",
    Icon: Lightbulb,
  },
}

/** Nombre maximum de mots-clés affichés dans le résumé. */
export const MAX_MISSING_KEYWORDS = 10
export const MAX_FOUND_KEYWORDS = 5
