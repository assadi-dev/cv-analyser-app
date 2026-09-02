import type { CandidatureSummary } from "@/types"
import type { KanbanColumns } from "./board"

/**
 * A board fixture covering the shapes that break drag & drop.
 *
 * Deliberately uneven: a busy column to reorder inside, a single-card column,
 * and two empty ones. Empty columns are the ones that regress — a card must
 * still be droppable into a column that shows nothing.
 */

function card(
  id: string,
  company: string,
  job: string,
  status: CandidatureSummary["status"]
): CandidatureSummary {
  return {
    id,
    company_name: company,
    job_title: job,
    status,
    contract_type: "CDI",
    work_mode: "hybrid",
    source_platform: "LinkedIn",
    created_at: "2026-08-20T09:00:00Z",
    updated_at: "2026-08-20T09:00:00Z",
  }
}

export const MOCK_BOARD: KanbanColumns = {
  to_send: [
    card("11111111-1111-1111-1111-111111111101", "Datameid", "Data Engineer", "to_send"),
    card("11111111-1111-1111-1111-111111111102", "Le Hibou", "Dev Fullstack", "to_send"),
    card("11111111-1111-1111-1111-111111111103", "Qonto", "Backend Python", "to_send"),
  ],
  sent: [
    card("22222222-2222-2222-2222-222222222201", "Doctolib", "Ingénieur Data", "sent"),
    card("22222222-2222-2222-2222-222222222202", "Alan", "Platform Engineer", "sent"),
  ],
  interview: [
    card("33333333-3333-3333-3333-333333333301", "Payfit", "Lead Backend", "interview"),
  ],
  rejected: [],
  accepted: [],
}

/** A board with nothing on it — the first-run state, and a common regression. */
export const EMPTY_BOARD: KanbanColumns = {
  to_send: [],
  sent: [],
  interview: [],
  rejected: [],
  accepted: [],
}
