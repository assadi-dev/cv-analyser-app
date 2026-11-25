import { AuthenApiResponse, EncryptedData } from "./type"
import { apiExternal } from "@/lib/api"

export const syncProfile = async (encryptedData: EncryptedData): Promise<AuthenApiResponse | null> => {
    try {
        // 2 — Sync extended profile to FastAPI
        const result = await apiExternal.post("/api/v1/auth/token", {
            encrypted_key: encryptedData.encryptedKey,
            iv: encryptedData.iv,
            encrypted_data: encryptedData.encryptedData,
        }) as AuthenApiResponse
        return result


    } catch (err) {
        console.log("Erreur lors de l'échange de token", err)
        return null

    }
}

/**
 * Asks FastAPI to erase everything it holds for the token's user: profile,
 * preferences, CVs (files included), analyses, chat conversations,
 * candidatures, contacts and Kanban board.
 *
 * Unlike `syncProfile` this throws on failure — the caller has to know the data
 * is still there, since removing the better-auth account would then leave it
 * orphaned with nobody able to reach it.
 */
export const removeApiAccount = async (token: string): Promise<void> => {
    await apiExternal.post(
        "/api/v1/account/remove",
        { confirm: true },
        { headers: { Authorization: `Bearer ${token}` } },
    )
}