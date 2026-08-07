import { apiExternal } from "@/lib/api"
import { auth } from "@/lib/auth"
import { CandidatureStatus, CandidatureSummary, PaginatedResponse } from "@/types"
import { NextRequest, NextResponse } from "next/server"
export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
    const session = await auth.api.getSession({
        headers: request.headers,
    })
    const { searchParams } = request.nextUrl

    const token = session?.user?.api?.token
    const options = {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    }

    const params = new URLSearchParams(searchParams)

    const status = params.get("status")
    if (status === "all" || !status) {
        params.delete("status")
    }

    try {
        const res = await apiExternal.get<PaginatedResponse<CandidatureSummary>>(`/api/v1/candidatures?${params.toString()}`, options)
        return NextResponse.json(res)
    } catch (error) {
        console.error(error)
        const defaultResponse: PaginatedResponse<CandidatureSummary> = {
            items: [],
            page: Number(searchParams.get("page")) || 1,
            page_size: Number(searchParams.get("page_size")) || 10,
            total: 0,
            pages: 0
        }
        return NextResponse.json(defaultResponse)
    }

}