import express from "express";
import simulationController from "../controllers/simulationController.js";

const simulationRouter = express.Router();

simulationRouter.post("/", simulationController);

export default simulationRouter;
