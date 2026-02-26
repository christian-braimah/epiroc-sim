import TopRow from "./TopRow/TopRow";
import MiddleRow from "./MiddleRow/MiddleRow";
import BottomRow from "./BottomRow/BottomRow";
import Gauges from "./Gauges/Gauges";

export default function Dashboard() {
    return (
        <div className="dashboard">
            <TopRow />
            <Gauges />
            <MiddleRow />
            <BottomRow />
        </div>
    );
}
