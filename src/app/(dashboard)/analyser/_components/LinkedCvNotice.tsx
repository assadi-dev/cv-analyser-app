import { FileCheck2, FileWarning } from "lucide-react"
import { cn } from "@/lib/utils"

/** What becomes of the linked CV in the analysis about to be launched. */
export type LinkedCvState = "used" | "replaced" | "unreadable"

interface LinkedCvNoticeProps {
  /** Name of the CV linked to the candidature, once known. */
  name: string | undefined
  state: LinkedCvState
}

const COPY: Record<LinkedCvState, string> = {
  used: "Utilisé pour l'analyse. Choisissez un autre PDF pour le remplacer.",
  replaced: "Le fichier choisi ci-dessous remplace ce CV pour cette analyse.",
  unreadable:
    "Aucun texte n'a pu être lu dans ce CV (PDF scanné ou protégé ?). Choisissez un autre PDF pour cette analyse.",
}

/** Tells which CV the analysis will run on when the page was opened from a candidature. */
export function LinkedCvNotice({ name, state }: LinkedCvNoticeProps) {
  const isWarning = state === "unreadable"
  const Icon = isWarning ? FileWarning : FileCheck2

  return (
    <div
      role={isWarning ? "alert" : "status"}
      className={cn(
        "mx-3 flex items-start gap-3 rounded-[10px] border px-3 py-2.5",
        isWarning
          ? "border-warning-light bg-warning-light/60"
          : "border-primary-light bg-primary-light/50"
      )}
    >
      <Icon
        size={16}
        className={cn("mt-0.5 shrink-0", isWarning ? "text-warning-text" : "text-primary")}
        aria-hidden="true"
      />
      <div className="min-w-0 text-[12px]">
        <p className="font-semibold text-text-primary">
          CV de la candidature{name && <>&nbsp;: <span className="break-all">{name}</span></>}
        </p>
        <p className={isWarning ? "text-warning-text" : "text-text-muted"}>{COPY[state]}</p>
      </div>
    </div>
  )
}
