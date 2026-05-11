import type { CandidatureStatus } from "@/types"

export interface StatusTab {
  value: CandidatureStatus | "all"
  label: string
}
