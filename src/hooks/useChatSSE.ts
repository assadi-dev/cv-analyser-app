"use client"

// React Compiler (Next.js 16) handles memoization automatically.
// useCallback and useMemo are no longer needed.
import { useEffect, useRef, useState } from "react"
import type { ChatMessage, ChatMessageSSEStepEvent } from "@/types"

export type SSEStatus = "idle" | "connecting" | "streaming" | "done" | "error"

interface SSEState {
    status: SSEStatus
    conversation_id: string | null
    error: string | null
    message_id: string | null
    content: string | null
    timestamp: string | null
    role: ChatMessage['role']
}

const INITIAL_STATE: SSEState = {
    status: "idle",
    conversation_id: null,
    error: null,
    message_id: null,
    content: null,
    timestamp: null,
    role: "assistant",
}

/**
 * Body of a chat stream request.
 *
 * Three ways to call it, mirroring the API contract:
 *  - conversation_id + question  → resume a thread, context is read server-side
 *  - analyse_id + question       → new thread grounded on a stored analysis
 *  - cv_text + job_description   → new thread with no analysis behind it
 */
type ChatMessageSSERequestBody = {
    question: string
    conversation_id?: string
    analyse_id?: string
    cv_text?: string
    job_description?: string
    score_global?: number
    // "recommandations", not "recommendations": the API keeps the French
    // spelling it inherited from the Analyse model.
    recommandations?: unknown[]
}

/**
 * Hook for consuming the chat SSE stream.
 *
 * Uses fetch + ReadableStream instead of EventSource so the request can be a
 * POST carrying a JSON body.
 *
 * Frames are shaped as: { type, conversation_id, message, complete, error?,
 * data?: { id, chunk, content, role, timestamp } } — `data.id` is the id of
 * the ChatMessage row the answer is stored under, and is stable from the very
 * first frame.
 *
 * @param onEvent - Callback called for each parsed SSE event.
 */
export function useChatSSE(onEvent?: (event: ChatMessageSSEStepEvent) => void) {
    const [state, setState] = useState<SSEState>(INITIAL_STATE)
    const abortRef = useRef<AbortController | null>(null)

    // Abort any stream still running when the component goes away, otherwise
    // it keeps reading and calling setState on an unmounted component.
    useEffect(() => {
        return () => abortRef.current?.abort()
    }, [])

    async function start(url: string, body: ChatMessageSSERequestBody) {
        // Cancel any in-progress stream
        abortRef.current?.abort()
        const controller = new AbortController()
        abortRef.current = controller

        setState({ ...INITIAL_STATE, status: "connecting" })

        const apiUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? ""}${url}`

        try {
            const res = await fetch(apiUrl, {
                method: "POST",
                // Without this header fetch sends text/plain and the API
                // rejects the body with a 422.
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
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
            let receivedComplete = false

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
                        const event: ChatMessageSSEStepEvent = JSON.parse(jsonStr)
                        onEvent?.(event)

                        if (event.type === "error") {
                            setState((s) => ({
                                ...s,
                                status: "error",
                                conversation_id: event.conversation_id,
                                // On an error frame `message` is null: the text
                                // lives in `error`.
                                error: event.error ?? event.message ?? "Streaming error",
                            }))
                            continue
                        }

                        if (event.type === "complete") {
                            receivedComplete = true
                        }

                        setState((s) => ({
                            ...s,
                            status: event.type === "complete" ? "done" : "streaming",
                            conversation_id: event.conversation_id,
                            // data.id is the ChatMessage id — same value on
                            // every frame of a given answer.
                            message_id: event.data?.id ?? s.message_id,
                            content: event.data?.content ?? s.content,
                            timestamp: event.data?.timestamp ?? s.timestamp,
                            role: event.data?.role ?? s.role,
                        }))
                    } catch {
                        // Skip malformed JSON lines
                    }
                }
            }

            // A stream that ends without its "complete" frame was cut short.
            // The server stores what it had as a partial answer, so surfacing
            // it as "done" would show a truncated reply as a finished one.
            setState((s) =>
                s.status === "streaming"
                    ? receivedComplete
                        ? { ...s, status: "done" }
                        : { ...s, status: "error", error: "Réponse interrompue" }
                    : s,
            )
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
        // conversation_id and message_id are kept: the thread exists server
        // side, along with whatever was already streamed, and both ids are
        // needed to reopen it.
        setState((s) => ({
            ...INITIAL_STATE,
            conversation_id: s.conversation_id,
            message_id: s.message_id,
            content: s.content,
        }))
    }

    function reset() {
        setState(INITIAL_STATE)
    }

    return { state, start, stop, reset }
}
