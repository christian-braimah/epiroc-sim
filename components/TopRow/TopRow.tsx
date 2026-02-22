"use client";

import { useVehicle } from "@/lib/VehicleContext";
import BatteryLowIndicator from "./topRowIcons/batteryLowIndicator";
import CheckEngine from "./topRowIcons/checkEngine";
import MotorStatus from "./topRowIcons/motorStatus";
import ParkingBrake from "./topRowIcons/parkingBrake";

// Setting up colors for icons
const defaultColor = "#DDDDDD";  
const warningColor = "#FF4444";   
const successColor = "#00FF00";

export default function TopRow() {
    const { vehicleState } = useVehicle();

    // Top Row Icons in an Array
    const topRowIcons = [
        {
            id: 1,
            name: "Parking Brake",
            icon: <ParkingBrake color={vehicleState?.parking_brake ? warningColor : defaultColor} />
        },
        {
            id: 2,
            name: "Check Engine",
            icon: <CheckEngine color={vehicleState?.check_engine ? warningColor : defaultColor} />
        },
        {
            id: 3,
            name: "Battery Low Indicator",
            icon: <BatteryLowIndicator color={vehicleState?.battery_low ? warningColor : defaultColor} />
        },
        {
            id: 4,
            name: "Motor Status",
            icon: <MotorStatus color={vehicleState?.motor_status ? successColor : defaultColor} />
        }
    ];

    return (
        <section className="top-row flex gap-4 items-center">
            {topRowIcons.map((icon) => (
                <div key={icon.id} className="btn btn-top">
                    {icon.icon}
                </div>
            ))}
        </section>
    );
}
