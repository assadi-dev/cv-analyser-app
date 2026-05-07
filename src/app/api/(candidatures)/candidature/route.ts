import { apiExternal } from "@/lib/api"
import { auth } from "@/lib/auth"
import { CandidatureSummary } from "@/types"
import { NextRequest, NextResponse } from "next/server"
export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
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
        const res = await apiExternal.post<CandidatureSummary>(`/api/v1/candidatures`, options)
        return NextResponse.json(res)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: "Failed to create candidature" }, { status: 500 })
    }

}



export async function DELETE(request: NextRequest) {
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
        const res = await apiExternal.get<CandidatureSummary>(`/api/v1/candidatures`, options)
        return NextResponse.json(res)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: "Failed to create candidature" }, { status: 500 })
    }

}
