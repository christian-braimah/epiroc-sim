import BatteryLowIndicator from "./topRowIcons/batteryLowIndicator";
import CheckEngine from "./topRowIcons/checkEngine";
import MotorStatus from "./topRowIcons/motorStatus";
import ParkingBrake from "./topRowIcons/parkingBrake";

let defaultColor = "#DDDDDD";
let topRowIcons = [
    {
        id: 1,
        name: "Parking Brake",
        icon: <ParkingBrake color={defaultColor} />
    },
    {
        id: 2,
        name: "Check Engine",
        icon: <CheckEngine color={defaultColor} />
    },
    {
        id: 3,
        name: "Battery Low Indicator",
        icon: <BatteryLowIndicator color={defaultColor} />
    },
    {
        id: 4,
        name: "Motor Status",
        icon: <MotorStatus color={defaultColor} />
    }
]

export default function TopRow() {
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