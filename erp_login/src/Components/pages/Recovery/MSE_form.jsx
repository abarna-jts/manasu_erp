import React from 'react'
import { useState, useEffect } from 'react';
import { Col, Breadcrumb, Container, Row, Table, Button, InputGroup, Form } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPlus } from "@fortawesome/free-solid-svg-icons";
import axios from 'axios';

function MSE_form() {
  const [rescue_image, setRescueImage] = useState(null);
  const [error, setError] = useState("");
  const [admission_no, setAdmissionNumber] = useState('');
  const [rescue_name, setRescueName] = useState("");
  const [formData, setFormData] = useState({
    admission_no: '',
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
    admission_no: "" // Make sure this is filled before submit
  });

  const [moodFormData, setMoodFormData] = useState({
    mood_description: [],
    appearance: "",
    resident_feeling: "",
    general_feeling: "",
    mood_like: "",
    resident_general_feeling: "",
    resident_look: [],
    admission_no: "" // Make sure this is filled before submit
  });

  const [thoughFormData, setThoughFormData] = useState({
    stream_form_though: [],
    content_though: [],
    admission_no: '',
  })

  const [judgementData, setJudgementFormData] = useState({
    personal_judgement: '',
    social_judgement: '',
    test_judgement: '',
    judgement: '',
    admission_no: '',
  })

  const [insightData, setInsightData] = useState({
    denail_illness: '',
    slight_awareness: '',
    awarness_sick: '',
    awarness_illness: '',
    intellectual_insight: '',
    true_emotion: '',
    admission_no: '',
  })

  const [perceptionData, setPerceptionData] = useState({
    hallucination_type: [],
    heard: '',
    voices_heard: '',
    part_of_day: '',
    female_male_voices: '',
    interpreted_person: '',
    admission_no: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJudgementFormData((prev) => ({
      ...prev,
      [name]: value, // dynamically set field, like formData.judgment
    }));
  };

  // const handleAdmissionChange = (e) => {
  //   setAdmissionNumber(e.target.value);
  // };

  const apiRoute = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
  });

  const fetchRescueDetails = async (admission_no) => {
    try {
      const response = await apiRoute.get(`/admision/get_scrbform2data/${admission_no}`);
      const result = response.data.data[0];
      console.log("API Result:", result);

      if (result && result.rescue_image) {
        const imagePath = result.rescue_image.startsWith("http")
          ? result.rescue_image
          : `http://localhost:5000/${result.rescue_image}`;

        setRescueImage(imagePath);
        setRescueName(result.rescue_name || "");
        setError(""); // clear any previous error
      } else {
        setRescueImage(null);

        setError("Image not found for this admission number");
      }
    } catch (error) {
      console.error("Error fetching data", error);
      setRescueImage(null);
      setRescueName("");
      setError("Admission Number Not found");
    }
  };

  // Trigger when admission number changes
  useEffect(() => {
    if (admission_no.trim() !== "") {
      fetchRescueDetails(admission_no);
    } else {
      setRescueImage(null);
      setRescueName("");
      setError("");
    }
  }, [admission_no]);

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

    try {
      const response = await apiRoute.post('/recovery/create_MSE', formData);
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
      admission_no: formData.admission_no
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
    if (!perceptionData.hallucination_type || insightData.hallucination_type.length === 0) {
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


  const renderCheckbox = (section, id, label) => (
    <Form.Check
      key={id}
      type="checkbox"
      id={id}
      label={label}
      checked={formData[section].includes(id)}
      onChange={() => handleCheckboxChange(section, id)}
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

        {error && <div className="text-danger mb-2">{error}</div>}
        <Col md={1} className="d-flex align-items-center flex-column justify-content-end">
          {rescue_image ? (
            <>
              <img
                src={rescue_image}
                alt="Admission"
                className="img-fluid rounded"
                style={{ width: "100px", height: "100px" }}
              />
              <p className="mt-2 text-start">{rescue_name ? rescue_name : "No name available"}</p>  {/* display name below */}
            </>
          ) : (
            <p>{error || "No image to display"}</p>
          )}
        </Col>


      </div>

      <Container>
        <Row>

          <Col md={12}>
            <Row>
              <Col md="8">
                <div className="d-flex align-items-center px-3">

                  <Form className="navbar-search col-md-9">
                    <Form.Group id="topbarSearch" className="d-flex align-items-center">
                      <Col md={3}>
                        <Form.Label>Admission Number:</Form.Label>
                      </Col>
                      <Col md={2}>
                        <InputGroup className="input-group-merge search-bar">
                          <Form.Control
                            type="text"
                            value={formData.admission_no}
                            onChange={(e) => {
                              setFormData(prev => ({
                                ...prev,
                                admission_no: e.target.value
                              }));
                            }}
                          />
                        </InputGroup>
                      </Col>
                      <button type="button" className="btn btn-secondary mx-2" onClick={() => {
                        if (!admission_no.trim()) {
                          alert("Please enter admission number.");
                        } else {
                          // fetchFormData(); // Fetch & populate data before generating PDF
                        }
                      }}><FontAwesomeIcon icon={faEye} className="me-0" /></button>
                      <button type="button" className="btn btn-primary mx-2" onClick={() => {
                        if (!admission_no.trim()) {
                          alert("Please enter your admission number.");
                        } else {
                          // createFormData(); // Fetch & populate data before generating PDF
                        }
                      }}><FontAwesomeIcon icon={faPlus} className="me-0" /></button>
                      {/* <button type="button" className="btn btn-success mx-2" onClick={handleDownload}>
                        Import Excel Sheet
                      </button> */}
                    </Form.Group>
                  </Form>

                </div>
              </Col>

            </Row>
          </Col>
        </Row>
      </Container>

      <Container>
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
                    <h1>1. GENERAL APPEARANCE AND BEHAVIOUR:</h1>
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
                    <h1>2. SPEECH</h1>
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
                    <h1>3. MOOD AND AFFECT</h1>
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
                    <h1>4. THOUGHT</h1>
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
                    <h1>5. PERCEPTION</h1>
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
                            </Col>

                            <Col md={4}>
                              <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                <Form.Label>Male or Female voices?</Form.Label>
                                <Form.Control as="textarea" rows={2}
                                  name='female_male_voices'
                                  value={perceptionData.female_male_voices}
                                  onChange={handleInputChange3} />
                              </Form.Group>
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
                            <Form.Check type="checkbox" id="visual" label="Visual" />
                            <Form.Check type="checkbox" id="auditory" label="Auditory" />
                            <Form.Check type="checkbox" id="other sensory fields" label="Other Sensory Fields" />
                            <Form.Check type="checkbox" id="clearConsciousness" label="Occur in clear consciousness" />
                            <Form.Check type="checkbox" id="unclearConsciousness" label="Occur in unclear consciousness" />
                          </div>


                        </li>

                        <li className='icon-li'>
                          <h4 style={{ display: "inline" }}>Perception Changes :</h4>
                          <div className="d-flex flex-wrap gap-3 mt-2">
                            <Form.Check type="checkbox" id="Depersonalization" label="Depersonalization" />
                            <Form.Check type="checkbox" id="derealization" label="Derealization" />
                          </div>
                        </li>

                        <li className='icon-li'>
                          <h4 style={{ display: "inline" }}>Somatic passivity phenomenon :</h4>
                          <div className="d-flex flex-wrap gap-3 mt-2">
                            <Form.Check
                              type="checkbox"
                              id="strangeSensations"
                              label="Strange sensations imposed by 'somebody'"
                            />
                          </div>

                        </li>

                        <li className='icon-li'>
                          <h4 style={{ display: "inline" }}>Others :</h4>
                          <div className="d-flex flex-wrap gap-3 mt-2">
                            <Form.Check type="checkbox" id="autoscopy" label="Autoscopy" />
                            <Form.Check type="checkbox" id="abnormalVestibular" label="Abnormal vestibular sensations" />
                            <Form.Check type="checkbox" id="senseOfPresence" label="Sense of presence" />
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
                    <h1>6. COGNITION OR NEUROPSYCHIATRIC ASSESSMENT</h1>
                    <ul>
                      <li className='icon-li'>
                        <h4 style={{ display: "inline" }}>Consciousness:</h4>
                        <div className="d-flex flex-wrap gap-3 mt-2">
                          <Form.Check type="checkbox" id="Conscious" label="Conscious" />
                          <Form.Check type="checkbox" id="Confusion" label="Confusion" />
                          <Form.Check type="checkbox" id="Clouding" label="Clouding" />
                          <Form.Check type="checkbox" id="Delirium" label="Delirium" />
                          <Form.Check type="checkbox" id="stupor" label="Stupor" />
                          <Form.Check type="checkbox" id="coma" label="Coma" />
                          <p>Any disturbance of consciousness should be rated on Glasgow Coma Scale.</p>
                        </div>
                      </li>

                      <li className='icon-li'>
                        <h4 style={{ display: "inline" }}>Orientation:</h4>
                        <div className="d-flex flex-wrap gap-3 mt-2">
                          <label>Oriented to Time:</label>
                          <select id="orientation_time" name="orientation_time" className="form-control" required>
                            <option value="">-- Select --</option>
                            <option value="yes">Yes (knows time, date, season, etc.)</option>
                            <option value="no">No</option>
                          </select>

                          <label>Oriented to Place:</label>
                          <select id="orientation_place" name="orientation_place" className="form-control" required>
                            <option value="">-- Select --</option>
                            <option value="yes">Yes (knows location, residence)</option>
                            <option value="no">No</option>
                          </select>

                          <label>Oriented to Person:</label>
                          <select id="orientation_person" name="orientation_person" className="form-control" required>
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
                          <Form.Check type="radio" label="Yes" name="canConcentrate" value="yes" />
                          <Form.Check type="radio" label="No" name="canConcentrate" value="no" />
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label>2. Ease of distractibility</Form.Label>
                          <Form.Control as="textarea" rows={2} placeholder="Describe how easily the Resident's is distracted" />
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label>3. Ask to subtract serial sevens from hundred (100-7 test), or serial threes from forty (40-3 test), or to count backwards from 20</Form.Label>
                          <Form.Control as="textarea" rows={2} placeholder="Describe the resident's response." />
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label>4. Enumerate the names of the months (or days of the week) in the reverse order.</Form.Label>
                          <Form.Control as="textarea" rows={2} placeholder="Describe or write the resident's response here" />
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label>5. Note down the answers and the time take perform the tests.</Form.Label>
                          <Form.Control as="textarea" rows={2} placeholder="Describe here..." />
                        </Form.Group>
                      </li>

                      <li className='icon-li'>
                        <h4 style={{ display: "inline" }}>Memory:</h4>
                        <Form.Group className="mb-3">
                          <Form.Label>Immediate Retention (IR)</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={2}
                          />
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label>Recall (R) after a delay</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={2}
                          />
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label>How did the patient come to the room/hospital ?</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={2}
                          />
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label>What he ate for dinner the day before or for breakfast the same morning ?</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={2}
                          />
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label>Ask for the date of marriage</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={2}
                          />
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label>Name and birthdays of children</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={2}
                          />
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label>Any other relevant questions from the person's past</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={2}
                          />
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label>Note any amnesia (anterograde/retrograde)</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={2}
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
                            rows={2}
                          />
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label>What was the name of the school you went to?</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={2}
                          />
                        </Form.Group>

                        <h5>Short-term Memory</h5>

                        <Form.Group className="mb-3">
                          <Form.Label>What did you have for breakfast?</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={2}
                          />
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label>What did you do Yesterday?</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={2}
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
                            placeholder="Describe what you asked and how the resident responded."
                          />
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label>Test for reading and writing</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={2}
                            placeholder="Describe what you asked and how the resident responded."
                          />
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label>Give simple tests of calculation</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={2}
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
                            placeholder="Describe what you asked and how the resident responded."
                          />
                        </Form.Group>

                        <Form.Group className="mb-3">
                          <Form.Label>Ask the resident to identify the similarities and differences between familiar objects such as a table and a chair, a banana and an orange, a dog and a lion, and an eye and an ear.</Form.Label>
                          <Form.Control
                            as="textarea"
                            rows={2}
                            placeholder="Describe what you asked and how the resident responded."
                          />
                        </Form.Group>
                      </li>

                    </ul>
                  </li>
                  {/* Cognition END*/}

                  {/* Judgement START*/}
                  <li className="tab-content tab-content-7 typography">
                    <h1>7. JUDGEMENT</h1>
                    <ul>
                      <Form onSubmit={handleJudgementSubmit}>
                        <li className="icon-li">
                          <h4 style={{ display: "inline" }}>Personal judgment:</h4>
                          <Form.Group className="mb-3">
                            <Form.Control as="textarea" rows={2}
                              name='personal_judgement'
                              value={judgementData.personal_judgement}
                              onChange={handleInputChange1} />
                          </Form.Group>
                        </li>

                        <li className="icon-li">
                          <h4 style={{ display: "inline" }}>Social judgment:</h4>
                          <Form.Group className="mb-3">
                            <Form.Control as="textarea" rows={2}
                              name='social_judgement'
                              value={judgementData.social_judgement}
                              onChange={handleInputChange1}
                            />
                          </Form.Group>
                        </li>

                        <li className="icon-li">
                          <h4 style={{ display: "inline" }}>Test judgment:</h4>
                          <Form.Group className="mb-3">
                            <Form.Label>Please explain what actions you would take in the following situations: a house on fire, a man lying on the road, and a sealed, stamped envelope on the street.</Form.Label>
                            <Form.Control as="textarea" rows={2}
                              name='test_judgement'
                              value={judgementData.test_judgement}
                              onChange={handleInputChange1} />
                          </Form.Group>
                        </li>

                        <li className="icon-li">
                          <h4 style={{ display: "inline" }}>Judgment:</h4>
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
                    <h1>8. INSIGHT</h1>
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
    </>
  )
}

export default MSE_form
