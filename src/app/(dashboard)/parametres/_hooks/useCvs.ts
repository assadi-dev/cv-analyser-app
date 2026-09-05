"use client"

import { useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { logError } from "@/lib/logger"
import { CVS_QUERY_KEY, fetchCvs } from "../_api/cvs.api"

export function useCvs() {
  const { data, isLoading, error } = useQuery({
    queryKey: [CVS_QUERY_KEY],
    queryFn: fetchCvs,
  })

  useEffect(() => {
    if (error) logError(error, "useCvs")
  }, [error])

  return { cvs: data ?? [], isLoading }
}
