"use client"

import { useCallback, useState, type BaseSyntheticEvent } from "react"
import { useForm, type FieldErrors } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { logError } from "@/lib/logger"
import {
  candidatureSchema,
  CANDIDATURE_FORM_DEFAULTS,
  type CandidatureFormValues,
} from "../_lib/candidature.schema"
import {
  CANDIDATURE_STEPS_BY_MODE,
  type CandidatureMode,
} from "../_lib/candidature-steps.config"

type StepDirection = 1 | -1

interface StepState {
  index: number
  /** Sign of the last move: it picks which way the step content slides. */
  direction: StepDirection
}

const FIRST_STEP: StepState = { index: 0, direction: 1 }

interface UseCandidatureWizardOptions {
  /** `create` walks every step; `edit` skips what the API cannot update. */
  mode?: CandidatureMode
  /** Pre-fills the form. Read once, when the wizard mounts. */
  initialValues?: CandidatureFormValues
}

/**
 * State of the candidature wizard: one form, spread over several steps.
 *
 * The form lives here rather than inside the form component so the modal
 * footer — which sits outside the <form> — can drive the same steps.
 */
export function useCandidatureWizard(
  onSubmit: (values: CandidatureFormValues) => void,
  { mode = "create", initialValues }: UseCandidatureWizardOptions = {}
) {
  const steps = CANDIDATURE_STEPS_BY_MODE[mode]
  const lastStepIndex = steps.length - 1

  const form = useForm<CandidatureFormValues>({
    resolver: zodResolver(candidatureSchema),
    defaultValues: initialValues ?? CANDIDATURE_FORM_DEFAULTS,
  })
  const [step, setStep] = useState<StepState>(FIRST_STEP)

  const isFirst = step.index === 0
  const isLast = step.index === lastStepIndex

  const goTo = useCallback((target: number) => {
    setStep((current) =>
      target === current.index
        ? current
        : { index: target, direction: target > current.index ? 1 : -1 }
    )
  }, [])

  const goNext = useCallback(async () => {
    if (isLast) return
    try {
      const { fields } = steps[step.index]
      // An empty list would make `trigger` validate the whole form.
      if (fields.length > 0) {
        const isValid = await form.trigger(fields, { shouldFocus: true })
        if (!isValid) return
      }
      goTo(step.index + 1)
    } catch (error) {
      logError(error, "useCandidatureWizard.goNext")
    }
  }, [form, goTo, isLast, step.index, steps])

  const goPrevious = useCallback(() => {
    if (!isFirst) goTo(step.index - 1)
  }, [goTo, isFirst, step.index])

  // Safety net: steps are validated as the user leaves them, so this only
  // fires if something slipped through. Bring the user to the step that holds
  // the error instead of failing on a screen that shows nothing wrong.
  const handleInvalid = useCallback(
    (errors: FieldErrors<CandidatureFormValues>) => {
      const target = steps.findIndex((candidate) =>
        candidate.fields.some((field) => field in errors)
      )
      if (target >= 0) goTo(target)
    },
    [goTo, steps]
  )

  const handleSubmit = useCallback(
    async (event?: BaseSyntheticEvent) => {
      // Enter inside a field submits the form: on any step but the last, that
      // means "next", not "save".
      if (!isLast) {
        event?.preventDefault()
        await goNext()
        return
      }
      try {
        await form.handleSubmit(onSubmit, handleInvalid)(event)
      } catch (error) {
        logError(error, "useCandidatureWizard.handleSubmit")
      }
    },
    [form, goNext, handleInvalid, isLast, onSubmit]
  )

  return {
    form,
    mode,
    steps,
    stepIndex: step.index,
    direction: step.direction,
    isFirst,
    isLast,
    goTo,
    goNext,
    goPrevious,
    handleSubmit,
  }
}

export type CandidatureWizard = ReturnType<typeof useCandidatureWizard>
