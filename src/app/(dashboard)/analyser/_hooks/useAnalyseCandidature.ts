"use client"

import { useQuery } from "@tanstack/react-query"
import { fetchCandidature } from "@/app/(dashboard)/candidatures/_api/candidatures.api"
import { ANALYSE_CANDIDATURE_QUERY_KEY } from "../_api/analyse.api"
import { CVS_QUERY_KEY, fetchCvs } from "@/app/(dashboard)/parametres/_api/cvs.api"
import { fetchAnalyseDetails } from "../_api/chat-message.api"
import { ANALYSE_DETAILS_QUERY_KEY } from "../_api/queries"

/**
 * The candidature an analysis is being launched for, when the page was opened
 * from one (`?candidature_id=`), and the job description to pre-fill with.
 *
 * Without an id nothing is fetched and the analysis stays standalone.
 */
export function useAnalyseCandidature(candidatureId: string | undefined) {
  const { data, isLoading, isError } = useQuery({
    queryKey: [ANALYSE_CANDIDATURE_QUERY_KEY, candidatureId],
    queryFn: () => fetchCandidature(candidatureId as string),
    enabled: Boolean(candidatureId),
    // A wrong or foreign id answers 404 every time: retrying only delays the message.
    retry: false,
  })

  // The offer kept on the candidature comes first. Older candidatures were
  // created before it was stored: when one has an analysis attached, that
  // analysis still holds the text it was run on.
  const storedJobDescription = data?.job_description?.trim() || undefined
  const linkedAnalyseId = data && !storedJobDescription ? data.analyse_id : null

  const { data: linkedAnalyse } = useQuery({
    queryKey: [ANALYSE_DETAILS_QUERY_KEY, linkedAnalyseId],
    queryFn: () => fetchAnalyseDetails(linkedAnalyseId),
    enabled: Boolean(linkedAnalyseId),
    retry: false,
  })

  // The CV linked to the candidature, so the analysis can run on it as it is.
  // The list is only fetched when there is one to name.
  const linkedCvId = data?.cv_id ?? undefined
  const { data: cvs } = useQuery({
    queryKey: [CVS_QUERY_KEY],
    queryFn: fetchCvs,
    enabled: Boolean(linkedCvId),
  })
  const linkedCv = linkedCvId
    ? { id: linkedCvId, name: cvs?.find((cv) => cv.id === linkedCvId)?.name }
    : undefined

  return {
    /** Set only once the API confirmed the candidature is the user's. */
    candidature: data,
    /** The CV stored on the candidature; `name` is missing until the list loads. */
    linkedCv,
    /** Text to pre-fill the job description with, when there is one. */
    jobDescription: storedJobDescription ?? (linkedAnalyse?.job_description?.trim() || undefined),
    isLoading: Boolean(candidatureId) && isLoading,
    isError,
  }
}
