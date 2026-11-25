import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import type { ReactNode } from "react"
import { renderHook, waitFor } from "@testing-library/react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

vi.mock("@/lib/auth-client", () => ({
  authClient: { deleteUser: vi.fn() },
}))

const toast = { error: vi.fn(), success: vi.fn() }
vi.mock("@/hooks/useToast", () => ({ useToast: () => toast }))

import { authClient } from "@/lib/auth-client"
import { useDeleteAccount } from "@/app/(dashboard)/parametres/_hooks/useDeleteAccount"

const deleteUser = vi.mocked(authClient.deleteUser)
const assign = vi.fn()

const wrapper = ({ children }: { children: ReactNode }) => (
  <QueryClientProvider
    client={new QueryClient({ defaultOptions: { mutations: { retry: false } } })}
  >
    {children}
  </QueryClientProvider>
)

/** The shape better-auth's client resolves with when the server refuses. */
const refusal = (message: string, code?: string) =>
  ({ data: null, error: { message, code, status: 400, statusText: "Bad Request" } }) as never

describe("useDeleteAccount", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.stubGlobal("location", { assign })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("sends the user to the login page once the account is deleted", async () => {
    deleteUser.mockResolvedValue({ data: { success: true, message: "User deleted" }, error: null } as never)

    const { result } = renderHook(() => useDeleteAccount(), { wrapper })
    result.current.mutate()

    await waitFor(() => expect(assign).toHaveBeenCalledWith("/login"))
    expect(toast.error).not.toHaveBeenCalled()
  })

  it("does not leave the page when better-auth refuses the deletion", async () => {
    // The client resolves with { error } instead of throwing: a refusal that
    // is not turned into an error would redirect with the account still there.
    deleteUser.mockResolvedValue(refusal("La suppression de vos données a échoué."))

    const { result } = renderHook(() => useDeleteAccount(), { wrapper })
    result.current.mutate()

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(assign).not.toHaveBeenCalled()
    expect(toast.error).toHaveBeenCalledWith(
      "Impossible de supprimer le compte",
      "La suppression de vos données a échoué."
    )
  })

  it("tells the user to sign in again when the session is too old", async () => {
    deleteUser.mockResolvedValue(refusal("Session expired", "SESSION_EXPIRED"))

    const { result } = renderHook(() => useDeleteAccount(), { wrapper })
    result.current.mutate()

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(assign).not.toHaveBeenCalled()
    expect(toast.error).toHaveBeenCalledWith(
      "Connexion trop ancienne",
      expect.stringContaining("reconnectez-vous")
    )
  })

  it("reports a network failure instead of redirecting", async () => {
    deleteUser.mockRejectedValue(new Error("Failed to fetch"))

    const { result } = renderHook(() => useDeleteAccount(), { wrapper })
    result.current.mutate()

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(assign).not.toHaveBeenCalled()
    expect(toast.error).toHaveBeenCalledWith(
      "Impossible de supprimer le compte",
      "Failed to fetch"
    )
  })
})
