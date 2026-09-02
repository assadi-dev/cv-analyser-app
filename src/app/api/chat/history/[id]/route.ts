import { apiExternal } from "@/lib/api";
import { headersStructureFromSession } from "@/lib/apiCall";
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface ApiResponse<T> {
    items: T[];
    total: number;
    page: number;
    pages: number;
    limit: number;
}
interface Message {
    id: string;
    conversation_id: string;
    content: string;
    role: string;
    created_at: string;
}

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
        const res = await apiExternal.get(`/api/v1/chat/conversations/${id}/messages`, options) as ApiResponse<Message>
        const messages = res.items
        const title = `Chat ${id}`
        return NextResponse.json({ conversation_id: id, title: title, messages: messages });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch chat history" }, { status: 500 });
    }
}