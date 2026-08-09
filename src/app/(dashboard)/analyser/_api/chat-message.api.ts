import { api } from "@/lib/api"
import { ANALYSE_CHAT_HISTORY_ENDPOINT, ANALYSE_DETAILS_ENDPOINT } from "./analyse.api"






export const fetchChatHistory = async (conversationId?: string | null) => {
    if (!conversationId) {
        return { data: [] }
    }
    const response = await api.get(`${ANALYSE_CHAT_HISTORY_ENDPOINT}/${conversationId}`)
    return response
}

export const fetchAnalyseDetails = async (analyseId?: string | null) => {
    if (!analyseId) {
        return null
    }
    const response = await api.get(`${ANALYSE_DETAILS_ENDPOINT}/${analyseId}`)
    return response
}
