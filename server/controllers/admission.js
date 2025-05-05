const multer = require('multer');
const path = require('path');
const db = require('../db');

// Storage strategy based on fieldname
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === 'rescue_image') {
            cb(null, path.resolve('uploads/Rescue_Images/'));
        } else {
            cb(null, path.resolve('uploads/FamilyDetails/'));
        }
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

// Multer upload instance
const upload = multer({ storage: storage }).fields([
    { name: 'rescue_image', maxCount: 1 },
    { name: 'f_aadhar_card', maxCount: 1 },
    { name: 'f_ration_card', maxCount: 1 },
    { name: 'res_aadhar_card', maxCount: 1 }
]);


const createFirstForm = (req, res) => {
  upload(req, res, (err) => {
      if (err) {
          return res.status(500).json({ message: "File upload failed", error: err });
      }

      const {
          referred_by,
          from_place,
          date_time,
          police_memo,
          police_station,
          information_public,
          admission_date,
          admission_no,
          rescue_name,
          age,
          rescue_status,
          religion,
          language,
          education,
          father,
          mother,
          other_relation,
          place,
          phone_no,
          clothing,
          dress_code,
          complexion,
          indentification_mark,
          tattoo,
          wound_infection,
          height,
          weight,
          things_carried,
          remark,
          symptoms,
          rescued_by,
          information,
          articles_carried,
          f_member_name,
          f_member_phone,
          f_member_address
      } = req.body;

      // File paths
      const rescue_image_path = req.files['rescue_image'] ? `uploads/Rescue_Images/${req.files['rescue_image'][0].filename}` : null;
      const f_aadhar_card_path = req.files['f_aadhar_card'] ? `uploads/FamilyDetails/${req.files['f_aadhar_card'][0].filename}` : null;
      const f_ration_card_path = req.files['f_ration_card'] ? `uploads/FamilyDetails/${req.files['f_ration_card'][0].filename}` : null;
      const res_aadhar_card_path = req.files['res_aadhar_card'] ? `uploads/FamilyDetails/${req.files['res_aadhar_card'][0].filename}` : null;

      const q = "INSERT INTO first_information (referred_by, from_place, date_time, police_memo, police_station, information_public, admission_date, admission_no, rescue_name, age, rescue_status, religion, language, education, father, mother, other_relation, place, phone_no, clothing, dress_code, complexion, indentification_mark, tattoo, wound_infection, height, weight, things_carried, remark, symptoms, rescued_by, information, rescue_image, articles_carried, f_member_name, f_member_phone, f_member_address, f_aadhar_card, f_ration_card, res_aadhar_card) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

      const values = [
          referred_by,
          from_place,
          date_time,
          police_memo,
          police_station,
          information_public,
          admission_date,
          admission_no,
          rescue_name,
          age,
          rescue_status,
          religion,
          language,
          education,
          father,
          mother,
          other_relation,
          place,
          phone_no,
          clothing,
          dress_code,
          complexion,
          indentification_mark,
          tattoo || null,
          wound_infection || null,
          height,
          weight,
          things_carried || null,
          remark || null,
          symptoms || null,
          rescued_by,
          information,
          rescue_image_path,
          articles_carried,
          f_member_name,
          f_member_phone,
          f_member_address,
          f_aadhar_card_path,
          f_ration_card_path,
          res_aadhar_card_path
      ];

      db.query(q, values, (dbErr, data) => {
          if (dbErr) {
              return res.status(500).json({ message: "Database Error", error: dbErr });
          }
          res.status(201).json({ message: "First Form Created Successfully", data: data });
      });
  });
};


  const getFirstForm = (req, res) => {
    const query="Select * from first_information";

    db.query(query, (err, data) => {
        if(err){
            return res.status(500).json({message:"Database Error", error:err});
        }
        res.status(201).json({message:"First Information form Get Successfully", data:data});
    });
  };

  const DeleteFirstForm = (req, res) =>{
    const rescueId = req.params.id;

    const deletequery = "DELETE FROM first_information WHERE id = ?";
    const values = [
      rescueId
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

  const UpdateFirstForm = (req,res) =>{
    upload(req, res, (err) => {
      if (err) {
        return res.status(500).json({ message: "File upload failed", error: err });
      }
  
      const {
        referred_by,
        from_place,
        date_time,
        police_memo,
        information_public,
        admission_date,
        admission_no
      } = req.body;
  
      const rescueId = req.params.id;
      const newRescueImage = req.file ? `uploads/Rescue_Images/${req.file.filename}` : null;
  
      // Fetch the existing logo path
      const selectQuery = "SELECT rescue_image FROM first_information WHERE id = ?";
      db.query(selectQuery, [rescueId], (selectErr, selectData) => {
        if (selectErr) {
          return res.status(500).json({ message: "Failed to retrieve Rescue Image", error: selectErr });
        }
  
        const existingRescuePath = selectData[0]?.rescue_image;
        const finalRescuePath = newRescueImage || existingRescuePath;
  
        // Update the catalogue
        const updateQuery = `
          UPDATE first_information SET 
            referred_by = ?, 
            from_place = ?, 
            date_time = ?, 
            police_memo = ?, 
            information_public = ?, 
            admission_date = ?, 
            admission_no = ?,
            rescue_image = ?
          WHERE id = ?`;
  
          const values = [
            referred_by,
            from_place,
            date_time,
            police_memo,
            information_public,
            admission_date,
            admission_no,
            finalRescuePath,
            rescueId             
          ];
          
  
        db.query(updateQuery, values, (updateErr, data) => {
          if (updateErr) {
            return res.status(500).json({ message: "Update failed", error: updateErr });
          }
        
          if (newRescueImage && existingRescuePath) {
            fs.unlink(existingRescuePath, (fsErr) => {
              if (fsErr) console.warn("Failed to delete old logo:", fsErr);
            });
          }
        
          res.status(200).json({ message: "Rescue updated successfully" });
        });
        
      });
    });
  }


  // getting scrb form data
  const getSCRBFormDatta = (req,res) =>{
    const { admissionNumber } = req.params;

    const query = 'SELECT * FROM first_information WHERE admission_no = ?';
    db.query(query, [admissionNumber], (err, result) => {
      if (err) {
        console.error('DB error:', err);
        return res.status(500).send('Server error');
      }

      if (result.length === 0) {
        return res.status(404).send('Admission number not found');
      }

      res.json(result[0]); // send back the found record
    });
    
  }
  
  module.exports = {
    createFirstForm,
    getFirstForm,
    DeleteFirstForm,
    UpdateFirstForm,
    getSCRBFormDatta
  };
  