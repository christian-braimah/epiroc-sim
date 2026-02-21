import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    return NextResponse.json({ message: "Get Vehicle API" });
}

export async function POST(request: NextRequest) {
    return NextResponse.json({ message: "Post Vehicle API" });
}

export async function PATCH(request: NextRequest) {
    return NextResponse.json({ message: "Patch Vehicle API" });
}

