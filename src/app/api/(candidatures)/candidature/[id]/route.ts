import { ApiRequestError, apiExternal } from "@/lib/api"
import { headersStructureFromSession } from "@/lib/apiCall"
import { auth } from "@/lib/auth"
import { CandidatureSummary } from "@/types"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

type CandidatureParams = {
    id: string
}

/**
 * Runs a call against the candidature `id` with the caller's API token.
 *
 * An expired session is answered with 401 so the client can send the user back
 * to login instead of showing an outage, and the API's own status codes (404
 * for a candidature that is not theirs, 422 for a bad payload) go through
 * untouched.
 */
const withCandidature = async (
    req: NextRequest,
    params: Promise<CandidatureParams>,
    failureMessage: string,
    call: (id: string, options: Awaited<ReturnType<typeof headersStructureFromSession>>) => Promise<CandidatureSummary>
) => {
    try {
        const { id } = await params
        const session = await auth.api.getSession({
            headers: req.headers,
        })
        if (!session?.user?.api?.token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
        }
        const options = await headersStructureFromSession(session)
        return NextResponse.json(await call(id, options))
    } catch (error) {
        console.error(error)
        if (error instanceof ApiRequestError) {
            return NextResponse.json(
                { error: error.message },
                { status: error.status }
            )
        }
        return NextResponse.json({ error: failureMessage }, { status: 500 })
    }
}

/** One candidature — used to say what an analysis is being attached to. */
export const GET = (
    req: NextRequest,
    { params }: { params: Promise<CandidatureParams> }
) =>
    withCandidature(req, params, "Failed to fetch candidature", (id, options) =>
        apiExternal.get<CandidatureSummary>(`/api/v1/candidatures/${id}`, options)
    )

/**
 * Partial update: only the fields present in the body are changed.
 *
 * A `status` in the body is mirrored onto the board by the API, in the same
 * transaction — the card lands at the end of its target column.
 */
export const PATCH = async (
    req: NextRequest,
    { params }: { params: Promise<CandidatureParams> }
) => {
    const body = await req.json()
    return withCandidature(req, params, "Failed to update candidature", (id, options) =>
        apiExternal.patch<CandidatureSummary>(`/api/v1/candidatures/${id}`, body, options)
    )
}
