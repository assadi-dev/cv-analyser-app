import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type AnalyseParams = {
    id: string
}
export const GET = async (req: NextRequest, { params }: { params: Promise<AnalyseParams> }) => {
    try {
        const { id } = await params


        return NextResponse.json({ id });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch analysis" }, { status: 500 });
    }
}