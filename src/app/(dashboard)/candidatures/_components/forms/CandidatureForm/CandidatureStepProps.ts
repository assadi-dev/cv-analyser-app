import type { CandidatureMode } from "../../../_lib/candidature-steps.config"

/** What every step component of the wizard receives. */
export interface CandidatureStepProps {
  mode: CandidatureMode
}
