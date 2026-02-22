import ChargingButton from "@/components/BottomRow/bottomRowIcons/chargingButton";
import ViewMenu from "@/components/BottomRow/bottomRowIcons/viewMenu";
import BatteryTemperature from "@/components/MiddleRow/middleRowIcons/batteryTemperature";
import GearRatio from "@/components/MiddleRow/middleRowIcons/gearRatio";
import MotorStatus from "@/components/TopRow/topRowIcons/motorStatus";

export default function BottomRow() {
    return (
        <section className="bottom-row">
            <div className="bottom-row__left">
                <div className="btn btn-bottom">
                <GearRatio color="#DDDDDD"/>
               </div>
               <div className="btn btn-bottom">
               <MotorStatus color="#DDDDDD" />
               </div>
               <div className="btn btn-bottom">
               <BatteryTemperature color="#DDDDDD"/>
               </div>
               
               
            </div>
            <div className="bottom-row__middle">
                <div className="btn btn-bottom">
                    <ViewMenu color="#DDDDDD"/>
                </div>
            </div>
            <div className="bottom-row__right">
                <div className="btn btn-bottom">
                <ChargingButton color="#DDDDDD" />
                </div>
            </div>
        </section>
    );
}