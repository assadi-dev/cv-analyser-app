"use client"

import type { ComponentType } from "react"
import { Form } from "@/components/ui/form"
import type { CandidatureWizard } from "../../../_hooks/useCandidatureWizard"
import type { CandidatureStepId } from "../../../_lib/candidature-steps.config"
import type { CandidatureStepProps } from "./CandidatureStepProps"
import { CandidatureStepper } from "./CandidatureStepper"
import { StepTransition } from "./StepTransition"
import { JobOfferStep } from "./JobOfferStep"
import { CompanyStep } from "./CompanyStep"
import { FollowUpStep } from "./FollowUpStep"

const STEP_COMPONENTS: Record<CandidatureStepId, ComponentType<CandidatureStepProps>> = {
  offer: JobOfferStep,
  company: CompanyStep,
  followup: FollowUpStep,
}

interface CandidatureFormProps {
  formId: string
  wizard: CandidatureWizard
}

export function CandidatureForm({ formId, wizard }: CandidatureFormProps) {
  const { form, mode, steps, stepIndex, direction, goTo, handleSubmit } = wizard
  const step = steps[stepIndex]
  const CurrentStep = STEP_COMPONENTS[step.id]

  return (
    <Form {...form}>
      <form
        id={formId}
        onSubmit={handleSubmit}
        className="flex h-full min-h-0 flex-col"
      >
        <CandidatureStepper
          steps={steps}
          currentIndex={stepIndex}
          onStepClick={goTo}
        />

        <StepTransition stepKey={step.id} direction={direction}>
          <CurrentStep mode={mode} />
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
