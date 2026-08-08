
import { headersStructureFromSession } from "@/lib/apiCall"
import { auth } from "@/lib/auth"
import { NextRequest, NextResponse } from "next/server"

const POST = async (req: NextRequest) => {
    const { question, conversationID } = await req.json()

    const session = await auth.api.getSession({
        headers: req.headers,
    })
    const options = await headersStructureFromSession(session)
    const body = await req.formData();



    if (!question) {
        return NextResponse.json({ error: "Question is required" }, { status: 400 })
    }

    if (!conversationID) {
        return NextResponse.json({ error: "Conversation ID is required" }, { status: 400 })
    }



    const data = "hello"
    return NextResponse.json(data)
}