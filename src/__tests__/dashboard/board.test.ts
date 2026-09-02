import { describe, it, expect } from "vitest"
import {
  locateCard,
  resolveMovePayload,
  hasCardMoved,
  moveCard,
  syncCardStatuses,
  type KanbanColumns,
} from "@/app/(dashboard)/dashboard/_lib/board"
import {
  MOCK_BOARD,
  EMPTY_BOARD,
} from "@/app/(dashboard)/dashboard/_lib/kanban.mock"

// ─── Helpers ─────────────────────────────────────────────────────────────────

const A = "11111111-1111-1111-1111-111111111101" // to_send[0] — Datameid
const B = "11111111-1111-1111-1111-111111111102" // to_send[1] — Le Hibou
const C = "11111111-1111-1111-1111-111111111103" // to_send[2] — Qonto
const D = "22222222-2222-2222-2222-222222222201" // sent[0]    — Doctolib
const E = "22222222-2222-2222-2222-222222222202" // sent[1]    — Alan
const F = "33333333-3333-3333-3333-333333333301" // interview[0]

const ids = (columns: KanbanColumns, status: string) =>
  (columns[status] ?? []).map((c) => c.id)

// ─── locateCard ──────────────────────────────────────────────────────────────

describe("locateCard", () => {
  it("finds a card at the head of its column", () => {
    expect(locateCard(MOCK_BOARD, A)).toEqual({ status: "to_send", index: 0 })
  })

  it("finds a card in the middle", () => {
    expect(locateCard(MOCK_BOARD, B)).toEqual({ status: "to_send", index: 1 })
  })

  it("finds a card in another column", () => {
    expect(locateCard(MOCK_BOARD, F)).toEqual({ status: "interview", index: 0 })
  })

  it("returns null for a card that is not on the board", () => {
    expect(locateCard(MOCK_BOARD, "does-not-exist")).toBeNull()
  })

  it("returns null on an empty board", () => {
    expect(locateCard(EMPTY_BOARD, A)).toBeNull()
  })
})

// ─── resolveMovePayload ──────────────────────────────────────────────────────

describe("resolveMovePayload", () => {
  it("head of column: no card before, next card after", () => {
    expect(resolveMovePayload(MOCK_BOARD, A)).toEqual({
      status: "to_send",
      before_id: null,
      after_id: B,
    })
  })

  it("middle of column: both neighbours", () => {
    expect(resolveMovePayload(MOCK_BOARD, B)).toEqual({
      status: "to_send",
      before_id: A,
      after_id: C,
    })
  })

  it("tail of column: previous card before, nothing after", () => {
    expect(resolveMovePayload(MOCK_BOARD, C)).toEqual({
      status: "to_send",
      before_id: B,
      after_id: null,
    })
  })

  it("only card in its column: both neighbours null", () => {
    expect(resolveMovePayload(MOCK_BOARD, F)).toEqual({
      status: "interview",
      before_id: null,
      after_id: null,
    })
  })

  it("reports the column the card ended up in, not where it came from", () => {
    const after = moveCard(MOCK_BOARD, A, "sent", 1)
    expect(resolveMovePayload(after, A)).toEqual({
      status: "sent",
      before_id: D,
      after_id: E,
    })
  })

  it("returns null rather than a malformed payload for an unknown card", () => {
    expect(resolveMovePayload(MOCK_BOARD, "nope")).toBeNull()
  })

  it("never sends a position — the server resolves rank from neighbours", () => {
    const payload = resolveMovePayload(MOCK_BOARD, B)
    expect(payload).not.toHaveProperty("position")
    expect(Object.keys(payload ?? {}).sort()).toEqual([
      "after_id",
      "before_id",
      "status",
    ])
  })
})

// ─── hasCardMoved ────────────────────────────────────────────────────────────

describe("hasCardMoved", () => {
  it("is false when the card is dropped back where it was", () => {
    expect(hasCardMoved(MOCK_BOARD, MOCK_BOARD, A)).toBe(false)
  })

  it("is true when the rank changed inside a column", () => {
    const after = moveCard(MOCK_BOARD, C, "to_send", 0)
    expect(hasCardMoved(MOCK_BOARD, after, C)).toBe(true)
  })

  it("is true when the column changed", () => {
    const after = moveCard(MOCK_BOARD, A, "sent", 0)
    expect(hasCardMoved(MOCK_BOARD, after, A)).toBe(true)
  })

  it("is false for a card missing from either state", () => {
    expect(hasCardMoved(MOCK_BOARD, MOCK_BOARD, "nope")).toBe(false)
  })
})

// ─── moveCard ────────────────────────────────────────────────────────────────

describe("moveCard", () => {
  it("moves a card to the head of another column", () => {
    const after = moveCard(MOCK_BOARD, A, "sent", 0)
    expect(ids(after, "sent")).toEqual([A, D, E])
    expect(ids(after, "to_send")).toEqual([B, C])
  })

  it("moves a card to the tail of another column", () => {
    const after = moveCard(MOCK_BOARD, A, "sent", 2)
    expect(ids(after, "sent")).toEqual([D, E, A])
  })

  it("drops into an empty column", () => {
    const after = moveCard(MOCK_BOARD, A, "rejected", 0)
    expect(ids(after, "rejected")).toEqual([A])
    expect(ids(after, "to_send")).toEqual([B, C])
  })

  it("rewrites the card status so the UI matches its new column", () => {
    const after = moveCard(MOCK_BOARD, A, "accepted", 0)
    expect(after.accepted?.[0]?.status).toBe("accepted")
  })

  it("reorders inside the same column", () => {
    const after = moveCard(MOCK_BOARD, C, "to_send", 0)
    expect(ids(after, "to_send")).toEqual([C, A, B])
  })

  it("clamps an index past the end instead of leaving a hole", () => {
    const after = moveCard(MOCK_BOARD, A, "sent", 99)
    expect(ids(after, "sent")).toEqual([D, E, A])
  })

  it("clamps a negative index to the head", () => {
    const after = moveCard(MOCK_BOARD, A, "sent", -5)
    expect(ids(after, "sent")).toEqual([A, D, E])
  })

  it("leaves the board untouched for an unknown card", () => {
    expect(moveCard(MOCK_BOARD, "nope", "sent", 0)).toBe(MOCK_BOARD)
  })

  it("does not mutate the source board", () => {
    const snapshot = ids(MOCK_BOARD, "to_send")
    moveCard(MOCK_BOARD, A, "sent", 0)
    expect(ids(MOCK_BOARD, "to_send")).toEqual(snapshot)
  })

  it("keeps every column present after a move", () => {
    const after = moveCard(MOCK_BOARD, F, "accepted", 0)
    expect(Object.keys(after).sort()).toEqual(
      ["accepted", "interview", "rejected", "sent", "to_send"].sort()
    )
    expect(after.interview).toEqual([])
  })
})

// ─── Round-trip: what the server would receive ───────────────────────────────

describe("drop → payload round trip", () => {
  it("dropping between two cards anchors on both", () => {
    const after = moveCard(MOCK_BOARD, F, "to_send", 1)
    expect(resolveMovePayload(after, F)).toEqual({
      status: "to_send",
      before_id: A,
      after_id: B,
    })
  })

  it("dropping at the head anchors only on the card below", () => {
    const after = moveCard(MOCK_BOARD, F, "to_send", 0)
    expect(resolveMovePayload(after, F)).toEqual({
      status: "to_send",
      before_id: null,
      after_id: A,
    })
  })

  it("dropping at the tail anchors only on the card above", () => {
    const after = moveCard(MOCK_BOARD, F, "to_send", 3)
    expect(resolveMovePayload(after, F)).toEqual({
      status: "to_send",
      before_id: C,
      after_id: null,
    })
  })

  it("dropping into an empty column sends no anchor at all", () => {
    const after = moveCard(MOCK_BOARD, A, "rejected", 0)
    expect(resolveMovePayload(after, A)).toEqual({
      status: "rejected",
      before_id: null,
      after_id: null,
    })
  })
})

// ─── syncCardStatuses ────────────────────────────────────────────────────────

describe("syncCardStatuses", () => {
  it("stamps a moved card with the status of its new column", () => {
    // moveCard already re-stamps, so start from a board where the card was
    // relocated without touching its fields — exactly what Dice UI produces.
    const moved = {
      ...MOCK_BOARD,
      to_send: MOCK_BOARD.to_send.filter((c) => c.id !== A),
      interview: [
        ...MOCK_BOARD.interview,
        MOCK_BOARD.to_send.find((c) => c.id === A)!,
      ],
    }
    expect(locateCard(moved, A)).toEqual({ status: "interview", index: 1 })
    expect(moved.interview[1].status).toBe("to_send")

    const synced = syncCardStatuses(moved)
    expect(synced.interview[1].status).toBe("interview")
  })

  it("leaves a board that already agrees with itself untouched", () => {
    const synced = syncCardStatuses(MOCK_BOARD)
    for (const status of Object.keys(MOCK_BOARD)) {
      expect(ids(synced, status)).toEqual(ids(MOCK_BOARD, status))
      synced[status].forEach((card, index) => {
        // Same object, not a copy: nothing to update means nothing to
        // re-render downstream.
        expect(card).toBe(MOCK_BOARD[status][index])
      })
    }
  })

  it("does not mutate the board it is given", () => {
    const moved = {
      ...EMPTY_BOARD,
      accepted: [MOCK_BOARD.to_send[0]],
    }
    syncCardStatuses(moved)
    expect(moved.accepted[0].status).toBe("to_send")
  })

  it("keeps every column, including the empty ones", () => {
    expect(Object.keys(syncCardStatuses(EMPTY_BOARD))).toEqual(
      Object.keys(EMPTY_BOARD)
    )
  })
})
