"use client";

import { useVehicle } from "@/lib/VehicleContext";
import GearRatio from "./middleRowIcons/gearRatio";
import BatteryPercentage from "./middleRowIcons/batteryPercentage";
import BatteryTemperature from "@/components/MiddleRow/middleRowIcons/batteryTemperature";
import MotorStatus from "@/components/TopRow/topRowIcons/motorStatus";
import MotorSpeedSetting from "./MotorSpeedSetting";

const defaultColor = "#DDDDDD";

// MiddleRow displays vehicle metrics (gear ratio, battery %, battery temp, motor RPM)
// and the motor speed setting slider. All values come from the database.
export default function MiddleRow() {
    const { vehicleState } = useVehicle();

    const middleRowIcons = [
        {
            id: 1,
            name: "Gear Ratio",
            icon: <GearRatio color={defaultColor} />,
            value: vehicleState?.gear_ratio ?? "N/N",
            unit: ""
        },
        {
            id: 2,
            name: "Battery Percentage",
            icon: <BatteryPercentage color={defaultColor} />,
            value: String(vehicleState?.battery_pct ?? 0),
            unit: "%"
        },
        {
            id: 3,
            name: "Battery Temperature",
            icon: <BatteryTemperature color={defaultColor} />,
            value: String(vehicleState?.battery_temp ?? 0),
            unit: "°C"
        },
        {
            id: 4,
            name: "Motor RPM",
            icon: <MotorStatus color={defaultColor} />,
            value: String(vehicleState?.motor_rpm ?? 0),
            unit: "RPM"
        }
    ];

    return (
        <section className="middle-row">
            <div className="middle-row__left">
                {middleRowIcons.map((icon) => (
                    <div key={icon.id} className="btn btn-middle">
                        {icon.icon}
                        <div className="flex flex-col items-center">
                            <p className="middle-row__value">{icon.value}</p>
                            <p className="middle-row__unit">{icon.unit}</p>
                        </div>
                    </div>
                ))}
            </div>
            {/* Motor Speed Settings — interactive speed selector (OFF through 4) */}
            <div className="middle-row__right">
                <h2>Motor Speed Setting</h2>
                <MotorSpeedSetting />
            </div>
        </section>
    );
}
