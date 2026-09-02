import { api } from "@/lib/api"

/** Endpoint SSE de l'analyse (consommé par useSSE). */
export const ANALYSE_STREAM_ENDPOINT = "/api/ia/analyse-stream"

// endpoint api rest
export const ANALYSE_DETAILS_ENDPOINT = "/api/analyse"
export const ANALYSE_CHAT_HISTORY_ENDPOINT = "/api/chat/history"

export const ANALYSE_CHAT_MUTATION_KEY = "analyse-chat"

export interface SendChatMessagePayload {
  analyse_id: string
  message: string
}

export interface ChatResponse {
  message: string
}

export const sendChatMessage = (
  payload: SendChatMessagePayload,
): Promise<ChatResponse> => api.post<ChatResponse>("/api/v1/analyses/chat", payload)
