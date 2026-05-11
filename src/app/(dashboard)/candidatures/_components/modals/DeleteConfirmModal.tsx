import { Trash2 } from "lucide-react"
import { Modal } from "@/components/ui/Modal"
import { Button } from "@/components/ui/Button"

interface DeleteConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  isPending?: boolean
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  isPending,
}: DeleteConfirmModalProps) {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title="Supprimer la candidature"
      icon={<Trash2 size={15} style={{ color: "var(--color-danger-text)" }} />}
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={isPending}>
            Annuler
          </Button>
          <Button variant="danger" onClick={onConfirm} loading={isPending}>
            Supprimer
          </Button>
        </>
      }
    >
      <div className="px-6 py-5">
        <p className="text-[14px]" style={{ color: "var(--color-text-secondary)" }}>
          Cette action est irréversible. La candidature sera définitivement supprimée.
        </p>
      </div>
    </Modal>
  )
}
