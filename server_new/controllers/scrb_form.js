import db from '../db.js';
import { SCRBAsync } from '../util/SCRBMulter.js';
import transporter from '../config/mailer.js';
// Setup storage

const createForm2 = async (req, res) => {
  try {
    await SCRBAsync(req, res);
    const { name_ngo,
      admission_no,
      koppu_en,
      name_rescue,
      phone_no,
      rescue_name,
      father,
      gender,
      date_time,
      rescue_status,
      language1,
      place,
      police_station,
      addition_info,
    } = req.body;

    const old_photo = req.files['old_photo']
      ? req.files['old_photo'].map(file => `uploads/form_2a/${file.filename}`)
      : [];

    const new_photo = req.files['new_photo']
      ? req.files['new_photo'].map(file => `uploads/form_2a/${file.filename}`)
      : [];

    const signature_path = req.files['signature']
      ? req.files['signature'].map(file => `uploads/form_2a/${file.filename}`)
      : [];

    const seal_path = req.files['seal']
      ? req.files['seal'].map(file => `uploads/form_2a/${file.filename}`)
      : [];

    // const old_photo = req.files['old_photo']
    //   ? `/uploads/form_2a/${req.files['old_photo'][0].filename}`
    //   : null;

    // const new_photo = req.files['new_photo']
    //   ? `/uploads/form_2a/${req.files['new_photo'][0].filename}`
    //   : null;

    // const signature_path = req.files['signature']
    //   ? `/uploads/form_2a/${req.files['signature'][0].filename}`
    //   : null;

    // const seal_path = req.files['seal']
    //   ? `/uploads/form_2a/${req.files['seal'][0].filename}`
    //   : null;

    const q = 'INSERT INTO form_2 (name_ngo, admission_no, koppu_en,rescue_name, parent_name, gender, found_date, marital_status, language, district, police_station, addition_info, old_photo, new_photo, name_rescue, phone_no, signature, seal) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [name_ngo,
      admission_no,
      koppu_en,
      rescue_name,
      father,
      gender,
      date_time,
      rescue_status,
      language1,
      place,
      police_station,
      addition_info,
      JSON.stringify(old_photo),
      JSON.stringify(new_photo),
      name_rescue,
      phone_no,
      JSON.stringify(signature_path),
      JSON.stringify(seal_path)
    ];

    const [result] = await db.query(q, values);

    // 3. THEN send email to director (doesn't block response)
    sendDirectorMail({
      admission_no,
      rescue_name,
      father,
      gender,
      date_time
    }).then(() => {
      console.log("✅ Email sent to director");
    }).catch((error) => {
      console.error("❌ Failed to send email to director:", error);
    });

    return res.status(201).json({ message: "SCRB FORM2 Created Successfully", data: result });

  } catch (err) {
    console.error("Create SCRB FORM2 Error:", err);
    return res.status(500).json({ message: "Server error while creating SCRB FORM2", error: err });
  }
};


const sendDirectorMail = async (form) => {
  try {
    const formatDate = (dateInput) => {
      const date = new Date(dateInput);
      const dd = String(date.getDate()).padStart(2, '0');
      const mm = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
      const yyyy = date.getFullYear();
      const hh = String(date.getHours()).padStart(2, '0');
      const min = String(date.getMinutes()).padStart(2, '0');
      return `${dd}-${mm}-${yyyy} ${hh}:${min}`;
    };
    const formattedDateTime = formatDate(form.date_time);

    const mailOptions = {
      from: `"Manasu ERP Application" <${process.env.EMAIL_USER}>`,
      to: ["manasucmf@gmail.com"], // ✅ change to director's real email
      subject: `📝 SRCB Form2 Submitted: ${form.admission_no}`,
      html: `
        <h2>FORM - 2 FOUND PERSON PERSONAL DETAILS</h2>
        <p><strong>Admission No:</strong> ${form.admission_no}</p>
        <p><strong>Name:</strong> ${form.rescue_name}</p>
        <p><strong>Father:</strong> ${form.father}</p>
        <p><strong>Gender:</strong> ${form.gender}</p>
        <p><strong>Date/Time:</strong> ${formattedDateTime}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("📧 Email sent to director successfully");
  } catch (error) {
    console.error("❌ Error sending email to director:", error.message);
  }
};


const createForm2A = async (req, res) => {
  const {
    name_ngo,
    admission_no,
    file_no,
    category,
    complexion,
    face,
    addition_category,
    addition_complexion,
    addition_face,
  } = req.body;

  const sql = `
    INSERT INTO form_2a (
      name_ngo, admission_no, file_no, category, complexion, face,
      addition_category, addition_complexion, addition_face
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  try {
    const [result] = await db.query(sql, [
      name_ngo,
      admission_no,
      file_no,
      category?.join(', ') || '',
      complexion?.join(', ') || '',
      face?.join(', ') || '',
      addition_category || '',
      addition_complexion || '',
      addition_face || '',
    ]);

    sendDirectorMailForm2A({
      admission_no,
      file_no,
      category,
      complexion,
      face
    }).then(() => {
      console.log("✅ Email sent to director");
    }).catch((error) => {
      console.error("❌ Failed to send email to director:", error);
    });

    res.status(201).json({ message: "SCRB Form 2A created successfully", insertId: result.insertId });
  } catch (err) {
    console.error("Error inserting SCRB Form 2A:", err);
    res.status(500).json({ message: "Database error", error: err.message });
  }
};

const sendDirectorMailForm2A = async (form) => {
  try {
    const mailOptions = {
      from: `"Manasu ERP Application" <${process.env.EMAIL_USER}>`,
      to: ["manasucmf@gmail.com"], // ✅ change to director's real email
      subject: `📝 SRCB Form2A Submitted: ${form.admission_no}`,
      html: `
        <h2>FORM 2A - FOUND PERSON DETAILS - PHYSICAL PARAMETERS -1</h2>
        <p><strong>Admission No:</strong> ${form.admission_no}</p>
        <p><strong>File No.:</strong> ${form.file_no}</p>
        <p><strong>Category:</strong> ${form.category?.join(', ')}</p>
        <p><strong>Complexion:</strong> ${form.complexion?.join(', ')}</p>
        <p><strong>Face:</strong> ${form.face?.join(', ')}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("📧 Email sent to director successfully");
  } catch (error) {
    console.error("❌ Error sending email to director:", error.message);
  }
};


const createForm2B = async (req, res) => {
  const {
    name_ngo,
    file_no,
    admission_no,
    tattoo,
    addition_tatoo,
    scar,
    mole,
    height
  } = req.body;

  if (!name_ngo || !file_no || !admission_no || !tattoo || !addition_tatoo || !scar || !mole || !height) {
    return res.status(400).send('All fields are required');
  }

  const create_sql = `INSERT INTO form_2b (name_ngo, admission_no, file_no, tatoo, addition_tatoo, scar, mole, height)VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

  try {
    const [result] = await db.query(create_sql, [
      name_ngo, admission_no, file_no, tattoo, addition_tatoo, scar, mole, height
    ]);

    sendDirectorMailForm2B({
      admission_no,
      file_no,
      tattoo,
      addition_tatoo,
      scar,
      mole,
      height
    }).then(() => {
      console.log("✅ Email sent to director");
    }).catch((error) => {
      console.error("❌ Failed to send email to director:", error);
    });

    res.status(201).json({ message: "SCRB Form 2B created Successfully", insertId: result.insertId });
  } catch (err) {
    console.error("Error inserting SCRB Form 2B:", err)
  }
};

const sendDirectorMailForm2B = async (form) => {
  try {

    const mailOptions = {
      from: `"Manasu ERP Application" <${process.env.EMAIL_USER}>`,
      to: ["manasucmf@gmail.com"], // ✅ change to director's real email
      subject: `📝 SRCB Form2B Submitted: ${form.admission_no}`,
      html: `
        <h2>FORM 2B - FOUND PERSON DETAILS - PHYSICAL PARAMETERS -2</h2>
        <p><strong>Admission No:</strong> ${form.admission_no}</p>
        <p><strong>File No.:</strong> ${form.file_no}</p>
        <p><strong>Tatoo:</strong> ${form.tattoo}</p>
        <p><strong>Addition Tattoo:</strong> ${form.addition_tatoo}</p>
        <p><strong>Scar:</strong> ${form.scar}</p>
        <p><strong>Mole:</strong> ${form.mole}</p>
        <p><strong>Height:</strong> ${form.height}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("📧 Email sent to director successfully");
  } catch (error) {
    console.error("❌ Error sending email to director:", error.message);
  }
};

const createForm2C = async (req, res) => {
  const { name_ngo, admission_no, file_no, upperdress_1, upperdress_2, lowerdress, addition_upperdress, addition_lowerdress, upperdress_color, lowerdress_color } = req.body;

  const Csql = 'INSERT INTO form_2c (name_ngo, admission_no, file_no, upperdress_1, upperdress_2, lowerdress, addition_upperdress,addition_lowerdress,upperdress_color, lowerdress_color) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

  try {
    const [result] = await db.query(Csql, [
      name_ngo, admission_no, file_no,
      (upperdress_1 || []).join(', '),
      (upperdress_2 || []).join(', '),
      (lowerdress || []).join(', '),
      addition_upperdress, addition_lowerdress, upperdress_color, lowerdress_color
    ]);

    sendDirectorMailForm2C({
      admission_no,
      file_no,
      upperdress_1,
      upperdress_2,
      lowerdress
    }).then(() => {
      console.log("✅ Email sent to director");
    }).catch((error) => {
      console.error("❌ Failed to send email to director:", error);
    });

    res.status(201).json({ message: "SCRB Form 2C created Successfully", insertId: result.insertId });
  } catch (err) {
    console.error("Error inserting SCRB Form 2C:", err)
  }

}

const sendDirectorMailForm2C = async (form) => {
  try {

    const mailOptions = {
      from: `"Manasu ERP Application" <${process.env.EMAIL_USER}>`,
      to: ["manasucmf@gmail.com"], // ✅ change to director's real email
      subject: `📝 SRCB Form2C Submitted: ${form.admission_no}`,
      html: `
        <h2>FORM 2C - FOUND PERSON DETAILS - DRESS CODE</h2>
        <p><strong>Admission No:</strong> ${form.admission_no}</p>
        <p><strong>File No.:</strong> ${form.file_no}</p>
        <p><strong>Upper Dress :</strong> ${form.upperdress_1}</p>
        <p><strong>Lower Dress:</strong> ${form.lowerdress}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("📧 Email sent to director successfully");
  } catch (error) {
    console.error("❌ Error sending email to director:", error.message);
  }
};


//pdf view controllers
const getForm2APDF = async (req, res) => {
  const admission_no = req.params.admission_no;
  const query = 'SELECT * FROM form_2a WHERE admission_no = ?';

  try {
    const [results] = await db.query(query, [admission_no]);

    if (results.length === 0) {
      return res.status(404).json({ message: "Form 2A not found" });
    }
    res.status(200).json(results[0]);
  } catch (err) {
    console.error("Error fetching Form 2A:", err);
    res.status(500).json({ message: "Database Error", error: err.message });
  }
}

const getForm2BPDF = async (req, res) => {
  const admission_no = req.params.admission_no;
  const query = 'SELECT * FROM form_2b WHERE admission_no = ?';

  try {
    const [results] = await db.query(query, [admission_no]);
    res.status(200).json(results[0]);
  } catch (err) {
    console.error("Error fetching Form 2B:", err);
    res.status(500).json({ message: "Database Error", error: err.message });
  }

}


const getForm2CPDF = async (req, res) => {
  const admission_no = req.params.admission_no;
  const query = 'SELECT * FROM form_2c WHERE admission_no = ?';

  try {
    const [results] = await db.query(query, [admission_no]);
    res.status(200).json(results[0]);
  } catch (err) {
    console.error("Error fetching Form 2A:", err);
    res.status(500).json({ message: "Database Error", error: err.message });
  }
}

const getForm2PDF = async (req, res) => {
  const admission_no = req.params.admission_no;
  const query = 'SELECT * FROM form_2 WHERE admission_no = ?';

  try {
    const [results] = await db.query(query, [admission_no]);

    if (results.length === 0) {
      return res.status(404).json({ message: "Form 2 not found" });
    }
    res.status(200).json(results[0]);
  } catch (err) {
    console.error("Error fetching Form 2:", err);
    res.status(500).json({ message: "Database Error", error: err.message });
  }
}

const getForm2Data = async (req, res) => {
  const admission_no = req.params.admission_no;

  if (!admission_no) {
    return res.status(400).json({ error: 'Admission number is required' });
  }

  const query = "SELECT * FROM first_information WHERE admission_no = ?";

  try {
    const [results] = await db.query(query, [admission_no]);

    if (results.length > 0) {
      return res.status(200).json({
        message: "First Information Data fetched successfully",
        data: results[0]  // assuming admission_no is unique
      });
    } else {
      return res.status(404).json({ error: 'No data found for the given admission number' });
    }

  } catch (err) {
    console.error('Unexpected error in getting SCRB Form2:', err);
    return res.status(500).json({ error: 'Internal server error in getting SCRB Form2' });
  }
};

const getAllSCRBFormData = async (req, res) => {
  const admission_no = req.params.admission_no;

  const query1 = `SELECT name_ngo, admission_no, koppu_en, rescue_name, parent_name, gender, found_date, marital_status, language, district, police_station, addition_info, old_photo, new_photo, name_rescue, phone_no, signature, seal FROM form_2 WHERE admission_no = ?`;
  const query2 = `SELECT name_ngo, admission_no, file_no, category, complexion, face, addition_category, addition_complexion, addition_face FROM form_2a WHERE admission_no = ?`;
  const query3 = `SELECT name_ngo, admission_no, file_no, tatoo, addition_tatoo, scar, mole, height FROM form_2b WHERE admission_no = ?`;
  const query4 = `SELECT name_ngo, admission_no, file_no, upperdress_1, upperdress_2, lowerdress, addition_upperdress, addition_lowerdress, upperdress_color, lowerdress_color FROM form_2c WHERE admission_no = ?`;

  try {
    const [results1] = await db.query(query1, [admission_no]);
    const [results2] = await db.query(query2, [admission_no]);
    const [results3] = await db.query(query3, [admission_no]);
    const [results4] = await db.query(query4, [admission_no]);

    return res.status(200).json({
      form_2: results1[0] || null,
      form_2a: results2[0] || null,
      form_2b: results3[0] || null,
      form_2c: results4[0] || null,
    });
  } catch (err) {
    console.error("Error fetching SCRB form data:", err);
    return res.status(500).json({ error: 'Failed to fetch SCRB form data', details: err.message });
  }
};

const getAllSCRBForm2 = async (req, res) => {
  const query = "Select * from form_2";
  try {
    const [data] = await db.query(query);
    return res.status(200).json({ message: "SCRB Form 2 Get Successfully", data: data });
  } catch (err) {
    console.error("Database Error:", err);
    return res.status(500).json({ message: "Database Error", error: err });
  }
}

const getAllSCRBForm2A = async (req, res) => {
  const query = "Select * from form_2a";
  try {
    const [data] = await db.query(query);
    return res.status(200).json({ message: "SCRB Form 2A Get Successfully", data: data });
  } catch (err) {
    console.error("Database Error:", err);
    return res.status(500).json({ message: "Database Error", error: err });
  }
}

const getAllSCRBForm2B = async (req, res) => {
  const query = "Select * from form_2b";
  try {
    const [data] = await db.query(query);
    return res.status(200).json({ message: "SCRB Form 2B Get Successfully", data: data });
  } catch (err) {
    console.error("Database Error:", err);
    return res.status(500).json({ message: "Database Error", error: err });
  }
}

const getAllSCRBForm2C = async (req, res) => {
  const query = "Select * from form_2c";
  try {
    const [data] = await db.query(query);
    return res.status(200).json({ message: "SCRB Form 2C Get Successfully", data: data });
  } catch (err) {
    console.error("Database Error:", err);
    return res.status(500).json({ message: "Database Error", error: err });
  }
}

const getSCRB_form2 = async (req, res) => {
  const rescueID = req.params.id;
  const query = 'SELECT * FROM form_2 WHERE id = ?';

  try {
    const [results] = await db.query(query, [rescueID]);

    if (results.length === 0) {
      return res.status(404).json({ message: 'SCRB Form2 not found' });
    }

    return res.status(200).json(results[0]);
  } catch (err) {
    console.error('Database error:', err);
    return res.status(500).json({ message: 'Database error', error: err });
  }
}

const getSCRB_form2A = async (req, res) => {
  const rescueID = req.params.id;
  const query = 'SELECT * FROM form_2a WHERE id = ?';

  try {
    const [results] = await db.query(query, [rescueID]);

    if (results.length === 0) {
      return res.status(404).json({ message: 'SCRB Form2a not found' });
    }

    return res.status(200).json(results[0]);
  } catch (err) {
    console.error('Database error:', err);
    return res.status(500).json({ message: 'Database error', error: err });
  }
}

const getSCRB_form2B = async (req, res) => {
  const rescueID = req.params.id;
  const query = 'SELECT * FROM form_2b WHERE id = ?';

  try {
    const [results] = await db.query(query, [rescueID]);

    if (results.length === 0) {
      return res.status(404).json({ message: 'SCRB Form2b not found' });
    }

    return res.status(200).json(results[0]);
  } catch (err) {
    console.error('Database error:', err);
    return res.status(500).json({ message: 'Database error', error: err });
  }
}

const getSCRB_form2C = async (req, res) => {
  const rescueID = req.params.id;
  const query = 'SELECT * FROM form_2c WHERE id = ?';

  try {
    const [results] = await db.query(query, [rescueID]);

    if (results.length === 0) {
      return res.status(404).json({ message: 'SCRB Form2c not found' });
    }

    return res.status(200).json(results[0]);
  } catch (err) {
    console.error('Database error:', err);
    return res.status(500).json({ message: 'Database error', error: err });
  }
}

const updateForm2 = async (req, res) => {
  try {
    await SCRBAsync(req, res);
    const {
      name_ngo,
      koppu_en,
      rescue_name,
      parent_name,
      gender,
      found_date,
      marital_status,
      language,
      district,
      police_station,
      addition_info,
      name_rescue,
      phone_no
    } = req.body;

    const id = req.params.id;

    if (!id) {
      return res.status(400).json({ message: "Missing ID" });
    }

    const oldPhotoPath = req.files['old_photo']
      ? req.files['old_photo'].map(f => `uploads/form_2a/${f.filename}`)
      : null;

    const newPhotoPath = req.files['new_photo']
      ? req.files['new_photo'].map(f => `uploads/form_2a/${f.filename}`)
      : null;

    const SignaturePhotoPath = req.files['signature']
      ? req.files['signature'].map(f => `uploads/form_2a/${f.filename}`)
      : null;

    const sealPhotoPath = req.files['seal']
      ? req.files['seal'].map(f => `uploads/form_2a/${f.filename}`)
      : null;

    // Fetch existing data from DB
    const [existingRows] = await db.query(`
            SELECT signature, old_photo, new_photo, seal 
            FROM form_2 
            WHERE id = ?
        `, [id]);

    if (existingRows.length === 0) {
      return res.status(404).json({ message: "No record found for given ID" });
    }

    const existing = existingRows[0] || {};

    const FinalOldPhotoPath = oldPhotoPath ? JSON.stringify(oldPhotoPath) : existing.old_photo;
    const FinalNewPhotoPath = newPhotoPath ? JSON.stringify(newPhotoPath) : existing.new_photo;
    const FinalSignaturePhotoPath = SignaturePhotoPath ? JSON.stringify(SignaturePhotoPath) : existing.signature;
    const FinalSealPhotoPath = sealPhotoPath ? JSON.stringify(sealPhotoPath) : existing.seal;
    const usquery = `UPDATE form_2 SET
                    name_ngo = ?,
                    koppu_en = ?,
                    rescue_name = ?,
                    parent_name = ?,
                    gender = ?,
                    found_date = ?,
                    marital_status = ?,
                    language = ?,
                    district = ?,
                    police_station = ?,
                    addition_info = ?,
                    old_photo = ?,
                    new_photo = ?,
                    name_rescue = ?,
                    phone_no = ?,
                    signature = ?,
                    seal = ?
                    WHERE id= ?`;
    const values = [
      name_ngo,
      koppu_en,
      rescue_name,
      parent_name,
      gender,
      found_date,
      marital_status,
      language,
      district,
      police_station,
      addition_info,
      FinalOldPhotoPath,
      FinalNewPhotoPath,
      name_rescue,
      phone_no,
      FinalSignaturePhotoPath,
      FinalSealPhotoPath,
      id
    ];

    await db.query(usquery, values);

    return res.status(200).json({ message: "SCRB Form 2 updated successfully!" });

  } catch (err) {
    console.error("Error updating Celebration Report Form:", err);
    res.status(500).json({ message: "Database Error", error: err });
  }
}

const updateForm2A = async (req, res) => {
  try {
    const {
      file_no,
      category,
      complexion,
      face,
      addition_category,
      addition_complexion,
      addition_face
    } = req.body;
    console.log('Received:', req.body);
    const id = req.params.id;

    const usquery = `
    UPDATE form_2a SET
      file_no = ?,
      category = ?,
      complexion = ?,
      face = ?,
      addition_category = ?,
      addition_complexion = ?, 
      addition_face = ?
    WHERE id = ?
  `;

    const values = [
      file_no,
      category?.join(', ') || '',
      complexion?.join(', ') || '',
      face?.join(', ') || '',
      addition_category,
      addition_complexion,
      addition_face,
      id
    ];
    const [result] = await db.query(usquery, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "No SCRB Form 2A found with this ID." });
    }

    return res.status(200).json({ message: "SCRB Form 2A updated successfully!" });
  } catch (error) {
    console.error("Error updating SCRB Form 2A:", error);
    return res.status(500).json({ message: "Database error during update", error });
  }
}

const updateForm2B = async (req, res) => {
  try {
    const {
      name_ngo,
      file_no,
      tatoo,
      addition_tatoo,
      scar,
      mole,
      height
    } = req.body;
    console.log('Received:', req.body);
    const id = req.params.id;

    const usquery = `
    UPDATE form_2b SET
      name_ngo = ?,
      file_no = ?,
      tatoo = ?,
      addition_tatoo = ?,
      scar = ?,
      mole = ?,
      height = ?
    WHERE id = ?
  `;

    const values = [
      name_ngo,
      file_no,
      tatoo,
      addition_tatoo,
      scar,
      mole,
      height,
      id
    ];
    const [result] = await db.query(usquery, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "No SCRB Form 2A found with this ID." });
    }

    return res.status(200).json({ message: "SCRB Form 2A updated successfully!" });
  } catch (error) {
    console.error("Error updating SCRB Form 2A:", error);
    return res.status(500).json({ message: "Database error during update", error });
  }
}

const updateForm2C = async (req, res) => {
  try {
    const {
      name_ngo,
      file_no,
      upperdress_1,
      upperdress_2,
      lowerdress,
      addition_upperdress,
      addition_lowerdress,
      upperdress_color,
      lowerdress_color,
    } = req.body;
    console.log('Received:', req.body);
    const id = req.params.id;

    const usquery = `
    UPDATE form_2c SET
      name_ngo = ?,
      file_no = ?,
      upperdress_1 = ?,
      upperdress_2 = ?,
      lowerdress = ?,
      addition_upperdress = ?,
      addition_lowerdress = ?,
      upperdress_color = ?,
      lowerdress_color = ?
    WHERE id = ?
  `;

    const values = [
      name_ngo,
      file_no,
      Array.isArray(upperdress_1) ? upperdress_1.join(', ') : upperdress_1,
      Array.isArray(upperdress_2) ? upperdress_2.join(', ') : upperdress_2,
      Array.isArray(lowerdress) ? lowerdress.join(', ') : lowerdress,
      addition_upperdress,
      addition_lowerdress,
      upperdress_color,
      lowerdress_color,
      id
    ];
    const [result] = await db.query(usquery, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "No SCRB Form 2C found with this ID." });
    }

    return res.status(200).json({ message: "SCRB Form 2C updated successfully!" });
  } catch (error) {
    console.error("Error updating SCRB Form 2C:", error);
    return res.status(500).json({ message: "Database error during update", error });
  }
}
export {
  createForm2,
  createForm2A,
  createForm2B,
  createForm2C,
  getForm2APDF,
  getForm2BPDF,
  getForm2CPDF,
  getForm2PDF,
  getForm2Data,
  getAllSCRBFormData,
  getAllSCRBForm2,
  getAllSCRBForm2A,
  getAllSCRBForm2B,
  getAllSCRBForm2C,
  getSCRB_form2, getSCRB_form2A, getSCRB_form2B, getSCRB_form2C,
  updateForm2, updateForm2A, updateForm2B, updateForm2C
};
