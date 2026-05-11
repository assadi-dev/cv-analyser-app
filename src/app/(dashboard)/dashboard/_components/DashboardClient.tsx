"use client"

import { useRouter } from "next/navigation"
import type { CandidatureStatus } from "@/types"
import { useCandidatures, useUpdateCandidatureStatus } from "../_hooks/useCandidatures"
import { useDashboardStats } from "../_hooks/useDashboardStats"
import { StatsSection } from "./StatsSection/StatsSection"
import { KanbanBoard } from "./KanbanBoard/KanbanBoard"

export function DashboardClient() {
  const router = useRouter()
  const { candidatures, isLoading } = useCandidatures()
  const { mutate: updateStatus } = useUpdateCandidatureStatus()
  const stats = useDashboardStats(candidatures)

  const handleStatusChange = (id: string, status: CandidatureStatus) => {
    updateStatus({ id, status })
  }

  const handleNewAnalysis = () => {
    router.push("/analyser")
  }

  return (
    <div className="flex flex-col gap-6 p-4 sm:p-8">
      <StatsSection stats={stats} />
      <KanbanBoard
        candidatures={candidatures}
        isLoading={isLoading}
        onStatusChange={handleStatusChange}
        onNewAnalysis={handleNewAnalysis}
      />
    </div>
  )
}
