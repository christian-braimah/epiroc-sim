"use client";
import {useState, useEffect} from "react";
import GaugeComponent from "react-gauge-component";

export default function RPMGauge() {
 const [value, setValue] = useState(0);
  useEffect(() => {
    const values = [0, 100,200,300,400,500,600,700,800,900,1000];
    let i = 0;

    const interval = setInterval(() => {
      i = (i + 1) % values.length;
      setValue(values[i]);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-2">
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
              ticks:[
                { value: 0, valueConfig: { formatTextValue: () => "0" } },
                { value: 10, valueConfig: { formatTextValue: () => "10" } },
                { value: 20, valueConfig: { formatTextValue: () => "20" } },
                { value: 30, valueConfig: { formatTextValue: () => "30" } },
                { value: 40, valueConfig: { formatTextValue: () => "40" } },
                { value: 50, valueConfig: { formatTextValue: () => "50" } },
                { value: 60, valueConfig: { formatTextValue: () => "60" } },
                { value: 70, valueConfig: { formatTextValue: () => "70" } },
                { value: 80, valueConfig: { formatTextValue: () => "80" } },
                { value: 90, valueConfig: { formatTextValue: () => "90" } },
                { value: 100, valueConfig: { formatTextValue: () => "100" } },
                
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
        RPM
      </div>

    </div>
  )
}