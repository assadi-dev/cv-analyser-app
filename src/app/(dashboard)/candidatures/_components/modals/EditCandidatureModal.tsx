"use client"

import { Pencil } from "lucide-react"
import { useCandidature } from "../../_hooks/useCandidature"
import { candidatureToFormValues, toUpdatePayload } from "../../_lib/candidature.mapper"
import type { UpdateCandidaturePayload } from "../../_api/candidatures.api"
import { CandidatureWizardModal } from "./CandidatureWizardModal"
import { CandidatureModalFallback } from "./CandidatureModalFallback"

interface EditCandidatureModalProps {
  /** The candidature being edited — `undefined` keeps the modal closed. */
  candidatureId: string | undefined
  onClose: () => void
  /** Receives only what changed; empty when the form was left as it was. */
  onSubmit: (candidatureId: string, changes: UpdateCandidaturePayload) => void
  isPending: boolean
}

export function EditCandidatureModal({
  candidatureId,
  onClose,
  onSubmit,
  isPending,
}: EditCandidatureModalProps) {
  // The list rows do not carry the job description, so the modal reads the
  // candidature in full when it opens — and diffs against that same copy.
  const { data: candidature, isError } = useCandidature(candidatureId)

  if (!candidatureId) return null
  if (isError) return <CandidatureModalFallback state="error" onClose={onClose} />
  if (!candidature) return <CandidatureModalFallback state="loading" onClose={onClose} />

  return (
    <CandidatureWizardModal
      // One form per candidature: switching target remounts it, pre-filled
      // with that candidature's values.
      key={candidature.id}
      mode="edit"
      title="Modifier la candidature"
      icon={<Pencil size={15} style={{ color: "#7C3AED" }} />}
      initialValues={candidatureToFormValues(candidature)}
      onClose={onClose}
      onSubmit={(values) => onSubmit(candidature.id, toUpdatePayload(candidature, values))}
      isPending={isPending}
    />
  )
}
