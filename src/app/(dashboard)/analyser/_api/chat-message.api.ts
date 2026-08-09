import { api } from "@/lib/api"
import { ANALYSE_CHAT_HISTORY_ENDPOINT, ANALYSE_DETAILS_ENDPOINT } from "./analyse.api"
import { promises } from "dns"
import { AnalyseDetailsApiResponse, ChatHistoryApiResponse } from "../_types/api"






export const fetchChatHistory = async (conversationId?: string | null): Promise<ChatHistoryApiResponse> => {
    if (!conversationId) {
        return {
            conversation_id: null,
            title: null,
            messages: []
        }
    }
    const response = await api.get<ChatHistoryApiResponse>(`${ANALYSE_CHAT_HISTORY_ENDPOINT}/${conversationId}`)
    return response
}

export const fetchAnalyseDetails = async (analyseId?: string | null): Promise<AnalyseDetailsApiResponse> => {
    if (!analyseId) {
        throw new Error("Analyse ID is required")
    }
    const response = await api.get<AnalyseDetailsApiResponse>(`${ANALYSE_DETAILS_ENDPOINT}/${analyseId}`)
    return response
}
