const db = require('../db');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve("uploads/Rescue_Images/"));
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });

  const upload = multer({ storage: storage }).single("rescue_image");

  const createFirstForm = (req, res) => {
    upload(req, res, (err) => {
      if (err) {
          return res
            .status(500)
            .json({ message: "File upload failed", error: err });
      }
  
      const {
        referred_by,
        from_place,
        date_time,
        police_memo,
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
      } = req.body;
      
      // Handling empty or undefined values as null
      const rescue_image_path = req.file ? `uploads/Rescue_Images/${req.file.filename}` : null;
  
      // Ensure all values are either filled or null if empty
      const q =
        "INSERT INTO first_information (referred_by, from_place, date_time, police_memo, information_public, admission_date, admission_no, rescue_name, age, rescue_status, religion, language, education, father, mother, other_relation, place, phone_no, clothing, dress_code, complexion, indentification_mark, tattoo, wound_infection, height, weight, things_carried, remark, symptoms, rescued_by, information, rescue_image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)";
  
      const values = [
        referred_by,
        from_place,
        date_time,
        police_memo,
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
        tattoo , // If tattoo is not provided, set as null
        wound_infection , // If wound_infection is not provided, set as null
        height,
        weight,
        things_carried , // If things_carried is not provided, set as null
        remark , // If remark is not provided, set as null
        symptoms, // If symptoms is not provided, set as null
        rescued_by,
        information,
        rescue_image_path
      ];
  
      db.query(q, values, (err, data) => {
        if (err) {
          return res.status(500).json({ message: "Database Error", error: err });
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
  
  module.exports = {
    createFirstForm,
    getFirstForm,
    DeleteFirstForm,
    UpdateFirstForm
  };
  