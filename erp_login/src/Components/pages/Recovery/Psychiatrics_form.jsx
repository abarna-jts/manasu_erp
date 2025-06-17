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
        patient_name: '',
        patient_age: '',
        patient_dob: '',
        rescue_place:'',
        rescue_agency:'',
        identification:'',
        patient_gender: 'Male',
        referral_reason:'',
        initial_condition:'',
        admission_date:'',
    });

    const [historyData, setHistoryData] = useState({
        patient_history: '',
        current_mental: '',
        other_psychiatric: '',
        risk_Consideration: ''
    });

    const [psychiatricData, setPsychiatricData] = useState({
        diagnosis: '',
        specify_diagnosis: '',
        treatment_GP: '',
        specify_GP: '',
        treatment_name: '',
        treatment_date: '',
        treatment_effectiveness: '',
        mental_act: '',
        self_harm: ''
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
        setHistoryData((prev) => ({ ...prev, [name]: value }));
    };

    const handleInputChange2 = (e) => {
        const { name, value } = e.target;
        setPsychiatricData((prev) => ({ ...prev, [name]: value }));
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
        const updatedFormData = { ...formData, admission_no };

        const data = new FormData();

        data.append('admission_no', updatedFormData.admission_no);
        data.append('patient_name', formData.patient_name);
        data.append('patient_age', formData.patient_age);
        data.append('patient_phone', formData.patient_phone);
        data.append('patient_address', formData.patient_address);
        data.append('patient_dob', formData.patient_dob);
        data.append('patient_gender', 'Male');
        data.append('patient_status', formData.patient_status);
        data.append('referred_by', formData.referred_by);
        data.append('referral_reason', formData.referral_reason);

        try {
            const res = await apiRoute.post('/recovery/createBasicDetails', data);
            console.log(res);
            if (res.data.message === "Basic Details Created Successfully") {
                setSubmissionMessage("Form submitted successfully!");
                setMessageType("success");

                // Optionally reload after 3 seconds
                setTimeout(() => window.location.reload(), 3000);
            } else {
                setSubmissionMessage("Submission failed.");
                setMessageType("danger");
            }
        } catch (error) {
            console.error("Error submitting form", error);
            setSubmissionMessage("Something went wrong.");
            setMessageType("danger");
        }
    }

    const handleCheckChange = (e) => {
        const { name, value } = e.target;
        setPsychiatricData((prev) => ({ ...prev, [name]: value }));
    };

    const navigate = useNavigate();

    const handleNavigateMSE = () =>{
        navigate("/mseform");
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setRescueImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

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

                    <Form className="navbar-search">
                        <Form.Group id="topbarSearch">
                            <InputGroup className="input-group-merge search-bar">

                                <Form.Control
                                    type="text"
                                    placeholder="Search"
                                />
                            </InputGroup>
                        </Form.Group>
                    </Form>
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
                                <label htmlFor="tab2">Clinical History</label>

                                <input type="radio" name="pcss3t" id="tab3" className="tab-content-3" />
                                <label htmlFor="tab3">Past Psychiatric History</label>

                                <input type="radio" name="pcss3t" id="tab4" className="tab-content-4" />
                                <label htmlFor="tab4">Medical History</label>

                                <input type="radio" name="pcss3t" id="tab5" className="tab-content-5" />
                                <label htmlFor="tab5">Substance History</label>

                                <input type="radio" name="pcss3t" id="tab6" className="tab-content-6" />
                                <label htmlFor="tab6">Premorbid Personality</label>

                                <input type="radio" name="pcss3t" id="tab7" className="tab-content-7" onClick={handleNavigateMSE}/>
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
                                            <h1>Patient Identification & Referral - Basic details</h1>
                                        </div>
                                        <Row className='d-flex justify-content-around'>
                                            <Col md={9}>
                                                <Form className='mt-4' onSubmit={handleSubmit}>
                                                    <Form.Group as={Row} className="mb-2 text-start" >
                                                        <Form.Label column sm="4">Name (if known): </Form.Label>
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
                                                        <Form.Label column sm="4">Approximate Age: </Form.Label>
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
                                                        <Form.Label column sm="4">Date & Place of Rescue: </Form.Label>
                                                        <Col sm="4">
                                                            <Form.Control type='date'
                                                                name='patient_dob'
                                                                value={formData.patient_dob}
                                                                onChange={handleInputChange}
                                                                required
                                                            />
                                                        </Col>
                                                         <Col sm="4">
                                                            <Form.Control type='text'
                                                                name='rescue_place'
                                                                value={formData.rescue_place}
                                                                onChange={handleInputChange}
                                                                required
                                                            />
                                                        </Col>
                                                    </Form.Group>

                                                    <Form.Group as={Row} className="mb-2 text-start" >
                                                        <Form.Label column sm="4">Rescue Agency: </Form.Label>
                                                        <Col sm="8">
                                                            <Form.Select aria-label="Default select example"
                                                                name='rescue_agency' required>
                                                                <option>Select Agency</option>
                                                                <option value="Police">Police</option>
                                                                <option value="NGO">NGO</option>
                                                                <option value="Public">Public</option>
                                                                <option value="Volunteer">Volunteer</option>
                                                            </Form.Select>
                                                        </Col>
                                                    </Form.Group>

                                                    <Form.Group as={Row} className="mb-2 text-start" >
                                                        <Form.Label column sm="4">Identification Method: </Form.Label>
                                                        <Col sm="8">
                                                            <Form.Control type='text'
                                                                name='identification'
                                                                value={formData.identification}
                                                                onChange={handleInputChange}
                                                                required
                                                            />
                                                        </Col>
                                                    </Form.Group>

                                                    <Form.Group as={Row} className="mb-2 text-start" >
                                                        <Form.Label column sm="4">Referral Reason: </Form.Label>
                                                        <Col sm="8">
                                                            <Form.Control type='text'
                                                                name='referral_reason'
                                                                value={formData.referral_reason}
                                                                onChange={handleInputChange}
                                                                required
                                                            />
                                                        </Col>
                                                    </Form.Group>

                                                    <Form.Group as={Row} className="mb-2 text-start" >
                                                        <Form.Label column sm="4">Initial Condition Noted: </Form.Label>
                                                        <Col sm="8">
                                                            <Form.Control type='text'
                                                                name='initial_condition'
                                                                value={formData.initial_condition}
                                                                onChange={handleInputChange}
                                                                required
                                                            />
                                                        </Col>
                                                    </Form.Group>

                                                    <Form.Group as={Row} className="mb-2 text-start" >
                                                        <Form.Label column sm="4">Admission Date to Home: </Form.Label>
                                                        <Col sm="8">
                                                            <Form.Control type='text'
                                                                name='admission_date'
                                                                value={formData.admission_date}
                                                                onChange={handleInputChange}
                                                                required
                                                            />
                                                        </Col>
                                                    </Form.Group>

                                                    <Form.Group as={Row} className="mb-2 text-start" >
                                                        <Form.Label column sm="4">Photograph: </Form.Label>
                                                        <Col sm="8">
                                                            <Form.Control type="file" 
                                                            name='rescue_photo'
                                                            onChange={handleImageChange}/>
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
                                            <h1>Presenting Complaint & History of Presenting Illness</h1>
                                        </div>
                                        <Row className='d-flex justify-content-around'>
                                            <Col md={9}>
                                                <Form className='mt-4'>
                                                    <Form.Group as={Row} className="mb-2 text-start" >
                                                        <Form.Label column sm="5">Current Symptoms: </Form.Label>
                                                        <Col sm="7">
                                                            <Form.Control as="textarea" rows={2}
                                                                name='current_symptoms'
                                                                value={historyData.current_symptoms}
                                                                onChange={handleInputChange1}
                                                                required />
                                                        </Col>
                                                    </Form.Group>
                                                    <Form.Group as={Row} className="mb-2 text-start" >
                                                        <Form.Label column sm="5">Duration of Symptoms: </Form.Label>
                                                        <Col sm="7">
                                                            <Form.Control as="textarea" rows={2}
                                                                name='duration_symptoms'
                                                                value={historyData.duration_symptoms}
                                                                onChange={handleInputChange1}
                                                                required />
                                                        </Col>
                                                    </Form.Group>
                                                    <Form.Group as={Row} className="mb-2 text-start" >
                                                        <Form.Label column sm="5">Behavior Noticed During Rescue: </Form.Label>
                                                        <Col sm="7">
                                                            <Form.Control as="textarea" rows={2}
                                                                name='behaviour'
                                                                value={historyData.behaviour}
                                                                onChange={handleInputChange1}
                                                                required />
                                                        </Col>
                                                    </Form.Group>
                                                    <Form.Group as={Row} className="mb-2 text-start" >
                                                        <Form.Label column sm="5">Any Known History Provided by Patient (if oriented): </Form.Label>
                                                        <Col sm="7">
                                                            <Form.Control as="textarea" rows={2}
                                                                name='history_provider'
                                                                value={historyData.history_provider}
                                                                onChange={handleInputChange1}
                                                                required />
                                                        </Col>
                                                    </Form.Group>

                                                    <Form.Group as={Row} className="mb-2 text-start" >
                                                        <Form.Label column sm="5">Informants: </Form.Label>
                                                        <Col sm="7">
                                                            <Form.Control as="textarea" rows={2}
                                                                name='informants'
                                                                value={historyData.informants}
                                                                onChange={handleInputChange1}
                                                                required />
                                                        </Col>
                                                    </Form.Group>

                                                    <Form.Group as={Row} className="mb-2 text-start" >
                                                        <Form.Label column sm="5">Insight into Illness: </Form.Label>
                                                        <Col sm="7">
                                                            <Form.Control as="textarea" rows={2}
                                                                name='insight_illness'
                                                                value={historyData.insight_illness}
                                                                onChange={handleInputChange1}
                                                                required />
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
                                    {/* Clinical History END*/}

                                    {/* Psychiatric History START*/}
                                    <li className="tab-content tab-content-3 typography">
                                        <div className="update_class d-flex align-items-center justify-content-center">
                                            <h1>Past Psychiatric History</h1>
                                        </div>
                                        <Row className='d-flex justify-content-around'>
                                            <Col md={7}>
                                                <Form className='mt-4'>
                                                    <Form.Group as={Row} className="mb-2 text-start" >
                                                        <Form.Label column sm="7">Has the patient been diagnosed with any medical or mental health condition? </Form.Label>
                                                        <Col sm="5" className='d-flex align-items-center justify-content-start'>
                                                            <Form.Check
                                                                type="radio"
                                                                label="Yes"
                                                                name="diagnosis"
                                                                value="Yes"
                                                                checked={psychiatricData.diagnosis === 'Yes'}
                                                                onChange={handleCheckChange}
                                                            />
                                                            <Form.Check
                                                                type="radio"
                                                                label="No"
                                                                name="diagnosis"
                                                                checked={psychiatricData.diagnosis === 'No'}
                                                                onChange={handleCheckChange}
                                                                value="No"
                                                            />
                                                        </Col>
                                                    </Form.Group>
                                                    {psychiatricData.diagnosis === 'Yes' && (
                                                        <Form.Group as={Row} className="mb-1">
                                                            <Form.Label column sm="7" className='text-start'>If yes, please specify:</Form.Label>
                                                            <Col sm="5">
                                                                <Form.Control
                                                                    type="text"
                                                                    name="specify_diagnosis"
                                                                    value={psychiatricData.specify_diagnosis}
                                                                    onChange={handleInputChange2}
                                                                    required
                                                                />
                                                            </Col>
                                                        </Form.Group>
                                                    )}
                                                    <Form.Group as={Row} className="mb-1">
                                                        <Form.Label column sm="7" className='text-start'>When Was the Patient First Referred to Psychiatry?</Form.Label>
                                                        <Col sm="5">
                                                            <Form.Control
                                                                type="text"
                                                                name="specify_diagnosis"
                                                                value={psychiatricData.psychiatry_referal}
                                                                onChange={handleInputChange2}
                                                                required
                                                            />
                                                        </Col>
                                                    </Form.Group>
                                                    <Form.Group as={Row} className="mb-2 text-start" >
                                                        <Form.Label column sm="7">Has the patient received treatment for mental illness from a General Practitioner (GP)? </Form.Label>
                                                        <Col sm="5" className='d-flex align-items-center justify-content-start'>
                                                            <Form.Check
                                                                type="radio"
                                                                label="Yes"
                                                                name="treatment_GP"
                                                                value="Yes"
                                                                checked={psychiatricData.treatment_GP === 'Yes'}
                                                                onChange={handleCheckChange}
                                                            />
                                                            <Form.Check
                                                                type="radio"
                                                                label="No"
                                                                name="treatment_GP"
                                                                checked={psychiatricData.treatment_GP === 'No'}
                                                                onChange={handleCheckChange}
                                                                value="No"
                                                            />
                                                        </Col>
                                                    </Form.Group>
                                                    {psychiatricData.treatment_GP === 'Yes' && (
                                                        <Form.Group as={Row} className="mb-1">
                                                            <Form.Label column sm="7" className='text-start'>If yes, please specify:</Form.Label>
                                                            <Col sm="5">
                                                                <Form.Control
                                                                    type="text"
                                                                    name="specify_GP"
                                                                    value={psychiatricData.specify_GP}
                                                                    onChange={handleInputChange2}
                                                                    required
                                                                />
                                                            </Col>
                                                        </Form.Group>
                                                    )}
                                                    <Form.Group as={Row} className="mb-3">
                                                        <Form.Label column sm="4" className="text-start">
                                                            Previous Treatments
                                                        </Form.Label>
                                                        <Col sm="8">
                                                            <Row>
                                                                <Col sm={4}>
                                                                    <Form.Control
                                                                        type="text"
                                                                        name="treatment_name"
                                                                        placeholder="Treatment"
                                                                        value={psychiatricData.treatment_name}
                                                                        onChange={handleInputChange2}
                                                                        required
                                                                    />
                                                                </Col>
                                                                <Col sm={4}>
                                                                    <Form.Control
                                                                        type="date"
                                                                        name="treatment_date"
                                                                        value={psychiatricData.treatment_date}
                                                                        onChange={handleInputChange2}
                                                                        required
                                                                    />
                                                                </Col>
                                                                <Col sm={4}>
                                                                    <Form.Control
                                                                        type="text"
                                                                        name="treatment_effectiveness"
                                                                        placeholder="Effectiveness"
                                                                        value={psychiatricData.treatment_effectiveness}
                                                                        onChange={handleInputChange2}
                                                                        required
                                                                    />
                                                                </Col>
                                                            </Row>
                                                        </Col>
                                                    </Form.Group>
                                                    <Form.Group as={Row} className="mb-1">
                                                        <Form.Label column sm="7" className='text-start'>Previous Detentions Under the Mental Health Act:</Form.Label>
                                                        <Col sm="5">
                                                            <Form.Control
                                                                type="text"
                                                                name="mental_act"
                                                                value={psychiatricData.mental_act}
                                                                onChange={handleInputChange2}
                                                                required
                                                            />
                                                        </Col>
                                                    </Form.Group>
                                                    <Form.Group as={Row} className="mb-1">
                                                        <Form.Label column sm="7" className='text-start'>Previous deliberate self harm:</Form.Label>
                                                        <Col sm="5">
                                                            <Form.Control
                                                                type="text"
                                                                name="self_harm"
                                                                value={psychiatricData.self_harm}
                                                                onChange={handleInputChange2}
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

