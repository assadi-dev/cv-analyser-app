import type {
  CandidatureMovePayload,
  CandidatureStatus,
  CandidatureSummary,
} from "@/types"

/** The board as the API delivers it: one entry per column, cards in order. */
export type KanbanColumns = Record<string, CandidatureSummary[]>

/** Where a card currently sits on the board. */
export interface CardLocation {
  status: CandidatureStatus
  index: number
}

/**
 * Finds the column and rank of a card.
 *
 * Returns null when the card is not on the board — which happens during a
 * drag if the component re-renders mid-flight, so callers must handle it
 * rather than assume a hit.
 */
export function locateCard(
  columns: KanbanColumns,
  cardId: string
): CardLocation | null {
  for (const [status, cards] of Object.entries(columns)) {
    const index = cards.findIndex((card) => card.id === cardId)
    if (index !== -1) {
      return { status: status as CandidatureStatus, index }
    }
  }
  return null
}

/**
 * Turns the board's final state into the payload the API expects.
 *
 * The API is anchored on neighbours, not on an index: it reads their live
 * positions server-side, so a stale board cannot write a wrong order. This
 * reads those neighbours off the state the user actually sees at drop time.
 *
 * Deliberately derived from the final state rather than from the drag
 * callbacks. Dice UI only reports `onMove` when a card stays inside its
 * column — a cross-column drop is applied through `onValueChange` during
 * `onDragOver` and never reaches `onMove`. Reading the state covers both.
 *
 * Returns null if the card is not on the board, so callers skip the request
 * instead of sending a malformed one.
 */
export function resolveMovePayload(
  columns: KanbanColumns,
  cardId: string
): CandidatureMovePayload | null {
  const location = locateCard(columns, cardId)
  if (!location) return null

  const cards = columns[location.status] ?? []
  return {
    status: location.status,
    before_id: cards[location.index - 1]?.id ?? null,
    after_id: cards[location.index + 1]?.id ?? null,
  }
}

/**
 * Tells whether a card actually changed place between two board states.
 *
 * Picking a card up and dropping it back produces a drag with no move. Without
 * this check the board would fire a request on every click-and-release.
 */
export function hasCardMoved(
  before: KanbanColumns,
  after: KanbanColumns,
  cardId: string
): boolean {
  const from = locateCard(before, cardId)
  const to = locateCard(after, cardId)

  if (!from || !to) return false
  return from.status !== to.status || from.index !== to.index
}

/**
 * Applies a move locally, the way the server will apply it.
 *
 * Used for the optimistic update: the board shows the result immediately and
 * the request only confirms it. Keeping this in one place means the optimistic
 * state and the rollback state are built the same way.
 */
export function moveCard(
  columns: KanbanColumns,
  cardId: string,
  targetStatus: CandidatureStatus,
  targetIndex: number
): KanbanColumns {
  const from = locateCard(columns, cardId)
  if (!from) return columns

  const card = columns[from.status]?.[from.index]
  if (!card) return columns

  const next: KanbanColumns = { ...columns }
  next[from.status] = (columns[from.status] ?? []).filter((c) => c.id !== cardId)

  const target = [...(next[targetStatus] ?? [])]
  const bounded = Math.max(0, Math.min(targetIndex, target.length))
  target.splice(bounded, 0, { ...card, status: targetStatus })
  next[targetStatus] = target

  return next
}

/**
 * Re-stamps every card with the status of the column it now sits in.
 *
 * Dice UI moves the card object from one column to the next without touching
 * its fields, so a dropped card still carries its previous status. The board
 * itself does not care — it renders by column — but everything reading
 * `card.status` does: the dashboard counters would keep the old tally until
 * the next refetch, and the card would flicker back on any consumer that
 * groups by status.
 *
 * Applied when writing the optimistic board into the cache, so what the cache
 * holds matches what the server is about to store.
 */
export function syncCardStatuses(columns: KanbanColumns): KanbanColumns {
  const synced: KanbanColumns = {}

  for (const [status, cards] of Object.entries(columns)) {
    synced[status] = cards.map((card) =>
      card.status === status
        ? card
        : { ...card, status: status as CandidatureStatus }
    )
  }

  return synced
}
