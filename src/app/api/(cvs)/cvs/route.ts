import { apiExternal } from "@/lib/api"
import { auth } from "@/lib/auth"
import { CVSummary, CV } from "@/types"
import { NextResponse } from "next/server"
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