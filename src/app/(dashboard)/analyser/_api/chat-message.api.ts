import { api } from "@/lib/api"

export const CHAT_STREAM_ENDPOINT = "/api/ia/chat/stream"


export const fetchChatMessage = async (question: string, conversationID: string) => {
    const response = await api.post(CHAT_STREAM_ENDPOINT, { question, conversationID });

    if (!response.ok) {
        throw new Error('Failed to fetch chat message');
    }

    return response.json();
}