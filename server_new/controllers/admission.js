const multer = require('multer');
const path = require('path');
const db = require('../db');
const fs = require('fs');
const { uploadAsync } = require('../util/uploadMulter');


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
  { name: 'attach_policeMemo', maxCount: 1 },
  { name: 'govIdFile', maxCount: 1 },
  // { name: 'f_ration_card', maxCount: 1 },
  // { name: 'res_aadhar_card', maxCount: 1 }
]);

const checkAdmissionNo = async (req, res) => {
  const admission_no = req.params.admission_no;

  if (!admission_no) {
    return res.status(400).json({ error: 'Admission number is required' });
  }

  const query = 'SELECT * FROM first_information WHERE admission_no = ?';

  try {
    const [results] = await db.promise().query(query, [admission_no]);

    if (results.length > 0) {
      return res.json({ exists: true });
    } else {
      return res.json({ exists: false });
    }
  } catch (err) {
    console.error('Database query failed:', err);
    return res.status(500).json({ error: 'Internal server error in checkAdmissionNo' });
  }
};


const createFirstForm = async (req, res) => {
  try {
    // Await multer file upload
    await uploadAsync(req, res);

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
      phone_no_two,
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
      govIdType,
      govIdNumber
    } = req.body;

    // File paths
    const rescue_image_path = req.files['rescue_image'] ? `uploads/Rescue_Images/${req.files['rescue_image'][0].filename}` : null;
    const policeMemoPath = req.files['attach_policeMemo'] ? `uploads/Rescue_Document/${req.files['attach_policeMemo'][0].filename}` : null;
    const govIdFile_path = req.files['govIdFile'] ? `uploads/Rescue_Document/${req.files['govIdFile'][0].filename}` : null;

    const q = `
      INSERT INTO first_information (
        referred_by, from_place, date_time, police_memo, attach_policeMemo,
        police_station, information_public, admission_date, admission_no, rescue_name,
        age, rescue_status, religion, language1, language2, language3,
        education, father, mother, other_relation, place,
        phone_no, phone_no_two, clothing, dress_code, complexion,
        indentification_mark, tattoo, wound_infection, height, weight,
        things_carried, remark, mental_status, behaviour, community_ability,
        self_careCapacity, diagnosis, govIdType, govIdNumber, govIdFile,
        rescue_image
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      referred_by, from_place, date_time, police_memo, policeMemoPath,
      police_station, information_public, admission_date, admission_no, rescue_name,
      age || null, rescue_status, religion || null, language1, language2 || null, language3 || null,
      education, father || null, mother || null, other_relation || null, place || null,
      phone_no || null, phone_no_two || null, clothing || null, dress_code || null, complexion || null,
      indentification_mark || null, tattoo || null, wound_infection || null, height, weight,
      things_carried || null, remark || null, mental_status, behaviour, community_ability,
      self_careCapacity, diagnosis, govIdType, govIdNumber || null, govIdFile_path || null,
      rescue_image_path
    ];

    // Promise-based query
    const [result] = await db.promise().query(q, values);

    return res.status(201).json({ message: "First Form Created Successfully", data: result });

  } catch (err) {
    console.error("Create First Form Error:", err);
    return res.status(500).json({ message: "Server error while creating first form", error: err });
  }
};

const getFirstForm = async (req, res) => {
  const query = "SELECT * FROM first_information";
  try {
    const [results] = await db.promise().query(query);
    res.status(200).json({ message: "First Information form fetched successfully", data: results });
  } catch (err) {
    console.error("SQL Error:", err);
    res.status(500).json({ error: 'Database query failed' });
  }
};



const getFirst2AForm = (req, res) => {
  const admission_no = req.params.admission_no;
  // Optional: Check if param is missing
  if (!admission_no) {
    return res.status(400).json({ error: 'Admission number is required' });
  }

  const query = "SELECT * FROM first_information WHERE admission_no = ?";

  try {
    db.query(query, [admission_no], (err, data) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ message: "Database Error", error: err });
      }
      if (data.length === 0) {
        return res.status(404).json({ message: "No data found for the given admission number" });
      }
      res.status(200).json({ message: "First Information form fetched successfully", data: data });
    });
  } catch (err) {
    // This will only catch synchronous errors before db.query is called
    console.error('Unexpected error in getting SCRB Form1:', err);
    return res.status(500).json({ error: 'Internal server error in getting SCRB Form1' });
  }
};


const getForm2Data = (req, res) => {
  const admission_no = req.params.admission_no;

  if (!admission_no) {
    return res.status(400).json({ error: 'Admission number is required' });
  }


  const query = "SELECT * FROM first_information WHERE admission_no = ?";

  try{
    db.query(query, [admission_no], (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Database Error", error: err });
    }
    if (data.length === 0) {
      return res.status(404).json({ message: "No data found for the given admission number" });
    }
    res.status(200).json({ message: "First Information form fetched successfully", data: data });
  });
  } catch (err) {
    // This will only catch synchronous errors before db.query is called
    console.error('Unexpected error in getting SCRB Form1:', err);
    return res.status(500).json({ error: 'Internal server error in getting SCRB Form1' });
  }
  
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

const getSCRB2AFormData = (req, res) => {
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

const getSCRB2BFormData = (req, res) => {
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

const getSCRB2CFormData = (req, res) => {
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



const DeleteFirstForm = (req, res) => {
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

const UpdateFirstForm = (req, res) => {
  try {
    upload(req, res, (err) => {
      if (err) {
        return res.status(500).json({ message: "File upload failed", error: err });
      }
      try {
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
          dress_code,
          complexion,
          indentification_mark,
          wound_infection,
          height,
          weight,
          phone_no,
          phone_no_two,
          clothing,
          things_carried,
          remark,
          mental_status,
          behaviour,
          community_ability,
          self_careCapacity,
          govIdType,
          govIdNumber,
          diagnosis,
          tattoo
        } = req.body;

        const rescueId = req.params.id;
        const newRescueImage = req.files['rescue_image']
          ? `uploads/Rescue_Images/${req.files['rescue_image'][0].filename}`
          : null;
        // const newRescueImage = req.file ? `uploads/Rescue_Images/${req.file.filename}` : null;
        const newAttachPoliceMemo = req.file ? `uploads/Rescue_Document/${req.file.filename}` : null;
        const newgovIdFile = req.file ? `uploads/Rescue_Document/${req.file.filename}` : null;

        // Fetch the existing logo path
        const selectQuery = "SELECT rescue_image, attach_policeMemo, govIdFile FROM first_information WHERE id = ?";
        db.query(selectQuery, [rescueId], (selectErr, selectData) => {
          if (selectErr) {
            return res.status(500).json({ message: "Failed to retrieve Rescue Image", error: selectErr });
          }

          const existingRescuePath = selectData[0]?.rescue_image;
          const finalRescuePath = newRescueImage || existingRescuePath;

          const existingPoliceMemo = selectData[0]?.attach_policeMemo;
          const finalPoliceMemo = newAttachPoliceMemo || existingPoliceMemo;

          const existingGovtID = selectData[0]?.govIdFile;
          const finalGovtID = newgovIdFile || existingGovtID;

          // Update the catalogue
          const updateQuery = `
        UPDATE first_information SET 
          referred_by = ?, 
          from_place = ?, 
          date_time = ?, 
          police_memo = ?, 
          attach_policeMemo = ?,
          police_station = ?,
          information_public = ?, 
          admission_date = ?, 
          admission_no = ?,
          rescue_name = ?,
          age = ?,
          rescue_status = ?,
          religion = ?,
          language1 = ?,
          language2 = ?,
          language3 = ?,
          education = ?,
          father = ?,
          mother = ?,
          other_relation = ?,
          place = ?,
          phone_no = ?,
          phone_no_two = ?,
          clothing = ?,
          dress_code = ?,
          complexion = ?,
          indentification_mark = ?,
          tattoo = ?,
          wound_infection = ?,
          height = ?,
          weight = ?,
          things_carried = ?,
          remark = ?,
          mental_status = ?,
          behaviour = ?,
          community_ability = ?,
          self_careCapacity = ?,
          diagnosis = ?,
          govIdType = ?,
          govIdNumber = ?,
          govIdFile = ?,
          rescue_image = ?
        WHERE id = ?`;


          const values = [
            referred_by,
            from_place,
            date_time,
            police_memo,
            finalPoliceMemo,
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
            phone_no_two,
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
            govIdType,
            govIdNumber,
            finalGovtID,
            finalRescuePath,
            rescueId
          ];

          console.log("Final Rescue Image Path:", finalRescuePath);


          db.query(updateQuery, values, (updateErr, data) => {
            if (updateErr) {
              return res.status(500).json({ message: "Update failed", error: updateErr });
            }

            if (newRescueImage && existingRescuePath && fs.existsSync(existingRescuePath)) {
              fs.unlink(existingRescuePath, (fsErr) => {
                if (fsErr) console.warn("Failed to delete old logo:", fsErr);
              });
            }

            if (newAttachPoliceMemo && existingPoliceMemo) {
              fs.unlink(existingPoliceMemo, (fsErr) => {
                if (fsErr) console.warn("Failed to delete Police Memo:", fsErr);
              });
            }

            if (newgovIdFile && existingGovtID) {
              fs.unlink(existingGovtID, (fsErr) => {
                if (fsErr) console.warn("Failed to delete Government ID type:", fsErr);
              });
            }

            res.status(200).json({ message: "Rescue updated successfully" });
          });

        });
      } catch (uInnerErr) {
        console.log("Uploading file error on updating first info", uInnerErr);
        return res.status(500).json({ message: "Internal server error", error: innerError });
      }
    });
  }
  catch (uOuterErr) {
    console.log("Backend server error in updating first Info", uOuterErr);
    return res.status(500).json({ message: "Unexpected error", error: outerError });
  }
}


// getting scrb form data
const getSCRBFormDatta = (req, res) => {
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

const getRescueDetailsPDF = (req, res) => {
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

const UpdateStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const query = 'UPDATE first_information SET resident_status = ? WHERE id = ?';

    db.query(query, [status, id], (err, result) => {
      if (err) {
        console.error('Database update error:', err);
        return res.status(500).json({ message: 'Database error', error: err });
      }

      return res.status(200).json({ message: 'Status updated successfully', result });
    });
  }
  catch (error) {
    console.error('Unexpected server error in updating Status:', error);
    return res.status(500).json({ message: 'Server error in updating Status', error });
  }

};

const getReunionData = (req, res) => {
  const query = `Select * from first_information where resident_status='Reunion' `;

  db.query(query, (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Database Error", error: err });
    }
    res.status(201).json({ message: "First Information form Get Successfully", data: data });
  });
}

const getStatusData = (req, res) => {
  const { status } = req.params;

  const query = `SELECT * FROM first_information WHERE resident_status = ?`;
  const values = [status];

  db.query(query, values, (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Database Error", error: err });
    }
    res.status(200).json({
      message: "First Information fetched successfully",
      data: data,
    });
  });
};

const getStatusById = (req, res) => {
  const id = req.params.id;

  const query = 'SELECT id, resident_status FROM first_information WHERE id = ?';
  db.query(query, [id], (err, results) => {
    if (err) {
      console.error('Error fetching resident_status:', err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Record not found' });
    }

    res.json(results[0]); // Return the matching record
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
  getForm2Data,
  UpdateStatus,
  getReunionData, getStatusData, getStatusById
};
