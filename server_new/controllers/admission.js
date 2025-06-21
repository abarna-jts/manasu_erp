import db from '../db.js';
import { uploadAsync } from '../util/uploadMulter.js';


const checkAdmissionNo = async (req, res) => {
  const admission_no = req.params.admission_no;

  if (!admission_no) {
    return res.status(400).json({ error: 'Admission number is required' });
  }

  const query = 'SELECT * FROM first_information WHERE admission_no = ?';

  try {
    const [results] = await db.query(query, [admission_no]);

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

    const [result] = await db.query(q, values);

    return res.status(201).json({ message: "First Form Created Successfully", data: result });

  } catch (err) {
    console.error("Create First Form Error:", err);
    return res.status(500).json({ message: "Server error while creating first form", error: err });
  }
};

const getFirstForm = async (req, res) => {
  const query = "SELECT * FROM first_information";
  try {
    const [results] = await db.query(query);
    res.status(200).json({ message: "First Information form fetched successfully", data: results });
  } catch (err) {
    console.error("SQL Error:", err);
    res.status(500).json({ error: 'Database query failed' });
  }
};

const getForm2Data = async (req, res) => {
  const admission_no = req.params.admission_no;

  if (!admission_no) {
    return res.status(400).json({ error: 'Admission number is required' });
  }

  const query = "SELECT * FROM first_information WHERE admission_no = ?";

  try {
    const [data] = await db.query(query, [admission_no]);

    if (data.length === 0) {
      return res.status(404).json({ message: "No data found for the given admission number" });
    }

    return res.status(200).json({ message: "First Information form fetched successfully", data: data });
  } catch (err) {
    console.error('Unexpected error in getting SCRB Form2:', err);
    return res.status(500).json({ error: 'Internal server error in getting SCRB Form2', details: err });
  }
};

const getFirst2AForm = async(req, res) => {
  const admission_no = req.params.admission_no;

  if (!admission_no) {
    return res.status(400).json({ error: 'Admission number is required' });
  }

  const query = "SELECT * FROM first_information WHERE admission_no = ?";

  try {
    const [data] = await db.query(query, [admission_no]);

    if (data.length === 0) {
      return res.status(404).json({ message: "No data found for the given admission number" });
    }

    return res.status(200).json({ message: "First Information form fetched successfully", data: data });
  } catch (err) {
    console.error('Unexpected error in getting SCRB Form2:', err);
    return res.status(500).json({ error: 'Internal server error in getting SCRB Form2', details: err });
  }
};



const UpdateFirstForm = async (req, res) => {
  try {
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
    const [selectData] = await db.query("SELECT rescue_image, attach_policeMemo, govIdFile FROM first_information WHERE id = ?", [rescueId]);
    const existingData = selectData[0] || {};
    const finalRescuePath = newRescueImage || existingData.rescue_image;
    const finalPoliceMemo = newAttachPoliceMemo || existingData.attach_policeMemo;
    const finalGovtID = newgovIdFile || existingData.govIdFile;

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

     const [result] = await db.query(updateQuery, values);

    return res.status(201).json({ message: "First Form Updated Successfully", data: result });

  } catch (err) {
    console.error("Update First Form Error:", err);
    return res.status(500).json({ message: "Server error while updating first form", error: err });
  }

}


const getRescueDetailsPDF = async(req, res) => {
  const id = req.params.id;
  const query = 'SELECT * FROM first_information WHERE id = ?';

  try{
      const [results] = await db.query(query, [id]);

      if(results.length === 0){
        return res.status(404).json({message:"First Form not found"});
      }

      res.status(200).json(results[0]);
  }catch(err){
    console.error("Error fetching First Form:", err);
    res.status(500).json({message:"Database Error", error:err.message});
  }
}

const UpdateStatus = async(req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const query = 'UPDATE first_information SET resident_status = ? WHERE id = ?';

    try{
      const [results] = await db.query(query, [status, id]);

      if(results.length === 0){
        return res.status(404).json({message:"update of status is not found"});
      }
      res.status(200).json(results[0]);

    }catch(err){
      console.error("Error in updating status:", err);
      res.status(500).json({message:"Database Error", error:err.message});
    }
  }

const getReunionData = async (req, res) => {
  const query = `SELECT * FROM first_information WHERE resident_status = 'Reunion'`;

  try {
    const [data] = await db.query(query);
    res.status(200).json({
      message: "First Information form fetched successfully",
      data: data
    });
  } catch (err) {
    console.error("Error fetching Reunion data:", err);
    res.status(500).json({
      message: "Database Error",
      error: err.message
    });
  }
};



export{
  checkAdmissionNo,
  createFirstForm,
  getFirstForm,
  UpdateFirstForm,
  getRescueDetailsPDF,
  UpdateStatus,
  getReunionData, 
  getForm2Data,
  getFirst2AForm
};
