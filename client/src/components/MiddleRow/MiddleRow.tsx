import GearRatio from "@/assets/middleRowIcons/gearRatio";
import BatteryPercentage from "@/assets/middleRowIcons/batteryPercentage";
import BatteryTemperature from "@/assets/middleRowIcons/batteryTemperature";
import MotorStatus from "@/assets/topRowIcons/motorStatus";
import MotorSpeedSetting from "./MotorSpeedSetting";

const defaultColor = "#DDDDDD";

// MiddleRow displays vehicle metrics (gear ratio, battery %, battery temp, motor RPM)
// and the motor speed setting slider.
export default function MiddleRow() {
    // Static values for now — will be wired to backend later
    const gearRatio = "N/N";
    const batteryPct = 100;
    const batteryTemp = 20;
    const motorRpm = 0;

    const middleRowIcons = [
        {
            id: 1,
            name: "Gear Ratio",
            icon: <GearRatio color={defaultColor} />,
            value: gearRatio,
            unit: ""
        },
        {
            id: 2,
            name: "Battery Percentage",
            icon: <BatteryPercentage color={defaultColor} />,
            value: batteryPct.toFixed(2),
            unit: "%"
        },
        {
            id: 3,
            name: "Battery Temperature",
            icon: <BatteryTemperature color={defaultColor} />,
            value: batteryTemp.toFixed(2),
            unit: "°C"
        },
        {
            id: 4,
            name: "Motor RPM",
            icon: <MotorStatus color={defaultColor} />,
            value: String(motorRpm),
            unit: "RPM"
        }
    ];

    return (
        <section className="middle-row">
            <div className="middle-row__left">
                {middleRowIcons.map((icon) => (
                    <div key={icon.id} className="btn btn-middle">
                        {icon.icon}
                        <div className="metric-values">
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
