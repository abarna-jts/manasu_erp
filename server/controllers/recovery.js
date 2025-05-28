const db = require('../db');
const path = require('path');

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

module.exports = {
  createMSEForm,
  createSpeech,
  createMood
};