import { headersStructureFromSession } from "@/lib/apiCall"
import { auth } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"
import { chatStreamDecoder } from "../schema"
import { ApiRequestError, apiExternal } from "@/lib/api"

export const dynamic = "force-dynamic"

export const POST = async (req: NextRequest) => {
    try {
        const session = await auth.api.getSession({
            headers: req.headers,
        })
        const options = await headersStructureFromSession(session)

        // Read the body once: a Request body is a stream and cannot be
        // consumed twice.
        const parsedBody = chatStreamDecoder.temporary_chat_stream_input(
            await req.json(),
        )

        if (!parsedBody.success) {
            return NextResponse.json(
                { error: "Invalid request body", details: parsedBody.error.issues },
                { status: 400 },
            )
        }

        const res = await apiExternal.postStream(
            "/api/v1/chat/stream-chat-anonymously",
            parsedBody.data,
            options,
        )

        return new NextResponse(res.body, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache, no-transform",
                "Connection": "keep-alive",
                // Set by the API before the first token; the client can read it
                // instead of waiting for the "start" frame.
                ...(res.headers.get("x-conversation-id")
                    ? { "X-Conversation-Id": res.headers.get("x-conversation-id")! }
                    : {}),
            },
        })
    } catch (error) {
        // Keep the API status: an unknown or foreign analyse_id is a 404, not
        // a server failure.
        if (error instanceof ApiRequestError) {
            return NextResponse.json(
                { error: error.message, code: error.code },
                { status: error.status },
            )
        }

        console.error(error)
        return NextResponse.json({ error: "Failed to stream chat" }, { status: 500 })
    }
}
