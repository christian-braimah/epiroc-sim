import db from "../db/dbConnect.js";

// Handles the motor speed setting
const motorController = async (req, res) => {
    try{
        // Fetching the motor speed setting from the request body
        const {motor_speed_setting} = req.body;
        // Updates the motor speed setting in the database
        const result = await db.one("UPDATE vehicle SET motor_speed_setting = $1 WHERE id = 1 RETURNING *", [motor_speed_setting]);
        res.json(result);
    }catch(err){
        console.error("Error updating motor speed setting:", err);
        res.status(500).json({error: "Internal server error"});
    }
}


export default motorController;