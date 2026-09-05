
import { apiExternal } from "@/lib/api";
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { aiProviderPreferencesValidator } from "./schema";

export async function PUT(req: NextRequest) {
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

        const body = await req.json()

        const validator = aiProviderPreferencesValidator.body(body)
        if (!validator.success) {
            throw validator.error
        }
        const { data } = validator

        const res = await apiExternal.put(`/api/v1/preferences/ai-provider`, data, options)
        return NextResponse.json(res);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update preferences" }, { status: 500 });
    }
}