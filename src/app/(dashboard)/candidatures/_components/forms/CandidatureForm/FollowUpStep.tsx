import type { CandidatureStepProps } from "./CandidatureStepProps"
import { StepLayout } from "./StepLayout"
import { ContactsSection } from "./ContactsSection"
import { NotesSection } from "./NotesSection"

/**
 * Last step — the user's own notes, plus the people to talk to when creating.
 * Contacts are not editable afterwards: the API has no endpoint for them.
 */
export function FollowUpStep({ mode }: CandidatureStepProps) {
  if (mode === "edit") return <StepLayout left={<NotesSection />} />
  return <StepLayout left={<ContactsSection />} right={<NotesSection />} />
}
