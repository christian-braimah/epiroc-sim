import GaugeComponent from "react-gauge-component";
import { useState, useEffect } from "react";
import { useVehicle } from "../../context/VehicleContext";

export default function PowerGauge() {
  const vehicleData = useVehicle();

  // Value from backend
  const value = vehicleData.vehicleState?.power_kw ?? 0;

  // Specifying Range Colors
  const regenRangeColor = "#00FF00";
  const extremeRangeColor = "#FF0000";
  const defaultRangeColor = "#dddddd";

  return (
    <div>
      <div className="gauge-section">
        <GaugeComponent
          type="radial"
          value={(value + 1000) / 20}
          minValue={0}
          maxValue={100}
          arc={{
            width: 0.1,
            padding: 0,
            emptyColor: "#3a3a40",
            subArcs: [
              { limit: 50, color: regenRangeColor },
              { limit: 87.5, color: defaultRangeColor },
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
                { value: 0, valueConfig: { formatTextValue: () => "-1000" } },
                { value: 12.5, valueConfig: { formatTextValue: () => "-750" } },
                { value: 25, valueConfig: { formatTextValue: () => "-500" } },
                { value: 37.5, valueConfig: { formatTextValue: () => "-250" } },
                { value: 50, valueConfig: { formatTextValue: () => "0" } },
                { value: 62.5, valueConfig: { formatTextValue: () => "250" } },
                { value: 75, valueConfig: { formatTextValue: () => "500" } },
                { value: 87.5, valueConfig: { formatTextValue: () => "750" } },
                { value: 100, valueConfig: { formatTextValue: () => "1000" } },
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
        kW
      </div>
    </div>
  );
}
