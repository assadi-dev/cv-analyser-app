"use client"

import { Plus } from "lucide-react"
import { Modal } from "@/components/ui/Modal"
import { Button } from "@/components/ui/Button"
import { AddCandidatureForm } from "../forms/AddCandidatureForm"
import type { AddCandidatureFormValues } from "../../_lib/add-candidature.schema"

const FORM_ID = "add-candidature-form"

interface AddCandidatureModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (values: AddCandidatureFormValues) => void
  isPending: boolean
}

export function AddCandidatureModal({ isOpen, onClose, onSubmit, isPending }: AddCandidatureModalProps) {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title="Ajouter une candidature"
      icon={<Plus size={15} style={{ color: "#7C3AED" }} />}
      size="xl"
      className="max-h-[90vh]"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={isPending}>
            Annuler
          </Button>
          <Button type="submit" form={FORM_ID} loading={isPending}>
            Enregistrer
          </Button>
        </>
      }
    >
      <AddCandidatureForm formId={FORM_ID} onSubmit={onSubmit} />
    </Modal>
  )
}
