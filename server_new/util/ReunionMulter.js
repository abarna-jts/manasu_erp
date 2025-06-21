import util from 'util';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
// Storage strategy based on fieldname
// Define multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let uploadPath;

        // Map field names to folders
        if (['f_aadhar_card', 'f_ration_card', 'govt_id', 'r_aadhar_card', 'r_ration_card'].includes(file.fieldname)) {
            uploadPath = path.resolve('uploads/Reunion/Family_Details/');
        } else if (['signature', 'photo', 'handwritten_document'].includes(file.fieldname)) {
            uploadPath = path.resolve('uploads/Self_Declaration/');
        } else if (['scan_report'].includes(file.fieldname)) {
            uploadPath = path.resolve('uploads/MediaConsent/');
        } else {
            // Default fallback for Discharge_Checklist and others
            uploadPath = path.resolve('uploads/Reunion/Discharge_Checklist/');
        }

        // Create the folder if it doesn't exist
        fs.mkdirSync(uploadPath, { recursive: true });

        // Pass the folder to multer
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

// Define upload fields
const upload = multer({ storage: storage }).fields([
    { name: 'f_aadhar_card', maxCount: 1 },
    { name: 'f_ration_card', maxCount: 1 },
    { name: 'r_aadhar_card', maxCount: 1 },
    { name: 'r_ration_card', maxCount: 1 },
    { name: 'govt_id', maxCount: 1 },
    { name: 'signature', maxCount: 1 },
    { name: 'photo', maxCount: 1 },
    { name: 'handwritten_document', maxCount: 1 },
    { name: 'scan_report', maxCount: 1 },
    { name: 'familyRequestLetterFile', maxCount: 1 },
    { name: 'selfDeclarationFile', maxCount: 1 },
    { name: 'mediaConsentFile', maxCount: 1 },
    { name: 'familyIDproofFile', maxCount: 1 },
    { name: 'aadharCardFile', maxCount: 1 },
    { name: 'udidCardFile', maxCount: 1 },
    { name: 'disabilityCertificateFile', maxCount: 1 },
    { name: 'bankPassbookFile', maxCount: 1 },
    { name: 'healthInsuranceFile', maxCount: 1 },
    { name: 'medicalReportFile', maxCount: 1 },
    { name: 'dischargeSummaryFile', maxCount: 1 },
    { name: 'medicationsFile', maxCount: 1 },
    { name: 'ClothesFile', maxCount: 1 },
    { name: 'possessionsRecoveredFile', maxCount: 1 },
    { name: 'travelExpensesFile', maxCount: 1 },
    { name: 'copyOfdischargeSummaryFile', maxCount: 1 },
    { name: 'travelSafetyLetterFile', maxCount: 1 },
    { name: 'reunionPhotoFile', maxCount: 1 },
    { name: 'witnessSignatureFile', maxCount: 1 },
    { name: 'residentIDproofFile', maxCount: 1 },
]);

// ✅ Now promisify AFTER upload is declared
const ReunionAsync = util.promisify(upload);

export{ upload, ReunionAsync };
