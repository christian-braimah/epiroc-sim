import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Fetching all vehicle data
export const getVehicleStatus = async () => {
    const response = await axios.get(`${API_URL}/vehicle`);
    return response.data;
}

// Updating motor speed setting
export const updateMotorSpeedSetting = async (motor_speed_setting: number) => {
    const response = await axios.post(`${API_URL}/control/motor`, { motor_speed_setting });
    return response.data;
}

// Updating charging status
export const toggleCharging = async (is_charging: boolean) => {
    const response = await axios.post(`${API_URL}/control/charging`, { is_charging });
    return response.data;
}

// Updating simulation
export const updateSimulation = async (motor_speed_setting: number) => {
    const response = await axios.post(`${API_URL}/simulation`, { motor_speed_setting });
    return response.data;
}
