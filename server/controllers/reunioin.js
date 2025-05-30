const db = require('../db');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.resolve("uploads/Reunion/Family_Details"));
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (['f_aadhar_card', 'f_ration_card', 'govt_id'].includes(file.fieldname)) {
            cb(null, path.resolve('uploads/Reunion/Family_Details/'));
        } else if (['signature', 'photo', 'handwritten_document'].includes(file.fieldname)) {
            cb(null, path.resolve('uploads/Self_Declaration/'));
        } else if (['scan_report']) {
            cb(null, path.resolve('uploads/MediaConsent/'));
        } else {
            cb(null, path.resolve('uploads/others/')); // fallback (optional)
        }
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

// Multer upload instance
const upload = multer({ storage: storage }).fields([
    { name: 'f_aadhar_card', maxCount: 1 },
    { name: 'f_ration_card', maxCount: 1 },
    { name: 'govt_id', maxCount: 1 },
    { name: 'handwritten_document', maxCount: 1 },
    { name: 'signature', maxCount: 1 },
    { name: 'photo', maxCount: 1 },
    { name: 'scan_report', maxCount: 1 }, // ✅ added
]);


const createFamilyLetter = (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(500).json({ message: "File upload failed", error: err });
        }

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
            any_other

        } = req.body;

        // File paths
        const aadharCardPath = req.files['f_aadhar_card'] ? `uploads/Reunion/Family_Details/${req.files['f_aadhar_card'][0].filename}` : null;
        const rationCardPath = req.files['f_ration_card'] ? `uploads/Reunion/Family_Details/${req.files['f_ration_card'][0].filename}` : null;
        const govt_idPath = req.files['govt_id'] ? `uploads/Reunion/Family_Details/${req.files['govt_id'][0].filename}` : null;


        const q = "INSERT INTO family_request_form (admission_no,age,f_aadhar_card,f_ration_card,govt_id,description,rescue_name,family_relationship,f_member_name,f_member_phone,f_member_address,f_aadhar_card_no, f_ration_card_no, any_other) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        const values = [
            admissionNumber,
            f_member_age,
            aadharCardPath,
            rationCardPath,
            govt_idPath || null,
            description,
            rescue_name,
            rescue_relationship,
            f_member_name,
            f_member_phone,
            f_member_address,
            f_aadhar_card_no,
            f_ration_card_no,
            any_other
        ];

        db.query(q, values, (dbErr, data) => {
            if (dbErr) {
                return res.status(500).json({ message: "Database Error", error: dbErr });
            }
            res.status(201).json({ message: "Family Request Letter Form Created Successfully", data: data });
        });
    });
}

const getFamilyRequestForm = (req, res) => {
    const admissionNumber = req.params.admissionNumber;
    const query = 'SELECT * FROM family_request_form WHERE admission_no = ?';

    db.query(query, [admissionNumber], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Family Request Letter Form not found' });
        }

        res.json(results[0]);
    });
}

const UpdateFamilyRequestForm = (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(500).json({ message: "File upload failed", error: err });
        }

        const {
            rescue_name,
            f_member_age,
            description,
            family_relationship,
            f_member_name,
            f_member_phone,
            f_member_address
        } = req.body;

        const admission_no = req.params.admission_no;

        // Safely get file paths
        const aadharCardPath = req.files['f_aadhar_card']
            ? `uploads/Reunion/Family_Details/${req.files['f_aadhar_card'][0].filename}`
            : null;

        const rationCardPath = req.files['f_ration_card']
            ? `uploads/Reunion/Family_Details/${req.files['f_ration_card'][0].filename}`
            : null;

        // Fetch existing image paths from DB
        const selectQuery = "SELECT f_aadhar_card, f_ration_card FROM family_request_form WHERE admission_no = ?";
        db.query(selectQuery, [admission_no], (selectErr, selectData) => {
            if (selectErr) {
                return res.status(500).json({ message: "Failed to retrieve existing files", error: selectErr });
            }

            const existingAadharCard = selectData[0]?.f_aadhar_card;
            const existingRationCard = selectData[0]?.f_ration_card;

            const finalAadharCard = aadharCardPath || existingAadharCard;
            const finalRationCard = rationCardPath || existingRationCard;

            const updateQuery = `
                UPDATE family_request_form SET 
                    rescue_name = ?, 
                    age = ?, 
                    f_aadhar_card = ?, 
                    f_ration_card = ?, 
                    description = ?, 
                    family_relationship = ?, 
                    f_member_name = ?,
                    f_member_phone = ?,
                    f_member_address = ?
                WHERE admission_no = ?
            `;

            const values = [
                rescue_name,
                f_member_age,
                finalAadharCard,
                finalRationCard,
                description,
                family_relationship,
                f_member_name,
                f_member_phone,
                f_member_address,
                admission_no
            ];

            db.query(updateQuery, values, (updateErr, result) => {
                if (updateErr) {
                    return res.status(500).json({ message: "Update failed", error: updateErr });
                }

                return res.status(200).json({ message: "Family Request Letter updated successfully!" });
            });
        });
    });
};

const deleteFamilyRequest = (req,res) =>{
    const admissionNumber = req.params.admissionNumber;

    const deletequery = "DELETE FROM family_request_form WHERE admission_no = ?";
    const values = [
      admissionNumber
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

const getInformation = (req, res) => {
    const admission_no = req.params.admission_no;
    const query = "SELECT * FROM first_information WHERE admission_no = ?";

    db.query(query, [admission_no], (err, data) => {
        if (err) {
            return res.status(500).json({ message: "Database Error", error: err });
        }
        if (data.length === 0) {
            return res.status(404).json({ message: "No data found for the given admission number" });
        }
        res.status(200).json({ message: "First Information form fetched successfully", data: data });
    });
}

const createSelfDeclaration = (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(500).json({ message: "File upload failed", error: err });
        }
        const {
            rescue_name,
            admission_no,
            age,
            description
        } = req.body;

        // File paths
        const handWrittenPath = req.files['handwritten_document'] ? `uploads/Self_Declaration/${req.files['handwritten_document'][0].filename}` : null;
        const signaturePath = req.files['signature'] ? `uploads/Self_Declaration/${req.files['signature'][0].filename}` : null;
        const PhotoPath = req.files['photo'] ? `uploads/Self_Declaration/${req.files['photo'][0].filename}` : null;

        const q = `INSERT INTO self_declaration(admission_no,rescue_name,age,description,handwritten_document,signature,photo)
                VALUES(?,?,?,?,?,?,?)`;

        const values = [
            admission_no,
            rescue_name,
            age,
            description,
            handWrittenPath,
            signaturePath,
            PhotoPath
        ]

        db.query(q, values, (dbErr, data) => {
            if (dbErr) {
                return res.status(500).json({ message: "Database Error", error: dbErr });
            }
            res.status(201).json({ message: "Self Declaration Form Created Successfully", data: data });
        });

    });
}

const getSelfDeclaration = (req, res) => {
    const admission_no = req.params.admission_no;
    const query = 'SELECT * FROM self_declaration WHERE admission_no = ?';

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

const UpdateSelfDeclaration = (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            return res.status(500).json({ message: "File upload failed", error: err });
        }

        const {
            rescue_name,
            age,
            description,
        } = req.body;

        const admission_no = req.params.admission_no;

        // Safely get file paths
        const signaturePath = req.files['signature']
            ? `uploads/Self_Declaration/${req.files['signature'][0].filename}`
            : null;

        const photoPath = req.files['photo']
            ? `uploads/Self_Declaration/${req.files['photo'][0].filename}`
            : null;

        // Fetch existing image paths from DB
        const selectQuery = "SELECT signature, photo FROM self_declaration WHERE admission_no = ?";
        db.query(selectQuery, [admission_no], (selectErr, selectData) => {
            if (selectErr) {
                return res.status(500).json({ message: "Failed to retrieve existing files", error: selectErr });
            }

            const existingSignature = selectData[0]?.signature;
            const existingPhoto = selectData[0]?.photo;

            const finalSignature = signaturePath || existingSignature;
            const finalPhoto = photoPath || existingPhoto;

            const updateQuery = `
                UPDATE self_declaration SET 
                    rescue_name = ?, 
                    age = ?, 
                    description = ?, 
                    signature = ?, 
                    photo = ?
                WHERE admission_no = ?
            `;

            const values = [
                rescue_name,
                age,
                description,
                finalSignature,
                finalPhoto,
                admission_no
            ];

            db.query(updateQuery, values, (updateErr, result) => {
                if (updateErr) {
                    return res.status(500).json({ message: "Update failed", error: updateErr });
                }

                return res.status(200).json({ message: "Self Declaration updated successfully!" });
            });
        });
    });
}

const deleteSelfDeclaration = (req,res) =>{
const admission_no = req.params.admission_no;

    const deletequery = "DELETE FROM self_declaration WHERE admission_no = ?";
    const values = [
      admission_no
    ];

    db.query(deletequery, values, (err, data) => {
        if (err) {
          return res.status(500).json({ message: "Database Error", error: err });
        }
        res
          .status(201)
          .json({ message: "Self Declaration Deleted Successfully", data: data });
      });
}

const createMediaConsent = (req, res) => {
    const {
        admission_no,
        rescue_name,
        social_media_consent,
        description
    } = req.body;

    const scan_report = req.files && req.files.scan_report ? req.files.scan_report[0].path : null;

    const q = "INSERT INTO media_consent (admission_no, rescue_name, social_media_consent, scan_report, description) VALUES (?, ?, ?, ?, ?)";

    const values = [
        admission_no,
        rescue_name,
        social_media_consent,
        scan_report,
        description
    ];

    db.query(q, values, (dbErr, data) => {
        if (dbErr) {
            return res.status(500).json({ message: "Database Error", error: dbErr });
        }
        res.status(201).json({ message: "Media Consent Form Created Successfully", data: data });
    });
};


const getMediaConsent = (req,res) =>{
const admission_no = req.params.admission_no;
    const query = 'SELECT * FROM media_consent WHERE admission_no = ?';
  
    db.query(query, [admission_no], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Database error' });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ message: 'Media Consent not found' });
      }
  
      res.json(results[0]);
    });
}

const UpdateMediaConsent = (req,res) =>{
const {
    rescue_name,
    social_media_consent,
    description,
  } = req.body;

  const admission_no = req.params.admission_no;

  const updateQuery = `
    UPDATE media_consent SET 
    rescue_name = ?, 
    social_media_consent = ?, 
    description = ?
    WHERE admission_no = ?
  `;

  const values = [
    rescue_name,
    social_media_consent,
    description,
    admission_no
  ];

  db.query(updateQuery, values, (updateErr, result) => {
    if (updateErr) {
      return res.status(500).json({ message: "Update failed", error: updateErr });
    }

    return res.status(200).json({ message: "Media Consent updated successfully!" });
  });
}

const deleteMediaConsent = (req,res) =>{
    const admission_no = req.params.admission_no;

    const deletequery = "DELETE FROM media_consent WHERE admission_no = ?";
    const values = [
      admission_no
    ];

    db.query(deletequery, values, (err, data) => {
        if (err) {
          return res.status(500).json({ message: "Database Error", error: err });
        }
        res
          .status(201)
          .json({ message: "First Form Deleted Successfully", data: data });
      });
}

module.exports = {
    createFamilyLetter,
    getFamilyRequestForm,
    UpdateFamilyRequestForm,
    deleteFamilyRequest,
    getInformation,
    createSelfDeclaration,
    getSelfDeclaration,
    UpdateSelfDeclaration,
    deleteSelfDeclaration,
    createMediaConsent,
    getMediaConsent,
    UpdateMediaConsent,
    deleteMediaConsent
};