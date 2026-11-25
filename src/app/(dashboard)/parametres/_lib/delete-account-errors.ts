/** What the user is told when their account could not be deleted. */
export interface DeleteAccountErrorMessage {
  title: string
  description?: string
}

/** better-auth code for a session too old to delete an account without a password. */
export const SESSION_EXPIRED = "SESSION_EXPIRED"

/**
 * Turns a better-auth error into something the user can act on.
 *
 * Deleting an account is a sensitive action: better-auth refuses it on a
 * session older than a day unless the password is sent. Signing in again is
 * the way out, and without saying so the user would only see a generic failure
 * and retry in vain.
 *
 * Any other error carries a message written for the user (see `beforeDelete`
 * in lib/auth.ts), which is shown as is.
 */
export function describeDeleteAccountError(
  code: string | undefined,
  message: string | undefined
): DeleteAccountErrorMessage {
  if (code === SESSION_EXPIRED) {
    return {
      title: "Connexion trop ancienne",
      description:
        "Par sécurité, déconnectez-vous puis reconnectez-vous avant de supprimer votre compte.",
    }
  }
  return { title: "Impossible de supprimer le compte", description: message }
}
