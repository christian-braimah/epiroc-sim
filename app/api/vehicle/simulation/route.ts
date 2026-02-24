import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/*
MOTOR SPEED & POWER OUTPUT
 Every Motor Speed has a corresponding Power Output and Speed
 OFF - 0RPM
 1 - 200RPM
 2 - 400RPM
 3 - 600RPM
 4 - 800RPM

 For deceleration, the corresponting power output is negative.

 And that negative power output is what is used to charge the battery.
 Although very little amounts of power.

 To prevent instant acceleration, there will be a time delay in the motor speed. So that it gradually ramps up. 
 
 BATTERY CHARGING 
 The higher the power the faster the battery drains. 

 So for a unit of time tick, the battery drains by a certain percentage.
 

However, you can't run the motor when the battery is charging.
So by default, when charge is toggled on, the motor speed is set to 0,  parking brake is engaged, and battery charging light turns on.

SPEED  - NET CHARGE
Total Charge Time = 4mins. 
Charging Rate = 25% per minute.

The corresponding Battery temperature,
assuming that ambient temperature is 20 degrees celsius. 

What will the formulas be: 

FORULAS TO BACK MY CLAIMS:
Target RPM = Slider Setting x Interval (200);

It's Equivalent Power will be :
To get an equivalent power of 1000KW from 800RPM, 
Power = (Torque x RPM) / 9550
Therefore the torque will be :
Torque = (Power x 9550) / RPM
Torque (Max) = (1000 x 9550) / 800
Torque (Max) = 11937.5 Nm

Therefore power for the lowest setting of 200rpm will be:
P(min) = (11937.5 x 200) / 9550
P(min) = 250KW

Now, how do I make sure that the vehicle doesn't receive instant acceleration?

I am thinking of adding a specific time of 3 sec per interval. So it takes 3 secs to reach 100RPM and 24 secs to reach 800RPM. That way we can also easily account for deceleration, and adding to the battery.


Calculating battery temperature:




References: 
http://www.softstarter.org/soft-starter-torque-control-system-952138.html#:~:text=From%20the%20motor%20parameters%2C%20the,types%20of%20loads%20and%20applications.



*/

// Torque constant derived from: Torque(Max) = (1000kW x 9550) / 800RPM = 11937.5 Nm
const MAX_TORQUE = 11937.5;
const RPM_INTERVAL = 200;
const RPM_STEP = 66.67; // That is 800RPM / 12 seconds (3 secs per interval)
const MECH_CONVERSION_FACTOR = 9550;
const REGEN_FACTOR = 0.5; // For only 50% of the power to be used for charging

const TOTAL_CHARGE_TIME = 120; // 2 minutes
const CHARGE_RATE = 100; // 100% charge in 2 minutes
let CHARGE_RATE_PER_SECOND = CHARGE_RATE / TOTAL_CHARGE_TIME;

// Assuming that the vehicle discharges from 100% to 0% in 4 minutes (240 seconds)
// And the average power consumption is 500KW
const DRAIN_CONSTANT = 0.00083; // (100%/240secs)/Average Power


export async function GET(request: NextRequest) {
    return NextResponse.json({  success:"Vehicle Simulation API" });
}

// Motor & Power Simulation
export async function POST(request: NextRequest){
    const supabase = await createClient();

    const {data, error} = await supabase
    .from('vehicle')
    .select('*')
    .eq('id', 4)
    .single();

    if(error){
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Declaring Fetched Data from
    let motor_speed = data.motor_speed;
    let isCharging = data.is_charging;
    let batteryLevel = data.battery_pct;
    let batteryLowStatus = data.battery_low;
    let parkingBrakeStatus = data.parking_brake;

    // Turn off Motor when charging
    if (isCharging === true ){
        motor_speed = 0;
    }else if(batteryLevel <= 0){
        motor_speed = 0;
    }

    if(batteryLevel<=20){
        batteryLowStatus = true;
    }else if(batteryLevel<=0){
        parkingBrakeStatus = true;
    }else{
        batteryLowStatus = false;
    }
    
    // Calculate the targetRPM
    const targetRPM = motor_speed * RPM_INTERVAL;

    // Calculate the newRPM
    let currentRPM = data.motor_rpm;

    if (currentRPM < targetRPM){
             currentRPM = Math.min(currentRPM + RPM_STEP, targetRPM);
    }else if (currentRPM > targetRPM){
         currentRPM = Math.max(currentRPM - RPM_STEP, targetRPM);
    }


    const isDecelerating = data.motor_rpm > targetRPM;

    let newPower: number;

    if (isDecelerating && currentRPM > 0) {
        // Regen braking: power goes negative (motor acts as generator)
        newPower = ((MAX_TORQUE * currentRPM) / MECH_CONVERSION_FACTOR) * - REGEN_FACTOR;
    } else {
        // Cruising or accelerating: positive power consumption
        newPower = (MAX_TORQUE * currentRPM) / MECH_CONVERSION_FACTOR;
    }

    newPower = Math.round(newPower * 100) / 100;


    let newBatteryLevel =batteryLevel;


    if (isCharging){
        newBatteryLevel += CHARGE_RATE_PER_SECOND;
    } else if (!isCharging && !isDecelerating){
        newBatteryLevel -= DRAIN_CONSTANT * newPower;
    }

    // Calculate the charge rate
   

    let isDrain : boolean;

    if (isDecelerating && currentRPM > 0){
        isDrain = true;
    }else{
        isDrain = false;
    }

    // If the battery is charging, increase the battery level
    

    // If the battery is full, turn off charging
    if (newBatteryLevel >= 100){
        isCharging = false;
        newBatteryLevel = 100;
    }

    // If the battery is empty, turn off the motor
    if (newBatteryLevel <= 0){
        isCharging = false;
        newBatteryLevel = 0;
    }

    // Calculating the equivalent Power
    // Assuming the following: 
    // Power = (Torque x RPM) / 9550 , where 9550 is the conversion factor for mechanical power
    // From the formula, we can calculate the torque at max power of 1000KW, as 11937.5Nm

    
    let newRPM  = Math.round(currentRPM * 100) / 100;
    newPower = Math.round(newPower * 100) / 100;
    
    // Update the vehicle data
    const { data:updateData, error: updateError } = await supabase
    .from('vehicle')
    .update({
        power_kw: newPower,
        motor_rpm: newRPM,
        motor_speed: motor_speed,
        is_charging: isCharging,
        battery_pct: newBatteryLevel,
        battery_low: batteryLowStatus,
        parking_brake: parkingBrakeStatus,
    })
    .eq('id', 4)
    .single();

    if(updateError){
        return NextResponse.json({ error: updateError.message }, { status: 500 });
    }else{
        return NextResponse.json({ success: "Vehicle Simulation API" });
    }

}