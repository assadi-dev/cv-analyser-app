import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { apiExternal } from "@/lib/api"

export async function GET(request: NextRequest) {
    const session = await auth.api.getSession({
        headers: request.headers,
    })


    const token = session?.user?.api?.token
    const options = {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    }

    try {
        const res = await apiExternal.get<any>(`/api/v1/account/me`, options)
        return NextResponse.json(res)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: "Failed to create candidature" }, { status: 500 })
    }

}