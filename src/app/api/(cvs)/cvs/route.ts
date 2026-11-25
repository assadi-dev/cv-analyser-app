import { ApiRequestError, apiExternal } from "@/lib/api"
import { headersStructureFromSession } from "@/lib/apiCall"
import { auth } from "@/lib/auth"
import { CVSummary, CV } from "@/types"
import { NextRequest, NextResponse } from "next/server"
import { CvSchema } from "./dto/cv.dto"
export const dynamic = "force-dynamic"

export async function GET(request: Request) {
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
        const res = await apiExternal.get<CV>(`/api/v1/cvs`, options) as unknown as CV[]
        const cvs: CVSummary[] = res.map((cv: CV) => CvSchema.parse(cv))
        return NextResponse.json(cvs)
    } catch (error) {
        console.error(error)
        return NextResponse.json([])
    }

}

/**
 * Imports a CV: the file is kept by the API (on disk, plus a row in `cvs`),
 * unlike the one sent with an analysis, which is read and thrown away.
 */
export async function POST(request: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: request.headers,
        })
        if (!session?.user?.api?.token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        const options = await headersStructureFromSession(session)

        const incoming = await request.formData()
        const file = incoming.get("file")
        if (!(file instanceof File)) {
            return NextResponse.json({ error: "A file is required" }, { status: 400 })
        }

        const formData = new FormData()
        formData.append("file", file)
        const res = await apiExternal.multipart(`/api/v1/cvs/upload`, formData, options)
        const cv: CVSummary = CvSchema.parse(await res.json())
        return NextResponse.json(cv, { status: 201 })
    } catch (error) {
        console.error(error)
        if (error instanceof ApiRequestError) {
            return NextResponse.json({ error: error.message }, { status: error.status })
        }
        return NextResponse.json({ error: "Failed to upload CV" }, { status: 500 })
    }
}
