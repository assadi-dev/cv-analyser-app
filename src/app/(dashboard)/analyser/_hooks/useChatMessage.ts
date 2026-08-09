"use client"

import { useAnalyseStore } from "@/store/analyse.store"
import { useEffect, useState, useTransition } from "react"
import { ChatMessageItem } from "../_types"
import { useToast } from "@/hooks/useToast"
import { ChatMessageSSEStepEvent, SSEEvent, SSEResultEvent } from "@/types"
import { logError } from "@/lib/logger"
import { useMessagesStore } from "@/store/useMessagesStore"
import { useChatSSE } from "@/hooks/useChatSSE"

export const CHAT_STREAM_ENDPOINT = "/api/ia/chat/stream"


export const useChatMessage = () => {
    const [isPending, setIsPending] = useState<boolean>(false)
    const toast = useToast()
    const { conversation_id, messages, addMessage, setConversationId } = useMessagesStore()


    function handleEvent(event: ChatMessageSSEStepEvent) {

        if (event.type === "start") {
            if (!conversation_id) {
                setConversationId(event.conversation_id)
            }
            setIsPending(true)


        } else if (event.type === "complete") {
            setIsPending(false)
            const message: ChatMessageItem = {
                id: event.data?.id ?? crypto.randomUUID(),
                role: event.data?.role ?? "assistant",
                content: String(event.data?.content),
                timestamp: event.data?.timestamp ?? new Date().toISOString(),
            }
            addMessage(message)
        } else if (event.type === "error") {
            logError(event.message, "useChatMessage")
            toast.error("L'agent n'est pas disponible", "Veuillez réessayer plus tard")
            setIsPending(false)
        }
    }

    const { state, start, reset: resetStream } = useChatSSE(handleEvent)



    const savedAnalyseId = useAnalyseStore((s) => s.savedAnalyseId)


    const sendMessage = (question: string) => {

        addMessage({
            role: "user",
            content: question,
            id: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
        })

        if (!conversation_id && !savedAnalyseId) throw new Error("Analyse ID is required")

        start(CHAT_STREAM_ENDPOINT, {
            // Omitted rather than sent as "": the API schema treats
            // conversation_id as an optional uuid, not an optional string —
            // an empty string fails validation instead of being ignored.
            ...(conversation_id ? { conversation_id } : {}),
            question,
            // Once a conversation exists, its snapshot already carries the
            // analysis context — resending analyse_id would just point back
            // at the same one.
            ...(!conversation_id ? { analyse_id: savedAnalyseId! } : {}),
        })
    }







    return { messages, isPending, sendMessage }


}