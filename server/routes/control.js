import express from "express";
import motorController from "../controllers/motorController.js";

const controlRouter = express.Router();

controlRouter.post("/", motorController);

export default controlRouter;