"use client"

import { useQuery } from "@tanstack/react-query"
import { fetchAnalyseDetails } from "../_api/chat-message.api"
import { ANALYSE_DETAILS_QUERY_KEY } from "../_api/queries"

export const useRetrieveAnalyses = ({ analyse_id }: { analyse_id: string | null }) => {

    if (!analyse_id) {
        return { analyse: null, isLoading: false, error: null }
    }

    const { data: analyse, isLoading, error } = useQuery({
        queryKey: [ANALYSE_DETAILS_QUERY_KEY, analyse_id],
        queryFn: async () => await fetchAnalyseDetails(analyse_id ?? ""),
        enabled: !!analyse_id
    })
    return { analyse, isLoading, error }

}