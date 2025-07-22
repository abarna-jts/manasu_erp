import db from '../db.js';
import { SCRBAsync } from '../util/SCRBMulter.js';
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

    return res.status(201).json({ message: "SCRB FORM2 Created Successfully", data: result });

  } catch (err) {
    console.error("Create SCRB FORM2 Error:", err);
    return res.status(500).json({ message: "Server error while creating SCRB FORM2", error: err });
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

    res.status(201).json({ message: "SCRB Form 2A created successfully", insertId: result.insertId });
  } catch (err) {
    console.error("Error inserting SCRB Form 2A:", err);
    res.status(500).json({ message: "Database error", error: err.message });
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

    res.status(201).json({ message: "SCRB Form 2B created Successfully", insertId: result.insertId });
  } catch (err) {
    console.error("Error inserting SCRB Form 2B:", err)
  }
};

const createForm2C = async(req, res) => {
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
    res.status(201).json({message:"SCRB Form 2C created Successfully", insertId:result.insertId});
  } catch (err) {
    console.error("Error inserting SCRB Form 2C:", err)
  }

}


//pdf view controllers
const getForm2APDF = async(req, res) => {
  const admission_no = req.params.admission_no;
  const query = 'SELECT * FROM form_2a WHERE admission_no = ?';

  try{
    const [results] = await db.query(query, [admission_no]);

    if(results.length === 0){
      return res.status(404).json({message:"Form 2A not found"});
    }
    res.status(200).json(results[0]);
  }catch(err){
    console.error("Error fetching Form 2A:", err);
    res.status(500).json({message:"Database Error", error:err.message});
  }
}

const getForm2BPDF = async(req, res) => {
  const admission_no = req.params.admission_no;
  const query = 'SELECT * FROM form_2b WHERE admission_no = ?';

  try{
    const [results] = await db.query(query, [admission_no]);
    res.status(200).json(results[0]);
  }catch(err){
    console.error("Error fetching Form 2B:", err);
    res.status(500).json({message:"Database Error", error:err.message});
  }

}


const getForm2CPDF = async(req, res) => {
  const admission_no = req.params.admission_no;
  const query = 'SELECT * FROM form_2c WHERE admission_no = ?';

  try{
    const [results] = await db.query(query,[admission_no]);
    res.status(200).json(results[0]);
  }catch(err){
    console.error("Error fetching Form 2A:", err);
    res.status(500).json({message:"Database Error", error:err.message});
  }
}

const getForm2PDF = async(req, res) => {
  const admission_no = req.params.admission_no;
  const query = 'SELECT * FROM form_2 WHERE admission_no = ?';

  try{
    const [results] = await db.query(query, [admission_no]);

    if(results.length === 0){
      return res.status(404).json({message:"Form 2 not found"});
    }
    res.status(200).json(results[0]);
  }catch(err){
    console.error("Error fetching Form 2:", err);
    res.status(500).json({message:"Database Error", error:err.message});
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
  getAllSCRBFormData
};
