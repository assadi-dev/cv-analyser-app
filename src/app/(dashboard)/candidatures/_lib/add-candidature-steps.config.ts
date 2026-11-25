import type { FieldPath } from "react-hook-form"
import type { AddCandidatureFormValues } from "./add-candidature.schema"

export type AddCandidatureStepId = "offer" | "company" | "followup"

export interface AddCandidatureStepConfig {
  id: AddCandidatureStepId
  label: string
  /**
   * Fields owned by the step. "Suivant" validates exactly these before moving
   * on, and a failed final submit uses them to find which step to bring back.
   */
  fields: FieldPath<AddCandidatureFormValues>[]
}

export const ADD_CANDIDATURE_STEPS: AddCandidatureStepConfig[] = [
  {
    id: "offer",
    label: "Fiche de poste & CV",
    // Nothing is required here: the offer text and the CV are both optional.
    fields: [],
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
