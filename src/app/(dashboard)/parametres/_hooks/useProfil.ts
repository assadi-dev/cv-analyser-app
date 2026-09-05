"use client"

import { useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { logError } from "@/lib/logger"
import { ME_QUERY_KEY, fetchMe } from "../_api/profil.api"

export function useProfil() {
  const { data, isLoading, error } = useQuery({
    queryKey: [ME_QUERY_KEY],
    queryFn: fetchMe,
  })

  useEffect(() => {
    if (error) logError(error, "useProfil")
  }, [error])

  return { profil: data, isLoading }
}
