
export type AuthenApiResponse = {
        expires_at: string
        expires_in_days: number
        token: string
        type: string
}

export type EncryptedData = {
        encryptedKey: string
        iv: string
        encryptedData: string
}