import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export const GET = async (req: NextRequest) => {
    try {
        return new Response("Hello World");
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch analysis" }, { status: 500 });
    }
}