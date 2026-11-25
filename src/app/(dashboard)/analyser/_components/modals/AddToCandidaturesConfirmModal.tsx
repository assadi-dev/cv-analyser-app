"use client"

import { Save } from "lucide-react"
import { Modal } from "@/components/ui/Modal"
import { Button } from "@/components/ui/Button"

interface AddToCandidaturesConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

/** Asks before turning the current analysis into a candidature. */
export function AddToCandidaturesConfirmModal({
  isOpen,
  onClose,
  onConfirm,
}: AddToCandidaturesConfirmModalProps) {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title="Ajouter à mes candidatures"
      icon={<Save size={15} className="text-primary" />}
      size="md"
      footer={
        <>
          <Button type="button" variant="ghost" onClick={onClose}>
            Annuler
          </Button>
          <div className="flex-1" />
          <Button type="button" onClick={onConfirm}>
            Confirmer
          </Button>
        </>
      }
    >
      <div className="px-6 py-5">
        <p className="text-[14px] text-text-secondary">
          Voulez-vous ajouter cette offre à vos candidatures ? La fiche de poste
          et le CV utilisés pour l&apos;analyse seront pré-remplis dans le
          formulaire.
        </p>
      </div>
    </Modal>
  )
}
