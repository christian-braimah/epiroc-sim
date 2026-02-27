import { useVehicle } from "../../context/VehicleContext";
import BatteryLowIndicator from "@/assets/topRowIcons/batteryLowIndicator";
import CheckEngine from "@/assets/topRowIcons/checkEngine";
import MotorStatus from "@/assets/topRowIcons/motorStatus";
import ParkingBrake from "@/assets/topRowIcons/parkingBrake";

// Setting up colors for icons
const defaultColor = "#DDDDDD";  
const warningColor = "#FF0000";   

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
            name: "Motor Status",
            icon: <MotorStatus color={vehicleState?.motor_status ? warningColor : defaultColor} />
            
        },
        {
           id: 4,
            name: "Battery Low Indicator",
            icon: <BatteryLowIndicator color={vehicleState?.battery_low ? warningColor : defaultColor} />
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