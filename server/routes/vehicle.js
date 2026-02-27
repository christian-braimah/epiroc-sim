import express from "express";
import db from "../db/dbConnect.js";

const vehicleRouter = express.Router();

vehicleRouter.get("/", async (req, res) => {
    try{
        const result = await db.one("SELECT * FROM vehicle WHERE id = $1", [1]);
        res.json(result);
    }catch(err){
        console.error("Error fetching vehicle status:", err);
        res.status(500).json({error: "Internal server error"});
    }   
});

export default vehicleRouter;