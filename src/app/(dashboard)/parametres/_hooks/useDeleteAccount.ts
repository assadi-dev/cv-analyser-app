"use client"

import { useMutation } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { logError } from "@/lib/logger"
import { useToast } from "@/hooks/useToast"

export function useDeleteAccount() {
  const router = useRouter()
  const toast = useToast()

  return useMutation({
    mutationFn: () => authClient.deleteUser(),
    onSuccess: () => {
      router.push("/login")
    },
    onError: (error) => {
      logError(error, "useDeleteAccount")
      toast.error("Impossible de supprimer le compte")
    },
  })
}
