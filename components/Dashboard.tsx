import TopRow from "./TopRow/TopRow";
import MiddleRow from "./MiddleRow/MiddleRow";
import BottomRow from "./BottomRow/BottomRow";
import Gauges from "./Gauges/Gauges";

export default function Dashboard() {
    return (
        <div className="flex flex-col gap-2 h-screen">
            <TopRow />
            <Gauges/>
            <MiddleRow />
            <BottomRow />
        </div>
    );
}