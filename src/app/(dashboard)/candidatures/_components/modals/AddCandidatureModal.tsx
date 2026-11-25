"use client"

import { useEffect } from "react"
import { ArrowLeft, ArrowRight, Plus } from "lucide-react"
import { Modal } from "@/components/ui/Modal"
import { Button } from "@/components/ui/Button"
import { AddCandidatureForm } from "../forms/AddCandidatureForm"
import { useAddCandidatureWizard } from "../../_hooks/useAddCandidatureWizard"
import type { AddCandidatureFormValues } from "../../_lib/add-candidature.schema"

const FORM_ID = "add-candidature-form"

interface AddCandidatureModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (values: AddCandidatureFormValues) => void
  isPending: boolean
}

export function AddCandidatureModal({ isOpen, onClose, onSubmit, isPending }: AddCandidatureModalProps) {
  const wizard = useAddCandidatureWizard(onSubmit)
  const { isFirst, isLast, goNext, goPrevious, reset } = wizard

  // The modal stays mounted while closed, so the form has to be cleared by
  // hand: each opening starts on the first step with an empty form.
  useEffect(() => {
    if (!isOpen) reset()
  }, [isOpen, reset])

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title="Ajouter une candidature"
      icon={<Plus size={15} style={{ color: "#7C3AED" }} />}
      size="xl"
      // A fixed height, not a max: the modal must not grow or shrink as the
      // user moves between steps of different lengths.
      className="h-[90vh]"
      footer={
        <>
          <Button type="button" variant="ghost" onClick={onClose} disabled={isPending}>
            Annuler
          </Button>

          <div className="flex-1" />

          {!isFirst && (
            <Button
              type="button"
              variant="secondary"
              onClick={goPrevious}
              disabled={isPending}
              aria-label="Précédent"
            >
              <ArrowLeft size={14} />
              {/* Three labelled buttons do not fit a phone-width footer. */}
              <span className="hidden sm:inline">Précédent</span>
            </Button>
          )}

          {/*
            Two buttons with distinct keys, not one whose `type` flips. Pressing
            "Suivant" on step 2 re-renders into step 3 before the browser runs
            the click's default action: a reused element that had just become a
            submit button would save the form before step 3 was ever shown.
          */}
          {isLast ? (
            <Button key="submit" type="submit" form={FORM_ID} loading={isPending}>
              Enregistrer
            </Button>
          ) : (
            <Button key="next" type="button" onClick={goNext}>
              Suivant <ArrowRight size={14} />
            </Button>
          )}
        </>
      }
    >
      <AddCandidatureForm formId={FORM_ID} wizard={wizard} />
    </Modal>
  )
}
