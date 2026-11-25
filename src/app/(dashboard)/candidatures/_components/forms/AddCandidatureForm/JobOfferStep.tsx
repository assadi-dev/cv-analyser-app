import { StepLayout } from "./StepLayout"
import { JobDescriptionSection } from "./JobDescriptionSection"
import { CVSection } from "./CVSection"

/** Step 1 — the offer itself and the CV sent with it. */
export function JobOfferStep() {
  return <StepLayout left={<JobDescriptionSection />} right={<CVSection />} />
}
