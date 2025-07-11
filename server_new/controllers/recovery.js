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
    INSERT INTO general_appearance (
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

    // Handle duplicate entry error
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: "A record already exists for this admission number." });
    }

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
    ) VALUES (?, ?, ?, ?, ?)
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

const createArticles = async (req, res) => {
  try {
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

  } catch (err) {
    console.error("Error in createArticles:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}


const getArticles = async (req, res) => {
  const admission_no = req.params.admission_no;
  const query = 'SELECT * FROM articles_items WHERE admission_no = ?';
  try {
    const [results] = await db.query(query, [admission_no]);
    if (results.length === 0) {
      return res.status(404).json({ message: 'Articles carried Form not found' });
    }
    res.json(results[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Database error' });
  }
}


const updateArticles = async (req, res) => {
  try {
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

  } catch (err) {
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

    const { admission_no, date } = req.params;

    const uquery = `UPDATE general_appearance SET 
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
                    WHERE date = ? AND admission_no = ?`;

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
      date,
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

const updateInformation = async (req, res) => {
  try {
    const {
      patient_name,
      patient_age,
      patient_gender,
      sexual_orientation,
      education_bg,
      occupation,
      marital_status,
      economic_status,
      religion,
      informant,
      residential_address,
      living_arrangements,
      family_structure,
      cultural_identity,
      language1,
      language2

    } = req.body;

    const {admission_no, date} = req.params;

    const uquery = `UPDATE basic_detail SET
                    patient_name = ?,
                    patient_age = ?,
                    patient_gender = ?,
                    sexual_orientation = ?,
                    education_bg = ?,
                    occupation = ?,
                    marital_status = ?,
                    economic_status = ?,
                    religion = ?,
                    informant = ?,
                    residential_address = ?,
                    living_arrangements = ?,
                    family_structure = ?,
                    cultural_identity = ?,
                    language1 = ?,
                    language2 = ?
                    WHERE admission_no = ? AND date = ?`;
    const values = [
      patient_name,
      patient_age,
      patient_gender,
      sexual_orientation,
      education_bg,
      occupation,
      marital_status,
      economic_status,
      religion,
      informant,
      residential_address,
      living_arrangements,
      family_structure,
      cultural_identity,
      language1,
      language2, admission_no, date
    ];
    const [result] = await db.query(uquery, values);
    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "No record updated. Check if ID exists." });
    }
    return res.status(200).json({ message: "Demographic Information Form updated successfully!" });
  } catch (err) {
    console.error("Error in update Demographic Information:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

const updateCheifComplaint = async (req, res) => {
  try {
    const {
      chief_complaint,
      onset_duration,
      nature_symptoms,
      severity,
      course_type,
      nature_illness,
      identify_trigger,
      life_changes,
      biological,
      psychological,
      social_environment

    } = req.body;

    const {admission_no, date} = req.params;

    const uquery = `UPDATE cheif_complaint SET
                    chief_complaint = ?,
                    onset_duration = ?,
                    nature_symptoms = ?,
                    severity = ?,
                    course_type = ?,
                    nature_illness = ?,
                    identify_trigger = ?,
                    life_changes = ?,
                    biological = ?,
                    psychological = ?,
                    social_environment = ?
                    WHERE admission_no = ? AND date = ?`;
    const values = [
      chief_complaint,
      onset_duration,
      nature_symptoms,
      severity,
      course_type,
      nature_illness,
      identify_trigger,
      life_changes,
      biological,
      psychological,
      social_environment, admission_no, date
    ];
    const [result] = await db.query(uquery, values);
    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "No record updated. Check if ID exists." });
    }
    return res.status(200).json({ message: "Cheif Complaint Form updated successfully!" });
  } catch (err) {
    console.error("Error in update Cheif Complaint:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

const updatePresentingData = async (req, res) => {
  try {
    const {
      history_presenting,
      mood_affect,
      though_content,
      though_process,
      perception,
      behavioural_changes,
      sleep_patterns,
      energy_level,
      appetite_weight,
      occupation_academic,
      interpersonal_relationship,
      selfCare_activity,
      recreation_activity,
    } = req.body;

    const {admission_no, date} = req.params;

    const uquery = `UPDATE presenting_problems SET
                    history_presenting = ?,
                    mood_affect = ?,
                    though_content = ?,
                    though_process = ?,
                    perception = ?,
                    behavioural_changes = ?,
                    sleep_patterns = ?,
                    energy_level = ?,
                    appetite_weight = ?,
                    occupation_academic = ?,
                    interpersonal_relationship = ?,
                    selfCare_activity = ?,
                    recreation_activity = ?
                    WHERE admission_no = ? AND date = ?`;

    const values = [
      history_presenting,
      mood_affect.join(", "),
      though_content.join(", "),
      though_process.join(", "),
      perception.join(", "),
      behavioural_changes.join(", "),
      sleep_patterns.join(", "),
      energy_level,
      appetite_weight,
      occupation_academic,
      interpersonal_relationship,
      selfCare_activity,
      recreation_activity, admission_no, date
    ];
    const [result] = await db.query(uquery, values);
    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "No record updated. Check if ID exists." });
    }
    return res.status(200).json({ message: "Presenting Problems Form updated successfully!" });
  } catch (err) {
    console.error("Error in update Presenting Problems:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

const updatePsychiatricData = async (req, res) => {
  try {
    const {
      psychiatric_diagnoses,
      treatment_history,
      medications,
      dosage,
      adherence,
      sideEffect,
      experience_reaction,
      hospitalisation_reason,
      duration,
      crisis_episodes,
      fm_mentalHealth,
      significant_life,
      chronic_stressors,
      trauma_exploration,
      legal_environment
    } = req.body;
    const {admission_no, date} = req.params;

    const uquery = `UPDATE psy_history SET
                    psychiatric_diagnoses = ?,
                    treatment_history = ?,
                    medications = ?,
                    dosage = ?,
                    adherence = ?,
                    sideEffect = ?,
                    experience_reaction = ?,
                    hospitalisation_reason = ?,
                    duration = ?,
                    crisis_episodes = ?,
                    fm_mentalHealth = ?,
                    significant_life = ?,
                    chronic_stressors = ?,
                    trauma_exploration = ?,
                    legal_environment = ?
                    WHERE admission_no = ? AND date = ?`;
    const values = [
      psychiatric_diagnoses,
      treatment_history,
      medications,
      dosage,
      adherence,
      sideEffect,
      experience_reaction,
      hospitalisation_reason,
      duration,
      crisis_episodes,
      fm_mentalHealth,
      significant_life,
      chronic_stressors,
      trauma_exploration.join(", "),
      legal_environment.join(", "), admission_no, date
    ];
    const [result] = await db.query(uquery, values);
    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "No record updated. Check if ID exists." });
    }
    return res.status(200).json({ message: "Psychiatric History Form updated successfully!" });
  } catch (err) {
    console.error("Error in update Psychiatric History:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

const updateMedicalHistoryData = async (req, res) => {
  try {
    const {
      disability_status,
      chronic_medical,
      acute_health,
      medication,
      medication_allergies,
      other_allergy,
      significant_medical,
      traumatic_injuries,
      sexual_health
    } = req.body;

    const {admission_no, date} = req.params;

    const query = `UPDATE medical_history SET
                  disability_status = ?,
                  chronic_medical = ?,
                  acute_health = ?,
                  medication = ?,
                  medication_allergies = ?,
                  other_allergy = ?,
                  significant_medical = ?,
                  traumatic_injuries = ?,
                  sexual_health = ?
                  WHERE admission_no = ? AND date = ?`;

    const values = [
      disability_status,
      chronic_medical,
      acute_health,
      medication,
      medication_allergies,
      other_allergy.join(", "),
      significant_medical.join(", "),
      traumatic_injuries,
      sexual_health.join(", "),
      admission_no, date
    ];
    const [result] = await db.query(query, values);
    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "No record updated. Check if ID exists." });
    }
    return res.status(200).json({ message: "Medical History Form updated successfully!" });
  } catch (err) {
    console.error("Error in update Medical History:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

const updateFamilyHistoryData = async (req, res) => {
  try {
    const {
      family_composition,
      family_dynamics,
      marriage_type,
      family_history,
      genetic_predisposition,
      family_changes,
      family_substance
    } = req.body;

    const {admission_no, date} = req.params;

    const uquery = `UPDATE familyhis_data SET
                    family_composition = ?,
                    family_dynamics = ?,
                    marriage_type = ?,
                    family_history = ?,
                    genetic_predisposition = ?,
                    family_changes = ?,
                    family_substance = ?
                    WHERE admission_no = ? AND date = ?`;

    const values = [
      family_composition.join(", "),
      family_dynamics.join(", "),
      marriage_type,
      family_history,
      genetic_predisposition,
      family_changes.join(", "),
      family_substance, admission_no, date
    ];

    const [result] = await db.query(uquery, values);
    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "No record updated. Check if ID exists." });
    }
    return res.status(200).json({ message: "Family History Form updated successfully!" });
  } catch (err) {
    console.error("Error in update Family History:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

const updateSocialHistoryData = async (req, res) => {
  try {
    const {
      family_relationship,
      socialCircle_relationship,
      relationship_significant,
      living_arrangements,
      education_bg,
      currentEmp_status,
      socialRecreation_activity,
      social_outlets,
      socialMed_engagement,
      technology_related,
    } = req.body;

    const {admission_no, date} = req.params;

    const uquery = `UPDATE social_history SET
                    family_relationship = ?,
                    socialCircle_relationship = ?,
                    relationship_significant = ?,
                    living_arrangements = ?,
                    education_bg = ?,
                    currentEmp_status = ?,
                    socialRecreation_activity = ?,
                    social_outlets = ?,
                    socialMed_engagement = ?,
                    technology_related = ?
                    WHERE admission_no = ? AND date = ?`;

    const values = [
      family_relationship,
      socialCircle_relationship,
      relationship_significant,
      living_arrangements,
      education_bg,
      currentEmp_status,
      socialRecreation_activity,
      social_outlets,
      socialMed_engagement,
      technology_related,
      admission_no, date
    ];

    const [result] = await db.query(uquery, values);
    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "No record updated. Check if ID exists." });
    }
    return res.status(200).json({ message: "Social History Form updated successfully!" });
  } catch (err) {
    console.error("Error in update Social History:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

const updateDevelopmentalData = async (req, res) => {
  try {
    const {
      prenatal_factors,
      birth_details,
      birth_order,
      siblings_number,
      bonding_attachment,
      milestones_development,
      childhood_illness,
      siblings_relationship,
      parenting_style,
      learning_challenge,
      pubertal_development
    } = req.body;

    const {admission_no, date} = req.params;

    const uquery = `UPDATE development_history SET
                    prenatal_factors = ?,
                    birth_details = ?,
                    birth_order = ?,
                    siblings_number = ?,
                    bonding_attachment = ?,
                    milestones_development = ?,
                    childhood_illness = ?,
                    siblings_relationship = ?,
                    parenting_style = ?,
                    learning_challenge = ?,
                    pubertal_development = ?
                    WHERE admission_no = ? AND date = ?`;

    const values = [
      prenatal_factors,
      birth_details,
      birth_order,
      siblings_number,
      bonding_attachment,
      milestones_development,
      childhood_illness,
      siblings_relationship,
      parenting_style,
      learning_challenge,
      pubertal_development, admission_no, date
    ];
    const [result] = await db.query(uquery, values);
    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "No record updated. Check if ID exists." });
    }
    return res.status(200).json({ message: "Developmental History Form updated successfully!" });
  } catch (err) {
    console.error("Error in update Developmental History:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

const updateSubstanceData = async (req, res) => {
  try {
    const {
      substance_use,
      age_onset,
      frequency,
      quantity,
      motivation_use,
      environmental_trigger,
      impact_occupation,
      impact_interpersonal,
      financial_consequences,
      craving_intensity,
      previous_treatment,
      relapse_history,
    } = req.body;

    const {admission_no, date} = req.params;

    const uquery = `UPDATE substance_use SET
                    substance_use = ?,
                    age_onset = ?,
                    frequency = ?,
                    quantity = ?,
                    motivation_use = ?,
                    environmental_trigger = ?,
                    impact_occupation = ?,
                    impact_interpersonal = ?,
                    financial_consequences = ?,
                    craving_intensity = ?,
                    previous_treatment = ?,
                    relapse_history = ?
                    WHERE admission_no = ? AND date = ?`;

    const values = [
      substance_use,
      age_onset,
      frequency,
      quantity,
      motivation_use,
      environmental_trigger,
      impact_occupation,
      impact_interpersonal,
      financial_consequences,
      craving_intensity,
      previous_treatment,
      relapse_history,
      admission_no, date
    ];
    const [result] = await db.query(uquery, values);
    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "No record updated. Check if ID exists." });
    }
    return res.status(200).json({ message: "Substance Use History Form updated successfully!" });
  } catch (err) {
    console.error("Error in update Substance Use History:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

const updateSuicidalData = async (req, res) => {
  try {
    const {
      suicide_history,
      triggers_stressors,
      homicidal_ideation,
      target_method,
      immediate_threat,
      emergency_response,
      hospital_required,
    } = req.body;

    const {admission_no, date} = req.params;

    const uquery = `UPDATE suicidal_data SET
                    suicide_history = ?,
                    triggers_stressors = ?,
                    homicidal_ideation = ?,
                    target_method = ?,
                    immediate_threat = ?,
                    emergency_response = ?,
                    hospital_required = ?
                    WHERE admission_no = ? AND date = ?`;

    const values = [
      suicide_history,
      triggers_stressors,
      homicidal_ideation,
      target_method,
      immediate_threat,
      emergency_response,
      hospital_required,
      admission_no, date
    ];
    const [result] = await db.query(uquery, values);
    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "No record updated. Check if ID exists." });
    }
    return res.status(200).json({ message: "Suicidal and Homicidal Ideation Form updated successfully!" });
  } catch (err) {
    console.error("Error in update Suicidal and Homicidal Ideation:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

const UpdateSpeech = async (req, res) => {
  try {
    const {
      rate_quantity, volume_tone, flow_rhythm
    } = req.body;

    const { admission_no, date } = req.params;

    const uquery = `UPDATE speech SET 
                    rate_quantity = ?, 
                    volume_tone = ?, 
                    flow_rhythm = ?
                    WHERE admission_no = ? AND date = ?`;

    const values = [
      rate_quantity.join(", "),
      volume_tone.join(", "),
      flow_rhythm.join(", "),
      admission_no, date
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

    const { admission_no, date } = req.params;

    const uquery = `UPDATE mood_affect SET 
                    mood_description = ?, 
                    appearance = ?, 
                    resident_feeling = ?,
                    general_feeling = ?,
                    mood_like = ?,
                    resident_general_feeling = ?,
                    resident_look = ?
                    WHERE admission_no = ? AND date =?`;

    const values = [
      mood_description.join(", "),
      appearance,
      resident_feeling,
      general_feeling,
      mood_like,
      resident_general_feeling,
      resident_look.join(", "),
      admission_no, date
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

    const { admission_no, date } = req.params;

    const uquery = `UPDATE though_form SET 
                    stream_form_though = ?, 
                    content_though = ?
                    WHERE admission_no = ? AND date = ?`;

    const values = [
      stream_form_though.join(", "),
      content_though.join(", "),
      admission_no, date
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

    const { admission_no, date } = req.params;

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
                    WHERE admission_no = ? AND date = ?`;

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
      admission_no, date
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

    const { admission_no, date } = req.params;

    const uquery = `UPDATE judgement SET 
                    personal_judgement = ?, 
                    social_judgement = ?,
                    test_judgement = ?,
                    judgement = ?
                    WHERE admission_no = ? AND date = ?`;

    const values = [
      personal_judgement,
      social_judgement,
      test_judgement,
      judgement,
      admission_no, date
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

    const { admission_no, date } = req.params;

    const uquery = `UPDATE insight SET 
                    denail_illness = ?, 
                    slight_awareness = ?,
                    awarness_sick = ?,
                    awarness_illness = ?,
                    intellectual_insight = ?,
                    true_emotion = ?
                    WHERE admission_no = ? AND date = ?`;

    const values = [
      denail_illness,
      slight_awareness,
      awarness_sick,
      awarness_illness,
      intellectual_insight,
      true_emotion,
      admission_no, date
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

    const { admission_no, date } = req.params;

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
  recall = ?,
  patient_place = ?,
  dinner_ate = ?, 
  date_ofMrg = ?,
  birthdays_children = ?, 
  person_past = ?,
  amnesia = ?,
  live_growing = ?, 
  person_school = ?,
  breakfast_ques = ?,
  do_yesterday = ?,
  general_info = ?,
  test_red_wri = ?,
  calculation_test = ?,
  proverb_testing = ?,
  familiar_object = ?
  WHERE admission_no = ? AND date = ?`;

    const values = [
      consciousness.join(', '), orientation_time, orientation_place, orientation_person, consciousnessState.join(', '), canConcentrate,
      distractibility, asking_test, names_months, test_performance, immediate_retention,
      recall, patient_place, dinner_ate, date_ofMrg, birthdays_children, person_past, amnesia,
      live_growing, person_school, breakfast_ques, do_yesterday, general_info, test_red_wri, calculation_test, proverb_testing,
      familiar_object, admission_no, date
    ];
    const [result] = await db.query(uquery, values);
    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "No record updated. Check if ID exists." });
    }
    return res.status(200).json({ message: "Cognition Form updated successfully!" });
  } catch (err) {
    console.error("Error in updateCognition:", err.message);  // log the error message
    return res.status(500).json({ error: err.message });       // send detailed error for debugging
  }
}


const getallappearance = async (req, res) => {
  const { admission_no, date } = req.params;
  const query = 'SELECT * FROM general_appearance WHERE admission_no = ? AND date = ?';

  try {
    const [results] = await db.query(query, [admission_no, date]);
    if (results.length === 0) {
      return res.status(404).json({ message: 'No form found for this Admission Number and Date' });
    }
    res.json(results[0]); // Send the matched row
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Database error' });
  }
}


const getallmood = async (req, res) => {
  const { admission_no, date } = req.params;
  const query = 'SELECT * FROM mood_affect WHERE admission_no = ? AND date = ?';

  try {
    const [results] = await db.query(query, [admission_no, date]);
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
  const { admission_no, date } = req.params;
  const query = 'SELECT * FROM speech WHERE admission_no = ? AND date = ?';
  try {
    const [results] = await db.query(query, [admission_no, date]);
    if (results.length === 0) {
      return res.status(404).json({ message: 'No form found for this Admission Number and Date' });
    }
    res.json(results[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Database error' });
  }
}

const getallThough = async (req, res) => {
  const { admission_no, date } = req.params;
  const query = 'SELECT * FROM though_form WHERE admission_no = ? AND date = ?';

  try {
    const [results] = await db.query(query, [admission_no, date]);
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
  const { admission_no, date } = req.params;
  const query = 'SELECT * FROM perception WHERE admission_no = ? AND date = ?';

  try {
    const [results] = await db.query(query, [admission_no, date]);
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
  const { admission_no, date } = req.params;
  const query = 'SELECT * FROM judgement WHERE admission_no = ? AND date = ?';

  try {
    const [results] = await db.query(query, [admission_no, date]);
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
  const { admission_no, date } = req.params;
  const query = 'SELECT * FROM insight WHERE admission_no = ? AND date = ?';

  try {
    const [results] = await db.query(query, [admission_no, date]);
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
  const { admission_no, date } = req.params;
  const query = 'SELECT * FROM conginition WHERE admission_no = ? AND date = ?';

  try {
    const [results] = await db.query(query, [admission_no, date]);
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

    const [appearance_behaviour] = await db.query(
      `SELECT * FROM general_appearance WHERE admission_no = ? ORDER BY date ASC`,
      [admission_no]
    );
    if (appearance_behaviour.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }

    const fullForms = [];

    for (const basic of appearance_behaviour) {
      const date = basic.date;

      const [speech] = await db.query(
        `SELECT * FROM speech WHERE admission_no = ? AND date = ?`,
        [admission_no, date]
      );

      const [mood_affect] = await db.query(
        `SELECT * FROM mood_affect WHERE admission_no = ? AND date = ?`,
        [admission_no, date]
      );

      const [though] = await db.query(
        `SELECT * FROM though_form WHERE admission_no = ? AND date = ?`,
        [admission_no, date]
      );

      const [perceiption] = await db.query(
        `SELECT * FROM perception WHERE admission_no = ? AND date = ?`,
        [admission_no, date]
      );

      const [conginition] = await db.query(
        `SELECT * FROM conginition WHERE admission_no = ? AND date = ?`,
        [admission_no, date]
      );

      const [judgement] = await db.query(
        `SELECT * FROM judgement WHERE admission_no = ? AND date = ?`,
        [admission_no, date]
      );

      const [insight] = await db.query(
        `SELECT * FROM insight WHERE admission_no = ? AND date = ?`,
        [admission_no, date]
      );

      // Combine into one full set
      fullForms.push({
        date: basic.date,
        appearance_behaviour: basic || null,
        speech: speech[0] || null,
        mood_affect: mood_affect[0] || null,
        though: though[0] || null,
        perceiption: perceiption[0] || null,
        conginition: conginition[0] || null,
        judgement: judgement[0] || null,
        insight: insight[0] || null
      });
    }
    return res.status(200).json(fullForms);
  } catch (error) {
    console.error("Error fetching MSE form data:", error);
    return res.status(500).json({ message: "Internal server error", error });
  }
};

const createBasicInformation = async (req, res) => {
  try {
    const {
      admission_no,
      date,
      patient_name,
      patient_age,
      patient_gender,
      sexual_orientation,
      education_bg,
      occupation,
      marital_status,
      economic_status,
      religion,
      informant,
      residential_address,
      living_arrangements,
      family_structure,
      cultural_identity,
      language1,
      language2

    } = req.body;

    const query = `INSERT INTO basic_detail(
    admission_no, date, patient_name, patient_age, patient_gender, sexual_orientation,
    education_bg, occupation, marital_status,economic_status,
    religion,informant, residential_address,living_arrangements,
    family_structure,cultural_identity,language1,language2)
    VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

    const values = [
      admission_no, date, patient_name, patient_age, patient_gender, sexual_orientation,
      education_bg, occupation, marital_status, economic_status, religion,
      informant, residential_address, living_arrangements, family_structure, cultural_identity, language1, language2
    ];

    const [result] = await db.query(query, values);
    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "No record inserted" });
    }
    res.status(201).json({ message: "Demographic Information form created successfully" });
  } catch (err) {
    console.error("Error in create Demographic Information Form:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

const createChiefComplaint = async (req, res) => {
  try {
    const {
      admission_no,
      date,
      chief_complaint,
      onset_duration,
      nature_symptoms,
      severity,
      course_type,
      nature_illness,
      identify_trigger,
      life_changes,
      biological,
      psychological,
      social_environment
    } = req.body;

    const query = `INSERT INTO cheif_complaint(admission_no,date,chief_complaint, onset_duration, nature_symptoms,
    severity, course_type, nature_illness, identify_trigger, life_changes, biological,
    psychological, social_environment)VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)`;

    const values = [
      admission_no,
      date,
      chief_complaint,
      onset_duration,
      nature_symptoms,
      severity,
      course_type,
      nature_illness,
      identify_trigger,
      life_changes,
      biological,
      psychological,
      social_environment
    ];

    const [result] = await db.query(query, values);
    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "No record inserted" });
    }
    res.status(201).json({ message: "Chief Complaint Form created successfully" });
  } catch (err) {
    console.error("Error in create Chief Complaint Form:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

const createPresenting = async (req, res) => {
  try {
    const {
      admission_no,
      date,
      history_presenting,
      mood_affect,
      though_content,
      though_process,
      perception,
      behavioural_changes,
      sleep_patterns,
      energy_level,
      appetite_weight,
      occupation_academic,
      interpersonal_relationship,
      selfCare_activity,
      recreation_activity,
    } = req.body;

    const query = `INSERT INTO presenting_problems(admission_no,date, history_presenting, mood_affect, though_content,
    though_process, perception, behavioural_changes, sleep_patterns, energy_level, appetite_weight,
    occupation_academic, interpersonal_relationship, selfCare_activity, recreation_activity)VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

    const values = [admission_no, date, history_presenting,
      mood_affect.join(", "),
      though_content.join(", "),
      though_process.join(", "),
      perception.join(", "),
      behavioural_changes.join(", "),
      sleep_patterns.join(", "),
      energy_level, appetite_weight, occupation_academic, interpersonal_relationship,
      selfCare_activity, recreation_activity,
    ];

    const [result] = await db.query(query, values);
    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "No record inserted" });
    }
    res.status(201).json({ message: "Presenting Problems Form created successfully" });
  } catch (err) {
    console.error("Error in create Presenting Problems Form:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

const createPsyHistory = async (req, res) => {
  try {
    const {
      admission_no,
      date,
      psychiatric_diagnoses,
      treatment_history,
      medications,
      dosage,
      adherence,
      sideEffect,
      experience_reaction,
      hospitalisation_reason,
      duration,
      crisis_episodes,
      fm_mentalHealth,
      significant_life,
      chronic_stressors,
      trauma_exploration,
      legal_environment
    } = req.body;

    const query = `INSERT INTO psy_history(admission_no, date, psychiatric_diagnoses,
    treatment_history, medications, dosage, adherence, sideEffect, experience_reaction,
    hospitalisation_reason, duration, crisis_episodes, fm_mentalHealth, significant_life,
    chronic_stressors, trauma_exploration, legal_environment)
    VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

    const values = [
      admission_no, date,
      psychiatric_diagnoses,
      treatment_history,
      medications,
      dosage,
      adherence,
      sideEffect,
      experience_reaction,
      hospitalisation_reason,
      duration,
      crisis_episodes,
      fm_mentalHealth,
      significant_life,
      chronic_stressors,
      trauma_exploration.join(", "),
      legal_environment.join(", ")
    ];
    const [result] = await db.query(query, values);
    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "No record inserted" });
    }
    res.status(201).json({ message: "Psychiatric History Form created successfully" });
  } catch (err) {
    console.error("Error in create Psychiatric History Form:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

const createMedicalData = async (req, res) => {
  try {
    const {
      admission_no,
      date,
      disability_status,
      chronic_medical,
      acute_health,
      medication,
      medication_allergies,
      other_allergy,
      significant_medical,
      traumatic_injuries,
      sexual_health
    } = req.body;

    const query = `INSERT INTO medical_history(admission_no,date,disability_status, chronic_medical,
    acute_health,medication,medication_allergies,other_allergy,significant_medical,traumatic_injuries,sexual_health)
    VALUES(?,?,?,?,?,?,?,?,?,?,?)`;

    const values = [
      admission_no,
      date,
      disability_status,
      chronic_medical,
      acute_health,
      medication,
      medication_allergies,
      other_allergy.join(", "),
      significant_medical.join(", "),
      traumatic_injuries,
      sexual_health.join(", ")
    ];
    const [result] = await db.query(query, values);
    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "No record inserted" });
    }
    res.status(201).json({ message: "Medical History Form created successfully" });
  } catch (err) {
    console.error("Error in create Medical History Form:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

const createFamilyHistoryData = async (req, res) => {
  try {
    const {
      admission_no,
      date,
      family_composition,
      family_dynamics,
      marriage_type,
      family_history,
      genetic_predisposition,
      family_changes,
      family_substance
    } = req.body;

    const query = `INSERT INTO familyhis_data(admission_no,date,family_composition,family_dynamics,
    marriage_type,family_history,genetic_predisposition,family_changes,family_substance)VALUES(?,?,?,?,?,?,?,?,?);`

    const values = [
      admission_no,
      date,
      family_composition.join(", "),
      family_dynamics.join(", "),
      marriage_type,
      family_history,
      genetic_predisposition,
      family_changes.join(", "),
      family_substance
    ];
    const [result] = await db.query(query, values);
    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "No record inserted" });
    }
    res.status(201).json({ message: "Family History Form created successfully" });
  } catch (err) {
    console.error("Error in create Family History Form:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

const createSocialHistoryData = async (req, res) => {
  try {
    const {
      family_relationship,
      admission_no,
      date,
      socialCircle_relationship,
      relationship_significant,
      living_arrangements,
      education_bg,
      currentEmp_status,
      socialRecreation_activity,
      social_outlets,
      socialMed_engagement,
      technology_related,
    } = req.body;

    const query = `INSERT INTO social_history (
        admission_no, date, family_relationship, socialCircle_relationship, relationship_significant, living_arrangements, education_bg,
        currentEmp_status, socialRecreation_activity, social_outlets, socialMed_engagement, technology_related
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`;


    const values = [
      admission_no, date, family_relationship, socialCircle_relationship, relationship_significant, living_arrangements, education_bg, currentEmp_status, socialRecreation_activity,
      social_outlets, socialMed_engagement, technology_related
    ];
    const [result] = await db.query(query, values);
    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "No record inserted" });
    }
    res.status(200).json({ message: "Social History Form created Successfully" });
  } catch (err) {
    console.error("Error in create Social History Form:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

const createDevelopmentalData = async (req, res) => {
  try {
    const {
      admission_no,
      date,
      prenatal_factors,
      birth_details,
      birth_order,
      siblings_number,
      bonding_attachment,
      milestones_development,
      childhood_illness,
      siblings_relationship,
      parenting_style,
      learning_challenge,
      pubertal_development,
    } = req.body;

    const query = `INSERT INTO development_history(admission_no, date, prenatal_factors, birth_details, birth_order, siblings_number, bonding_attachment,
    milestones_development, childhood_illness, siblings_relationship, parenting_style, learning_challenge, pubertal_development)VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)`;

    const values = [
      admission_no,
      date,
      prenatal_factors,
      birth_details,
      birth_order,
      siblings_number,
      bonding_attachment,
      milestones_development,
      childhood_illness,
      siblings_relationship,
      parenting_style,
      learning_challenge,
      pubertal_development,
    ];
    const [result] = await db.query(query, values);
    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "No record inserted" });
    }
    res.status(200).json({ message: "Developmental History Form created Successfully" });
  } catch (err) {
    console.error("Error in create Developmental History Form:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

const createSubstanceData = async (req, res) => {
  try {
    const {
      admission_no,
      date,
      substance_use,
      age_onset,
      frequency,
      quantity,
      motivation_use,
      environmental_trigger,
      impact_occupation,
      impact_interpersonal,
      financial_consequences,
      craving_intensity,
      previous_treatment,
      relapse_history,
    } = req.body;

    const query = `INSERT INTO substance_use(admission_no, date, substance_use, age_onset, frequency, quantity, motivation_use, environmental_trigger,
    impact_occupation, impact_interpersonal, financial_consequences, craving_intensity, previous_treatment, relapse_history)VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;

    const values = [
      admission_no,
      date,
      substance_use,
      age_onset,
      frequency,
      quantity,
      motivation_use,
      environmental_trigger,
      impact_occupation,
      impact_interpersonal,
      financial_consequences,
      craving_intensity,
      previous_treatment,
      relapse_history,
    ];
    const [result] = await db.query(query, values);
    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "No record inserted" });
    }
    res.status(200).json({ message: "Developmental History Form created Successfully" });

  } catch (err) {
    console.error("Error in create Developmental History Form:", err);
    return res.status(500).json({ error: "Internal server error" });
  }

}

const createSuicidalData = async (req, res) => {
  try {
    const {
      admission_no,
      date,
      suicide_history,
      triggers_stressors,
      homicidal_ideation,
      target_method,
      immediate_threat,
      emergency_response,
      hospital_required
    } = req.body;
    const query = `INSERT INTO suicidal_data(admission_no, date, suicide_history, triggers_stressors, homicidal_ideation,
    target_method, immediate_threat, emergency_response, hospital_required)VALUES(?,?,?,?,?,?,?,?,?)`;
    const values = [
      admission_no,
      date,
      suicide_history,
      triggers_stressors,
      homicidal_ideation,
      target_method,
      immediate_threat,
      emergency_response,
      hospital_required
    ];
    const [result] = await db.query(query, values);
    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "No record inserted" });
    }
    res.status(200).json({ message: "Suicidal and Homicidal Ideation Form created Successfully" });

  } catch (err) {
    console.error("Error in create Suicidal and Homicidal Ideation Form:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}

const getInformation = async (req, res) => {
  const {admission_no, date} = req.params;
  const query = 'SELECT * FROM basic_detail WHERE admission_no = ? AND date = ?';
  try {
    const [results] = await db.query(query, [admission_no, date]);
    if (results.length === 0) {
      return res.status(404).json({ message: 'Demographic Information Form not found' });
    }
    res.json(results[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Database error' });
  }
}

const getCheifComplaint = async (req, res) => {
  const {admission_no, date} = req.params;
  const query = 'SELECT * FROM cheif_complaint WHERE admission_no = ? AND date = ?';
  try {
    const [results] = await db.query(query, [admission_no, date]);
    if (results.length === 0) {
      return res.status(404).json({ message: 'Cheif Complaint Form not found' });
    }
    res.json(results[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Database error' });
  }
}

const getPresentingData = async (req, res) => {
  const {admission_no, date} = req.params;
  const query = 'SELECT * FROM presenting_problems WHERE admission_no = ? AND date = ?';
  try {
    const [results] = await db.query(query, [admission_no, date]);
    if (results.length === 0) {
      return res.status(404).json({ message: 'Presenting Problems Form not found' });
    }
    res.json(results[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Database error' });
  }
}

const getPsychiatricData = async (req, res) => {
  const {admission_no, date} = req.params;
  const query = 'SELECT * FROM psy_history WHERE admission_no = ? AND date = ?';
  try {
    const [results] = await db.query(query, [admission_no, date]);
    if (results.length === 0) {
      return res.status(404).json({ message: 'Psychiatric History Form not found' });
    }
    res.json(results[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Database error' });
  }
}

const getMedicalHistory = async (req, res) => {
  const {admission_no, date} = req.params;
  const query = 'SELECT * FROM medical_history WHERE admission_no = ? AND date = ?';
  try {
    const [results] = await db.query(query, [admission_no, date]);
    if (results.length === 0) {
      return res.status(404).json({ message: 'Medical History Form not found' });
    }
    res.json(results[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Database error' });
  }
}

const getFamilyHistory = async (req, res) => {
  const {admission_no, date} = req.params;
  const query = 'SELECT * FROM familyhis_data WHERE admission_no = ? AND date = ?';
  try {
    const [results] = await db.query(query, [admission_no, date]);
    if (results.length === 0) {
      return res.status(404).json({ message: 'Family History Form not found' });
    }
    res.json(results[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Database error' });
  }
}

const getSocialHistory = async (req, res) => {
  const {admission_no, date} = req.params;
  const query = 'SELECT * FROM social_history WHERE admission_no = ? AND date = ?';
  try {
    const [results] = await db.query(query, [admission_no, date]);
    if (results.length === 0) {
      return res.status(404).json({ message: 'Social History Form not found' });
    }
    res.json(results[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Database error' });
  }
}

const getDevelopmentalHistory = async (req, res) => {
  const {admission_no, date} = req.params;
  const query = 'SELECT * FROM development_history WHERE admission_no = ? AND date = ?';
  try {
    const [results] = await db.query(query, [admission_no, date]);
    if (results.length === 0) {
      return res.status(404).json({ message: 'Developmental History Form not found' });
    }
    res.json(results[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Database error' });
  }
}

const getSubstanceUse = async (req, res) => {
  const {admission_no, date} = req.params;
  const query = 'SELECT * FROM substance_use WHERE admission_no = ? AND date = ?';
  try {
    const [results] = await db.query(query, [admission_no, date]);
    if (results.length === 0) {
      return res.status(404).json({ message: 'Substance Use History Form not found' });
    }
    res.json(results[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Database error' });
  }
}

const getSuicidialData = async (req, res) => {
  const {admission_no, date} = req.params;
  const query = 'SELECT * FROM suicidal_data WHERE admission_no = ? AND date = ?';
  try {
    const [results] = await db.query(query, [admission_no, date]);
    if (results.length === 0) {
      return res.status(404).json({ message: 'Suicidal and Homicidal Ideation Form not found' });
    }
    res.json(results[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Database error' });
  }
}

const getallPsychiatric = async (req, res) => {
  try {
    const admission_no = req.params.admission_no;

    // Step 1: Get all basic_detail entries by admission_no
    const [basicEntries] = await db.query(
      `SELECT * FROM basic_detail WHERE admission_no = ? ORDER BY date ASC`,
      [admission_no]
    );

    if (basicEntries.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }

    const fullForms = [];

    for (const basic of basicEntries) {
      const date = basic.date;

      // For each form table, get row where admission_no and date match
      const [cheif_complaint] = await db.query(
        `SELECT * FROM cheif_complaint WHERE admission_no = ? AND date = ?`,
        [admission_no, date]
      );

      const [presenting_problems] = await db.query(
        `SELECT * FROM presenting_problems WHERE admission_no = ? AND date = ?`,
        [admission_no, date]
      );

      const [psy_history] = await db.query(
        `SELECT * FROM psy_history WHERE admission_no = ? AND date = ?`,
        [admission_no, date]
      );

      const [medical_history] = await db.query(
        `SELECT * FROM medical_history WHERE admission_no = ? AND date = ?`,
        [admission_no, date]
      );

      const [familyhis_data] = await db.query(
        `SELECT * FROM familyhis_data WHERE admission_no = ? AND date = ?`,
        [admission_no, date]
      );

      const [social_history] = await db.query(
        `SELECT * FROM social_history WHERE admission_no = ? AND date = ?`,
        [admission_no, date]
      );

      const [development_history] = await db.query(
        `SELECT * FROM development_history WHERE admission_no = ? AND date = ?`,
        [admission_no, date]
      );

      const [substance_use] = await db.query(
        `SELECT * FROM substance_use WHERE admission_no = ? AND date = ?`,
        [admission_no, date]
      );

      const [suicidal_data] = await db.query(
        `SELECT * FROM suicidal_data WHERE admission_no = ? AND date = ?`,
        [admission_no, date]
      );

      // Combine into one full set
      fullForms.push({
        date: basic.date,
        basic_detail: basic || null,
        cheif_complaint: cheif_complaint[0] || null,
        presenting_problems: presenting_problems[0] || null,
        psy_history: psy_history[0] || null,
        medical_history: medical_history[0] || null,
        familyhis_data: familyhis_data[0] || null,
        social_history: social_history[0] || null,
        development_history: development_history[0] || null,
        substance_use: substance_use[0] || null,
        suicidal_data: suicidal_data[0] || null
      });
    }

    return res.status(200).json(fullForms);

  } catch (error) {
    console.error("Error fetching psychiatric form data:", error);
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
  updateAppearance, UpdateSpeech, UpdateMood, updateThough, updatePerception, updateJudgement, updateInsight, updateCognition,
  createBasicInformation, createChiefComplaint, createPresenting, createPsyHistory, createMedicalData, createFamilyHistoryData,
  createSocialHistoryData, createDevelopmentalData, createSubstanceData, createSuicidalData,
  getInformation, getCheifComplaint, getPresentingData, getPsychiatricData, getMedicalHistory, getFamilyHistory, getSocialHistory,
  getDevelopmentalHistory, getSubstanceUse, getSuicidialData, getallPsychiatric,
  updateInformation, updateCheifComplaint, updatePresentingData, updatePsychiatricData, updateMedicalHistoryData,
  updateFamilyHistoryData, updateSocialHistoryData, updateDevelopmentalData, updateSubstanceData, updateSuicidalData
};