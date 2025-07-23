import db from "../db.js";
import { formalityAsync } from "../util/formalityMulter.js";
import fs from "fs/promises";
import transporter from '../config/mailer.js';

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
        sendDirectorMailHandover({
            admission_no,
            rescue_name,
            medicine_provided,
            toiletries_provided,
            dress_provided,
            travel_expenses
        }).then(() => {
            console.log("✅ Email sent to director");
        }).catch((error) => {
            console.error("❌ Failed to send email to director:", error);
        });

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

const sendDirectorMailHandover = async (form) => {
    try {

        const mailOptions = {
            from: `"Manasu ERP Application" <${process.env.EMAIL_USER}>`,
            to: ["manasucmf@gmail.com"],
            subject: `📝 Handover Form Submitted: ${form.admission_no}`,
            html: `
        <h2>Resident's Possessions and Document Handover Form</h2>
        <p><strong>Admission No:</strong> ${form.admission_no}</p>
        <p><strong>Name:</strong> ${form.rescue_name}</p>
        <p><strong>30 days Medicine Provided : </strong> ${form.medicine_provided}</p>
        <p><strong>Toiletries provided :</strong> ${form.toiletries_provided}</p>
        <p><strong>1 month dress provided :</strong> ${form.dress_provided}</p>
        <p><strong>Travel Expenses Provided :</strong> ${form.travel_expenses}</p>
        <hr>
        <p style="color: #444;">📌 Please refer or check the <strong>ERP application</strong> for complete details.</p>
      `,
        };

        await transporter.sendMail(mailOptions);
        console.log("📧 Email sent to director successfully");
    } catch (error) {
        console.error("❌ Error sending email to director:", error.message);
    }
};

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

        // 3. THEN send email to director (doesn't block response)
        sendDirectorMail({
            admission_no,
            rescue_name,
            aadhar_card,
            udid_no,
            voter_id
        }).then(() => {
            console.log("✅ Email sent to director");
        }).catch((error) => {
            console.error("❌ Failed to send email to director:", error);
        });

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

const sendDirectorMail = async (form) => {
    try {

        const mailOptions = {
            from: `"Manasu ERP Application" <${process.env.EMAIL_USER}>`,
            to: "manasucmf@gmail.com", // ✅ change to director's real email
            subject: `📝 Resident Document Information Form: ${form.admission_no}`,
            html: `
        <h2>New First Form Created by Admin</h2>
        <p><strong>Admission No:</strong> ${form.admission_no}</p>
        <p><strong>Name:</strong> ${form.rescue_name}</p>
        <p><strong>Aadhar Card Number:</strong> ${form.aadhar_card}</p>
        <p><strong>UDID No:</strong> ${form.udid_no}</p>
        <p><strong>Voter ID:</strong> ${form.voter_id}</p>
      `,
        };

        await transporter.sendMail(mailOptions);
        console.log("📧 Email sent to director successfully");
    } catch (error) {
        console.error("❌ Error sending email to director:", error.message);
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
            ? req.files['bank_passbook'].map((f) => `uploads/Rescue_Images/${f.filename}`)
            : null;

        const newForm7Attach = req.files['form7_attach']
            ? req.files['form7_attach'].map((f) => `uploads/Rescue_Images/${f.filename}`)
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

        const event_photosPath = req.files['event_photos']
            ? req.files['event_photos'].map(f => `uploads/Event_Photos/${f.filename}`)
            : null;
        const awarness_photosPath = req.files['awarness_photos']
            ? req.files['awarness_photos'].map(f => `uploads/Event_Photos/${f.filename}`)
            : null;
        const outing_photosPath = req.files['outing_photos']
            ? req.files['outing_photos'].map(f => `uploads/Event_Photos/${f.filename}`)
            : null;

        // const event_photosPath = req.files?.['event_photos']
        //     ? `/uploads/Event_Photos/${req.files['event_photos'][0].filename}`
        //     : null;

        // const awarness_photosPath = req.files?.['awarness_photos']
        //     ? `/uploads/Event_Photos/${req.files['awarness_photos'][0].filename}`
        //     : null;

        // const outing_photosPath = req.files?.['outing_photos']
        //     ? `/uploads/Event_Photos/${req.files['outing_photos'][0].filename}`
        //     : null;

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
            JSON.stringify(event_photosPath || null),

            awareness_name || null,
            formatDate(awarness_date) || null,
            awarness_place || null,
            awarness_report || null,
            awarness_rescue_count || null,
            JSON.stringify(awarness_photosPath || null),

            outing_name || null,
            formatDate(outing_date) || null,
            outing_place || null,
            outing_report || null,
            outing_rescue_count || null,
            JSON.stringify(outing_photosPath || null)
        ];

        const [result] = await db.query(q, values);

        sendDirectorMailEvent({
            event_name,
            event_date: formatDate(event_date),
            event_place,
            awareness_name,
            awarness_date: formatDate(awarness_date),
            awarness_place,
            outing_name,
            outing_date: formatDate(outing_date),
            outing_place
        }).then(() => {
            console.log("✅ Email sent to director");
        }).catch((error) => {
            console.error("❌ Failed to send email to director:", error);
        });

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

const sendDirectorMailEvent = async (form) => {
    try {

        const mailOptions = {
            from: `"Manasu ERP Application" <${process.env.EMAIL_USER}>`,
            to: ["manasucmf@gmail.com"],
            subject: `📝 Event/Awarness/Outing Form Submitted`,
            html: `
        <h2>Event / Awareness / Outing Details</h2>
        <p><strong>Event Name:</strong> ${form.event_name || null}</p>
        <p><strong>Event Date:</strong> ${form.event_date || null}</p>
        <p><strong>Event Place:</strong> ${form.event_place || null}</p>
        <p><strong>Awarness Name:</strong> ${form.awareness_name || null}</p>
        <p><strong>Awarness Date:</strong> ${form.awarness_date || null}</p>
        <p><strong>Awarness Place:</strong> ${form.awarness_place || null}</p>
        <p><strong>Outing Name:</strong> ${form.outing_name || null}</p>
        <p><strong>Outing Date:</strong> ${form.outing_date || null}</p>
        <p><strong>Outing Place:</strong> ${form.outing_place || null}</p>
        <hr>
        <p style="color: #444;">📌 Please refer or check the <strong>ERP application</strong> for complete details.</p>
      `,
        };

        await transporter.sendMail(mailOptions);
        console.log("📧 Email sent to director successfully");
    } catch (error) {
        console.error("❌ Error sending email to director:", error.message);
    }
};

const createCelebrationReport = async (req, res) => {
    try {
        await formalityAsync(req, res);
        const {
            celebration_name,
            celebration_date,
            celebration_place,
            celebration_rescue_count,
            celebration_report,
            other_celebration
        } = req.body;

        const celebration_PhotoPath = req.files?.['celebration_photos']
            ? req.files['celebration_photos'].map(file => `uploads/Event_Photos/${file.filename}`)
            : [];

        const q = `INSERT INTO celebration_report(celebration_name, other_celebration, celebration_date, celebration_photos, celebration_place, celebration_rescue_count, celebration_report) 
                VALUES (?,?,?,?,?,?,?)`;

        const values = [
            celebration_name,
            other_celebration,
            celebration_date,
            JSON.stringify(celebration_PhotoPath),
            celebration_place,
            celebration_rescue_count,
            celebration_report,
        ]

        const [result] = await db.query(q, values);
        sendDirectorMailCel({
            celebration_name,
            other_celebration,
            celebration_date,
            celebration_place,
            celebration_rescue_count,
            celebration_report
        }).then(() => {
            console.log("✅ Email sent to director");
        }).catch((error) => {
            console.error("❌ Failed to send email to director:", error);
        });

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

const sendDirectorMailCel = async (form) => {
    try {

        const mailOptions = {
            from: `"Manasu ERP Application" <${process.env.EMAIL_USER}>`,
            to: ["manasucmf@gmail.com"],
            subject: `📝 Celebration Form Submitted `,
            html: `
        <h2>General Celebration Details</h2>
        <p><strong>Name of the Celebration:</strong> ${form.celebration_name || null}</p>
        <p><strong>Celebration Date:</strong> ${form.celebration_date || null}</p>
        <p><strong>Other Celebration:</strong> ${form.other_celebration || null}</p>
        <p><strong>Celebration Place:</strong> ${form.celebration_place || null}</p>
        <p><strong>No. of Participants:</strong> ${form.celebration_rescue_count || null}</p>
        <p><strong>Report:</strong> ${form.celebration_place || null}</p>
        <hr>
        <p style="color: #444;">📌 Please refer or check the <strong>ERP application</strong> for complete details.</p>
      `,
        };

        await transporter.sendMail(mailOptions);
        console.log("📧 Email sent to director successfully");
    } catch (error) {
        console.error("❌ Error sending email to director:", error.message);
    }
};

const createCommunityReport = async (req, res) => {
    try {
        await formalityAsync(req, res);
        const {
            community_date,
            community_name,
            clg_name,
            clg_dept,
            resource_person,
            community_place,
            community_rescue_count,
            community_report,
        } = req.body;

        const ProgrammsPhotoPath = req.files?.['programms_photos']
            ? req.files['programms_photos'].map(file => `uploads/Event_Photos/${file.filename}`)
            : [];

        const q = `INSERT INTO community_report(community_name, clg_name, clg_dept, resource_person, community_date, community_place, programms_photos, community_rescue_count, community_report)
                VALUES (?,?,?,?,?,?,?,?,?)`;
        const values = [
            community_date,
            community_name,
            clg_name,
            clg_dept,
            resource_person,
            community_place,
            JSON.stringify(ProgrammsPhotoPath),
            community_rescue_count,
            community_report,
        ]

        const [result] = await db.query(q, values);

        sendDirectorMailCom({
            community_name,
            clg_name,
            clg_dept,
            resource_person,
            community_date,
            community_place,
            community_rescue_count,
            community_report
        }).then(() => {
            console.log("✅ Email sent to director");
        }).catch((error) => {
            console.error("❌ Failed to send email to director:", error);
        });

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

const sendDirectorMailCom = async (form) => {
    try {

        const mailOptions = {
            from: `"Manasu ERP Application" <${process.env.EMAIL_USER}>`,
            to: ["manasucmf@gmail.com"],
            subject: `📝 Community Form Submitted`,
            html: `
        <h2>Community Programs</h2>
        <p><strong>Name of the Programs:</strong> ${form.community_name || null}</p>
        <p><strong>College Name :</strong> ${form.clg_name || null}</p>
        <p><strong>College Department:</strong> ${form.clg_dept || null}</p>
        <p><strong>Resource Person:</strong> ${form.resource_person || null}</p>
        <p><strong>Community Date:</strong> ${form.community_date || null}</p>
        <p><strong>Community Place:</strong> ${form.community_place || null}</p>
        <p><strong>No. of Participants:</strong> ${form.community_rescue_count || null}</p>
        <hr>
        <p style="color: #444;">📌 Please refer or check the <strong>ERP application</strong> for complete details.</p>
      `,
        };

        await transporter.sendMail(mailOptions);
        console.log("📧 Email sent to director successfully");
    } catch (error) {
        console.error("❌ Error sending email to director:", error.message);
    }
};

const createStaffReport = async (req, res) => {
    try {
        await formalityAsync(req, res);
        const {
            staff_name,
            staff_date,
            staff_place,
            staff_rescue_count,
            staff_report,
        } = req.body;

        const StaffPhotoPath = req.files?.['staff_photos']
            ? req.files['staff_photos'].map(file => `uploads/Event_Photos/${file.filename}`)
            : [];

        const q = `INSERT INTO staff_report(staff_name, staff_date, staff_place, staff_photos, staff_rescue_count, staff_report)
                VALUES (?,?,?,?,?, ?)`;
        const values = [
            staff_name,
            staff_date,
            staff_place,
            JSON.stringify(StaffPhotoPath),
            staff_rescue_count,
            staff_report,
        ]

        const [result] = await db.query(q, values);
        sendDirectorMailStaff({
            staff_name,
            staff_date,
            staff_place,
            staff_rescue_count,
            staff_report
        }).then(() => {
            console.log("✅ Email sent to director");
        }).catch((error) => {
            console.error("❌ Failed to send email to director:", error);
        });

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

const sendDirectorMailStaff = async (form) => {
    try {

        const mailOptions = {
            from: `"Manasu ERP Application" <${process.env.EMAIL_USER}>`,
            to: ["manasucmf@gmail.com"],
            subject: `📝 Staff Programs Form Submitted`,
            html: `
        <h2>Staff Programs Form Details</h2>
        <p><strong>Name of the Programs:</strong> ${form.staff_name}</p>
        <p><strong> Date:</strong> ${form.staff_date}</p>
        <p><strong>Venue:</strong> ${form.staff_place}</p>
        <p><strong>No of participants:</strong> ${form.staff_rescue_count}</p>
        <hr>
        <p style="color: #444;">📌 Please refer or check the <strong>ERP application</strong> for complete details.</p>
      `,
        };

        await transporter.sendMail(mailOptions);
        console.log("📧 Email sent to director successfully");
    } catch (error) {
        console.error("❌ Error sending email to director:", error.message);
    }
};

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

        sendDirectorMailDischarge({
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
        }).then(() => {
            console.log("✅ Email sent to director");
        }).catch((error) => {
            console.error("❌ Failed to send email to director:", error);
        });

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

const sendDirectorMailDischarge = async (form) => {
    try {

        const mailOptions = {
            from: `"Manasu ERP Application" <${process.env.EMAIL_USER}>`,
            to: ["manasucmf@gmail.com"],
            subject: `📝 Discharge Information Form Submitted: ${form.admission_no}`,
            html: `
        <h2>Resident's Discharge Information</h2>
        <p><strong>Admission No:</strong> ${form.admission_no}</p>
        <p><strong>Name:</strong> ${form.rescue_name}</p>
        <p><strong>Referred By:</strong> ${form.referred_by}</p>
        <p><strong>Escape:</strong> ${form.escape}</p>
        <p><strong>Death:</strong> ${form.death}</p>
        <p><strong>Discharge:</strong> ${form.discharge}</p>
        <p><strong>Reunited:</strong> ${form.reunited}</p
        <p><strong>Transfer:</strong> ${form.transfer}</p>
        <p><strong>State Venue:</strong> ${form.state_venue || "N/A"}</p>
        <p><strong>State:</strong> ${form.state || "N/A"}</p>
        <hr>
        <p style="color: #444;">📌 Please refer or check the <strong>ERP application</strong> for complete details.</p>
      `,
        };

        await transporter.sendMail(mailOptions);
        console.log("📧 Email sent to director successfully");
    } catch (error) {
        console.error("❌ Error sending email to director:", error.message);
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

        const studentPhotoPath = req.files?.['stud_photo']
            ? req.files['stud_photo'].map(file => `uploads/Internship_photos/${file.filename}`)
            : [];

        // const studentPhotoPath = req.files['stud_photo']
        //     ? `uploads/Internship_photos/${req.files['stud_photo'][0].filename}`
        //     : null;

        const insertQuery = `INSERT INTO internship_form(stud_name, stud_id, stud_photo, department, email, phone, secondary_phone, field, other_field, clg_name, duration,from_date, 
                        to_date, supervisor_name, supervisor_email, supervisor_phone, choose_intern)
                        VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const values = [
            stud_name, stud_id, JSON.stringify(studentPhotoPath), department, email, phone, secondary_phone, field, other_field, clg_name, duration, from_date, to_date, supervisor_name, supervisor_email, supervisor_phone, choose_intern
        ];

        const [result] = await db.query(insertQuery, values);

        sendDirectorMailIntern({
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
            supervisor_name,
        }).then(() => {
            console.log("✅ Email sent to director");
        }).catch((error) => {
            console.error("❌ Failed to send email to director:", error);
        });

        if (result.affectedRows === 0) {
            return res.status(400).json({ message: "Failed to create Internship Form" });
        }
        res.status(201).json({ message: "Internship Form Created successfully", data: result });

    } catch (err) {
        console.error("Error creating Internship Form:", err);
        res.status(500).json({ message: "Database Error", error: err });
    }
}

const sendDirectorMailIntern = async (form) => {
    try {

        const mailOptions = {
            from: `"Manasu ERP Application" <${process.env.EMAIL_USER}>`,
            to: ["manasucmf@gmail.com"],
            subject: `📝 Internship Information Form Submitted`,
            html: `
        <h2>Internship Information Form</h2>
        <p><strong>Student Name:</strong> ${form.staff_name}</p>
        <p><strong>Student ID:</strong> ${form.stud_id}</p>
        <p><strong>Department:</strong> ${form.department}</p>
        <p><strong>Email:</strong> ${form.email}</p>
        <p><strong>Phone:</strong> ${form.phone}</p>
        <p><strong>Field:</strong> ${form.field}</p>
        <p><strong>College Name:</strong> ${form.clg_name}</p>
        <p><strong>Duration:</strong> ${form.duration}</p>
        <p><strong>From Date:</strong> ${form.from_date}</p>
        <p><strong>To Date:</strong> ${form.to_date}</p>
        <p><strong>Supervisor Name:</strong> ${form.supervisor_name}</p>
        <hr>
        <p style="color: #444;">📌 Please refer or check the <strong>ERP application</strong> for complete details.</p>
      `,
        };

        await transporter.sendMail(mailOptions);
        console.log("📧 Email sent to director successfully");
    } catch (error) {
        console.error("❌ Error sending email to director:", error.message);
    }
};


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
            ? req.files['stud_photo'].map(file => `uploads/Internship_photos/${file.filename}`)
            : JSON.parse(currentPhoto || '[]');


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
            stud_name, stud_id, JSON.stringify(studentPhotoPath), email, phone, secondary_phone, field, other_field, supervisor_name,
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
        await formalityAsync(req, res);
        const {
            event_type, event_name, event_date, event_place, event_report, event_rescue_count,
            awareness_name, awarness_date, awarness_place, awarness_report, awarness_rescue_count,
            outing_name, outing_date, outing_place, outing_report
        } = req.body;

        const id = req.params.id;

        if (!id) {
            return res.status(400).json({ message: "Missing ID" });
        }

        const [existing] = await db.query("SELECT event_photos, awarness_photos, outing_photos FROM event_report WHERE id = ?", [id]);
        if (existing.length === 0) {
            return res.status(404).json({ message: "No record found with provided ID" });
        }

        const EventPath = req.files['event_photos']
            ? req.files['event_photos'].map(f => `uploads/Event_Photos/${f.filename}`)
            : JSON.parse(existing[0].event_photos || "[]");

        const AwarnessPath = req.files['awarness_photos']
            ? req.files['awarness_photos'].map(f => `uploads/Event_Photos/${f.filename}`)
            : JSON.parse(existing[0].awarness_photos || "[]");

        const OutingPath = req.files['outing_photos']
            ? req.files['outing_photos'].map(f => `uploads/Event_Photos/${f.filename}`)
            : JSON.parse(existing[0].outing_photos || "[]");

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
                    event_photos = ?,
                    event_rescue_count = ?,
                    awareness_name = ?,
                    awarness_date = ?,
                    awarness_place = ?,
                    awarness_report = ?,   
                    awarness_photos = ?,
                    awarness_rescue_count = ?,
                    outing_name = ?, 
                    outing_date = ?, 
                    outing_place = ?, 
                    outing_report = ?,
                    outing_photos = ?
                    WHERE id= ?`;

        const values = [
            event_type || null,
            event_name || null,
            formatDate(event_date),
            event_place || null,
            event_report || null,
            EventPath ? JSON.stringify(EventPath) : null,
            event_rescue_count || null,
            awareness_name || null,
            formatDate(awarness_date),
            awarness_place || null,
            awarness_report || null,
            AwarnessPath ? JSON.stringify(AwarnessPath) : null,
            awarness_rescue_count || null,
            outing_name || null,
            formatDate(outing_date),
            outing_place || null,
            outing_report || null,
            OutingPath ? JSON.stringify(OutingPath) : null,
            id
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
        await formalityAsync(req, res);
        const {
            celebration_name, other_celebration, celebration_date, celebration_place, celebration_report, celebration_rescue_count
        } = req.body;

        const id = req.params.id;

        if (!id) {
            return res.status(400).json({ message: "Missing ID" });
        }

        const celebrationPath = req.files['celebration_photos']
            ? req.files['celebration_photos'].map(f => `uploads/Event_Photos/${f.filename}`)
            : null;

        const usquery = `UPDATE celebration_report SET
                    celebration_name = ?,
                    other_celebration = ?,
                    celebration_date = ?,
                    celebration_place = ?,
                    celebration_photos = ?,
                    celebration_report = ?,
                    celebration_rescue_count = ?
                    WHERE id= ?`;

        const values = [
            celebration_name,
            other_celebration,
            celebration_date,
            celebration_place,
            JSON.stringify(celebrationPath),
            celebration_report,
            celebration_rescue_count,
            id
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
        await formalityAsync(req, res);
        const {
            community_name, clg_name, clg_dept, resource_person, community_date,
            community_place, community_rescue_count, community_report
        } = req.body;

        const id = req.params.id;

        if (!id) {
            return res.status(400).json({ message: "Missing ID" });
        }

        const CommunityPhotoPath = req.files['programms_photos']
            ? req.files['programms_photos'].map(f => `uploads/Event_Photos/${f.filename}`)
            : null;

        const usquery = `UPDATE community_report SET
                    community_name = ?,
                    clg_name = ?,
                    clg_dept = ?,
                    resource_person = ?,
                    community_date = ?,
                    community_place = ?,
                    community_rescue_count = ?,
                    programms_photos = ?,
                    community_report = ?
                    WHERE id= ?`;

        const values = [
            community_name, clg_name,
            clg_dept, resource_person,
            community_date,
            community_place,
            community_rescue_count,
            JSON.stringify(CommunityPhotoPath),
            community_report,
            id
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
        await formalityAsync(req, res);
        const {
            staff_name, staff_date, staff_place, staff_rescue_count, staff_report
        } = req.body;

        const id = req.params.id;

        if (!id) {
            return res.status(400).json({ message: "Missing ID" });
        }

        const StaffPhotoPath = req.files['staff_photos']
            ? req.files['staff_photos'].map(f => `uploads/Event_Photos/${f.filename}`)
            : null;

        const usquery = `UPDATE staff_report SET
                    staff_name = ?,
                    staff_date = ?,
                    staff_place = ?,
                    staff_rescue_count = ?,
                    staff_photos = ?,
                    staff_report = ?
                    WHERE id= ?`;

        const values = [
            staff_name,
            staff_date,
            staff_place,
            staff_rescue_count,
            JSON.stringify(StaffPhotoPath),
            staff_report,
            id
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