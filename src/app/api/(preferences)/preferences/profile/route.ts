
import { apiExternal } from "@/lib/api";
import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { profileValidator } from "./schema";

export async function PATCH(req: NextRequest) {
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

        const validator = profileValidator.body(body)
        if (!validator.success) {
            throw validator.error
        }
        const { data } = validator

        const res = await apiExternal.patch(`/api/v1/preferences/profile`, data, options)
        return NextResponse.json(res);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }
}
