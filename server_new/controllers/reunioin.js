import db from '../db.js';
import { ReunionAsync } from '../util/ReunionMulter.js';

const createFamilyLetter = async (req, res) => {
    try {
        await ReunionAsync(req, res);
        const {
            rescue_name,
            admissionNumber,
            f_member_age,
            description,
            rescue_relationship,
            f_member_name,
            f_member_phone,
            f_member_address,
            f_aadhar_card_no,
            f_ration_card_no,
            r_aadhar_card_no,
            r_ration_card_no,
            any_other
        } = req.body;

        // File paths
        const aadharCardPath = req.files?.['f_aadhar_card']
            ? req.files['f_aadhar_card'].map(file => `uploads/Reunion/Family_Details/${file.filename}`)
            : [];

        const rationCardPath = req.files?.['f_ration_card']
            ? req.files['f_ration_card'].map(file => `uploads/Reunion/Family_Details/${file.filename}`)
            : [];

        const resaadharCardPath = req.files?.['r_aadhar_card']
            ? req.files['r_aadhar_card'].map(file => `uploads/Reunion/Family_Details/${file.filename}`)
            : [];

        const resrationCardPath = req.files?.['r_ration_card']
            ? req.files['r_ration_card'].map(file => `uploads/Reunion/Family_Details/${file.filename}`)
            : [];

        const govt_idPath = req.files?.['govt_id']
            ? req.files['govt_id'].map(file => `uploads/Reunion/Family_Details/${file.filename}`)
            : [];

        // const aadharCardPath = req.files['f_aadhar_card'] ? `uploads/Reunion/Family_Details/${req.files['f_aadhar_card'][0].filename}` : null;
        // const rationCardPath = req.files['f_ration_card'] ? `uploads/Reunion/Family_Details/${req.files['f_ration_card'][0].filename}` : null;
        // const resaadharCardPath = req.files['r_aadhar_card'] ? `uploads/Reunion/Family_Details/${req.files['r_aadhar_card'][0].filename}` : null;
        // const resrationCardPath = req.files['r_ration_card'] ? `uploads/Reunion/Family_Details/${req.files['r_ration_card'][0].filename}` : null;
        // const govt_idPath = req.files['govt_id'] ? `uploads/Reunion/Family_Details/${req.files['govt_id'][0].filename}` : null;

        const q = "INSERT INTO family_request_form (admission_no,age,f_aadhar_card,f_ration_card,r_aadhar_card,r_ration_card,govt_id,description,rescue_name,family_relationship,f_member_name,f_member_phone,f_member_address,f_aadhar_card_no, f_ration_card_no,r_aadhar_card_no, r_ration_card_no, any_other) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        const values = [
            admissionNumber,
            f_member_age,
            JSON.stringify(aadharCardPath),
            JSON.stringify(rationCardPath),
            JSON.stringify(resaadharCardPath) || null,
            JSON.stringify(resrationCardPath) || null,
            JSON.stringify(govt_idPath) || null,
            description,
            rescue_name,
            rescue_relationship,
            f_member_name,
            f_member_phone,
            f_member_address,
            f_aadhar_card_no,
            f_ration_card_no,
            r_aadhar_card_no,
            r_ration_card_no,
            any_other,
        ];

        const [result] = await db.query(q, values);
        if (result.affectedRows === 0) {
            return res.status(400).json({ message: "Failed to create Family Request Letter Form" });
        }
        res.status(201).json({ message: "Family Request Letter Form Created Successfully", data: result });
    }
    catch (error) {
        console.error("Error creating Family Request Letter Form:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

const getFamilyRequestForm = async (req, res) => {
    const admissionNumber = req.params.admissionNumber;
    const query = 'SELECT * FROM family_request_form WHERE admission_no = ?';

    try {
        const [results] = await db.query(query, [admissionNumber]);
        if (results.length === 0) {
            return res.status(404).json({ message: 'Family Request Letter Form not found' });
        }
        res.status(200).json(results[0]);
    } catch (error) {
        console.error("Error fetching Family Request Letter Form:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

const UpdateFamilyRequestForm = async (req, res) => {
    try {
        await ReunionAsync(req, res); // your middleware

        const admission_no = req.params.admission_no;
        if (!admission_no) {
            return res.status(400).json({ message: "Admission number is required" });
        }

        const {
            rescue_name,
            f_member_age,
            description,
            family_relationship,
            f_member_name,
            f_member_phone,
            f_member_address,
            f_aadhar_card_no,
            f_ration_card_no,
            r_aadhar_card_no,
            r_ration_card_no,
            any_other
        } = req.body;

        // Parse uploaded files (support multiple images)
        const fAadharCardFiles = req.files['f_aadhar_card']
            ? req.files['f_aadhar_card'].map(f => `uploads/Reunion/Family_Details/${f.filename}`)
            : null;

        const fRationCardFiles = req.files['f_ration_card']
            ? req.files['f_ration_card'].map(f => `uploads/Reunion/Family_Details/${f.filename}`)
            : null;

        const rAadharCardFiles = req.files['r_aadhar_card']
            ? req.files['r_aadhar_card'].map(f => `uploads/Reunion/Family_Details/${f.filename}`)
            : null;

        const rRationCardFiles = req.files['r_ration_card']
            ? req.files['r_ration_card'].map(f => `uploads/Reunion/Family_Details/${f.filename}`)
            : null;

        const govtIDFiles = req.files['govt_id']
            ? req.files['govt_id'].map(f => `uploads/Reunion/Family_Details/${f.filename}`)
            : null;

        // Get existing file paths from DB
        const [existingRows] = await db.query(`
            SELECT f_aadhar_card, f_ration_card, r_aadhar_card, r_ration_card, govt_id 
            FROM family_request_form WHERE admission_no = ?
        `, [admission_no]);

        const existing = existingRows[0] || {};

        // Merge or retain old data if no new uploads
        const finalFAadharCard = fAadharCardFiles ? JSON.stringify(fAadharCardFiles) : existing.f_aadhar_card;
        const finalFRationCard = fRationCardFiles ? JSON.stringify(fRationCardFiles) : existing.f_ration_card;
        const finalRAadharCard = rAadharCardFiles ? JSON.stringify(rAadharCardFiles) : existing.r_aadhar_card;
        const finalRRationCard = rRationCardFiles ? JSON.stringify(rRationCardFiles) : existing.r_ration_card;
        const finalGovtID = govtIDFiles ? JSON.stringify(govtIDFiles) : existing.govt_id;

        // Update query
        const updateQuery = `
            UPDATE family_request_form SET 
                rescue_name = ?, 
                age = ?, 
                f_aadhar_card = ?, 
                f_ration_card = ?,
                r_aadhar_card = ?,
                r_ration_card = ?,
                govt_id = ?,
                description = ?, 
                family_relationship = ?, 
                f_member_name = ?,
                f_member_phone = ?,
                f_member_address = ?,
                f_aadhar_card_no = ?,
                f_ration_card_no = ?,
                r_aadhar_card_no = ?,
                r_ration_card_no = ?,
                any_other = ?
            WHERE admission_no = ?
        `;

        const values = [
            rescue_name,
            f_member_age,
            finalFAadharCard,
            finalFRationCard,
            finalRAadharCard,
            finalRRationCard,
            finalGovtID,
            description,
            family_relationship,
            f_member_name,
            f_member_phone,
            f_member_address,
            f_aadhar_card_no || null,
            f_ration_card_no || null,
            r_aadhar_card_no || null,
            r_ration_card_no || null,
            any_other || null,
            admission_no
        ];

        await db.query(updateQuery, values);

        return res.status(200).json({ message: "Family Request Form updated successfully!" });

    } catch (err) {
        console.error("Error updating Family Request Form:", err);
        return res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
};



// const deleteFamilyRequest = (req, res) => {
//     const admissionNumber = req.params.admissionNumber;

//     const deletequery = "DELETE FROM family_request_form WHERE admission_no = ?";
//     const values = [
//         admissionNumber
//     ];

//     db.query(deletequery, values, (err, data) => {
//         if (err) {
//             return res.status(500).json({ message: "Database Error", error: err });
//         }
//         res
//             .status(201)
//             .json({ message: "Family Request Letter Deleted Successfully", data: data });
//     });
// }

const getInformation = async (req, res) => {
    const admission_no = req.params.admission_no;
    const query = "SELECT * FROM first_information WHERE admission_no = ?";

    try {
        const [results] = await db.query(query, [admission_no]);
        if (results.length === 0) {
            return res.status(404).json({ message: "No data found for the given admission number" });
        }
        res.status(200).json({ message: "First Information form fetched successfully", data: results });
    } catch (error) {
        console.error("Error fetching First Information form:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}


const createSelfDeclaration = async (req, res) => {
    try {
        await ReunionAsync(req, res); // your custom middleware

        const {
            rescue_name,
            admission_no,
            age,
            description
        } = req.body;

        // File paths
        const handWrittenPath = req.files?.['handwritten_document']
            ? req.files['handwritten_document'].map(file => `uploads/Self_Declaration/${file.filename}`)
            : [];
        const signaturePath = req.files?.['signature']
            ? req.files['signature'].map(file => `uploads/Self_Declaration/${file.filename}`)
            : [];
        const PhotoPath = req.files?.['photo']
            ? req.files['photo'].map(file => `uploads/Self_Declaration/${file.filename}`)
            : [];
        // const handWrittenPath = req.files['handwritten_document'] ? `uploads/Self_Declaration/${req.files['handwritten_document'][0].filename}` : null;
        // const signaturePath = req.files['signature'] ? `uploads/Self_Declaration/${req.files['signature'][0].filename}` : null;
        // const PhotoPath = req.files['photo'] ? `uploads/Self_Declaration/${req.files['photo'][0].filename}` : null;

        const q = `INSERT INTO self_declaration(admission_no,rescue_name,age,description,handwritten_document,signature,photo)
                VALUES(?,?,?,?,?,?,?)`;

        const values = [
            admission_no,
            rescue_name,
            age,
            description,
            JSON.stringify(handWrittenPath),
            JSON.stringify(signaturePath),
            JSON.stringify(PhotoPath)
        ]

        const [result] = await db.query(q, values);
        if (result.affectedRows === 0) {
            return res.status(400).json({ message: "Failed to create Self Declaration Form" });
        }
        res.status(201).json({ message: "Self Declaration Form Created Successfully", data: result });
    }
    catch (error) {
        console.error("Error creating Self Declaration Form:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

const getSelfDeclaration = async (req, res) => {
    const admission_no = req.params.admission_no;

    if (!admission_no) {
        return res.status(400).json({ error: 'Admission number is required' });
    }

    const query = 'SELECT * FROM self_declaration WHERE admission_no = ?';

    try {
        const [results] = await db.query(query, [admission_no]);
        if (results.length === 0) {
            return res.status(404).json({ message: 'Self Declaration Form not found' });
        }
        res.status(200).json(results[0]);
    } catch (error) {
        console.error("Error fetching Self Declaration Form:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

const UpdateSelfDeclaration = async (req, res) => {
    try {
        await ReunionAsync(req, res); // Middleware for file upload

        const admission_no = req.params.admission_no;
        if (!admission_no) {
            return res.status(400).json({ message: "Admission number is required" });
        }

        const { rescue_name, age, description } = req.body;

        // Parse uploaded files (support multiple images per field)
        const signatureFiles = req.files['signature']
            ? req.files['signature'].map(f => `uploads/Self_Declaration/${f.filename}`)
            : null;

        const photoFiles = req.files['photo']
            ? req.files['photo'].map(f => `uploads/Self_Declaration/${f.filename}`)
            : null;

        const handwrittenFiles = req.files['handwritten_document']
            ? req.files['handwritten_document'].map(f => `uploads/Self_Declaration/${f.filename}`)
            : null;

        // Fetch existing data from DB
        const [existingRows] = await db.query(`
            SELECT signature, photo, handwritten_document 
            FROM self_declaration 
            WHERE admission_no = ?
        `, [admission_no]);

        if (existingRows.length === 0) {
            return res.status(404).json({ message: "No record found for given admission number" });
        }

        const existing = existingRows[0] || {};

        // Merge or retain old data if no new uploads
        const finalSignature = signatureFiles ? JSON.stringify(signatureFiles) : existing.signature;
        const finalPhoto = photoFiles ? JSON.stringify(photoFiles) : existing.photo;
        const finalHandwritten = handwrittenFiles ? JSON.stringify(handwrittenFiles) : existing.handwritten_document;

        // Update query
        const updateQuery = `
            UPDATE self_declaration SET 
                rescue_name = ?, 
                age = ?, 
                description = ?, 
                signature = ?, 
                photo = ?, 
                handwritten_document = ?
            WHERE admission_no = ?
        `;

        const values = [
            rescue_name,
            age,
            description,
            finalSignature,
            finalPhoto,
            finalHandwritten,
            admission_no
        ];

        await db.query(updateQuery, values);

        return res.status(200).json({ message: "Self Declaration updated successfully!" });

    } catch (error) {
        console.error("Error in UpdateSelfDeclaration:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};



// const deleteSelfDeclaration = (req, res) => {
//     const admission_no = req.params.admission_no;

//     const deletequery = "DELETE FROM self_declaration WHERE admission_no = ?";
//     const values = [
//         admission_no
//     ];

//     db.query(deletequery, values, (err, data) => {
//         if (err) {
//             return res.status(500).json({ message: "Database Error", error: err });
//         }
//         res
//             .status(201)
//             .json({ message: "Self Declaration Deleted Successfully", data: data });
//     });
// }

const createMediaConsent = async (req, res) => {
    try {
        await ReunionAsync(req, res); // your custom middleware
        const {
            admission_no,
            rescue_name,
            social_media_consent,
            description
        } = req.body;
        // File paths
        const scanReportPath = req.files?.['scan_report']
            ? req.files['scan_report'].map(file => `uploads/MediaConsent/${file.filename}`)
            : [];
        // const scanReportPath = req.files['scan_report'] ? `uploads/MediaConsent/${req.files['scan_report'][0].filename}` : null;
        const q = `INSERT INTO media_consent(admission_no,rescue_name,social_media_consent,scan_report,description)
                VALUES(?,?,?,?,?)`;
        const values = [
            admission_no,
            rescue_name,
            social_media_consent,
            JSON.stringify(scanReportPath),
            description
        ];
        const [result] = await db.query(q, values);
        if (result.affectedRows === 0) {
            return res.status(400).json({ message: "Failed to create Media Consent Form" });
        }
        res.status(201).json({ message: "Media Consent Form Created Successfully", data: result });

    } catch (error) {
        console.error("Error creating Media Consent Form:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}


const getMediaConsent = async (req, res) => {
    const admission_no = req.params.admission_no;
    const query = 'SELECT * FROM media_consent WHERE admission_no = ?';

    try {
        const [results] = await db.query(query, [admission_no]);
        if (results.length === 0) {
            return res.status(404).json({ message: 'Media Consent not found' });
        }
        res.status(200).json(results[0]);
    } catch (error) {
        console.error("Error fetching Media Consent Form:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

const UpdateMediaConsent = async (req, res) => {
    try {
        await ReunionAsync(req, res); // your custom middleware
        const {
            rescue_name,
            social_media_consent,
            description,
        } = req.body;

        const admission_no = req.params.admission_no;
        if (!admission_no) {
            return res.status(400).json({ message: "Admission number is required" });
        }

        const scanReportPath = req.files['scan_report']
            ? req.files['scan_report'].map(f => `uploads/MediaConsent/${f.filename}`)
            : null;

        // const scanReportPath = req.files['scan_report']
        //     ? `uploads/MediaConsent/${req.files['scan_report'][0].filename}`
        //     : null;

        const updateQuery = `
            UPDATE media_consent SET 
            rescue_name = ?, 
            social_media_consent = ?, 
            description = ?,
            scan_report = ?
            WHERE admission_no = ?
        `;

        const values = [
            rescue_name,
            social_media_consent,
            description,
            JSON.stringify(scanReportPath),
            admission_no
        ];

        await db.query(updateQuery, values);
        return res.status(200).json({ message: "Media Consent updated successfully!" });

    } catch (error) {
        console.error("Error in UpdateMediaConsent:", error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
}

// const deleteMediaConsent = (req, res) => {
//     const admission_no = req.params.admission_no;

//     const deletequery = "DELETE FROM media_consent WHERE admission_no = ?";
//     const values = [
//         admission_no
//     ];

//     db.query(deletequery, values, (err, data) => {
//         if (err) {
//             return res.status(500).json({ message: "Database Error", error: err });
//         }
//         res
//             .status(201)
//             .json({ message: "First Form Deleted Successfully", data: data });
//     });
// }

const createDischargeList = async (req, res) => {
    try {
        await ReunionAsync(req, res); // your custom middleware

        const {
            admission_no,
            familyRequestLetter,
            selfDeclarationLetter,
            mediaConsentLetter,
            familyIDproof,
            residentIDproof,
            aadharCard,
            udidCard,
            disabilityCertificate,
            bankPassbook,
            healthInsurance,
            medicalReport,
            dischargeSummary,
            medications,
            Clothes,
            possessionsRecovered,
            dischargeAllowance,
            travelExpenses,
            copyOfdischargeSummary,
            travelSafetyLetter,
            reunionPhoto,
            witnessSignature,
            any_other
        } = req.body;

        const getFilePath = (fieldName) =>
            req.files[fieldName] ? req.files[fieldName].map(f => `uploads/Reunion/Discharge_Checklist/${f.filename}`).join(',') : null;

        const query = `
            INSERT INTO discharge_checklist (
                admission_no, familyRequestLetter, selfDeclarationLetter, mediaConsentLetter,
                familyRequestLetterFile, selfDeclarationFile, mediaConsentFile,
                familyIDproof, familyIDproofFile,
                residentIDproof, residentIDproofFile,
                aadharCard, aadharCardFile,
                udidCard, udidCardFile,
                disabilityCertificate, disabilityCertificateFile,
                bankPassbook, bankPassbookFile,
                healthInsurance, healthInsuranceFile,
                medicalReport, medicalReportFile,
                dischargeSummary, dischargeSummaryFile,
                medications, medicationsFile,
                Clothes, ClothesFile,
                possessionsRecovered, possessionsRecoveredFile,
                dischargeAllowance, dischargeAllowanceFile,
                travelExpenses, travelExpensesFile,
                copyOfdischargeSummary, copyOfdischargeSummaryFile,
                travelSafetyLetter, travelSafetyLetterFile,
                reunionPhoto, reunionPhotoFile,
                witnessSignature, witnessSignatureFile,any_other
            ) VALUES (
                ?, ?, ?, ?,
                ?, ?, ?, ?,
                ?, ?,
                ?, ?,
                ?, ?,
                ?, ?,
                ?, ?,
                ?, ?,
                ?, ?,
                ?, ?,
                ?, ?,
                ?, ?,
                ?, ?,
                ?, ?,
                ?, ?,
                ?, ?,
                ?, ?,
                ?, ?,
                ?, ?,
                ?, ?
            )
        `;

        const values = [
            admission_no,
            familyRequestLetter,
            selfDeclarationLetter,
            mediaConsentLetter,
            getFilePath('familyRequestLetterFile'),
            getFilePath('selfDeclarationFile'),
            getFilePath('mediaConsentFile'),
            familyIDproof,
            getFilePath('familyIDproofFile'),
            residentIDproof,
            getFilePath('residentIDproofFile'),
            aadharCard,
            getFilePath('aadharCardFile'),
            udidCard,
            getFilePath('udidCardFile'),
            disabilityCertificate,
            getFilePath('disabilityCertificateFile'),
            bankPassbook,
            getFilePath('bankPassbookFile'),
            healthInsurance,
            getFilePath('healthInsuranceFile'),
            medicalReport,
            getFilePath('medicalReportFile'),
            dischargeSummary,
            getFilePath('dischargeSummaryFile'),
            medications,
            getFilePath('medicationsFile'),
            Clothes,
            getFilePath('ClothesFile'),
            possessionsRecovered,
            getFilePath('possessionsRecoveredFile'),
            dischargeAllowance,
            getFilePath('dischargeAllowanceFile'),
            travelExpenses,
            getFilePath('travelExpensesFile'),
            copyOfdischargeSummary,
            getFilePath('copyOfdischargeSummaryFile'),
            travelSafetyLetter,
            getFilePath('travelSafetyLetterFile'),
            reunionPhoto,
            getFilePath('reunionPhotoFile'),
            witnessSignature,
            getFilePath('witnessSignatureFile'),
            any_other
        ];
        const [result] = await db.query(query, values);
        if (result.affectedRows === 0) {
            return res.status(400).json({ message: "Failed to create Discharge checklist Form" });
        }
        res.status(201).json({ message: "Discharge checklist Form Created Successfully", data: result });

    }
    catch (error) {
        console.error("Error creating Discharge checklist Form:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }

}

const getReunionChecklist = async (req, res) => {
    const admission_no = req.params.admission_no;
    const query = 'SELECT * FROM discharge_checklist WHERE admission_no = ?';

    try {
        const [results] = await db.query(query, [admission_no]);
        if (results.length === 0) {
            return res.status(404).json({ message: 'Discharge Reunion not found' });
        }
        res.status(200).json(results[0]);
    } catch (error) {
        console.error("Error fetching Discharge Reunion:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}


const getReunionChecklistAll = async (req, res) => {
    const admission_no = req.params.admission_no;
    const query = 'SELECT * FROM discharge_checklist WHERE admission_no = ?';

    try {
        const [results] = await db.query(query, [admission_no]);
        if (results.length === 0) {
            return res.status(404).json({ message: 'Discharge Reunion not found' });
        }
        res.status(200).json(results[0]);
    } catch (error) {
        console.error("Error fetching Discharge Reunion:", error);
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
}

const updateChecklist = async (req, res) => {
    try {
        await ReunionAsync(req, res);
        const admission_no = req.params.admission_no;
        if (!admission_no) {
            return res.status(400).json({ message: "Admission number is required" });
        }

        const getFilePath = (field) =>
            req.files && req.files[field]
                ? req.files[field].map(f => `uploads/Reunion/Discharge_Checklist/${f.filename}`).join(',')
                : '';



        const {
            familyRequestLetter,
            selfDeclarationLetter,
            mediaConsentLetter,
            familyIDproof,
            residentIDproof,
            aadharCard,
            udidCard,
            disabilityCertificate,
            bankPassbook,
            healthInsurance,
            medicalReport,
            dischargeSummary,
            medications,
            Clothes,
            possessionsRecovered,
            dischargeAllowance,
            travelExpenses,
            copyOfdischargeSummary,
            travelSafetyLetter,
            reunionPhoto,
            witnessSignature,
            any_other
        } = req.body;

        const query = `
            UPDATE discharge_checklist SET
                familyRequestLetter = ?, selfDeclarationLetter = ?, mediaConsentLetter = ?,
                familyRequestLetterFile = ?, selfDeclarationFile = ?, mediaConsentFile = ?,
                familyIDproof = ?, familyIDproofFile = ?,
                residentIDproof = ?, residentIDproofFile = ?,
                aadharCard = ?, aadharCardFile = ?,
                udidCard = ?, udidCardFile = ?,
                disabilityCertificate = ?, disabilityCertificateFile = ?,
                bankPassbook = ?, bankPassbookFile = ?,
                healthInsurance = ?, healthInsuranceFile = ?,
                medicalReport = ?, medicalReportFile = ?,
                dischargeSummary = ?, dischargeSummaryFile = ?,
                medications = ?, medicationsFile = ?,
                Clothes = ?, ClothesFile = ?,
                possessionsRecovered = ?, possessionsRecoveredFile = ?,
                dischargeAllowance = ?, dischargeAllowanceFile = ?,
                travelExpenses = ?, travelExpensesFile = ?,
                copyOfdischargeSummary = ?, copyOfdischargeSummaryFile = ?,
                travelSafetyLetter = ?, travelSafetyLetterFile = ?,
                reunionPhoto = ?, reunionPhotoFile = ?,
                witnessSignature = ?, witnessSignatureFile = ?,
                any_other = ?
            WHERE admission_no = ?
        `;

        const values = [
            familyRequestLetter,
            selfDeclarationLetter,
            mediaConsentLetter,
            getFilePath('familyRequestLetterFile'),
            getFilePath('selfDeclarationFile'),
            getFilePath('mediaConsentFile'),
            familyIDproof,
            getFilePath('familyIDproofFile'),
            residentIDproof,
            getFilePath('residentIDproofFile'),
            aadharCard,
            getFilePath('aadharCardFile'),
            udidCard,
            getFilePath('udidCardFile'),
            disabilityCertificate,
            getFilePath('disabilityCertificateFile'),
            bankPassbook,
            getFilePath('bankPassbookFile'),
            healthInsurance,
            getFilePath('healthInsuranceFile'),
            medicalReport,
            getFilePath('medicalReportFile'),
            dischargeSummary,
            getFilePath('dischargeSummaryFile'),
            medications,
            getFilePath('medicationsFile'),
            Clothes,
            getFilePath('ClothesFile'),
            possessionsRecovered,
            getFilePath('possessionsRecoveredFile'),
            dischargeAllowance,
            getFilePath('dischargeAllowanceFile'),
            travelExpenses,
            getFilePath('travelExpensesFile'),
            copyOfdischargeSummary,
            getFilePath('copyOfdischargeSummaryFile'),
            travelSafetyLetter,
            getFilePath('travelSafetyLetterFile'),
            reunionPhoto,
            getFilePath('reunionPhotoFile'),
            witnessSignature,
            getFilePath('witnessSignatureFile'),
            any_other,
            admission_no
        ];

        await db.query(query, values);
        res.status(200).json({ message: "Discharge checklist updated successfully" });

    } catch (error) {
        console.error("Error updating Discharge checklist:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


export {
    createFamilyLetter,
    getFamilyRequestForm,
    UpdateFamilyRequestForm,
    // deleteFamilyRequest,
    getInformation,
    createSelfDeclaration,
    getSelfDeclaration,
    UpdateSelfDeclaration,
    // deleteSelfDeclaration,
    createMediaConsent,
    getMediaConsent,
    UpdateMediaConsent,
    // deleteMediaConsent,
    createDischargeList,
    getReunionChecklist,
    getReunionChecklistAll,
    updateChecklist
};