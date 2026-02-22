import GearRatio from "./middleRowIcons/gearRatio";
import BatteryPercentage from "./middleRowIcons/batteryPercentage";
import BatteryTemperature from "./middleRowIcons/batteryTemperature";


let defaultColor = "#DDDDDD";
let middleRowIcons = [
    {
        id: 1,
        name: "Gear Ratio",
        icon: <GearRatio color={defaultColor} />
    },
    {
        id: 2,
        name: "Battery Percentage",
        icon: <BatteryPercentage color={defaultColor} />
    },
    {
        id:3,
        name: "Battery Temperature",
        icon: <BatteryTemperature color={defaultColor} />
    }
]

export default function MiddleRow() {
    return (
        <section className="middle-row">
            <div className="middle-row__left">
                {middleRowIcons.map((icon) => (
                    <div key={icon.id} className="btn btn-middle">
                        {icon.icon}
                    </div>
                ))}

            </div>
            <div className="middle-row__right">
                
            </div>
        </section>
    );
}