import PowerGauge from "./powerGauge";
import RPMGauge from "./rpmGauge";

export default function Gauges() {
    return (
        <section className="gauge-section">
            <PowerGauge/>
            <RPMGauge/>
        </section>
    );
}