import React from 'react';
import { Container, Row, Col, Breadcrumb, InputGroup, Button, Form } from "react-bootstrap";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import Cookies from 'js-cookie';
import axios from 'axios';

function Psychiatrics_form() {
    const [admission_no, setAdmissionNumber] = useState('');
    const [validated, setValidated] = useState(false);
    const [step, setStep] = useState(1);
    const [isStep1Invalid, setIsStep1Invalid] = useState(false);
    const [isStep2Invalid, setIsStep2Invalid] = useState(false);
    const [isStep3Invalid, setIsStep3Invalid] = useState(false);
    const [isStep4Invalid, setIsStep4Invalid] = useState(false);

    const apiRoute = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
    });

    const [submissionMessage, setSubmissionMessage] = useState("");
    const [messageType, setMessageType] = useState(""); // 'success' or 'danger'

    const totalSteps = 5;

    const steps = [
        "Event / Awareness / Outing Details",
        "General Celebration Details",
        "Community Programs",
        "Staff Programs",
    ];

    const userType = Cookies.get('usertype');

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
                <div className="text-center col-md-8"><h3 className="section_title">Psychatrics Case History</h3></div>

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

            {/* Step Progress UI */}
            <div className="step-progressbar mb-4">
                {steps.map((label, index) => {
                    const stepNumber = index + 1;
                    const isActive = stepNumber === step;
                    const isCompleted = stepNumber < step;

                    const isInvalid =
                        (stepNumber === 1 && isStep1Invalid) ||
                        (stepNumber === 2 && isStep2Invalid) ||
                        (stepNumber === 3 && isStep3Invalid) ||
                        (stepNumber === 4 && isStep4Invalid);

                    return (
                        <div
                            key={index}
                            className={`step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}
                        >
                            <div
                                className="step-number"
                                style={{
                                    color: isInvalid ? 'white' : 'inherit',
                                    fontWeight: isInvalid ? 'bold' : 'normal',
                                    background: isInvalid ? 'red' : '#84c342',
                                }}
                            >
                                {stepNumber}
                            </div>
                            <div className="step-label">{label}</div>
                        </div>
                    );
                })}
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
                                    value={admission_no}
                                    onChange={(e) => setAdmissionNumber(e.target.value)}
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
                    <Col md={10}>
                        {step === 1 && (
                            <Container>
                                <Row className='d-flex align-items-center justify-content-center'>
                                    <Col md={6}>
                                        <Row className='d-flex align-items-center justify-content-between'>
                                            <Col md={8} className="text-start">
                                                <h3 className="annual_section_title mt-3">General Celebration Details</h3>
                                            </Col>
                                            {/* <Col md={4} className="text-start d-flex align-items-center justify-content-end">
                                                            <Button type='button' className='btn btn-success' onClick={handleViewAll}>View All</Button>
                                                        </Col> */}
                                        </Row>

                                        <Form noValidate validated={validated}>
                                            <Form.Group as={Row} className="mb-3">
                                                <Form.Label column sm="4" className='text-start'>
                                                    Name of the Celebration :
                                                </Form.Label>
                                                <Col sm="8">
                                                    <Form.Select
                                                        name="celebration_name"
                                                        required
                                                    >
                                                        <option value="">-- Select --</option>
                                                        <option value="Christmas">Christmas</option>
                                                        <option value="Pongal">Pongal</option>
                                                        <option value="Diwali">Diwali</option>
                                                        <option value="Manasu Day">Manasu Day</option>
                                                        <option value="Independence Day">Independence Day</option>
                                                        <option value="Republic Day">Republic Day</option>
                                                        <option value="Any other">Any other</option>
                                                    </Form.Select>
                                                </Col>
                                            </Form.Group>
                                            <Form.Group as={Row} className="mb-3">
                                                <Form.Label column sm="4" className='text-start'>
                                                    Date:
                                                </Form.Label>
                                                <Col sm="8">
                                                    <Form.Control type="date"
                                                        name="celebration_date"
                                                        required />
                                                </Col>
                                            </Form.Group>
                                            <Form.Group as={Row} className="mb-3">
                                                <Form.Label column sm="4" className='text-start'>
                                                    Venue :
                                                </Form.Label>
                                                <Col sm="8">
                                                    <Form.Control type="text"
                                                        name="celebration_place"
                                                        required />
                                                </Col>
                                            </Form.Group>
                                            <Form.Group as={Row} className="mb-3">
                                                <Form.Label column sm="4" className='text-start'>
                                                    No. of Participants
                                                </Form.Label>
                                                <Col sm="8">
                                                    <Form.Control type="text"
                                                        name="celebration_rescue_count"
                                                        required />
                                                </Col>
                                            </Form.Group>
                                            <Form.Group as={Row} className="mb-3">
                                                <Form.Label column sm="4" className='text-start'>Celebration Report:</Form.Label>
                                                <Col sm="8">
                                                    <Form.Control
                                                        as="textarea"
                                                        name="celebration_report"
                                                        rows={3}
                                                        required
                                                    />
                                                </Col>
                                            </Form.Group>
                                            <Col md={12} className='d-flex align-items-center justify-content-between'>
                                                <Button variant="outline-secondary" className="m-1">
                                                    <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Back
                                                </Button>
                                                <Button variant="btn btn-success" className="m-1" type='submit'>Submit
                                                </Button>
                                                <Button variant="outline-success" className="m-1" type="button">
                                                    <FontAwesomeIcon icon={faArrowRight} className="me-2" /> Next
                                                </Button>
                                            </Col>
                                        </Form>
                                    </Col>
                                </Row>
                            </Container>
                        )}
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Psychiatrics_form

