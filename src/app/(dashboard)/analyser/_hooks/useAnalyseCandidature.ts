"use client"

import { useQuery } from "@tanstack/react-query"
import { fetchCandidature } from "@/app/(dashboard)/candidatures/_api/candidatures.api"
import { ANALYSE_CANDIDATURE_QUERY_KEY } from "../_api/analyse.api"

/**
 * The candidature an analysis is being launched for, when the page was opened
 * from one (`?candidature_id=`). Without an id nothing is fetched and the
 * analysis stays standalone.
 */
export function useAnalyseCandidature(candidatureId: string | undefined) {
  const { data, isLoading, isError } = useQuery({
    queryKey: [ANALYSE_CANDIDATURE_QUERY_KEY, candidatureId],
    queryFn: () => fetchCandidature(candidatureId as string),
    enabled: Boolean(candidatureId),
    // A wrong or foreign id answers 404 every time: retrying only delays the message.
    retry: false,
  })

  return {
    /** Set only once the API confirmed the candidature is the user's. */
    candidature: data,
    isLoading: Boolean(candidatureId) && isLoading,
    isError,
  }
}
