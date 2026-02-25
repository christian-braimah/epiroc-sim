import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
    const supabase = await createClient();
    const body = await request.json();

    const {data,error} = await supabase
    .from('vehicle')
    .update(body)
    .eq('id', 4)
    .select()
    .single();

    if (error) {
        return NextResponse.json({  error:"Vehicle Control API: " +  error.message  }, { status: 500 });
    }else{
        return NextResponse.json({  success:"Vehicle Control API: " +  data  }, { status: 200 });
    }
}