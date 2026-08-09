"use client"

import { useQuery } from "@tanstack/react-query"
import { fetchChatHistory } from "../_api/chat-message.api"
import { CHAT_HISTORY_QUERY_KEY } from "../_api/queries"

export const useChatHistory = ({ conversation_id }: { conversation_id: string | null }) => {
    const { data: messages, isLoading, error } = useQuery({
        queryKey: [CHAT_HISTORY_QUERY_KEY, conversation_id],
        queryFn: async () => await fetchChatHistory(conversation_id),
        enabled: !!conversation_id
    })

    return { messages, isLoading, error }

}