"use client";

import { useState } from "react";

const speedOptions = ["OFF", "1", "2", "3", "4"];

/**
 * MotorSpeedSetting — Interactive speed selector (item #11 in the dashboard spec).
 * Uses a native range input (0-4) with labels below. Styled via CSS to match the dashboard.
 */
export default function MotorSpeedSetting() {
  const [selected, setSelected] = useState(0);

  return (
    <div className="motor-speed-settings">
      <input
        type="range"
        min={0}
        max={4}
        step={1}
        value={selected}
        onChange={(e) => setSelected(Number(e.target.value))}
        className="motor-speed-slider"
      />
      {/* Speed labels below the slider */}
      <div className="motor-speed-labels">
        {speedOptions.map((label, index) => (
          <button
            key={label}
            className={`motor-speed-label ${selected === index ? "motor-speed-label--active" : ""}`}
            onClick={() => setSelected(index)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
