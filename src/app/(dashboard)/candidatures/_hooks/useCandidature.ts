"use client"

import { useQuery } from "@tanstack/react-query"
import { CANDIDATURE_QUERY_KEY, fetchCandidature } from "../_api/candidatures.api"

/**
 * One candidature in full, including the job description the list leaves out.
 * `undefined` fetches nothing.
 */
export function useCandidature(candidatureId: string | undefined) {
  return useQuery({
    queryKey: [CANDIDATURE_QUERY_KEY, candidatureId],
    queryFn: () => fetchCandidature(candidatureId as string),
    enabled: Boolean(candidatureId),
    // Never reuse an earlier copy: the edit form reads its values once, when
    // it mounts, so a cached one would pre-fill text that has since changed.
    gcTime: 0,
    // A missing or foreign id answers 404 every time.
    retry: false,
  })
}
