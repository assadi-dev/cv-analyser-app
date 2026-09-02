"use client"

import { useQuery } from "@tanstack/react-query"
import { fetchChatHistory } from "../_api/chat-message.api"
import { CHAT_HISTORY_QUERY_KEY } from "../_api/queries"
import { defaultChatHistoryApiResponse } from "../_api/initialState"

export const useChatHistory = ({ conversation_id }: { conversation_id: string | null }) => {


    if (!conversation_id) return defaultChatHistoryApiResponse

    const { data, isLoading, error } = useQuery({
        queryKey: [CHAT_HISTORY_QUERY_KEY, conversation_id],
        queryFn: async () => await fetchChatHistory(conversation_id),
        enabled: !!conversation_id
    })

    return { messages: data?.messages, conversation_id: data?.conversation_id, title: data?.title, isLoading, error }

}