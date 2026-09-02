import { ApiRequestError, apiExternal } from "@/lib/api"
import { headersStructureFromSession } from "@/lib/apiCall"
import { auth } from "@/lib/auth"
import { KanbanBoardResponse } from "@/types"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

/**
 * Reads the Kanban board, already grouped and ordered by the API.
 *
 * Mounted on its own segment rather than under `/candidatures`, mirroring the
 * API: there, a literal `/candidatures/kanban` competes with
 * `/candidatures/{candidature_id}` and gets rejected as a malformed UUID.
 *
 * Failures are propagated rather than answered with an empty board. The list
 * route swallows its errors and returns an empty page, which on a board reads
 * as "every candidature is gone" — here the client must be able to tell an
 * outage from an empty board.
 */
export const GET = async (req: NextRequest) => {
    try {
        const session = await auth.api.getSession({
            headers: req.headers,
        })
        if (!session?.user?.api?.token) {
            // An expired session is not a server fault: 401 lets the client
            // send the user back to login instead of showing an outage.
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        const options = await headersStructureFromSession(session)

        const res = await apiExternal.get<KanbanBoardResponse>(
            "/api/v1/kanban",
            options
        )
        return NextResponse.json(res)
    } catch (error) {
        console.error(error)
        if (error instanceof ApiRequestError) {
            return NextResponse.json(
                { error: error.message },
                { status: error.status }
            )
        }
        return NextResponse.json(
            { error: "Failed to load the kanban board" },
            { status: 500 }
        )
    }
}
