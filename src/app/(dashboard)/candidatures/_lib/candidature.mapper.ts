import type { UpdateCandidaturePayload } from "../_api/candidatures.api"
import type { CandidatureSummary } from "@/types"
import {
  CANDIDATURE_FORM_DEFAULTS,
  type CandidatureFormValues,
} from "./candidature.schema"

/**
 * Form values for editing `candidature`.
 *
 * Fields the list does not return (offer name, contacts, job description) fall
 * back to the form defaults — the edit form does not show them.
 */
export function candidatureToFormValues(
  candidature: CandidatureSummary
): CandidatureFormValues {
  return {
    ...CANDIDATURE_FORM_DEFAULTS,
    company_name: candidature.company_name,
    company_city: candidature.company_city ?? "",
    job_title: candidature.job_title,
    contract_type: candidature.contract_type,
    work_mode: candidature.work_mode,
    // Not the form's "LinkedIn" default: a candidature with no source has none.
    source_platform: candidature.source_platform ?? "",
    source_url: candidature.source_url ?? "",
    status: candidature.status,
    notes: candidature.notes ?? "",
  }
}

/** Optional text fields, which the API clears with `null` rather than "". */
const NULLABLE_FIELDS = [
  "company_city",
  "source_platform",
  "source_url",
  "notes",
] as const

const REQUIRED_FIELDS = [
  "company_name",
  "job_title",
  "contract_type",
  "work_mode",
  "status",
] as const

/**
 * What the user actually changed, ready for a PATCH.
 *
 * Sending the whole form would overwrite fields the edit form cannot show
 * faithfully with their placeholders; sending only the differences leaves
 * everything else untouched. Empty when nothing changed.
 */
export function toUpdatePayload(
  original: CandidatureSummary,
  values: CandidatureFormValues
): UpdateCandidaturePayload {
  const before = candidatureToFormValues(original)
  const payload: UpdateCandidaturePayload = {}

  for (const field of REQUIRED_FIELDS) {
    if (values[field] !== before[field]) {
      Object.assign(payload, { [field]: values[field] })
    }
  }
  for (const field of NULLABLE_FIELDS) {
    if (values[field] !== before[field]) {
      Object.assign(payload, { [field]: values[field]?.trim() || null })
    }
  }

  return payload
}
