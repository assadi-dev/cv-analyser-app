import type { FieldPath } from "react-hook-form"
import type { CandidatureFormValues } from "./candidature.schema"

export type CandidatureMode = "create" | "edit"

export type CandidatureStepId = "offer" | "company" | "followup"

export interface CandidatureStepConfig {
  id: CandidatureStepId
  label: string
  /**
   * Fields owned by the step. "Suivant" validates exactly these before moving
   * on, and a failed final submit uses them to find which step to bring back.
   */
  fields: FieldPath<CandidatureFormValues>[]
}

const COMPANY_STEP: CandidatureStepConfig = {
  id: "company",
  label: "Entreprise",
  fields: [
    "company_name",
    "company_city",
    "job_title",
    "contract_type",
    "work_mode",
    "source_platform",
    "source_name",
    "source_url",
    "status",
  ],
}

const CREATE_STEPS: CandidatureStepConfig[] = [
  {
    id: "offer",
    label: "Fiche de poste & CV",
    // Nothing is required here: the offer text and the CV are both optional.
    fields: [],
  },
  COMPANY_STEP,
  {
    id: "followup",
    label: "Contacts & notes",
    fields: ["contacts", "notes"],
  },
]

/**
 * Editing leaves the offer step out: the API's PATCH takes neither the job
 * description nor contacts, and the CV list is not wired yet, so the step
 * would have nothing to edit.
 */
const EDIT_STEPS: CandidatureStepConfig[] = [
  COMPANY_STEP,
  {
    id: "followup",
    label: "Notes",
    fields: ["notes"],
  },
]

export const CANDIDATURE_STEPS_BY_MODE: Record<CandidatureMode, CandidatureStepConfig[]> = {
  create: CREATE_STEPS,
  edit: EDIT_STEPS,
}
