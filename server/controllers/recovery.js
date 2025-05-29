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

const createThough = (req, res) =>{
  const{
    stream_form_though,
    content_though,
    admission_no
  }=req.body;

  const query = `INSERT INTO though_form(admission_no, stream_form_though, content_though) VALUES(?,?,?)`;

  const values = [
    admission_no,stream_form_though.join(", "), content_though.join(", ")
  ]

  db.query(query, values, (err, results) => {
    if (err) {
      console.error("Insert error:", err);
      return res.status(500).json({ error: "Database insert error" });
    }
    res.status(200).json({ message: "Data inserted successfully" });
  });
}

const crateJudgement =(req, res) => {
  const {
    admission_no,personal_judgement,social_judgement,test_judgement, judgement
  }=req.body;

  const query=`INSERT INTO judgement(admission_no, personal_judgement, social_judgement, test_judgement, judgement)
                VALUES(?,?,?,?,?)`;
   const values = [
    admission_no,personal_judgement, social_judgement, test_judgement, judgement
  ]

  db.query(query, values, (err, results) => {
    if (err) {
      console.error("Insert error:", err);
      return res.status(500).json({ error: "Database insert error" });
    }
    res.status(200).json({ message: "Data inserted successfully" });
  });

}

const createInsight = (req, res) =>{
  const{
    denail_illness,
    slight_awareness,
    awarness_sick,
    awarness_illness,
    intellectual_insight,
    true_emotion,
    admission_no,

  }=req.body;

  const query = `INSERT INTO insight(admission_no, denail_illness, slight_awareness, awarness_sick, awarness_illness, intellectual_insight, true_emotion)
               VALUES(?,?,?,?,?,?,?)`;
  
  const values = [
  admission_no, denail_illness, slight_awareness, awarness_sick, awarness_illness, intellectual_insight, true_emotion
];


  db.query(query, values, (err, results) => {
    if (err) {
      console.error("Insert error:", err);
      return res.status(500).json({ error: "Database insert error" });
    }
    res.status(200).json({ message: "Data inserted successfully" });
  });

}

const createPerception = (req, res) =>{
  const{
    hallucination_type,
    heard,
    voices_heard,
    part_of_day,
    female_male_voices,
    interpreted_person,
    admission_no
  }=req.body;

  const query = `INSERT INTO Perception(admission_no, hallucination_type, heard, voices_heard, part_of_day, female_male_voices, interpreted_person)
                  VALUES(?,?,?,?,?,?,?)`;
  const values = [
    admission_no, hallucination_type,heard, voices_heard, part_of_day, female_male_voices, interpreted_person
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
  createMood,
  createThough,
  crateJudgement,
  createInsight,
  createPerception
};