"use client"

import { useMemo } from "react"
import type { CandidatureSummary } from "@/types"
import type { DashboardStats } from "../_types"

export function useDashboardStats(candidatures: CandidatureSummary[]): DashboardStats {
  return useMemo(
    () => ({
      total: candidatures.length,
      sent: candidatures.filter((c) => c.status !== "to_send").length,
      interview: candidatures.filter((c) => c.status === "interview").length,
    }),
    [candidatures]
  )
}
