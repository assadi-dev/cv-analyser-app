
import { headersStructureFromSession } from "@/lib/apiCall"
import { auth } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"
import { chatStreamDecoder } from "../schema"

export const POST = async (req: NextRequest) => {
    const { question, conversationID } = await req.json()

    const session = await auth.api.getSession({
        headers: req.headers,
    })
    const options = await headersStructureFromSession(session)
    const body = chatStreamDecoder.temporary_chat_stream_input(await req.json())



    if (!body.success) {
        throw body.error
    }




    const data = body.data
    return NextResponse.json(data)
}