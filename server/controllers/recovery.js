const db = require('../db');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve("uploads/Articles_carried/"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});


const upload = multer({ storage: storage }).single("attach_items");

const createMSEForm = (req, res) => {
   const {
    admission_no,
    general_appearance,
    attitude,
    comprehension,
    gait_posture,
    motor_activity,
    catatonic_sign,
    conversion_dissociative,
    social_manner,
    rapport,
    hallucinatory_behaviour
  } = req.body;

  const query = `
    INSERT INTO appearance_behaviour (
        admission_no,
      general_appearance,
      attitude,
      comprehension,
      gait_posture,
      motor_activity,
      catatonic_sign,
      conversion_dissociative,
      social_manner,
      rapport,
      hallucinatory_behaviour
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    admission_no,
    general_appearance.join(", "),
    attitude.join(", "),
    comprehension.join(", "),
    gait_posture.join(", "),
    motor_activity.join(", "),
    catatonic_sign.join(", "),
    conversion_dissociative.join(", "),
    social_manner.join(", "),
    rapport.join(", "),
    hallucinatory_behaviour.join(", ")
  ];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error("Insert error:", err);
      return res.status(500).json({ error: "Database insert error" });
    }
    res.status(200).json({ message: "Data inserted successfully" });
  });
}

const createSpeech = (req, res) => {
  const {admission_no, rate_quantity, volume_tone, flow_rhythm } = req.body;

  const query = `
    INSERT INTO speech (
      admission_no,
      rate_quantity,
        volume_tone,
        flow_rhythm
    ) VALUES (?, ?, ?, ?)
  `;

  const values = [
    admission_no,
    rate_quantity.join(", "),
    volume_tone.join(", "),
    flow_rhythm.join(", ")
  ];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error("Insert error:", err);
      return res.status(500).json({ error: "Database insert error" });
    }
    res.status(200).json({ message: "Data inserted successfully" });
  });
}

const createMood = (req, res) => {
  const { 
    mood_description,
    appearance,
    resident_feeling,
    general_feeling,
    mood_like,
    resident_general_feeling,
    resident_look,
    admission_no,
   } = req.body;

  const query = `
    INSERT INTO mood_affect (
      admission_no,
      mood_description,
      appearance,
        resident_feeling,
        general_feeling,
        mood_like,
        resident_general_feeling,
        resident_look

    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    admission_no,
    mood_description.join(", "),
    appearance,
    resident_feeling,
    general_feeling,
    mood_like,
    resident_general_feeling,
    resident_look.join(", ")
  ];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error("Insert error:", err);
      return res.status(500).json({ error: "Database insert error" });
    }
    res.status(200).json({ message: "Data inserted successfully" });
  });
}

const createArticles = (req, res) =>{
  upload(req, res, (err) => {
  const{
    admission_no,
    rescue_name, date_time, collected_items
  }=req.body;

   const attachItemsPath = req.file
      ? `uploads/Articles_carried/${req.file.filename}`
      : null;


  const createquery= `INSERT INTO articles_items(admission_no, rescue_name, date_time, collected_items, attach_items) 
                      VALUES(?,?,?,?,?)`;

  const values = [
    admission_no,
    rescue_name,date_time,collected_items,attachItemsPath
  ]
   db.query(createquery, values, (dbErr, data) => {
      if (dbErr) {
        return res.status(500).json({ message: "Database Error", error: dbErr });
      }
      res.status(201).json({ message: "Rescue Condition Created Successfully", data });
    });
  });
};

const getArticles = (req, res) =>{
  const admission_no = req.params.admission_no;
    const query = 'SELECT * FROM articles_items WHERE admission_no = ?';

    db.query(query, [admission_no], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'Articles carried Form not found' });
        }

        res.json(results[0]);
    });
}

const updateArticles = (req, res) =>{
  upload(req, res, (err) => {
    if (err) {
            return res.status(500).json({ message: "File upload failed", error: err });
        }

    const{
      rescue_name,date_time,collected_items
    }=req.body;

    const admission_no = req.params.admission_no;

   const attachItemsPath = req.file
  ? `uploads/Articles_carried/${req.file.filename}`
  : null;


     const selectQuery = "SELECT attach_items FROM articles_items WHERE admission_no = ?";
        db.query(selectQuery, [admission_no], (selectErr, selectData) => {
            if (selectErr) {
                return res.status(500).json({ message: "Failed to retrieve existing files", error: selectErr });
            }

            const exsitingattachItems = selectData[0]?.attach_items;

            const finalattachItems = attachItemsPath || exsitingattachItems;

            const updateQuery = `
                UPDATE articles_items SET 
                    rescue_name = ?, 
                    date_time = ?, 
                    collected_items = ?, 
                    attach_items = ?
                WHERE admission_no = ?
            `;

            const values = [
                rescue_name,
                date_time,
                collected_items,
                finalattachItems,
                admission_no
            ];

            db.query(updateQuery, values, (updateErr, result) => {
                if (updateErr) {
                    return res.status(500).json({ message: "Update failed", error: updateErr });
                }

                return res.status(200).json({ message: "Self Declaration updated successfully!" });
            });
        });
  });
}


module.exports = {
  createMSEForm,
  createSpeech,
  createMood,
  createArticles,
  getArticles,
  updateArticles
};