import db from '../db.js';
import { recoveryAsync } from '../util/recoveryMulter.js';  

const createMSEForm = async (req, res) => {
  try {
    const {
      admission_no,
      date,
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
        date,
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
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

    const values = [
      admission_no,
      date,
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

    const [result] = await db.query(query, values);
    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "No record inserted. Check if ID exists." });
    }
    res.status(201).json({ message: "MSE Form created successfully" });

  } catch (err) {
    console.error("Error in createMSEForm:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}


const createSpeech = async (req, res) => {
  try {
    const { admission_no, date, rate_quantity, volume_tone, flow_rhythm } = req.body;

    const query = `
    INSERT INTO speech (
      admission_no,
      date,
      rate_quantity,
        volume_tone,
        flow_rhythm
    ) VALUES (?, ?, ?, ?)
  `;

    const values = [
      admission_no,
      date,
      rate_quantity.join(", "),
      volume_tone.join(", "),
      flow_rhythm.join(", ")
    ];

    const [result] = await db.query(query, values);
    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "No record inserted. Check if ID exists." });
    }
    res.status(201).json({ message: "Speech Form created successfully" });
  } catch (err) {
    console.error("Error in createSpeech:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}


const createMood = async (req, res) => {
  try {
    const {
      mood_description,
      appearance,
      resident_feeling,
      general_feeling,
      mood_like,
      resident_general_feeling,
      resident_look,
      admission_no,
      date
    } = req.body;

    const query = `
    INSERT INTO mood_affect (
      admission_no,
      date,
      mood_description,
      appearance,
        resident_feeling,
        general_feeling,
        mood_like,
        resident_general_feeling,
        resident_look

    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

    const values = [
      admission_no,
      date,
      mood_description.join(", "),
      appearance,
      resident_feeling,
      general_feeling,
      mood_like,
      resident_general_feeling,
      resident_look.join(", ")
    ];

    const [result] = await db.query(query, values);
    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "No record inserted. Check if ID exists." });
    }
    res.status(201).json({ message: "Mood and Affect Form created successfully" });

  } catch (err) {
    console.error("Error in createMood:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}


const createThough = async (req, res) => {
  try {
    const {
      stream_form_though,
      content_though,
      admission_no,
      date
    } = req.body;

    const query = `
    INSERT INTO though_form (
      admission_no,
      date,
      stream_form_though,
      content_though
    ) VALUES (?, ?, ?, ?)
  `;

    const values = [
      admission_no,
      date,
      stream_form_though.join(", "),
      content_though.join(", ")
    ];

    const [result] = await db.query(query, values);
    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "No record inserted. Check if ID exists." });
    }
    res.status(201).json({ message: "Though Form created successfully" });

  } catch (err) {
    console.error("Error in createThough:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

const createPerception = async (req, res) => {
  try {
    const {
      hallucination_type,
      heard,
      voices_heard,
      part_of_day,
      female_male_voices,
      interpreted_person,
      illusion,
      perception_changes,
      somatic,
      others,
      admission_no,
      date
    } = req.body;

    const query = `
    INSERT INTO perception (
      admission_no,
      date,
      hallucination_type,
      heard,
        voices_heard,
        part_of_day,
        female_male_voices,
        interpreted_person,
        illusion,
        perception_changes,
        somatic,
        others
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

    const values = [
      admission_no,
      date,
      hallucination_type.join(", "),
      heard,
      voices_heard,
      part_of_day,
      female_male_voices,
      interpreted_person,
      illusion.join(", "),
      perception_changes.join(", "),
      somatic.join(", "),
      others.join(", "),
    ];
    const [result] = await db.query(query, values);
    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "No record inserted. Check if ID exists." });
    }
    res.status(201).json({ message: "Perception Form created successfully" });
  } catch (err) {
    console.error("Error in createPerception:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}


const createJudgement = async (req, res) => {
  try {
    const {
      personal_judgement,
      social_judgement,
      test_judgement,
      judgement,
      admission_no,
      date
    } = req.body;

    const query = `
    INSERT INTO judgement (
      admission_no,
      date,
      personal_judgement,
      social_judgement,
      test_judgement,
      judgement
    ) VALUES (?, ?, ?, ?, ?, ?)
  `;

    const values = [
      admission_no,
      date,
      personal_judgement,
      social_judgement,
      test_judgement,
      judgement
    ];

    const [result] = await db.query(query, values);
    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "No record inserted. Check if ID exists." });
    }
    res.status(201).json({ message: "Judgement Form created successfully" });
  } catch (err) {
    console.error("Error in createJudgement:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

const createInsight = async (req, res) => {
  try {
    const {
      denail_illness,
      slight_awareness,
      awarness_sick,
      awarness_illness,
      intellectual_insight,
      true_emotion,
      admission_no,
      date
    } = req.body;

    const query = `
    INSERT INTO insight (
      admission_no,
      date,
      denail_illness,
      slight_awareness,
      awarness_sick,
      awarness_illness,
      intellectual_insight,
      true_emotion
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

    const values = [
      admission_no,
      date,
      denail_illness,
      slight_awareness,
      awarness_sick,
      awarness_illness,
      intellectual_insight,
      true_emotion
    ];

    const [result] = await db.query(query, values);
    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "No record inserted. Check if ID exists." });
    }
    res.status(201).json({ message: "Insight Form created successfully" });
  } catch (err) {
    console.error("Error in createInsight:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}


const createCognition = async (req, res) => {
  try {
    const {
      consciousness,
      orientation_time,
      orientation_place,
      orientation_person,
      consciousnessState,
      canConcentrate,
      distractibility,
      asking_test,
      names_months,
      test_performance,
      immediate_retention,
      recall,
      patient_place,
      dinner_ate,
      date_ofMrg,
      birthdays_children,
      person_past,
      amnesia,
      live_growing,
      person_school,
      breakfast_ques,
      do_yesterday,
      general_info,
      test_red_wri,
      calculation_test,
      proverb_testing,
      familiar_object,
      admission_no,
      date
    } = req.body;

    const query = `
    INSERT INTO conginition (
        admission_no,
        date,
        consciousness,
        orientation_time,
        orientation_place,
        orientation_person,
        consciousnessState,
        canConcentrate,
        distractibility,
        asking_test,
        names_months,
        test_performance,
        immediate_retention,
        recall,
        patient_place,
        dinner_ate,
        date_ofMrg,
        birthdays_children,
        person_past,
        amnesia,
        live_growing,
        person_school,
        breakfast_ques,
        do_yesterday,
        general_info,
        test_red_wri,
        calculation_test,
        proverb_testing,
        familiar_object
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

    const values = [
      admission_no,
      date,
      consciousness.join(", "),
      orientation_time,
      orientation_place,
      orientation_person,
      consciousnessState,
      canConcentrate,
      distractibility,
      asking_test,
      names_months,
      test_performance,
      immediate_retention,
      recall,
      patient_place,
      dinner_ate,
      date_ofMrg,
      birthdays_children,
      person_past,
      amnesia,
      live_growing,
      person_school,
      breakfast_ques,
      do_yesterday,
      general_info,
      test_red_wri,
      calculation_test,
      proverb_testing,
      familiar_object
    ];

    const [result] = await db.query(query, values);
    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "No record inserted. Check if ID exists." });
    }
    res.status(201).json({ message: "Cognition Form created successfully" });
  } catch (err) {
    console.error("Error in createCognition:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

const createArticles = async(req, res) => {
  try{
    await recoveryAsync(req, res);

    const {
      admission_no,
      rescue_name, date_time, collected_items
    } = req.body;

    const attachItemsPath = req.file
      ? `uploads/Articles_carried/${req.file.filename}`
      : null;


    const createquery = `INSERT INTO articles_items(admission_no, rescue_name, date_time, collected_items, attach_items) 
                      VALUES(?,?,?,?,?)`;

    const values = [
      admission_no,
      rescue_name, date_time, collected_items, attachItemsPath
    ]

    const [result] = await db.query(createquery, values);
    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "No record inserted. Check if ID exists." });
    }
    res.status(201).json({ message: "Rescue Condition Created Successfully" });

  }catch (err) {
    console.error("Error in createArticles:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}


const getArticles = async(req, res) => {
  const admission_no = req.params.admission_no;
  const query = 'SELECT * FROM articles_items WHERE admission_no = ?';
  try{
    const [results] = await db.query(query, [admission_no]);
    if (results.length === 0) {
      return res.status(404).json({ message: 'Articles carried Form not found' });
    }
    res.json(results[0]);
  }catch (err) {
  console.error(err);
  return res.status(500).json({ message: 'Database error' });
  }
}


const updateArticles = async(req, res) => {
  try{
    await recoveryAsync(req, res);

    const {
      rescue_name, date_time, collected_items
    } = req.body;

    const admission_no = req.params.admission_no;

    const attachItemsPath = req.file
      ? `uploads/Articles_carried/${req.file.filename}`
      : null;

    const [selectRows] = await db.query("SELECT attach_items FROM articles_items WHERE admission_no = ?", [admission_no]);
    if (selectRows.length === 0) {
      return res.status(404).json({ message: "Admission number not found" });
    } 
    const existingAttachItems = selectRows[0].attach_items;
    const finalAttachItems = attachItemsPath || existingAttachItems;
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
      finalAttachItems,
      admission_no
    ];
    const [result] = await db.query(updateQuery, values);
    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "No record updated. Check if ID exists." });
    }
    res.status(200).json({ message: "Rescue Condition updated successfully!" });

  }catch (err) {
    console.error("Error in updateArticles:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}


const updateAppearance = async (req, res) => {
  try {
    const {
      general_appearance, attitude, comprehension, gait_posture,
      motor_activity, catatonic_sign, conversion_dissociative,
      social_manner, rapport, hallucinatory_behaviour
    } = req.body;

    const admission_no = req.params.admission_no;

    const uquery = `UPDATE appearance_behaviour SET 
                    general_appearance = ?, 
                    attitude = ?, 
                    comprehension = ?, 
                    gait_posture = ?, 
                    motor_activity = ?,
                    catatonic_sign = ?,
                    conversion_dissociative = ?,
                    social_manner = ?,
                    rapport = ?,
                    hallucinatory_behaviour = ?
                    WHERE admission_no = ?`;

    const values = [
      general_appearance.join(", "),
      attitude.join(", "),
      comprehension.join(", "),
      gait_posture.join(", "),
      motor_activity.join(", "),
      catatonic_sign.join(", "),
      conversion_dissociative.join(", "),
      social_manner.join(", "),
      rapport.join(", "),
      hallucinatory_behaviour.join(", "),
      admission_no
    ];
    const [result] = await db.query(uquery, values);
    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "No record updated. Check if ID exists." });
    }
    return res.status(200).json({ message: "General appearance Form updated successfully!" });
  } catch (err) {
    console.error("Error in updateAppearance:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}


const UpdateSpeech = async (req, res) => {
  try {
    const {
      rate_quantity, volume_tone, flow_rhythm
    } = req.body;

    const admission_no = req.params.admission_no;

    const uquery = `UPDATE speech SET 
                    rate_quantity = ?, 
                    volume_tone = ?, 
                    flow_rhythm = ?
                    WHERE admission_no = ?`;

    const values = [
      rate_quantity.join(", "),
      volume_tone.join(", "),
      flow_rhythm.join(", "),
      admission_no
    ];
    const [result] = await db.query(uquery, values);
    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "No record updated. Check if ID exists." });
    }
    return res.status(200).json({ message: "Speech Form updated successfully!" });
  } catch (err) {
    console.error("Error in UpdateSpeech:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

const UpdateMood = async (req, res) => {
  try {
    const {
      mood_description, appearance, resident_feeling, general_feeling,
      mood_like, resident_general_feeling, resident_look
    } = req.body;

    const admission_no = req.params.admission_no;

    const uquery = `UPDATE mood_affect SET 
                    mood_description = ?, 
                    appearance = ?, 
                    resident_feeling = ?,
                    general_feeling = ?,
                    mood_like = ?,
                    resident_general_feeling = ?,
                    resident_look = ?
                    WHERE admission_no = ?`;

    const values = [
      mood_description.join(", "),
      appearance,
      resident_feeling,
      general_feeling,
      mood_like,
      resident_general_feeling,
      resident_look.join(", "),
      admission_no
    ];
    const [result] = await db.query(uquery, values);
    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "No record updated. Check if ID exists." });
    }
    return res.status(200).json({ message: "Mood and Affect Form updated successfully!" });

  } catch (err) {
    console.error("Error in UpdateMood:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

const updateThough = async (req, res) => {
  try {
    const {
      stream_form_though, content_though
    } = req.body;

    const admission_no = req.params.admission_no;

    const uquery = `UPDATE though_form SET 
                    stream_form_though = ?, 
                    content_though = ?
                    WHERE admission_no = ?`;

    const values = [
      stream_form_though.join(", "),
      content_though.join(", "),
      admission_no
    ];
    const [result] = await db.query(uquery, values);
    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "No record updated. Check if ID exists." });
    }
    return res.status(200).json({ message: "Though form updated successfully." });
  } catch (err) {
    console.error("Error in updateThough:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

const updatePerception = async (req, res) => {
  try {
    const {
      hallucination_type, heard, voices_heard, part_of_day, female_male_voices,
      interpreted_person, illusion, perception_changes, somatic, others
    } = req.body;

    const admission_no = req.params.admission_no;

    const uquery = `UPDATE perception SET 
                    hallucination_type = ?, 
                    heard = ?,
                    voices_heard = ?,
                    part_of_day = ?,
                    female_male_voices = ?,
                    interpreted_person = ?,
                    illusion = ?,
                    perception_changes = ?,
                    somatic = ?,
                    others = ?
                    WHERE admission_no = ?`;

    const values = [
      hallucination_type.join(", "),
      heard,
      voices_heard,
      part_of_day,
      female_male_voices,
      interpreted_person,
      illusion.join(", "),
      perception_changes.join(", "),
      somatic.join(", "),
      others.join(", "),
      admission_no
    ];
    const [result] = await db.query(uquery, values);
    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "No record updated. Check if ID exists." });
    }
    return res.status(200).json({ message: "Perception Form updated successfully!" });
  } catch (err) {
    console.error("Error in updatePerception:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

const updateJudgement = async (req, res) => {
  try {
    const {
      personal_judgement, social_judgement, test_judgement, judgement
    } = req.body;

    const admission_no = req.params.admission_no;

    const uquery = `UPDATE judgement SET 
                    personal_judgement = ?, 
                    social_judgement = ?,
                    test_judgement = ?,
                    judgement = ?
                    WHERE admission_no = ?`;

    const values = [
      personal_judgement,
      social_judgement,
      test_judgement,
      judgement,
      admission_no
    ];
    const [result] = await db.query(uquery, values);
    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "No record updated. Check if ID exists." });
    }
    return res.status(200).json({ message: "Judgement Form updated successfully!" });
  } catch (err) {
    console.error("Error in updateJudgement:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

const updateInsight = async (req, res) => {
  try {
    const {
      denail_illness, slight_awareness, awarness_sick, awarness_illness, intellectual_insight, true_emotion,
    } = req.body;

    const admission_no = req.params.admission_no;

    const uquery = `UPDATE insight SET 
                    denail_illness = ?, 
                    slight_awareness = ?,
                    awarness_sick = ?,
                    awarness_illness = ?,
                    intellectual_insight = ?,
                    true_emotion = ?
                    WHERE admission_no = ?`;

    const values = [
      denail_illness,
      slight_awareness,
      awarness_sick,
      awarness_illness,
      intellectual_insight,
      true_emotion,
      admission_no
    ];
    const [result] = await db.query(uquery, values);
    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "No record updated. Check if ID exists." });
    }
    return res.status(200).json({ message: "Insight Form updated successfully!" });
  } catch (err) {
    console.error("Error in updateInsight:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

const updateCognition = async (req, res) => {
  try {
    const {
      consciousness, orientation_time, orientation_place, orientation_person, consciousnessState, canConcentrate,
      distractibility, asking_test, names_months, test_performance, immediate_retention,
      recall, patient_place, dinner_ate, date_ofMrg, birthdays_children, person_past, amnesia,
      live_growing, person_school, breakfast_ques, do_yesterday, general_info, test_red_wri, calculation_test, proverb_testing,
      familiar_object
    } = req.body;

    const admission_no = req.params.admission_no;

    const uquery = `UPDATE conginition SET 
                    consciousness = ?, 
                    orientation_time = ?,
                    orientation_place = ?,
                    orientation_person = ?,
                    consciousnessState = ?,
                    canConcentrate = ?,
                    distractibility = ?,
                    asking_test = ?, 
                    names_months = ?,
                    test_performance = ?,
                    immediate_retention = ?,
                    recall =?,
                    patient_place = ?,dinner_ate = ?, date_ofMrg = ?,
                    birthdays_children = ?, person_past = ?,amnesia = ?,
                    live_growing = ?, person_school = ?,breakfast_ques = ?,do_yesterday = ?,
                    general_info = ?,test_red_wri = ?,calculation_test = ?,proverb_testing = ?,
                    familiar_object = ?
                    WHERE admission_no = ?`;

    const values = [
      consciousness, orientation_time, orientation_place, orientation_person, consciousnessState, canConcentrate,
      distractibility, asking_test, names_months, test_performance, immediate_retention,
      recall, patient_place, dinner_ate, date_ofMrg, birthdays_children, person_past, amnesia,
      live_growing, person_school, breakfast_ques, do_yesterday, general_info, test_red_wri, calculation_test, proverb_testing,
      familiar_object, admission_no
    ];
    const [result] = await db.query(uquery, values);
    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "No record updated. Check if ID exists." });
    } 
    return res.status(200).json({ message: "Cognition Form updated successfully!" });
  }catch (err) {
    console.error("Error in updateCognition:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}


const getallappearance = async (req, res) => {
  const admission_no = req.params.admission_no;
  const query = 'SELECT * FROM appearance_behaviour WHERE admission_no = ?';
  try {
    const [results] = await db.query(query, [admission_no]);
    if (results.length === 0) {
      return res.status(404).json({ message: 'General Appearance Form not found' });
    }
    res.json(results[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Database error' });
  }
}


const getallmood = async (req, res) => {
  const admission_no = req.params.admission_no;
  const query = 'SELECT * FROM mood_affect WHERE admission_no = ?';

  try {
    const [results] = await db.query(query, [admission_no]);
    if (results.length === 0) {
      return res.status(404).json({ message: 'Mood and Affect Form not found' });
    }
    res.json(results[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Database error' });
  }
}

const getallspeech = async (req, res) => {
  const admission_no = req.params.admission_no;
  const query = 'SELECT * FROM speech WHERE admission_no = ?';
  try {
    const [results] = await db.query(query, [admission_no]);
    if (results.length === 0) {
      return res.status(404).json({ message: 'Speech Form not found' });
    }
    res.json(results[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Database error' });
  }
}

const getallThough = async (req, res) => {
  const admission_no = req.params.admission_no;
  const query = 'SELECT * FROM though_form WHERE admission_no = ?';

  try {
    const [results] = await db.query(query, [admission_no]);
    if (results.length === 0) {
      return res.status(404).json({ message: 'Though Form not found' });
    }
    res.json(results[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Database error' });
  }
}

const getallperception = async (req, res) => {
  const admission_no = req.params.admission_no;
  const query = 'SELECT * FROM perception WHERE admission_no = ?';

  try {
    const [results] = await db.query(query, [admission_no]);
    if (results.length === 0) {
      return res.status(404).json({ message: 'Perception Form not found' });
    }
    res.json(results[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Database error' });
  }
}

const getalljudgement = async (req, res) => {
  const admission_no = req.params.admission_no;
  const query = 'SELECT * FROM judgement WHERE admission_no = ?';

  try {
    const [results] = await db.query(query, [admission_no]);
    if (results.length === 0) {
      return res.status(404).json({ message: 'Judgement Form not found' });
    }
    res.json(results[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Database error' });
  }
}

const getallInsight = async (req, res) => {
  const admission_no = req.params.admission_no;
  const query = 'SELECT * FROM insight WHERE admission_no = ?';

  try {
    const [results] = await db.query(query, [admission_no]);
    if (results.length === 0) {
      return res.status(404).json({ message: 'Insight Form not found' });
    }
    res.json(results[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Database error' });
  }
}

const getallcognition = async (req, res) => {
  const admission_no = req.params.admission_no;
  const query = 'SELECT * FROM conginition WHERE admission_no = ?';

  try {
    const [results] = await db.query(query, [admission_no]);
    if (results.length === 0) {
      return res.status(404).json({ message: 'Cognition Form not found' });
    }
    res.json(results[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Database error' });
  }
}

const getMseAllForm = async (req, res) => {
  try {
    const admission_no = req.params.admission_no;

    const query = (q) => db.query(q, [admission_no]);

    const [appearance_behaviour] = await query(`SELECT * FROM appearance_behaviour WHERE admission_no = ?`);
    const [speech] = await query(`SELECT * FROM speech WHERE admission_no = ?`);
    const [mood_affect] = await query(`SELECT * FROM mood_affect WHERE admission_no = ?`);
    const [though] = await query(`SELECT * FROM though_form WHERE admission_no = ?`);
    const [perceiption] = await query(`SELECT * FROM perception WHERE admission_no = ?`);
    const [conginition] = await query(`SELECT * FROM conginition WHERE admission_no = ?`);
    const [judgement] = await query(`SELECT * FROM judgement WHERE admission_no = ?`);
    const [insight] = await query(`SELECT * FROM insight WHERE admission_no = ?`);

    return res.status(200).json({
      appearance_behaviour: appearance_behaviour[0] || null,
      speech: speech[0] || null,
      mood_affect: mood_affect[0] || null,
      though: though[0] || null,
      perceiption: perceiption[0] || null,
      conginition: conginition[0] || null,
      judgement: judgement[0] || null,
      insight: insight[0] || null
    });

  } catch (error) {
    console.error("Error fetching MSE form data:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};



export {
  createMSEForm,
  createSpeech,
  createMood,
  createThough,
  createJudgement,
  createArticles,
  getArticles,
  updateArticles,
  createInsight,
  createPerception,
  createCognition,
  getallappearance,
  getallmood, getallspeech, getallcognition, getallperception, getMseAllForm, getallThough, getalljudgement, getallInsight,
  updateAppearance, UpdateSpeech, UpdateMood, updateThough, updatePerception, updateJudgement, updateInsight, updateCognition
};