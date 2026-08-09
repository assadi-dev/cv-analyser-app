import { apiExternal } from "@/lib/api";
import { headersStructureFromSession } from "@/lib/apiCall";
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type ChatHistoryParams = {
    id: string
}
export const GET = async (req: NextRequest, { params }: { params: Promise<ChatHistoryParams> }) => {
    try {
        const { id } = await params
        const session = await auth.api.getSession({
            headers: req.headers,
        })
        const options = await headersStructureFromSession(session)
        return NextResponse.json({ conversation_id: id, title: `Title ${id}`, messages: [] });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch chat history" }, { status: 500 });
    }
}