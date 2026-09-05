import { apiExternal, ApiRequestError } from "@/lib/api";
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

// No body: the backend tests whatever provider config is currently saved.
export async function POST(req: NextRequest) {
    try {
        const session = await auth.api.getSession({
            headers: req.headers,
        })

        const token = session?.user?.api?.token
        const options = {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }

        const res = await apiExternal.post(`/api/v1/preferences/ai-provider/test`, {}, options)
        return NextResponse.json(res);
    } catch (error) {
        // Relay the backend's real status/message instead of a blanket 500 —
        // this endpoint's failures (e.g. "AI preferences not found") are
        // legitimate, diagnosable errors, not just transport failures.
        if (error instanceof ApiRequestError) {
            return NextResponse.json({ error: { code: error.code, message: error.message } }, { status: error.status });
        }
        return NextResponse.json({ error: "Failed to test AI provider" }, { status: 500 });
    }
}
