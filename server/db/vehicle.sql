CREATE TABLE vehicle (
    id SERIAL PRIMARY KEY,
    power_kw NUMERIC DEFAULT 0,
    motor_rpm NUMERIC DEFAULT 0,
    motor_speed_setting NUMERIC DEFAULT 0,
    gear_ratio VARCHAR DEFAULT 'N/N',
    battery_pct NUMERIC DEFAULT 100,
    battery_temp NUMERIC DEFAULT 20,
    parking_brake BOOLEAN DEFAULT FALSE,
    check_engine BOOLEAN DEFAULT FALSE,
    motor_status BOOLEAN DEFAULT FALSE,
    battery_low BOOLEAN DEFAULT FALSE,
    is_charging BOOLEAN DEFAULT FALSE,
    timestamp TIMESTAMP DEFAULT now()
);

INSERT INTO vehicle DEFAULT VALUES;