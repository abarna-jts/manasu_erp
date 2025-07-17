import db from "../db.js";
import { formalityAsync } from "../util/formalityMulter.js";

const createSelfDeclaration = async (req, res) => {
    const {
        admission_no,
        rescue_name,
        age,
        medicine_provided,
        toiletries_provided,
        dress_provided,
        travel_expenses,
        welfare_expenses,
        medical_prescription,
        discharge_summary,
        travel_letter
    } = req.body;


    const q = "INSERT INTO formality_declaration (admission_no,rescue_name,age,medicine_provided,toiletries_provided,dress_provided,travel_expenses, welfare_expenses, medical_prescription, discharge_summary, travel_letter) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    const values = [
        admission_no,
        rescue_name,
        age,
        medicine_provided,
        toiletries_provided,
        dress_provided,
        travel_expenses,
        welfare_expenses,
        medical_prescription,
        discharge_summary,
        travel_letter
    ];

    try {
        const [data] = await db.query(q, values);
        res.status(201).json({
            message: "Document Handover Form submitted successfully",
            data: data
        });
    } catch (err) {
        console.error("Error inserting into formality Declaration:", err);
        res.status(500).json({
            message: "Database Error",
            error: err.message
        });
    }
}

const getFormalityForm = async (req, res) => {
    const admission_no = req.params.admission_no;
    const query = 'SELECT * FROM formality_declaration WHERE admission_no = ?';

    try {
        const [results] = await db.query(query, [admission_no]);

        if (results.length === 0) {
            return res.status(404).json({ message: 'Self Declaration Form not found' });
        }

        return res.status(200).json(results[0]);
    } catch (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Database error', error: err });
    }
}

const updateFormalityForm = async (req, res) => {
    try {
        const {
            rescue_name,
            age,
            medicine_provided,
            toiletries_provided,
            dress_provided,
            travel_expenses,
            welfare_expenses,
            medical_prescription,
            discharge_summary,
            travel_letter
        } = req.body;

        const admission_no = req.params.admission_no;

        const updateQuery = `UPDATE formality_declaration SET
                            rescue_name = ?,
                            age = ?,
                            medicine_provided = ?,
                            toiletries_provided = ?,
                            dress_provided = ?,
                            travel_expenses = ?,
                            welfare_expenses = ?,
                            medical_prescription = ?,
                            discharge_summary = ?,
                            travel_letter = ?
                        WHERE admission_no = ?`;

        const values = [
            rescue_name,
            age,
            medicine_provided,
            toiletries_provided,
            dress_provided,
            travel_expenses,
            welfare_expenses,
            medical_prescription,
            discharge_summary,
            travel_letter,
            admission_no
        ];

        const [result] = await db.query(updateQuery, values);
        if (result.affectedRows === 0) {
            return res.status(400).json({ message: "No record updated. Check if admission_no exists." });
        }

        return res.status(200).json({ message: "Self Declaration updated successfully!" });

    } catch (error) {
        console.error("Update Error:", error);
        return res.status(500).json({ message: "Update failed", error });
    }

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

const createRecords = async (req, res) => {
    try {
        // Handle file upload
        await formalityAsync(req, res);

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

        // File paths if available
        const bank_passbookPath = req.files?.['bank_passbook']
            ? req.files['bank_passbook'].map(file => `uploads/Rescue_Images/${file.filename}`)
            : [];


        const Form7Path = req.files?.['form7_attach']
            ? req.files['form7_attach'].map(file => `uploads/Rescue_Images/${file.filename}`)
            : [];

        const q = `
            INSERT INTO essential_records (
                admission_no, rescue_name, aadhar_card, udid_no, disability_no, voter_id,
                form_7, form7_attach, bank_name, account_no, ifsc_code, bank_passbook,
                insurance_provider, policy_no, validity_period, other_gvt_scheme, any_other
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            admission_no,
            rescue_name,
            aadhar_card,
            udid_no,
            disability_no,
            voter_id,
            form_7,
            JSON.stringify(Form7Path),
            bank_name,
            account_no,
            ifsc_code,
            JSON.stringify(bank_passbookPath),
            insurance_provider,
            policy_no,
            validity_period,
            other_gvt_scheme,
            any_other
        ];

        const [result] = await db.query(q, values);

        res.status(201).json({
            message: "Essential Records Form Created Successfully",
            data: result
        });

    } catch (err) {
        console.error("Error creating Essential Records:", err);
        res.status(500).json({
            message: "Server Error while creating essential records",
            error: err
        });
    }
};


const getEssentialRecords = async (req, res) => {
    const admission_no = req.params.admission_no;
    const query = 'SELECT * FROM essential_records WHERE admission_no = ?';

    try {
        const [results] = await db.query(query, [admission_no]);

        if (results.length === 0) {
            return res.status(404).json({ message: 'Essential Records Form not found' });
        }

        return res.status(200).json(results[0]);
    }
    catch (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Database error', error: err });
    }
}


const updateEssentialRecords = async (req, res) => {
    try {
        await formalityAsync(req, res);
        const {
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
            other_gvt_scheme
        } = req.body;

        const admission_no = req.params.admission_no;
        // const newBankPassbook = req.file ? `uploads/Resident_DocumentFile/${req.file.filename}` : null;
        // const newForm7Attach = req.file ? `uploads/Resident_DocumentFile/${req.file.filename}` : null;
        const newBankPassbook = req.files['bank_passbook']
            ? req.files['form7_attach'].map((f) => `uploads/Rescue_Images/${f.filename}`)
            : null;

        const newForm7Attach = req.files['form7_attach']
            ? req.files['bank_passbook'].map((f) => `uploads/Rescue_Images/${f.filename}`)
            : null;

        // Get existing file paths
        const [selectRows] = await db.query(
            "SELECT bank_passbook, form7_attach FROM essential_records WHERE admission_no = ?",
            [admission_no]
        );

        if (selectRows.length === 0) {
            return res.status(404).json({ message: `No record found for admission_no = ${admission_no}` });
        }

        const existingBankPassbook = selectRows[0]?.bank_passbook;

        const existingForm7Attach = selectRows[0]?.form7_attach;
        const finalForm7Attach = newForm7Attach
            ? JSON.stringify(newForm7Attach)
            : existingForm7Attach;

        const finalBankPassbook = newBankPassbook
            ? JSON.stringify(newBankPassbook)
            : existingBankPassbook;

        const updateQuery = `
          UPDATE essential_records SET 
            rescue_name = ?, 
            aadhar_card = ?, 
            udid_no = ?, 
            disability_no = ?,
            voter_id = ?,
            form_7 = ?,
            form7_attach = ?,
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
            voter_id,
            form_7,
            finalForm7Attach,
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

        const [updateResult] = await db.query(updateQuery, values);

        if (updateResult.affectedRows === 0) {
            return res.status(400).json({ message: `Update failed. No record updated for admission_no = ${admission_no}` });
        }

        // Delete old files if new ones were uploaded
        if (newBankPassbook && existingBankPassbook && existingBankPassbook !== newBankPassbook) {
            try {
                await fs.unlink(existingBankPassbook);
            } catch (fsErr) {
                console.warn("Failed to delete old bank passbook:", fsErr.message);
            }
        }

        if (newForm7Attach && existingForm7Attach && existingForm7Attach !== newForm7Attach) {
            try {
                await fs.unlink(existingForm7Attach);
            } catch (fsErr) {
                console.warn("Failed to delete old form 7 attachment:", fsErr.message);
            }
        }

        res.status(200).json({ message: "Essential Record updated successfully" });

    } catch (err) {
        console.error("Update failed:", err);
        res.status(500).json({ message: "Server Error", error: err.message });
    }
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

const createEventReport = async (req, res) => {
    try {
        // Await the file upload
        await formalityAsync(req, res);

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

        const formatDate = (isoDate) => {
            const d = new Date(isoDate);
            if (isNaN(d)) return null;
            const year = d.getFullYear();
            const month = (`0${d.getMonth() + 1}`).slice(-2);
            const day = (`0${d.getDate()}`).slice(-2);
            return `${year}-${month}-${day}`;
        };

        const event_photosPath = req.files?.['event_photos']
            ? `/uploads/Event_Photos/${req.files['event_photos'][0].filename}`
            : null;

        const awarness_photosPath = req.files?.['awarness_photos']
            ? `/uploads/Event_Photos/${req.files['awarness_photos'][0].filename}`
            : null;

        const outing_photosPath = req.files?.['outing_photos']
            ? `/uploads/Event_Photos/${req.files['outing_photos'][0].filename}`
            : null;

        const q = `
            INSERT INTO event_report (
                event_name, event_date, event_place, event_report, event_rescue_count, event_type, event_photos,
                awareness_name, awarness_date, awarness_place, awarness_report, awarness_rescue_count, awarness_photos,
                outing_name, outing_date, outing_place, outing_report, outing_rescue_count, outing_photos
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            event_name || null,
            formatDate(event_date) || null,
            event_place || null,
            event_report || null,
            event_rescue_count || null,
            event_type,
            event_photosPath || null,

            awareness_name || null,
            formatDate(awarness_date) || null,
            awarness_place || null,
            awarness_report || null,
            awarness_rescue_count || null,
            awarness_photosPath || null,

            outing_name || null,
            formatDate(outing_date) || null,
            outing_place || null,
            outing_report || null,
            outing_rescue_count || null,
            outing_photosPath || null
        ];

        const [result] = await db.query(q, values);

        res.status(201).json({
            message: "Event Report Form Created Successfully",
            data: result
        });

    } catch (err) {
        console.error("Error creating event report:", err);
        res.status(500).json({
            message: "Server Error while creating event report",
            error: err
        });
    }
};

const createCelebrationReport = async (req, res) => {
    try {
        const {
            celebration_name,
            celebration_date,
            celebration_place,
            celebration_rescue_count,
            celebration_report,
            other_celebration
        } = req.body;

        const q = `INSERT INTO celebration_report(celebration_name, other_celebration, celebration_date, celebration_place, celebration_rescue_count, celebration_report) 
                VALUES (?,?,?,?,?,?)`;

        const values = [
            celebration_name,
            other_celebration,
            celebration_date,
            celebration_place,
            celebration_rescue_count,
            celebration_report,
        ]

        const [result] = await db.query(q, values);
        res.status(201).json({
            message: "Celebration Report Form Created Successfully",
            data: result
        });

    } catch (err) {
        console.error("Error creating celebration report:", err);
        return res.status(500).json({
            message: "Server Error while creating celebration report",
            error: err
        });
    }
}

const createCommunityReport = async (req, res) => {
    try {
        const {
            program_name,
            clg_name,
            clg_dept,
            resource_person,
            program_date,
            program_place,
            program_rescue_count,
            program_report,
        } = req.body;

        const q = `INSERT INTO community_report(community_name, clg_name, clg_dept, resource_person, community_date, community_place, community_rescue_count, community_report)
                VALUES (?,?,?,?,?,?,?,?)`;
        const values = [
            program_name,
            clg_name,
            clg_dept,
            resource_person,
            program_date,
            program_place,
            program_rescue_count,
            program_report,
        ]

        const [result] = await db.query(q, values);
        res.status(201).json({
            message: "Community Report Form Created Successfully",
            data: result
        });
    }
    catch (err) {
        console.error("Error creating community report:", err);
        return res.status(500).json({
            message: "Server Error while creating community report",
            error: err
        });
    }
}


const createStaffReport = async (req, res) => {
    try {
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

        const [result] = await db.query(q, values);
        res.status(201).json({
            message: "Staff Report Form Created Successfully",
            data: result
        });
    } catch (err) {
        console.error("Error creating staff report:", err);
        return res.status(500).json({
            message: "Server Error while creating staff report",
            error: err
        });
    }
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

const getAnnualReport = async (req, res) => {

    const query = "SELECT * FROM event_report";
    try {
        const [data] = await db.query(query);
        return res.status(200).json({ message: "Event Report Get Successfully", data: data });
    } catch (err) {
        console.error("❌ Database Error:", err);
        return res.status(500).json({ message: "Database Error", error: err });
    }
};



const getAnnualReportbyID = async (req, res) => {
    const id = req.params.id;
    const query = 'SELECT * FROM annual_report WHERE id = ?';

    try {
        const [results] = await db.query(query, [id]);

        if (results.length === 0) {
            return res.status(404).json({ message: 'Annual Report not found' });
        }

        return res.status(200).json(results[0]);
    } catch (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Database error', error: err });
    }
};


const updateAnnualReport = async (req, res) => {
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

    try {
        const [result] = await db.query(updateQuery, values);

        if (result.affectedRows === 0) {
            return res.status(400).json({ message: "No record updated. Check if ID exists." });
        }

        return res.status(200).json({ message: "Annual Report updated successfully!" });
    } catch (error) {
        console.error("Update Error:", error);
        return res.status(500).json({ message: "Update failed", error });
    }
};


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

const getRescueDetails = async (req, res) => {
    const admissionNo = req.params.admission_no;

    const query = `SELECT rescue_name, referred_by FROM first_information WHERE admission_no = ?`;

    try {
        const [results] = await db.query(query, [admissionNo]);

        if (results.length === 0) {
            return res.status(404).json({ message: 'No data found' });
        }

        return res.status(200).json(results[0]);
    } catch (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: 'Database error', details: err });
    }
};


const createRescueDischargeInfo = async (req, res) => {
    const {
        admission_no,
        rescue_name,
        referred_by,
        escape,
        death,
        discharge,
        reunited,
        transfer,
        state_venue,
        state
    } = req.body;

    const cquery = `
        INSERT INTO discharge_summary (
            admission_no,
            rescue_name,
            referred_by,
            escape,
            death,
            discharge,
            reunited,
            transfer,
            state_venue,
            state
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        admission_no,
        rescue_name,
        referred_by,
        escape,
        death,
        discharge,
        reunited,
        transfer,
        state_venue || "NULL",
        state || "NULL"
    ];

    try {
        const [result] = await db.query(cquery, values);

        return res.status(201).json({
            message: "Rescue Discharge Summary Created Successfully",
            data: result
        });
    } catch (error) {
        console.error("Database Error:", error);
        return res.status(500).json({
            message: "Database Error",
            error: error
        });
    }
};


const getDischargeSummary = async (req, res) => {
    const query = "Select * from discharge_summary";
    try {
        const [data] = await db.query(query);
        return res.status(200).json({ message: "Rescue Discharge Summary Get Successfully", data: data });
    } catch (err) {
        console.error("Database Error:", err);
        return res.status(500).json({ message: "Database Error", error: err });
    }
}


const getDischargeSummaryID = async (req, res) => {
    const rescueID = req.params.id;
    const query = 'SELECT * FROM discharge_summary WHERE id = ?';

    try {
        const [results] = await db.query(query, [rescueID]);

        if (results.length === 0) {
            return res.status(404).json({ message: 'Rescue Discharge Summary Form not found' });
        }

        return res.status(200).json(results[0]);
    } catch (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Database error', error: err });
    }
}

const updateDischargeSummary = async (req, res) => {
    const {
        rescue_name,
        referred_by,
        escape,
        death,
        discharge,
        reunited,
        transfer,
        state_venue,
        state
    } = req.body;

    const rescueID = req.params.id;

    const uquery = `
        UPDATE discharge_summary SET 
            rescue_name = ?, 
            referred_by = ?, 
            escape = ?, 
            death = ?, 
            discharge = ?,
            reunited = ?,
            transfer = ?,
            state_venue = ?,
            state = ?
        WHERE id = ?
    `;

    const values = [
        rescue_name,
        referred_by,
        escape,
        death,
        discharge,
        reunited,
        transfer,
        state_venue,
        state,
        rescueID
    ];

    try {
        const [result] = await db.query(uquery, values);

        if (result.affectedRows === 0) {
            return res.status(400).json({ message: "No record updated. Check if ID exists." });
        }

        return res.status(200).json({ message: "Rescue Discharge Summary updated successfully!" });
    } catch (error) {
        console.error("Update Error:", error);
        return res.status(500).json({ message: "Update failed", error });
    }
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

const createInternForm = async (req, res) => {
    try {
        await formalityAsync(req, res);
        const {
            stud_name,
            stud_id,
            department,
            email,
            phone,
            secondary_phone,
            field,
            other_field,
            clg_name,
            duration,
            from_date,
            to_date,
            supervisor_name,
            supervisor_email,
            supervisor_phone,
            choose_intern
        } = req.body;

        const studentPhotoPath = req.files['stud_photo']
            ? `uploads/Internship_photos/${req.files['stud_photo'][0].filename}`
            : null;

        const insertQuery = `INSERT INTO internship_form(stud_name, stud_id, stud_photo, department, email, phone, secondary_phone, field, other_field, clg_name, duration,from_date, 
                        to_date, supervisor_name, supervisor_email, supervisor_phone, choose_intern)
                        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const values = [
            stud_name, stud_id, studentPhotoPath, department, email, phone, secondary_phone, field, other_field, clg_name, duration, from_date, to_date, supervisor_name, supervisor_email, supervisor_phone, choose_intern
        ];

        const [result] = await db.query(insertQuery, values);

        if (result.affectedRows === 0) {
            return res.status(400).json({ message: "Failed to create Internship Form" });
        }
        res.status(201).json({ message: "Internship Form Created successfully", data: result });

    } catch (err) {
        console.error("Error creating Internship Form:", err);
        res.status(500).json({ message: "Database Error", error: err });
    }
}


const getStudentDetails = async (req, res) => {
    const query = "Select * from internship_form";

    try {
        const [data] = await db.query(query);
        return res.status(200).json({ message: "Internship Student Details Get Successfully", data: data });
    } catch (err) {
        console.error("Database Error:", err);
        return res.status(500).json({ message: "Database Error", error: err });
    }
}


const getStudendDetailsbyID = async (req, res) => {
    const id = req.params.id;
    const query = "SELECT * FROM internship_form WHERE id = ?";

    try {
        const [data] = await db.query(query, [id]);

        if (data.length === 0) {
            return res.status(404).json({ message: "No data found for the given admission number" });
        }
        return res.status(200).json({ message: "Student Details form fetched successfully", data: data });
    } catch (err) {
        console.error("Database Error:", err);
        return res.status(500).json({ message: "Database Error", error: err });
    }
}

const updateStudentDetail = async (req, res) => {
    try {
        await formalityAsync(req, res);
        const {
            stud_name, stud_id, department, email, phone, secondary_phone,
            field, other_field, supervisor_name, supervisor_email, supervisor_phone,
            clg_name, duration, from_date, to_date
        } = req.body;


        const id = req.params.id;

        if (!id) {
            return res.status(400).json({ message: "Missing ID" });
        }

        // get existing photo if not uploaded
        const [existing] = await db.query("SELECT stud_photo FROM internship_form WHERE id = ?", [id]);
        const currentPhoto = existing[0]?.stud_photo || null;

        const studentPhotoPath = req.files?.['stud_photo']
            ? `uploads/Internship_photos/${req.files['stud_photo'][0].filename}`
            : currentPhoto;

        const usquery = `UPDATE internship_form SET
                    stud_name = ?,
                    stud_id = ?,
                    stud_photo = ?,
                    email = ?,
                    phone = ?,
                    secondary_phone = ?,
                    field = ?,
                    other_field = ?,
                    supervisor_name = ?,
                    supervisor_email = ?,
                    supervisor_phone = ?,   
                    department = ?,
                    clg_name = ?, 
                    duration = ?, 
                    from_date = ?, 
                    to_date = ?
                    WHERE id= ?`;


        const values = [
            stud_name, stud_id, studentPhotoPath, email, phone, secondary_phone, field, other_field, supervisor_name,
            supervisor_email, supervisor_phone, department, clg_name, duration, from_date, to_date, id
        ];

        const [result] = await db.query(usquery, values);

        if (result.affectedRows === 0) {
            return res.status(400).json({ message: "Failed to update Internship Form" });
        }
        res.status(201).json({ message: "Internship Form Updated successfully", data: result });

    } catch (err) {
        console.error("Error updating Internship Form:", err);
        res.status(500).json({ message: "Database Error", error: err });
    }
}

const getAllDocument = async (req, res) => {
    const query = "Select * from essential_records";
    try {
        const [data] = await db.query(query);
        return res.status(200).json({ message: "Essential Records Details Get Successfully", data: data });
    } catch (err) {
        console.error("Database Error:", err);
        return res.status(500).json({ message: "Database Error", error: err });
    }
}

const getEssentialRecordshow = async (req, res) => {
    const id = req.params.id;
    const query = 'SELECT * FROM essential_records WHERE id = ?';

    try {
        const [results] = await db.query(query, [id]);
        if (results.length === 0) {
            return res.status(404).json({ message: 'Essential Records Form not found' });
        }
        return res.status(200).json(results[0]);
    } catch (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: 'Database error', error: err });
    }
}

const getEventReport = async (req, res) => {
    const query = "Select * from event_report";
    try {
        const [result] = await db.query(query);
        if (result.length === 0) {
            res.status(404).json({ message: "Event Report is not found" });
        }
        return res.status(200).json({ message: "Doctor Visit form Get Successfully", data: result });
    } catch (err) {
        console.log("Error fetching Dr visit:", err);
        res.status(500).json({ message: "Database Error", error: err });
    }
}

const getCelebrationReport = async (req, res) => {
    const query = "Select * from celebration_report";
    try {
        const [result] = await db.query(query);
        if (result.length === 0) {
            res.status(404).json({ message: "Celebration Report is not found" });
        }
        return res.status(200).json({ message: "Celebration Report Get Successfully", data: result });
    } catch (err) {
        console.log("Error fetching Celebration Report:", err);
        res.status(500).json({ message: "Database Error", error: err });
    }
}

const getProgramsReport = async (req, res) => {
    const query = "Select * from community_report";
    try {
        const [result] = await db.query(query);
        if (result.length === 0) {
            res.status(404).json({ message: "Community Programs Report is not found" });
        }
        return res.status(200).json({ message: "Community Programs Get Successfully", data: result });
    } catch (err) {
        console.log("Error fetching Community Programs:", err);
        res.status(500).json({ message: "Database Error", error: err });
    }
}

const getStaffProgramsReport = async (req, res) => {
    const query = "Select * from staff_report";
    try {
        const [result] = await db.query(query);
        if (result.length === 0) {
            res.status(404).json({ message: "Staff Programs Report is not found" });
        }
        return res.status(200).json({ message: "Staff Programs Get Successfully", data: result });
    } catch (err) {
        console.log("Error fetching Staff Programs:", err);
        res.status(500).json({ message: "Database Error", error: err });
    }
}

const getEventReportbyID = async (req, res) => {
    try {
        const id = req.params.id;
        const query = "SELECT * FROM event_report WHERE id=?";
        const [result] = await db.query(query, [id]);

        if (result.length === 0) {
            return res.status(404).json({ message: "Event Report not found" }); // ✅ Added return
        }

        return res.status(200).json({
            message: "Event Report fetched successfully",
            data: result[0] // Optional: return just the object, not array
        });
    } catch (err) {
        console.error("Error fetching Event Report:", err);
        res.status(500).json({ message: "Database Error", error: err });
    }
};

const getCelebrationbyID = async (req, res) => {
    try {
        const id = req.params.id;
        const query = "SELECT * FROM celebration_report WHERE id=?";
        const [result] = await db.query(query, [id]);

        if (result.length === 0) {
            return res.status(404).json({ message: "Celebration Report not found" }); // ✅ Added return
        }

        return res.status(200).json({
            message: "Celebration Report fetched successfully",
            data: result[0] // Optional: return just the object, not array
        });
    } catch (err) {
        console.error("Error fetching Celebration Report:", err);
        res.status(500).json({ message: "Database Error", error: err });
    }
};

const getProgramsbyID = async (req, res) => {
    try {
        const id = req.params.id;
        const query = "SELECT * FROM community_report WHERE id=?";
        const [result] = await db.query(query, [id]);

        if (result.length === 0) {
            return res.status(404).json({ message: "Community Programs Report not found" }); // ✅ Added return
        }

        return res.status(200).json({
            message: "Community Programs fetched successfully",
            data: result[0] // Optional: return just the object, not array
        });
    } catch (err) {
        console.error("Error fetching Community Programs:", err);
        res.status(500).json({ message: "Database Error", error: err });
    }
};

const getStaffProgramsbyID = async (req, res) => {
    try {
        const id = req.params.id;
        const query = "SELECT * FROM staff_report WHERE id=?";
        const [result] = await db.query(query, [id]);

        if (result.length === 0) {
            return res.status(404).json({ message: "Staff Programs Report not found" }); // ✅ Added return
        }

        return res.status(200).json({
            message: "Staff Programs fetched successfully",
            data: result[0] // Optional: return just the object, not array
        });
    } catch (err) {
        console.error("Error fetching Staff Programs:", err);
        res.status(500).json({ message: "Database Error", error: err });
    }
};

const updateEventDetail = async (req, res) => {
    try {
        const {
            event_type, event_name, event_date, event_place, event_report, event_rescue_count,
            awareness_name, awarness_date, awarness_place, awarness_report, awarness_rescue_count,
            outing_name, outing_date, outing_place, outing_report
        } = req.body;

        const id = req.params.id;

        if (!id) {
            return res.status(400).json({ message: "Missing ID" });
        }

        const formatDate = (isoDate) => {
            const d = new Date(isoDate);
            if (isNaN(d)) return null;
            const year = d.getFullYear();
            const month = (`0${d.getMonth() + 1}`).slice(-2);
            const day = (`0${d.getDate()}`).slice(-2);
            return `${year}-${month}-${day}`;
        };

        const usquery = `UPDATE event_report SET
                    event_type = ?,
                    event_name = ?,
                    event_date = ?,
                    event_place = ?,
                    event_report = ?,
                    event_rescue_count = ?,
                    awareness_name = ?,
                    awarness_date = ?,
                    awarness_place = ?,
                    awarness_report = ?,   
                    awarness_rescue_count = ?,
                    outing_name = ?, 
                    outing_date = ?, 
                    outing_place = ?, 
                    outing_report = ?
                    WHERE id= ?`;

        const values = [
            event_type, event_name, formatDate(event_date), event_place, event_report, event_rescue_count,
            awareness_name, formatDate(awarness_date), awarness_place, awarness_report, awarness_rescue_count,
            outing_name, formatDate(outing_date), outing_place, outing_report, id
        ];

        const [result] = await db.query(usquery, values);

        if (result.affectedRows === 0) {
            return res.status(400).json({ message: "Failed to update Event Report" });
        }
        res.status(201).json({ message: "Event Report Form Updated successfully", data: result });

    } catch (err) {
        console.error("Error updating Event Report Form:", err);
        res.status(500).json({ message: "Database Error", error: err });
    }
}

const updateCelebrationDetail = async (req, res) => {
    try {
        const {
            celebration_name, other_celebration, celebration_date, celebration_place, celebration_report, celebration_rescue_count
        } = req.body;

        const id = req.params.id;

        if (!id) {
            return res.status(400).json({ message: "Missing ID" });
        }

        const usquery = `UPDATE celebration_report SET
                    celebration_name = ?,
                    other_celebration = ?,
                    celebration_date = ?,
                    celebration_place = ?,
                    celebration_report = ?,
                    celebration_rescue_count = ?
                    WHERE id= ?`;

        const values = [
            celebration_name, other_celebration, celebration_date, celebration_place, celebration_report, celebration_rescue_count, id
        ];

        const [result] = await db.query(usquery, values);

        if (result.affectedRows === 0) {
            return res.status(400).json({ message: "Failed to update Celebration Report" });
        }
        res.status(201).json({ message: "Celebration Report Form Updated successfully", data: result });

    } catch (err) {
        console.error("Error updating Celebration Report Form:", err);
        res.status(500).json({ message: "Database Error", error: err });
    }
}

const updateProgrambyID = async (req, res) => {
    try {
        const {
            community_name, clg_name, clg_dept, resource_person, community_date,
            community_place, community_rescue_count, community_report
        } = req.body;

        const id = req.params.id;

        if (!id) {
            return res.status(400).json({ message: "Missing ID" });
        }

        const usquery = `UPDATE community_report SET
                    community_name = ?,
                    clg_name = ?,
                    clg_dept = ?,
                    resource_person = ?,
                    community_date = ?,
                    community_place = ?,
                    community_rescue_count = ?,
                    community_report = ?
                    WHERE id= ?`;

        const values = [
            community_name, clg_name, clg_dept, resource_person, community_date,
            community_place, community_rescue_count, community_report, id
        ];

        const [result] = await db.query(usquery, values);

        if (result.affectedRows === 0) {
            return res.status(400).json({ message: "Failed to update Community Programms Report" });
        }
        res.status(201).json({ message: "Community Programms Report Form Updated successfully", data: result });

    } catch (err) {
        console.error("Error updating Community Programms Report Form:", err);
        res.status(500).json({ message: "Database Error", error: err });
    }
}

const updateStaffProgrambyID = async (req, res) => {
    try {
        const {
            staff_name, staff_date, staff_place, staff_rescue_count, staff_report
        } = req.body;

        const id = req.params.id;

        if (!id) {
            return res.status(400).json({ message: "Missing ID" });
        }

        const usquery = `UPDATE staff_report SET
                    staff_name = ?,
                    staff_date = ?,
                    staff_place = ?,
                    staff_rescue_count = ?,
                    staff_report = ?
                    WHERE id= ?`;

        const values = [
            staff_name, staff_date, staff_place, staff_rescue_count, staff_report, id
        ];

        const [result] = await db.query(usquery, values);

        if (result.affectedRows === 0) {
            return res.status(400).json({ message: "Failed to update Staff Programms Report" });
        }
        res.status(201).json({ message: "Staff Programms Report Form Updated successfully", data: result });

    } catch (err) {
        console.error("Error updating Staff Programms Report Form:", err);
        res.status(500).json({ message: "Database Error", error: err });
    }
}

export {
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
    getAllDocument, getEssentialRecordshow,
    getEventReport, getEventReportbyID, getCelebrationReport, getCelebrationbyID,
    getProgramsReport, getProgramsbyID, getStaffProgramsReport, getStaffProgramsbyID,
    updateEventDetail, updateCelebrationDetail, updateProgrambyID, updateStaffProgrambyID
};