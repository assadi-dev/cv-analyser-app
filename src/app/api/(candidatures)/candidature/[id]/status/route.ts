import { ApiRequestError, apiExternal } from "@/lib/api"
import { headersStructureFromSession } from "@/lib/apiCall"
import { auth } from "@/lib/auth"
import { CandidatureStatus, CandidatureSummary } from "@/types"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

type StatusParams = {
    id: string
}

/**
 * Updates only the status of a candidature — the select on the list view.
 *
 * This route was missing while `useUpdateCandidatureStatus` already called
 * it, so every status change failed and rolled back its optimistic update.
 *
 * There is no drop point here, so the card lands at the end of its target
 * column. Use /move for drag & drop, where the rank matters.
 */
export const PATCH = async (
    req: NextRequest,
    { params }: { params: Promise<StatusParams> }
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
        const body = (await req.json()) as { status: CandidatureStatus }

        const res = await apiExternal.patch<CandidatureSummary>(
            `/api/v1/candidatures/${id}/status`,
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
            { error: "Failed to update candidature status" },
            { status: 500 }
        )
    }
}
