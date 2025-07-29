
import db from '../db.js';
import { residencyAsync } from '../util/residentMulter.js';
import fs from 'fs';
import transporter from '../config/mailer.js';

const createRescueCondition = async (req, res) => {
  try {
    await residencyAsync(req, res);

    const {
      admission_no,
      resident_name,
      date,
      follow_up
    } = req.body;

    // const recovery_photo_path = req.file
    //   ? `uploads/Resque_Condition_Images/${req.file.filename}`
    //   : null;

    const resrecovery_photo_path = req.files?.['rescue_recovery_photo']
      ? req.files['rescue_recovery_photo'].map(file => `uploads/Resque_Condition_Images/${file.filename}`)
      : [];

    // const resrecovery_photo_path = req.files['rescue_recovery_photo']
    //   ? `uploads/Resque_Condition_Images/${req.files['rescue_recovery_photo'][0].filename}`
    //   : null;

    const formatDate = (isoDate) => {
      const d = new Date(isoDate);
      if (isNaN(d)) return 'Invalid';
      return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
    };

    const dateFormatted = formatDate(date);

    const q = `
        INSERT INTO rescue_condition 
          (admission_no, resident_name, date, rescue_recovery_photo, follow_up) 
        VALUES (?, ?, ?, ?, ?)
      `;

    const values = [
      admission_no,
      resident_name,
      dateFormatted,
      JSON.stringify(resrecovery_photo_path || "NULL"),
      follow_up
    ];

    const [result] = await db.query(q, values);
    // ✅ Email the Director
    const mailOptions = {
      from: `"Manasu ERP Application" <${process.env.EMAIL_USER}>`,
      to: ['manasucmf@gmail.com'],
      subject: `New First Consultation Report Submitted by Nurse`,
      html: `
        <h3>New First Consultation Report Submitted by Nurse</h3>
        <p><strong>Resident Name:</strong> ${resident_name}</p>
        <p><strong>Admission No:</strong> ${admission_no}</p>
        <p><strong>Date:</strong> ${dateFormatted}</p>
        <p><strong>Follow Up:</strong> ${follow_up}</p>
        ${resrecovery_photo_path ? `<p><strong>Photo:</strong> ${resrecovery_photo_path}</p>` : ''}
      `
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Email send error:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });
    res.status(201).json({ message: "Rescue Condition Created Successfully", data: result });
  } catch (err) {
    console.error('Error creating rescue condition:', err);
    res.status(500).json({ message: "Database Error", error: err });
  }
}


const getConditionDetails = async (req, res) => {
  const query = "Select * from rescue_condition";

  try {
    const [data] = await db.query(query);
    res.status(201).json({ message: "Condition Details Get Successfully", data: data });
  } catch (err) {
    console.error('Error fetching condition details:', err);
    res.status(500).json({ message: "Database Error", error: err });
  }
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

const getEditData = async (req, res) => {
  const { id } = req.params;

  const query = 'SELECT * FROM rescue_condition WHERE id = ?';

  try {
    const [result] = await db.query(query, [id]);
    if (result.length === 0) {
      return res.status(404).json({ message: 'Rescue Condition not found' });
    }
    res.json({
      message: "Rescue Condition Fetched Successfully", data: result[0]
    });
  } catch (err) {
    console.error('Error fetching rescue condition:', err);
    res.status(500).json({ message: "Database Error", error: err });
  }
}



const createRecord = async (req, res) => {
  console.log("req.body:", req.body);
  try {
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
    const [result] = await db.query(q, values);
    console.log("Record created successfully:", result);
    // ✅ Email the Director
    const mailOptions = {
      from: `"Manasu ERP Application" <${process.env.EMAIL_USER}>`,
      to: ['manasucmf@gmail.com'],
      subject: `New Nurse Record Sheet Submitted by Nurse`,
      html: `
        <h3>New Nurse Record Sheet Submitted by Nurse</h3>
        <p><strong>Admission No:</strong> ${admission_no}</p>
        <p><strong>Date:</strong> ${dateFormatted}</p>
      `
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Email send error:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });
    res.status(201).json({ message: "Nurse Record Sheet Created Successfully", data: result });
  } catch (err) {
    console.error('Error creating nurse record:', err);
    res.status(500).json({ message: "Database Error", error: err });
  }
};


const updateNurseRecords = async (req, res) => {
  try {
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
    const [updateResult] = await db.query(recordupdate, values);
    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ message: "No record found with this ID" });
    }
    return res.status(200).json({ message: "Nurse Record updated successfully!" });
  } catch (err) {
    console.error('Error updating nurse record:', err);
    return res.status(500).json({ message: "Database Error", error: err });
  }
}


const createDrConsultant = async (req, res) => {
  try {
    const {
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
    } = req.body;

    const sql = `
      INSERT INTO dr_consultancy (
        rescue_name, admissionNumber, rescue_age, rescue_gender,
        mfm_no, ward_no, bed_no, consultants,
        dr_name, dr_qualification, consult_dr_name, consult_dr_quali
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const values = [
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
    ];

    const [result] = await db.query(sql, values);

    console.log('Data inserted successfully');
    res.status(200).json({ message: 'Data inserted successfully', result });

  } catch (err) {
    console.error('Error inserting data:', err);
    res.status(500).json({ message: 'Error inserting data', error: err });
  }
};

const getDrConsultant = async (req, res) => {
  const admissionNumber = req.params.admissionNumber;
  const query = 'SELECT * FROM dr_consultancy WHERE admissionNumber = ?';

  try {
    const [results] = await db.query(query, [admissionNumber]);
    if (results.length === 0) {
      return res.status(404).json({ message: 'Doctor Consultant not found' });
    }
    return res.json(results[0]);
  } catch (err) {
    console.error('Error fetching doctor consultant:', err);
    return res.status(500).json({ message: 'Database error' });
  }
};

const UpdateDrConsultant = async (req, res) => {
  try {
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
    const [result] = await db.query(updateQuery, values);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "No doctor consultancy found with this admission number" });
    }
    return res.status(200).json({ message: "Doctor Consultancy updated successfully" });
  } catch (err) {
    console.error('Error updating doctor consultancy:', err);
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};



const getNurseRecord = async (req, res) => {
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

  try {
    const [data] = await db.query(query);
    if (data.length === 0) {
      return res.status(404).json({ message: "No Nurse Records found" });
    }
    res.status(200).json({ message: "Nurse Records Retrieved Successfully", data: data });
  } catch (err) {
    console.error('Error fetching nurse records:', err);
    res.status(500).json({ message: "Database Error", error: err });
  }
}

const getNurseRecordbyID = async (req, res) => {
  const id = req.params.id;
  const query = 'SELECT * FROM nurse_record WHERE id = ?';

  try {
    const [results] = await db.query(query, [id]);
    if (results.length === 0) {
      return res.status(404).json({ message: 'Nurse Records not found' });
    }
    res.json(results[0]);
  } catch (err) {
    console.error('Error fetching nurse record by ID:', err);
    return res.status(500).json({ message: 'Database error' });
  }
};


const createObservationReport = async (req, res) => {
  try {
    // Await file upload
    await residencyAsync(req, res);

    const {
      admission_no,
      resident_name,
      date,
      follow_up
    } = req.body;

    const recovery_photo_path = req.files?.['recovery_photo']
      ? req.files['recovery_photo'].map(file => `uploads/Resque_Condition_Images/${file.filename}`)
      : [];


    // const recovery_photo_path = req.files['recovery_photo']
    //   ? `uploads/Resque_Condition_Images/${req.files['recovery_photo'][0].filename}`
    //   : null;

    // Format date (dd-mm-yyyy)
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
      JSON.stringify(recovery_photo_path || "NULL"),
      follow_up
    ];

    const [result] = await db.query(q, values);

    // ✅ Email the Director
    const mailOptions = {
      from: `"Manasu ERP Application" <${process.env.EMAIL_USER}>`,
      to: ['manasucmf@gmail.com'],
      subject: `New Resident Observation Report Submitted by Social Worker`,
      html: `
        <h3>Resident Observation & Progress Report – Social Worker</h3>
        <p><strong>Admission No:</strong> ${admission_no}</p>
        <p><strong>Resident Name:</strong> ${resident_name}</p>
        <p><strong>Date:</strong> ${obdateFormatted}</p>
      `
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Email send error:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

    res.status(201).json({ message: "Rescue Condition Created Successfully", result });

  } catch (err) {
    console.error("Error in createObservationReport:", err);
    res.status(500).json({ message: "Server Error", error: err });
  }
};

const getObservationReport = async (req, res) => {
  const query = "Select * from observation_report";
  try {
    const [result] = await db.query(query);
    if (result.length === 0) {
      return res.status(404).json({ message: "No Observation Report found" });
    }
    res.status(200).json({ message: "Observation Report Retrieved Successfully", data: result });
  } catch (err) {
    console.error('Error fetching Observation report:', err);
    res.status(500).json({ message: "Database Error", error: err });
  }

}

const showObservationReport = async (req, res) => {
  const id = req.params.id;
  const query = 'SELECT * FROM observation_report WHERE id = ?';
  try {
    const [result] = await db.query(query, [id]);
    if (result.length === 0) {
      return res.status(404).json({ message: "No Observation Report found" });
    }
    res.json(result[0]);
  } catch (err) {
    console.error('Error fetching Observation report:', err);
    res.status(500).json({ message: "Database Error", error: err });
  }

}

const updateObservationReport = async (req, res) => {
  try {
    await residencyAsync(req, res);
    const {
      resident_name,
      date,
      follow_up,
    } = req.body;

    const admission_no = req.params.admission_no;

    const newRecoveryPhoto = req.files?.['recovery_photo']
      ? req.files['recovery_photo'].map(file => `uploads/Resque_Condition_Images/${file.filename}`)
      : [];


    // const newRecoveryPhoto = req.files['recovery_photo']
    //   ? `uploads/Resque_Condition_Images/${req.files['recovery_photo'][0].filename}`
    //   : null;

    const [existingData] = await db.query(
      "SELECT recovery_photo FROM observation_report WHERE admission_no = ?",
      [admission_no]
    );

    const existingRecoveryPath = existingData[0]?.recovery_photo;
    const finalRecoveryPath = newRecoveryPhoto || existingRecoveryPath;

    // Format date to dd-mm-yyyy
    const formatDate = (isoDate) => {
      const d = new Date(isoDate);
      if (isNaN(d)) return 'Invalid';
      return `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
    };

    const obdateFormatted = formatDate(date);

    const updateQuery = `
        UPDATE observation_report SET
        resident_name=?,
        date = ?,
        recovery_photo = ?,
        follow_up = ?
        WHERE admission_no = ?`;

    const values = [
      resident_name,
      obdateFormatted,
      JSON.stringify(finalRecoveryPath || "NULL"),
      follow_up,
      admission_no
    ];

    const [updateResult] = await db.query(updateQuery, values);
    // Delete old file if a new one was uploaded
    if (newRecoveryPhoto && existingRecoveryPath) {
      fs.unlink(existingRecoveryPath, (fsErr) => {
        if (fsErr) console.warn("Failed to delete old photo:", fsErr);
      });
    }

    res.status(200).json({ message: "Observation updated successfully" });

  } catch (err) {
    console.error("Error in updateObservationReport:", err);
    res.status(500).json({ message: "Server Error", error: err });
  }
};

const showRescueCondition = async (req, res) => {
  const id = req.params.id;
  const query = 'SELECT * FROM rescue_condition WHERE id = ?';

  try {
    const [results] = await db.query(query, [id]);
    if (results.length === 0) {
      return res.status(404).json({ message: 'Rescue Condition not found' });
    }
    res.json(results[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Database error' });
  }
};


const updateRescueCondition = async (req, res) => {
  try {
    await residencyAsync(req, res);

    const {
      resident_name,
      date,
      follow_up,
    } = req.body;

    const admission_no = req.params.admission_no;

    // Step 1: Fetch existing photo array
    const [selectData] = await db.query("SELECT rescue_recovery_photo FROM rescue_condition WHERE admission_no = ?", [admission_no]);
    if (selectData.length === 0) {
      return res.status(404).json({ message: "Rescue Condition not found" });
    }

    let existingPhotos = [];
    try {
      existingPhotos = JSON.parse(selectData[0].rescue_recovery_photo || '[]');
    } catch (e) {
      existingPhotos = [];
    }

    // Step 2: Get new uploaded photos
    const newPhotos = req.files?.['rescue_recovery_photo']
      ? req.files['rescue_recovery_photo'].map(file => `uploads/Resque_Condition_Images/${file.filename}`)
      : [];

    // Step 3: Combine old and new photos
    const finalPhotoArray = [...existingPhotos, ...newPhotos];

    const updateQuery = `
      UPDATE rescue_condition SET
      resident_name = ?,
      date = ?,
      rescue_recovery_photo = ?,
      follow_up = ?
      WHERE admission_no = ?
    `;

    const formatDate = (isoDate) => {
      const d = new Date(isoDate);
      return isNaN(d) ? 'Invalid' : `${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`;
    };

    const values = [
      resident_name,
      formatDate(date),
      JSON.stringify(finalPhotoArray),
      follow_up,
      admission_no
    ];

    const [result] = await db.query(updateQuery, values);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "No rescue condition found with this admission number" });
    }

    res.status(200).json({ message: "Rescue Condition updated successfully" });

  } catch (err) {
    console.error('Error updating rescue condition:', err);
    res.status(500).json({ message: "Database Error", error: err });
  }
};


const createPrescription = async (req, res) => {
  const {
    admission_no,
    rescue_name,
    age,
    op_no,
    hospital_name,
    department,
    diagnosis,
    masterHealthCheckup,
    instruction,
    medical_type,
    advice,
    follow_up,
    current_date,
    medicine,
    medicine_type,
    duration,
    intake,
    med_instruction,
    morning,
    afternoon,
    night
  } = req.body;

  try {
    const insertQuery = `
      INSERT INTO prescription_medicines (
        admission_no, rescue_name, age, op_no, hospital_name, department, diagnosis, masterHealthCheckup,
        instruction, medical_type, advice, follow_up, created_date,
        medicine, medicine_type, duration, intake, med_instruction, morning, afternoon, night
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      admission_no, rescue_name, age, op_no, hospital_name, department, diagnosis, masterHealthCheckup,
      instruction, medical_type, advice, follow_up, current_date,
      medicine, medicine_type, duration, intake, med_instruction, morning, afternoon, night
    ];

    await db.query(insertQuery, values);
    // ✅ Email the Director
    const mailOptions = {
      from: `"Manasu ERP Application" <${process.env.EMAIL_USER}>`,
      to: ['manasucmf@gmail.com'],
      subject: `New Prescription Form Submitted by Nurse`,
      html: `
        <h3>New Prescription Form Submitted by Nurse</h3>
        <p><strong>Admission No:</strong> ${admission_no}</p>
        <p><strong>Resident Name:</strong> ${rescue_name}</p>
        <p><strong>Date:</strong> ${current_date}</p>
      `
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Email send error:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });
    res.status(201).json({ message: "Prescription and Medicine Summary Saved Successfully" });
  } catch (error) {
    console.error("Error inserting prescription:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const getPrescriptionALL = async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM prescription_medicines");

    res.status(200).json({
      message: "Perscription Medicines Record Retrieved Successfully",
      data: rows, // ✅ THIS is what your frontend expects
    });
  } catch (error) {
    console.error("Error fetching visit details:", error);
    res.status(500).json({ message: "Server Error" });
  }
}

const getPrescriptionbyID = async (req, res) => {
  const id = req.params.id;

  const query = `
   SELECT * from prescription_medicines WHERE id=?;
  `;

  try {
    const [results] = await db.query(query, [id]);
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
      medical_type: results[0].medical_type,
      hospital_name: results[0].hospital_name,
      department: results[0].department,
      masterHealthCheckup: results[0].masterHealthCheckup,
      phone_no: results[0].phone_no,
      instruction: results[0].instruction,
      advice: results[0].advice,
      follow_up: results[0].follow_up,

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
    res.status(200).json({ prescription });
  } catch (err) {
    console.error('Error fetching prescription by ID:', err);
    return res.status(500).json({ message: 'Database error' });
  }
};


// Update individual prescriptions
const updatePrescription = async (req, res) => {
  try {
    const id = req.params.id;

    const {
      admission_no,
      rescue_name,
      age,
      op_no,
      hospital_name,
      department,
      diagnosis,
      masterHealthCheckup,
      instruction,
      medical_type,
      advice,
      follow_up,
      medicine,
      medicine_type,
      duration,
      intake,
      med_instruction,
      morning,
      afternoon,
      night
    } = req.body;

    const updateQuery = `
      UPDATE prescription_medicines SET
        admission_no = ?, rescue_name = ?, age = ?, op_no = ?, hospital_name = ?, department = ?,
        diagnosis =?, masterHealthCheckup = ?, instruction = ?, medical_type = ?, advice = ?, follow_up = ?,
        medicine = ?, medicine_type = ?, duration = ?, intake = ?, med_instruction = ?,
        morning = ?, afternoon = ?, night = ?
      WHERE id = ?
    `;

    const values = [
      admission_no, rescue_name, age, op_no, hospital_name, department, diagnosis,
      masterHealthCheckup, instruction, medical_type, advice, follow_up,
      medicine, medicine_type, duration, intake, med_instruction,
      morning, afternoon, night,
      id
    ];

    const [result] = await db.query(updateQuery, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Prescription not found or not updated' });
    }

    res.status(200).json({ message: 'Prescription updated successfully' });
  } catch (error) {
    console.error("❌ Error updating prescription:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};



const createDrVisit = async (req, res) => {
  const {
    dr_name,
    hospital_name,
    date_time,
    report,
    resident_examinite
  } = req.body;

  const sql = `
    INSERT INTO dr_visit (
      dr_name, hospital_name, date_time, report, resident_examinite
    ) VALUES (?, ?, ?, ?, ?)
  `;

  const values = [
    dr_name,
    hospital_name,
    date_time,
    report,
    resident_examinite
  ];

  try {
    const [result] = await db.query(sql, values);
    console.log('Data inserted successfully:', result);
    // ✅ Email the Director
    const mailOptions = {
      from: `"Manasu ERP Application" <${process.env.EMAIL_USER}>`,
      to: ['manasucmf@gmail.com'],
      subject: `New Doctor Visit Submitted by Nurse`,
      html: `
        <h3>Doctor Visit Form</h3>
        <p><strong>Doctor Name:</strong> ${dr_name}</p>
        <p><strong>Hospital Name:</strong> ${hospital_name}</p>
        <p><strong>Date & Time:</strong> ${date_time}</p>
      `
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Email send error:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });
    res.status(201).json({ message: 'Doctor visit data inserted successfully' });
  } catch (err) {
    console.error('Error inserting doctor visit data:', err);
    res.status(500).json({ message: 'Database error', error: err });
  }
};


const getAllDrVisit = async (req, res) => {
  const query = "Select * from dr_visit";
  try {
    const [result] = await db.query(query);
    if (result.length === 0) {
      res.status(404).json({ message: "Dr Visit is not found" });
    }
    return res.status(200).json({ message: "Doctor Visit form Get Successfully", data: result });
  } catch (err) {
    console.log("Error fetching Dr visit:", err);
    res.status(500).json({ message: "Database Error", error: err });
  }
}

const getDrVisitbyID = async (req, res) => {
  const id = req.params.id;
  const query = 'SELECT * FROM dr_visit WHERE id = ?';

  try {
    const [result] = await db.query(query, [id]);
    if (result.length === 0) {
      return res.status(404).json({ message: "No Observation Report found" });
    }
    res.json(result[0]);
  } catch (err) {
    console.error('Error fetching Dr Visit:', err);
    res.status(500).json({ message: "Database Error", error: err });
  }
}

const UpdateDrVisit = async (req, res) => {
  try {
    const {
      dr_name, hospital_name, date_time, resident_examinite, report
    } = req.body;

    const id = req.params.id;

    const formatDateTimeForMySQL = (isoString) => {
      const date = new Date(isoString);

      const pad = (n) => (n < 10 ? '0' + n : n);

      const yyyy = date.getFullYear();
      const mm = pad(date.getMonth() + 1); // Months are zero-indexed
      const dd = pad(date.getDate());

      const hh = pad(date.getHours());
      const mi = pad(date.getMinutes());
      const ss = pad(date.getSeconds());

      return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`; // ✅ MySQL format
    };

    const usquery = `UPDATE dr_visit SET
                    dr_name = ?,
                    hospital_name = ?,
                    date_time = ?,
                    resident_examinite = ?, 
                    report = ?
                    WHERE id= ?`;

    const formattedDateTime = formatDateTimeForMySQL(date_time);

    const values = [
      dr_name, hospital_name, formattedDateTime, resident_examinite, report, id
    ];

    const [result] = await db.query(usquery, values);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "No record found with this ID" });
    }
    return res.status(200).json({ message: "Dr Visit updated successfully!" });
  } catch (err) {
    console.error('Error updating Dr Visit:', err);
    return res.status(500).json({ message: "Database Error", error: err });
  }

}

const createMedicalCamp = async (req, res) => {
  const {
    camp_name,
    hospital_name,
    date,
    camp_type,
    organised_by,
    participants,
    feedback,
    general_details
  } = req.body;

  const sql = `
    INSERT INTO medical_camp (
      camp_name, hospital_name, date, camp_type,
      organised_by, participants, feedback, general_details
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    camp_name,
    hospital_name,
    date,
    camp_type,
    organised_by,
    participants,
    feedback,
    general_details || "Null"
  ];

  try {
    const [result] = await db.query(sql, values);
    console.log('Data inserted successfully');
    // ✅ Email the Director
    const mailOptions = {
      from: `"Manasu ERP Application" <${process.env.EMAIL_USER}>`,
      to: ['manasucmf@gmail.com'],
      subject: `Medical Camp Report Form Submitted by Nurse`,
      html: `
        <h3>Medical Camp Report </h3>
        <p><strong>Camp Name:</strong> ${camp_name}</p>
        <p><strong>Hospital Name:</strong> ${hospital_name}</p>
        <p><strong>Date:</strong> ${date}</p>
        <p><strong>Camp Type:</strong> ${camp_type}</p>
        <p><strong>Organised by:</strong> ${organised_by}</p>
      `
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Email send error:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });
    res.status(201).json({ message: 'Medical camp created successfully', result });
  } catch (err) {
    console.error('Error inserting medical camp data:', err);
    res.status(500).json({ message: 'Database error', error: err });
  }
};


const getMedicalCamp = async (req, res) => {
  const query = "SELECT * FROM medical_camp";
  try {
    const [results] = await db.query(query);
    if (results.length === 0) {
      return res.status(404).json({ message: "Medical Camp records not found" });
    }
    return res.status(200).json({
      message: "Medical Camp form fetched successfully",
      data: results   // ✅ Send the actual data here
    });
  } catch (err) {
    console.log("Error getting medical camp data", err);
    res.status(500).json({ message: "Database Error", error: err });
  }
};


const getMedicalCampID = async (req, res) => {
  const id = req.params.id;
  const query = 'SELECT * FROM medical_camp WHERE id = ?';
  try {
    const [result] = await db.query(query, [id]);
    if (result.length === 0) {
      return res.status(404).json({ message: "No Medical Report found" });
    }
    res.json(result[0]);
  } catch (err) {
    console.error('Error fetching Medical Camp data:', err);
    res.status(500).json({ message: "Database Error", error: err });
  }
}

const updateMedicalCamp = async (req, res) => {
  const {
    camp_name,
    hospital_name,
    date,
    camp_type,
    organised_by,
    participants,
    feedback,
    general_details
  } = req.body;

  const id = req.params.id;

  const usquery = `
    UPDATE medical_camp SET
      camp_name = ?,
      hospital_name = ?,
      date = ?,
      camp_type = ?, 
      organised_by = ?,
      participants = ?,
      feedback = ?,
      general_details = ?
    WHERE id = ?
  `;
  const formatDateForMySQL = (isoString) => {
    const date = new Date(isoString);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`; // ✅ format as YYYY-MM-DD
  };

  const values = [
    camp_name,
    hospital_name,
    formatDateForMySQL(date),
    camp_type,
    organised_by,
    participants,
    feedback,
    general_details,
    id
  ];

  try {
    const [result] = await db.query(usquery, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "No medical camp found with this ID." });
    }

    return res.status(200).json({ message: "Medical Camp updated successfully!" });
  } catch (error) {
    console.error("Error updating medical camp:", error);
    return res.status(500).json({ message: "Database error during update", error });
  }
};


const createSummary = async (req, res) => {
  try {
    // Await file upload
    await residencyAsync(req, res);

    const {
      rescue_name,
      admission_no,
      date,
      report
    } = req.body;

    const [existing] = await db.query("SELECT admission_no FROM reunion_summary WHERE admission_no = ?", [admission_no]);

    if (existing.length > 0) {
      return res.status(409).json({
        message: "Admission number already exists."
      });
    }

    const SummaryAttachPath = req.files?.['summary_attach']
      ? req.files['summary_attach'].map(file => `uploads/SummaryAttach/${file.filename}`)
      : [];

    // File path
    // const SummaryAttachPath = req.files?.['summary_attach']
    //   ? `uploads/SummaryAttach/${req.files['summary_attach'][0].filename}`
    //   : null;

    const q = `
      INSERT INTO reunion_summary(admission_no, rescue_name, date, summary_attach, report)
      VALUES (?, ?, ?, ?, ?)
    `;

    const values = [
      admission_no,
      rescue_name,
      date,
      JSON.stringify(SummaryAttachPath),
      report
    ];

    const [result] = await db.query(q, values);

    // ✅ Email the Director
    const mailOptions = {
      from: `"Manasu ERP Application" <${process.env.EMAIL_USER}>`,
      to: ['manasucmf@gmail.com'],
      subject: `Reunion Summary Form Submitted by Nurse`,
      html: `
        <h3>Reunion Summary Form </h3>
        <p><strong>Resident Name:</strong> ${rescue_name}</p>
        <p><strong>Date:</strong> ${date}</p>
      `
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Email send error:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

    res.status(201).json({
      message: "Reunion Summary Form Created Successfully",
      data: result
    });

  } catch (err) {
    console.error("Error creating reunion summary:", err);
    res.status(500).json({
      message: "Server error while creating reunion summary",
      error: err
    });
  }
};

const getSummary = async (req, res) => {
  const admission_no = req.params.admission_no;
  const query = 'SELECT * FROM reunion_summary WHERE admission_no = ?';
  try {
    const [result] = await db.query(query, [admission_no]);
    if (result.length === 0) {
      return res.status(404).json({ message: "No Summary Details found" });
    }
    res.json(result[0]);
  } catch (err) {
    console.error('Error fetching Summary Details:', err);
    res.status(500).json({ message: "Database Error", error: err });
  }
};

const updateSummary = async (req, res) => {
  try {
    await residencyAsync(req, res);

    const {
      rescue_name,
      date,
      report,
    } = req.body;

    const formatDate = (isoDate) => {
      if (!isoDate || typeof isoDate !== 'string') return null;

      const d = new Date(isoDate);
      if (isNaN(d.getTime())) return null;

      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    };


    const admission_no = req.params.admission_no;


    const SummaryAttachPath = req.files?.['summary_attach']
      ? req.files['summary_attach'].map(file => `uploads/SummaryAttach/${file.filename}`)
      : [];
    // const SummaryAttachPath = req.files?.['summary_attach']
    //   ? `uploads/SummaryAttach/${req.files['summary_attach'][0].filename}`
    //   : null;

    const selectQuery = "SELECT summary_attach FROM reunion_summary WHERE admission_no = ?";
    const [selectData] = await db.query(selectQuery, [admission_no]);

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
      formatDate(date),
      JSON.stringify(finalSummaryAttach),
      report,
      admission_no
    ];

    await db.query(updateQuery, values);

    res.status(200).json({ message: "Reunion Summary updated successfully!" });

  } catch (error) {
    console.error("Error updating reunion summary:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};


export {
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
  getPrescriptionALL,
  getPrescriptionbyID,
  updatePrescription,
  createDrVisit,
  getAllDrVisit,
  getDrVisitbyID, UpdateDrVisit, createMedicalCamp,
  getMedicalCamp, getMedicalCampID, updateMedicalCamp,
  createSummary, getSummary, updateSummary
};