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

/**
 * The same three steps whether creating or editing — only what each shows
 * differs (see `CandidatureStepProps.mode`).
 */
export const CANDIDATURE_STEPS: CandidatureStepConfig[] = [
  {
    id: "offer",
    label: "Fiche de poste & CV",
    // The offer text is required when creating, optional when editing (the
    // schema decides); the CV is always optional.
    fields: ["job_description", "cv_id"],
  },
  {
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
  },
  {
    id: "followup",
    label: "Contacts & notes",
    fields: ["contacts", "notes"],
  },
]
