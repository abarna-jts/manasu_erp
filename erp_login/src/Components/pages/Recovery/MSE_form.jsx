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

function MSE_form() {
  const [rescue_image, setRescueImage] = useState(null);
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);
  const [speechshow, setspeechShow] = useState(false);
  const [moodShow, setMoodShow] = useState(false);
  const [thoughShow, setThoughShow] = useState(false);
  const [perceptionShow, setPerceptionShow] = useState(false);
  const [judgementShow, setJudgementShow] = useState(false);
  const [insightShow, setInsightShow] = useState(false);
  const [cognitionShow, setCognitionShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleSpeechClose = () => setspeechShow(false);
  const handleMoodClose = () => setMoodShow(false);
  const handleThoughClose = () => setThoughShow(false);
  const handlePerceptionClose = () => setPerceptionShow(false);
  const handleJudgementClose = () => setJudgementShow(false);
  const hanldeInsightClose = () => setInsightShow(false);
  const hanldeCognitionClose = () => setCognitionShow(false);
  const [admission_no, setAdmissionNumber] = useState('');
  const [rescue_name, setRescueName] = useState("");
  const [canConcentrate, setCanConcentrate] = useState('');
  const [selectedStates, setSelectedStates] = useState([]);
  const [shouldGeneratePDF, setShouldGeneratePDF] = useState(false);
  const [date, setDate] = useState('');
  const [formData, setFormData] = useState({
    admission_no: '',
    date:'',
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
    date:'',
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
    date:'',
  });

  const [thoughFormData, setThoughFormData] = useState({
    stream_form_though: [],
    content_though: [],
    admission_no: '',
    date:'',
  })

  const [judgementData, setJudgementFormData] = useState({
    personal_judgement: '',
    social_judgement: '',
    test_judgement: '',
    judgement: '',
    admission_no: '',
    date:'',
  })

  const [insightData, setInsightData] = useState({
    denail_illness: '',
    slight_awareness: '',
    awarness_sick: '',
    awarness_illness: '',
    intellectual_insight: '',
    true_emotion: '',
    admission_no: '',
    date:'',
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
    date:'',
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
    admission_no:'',
    date:'',

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

  // const handleAdmissionChange = (e) => {
  //   setAdmissionNumber(e.target.value);
  // };

  const apiRoute = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
  });

  // const fetchRescueDetails = async (admission_no) => {
  //   try {
  //     const response = await apiRoute.get(`/admision/get_scrbform2data/${formData.admission_no}`);
  //     const result = response.data.data[0];
  //     console.log("API Result:", result);

  //     if (result && result.rescue_image) {
  //       const imagePath = result.rescue_image.startsWith("http")
  //         ? result.rescue_image
  //         : `http://localhost:5000/${result.rescue_image}`;

  //       setRescueImage(imagePath);
  //       setRescueName(result.rescue_name || "");
  //       setError(""); // clear any previous error
  //     } else {
  //       setRescueImage(null);

  //       setError("Image not found for this admission number");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching data", error);
  //     setRescueImage(null);
  //     setRescueName("");
  //     setError("Admission Number Not found");
  //   }
  // };

  // // Trigger when admission number changes
  // useEffect(() => {
  //   if (formData.admission_no.trim() !== "") {
  //     fetchRescueDetails(formData.admission_no);
  //   } else {
  //     setRescueImage(null);
  //     setRescueName("");
  //     setError("");
  //   }
  // }, [formData.admission_no]);

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
    if (!formData.admission_no || formData.admission_no.trim() === '') {
      alert("Admission Number is required.");
      return; // Stop form submission
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
      date:date
    };

    try {
      const response = await apiRoute.post('/recovery/create_MSE', completeFormData);
      console.log("Form submitted successfully:", response.data);
      alert("Form submitted successfully!");
      window.location.reload(); // Reload the page to reflect changes
    } catch (error) {
      console.error(error);
      alert("Error submitting form.");
    }
  };

  const handleSpeechSubmit = async (e) => {
    e.preventDefault();

    if (!formData.admission_no || formData.admission_no.trim() === '') {
      alert("Admission Number is required.");
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
      date:date,
      admission_no: formData.admission_no
    };

    try {
      const response = await apiRoute.post('/recovery/create_speech', payload);
      console.log("Speech data submitted:", response.data);
      alert("Speech form submitted successfully!");
    } catch (error) {
      console.error("Error submitting speech form:", error);
      alert("Error submitting speech form.");
    }
  };

  const handleMoodAffectSubmit = async (e) => {
    e.preventDefault();
    if (!formData.admission_no || formData.admission_no.trim() === '') {
      alert("Admission Number is required.");
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
      admission_no: formData.admission_no,
      date:date,
    };

    try {
      const response = await apiRoute.post('/recovery/create_mood', payload);
      console.log("Mood data submitted:", response.data);
      alert("Mood form submitted successfully!");
      window.location.reload(); // Reload the page to reflect changes

    } catch (error) {
      console.error("Error submitting mood form:", error);
      alert("Error submitting mood form.");
    }

  };

  const handlethoughSubmit = async (e) => {
    e.preventDefault();
    if (!formData.admission_no || formData.admission_no.trim() === '') {
      alert("Admission Number is required.");
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
      date:date,
      admission_no: formData.admission_no
    };

    try {
      const response = await apiRoute.post('/recovery/create_though', payload);
      console.log("Though Data submitted:", response.data);
      alert("Though form submitted successfully!");
      window.location.reload(); // Reload the page to reflect changes

    } catch (error) {
      console.error("Error submitting Though form:", error);
      alert("Error submitting Though form.");
    }

  };

  const handleJudgementSubmit = async (e) => {
    e.preventDefault();
    if (!formData.admission_no || formData.admission_no.trim() === '') {
      alert("Admission Number is required.");
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
      date:date,
      admission_no: formData.admission_no
    };

    try {
      const response = await apiRoute.post('/recovery/create_judgement', payload);
      console.log("Judgement Data submitted:", response.data);
      alert("Judgement form submitted successfully!");
      window.location.reload(); // Reload the page to reflect changes

    } catch (error) {
      console.error("Error submitting Judgement form:", error);
      alert("Error submitting Judgement form.");
    }
  };

  const handleInsightSubmit = async (e) => {
    e.preventDefault();
    if (!formData.admission_no || formData.admission_no.trim() === '') {
      alert("Admission Number is required.");
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
      date:date,
      admission_no: formData.admission_no
    };

    try {
      const response = await apiRoute.post('/recovery/create_insight', payload);
      console.log("Insight Data submitted:", response.data);
      alert("Insight form submitted successfully!");
      window.location.reload(); // Reload the page to reflect changes

    } catch (error) {
      console.error("Error submitting Insight form:", error);
      alert("Error submitting Insight form.");
    }
  }

  const handlePerceptionSubmit = async (e) => {
    e.preventDefault();
    if (!formData.admission_no || formData.admission_no.trim() === '') {
      alert("Admission Number is required.");
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
      date:date,
      admission_no: formData.admission_no
    };

    try {
      const response = await apiRoute.post('/recovery/create_perception', payload);
      console.log("Perception Data submitted:", response.data);
      alert("Perception form submitted successfully!");
      window.location.reload(); // Reload the page to reflect changes

    } catch (error) {
      console.error("Error submitting Perception form:", error);
      alert("Error submitting Perception form.");
    }
  }

  const handleCognitionSubmit = async (e) => {
    e.preventDefault();
    if (!formData.admission_no || formData.admission_no.trim() === '') {
      alert("Admission Number is required.");
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
      date:date,
      admission_no: formData.admission_no,
      consciousnessState: selectedStates.join(', '),  // ✔️ Store array as comma-separated string
      canConcentrate: canConcentrate,                 // ✔️ Radio button value
    };

    try {
      const response = await apiRoute.post('/recovery/create_cognition', payload);
      console.log("Cognition Data submitted:", response.data);
      alert("Cognition form submitted successfully!");
      window.location.reload(); // Reload the page to reflect changes

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
    if (!formData.admission_no.trim()) {
      alert("Please enter admission number.");
      return;
    }

    try {
      const response = await apiRoute.get(`/recovery/mseAllForm/${formData.admission_no}`);
      console.log("Fetched data from API:", response.data);

      const fetchedData = response.data.data || response.data;

      if (!fetchedData || typeof fetchedData !== "object") {
        alert("Invalid or missing data from server.");
        return;
      }

      // ✅ Set all necessary form states
      if (fetchedData.appearance_behaviour) {
        setFormData({
          ...fetchedData.appearance_behaviour,
          general_appearance: fetchedData.appearance_behaviour.general_appearance?.split(',') || [],
          attitude: fetchedData.appearance_behaviour.attitude?.split(',') || [],
          comprehension: fetchedData.appearance_behaviour.comprehension?.split(',') || [],
          gait_posture: fetchedData.appearance_behaviour.gait_posture?.split(',') || [],
          motor_activity: fetchedData.appearance_behaviour.motor_activity?.split(',') || [],
          catatonic_sign: fetchedData.appearance_behaviour.catatonic_sign?.split(',') || [],
          conversion_dissociative: fetchedData.appearance_behaviour.conversion_dissociative?.split(',') || [],
          social_manner: fetchedData.appearance_behaviour.social_manner?.split(',') || [],
          rapport: fetchedData.appearance_behaviour.rapport?.split(',') || [],
          hallucinatory_behaviour: fetchedData.appearance_behaviour.hallucinatory_behaviour?.split(',') || [],
        });
      }

      if (fetchedData.speech) {
        setSpeechFormData({
          ...fetchedData.speech,
          rate_quantity: fetchedData.speech.rate_quantity?.split(',') || [],
          volume_tone: fetchedData.speech.volume_tone?.split(',') || [],
          flow_rhythm: fetchedData.speech.flow_rhythm?.split(',') || [],
        });
      }

      if (fetchedData.mood_affect) {
        setMoodFormData({
          ...fetchedData.mood_affect,
          mood_description: fetchedData.mood_affect.mood_description?.split(',') || [],
          appearance: fetchedData.mood_affect.appearance,
          resident_feeling: fetchedData.mood_affect.resident_feeling,
          general_feeling: fetchedData.mood_affect.general_feeling,
          mood_like: fetchedData.mood_affect.mood_like,
          resident_general_feeling: fetchedData.mood_affect.resident_general_feeling,
          resident_look: fetchedData.mood_affect.resident_look?.split(',') || [],
        });
      }

      if (fetchedData.though) {
        setThoughFormData({
          ...fetchedData.though,
          stream_form_though: fetchedData.though.stream_form_though?.split(',') || [],
          content_though: fetchedData.though.content_though?.split(',') || []
        });
      }

      if (fetchedData.perceiption) {
        setPerceptionData({
          ...fetchedData.perceiption,
          hallucination_type: fetchedData.perceiption.hallucination_type?.split(',') || [],
          heard: fetchedData.perceiption.heard,
          voices_heard: fetchedData.perceiption.voices_heard,
          female_male_voices: fetchedData.perceiption.female_male_voices,
          interpreted_person: fetchedData.perceiption.interpreted_person,
          illusion: fetchedData.perceiption.illusion?.split(',') || [],
          perception_changes: fetchedData.perceiption.perception_changes?.split(',') || [],
          somatic: fetchedData.perceiption.somatic?.split(',') || [],
          others: fetchedData.perceiption.others?.split(',') || [],
        });
      }

      if (fetchedData.conginition) {
        setCognitionData({
          ...fetchedData.conginition,
          consciousness: fetchedData.conginition.consciousness?.split(',') || [],
          orientation_time: fetchedData.conginition.orientation_time,
          orientation_place: fetchedData.conginition.orientation_place,
          orientation_person: fetchedData.conginition.orientation_person,
          distractibility: fetchedData.conginition.distractibility,
          asking_test: fetchedData.conginition.asking_test,
          names_months: fetchedData.conginition.names_months,
          test_performance: fetchedData.conginition.test_performance,
          immediate_retention: fetchedData.conginition.immediate_retention,
          recall: fetchedData.conginition.recall,
          patient_place: fetchedData.conginition.patient_place,
          dinner_ate: fetchedData.conginition.dinner_ate,
          date_ofMrg: fetchedData.conginition.date_ofMrg,
          birthdays_children: fetchedData.conginition.birthdays_children,
          person_past: fetchedData.conginition.person_past,
          amnesia: fetchedData.conginition.amnesia,
          live_growing: fetchedData.conginition.live_growing,
          person_school: fetchedData.conginition.person_school,
          breakfast_ques: fetchedData.conginition.breakfast_ques,
          do_yesterday: fetchedData.conginition.do_yesterday,
          general_info: fetchedData.conginition.general_info,
          test_red_wri: fetchedData.conginition.test_red_wri,
          calculation_test: fetchedData.conginition.calculation_test,
          proverb_testing: fetchedData.conginition.proverb_testing,
          familiar_object: fetchedData.conginition.familiar_object,
        });
      }

      if (fetchedData.judgement) {
        setJudgementFormData({
          ...fetchedData.judgement,
          personal_judgement: fetchedData.judgement.personal_judgement,
          social_judgement: fetchedData.judgement.social_judgement,
          test_judgement: fetchedData.judgement.test_judgement,
          judgement: fetchedData.judgement.judgement
        });
      }

      if (fetchedData.insight) {
        setInsightData({
          ...fetchedData.insight,
          denail_illness: fetchedData.insight.denail_illness,
          slight_awareness: fetchedData.insight.slight_awareness,
          awarness_sick: fetchedData.insight.awarness_sick,
          awarness_illness: fetchedData.insight.awarness_illness,
          intellectual_insight: fetchedData.insight.intellectual_insight,
          true_emotion: fetchedData.insight.true_emotion,
        });
      }

      // ✅ Now trigger PDF generation
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

  const handleShow = async () => {
    console.log("hi");
    if (!formData.admission_no.trim()) {
      alert("Please enter admission number.");
      return;
    }
    console.log(formData.admission_no);

    try {
      const response = await apiRoute.get(`/recovery/getappearance/${formData.admission_no}`);
      const data = response.data;

      console.log(response.data);

      setFormData(prev => ({
        ...prev,
        admission_no: data.admission_no || '',
        date: data.date || '',
        general_appearance: data.general_appearance?.split(',').map(i => i.trim()) || [],
        attitude: data.attitude?.split(',').map(i => i.trim()) || [],
        comprehension: data.comprehension?.split(',').map(i => i.trim()) || [],
        gait_posture: data.gait_posture?.split(',').map(i => i.trim()) || [],
        motor_activity: data.motor_activity?.split(',').map(i => i.trim()) || [],
        catatonic_sign: data.catatonic_sign?.split(',').map(i => i.trim()) || [],
        conversion_dissociative: data.conversion_dissociative?.split(',').map(i => i.trim()) || [],
        social_manner: data.social_manner?.split(',').map(i => i.trim()) || [],
        rapport: data.rapport?.split(',').map(i => i.trim()) || [],
        hallucinatory_behaviour: data.hallucinatory_behaviour?.split(',').map(i => i.trim()) || [],
      }));


      setShow(true);
    } catch (error) {
      console.error("Error fetching form data:", error);
      alert("Admission Number not found");
    }
  };

  const handleSpeechShow = async () => {
    if (!formData.admission_no.trim()) {
      alert("Please enter admission number.");
      return;
    }
    console.log(formData.admission_no);

    try {
      const response = await apiRoute.get(`/recovery/getSpeech/${formData.admission_no}`);
      const data = response.data;

      console.log(response.data);

      setSpeechFormData(prev => ({
        ...prev,
        admission_no: data.admission_no || '',
        date: data.date || '',
        rate_quantity: data.rate_quantity?.split(',').map(i => i.trim()) || [],
        volume_tone: data.volume_tone?.split(',').map(i => i.trim()) || [],
        flow_rhythm: data.flow_rhythm?.split(',').map(i => i.trim()) || [],
      }));

      setspeechShow(true);
    } catch (error) {
      console.error("Error fetching form data:", error);
      alert("Admission Number not found");
    }
  };

  const handleMoodShow = async () => {
    if (!formData.admission_no.trim()) {
      alert("Please enter admission number.");
      return;
    }
    console.log(formData.admission_no);

    try {
      const response = await apiRoute.get(`/recovery/getMood/${formData.admission_no}`);
      const data = response.data;

      console.log(response.data);

      setMoodFormData(prev => ({
        ...prev,
        admission_no: data.admission_no || '',
        date: data.date || '',
        mood_description: data.mood_description?.split(',').map(i => i.trim()) || [],
        appearance: data.appearance,
        resident_feeling: data.resident_feeling,
        general_feeling: data.general_feeling,
        mood_like: data.mood_like,
        resident_general_feeling: data.resident_general_feeling,
        resident_look: data.resident_look?.split(',').map(i => i.trim()) || []
      }));

      setMoodShow(true);
    } catch (error) {
      console.error("Error fetching form data:", error);
      alert("Admission Number not found");
    }
  }

  const handleThoughShow = async () => {
    if (!formData.admission_no.trim()) {
      alert("Please enter admission number.");
      return;
    }
    console.log(formData.admission_no);

    try {
      const response = await apiRoute.get(`/recovery/getThough/${formData.admission_no}`);
      const data = response.data;

      console.log(response.data);

      setThoughFormData(prev => ({
        ...prev,
        admission_no: data.admission_no || '',
        date: data.date || '',
        stream_form_though: data.stream_form_though?.split(',').map(i => i.trim()) || [],
        content_though: data.content_though?.split(',').map(i => i.trim()) || []
      }));

      setThoughShow(true);
    } catch (error) {
      console.error("Error fetching form data:", error);
      alert("Admission Number not found");
    }
  }

  const handlePerceptionShow = async () => {
    if (!formData.admission_no.trim()) {
      alert("Please enter admission number.");
      return;
    }
    console.log(formData.admission_no);

    try {
      const response = await apiRoute.get(`/recovery/getPerception/${formData.admission_no}`);
      const data = response.data;

      console.log(response.data);

      setPerceptionData(prev => ({
        ...prev,
        admission_no: data.admission_no || '',
        date: data.date || '',
        hallucination_type: data.hallucination_type?.split(',').map(i => i.trim()) || [],
        heard: data.heard || '',
        voices_heard: data.voices_heard || '',
        part_of_day: data.part_of_day || '',
        female_male_voices: data.female_male_voices || '',
        interpreted_person: data.interpreted_person || '',
        illusion: data.illusion?.split(',').map(i => i.trim()) || [],
        perception_changes: data.perception_changes?.split(',').map(i => i.trim()) || [],
        somatic: data.somatic?.split(',').map(i => i.trim()) || [],
        others: data.others?.split(',').map(i => i.trim()) || [],
      }));

      setPerceptionShow(true);
    } catch (error) {
      console.error("Error fetching form data:", error);
      alert("Admission Number not found");
    }
  }

  const handleCognitionShow = async () => {
    if (!formData.admission_no.trim()) {
      alert("Please enter admission number.");
      return;
    }
    console.log(formData.admission_no);

    try {
      const response = await apiRoute.get(`/recovery/getCognition/${formData.admission_no}`);
      const data = response.data;

      console.log(response.data);

      setCognitionData(prev => ({
        ...prev,
        admission_no: data.admission_no || '',
        date: data.date || '',
        consciousness: data.consciousness?.split(',').map(i => i.trim()) || [],
        orientation_time: data.orientation_time || '',
        orientation_place: data.orientation_place || '',
        orientation_person: data.orientation_person || '',
        consciousnessState: data.consciousnessState || '',
        canConcentrate: data.canConcentrate || '',
        distractibility: data.distractibility || '',
        asking_test: data.asking_test || '',
        names_months: data.names_months || '',
        test_performance: data.test_performance || '',
        immediate_retention: data.immediate_retention || '',
        recall: data.recall || '',
        patient_place: data.patient_place || '',
        dinner_ate: data.dinner_ate || '',
        date_ofMrg: data.date_ofMrg || '',
        birthdays_children: data.birthdays_children || '',
        person_past: data.person_past || '',
        amnesia: data.amnesia || '',
        live_growing: data.live_growing || '',
        person_school: data.person_school || '',
        breakfast_ques: data.breakfast_ques || '',
        do_yesterday: data.do_yesterday || '',
        general_info: data.general_info || '',
        test_red_wri: data.test_red_wri || '',
        calculation_test: data.calculation_test || '',
        proverb_testing: data.proverb_testing || '',
        familiar_object: data.familiar_object || ''
      }));

      setCognitionShow(true);
    } catch (error) {
      console.error("Error fetching form data:", error);
      alert("Admission Number not found");
    }
  }

  const handleJudgementShow = async () => {
    if (!formData.admission_no.trim()) {
      alert("Please enter admission number.");
      return;
    }
    console.log(formData.admission_no);

    try {
      const response = await apiRoute.get(`/recovery/getJudgement/${formData.admission_no}`);
      const data = response.data;

      console.log(response.data);

      setJudgementFormData(prev => ({
        ...prev,
        admission_no: data.admission_no || '',
        date: data.date || '',
        personal_judgement: data.personal_judgement || '',
        social_judgement: data.social_judgement || '',
        test_judgement: data.test_judgement || '',
        judgement: data.judgement || '',
      }));

      setJudgementShow(true);
    } catch (error) {
      console.error("Error fetching form data:", error);
      alert("Admission Number not found");
    }
  }

  const handleInsightShow = async () => {
    if (!formData.admission_no.trim()) {
      alert("Please enter admission number.");
      return;
    }
    console.log(formData.admission_no);

    try {
      const response = await apiRoute.get(`/recovery/getInsight/${formData.admission_no}`);
      const data = response.data;

      console.log(response.data);

      setInsightData(prev => ({
        ...prev,
        admission_no: data.admission_no || '',
        date: data.date || '',
        denail_illness: data.denail_illness || '',
        slight_awareness: data.slight_awareness || '',
        awarness_sick: data.awarness_sick || '',
        awarness_illness: data.awarness_illness || '',
        intellectual_insight: data.intellectual_insight || '',
        true_emotion: data.true_emotion || ''
      }));

      setInsightShow(true);
    } catch (error) {
      console.error("Error fetching form data:", error);
      alert("Admission Number not found");
    }
  }

  const handleUpdate = async (e, admission_no) => {
    e.preventDefault();

    try {
      const res = await apiRoute.post(`/recovery/updateAppearance/${formData.admission_no}`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      alert('General Appearance Form updated successfully!');
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert('Update failed.');
    }
  };

  const handleSpeechUpdate = async (e, admission_no) => {
    e.preventDefault();

    try {
      const res = await apiRoute.post(`/recovery/updateSpeech/${speechFormData.admission_no}`, speechFormData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      alert('Speech Form updated successfully!');
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert('Update failed.');
    }
  };

  const handleMoodUpdate = async (e, admission_no) => {
    e.preventDefault();

    try {
      const res = await apiRoute.post(`/recovery/updateMood/${moodFormData.admission_no}`, moodFormData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      alert('Mood and Affect Form updated successfully!');
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert('Update failed.');
    }
  };

  const handleThoughUpdate = async (e, admission_no) => {
    e.preventDefault();

    try {
      const res = await apiRoute.post(`/recovery/updateThough/${thoughFormData.admission_no}`, thoughFormData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      alert('Though Form updated successfully!');
      
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert('Update failed.');
    }
  };

  const handlePerceptionUpdate = async (e, admission_no) => {
    e.preventDefault();

    try {
      const res = await apiRoute.post(`/recovery/updatePerception/${perceptionData.admission_no}`, perceptionData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      alert('Perception Form updated successfully!');
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert('Update failed.');
    }
  };

  const handleJudgementUpdate = async (e, admission_no) => {
    e.preventDefault();

    try {
      const res = await apiRoute.post(`/recovery/updateJudgement/${judgementData.admission_no}`, judgementData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      alert('Judgement Form updated successfully!');
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert('Update failed.');
    }
  };

  const handleInsightUpdate = async (e, admission_no) => {
    e.preventDefault();

    try {
      const res = await apiRoute.post(`/recovery/updateInsight/${insightData.admission_no}`, insightData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      alert('Insight Form updated successfully!');
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert('Update failed.');
    }
  };

  const handleCognitionUpdate = async (e, admission_no) => {
    e.preventDefault();

    try {
      const res = await apiRoute.post(`/recovery/updateCognition/${cognitionData.admission_no}`, cognitionData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      alert('Cognition Form updated successfully!');
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert('Update failed.');
    }
  };


  return (
    <>
      <div className="d-xl-flex align-items-center flex-wrap flex-md-nowrap text-start py-2">
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

        {/* {error && <div className="text-danger mb-2">{error}</div>}
        <Col md={1} className="d-flex align-items-center flex-column justify-content-end">
          {rescue_image ? (
            <>
              <img
                src={rescue_image}
                alt="Admission"
                className="img-fluid rounded"
                style={{ width: "100px", height: "100px" }}
              />
              <p className="mt-2 text-start">{rescue_name || "No name available"}</p>
            </>
          ) : (
            <p>{error || "No image to display"}</p>
          )}
        </Col> */}


      </div>

      <Container>
        <Row>

          <Col md={12}>
            <Row>
              <Col md="9">
                <div className="d-flex align-items-center px-3 mse_search">

                  <Form className="navbar-search col-md-8">
                    <Form.Group id="topbarSearch" className="d-flex align-items-center">
                      <Col md={5}>
                        <Form.Label>Admission Number:</Form.Label>
                      </Col>
                      <Col md={4}>
                        <InputGroup className="input-group-merge search-bar">
                          <Form.Control
                            type="text"
                            value={formData.admission_no}
                            onChange={(e) => {
                              setFormData((prev) => ({
                                ...prev,
                                admission_no: e.target.value
                              }));
                            }}
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

                  <Form className="navbar-search col-md-6">
                    <Form.Group id="topbarSearch" className="d-flex align-items-center">
                      <Col md={3}>
                        <Form.Label>Date:</Form.Label>
                      </Col>
                      <Col md={5}>
                        <InputGroup className="input-group-merge search-bar">
                          <Form.Control
                            type="date"
                            value={date}
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
              <div className="pcss3t pcss3t-effect-scale pcss3t-theme-1">
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
                      {userType === "4" && (
                      <button type="button" className="btn btn-success mx-3" onClick={handleShow}>
                        <FontAwesomeIcon icon={faEdit} className="me-0" /></button>
                      )}
                    </div>

                    <ul>
                      <Form onSubmit={handleSubmit}>
                        {/* General Appearance */}
                        <Form.Group controlId="general_appearance" className="icon-li" required>
                          <h4>General Appearance:</h4>
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
                            ].map(([id, label]) => renderCheckbox("general_appearance", id, label))}
                          </div>
                        </Form.Group>

                        {/* Attitude */}
                        <Form.Group controlId="attitude" className="icon-li" required>
                          <h4>Attitude towards the examiner:</h4>
                          <div className="d-flex flex-wrap gap-3 mt-2">
                            {[
                              ["cooperation", "Cooperation"],
                              ["guardedness", "Guardedness"],
                              ["evasiveness", "Evasiveness"],
                              ["hostility", "Hostility"],
                              ["attentiveness", "Attentiveness"],
                              ["Shows Interest", "Shows Interest"],
                              ["Lacks Interest", "Lacks Interest"],
                            ].map(([id, label]) => renderCheckbox("attitude", id, label))}
                          </div>
                        </Form.Group>

                        {/* Comprehension */}
                        <Form.Group controlId="comprehension" className="icon-li" required>
                          <h4>Comprehension:</h4>
                          <div className="d-flex flex-wrap gap-3 mt-2">
                            {[
                              ["intact", "Intact"],
                              ["partially-impaired", "Partially Impaired"],
                              ["fully-impaired", "Fully Impaired"],
                            ].map(([id, label]) => renderCheckbox("comprehension", id, label))}
                          </div>
                        </Form.Group>

                        {/* Gait and Posture */}
                        <Form.Group controlId="gait_posture" className="icon-li" required>
                          <h4>Gait and posture:</h4>
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
                            ].map(([id, label]) => renderCheckbox("gait_posture", id, label))}
                          </div>
                        </Form.Group>

                        {/* Motor Activity */}
                        <Form.Group controlId="motor_activity" className="icon-li" required>
                          <h4>Motor activity:</h4>
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
                            ].map(([id, label]) => renderCheckbox("motor_activity", id, label))}
                          </div>
                        </Form.Group>

                        {/* Catatonic Signs */}
                        <Form.Group controlId="catatonic_sign" className="icon-li" required>
                          <h4>Catatonic signs:</h4>
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
                            ].map(([id, label]) => renderCheckbox("catatonic_sign", id, label))}
                          </div>
                        </Form.Group>

                        {/* Conversion and Dissociative Signs */}
                        <Form.Group controlId="conversion_dissociative" className="icon-li" required>
                          <h4>Conversion and dissociative signs:</h4>
                          <div className="d-flex flex-wrap gap-3 mt-2">
                            {[
                              ["pseudo seizures", "Pseudo Seizures"],
                              ["possession states", "possession States"],
                            ].map(([id, label]) => renderCheckbox("conversion_dissociative", id, label))}
                          </div>
                        </Form.Group>

                        {/* Social Manner */}
                        <Form.Group controlId="social_manner" className="icon-li" required>
                          <h4>Social manner:</h4>
                          <div className="d-flex flex-wrap gap-3 mt-2">
                            {[
                              ["social-increased", "Increased"],
                              ["social-decreased", "Decreased"],
                              ["inappropriate", "Inappropriate"],
                            ].map(([id, label]) => renderCheckbox("social_manner", id, label))}
                          </div>
                        </Form.Group>

                        {/* Rapport */}
                        <Form.Group controlId="rapport" className="icon-li" required>
                          <h4>Rapport:</h4>
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
                          <h4>Hallucinatory behaviour:</h4>
                          <div className="d-flex flex-wrap gap-3 mt-2">
                            {[
                              ["Smiling without reason", "Smiling without reason"],
                              ["Crying without reason", "Crying without reason"],
                              ["Muttering to self", "Muttering to self"],
                              ["Talking to self audibly", "Talking to self audibly"],
                              ["Engages in non-social speech", "Engages in non-social speech"],
                              ["Odd gesturing in response to auditory", "Odd gesturing in response to auditory"],
                              ["visual hallucinations", "Visual Hallucinations"],
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
                      {userType === "4" && (
                      <button type="button" className="btn btn-success mx-3" onClick={handleSpeechShow}>
                        <FontAwesomeIcon icon={faEdit} className="me-0" /></button>
                      )}
                    </div>

                    <ul>
                      <Form onSubmit={handleSpeechSubmit}>
                        <li className="icon-li">
                          <h4 style={{ display: "inline" }}>Rate and quantity of speech:</h4>
                          <div className="d-flex flex-wrap gap-3 mt-2">
                            {[
                              ["present", "Speech is present"],
                              ["absent", "Speech is Absent"],
                              ["spontaneous", "If present, whether it is spontaneous"],
                              ["productivity_increase", "Productivity is increased"],
                              ["productivity_decreased", "Productivity is Decreased"],
                              ["rapid", "Rate is rapid"],
                              ["slow", "Rate is slow"],
                              ["pressure_of_speech", "Pressure of speech"],
                              ["poverty_of_speech", "Poverty of Speech"],
                            ].map(([id, label]) => renderspeechCheckbox("rate_quantity", id, label))}
                          </div>
                        </li>

                        <li className="icon-li">
                          <h4 style={{ display: "inline" }}>Volume and tone of speech:</h4>
                          <div className="d-flex flex-wrap gap-3 mt-2">
                            {[
                              ["volume_increase", "Increased"],
                              ["volume_decrease", "Decreased"],
                            ].map(([id, label]) => renderspeechCheckbox("volume_tone", id, label))}
                          </div>
                        </li>

                        <li className="icon-li">
                          <h4 style={{ display: "inline" }}>Flow and rhythm of speech:</h4>
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
                      {userType === "4" && (
                      <button type="button" className="btn btn-success mx-3" onClick={handleMoodShow}>
                        <FontAwesomeIcon icon={faEdit} className="me-0" /></button>
                      )}
                    </div>

                    <ul>
                      <Form onSubmit={handleMoodAffectSubmit}>
                        <li className="icon-li">
                          <h4 style={{ display: "inline" }}>Mood Described as:</h4>
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
                              ["Silly", "Silly"]
                            ].map(([id, label]) => rendermoodCheckbox("mood_description", id, label))}
                          </div>
                        </li>
                        <li className="icon-li">
                          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>How do they appear to you?</Form.Label>
                            <Form.Control as="textarea" rows={2}
                              name='appearance'
                              value={moodFormData.appearance}
                              onChange={handleInputChange} />
                          </Form.Group>
                        </li>

                        <li className="icon-li">
                          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Ask the Resident directly how he/she feels</Form.Label>
                            <Form.Control as="textarea" rows={2}
                              name='resident_feeling'
                              value={moodFormData.resident_feeling}
                              onChange={handleInputChange} />
                          </Form.Group>
                        </li>

                        <h4 style={{ display: "inline" }}>Question to ask about Mood:</h4>
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
                            <Form.Label>What's your mood like?</Form.Label>
                            <Form.Control as="textarea" rows={2}
                              name='mood_like'
                              value={moodFormData.mood_like}
                              onChange={handleInputChange} />
                          </Form.Group>
                        </li>

                        <li className="icon-li">
                          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>How would you say you feel generally - happy, sad, frightened, angry ?</Form.Label>
                            <Form.Control as="textarea" rows={2}
                              name='resident_general_feeling'
                              value={moodFormData.resident_general_feeling}
                              onChange={handleInputChange} />
                          </Form.Group>
                        </li>

                        <li className="icon-li">
                          <h4 style={{ display: "inline" }}>Resident's Looks like:</h4>
                          <div className="d-flex flex-wrap gap-3 mt-2">
                            {[
                              ["depressed mood", "Depressed Mood"],
                              ["irritable mood", "Irritable Mood"],
                              ["blut affect", "Blunt Affect"],
                              ["flat affect", "Flat Affect"],
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
                      {userType === "4" && (
                      <button type="button" className="btn btn-success mx-3" onClick={handleThoughShow}>
                        <FontAwesomeIcon icon={faEdit} className="me-0" /></button>
                      )}
                    </div>

                    <Form onSubmit={handlethoughSubmit}>
                      <ul>
                        <li className='icon-li'>
                          <h4 style={{ display: "inline" }}>Stream and form of thought:</h4>
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
                              ["verbigeration is noted", "Verbigeration is noted"]
                            ].map(([id, label]) => renderthoughCheckbox("stream_form_though", id, label))}
                          </div>

                        </li>

                        <li className='icon-li'>
                          <h4 style={{ display: "inline" }}>Content of thought:</h4>
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
                              ["Neologisms", "Neologisms"]
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
                      {userType === "4" && (
                      <button type="button" className="btn btn-success mx-3" onClick={handlePerceptionShow}>
                        <FontAwesomeIcon icon={faEdit} className="me-0" /></button>
                      )}
                    </div>
                    <Form onSubmit={handlePerceptionSubmit}>
                      <ul>
                        <li className='icon-li'>
                          <h4 style={{ display: "inline" }}>Hallucinations:</h4>
                          <div className="d-flex flex-wrap gap-3 mt-2">
                            {[
                              ["auditory", "Auditory"],
                              ["visual", "Visual"],
                              ["olfactory", "Olfactory"],
                              ["gustatory", "Gustatory"],
                              ["tactile", "Tactile"],
                            ].map(([id, label]) => renderhallucinationCheck("hallucination_type", id, label))}
                          </div>

                          <div className='d-flex flex-wrap gap-3 mt-2'>
                            <Col md={4}>
                              <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                <Form.Label>What was heard?</Form.Label>
                                <Form.Control as="textarea" rows={2}
                                  name='heard'
                                  value={perceptionData.heard}
                                  onChange={handleInputChange3} />
                              </Form.Group>
                              <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                <Form.Label>How many voices were heard?</Form.Label>
                                <Form.Control as="textarea" rows={2}
                                  name='voices_heard'
                                  value={perceptionData.voices_heard}
                                  onChange={handleInputChange3} />
                              </Form.Group>
                            </Col>
                            <Col md={4}>

                              <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                <Form.Label>in which part of the day?</Form.Label>
                                <Form.Control as="textarea" rows={2}
                                  name='part_of_day'
                                  value={perceptionData.part_of_day}
                                  onChange={handleInputChange3} />
                              </Form.Group>
                              <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                <Form.Label>Male or Female voices?</Form.Label>
                                <Form.Control as="textarea" rows={2}
                                  name='female_male_voices'
                                  value={perceptionData.female_male_voices}
                                  onChange={handleInputChange3} />
                              </Form.Group>
                            </Col>

                            <Col md={4}>

                              <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                <Form.Label>How interpreted and whether second person or third person hallucinations? (i.e., whether the voices are addressing the patient or are discussing him in third person)</Form.Label>
                                <Form.Control as="textarea" rows={2}
                                  name='interpreted_person'
                                  value={perceptionData.interpreted_person}
                                  onChange={handleInputChange3} />
                              </Form.Group>
                            </Col>


                          </div>
                        </li>

                        <li className='icon-li'>
                          <h4 style={{ display: "inline" }}>Illusions and misinterpretations:</h4>
                          <div className="d-flex flex-wrap gap-3 mt-2">
                            {[
                              ["Illusions_visual", "Visual"],
                              ["Illusions_auditory", "Auditory"],
                              ["other_sensory_fields", "Other Sensory Fields"],
                              ["clearConsciousness", "Occur in clear consciousness"],
                              ["unclearConsciousness", "Occur in unclear consciousness"],
                            ].map(([id, label]) => renderillusion("illusion", id, label))}
                          </div>



                        </li>

                        <li className='icon-li'>
                          <h4 style={{ display: "inline" }}>Perception Changes :</h4>
                          <div className="d-flex flex-wrap gap-3 mt-2">
                            {[
                              ["Depersonalization", "Depersonalization"],
                              ["derealization", "derealization"],
                            ].map(([id, label]) => renderPerceptionChanges("perception_changes", id, label))}
                          </div>
                        </li>

                        <li className='icon-li'>
                          <h4 style={{ display: "inline" }}>Somatic passivity phenomenon :</h4>
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
                      {userType === "4" && (
                      <button type="button" className="btn btn-success mx-3" onClick={handleCognitionShow}>
                        <FontAwesomeIcon icon={faEdit} className="me-0" /></button>
                      )}
                    </div>

                    <Form onSubmit={handleCognitionSubmit}>
                      <ul>
                        <li className='icon-li'>
                          <h4 style={{ display: "inline" }}>Consciousness:</h4>
                          <div className="d-flex flex-wrap gap-3 mt-2">
                            {[
                              ["Conscious", "Conscious"],
                              ["Confusion", "Confusion"],
                              ["Clouding", "Clouding"],
                              ["Delirium", "Delirium"],
                              ["stupor", "Stupor"],
                              ["coma", "Coma"],
                            ].map(([id, label]) => renderConginationCheck("consciousness", id, label))}
                            <p className="w-100 mt-2">Any disturbance of consciousness should be rated on Glasgow Coma Scale.</p>
                          </div>
                        </li>

                        <li className='icon-li'>
                          <h4 style={{ display: "inline" }}>Orientation:</h4>
                          <div className="d-flex flex-wrap gap-3 mt-2">
                            <label>Oriented to Time:</label>
                            <select id="orientation_time" name="orientation_time" className="form-control" required
                              value={cognitionData.orientation_time}
                              onChange={handleChange1}>
                              <option value="">-- Select --</option>
                              <option value="yes">Yes (knows time, date, season, etc.)</option>
                              <option value="no">No</option>
                            </select>

                            <label>Oriented to Place:</label>
                            <select id="orientation_place" name="orientation_place" className="form-control" required
                              value={cognitionData.orientation_place}
                              onChange={handleChange1}>
                              <option value="">-- Select --</option>
                              <option value="yes">Yes (knows location, residence)</option>
                              <option value="no">No</option>
                            </select>

                            <label>Oriented to Person:</label>
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
                          <p>Is the attention easily aroused and sustained. Ask the patient to repeat digits forwards backwards.</p>
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
                            <Form.Label>1. Can the patient concentrate?</Form.Label>
                            <Form.Check type="radio" label="Yes" name="canConcentrate" value="Yes" checked={canConcentrate === 'Yes'}
                              onChange={handleRadioChange} />
                            <Form.Check type="radio" label="No" name="canConcentrate" value="No"
                              checked={canConcentrate === 'No'}
                              onChange={handleRadioChange} />
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>2. Ease of distractibility</Form.Label>
                            <Form.Control as="textarea" rows={2}
                              placeholder="Describe how easily the Resident's is distracted"
                              name='distractibility'
                              value={cognitionData.distractibility}
                              onChange={handleInputChange4} />
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>3. Ask to subtract serial sevens from hundred (100-7 test), or serial threes from forty (40-3 test), or to count backwards from 20</Form.Label>
                            <Form.Control as="textarea" rows={2}
                              placeholder="Describe the resident's response."
                              name='asking_test'
                              value={cognitionData.asking_test}
                              onChange={handleInputChange4} />
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>4. Enumerate the names of the months (or days of the week) in the reverse order.</Form.Label>
                            <Form.Control as="textarea" rows={2}
                              placeholder="Describe or write the resident's response here"
                              name="names_months"
                              value={cognitionData.names_months}
                              onChange={handleInputChange4} />
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>5. Note down the answers and the time take perform the tests.</Form.Label>
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
                            <Form.Label>Immediate Retention (IR)</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={2}
                              name="immediate_retention"
                              value={cognitionData.immediate_retention}
                              onChange={handleInputChange4}
                            />
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>Recall (R) after a delay</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={2}
                              name="recall"
                              value={cognitionData.recall}
                              onChange={handleInputChange4}
                            />
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>How did the patient come to the room/hospital ?</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={2}
                              name="patient_place"
                              value={cognitionData.patient_place}
                              onChange={handleInputChange4}
                            />
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>What he ate for dinner the day before or for breakfast the same morning ?</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={2}
                              name="dinner_ate"
                              value={cognitionData.dinner_ate}
                              onChange={handleInputChange4}
                            />
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>Ask for the date of marriage</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={2}
                              name="date_ofMrg"
                              value={cognitionData.date_ofMrg}
                              onChange={handleInputChange4}
                            />
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>Name and birthdays of children</Form.Label>
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
                            <Form.Label>Note any amnesia (anterograde/retrograde)</Form.Label>
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
                            <Form.Label>Where did you live when you were growing up?</Form.Label>
                            <Form.Control
                              as="textarea"
                              name="live_growing"
                              value={cognitionData.live_growing}
                              onChange={handleInputChange4}
                              rows={2}
                            />
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>What was the name of the school you went to?</Form.Label>
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
                            <Form.Label>What did you have for breakfast?</Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={2}
                              name="breakfast_ques"
                              value={cognitionData.breakfast_ques}
                              onChange={handleInputChange4}
                            />
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>What did you do Yesterday?</Form.Label>
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
                            <Form.Label>Ask questions about general information, keeping in mind the patient's educational and social background, his experiences and interests</Form.Label>
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
                            <Form.Label>Test for reading and writing</Form.Label>
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
                            <Form.Label>Give simple tests of calculation</Form.Label>
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
                            <Form.Label>Proverb testing: Asking the meaning of simple proverbs.</Form.Label>
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
                            <Form.Label>Ask the resident to identify the similarities and differences between familiar objects such as a table and a chair, a banana and an orange, a dog and a lion, and an eye and an ear.</Form.Label>
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
                      {userType === "4" && (
                      <button type="button" className="btn btn-success mx-3" onClick={handleJudgementShow}>
                        <FontAwesomeIcon icon={faEdit} className="me-0" /></button>
                      )}
                    </div>
                    <ul>
                      <Form onSubmit={handleJudgementSubmit}>
                        <li className="icon-li">
                          <h4 style={{ display: "inline" }}>Personal judgement:</h4>
                          <Form.Group className="mb-3">
                            <Form.Control as="textarea" rows={2}
                              name='personal_judgement'
                              value={judgementData.personal_judgement}
                              onChange={handleInputChange1} />
                          </Form.Group>
                        </li>

                        <li className="icon-li">
                          <h4 style={{ display: "inline" }}>Social judgement:</h4>
                          <Form.Group className="mb-3">
                            <Form.Control as="textarea" rows={2}
                              name='social_judgement'
                              value={judgementData.social_judgement}
                              onChange={handleInputChange1}
                            />
                          </Form.Group>
                        </li>

                        <li className="icon-li">
                          <h4 style={{ display: "inline" }}>Test judgement:</h4>
                          <Form.Group className="mb-3">
                            <Form.Label>Please explain what actions you would take in the following situations: a house on fire, a man lying on the road, and a sealed, stamped envelope on the street.</Form.Label>
                            <Form.Control as="textarea" rows={2}
                              name='test_judgement'
                              value={judgementData.test_judgement}
                              onChange={handleInputChange1} />
                          </Form.Group>
                        </li>

                        <li className="icon-li">
                          <h4 style={{ display: "inline" }}>Judgement:</h4>
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
                      {userType === "4" && (
                      <button type="button" className="btn btn-success mx-3" onClick={handleInsightShow}>
                        <FontAwesomeIcon icon={faEdit} className="me-0" /></button>
                      )}
                    </div>
                    <p>The patient's level of awareness and insight into their illness. </p>
                    <ul>
                      <Form onSubmit={handleInsightSubmit}>
                        <li className="icon-li">
                          <h4 style={{ display: "inline" }}>LEVELS OF INSIGHT:</h4>
                          <p>Insight is assessed using a six-point scale ranging from one to six.</p>
                          <Form.Group className="mb-3">
                            <Form.Label>1. Complete denial of illness</Form.Label>
                            <Form.Control as="textarea" rows={2}
                              name='denail_illness'
                              value={insightData.denail_illness}
                              onChange={handleInputChange2} />
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>2. Slight awareness of being sick & needing help but denying it at the same time</Form.Label>
                            <Form.Control as="textarea" rows={2}
                              name='slight_awareness'
                              value={insightData.slight_awareness}
                              onChange={handleInputChange2}
                            />
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>3. Awareness of being sick but blaming it on others, on external factors, or on organic factors.</Form.Label>
                            <Form.Control as="textarea" rows={2}
                              name='awarness_sick'
                              value={insightData.awarness_sick}
                              onChange={handleInputChange2} />
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>4. Awareness that illness is due to something unknown in the patient</Form.Label>
                            <Form.Control as="textarea" rows={2}
                              name='awarness_illness'
                              value={insightData.awarness_illness}
                              onChange={handleInputChange2} />
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>5. Intellectual insight</Form.Label>
                            <Form.Control as="textarea" rows={2}
                              name='intellectual_insight'
                              value={insightData.intellectual_insight}
                              onChange={handleInputChange2} />
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>6. True emotional insight</Form.Label>
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
            <h4 className="text-center">Mental Status Examination (MSE)</h4>
          </Col>
        </Row>

        <ul style={{ listStyleType: "none", textAlign: "start" }}>
          {/* GENERAL APPEARANCE AND BEHAVIOUR START*/}
          <li className="tab-content my-3">
            <h6>1. GENERAL APPEARANCE AND BEHAVIOUR:</h6>
            <ul style={{ listStyleType: "none", textAlign: "start" }}>
              {/* General Appearance */}
              {formData.general_appearance?.length > 0 && (
                <li className='d-flex'>
                  <strong>General Appearance:</strong>
                  <ul className='d-flex' style={{ listStyleType: "none" }}>
                    {formData.general_appearance.map((item, idx) => (
                      <li key={idx}>{item} ,</li>
                    ))}
                  </ul>
                </li>
              )}

              {/* Attitude */}
              {formData.attitude?.length > 0 && (
                <li className='d-flex'>
                  <strong>Attitude towards the examiner:</strong>
                  <ul className='d-flex' style={{ listStyleType: "none" }}>
                    {formData.attitude.map((item, idx) => (
                      <li key={idx}>{item} ,</li>
                    ))}
                  </ul>
                </li>
              )}

              {/* Comprehension */}
              {formData.comprehension && (
                <li className='d-flex'>
                  <strong>Comprehension:</strong>
                  <ul className='d-flex' style={{ listStyleType: "none" }}>
                    {formData.comprehension.map((item, idx) => (
                      <li key={idx}>{item} ,</li>
                    ))}
                  </ul>
                </li>
              )}

              {/* Gait and Posture */}
              {formData.gait_posture?.length > 0 && (
                <li className='d-flex'>
                  <strong>Gait and posture:</strong>
                  <ul className='d-flex' style={{ listStyleType: "none" }}>
                    {formData.gait_posture.map((item, idx) => (
                      <li key={idx}>{item} ,</li>
                    ))}
                  </ul>
                </li>
              )}

              {/* Motor Activity */}
              {formData.motor_activity?.length > 0 && (
                <li className='d-flex'>
                  <strong>Motor activity:</strong>
                  <ul className='d-flex' style={{ listStyleType: "none" }}>
                    {formData.motor_activity.map((item, idx) => (
                      <li key={idx}>{item} ,</li>
                    ))}
                  </ul>
                </li>
              )}

              {/* Catatonic Signs */}
              {formData.catatonic_sign?.length > 0 && (
                <li className='d-flex'>
                  <strong>Catatonic signs:</strong>
                  <ul className='d-flex' style={{ listStyleType: "none" }}>
                    {formData.catatonic_sign.map((item, idx) => (
                      <li key={idx}>{item} ,</li>
                    ))}
                  </ul>
                </li>
              )}

              {/* Conversion and Dissociative Signs */}
              {formData.conversion_dissociative?.length > 0 && (
                <li className='d-flex'>
                  <strong>Conversion and dissociative signs:</strong>
                  <ul className='d-flex' style={{ listStyleType: "none" }}>
                    {formData.conversion_dissociative.map((item, idx) => (
                      <li key={idx}>{item} ,</li>
                    ))}
                  </ul>
                </li>
              )}

              {/* Social Manner */}
              {formData.social_manner?.length > 0 && (
                <li className='d-flex'>
                  <strong>Social manner:</strong>
                  <ul className='d-flex' style={{ listStyleType: "none" }}>
                    {formData.social_manner.map((item, idx) => (
                      <li key={idx}>{item} ,</li>
                    ))}
                  </ul>
                </li>
              )}

              {/* Rapport */}
              {formData.rapport?.length > 0 && (
                <li className='d-flex'>
                  <strong>Rapport:</strong>
                  <ul className='d-flex' style={{ listStyleType: "none" }}>
                    {formData.rapport.map((item, idx) => (
                      <li key={idx}>{item} ,</li>
                    ))}
                  </ul>
                </li>
              )}

              {/* Hallucinatory Behaviour */}
              {formData.hallucinatory_behaviour?.length > 0 && (
                <li className='d-flex'>
                  <strong>Hallucinatory behaviour:</strong>
                  <ul className='d-flex' style={{ listStyleType: "none" }}>
                    {formData.hallucinatory_behaviour.map((item, idx) => (
                      <li key={idx}>{item} ,</li>
                    ))}
                  </ul>
                </li>
              )}
            </ul>
          </li>

          {/* SPEECH START*/}
          <li className="tab-content my-3">
            <h6>2. SPEECH:</h6>
            <ul style={{ listStyleType: "none", textAlign: "start" }}>
              {/* Rate and quantity of speech */}
              {speechFormData.rate_quantity?.length > 0 && (
                <li className='d-flex'>
                  <strong>Rate and quantity of speech:</strong>
                  <ul className='d-flex' style={{ listStyleType: "none" }}>
                    {speechFormData.rate_quantity.map((item, idx) => (
                      <li key={idx}>{item} ,</li>
                    ))}
                  </ul>
                </li>
              )}

              {/* Volume and tone of speech */}
              {speechFormData.volume_tone?.length > 0 && (
                <li className='d-flex'>
                  <strong>Volume and tone of speech:</strong>
                  <ul className='d-flex' style={{ listStyleType: "none" }}>
                    {speechFormData.volume_tone.map((item, idx) => (
                      <li key={idx}>{item} ,</li>
                    ))}
                  </ul>
                </li>
              )}

              {/* Flow and rhythm of speech */}
              {speechFormData.flow_rhythm && (
                <li className='d-flex'>
                  <strong>Flow and rhythm of speech:</strong>
                  <ul className='d-flex' style={{ listStyleType: "none" }}>
                    {speechFormData.flow_rhythm.map((item, idx) => (
                      <li key={idx}>{item} ,</li>
                    ))}
                  </ul>
                </li>
              )}


            </ul>
          </li>

          {/* MOOOD AFFECT START*/}
          <li className="tab-content my-3">
            <h6>3. MOOD AND AFFECT</h6>
            <ul style={{ listStyleType: "none", textAlign: "start" }}>
              {/* Mood Described */}
              {moodFormData.mood_description?.length > 0 && (
                <li className='d-flex'>
                  <strong>Mood Described as:</strong>
                  <ul className='d-flex' style={{ listStyleType: "none" }}>
                    {moodFormData.mood_description.map((item, idx) => (
                      <li key={idx}>{item} ,</li>
                    ))}
                  </ul>
                </li>
              )}

              {/* appearance */}
              {moodFormData.appearance?.length > 0 && (
                <li className='d-flex'>
                  <strong>How do they appear to you?</strong>
                  <p className='mx-3'>{moodFormData.appearance}</p>
                </li>
              )}

              {/* resident_feeling */}
              {moodFormData.resident_feeling && (
                <li className='d-flex'>
                  <strong>Ask the Resident directly how he/she feels :</strong>
                  <p className='mx-3'>{moodFormData.resident_feeling}</p>
                </li>
              )}
              <h6>Question to ask about Mood:</h6>
              {/* general_feeling */}
              {moodFormData.general_feeling && (
                <li className='d-flex'>
                  <strong>How do you generally feel most of the time?</strong>
                  <p className='mx-3'>{moodFormData.general_feeling}</p>
                </li>
              )}

              {/* mood_like */}
              {moodFormData.mood_like && (
                <li className='d-flex'>
                  <strong>What's your mood like?</strong>
                  <p className='mx-3'>{moodFormData.mood_like}</p>
                </li>
              )}

              {/* resident_general_feeling */}
              {moodFormData.resident_general_feeling && (
                <li className='d-flex'>
                  <strong>How would you say you feel generally - happy, sad, frightened, angry ?</strong>
                  <p className='mx-3'>{moodFormData.resident_general_feeling}</p>
                </li>
              )}

              {moodFormData.resident_look?.length > 0 && (
                <li className='d-flex'>
                  <strong>Resident's Looks like:</strong>
                  <ul className='d-flex' style={{ listStyleType: "none" }}>
                    {moodFormData.resident_look.map((item, idx) => (
                      <li key={idx}>{item} ,</li>
                    ))}
                  </ul>
                </li>
              )}

            </ul>
          </li>

          {/* THOUGH START*/}
          <li className="tab-content my-5">
            <h6>4. THOUGHT</h6>
            <ul style={{ listStyleType: "none", textAlign: "start" }}>
              {/* Rate and quantity of speech */}
              {thoughFormData.stream_form_though?.length > 0 && (
                <li className='d-flex'>
                  <strong>Rate and quantity of speech:</strong>
                  <ul style={{ listStyleType: "none" }}>
                    {thoughFormData.stream_form_though.map((item, idx) => (
                      <li key={idx}>{item} ,</li>
                    ))}
                  </ul>
                </li>
              )}

              {/* Volume and tone of speech */}
              {thoughFormData.content_though?.length > 0 && (
                <li className='d-flex'>
                  <strong>Volume and tone of speech:</strong>
                  <ul style={{ listStyleType: "none" }}>
                    {thoughFormData.content_though.map((item, idx) => (
                      <li key={idx}>{item} ,</li>
                    ))}
                  </ul>
                </li>
              )}

            </ul>
          </li>

          {/* PECEIPTION START*/}
          <li className="tab-content mt-5">
            <h6>5. PERCEPTION</h6>
            <ul style={{ listStyleType: "none", textAlign: "start" }}>
              {/* Hallucinations */}
              {perceptionData.hallucination_type?.length > 0 && (
                <li className='d-flex'>
                  <strong>Hallucinations:</strong>
                  <ul style={{ listStyleType: "none" }}>
                    {perceptionData.hallucination_type.map((item, idx) => (
                      <li key={idx}>{item} ,</li>
                    ))}
                  </ul>
                </li>
              )}

              {/* heard */}
              {perceptionData.heard?.length > 0 && (
                <li className='d-flex'>
                  <strong>What was heard?</strong>
                  <p className='mx-3'>{perceptionData.heard}</p>
                </li>
              )}

              {/* voices_heard */}
              {perceptionData.voices_heard?.length > 0 && (
                <li className='d-flex'>
                  <strong>In which part of the day?</strong>
                  <p className='mx-3'>{perceptionData.voices_heard}</p>
                </li>
              )}

              {/* part_of_day */}
              {perceptionData.part_of_day?.length > 0 && (
                <li className='d-flex'>
                  <strong>In which part of the day?</strong>
                  <p className='mx-3'>{perceptionData.part_of_day}</p>
                </li>
              )}

              {/* female_male_voices */}
              {perceptionData.female_male_voices?.length > 0 && (
                <li className='d-flex'>
                  <strong>Male or Female voices?</strong>
                  <p className='mx-3'>{perceptionData.female_male_voices}</p>
                </li>
              )}

              {/* interpreted_person */}
              {perceptionData.interpreted_person?.length > 0 && (
                <li className='d-flex'>
                  <strong>How interpreted and whether second person or third person hallucinations? </strong>
                  <p className='mx-3'>{perceptionData.interpreted_person}</p>
                </li>
              )}

              {/* Illusions and misinterpretations */}
              {perceptionData.illusion?.length > 0 && (
                <li className='d-flex'>
                  <strong>Illusions and misinterpretations:</strong>
                  <ul style={{ listStyleType: "none" }}>
                    {perceptionData.illusion.map((item, idx) => (
                      <li key={idx}>{item} ,</li>
                    ))}
                  </ul>
                </li>
              )}

              {/* Illusions and misinterpretations */}
              {perceptionData.perception_changes?.length > 0 && (
                <li className='d-flex'>
                  <strong>Perception Changes :</strong>
                  <ul style={{ listStyleType: "none" }}>
                    {perceptionData.perception_changes.map((item, idx) => (
                      <li key={idx}>{item} ,</li>
                    ))}
                  </ul>
                </li>
              )}

              {/* somatic */}
              {perceptionData.somatic?.length > 0 && (
                <li className='d-flex'>
                  <strong>Somatic passivity phenomenon :</strong>
                  <ul style={{ listStyleType: "none" }}>
                    {perceptionData.somatic.map((item, idx) => (
                      <li key={idx}>{item} ,</li>
                    ))}
                  </ul>
                </li>
              )}

              {/* others */}
              {perceptionData.others?.length > 0 && (
                <li className='d-flex'>
                  <strong>Others :</strong>
                  <ul style={{ listStyleType: "none" }}>
                    {perceptionData.others.map((item, idx) => (
                      <li key={idx}>{item} ,</li>
                    ))}
                  </ul>
                </li>
              )}

            </ul>
          </li>

          {/* Cognition START*/}
          <li className="tab-content mt-5">
            <h6>6. COGNITION OR NEUROPSYCHIATRIC ASSESSMENT</h6>
            <ul style={{ listStyleType: "none", textAlign: "start" }}>
              {/* Hallucinations */}
              {cognitionData.consciousness?.length > 0 && (
                <li className='d-flex'>
                  <strong>Consciousness:</strong>
                  <ul style={{ listStyleType: "none" }}>
                    {cognitionData.consciousness.map((item, idx) => (
                      <li key={idx}>{item} ,</li>
                    ))}
                  </ul>
                </li>
              )}

              {/* orientation_time */}
              {cognitionData.orientation_time?.length > 0 && (
                <li className='d-flex'>
                  <strong>Oriented to Time:</strong>
                  <p className='mx-3'>{cognitionData.orientation_time}</p>
                </li>
              )}

              {/* orientation_place */}
              {cognitionData.orientation_place?.length > 0 && (
                <li className='d-flex'>
                  <strong>Oriented to Place:</strong>
                  <p className='mx-3'>{cognitionData.orientation_place}</p>
                </li>
              )}

              {/* orientation_person */}
              {cognitionData.orientation_person?.length > 0 && (
                <li className='d-flex'>
                  <strong>Oriented to Person:</strong>
                  <p className='mx-3'>{cognitionData.orientation_person}</p>
                </li>
              )}
              <h6>Concentration</h6>
              {/* distractibility */}
              {cognitionData.distractibility?.length > 0 && (
                <li className='d-flex'>
                  <strong>1. Ease of distractibility:</strong>
                  <p className='mx-3'>{cognitionData.distractibility}</p>
                </li>
              )}

              {/* asking_test */}
              {cognitionData.asking_test?.length > 0 && (
                <li className='d-flex'>
                  <strong>2. Ask to subtract serial sevens from hundred (100-7 test), or serial threes from forty (40-3 test), or to count backwards from 20</strong>
                  <p className='mx-3'>{cognitionData.asking_test}</p>
                </li>
              )}

              {/* names_months */}
              {cognitionData.names_months?.length > 0 && (
                <li className='d-flex'>
                  <strong>3. Enumerate the names of the months (or days of the week) in the reverse order.</strong>
                  <p className='mx-3'>{cognitionData.names_months}</p>
                </li>
              )}

              {/* names_months */}
              {cognitionData.test_performance?.length > 0 && (
                <li className='d-flex'>
                  <strong>4. Note down the answers and the time take perform the tests.</strong>
                  <p className='mx-3'>{cognitionData.test_performance}</p>
                </li>
              )}

              <h6>Memory:</h6>
              {/* immediate_retention */}
              {cognitionData.immediate_retention?.length > 0 && (
                <li className='d-flex'>
                  <strong>Immediate Retention (IR) :</strong>
                  <p className='mx-3'>{cognitionData.immediate_retention}</p>
                </li>
              )}

              {/* recall */}
              {cognitionData.recall?.length > 0 && (
                <li className='d-flex'>
                  <strong>Recall (R) after a delay :</strong>
                  <p className='mx-3'>{cognitionData.recall}</p>
                </li>
              )}

              {/* patient_place */}
              {cognitionData.patient_place?.length > 0 && (
                <li className='d-flex'>
                  <strong>How did the patient come to the room/hospital ?</strong>
                  <p className='mx-3'>{cognitionData.patient_place}</p>
                </li>
              )}

              {/* dinner_ate */}
              {cognitionData.dinner_ate?.length > 0 && (
                <li className='d-flex'>
                  <strong>What he ate for dinner the day before or for breakfast the same morning ?</strong>
                  <p className='mx-3'>{cognitionData.dinner_ate}</p>
                </li>
              )}

              {/* date_ofMrg */}
              {cognitionData.date_ofMrg?.length > 0 && (
                <li className='d-flex'>
                  <strong>Ask for the date of marriage</strong>
                  <p className='mx-3'>{cognitionData.date_ofMrg}</p>
                </li>
              )}

              {/* date_ofMrg */}
              {cognitionData.birthdays_children?.length > 0 && (
                <li className='d-flex'>
                  <strong>Name and birthdays of children</strong>
                  <p className='mx-3'>{cognitionData.birthdays_children}</p>
                </li>
              )}

              {/* person_past */}
              {cognitionData.person_past?.length > 0 && (
                <li className='d-flex'>
                  <strong>Any other relevant questions from the person's past</strong>
                  <p className='mx-3'>{cognitionData.person_past}</p>
                </li>
              )}

              {/* amnesia */}
              {cognitionData.amnesia?.length > 0 && (
                <li className='d-flex'>
                  <strong>Note any amnesia (anterograde/retrograde)</strong>
                  <p className='mx-3'>{cognitionData.amnesia}</p>
                </li>
              )}

              <h6>Question to ask for the Memory</h6>
              <h6>Long-term Memory</h6>
              {/* live_growing */}
              {cognitionData.live_growing?.length > 0 && (
                <li className='d-flex'>
                  <strong>Where did you live when you were growing up?</strong>
                  <p className='mx-3'>{cognitionData.live_growing}</p>
                </li>
              )}

              {/* person_school */}
              {cognitionData.person_school?.length > 0 && (
                <li className='d-flex'>
                  <strong>What was the name of the school you went to?</strong>
                  <p className='mx-3'>{cognitionData.person_school}</p>
                </li>
              )}

              <h6>Short-term Memory</h6>
              {/* breakfast_ques */}
              {cognitionData.breakfast_ques?.length > 0 && (
                <li className='d-flex'>
                  <strong>What did you have for breakfast?</strong>
                  <p className='mx-3'>{cognitionData.breakfast_ques}</p>
                </li>
              )}

              {/* do_yesterday */}
              {cognitionData.do_yesterday?.length > 0 && (
                <li className='d-flex'>
                  <strong>What did you do Yesterday?</strong>
                  <p className='mx-3'>{cognitionData.do_yesterday}</p>
                </li>
              )}

              <h6>Intelligence</h6>
              {/* general_info */}
              {cognitionData.general_info?.length > 0 && (
                <li className='d-flex'>
                  <strong>Ask questions about general information, keeping in mind the patient's educational and social background, his experiences and interests</strong>
                  <p className='mx-3'>{cognitionData.general_info}</p>
                </li>
              )}

              {/* test_red_wri */}
              {cognitionData.test_red_wri?.length > 0 && (
                <li className='d-flex'>
                  <strong>Test for reading and writing</strong>
                  <p className='mx-3'>{cognitionData.test_red_wri}</p>
                </li>
              )}

              {/* calculation_test */}
              {cognitionData.calculation_test?.length > 0 && (
                <li className='d-flex'>
                  <strong>Give simple tests of calculation</strong>
                  <p className='mx-3'>{cognitionData.calculation_test}</p>
                </li>
              )}

              {/* proverb_testing */}
              {cognitionData.proverb_testing?.length > 0 && (
                <li className='d-flex'>
                  <strong>Proverb testing: Asking the meaning of simple proverbs.</strong>
                  <p className='mx-3'>{cognitionData.proverb_testing}</p>
                </li>
              )}

              {/* familiar_object */}
              {cognitionData.familiar_object?.length > 0 && (
                <li className='d-flex'>
                  <strong>Ask the resident to identify the similarities and differences between familiar objects such as a table and a chair, a banana and an orange, a dog and a lion, and an eye and an ear.</strong>
                  <p className='mx-3'>{cognitionData.familiar_object}</p>
                </li>
              )}

            </ul>
          </li>

          {/* JUDGEMENT START*/}
          <li className="tab-content my-5">
            <h6>7. JUDGEMENT</h6>
            <ul style={{ listStyleType: "none", textAlign: "start" }}>
              {/* Personal judgement */}
              {judgementData.personal_judgement?.length > 0 && (
                <li className='d-flex'>
                  <strong>Personal judgement:</strong>
                  <p className='mx-3'>{judgementData.personal_judgement}</p>
                </li>
              )}

              {/* Social judgement */}
              {judgementData.social_judgement?.length > 0 && (
                <li className='d-flex'>
                  <strong>Social judgement:</strong>
                  <p className='mx-3'>{judgementData.social_judgement}</p>
                </li>
              )}

              {/* Test judgment */}
              {judgementData.test_judgement?.length > 0 && (
                <li className='d-flex'>
                  <strong>Test judgement:</strong>
                  <p className='mx-3'>{judgementData.test_judgement}</p>
                </li>
              )}

              {/* Judgment */}
              {judgementData.judgement?.length > 0 && (
                <li className='d-flex'>
                  <strong>Judgement:</strong>
                  <p className='mx-3'>{judgementData.judgement}</p>
                </li>
              )}

            </ul>
          </li>

          {/* INSIGHT START*/}
          <li className="tab-content my-5">
            <h6>8. INSIGHT</h6>
            <ul style={{ listStyleType: "none", textAlign: "start" }}>
              {/* denail_illness */}
              {insightData.denail_illness?.length > 0 && (
                <li className="d-flex flex-column mb-2">
                  <h6><strong>LEVELS OF INSIGHT:</strong></h6>
                  <div className="d-flex">
                    <strong>1. Complete denial of illness:</strong>
                    <p className="mx-2 mb-0">{insightData.denail_illness}</p>
                  </div>
                </li>
              )}

              {/* slight_awareness */}
              {insightData.slight_awareness?.length > 0 && (
                <li className='d-flex'>
                  <strong>2. Slight awareness of being sick & needing help but denying it at the same time : </strong>
                  <p className='mx-3'>{insightData.slight_awareness}</p>
                </li>
              )}

              {/* awarness_sick */}
              {insightData.awarness_sick?.length > 0 && (
                <li className='d-flex'>
                  <strong>3. Awareness of being sick but blaming it on others, on external factors, or on organic factors.</strong>
                  <p className='mx-3'>{insightData.awarness_sick}</p>
                </li>
              )}

              {/* awarness_illness */}
              {insightData.awarness_illness?.length > 0 && (
                <li className='d-flex'>
                  <strong>4. Awareness that illness is due to something unknown in the patient</strong>
                  <p className='mx-3'>{insightData.awarness_illness}</p>
                </li>
              )}

              {/* awarness_illness */}
              {insightData.intellectual_insight?.length > 0 && (
                <li className='d-flex'>
                  <strong>5. Intellectual insight</strong>
                  <p className='mx-3'>{insightData.intellectual_insight}</p>
                </li>
              )}

              {/* true_emotion */}
              {insightData.true_emotion?.length > 0 && (
                <li className='d-flex mt-5'>
                  <strong>6. True emotional insight</strong>
                  <p className='mx-3'>{insightData.true_emotion}</p>
                </li>
              )}


            </ul>
          </li>
        </ul>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit General Appearance and Behaviour </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Col md={12}>
            <Form>
              {/* General Appearance */}
              <Form.Group controlId="general_appearance" className="icon-li" required>
                <h4>General Appearance:</h4>
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
                  ].map(([id, label]) => renderCheckbox("general_appearance", id, label))}
                </div>
              </Form.Group>

              {/* Attitude */}
              <Form.Group controlId="attitude" className="icon-li" required>
                <h4>Attitude towards the examiner:</h4>
                <div className="d-flex flex-wrap gap-3 mt-2">
                  {[
                    ["cooperation", "Cooperation"],
                    ["guardedness", "Guardedness"],
                    ["evasiveness", "Evasiveness"],
                    ["hostility", "Hostility"],
                    ["attentiveness", "Attentiveness"],
                    ["Shows Interest", "Shows Interest"],
                    ["Lacks Interest", "Lacks Interest"],
                  ].map(([id, label]) => renderCheckbox("attitude", id, label))}
                </div>
              </Form.Group>

              {/* Comprehension */}
              <Form.Group controlId="comprehension" className="icon-li" required>
                <h4>Comprehension:</h4>
                <div className="d-flex flex-wrap gap-3 mt-2">
                  {[
                    ["intact", "Intact"],
                    ["partially-impaired", "Partially Impaired"],
                    ["fully-impaired", "Fully Impaired"],
                  ].map(([id, label]) => renderCheckbox("comprehension", id, label))}
                </div>
              </Form.Group>

              {/* Gait and Posture */}
              <Form.Group controlId="gait_posture" className="icon-li" required>
                <h4>Gait and posture:</h4>
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
                  ].map(([id, label]) => renderCheckbox("gait_posture", id, label))}
                </div>
              </Form.Group>

              {/* Motor Activity */}
              <Form.Group controlId="motor_activity" className="icon-li" required>
                <h4>Motor activity:</h4>
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
                  ].map(([id, label]) => renderCheckbox("motor_activity", id, label))}
                </div>
              </Form.Group>

              {/* Catatonic Signs */}
              <Form.Group controlId="catatonic_sign" className="icon-li" required>
                <h4>Catatonic signs:</h4>
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
                  ].map(([id, label]) => renderCheckbox("catatonic_sign", id, label))}
                </div>
              </Form.Group>

              {/* Conversion and Dissociative Signs */}
              <Form.Group controlId="conversion_dissociative" className="icon-li" required>
                <h4>Conversion and dissociative signs:</h4>
                <div className="d-flex flex-wrap gap-3 mt-2">
                  {[
                    ["pseudo seizures", "Pseudo Seizures"],
                    ["possession states", "possession States"],
                  ].map(([id, label]) => renderCheckbox("conversion_dissociative", id, label))}
                </div>
              </Form.Group>

              {/* Social Manner */}
              <Form.Group controlId="social_manner" className="icon-li" required>
                <h4>Social manner:</h4>
                <div className="d-flex flex-wrap gap-3 mt-2">
                  {[
                    ["social-increased", "Increased"],
                    ["social-decreased", "Decreased"],
                    ["inappropriate", "Inappropriate"],
                  ].map(([id, label]) => renderCheckbox("social_manner", id, label))}
                </div>
              </Form.Group>

              {/* Rapport */}
              <Form.Group controlId="rapport" className="icon-li" required>
                <h4>Rapport:</h4>
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
                <h4>Hallucinatory behaviour:</h4>
                <div className="d-flex flex-wrap gap-3 mt-2">
                  {[
                    ["Smiling without reason", "Smiling without reason"],
                    ["Crying without reason", "Crying without reason"],
                    ["Muttering to self", "Muttering to self"],
                    ["Talking to self audibly", "Talking to self audibly"],
                    ["Engages in non-social speech", "Engages in non-social speech"],
                    ["Odd gesturing in response to auditory", "Odd gesturing in response to auditory"],
                    ["visual hallucinations", "Visual Hallucinations"],
                  ].map(([id, label]) => renderCheckbox("hallucinatory_behaviour", id, label))}
                </div>
              </Form.Group>

              <div className="mt-3">
                <Button variant="success" className="m-1" type="submit" onClick={(e) => handleUpdate(e, formData.admission_no)}>Update</Button>
                <Button variant="secondary" className="m-1" onClick={handleClose}>Close</Button>
              </div>
            </Form>
          </Col>
        </Modal.Body>
      </Modal>

      {/* speech modal form */}
      <Modal show={speechshow} onHide={handleSpeechClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Speech </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Col md={12}>
            <Form>
              <li className="icon-li">
                <h4 style={{ display: "inline" }}>Rate and quantity of speech:</h4>
                <div className="d-flex flex-wrap gap-3 mt-2">
                  {[
                    ["present", "Speech is present"],
                    ["absent", "Speech is Absent"],
                    ["spontaneous", "If present, whether it is spontaneous"],
                    ["productivity_increase", "Productivity is increased"],
                    ["productivity_decreased", "Productivity is Decreased"],
                    ["rapid", "Rate is rapid"],
                    ["slow", "Rate is slow"],
                    ["pressure_of_speech", "Pressure of speech"],
                    ["poverty_of_speech", "Poverty of Speech"],
                  ].map(([id, label]) => renderspeechCheckbox("rate_quantity", id, label))}
                </div>
              </li>

              <li className="icon-li">
                <h4 style={{ display: "inline" }}>Volume and tone of speech:</h4>
                <div className="d-flex flex-wrap gap-3 mt-2">
                  {[
                    ["volume_increase", "Increased"],
                    ["volume_decrease", "Decreased"],
                  ].map(([id, label]) => renderspeechCheckbox("volume_tone", id, label))}
                </div>
              </li>

              <li className="icon-li">
                <h4 style={{ display: "inline" }}>Flow and rhythm of speech:</h4>
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
                  ].map(([id, label]) => renderspeechCheckbox("flow_rhythm", id, label))}
                </div>
              </li>

              <div className="mt-3">
                <Button variant="success" className="m-1" type="submit" onClick={(e) => handleSpeechUpdate(e, speechFormData.admission_no)}>Update</Button>
                <Button variant="secondary" className="m-1" onClick={handleSpeechClose}>Close</Button>
              </div>
            </Form>
          </Col>
        </Modal.Body>
      </Modal>

      {/* mood and affect modal form */}
      <Modal show={moodShow} onHide={handleMoodClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Mood and Affect </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Col md={12}>
            <Form>
              <li className="icon-li">
                <h4 style={{ display: "inline" }}>Mood Described as:</h4>
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
                    ["Silly", "Silly"]
                  ].map(([id, label]) => rendermoodCheckbox("mood_description", id, label))}
                </div>
              </li>
              <li className="icon-li">
                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                  <Form.Label>How do they appear to you?</Form.Label>
                  <Form.Control as="textarea" rows={2}
                    name='appearance'
                    value={moodFormData.appearance}
                    onChange={handleInputChange} />
                </Form.Group>
              </li>

              <li className="icon-li">
                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                  <Form.Label>Ask the Resident directly how he/she feels</Form.Label>
                  <Form.Control as="textarea" rows={2}
                    name='resident_feeling'
                    value={moodFormData.resident_feeling}
                    onChange={handleInputChange} />
                </Form.Group>
              </li>

              <h4 style={{ display: "inline" }}>Question to ask about Mood:</h4>
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
                  <Form.Label>What's your mood like?</Form.Label>
                  <Form.Control as="textarea" rows={2}
                    name='mood_like'
                    value={moodFormData.mood_like}
                    onChange={handleInputChange} />
                </Form.Group>
              </li>

              <li className="icon-li">
                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                  <Form.Label>How would you say you feel generally - happy, sad, frightened, angry ?</Form.Label>
                  <Form.Control as="textarea" rows={2}
                    name='resident_general_feeling'
                    value={moodFormData.resident_general_feeling}
                    onChange={handleInputChange} />
                </Form.Group>
              </li>

              <li className="icon-li">
                <h4 style={{ display: "inline" }}>Resident's Looks like:</h4>
                <div className="d-flex flex-wrap gap-3 mt-2">
                  {[
                    ["depressed mood", "Depressed Mood"],
                    ["irritable mood", "Irritable Mood"],
                    ["blut affect", "Blunt Affect"],
                    ["flat affect", "Flat Affect"],
                  ].map(([id, label]) =>
                    rendermoodCheckbox("resident_look", id, label)
                  )}
                </div>

              </li>

              <div className="mt-3">
                <Button variant="success" className="m-1" type="submit" onClick={(e) => handleMoodUpdate(e, moodFormData.admission_no)}>Update</Button>
                <Button variant="secondary" className="m-1" onClick={handleMoodClose}>Close</Button>
              </div>

            </Form>
          </Col>
        </Modal.Body>
      </Modal>

      {/* Though modal form */}
      <Modal show={thoughShow} onHide={handleThoughClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Though Form </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Col md={12}>
            <Form>
              <ul>
                <li className='icon-li'>
                  <h4 style={{ display: "inline" }}>Stream and form of thought:</h4>
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
                      ["verbigeration is noted", "Verbigeration is noted"]
                    ].map(([id, label]) => renderthoughCheckbox("stream_form_though", id, label))}
                  </div>

                </li>

                <li className='icon-li'>
                  <h4 style={{ display: "inline" }}>Content of thought:</h4>
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
                      ["Neologisms", "Neologisms"]
                    ].map(([id, label]) => renderthoughCheckbox("content_though", id, label))}
                  </div>

                  <div className="mt-3">
                    <Button variant="success" className="m-1" type="submit" onClick={(e) => handleThoughUpdate(e, thoughFormData.admission_no)}>Update</Button>
                    <Button variant="secondary" className="m-1" onClick={handleThoughClose}>Close</Button>
                  </div>
                </li>
              </ul>
            </Form>
          </Col>
        </Modal.Body>
      </Modal>

      {/* Perception modal form */}
      <Modal show={perceptionShow} onHide={handlePerceptionClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Perception Form </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Col md={12}>
            <Form>
              <ul>
                <li className='icon-li'>
                  <h4 style={{ display: "inline" }}>Hallucinations:</h4>
                  <div className="d-flex flex-wrap gap-3 mt-2">
                    {[
                      ["auditory", "Auditory"],
                      ["visual", "Visual"],
                      ["olfactory", "Olfactory"],
                      ["gustatory", "Gustatory"],
                      ["tactile", "Tactile"],
                    ].map(([id, label]) => renderhallucinationCheck("hallucination_type", id, label))}
                  </div>

                  <div className='d-flex flex-wrap gap-3 mt-2'>
                    <Col md={4}>
                      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                        <Form.Label>What was heard?</Form.Label>
                        <Form.Control as="textarea" rows={2}
                          name='heard'
                          value={perceptionData.heard}
                          onChange={handleInputChange3} />
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                        <Form.Label>How many voices were heard?</Form.Label>
                        <Form.Control as="textarea" rows={2}
                          name='voices_heard'
                          value={perceptionData.voices_heard}
                          onChange={handleInputChange3} />
                      </Form.Group>
                    </Col>
                    <Col md={4}>

                      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                        <Form.Label>in which part of the day?</Form.Label>
                        <Form.Control as="textarea" rows={2}
                          name='part_of_day'
                          value={perceptionData.part_of_day}
                          onChange={handleInputChange3} />
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                        <Form.Label>Male or Female voices?</Form.Label>
                        <Form.Control as="textarea" rows={2}
                          name='female_male_voices'
                          value={perceptionData.female_male_voices}
                          onChange={handleInputChange3} />
                      </Form.Group>
                    </Col>

                    <Col md={4}>

                      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                        <Form.Label>How interpreted and whether second person or third person hallucinations? (i.e., whether the voices are addressing the patient or are discussing him in third person)</Form.Label>
                        <Form.Control as="textarea" rows={2}
                          name='interpreted_person'
                          value={perceptionData.interpreted_person}
                          onChange={handleInputChange3} />
                      </Form.Group>
                    </Col>


                  </div>
                </li>

                <li className='icon-li'>
                  <h4 style={{ display: "inline" }}>Illusions and misinterpretations:</h4>
                  <div className="d-flex flex-wrap gap-3 mt-2">
                    {[
                      ["Illusions_visual", "Visual"],
                      ["Illusions_auditory", "Auditory"],
                      ["other_sensory_fields", "Other Sensory Fields"],
                      ["clearConsciousness", "Occur in clear consciousness"],
                      ["unclearConsciousness", "Occur in unclear consciousness"],
                    ].map(([id, label]) => renderillusion("illusion", id, label))}
                  </div>



                </li>

                <li className='icon-li'>
                  <h4 style={{ display: "inline" }}>Perception Changes :</h4>
                  <div className="d-flex flex-wrap gap-3 mt-2">
                    {[
                      ["Depersonalization", "Depersonalization"],
                      ["derealization", "derealization"],
                    ].map(([id, label]) => renderPerceptionChanges("perception_changes", id, label))}
                  </div>
                </li>

                <li className='icon-li'>
                  <h4 style={{ display: "inline" }}>Somatic passivity phenomenon :</h4>
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
                    ].map(([id, label]) => renderothers("others", id, label))}
                  </div>

                  <div className="mt-3">
                    <Button variant="success" className="m-1" type="submit" onClick={(e) => handlePerceptionUpdate(e, perceptionData.admission_no)}>Update</Button>
                    <Button variant="secondary" className="m-1" onClick={handlePerceptionClose}>Close</Button>
                  </div>

                </li>


              </ul>
            </Form>
          </Col>
        </Modal.Body>
      </Modal>

      {/* Judgement modal form */}
      <Modal show={judgementShow} onHide={handleJudgementClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Judgement Form </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Col md={12}>
            <Form>
              <li className="icon-li">
                <h4 style={{ display: "inline" }}>Personal judgement:</h4>
                <Form.Group className="mb-3">
                  <Form.Control as="textarea" rows={2}
                    name='personal_judgement'
                    value={judgementData.personal_judgement}
                    onChange={handleInputChange1} />
                </Form.Group>
              </li>

              <li className="icon-li">
                <h4 style={{ display: "inline" }}>Social judgement:</h4>
                <Form.Group className="mb-3">
                  <Form.Control as="textarea" rows={2}
                    name='social_judgement'
                    value={judgementData.social_judgement}
                    onChange={handleInputChange1}
                  />
                </Form.Group>
              </li>

              <li className="icon-li">
                <h4 style={{ display: "inline" }}>Test judgement:</h4>
                <Form.Group className="mb-3">
                  <Form.Label>Please explain what actions you would take in the following situations: a house on fire, a man lying on the road, and a sealed, stamped envelope on the street.</Form.Label>
                  <Form.Control as="textarea" rows={2}
                    name='test_judgement'
                    value={judgementData.test_judgement}
                    onChange={handleInputChange1} />
                </Form.Group>
              </li>

              <li className="icon-li">
                <h4 style={{ display: "inline" }}>Judgement:</h4>
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

              <div className="mt-3">
                <Button variant="success" className="m-1" type="submit" onClick={(e) => handleJudgementUpdate(e, judgementData.admission_no)}>Update</Button>
                <Button variant="secondary" className="m-1" onClick={handleJudgementClose}>Close</Button>
              </div>

            </Form>
          </Col>
        </Modal.Body>
      </Modal>

      {/* Insight modal form */}
      <Modal show={insightShow} onHide={hanldeInsightClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Insight Form </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Col md={12}>
            <Form>
              <li className="icon-li">
                <h4 style={{ display: "inline" }}>LEVELS OF INSIGHT:</h4>
                <p>Insight is assessed using a six-point scale ranging from one to six.</p>
                <Form.Group className="mb-3">
                  <Form.Label>1. Complete denial of illness</Form.Label>
                  <Form.Control as="textarea" rows={2}
                    name='denail_illness'
                    value={insightData.denail_illness}
                    onChange={handleInputChange2} />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>2. Slight awareness of being sick & needing help but denying it at the same time</Form.Label>
                  <Form.Control as="textarea" rows={2}
                    name='slight_awareness'
                    value={insightData.slight_awareness}
                    onChange={handleInputChange2}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>3. Awareness of being sick but blaming it on others, on external factors, or on organic factors.</Form.Label>
                  <Form.Control as="textarea" rows={2}
                    name='awarness_sick'
                    value={insightData.awarness_sick}
                    onChange={handleInputChange2} />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>4. Awareness that illness is due to something unknown in the patient</Form.Label>
                  <Form.Control as="textarea" rows={2}
                    name='awarness_illness'
                    value={insightData.awarness_illness}
                    onChange={handleInputChange2} />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>5. Intellectual insight</Form.Label>
                  <Form.Control as="textarea" rows={2}
                    name='intellectual_insight'
                    value={insightData.intellectual_insight}
                    onChange={handleInputChange2} />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>6. True emotional insight</Form.Label>
                  <Form.Control as="textarea" rows={2}
                    name='true_emotion'
                    value={insightData.true_emotion}
                    onChange={handleInputChange2} />
                </Form.Group>
              </li>



              <div className="mt-3">
                <Button variant="success" className="m-1" type="submit" onClick={(e) => handleInsightUpdate(e, perceptionData.admission_no)}>Update</Button>
                <Button variant="secondary" className="m-1" onClick={hanldeInsightClose}>Close</Button>
              </div>

            </Form>
          </Col>
        </Modal.Body>
      </Modal>

      {/* Cognition modal form */}
      <Modal show={cognitionShow} onHide={hanldeCognitionClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Cognition Form </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Col md={12}>
            <Form>
              <ul>
                <li className='icon-li'>
                  <h4 style={{ display: "inline" }}>Consciousness:</h4>
                  <div className="d-flex flex-wrap gap-3 mt-2">
                    {[
                      ["Conscious", "Conscious"],
                      ["Confusion", "Confusion"],
                      ["Clouding", "Clouding"],
                      ["Delirium", "Delirium"],
                      ["stupor", "Stupor"],
                      ["coma", "Coma"],
                    ].map(([id, label]) => renderConginationCheck("consciousness", id, label))}
                    <p className="w-100 mt-2">Any disturbance of consciousness should be rated on Glasgow Coma Scale.</p>
                  </div>
                </li>

                <li className='icon-li'>
                  <h4 style={{ display: "inline" }}>Orientation:</h4>
                  <div className="d-flex flex-wrap gap-3 mt-2">
                    <label>Oriented to Time:</label>
                    <select id="orientation_time" name="orientation_time" className="form-control" required
                      value={cognitionData.orientation_time}
                      onChange={handleChange1}>
                      <option value="">-- Select --</option>
                      <option value="yes">Yes (knows time, date, season, etc.)</option>
                      <option value="no">No</option>
                    </select>

                    <label>Oriented to Place:</label>
                    <select id="orientation_place" name="orientation_place" className="form-control" required
                      value={cognitionData.orientation_place}
                      onChange={handleChange1}>
                      <option value="">-- Select --</option>
                      <option value="yes">Yes (knows location, residence)</option>
                      <option value="no">No</option>
                    </select>

                    <label>Oriented to Person:</label>
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
                  <p>Is the attention easily aroused and sustained. Ask the patient to repeat digits forwards backwards.</p>
                  <div className="d-flex flex-wrap gap-3 mt-2">
                    {consciousnessStates.map((state) => (
                      <div key={state.id} style={{ width: "30%", minWidth: "200px" }}>
                        <Form.Check
                          type="checkbox"
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
                    <Form.Label>1. Can the patient concentrate?</Form.Label>
                    <Form.Check type="radio" label="Yes" name="canConcentrate" value="yes" checked={canConcentrate === 'Yes'}
                      onChange={handleRadioChange} />
                    <Form.Check type="radio" label="No" name="canConcentrate" value="no"
                      checked={canConcentrate === 'No'}
                      onChange={handleRadioChange} />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>2. Ease of distractibility</Form.Label>
                    <Form.Control as="textarea" rows={2}
                      placeholder="Describe how easily the Resident's is distracted"
                      name='distractibility'
                      value={cognitionData.distractibility}
                      onChange={handleInputChange4} />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>3. Ask to subtract serial sevens from hundred (100-7 test), or serial threes from forty (40-3 test), or to count backwards from 20</Form.Label>
                    <Form.Control as="textarea" rows={2}
                      placeholder="Describe the resident's response."
                      name='asking_test'
                      value={cognitionData.asking_test}
                      onChange={handleInputChange4} />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>4. Enumerate the names of the months (or days of the week) in the reverse order.</Form.Label>
                    <Form.Control as="textarea" rows={2}
                      placeholder="Describe or write the resident's response here"
                      name="names_months"
                      value={cognitionData.names_months}
                      onChange={handleInputChange4} />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>5. Note down the answers and the time take perform the tests.</Form.Label>
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
                    <Form.Label>Immediate Retention (IR)</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      name="immediate_retention"
                      value={cognitionData.immediate_retention}
                      onChange={handleInputChange4}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Recall (R) after a delay</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      name="recall"
                      value={cognitionData.recall}
                      onChange={handleInputChange4}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>How did the patient come to the room/hospital ?</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      name="patient_place"
                      value={cognitionData.patient_place}
                      onChange={handleInputChange4}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>What he ate for dinner the day before or for breakfast the same morning ?</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      name="dinner_ate"
                      value={cognitionData.dinner_ate}
                      onChange={handleInputChange4}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Ask for the date of marriage</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      name="date_ofMrg"
                      value={cognitionData.date_ofMrg}
                      onChange={handleInputChange4}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Name and birthdays of children</Form.Label>
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
                    <Form.Label>Note any amnesia (anterograde/retrograde)</Form.Label>
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
                    <Form.Label>Where did you live when you were growing up?</Form.Label>
                    <Form.Control
                      as="textarea"
                      name="live_growing"
                      value={cognitionData.live_growing}
                      onChange={handleInputChange4}
                      rows={2}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>What was the name of the school you went to?</Form.Label>
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
                    <Form.Label>What did you have for breakfast?</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      name="breakfast_ques"
                      value={cognitionData.breakfast_ques}
                      onChange={handleInputChange4}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>What did you do Yesterday?</Form.Label>
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
                    <Form.Label>Ask questions about general information, keeping in mind the patient's educational and social background, his experiences and interests</Form.Label>
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
                    <Form.Label>Test for reading and writing</Form.Label>
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
                    <Form.Label>Give simple tests of calculation</Form.Label>
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
                    <Form.Label>Proverb testing: Asking the meaning of simple proverbs.</Form.Label>
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
                    <Form.Label>Ask the resident to identify the similarities and differences between familiar objects such as a table and a chair, a banana and an orange, a dog and a lion, and an eye and an ear.</Form.Label>
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
                <div className="mt-3">
                  <Button variant="success" className="m-1" type="submit" onClick={(e) => handleCognitionUpdate(e, cognitionData.admission_no)}>Update</Button>
                  <Button variant="secondary" className="m-1" onClick={hanldeCognitionClose}>Close</Button>
                </div>

              </ul>
            </Form>
          </Col>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default MSE_form
