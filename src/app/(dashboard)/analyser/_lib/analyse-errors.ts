/** What the user is told when an analysis could not run. */
export interface AnalyseErrorMessage {
  title: string
  description: string
}

interface DescribeOptions {
  /** The analysis was sent with a CV stored on the candidature, not a file. */
  usedStoredCv: boolean
}

/** API code for a CV the server could not read any text from. */
export const CV_TEXT_UNREADABLE = "CV_TEXT_UNREADABLE"

/**
 * Turns an error code from the API into something the user can act on.
 *
 * Unknown codes fall back to the API's own message, as before.
 */
export function describeAnalyseError(
  code: string | undefined,
  fallback: string,
  { usedStoredCv }: DescribeOptions
): AnalyseErrorMessage {
  switch (code) {
    case CV_TEXT_UNREADABLE:
      return usedStoredCv
        ? {
            title: "CV illisible",
            description:
              "Aucun texte n'a pu être lu dans le CV lié à la candidature (PDF scanné ou protégé ?). Choisissez un autre PDF pour cette analyse.",
          }
        : {
            title: "PDF illisible",
            description:
              "Aucun texte n'a pu être lu dans ce PDF (scan ou image ?). Utilisez un PDF dont le texte est sélectionnable.",
          }
    case "NOT_FOUND":
      return {
        title: "Introuvable",
        description: usedStoredCv
          ? "Le CV lié ou la candidature n'existe plus. Rechargez la page."
          : "La candidature n'existe plus. Rechargez la page.",
      }
    default:
      return { title: "L'analyse a échoué", description: fallback }
  }
}
