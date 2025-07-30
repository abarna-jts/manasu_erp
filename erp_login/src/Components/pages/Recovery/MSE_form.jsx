import React from 'react'
import { useState, useEffect } from 'react';
import { Col, Breadcrumb, Container, Row, Table, Button, InputGroup, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPlus, faEdit } from "@fortawesome/free-solid-svg-icons";
import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import axios from 'axios';
import manasu_logo from '../Admission/Manasu-Logo.png';
import Modal from 'react-bootstrap/Modal';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

function MSE_form() {
  const [rescueImage, setRescueImage] = useState(null);
  const [rescueName, setRescueName] = useState("");
  const [error, setError] = useState("");
  const [admission_no, setAdmissionNumber] = useState('');
  const [canConcentrate, setCanConcentrate] = useState('');
  const [selectedStates, setSelectedStates] = useState([]);
  const [shouldGeneratePDF, setShouldGeneratePDF] = useState(false);
  const [date, setDate] = useState('');
  const [allFormEntries, setAllFormEntries] = useState([]);
  const [formData, setFormData] = useState({
    admission_no: '',
    date: '',
    general_appearance: [],
    attitude: [],
    comprehension: [],
    gait_posture: [],
    motor_activity: [],
    catatonic_sign: [],
    conversion_dissociative: [],
    social_manner: [],
    rapport: [],
    hallucinatory_behaviour: []
  });

  const [speechFormData, setSpeechFormData] = useState({
    rate_quantity: [],
    volume_tone: [],
    flow_rhythm: [],
    admission_no: "",
    date: '',
  });

  const [moodFormData, setMoodFormData] = useState({
    mood_description: [],
    appearance: "",
    resident_feeling: "",
    general_feeling: "",
    mood_like: "",
    resident_general_feeling: "",
    resident_look: [],
    admission_no: "",
    date: '',
  });

  const [thoughFormData, setThoughFormData] = useState({
    stream_form_though: [],
    content_though: [],
    admission_no: '',
    date: '',
  })

  const [judgementData, setJudgementFormData] = useState({
    personal_judgement: '',
    social_judgement: '',
    test_judgement: '',
    judgement: '',
    admission_no: '',
    date: '',
  })

  const [insightData, setInsightData] = useState({
    denail_illness: '',
    slight_awareness: '',
    awarness_sick: '',
    awarness_illness: '',
    intellectual_insight: '',
    true_emotion: '',
    admission_no: '',
    date: '',
  })

  const [perceptionData, setPerceptionData] = useState({
    hallucination_type: [],
    heard: '',
    voices_heard: '',
    part_of_day: '',
    female_male_voices: '',
    interpreted_person: '',
    illusion: [],
    perception_changes: [],
    somatic: [],
    others: [],
    admission_no: '',
    date: '',
  })

  const [cognitionData, setCognitionData] = useState({
    consciousness: [],
    orientation_time: '',
    orientation_place: '',
    orientation_person: '',
    consciousnessState: '',
    canConcentrate: '',
    distractibility: '',
    asking_test: '',
    names_months: '',
    test_performance: '',
    immediate_retention: '',
    recall: '',
    patient_place: '',
    dinner_ate: '',
    date_ofMrg: '',
    birthdays_children: '',
    person_past: '',
    amnesia: '',
    live_growing: '',
    person_school: '',
    breakfast_ques: '',
    do_yesterday: '',
    general_info: '',
    test_red_wri: '',
    calculation_test: '',
    proverb_testing: '',
    familiar_object: '',
    admission_no: '',
    date: '',

  })

  const userType = Cookies.get('usertype');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJudgementFormData((prev) => ({
      ...prev,
      [name]: value, // dynamically set field, like formData.judgment
    }));
  };

  const handleChange1 = (e) => {
    const { name, value } = e.target;

    setCognitionData((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };
  const handleCheckboxChange1 = (e) => {
    const { id, checked } = e.target;

    let updatedStates = [...selectedStates];

    if (checked) {
      updatedStates.push(id);
    } else {
      updatedStates = updatedStates.filter((item) => item !== id);
    }

    setSelectedStates(updatedStates);

    // Sync with cognitionData
    setCognitionData((prevData) => ({
      ...prevData,
      consciousnessState: updatedStates,
    }));
  };


  const handleRadioChange = (e) => {
    setCanConcentrate(e.target.value);
  };

  const handleAdmissionChange = (e) => {
    setAdmissionNumber(e.target.value);
  };

  const apiRoute = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
  });

  const handleCheckboxChange = (section, value) => {
    setFormData((prevData) => {
      const isChecked = prevData[section].includes(value);
      return {
        ...prevData,
        [section]: isChecked
          ? prevData[section].filter((v) => v !== value)
          : [...prevData[section], value],
      };
    });
  };

  const handleInputChange = (e) => {
    setMoodFormData({ ...moodFormData, [e.target.name]: e.target.value });
  };

  const handleInputChange1 = (e) => {
    setJudgementFormData({ ...judgementData, [e.target.name]: e.target.value });
  };

  const handleInputChange2 = (e) => {
    setInsightData({ ...insightData, [e.target.name]: e.target.value });
  };

  const handleInputChange3 = (e) => {
    setPerceptionData({ ...perceptionData, [e.target.name]: e.target.value });
  }

  const handleInputChange4 = (e) => {
    setCognitionData({ ...cognitionData, [e.target.name]: e.target.value });
  }


  const consciousnessStates = [
    { id: "Conscious", img: "../assets/img/attention/attention 1.png" },
    { id: "Confusion", img: "../assets/img/attention/attention 2.png" },
    { id: "Clouding", img: "../assets/img/attention/attention 3.png" },
    { id: "Delirium", img: "../assets/img/attention/attention 4.png" },
    { id: "Stupor", img: "../assets/img/attention/attention 5.png" },
    { id: "Coma", img: "../assets/img/attention/attention 6.png" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!admission_no || admission_no.trim() === '') {
      alert("Admission Number is required.");
      return; // Stop form submission
    }
    const trimmedAdNo = admission_no.trim();

    if (!/^\d{8,13}$/.test(trimmedAdNo)) {
      alert("Admission Number must be between 8 to 13 digits (numbers only).");
      return;
    }
    if (!date || date.trim() === '') {
      alert("Date is required.");
      return; // Stop form submission
    }
    if (!formData.general_appearance || formData.general_appearance.length === 0) {
      alert("General appearance is required.");
      return;
    }
    if (!formData.attitude || formData.attitude.length === 0) {
      alert("Attitude towards the examiner is required.");
      return;
    }
    if (!formData.comprehension || formData.comprehension.length === 0) {
      alert("Comprehension is required.");
      return;
    }
    if (!formData.gait_posture || formData.gait_posture.length === 0) {
      alert("Gait and posture is required.");
      return;
    }
    if (!formData.motor_activity || formData.motor_activity.length === 0) {
      alert("Motor activity is required.");
      return;
    }
    if (!formData.catatonic_sign || formData.catatonic_sign.length === 0) {
      alert("Catatonic signs is required.");
      return;
    }
    if (!formData.conversion_dissociative || formData.conversion_dissociative.length === 0) {
      alert("Conversion and dissociative is required.");
      return;
    }
    if (!formData.social_manner || formData.social_manner.length === 0) {
      alert("Social manner is required.");
      return;
    }
    if (!formData.rapport || formData.rapport.length === 0) {
      alert("Rapport is required.");
      return;
    }
    if (!formData.hallucinatory_behaviour || formData.hallucinatory_behaviour.length === 0) {
      alert("Hallucinatory behaviour is required.");
      return;
    }

    const completeFormData = {
      ...formData,
      date: date,
      admission_no: admission_no
    };

    try {
      const response = await apiRoute.post('/recovery/create_MSE', completeFormData);
      console.log("Form submitted successfully:", response.data);
      alert("Form submitted successfully!");
      setFormData({
        general_appearance: [],
        attitude: [],
        comprehension: [],
        gait_posture: [],
        motor_activity: [],
        catatonic_sign: [],
        conversion_dissociative: [],
        social_manner: [],
        rapport: [],
        hallucinatory_behaviour: []
      })
    } catch (error) {
      console.error(error);
      if (error.response && error.response.status === 409) {
        alert(error.response.data.error); // Shows: "A record already exists for this admission number."
      } else {
        alert("Error submitting form.");
      }
    }

  };

  const handleSpeechSubmit = async (e) => {
    e.preventDefault();

    if (!admission_no || admission_no.trim() === '') {
      alert("Admission Number is required.");
      return;
    }

    const trimmedAdNo = admission_no.trim();

    if (!/^\d{8,13}$/.test(trimmedAdNo)) {
      alert("Admission Number must be between 8 to 13 digits (numbers only).");
      return;
    }

    if (!date || date.trim() === '') {
      alert("Date is required.");
      return; // Stop form submission
    }

    if (!speechFormData.rate_quantity || speechFormData.rate_quantity.length === 0) {
      alert("Rate and Quantity of speech is required.");
      return;
    }

    if (!speechFormData.volume_tone || speechFormData.volume_tone.length === 0) {
      alert("Volume and tone of speech is required.");
      return;
    }

    if (!speechFormData.flow_rhythm || speechFormData.flow_rhythm.length === 0) {
      alert("Flow and rhythm of speech is required.");
      return;
    }

    // Merge admission_no into speechFormData
    const payload = {
      ...speechFormData,
      date: date,
      admission_no: admission_no
    };

    try {
      const response = await apiRoute.post('/recovery/create_speech', payload);
      console.log("Speech data submitted:", response.data);
      alert("Speech form submitted successfully!");
      setSpeechFormData({
        rate_quantity: [],
        volume_tone: [],
        flow_rhythm: [],
      })
    } catch (error) {
      console.error("Error submitting speech form:", error);
      alert("Error submitting speech form.");
    }
  };

  const handleMoodAffectSubmit = async (e) => {
    e.preventDefault();
    if (!admission_no || admission_no.trim() === '') {
      alert("Admission Number is required.");
      return;
    }
    const trimmedAdNo = admission_no.trim();

    if (!/^\d{8,13}$/.test(trimmedAdNo)) {
      alert("Admission Number must be between 8 to 13 digits (numbers only).");
      return;
    }
    if (!date || date.trim() === '') {
      alert("Date is required.");
      return; // Stop form submission
    }
    if (!moodFormData.mood_description || moodFormData.mood_description.length === 0) {
      alert("Mood description is required.");
      return;
    }
    if (!moodFormData.appearance || moodFormData.appearance.trim() === '') {
      alert("Appearance is required.");
      return;
    }
    if (!moodFormData.resident_feeling || moodFormData.resident_feeling.trim() === '') {
      alert("Resident feeling is required.");
      return;
    }
    if (!moodFormData.general_feeling || moodFormData.general_feeling.trim() === '') {
      alert("General feeling is required.");
      return;
    }
    if (!moodFormData.mood_like || moodFormData.mood_like.trim() === '') {
      alert("Mood like is required.");
      return;
    }
    if (!moodFormData.resident_general_feeling || moodFormData.resident_general_feeling.trim() === '') {
      alert("Resident general feeling is required.");
      return;
    }
    if (!moodFormData.resident_look || moodFormData.resident_look.length === 0) {
      alert("Resident's looks is required.");
      return;
    }

    const payload = {
      ...moodFormData,
      admission_no: admission_no,
      date: date,
    };

    try {
      const response = await apiRoute.post('/recovery/create_mood', payload);
      console.log("Mood data submitted:", response.data);
      alert("Mood form submitted successfully!");
      setMoodFormData({
        mood_description: [],
        appearance: "",
        resident_feeling: "",
        general_feeling: "",
        mood_like: "",
        resident_general_feeling: "",
        resident_look: [],
      })

    } catch (error) {
      console.error("Error submitting mood form:", error);
      alert("Error submitting mood form.");
    }

  };

  const handlethoughSubmit = async (e) => {
    e.preventDefault();
    if (!admission_no || admission_no.trim() === '') {
      alert("Admission Number is required.");
      return;
    }
    const trimmedAdNo = admission_no.trim();

    if (!/^\d{8,13}$/.test(trimmedAdNo)) {
      alert("Admission Number must be between 8 to 13 digits (numbers only).");
      return;
    }
    if (!date || date.trim() === '') {
      alert("Date is required.");
      return; // Stop form submission
    }
    if (!thoughFormData.stream_form_though || thoughFormData.stream_form_though.length === 0) {
      alert("Stream and form of though is required.");
      return;
    }
    if (!thoughFormData.content_though || thoughFormData.content_though.length === 0) {
      alert("Content of though is required.");
      return;
    }


    const payload = {
      ...thoughFormData,
      date: date,
      admission_no: admission_no
    };

    try {
      const response = await apiRoute.post('/recovery/create_though', payload);
      console.log("Though Data submitted:", response.data);
      alert("Though form submitted successfully!");
      setThoughFormData({
        stream_form_though: [],
        content_though: [],
      })
    } catch (error) {
      console.error("Error submitting Though form:", error);
      alert("Error submitting Though form.");
    }

  };

  const handleJudgementSubmit = async (e) => {
    e.preventDefault();
    if (!admission_no || admission_no.trim() === '') {
      alert("Admission Number is required.");
      return;
    }
    const trimmedAdNo = admission_no.trim();

    if (!/^\d{8,13}$/.test(trimmedAdNo)) {
      alert("Admission Number must be between 8 to 13 digits (numbers only).");
      return;
    }
    if (!date || date.trim() === '') {
      alert("Date is required.");
      return; // Stop form submission
    }
    if (!judgementData.personal_judgement || judgementData.personal_judgement.length === 0) {
      alert("Personal Judgement is required.");
      return;
    }
    if (!judgementData.social_judgement || judgementData.social_judgement.length === 0) {
      alert("Social Judgement is required.");
      return;
    }
    if (!judgementData.test_judgement || judgementData.test_judgement.length === 0) {
      alert("Test Judgement is required.");
      return;
    }
    if (!judgementData.judgement || judgementData.judgement.length === 0) {
      alert(" Judgement is required.");
      return;
    }


    const payload = {
      ...judgementData,
      date: date,
      admission_no: admission_no
    };

    try {
      const response = await apiRoute.post('/recovery/create_judgement', payload);
      console.log("Judgement Data submitted:", response.data);
      alert("Judgement form submitted successfully!");
      setJudgementFormData({
        personal_judgement: '',
        social_judgement: '',
        test_judgement: '',
        judgement: '',
      })
    } catch (error) {
      console.error("Error submitting Judgement form:", error);
      alert("Error submitting Judgement form.");
    }
  };

  const handleInsightSubmit = async (e) => {
    e.preventDefault();
    if (!admission_no || admission_no.trim() === '') {
      alert("Admission Number is required.");
      return;
    }
    const trimmedAdNo = admission_no.trim();

    if (!/^\d{8,13}$/.test(trimmedAdNo)) {
      alert("Admission Number must be between 8 to 13 digits (numbers only).");
      return;
    }
    if (!date || date.trim() === '') {
      alert("Date is required.");
      return; // Stop form submission
    }
    if (!insightData.denail_illness || insightData.denail_illness.length === 0) {
      alert("Denail Illness is required.");
      return;
    }
    if (!insightData.slight_awareness || insightData.slight_awareness.length === 0) {
      alert("Slight Awarness is required.");
      return;
    }
    if (!insightData.awarness_sick || insightData.awarness_sick.length === 0) {
      alert("Awarness Sick is required.");
      return;
    }
    if (!insightData.awarness_illness || insightData.awarness_illness.length === 0) {
      alert(" Awarness Illness is required.");
      return;
    }
    if (!insightData.intellectual_insight || insightData.intellectual_insight.length === 0) {
      alert(" Intellectual Insight is required.");
      return;
    }
    if (!insightData.true_emotion || insightData.true_emotion.length === 0) {
      alert(" True Emotional is required.");
      return;
    }


    const payload = {
      ...insightData,
      date: date,
      admission_no: admission_no
    };

    try {
      const response = await apiRoute.post('/recovery/create_insight', payload);
      console.log("Insight Data submitted:", response.data);
      alert("Insight form submitted successfully!");
      setInsightData({
        denail_illness: '',
        slight_awareness: '',
        awarness_sick: '',
        awarness_illness: '',
        intellectual_insight: '',
        true_emotion: ''
      })
    } catch (error) {
      console.error("Error submitting Insight form:", error);

      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message); // Backend validation error
      } else {
        alert("Error submitting Insight form.");
      }
    }
  }

  const handlePerceptionSubmit = async (e) => {
    e.preventDefault();
    if (!admission_no || admission_no.trim() === '') {
      alert("Admission Number is required.");
      return;
    }
    const trimmedAdNo = admission_no.trim();

    if (!/^\d{8,13}$/.test(trimmedAdNo)) {
      alert("Admission Number must be between 8 to 13 digits (numbers only).");
      return;
    }
    if (!date || date.trim() === '') {
      alert("Date is required.");
      return; // Stop form submission
    }
    if (!perceptionData.hallucination_type || perceptionData.hallucination_type.length === 0) {
      alert("Hallucination is required.");
      return;
    }
    if (!perceptionData.heard || perceptionData.heard.length === 0) {
      alert("Heard is required.");
      return;
    }
    if (!perceptionData.voices_heard || perceptionData.voices_heard.length === 0) {
      alert("Voices Heard is required.");
      return;
    }
    if (!perceptionData.part_of_day || perceptionData.part_of_day.length === 0) {
      alert(" Part of the Day is required.");
      return;
    }
    if (!perceptionData.female_male_voices || perceptionData.female_male_voices.length === 0) {
      alert(" Female or Male Voices Field is required.");
      return;
    }
    if (!perceptionData.interpreted_person || perceptionData.interpreted_person.length === 0) {
      alert(" Interpreted Person is required.");
      return;
    }


    const payload = {
      ...perceptionData,
      date: date,
      admission_no: admission_no
    };

    try {
      const response = await apiRoute.post('/recovery/create_perception', payload);
      console.log("Perception Data submitted:", response.data);
      alert("Perception form submitted successfully!");
      setPerceptionData({
        hallucination_type: [],
        heard: '',
        voices_heard: '',
        part_of_day: '',
        female_male_voices: '',
        interpreted_person: '',
        illusion: [],
        perception_changes: [],
        somatic: [],
        others: []
      })
    } catch (error) {
      console.error("Error submitting Perception form:", error);
      alert("Error submitting Perception form.");
    }
  }

  const handleCognitionSubmit = async (e) => {
    e.preventDefault();
    if (!admission_no || admission_no.trim() === '') {
      alert("Admission Number is required.");
      return;
    }
    const trimmedAdNo = admission_no.trim();

    if (!/^\d{8,13}$/.test(trimmedAdNo)) {
      alert("Admission Number must be between 8 to 13 digits (numbers only).");
      return;
    }
    if (!date || date.trim() === '') {
      alert("Date is required.");
      return; // Stop form submission
    }
    if (!cognitionData.consciousness || cognitionData.consciousness.length === 0) {
      alert("Consciousness is required.");
      return;
    }
    if (!cognitionData.orientation_time || cognitionData.orientation_time.length === 0) {
      alert("Orientation Time is required.");
      return;
    }
    if (!cognitionData.orientation_place || cognitionData.orientation_place.length === 0) {
      alert("Orientation Place is required.");
      return;
    }
    if (!cognitionData.orientation_person || cognitionData.orientation_person.length === 0) {
      alert("Orientation Person is required.");
      return;
    }
    if (!cognitionData.orientation_person || cognitionData.orientation_person.length === 0) {
      alert("Orientation Person is required.");
      return;
    }

    if (!cognitionData.consciousnessState || cognitionData.consciousnessState.length === 0) {
      alert("Conciousness State Time is required.");
      return;
    }
    if (!cognitionData.asking_test || cognitionData.asking_test.length === 0) {
      alert("Asking test is required.");
      return;
    }
    if (!cognitionData.names_months || cognitionData.names_months.length === 0) {
      alert("Names of the Months is required.");
      return;
    }
    if (!cognitionData.test_performance || cognitionData.test_performance.length === 0) {
      alert("Test Perfomance is required.");
      return;
    }
    if (!cognitionData.immediate_retention || cognitionData.immediate_retention.length === 0) {
      alert("Immediate Retention is required.");
      return;
    }
    if (!cognitionData.recall || cognitionData.recall.length === 0) {
      alert("Recall (R) after a delay is required.");
      return;
    }
    if (!cognitionData.patient_place || cognitionData.patient_place.length === 0) {
      alert("Patient Coming place is required.");
      return;
    }
    if (selectedStates.length === 0) {
      alert("Please select at least one attention state.");
      return;
    }
    if (setCanConcentrate.length === 0) {
      alert("Please select at least one Patient Concentrate.");
      return;
    }

    const payload = {
      ...cognitionData,
      date: date,
      admission_no: admission_no,
      consciousnessState: selectedStates.join(', '),  // ✔️ Store array as comma-separated string
      canConcentrate: canConcentrate,                 // ✔️ Radio button value
    };

    try {
      const response = await apiRoute.post('/recovery/create_cognition', payload);
      console.log("Cognition Data submitted:", response.data);
      alert("Cognition form submitted successfully!");
      setCognitionData({
        consciousness: [],
        orientation_time: '',
        orientation_place: '',
        orientation_person: '',
        distractibility: '',
        asking_test: '',
        names_months: '',
        test_performance: '',
        immediate_retention: '',
        recall: '',
        patient_place: '',
        dinner_ate: '',
        date_ofMrg: '',
        birthdays_children: '',
        person_past: '',
        amnesia: '',
        live_growing: '',
        person_school: '',
        breakfast_ques: '',
        do_yesterday: '',
        general_info: '',
        test_red_wri: '',
        calculation_test: '',
        proverb_testing: '',
        familiar_object: ''
      })
      setSelectedStates([]);
      setCanConcentrate('');
    } catch (error) {
      console.error("Error submitting Cognition form:", error);
      alert("Error submitting Cognition form.");
    }
  }


  const renderCheckbox = (field, id, label) => (
    <Form.Check
      type="checkbox"
      id={id}
      label={label}
      checked={formData[field]?.includes(label)}
      onChange={(e) => {
        const updated = e.target.checked
          ? [...formData[field], label]
          : formData[field].filter(item => item !== label);

        setFormData(prev => ({
          ...prev,
          [field]: updated
        }));
      }}
    />
  );

  const renderspeechCheckbox = (field, id, label) => (
    <Form.Check
      type="checkbox"
      id={id}
      label={label}
      checked={speechFormData[field]?.includes(label)}
      onChange={(e) => {
        const updated = e.target.checked
          ? [...speechFormData[field], label]
          : speechFormData[field].filter(item => item !== label);

        setSpeechFormData(prev => ({
          ...prev,
          [field]: updated
        }));
      }}
    />
  );

  const rendermoodCheckbox = (field, id, label) => (
    <Form.Check
      type="checkbox"
      id={id}
      label={label}
      checked={moodFormData[field]?.includes(label)}
      onChange={(e) => {
        const updated = e.target.checked
          ? [...moodFormData[field], label]
          : moodFormData[field].filter(item => item !== label);

        setMoodFormData(prev => ({
          ...prev,
          [field]: updated
        }));
      }}
    />
  );

  const renderthoughCheckbox = (field, id, label) => (
    <Form.Check
      type="checkbox"
      id={id}
      label={label}
      checked={thoughFormData[field]?.includes(label)}
      onChange={(e) => {
        const updated = e.target.checked
          ? [...thoughFormData[field], label]
          : thoughFormData[field].filter(item => item !== label);

        setThoughFormData(prev => ({
          ...prev,
          [field]: updated
        }));
      }}
    />
  );

  const renderhallucinationCheck = (field, id, label) => (
    <Form.Check
      type="checkbox"
      id={id}
      label={label}
      checked={perceptionData[field]?.includes(label)}
      onChange={(e) => {
        const updated = e.target.checked
          ? [...perceptionData[field], label]
          : perceptionData[field].filter(item => item !== label);

        setPerceptionData(prev => ({
          ...prev,
          [field]: updated
        }));
      }}
    />
  );

  const renderillusion = (field, id, label) => (
    <Form.Check
      type="checkbox"
      id={id}
      label={label}
      checked={perceptionData[field]?.includes(label)}
      onChange={(e) => {
        const updated = e.target.checked
          ? [...perceptionData[field], label]
          : perceptionData[field].filter(item => item !== label);

        setPerceptionData(prev => ({
          ...prev,
          [field]: updated
        }));
      }}
    />
  );

  const renderPerceptionChanges = (field, id, label) => (
    <Form.Check
      type="checkbox"
      id={id}
      label={label}
      checked={perceptionData[field]?.includes(label)}
      onChange={(e) => {
        const updated = e.target.checked
          ? [...perceptionData[field], label]
          : perceptionData[field].filter(item => item !== label);

        setPerceptionData(prev => ({
          ...prev,
          [field]: updated
        }));
      }}
    />
  );

  const rendersomatic = (field, id, label) => (
    <Form.Check
      type="checkbox"
      id={id}
      label={label}
      checked={perceptionData[field]?.includes(label)}
      onChange={(e) => {
        const updated = e.target.checked
          ? [...perceptionData[field], label]
          : perceptionData[field].filter(item => item !== label);

        setPerceptionData(prev => ({
          ...prev,
          [field]: updated
        }));
      }}
    />
  );

  const renderothers = (field, id, label) => (
    <Form.Check
      type="checkbox"
      id={id}
      label={label}
      checked={perceptionData[field]?.includes(label)}
      onChange={(e) => {
        const updated = e.target.checked
          ? [...perceptionData[field], label]
          : perceptionData[field].filter(item => item !== label);

        setPerceptionData(prev => ({
          ...prev,
          [field]: updated
        }));
      }}
    />
  );


  const renderConginationCheck = (field, id, label) => (
    <Form.Check
      type="checkbox"
      id={id}
      label={label}
      checked={cognitionData[field]?.includes(label)}
      onChange={(e) => {
        const updated = e.target.checked
          ? [...cognitionData[field], label]
          : cognitionData[field].filter(item => item !== label);

        setCognitionData(prev => ({
          ...prev,
          [field]: updated
        }));
      }}
    />


  );

  const fetchFormData = async () => {
    if (!admission_no.trim()) {
      alert("Please enter admission number.");
      return;
    }

    const formatDate = (dateString) => {
      if (!dateString) return '';
      const dateObj = new Date(dateString);
      if (isNaN(dateObj)) return dateString;
      const day = String(dateObj.getDate()).padStart(2, '0');
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const year = dateObj.getFullYear();
      return `${day}-${month}-${year}`;
    };

    try {
      const response = await apiRoute.get(`/recovery/mseAllForm/${admission_no}`);
      console.log("Fetched data from API:", response.data);

      const fetchedData = response.data;

      if (!Array.isArray(fetchedData) || fetchedData.length === 0) {
        alert("No data found for this admission number.");
        return;
      }

      const formattedEntries = fetchedData.map(entry => ({
        appearance_behaviour: {
          ...entry.appearance_behaviour,
          date: formatDate(entry.appearance_behaviour?.date || ''),
          general_appearance: entry.appearance_behaviour?.general_appearance?.split(',') || ["NULL"],
          attitude: entry.appearance_behaviour?.attitude?.split(',') || ["NULL"],
          comprehension: entry.appearance_behaviour?.comprehension?.split(',') || ["NULL"],
          gait_posture: entry.appearance_behaviour?.gait_posture?.split(',') || ["NULL"],
          motor_activity: entry.appearance_behaviour?.motor_activity?.split(',') || ["NULL"],
          catatonic_sign: entry.appearance_behaviour?.catatonic_sign?.split(',') || ["NULL"],
          conversion_dissociative: entry.appearance_behaviour?.conversion_dissociative?.split(',') || ["NULL"],
          social_manner: entry.appearance_behaviour?.social_manner?.split(',') || ["NULL"],
          rapport: entry.appearance_behaviour?.rapport?.split(',') || ["NULL"],
          hallucinatory_behaviour: entry.appearance_behaviour?.hallucinatory_behaviour?.split(',') || ["NULL"],
        },
        speech: {
          ...entry.speech,
          date: formatDate(entry.speech?.date || ''),
          rate_quantity: entry.speech?.rate_quantity?.split(',') || ["NULL"],
          volume_tone: entry.speech?.volume_tone?.split(',') || ["NULL"],
          flow_rhythm: entry.speech?.flow_rhythm?.split(',') || ["NULL"],
        },
        mood_affect: {
          ...entry.mood_affect,
          date: formatDate(entry.mood_affect?.date || ''),
          mood_description: entry.mood_affect?.mood_description?.split(',') || ["NULL"],
          resident_look: entry.speech?.resident_look?.split(',') || ["NULL"],
        },
        though: {
          ...entry.though,
          date: formatDate(entry.though?.date || ''),
          stream_form_though: entry.though?.stream_form_though?.split(',') || ["NULL"],
          content_though: entry.speech?.content_though?.split(',') || ["NULL"],
        },
        perceiption: {
          ...entry.perceiption,
          date: formatDate(entry.perceiption?.date || ''),
          hallucination_type: entry.perceiption?.hallucination_type?.split(',') || ["NULL"],
          illusion: entry.perceiption?.illusion?.split(',') || ["NULL"],
          perception_changes: entry.perceiption?.perception_changes?.split(',') || ["NULL"],
          somatic: entry.perceiption?.somatic?.split(',') || ["NULL"],
          others: entry.perceiption?.others?.split(',') || ["NULL"],
        },
        conginition: {
          ...entry.conginition,
          date: formatDate(entry.conginition?.date || ''),
          consciousness: entry.conginition?.consciousness?.split(',') || ["NULL"],
        },
        judgement: {
          ...entry.judgement,
          date: formatDate(entry.judgement?.date || ''),
        },
        insight: {
          ...entry.insight,
          date: formatDate(entry.insight?.date || ''),
        }

      }))

      // ✅ Now trigger PDF generation
      setAllFormEntries(formattedEntries);
      setShouldGeneratePDF(true);

    } catch (error) {
      console.error("Error fetching or downloading:", error);
      alert("This form does not have a valid admission number");
    }
  };


  useEffect(() => {
    if (shouldGeneratePDF) {
      generatePDF();
      setShouldGeneratePDF(false); // Reset the flag
    }
  }, [shouldGeneratePDF]);

  const formRef = useRef();

  const generatePDF = async () => {
    const input = formRef.current;
    if (!input) {
      console.error("Form reference is not defined");
      return;
    }

    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF('p', 'mm', 'a4');

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgProps = pdf.getImageProperties(imgData);
    const imgWidth = pdfWidth;
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

    let heightLeft = imgHeight;
    let position = 0;

    // First page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    // Add more pages if content overflows
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    const pdfBlob = pdf.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');
  };

  const navigate = useNavigate();

  const handleAppearanceNavigate = () => {
    navigate("/general_appearance");
  }
  const handleSpeechNavigate = () => {
    navigate("/speech");
  }
  const handleMoodAffectNavigate = () => {
    navigate("/mood_affect");
  }
  const handleThoughNavigate = () => {
    navigate("/though");
  }
  const handlePerceptionNavigate = () => {
    navigate("/perception");
  }
  const handleCognitionNavigate = () => {
    navigate("/cognition");
  }
  const handleJudgementNavigate = () => {
    navigate("/judgement");
  }
  const handleInsightNavigate = () => {
    navigate("/insight");
  }

  const fetchRescueDetails = async (admission_no) => {
    try {
      const response = await apiRoute.get(`/admision/get_scrbform2data/${admission_no}`);
      const result = response.data.data[0];
      console.log("API Result:", result);

      if (result && result.rescue_image) {
        let imagePath = null;

        // Check if rescue_image is an array-like string
        if (result.rescue_image.startsWith("[") && result.rescue_image.endsWith("]")) {
          try {
            // Parse the string to get the array
            const imageArray = JSON.parse(result.rescue_image.replace(/&quot;/g, '"'));

            if (Array.isArray(imageArray) && imageArray.length > 0) {
              imagePath = `https://www.pahrultours.com/app2/${imageArray[0]}`;
            }
          } catch (parseError) {
            console.error("Error parsing image array:", parseError);
            imagePath = null;
          }
        } else {
          // It's a single image path
          imagePath = result.rescue_image.startsWith("http")
            ? result.rescue_image
            : `https://www.pahrultours.com/app2/${result.rescue_image}`;
        }

        if (imagePath) {
          setRescueImage(imagePath);
          setRescueName(result.rescue_name || "");
          setError("");
        } else {
          setRescueImage(null);
          setRescueName("");
          setError("Image not found for this admission number");
        }
      } else {
        setRescueImage(null);
        setRescueName("");
        setError("Image not found for this admission number");
      }
    } catch (error) {
      console.error("Error fetching data", error);
      setRescueImage(null);
      setRescueName("");
      setError("Admission Number Not found");
    }
  };
  useEffect(() => {
    if (admission_no.trim() !== "") {
      fetchRescueDetails(admission_no);
    } else {
      setRescueImage(null);
      setRescueName("");
      setError("");
    }
  }, [admission_no]);

  return (
    <>
      <div className="d-flex align-items-center flex-wrap flex-md-nowrap text-start py-2">
        <div className="d-block mb-4 mb-xl-0 px-4 ">
          <Breadcrumb className="d-none d-md-inline-block mb-0" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
            <Breadcrumb.Item></Breadcrumb.Item>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item active>Recovery</Breadcrumb.Item>
          </Breadcrumb>
          <h6 className="breadcrumb_title">MSE Form</h6>

        </div>

        <Col md={9} className="text-center">
          <h4 className="section_title_1">Mental Status Examination (MSE)</h4>
        </Col>

        <Col md={1} className='d-flex flex-column align-items-center'>
          {error && <div className="text-danger mt-2">{error}</div>}
          {/* Rescue Name and Image */}
          {rescueImage && (
            <div>
              <img
                alt={rescueName || "Rescue Image"}
                style={{ width: "150px", height: "auto" }}
                src={rescueImage}
              />
              {rescueName && <h6 className="mb-2">{rescueName}</h6>}
            </div>
          )}
        </Col>
      </div>

      <Container>
        <Row>

          <Col md={12}>
            <Row>
              <Col md="9" className='mse_admissionForm'>
                <div className="d-flex align-items-center px-3 mse_search">

                  <Form className="navbar-search col-md-8 mse_admission">
                    <Form.Group id="topbarSearch" className="d-flex align-items-center">
                      <Col md={5}>
                        <Form.Label>Admission Number:</Form.Label>
                      </Col>
                      <Col md={4}>
                        <InputGroup className="input-group-merge search-bar">
                          <Form.Control
                            type="text"
                            value={admission_no || ""}
                            onChange={handleAdmissionChange}
                          />

                        </InputGroup>
                      </Col>

                      <button type="button" className="btn btn-secondary mx-2" onClick={fetchFormData}><FontAwesomeIcon icon={faEye} className="me-0" /></button>
                      <button type="button" className="btn btn-success mx-2" onClick={() => {
                        if (!admission_no.trim()) {
                          alert("Please enter admission number.");
                        } else {
                          // createFormData(); // Fetch & populate data before generating PDF
                        }
                      }}><FontAwesomeIcon icon={faPlus} className="me-0" /></button>
                      {/* <button type="button" className="btn btn-success mx-2" onClick={handleDownload}>
                        Import Excel Sheet
                      </button> */}
                    </Form.Group>
                  </Form>

                  <Form className="navbar-search col-md-6 mse_date">
                    <Form.Group id="topbarSearch" className="d-flex align-items-center">
                      <Col md={3}>
                        <Form.Label>Date:</Form.Label>
                      </Col>
                      <Col md={5}>
                        <InputGroup className="input-group-merge search-bar">
                          <Form.Control
                            type="date"
                            value={date}
                            max="9999-12-31"
                            onChange={(e) => setDate(e.target.value)}
                          />
                        </InputGroup>
                      </Col>
                    </Form.Group>
                  </Form>

                </div>
              </Col>

            </Row>
          </Col>
        </Row>
      </Container>

      <Container className='mse_container'>
        <Row>
          <Col>
            <div className="page">

              {/* tabs */}
              <div className="pcss3t pcss3t-effect-scale pcss3t-theme-1 MSE_form_tab">
                <input type="radio" name="pcss3t" defaultChecked id="tab1" className="tab-content-first" />
                <label htmlFor="tab1"><i className="icon-bolt"></i>General appearance and behaviour</label>

                <input type="radio" name="pcss3t" id="tab2" className="tab-content-2" />
                <label htmlFor="tab2"><i className="icon-picture"></i>Speech</label>

                <input type="radio" name="pcss3t" id="tab3" className="tab-content-3" />
                <label htmlFor="tab3"><i className="icon-cogs"></i>Mood and affect</label>

                <input type="radio" name="pcss3t" id="tab4" className="tab-content-4" />
                <label htmlFor="tab4"><i className="icon-cogs"></i>Thought</label>

                <input type="radio" name="pcss3t" id="tab5" className="tab-content-5" />
                <label htmlFor="tab5"><i className="icon-cogs"></i>Perception</label>

                <input type="radio" name="pcss3t" id="tab6" className="tab-content-6" />
                <label htmlFor="tab6"><i className="icon-cogs"></i>Cognition (higher mental functions)</label>

                <input type="radio" name="pcss3t" id="tab7" className="tab-content-7" />
                <label htmlFor="tab7"><i className="icon-cogs"></i>Judgement</label>

                <input type="radio" name="pcss3t" id="tab8" className="tab-content-last" />
                <label htmlFor="tab8"><i className="icon-globe"></i>Insight</label>

                <ul>
                  {/* GENERAL APPEARANCE AND BEHAVIOUR START*/}
                  <li className="tab-content tab-content-first typography">
                    <div className="update_class d-flex align-items-center">
                      <h1>1. GENERAL APPEARANCE AND BEHAVIOUR:</h1>

                      <Button className='btn btn-success mx-3' type='button' onClick={handleAppearanceNavigate}>View All</Button>
                    </div>

                    <ul>
                      <Form onSubmit={handleSubmit}>
                        {/* General Appearance */}
                        <Form.Group controlId="general_appearance" className="icon-li" required>
                          <h4>General Appearance: <span style={{ color: 'red' }}>*</span></h4>
                          <div className="d-flex flex-wrap gap-3 mt-2">
                            {[
                              ["Approximate height", "Approximate height"],
                              ["Approximate weight", "Approximate weight"],
                              ["Looks comfortable", "Looks comfortable"],
                              ["Looks uncomfortable", "Looks uncomfortable"],
                              ["Physical health", "Physical health"],
                              ["Grooming", "Grooming"],
                              ["Hygiene", "Hygiene"],
                              ["Self-Care", "Self-Care"],
                              ["Proper Dressing", "Proper Dressing"],
                              ["Dressing Neatly", "Dressing Neatly"],
                              ["Facial Expression", "Facial Expression"],
                              ["Nothing", "Nothing"]
                            ].map(([id, label]) => renderCheckbox("general_appearance", id, label))}
                          </div>
                        </Form.Group>

                        {/* Attitude */}
                        <Form.Group controlId="attitude" className="icon-li" required>
                          <h4>Attitude towards the examiner: <span style={{ color: 'red' }}>*</span></h4>
                          <div className="d-flex flex-wrap gap-3 mt-2">
                            {[
                              ["cooperation", "Cooperation"],
                              ["guardedness", "Guardedness"],
                              ["evasiveness", "Evasiveness"],
                              ["hostility", "Hostility"],
                              ["attentiveness", "Attentiveness"],
                              ["Shows Interest", "Shows Interest"],
                              ["Lacks Interest", "Lacks Interest"],
                              ["Nothing", "Nothing"]
                            ].map(([id, label]) => renderCheckbox("attitude", id, label))}
                          </div>
                        </Form.Group>

                        {/* Comprehension */}
                        <Form.Group controlId="comprehension" className="icon-li" required>
                          <h4>Comprehension: <span style={{ color: 'red' }}>*</span></h4>
                          <div className="d-flex flex-wrap gap-3 mt-2">
                            {[
                              ["intact", "Intact"],
                              ["partially-impaired", "Partially Impaired"],
                              ["fully-impaired", "Fully Impaired"],
                              ["Nothing", "Nothing"]
                            ].map(([id, label]) => renderCheckbox("comprehension", id, label))}
                          </div>
                        </Form.Group>

                        {/* Gait and Posture */}
                        <Form.Group controlId="gait_posture" className="icon-li" required>
                          <h4>Gait and posture: <span style={{ color: 'red' }}>*</span></h4>
                          <div className="d-flex flex-wrap gap-3 mt-2">
                            {[
                              ["sitting-normal", "Normal Sitting"],
                              ["sitting-abnormal", "Abnormal Sitting"],
                              ["standing-normal", "Normal Standing"],
                              ["standing-abnormal", "Abnormal Standing"],
                              ["walking-normal", "Normal Walking Pattern"],
                              ["walking-abnormal", "Abnormal Walking Pattern"],
                              ["lying-normal", "Normal Lying Position"],
                              ["lying-abnormal", "Abnormal Lying Position"],
                              ["Nothing", "Nothing"]
                            ].map(([id, label]) => renderCheckbox("gait_posture", id, label))}
                          </div>
                        </Form.Group>

                        {/* Motor Activity */}
                        <Form.Group controlId="motor_activity" className="icon-li" required>
                          <h4>Motor activity: <span style={{ color: 'red' }}>*</span></h4>
                          <div className="d-flex flex-wrap gap-3 mt-2">
                            {[
                              ["increased", "Increased"],
                              ["decreased", "Decreased"],
                              ["excitement", "Excitement"],
                              ["stupor", "Stupor"],
                              ["AIMS", "Abnormal involuntary movements (AIMS) tics"],
                              ["tremors", "Tremors"],
                              ["restlessness", "Restlessness"],
                              ["akathisia", "Skathisia"],
                              ["social withdrawal", "Social Withdrawal"],
                              ["autism", "Autism"],
                              ["Nothing", "Nothing"]
                            ].map(([id, label]) => renderCheckbox("motor_activity", id, label))}
                          </div>
                        </Form.Group>

                        {/* Catatonic Signs */}
                        <Form.Group controlId="catatonic_sign" className="icon-li" required>
                          <h4>Catatonic signs: <span style={{ color: 'red' }}>*</span></h4>
                          <div className="d-flex flex-wrap gap-3 mt-2">
                            {[
                              ["mannerisms", "Mannerisms"],
                              ["stereotypes", "Stereotypes"],
                              ["posturing", "Posturing"],
                              ["waxy flexibility", "Waxy Flexibility"],
                              ["negativism", "Negativism"],
                              ["ambitendency", "Ambitendency"],
                              ["automatic obedience", "Automatic Obedience"],
                              ["Echo- Praxia", "Echo- Praxia"],
                              ["psychological-pillow", "Psychological-Pillow"],
                              ["Nothing", "Nothing"]
                            ].map(([id, label]) => renderCheckbox("catatonic_sign", id, label))}
                          </div>
                        </Form.Group>

                        {/* Conversion and Dissociative Signs */}
                        <Form.Group controlId="conversion_dissociative" className="icon-li" required>
                          <h4>Conversion and dissociative signs: <span style={{ color: 'red' }}>*</span></h4>
                          <div className="d-flex flex-wrap gap-3 mt-2">
                            {[
                              ["pseudo seizures", "Pseudo Seizures"],
                              ["possession states", "possession States"],
                              ["Nothing", "Nothing"]
                            ].map(([id, label]) => renderCheckbox("conversion_dissociative", id, label))}
                          </div>
                        </Form.Group>

                        {/* Social Manner */}
                        <Form.Group controlId="social_manner" className="icon-li" required>
                          <h4>Social manner: <span style={{ color: 'red' }}>*</span></h4>
                          <div className="d-flex flex-wrap gap-3 mt-2">
                            {[
                              ["social-increased", "Increased"],
                              ["social-decreased", "Decreased"],
                              ["inappropriate", "Inappropriate"],
                              ["Nothing", "Nothing"]
                            ].map(([id, label]) => renderCheckbox("social_manner", id, label))}
                          </div>
                        </Form.Group>

                        {/* Rapport */}
                        <Form.Group controlId="rapport" className="icon-li" required>
                          <h4>Rapport: <span style={{ color: 'red' }}>*</span></h4>
                          <div className="d-flex flex-wrap gap-3 mt-2">
                            {[
                              [
                                "relationship_patient",
                                "Whether a working empathic relationship can be established with the patient, should mentioned.",
                              ],
                            ].map(([id, label]) => renderCheckbox("rapport", id, label))}
                          </div>
                        </Form.Group>

                        {/* Hallucinatory Behaviour */}
                        <Form.Group controlId="hallucinatory_behaviour" className="icon-li" required>
                          <h4>Hallucinatory behaviour: <span style={{ color: 'red' }}>*</span></h4>
                          <div className="d-flex flex-wrap gap-3 mt-2">
                            {[
                              ["Smiling without reason", "Smiling without reason"],
                              ["Crying without reason", "Crying without reason"],
                              ["Muttering to self", "Muttering to self"],
                              ["Talking to self audibly", "Talking to self audibly"],
                              ["Engages in non-social speech", "Engages in non-social speech"],
                              ["Odd gesturing in response to auditory", "Odd gesturing in response to auditory"],
                              ["visual hallucinations", "Visual Hallucinations"],
                              ["Nothing", "Nothing"]
                            ].map(([id, label]) => renderCheckbox("hallucinatory_behaviour", id, label))}
                          </div>
                        </Form.Group>

                        <Col md={12} className="text-center mt-3">
                          <Button type='submit' className='btn btn-success'>Save</Button>
                        </Col>
                      </Form>
                    </ul>
                  </li>
                  {/* GENERAL APPEARANCE AND BEHAVIOUR END*/}

                  {/* SPEECH START*/}
                  <li className="tab-content tab-content-2 typography">
                    <div className="update_class d-flex align-items-center">
                      <h1>2. SPEECH</h1>

                      <Button className='btn btn-success mx-3' type='button' onClick={handleSpeechNavigate}>View All</Button>
                    </div>

                    <ul>
                      <Form onSubmit={handleSpeechSubmit}>
                        <li className="icon-li">
                          <h4 style={{ display: "inline" }}>Rate and quantity of speech: <span style={{ color: 'red' }}>*</span></h4>
                          <div className="d-flex flex-wrap gap-3 mt-2">
                            {[
                              ["present", "Speech is present"],
                              ["absent", "Speech is Absent"],
                              ["spontaneous", "If present whether it is spontaneous"],
                              ["productivity_increase", "Productivity is increased"],
                              ["productivity_decreased", "Productivity is Decreased"],
                              ["rapid", "Rate is rapid"],
                              ["slow", "Rate is slow"],
                              ["pressure_of_speech", "Pressure of speech"],
                              ["poverty_of_speech", "Poverty of Speech"],
                              ["Nothing", "Nothing"]
                            ].map(([id, label]) => renderspeechCheckbox("rate_quantity", id, label))}
                          </div>
                        </li>

                        <li className="icon-li">
                          <h4 style={{ display: "inline" }}>Volume and tone of speech: <span style={{ color: 'red' }}>*</span></h4>
                          <div className="d-flex flex-wrap gap-3 mt-2">
                            {[
                              ["volume_increase", "Increased"],
                              ["volume_decrease", "Decreased"],
                            ].map(([id, label]) => renderspeechCheckbox("volume_tone", id, label))}
                          </div>
                        </li>

                        <li className="icon-li">
                          <h4 style={{ display: "inline" }}>Flow and rhythm of speech: <span style={{ color: 'red' }}>*</span></h4>
                          <div className="d-flex flex-wrap gap-3 mt-2">
                            {[
                              ["smooth", "Smooth"],
                              ["hesitant", "Hesitant"],
                              ["dysprosody", "Dysprosody"],
                              ["blocking", "Blocking (sudden)"],
                              ["circumstantiality", "Circumstantiality"],
                              ["tangentiality", "Tangentiality"],
                              ["loosening", "Loosening of associations"],
                              ["verbigeration", "Verbigeration"],
                              ["perseveration", "Perseveration"],
                              ["stereotypies", "Stereotypies (verbal)"],
                              ["flight", "Flight of ideas"],
                              ["clang", "Clang associations"],
                              ["Nothing", "Nothing"]
                            ].map(([id, label]) => renderspeechCheckbox("flow_rhythm", id, label))}
                          </div>
                        </li>

                        <Col md={12} className="text-center mt-3">
                          <Button type='submit' className='btn btn-success'>Save</Button>
                        </Col>
                      </Form>

                    </ul>
                  </li>
                  {/* SPEECH END*/}

                  {/* MOOD AND AFFECT START*/}
                  <li className="tab-content tab-content-3 typography">
                    <div className="update_class d-flex align-items-center">
                      <h1>3. MOOD AND AFFECT</h1>
                      {/* {userType === "4" && (
                        <button type="button" className="btn btn-success mx-3">
                          <FontAwesomeIcon icon={faEdit} className="me-0" /></button>
                      )} */}
                      <Button className='btn btn-success mx-3' type='button' onClick={handleMoodAffectNavigate}>View All</Button>
                    </div>

                    <ul>
                      <Form onSubmit={handleMoodAffectSubmit}>
                        <li className="icon-li">
                          <h4 style={{ display: "inline" }}>Mood Described as: <span style={{ color: 'red' }}>*</span></h4>
                          <div className="d-flex flex-wrap gap-3 mt-2">
                            {[
                              ["Relaxed", "Relaxed"],
                              ["Happy", "Happy"],
                              ["Anxious", "Anxious"],
                              ["Angry", "Angry"],
                              ["Depressed", "Depressed"],
                              ["Hopeless", "Hopeless"],
                              ["Hopeful", "Hopeful"],
                              ["Apathetic", "Apathetic"],
                              ["Euphoric", "Euphoric"],
                              ["Euthymic", "Euthymic"],
                              ["Elated", "Elated"],
                              ["Irritable", "Irritable"],
                              ["Fearful", "Fearful"],
                              ["Silly", "Silly"],
                              ["Nothing", "Nothing"]
                            ].map(([id, label]) => rendermoodCheckbox("mood_description", id, label))}
                          </div>
                        </li>
                        <li className="icon-li">
                          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>How do they appear to you? <span style={{ color: 'red' }}>*</span></Form.Label>
                            <Form.Control as="textarea" rows={2}
                              name='appearance'
                              value={moodFormData.appearance}
                              onChange={handleInputChange} />
                          </Form.Group>
                        </li>

                        <li className="icon-li">
                          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Ask the Resident directly how he/she feels <span style={{ color: 'red' }}>*</span></Form.Label>
                            <Form.Control as="textarea" rows={2}
                              name='resident_feeling'
                              value={moodFormData.resident_feeling}
                              onChange={handleInputChange} />
                          </Form.Group>
                        </li>

                        <h4 style={{ display: "inline" }}>Question to ask about Mood: <span style={{ color: 'red' }}>*</span></h4>
                        <li className="icon-li">
                          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>How do you generally feel most of the time?</Form.Label>
                            <Form.Control as="textarea" rows={2}
                              name='general_feeling'
                              value={moodFormData.general_feeling}
                              onChange={handleInputChange} />
                          </Form.Group>
                        </li>

                        <li className="icon-li">
                          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>What's your mood like? <span style={{ color: 'red' }}>*</span></Form.Label>
                            <Form.Control as="textarea" rows={2}
                              name='mood_like'
                              value={moodFormData.mood_like}
                              onChange={handleInputChange} />
                          </Form.Group>
                        </li>

                        <li className="icon-li">
                          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>How would you say you feel generally - happy, sad, frightened, angry ? <span style={{ color: 'red' }}>*</span></Form.Label>
                            <Form.Control as="textarea" rows={2}
                              name='resident_general_feeling'
                              value={moodFormData.resident_general_feeling}
                              onChange={handleInputChange} />
                          </Form.Group>
                        </li>

                        <li className="icon-li">
                          <h4 style={{ display: "inline" }}>Resident's Looks like: <span style={{ color: 'red' }}>*</span></h4>
                          <div className="d-flex flex-wrap gap-3 mt-2">
                            {[
                              ["depressed mood", "Depressed Mood"],
                              ["irritable mood", "Irritable Mood"],
                              ["blut affect", "Blunt Affect"],
                              ["flat affect", "Flat Affect"],
                              ["Nothing", "Nothing"]
                            ].map(([id, label]) =>
                              rendermoodCheckbox("resident_look", id, label)
                            )}
                          </div>

                        </li>

                        <Col md={12} className="text-center mt-3">
                          <Button type='submit' className='btn btn-success'>Save</Button>
                        </Col>

                      </Form>
                    </ul>
                  </li>
                  {/* MOOD AND AFFECT END*/}

                  {/* THOUGHT START*/}
                  <li className="tab-content tab-content-4 typography">
                    <div className="update_class d-flex align-items-center">
                      <h1>4. THOUGHT</h1>

                      <Button className='btn btn-success mx-3' type='button' onClick={handleThoughNavigate}>View All</Button>
                    </div>

                    <Form onSubmit={handlethoughSubmit}>
                      <ul>
                        <li className='icon-li'>
                          <h4 style={{ display: "inline" }}>Stream and form of thought: <span style={{ color: 'red' }}>*</span></h4>
                          <div className="d-flex flex-wrap gap-3 mt-2">
                            {[
                              ["Spontaneity", "Spontaneity"],
                              ["productivity", "Productivity"],
                              ["flight of ideas", "Flight of Ideas"],
                              ["poverty of content of speech", "Poverty of content of speech"],
                              ["thought block", "thought block"],
                              ["thought is assessed", "Continuity of thought is assessed"],
                              ["questions asked", "Whether the thought processes are relevant to the questions asked."],
                              ["loosening of associations", "Loose of associations"],
                              ["loosening of tangentiality", "Loose of tangentiality"],
                              ["loosening of circumstantiality", "Loose of circumstantiality"],
                              ["Illogical thinking", "Illogical thinking"],
                              ["perseveration", "Perseveration"],
                              ["verbigeration is noted", "Verbigeration is noted"],
                              ["Nothing", "Nothing"]
                            ].map(([id, label]) => renderthoughCheckbox("stream_form_though", id, label))}
                          </div>

                        </li>

                        <li className='icon-li'>
                          <h4 style={{ display: "inline" }}>Content of thought: <span style={{ color: 'red' }}>*</span></h4>
                          <div className="d-flex flex-wrap gap-3 mt-2">
                            {[
                              ["obession", "Obsessions and contents of phobias"],
                              ["ideas and delusions", "Ideas and delusions of persecution"],
                              ["reference", "Reference"],
                              ["grandeur", "Grandeur"],
                              ["love", "Love"],
                              ["jealousy", "Jealousy (infidelity)"],
                              ["guilt", "Guilt"],
                              ["nihilism", "Nihilism"],
                              ["poverty", "Poverty"],
                              ["Hypochondriacal symptoms", "Hypochondriacal symptoms"],
                              ["hopelessness", "Hopelessness"],
                              ["helplessness", "Helplessness"],
                              ["worthlessness", "Worthlessness"],
                              ["suicidal ideation", "suicide should be explored"],
                              ["Delusions of control", "Delusions of control"],
                              ["thought insertion", "thought insertion"],
                              ["thought withdrawal", "thought withdrawal"],
                              ["thought broadcasting", "thought broadcasting"],
                              ["Neologisms", "Neologisms"],
                              ["Nothing", "Nothing"]
                            ].map(([id, label]) => renderthoughCheckbox("content_though", id, label))}
                          </div>

                          <Col md={12} className="text-center mt-3">
                            <Button type='submit' className='btn btn-success'>Save</Button>
                          </Col>
                        </li>
                      </ul>
                    </Form>

                  </li>
                  {/* THOUGHT END*/}

                  {/* Perception START*/}
                  <li className="tab-content tab-content-5 typography">
                    <div className="update_class d-flex align-items-center">
                      <h1>5. PERCEPTION</h1>

                      <Button className='btn btn-success mx-3' type='button' onClick={handlePerceptionNavigate}>View All</Button>
                    </div>
                    <Form onSubmit={handlePerceptionSubmit}>
                      <ul>
                        <li className='icon-li'>
                          <h4 style={{ display: "inline" }}>Hallucinations: <span style={{ color: 'red' }}>*</span></h4>
                          <div className="d-flex flex-wrap gap-3 mt-2">
                            {[
                              ["auditory", "Auditory"],
                              ["visual", "Visual"],
                              ["olfactory", "Olfactory"],
                              ["gustatory", "Gustatory"],
                              ["tactile", "Tactile"],
                              ["Nothing", "Nothing"]
                            ].map(([id, label]) => renderhallucinationCheck("hallucination_type", id, label))}
                          </div>

                          <div className='d-flex flex-wrap gap-3 mt-2'>
                            <Col md={4}>
                              <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                <Form.Label>What was heard? <span style={{ color: 'red' }}>*</span></Form.Label>
                                <Form.Control as="textarea" rows={2}
                                  name='heard'
                                  value={perceptionData.heard}
                                  onChange={handleInputChange3} />
                              </Form.Group>
                              <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                <Form.Label>How many voices were heard? <span style={{ color: 'red' }}>*</span></Form.Label>
                                <Form.Control as="textarea" rows={2}
                                  name='voices_heard'
                                  value={perceptionData.voices_heard}
                                  onChange={handleInputChange3} />
                              </Form.Group>
                            </Col>
                            <Col md={4}>

                              <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                <Form.Label>In which part of the day? <span style={{ color: 'red' }}>*</span></Form.Label>
                                <Form.Control as="textarea" rows={2}
                                  name='part_of_day'
                                  value={perceptionData.part_of_day}
                                  onChange={handleInputChange3} />
                              </Form.Group>
                              <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                <Form.Label>Male or Female voices? <span style={{ color: 'red' }}>*</span></Form.Label>
                                <Form.Control as="textarea" rows={2}
                                  name='female_male_voices'
                                  value={perceptionData.female_male_voices}
                                  onChange={handleInputChange3} />
                              </Form.Group>
                            </Col>

                            <Col md={4}>

                              <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                <Form.Label>How interpreted and whether second person or third person hallucinations? (i.e., whether the voices are addressing the patient or are discussing him in third person) <span style={{ color: 'red' }}>*</span></Form.Label>
                                <Form.Control as="textarea" rows={2}
                                  name='interpreted_person'
                                  value={perceptionData.interpreted_person}
                                  onChange={handleInputChange3} />
                              </Form.Group>
                            </Col>


                          </div>
                        </li>

                        <li className='icon-li'>
                          <h4 style={{ display: "inline" }}>Illusions and misinterpretations: <span style={{ color: 'red' }}>*</span></h4>
                          <div className="d-flex flex-wrap gap-3 mt-2">
                            {[
                              ["Illusions_visual", "Visual"],
                              ["Illusions_auditory", "Auditory"],
                              ["other_sensory_fields", "Other Sensory Fields"],
                              ["clearConsciousness", "Occur in clear consciousness"],
                              ["unclearConsciousness", "Occur in unclear consciousness"],
                              ["Nothing", "Nothing"]
                            ].map(([id, label]) => renderillusion("illusion", id, label))}
                          </div>



                        </li>

                        <li className='icon-li'>
                          <h4 style={{ display: "inline" }}>Perception Changes : <span style={{ color: 'red' }}>*</span></h4>
                          <div className="d-flex flex-wrap gap-3 mt-2">
                            {[
                              ["Depersonalization", "Depersonalization"],
                              ["derealization", "derealization"],
                              ["Nothing", "Nothing"]
                            ].map(([id, label]) => renderPerceptionChanges("perception_changes", id, label))}
                          </div>
                        </li>

                        <li className='icon-li'>
                          <h4 style={{ display: "inline" }}>Somatic passivity phenomenon : <span style={{ color: 'red' }}>*</span></h4>
                          <div className="d-flex flex-wrap gap-3 mt-2">
                            {[
                              ["strangeSensations", "Strange sensations imposed by 'somebody'"]
                            ].map(([id, label]) => rendersomatic("somatic", id, label))}
                          </div>

                        </li>

                        <li className='icon-li'>
                          <h4 style={{ display: "inline" }}>Others :</h4>
                          <div className="d-flex flex-wrap gap-3 mt-2">
                            {[
                              ["autoscopy", "Autoscopy"],
                              ["abnormalVestibular", "Abnormal vestibular sensations"],
                              ["senseOfPresence", "Sense of presence"],
                              ["Nothing", "Nothing"]
                            ].map(([id, label]) => renderothers("others", id, label))}
                          </div>
                          <Col md={12} className="text-center mt-3">
                            <Button type='submit' className='btn btn-success'>Save</Button>
                          </Col>

                        </li>


                      </ul>
                    </Form>

                  </li>
                  {/* Perception END*/}


                  {/* Cognition START*/}
                  <li className="tab-content tab-content-6 typography">
                    <div className="update_class d-flex align-items-center">
                      <h1>6. COGNITION OR NEUROPSYCHIATRIC ASSESSMENT</h1>

                      <Button className='btn btn-success mx-3' type='button' onClick={handleCognitionNavigate}>View All</Button>
                    </div>

                    <Form onSubmit={handleCognitionSubmit}>
                      <ul>
                        <li className='icon-li'>
                          <h4 style={{ display: "inline" }}>Consciousness: <span style={{ color: 'red' }}>*</span></h4>
                          <div className="d-flex flex-wrap gap-3 mt-2">
                            {[
                              ["Conscious", "Conscious"],
                              ["Confusion", "Confusion"],
                              ["Clouding", "Clouding"],
                              ["Delirium", "Delirium"],
                              ["stupor", "Stupor"],
                              ["coma", "Coma"],
                              ["Nothing", "Nothing"]
                            ].map(([id, label]) => renderConginationCheck("consciousness", id, label))}
                            <p className="w-100 mt-2">Any disturbance of consciousness should be rated on Glasgow Coma Scale.</p>
                          </div>
                        </li>

                        <li className='icon-li'>
                          <h4 style={{ display: "inline" }}>Orientation: </h4>
                          <div className="d-flex flex-wrap gap-3 mt-2">
                            <label>Oriented to Time: <span style={{ color: 'red' }}>*</span></label>
                            <select id="orientation_time" name="orientation_time" className="form-control" required
                              value={cognitionData.orientation_time}
                              onChange={handleChange1}>
                              <option value="">-- Select --</option>
                              <option value="yes">Yes (knows time, date, season, etc.)</option>
                              <option value="no">No</option>
                            </select>

                            <label>Oriented to Place: <span style={{ color: 'red' }}>*</span></label>
                            <select id="orientation_place" name="orientation_place" className="form-control" required
                              value={cognitionData.orientation_place}
                              onChange={handleChange1}>
                              <option value="">-- Select --</option>
                              <option value="yes">Yes (knows location, residence)</option>
                              <option value="no">No</option>
                            </select>

                            <label>Oriented to Person: <span style={{ color: 'red' }}>*</span></label>
                            <select id="orientation_person" name="orientation_person" className="form-control" required
                              value={cognitionData.orientation_person}
                              onChange={handleChange1}>
                              <option value="">-- Select --</option>
                              <option value="yes">Yes (knows name, identifies others)</option>
                              <option value="no">No</option>
                            </select>

                          </div>
                        </li>

                        <li className='icon-li'>
                          <h4 style={{ display: "inline" }}>Attention:</h4>
                          <p>Is the attention easily aroused and sustained. Ask the patient to repeat digits forwards backwards. <span style={{ color: 'red' }}>*</span></p>
                          <div className="d-flex flex-wrap gap-3 mt-2">
                            {consciousnessStates.map((state) => (
                              <div key={state.id} style={{ width: "30%", minWidth: "200px" }}>
                                <Form.Check
                                  type="checkbox"
                                  name='consciousnessState'
                                  id={state.id}
                                  checked={selectedStates.includes(state.id)}
                                  onChange={handleCheckboxChange1}
                                  label={
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                      <img
                                        src={state.img}
                                        alt={state.label}
                                        style={{ width: "100%", height: "auto", objectFit: "contain" }}
                                      />
                                      <span>{state.label}</span>
                                    </div>
                                  }
                                />
                              </div>
                            ))}
                          </div>

                        </li>

                        <li className='icon-li'>
                          <h4 style={{ display: "inline" }}>Concentration</h4>
                          <Form.Group className="mb-3">
                            <Form.Label>1. Can the patient concentrate? <span style={{ color: 'red' }}>*</span></Form.Label>
                            <Form.Check
                              type="radio"
                              label="Yes"
                              name="canConcentrate"
                              value="Yes"
                              checked={canConcentrate.toLowerCase() === 'yes'}
                              onChange={handleRadioChange}
                            />
                            <Form.Check
                              type="radio"
                              label="No"
                              name="canConcentrate"
                              value="No"
                              checked={canConcentrate.toLowerCase() === 'no'}
                              onChange={handleRadioChange}
                            />

                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>2. Ease of distractibility <span style={{ color: 'red' }}>*</span></Form.Label>
                            <Form.Control as="textarea" rows={2}
                              placeholder="Describe how easily the Resident's is distracted"
                              name='distractibility'
                              value={cognitionData.distractibility}
                              onChange={handleInputChange4} />
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>3. Ask to subtract serial sevens from hundred (100-7 test), or serial threes from forty (40-3 test), or to count backwards from 20 <span style={{ color: 'red' }}>*</span></Form.Label>
                            <Form.Control as="textarea" rows={2}
                              placeholder="Describe the resident's response."
                              name='asking_test'
                              value={cognitionData.asking_test}
                              onChange={handleInputChange4} />
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>4. Enumerate the names of the months (or days of the week) in the reverse order. <span style={{ color: 'red' }}>*</span></Form.Label>
                            <Form.Control as="textarea" rows={2}
                              placeholder="Describe or write the resident's response here"
                              name="names_months"
                              value={cognitionData.names_months}
                              onChange={handleInputChange4} />
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>5. Note down the answers and the time take perform the tests. <span style={{ color: 'red' }}>*</span></Form.Label>
                            <Form.Control as="textarea" rows={2}
                              placeholder="Describe here..."
                              value={cognitionData.test_performance}
                              name="test_performance"
                              onChange={handleInputChange4} />
                          </Form.Group>
                        </li>

                        <li className='icon-li'>
                          <h4 style={{ display: "inline" }}>Memory:</h4>
                          <Form.Group className="mb-3">
                            <Form.Label>Immediate Retention (IR) <span style={{ color: 'red' }}>*</span></Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={2}
                              name="immediate_retention"
                              value={cognitionData.immediate_retention}
                              onChange={handleInputChange4}
                            />
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>Recall (R) after a delay <span style={{ color: 'red' }}>*</span></Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={2}
                              name="recall"
                              value={cognitionData.recall}
                              onChange={handleInputChange4}
                            />
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>How did the patient come to the room/hospital ? <span style={{ color: 'red' }}>*</span></Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={2}
                              name="patient_place"
                              value={cognitionData.patient_place}
                              onChange={handleInputChange4}
                            />
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>What he ate for dinner the day before or for breakfast the same morning ? <span style={{ color: 'red' }}>*</span></Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={2}
                              name="dinner_ate"
                              value={cognitionData.dinner_ate}
                              onChange={handleInputChange4}
                            />
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>Ask for the date of marriage <span style={{ color: 'red' }}>*</span></Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={2}
                              name="date_ofMrg"
                              value={cognitionData.date_ofMrg}
                              onChange={handleInputChange4}
                            />
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>Name and birthdays of children <span style={{ color: 'red' }}>*</span></Form.Label>
                            <Form.Control
                              as="textarea"
                              name="birthdays_children"
                              value={cognitionData.birthdays_children}
                              onChange={handleInputChange4}
                              rows={2}
                            />
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>Any other relevant questions from the person's past</Form.Label>
                            <Form.Control
                              as="textarea"
                              value={cognitionData.person_past}
                              name='person_past'
                              onChange={handleInputChange4}
                              rows={2}
                            />
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>Note any amnesia (anterograde/retrograde) <span style={{ color: 'red' }}>*</span></Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={2}
                              name="amnesia"
                              value={cognitionData.amnesia}
                              onChange={handleInputChange4}
                            />
                          </Form.Group>
                        </li>

                        <li className='icon-li'>
                          <h4 style={{ display: "inline" }}>Question to ask for the Memory</h4>
                          <h5>Long-term Memory</h5>
                          <Form.Group className="mb-3">
                            <Form.Label>Where did you live when you were growing up? <span style={{ color: 'red' }}>*</span></Form.Label>
                            <Form.Control
                              as="textarea"
                              name="live_growing"
                              value={cognitionData.live_growing}
                              onChange={handleInputChange4}
                              rows={2}
                            />
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>What was the name of the school you went to? <span style={{ color: 'red' }}>*</span></Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={2}
                              name="person_school"
                              value={cognitionData.person_school}
                              onChange={handleInputChange4}
                            />
                          </Form.Group>

                          <h5>Short-term Memory</h5>

                          <Form.Group className="mb-3">
                            <Form.Label>What did you have for breakfast? <span style={{ color: 'red' }}>*</span></Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={2}
                              name="breakfast_ques"
                              value={cognitionData.breakfast_ques}
                              onChange={handleInputChange4}
                            />
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>What did you do Yesterday? <span style={{ color: 'red' }}>*</span></Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={2}
                              name="do_yesterday"
                              value={cognitionData.do_yesterday}
                              onChange={handleInputChange4}
                            />
                          </Form.Group>


                        </li>

                        <li className='icon-li'>
                          <h4 style={{ display: "inline" }}>Intelligence:</h4>
                          <Form.Group className="mb-3">
                            <Form.Label>Ask questions about general information, keeping in mind the patient's educational and social background, his experiences and interests <span style={{ color: 'red' }}>*</span></Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={2}
                              name="general_info"
                              value={cognitionData.general_info}
                              onChange={handleInputChange4}
                              placeholder="Describe what you asked and how the resident responded."
                            />
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>Test for reading and writing <span style={{ color: 'red' }}>*</span></Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={2}
                              name='test_red_wri'
                              value={cognitionData.test_red_wri}
                              onChange={handleInputChange4}
                              placeholder="Describe what you asked and how the resident responded."
                            />
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>Give simple tests of calculation <span style={{ color: 'red' }}>*</span></Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={2}
                              name='calculation_test'
                              value={cognitionData.calculation_test}
                              onChange={handleInputChange4}
                              placeholder="Describe what you asked and how the resident responded."
                            />
                          </Form.Group>
                        </li>

                        <li>
                          <h4 style={{ display: "inline" }}>Abstract thinking:</h4>
                          <p>Abstract thinking testing assesses patient's concept formation. The methods used are:</p>

                          <Form.Group className="mb-3">
                            <Form.Label>Proverb testing: Asking the meaning of simple proverbs. <span style={{ color: 'red' }}>*</span></Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={2}
                              name="proverb_testing"
                              value={cognitionData.proverb_testing}
                              onChange={handleInputChange4}
                              placeholder="Describe what you asked and how the resident responded."
                            />
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>Ask the resident to identify the similarities and differences between familiar objects such as a table and a chair, a banana and an orange, a dog and a lion, and an eye and an ear. <span style={{ color: 'red' }}>*</span></Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={2}
                              name="familiar_object"
                              value={cognitionData.familiar_object}
                              onChange={handleInputChange4}
                              placeholder="Describe what you asked and how the resident responded."
                            />
                          </Form.Group>
                        </li>
                        <Col md={12} className="text-center mt-3">
                          <Button type='submit' className='btn btn-success'>Save</Button>
                        </Col>
                      </ul>
                    </Form>

                  </li>
                  {/* Cognition END*/}

                  {/* Judgement START*/}
                  <li className="tab-content tab-content-7 typography">
                    <div className="update_class d-flex align-items-center">
                      <h1>7. JUDGEMENT</h1>

                      <Button className='btn btn-success mx-3' type='button' onClick={handleJudgementNavigate}>View All</Button>
                    </div>
                    <ul>
                      <Form onSubmit={handleJudgementSubmit}>
                        <li className="icon-li">
                          <h4 style={{ display: "inline" }}>Personal judgement: <span style={{ color: 'red' }}>*</span></h4>
                          <Form.Group className="mb-3">
                            <Form.Control as="textarea" rows={2}
                              name='personal_judgement'
                              value={judgementData.personal_judgement}
                              onChange={handleInputChange1} />
                          </Form.Group>
                        </li>

                        <li className="icon-li">
                          <h4 style={{ display: "inline" }}>Social judgement: <span style={{ color: 'red' }}>*</span></h4>
                          <Form.Group className="mb-3">
                            <Form.Control as="textarea" rows={2}
                              name='social_judgement'
                              value={judgementData.social_judgement}
                              onChange={handleInputChange1}
                            />
                          </Form.Group>
                        </li>

                        <li className="icon-li">
                          <h4 style={{ display: "inline" }}>Test judgement: <span style={{ color: 'red' }}>*</span></h4>
                          <Form.Group className="mb-3">
                            <Form.Label>Please explain what actions you would take in the following situations: a house on fire, a man lying on the road, and a sealed, stamped envelope on the street.</Form.Label>
                            <Form.Control as="textarea" rows={2}
                              name='test_judgement'
                              value={judgementData.test_judgement}
                              onChange={handleInputChange1} />
                          </Form.Group>
                        </li>

                        <li className="icon-li">
                          <h4 style={{ display: "inline" }}>Judgement: <span style={{ color: 'red' }}>*</span></h4>
                          <Form.Group>
                            <div>
                              {["Good", "Intact", "Normal", "Poor", "Impaired", "Abnormal"].map((value) => (
                                <Form.Check
                                  key={value}
                                  type="radio"
                                  id={`judgement-${value.toLowerCase()}`}
                                  label={value}
                                  name="judgement"
                                  value={value}
                                  checked={judgementData.judgement === value}
                                  onChange={handleChange}
                                />
                              ))}
                            </div>
                          </Form.Group>



                        </li>

                        <Col md={12} className="text-center mt-3">
                          <Button type='submit' className='btn btn-success'>Save</Button>
                        </Col>

                      </Form>
                    </ul>
                  </li>
                  {/* Judgement END*/}

                  {/* Insight START*/}
                  <li className="tab-content tab-content-last typography">
                    <div className="update_class d-flex align-items-center">
                      <h1>8. INSIGHT</h1>

                      <Button className='btn btn-success mx-3' type='button' onClick={handleInsightNavigate}>View All</Button>
                    </div>
                    <p>The patient's level of awareness and insight into their illness. </p>
                    <ul>
                      <Form onSubmit={handleInsightSubmit}>
                        <li className="icon-li">
                          <h4 style={{ display: "inline" }}>LEVELS OF INSIGHT:</h4>
                          <p>Insight is assessed using a six-point scale ranging from one to six. </p>
                          <Form.Group className="mb-3">
                            <Form.Label>1. Complete denial of illness <span style={{ color: 'red' }}>*</span></Form.Label>
                            <Form.Control as="textarea" rows={2}
                              name='denail_illness'
                              value={insightData.denail_illness}
                              onChange={handleInputChange2} />
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>2. Slight awareness of being sick & needing help but denying it at the same time <span style={{ color: 'red' }}>*</span></Form.Label>
                            <Form.Control as="textarea" rows={2}
                              name='slight_awareness'
                              value={insightData.slight_awareness}
                              onChange={handleInputChange2}
                            />
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>3. Awareness of being sick but blaming it on others, on external factors, or on organic factors. <span style={{ color: 'red' }}>*</span></Form.Label>
                            <Form.Control as="textarea" rows={2}
                              name='awarness_sick'
                              value={insightData.awarness_sick}
                              onChange={handleInputChange2} />
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>4. Awareness that illness is due to something unknown in the patient <span style={{ color: 'red' }}>*</span></Form.Label>
                            <Form.Control as="textarea" rows={2}
                              name='awarness_illness'
                              value={insightData.awarness_illness}
                              onChange={handleInputChange2} />
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>5. Intellectual insight <span style={{ color: 'red' }}>*</span></Form.Label>
                            <Form.Control as="textarea" rows={2}
                              name='intellectual_insight'
                              value={insightData.intellectual_insight}
                              onChange={handleInputChange2} />
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>6. True emotional insight <span style={{ color: 'red' }}>*</span></Form.Label>
                            <Form.Control as="textarea" rows={2}
                              name='true_emotion'
                              value={insightData.true_emotion}
                              onChange={handleInputChange2} />
                          </Form.Group>
                        </li>
                        <Col md={12} className="text-center mt-3">
                          <Button type='submit' className='btn btn-success'>Save</Button>
                        </Col>

                      </Form>
                    </ul>
                  </li>
                  {/* Insight START*/}
                </ul>
              </div>
              {/*/ tabs */}
            </div>
          </Col>
        </Row>
      </Container>

      <div ref={formRef} style={{ position: "absolute", left: "-9999px", top: 0, background: "#fff", padding: "20px", width: "210mm" }}>
        <Row className="d-flex align-items-center justify-content-center mb-2">
          <Col md={2}>
            <img src={manasu_logo} className="pdf_logo" alt="" />
          </Col>
          <Col md={10}>
          </Col>
        </Row>

        {allFormEntries.map((entry, index) => (
          <div key={index} style={{ pageBreakAfter: "always" }}>
            <Row className="d-flex align-items-center justify-content-center mb-2">
              <Col md={1}>

              </Col>
              <Col md={11}>
                <h4 className="text-center">MSE Form of {entry.appearance_behaviour?.date}</h4>
              </Col>
            </Row>
            <ul style={{ listStyleType: "none", textAlign: "start" }}>
              <li className="tab-content my-5">
                <h5><strong>1. GENERAL APPEARANCE AND BEHAVIOUR</strong> DATE: {entry.appearance_behaviour?.date}</h5>
                <ul style={{ listStyleType: "none", textAlign: "start" }}>
                  <li>
                    <strong>General Appearance : </strong>
                    <p className='mx-3'>{entry.appearance_behaviour?.general_appearance || "NULL"}</p>
                  </li>
                  <li>
                    <strong>Attitude towards the examiner : </strong>
                    <p className='mx-3'>{entry.appearance_behaviour?.attitude || "NULL"}</p>
                  </li>
                  <li>
                    <strong>Comprehension : </strong>
                    <p className='mx-3'>{entry.appearance_behaviour?.comprehension || "NULL"}</p>
                  </li>
                  <li>
                    <strong>Gait and posture : </strong>
                    <p className='mx-3'>{entry.appearance_behaviour?.gait_posture || "NULL"}</p>
                  </li>
                  <li>
                    <strong>Motor activity : </strong>
                    <p className='mx-3'>{entry.appearance_behaviour?.motor_activity || "NULL"}</p>
                  </li>
                  <li>
                    <strong>Catatonic signs : </strong>
                    <p className='mx-3'>{entry.appearance_behaviour?.catatonic_sign || "NULL"}</p>
                  </li>
                  <li>
                    <strong>Conversion and dissociative signs : </strong>
                    <p className='mx-3'>{entry.appearance_behaviour?.conversion_dissociative || "NULL"}</p>
                  </li>
                  <li>
                    <strong>Social manner : </strong>
                    <p className='mx-3'>{entry.appearance_behaviour?.social_manner || "NULL"}</p>
                  </li>
                  <li>
                    <strong>Rapport : </strong>
                    <p className='mx-3'>{entry.appearance_behaviour?.rapport || "NULL"}</p>
                  </li>
                  <li>
                    <strong>Hallucinatory behaviour : </strong>
                    <p className='mx-3'>{entry.appearance_behaviour?.hallucinatory_behaviour || "NULL"}</p>
                  </li>
                </ul>
              </li>
              <li className="tab-content my-5">
                <h5><strong>2. SPEECH</strong> DATE: {entry.speech?.date}</h5>
                <ul style={{ listStyleType: "none", textAlign: "start" }}>
                  <li>
                    <strong>Rate and quantity of speech : </strong>
                    <p className='mx-3'>{entry.speech?.rate_quantity || "NULL"}</p>
                  </li>
                  <li>
                    <strong>Volume and tone of speech : </strong>
                    <p className='mx-3'>{entry.speech?.volume_tone || "NULL"}</p>
                  </li>
                  <li>
                    <strong>Flow and rhythm of speech : </strong>
                    <p className='mx-3'>{entry.speech?.flow_rhythm || "NULL"}</p>
                  </li>
                </ul>
              </li>
              <li className="tab-content my-5">
                <h5><strong>3. MOOD AND AFFECT</strong> DATE: {entry.mood_affect?.date}</h5>
                <ul style={{ listStyleType: "none", textAlign: "start" }}>
                  <li>
                    <strong>Mood Described as : </strong>
                    <p className='mx-3'>{entry.mood_affect?.mood_description || "NULL"}</p>
                  </li>
                  <li>
                    <strong>How do they appear to you? : </strong>
                    <p className='mx-3'>{entry.mood_affect?.appearance || "NULL"}</p>
                  </li>
                  <li>
                    <strong>Ask the Resident directly how he/she feels : </strong>
                    <p className='mx-3'>{entry.mood_affect?.resident_feeling || "NULL"}</p>
                  </li>
                  <h6>Question to ask about Mood : </h6>
                  <li>
                    <strong>How do you generally feel most of the time? : </strong>
                    <p className='mx-3'>{entry.mood_affect?.general_feeling || "NULL"}</p>
                  </li>
                  <li>
                    <strong>What's your mood like? : </strong>
                    <p className='mx-3'>{entry.mood_affect?.mood_like || "NULL"}</p>
                  </li>
                  <li>
                    <strong>How would you say you feel generally - happy, sad, frightened, angry ? : </strong>
                    <p className='mx-3'>{entry.mood_affect?.resident_general_feeling || "NULL"}</p>
                  </li>
                  <li>
                    <strong>Resident's Looks like : </strong>
                    <p className='mx-3'>{entry.mood_affect?.resident_look || "NULL"}</p>
                  </li>
                </ul>
              </li>
              <li className="tab-content my-5">
                <h5><strong>4. THOUGHT</strong> DATE: {entry.though?.date}</h5>
                <ul style={{ listStyleType: "none", textAlign: "start" }}>
                  <li>
                    <strong>Stream and form of thought : </strong>
                    <p className='mx-3'>{entry.though?.stream_form_though || "NULL"}</p>
                  </li>
                  <li>
                    <strong>Content of thought : </strong>
                    <p className='mx-3'>{entry.though?.content_though || "NULL"}</p>
                  </li>
                </ul>
              </li>
              <li className="tab-content my-5">
                <h5><strong>5. PERCEPTION</strong> DATE: {entry.perceiption?.date}</h5>
                <ul style={{ listStyleType: "none", textAlign: "start" }}>
                  <li>
                    <strong>Hallucinations : </strong>
                    <p className='mx-3'>{entry.perceiption?.hallucination_type || "NULL"}</p>
                  </li>
                  <li>
                    <strong>What was heard? : </strong>
                    <p className='mx-3'>{entry.perceiption?.heard || "NULL"}</p>
                  </li>
                  <li>
                    <strong>How many voices were heard? : </strong>
                    <p className='mx-3'>{entry.perceiption?.voices_heard || "NULL"}</p>
                  </li>
                  <li>
                    <strong>In which part of the day? : </strong>
                    <p className='mx-3'>{entry.perceiption?.part_of_day || "NULL"}</p>
                  </li>
                  <li>
                    <strong>Male or Female voices? : </strong>
                    <p className='mx-3'>{entry.perceiption?.female_male_voices || "NULL"}</p>
                  </li>
                  <li>
                    <strong>In which part of the day? : </strong>
                    <p className='mx-3'>{entry.perceiption?.part_of_day || "NULL"}</p>
                  </li>
                  <li>
                    <strong>How interpreted and whether second person or third person hallucinations? (i.e., whether the voices are addressing the patient or are discussing him in third person) : </strong>
                    <p className='mx-3'>{entry.perceiption?.interpreted_person || "NULL"}</p>
                  </li>
                  <li>
                    <strong>Illusions and misinterpretations : </strong>
                    <p className='mx-3'>{entry.perceiption?.illusion || "NULL"}</p>
                  </li>
                  <li>
                    <strong>Perception Changes : </strong>
                    <p className='mx-3'>{entry.perceiption?.perception_changes || "NULL"}</p>
                  </li>
                  <li>
                    <strong>Somatic passivity phenomenon : </strong>
                    <p className='mx-3'>{entry.perceiption?.somatic || "NULL"}</p>
                  </li>
                  <li >
                    <strong>Others : </strong>
                    <p className='mx-3'>{entry.perceiption?.others || "NULL"}</p>
                  </li>
                </ul>
              </li>
              <li className="tab-content my-5">
                <h5><strong>6. COGNITION OR NEUROPSYCHIATRIC ASSESSMENT</strong> DATE: {entry.conginition?.date}</h5>
                <ul style={{ listStyleType: "none", textAlign: "start" }}>
                  <li>
                    <strong>Consciousness : </strong>
                    <p className='mx-3'>{entry.conginition?.consciousness || "NULL"}</p>
                  </li>
                  <h6>Orientation</h6>
                  <li>
                    <strong>Oriented to Time : </strong>
                    <p className='mx-3'>{entry.conginition?.orientation_time || "NULL"}</p>
                  </li>
                  <li>
                    <strong>Oriented to sPlace : </strong>
                    <p className='mx-3'>{entry.conginition?.orientation_place || "NULL"}</p>
                  </li>
                  <li>
                    <strong>Oriented to Person : </strong>
                    <p className='mx-3'>{entry.conginition?.orientation_person || "NULL"}</p>
                  </li>
                  <h6>Attention</h6>
                  <li>
                    <strong>Is the attention easily aroused and sustained. Ask the patient to repeat digits forwards backwards. </strong>
                    <p className='mx-3'>{entry.conginition?.consciousnessState || "NULL"}</p>
                  </li>
                  <h6>Concentration</h6>
                  <li>
                    <strong>1. Can the patient concentrate? </strong>
                    <p className='mx-3'>{entry.conginition?.canConcentrate || "NULL"}</p>
                  </li>
                  <li>
                    <strong>2. Ease of distractibility </strong>
                    <p className='mx-3'>{entry.conginition?.distractibility || "NULL"}</p>
                  </li>
                  <li>
                    <strong>2. Ease of distractibility </strong>
                    <p className='mx-3'>{entry.conginition?.distractibility || "NULL"}</p>
                  </li>
                  <li>
                    <strong>3. Ask to subtract serial sevens from hundred (100-7 test), or serial threes from forty (40-3 test), or to count backwards from 20  </strong>
                    <p className='mx-3'>{entry.conginition?.asking_test || "NULL"}</p>
                  </li>
                  <li>
                    <strong>4. Enumerate the names of the months (or days of the week) in the reverse order.  </strong>
                    <p className='mx-3'>{entry.conginition?.names_months || "NULL"}</p>
                  </li>
                  <li>
                    <strong>5. Note down the answers and the time take perform the tests.</strong>
                    <p className='mx-3'>{entry.conginition?.test_performance || "NULL"}</p>
                  </li>
                  <h6>Memory</h6>
                  <li>
                    <strong>Immediate Retention (IR)</strong>
                    <p className='mx-3'>{entry.conginition?.immediate_retention || "NULL"}</p>
                  </li>
                  <li>
                    <strong>Recall (R) after a delay</strong>
                    <p className='mx-3'>{entry.conginition?.recall || "NULL"}</p>
                  </li>
                  <li>
                    <strong>How did the patient come to the room/hospital ?</strong>
                    <p className='mx-3'>{entry.conginition?.patient_place || "NULL"}</p>
                  </li>
                  <li>
                    <strong>What he ate for dinner the day before or for breakfast the same morning ?</strong>
                    <p className='mx-3'>{entry.conginition?.dinner_ate || "NULL"}</p>
                  </li>
                  <li>
                    <strong>Ask for the date of marriage</strong>
                    <p className='mx-3'>{entry.conginition?.date_ofMrg || "NULL"}</p>
                  </li>
                  <li>
                    <strong>Name and birthdays of children</strong>
                    <p className='mx-3'>{entry.conginition?.birthdays_children || "NULL"}</p>
                  </li>
                  <li>
                    <strong>Any other relevant questions from the person's past</strong>
                    <p className='mx-3'>{entry.conginition?.person_past || "NULL"}</p>
                  </li>
                  <li>
                    <strong>Note any amnesia (anterograde/retrograde)</strong>
                    <p className='mx-3'>{entry.conginition?.amnesia || "NULL"}</p>
                  </li>
                  <h6>Question to ask for the Memory : </h6>
                  <h6>Long-term Memory : </h6>
                  <li>
                    <strong>Where did you live when you were growing up?</strong>
                    <p className='mx-3'>{entry.conginition?.live_growing || "NULL"}</p>
                  </li>
                  <li>
                    <strong>What was the name of the school you went to?</strong>
                    <p className='mx-3'>{entry.conginition?.person_school || "NULL"}</p>
                  </li>
                  <h6>Short-term Memory</h6>
                  <li>
                    <strong>What did you have for breakfast?</strong>
                    <p className='mx-3'>{entry.conginition?.breakfast_ques || "NULL"}</p>
                  </li>
                  <li>
                    <strong>What did you do Yesterday?</strong>
                    <p className='mx-3'>{entry.conginition?.do_yesterday || "NULL"}</p>
                  </li>
                  <h6>Intelligence : </h6>
                  <li>
                    <strong>Ask questions about general information, keeping in mind the patient's educational and social background, his experiences and interests</strong>
                    <p className='mx-3'>{entry.conginition?.general_info || "NULL"}</p>
                  </li>
                  <li>
                    <strong>Test for reading and writing</strong>
                    <p className='mx-3'>{entry.conginition?.test_red_wri || "NULL"}</p>
                  </li>
                  <li>
                    <strong>Give simple tests of calculation</strong>
                    <p className='mx-3'>{entry.conginition?.calculation_test || "NULL"}</p>
                  </li>
                  <h6>Abstract thinking :</h6>
                  <li>
                    <strong>Abstract thinking testing assesses patient's concept formation. The methods used are:</strong>
                    <p className='mx-3'>{entry.conginition?.proverb_testing || "NULL"}</p>
                  </li>
                  <li>
                    <strong>Ask the resident to identify the similarities and differences between familiar objects such as a table and a chair, a banana and an orange, a dog and a lion, and an eye and an ear.</strong>
                    <p className='mx-3'>{entry.conginition?.familiar_object || "NULL"}</p>
                  </li>
                </ul>
              </li>
              <li className="tab-content my-5">
                <h5><strong>7. JUDGEMENT</strong> DATE: {entry.judgement?.date}</h5>
                <ul style={{ listStyleType: "none", textAlign: "start" }}>
                  <li>
                    <strong>Personal judgement : </strong>
                    <p className='mx-3'>{entry.judgement?.personal_judgement || "NULL"}</p>
                  </li>
                  <li>
                    <strong>Social judgement : </strong>
                    <p className='mx-3'>{entry.judgement?.social_judgement || "NULL"}</p>
                  </li>
                  <li>
                    <strong>Test judgement : </strong>
                    <p className='mx-3'>{entry.judgement?.test_judgement || "NULL"}</p>
                  </li>
                  <li>
                    <strong>Judgement : </strong>
                    <p className='mx-3'>{entry.judgement?.judgement || "NULL"}</p>
                  </li>
                </ul>
              </li>
              <li className="tab-content my-5">
                <h5><strong>8. INSIGHT</strong> DATE: {entry.insight?.date}</h5>
                <ul style={{ listStyleType: "none", textAlign: "start" }}>
                  <li>
                    <h6>Levels of Insight</h6>
                    <p>Insight is assessed using a six-point scale ranging from one to six.</p>
                    <strong>1. Complete denial of illness : </strong>
                    <p className='mx-3'>{entry.insight?.denail_illness || "NULL"}</p>
                  </li>
                  <li>
                    <strong>2. Slight awareness of being sick & needing help but denying it at the same time : </strong>
                    <p className='mx-3'>{entry.insight?.slight_awareness || "NULL"}</p>
                  </li>
                  <li>
                    <strong>3. Awareness of being sick but blaming it on others, on external factors, or on organic factors : </strong>
                    <p className='mx-3'>{entry.insight?.awarness_sick || "NULL"}</p>
                  </li>
                  <li>
                    <strong>4. Awareness that illness is due to something unknown in the patient : </strong>
                    <p className='mx-3'>{entry.insight?.awarness_illness || "NULL"}</p>
                  </li>
                  <li>
                    <strong>5. Intellectual insight: </strong>
                    <p className='mx-3'>{entry.insight?.intellectual_insight || "NULL"}</p>
                  </li>
                  <li>
                    <strong>6. True emotional insight : </strong>
                    <p className='mx-3'>{entry.insight?.true_emotion || "NULL"}</p>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        ))}


      </div>


    </>
  )
}

export default MSE_form
