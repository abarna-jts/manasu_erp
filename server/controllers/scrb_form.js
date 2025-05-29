const multer = require('multer');
const path = require('path');
const db = require('../db');

// Setup storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/form_2a/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

// Accept two files
const upload = multer({ storage: storage }).fields([
  { name: 'old_photo', maxCount: 1 },
  { name: 'new_photo', maxCount: 1 },
  { name: 'signature', maxCount: 1 },
  { name: 'seal', maxCount: 1 }
]);

const createForm2 = (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(500).json({ message: 'File upload failed', error: err });
    }

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
      ? `/uploads/form_2a/${req.files['old_photo'][0].filename}`
      : null;

    const new_photo = req.files['new_photo']
      ? `/uploads/form_2a/${req.files['new_photo'][0].filename}`
      : null;

    const signature_path = req.files['new_photo']
      ? `/uploads/form_2a/${req.files['new_photo'][0].filename}`
      : null;

    const seal_path = req.files['new_photo']
      ? `/uploads/form_2a/${req.files['new_photo'][0].filename}`
      : null;

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
        old_photo, 
        new_photo, 
        name_rescue,
         phone_no, 
         signature_path, 
         seal_path];

    db.query(q, values, (dbErr, data) => {
      if (dbErr) {
        return res.status(500).json({ message: 'Database Error', error: dbErr });
      }
      res.status(201).json({ message: 'First Form Created Successfully', data: data });
    });
  });
};

const createForm2A = (req,res) =>{
  const { name_ngo,admission_no, file_no, category, complexion, face, addition_category, addition_complexion, addition_face } = req.body;

  const sql = 'INSERT INTO form_2A (name_ngo, admission_no, file_no, category, complexion, face, addition_category,addition_complexion,addition_face) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(
    sql,
    [name_ngo,admission_no, file_no, category.join(', '), complexion.join(', '), face.join(', '),addition_category,addition_complexion,addition_face],
    (err, result) => {
      if (err) {
        console.error('Error inserting data:', err);
        return res.status(500).send('Database error');
      }
      res.send('Form 2A saved successfully');
    }
  );
};

const createForm2B = (req, res) => {
  const {
    name_ngo,
    file_no,
    admissionNumber,
    tattoo,
    addition_tatoo,
    scar,
    mole,
    height
  } = req.body;

  if (!name_ngo || !file_no || !admissionNumber || !tattoo || !addition_tatoo || !scar || !mole || !height) {
    return res.status(400).send('All fields are required');
  }

  const create_sql = `
    INSERT INTO form_2b (name_ngo, admission_no, file_no, tatoo, addition_tatoo, scar, mole, height)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    create_sql,
    [name_ngo, admissionNumber, file_no, tattoo, addition_tatoo, scar, mole, height],
    (err, result) => {
      if (err) {
        console.error('Error inserting data:', err);
        return res.status(500).send('Database error');
      }
      res.status(201).send('Form 2B saved successfully');
    }
  );
};


const createForm2C = (req, res) =>{
  const { name_ngo,admission_no, file_no, upperdress_1, upperdress_2, lowerdress, addition_upperdress, addition_lowerdress, upperdress_color, lowerdress_color } = req.body;

  const Csql = 'INSERT INTO form_2C (name_ngo, admission_no, file_no, upperdress_1, upperdress_2, lowerdress, addition_upperdress,addition_lowerdress,upperdress_color, lowerdress_color) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  db.query(
    Csql,
    [name_ngo, admission_no, file_no, 
      (upperdress_1 || []).join(', '), 
      (upperdress_2 || []).join(', '), 
      (lowerdress || []).join(', '), 
      addition_upperdress, addition_lowerdress, upperdress_color, lowerdress_color],     
    (err, result) => {
      if (err) {
        console.error('Error inserting data:', err);
        return res.status(500).send('Database error');
      }
      res.send('Form saved successfully');
    }
  );
}



//pdf view controllers
const getForm2APDF = (req,res) =>{
  const admission_no = req.params.admission_no;
  const query = 'SELECT * FROM form_2a WHERE admission_no = ?';

  db.query(query, [admission_no], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Form 2A not found' });
    }

    res.json(results[0]);
  });
}

const getForm2BPDF = (req,res) =>{
  const admission_no = req.params.admission_no;
  const query = 'SELECT * FROM form_2b WHERE admission_no = ?';

  db.query(query, [admission_no], (err, results) => {
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


const getForm2CPDF = (req,res) =>{
  const admission_no = req.params.admission_no;
  const query = 'SELECT * FROM form_2c WHERE admission_no = ?';

  db.query(query, [admission_no], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Form 2A not found' });
    }

    res.json(results[0]);
  });
}

const getForm2PDF = (req,res) =>{
  const admission_no = req.params.admission_no;
  const query = 'SELECT * FROM form_2 WHERE admission_no = ?';

  db.query(query, [admission_no], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Form 2A not found' });
    }

    res.json(results[0]);
  });
}

module.exports = {
  createForm2,
  createForm2A,
  createForm2B,
  createForm2C,
  getForm2APDF,
  getForm2BPDF,
  getForm2CPDF,
  getForm2PDF
};
