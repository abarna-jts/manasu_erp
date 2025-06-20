import db from '../db.js';
import path from 'path';

const getRecentRescue = async (req, res) => {
    try {
        const sql = `
      SELECT rescue_name, admission_no, referred_by, admission_date 
      FROM first_information 
      ORDER BY created_at DESC 
      LIMIT 2
    `;
        const [results] = await db.query(sql);
        res.json(results);
    } catch (err) {
        console.error("Error fetching data:", err);
        res.status(500).json({ error: "Database error" });
    }
};

const totalRescue = async (req, res) => {
    try {
        const sql = "SELECT COUNT(*) as totalRescue FROM first_information";
        const [results] = await db.query(sql);
        res.json(results[0]); // Send just the result object, not an array
    } catch (err) {
        console.error("Error fetching data:", err);
        res.status(500).json({ error: "Database error" });
    }
};


const totalResident = async (req, res) => {
    try {
        const sql = "SELECT COUNT(*) as totalResident FROM first_information WHERE resident_status = 'Resident'";
        const [results] = await db.query(sql);
        res.json(results[0]); // Send only the object, not the array
    } catch (err) {
        console.error("Error fetching data:", err);
        res.status(500).json({ error: "Database error" });
    }
};

const totalReunion = async (req, res) => {
    try {
        const sql = "SELECT COUNT(*) as totalReunion FROM first_information WHERE resident_status = 'Reunion' ";
        const [results] = await db.query(sql);
        res.json(results[0]); // Send only the object, not the array
    } catch (err) {
        console.error("Error fetching data:", err);
        res.status(500).json({ error: "Database error" });
    }
}

const getMonthlyResidentConditions = async (req, res) => {
    try {
        const sql = "SELECT month, COUNT(*) AS value FROM nurse_record GROUP BY month ORDER BY month;";
        const [results] = await db.query(sql);
        res.json(results); // Send only the object, not the array
    } catch (err) {
        console.error("Error fetching data:", err);
        res.status(500).json({ error: "Database error" });
    }
};

const getMonthlyObserReport = async (req, res) => {
    try {
        const sql = `
    SELECT 
        MONTHNAME(date) AS month,
        COUNT(*) AS value
        FROM 
        observation_report
        WHERE 
        date IS NOT NULL
        GROUP BY 
        MONTH(date)
        ORDER BY 
        MONTH(date);
  `;

        const [results] = await db.query(sql);
        res.json(results[0]);
    } catch (err) {
        console.error("Error fetching data:", err);
        res.status(500).json({ error: "Database error" });
    }

};

export {
    getRecentRescue,
    totalRescue,
    totalResident,
    totalReunion,
    getMonthlyResidentConditions,
    getMonthlyObserReport
};