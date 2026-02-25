"use client";

import { VehicleProvider } from "@/lib/VehicleContext";
import TopRow from "./TopRow/TopRow";
import MiddleRow from "./MiddleRow/MiddleRow";
import BottomRow from "./BottomRow/BottomRow";
import Gauges from "./Gauges/Gauges";

// Dashboard wraps everything in VehicleProvider so all child components
// can access the vehicle state via useVehicle() hook
export default function Dashboard() {
    return (
        <VehicleProvider>
            <div className="flex flex-col gap-2 h-screen">
                <TopRow />
                <Gauges />
                <MiddleRow />
                <BottomRow />
            </div>
        </VehicleProvider>
    );
}
