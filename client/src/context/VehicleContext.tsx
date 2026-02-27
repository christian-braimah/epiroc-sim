import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { getVehicleStatus, updateMotorSpeedSetting, toggleCharging as toggleChargingAPI, updateSimulation } from "../utils/vehicle";

// Type definition matching DB structure
export interface VehicleState {
  id: number;
  power_kw: number;
  gear_ratio: string;
  battery_pct: number;
  battery_temp: number;
  motor_rpm: number;
  motor_speed_setting: number;
  parking_brake: boolean;
  check_engine: boolean;
  battery_low: boolean;
  motor_status: boolean;
  is_charging: boolean;
}

// Providing this data to child components
interface VehicleContextValue {
  vehicleState: VehicleState | null;
  setMotorSpeed: (speed: number) => Promise<void>;
  toggleCharging: () => Promise<void>;
}

// Create the context with null as default
const VehicleContext = createContext<VehicleContextValue | null>(null);

// VehicleProvider wrapping dashboard and providing vehicle data to all children
export function VehicleProvider({ children }: { children: React.ReactNode }) {
  const [vehicleState, setVehicleState] = useState<VehicleState | null>(null);

  // Fetching vehicle state from the backend
  const fetchVehicleState = useCallback(async () => {
    try {
      const data = await getVehicleStatus();
      setVehicleState(data);
    } catch (err) {
      console.error("Failed to fetch vehicle state:", err);
    }
  }, []);

  // Poll every second: run simulation tick, then fetch updated state
  useEffect(() => {
    fetchVehicleState();

    const interval = setInterval(async () => {
      await updateSimulation(vehicleState?.motor_speed_setting ?? 0);
      fetchVehicleState();
    }, 1000);

    return () => clearInterval(interval);
  }, [fetchVehicleState]);

  // Setting motor speed (0-4)
  const setMotorSpeed = useCallback(async (speed: number) => {
    try {
      await updateMotorSpeedSetting(speed);
      await fetchVehicleState();
    } catch (err) {
      console.error("Failed to set motor speed:", err);
    }
  }, [fetchVehicleState]);

  // Toggling charging on/off
  const toggleCharging = useCallback(async () => {
    const newCharging = !(vehicleState?.is_charging ?? false);
    try {
      await toggleChargingAPI(newCharging);
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

// useVehicle — hook for child components to access vehicle data
export function useVehicle() {
  const content = useContext(VehicleContext);
  if (!content) throw new Error("useVehicle must be used within a VehicleProvider");
  return content;
}
