"use client"

import { Plus } from "lucide-react"
import { CandidatureWizardModal } from "./CandidatureWizardModal"
import type { CandidatureFormValues } from "../../_lib/candidature.schema"

interface AddCandidatureModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (values: CandidatureFormValues) => void
  isPending: boolean
  /** Pre-fills the form (e.g. from an analysis). Read once each time the modal opens. */
  initialValues?: CandidatureFormValues
}

export function AddCandidatureModal({ isOpen, onClose, onSubmit, isPending, initialValues }: AddCandidatureModalProps) {
  // Unmounted while closed: reopening starts from an empty form, on step 1.
  if (!isOpen) return null

  return (
    <CandidatureWizardModal
      mode="create"
      title="Ajouter une candidature"
      icon={<Plus size={15} style={{ color: "#7C3AED" }} />}
      initialValues={initialValues}
      onClose={onClose}
      onSubmit={onSubmit}
      isPending={isPending}
    />
  )
}
