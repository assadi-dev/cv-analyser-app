import { FileCheck2 } from "lucide-react"

interface LinkedCvNoticeProps {
  /** Name of the CV linked to the candidature, once known. */
  name: string | undefined
  /** A file was chosen for this analysis, so the linked CV is not used. */
  isReplaced: boolean
}

/** Tells which CV the analysis will run on when the page was opened from a candidature. */
export function LinkedCvNotice({ name, isReplaced }: LinkedCvNoticeProps) {
  return (
    <div
      role="status"
      className="mx-3 flex items-start gap-3 rounded-[10px] border border-primary-light bg-primary-light/50 px-3 py-2.5"
    >
      <FileCheck2 size={16} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
      <div className="min-w-0 text-[12px]">
        <p className="font-semibold text-text-primary">
          CV de la candidature{name && <>&nbsp;: <span className="break-all">{name}</span></>}
        </p>
        <p className="text-text-muted">
          {isReplaced
            ? "Le fichier choisi ci-dessous remplace ce CV pour cette analyse."
            : "Utilisé pour l'analyse. Choisissez un autre PDF pour le remplacer."}
        </p>
      </div>
    </div>
  )
}
