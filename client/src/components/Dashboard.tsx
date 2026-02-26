import TopRow from "./TopRow/TopRow";
import MiddleRow from "./MiddleRow/MiddleRow";
import BottomRow from "./BottomRow/BottomRow";
import Gauges from "./Gauges/Gauges";
import { VehicleProvider } from "../context/VehicleContext";

export default function Dashboard() {
    return (
        <VehicleProvider>
            <div className="dashboard">
                <TopRow />
                <Gauges />
                <MiddleRow />
                <BottomRow />
            </div>
        </VehicleProvider>
    );
}
