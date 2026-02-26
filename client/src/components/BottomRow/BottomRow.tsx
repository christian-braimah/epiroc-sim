"use client";

// Importing Vehicle Data
import { useVehicle } from "@/context/VehicleContext";

// Importing Icons
import ChargingButton from "@/assets/bottomRowIcons/chargingButton";
import ViewMenu from "@/assets/bottomRowIcons/viewMenu";
import BatteryTemperature from "@/assets/middleRowIcons/batteryTemperature";
import GearRatio from "@/assets/middleRowIcons/gearRatio";
import MotorStatus from "@/assets/topRowIcons/motorStatus";

// Icon Colors
const defaultColor = "#DDDDDD";
const chargingColor = "#00FF00";

export default function BottomRow() {
    const { vehicleState, toggleCharging } = useVehicle();

    const leftBottomRowIcons = [
        {
            id: 1,
            name: "Gear Ratio",
            icon: <GearRatio color={defaultColor} />,
        },
        {
            id: 2,
            name: "Motor Status",
            icon: <MotorStatus color={defaultColor} />,
        },
        {
            id: 3,
            name: "Battery Temperature",
            icon: <BatteryTemperature color={defaultColor} />,
        },
    ];

    return (
        <section className="bottom-row">

            <div className="bottom-row__left">
                {leftBottomRowIcons.map((icon) => (
                    <div key={icon.id} className="btn btn-bottom">
                        {icon.icon}
                    </div>
                ))}
            </div>


            <div className="bottom-row__middle">
                <div className="btn btn-bottom middle">
                    <ViewMenu color={defaultColor}/>
                </div>
            </div>


            <div className="bottom-row__right">
                <div
                    className="btn btn-bottom"
                    onClick={toggleCharging}
                    style={{ cursor: "pointer" }}
                >
                    <ChargingButton color={vehicleState?.is_charging ? chargingColor : defaultColor} />
                </div>
            </div>
        </section>
    );
}