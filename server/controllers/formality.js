const db = require('../db');
const path = require('path');

const createSelfDeclaration = (req, res) => {
    const {
        admission_no,
        rescue_name,
        age,
        medicine_provided,
        toiletries_provided,
        dress_provided,
    } = req.body;


    const q = "INSERT INTO formality_declaration (admission_no,rescue_name,age,medicine_provided,toiletries_provided,dress_provided) VALUES (?, ?, ?, ?, ?, ?)";

    const values = [
        admission_no,
        rescue_name,
        age,
        medicine_provided,
        toiletries_provided,
        dress_provided
    ];

    db.query(q, values, (dbErr, data) => {
        if (dbErr) {
            return res.status(500).json({ message: "Database Error", error: dbErr });
        }
        res.status(201).json({ message: "Self Declaration Form Created Successfully", data: data });
    });
}

const getFormalityForm = (req, res) => {
    const admission_no = req.params.admission_no;
    const query = 'SELECT * FROM formality_declaration WHERE admission_no = ?';

    db.query(query, [admission_no], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Self Declaration Form not found' });
        }

        res.json(results[0]);
    });
}

const updateFormalityForm = (req, res) => {
    const {
        rescue_name,
        age,
        medicine_provided,
        toiletries_provided,
        dress_provided
    } = req.body;

    const admission_no = req.params.admission_no;

    const updateQuery = `UPDATE formality_declaration SET
                            rescue_name = ?,
                            age = ?,
                            medicine_provided = ?,
                            toiletries_provided = ?,
                            dress_provided = ?
                        WHERE admission_no = ?`;

    const values = [
        rescue_name,
        age,
        medicine_provided,
        toiletries_provided,
        dress_provided,
        admission_no
    ];

    db.query(updateQuery, values, (updateErr, result) => {
        if (updateErr) {
            return res.status(500).json({ message: "Update failed", error: updateErr });
        }

        return res.status(200).json({ message: "Self Declaration updated successfully!" });
    });
}

const deleteFormalityForm = (req,res) =>{
    const admission_no = req.params.admission_no;

    const deletequery = "DELETE FROM formality_declaration WHERE admission_no = ?";
    const values = [
      admission_no
    ];

    db.query(deletequery, values, (err, data) => {
        if (err) {
          return res.status(500).json({ message: "Database Error", error: err });
        }
        res
          .status(201)
          .json({ message: "Self Declaration Form Deleted Successfully", data: data });
      });
}

const createRecords = (req, res) => {
    const {
        admission_no,
        rescue_name,
        passbook,
        aadhar_card,
        UDI,
    } = req.body;


    const q = "INSERT INTO essential_records (admission_no,rescue_name,passbook,aadhar_card,UDI) VALUES (?, ?, ?, ?, ?)";

    const values = [
        admission_no,
        rescue_name,
        passbook,
        aadhar_card,
        UDI
    ];

    db.query(q, values, (dbErr, data) => {
        if (dbErr) {
            return res.status(500).json({ message: "Database Error", error: dbErr });
        }
        res.status(201).json({ message: "Essential Records Form Created Successfully", data: data });
    });
}

const getEssentialRecords = (req, res) => {
    const admission_no = req.params.admission_no;
    const query = 'SELECT * FROM essential_records WHERE admission_no = ?';

    db.query(query, [admission_no], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Essentail Records Form not found' });
        }

        res.json(results[0]);
    });
}

const updateEssentialRecords = (req, res) => {
    const {
        rescue_name,
        passbook,
        aadhar_card,
        UDI,
    } = req.body;

    const admission_no = req.params.admission_no;

    const updateQuery = `UPDATE essential_records SET
                            rescue_name = ?,
                            passbook = ?,
                            aadhar_card = ?,
                            UDI = ?
                        WHERE admission_no = ?`;

    const values = [
        rescue_name,
        passbook,
        aadhar_card,
        UDI,
        admission_no
    ];

    db.query(updateQuery, values, (updateErr, result) => {
        if (updateErr) {
            return res.status(500).json({ message: "Update failed", error: updateErr });
        }

        return res.status(200).json({ message: "Essential Records updated successfully!" });
    });
}

const deleteEssentialRecord = (req,res) =>{
const admission_no = req.params.admission_no;

    const deletequery = "DELETE FROM essential_records WHERE admission_no = ?";
    const values = [
      admission_no
    ];

    db.query(deletequery, values, (err, data) => {
        if (err) {
          return res.status(500).json({ message: "Database Error", error: err });
        }
        res
          .status(201)
          .json({ message: "Family Request Letter Deleted Successfully", data: data });
      });
}

const createAnnualReport = (req, res) => {
    const {
        event_name,
        event_date,
        event_place,
        event_rescue_count,
        celebration_name,
        celebration_date,
        celebration_place,
        celebration_rescue_count,
        program_name,
        program_date,
        program_place,
        program_rescue_count,
        internship_duration,
        internship_date,
        internship_place,
        internship_rescue_count,
        staff_name,
        staff_date,
        staff_place,
        staff_rescue_count

    } = req.body;


    const q = `INSERT INTO annual_report(
               event_name,
               event_date,
               event_place,
               event_rescue_count,
               celebration_name,
               celebration_date,
               celebration_place,
               celebration_rescue_count,
               program_name,
               program_date,
               program_place,
               program_rescue_count,
               internship_duration,
               internship_date,
               internship_place,
               internship_rescue_count,
               staff_name,
               staff_date,
               staff_place,
               staff_rescue_count
                )VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

    const values = [
        event_name,
        event_date,
        event_place,
        event_rescue_count,
        celebration_name,
        celebration_date,
        celebration_place,
        celebration_rescue_count,
        program_name,
        program_date,
        program_place,
        program_rescue_count,
        internship_duration,
        internship_date,
        internship_place,
        internship_rescue_count,
        staff_name,
        staff_date,
        staff_place,
        staff_rescue_count


    ];

    db.query(q, values, (dbErr, data) => {
        if (dbErr) {
            return res.status(500).json({ message: "Database Error", error: dbErr });
        }
        res.status(201).json({ message: "Annual Report Form Created Successfully", data: data });
    });
}

const getAnnualReport = (req, res) => {
    const query = "Select * from annual_report";

    db.query(query, (err, data) => {
        if (err) {
            return res.status(500).json({ message: "Database Error", error: err });
        }
        res.status(201).json({ message: "Annual Report Get Successfully", data: data });
    });
}

const getAnnualReportbyID = (req, res) => {
    const id = req.params.id;
    const query = 'SELECT * FROM annual_report WHERE id = ?';

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Annual Report not found' });
        }

        res.json(results[0]);
    });
}

const updateAnnualReport = (req, res) => {
    const {
        event_name,
        event_date,
        event_place,
        event_rescue_count,
        celebration_name,
        celebration_date,
        celebration_place,
        celebration_rescue_count,
        program_name,
        program_date,
        program_place,
        program_rescue_count,
        internship_duration,
        internship_date,
        internship_place,
        internship_rescue_count,
        staff_name,
        staff_date,
        staff_place,
        staff_rescue_count

    } = req.body;

    const reportId = req.params.id;

    // Update the catalogue
    const updateQuery = `
            UPDATE annual_report SET 
                event_name = ?, 
                event_date = ?, 
                event_place = ?, 
                event_rescue_count = ?, 
                celebration_name = ?, 
                celebration_date = ?, 
                celebration_place = ?, 
                celebration_rescue_count = ?,
                program_name = ?,
                program_date = ?,
                program_place = ?,
                program_rescue_count = ?,
                internship_duration = ?,
                internship_date = ?,
                internship_place = ?,
                internship_rescue_count = ?,
                staff_name = ?,
                staff_date = ?,
                staff_place = ?,
                staff_rescue_count = ?
            WHERE id = ?
            `;


    const values = [
        event_name,
        event_date,
        event_place,
        event_rescue_count,
        celebration_name,
        celebration_date,
        celebration_place,
        celebration_rescue_count,
        program_name,
        program_date,
        program_place,
        program_rescue_count,
        internship_duration,
        internship_date,
        internship_place,
        internship_rescue_count,
        staff_name,
        staff_date,
        staff_place,
        staff_rescue_count,
        reportId
    ];

    db.query(updateQuery, values, (updateErr, result) => {
        if (updateErr) {
            return res.status(500).json({ message: "Update failed", error: updateErr });
        }

        if (result.affectedRows === 0) {
            return res.status(400).json({ message: "No record updated. Check if ID exists." });
        }

        return res.status(200).json({ message: "Annual Report updated successfully!" });
    });
}

const deleteAnnualReport = (req,res) =>{
    const rescueId = req.params.id;

    const deletequery = "DELETE FROM annual_report WHERE id = ?";
    const values = [
      rescueId
    ];

    db.query(deletequery, values, (err, data) => {
        if (err) {
          return res.status(500).json({ message: "Database Error", error: err });
        }
        res
          .status(201)
          .json({ message: "Annual Report Deleted Successfully", data: data });
      });
}

const getRescueDetails = (req, res) => {
    const admissionNo = req.params.admission_no;

    const query = `SELECT rescue_name, referred_by FROM first_information WHERE admission_no = ?`;

    db.query(query, [admissionNo], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database error' });

        if (results.length === 0) return res.status(404).json({ message: 'No data found' });

        res.status(200).json(results[0]);
    });
}

const createRescueDischargeInfo = (req, res) => {
    const {
        admission_no,
        rescue_name,
        referred_by,
        escape,
        death,
        discharge
    } = req.body;

    const cquery = `INSERT INTO discharge_summary
                    (admission_no,
                    rescue_name,
                    referred_by,
                    escape,death,discharge)VALUES(?,?,?,?,?,?)`;

    const values = [
        admission_no, rescue_name, referred_by, escape, death, discharge
    ];

    db.query(cquery, values, (dbErr, data) => {
        if (dbErr) {
            return res.status(500).json({ message: "Database Error", error: dbErr });
        }
        res.status(201).json({ message: "Rescue Discharge Summary Created Successfully", data: data });
    });
}

const getDischargeSummary = (req, res) => {
    const query = "Select * from discharge_summary";

    db.query(query, (err, data) => {
        if (err) {
            return res.status(500).json({ message: "Database Error", error: err });
        }
        res.status(201).json({ message: "Resque Discharge Summary Get Successfully", data: data });
    });
}

const getDischargeSummaryID = (req, res) => {
    const rescueID = req.params.id;
    const query = 'SELECT * FROM discharge_summary WHERE id = ?';

    db.query(query, [rescueID], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Resque Discharge Summary Form not found' });
        }

        res.json(results[0]);
    });
}

const updateDischargeSummary = (req, res) => {
    const {
        rescue_name, referred_by, escape, death, discharge
    } = req.body;

    const rescueID = req.params.id;

    const uquery = `UPDATE discharge_summary SET 
                    rescue_name = ?, 
                    referred_by = ?, 
                    escape = ?, 
                    death = ?, 
                    discharge = ?
                    WHERE id = ?`;
                    
    const values = [
        rescue_name, referred_by, escape, death, discharge, rescueID
    ];

    db.query(uquery, values, (updateErr, result) => {
        if (updateErr) {
            return res.status(500).json({ message: "Update failed", error: updateErr });
        }

        if (result.affectedRows === 0) {
            return res.status(400).json({ message: "No record updated. Check if ID exists." });
        }

        return res.status(200).json({ message: "Rescue Discharge Summary updated successfully!" });
    });
};

const deleteDischargeSummary = (req,res) =>{
    const rescueId = req.params.id;

    const deletequery = "DELETE FROM discharge_summary WHERE id = ?";
    const values = [
      rescueId
    ];

    db.query(deletequery, values, (err, data) => {
        if (err) {
          return res.status(500).json({ message: "Database Error", error: err });
        }
        res
          .status(201)
          .json({ message: "Discharge Summary Deleted Successfully", data: data });
      });
}

const createInternForm = (req,res) =>{
    const{
        stud_name,
        stud_id,
        department,
        clg_name,
        duration,
        from_date,
        to_date
    }=req.body;

    const insertQuery = `INSERT INTO internship_form(stud_name, stud_id, department, clg_name, duration,from_date, to_date)
                        VALUES(?, ?, ?, ?, ?, ?, ?)`;

    const values = [
        stud_name,stud_id,department,clg_name,duration,from_date,to_date
    ];

    db.query(insertQuery, values, (dbErr, data) => {
        if (dbErr) {
            return res.status(500).json({ message: "Database Error", error: dbErr });
        }
        res.status(201).json({ message: "Internship Form Created successfully", data: data });
    });
}

const getStudentDetails = (req,res) =>{
    const query="Select * from internship_form";

    db.query(query, (err, data) => {
        if(err){
            return res.status(500).json({message:"Database Error", error:err});
        }
        res.status(201).json({message:"Internship Student Details Get Successfully", data:data});
    });
}

const getStudendDetailsbyID = (req,res) =>{
const id = req.params.id;
    const query = "SELECT * FROM internship_form WHERE id = ?";
  
    db.query(query, [id], (err, data) => {
      if (err) {
        return res.status(500).json({ message: "Database Error", error: err });
      }
      if (data.length === 0) {
        return res.status(404).json({ message: "No data found for the given admission number" });
      }
      res.status(200).json({ message: "Student Details form fetched successfully", data: data });
    });
}


module.exports = {
    createSelfDeclaration,
    getFormalityForm,
    updateFormalityForm,
    deleteFormalityForm,
    createRecords,
    getEssentialRecords,
    updateEssentialRecords,
    deleteEssentialRecord,
    createAnnualReport,
    getAnnualReport,
    getAnnualReportbyID,
    updateAnnualReport,
    deleteAnnualReport,
    getRescueDetails,
    createRescueDischargeInfo,
    getDischargeSummary,
    getDischargeSummaryID,
    updateDischargeSummary,
    deleteDischargeSummary,
    createInternForm,
    getStudentDetails,
    getStudendDetailsbyID
};