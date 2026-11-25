"use client"

import { useMutation } from "@tanstack/react-query"
import { authClient } from "@/lib/auth-client"
import { logError } from "@/lib/logger"
import { useToast } from "@/hooks/useToast"
import { describeDeleteAccountError } from "../_lib/delete-account-errors"

/** A refusal from better-auth, kept with its code so the UI can tell them apart. */
class DeleteAccountError extends Error {
  constructor(
    message: string,
    readonly code?: string
  ) {
    super(message)
    this.name = "DeleteAccountError"
  }
}

export function useDeleteAccount() {
  const toast = useToast()

  return useMutation({
    mutationFn: async () => {
      // The better-auth client resolves with `{ error }` rather than throwing:
      // without this check a refused deletion would count as a success and
      // send the user to the login page with their account still there.
      const { error } = await authClient.deleteUser()
      if (error) throw new DeleteAccountError(error.message ?? "", error.code)
    },
    onSuccess: () => {
      // A full navigation rather than router.push: the query cache, the stores
      // and the session held in memory all belong to an account that no longer
      // exists, and a client-side transition would keep them around (and
      // refetch them against a session that is already gone).
      window.location.assign("/login")
    },
    onError: (error) => {
      logError(error, "useDeleteAccount")
      const { title, description } = describeDeleteAccountError(
        error instanceof DeleteAccountError ? error.code : undefined,
        error.message
      )
      toast.error(title, description)
    },
  })
}
