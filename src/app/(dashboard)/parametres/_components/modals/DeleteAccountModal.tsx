"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"
import { Modal } from "@/components/ui/Modal"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/input"

const CONFIRM_WORD = "SUPPRIMER"

interface DeleteAccountModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  isPending: boolean
}

export function DeleteAccountModal({ isOpen, onClose, onConfirm, isPending }: DeleteAccountModalProps) {
  const [confirmText, setConfirmText] = useState("")

  function handleClose() {
    setConfirmText("")
    onClose()
  }

  return (
    <Modal
      open={isOpen}
      onClose={handleClose}
      title="Supprimer mon compte"
      size="md"
      icon={<Trash2 size={15} style={{ color: "var(--color-danger-text)" }} />}
      footer={
        <>
          <Button variant="secondary" onClick={handleClose}>
            Annuler
          </Button>
          <Button
            variant="danger"
            loading={isPending}
            disabled={confirmText !== CONFIRM_WORD}
            onClick={onConfirm}
            className="ml-auto"
          >
            Supprimer définitivement
          </Button>
        </>
      }
    >
      <div className="px-6 py-5 flex flex-col gap-4">
        <div className="flex flex-col gap-1 p-4 rounded-[10px]" style={{ background: "#FEF2F2", border: "1px solid #FECACA" }}>
          <p className="text-[13px] font-semibold" style={{ color: "var(--color-danger-text)" }}>
            Cette action est irréversible
          </p>
          <p className="text-[12px]" style={{ color: "#F87171" }}>
            Toutes vos données seront supprimées définitivement : profil, CV, analyses, candidatures et préférences.
          </p>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-semibold" style={{ color: "var(--color-text-secondary)" }}>
            Tapez <span className="font-black">{CONFIRM_WORD}</span> pour confirmer
          </label>
          <Input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={CONFIRM_WORD}
          />
        </div>
      </div>
    </Modal>
  )
}
