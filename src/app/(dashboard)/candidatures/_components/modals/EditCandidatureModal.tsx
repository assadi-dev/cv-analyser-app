"use client"

import { Pencil } from "lucide-react"
import type { CandidatureSummary } from "@/types"
import { CandidatureWizardModal } from "./CandidatureWizardModal"
import { candidatureToFormValues } from "../../_lib/candidature.mapper"
import type { CandidatureFormValues } from "../../_lib/candidature.schema"

interface EditCandidatureModalProps {
  /** The candidature being edited — `undefined` keeps the modal closed. */
  candidature: CandidatureSummary | undefined
  onClose: () => void
  onSubmit: (values: CandidatureFormValues) => void
  isPending: boolean
}

export function EditCandidatureModal({
  candidature,
  onClose,
  onSubmit,
  isPending,
}: EditCandidatureModalProps) {
  if (!candidature) return null

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
      onSubmit={onSubmit}
      isPending={isPending}
    />
  )
}
