import { api } from "@/lib/api"
import type { CVSummary } from "@/types"

export const CVS_QUERY_KEY = "cvs"

export const fetchCvs = (): Promise<CVSummary[]> => api.get<CVSummary[]>("/api/cvs")

/**
 * Imports a CV. Sent as multipart straight through `fetch`: the JSON client
 * would label the body application/json and lose the multipart boundary.
 */
export const uploadCv = async (file: File): Promise<CVSummary> => {
  const formData = new FormData()
  formData.append("file", file)
  const response = await fetch("/api/cvs", { method: "POST", body: formData })
  if (!response.ok) {
    throw new Error(`CV upload failed (HTTP ${response.status})`)
  }
  return response.json() as Promise<CVSummary>
}
