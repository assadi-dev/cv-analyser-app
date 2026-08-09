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