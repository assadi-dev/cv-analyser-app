"use client"

// React Compiler (Next.js 16) handles memoization automatically.
// useCallback and useMemo are no longer needed.
import { useRef, useState } from "react"
import type { AnalyseStep, SSEEvent } from "@/types"
import { getApiToken } from "@/lib/api"

export type SSEStatus = "idle" | "connecting" | "streaming" | "done" | "error"

export interface SSEState {
  status: SSEStatus
  progress: number
  currentStep: AnalyseStep | null
  error: string | null
  analyseId: string | null
}

const INITIAL_STATE: SSEState = {
  status: "idle",
  progress: 0,
  currentStep: null,
  error: null,
  analyseId: null,
}

/**
 * Hook for consuming SSE streams from the analysis endpoint.
 *
 * Uses fetch + ReadableStream instead of EventSource
 * so we can inject the Authorization header.
 *
 * @param onEvent - Callback called for each parsed SSE event.
 */
export function useSSE(onEvent?: (event: SSEEvent) => void) {
  const [state, setState] = useState<SSEState>(INITIAL_STATE)
  const abortRef = useRef<AbortController | null>(null)

  async function start(url: string, body: { job_description: string, cv_file: File }) {
    // Cancel any in-progress stream
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setState({ ...INITIAL_STATE, status: "connecting" })

    const token = getApiToken()
    const apiUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? ""}${url}`
    const formData = new FormData()
    formData.append("job_description", body.job_description)
    formData.append("cv_file", body.cv_file)

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        body: formData,
        signal: controller.signal,
      })

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`)
      }

      setState((s) => ({ ...s, status: "streaming" }))

      const reader = res.body?.getReader()
      if (!reader) throw new Error("No response body")

      const decoder = new TextDecoder()
      let buffer = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split("\n")
        buffer = lines.pop() ?? ""

        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed.startsWith("data:")) continue

          const jsonStr = trimmed.slice(5).trim()
          if (!jsonStr) continue

          try {
            const event: SSEEvent = JSON.parse(jsonStr)
            onEvent?.(event)

            if (event.type === "progress") {
              setState((s) => ({
                ...s,
                progress: event.progress,
                currentStep: event.step,
              }))
            } else if (event.type === "done") {
              setState((s) => ({
                ...s,
                status: "done",
                progress: 100,
                analyseId: event.analyse_id,
              }))
            } else if (event.type === "error") {
              setState((s) => ({
                ...s,
                status: "error",
                error: event.message,
              }))
            }
          } catch {
            // Skip malformed JSON lines
          }
        }
      }

      setState((s) => (s.status === "streaming" ? { ...s, status: "done" } : s))
    } catch (err) {
      if ((err as Error).name === "AbortError") return
      setState((s) => ({
        ...s,
        status: "error",
        error: (err as Error).message ?? "Streaming error",
      }))
    }
  }

  function stop() {
    abortRef.current?.abort()
    setState(INITIAL_STATE)
  }

  function reset() {
    setState(INITIAL_STATE)
  }

  return { state, start, stop, reset }
}
