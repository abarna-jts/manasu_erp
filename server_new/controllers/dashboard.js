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

const getMonthlyAdmissionsByYear = async (req, res) => {
  const { year } = req.params;

  const sql = `
    SELECT 
      MONTHNAME(admission_date) AS month,
      MONTH(admission_date) AS month_number,
      COUNT(*) AS value
    FROM 
      first_information
    WHERE 
      YEAR(admission_date) = ?
    GROUP BY 
      MONTH(admission_date), MONTHNAME(admission_date)
    ORDER BY 
      MONTH(admission_date)
  `;

  try {
    const [rows] = await db.query(sql, [year]);
    res.status(200).json({ success: true, data: rows });
  } catch (err) {
    console.error("Error fetching admissions:", err);
    res.status(500).json({ success: false, message: "Server Error", error: err });
  }
};


export {
    getRecentRescue,
    totalRescue,
    totalResident,
    totalReunion,
    getMonthlyResidentConditions,
    getMonthlyAdmissionsByYear
};