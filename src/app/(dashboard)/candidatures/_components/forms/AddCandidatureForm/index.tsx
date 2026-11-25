"use client"

import type { ComponentType } from "react"
import { Form } from "@/components/ui/form"
import type { AddCandidatureWizard } from "../../../_hooks/useAddCandidatureWizard"
import type { AddCandidatureStepId } from "../../../_lib/add-candidature-steps.config"
import { AddCandidatureStepper } from "./AddCandidatureStepper"
import { StepTransition } from "./StepTransition"
import { JobOfferStep } from "./JobOfferStep"
import { CompanyStep } from "./CompanyStep"
import { FollowUpStep } from "./FollowUpStep"

const STEP_COMPONENTS: Record<AddCandidatureStepId, ComponentType> = {
  offer: JobOfferStep,
  company: CompanyStep,
  followup: FollowUpStep,
}

interface AddCandidatureFormProps {
  formId: string
  wizard: AddCandidatureWizard
}

export function AddCandidatureForm({ formId, wizard }: AddCandidatureFormProps) {
  const { form, steps, stepIndex, direction, goTo, handleSubmit } = wizard
  const step = steps[stepIndex]
  const CurrentStep = STEP_COMPONENTS[step.id]

  return (
    <Form {...form}>
      <form
        id={formId}
        onSubmit={handleSubmit}
        className="flex h-full min-h-0 flex-col"
      >
        <AddCandidatureStepper
          steps={steps}
          currentIndex={stepIndex}
          onStepClick={goTo}
        />

        <StepTransition stepKey={step.id} direction={direction}>
          <CurrentStep />
        </StepTransition>

        {/*
          Gives Enter a submit button to press on every step. The real "save"
          button lives in the modal footer and only exists on the last step.
        */}
        <button type="submit" hidden tabIndex={-1} aria-hidden="true" />
      </form>
    </Form>
  )
}
