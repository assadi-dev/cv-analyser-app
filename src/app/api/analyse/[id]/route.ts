import { apiExternal } from "@/lib/api";
import { headersStructureFromSession } from "@/lib/apiCall";
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type AnalyseParams = {
    id: string
}
export const GET = async (req: NextRequest, { params }: { params: Promise<AnalyseParams> }) => {
    try {
        const { id } = await params
        const session = await auth.api.getSession({
            headers: req.headers,
        })
        const options = await headersStructureFromSession(session)
        const res = await apiExternal.get(`/api/v1/analyses/${id}/`, options)
        return NextResponse.json(res);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch analysis" }, { status: 500 });
    }
}