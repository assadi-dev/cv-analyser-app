import { describe, it, expect, vi, beforeEach } from "vitest"

vi.mock("@/lib/api", () => ({
  apiExternal: { post: vi.fn() },
}))

import { apiExternal } from "@/lib/api"
import { removeApiAccount } from "@/app/(auth)/helper"

const post = vi.mocked(apiExternal.post)

describe("removeApiAccount", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it("asks FastAPI to remove the token's account, with the confirmation it requires", async () => {
    post.mockResolvedValue({ message: "User account removed successfully" })

    await removeApiAccount("api-token")

    expect(post).toHaveBeenCalledWith(
      "/api/v1/account/remove",
      { confirm: true },
      { headers: { Authorization: "Bearer api-token" } }
    )
  })

  it("lets a failure through, so the better-auth account is not deleted after it", async () => {
    post.mockRejectedValue(new Error("500"))

    await expect(removeApiAccount("api-token")).rejects.toThrow("500")
  })
})
