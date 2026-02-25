import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/*
1. MOTOR
    OFF - 0 RPM, 1 - 200 RPM, 2 - 400 RPM, 3 - 600 RPM, 4 - 800 RPM

    To prevent instant acceleration, RPM ramps gradually:
        RPM Step = 800 RPM / 12 seconds = 66.67 RPM per tick
        So 12s to max RPM. The same for deceleration.

2. POWER
    Power = (Torque x RPM) / 9550
    Where 9550 is the mechanical conversion factor (kW to Nm at RPM).

    And max torque at 800 RPM is 11,937.5 Nm
    Torque(Max) = (1000 x 9550) / 800 = 11,937.5 Nm

    NEGATIVE POWER
    This happens when decelerating. 50% of the power generated goes back into the battery.

    P(regen) = -0.5 x (Torque x RPM) / 9550

3. BATTERY DRAIN
    Battery drains based on the power output. Assuming the battery drains in 1 minute at Max Power:

    Battery Drain Per Tick = DRAIN_CONSTANT x Power
    DRAIN_CONSTANT = (100% / 60s) / 1000kW = 0.001667

4. BATTERY CHARGING
    When charging is active:
    The motor is turned off, and it charges at the same rate in 1 minute.

5. BATTERY TEMPERATURE
    The base temperature is set at 20 degrees, and is proportional to the power output.

    It is assumed that the battery heats from 20 to 60 degrees in 1 minute to get the heat rate. 

    HEAT_RATE = 40 / (60s x 1000kW) = 0.000667
    Temp(new) = Temp(current) + |Power| x HEAT_RATE

    Cooling has only been implemented when the motor is off, and cools to 20 degrees C in 1 minute. 

*/

// Torque constant derived from: Torque(Max) = (1000kW x 9550) / 800RPM = 11937.5 Nm
const MAX_TORQUE = 11937.5;
const RPM_INTERVAL = 200;
const RPM_STEP = 66.67; // That is 800RPM / 12 seconds (3 secs per interval)
const MECH_CONVERSION_FACTOR = 9550;
const REGEN_FACTOR = 0.5; // For only 50% of the power to be used for charging

const TOTAL_CHARGE_TIME = 60; // 1 minute
const CHARGE_RATE = 100; // 100% charge in 1 minute
let CHARGE_RATE_PER_SECOND = CHARGE_RATE / TOTAL_CHARGE_TIME;

// Assuming that the vehicle discharges from 100% to 0% in 1 minute 
// And the average power consumption is 500KW
const DRAIN_CONSTANT = 0.001667; // (100%/60secs)/Average Power

const HEAT_RATE = 0.000667;
const COOL_RATE = 0.667;
const MIN_TEMP = 20;
const MAX_TEMP = 60;


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
    let motorSpeed = data.motor_speed;
    let isCharging = data.is_charging;
    let batteryLevel = data.battery_pct;
    let batteryTemp = data.battery_temp;
    let gearRatio = data.gear_ratio;

    let batteryLowStatus = data.battery_low;
    let parkingBrakeStatus = data.parking_brake;
    let motorStatus = data.motor_status;
    let checkEngineStatus = data.check_engine;


    // Turn off Motor when charging
    if (isCharging === true ){
        motorSpeed = 0;
    }

    
    // Calculate the targetRPM
    const targetRPM = motorSpeed * RPM_INTERVAL;

    // Calculate the newRPM
    let currentRPM = data.motor_rpm;

    if (currentRPM < targetRPM){
             currentRPM = Math.min(currentRPM + RPM_STEP, targetRPM);
    }else if (currentRPM > targetRPM){
         currentRPM = Math.max(currentRPM - RPM_STEP, targetRPM);
    }


    const isDecelerating = currentRPM < data.motor_rpm;

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
    }else{
        newBatteryLevel -= DRAIN_CONSTANT * newPower;
    } 
   

    

    // If the battery is full, turn off charging
    if (newBatteryLevel >= 100){
        isCharging = false;
        newBatteryLevel = 100;
    }

    // If the battery is empty, turn off the motor
    if (newBatteryLevel <= 0) {
        newBatteryLevel = 0;
        currentRPM = 0;   
        motorSpeed = 0;   
        newPower = 0;     
    }

    if(newBatteryLevel <=0){
        batteryLowStatus = true;
        parkingBrakeStatus = true;
    }else if(newBatteryLevel <=20){
        batteryLowStatus = true;
    }else{
        batteryLowStatus = false;
        parkingBrakeStatus = false;
    }

    if (currentRPM >= 700){
        motorStatus = true;
    }else{
        motorStatus = false;
    }

    // Battery Temperature
    let newBatteryTemp = batteryTemp;
    let absolutePower = Math.abs(newPower);
    
    if(absolutePower>0){
        newBatteryTemp = newBatteryTemp + (absolutePower * HEAT_RATE);
    }else{
        newBatteryTemp -= COOL_RATE;
    }

    if(newBatteryTemp >= 50){
        checkEngineStatus = true;
    }else{
        checkEngineStatus = false;
    }

    // Creating Boundries for Temperature
    newBatteryTemp = Math.max(MIN_TEMP, Math.min(MAX_TEMP, newBatteryTemp));


    // Rounding the RPM and Power
    let newRPM  = Math.round(currentRPM * 100) / 100;
    newPower = Math.round(newPower * 100) / 100;
    
    // Gear Ratio
    if (newRPM === 0){
        gearRatio = "N/N";
    }else if (newRPM >= 1 && newRPM <= 200){
        gearRatio = "4/1";
    }else if (newRPM >= 201 && newRPM <= 400){
        gearRatio = "3/1";
    }else if (newRPM >= 401 && newRPM <= 600){
        gearRatio = "2/1";
    }else if (newRPM >= 601 && newRPM <= 800){
        gearRatio = "1/1";
    }

    // Updating the Database with New Info
    const { data:updateData, error: updateError } = await supabase
    .from('vehicle')
    .update({
        power_kw: newPower,
        motor_rpm: newRPM,
        motor_speed: motorSpeed,
        gear_ratio: gearRatio,
        is_charging: isCharging,
        battery_pct: newBatteryLevel,
        battery_low: batteryLowStatus,
        parking_brake: parkingBrakeStatus,
        motor_status: motorStatus,
        battery_temp: newBatteryTemp,
        check_engine: checkEngineStatus,
    })
    .eq('id', 4)
    .single();

    if(updateError){
        return NextResponse.json({ error: updateError.message }, { status: 500 });
    }else{
        return NextResponse.json({ success: "Vehicle Simulation API - POST" });
    }

}