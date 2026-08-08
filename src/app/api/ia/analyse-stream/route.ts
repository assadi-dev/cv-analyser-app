import { headersStructureFromSession } from "@/lib/apiCall";
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { analyseStreamDecoder } from "./schema";
import { apiExternal } from "@/lib/api";

export const dynamic = "force-dynamic";

export const POST = async (req: NextRequest) => {
    try {
        const session = await auth.api.getSession({
            headers: req.headers,
        })
        const options = await headersStructureFromSession(session)
        const body = await req.formData();


        const parsedBody = analyseStreamDecoder.temporary_analyse_input(body)
        if (!parsedBody.success) {
            return NextResponse.json({ error: "Invalid request body", details: parsedBody.error.issues }, { status: 400 });
        }

        const { job_description, cv_file } = parsedBody.data
        const formData = new FormData();
        formData.append("job_description", job_description);
        formData.append("cv_file", cv_file);

        const res = await apiExternal.multipart(`/api/v1/analyses/temporary/stream`, formData, options)

        const stream = res.body;


        return new NextResponse(stream, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache, no-transform",
                "Connection": "keep-alive",
            },
        })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: "Failed to fetch analysis" }, { status: 500 });
    }
}