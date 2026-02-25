"use client";

import { useVehicle } from "@/lib/VehicleContext";

const speedOptions = ["OFF", "1", "2", "3", "4"];


export default function MotorSpeedSetting() {
  const { vehicleState, setMotorSpeed } = useVehicle();
  const selected = vehicleState?.motor_speed ?? 0;

  const handleChange = (newSpeed: number) => {
    setMotorSpeed(newSpeed); // Sends POST to /api/vehicle/control
  };

  return (
    <div className="motor-speed-settings">
      <input
        type="range"
        min={0}
        max={4}
        step={1}
        value={selected}
        onChange={(e) => handleChange(Number(e.target.value))}
        className="motor-speed-slider"
      />
      {/* Speed labels below the slider */}
      <div className="motor-speed-labels">
        {speedOptions.map((label, index) => (
          <button
            key={label}
            className={`motor-speed-label ${selected === index ? "motor-speed-label--active" : ""}`}
            onClick={() => handleChange(index)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
