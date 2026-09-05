import { apiExternal } from "@/lib/api";
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
        return NextResponse.json({ error: "Failed to test AI provider" }, { status: 500 });
    }
}
