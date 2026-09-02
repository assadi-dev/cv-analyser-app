import { ApiRequestError, apiExternal } from "@/lib/api"
import { headersStructureFromSession } from "@/lib/apiCall"
import { auth } from "@/lib/auth"
import { CandidatureMovePayload, CandidatureMoveResponse } from "@/types"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

type MoveParams = {
    id: string
}

/**
 * Moves a candidature on the Kanban board.
 *
 * The body carries the neighbours framing the drop point, not a position:
 * the board only knows the ids it renders, and the API reads their live
 * ranks. A stale client cache therefore cannot write a wrong order.
 *
 * The upstream status is propagated rather than flattened to 500, so the
 * board can tell a deleted candidature (404) from a real outage.
 */
export const PATCH = async (
    req: NextRequest,
    { params }: { params: Promise<MoveParams> }
) => {
    try {
        const { id } = await params
        const session = await auth.api.getSession({
            headers: req.headers,
        })
        if (!session?.user?.api?.token) {
            // An expired session is not a server fault: 401 lets the client
            // send the user back to login instead of showing an outage.
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        const options = await headersStructureFromSession(session)
        const body = (await req.json()) as CandidatureMovePayload

        const res = await apiExternal.patch<CandidatureMoveResponse>(
            `/api/v1/candidatures/${id}/move`,
            body,
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
            { error: "Failed to move candidature" },
            { status: 500 }
        )
    }
}
