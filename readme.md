# Epiroc Vehicle Dashboard Simulator

A real-time electric mining vehicle dashboard simulator built for the Epiroc EAE Full-Stack Developer Challenge. The application features a physics-based simulation engine, interactive controls, and live-updating gauges for monitoring vehicle metrics.

**Live Demo:** [http://3.145.89.180](http://3.145.89.180)



<img width="1604" height="1077" alt="Screenshot 2026-02-27 at 09 06 11" src="https://github.com/user-attachments/assets/4ad1dd5f-1d93-4e64-bc27-c0a5af8b832b" />


---

## Tech Stack

### Frontend
- **Vite** — Build tool and dev server
- **React 19** — UI framework
- **TypeScript** — Type safety
- **Axios** — HTTP client
- **react-gauge-component** — RPM and Power radial gauges

### Backend
- **Express 5** — REST API framework
- **pg-promise** — PostgreSQL query library
- **PostgreSQL** — Database (AWS RDS)

### Deployment
- **Docker** — Backend containerization
- **AWS EC2** — Backend hosting with Apache reverse proxy
- **AWS RDS** — Managed PostgreSQL database

---

## Project Structure

```
epiroc-sim/
├── client/                          # React frontend
│   ├── src/
│   │   ├── assets/                  # SVG icon components
│   │   │   ├── topRowIcons/         # Status indicators
│   │   │   ├── middleRowIcons/      # Vehicle metric icons
│   │   │   └── bottomRowIcons/      # Control button icons
│   │   ├── components/
│   │   │   ├── Dashboard.tsx        # Root layout
│   │   │   ├── TopRow/              # Status indicator bar
│   │   │   ├── Gauges/              # RPM & Power gauges
│   │   │   ├── MiddleRow/           # Metrics & motor speed slider
│   │   │   └── BottomRow/           # Charging toggle & controls
│   │   ├── context/
│   │   │   └── VehicleContext.tsx    # Global state & polling
│   │   ├── utils/
│   │   │   └── vehicle.ts           # API helper functions
│   │   ├── App.tsx
│   │   ├── App.css
│   │   └── main.tsx
│   ├── .env
│   ├── package.json
│   └── vite.config.ts
│
├── server/                          # Express backend
│   ├── controllers/
│   │   ├── simulationController.js  # Simulation Logic
│   │   ├── motorController.js       # Motor speed controller
│   │   └── chargingController.js    # Charging toggle controller
│   ├── routes/
│   │   ├── vehicle.js               # GET vehicle state
│   │   ├── control.js               # POST motor & charging
│   │   └── simulation.js            # POST simulation tick
│   ├── db/
│   │   ├── dbConnect.js             # PostgreSQL connection
│   │   └── vehicle.sql              # Database Schema & seed data
│   ├── server.js                    # Express app entry point
│   ├── Dockerfile                   # Docker image build
│   ├── deploy.sh                    # One-command EC2 deployment
│   └── package.json
│
└── readme.md
```

---

## Prerequisites

- **Node.js** 
- **PostgreSQL**  

---

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/chrisbraimah/epiroc-sim.git
cd epiroc-sim
```

### 2. Set Up the Database

Connect to your PostgreSQL instance and run the schema file:

```bash
psql -U <your_user> -d <your_database> -f server/db/vehicle.sql
```

This creates the `vehicle` table and inserts an initial row with default values.

### 3. Set Up the Backend

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory:

```env
PORT=4000
RDS_DATABASE_URL=postgresql://<user>:<password>@<host>:5432/<database>
```

Start the server:

```bash
npm start
```

Yo will get the following response : 

    The API will be running at `http://localhost:4000`.

### 4. Set Up the Frontend

```bash
cd client
npm install
```

Create a `.env` file in the `client/` directory:

```env
VITE_API_URL=http://localhost:4000
```

Start the dev server:

```bash
npm run dev
```

The dashboard will be available at `http://localhost:5173`.

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/vehicle` | Fetch current vehicle state |
| POST | `/control/motor` | Update motor speed setting (0-4) |
| POST | `/control/charging` | Toggle charging on/off |
| POST | `/simulation` | Executes one simulation tick |

### For Examples

**Whaen you set motor speed to 3:**
```json
POST /control/motor
{ "motor_speed_setting": 3 }
```

**When you toggele charging on:**
```json
POST /control/charging
{ "is_charging": true }
```

---

## Simulation Logic

The simulation engine is called every 1 second and has the following vehicle physics:

### Motor & RPM
- **Speed settings** 0-4 are mapped to these target RPMs: 0, 200, 400, 600, 800
- To prevent instant acceleration, RPM ramps gradually:
        RPM Step = 800 RPM / 12 seconds = 66.67 RPM per tick
        So 12s to max RPM. The same for deceleration.
- Motor status indicator activates at RPM >= 700

### Power Calculation
- `Power (kW) = (Torque × RPM) / 9550`
- Where 9550 is the mechanical conversion factor (kW to Nm at RPM).
- Max torque: 11,937.5 Nm at 800 RPM _(Torque(Max) = (1000 x 9550) / 800 = 11,937.5 Nm)_
- Regenerative braking applies at 50% during deceleration

### Battery
Battery drains based on the power output. Assuming the battery drains in 1 minute at Max Power:
`Battery Drain Per Tick = DRAIN_CONSTANT x Power
 DRAIN_CONSTANT = (100% / 60s) / 1000kW = 0.001667`
 
- **Drain rate:** 0.001667% per kW per second
- 
  When charging is active:
  The motor is turned off, and it charges at the same rate in 1 minute.
  
- **Charge rate:** 1.667% per second (~60 seconds for full charge)
- **Battery low** indicator at <= 20%, auto-shutdown at 0%
- `P(regen) = -0.5 x (Torque x RPM) / 9550`

### Temperature
It is assumed that the battery heats from 20 to 60 degrees in 1 minute to get the heat rate.

- Base temperature: 20°C and is proportional to the power output.
- Heats at 0.000667°C per kW, cools at 0.667°C/sec when idle
   `HEAT_RATE = 40 / (60s x 1000kW) = 0.000667
    Temp(new) = Temp(current) + |Power| x HEAT_RATE`
- **Check engine** indicator triggers at >= 50°C
- Cooling implemented when the motor is off, and cools from 60 degrees to 20 degrees C in 1 minute.

### Gear Ratios
| Speed Setting | Gear Ratio |
|--------------|------------|
| OFF (0) | N/N |
| 1 | 4/1 |
| 2 | 3/1 |
| 3 | 2/1 |
| 4 | 1/1 |

---

## Database Schema

```sql
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
```

---

## Deployment

### Backend (Docker + EC2)

Build and push the Docker image:

```bash
cd server
docker buildx build --platform linux/amd64 -t <dockerhub-user>/epiroc-sim-backend:latest --push .
```

On the EC2 instance, pull and run:

```bash
docker pull <dockerhub-user>/epiroc-sim-backend:latest
docker run -d --name epiroc-backend --env-file .env -p 4000:4000 --restart unless-stopped <dockerhub-user>/epiroc-sim-backend:latest
```

### Frontend (Apache on EC2)

Build the frontend:

```bash
cd client
npm run build
```

Upload the `dist/` contents to `/var/www/html/` on the EC2 instance.

### Apache Reverse Proxy

Apache serves the frontend on port 80 and proxies API requests to the Docker backend on port 4000:

```apache
<VirtualHost *:80>
    DocumentRoot /var/www/html

    ProxyPass /vehicle http://localhost:4000/vehicle
    ProxyPassReverse /vehicle http://localhost:4000/vehicle

    ProxyPass /control http://localhost:4000/control
    ProxyPassReverse /control http://localhost:4000/control

    ProxyPass /simulation http://localhost:4000/simulation
    ProxyPassReverse /simulation http://localhost:4000/simulation

    FallbackResource /index.html
</VirtualHost>
```

Enable required modules:

```bash
sudo a2enmod proxy proxy_http rewrite
sudo systemctl restart apache2
```
