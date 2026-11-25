"use client"

import { useCallback, useState, type BaseSyntheticEvent } from "react"
import { useForm, type FieldErrors } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { logError } from "@/lib/logger"
import {
  addCandidatureSchema,
  ADD_CANDIDATURE_DEFAULTS,
  type AddCandidatureFormValues,
} from "../_lib/add-candidature.schema"
import { ADD_CANDIDATURE_STEPS } from "../_lib/add-candidature-steps.config"

type StepDirection = 1 | -1

interface StepState {
  index: number
  /** Sign of the last move: it picks which way the step content slides. */
  direction: StepDirection
}

const FIRST_STEP: StepState = { index: 0, direction: 1 }
const LAST_STEP_INDEX = ADD_CANDIDATURE_STEPS.length - 1

/**
 * State of the "add a candidature" wizard: one form, spread over several steps.
 *
 * The form lives here rather than inside the form component so the modal
 * footer — which sits outside the <form> — can drive the same steps.
 */
export function useAddCandidatureWizard(
  onSubmit: (values: AddCandidatureFormValues) => void
) {
  const form = useForm<AddCandidatureFormValues>({
    resolver: zodResolver(addCandidatureSchema),
    defaultValues: ADD_CANDIDATURE_DEFAULTS,
  })
  const [step, setStep] = useState<StepState>(FIRST_STEP)

  const isFirst = step.index === 0
  const isLast = step.index === LAST_STEP_INDEX

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
      const { fields } = ADD_CANDIDATURE_STEPS[step.index]
      // An empty list would make `trigger` validate the whole form.
      if (fields.length > 0) {
        const isValid = await form.trigger(fields, { shouldFocus: true })
        if (!isValid) return
      }
      goTo(step.index + 1)
    } catch (error) {
      logError(error, "useAddCandidatureWizard.goNext")
    }
  }, [form, goTo, isLast, step.index])

  const goPrevious = useCallback(() => {
    if (!isFirst) goTo(step.index - 1)
  }, [goTo, isFirst, step.index])

  const reset = useCallback(() => {
    form.reset(ADD_CANDIDATURE_DEFAULTS)
    setStep(FIRST_STEP)
  }, [form])

  // Safety net: steps are validated as the user leaves them, so this only
  // fires if something slipped through. Bring the user to the step that holds
  // the error instead of failing on a screen that shows nothing wrong.
  const handleInvalid = useCallback(
    (errors: FieldErrors<AddCandidatureFormValues>) => {
      const target = ADD_CANDIDATURE_STEPS.findIndex((candidate) =>
        candidate.fields.some((field) => field in errors)
      )
      if (target >= 0) goTo(target)
    },
    [goTo]
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
        logError(error, "useAddCandidatureWizard.handleSubmit")
      }
    },
    [form, goNext, handleInvalid, isLast, onSubmit]
  )

  return {
    form,
    steps: ADD_CANDIDATURE_STEPS,
    stepIndex: step.index,
    direction: step.direction,
    isFirst,
    isLast,
    goTo,
    goNext,
    goPrevious,
    reset,
    handleSubmit,
  }
}

export type AddCandidatureWizard = ReturnType<typeof useAddCandidatureWizard>
