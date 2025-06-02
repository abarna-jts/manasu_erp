const db = require('../db');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, path.resolve("uploads/Resident_DocumentFile/"));
//     },
//     filename: function (req, file, cb) {
//         cb(null, Date.now() + "-" + file.originalname);
//     },
// });

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === 'bank_passbook') {
            cb(null, path.resolve('uploads/Rescue_Images/'));
        } else {
            cb(null, path.resolve('uploads/Event_Photos/'));
        }
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

// const upload = multer({ storage: storage }).single("bank_passbook");

const upload = multer({ storage: storage }).fields([
    { name: 'bank_passbook', maxCount: 1 },
    { name: 'event_photos', maxCount: 1 },
    { name: 'awarness_photos', maxCount: 1 },
    { name: 'outing_photos', maxCount: 1 }
]);


const createSelfDeclaration = (req, res) => {
    const {
        admission_no,
        rescue_name,
        age,
        medicine_provided,
        toiletries_provided,
        dress_provided,
        travel_expenses
    } = req.body;


    const q = "INSERT INTO formality_declaration (admission_no,rescue_name,age,medicine_provided,toiletries_provided,dress_provided,travel_expenses) VALUES (?, ?, ?, ?, ?, ?, ?)";

    const values = [
        admission_no,
        rescue_name,
        age,
        medicine_provided,
        toiletries_provided,
        dress_provided,
        travel_expenses
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
        dress_provided,
        travel_expenses
    } = req.body;

    const admission_no = req.params.admission_no;

    const updateQuery = `UPDATE formality_declaration SET
                            rescue_name = ?,
                            age = ?,
                            medicine_provided = ?,
                            toiletries_provided = ?,
                            dress_provided = ?,
                            travel_expenses = ?
                        WHERE admission_no = ?`;

    const values = [
        rescue_name,
        age,
        medicine_provided,
        toiletries_provided,
        dress_provided,
        travel_expenses,
        admission_no
    ];

    db.query(updateQuery, values, (updateErr, result) => {
        if (updateErr) {
            return res.status(500).json({ message: "Update failed", error: updateErr });
        }

        return res.status(200).json({ message: "Self Declaration updated successfully!" });
    });
}

const deleteFormalityForm = (req, res) => {
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
    upload(req, res, (err) => {
        const {
            admission_no,
            rescue_name,
            aadhar_card,
            udid_no,
            disability_no,
            voter_id,
            form_7,
            bank_name,
            account_no,
            ifsc_code,
            insurance_provider,
            policy_no,
            validity_period,
            other_gvt_scheme,
            any_other
        } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: "Bank passbook upload required" });
        }

        const bank_passbookPath = req.file
            ? `uploads/Resident_DocumentFile/${req.file.filename}`
            : null;

        const q = `INSERT INTO essential_records 
        (admission_no, rescue_name, aadhar_card, udid_no, disability_no,voter_id, form_7,
         bank_name, account_no, ifsc_code, bank_passbook,
         insurance_provider, policy_no, validity_period, other_gvt_scheme, any_other)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const values = [
            admission_no,
            rescue_name,
            aadhar_card,
            udid_no,
            disability_no,
            voter_id,
            form_7,
            bank_name,
            account_no,
            ifsc_code,
            bank_passbookPath,
            insurance_provider,
            policy_no,
            validity_period,
            other_gvt_scheme,
            any_other
        ];

        db.query(q, values, (dbErr, data) => {
            if (dbErr) {
                return res.status(500).json({ message: "Database Error", error: dbErr });
            }
            res.status(201).json({ message: "Essential Records Form Created Successfully", data: data });
        });
    });
};


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
    upload(req, res, (err) => {
        if (err) {
            return res.status(500).json({ message: "File upload failed", error: err });
        }

        const {
            rescue_name,
            aadhar_card,
            udid_no,
            disability_no,
            bank_name,
            account_no,
            ifsc_code,
            insurance_provider,
            policy_no,
            validity_period,
            other_gvt_scheme
        } = req.body;

        const admission_no = req.params.admission_no;
        const newBankPassbook = req.file ? `uploads/Resident_DocumentFile/${req.file.filename}` : null;

        // Fetch the existing logo path
        const selectQuery = "SELECT bank_passbook FROM essential_records WHERE admission_no = ?";
        db.query(selectQuery, [admission_no], (selectErr, selectData) => {
            if (selectErr) {
                return res.status(500).json({ message: "Failed to retrieve Bank passbook", error: selectErr });
            }

            const existingBankPassbook = selectData[0]?.bank_passbook;
            const finalBankPassbook = newBankPassbook || existingBankPassbook;

            // Update the catalogue
            const updateQuery = `
          UPDATE essential_records SET 
            rescue_name = ?, 
            aadhar_card = ?, 
            udid_no = ?, 
            disability_no = ?, 
            bank_name = ?, 
            account_no = ?, 
            ifsc_code = ?,
            bank_passbook = ?,
            insurance_provider = ?,
            policy_no = ?,
            validity_period = ?,
            other_gvt_scheme = ?
          WHERE admission_no = ?`;

            const values = [
                rescue_name,
                aadhar_card,
                udid_no,
                disability_no,
                bank_name,
                account_no,
                ifsc_code,
                finalBankPassbook,
                insurance_provider,
                policy_no,
                validity_period,
                other_gvt_scheme,
                admission_no
            ];


            db.query(updateQuery, values, (updateErr, data) => {
                if (updateErr) {
                    return res.status(500).json({ message: "Update failed", error: updateErr });
                }

                if (newBankPassbook && existingBankPassbook) {
                    fs.unlink(existingBankPassbook, (fsErr) => {
                        if (fsErr) console.warn("Failed to delete Bank Passbook:", fsErr);
                    });
                }

                res.status(200).json({ message: "Essential Record updated successfully" });
            });

        });
    });
};


const deleteEssentialRecord = (req, res) => {
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

const createEventReport = (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(500).json({ message: 'File upload failed', error: err });
        }
    const {
        event_name,
        event_date,
        event_place,
        event_report,
        event_rescue_count,
        event_type,
        awareness_name,
        awarness_date,
        awarness_place,
        awarness_report,
        awarness_rescue_count,
        outing_name,
        outing_date,
        outing_place,
        outing_report,
        outing_rescue_count,
    } = req.body;

        const event_photosPath = req.files['event_photos']
            ? `/uploads/Event_Photos/${req.files['event_photos'][0].filename}`
            : null;

        const awarness_photosPath = req.files['awarness_photos']
            ? `/uploads/Event_Photos/${req.files['awarness_photos'][0].filename}`
            : null;
        const outing_photosPath = req.files['outing_photos']
            ? `/uploads/Event_Photos/${req.files['outing_photos'][0].filename}`
            : null;

    const q = `INSERT INTO event_report(event_name, event_date, event_place, event_report, event_rescue_count, event_type, event_photos,
                awareness_name,awarness_date, awarness_place, awarness_report, awarness_rescue_count,awarness_photos,
                outing_name, outing_date, outing_place, outing_report, outing_rescue_count, outing_photos) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
                
    const values = [
        event_name || 'Null', event_date || 'Null', event_place || 'Null', event_report || 'Null', event_rescue_count || 'Null', event_type, event_photosPath || 'Null',
        awareness_name || 'Null', awarness_date || 'Null', awarness_place || 'Null', awarness_report || 'Null', awarness_rescue_count || 'Null',awarness_photosPath || 'Null',
        outing_name || 'Null', outing_date || 'Null', outing_place || 'Null', outing_report || 'Null', outing_rescue_count || 'Null', outing_photosPath || 'Null'
    ]

    db.query(q, values, (dbErr, data) => {
        if (dbErr) {
            return res.status(500).json({ message: "Database Error", error: dbErr });
        }
        res.status(201).json({ message: "Event Report Form Created Successfully", data: data });
    });
});
}

const createCelebrationReport = (req, res) => {
    const {
        celebration_name,
        celebration_date,
        celebration_place,
        celebration_rescue_count,
        celebration_report,
    } = req.body;

    const q = `INSERT INTO celebration_report(celebration_name, celebration_date, celebration_place, celebration_rescue_count, celebration_report) 
                VALUES (?,?,?,?,?)`;

    const values = [
        celebration_name,
        celebration_date,
        celebration_place,
        celebration_rescue_count,
        celebration_report,
    ]

    db.query(q, values, (dbErr, data) => {
        if (dbErr) {
            return res.status(500).json({ message: "Database Error", error: dbErr });
        }
        res.status(201).json({ message: "Celebration Report Form Created Successfully", data: data });
    });
}

const createCommunityReport = (req, res) => {
    const {
        program_name,
        program_date,
        program_place,
        program_rescue_count,
        program_report,
    } = req.body;

    const q = `INSERT INTO community_report(community_name, community_date, community_place, community_rescue_count, community_report)
                VALUES (?,?,?,?,?)`;
    const values = [
        program_name,
        program_date,
        program_place,
        program_rescue_count,
        program_report,
    ]
    db.query(q, values, (dbErr, data) => {
        if (dbErr) {
            return res.status(500).json({ message: "Database Error", error: dbErr });
        }
        res.status(201).json({ message: "Community Report Form Created Successfully", data: data });
    });
}

const createStaffReport = (req, res) => {
    const {
        staff_name,
        staff_date,
        staff_place,
        staff_rescue_count,
        staff_report,
    } = req.body;

    const q = `INSERT INTO staff_report(staff_name, staff_date, staff_place, staff_rescue_count, staff_report)
                VALUES (?,?,?,?,?)`;
    const values = [
        staff_name,
        staff_date,
        staff_place,
        staff_rescue_count,
        staff_report,
    ]
    db.query(q, values, (dbErr, data) => {
        if (dbErr) {
            return res.status(500).json({ message: "Database Error", error: dbErr });
        }
        res.status(201).json({ message: "Staff Report Form Created Successfully", data: data });
    });

}

const createAnnualReport = (req, res) => {
    

        const {
            event_type,
            event_name,
            awareness_name,
            outing_name,
            awarness_date,
            awarness_place,
            awarness_rescue_count,
            outing_date,
            outing_place,
            outing_rescue_count,
            event_date,
            event_place,
            event_rescue_count,
            event_report,
            awarness_report,
            outing_report,
            celebration_name,
            celebration_date,
            celebration_place,
            celebration_rescue_count,
            celebration_report,
            program_name,
            program_date,
            program_place,
            program_rescue_count,
            program_report,
            staff_name,
            staff_date,
            staff_place,
            staff_rescue_count,
            staff_report

        } = req.body;

        



        const q = `INSERT INTO annual_report(
               event_type,
               event_name,
               event_date,
               event_place,
               event_rescue_count,
               event_report,
               awareness_name,
               awarness_date,
               awarness_place,
               awarness_rescue_count,
               awarness_report,
               outing_name,
               outing_date,
               outing_place,
               outing_rescue_count,
               outing_report,
               celebration_name,
               celebration_date,
               celebration_place,
               celebration_rescue_count,
               celebration_report,
               program_name,
               program_date,
               program_place,
               program_rescue_count,
               program_report,
               staff_name,
               staff_date,
               staff_place,
               staff_rescue_count,
               staff_report
            ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;


        const values = [
            event_type,
            event_name,
            event_date,
            event_place,
            event_rescue_count,
            event_report,
            awareness_name,
            awarness_date,
            awarness_place,
            awarness_rescue_count,
            awarness_report,
            outing_name,
            outing_date,
            outing_place,
            outing_rescue_count,
            outing_report,
            celebration_name,
            celebration_date,
            celebration_place,
            celebration_rescue_count,
            celebration_report,
            program_name,
            program_date,
            program_place,
            program_rescue_count,
            program_report,
            staff_name,
            staff_date,
            staff_place,
            staff_rescue_count,
            staff_report
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

const deleteAnnualReport = (req, res) => {
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
        discharge,
        reunited
    } = req.body;

    const cquery = `INSERT INTO discharge_summary
                    (admission_no,
                    rescue_name,
                    referred_by,
                    escape,death,discharge,reunited)VALUES(?,?,?,?,?,?,?)`;

    const values = [
        admission_no, rescue_name, referred_by, escape, death, discharge,reunited
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
        rescue_name, referred_by, escape, death, discharge,reunited
    } = req.body;

    const rescueID = req.params.id;

    const uquery = `UPDATE discharge_summary SET 
                    rescue_name = ?, 
                    referred_by = ?, 
                    escape = ?, 
                    death = ?, 
                    discharge = ?,
                    reunited = ?
                    WHERE id = ?`;

    const values = [
        rescue_name, referred_by, escape, death, discharge, reunited, rescueID,
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

const deleteDischargeSummary = (req, res) => {
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

const createInternForm = (req, res) => {
    const {
        stud_name,
        stud_id,
        department,
        email,
        phone,
        field,
        clg_name,
        duration,
        from_date,
        to_date,
        choose_intern
    } = req.body;

    const insertQuery = `INSERT INTO internship_form(stud_name, stud_id, department, email, phone, field, clg_name, duration,from_date, to_date, choose_intern)
                        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
        stud_name, stud_id, department, email, phone, field, clg_name, duration, from_date, to_date, choose_intern
    ];

    db.query(insertQuery, values, (dbErr, data) => {
        if (dbErr) {
            return res.status(500).json({ message: "Database Error", error: dbErr });
        }
        res.status(201).json({ message: "Internship Form Created successfully", data: data });
    });
}

const getStudentDetails = (req, res) => {
    const query = "Select * from internship_form";

    db.query(query, (err, data) => {
        if (err) {
            return res.status(500).json({ message: "Database Error", error: err });
        }
        res.status(201).json({ message: "Internship Student Details Get Successfully", data: data });
    });
}

const getStudendDetailsbyID = (req, res) => {
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

const updateStudentDetail = (req, res) => {
    const {
        stud_name, stud_id, department, clg_name, duration, from_date, to_date
    } = req.body;

    const id = req.params.id;

    const usquery = `UPDATE internship_form SET
                    stud_name = ?,
                    stud_id = ?,
                    department = ?,
                    clg_name = ?, 
                    duration = ?, 
                    from_date = ?, 
                    to_date = ?
                    WHERE id= ?`;

    const values = [
        stud_name, stud_id, department, clg_name, duration, from_date, to_date, id
    ];

    db.query(usquery, values, (updateErr, result) => {
        if (updateErr) {
            return res.status(500).json({ message: "Update failed", error: updateErr });
        }

        return res.status(200).json({ message: "Intership Form updated successfully!" });
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
    getStudendDetailsbyID,
    updateStudentDetail,
    createEventReport,
    createCelebrationReport,
    createCommunityReport,
    createStaffReport,

};