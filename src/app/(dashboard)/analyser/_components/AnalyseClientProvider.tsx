"use client"

import { useAnalyseStore } from "@/store/analyse.store"
import { useRetrieveAnalyses } from "../_hooks/useRetrieveAnalyses"
import { useChatHistory } from "../_hooks/useChatHistory"
import { useEffect, useMemo } from "react"
import { Analyse, SSEResultEvent } from "@/types"
import { useMessagesStore } from "@/store/useMessagesStore"
import { messagesMapperFromApiResponse } from "../_api/initialState"

interface AnalyserClientProviderProps {
    children: React.ReactNode
    conversation_id?: string
    analyse_id?: string
}

export const AnalyserClientProvider = ({ children, conversation_id, analyse_id }: AnalyserClientProviderProps) => {
    const { messages } = useChatHistory({ conversation_id: conversation_id || null })
    const { analyse, isLoading: analyseLoading } = useRetrieveAnalyses({ analyse_id: analyse_id || null })
    const analyseStore = useAnalyseStore()
    const messagesStore = useMessagesStore()




    useEffect(() => {
        if (!analyse || !analyse_id) return
        const current_analyse: Analyse = {

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

        analyseStore.setCurrentAnalyse(current_analyse)
        analyseStore.setSavedAnalyseId(analyse.id)



    }, [analyse, analyse_id])

    useEffect(() => {
        if (!conversation_id || !messages) return
        //set conversation id to the store
        messagesStore.setConversationId(conversation_id)

        //set messages to the store
        if (messages.length === 0) return
        const mappedMessages = messagesMapperFromApiResponse(messages)
        messagesStore.setMessages(mappedMessages)


    }, [conversation_id, messages])



    return children
}