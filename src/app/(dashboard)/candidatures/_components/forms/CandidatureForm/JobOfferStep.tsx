import type { CandidatureStepProps } from "./CandidatureStepProps"
import { StepLayout } from "./StepLayout"
import { JobDescriptionSection } from "./JobDescriptionSection"
import { CVSection } from "./CVSection"

/**
 * Step 1 — the offer and the CV sent with it. The text is required when
 * creating and optional when editing; a new CV can only be imported when
 * creating, editing picks among the CVs already uploaded.
 */
export function JobOfferStep({ mode }: CandidatureStepProps) {
  return (
    <StepLayout
      left={<JobDescriptionSection required={mode === "create"} />}
      right={<CVSection showUpload={mode === "create"} />}
    />
  )
}
