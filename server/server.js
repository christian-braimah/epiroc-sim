import express from "express";
import dotenv from "dotenv";
import cors from "cors";

// Import routes
import vehicleRouter from "./routes/vehicle.js";
import controlRouter from "./routes/control.js";
import simulationRouter from "./routes/simulation.js";

// Initialize express app
const app = express();

// Load environment variables
dotenv.config();


// Allow requests from the client
const allowedOrigins = [
    "http://localhost:5173", 
    "http://localhost:3000",
    "http://localhost:4000",
    "https://epiroc-sim-frontend.s3.us-east-2.amazonaws.com/index.html"
];

// CORS configuration
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));

// Default route
app.get("/", (req, res) => {
    res.send({message: "API is running!"});
});

app.use(express.json());

// API routes
app.use("/vehicle", vehicleRouter); // fetches all vehicle data
app.use("/control", controlRouter); // posts the current motor speed setting
app.use("/simulation", simulationRouter); // handles simulation logic


// Listening for 
app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT}`);
});