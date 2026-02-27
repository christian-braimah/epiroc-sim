import express from "express";
import simulationController from "../controllers/simulationController.js";

const simulationRouter = express.Router();

// Handles the simulation
simulationRouter.post("/", simulationController);

export default simulationRouter;
