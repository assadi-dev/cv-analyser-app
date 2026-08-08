import { CustomUserSession } from "@/types"

export const headersStructureFromSession = async (session: Partial<CustomUserSession> | null) => {
    if (!session) {
        throw new Error("No session found")
    }
    const token = session?.user?.api?.token
    if (!token) {
        throw new Error("No token found")
    }
    const options = {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    }
    return options
}