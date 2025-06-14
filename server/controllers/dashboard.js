const db = require('../db');
const path = require('path');

const getRecentRescue = (req, res) => {
    const sql = "SELECT rescue_name, admission_no, referred_by, admission_date FROM first_information ORDER BY created_at DESC LIMIT 2";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching data:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
}

const totalRescue = (req, res) => {
    const sql = "SELECT COUNT(*) as totalRescue FROM first_information";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching data:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
}

const totalResident = (req, res) => {
    const sql = "SELECT COUNT(*) as totalResident FROM first_information WHERE resident_status = 'Resident' ";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching data:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
}

const totalReunion = (req, res) => {
    const sql = "SELECT COUNT(*) as totalReunion FROM first_information WHERE resident_status = 'Reunion' ";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching data:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
}

const getMonthlyResidentConditions = (req, res) => {
    const sql = "SELECT month, COUNT(*) AS value FROM nurse_record GROUP BY month ORDER BY month;";

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error fetching nurse record data:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
};

const getMonthlyObserReport = (req, res) => {
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

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching observation data:", err);
      return res.status(500).json({ error: "Database error" });
    }
    console.log("Results:", results);
    res.json(results);
  });
};

module.exports = {
    getRecentRescue,
    totalRescue,
    totalResident,
    totalReunion,
    getMonthlyResidentConditions,
    getMonthlyObserReport
};