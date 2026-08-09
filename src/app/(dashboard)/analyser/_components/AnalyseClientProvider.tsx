"use client"

import { useAnalyseStore } from "@/store/analyse.store"
import { useRetrieveAnalyses } from "../_hooks/useRetrieveAnalyses"
import { useChatHistory } from "../_hooks/useChatHistory"
import { useEffect, useMemo } from "react"
import { Analyse, SSEResultEvent } from "@/types"

interface AnalyserClientProviderProps {
    children: React.ReactNode
    conversation_id?: string
    analyse_id?: string
}

export const AnalyserClientProvider = ({ children, conversation_id, analyse_id }: AnalyserClientProviderProps) => {
    // useChatHistory({ conversation_id: conversation_id || null })
    const { analyse, isLoading } = useRetrieveAnalyses({ analyse_id: analyse_id || null })
    const setAnalyse = useAnalyseStore()



    useEffect(() => {
        if (!analyse) return


        const current_analyse: Analyse = {
            ...analyse,
            id: analyse.id,
            job_description: analyse.job_description,
            score_global: analyse.score_global,
            score_ats: analyse.score_ats,
            score_competences: analyse.score_competences,
            score_experience: analyse.score_experience,
            keywords_found: analyse.keywords_found,
            keywords_missing: analyse.keywords_missing,
            recommandations: analyse.recommandations,
            ai_provider: analyse.ai_provider,
            ai_model: analyse.ai_model,
            created_at: analyse.created_at,
            updated_at: analyse.updated_at,
            cv_id: analyse.cv_id || null,
            chat_history: []
        } satisfies Analyse

        setAnalyse.setCurrentAnalyse(current_analyse)
        const live_result = {
            type: "result",
            score_global: current_analyse.score_global,
            score_ats: current_analyse.score_ats,
            score_competences: current_analyse.score_competences,
            score_experience: current_analyse.score_experience,
            keywords_found: current_analyse.keywords_found,
            keywords_missing: current_analyse.keywords_missing,
            recommandations: current_analyse.recommandations,

        } satisfies SSEResultEvent
        setAnalyse.setLiveResult(live_result)
        setAnalyse.setSavedAnalyseId(analyse.id)



    }, [analyse, isLoading])



    return children
}