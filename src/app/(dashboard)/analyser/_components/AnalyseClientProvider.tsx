"use client"

import { useAnalyseStore } from "@/store/analyse.store"
import { useRetrieveAnalyses } from "../_hooks/useRetrieveAnalyses"
import { useChatHistory } from "../_hooks/useChatHistory"

interface AnalyserClientProviderProps {
    children: React.ReactNode
    conversation_id?: string
    analyse_id?: string
}

export const AnalyserClientProvider = ({ children, conversation_id, analyse_id }: AnalyserClientProviderProps) => {
    // useChatHistory({ conversation_id: conversation_id || null })
    useRetrieveAnalyses({ analyse_id: analyse_id || null })






    return children
}