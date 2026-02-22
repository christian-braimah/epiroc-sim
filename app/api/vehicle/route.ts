// Fetch all vehicle data from the database

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
    const supabase = await createClient();
    const { data, error } = await supabase
    .from('vehicle')
    .select('*')
    .eq('id', 4)
    .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}

