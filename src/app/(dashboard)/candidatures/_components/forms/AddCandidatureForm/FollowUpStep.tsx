import { StepLayout } from "./StepLayout"
import { ContactsSection } from "./ContactsSection"
import { NotesSection } from "./NotesSection"

/** Step 3 — the people to talk to and the user's own notes. */
export function FollowUpStep() {
  return <StepLayout left={<ContactsSection />} right={<NotesSection />} />
}
