"use client"

import { LoaderCircle, Pencil } from "lucide-react"
import { Modal } from "@/components/ui/Modal"
import { Button } from "@/components/ui/Button"

interface CandidatureModalFallbackProps {
  state: "loading" | "error"
  onClose: () => void
}

/** What the edit modal shows while the candidature loads, or when it cannot. */
export function CandidatureModalFallback({ state, onClose }: CandidatureModalFallbackProps) {
  return (
    <Modal
      open
      onClose={onClose}
      title="Modifier la candidature"
      icon={<Pencil size={15} style={{ color: "#7C3AED" }} />}
      size="md"
      footer={
        <>
          <div className="flex-1" />
          <Button type="button" variant="ghost" onClick={onClose}>
            Fermer
          </Button>
        </>
      }
    >
      <div
        role={state === "error" ? "alert" : "status"}
        className="flex min-h-[200px] items-center justify-center gap-3 p-6 text-[13px] text-text-muted"
      >
        {state === "loading" ? (
          <>
            <LoaderCircle size={16} className="animate-spin" aria-hidden="true" />
            Chargement de la candidature…
          </>
        ) : (
          "La candidature n'a pas pu être chargée."
        )}
      </div>
    </Modal>
  )
}
