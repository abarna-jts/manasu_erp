const db = require('../db');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve("uploads/Resque_Condition_Images/"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});


const upload = multer({ storage: storage }).single("recovery_photo");


const createRescueCondition = (req, res) => {
  upload(req, res, (err) => {
    if (err) return res.status(500).json({ message: 'File Upload Error', error: err });

    const {
      admission_no,
      resident_name,
      from_date,
      to_date,
      follow_up
    } = req.body;

    console.log('Received dates:', { from_date, to_date }); // Debug log

    const recovery_photo_path = req.file
      ? `uploads/Resque_Condition_Images/${req.file.filename}`
      : null;

    const formatDate = (isoDate) => {
      const d = new Date(isoDate);
      if (isNaN(d)) return 'Invalid';
      return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
    };

    const fromFormatted = formatDate(from_date);
    const toFormatted = formatDate(to_date);
    const combined_date = `${fromFormatted} to ${toFormatted}`;

    const q = `
        INSERT INTO rescue_condition 
          (admission_no, resident_name, date, recovery_photo, follow_up) 
        VALUES (?, ?, ?, ?, ?)
      `;

    const values = [
      admission_no,
      resident_name,
      combined_date,
      recovery_photo_path,
      follow_up
    ];

    console.log(combined_date);

    db.query(q, values, (dbErr, data) => {
      if (dbErr) {
        return res.status(500).json({ message: "Database Error", error: dbErr });
      }
      res.status(201).json({ message: "Rescue Condition Created Successfully", data });
    });
  });
};


const getConditionDetails = (req, res) => {
  const query = "Select * from rescue_condition";

  db.query(query, (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Database Error", error: err });
    }
    res.status(201).json({ message: "Condition Details Get Successfully", data: data });
  });
}

const deleteConditionDetails = (req, res) => {
  const rescueId = req.params.id;

  const deletequery = "DELETE FROM rescue_condition WHERE id = ?";
  const values = [
    rescueId
  ];

  db.query(deletequery, values, (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Database Error", error: err });
    }
    res
      .status(201)
      .json({ message: "Rescue Condition Deleted Successfully", data: data });
  });
}

const getEditData = (req, res) => {
  const { id } = req.params;

  const query = 'SELECT * FROM rescue_condition WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('DB error:', err);
      return res.status(500).send('Server error');
    }

    if (result.length === 0) {
      return res.status(404).send('Rescue Condition not found');
    }

    res.json({
      message: "Rescue Condition Fetched Successfully", data: result[0]
    });
  });
};


const createRecord = (req, res) => {
  console.log("req.body:", req.body);

  const {
    admission_no,
    currentMonth,
    from_date,
    to_date,
    temperature,
    bp,
    pulse,
    weight
  } = req.body;

  console.log('Received Dates:', { from_date, to_date });

  const formatDate = (isoDate) => {
    const d = new Date(isoDate);
    if (isNaN(d)) return null;

    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Month is 0-based
    const year = d.getFullYear();

    return `${day}-${month}-${year}`; // dd-mm-yyyy
  };


  const fromFormatted = formatDate(from_date);
  const toFormatted = formatDate(to_date);

  if (!fromFormatted || !toFormatted) {
    return res.status(400).json({ message: "Invalid date format" });
  }

  const recordDate = `${fromFormatted} to ${toFormatted}`;

  const q = `
    INSERT INTO nurse_record 
      (admission_no, month, date, temperature, bp, pulse, weight) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    admission_no,
    currentMonth,
    recordDate,
    temperature,
    bp,
    pulse,
    weight
  ];

  db.query(q, values, (dbErr, data) => {
    if (dbErr) {
      return res.status(500).json({ message: "Database Error", error: dbErr });
    }
    res.status(201).json({ message: "Nurse Record Sheet Created Successfully", data });
  });
};

const updateNurseRecords = (req,res) =>{
  const{
    currentMonth,
    temperature,
    bp,
    pulse,
    weight,
    from_date,
    to_date
  }= req.body;

  const recordID = req.params.id;

  const formatDate = (isoDate) => {
    const d = new Date(isoDate);
    if (isNaN(d)) return null;

    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Month is 0-based
    const year = d.getFullYear();

    return `${day}-${month}-${year}`; // dd-mm-yyyy
  };


  const fromFormatted = formatDate(from_date);
  const toFormatted = formatDate(to_date);

  if (!fromFormatted || !toFormatted) {
    return res.status(400).json({ message: "Invalid date format" });
  }

  const recordDate = `${fromFormatted} to ${toFormatted}`;

  const recordupdate=`UPDATE nurse_record SET
                       month=?,
                       date=?,
                       temperature=?,
                       bp=?,
                       pulse=?,
                       weight=?
                      WHERE id=? `;

  const values = [
    currentMonth,
    recordDate,
    temperature,
    bp,
    pulse,
    weight,
    recordID
  ];

  db.query(recordupdate, values, (updateErr, result) => {
    if (updateErr) {
      return res.status(500).json({ message: "Update failed", error: updateErr });
    }

    return res.status(200).json({ message: "Nurse Record updated successfully!" });
  });
}


const createDrConsultant = (req, res) => {
  const { rescue_name,
    admissionNumber,
    rescue_age,
    rescue_gender,
    mfm_no,
    ward_no,
    bed_no,
    consultants,
    dr_name,
    dr_qualification,
    consult_dr_name,
    consult_dr_quali
  } = req.body;
  const sql = 'INSERT INTO dr_consultancy (rescue_name, admissionNumber, rescue_age, rescue_gender, mfm_no, ward_no, bed_no, consultants, dr_name, dr_qualification, consult_dr_name, consult_dr_quali) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(sql, [
    rescue_name,
    admissionNumber,
    rescue_age,
    rescue_gender,
    mfm_no,
    ward_no,
    bed_no,
    consultants,
    dr_name,
    dr_qualification,
    consult_dr_name,
    consult_dr_quali
  ], (err, result) => {
    if (err) {
      console.error('Error inserting data: ' + err.stack);
      res.status(500).send('Error inserting data');
      return;
    }
    console.log('Data inserted successfully');
    res.status(200).send('Data inserted successfully');
  });
}

const getDrConsultant = (req, res) => {
  const admissionNumber = req.params.admissionNumber;
  const query = 'SELECT * FROM dr_consultancy WHERE admissionNumber = ?';

  db.query(query, [admissionNumber], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Doctor Consultant not found' });
    }

    res.json(results[0]);
  });
}

const UpdateDrConsultant = (req, res) => {
  const {
    rescue_name,
    rescue_age,
    rescue_gender,
    mfm_no,
    ward_no,
    bed_no,
    consultants,
    dr_name,
    dr_qualification,
    consult_dr_name,
    consult_dr_quali
  } = req.body;

  const admissionNumber = req.params.admissionNumber;

  const updateQuery = `
    UPDATE dr_consultancy SET 
      rescue_name = ?, 
      rescue_age = ?, 
      rescue_gender = ?,
      mfm_no = ?,
      ward_no = ?,
      bed_no = ?,
      consultants = ?,
      dr_name = ?,
      dr_qualification = ?,
      consult_dr_name = ?,
      consult_dr_quali = ?
    WHERE admissionNumber = ?
  `;

  const values = [
    rescue_name,
    rescue_age,
    rescue_gender,
    mfm_no,
    ward_no,
    bed_no,
    consultants,
    dr_name,
    dr_qualification,
    consult_dr_name,
    consult_dr_quali,
    admissionNumber
  ];

  db.query(updateQuery, values, (updateErr, result) => {
    if (updateErr) {
      return res.status(500).json({ message: "Update failed", error: updateErr });
    }

    return res.status(200).json({ message: "Self Declaration updated successfully!" });
  });
};


const getNurseRecord = (req, res) => {
  const query = `
    SELECT 
      nurse_record.*, 
      first_information.rescue_name 
    FROM 
      nurse_record 
    JOIN 
      first_information 
    ON 
      nurse_record.admission_no = first_information.admission_no
  `;

  db.query(query, (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Database Error", error: err });
    }
    res.status(201).json({ message: "Nurse Records Retrieved Successfully", data: data });
  });
};

const getNurseRecordbyID = (req, res) => {
  const id = req.params.id;
    const query = 'SELECT * FROM nurse_record WHERE id = ?';

    db.query(query, [id], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Database error' });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'Nurse Records not found' });
      }

      res.json(results[0]);
    });
};


const createObservationReport = (req, res) => {
  upload(req, res, (err) => {
    if (err) return res.status(500).json({ message: 'File Upload Error', error: err });

    const {
      admission_no,
      resident_name,
      from_date,
      to_date,
      follow_up
    } = req.body;

    console.log('Received dates:', { from_date, to_date }); // Debug log

    const recovery_photo_path = req.file
      ? `uploads/Resque_Condition_Images/${req.file.filename}`
      : null;

    const formatDate = (isoDate) => {
      const d = new Date(isoDate);
      if (isNaN(d)) return 'Invalid';
      return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
    };

    const obfromFormatted = formatDate(from_date);
    const obtoFormatted = formatDate(to_date);
    const combined_date2 = `${obfromFormatted} to ${obtoFormatted}`;

    const q = `
          INSERT INTO observation_report 
            (admission_no, resident_name, date, recovery_photo, follow_up) 
          VALUES (?, ?, ?, ?, ?)
        `;

    const values = [
      admission_no,
      resident_name,
      combined_date2,
      recovery_photo_path,
      follow_up
    ];

    console.log(combined_date2);

    db.query(q, values, (dbErr, data) => {
      if (dbErr) {
        return res.status(500).json({ message: "Database Error", error: dbErr });
      }
      res.status(201).json({ message: "Rescue Condition Created Successfully", data });
    });
  });
}

const getObservationReport = (req, res) => {
  const query = "Select * from observation_report";

  db.query(query, (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Database Error", error: err });
    }
    res.status(201).json({ message: "Condition Details Get Successfully", data: data });
  });
}

const showObservationReport = (req, res) => {
  const id = req.params.id;
  const query = 'SELECT * FROM observation_report WHERE id = ?';

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Observation Report not found' });
    }

    res.json(results[0]);
  });
}

const updateObservationReport = (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(500).json({ message: "File upload failed", error: err });
    }
    const {
      resident_name,
      from_date,
      to_date,
      follow_up,
    } = req.body;

    const admission_no = req.params.admission_no;

    const newRecoveryPhoto = req.file ? `uploads/Resque_Condition_Images/${req.file.filename}` : null;

    const editQuery = "SELECT recovery_photo FROM observation_report WHERE admission_no = ?";
    db.query(editQuery, [admission_no], (editErr, editData) => {
      if (editErr) {
        return res.status(500).json({ message: "Failed to retrieve logo", error: editErr });
      }

      const existingRecoveryPath = editData[0]?.recovery_photo;
      const finalRecoveryPath = newRecoveryPhoto || existingRecoveryPath;

      const updateQuery = `
        UPDATE observation_report SET
        resident_name=?,
        date = ?,
        recovery_photo = ?,
        follow_up = ?
        WHERE admission_no = ?`;

      const formatDate = (isoDate) => {
        const d = new Date(isoDate);
        if (isNaN(d)) return 'Invalid';
        return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
      };

      const obfromFormatted = formatDate(from_date);
      const obtoFormatted = formatDate(to_date);
      const observationDate = `${obfromFormatted} to ${obtoFormatted}`;

      const values = [
        resident_name,
        observationDate,
        finalRecoveryPath,
        follow_up,
        admission_no
      ]

      db.query(updateQuery, values, (updateErr, data) => {
        if (updateErr) {
          return res.status(500).json({ message: "Update failed", error: updateErr });
        }

        if (newRecoveryPhoto && existingRecoveryPath) {
          // Delete the old logo file
          fs.unlink(existingRecoveryPath, (fsErr) => {
            if (fsErr) console.warn("Failed to delete old logo:", fsErr);
          });
        }

        res.status(200).json({ message: "Observation updated successfully" });
      });

    })

  });
};

const showRescueCondition = (req, res) => {
  const id = req.params.id;
  const query = 'SELECT * FROM rescue_condition WHERE id = ?';

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Observation Report not found' });
    }

    res.json(results[0]);
  });
}

const updateRescueCondition = (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(500).json({ message: "File upload failed", error: err });
    }
    const {
      resident_name,
      from_date,
      to_date,
      follow_up,
    } = req.body;

    const admission_no = req.params.admission_no;

    const newRecoveryPhoto = req.file ? `uploads/Resque_Condition_Images/${req.file.filename}` : null;

    const editQuery = "SELECT recovery_photo FROM observation_report WHERE admission_no = ?";
    db.query(editQuery, [admission_no], (editErr, editData) => {
      if (editErr) {
        return res.status(500).json({ message: "Failed to retrieve logo", error: editErr });
      }

      const existingRecoveryPath = editData[0]?.recovery_photo;
      const finalRecoveryPath = newRecoveryPhoto || existingRecoveryPath;

      const updateQuery = `
        UPDATE rescue_condition SET
        resident_name=?,
        date = ?,
        recovery_photo = ?,
        follow_up = ?
        WHERE admission_no = ?`;

      const formatDate = (isoDate) => {
        const d = new Date(isoDate);
        if (isNaN(d)) return 'Invalid';
        return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
      };

      const rcfromFormatted = formatDate(from_date);
      const rctoFormatted = formatDate(to_date);
      const rescueConditionDate = `${rcfromFormatted} to ${rctoFormatted}`;

      const values = [
        resident_name,
        rescueConditionDate,
        finalRecoveryPath,
        follow_up,
        admission_no
      ]

      db.query(updateQuery, values, (updateErr, data) => {
        if (updateErr) {
          return res.status(500).json({ message: "Update failed", error: updateErr });
        }

        if (newRecoveryPhoto && existingRecoveryPath) {
          // Delete the old logo file
          fs.unlink(existingRecoveryPath, (fsErr) => {
            if (fsErr) console.warn("Failed to delete old logo:", fsErr);
          });
        }

        res.status(200).json({ message: "Observation updated successfully" });
      });

    })

  });
}


module.exports = {
  createRescueCondition,
  getConditionDetails,
  deleteConditionDetails,
  getEditData,
  getNurseRecordbyID,
  createRecord,
  updateNurseRecords,
  createDrConsultant,
  getDrConsultant,
  UpdateDrConsultant,
  getNurseRecord,
  createObservationReport,
  getObservationReport,
  showObservationReport,
  updateObservationReport,
  showRescueCondition,
  updateRescueCondition
};