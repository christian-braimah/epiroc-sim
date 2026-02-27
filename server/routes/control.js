import express from "express";
import motorController from "../controllers/motorController.js";
import chargingController from "../controllers/chargingController.js";

const controlRouter = express.Router();

// Targeting the two control endpoints
controlRouter.post("/motor", motorController);
controlRouter.post("/charging", chargingController);

export default controlRouter;