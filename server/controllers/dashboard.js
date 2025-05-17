const db = require('../db');
const path = require('path');

const getRecentRescue = (req,res) =>{
    const sql = "SELECT rescue_name, admission_no, referred_by, admission_date FROM first_information ORDER BY created_at DESC LIMIT 2";
    db.query(sql, (err, results) => {
        if (err) {
        console.error("Error fetching data:", err);
        return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
}

module.exports = {
    getRecentRescue,
};