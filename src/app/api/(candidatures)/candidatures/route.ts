import { apiExternal } from "@/lib/api"
import { auth } from "@/lib/auth"
import { CandidatureStatus, CandidatureSummary, PaginatedResponse } from "@/types"
import { NextResponse } from "next/server"
export const dynamic = "force-dynamic"

export async function GET(request: Request) {
    const session = await auth.api.getSession({
        headers: request.headers,
    })
    const { searchParams } = new URL(request.url)

    const token = session?.user?.api?.token
    const options = {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    }
    const params = {
        page: Number(searchParams.get("page")),
        pageSize: Number(searchParams.get("page_size")),
        status: searchParams.get("status") as CandidatureStatus | "all"
    }
    try {
        const res = await apiExternal.get<PaginatedResponse<CandidatureSummary>>(`/api/v1/candidatures?page=${params.page}&page_size=${params.pageSize}&status=${params.status}`, options)
        return NextResponse.json(res)
    } catch (error) {
        console.error(error)
        const defaultResponse: PaginatedResponse<CandidatureSummary> = {
            items: [],
            page: params.page,
            page_size: params.pageSize,
            total: 0,
            pages: 0
        }
        return NextResponse.json(defaultResponse)
    }

}