import { StepLayout } from "./StepLayout"
import { ContactsSection } from "./ContactsSection"
import { NotesSection } from "./NotesSection"

/** Last step — the people to talk to, and the user's own notes. */
export function FollowUpStep() {
  return <StepLayout left={<ContactsSection />} right={<NotesSection />} />
}
