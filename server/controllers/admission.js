const multer = require('multer');
const path = require('path');
const db = require('../db');

// Storage strategy based on fieldname
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === 'rescue_image') {
            cb(null, path.resolve('uploads/Rescue_Images/'));
        } else {
            cb(null, path.resolve('uploads/Rescue_Document/'));
        }
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    },
});

// Multer upload instance
const upload = multer({ storage: storage }).fields([
    { name: 'rescue_image', maxCount: 1 },
    { name: 'govIdFile', maxCount: 1 },
    // { name: 'f_ration_card', maxCount: 1 },
    // { name: 'res_aadhar_card', maxCount: 1 }
]);

const checkAdmissionNo = (req,res) =>{
  const admission_no = req.params.admission_no;

   const query = 'SELECT * FROM first_information WHERE admission_no = ?';

  db.query(query, [admission_no], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Database query failed' });
    }

    if (results.length > 0) {
      return res.json({ exists: true });
    } else {
      return res.json({ exists: false });
    }
  });

}


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
          language1,
          language2,
          language3,
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
          mental_status,
          behaviour,
          community_ability,
          self_careCapacity,
          diagnosis,
          // symptoms,
          // rescued_by,
          // information,
          govIdType,
          govIdNumber
          // articles_carried,
          // f_member_name,
          // f_member_phone,
          // f_member_address
      } = req.body;

      // File paths
      const rescue_image_path = req.files['rescue_image'] ? `uploads/Rescue_Images/${req.files['rescue_image'][0].filename}` : null;
      const govIdFile_path = req.files['govIdFile'] ? `uploads/Rescue_Document/${req.files['govIdFile'][0].filename}` : null;
      // const f_ration_card_path = req.files['f_ration_card'] ? `uploads/FamilyDetails/${req.files['f_ration_card'][0].filename}` : null;
      // const res_aadhar_card_path = req.files['res_aadhar_card'] ? `uploads/FamilyDetails/${req.files['res_aadhar_card'][0].filename}` : null;
      console.log("rescue_image path:", rescue_image_path);
      const q = "INSERT INTO first_information (referred_by, from_place, date_time, police_memo, police_station, information_public, admission_date, admission_no, rescue_name, age, rescue_status, religion, language1, language2, language3, education, father, mother, other_relation, place, phone_no, clothing, dress_code, complexion, indentification_mark, tattoo, wound_infection, height, weight, things_carried, remark, mental_status,behaviour, community_ability, self_careCapacity, diagnosis, govIdType, govIdNumber, govIdFile, rescue_image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

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
          age || null,
          rescue_status,
          religion || null,
          language1,
          language2 || null,
          language3 || null,
          education,
          father || null,
          mother || null,
          other_relation || null,
          place || null,
          phone_no || null,
          clothing || null,
          dress_code || null,
          complexion || null,
          indentification_mark || null,
          tattoo || null,
          wound_infection || null,
          height,
          weight,
          things_carried || null,
          remark || null,
          mental_status,
          behaviour,
          community_ability,
          self_careCapacity,
          diagnosis,
          govIdType,
          govIdNumber || null,
          govIdFile_path || null,
          rescue_image_path,
          // articles_carried,
          // f_member_name,
          // f_member_phone,
          // f_member_address,
          // f_aadhar_card_path,
          // f_ration_card_path,
          // res_aadhar_card_path
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

  const getFirst2AForm = (req, res) => {
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
  };

  const getForm2Data = (req,res) =>{
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

  const getSCRBFormData = (req, res) => {
  const admission_no = req.params.admission_no;
  const query = "SELECT * FROM form_2 WHERE admission_no = ?";

  db.query(query, [admission_no], (err, data) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ message: "Database Error", error: err });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ message: "No data found for the given admission number" });
    }

    // ✅ Make sure you return a single object, not an array
    res.status(200).json({ message: "SCRB Form2 form fetched successfully", data: data[0] });
  });
};

const getSCRB2AFormData = (req,res) =>{
const admission_no = req.params.admission_no;
  const query = "SELECT * FROM form_2a WHERE admission_no = ?";

  db.query(query, [admission_no], (err, data) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ message: "Database Error", error: err });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ message: "No data found for the given admission number" });
    }

    // ✅ Make sure you return a single object, not an array
    res.status(200).json({ message: "SCRB Form2 form fetched successfully", data: data[0] });
  });
};

const getSCRB2BFormData = (req,res) =>{
  const admission_no = req.params.admission_no;
  const query = "SELECT * FROM form_2b WHERE admission_no = ?";

  db.query(query, [admission_no], (err, data) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ message: "Database Error", error: err });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ message: "No data found for the given admission number" });
    }

    // ✅ Make sure you return a single object, not an array
    res.status(200).json({ message: "SCRB Form2 form fetched successfully", data: data[0] });
  });
}

const getSCRB2CFormData = (req,res) =>{
 const admission_no = req.params.admission_no;
  const query = "SELECT * FROM form_2c WHERE admission_no = ?";

  db.query(query, [admission_no], (err, data) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ message: "Database Error", error: err });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ message: "No data found for the given admission number" });
    }

    // ✅ Make sure you return a single object, not an array
    res.status(200).json({ message: "SCRB Form2 form fetched successfully", data: data[0] });
  });
}

const getAllSCRBFormData = (req, res) => {
  const admission_no = req.params.admission_no;

  const query1 = `SELECT name_ngo, admission_no,koppu_en,rescue_name,parent_name, gender,	found_date,marital_status,language,district,police_station,addition_info,old_photo,new_photo,name_rescue,	phone_no,signature,seal FROM form_2 WHERE admission_no = ?`;
  const query2 = `SELECT name_ngo,admission_no,file_no,category,complexion,face,	addition_category,addition_complexion,addition_face FROM form_2a WHERE admission_no = ?`;
  const query3 = `SELECT name_ngo,admission_no,file_no,tatoo,addition_tatoo,scar,mole,height FROM form_2b WHERE admission_no = ?`;
  const query4 = `SELECT name_ngo, admission_no, file_no, upperdress_1, upperdress_2, lowerdress, addition_upperdress, addition_lowerdress, upperdress_color, lowerdress_color FROM form_2c WHERE admission_no = ?`;

  db.query(query1, [admission_no], (err1, results1) => {
    if (err1) return res.status(500).json({ error: err1 });

    db.query(query2, [admission_no], (err2, results2) => {
      if (err2) return res.status(500).json({ error: err2 });

      db.query(query3, [admission_no], (err3, results3) => {
        if (err3) return res.status(500).json({ error: err3 });

        db.query(query4, [admission_no], (err4, results4) => {
          if (err4) return res.status(500).json({ error: err4 });

          res.json({
            form_2: results1[0] || null,
            form_2a: results2[0] || null,
            form_2b: results3[0] || null,
            form_2c: results4[0] || null,
          });
        });
      });
    });
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
  
const getRescueDetailsPDF =(req,res) =>{
  const id = req.params.id;
  const query = 'SELECT * FROM first_information WHERE id = ?';

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Form 2B not found' });
    }

    res.json(results[0]);
  });
}

  module.exports = {
    checkAdmissionNo,
    createFirstForm,
    getFirstForm,
    DeleteFirstForm,
    UpdateFirstForm,
    getSCRBFormDatta,
    getFirst2AForm,
    getRescueDetailsPDF,
    getSCRBFormData,
    getSCRB2AFormData,
    getSCRB2BFormData,
    getSCRB2CFormData,
    getAllSCRBFormData,
    getForm2Data
  };
  