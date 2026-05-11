"use client"

import { useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { logError } from "@/lib/logger"
import type { CandidatureStatus } from "@/types"
import {
  CANDIDATURES_QUERY_KEY,
  fetchCandidatures,
} from "../_api/candidatures.api"

interface UseCandidaturesOptions {
  page: number
  status: CandidatureStatus | "all"
}

export function useCandidatures({ page, status }: UseCandidaturesOptions) {
  const { data, isLoading, error } = useQuery({
    queryKey: [CANDIDATURES_QUERY_KEY, page, status],
    queryFn: () => fetchCandidatures({ page, status }),
  })

  useEffect(() => {
    if (error) logError(error, "useCandidatures")
  }, [error])

  return {
    candidatures: data?.items ?? [],
    total:        data?.total ?? 0,
    pages:        data?.pages ?? 0,
    isLoading,
  }
}
