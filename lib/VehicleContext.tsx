"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

// Type definition matching DB structure 
export interface VehicleState {
  id: number;
  power_kw: number;
  rpm: number;
  gear_ratio: string;
  battery_pct: number;
  battery_temp: number;
  motor_rpm: number;
  motor_speed: number;
  parking_brake: boolean;
  check_engine: boolean;
  battery_low: boolean;
  motor_status: boolean;
  is_charging: boolean;
}

// Providing this data to child components
interface VehicleContextValue {
  vehicleState: VehicleState | null; 
  setMotorSpeed: (speed: number) => Promise<void>;  // Update motor speed (0-4)
  toggleCharging: () => Promise<void>;               // Toggle charging on/off
}

// Create the context with null as default
const VehicleContext = createContext<VehicleContextValue | null>(null);

// VehicleProvider wraps the dashboard and provides vehicle data to all children
export function VehicleProvider({ children }: { children: React.ReactNode }) {
  const [vehicleState, setVehicleState] = useState<VehicleState | null>(null);

  // Fetching vehicle state with /api/vehicle API endpoint
  const fetchVehicleState = useCallback(async () => {
    try {
      const res = await fetch("/api/vehicle");
      const data = await res.json();
      if (!data.error) {
        setVehicleState(data);
      }
    } catch (err) {
      console.error("Failed to fetch vehicle state:", err);
    }
  }, []);

  // Fetching vehicle state every second to update UI
  useEffect(() => {
    fetchVehicleState();

    const interval = setInterval(() => {
      fetchVehicleState();
    }, 1000);

    return () => clearInterval(interval);
  }, [fetchVehicleState]);


  // Setting motor speed (0-4)
  const setMotorSpeed = useCallback(async (speed: number) => {
    try {
      await fetch("/api/vehicle/control", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ motor_speed: speed }),
      });
      // Re-fetch state so the UI updates with the new value
      await fetchVehicleState();
    } catch (err) {
      console.error("Failed to set motor speed:", err);
    }
  }, [fetchVehicleState]);



  // Toggling charging on/off
  const toggleCharging = useCallback(async () => {
    // Read current charging state, then flip it
    const newCharging = !(vehicleState?.is_charging ?? false);
    try {
      await fetch("/api/vehicle/control", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_charging: newCharging }),
      });
      // Re-fetch state so the UI updates
      await fetchVehicleState();
    } catch (err) {
      console.error("Failed to toggle charging:", err);
    }
  }, [vehicleState?.is_charging, fetchVehicleState]);

  return (
    <VehicleContext.Provider value={{ vehicleState, setMotorSpeed, toggleCharging }}>
      {children}
    </VehicleContext.Provider>
  );
}

/**
 * useVehicle — hook for child components to access vehicle state and actions.
 * Must be used inside a <VehicleProvider>.
 */
export function useVehicle() {
  const content = useContext(VehicleContext);
  if (!content) throw new Error("useVehicle must be used within a VehicleProvider");
  return content;
}
