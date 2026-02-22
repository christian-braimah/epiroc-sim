import GearRatio from "./middleRowIcons/gearRatio";
import BatteryPercentage from "./middleRowIcons/batteryPercentage";
import BatteryTemperature from "@/components/MiddleRow/middleRowIcons/batteryTemperature";
import MotorStatus from "@/components/TopRow/topRowIcons/motorStatus";
import MotorSpeedSetting from "./MotorSpeedSetting";

let defaultColor = "#DDDDDD";
let middleRowIcons = [
    {
        id: 1,
        name: "Gear Ratio",
        icon: <GearRatio color={defaultColor} />,
        value: "N/N",
        unit: ""
    },
    {
        id: 2,
        name: "Battery Percentage",
        icon: <BatteryPercentage color={defaultColor} />,
        value: "100",
        unit: "%"
    },
    {
        id:3,
        name: "Battery Temperature",
        icon: <BatteryTemperature color={defaultColor} />,
        value: "22.5",
        unit: "°C"
    }, 
    {
        id:4,
        name: "Motor Temperature",
        icon: <MotorStatus color={defaultColor} />,
        value: "22",
        unit: "RPM"
    }
]

export default function MiddleRow() {
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