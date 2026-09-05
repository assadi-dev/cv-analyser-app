"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { logError } from "@/lib/logger"
import { useToast } from "@/hooks/useToast"
import { ME_QUERY_KEY, updateProfil, type UpdateProfilResponse } from "../_api/profil.api"
import type { User } from "@/types"
import type { ProfilFormValues } from "../_lib/profil.schema"

// The session (topbar/sidebar) is sourced from better-auth's own `user.name`,
// a separate store from the FastAPI profile this mutation updates — push the
// new name there too so it doesn't go stale after a profile edit.
async function syncSessionName(updated: UpdateProfilResponse) {
  const name = [updated.first_name, updated.last_name].filter(Boolean).join(" ")
  if (!name) return
  try {
    await authClient.updateUser({ name })
  } catch (error) {
    logError(error, "useUpdateProfil:syncSessionName")
  }
}

export function useUpdateProfil() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const toast = useToast()

  return useMutation({
    mutationFn: (values: ProfilFormValues) => updateProfil(values),
    onSuccess: async (updated) => {
      queryClient.setQueryData<User>([ME_QUERY_KEY], (old) =>
        old ? { ...old, ...updated } : old
      )
      await syncSessionName(updated)
      router.refresh()
      toast.success("Profil mis à jour")
    },
    onError: (error) => {
      logError(error, "useUpdateProfil")
      toast.error("Impossible de mettre à jour le profil")
    },
  })
}
