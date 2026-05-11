"use client"

import { useQueryStates, parseAsInteger, parseAsString } from "nuqs"
import type { CandidatureStatus } from "@/types"

export function useCandidaturesParams() {
  const [params, setParams] = useQueryStates({
    page:   parseAsInteger.withDefault(1),
    status: parseAsString.withDefault("all"),
    q:      parseAsString.withDefault(""),
  })

  return {
    page:      params.page,
    status:    params.status as CandidatureStatus | "all",
    search:    params.q,

    setPage:   (page: number) => setParams({ page }),
    setStatus: (status: CandidatureStatus | "all") => setParams({ status, page: 1 }),
    setSearch: (q: string) => setParams({ q }),
  }
}
