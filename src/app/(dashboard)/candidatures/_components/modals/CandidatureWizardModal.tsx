"use client"

import type { ReactNode } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Modal } from "@/components/ui/Modal"
import { Button } from "@/components/ui/Button"
import { CandidatureForm } from "../forms/CandidatureForm"
import { useCandidatureWizard } from "../../_hooks/useCandidatureWizard"
import type { CandidatureFormValues } from "../../_lib/candidature.schema"
import type { CandidatureMode } from "../../_lib/candidature-steps.config"

const FORM_ID = "candidature-form"

interface CandidatureWizardModalProps {
  mode: CandidatureMode
  title: string
  icon: ReactNode
  /** Pre-fills the form. Read once: remount the modal to start from other values. */
  initialValues?: CandidatureFormValues
  onClose: () => void
  onSubmit: (values: CandidatureFormValues) => void
  isPending: boolean
}

/**
 * The multi-step candidature modal, for both creating and editing.
 *
 * It is always open: the wrappers (AddCandidatureModal, EditCandidatureModal)
 * mount it only while a modal is wanted, so each opening starts from a fresh
 * form and the first step without any reset logic.
 */
export function CandidatureWizardModal({
  mode,
  title,
  icon,
  initialValues,
  onClose,
  onSubmit,
  isPending,
}: CandidatureWizardModalProps) {
  const wizard = useCandidatureWizard(onSubmit, { mode, initialValues })
  const { isFirst, isLast, goNext, goPrevious } = wizard

  return (
    <Modal
      open
      onClose={onClose}
      title={title}
      icon={icon}
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
            "Suivant" on the step before the last re-renders into the last step
            before the browser runs the click's default action: a reused element
            that had just become a submit button would save the form before the
            last step was ever shown.
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
      <CandidatureForm formId={FORM_ID} wizard={wizard} />
    </Modal>
  )
}
