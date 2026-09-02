import { ChatMessageItem } from "../_types";
import { AnalyseDetailsApiResponse, ChatHistoryApiResponse, MessageApiResponse } from "../_types/api";


export const defaultAnalyseApiResponse: AnalyseDetailsApiResponse = {
    id: "",
    conversation_id: "",
    job_description: "",
    score_global: 0,
    score_ats: 0,
    score_competences: 0,
    score_experience: 0,
    keywords_found: [],
    keywords_missing: [],
    recommandations: [],
    ai_provider: "",
    ai_model: "",
    cv_id: null,
    created_at: "",
    updated_at: "",

}


export const defaultChatHistoryApiResponse: ChatHistoryApiResponse = {
    conversation_id: null,
    title: null,
    messages: []
}


export const messagesMapperFromApiResponse = (messages: MessageApiResponse[]): ChatMessageItem[] => {
    return messages.map((message: MessageApiResponse) => ({
        id: message.id,
        role: message.role as "user" | "assistant",
        content: message.content,
        timestamp: message.created_at,
    }))
}
