import type { CandidatureStatus } from "@/types"

export interface KanbanColumnConfig {
  status: CandidatureStatus
  label: string
  bg: string
  dotColor: string
  textColor: string
  countBg: string
}

export interface DashboardStats {
  total: number
  sent: number
  interview: number
}
