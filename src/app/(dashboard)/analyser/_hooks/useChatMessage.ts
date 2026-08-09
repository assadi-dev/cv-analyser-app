"use client"

import { useAnalyseStore } from "@/store/analyse.store"
import { useEffect, useState, useTransition } from "react"
import { ChatMessageItem } from "../_types"
import { CHAT_STREAM_ENDPOINT } from "../_api/chat-message.api"
import { useSSE } from "@/hooks/useSSE"
import { useToast } from "@/hooks/useToast"
import { ChatMessageSSEStepEvent, SSEEvent, SSEResultEvent } from "@/types"
import { logError } from "@/lib/logger"
import { useMessagesStore } from "@/store/useMessagesStore"
import { useChatSSE } from "@/hooks/useChatSSE"


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
                id: crypto.randomUUID(),
                role: "assistant",
                content: String(event.data.content),
                timestamp: event.data.timestamp!,
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







    return { messages, isPending }


}