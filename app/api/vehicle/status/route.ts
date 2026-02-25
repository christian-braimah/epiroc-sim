// Fetch all vehicle status

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
    const supabase = await createClient();

    // Fetching the indicator booleans in Top Row
    const { data, error } = await supabase
    .from('vehicle')
    .select('parking_brake, check_engine, battery_low, motor_status, is_charging')
    .eq('id', 4)
    .single();

    if (error) {
        return NextResponse.json({  error:"Vehicle Status API: " +  error.message  }, { status: 500 });
    }

    return NextResponse.json(data);
}


// Update Vehicle Status
export async function POST(request: NextRequest){

    const supabase = await createClient();
    const body = await request.json();

    const {data,error} = await supabase
    .from('vehicle')
    .update(body)
    .eq('id', 4)
    .select()
    .single();

    if (error) {
        return NextResponse.json({  error:"Vehicle Status API: " +  error.message  }, { status: 500 });
    }else{
        return NextResponse.json({  success:"Vehicle Status API: " +  data  }, { status: 200 });
    }
    
}