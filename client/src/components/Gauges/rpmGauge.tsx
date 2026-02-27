import GaugeComponent from "react-gauge-component";
import { useVehicle } from "../../context/VehicleContext";

export default function RPMGauge() {
  const vehicleData: any = useVehicle();

  // Static value for now — will be wired to backend later
  const value = vehicleData.vehicleState?.motor_rpm ?? 0;

  // Specifying Range Colors
  const extremeRangeColor = "#FF0000";
  const safeRangeColor = "#00FF00";
  const defaultRangeColor = "#dddddd";

  return (
    <div>
      <div className="gauge-section">
        <GaugeComponent
          type="radial"
          value={(value / 800) * 100}
          minValue={0}
          maxValue={100}
          arc={{
            width: 0.1,
            padding: 0,
            emptyColor: "#3a3a40",
            subArcs: [
              { limit: 25, color: defaultRangeColor },
              { limit: 87.5, color: safeRangeColor },
              { limit: 100, color: extremeRangeColor },
            ],
          }}
          pointer={{
            type: "needle",
            color: "#FFFFFF",
            length: 0.6,
            width: 10,
            animate: true,
            elastic: false,
            animationDuration: 800,
            animationDelay: 0,
          }}
          labels={{
            valueLabel: {
              formatTextValue: () => `${value}`,
              style: {
                fontSize: "25px",
                fontWeight: "bold",
                fill: "#ffffff",
              },
            },
            tickLabels: {
              type: "inner",
              hideMinMax: true,
              ticks: [
                { value: 0, valueConfig: { formatTextValue: () => "0" } },
                { value: 12.5, valueConfig: { formatTextValue: () => "100" } },
                { value: 25, valueConfig: { formatTextValue: () => "200" } },
                { value: 37.5, valueConfig: { formatTextValue: () => "300" } },
                { value: 50, valueConfig: { formatTextValue: () => "400" } },
                { value: 62.5, valueConfig: { formatTextValue: () => "500" } },
                { value: 75, valueConfig: { formatTextValue: () => "600" } },
                { value: 87.5, valueConfig: { formatTextValue: () => "700" } },
                { value: 100, valueConfig: { formatTextValue: () => "800" } }
              ],
              defaultTickValueConfig: {
                style: {
                  fontSize: "13px",
                  fill: "#BFBFBF",
                },
              },
            },
          }}
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      {/* Unit label */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#888890",
          fontSize: 24,
          marginTop: -60,
          marginBottom: 40,
        }}
      >
        RPM
      </div>
    </div>
  );
}
