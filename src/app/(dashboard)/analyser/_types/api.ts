import { Recommendation } from "@/types";


export type RecommendationItemType = Recommendation

export type AnalyseDetailsApiResponse = {
    id: string;
    job_description: string;
    keywords_found: string[];
    keywords_missing: string[];
    conversation_id: string;
    score_ats: number;
    score_competences: number;
    score_experience: number;
    score_global: number;
    recommandations: RecommendationItemType[];
    ai_model: string
    ai_provider: string
    cv_id: string | null;
    created_at: string
    updated_at: string

}


export interface MessageApiResponse {
    id: string;
    conversation_id: string;
    content: string;
    role: string;
    created_at: string;
}

export interface ChatHistoryApiResponse {
    conversation_id: string | null;
    title: string | null;
    messages: MessageApiResponse[];
}

