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

  db.query(query, values, (err, results) => {
    if (err) {
      console.error("Insert error:", err);
      return res.status(500).json({ error: "Database insert error" });
    }
    res.status(200).json({ message: "Data inserted successfully" });
  });
}

const createSpeech = (req, res) => {
  const { admission_no, rate_quantity, volume_tone, flow_rhythm } = req.body;

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

  db.query(query, values, (err, results) => {
    if (err) {
      console.error("Insert error:", err);
      return res.status(500).json({ error: "Database insert error" });
    }
    res.status(200).json({ message: "Data inserted successfully" });
  });
}

const createThough = (req, res) => {
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

  db.query(query, values, (err, results) => {
    if (err) {
      console.error("Insert error:", err);
      return res.status(500).json({ error: "Database insert error" });
    }
    res.status(200).json({ message: "Data inserted successfully" });
  });
}

const createPerception = (req, res) => {
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

  db.query(query, values, (err, results) => {
    if (err) {
      console.error("Insert error:", err);
      return res.status(500).json({ error: "Database insert error" });
    }
    res.status(200).json({ message: "Data inserted successfully" });
  });
}

const createJudgement = (req, res) => {
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

  db.query(query, values, (err, results) => {
    if (err) {
      console.error("Insert error:", err);
      return res.status(500).json({ error: "Database insert error" });
    }
    res.status(200).json({ message: "Data inserted successfully" });
  });
}

const createInsight = (req, res) => {
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

  db.query(query, values, (err, results) => {
    if (err) {
      console.error("Insert error:", err);
      return res.status(500).json({ error: "Database insert error" });
    }
    res.status(200).json({ message: "Data inserted successfully" });
  });
}

const createCognition = (req, res) => {
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

  db.query(query, values, (err, results) => {
    if (err) {
      console.error("Insert error:", err);
      return res.status(500).json({ error: "Database insert error" });
    }
    res.status(200).json({ message: "Data inserted successfully" });
  });
}

const createArticles = (req, res) => {
  upload(req, res, (err) => {
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
    db.query(createquery, values, (dbErr, data) => {
      if (dbErr) {
        return res.status(500).json({ message: "Database Error", error: dbErr });
      }
      res.status(201).json({ message: "Rescue Condition Created Successfully", data });
    });
  });
};

const getArticles = (req, res) => {
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

const updateArticles = (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(500).json({ message: "File upload failed", error: err });
    }

    const {
      rescue_name, date_time, collected_items
    } = req.body;

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

const updateAppearance = (req, res) => {
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

  db.query(uquery, values, (updateErr, result) => {
    if (updateErr) {
      return res.status(500).json({ message: "Update failed", error: updateErr });
    }

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "No record updated. Check if ID exists." });
    }

    return res.status(200).json({ message: "General appearance Form updated successfully!" });
  });


}

const UpdateSpeech = (req, res) => {
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

  db.query(uquery, values, (updateErr, result) => {
    if (updateErr) {
      return res.status(500).json({ message: "Update failed", error: updateErr });
    }

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "No record updated. Check if ID exists." });
    }

    return res.status(200).json({ message: "Speech Form updated successfully!" });
  });

}

const UpdateMood = (req, res) => {
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

  db.query(uquery, values, (updateErr, result) => {
    if (updateErr) {
      return res.status(500).json({ message: "Update failed", error: updateErr });
    }

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "No record updated. Check if ID exists." });
    }

    return res.status(200).json({ message: "Mood and Affect Form updated successfully!" });
  });

}

const updateThough = (req, res) => {
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

  db.query(uquery, values, (updateErr, result) => {
    if (updateErr) {
      return res.status(500).json({ message: "Update failed", error: updateErr });
    }

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "No record updated. Check if ID exists." });
    }

    return res.status(200).json({ message: "Though Form updated successfully!" });
  });

}

const updatePerception = (req, res) => {
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

  db.query(uquery, values, (updateErr, result) => {
    if (updateErr) {
      return res.status(500).json({ message: "Update failed", error: updateErr });
    }

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "No record updated. Check if ID exists." });
    }

    return res.status(200).json({ message: "Perception Form updated successfully!" });
  });

}

const updateJudgement = (req, res) => {
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

  db.query(uquery, values, (updateErr, result) => {
    if (updateErr) {
      return res.status(500).json({ message: "Update failed", error: updateErr });
    }

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "No record updated. Check if ID exists." });
    }

    return res.status(200).json({ message: "Judgement Form updated successfully!" });
  });

}

const updateInsight = (req, res) => {
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

  db.query(uquery, values, (updateErr, result) => {
    if (updateErr) {
      return res.status(500).json({ message: "Update failed", error: updateErr });
    }

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "No record updated. Check if ID exists." });
    }

    return res.status(200).json({ message: "Insight Form updated successfully!" });
  });
}

const updateCognition = (req, res) => {
  const {
    consciousness, orientation_time, orientation_place, orientation_person, consciousnessState,canConcentrate,
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

  db.query(uquery, values, (updateErr, result) => {
    if (updateErr) {
      return res.status(500).json({ message: "Update failed", error: updateErr });
    }

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "No record updated. Check if ID exists." });
    }

    return res.status(200).json({ message: "Insight Form updated successfully!" });
  });
}

const getallappearance = (req, res) => {
  const admission_no = req.params.admission_no;
  const query = 'SELECT * FROM appearance_behaviour WHERE admission_no = ?';

  db.query(query, [admission_no], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'General Appearance Form not found' });
    }

    res.json(results[0]);
  });
}

const getallmood = (req, res) => {
  const admission_no = req.params.admission_no;
  const query = 'SELECT * FROM mood_affect WHERE admission_no = ?';

  db.query(query, [admission_no], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Mood and Affect Form not found' });
    }

    res.json(results[0]);
  });
}

const getallspeech = (req, res) => {
  const admission_no = req.params.admission_no;
  const query = 'SELECT * FROM speech WHERE admission_no = ?';

  db.query(query, [admission_no], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Speech Form not found' });
    }

    res.json(results[0]);
  });
}

const getallThough = (req, res) => {
  const admission_no = req.params.admission_no;
  const query = 'SELECT * FROM though_form WHERE admission_no = ?';

  db.query(query, [admission_no], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Though Form not found' });
    }

    res.json(results[0]);
  });
}

const getallperception = (req, res) => {
  const admission_no = req.params.admission_no;
  const query = 'SELECT * FROM perception WHERE admission_no = ?';

  db.query(query, [admission_no], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Perception Form not found' });
    }

    res.json(results[0]);
  });
}

const getalljudgement = (req, res) => {
  const admission_no = req.params.admission_no;
  const query = 'SELECT * FROM judgement WHERE admission_no = ?';

  db.query(query, [admission_no], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Judgement Form not found' });
    }

    res.json(results[0]);
  });
}

const getallInsight = (req, res) => {
  const admission_no = req.params.admission_no;
  const query = 'SELECT * FROM insight WHERE admission_no = ?';

  db.query(query, [admission_no], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Insight Form not found' });
    }

    res.json(results[0]);
  });
}

const getallcognition = (req, res) => {
  const admission_no = req.params.admission_no;
  const query = 'SELECT * FROM conginition WHERE admission_no = ?';

  db.query(query, [admission_no], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Database error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Conginition Form not found' });
    }

    res.json(results[0]);
  });
}

const getMseAllForm = async (req, res) => {

  const admission_no = req.params.admission_no;

  const query1 = `SELECT * FROM appearance_behaviour WHERE admission_no = ?`;
  const query2 = `SELECT * FROM speech WHERE admission_no = ?`;
  const query3 = `SELECT * FROM mood_affect WHERE admission_no = ?`;
  const query4 = `SELECT * FROM though_form WHERE admission_no = ?`;
  const query5 = `SELECT * FROM perception WHERE admission_no = ?`;
  const query6 = `SELECT * FROM conginition WHERE admission_no = ?`;
  const query7 = `SELECT * FROM judgement WHERE admission_no = ?`;
  const query8 = `SELECT * FROM insight WHERE admission_no = ?`;

  db.query(query1, [admission_no], (err1, results1) => {
    if (err1) return res.status(500).json({ error: err1 });

    db.query(query2, [admission_no], (err2, results2) => {
      if (err2) return res.status(500).json({ error: err2 });

      db.query(query3, [admission_no], (err3, results3) => {
        if (err3) return res.status(500).json({ error: err3 });

        db.query(query4, [admission_no], (err4, results4) => {
          if (err4) return res.status(500).json({ error: err4 });

          db.query(query5, [admission_no], (err5, results5) => {
            if (err5) return res.status(500).json({ error: err5 });

            db.query(query6, [admission_no], (err6, results6) => {
              if (err6) return res.status(500).json({ error: err6 });

              db.query(query7, [admission_no], (err7, results7) => {
                if (err7) return res.status(500).json({ error: err7 });

                db.query(query8, [admission_no], (err8, results8) => {
                  if (err8) return res.status(500).json({ error: err8 });

                  res.json({
                    appearance_behaviour: results1[0] || null,
                    speech: results2[0] || null,
                    mood_affect: results3[0] || null,
                    though: results4[0] || null,
                    perceiption: results5[0] || null,
                    conginition: results6[0] || null,
                    judgement: results7[0] || null,
                    insight: results8[0] || null
                  });
                });
              });
            });
          });
        });
      });
    });
  });
};


module.exports = {
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