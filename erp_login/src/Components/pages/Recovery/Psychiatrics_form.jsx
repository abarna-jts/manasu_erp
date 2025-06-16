import React from 'react';
import { Container, Row, Col, Breadcrumb, InputGroup, Button, Form } from "react-bootstrap";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import Cookies from 'js-cookie';
import axios from 'axios';

function Psychiatrics_form() {
    const [admission_no, setAdmissionNumber] = useState('');
    const [rescueImage, setRescueImage] = useState(null);
    const [rescueName, setRescueName] = useState("");
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
        patient_name: '',
        patient_age: '',
        patient_phone: '',
        patient_address: '',
        patient_dob: '',
        patient_gender: 'Male',
        patient_status: '',
        referred_by: '',
        referral_reason: ''
    });

    const [historyData, setHistoryData] = useState({
        patient_history:'',
        current_mental:'',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
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

                                <input type="radio" name="pcss3t" id="tab7" className="tab-content-7" />
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
                                            <Col md={7}>
                                                <Form className='mt-4' onSubmit={handleSubmit}>
                                                    <Form.Group as={Row} className="mb-2 text-start" >
                                                        <Form.Label column sm="3">Full Name: </Form.Label>
                                                        <Col sm="9">
                                                            <Form.Control type='text'
                                                                name='patient_name'
                                                                value={formData.patient_name}
                                                                onChange={handleInputChange}
                                                                required
                                                            />
                                                        </Col>
                                                    </Form.Group>

                                                    <Form.Group as={Row} className="mb-2 text-start" >
                                                        <Form.Label column sm="3">Age: </Form.Label>
                                                        <Col sm="9">
                                                            <Form.Control type='text'
                                                                name='patient_age'
                                                                value={formData.patient_age}
                                                                onChange={handleInputChange}
                                                                required
                                                            />
                                                        </Col>
                                                    </Form.Group>

                                                    <Form.Group as={Row} className="mb-2 text-start" >
                                                        <Form.Label column sm="3">Date of Birth: </Form.Label>
                                                        <Col sm="9">
                                                            <Form.Control type='date'
                                                                name='patient_dob'
                                                                value={formData.patient_dob}
                                                                onChange={handleInputChange}
                                                                required
                                                            />
                                                        </Col>
                                                    </Form.Group>

                                                    <Form.Group as={Row} className="mb-2 text-start" >
                                                        <Form.Label column sm="3">Gender: </Form.Label>
                                                        <Col sm="9">
                                                            <Form.Control type='text'
                                                                name='patient_gender'
                                                                value={formData.patient_gender}
                                                                onChange={handleInputChange}
                                                                readOnly
                                                            />
                                                        </Col>
                                                    </Form.Group>

                                                    <Form.Group as={Row} className="mb-2 text-start" >
                                                        <Form.Label column sm="3">Marital Status: </Form.Label>
                                                        <Col sm="9">
                                                            <Form.Select aria-label="Default select example"
                                                                name='patient_status' required>
                                                                <option>Select Status</option>
                                                                <option value="1">Single</option>
                                                                <option value="2">Married</option>
                                                            </Form.Select>
                                                        </Col>
                                                    </Form.Group>

                                                    <Form.Group as={Row} className="mb-2 text-start" >
                                                        <Form.Label column sm="3">Phone Number: </Form.Label>
                                                        <Col sm="9">
                                                            <Form.Control type='text'
                                                                name='patient_phone'
                                                                value={formData.patient_phone}
                                                                onChange={handleInputChange}
                                                                required
                                                            />
                                                        </Col>
                                                    </Form.Group>

                                                    <Form.Group as={Row} className="mb-2 text-start" >
                                                        <Form.Label column sm="3">Permanent Address: </Form.Label>
                                                        <Col sm="9">
                                                            <Form.Control type='text'
                                                                name='patient_address'
                                                                value={formData.patient_address}
                                                                onChange={handleInputChange}
                                                                required
                                                            />
                                                        </Col>
                                                    </Form.Group>

                                                    <Form.Group as={Row} className="mb-2 text-start" >
                                                        <Form.Label column sm="3">Reffered By: </Form.Label>
                                                        <Col sm="9">
                                                            <Form.Control type='text'
                                                                name='referred_by'
                                                                value={formData.referred_by}
                                                                onChange={handleInputChange}
                                                                required
                                                            />
                                                        </Col>
                                                    </Form.Group>

                                                    <Form.Group as={Row} className="mb-2 text-start" >
                                                        <Form.Label column sm="3">Referral Reason: </Form.Label>
                                                        <Col sm="9">
                                                            <Form.Control as="textarea" rows={3}
                                                                name='referral_reason'
                                                                value={formData.referral_reason}
                                                                onChange={handleInputChange}
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
                                    {/* Basic details END*/}

                                    {/* Clinical History START*/}
                                    <li className="tab-content tab-content-2 typography">
                                        <div className="update_class d-flex align-items-center">
                                            <h1>Presenting Complaint & History of Presenting Illness</h1>

                                            <Form>
                                                <Row>
                                                    <Col md={7}>
                                                        <Form.Group as={Row} className="mb-2 text-start" >
                                                            <Form.Label column sm="3">Patient's History in their own words: </Form.Label>
                                                            <Col sm="9">
                                                                <Form.Control as="textarea" rows={3}
                                                                    name='patient_history'
                                                                    value={historyData.patient_history}
                                                                    onChange={handleInputChange}
                                                                    required />
                                                            </Col>
                                                        </Form.Group>
                                                        <Form.Group as={Row} className="mb-2 text-start" >
                                                            <Form.Label column sm="3">Current Mental Health Complaints: </Form.Label>
                                                            <Col sm="9">
                                                                <Form.Control as="textarea" rows={3}
                                                                    name='current_mental'
                                                                    value={historyData.current_mental}
                                                                    onChange={handleInputChange}
                                                                    required />
                                                            </Col>
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={5}>
                                                    </Col>
                                                </Row>
                                            </Form>
                                        </div>
                                    </li>
                                    {/* Clinical History END*/}

                                    {/* Psychiatric History START*/}
                                    <li className="tab-content tab-content-3 typography">
                                        <div className="update_class d-flex align-items-center">
                                            <h1>Past Psychiatric History</h1>

                                        </div>
                                    </li>
                                    {/* Psychiatric History END*/}

                                    {/* Medical & Drug History START*/}
                                    <li className="tab-content tab-content-4 typography">
                                        <div className="update_class d-flex align-items-center">
                                            <h1>Past Medical & Drug History</h1>

                                        </div>
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
                                        <div className="update_class d-flex align-items-center">
                                            <h1>Premorbid Personality </h1>

                                        </div>
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
            </Container>



        </>
    )
}

export default Psychiatrics_form

