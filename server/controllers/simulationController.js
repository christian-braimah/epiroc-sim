import db from "../db/dbConnect.js";

/*
The logic behind the simulation is as follows:
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


// Constants
const MAX_TORQUE = 11937.5;
const RPM_INTERVAL = 200;
const RPM_STEP = 66.67;
const MECH_CONVERSION_FACTOR = 9550;
const REGEN_FACTOR = 0.5; // 50% of the power for regen charging

// Battery Constants
const TOTAL_CHARGE_TIME = 60; 
const CHARGE_RATE = 100; 
let CHARGE_RATE_PER_SECOND = CHARGE_RATE / TOTAL_CHARGE_TIME;
const DRAIN_CONSTANT = 0.001667; 

// Temperature Constants
const HEAT_RATE = 0.000667;
const COOL_RATE = 0.667;
const MIN_TEMP = 20;
const MAX_TEMP = 60;



const simulationController = async (req, res) => {
    try{
        // Fetching the current state of the vehicle
        const state = await db.one("SELECT * FROM vehicle WHERE id = $1", [1]);

        // Initializing the current state of the vehicle
        let motorSpeed = state.motor_speed_setting;
        let isCharging = state.is_charging;
        let batteryLevel = state.battery_pct;
        let batteryTemp = state.battery_temp;
        let gearRatio = state.gear_ratio;

        let batteryLowStatus = state.battery_low;
        let parkingBrakeStatus = state.parking_brake;
        let motorStatus = state.motor_status;
        let checkEngineStatus = state.check_engine;

        // Turn off Motor when charging
        if (isCharging === true && motorSpeed > 0){
            motorSpeed = 0;
        }

        // Block motor from starting while parking brake is engaged (battery died)
        // Motor stays off until battery is recharged to 20%
        if (parkingBrakeStatus === true && motorSpeed > 0){
            motorSpeed = 0;
        }

        // Calculate the targetRPM
        const targetRPM = motorSpeed * RPM_INTERVAL;

        // Calculate the newRPM
        let currentRPM = state.motor_rpm;

        if (currentRPM < targetRPM){
            currentRPM = Math.min(currentRPM + RPM_STEP, targetRPM);
        }else if (currentRPM > targetRPM){
            currentRPM = Math.max(currentRPM - RPM_STEP, targetRPM);
        }

        // Check if the vehicle is decelerating
        const isDecelerating = currentRPM < state.motor_rpm;

        let newPower;

        if (isDecelerating && currentRPM > 0) {
            // Regen braking: power goes negative (motor acts as generator)
            newPower = ((MAX_TORQUE * currentRPM) / MECH_CONVERSION_FACTOR) * - REGEN_FACTOR;

        } else {
            // Cruising or accelerating: positive power consumption
            newPower = (MAX_TORQUE * currentRPM) / MECH_CONVERSION_FACTOR;
        }

        newPower = Math.round(newPower * 100) / 100;

        // Initializing the new Battery Level
        let newBatteryLevel = batteryLevel;

        // Updating the Battery Level
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

        // Updating the Battery Low Status and Parking Brake
        // Parking brake engages when battery dies (0%) and stays on until recharged to 20%
        if(newBatteryLevel <= 0){
            batteryLowStatus = true;
            parkingBrakeStatus = true;
        }else if(newBatteryLevel <= 20){
            batteryLowStatus = true;
            // Keep parking brake ON if it was already engaged (from hitting 0%)
            // Only disengages once battery is above 20%
        }else{
            batteryLowStatus = false;
            parkingBrakeStatus = false;
        }

        // Updating the Motor Status
        if (currentRPM >= 700){
            motorStatus = true;
        }else{
        motorStatus = false;
    }

    // Battery Temperature
    let newBatteryTemp = batteryTemp;
    let absolutePower = Math.abs(newPower);


    // Battery Temperature Logic
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


    // Gear Ratio
    if (motorSpeed === 0){
        gearRatio = "N/N";
    }else if (motorSpeed === 1){
        gearRatio = "4/1";
    }else if (motorSpeed === 2){
        gearRatio = "3/1";
    }else if (motorSpeed === 3){
        gearRatio = "2/1";
    }else if (motorSpeed === 4){
        gearRatio = "1/1";
    }

    // Rounding gauge values to 2 decimal places
    let newRPM  = Math.round(currentRPM * 100) / 100;
    newPower = Math.round(newPower * 100) / 100;


    // Updating the database
    const result = await db.one(
        `UPDATE vehicle SET
        motor_speed_setting = $1,
        motor_rpm = $2,
        power_kw = $3,
        battery_pct = $4,
        battery_temp = $5,
        gear_ratio = $6,
        check_engine = $7,
        battery_low = $8,
        parking_brake = $9,
        motor_status = $10,
        is_charging = $11
        WHERE id = $12 RETURNING *`,
    [
        motorSpeed,
        newRPM,
        newPower,
        newBatteryLevel,
        newBatteryTemp,
        gearRatio,
        checkEngineStatus,
        batteryLowStatus,
        parkingBrakeStatus,
        motorStatus,
        isCharging,
        1]
    );

    res.json(result);

    }catch(err){
        console.error("Error updating motor speed setting:", err);
        res.status(500).json({error: "Simulation Error"});
    }   
};

export default simulationController;