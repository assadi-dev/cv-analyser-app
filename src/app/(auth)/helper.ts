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