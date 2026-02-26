import BatteryLowIndicator from "@/assets/topRowIcons/batteryLowIndicator";
import CheckEngine from "@/assets/topRowIcons/checkEngine";
import MotorStatus from "@/assets/topRowIcons/motorStatus";
import ParkingBrake from "@/assets/topRowIcons/parkingBrake";

// Setting up colors for icons
const defaultColor = "#DDDDDD";
const warningColor = "#FF0000";

export default function TopRow() {
    // Static values for now — will be wired to backend later
    const parkingBrake = false;
    const checkEngine = false;
    const motorStatus = false;
    const batteryLow = false;

    const topRowIcons = [
        {
            id: 1,
            name: "Parking Brake",
            icon: <ParkingBrake color={parkingBrake ? warningColor : defaultColor} />
        },
        {
            id: 2,
            name: "Check Engine",
            icon: <CheckEngine color={checkEngine ? warningColor : defaultColor} />
        },
        {
            id: 3,
            name: "Motor Status",
            icon: <MotorStatus color={motorStatus ? warningColor : defaultColor} />
        },
        {
            id: 4,
            name: "Battery Low Indicator",
            icon: <BatteryLowIndicator color={batteryLow ? warningColor : defaultColor} />
        }
    ];

    return (
        <section className="top-row">
            {topRowIcons.map((icon) => (
                <div key={icon.id} className="btn btn-top">
                    {icon.icon}
                </div>
            ))}
        </section>
    );
}
