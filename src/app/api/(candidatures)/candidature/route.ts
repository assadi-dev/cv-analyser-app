import { apiExternal } from "@/lib/api"
import { auth } from "@/lib/auth"
import { CandidatureSummary } from "@/types"
import { NextRequest, NextResponse } from "next/server"
export const dynamic = "force-dynamic"

export async function POST(request: NextRequest) {
    const session = await auth.api.getSession({
        headers: request.headers,
    })

    const body = await request.json()

    const token = session?.user?.api?.token
    const options = {
        headers: {
            "Authorization": `Bearer ${token}`
        },

    }


    try {
        const res = await apiExternal.post<CandidatureSummary>(`/api/v1/candidatures`, body, options)
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

    const body = await request.json()

    const token = session?.user?.api?.token
    const options = {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    }

    try {
        const ids = body.ids as string[]
        if (ids.length === 0) {
            return NextResponse.json({ error: "No ids provided" }, { status: 400 })
        }
        for (const id of ids) {
            await apiExternal.delete<CandidatureSummary>(`/api/v1/candidatures/${id}`, options)
        }
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: "Failed to delete candidature" }, { status: 500 })
    }

}
