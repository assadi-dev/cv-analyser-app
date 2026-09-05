import { api } from "@/lib/api"
import type { CVSummary } from "@/types"

export const CVS_QUERY_KEY = "cvs"

export const fetchCvs = (): Promise<CVSummary[]> => api.get<CVSummary[]>("/api/cvs")
