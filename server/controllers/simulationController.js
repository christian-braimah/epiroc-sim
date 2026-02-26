const simulationController = async (req, res) => {
    try{
        const {motor_speed_setting} = req.body;
        const result = await db.one("UPDATE vehicle SET motor_speed_setting = $1 WHERE id = $2 RETURNING *", [motor_speed_setting, 1]);
        res.json(result);
    }catch(err){
        console.error("Error updating motor speed setting:", err);
        res.status(500).json({error: "Internal server error"});
    }   
};

export default simulationController;