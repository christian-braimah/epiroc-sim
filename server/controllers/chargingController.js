import db from "../db/dbConnect.js";

// Handles the charging status
const chargingController = async (req, res) => {
    try{
        // Fetching the charging status from the request body
        const {is_charging} = req.body;
        // Updates the charging status in the database
        const result = await db.one("UPDATE vehicle SET is_charging = $1 WHERE id = 1 RETURNING *", [is_charging]);
        res.json(result);
    }catch(err){
        console.error("Error updating charging status:", err);
        res.status(500).json({error: "Internal server error"});
    }
}

export default chargingController;