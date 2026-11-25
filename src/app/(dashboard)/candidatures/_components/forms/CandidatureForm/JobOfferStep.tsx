import type { CandidatureStepProps } from "./CandidatureStepProps"
import { StepLayout } from "./StepLayout"
import { JobDescriptionSection } from "./JobDescriptionSection"
import { CVSection } from "./CVSection"

/**
 * Step 1 — the offer and the CV sent with it. The text is required when
 * creating and optional when editing; the CV is picked among the user's
 * uploaded ones, or imported on the spot.
 */
export function JobOfferStep({ mode }: CandidatureStepProps) {
  return (
    <StepLayout
      left={<JobDescriptionSection required={mode === "create"} />}
      right={<CVSection />}
    />
  )
}
