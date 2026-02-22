"use client";
import {useState, useEffect} from "react";
import GaugeComponent from "react-gauge-component";
import React from "react";


export default function PowerGauge() {
 const [value, setValue] = useState(0);
  useEffect(() => {
    const values = [-1000, -500, 0, 500,750, 1000];
    let i = 0;

    const interval = setInterval(() => {
      i = (i + 1) % values.length;
      setValue(values[i]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
    >
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
            colorArray: ["#FF0000", "#FFA500", "#FFFF00", "#00FF00", "#171722ff", "#4B0082", "#8B00FF"],
            colorArrayThresholds: [-1000, -500, 0, 500,750, 1000],
          }}
          pointer={{
            type: "needle",
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
              defaultTickLineConfig: {
                style: {
                  display: "none",
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
  )
}