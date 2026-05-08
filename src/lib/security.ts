import { EncryptedData } from "@/app/(auth)/type";

const bufferToBase64 = (buffer: Uint8Array | ArrayBuffer) => {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)))
}

const base64ToBuffer = (base64: string) => {
    return Uint8Array.from(atob(base64), c => c.charCodeAt(0));
}

export const loadPublicKey = async () => {
    try {
        const pem = process.env.NEXT_PUBLIC_ENCRYPTION_KEY
        if (!pem) {
            throw new Error("Public key not found")
        }

        const pemContent = pem
            .replace("-----BEGIN PUBLIC KEY-----", "")
            .replace("-----END PUBLIC KEY-----", "")
            .replace(/\s/g, "");

        const binaryDer = base64ToBuffer(pemContent);

        return await crypto.subtle.importKey(
            "spki",
            binaryDer,
            { name: "RSA-OAEP", hash: "SHA-256" },
            false,
            ["encrypt"]
        );



    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message)
            return null
        }
    }
}



export const dataToEncryption = async (data: any): Promise<EncryptedData | null | undefined> => {
    try {
        const publicKey = await loadPublicKey()
        if (!publicKey) {
            throw new Error("Public key not found")
        }

        const aesKey = await crypto.subtle.generateKey(
            { name: "AES-GCM", length: 256 },
            true,
            ["encrypt"]
        );

        const iv = crypto.getRandomValues(new Uint8Array(12));
        const encoded = new TextEncoder().encode(JSON.stringify(data));
        const ciphertext = await crypto.subtle.encrypt(
            { name: "AES-GCM", iv },
            aesKey,
            encoded
        );

        const cleAESRaw = await crypto.subtle.exportKey("raw", aesKey);
        const encryptedKey = await crypto.subtle.encrypt(
            { name: "RSA-OAEP" },
            publicKey,
            cleAESRaw
        );

        return {
            encryptedKey: bufferToBase64(encryptedKey),
            iv: bufferToBase64(iv),
            encryptedData: bufferToBase64(ciphertext),
        }


    } catch (error) {
        if (error instanceof Error) {
            console.log(error.message)
            return null
        }
    }

}


type EncryptedUserData = {
    email: string;
    first_name: string;
    last_name: string;
    professional_title?: string | null;
    auth_provider: "email" | "google" | "linkedin";
}
export const sendEncryptedCredentials = async (data: EncryptedUserData): Promise<EncryptedData | null | undefined> => {
    const encryptedData = await dataToEncryption(data)
    return encryptedData

}