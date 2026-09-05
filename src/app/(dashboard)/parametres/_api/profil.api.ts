import { api } from "@/lib/api"
import type { User } from "@/types"
import type { ProfilFormValues } from "../_lib/profil.schema"

export const ME_QUERY_KEY = "me"

export const fetchMe = (): Promise<User> => api.get<User>("/api/me")

export interface UpdateProfilResponse {
  first_name: string | null
  last_name: string | null
  professional_title: string | null
  full_name: string | null
}

export const updateProfil = (payload: ProfilFormValues): Promise<UpdateProfilResponse> =>
  api.patch<UpdateProfilResponse>("/api/preferences/profile", payload)
