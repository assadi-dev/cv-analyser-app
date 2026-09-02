import { describe, it, expect, vi, beforeEach } from "vitest"
import type { ReactNode } from "react"
import { renderHook, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import type { CandidatureMovePayload, KanbanBoardResponse } from "@/types"

vi.mock("@/lib/api", () => ({
  api: { get: vi.fn(), patch: vi.fn() },
}))

const toast = { error: vi.fn(), success: vi.fn() }
vi.mock("@/hooks/useToast", () => ({ useToast: () => toast }))

import { api } from "@/lib/api"
import {
  useKanbanBoard,
  useMoveCandidature,
} from "@/app/(dashboard)/dashboard/_hooks/useKanbanBoard"
import { KANBAN_QUERY_KEY } from "@/app/(dashboard)/dashboard/_api/kanban.api"
import { CANDIDATURES_QUERY_KEY } from "@/app/(dashboard)/candidatures/_api/candidatures.api"
import {
  locateCard,
  type KanbanColumns,
} from "@/app/(dashboard)/dashboard/_lib/board"
import {
  MOCK_BOARD,
  EMPTY_BOARD,
} from "@/app/(dashboard)/dashboard/_lib/kanban.mock"

const DATAMEID = "11111111-1111-1111-1111-111111111101" // to_send[0]
const PAYFIT = "33333333-3333-3333-3333-333333333301" // interview[0]

const makeClient = () =>
  new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })

const wrap = (client: QueryClient) =>
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={client}>{children}</QueryClientProvider>
    )
  }

/**
 * A drop as Dice UI produces it: the card object is moved between columns
 * untouched, so it still carries the status of the column it came from.
 */
function droppedIntoInterview(): KanbanColumns {
  const card = MOCK_BOARD.to_send.find((c) => c.id === DATAMEID)!
  return {
    ...MOCK_BOARD,
    to_send: MOCK_BOARD.to_send.filter((c) => c.id !== DATAMEID),
    interview: [card, ...MOCK_BOARD.interview],
  }
}

const MOVE_PAYLOAD: CandidatureMovePayload = {
  status: "interview",
  before_id: null,
  after_id: PAYFIT,
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe("useKanbanBoard", () => {
  it("exposes the board the API returns", async () => {
    vi.mocked(api.get).mockResolvedValue({ columns: MOCK_BOARD })
    const { result } = renderHook(() => useKanbanBoard(), {
      wrapper: wrap(makeClient()),
    })

    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.columns).toEqual(MOCK_BOARD)
    expect(api.get).toHaveBeenCalledWith("/api/kanban")
  })

  it("renders five droppable columns before the first response", () => {
    vi.mocked(api.get).mockReturnValue(new Promise(() => {}))
    const { result } = renderHook(() => useKanbanBoard(), {
      wrapper: wrap(makeClient()),
    })

    // A board that starts as `{}` would render no column at all, leaving
    // nowhere to drop into if the request never lands.
    expect(Object.keys(result.current.columns)).toEqual(
      Object.keys(EMPTY_BOARD)
    )
    expect(result.current.candidatures).toEqual([])
  })

  it("keeps the fallback board stable across renders", () => {
    vi.mocked(api.get).mockReturnValue(new Promise(() => {}))
    const { result, rerender } = renderHook(() => useKanbanBoard(), {
      wrapper: wrap(makeClient()),
    })

    const first = result.current.candidatures
    rerender()
    // A new array each render would re-run every memo downstream, starting
    // with the dashboard counters.
    expect(result.current.candidatures).toBe(first)
  })

  it("flattens the cards in column order for the counters", async () => {
    vi.mocked(api.get).mockResolvedValue({ columns: MOCK_BOARD })
    const { result } = renderHook(() => useKanbanBoard(), {
      wrapper: wrap(makeClient()),
    })

    await waitFor(() => expect(result.current.candidatures).toHaveLength(6))
    expect(result.current.candidatures[0].id).toBe(DATAMEID)
    expect(result.current.candidatures.at(-1)?.id).toBe(PAYFIT)
  })

  it("reports a failure instead of showing an empty board", async () => {
    vi.mocked(api.get).mockRejectedValue(new Error("boom"))
    const { result } = renderHook(() => useKanbanBoard(), {
      wrapper: wrap(makeClient()),
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})

describe("useMoveCandidature", () => {
  it("sends the drop to the API", async () => {
    const client = makeClient()
    client.setQueryData<KanbanBoardResponse>([KANBAN_QUERY_KEY], {
      columns: MOCK_BOARD,
    })
    vi.mocked(api.patch).mockResolvedValue({
      message: "candidature position has been updated",
      status: "interview",
      position: 0,
    })

    const { result } = renderHook(() => useMoveCandidature(), {
      wrapper: wrap(client),
    })
    result.current.mutate({
      id: DATAMEID,
      payload: MOVE_PAYLOAD,
      board: droppedIntoInterview(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(api.patch).toHaveBeenCalledWith(
      `/api/candidature/${DATAMEID}/move`,
      MOVE_PAYLOAD
    )
  })

  it("applies the drop to the cache before the request resolves", async () => {
    const client = makeClient()
    client.setQueryData<KanbanBoardResponse>([KANBAN_QUERY_KEY], {
      columns: MOCK_BOARD,
    })
    // Never resolves: the cache must already hold the move.
    vi.mocked(api.patch).mockReturnValue(new Promise(() => {}))

    const { result } = renderHook(() => useMoveCandidature(), {
      wrapper: wrap(client),
    })
    result.current.mutate({
      id: DATAMEID,
      payload: MOVE_PAYLOAD,
      board: droppedIntoInterview(),
    })

    await waitFor(() => {
      const cached = client.getQueryData<KanbanBoardResponse>([
        KANBAN_QUERY_KEY,
      ])
      expect(locateCard(cached!.columns, DATAMEID)).toEqual({
        status: "interview",
        index: 0,
      })
    })
  })

  it("re-stamps the moved card with its new status", async () => {
    const client = makeClient()
    client.setQueryData<KanbanBoardResponse>([KANBAN_QUERY_KEY], {
      columns: MOCK_BOARD,
    })
    vi.mocked(api.patch).mockReturnValue(new Promise(() => {}))

    const { result } = renderHook(() => useMoveCandidature(), {
      wrapper: wrap(client),
    })
    result.current.mutate({
      id: DATAMEID,
      payload: MOVE_PAYLOAD,
      board: droppedIntoInterview(),
    })

    await waitFor(() => {
      const cached = client.getQueryData<KanbanBoardResponse>([
        KANBAN_QUERY_KEY,
      ])
      const card = cached!.columns.interview.find((c) => c.id === DATAMEID)
      // Left at "to_send", the dashboard counters would keep the card in the
      // wrong tally until the next refetch.
      expect(card?.status).toBe("interview")
    })
  })

  it("puts the board back when the request fails", async () => {
    const client = makeClient()
    client.setQueryData<KanbanBoardResponse>([KANBAN_QUERY_KEY], {
      columns: MOCK_BOARD,
    })
    vi.mocked(api.patch).mockRejectedValue(new Error("boom"))

    const { result } = renderHook(() => useMoveCandidature(), {
      wrapper: wrap(client),
    })
    result.current.mutate({
      id: DATAMEID,
      payload: MOVE_PAYLOAD,
      board: droppedIntoInterview(),
    })

    await waitFor(() => expect(result.current.isError).toBe(true))
    const cached = client.getQueryData<KanbanBoardResponse>([KANBAN_QUERY_KEY])
    expect(locateCard(cached!.columns, DATAMEID)).toEqual({
      status: "to_send",
      index: 0,
    })
    expect(toast.error).toHaveBeenCalled()
  })

  it("refreshes the board and the candidatures table once settled", async () => {
    const client = makeClient()
    client.setQueryData<KanbanBoardResponse>([KANBAN_QUERY_KEY], {
      columns: MOCK_BOARD,
    })
    const invalidate = vi.spyOn(client, "invalidateQueries")
    vi.mocked(api.patch).mockResolvedValue({
      message: "candidature position has been updated",
      status: "interview",
      position: 0,
    })

    const { result } = renderHook(() => useMoveCandidature(), {
      wrapper: wrap(client),
    })
    result.current.mutate({
      id: DATAMEID,
      payload: MOVE_PAYLOAD,
      board: droppedIntoInterview(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    const keys = invalidate.mock.calls.map((call) => call[0]?.queryKey)
    // The table on /candidatures shows the same status this move changed.
    expect(keys).toContainEqual([KANBAN_QUERY_KEY])
    expect(keys).toContainEqual([CANDIDATURES_QUERY_KEY])
  })
})
