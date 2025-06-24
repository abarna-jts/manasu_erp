import React from 'react';
import { Container, Row, Col, Breadcrumb, InputGroup, Button, Form } from "react-bootstrap";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import Cookies from 'js-cookie';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Psychiatrics_form() {
    const [admission_no, setAdmissionNumber] = useState('');
    const [rescueImage, setRescueImage] = useState(null);
    const [rescueName, setRescueName] = useState("");
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        admission_no: '',
        patient_name: '',
        patient_age: '',
        patient_gender: 'Male',
        sexual_orientation: '',
        education_bg: '',
        occupation: '',
        marital_status: '',
        economic_status: '',
        religion: '',
        informant: '',
        residential_address: '',
        living_arrangements: '',
        family_structure: '',
        cultural_identity: '',
        language_preferences: '',

    });

    const [chiefData, setChiefData] = useState({
        chief_complaint: '',
        onset_duration: '',
        nature_symptoms: '',
        severity: '',
        course_type: '',
        nature_illness: '',
        identify_trigger: '',
        life_changes: '',
        biological: '',
        psychological: '',
        social_environment: ''
    });

    const [presentingData, setPresentingData] = useState({
        admission_no: '',
        history_presenting: '',
        mood_affect: [],
        though_content: [],
        though_process: [],
        perception: [],
        behavioural_changes: [],
        sleep_patterns: [],
        energy_level: '',
        appetite_weight: '',
        occupation_academic: '',
        interpersonal_relationship: '',
        selfCare_activity: '',
        recreation_activity: '',
    });

    const [medicalDrugData, setMedicalDrugData] = useState({
        medical_history: '',
        current_medication: '',
        compliance: '',
        side_effect: '',
        otc_meditation: '',
        drug_allergies: ''
    })

    const [premorbidData, setPremorbidData] = useState({
        patient_ill: '',
        frd_description: '',
        relation_style: '',
        mood_description: '',
        hobbies: '',
        stress_response: ''
    })

    const [MSEData, setMSEData] = useState({
        appearance_behavious: '',
        mood: '',
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleInputChange1 = (e) => {
        const { name, value } = e.target;
        setChiefData((prev) => ({ ...prev, [name]: value }));
    };

    const handleInputChange2 = (e) => {
        const { name, value } = e.target;
        setPresentingData((prev) => ({ ...prev, [name]: value }));
    };

    const handleInputChange3 = (e) => {
        const { name, value } = e.target;
        setMedicalDrugData((prev) => ({ ...prev, [name]: value }));
    };

    const handleInputChange4 = (e) => {
        const { name, value } = e.target;
        setPremorbidData((prev) => ({ ...prev, [name]: value }));
    };

    const handleInputChange5 = (e) => {
        const { name, value } = e.target;
        setMSEData((prev) => ({ ...prev, [name]: value }));
    };


    const apiRoute = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
    });

    const handleAdmissionChange = (e) => {
        setAdmissionNumber(e.target.value);
    };

    const fetchRescueDetails = async (admission_no) => {
        try {
            const response = await apiRoute.get(`/admision/get_scrbform2data/${admission_no}`);
            const result = response.data.data[0];
            console.log("API Result:", result);

            if (result && result.rescue_image) {
                const imagePath = result.rescue_image.startsWith("http")
                    ? result.rescue_image
                    : `http://localhost:5002/${result.rescue_image}`;

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

    const [submissionMessage, setSubmissionMessage] = useState("");
    const [messageType, setMessageType] = useState(""); // 'success' or 'danger'


    const userType = Cookies.get('usertype');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!admission_no || admission_no.trim() === '') {
            alert("Admission Number is required.");
            return;
        }

        const completeFormData = {
            ...formData,
            admission_no: admission_no.trim()
        };

        try {
            const response = await apiRoute.post('/recovery/create_information', completeFormData);
            console.log("Form submitted successfully:", response.data);
            alert("Demographic Information submitted successfully!");
            window.location.reload();
        } catch (error) {
            console.error(error);
            alert("Error submitting form.");
        }
    };

    const handleChiefSubmit = async (e) => {
        e.preventDefault();

        if (!admission_no || admission_no.trim() === '') {
            alert("Admission Number is required.");
            return;
        }

        const completeChiefData = {
            ...chiefData,
            admission_no: admission_no.trim()
        };

        try {
            const response = await apiRoute.post('/recovery/create_chiefComplaint', completeChiefData);
            console.log("Chief Complaint submitted successfully:", response.data);
            alert("Chief Complaint submitted successfully!");
            window.location.reload();
        } catch (error) {
            console.error(error);
            alert("Error submitting form.");
        }

    }

    const handlePresentingSubmit = async (e) => {
        e.preventDefault();

        if (!admission_no || admission_no.trim() === '') {
            alert("Admission Number is required.");
            return;
        }

        if (!presentingData.mood_affect || presentingData.mood_affect.length === 0) {
            alert("Mood and affect is required.");
            return;
        }

        if (!presentingData.though_content || presentingData.though_content.length === 0) {
            alert("Thought Content is required.");
            return;
        }

        if (!presentingData.though_process || presentingData.though_process.length === 0) {
            alert("Thought Process is required.");
            return;
        }

        if (!presentingData.perception || presentingData.perception.length === 0) {
            alert("Perception is required.");
            return;
        }
        if (!presentingData.behavioural_changes || presentingData.behavioural_changes.length === 0) {
            alert("Behavioral Changes is required.");
            return;
        }
        if (!presentingData.sleep_patterns || presentingData.sleep_patterns.length === 0) {
            alert("Sleep patterns is required.");
            return;
        }

        const completedPresentingData = {
            ...presentingData,
            admission_no: admission_no.trim()
        }

        try {
            const response = await apiRoute.post('/recovery/create_presenting', completedPresentingData);
            console.log("3.	Presenting Problems submitted successfully:", response.data);
            alert("Presenting Problems submitted successfully!");
            window.location.reload();
        } catch (error) {
            console.error(error);
            alert("Error submitting form.");
        }
    }

    const handleCheckChange = (e) => {
        const { name, value } = e.target;
        setPsychiatricData((prev) => ({ ...prev, [name]: value }));
    };

    const navigate = useNavigate();

    const handleNavigateMSE = () => {
        navigate("/mseform");
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setRescueImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const renderCheckbox = (field, id, label) => (
        <Form.Check
            type="checkbox"
            id={id}
            label={label}
            checked={presentingData[field]?.includes(label)}
            onChange={(e) => {
                const updated = e.target.checked
                    ? [...presentingData[field], label]
                    : presentingData[field].filter(item => item !== label);

                setPresentingData(prev => ({
                    ...prev,
                    [field]: updated
                }));
            }}
        />
    );

    return (
        <>
            <div className="d-xl-flex justify-content-between align-items-center flex-wrap flex-md-nowrap text-start py-2">
                <div className="d-block mb-4 mb-xl-0 px-4 ">
                    <Breadcrumb className="d-none d-md-inline-block mb-0" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
                        <Breadcrumb.Item></Breadcrumb.Item>
                        <Breadcrumb.Item>Home</Breadcrumb.Item>
                        <Breadcrumb.Item active>Recovery</Breadcrumb.Item>
                    </Breadcrumb>
                    <h6 className="breadcrumb_title">Social Worker</h6>

                </div>
                <div className="text-center col-md-8"><h3 className="section_title">Psychiatric Case History</h3></div>

                <div className="d-flex align-items-center px-3 justify-content-center">

                    <Col md={2} className='d-flex flex-column align-items-end'>
                        {error && <div className="text-danger mt-2">{error}</div>}
                        {/* Rescue Name and Image */}
                        {rescueImage && (
                            <div>
                                <img
                                    alt={rescueName || "Rescue Image"}
                                    style={{ width: "100px", height: "120px" }}
                                    src={rescueImage}
                                />
                                {rescueName && <h6 className="mb-2">{rescueName}</h6>}
                            </div>
                        )}
                    </Col>
                </div>
            </div>


            <div>
                {/* Show success or error message box */}
                {submissionMessage && (
                    <Alert variant={messageType} className="mt-3">
                        {submissionMessage}
                    </Alert>
                )}
            </div>

            <Container>
                <Form className="navbar-search col-md-12 d-flex align-items-center justify-content-center">
                    <Form.Group id="topbarSearch" className="mt-3 d-flex align-items-center justify-content-center">
                        <Col md={5}>
                            <Form.Label>Admission Number:</Form.Label>
                        </Col>
                        <Col md={4}>
                            <InputGroup className="input-group-merge search-bar">
                                <Form.Control
                                    type="text"
                                    name="admission_no"
                                    value={admission_no}
                                    onChange={handleAdmissionChange}
                                    required
                                />
                            </InputGroup>
                        </Col>
                        <button type="button" className="btn btn-secondary mx-1" onClick={() => {
                            if (!admission_no.trim()) {
                                alert("Please enter admission number.");
                            } else {
                                ViewFormData();
                            }
                        }}><FontAwesomeIcon icon={faEye} className="me-0" /></button>
                        {userType === "1" && (
                            <button type="button" className="btn btn-success mx-1" onClick={() => {
                                if (!admission_no.trim()) {
                                    alert("Please enter admission number.");
                                } else {
                                    createFormData();
                                }
                            }}><FontAwesomeIcon icon={faPlus} className="me-0" /></button>
                        )}
                        <button type="button" className="btn btn-success mx-1" onClick={() => {
                            if (!admission_no.trim()) {
                                alert("Please enter admission number.");
                            } else {
                                handleShow();
                            }
                        }}><FontAwesomeIcon icon={faEdit} className="me-0" /></button>
                        {/* {userType === "2" && (
                            <button type="button" className="btn btn-success mx-1" onClick={() => {
                                if (!formData.admission_no.trim()) {
                                    alert("Please enter admission number.");
                                } else {
                                    // handleDelete(admission_no); 
                                }
                            }}><FontAwesomeIcon icon={faTrash} className="me-0" /></button>
                        )} */}
                    </Form.Group>
                </Form>
            </Container>

            <Container>
                <Row>
                    <Col>
                        <div className="page">

                            {/* tabs */}
                            <div className="pcss3t pcss3t-effect-scale pcss3t-theme-1 psychiatrics_tab">
                                <input type="radio" name="pcss3t" defaultChecked id="tab1" className="tab-content-first" />
                                <label htmlFor="tab1">Basic details</label>

                                <input type="radio" name="pcss3t" id="tab2" className="tab-content-2" />
                                <label htmlFor="tab2">Chief Complaint</label>

                                <input type="radio" name="pcss3t" id="tab3" className="tab-content-3" />
                                <label htmlFor="tab3">Past Psychiatric History</label>

                                <input type="radio" name="pcss3t" id="tab4" className="tab-content-4" />
                                <label htmlFor="tab4">Medical History</label>

                                <input type="radio" name="pcss3t" id="tab5" className="tab-content-5" />
                                <label htmlFor="tab5">Substance History</label>

                                <input type="radio" name="pcss3t" id="tab6" className="tab-content-6" />
                                <label htmlFor="tab6">Premorbid Personality</label>

                                <input type="radio" name="pcss3t" id="tab7" className="tab-content-7" onClick={handleNavigateMSE} />
                                <label htmlFor="tab7">MSE</label>

                                <input type="radio" name="pcss3t" id="tab8" className="tab-content-8" />
                                <label htmlFor="tab8">Physical Assessment</label>

                                <input type="radio" name="pcss3t" id="tab9" className="tab-content-9" />
                                <label htmlFor="tab9">Risk Evaluation</label>

                                <input type="radio" name="pcss3t" id="tab10" className="tab-content-last" />
                                <label htmlFor="tab10">Treatment Plan</label>

                                <ul>
                                    {/* Basic details START*/}
                                    <li className="tab-content tab-content-first typography">
                                        <div className="update_class d-flex align-items-center justify-content-center">
                                            <h1>DEMOGRAPHIC INFORMATION</h1>
                                        </div>
                                        <Row className='d-flex justify-content-around'>
                                            <Col md={9}>
                                                <Form className='mt-4' onSubmit={handleSubmit}>
                                                    <Form.Group as={Row} className="mb-2 text-start" >
                                                        <Form.Label column sm="4">Name: </Form.Label>
                                                        <Col sm="8">
                                                            <Form.Control type='text'
                                                                name='patient_name'
                                                                value={formData.patient_name}
                                                                onChange={handleInputChange}
                                                                required
                                                            />
                                                        </Col>
                                                    </Form.Group>

                                                    <Form.Group as={Row} className="mb-2 text-start" >
                                                        <Form.Label column sm="4">Age: </Form.Label>
                                                        <Col sm="8">
                                                            <Form.Control type='text'
                                                                name='patient_age'
                                                                value={formData.patient_age}
                                                                onChange={handleInputChange}
                                                                required
                                                            />
                                                        </Col>
                                                    </Form.Group>

                                                    <Form.Group as={Row} className="mb-2 text-start" >
                                                        <Form.Label column sm="4">Gender: </Form.Label>
                                                        <Col sm="8">
                                                            <Form.Control type='text'
                                                                name='patient_gender'
                                                                value={formData.patient_gender}
                                                                onChange={handleInputChange}
                                                                readOnly
                                                            />
                                                        </Col>
                                                    </Form.Group>

                                                    <Form.Group as={Row} className="mb-2 text-start" >
                                                        <Form.Label column sm="4">Sexual Orientation:</Form.Label>
                                                        <Col sm="8">
                                                            <Form.Control type='text'
                                                                name='sexual_orientation'
                                                                value={formData.sexual_orientation}
                                                                onChange={handleInputChange}
                                                                required
                                                            />
                                                        </Col>
                                                    </Form.Group>

                                                    <Form.Group as={Row} className="mb-2 text-start" >
                                                        <Form.Label column sm="4">Educational Background: </Form.Label>
                                                        <Col sm="8">
                                                            <Form.Control type='text'
                                                                name='education_bg'
                                                                value={formData.education_bg}
                                                                onChange={handleInputChange}
                                                                required
                                                            />
                                                        </Col>
                                                    </Form.Group>

                                                    <Form.Group as={Row} className="mb-2 text-start" >
                                                        <Form.Label column sm="4">Occupation and Employment Status: </Form.Label>
                                                        <Col sm="8">
                                                            <Form.Control type='text'
                                                                name='occupation'
                                                                value={formData.occupation}
                                                                onChange={handleInputChange}
                                                                required
                                                            />
                                                        </Col>
                                                    </Form.Group>

                                                    <Form.Group as={Row} className="mb-2 text-start" >
                                                        <Form.Label column sm="4">Marital Status: </Form.Label>
                                                        <Col sm="8">
                                                            <Form.Control type='text'
                                                                name='marital_status'
                                                                value={formData.marital_status}
                                                                onChange={handleInputChange}
                                                                required
                                                            />
                                                        </Col>
                                                    </Form.Group>

                                                    <Form.Group as={Row} className="mb-2 text-start" >
                                                        <Form.Label column sm="4">Socio Economic Status: </Form.Label>
                                                        <Col sm="8">
                                                            <Form.Control type='text'
                                                                name='economic_status'
                                                                value={formData.economic_status}
                                                                onChange={handleInputChange}
                                                                required
                                                            />
                                                        </Col>
                                                    </Form.Group>

                                                    <Form.Group as={Row} className="mb-2 text-start" >
                                                        <Form.Label column sm="4">Religion: </Form.Label>
                                                        <Col sm="8">
                                                            <Form.Control type="text"
                                                                name='religion'
                                                                value={formData.religion}
                                                                onChange={handleInputChange}
                                                                required />
                                                        </Col>
                                                    </Form.Group>

                                                    <Form.Group as={Row} className="mb-2 text-start" >
                                                        <Form.Label column sm="4">Informant: </Form.Label>
                                                        <Col sm="8">
                                                            <Form.Control type="text"
                                                                name='informant'
                                                                value={formData.informant}
                                                                onChange={handleInputChange}
                                                                required />
                                                        </Col>
                                                    </Form.Group>

                                                    <Form.Group as={Row} className="mb-2 text-start" >
                                                        <Form.Label column sm="4">Residential Address (current address):  </Form.Label>
                                                        <Col sm="8">
                                                            <Form.Control type="text"
                                                                name='residential_address'
                                                                value={formData.residential_address}
                                                                onChange={handleInputChange}
                                                                required />
                                                        </Col>
                                                    </Form.Group>

                                                    <Form.Group as={Row} className="mb-2 text-start" >
                                                        <Form.Label column sm="4">Living Arrangements: </Form.Label>
                                                        <Col sm="8">
                                                            <Form.Select name="living_arrangements"
                                                                value={formData.living_arrangements}
                                                                onChange={handleInputChange}
                                                                required>
                                                                <option>Select</option>
                                                                <option value="Family">Family</option>
                                                                <option value="Parents">Parents</option>
                                                                <option value="Roommates">Roommates</option>
                                                                <option value="Alone">Alone</option>
                                                            </Form.Select>
                                                        </Col>
                                                    </Form.Group>

                                                    <Form.Group as={Row} className="mb-2 text-start" >
                                                        <Form.Label column sm="4">Family Structure: </Form.Label>
                                                        <Col sm="8">
                                                            <Form.Select name="family_structure"
                                                                value={formData.family_structure}
                                                                onChange={handleInputChange}
                                                                required>
                                                                <option>Select</option>
                                                                <option value="Nuclear">Nuclear</option>
                                                                <option value="Joint">Joint</option>
                                                                <option value="Alone">Alone</option>
                                                            </Form.Select>
                                                        </Col>
                                                    </Form.Group>

                                                    <Form.Group as={Row} className="mb-2 text-start" >
                                                        <Form.Label column sm="4">Cultural Identity:  </Form.Label>
                                                        <Col sm="8">
                                                            <Form.Control type="text"
                                                                name='cultural_identity'
                                                                value={formData.cultural_identity}
                                                                onChange={handleInputChange}
                                                                required />
                                                        </Col>
                                                    </Form.Group>

                                                    <Form.Group as={Row} className="mb-2 text-start" >
                                                        <Form.Label column sm="4">Language Preferences:  </Form.Label>
                                                        <Col sm="4">
                                                            <Form.Control type="text"
                                                                name='language1'
                                                                value={formData.language1}
                                                                onChange={handleInputChange}
                                                                required />
                                                        </Col>
                                                        <Col sm="4">
                                                            <Form.Control type="text"
                                                                name='language2'
                                                                value={formData.language2}
                                                                onChange={handleInputChange} />
                                                        </Col>
                                                    </Form.Group>

                                                    <Col md={12} className='d-flex align-items-center justify-content-center mt-4'>
                                                        <Button className='btn btn-success' type='submit'>Submit</Button>
                                                    </Col>

                                                </Form>
                                            </Col>
                                            {/* <Col md={2} className='d-flex flex-column align-items-end'>
                                                {error && <div className="text-danger mt-2">{error}</div>}
                                                {rescueImage && (
                                                    <div>
                                                        <img
                                                            alt={rescueName || "Rescue Image"}
                                                            style={{ width: "100px", height: "120px" }}
                                                            src={rescueImage}
                                                        />
                                                        {rescueName && <h6 className="mb-2">{rescueName}</h6>}
                                                    </div>
                                                )}
                                            </Col> */}
                                        </Row>


                                    </li>
                                    {/* Basic details END*/}

                                    {/* Clinical History START*/}
                                    <li className="tab-content tab-content-2 typography">
                                        <div className="update_class d-flex align-items-center justify-content-center">
                                            <h1>THE CHIEF COMPLAINT</h1>
                                        </div>
                                        <Row className='d-flex justify-content-around'>
                                            <Col md={9}>
                                                <Form className='mt-4' onSubmit={handleChiefSubmit}>
                                                    <li className='icon-li'>
                                                        <h4>The Chief Complaint:</h4>
                                                    </li>
                                                    <Form.Group as={Row} className="mb-2 text-start" >
                                                        <Form.Label column sm="4">Chief Complaint:  </Form.Label>
                                                        <Col sm="8">
                                                            <Form.Control type="text"
                                                                name='chief_complaint'
                                                                value={chiefData.chief_complaint}
                                                                onChange={handleInputChange1}
                                                                required />
                                                        </Col>
                                                    </Form.Group>

                                                    <Form.Group as={Row} className="mb-2 text-start" >
                                                        <Form.Label column sm="4">Onset and Duration:  </Form.Label>
                                                        <Col sm="8">
                                                            <Form.Control type="text"
                                                                name='onset_duration'
                                                                value={chiefData.onset_duration}
                                                                onChange={handleInputChange1}
                                                                required />
                                                        </Col>
                                                    </Form.Group>

                                                    <Form.Group as={Row} className="mb-2 text-start" >
                                                        <Form.Label column sm="4">Nature of Symptoms:  </Form.Label>
                                                        <Col sm="8">
                                                            <Form.Control type="text"
                                                                name='nature_symptoms'
                                                                value={chiefData.nature_symptoms}
                                                                onChange={handleInputChange1}
                                                                required />
                                                        </Col>
                                                    </Form.Group>

                                                    <Form.Group as={Row} className="mb-2 text-start" >
                                                        <Form.Label column sm="4">Severity:  </Form.Label>
                                                        <Col sm="8">
                                                            <Form.Select name="severity"
                                                                value={chiefData.severity}
                                                                onChange={handleInputChange1}
                                                                required>
                                                                <option>Select</option>
                                                                <option value="Mild">Mild</option>
                                                                <option value="Moderate">Moderate</option>
                                                                <option value="Severe">Severe</option>
                                                            </Form.Select>
                                                        </Col>
                                                    </Form.Group>

                                                    <Form.Group as={Row} className="mb-2 text-start" >
                                                        <Form.Label column sm="4">Course Type:  </Form.Label>
                                                        <Col sm="8">
                                                            <Form.Select name="course_type"
                                                                value={chiefData.course_type}
                                                                onChange={handleInputChange1}
                                                                required>
                                                                <option>Select</option>
                                                                <option value="Continuous">Continuous</option>
                                                                <option value="Episodic">Episodic</option>
                                                                <option value="Fluctuating">Fluctuating</option>
                                                            </Form.Select>
                                                        </Col>
                                                    </Form.Group>

                                                    <Form.Group as={Row} className="mb-2 text-start" >
                                                        <Form.Label column sm="4">Nature of Illness:  </Form.Label>
                                                        <Col sm="8">
                                                            <Form.Select name="nature_illness"
                                                                value={chiefData.nature_illness}
                                                                onChange={handleInputChange1}
                                                                required>
                                                                <option>Select</option>
                                                                <option value="Progressive">Progressive</option>
                                                                <option value="Static">Static</option>
                                                                <option value="Improving">Improving</option>
                                                            </Form.Select>
                                                        </Col>
                                                    </Form.Group>

                                                    <li className='icon-li'>
                                                        <h4>Precipitating Factors:</h4>
                                                    </li>

                                                    <Form.Group as={Row} className="mb-2 text-start" >
                                                        <Form.Label column sm="4">Identify Triggers:  </Form.Label>
                                                        <Col sm="8">
                                                            <Form.Control type="text"
                                                                name='identify_trigger'
                                                                value={chiefData.identify_trigger}
                                                                onChange={handleInputChange1}
                                                                required />
                                                        </Col>
                                                    </Form.Group>

                                                    <Form.Group as={Row} className="mb-2 text-start" >
                                                        <Form.Label column sm="4">Life Changes and Stressors:  </Form.Label>
                                                        <Col sm="8">
                                                            <Form.Control type="text"
                                                                name='life_changes'
                                                                value={chiefData.life_changes}
                                                                onChange={handleInputChange1}
                                                                required />
                                                        </Col>
                                                    </Form.Group>

                                                    <li className='icon-li'>
                                                        <h4>Predisposing Factors:</h4>
                                                    </li>

                                                    <Form.Group as={Row} className="mb-2 text-start" >
                                                        <Form.Label column sm="4">Biological:  </Form.Label>
                                                        <Col sm="8">
                                                            <Form.Control type="text"
                                                                name='biological'
                                                                value={chiefData.biological}
                                                                onChange={handleInputChange1}
                                                                required />
                                                        </Col>
                                                    </Form.Group>

                                                    <Form.Group as={Row} className="mb-2 text-start" >
                                                        <Form.Label column sm="4">Psychological:  </Form.Label>
                                                        <Col sm="8">
                                                            <Form.Control type="text"
                                                                name='psychological'
                                                                value={chiefData.psychological}
                                                                onChange={handleInputChange1}
                                                                required />
                                                        </Col>
                                                    </Form.Group>

                                                    <Form.Group as={Row} className="mb-2 text-start" >
                                                        <Form.Label column sm="4">Social / Environmental:  </Form.Label>
                                                        <Col sm="8">
                                                            <Form.Control type="text"
                                                                name='social_environment'
                                                                value={chiefData.social_environment}
                                                                onChange={handleInputChange1}
                                                                required />
                                                        </Col>
                                                    </Form.Group>


                                                    <Col md={12} className='d-flex align-items-center justify-content-center mt-4'>
                                                        <Button className='btn btn-success' type='submit'>Submit</Button>
                                                    </Col>
                                                </Form>

                                            </Col>

                                        </Row>
                                    </li>
                                    {/* Clinical History END*/}

                                    {/* Psychiatric History START*/}
                                    <li className="tab-content tab-content-3 typography">
                                        <div className="update_class d-flex align-items-center justify-content-center">
                                            <h1>PRESENTING PROBLEMS</h1>
                                        </div>
                                        <Row className='d-flex justify-content-around'>
                                            <Col md={9}>
                                                <Form className='mt-4' onSubmit={handlePresentingSubmit}>
                                                    <li className='icon-li'>
                                                        <h4>Introduction to Presenting Problems:</h4>
                                                    </li>
                                                    <Form.Group className="mb-3" >
                                                        <Form.Label>History of Presenting Illness: </Form.Label>
                                                        <Form.Control as="textarea" rows={2}
                                                            name='history_presenting'
                                                            value={presentingData.history_presenting}
                                                            onChange={handleInputChange2}
                                                            required />
                                                    </Form.Group>

                                                    <li className='icon-li'>
                                                        <h4>Detailed Exploration of Symptoms:</h4>
                                                    </li>

                                                    <Form.Group as={Row} className="mb-3">
                                                        <Form.Label>a.	Mood and Affect: </Form.Label>
                                                        <div className="d-flex flex-wrap gap-3 mt-2">
                                                            {[
                                                                ["Predominant mood", "Predominant mood"],
                                                                ["Appropriateness of Affect", "Appropriateness of Affect"],

                                                            ].map(([id, label]) => renderCheckbox("mood_affect", id, label))}
                                                        </div>
                                                    </Form.Group>

                                                    <Form.Group as={Row} className="mb-3">
                                                        <Form.Label>b.	Thought Content: </Form.Label>
                                                        <div className="d-flex flex-wrap gap-3 mt-2">
                                                            {[
                                                                ["Recurrent", "Recurrent"],
                                                                ["Intrusive", "Intrusive"],
                                                                ["obsessive", "obsessive"],
                                                                ["Cognitive Distortions", "Cognitive Distortions"],

                                                            ].map(([id, label]) => renderCheckbox("though_content", id, label))}
                                                        </div>
                                                    </Form.Group>

                                                    <Form.Group as={Row} className="mb-3">
                                                        <Form.Label>c.	Thought Process: </Form.Label>
                                                        <div className="d-flex flex-wrap gap-3 mt-2">
                                                            {[
                                                                ["Speed of thoughts", "Speed of thoughts"],
                                                                ["Coherence", "Coherence"],
                                                                ["Organization", "Organization"],
                                                                ["Signs of Racing thoughts", "Signs of Racing thoughts"],
                                                                ["Tangentiality", "Tangentiality"],
                                                                ["Thought Blocking", "Thought Blocking"],

                                                            ].map(([id, label]) => renderCheckbox("though_process", id, label))}
                                                        </div>
                                                    </Form.Group>

                                                    <Form.Group as={Row} className="mb-3">
                                                        <Form.Label>d.	Perceptions: </Form.Label>
                                                        <div className="d-flex flex-wrap gap-3 mt-2">
                                                            {[
                                                                ["Hallucinations", "Hallucinations"],
                                                                ["Perceptual Disturbances", "Perceptual Disturbances"],
                                                                ["Unusual Experiences related to Hearing", "Unusual Experiences related to Hearing"],
                                                                ["Seeing", "Seeing"],
                                                                ["Interpreting Stimuli", "Interpreting Stimuli"],

                                                            ].map(([id, label]) => renderCheckbox("perception", id, label))}
                                                        </div>
                                                    </Form.Group>

                                                    <Form.Group as={Row} className="mb-3">
                                                        <Form.Label>e.	Behavioural Changes: </Form.Label>
                                                        <div className="d-flex flex-wrap gap-3 mt-2">
                                                            {[
                                                                ["Activity level", "Activity level"],
                                                                ["Social Withdrawal", "Social Withdrawal"],
                                                                ["Impulsivity", "Impulsivity"],
                                                                ["Engagement in Risky Behaviours", "Engagement in Risky Behaviours"],
                                                                ["Disruptions in Daily Routines", "Disruptions in Daily Routines"],
                                                                ["Self-Care Activities", "Self-Care Activities"]

                                                            ].map(([id, label]) => renderCheckbox("behavioural_changes", id, label))}
                                                        </div>
                                                    </Form.Group>

                                                    <Form.Group as={Row} className="mb-3">
                                                        <Form.Label>f.	Sleep Patterns: </Form.Label>
                                                        <div className="d-flex flex-wrap gap-3 mt-2">
                                                            {[
                                                                ["Difficulties falling asleep", "Difficulties falling asleep"],
                                                                ["Staying asleep", "Staying asleep"],
                                                                ["Experiencing Nightmares", "Experiencing Nightmares"]

                                                            ].map(([id, label]) => renderCheckbox("sleep_patterns", id, label))}
                                                        </div>
                                                    </Form.Group>

                                                    <Form.Group className="mb-3" >
                                                        <Form.Label>Appetite and Weight Changes: </Form.Label>
                                                        <Form.Control as="textarea" rows={2}
                                                            name='appetite_weight'
                                                            value={presentingData.appetite_weight}
                                                            onChange={handleInputChange2}
                                                            required />
                                                    </Form.Group>

                                                    <Form.Group className="mb-3" >
                                                        <Form.Label>Energy Level: </Form.Label>
                                                        <Form.Control as="textarea" rows={2}
                                                            name='energy_level'
                                                            value={presentingData.energy_level}
                                                            onChange={handleInputChange2}
                                                            required />
                                                    </Form.Group>

                                                    <li className='icon-li'>
                                                        <h4>Impact on Daily Functioning:</h4>
                                                    </li>

                                                    <Form.Group className="mb-3" >
                                                        <Form.Label>Occupational or Academic Functioning: </Form.Label>
                                                        <Form.Control as="textarea" rows={2}
                                                            name='occupation_academic'
                                                            value={presentingData.occupation_academic}
                                                            onChange={handleInputChange2}
                                                            required />
                                                    </Form.Group>

                                                    <Form.Group className="mb-3" >
                                                        <Form.Label>Interpersonal Relationships: </Form.Label>
                                                        <Form.Control as="textarea" rows={2}
                                                            name='interpersonal_relationship'
                                                            value={presentingData.interpersonal_relationship}
                                                            onChange={handleInputChange2}
                                                            required />
                                                    </Form.Group>

                                                    <Form.Group className="mb-3" >
                                                        <Form.Label>Self-Care and Activities of Daily Living: </Form.Label>
                                                        <Form.Control as="textarea" rows={2}
                                                            name='selfCare_activity'
                                                            value={presentingData.selfCare_activity}
                                                            onChange={handleInputChange2}
                                                            required />
                                                    </Form.Group>

                                                    <Form.Group className="mb-3" >
                                                        <Form.Label>Recreational Activities: </Form.Label>
                                                        <Form.Control as="textarea" rows={2}
                                                            name='recreation_activity'
                                                            value={presentingData.recreation_activity}
                                                            onChange={handleInputChange2}
                                                            required />
                                                    </Form.Group>


                                                    <Col md={12} className='d-flex align-items-center justify-content-center mt-4'>
                                                        <Button className='btn btn-success' type='submit'>Submit</Button>
                                                    </Col>
                                                </Form>
                                            </Col>
                                            <Col md={2} className='d-flex flex-column align-items-end'>
                                                {error && <div className="text-danger mt-2">{error}</div>}
                                                {/* Rescue Name and Image */}
                                                {rescueImage && (
                                                    <div>
                                                        <img
                                                            alt={rescueName || "Rescue Image"}
                                                            style={{ width: "100px", height: "120px" }}
                                                            src={rescueImage}
                                                        />
                                                        {rescueName && <h6 className="mb-2">{rescueName}</h6>}
                                                    </div>
                                                )}
                                            </Col>
                                        </Row>
                                    </li>
                                    {/* Psychiatric History END*/}

                                    {/* Medical & Drug History START*/}
                                    <li className="tab-content tab-content-4 typography">
                                        <div className="update_class d-flex align-items-center justify-content-center">
                                            <h1>Past Medical & Drug History</h1>
                                        </div>
                                        <Row className='d-flex justify-content-around'>
                                            <Col md={7}>
                                                <Form className='mt-4'>
                                                    <Form.Group as={Row} className="mb-2 text-start" >
                                                        <Form.Label column sm="5">Any significant past or current medical history: </Form.Label>
                                                        <Col sm="6">
                                                            <Form.Control as="textarea" rows={3}
                                                                name='medical_history'
                                                                value={medicalDrugData.medical_history}
                                                                onChange={handleInputChange3}
                                                                required />
                                                        </Col>
                                                    </Form.Group>
                                                    <Form.Group as={Row} className="mb-1">
                                                        <Form.Label column sm="5" className='text-start'>Current medication:</Form.Label>
                                                        <Col sm="6">
                                                            <Form.Control
                                                                type="text"
                                                                name="current_medication"
                                                                value={medicalDrugData.current_medication}
                                                                onChange={handleInputChange3}
                                                                required
                                                            />
                                                        </Col>
                                                    </Form.Group>
                                                    <Form.Group as={Row} className="mb-1">
                                                        <Form.Label column sm="5" className='text-start'>Compliance:</Form.Label>
                                                        <Col sm="6">
                                                            <Form.Control
                                                                type="text"
                                                                name="compliance"
                                                                value={medicalDrugData.compliance}
                                                                onChange={handleInputChange3}
                                                                required
                                                            />
                                                        </Col>
                                                    </Form.Group>
                                                    <Form.Group as={Row} className="mb-1">
                                                        <Form.Label column sm="5" className='text-start'>Side effects:</Form.Label>
                                                        <Col sm="6">
                                                            <Form.Control
                                                                type="text"
                                                                name="side_effect"
                                                                value={medicalDrugData.side_effect}
                                                                onChange={handleInputChange3}
                                                                required
                                                            />
                                                        </Col>
                                                    </Form.Group>
                                                    <Form.Group as={Row} className="mb-1">
                                                        <Form.Label column sm="5" className='text-start'>Over the counter medication:</Form.Label>
                                                        <Col sm="6">
                                                            <Form.Control
                                                                type="text"
                                                                name="otc_meditation"
                                                                value={medicalDrugData.otc_meditation}
                                                                onChange={handleInputChange3}
                                                                required
                                                            />
                                                        </Col>
                                                    </Form.Group>
                                                    <Form.Group as={Row} className="mb-1">
                                                        <Form.Label column sm="5" className='text-start'>Drug allergies:</Form.Label>
                                                        <Col sm="6">
                                                            <Form.Control
                                                                type="text"
                                                                name="drug_allergies"
                                                                value={medicalDrugData.drug_allergies}
                                                                onChange={handleInputChange3}
                                                                required
                                                            />
                                                        </Col>
                                                    </Form.Group>
                                                    <Col md={12} className='d-flex align-items-center justify-content-center mt-4'>
                                                        <Button className='btn btn-success' type='submit'>Submit</Button>
                                                    </Col>
                                                </Form>
                                            </Col>
                                            <Col md={2} className='d-flex flex-column align-items-end'>
                                                {error && <div className="text-danger mt-2">{error}</div>}
                                                {/* Rescue Name and Image */}
                                                {rescueImage && (
                                                    <div>
                                                        <img
                                                            alt={rescueName || "Rescue Image"}
                                                            style={{ width: "100px", height: "120px" }}
                                                            src={rescueImage}
                                                        />
                                                        {rescueName && <h6 className="mb-2">{rescueName}</h6>}
                                                    </div>
                                                )}
                                            </Col>
                                        </Row>
                                    </li>
                                    {/* Medical & Drug History END*/}

                                    {/* Substance History START*/}
                                    <li className="tab-content tab-content-5 typography">
                                        <div className="update_class d-flex align-items-center">
                                            <h1>Substance Use History </h1>

                                        </div>
                                    </li>
                                    {/* Substance History END*/}

                                    {/* Premorbid Personality START*/}
                                    <li className="tab-content tab-content-6 typography">
                                        <div className="update_class d-flex align-items-center justify-content-center">
                                            <h1>Premorbid Personality </h1>
                                        </div>
                                        <Row className='d-flex justify-content-around'>
                                            <Col md={7}>
                                                <Form className='mt-4'>
                                                    <Form.Group as={Row} className="mb-1">
                                                        <Form.Label column sm="5" className='text-start'>Ask the patient to describe what they were like before they became:</Form.Label>
                                                        <Col sm="6">
                                                            <Form.Control
                                                                type="text"
                                                                name="patient_ill"
                                                                value={premorbidData.patient_ill}
                                                                onChange={handleInputChange4}
                                                                required
                                                            />
                                                        </Col>
                                                    </Form.Group>
                                                    <Form.Group as={Row} className="mb-2 text-start" >
                                                        <Form.Label column sm="5">How would their friends describe them? </Form.Label>
                                                        <Col sm="6">
                                                            <Form.Control as="textarea" rows={2}
                                                                name='frd_description'
                                                                value={premorbidData.frd_description}
                                                                onChange={handleInputChange4}
                                                                required />
                                                        </Col>
                                                    </Form.Group>
                                                    <Form.Group as={Row} className="mb-2 text-start" >
                                                        <Form.Label column sm="5">Relationship Style </Form.Label>
                                                        <Col sm="6">
                                                            <Form.Control as="textarea" rows={2}
                                                                name='relation_style'
                                                                value={premorbidData.relation_style}
                                                                placeholder="E.g., shy, makes friends easily"
                                                                onChange={handleInputChange4}
                                                                required />
                                                        </Col>
                                                    </Form.Group>
                                                    <Form.Group as={Row} className="mb-2 text-start">
                                                        <Form.Label column sm="5">Prevailing Mood and Mood Changes</Form.Label>
                                                        <Col sm="6">
                                                            <Form.Control
                                                                as="textarea" rows={2}
                                                                name="mood_description"
                                                                placeholder="E.g., generally cheerful, sudden mood changes"
                                                                value={premorbidData.mood_description}
                                                                onChange={handleInputChange4}
                                                            />
                                                        </Col>

                                                    </Form.Group>
                                                    <Form.Group as={Row} className="mb-2 text-start" >
                                                        <Form.Label column sm="5">Hobbies and interests</Form.Label>
                                                        <Col sm="6">
                                                            <Form.Control
                                                                type="text"
                                                                name="hobbies"
                                                                value={premorbidData.hobbies}
                                                                onChange={handleInputChange4}
                                                                required
                                                            />
                                                        </Col>
                                                    </Form.Group>
                                                    <Form.Group as={Row} className="mb-2 text-start" >
                                                        <Form.Label column sm="5">How would they usually respond to stress ?</Form.Label>
                                                        <Col sm="6">
                                                            <Form.Control
                                                                type="text"
                                                                name="stress_response"
                                                                value={premorbidData.stress_response}
                                                                onChange={handleInputChange4}
                                                                required
                                                            />
                                                        </Col>
                                                    </Form.Group>
                                                    <Col md={12} className='d-flex align-items-center justify-content-center mt-4'>
                                                        <Button className='btn btn-success' type='submit'>Submit</Button>
                                                    </Col>
                                                </Form>
                                            </Col>
                                            <Col md={2} className='d-flex flex-column align-items-end'>
                                                {error && <div className="text-danger mt-2">{error}</div>}
                                                {/* Rescue Name and Image */}
                                                {rescueImage && (
                                                    <div>
                                                        <img
                                                            alt={rescueName || "Rescue Image"}
                                                            style={{ width: "100px", height: "120px" }}
                                                            src={rescueImage}
                                                        />
                                                        {rescueName && <h6 className="mb-2">{rescueName}</h6>}
                                                    </div>
                                                )}
                                            </Col>
                                        </Row>
                                    </li>
                                    {/* Premorbid Personality END*/}

                                    {/* MSE START*/}
                                    <li className="tab-content tab-content-7 typography">
                                        <div className="update_class d-flex align-items-center">
                                            <h1>Mental Status Examination (MSE) </h1>
                                        </div>

                                    </li>
                                    {/* MSE END*/}

                                    {/* Physical Assessment START*/}
                                    <li className="tab-content tab-content-8 typography">
                                        <div className="update_class d-flex align-items-center">
                                            <h1>Physical Examination and Investigations </h1>

                                        </div>
                                    </li>
                                    {/* Physical Assessment END*/}

                                    {/* Risk Evaluation START*/}
                                    <li className="tab-content tab-content-9 typography">
                                        <div className="update_class d-flex align-items-center">
                                            <h1>Formulation & Risk Assessment</h1>

                                        </div>
                                    </li>
                                    {/* Risk Evaluation END*/}

                                    {/* Treatment Plan START*/}
                                    <li className="tab-content tab-content-last typography">
                                        <div className="update_class d-flex align-items-center">
                                            <h1>Diagnosis & Treatment Plan</h1>

                                        </div>
                                    </li>
                                    {/* Treatment Plan END*/}

                                </ul>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container >



        </>
    )
}

export default Psychiatrics_form

