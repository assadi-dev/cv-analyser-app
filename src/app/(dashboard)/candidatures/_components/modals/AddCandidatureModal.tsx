"use client"

import { Plus } from "lucide-react"
import { Modal } from "@/components/ui/Modal"
import { Button } from "@/components/ui/Button"
import { useAddCandidature } from "../../_hooks/useAddCandidature"
import { AddCandidatureForm } from "../forms/AddCandidatureForm"
import type { AddCandidatureFormValues } from "../../_lib/add-candidature.schema"

const FORM_ID = "add-candidature-form"

interface AddCandidatureModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AddCandidatureModal({ isOpen, onClose }: AddCandidatureModalProps) {
  const { mutate, isPending } = useAddCandidature()

  const handleSubmit = (values: AddCandidatureFormValues) => {
    mutate(values, { onSuccess: onClose })
  }

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
      <AddCandidatureForm formId={FORM_ID} onSubmit={handleSubmit} />
    </Modal>
  )
}
