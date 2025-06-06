const db = require('../db');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, path.resolve("uploads/Resque_Condition_Images/"));
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let uploadPath;

        // Map field names to folders
        if (['summary_attach'].includes(file.fieldname)) {
            uploadPath = path.resolve('uploads/SummaryAttach/');
        } else {
            uploadPath = path.resolve('uploads/Resque_Condition_Images/');
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


// const upload = multer({ storage: storage }).single("recovery_photo");
const upload = multer({ storage: storage }).fields([
    { name: 'recovery_photo', maxCount: 1 },
    { name: 'summary_attach', maxCount: 1 },
]);


const createRescueCondition = (req, res) => {
  upload(req, res, (err) => {
    if (err) return res.status(500).json({ message: 'File Upload Error', error: err });

    const {
      admission_no,
      resident_name,
      date,
      follow_up
    } = req.body;

    const recovery_photo_path = req.file
      ? `uploads/Resque_Condition_Images/${req.file.filename}`
      : null;

    const formatDate = (isoDate) => {
      const d = new Date(isoDate);
      if (isNaN(d)) return 'Invalid';
      return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
    };

    const dateFormatted = formatDate(date);

    const q = `
        INSERT INTO rescue_condition 
          (admission_no, resident_name, date, recovery_photo, follow_up) 
        VALUES (?, ?, ?, ?, ?)
      `;

    const values = [
      admission_no,
      resident_name,
      dateFormatted,
      recovery_photo_path,
      follow_up
    ];


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
    month,
    date,
    temperature,
    bp,
    pulse,
    weight
  } = req.body;


  const formatDate = (isoDate) => {
    const d = new Date(isoDate);
    if (isNaN(d)) return null;

    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Month is 0-based
    const year = d.getFullYear();

    return `${day}-${month}-${year}`; // dd-mm-yyyy
  };


  const dateFormatted = formatDate(date);

  if (!dateFormatted) {
    return res.status(400).json({ message: "Invalid date format" });
  }

  const q = `
    INSERT INTO nurse_record 
      (admission_no, month, date, temperature, bp, pulse, weight) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    admission_no,
    month,
    dateFormatted,
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

const updateNurseRecords = (req, res) => {
  const {
    currentMonth,
    temperature,
    bp,
    pulse,
    weight,
    date
  } = req.body;

  const recordID = req.params.id;

  const formatDate = (isoDate) => {
    const d = new Date(isoDate);
    if (isNaN(d)) return null;

    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Month is 0-based
    const year = d.getFullYear();

    return `${day}-${month}-${year}`; // dd-mm-yyyy
  };


  const dateFormatted = formatDate(date);

  if (!dateFormatted) {
    return res.status(400).json({ message: "Invalid date format" });
  }

  const recordupdate = `UPDATE nurse_record SET
                       month=?,
                       date=?,
                       temperature=?,
                       bp=?,
                       pulse=?,
                       weight=?
                      WHERE id=? `;

  const values = [
    currentMonth,
    dateFormatted,
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
      date,
      follow_up
    } = req.body;

    const recovery_photo_path = req.file
      ? `uploads/Resque_Condition_Images/${req.file.filename}`
      : null;

    const formatDate = (isoDate) => {
      const d = new Date(isoDate);
      if (isNaN(d)) return 'Invalid';
      return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
    };

    const obdateFormatted = formatDate(date);

    const q = `
          INSERT INTO observation_report 
            (admission_no, resident_name, date, recovery_photo, follow_up) 
          VALUES (?, ?, ?, ?, ?)
        `;

    const values = [
      admission_no,
      resident_name,
      obdateFormatted,
      recovery_photo_path,
      follow_up
    ];

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
      date,
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

      const obdateFormatted = formatDate(date);

      const values = [
        resident_name,
        obdateFormatted,
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
      date,
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

      const dateFormatted = formatDate(date);

      const values = [
        resident_name,
        dateFormatted,
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

const createPrescription = (req, res) => {
  const {
    admission_no,
    rescue_name,
    age,
    current_date,
    op_no,
    hospital_name,
    department,
    masterHealthCheckup,
    medical_type,
    instruction,
    advice,
    follow_up,
    prescription_medicines, // <-- array of medicines
  } = req.body;

  console.log('Body received:', req.body);

  if (!admission_no) {
    return res.status(400).json({ error: 'Missing admission_no' });
  }

  const sql = `
    INSERT INTO prescription (
      admission_no, rescue_name, age, created_date, op_no, hospital_name, department,
      masterHealthCheckup, medical_type, instruction, advice, follow_up
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    admission_no,
    rescue_name,
    age,
    current_date,
    op_no,
    hospital_name,
    department,
    masterHealthCheckup,
    medical_type,
    instruction,
    advice,
    follow_up,
  ];

  db.query(sql, values, (dbErr, result) => {
    if (dbErr) {
      return res.status(500).json({ message: "Database Error", error: dbErr });
    }

    const prescription_id = result.insertId; // Get the ID of the inserted prescription

    // If no medicines, respond immediately
    if (!Array.isArray(prescription_medicines) || prescription_medicines.length === 0) {
      return res.status(201).json({ message: "Prescription Created Successfully", data: result });
    }

    // Prepare bulk insert query for medicines
    const medInsertSQL = `
      INSERT INTO prescription_medicines (
        prescription_id, medicine, medicine_type, duration, intake, med_instruction, morning, afternoon, night
      ) VALUES ?`;

    // Convert medicine array into array of arrays
    const medValues = prescription_medicines.map((med) => [
      prescription_id,
      med.medicine,
      med.medicine_type,
      med.duration,
      med.intake,
      med.med_instruction || 'Null',
      med.morning || 'Null',
      med.afternoon || 'Null',
      med.night || 'Null',
    ]);

    // Bulk insert all medicine records
    db.query(medInsertSQL, [medValues], (medErr, medResult) => {
      if (medErr) {
        return res.status(500).json({ message: "Error inserting medicines", error: medErr });
      }

      res.status(201).json({
        message: "Prescription Created Successfully with Medicines",
        prescriptionId: prescription_id,
        medicinesInserted: medResult.affectedRows,
      });
    });
  });
};

const getPrescription = (req, res) => {
  const query = `SELECT DISTINCT prescription.*,prescription_medicines.prescription_id
FROM prescription
JOIN prescription_medicines ON prescription.id = prescription_medicines.prescription_id;`;

  db.query(query, (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Database Error", error: err });
    }
    res.status(201).json({ message: "Condition Details Get Successfully", data: data });
  });
}

const getPrescriptionbyID = (req, res) => {
  const id = req.params.id;
  const query = `
    SELECT p.*, pm.*
    FROM prescription p
    LEFT JOIN prescription_medicines pm ON p.id = pm.prescription_id
    WHERE p.id = ?;
  `;

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Prescription not found' });
    }

    const prescription = {
      id: results[0].id,
      admission_no: results[0].admission_no,
      rescue_name: results[0].rescue_name,
      age: results[0].age,
      created_date: results[0].created_date,
      op_no: results[0].op_no,
      hospital_name: results[0].hospital_name,
      department: results[0].department,
      masterHealthCheckup: results[0].masterHealthCheckup,
      phone_no: results[0].phone_no,
      instruction: results[0].instruction,
      advice: results[0].advice,
      follow_up: results[0].follow_up,
      // Extracting medicines
      prescription_medicines: results.map(row => ({
        prescription_id: row.prescription_id,
        medicine: row.medicine,
        medicine_type: row.medicine_type,
        duration: row.duration,
        intake: row.intake,
        med_instruction: row.med_instruction,
        morning: row.morning,
        afternoon: row.afternoon,
        night: row.night,
      })),
    };

    res.json(prescription);
  });
};

const updatePrescription = (req, res) => {
  const id = req.params.id;
  const {
    admission_no,
    rescue_name,
    age,
    op_no,
    hospital_name,
    department,
    masterHealthCheckup,
    phone_no,
    instruction,
    advice,
    follow_up,
    prescription_medicines,
  } = req.body;

  if (!admission_no) {
    return res.status(400).json({ error: 'Missing admission_no' });
  }

  console.log("Updating prescription ID:", id);

  const sql = `
        UPDATE prescription SET
          admission_no = ?, 
          rescue_name = ?, 
          age = ?, 
          op_no = ?, 
          hospital_name = ?, 
          department = ?,
          masterHealthCheckup = ?, 
          phone_no = ?, 
          instruction = ?, 
          advice = ?, 
          follow_up = ?
        WHERE id = ?`;

  const values = [
    admission_no,
    rescue_name,
    age,
    op_no,
    hospital_name,
    department,
    masterHealthCheckup,
    phone_no,
    instruction,
    advice,
    follow_up,
    id,
  ];

  db.query(sql, values, (updateErr, result) => {
    if (updateErr) {
      return res.status(500).json({ message: 'Prescription update failed', error: updateErr });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'No prescription found with this ID' });
    }

    if (!Array.isArray(prescription_medicines) || prescription_medicines.length === 0) {
      return res.status(200).json({ message: 'Prescription updated (no medicines provided)' });
    }

    let completed = 0;
    let hasError = false;

    prescription_medicines.forEach((med) => {
      const updateMedSql = `
                UPDATE prescription_medicines SET
                  medicine = ?, 
                  medicine_type = ?, 
                  duration = ?, 
                  intake = ?, 
                  med_instruction = ?, 
                  morning = ?, 
                  afternoon = ?, 
                  night = ?
                WHERE id = ? AND prescription_id = ?
            `;

      const medValues = [
        med.medicine || '',
        med.medicine_type || '',
        med.duration || '',
        med.intake || '',
        med.med_instruction || '',
        med.morning ?? null,
        med.afternoon ?? null,
        med.night ?? null,
        med.id,
        id
      ];

      db.query(updateMedSql, medValues, (medErr) => {
        completed++;
        if (medErr && !hasError) {
          hasError = true;
          return res.status(500).json({ message: 'Error updating medicine', error: medErr });
        }

        if (completed === prescription_medicines.length && !hasError) {
          res.status(200).json({ message: 'Prescription and medicines updated successfully' });
        }
      });
    });
  });
};

const createDrVisit = (req, res) => {

  const {
    dr_name,
    hospital_name,
    date_time,
    report,
    resident_examinite
  } = req.body;

  const sql = 'INSERT INTO dr_visit (dr_name, hospital_name, date_time, report, resident_examinite) VALUES (?, ?, ?, ?, ?)';

  db.query(sql, [
    dr_name,
    hospital_name,
    date_time,
    report,
    resident_examinite
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

const getAllDrVisit = (req, res) => {
  const query = "Select * from dr_visit";

  db.query(query, (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Database Error", error: err });
    }
    res.status(201).json({ message: "Doctor Visit form Get Successfully", data: data });
  });
}

const getDrVisitbyID = (req, res) => {
  const id = req.params.id;
  const query = 'SELECT * FROM dr_visit WHERE id = ?';

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Dr Visit Records not found' });
    }

    res.json(results[0]);
  });
}

const UpdateDrVisit = (req, res) => {
  const {
    dr_name, hospital_name, date_time, resident_examinite, report
  } = req.body;

  const id = req.params.id;

  const usquery = `UPDATE dr_visit SET
                    dr_name = ?,
                    hospital_name = ?,
                    date_time = ?,
                    resident_examinite = ?, 
                    report = ?
                    WHERE id= ?`;

  const values = [
    dr_name, hospital_name, date_time, resident_examinite, report, id
  ];

  db.query(usquery, values, (updateErr, result) => {
    if (updateErr) {
      return res.status(500).json({ message: "Update failed", error: updateErr });
    }

    return res.status(200).json({ message: "Dr Visit updated successfully!" });
  });
}

const createMedicalCamp = (req, res) => {
  const {
    camp_name, hospital_name, date, camp_type, organised_by, participants, feedback, general_details
  } = req.body;

  const sql = 'INSERT INTO medical_camp (camp_name, hospital_name, date, camp_type, organised_by,participants,feedback,general_details) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

  db.query(sql, [
    camp_name, hospital_name, date, camp_type, organised_by, participants, feedback, general_details || "Null"
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

const getMedicalCamp = (req, res) => {
  const query = "Select * from medical_camp";

  db.query(query, (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Database Error", error: err });
    }
    res.status(201).json({ message: "Medical Camp form Get Successfully", data: data });
  });
}

const getMedicalCampID = (req, res) => {
  const id = req.params.id;
  const query = 'SELECT * FROM medical_camp WHERE id = ?';

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Medical Camp Records not found' });
    }

    res.json(results[0]);
  });
}

const updateMedicalCamp = (req, res) => {
  const {
    camp_name, hospital_name, date, camp_type, organised_by, participants, feedback, general_details
  } = req.body;

  const id = req.params.id;

  const usquery = `UPDATE medical_camp SET
                    camp_name = ?,
                    hospital_name = ?,
                    date = ?,
                    camp_type = ?, 
                    organised_by = ?,
                    participants = ?,
                    feedback = ?,
                    general_details = ?
                    WHERE id= ?`;

  const values = [
    camp_name, hospital_name, date, camp_type, organised_by, participants, feedback, general_details,id
  ];

  db.query(usquery, values, (updateErr, result) => {
    if (updateErr) {
      return res.status(500).json({ message: "Update failed", error: updateErr });
    }

    return res.status(200).json({ message: "Medical Camp updated successfully!" });
  });
}

const createSummary = (req, res) =>{
  upload(req, res, (err) => {
        if (err) {
            return res.status(500).json({ message: "File upload failed", error: err });
        }
        const {
            rescue_name,
            admission_no,
            date,
            report
        } = req.body;

        // File paths
        const SummaryAttachPath = req.files['summary_attach'] ? `uploads/SummaryAttach/${req.files['summary_attach'][0].filename}` : null;

        const q = `INSERT INTO reunion_summary(admission_no,rescue_name,date,summary_attach,report)
                VALUES(?,?,?,?,?)`;

        const values = [
            admission_no,
            rescue_name,
            date,
            SummaryAttachPath,
            report
        ]

        db.query(q, values, (dbErr, data) => {
            if (dbErr) {
                return res.status(500).json({ message: "Database Error", error: dbErr });
            }
            res.status(201).json({ message: "Reunion Summary Form Created Successfully", data: data });
        });

    });
}

const getSummary = (req, res) => {
  const admission_no = req.params.admission_no;
  const query = 'SELECT * FROM reunion_summary WHERE admission_no = ?';

  db.query(query, [admission_no], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Reunion Summary not found' });
    }

    res.json(results[0]);
  });
};

const updateSummary = (req, res) =>{
  upload(req, res, (err) => {
        if (err) {
            return res.status(500).json({ message: "File upload failed", error: err });
        }

        const {
            rescue_name,
            date,
            report,
        } = req.body;

        const admission_no = req.params.admission_no;

        // Safely get file paths
        const SummaryAttachPath = req.files['summary_attach']
            ? `uploads/SummaryAttach/${req.files['summary_attach'][0].filename}`
            : null;

        // Fetch existing image paths from DB
        const selectQuery = "SELECT summary_attach FROM reunion_summary WHERE admission_no = ?";
        db.query(selectQuery, [admission_no], (selectErr, selectData) => {
            if (selectErr) {
                return res.status(500).json({ message: "Failed to retrieve existing files", error: selectErr });
            }

            const existingSummaryPath = selectData[0]?.summary_attach;

            const finalSummaryAttach = SummaryAttachPath || existingSummaryPath;

            const updateQuery = `
                UPDATE reunion_summary SET 
                    rescue_name = ?, 
                    date = ?, 
                    summary_attach = ?, 
                    report = ?
                WHERE admission_no = ?
            `;

            const values = [
                rescue_name,
                date,
                finalSummaryAttach,
                report,
                admission_no
            ];

            db.query(updateQuery, values, (updateErr, result) => {
                if (updateErr) {
                    return res.status(500).json({ message: "Update failed", error: updateErr });
                }

                return res.status(200).json({ message: "Reunion Summary updated successfully!" });
            });
        });
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
  updateRescueCondition,
  createPrescription,
  getPrescription,
  getPrescriptionbyID,
  updatePrescription,
  createDrVisit,
  getAllDrVisit,
  getDrVisitbyID, UpdateDrVisit, createMedicalCamp,
  getMedicalCamp, getMedicalCampID, updateMedicalCamp,
  createSummary, getSummary, updateSummary
};