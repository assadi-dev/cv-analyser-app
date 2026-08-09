

export type RecommendationItemType = {
    title: string;
    type: string;
    description: string;
    impact: string;
}

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
}