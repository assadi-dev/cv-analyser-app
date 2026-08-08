import { apiExternal } from "@/lib/api";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const res = await apiExternal.get("/health")
        return NextResponse.json(res)
    } catch (error) {
        return NextResponse.json({ error: "Failed to connect to API" }, { status: 500 })
    }

}