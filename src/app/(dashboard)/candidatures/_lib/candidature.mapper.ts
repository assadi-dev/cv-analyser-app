import type { UpdateCandidaturePayload } from "../_api/candidatures.api"
import type { CandidatureSummary } from "@/types"
import {
  CANDIDATURE_FORM_DEFAULTS,
  type CandidatureFormValues,
} from "./candidature.schema"

/**
 * Form values for editing `candidature`.
 *
 * `candidature` must come from the single-candidature endpoint: the list rows
 * carry no job description, CV or contacts. The offer name is the one thing the
 * API never returns, so it falls back to the form default and the edit form
 * does not show it.
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
    job_description: candidature.job_description ?? "",
    cv_id: candidature.cv_id ?? "",
    contacts: (candidature.contacts ?? []).map(({ name, contact_type, value }) => ({
      name,
      contact_type,
      value,
    })),
    status: candidature.status,
    notes: candidature.notes ?? "",
  }
}

/** Optional text fields, which the API clears with `null` rather than "". */
const NULLABLE_FIELDS = [
  "company_city",
  "source_platform",
  "source_url",
  "job_description",
  "notes",
] as const

const REQUIRED_FIELDS = [
  "company_name",
  "job_title",
  "contract_type",
  "work_mode",
  "status",
] as const

type FormContact = CandidatureFormValues["contacts"][number]

const sameContacts = (a: FormContact[], b: FormContact[]) =>
  a.length === b.length &&
  a.every(
    (contact, i) =>
      contact.name === b[i].name &&
      contact.contact_type === b[i].contact_type &&
      contact.value === b[i].value
  )

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
  // "" is how the form says "no CV"; the API wants null.
  if (values.cv_id !== before.cv_id) {
    payload.cv_id = values.cv_id || null
  }
  // The API replaces the list as a whole, so it is sent whole — and only when
  // something in it changed, since leaving it out keeps the stored contacts.
  if (!sameContacts(values.contacts, before.contacts)) {
    payload.contacts = values.contacts
  }

  return payload
}
