import { renderHook, act } from "@testing-library/react"
import { vi, describe, it, expect, afterEach } from "vitest"
import { useSSE } from "@/hooks/useSSE"

// Mock fetch for SSE streaming
function mockSSEFetch(events: string[]) {
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    start(controller) {
      for (const event of events) {
        controller.enqueue(encoder.encode(`data: ${event}\n\n`))
      }
      controller.close()
    },
  })
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, body: stream }))
}

describe("useSSE", () => {
  afterEach(() => vi.restoreAllMocks())

  it("starts in idle state", () => {
    const { result } = renderHook(() => useSSE())
    expect(result.current.state.status).toBe("idle")
    expect(result.current.state.progress).toBe(0)
    expect(result.current.state.error).toBeNull()
  })

  it("calls onEvent for each parsed SSE event", async () => {
    const events = [
      JSON.stringify({ type: "progress", step: "parsing", progress: 10, data: {} }),
      JSON.stringify({ type: "done", analyse_id: "abc-123" }),
    ]
    mockSSEFetch(events)

    const onEvent = vi.fn()
    const { result } = renderHook(() => useSSE(onEvent))

    await act(async () => {
      await result.current.start("/api/test", {})
    })

    expect(onEvent).toHaveBeenCalledTimes(2)
    expect(onEvent).toHaveBeenCalledWith(
      expect.objectContaining({ type: "progress", step: "parsing" }),
    )
    expect(onEvent).toHaveBeenCalledWith(
      expect.objectContaining({ type: "done", analyse_id: "abc-123" }),
    )
  })

  it("sets status to error when error event received", async () => {
    const events = [
      JSON.stringify({ type: "error", message: "Analysis failed", error_code: "AI_ERROR" }),
    ]
    mockSSEFetch(events)

    const { result } = renderHook(() => useSSE())

    await act(async () => {
      await result.current.start("/api/test", {})
    })

    expect(result.current.state.status).toBe("error")
    expect(result.current.state.error).toBe("Analysis failed")
  })

  it("resets state on reset()", () => {
    const { result } = renderHook(() => useSSE())

    act(() => result.current.reset())

    expect(result.current.state).toMatchObject({
      status:    "idle",
      progress:  0,
      error:     null,
      analyseId: null,
    })
  })
})
