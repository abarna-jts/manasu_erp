import React from 'react';
import { Breadcrumb, Container, Row, Col, Form, InputGroup, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Alert } from "react-bootstrap";

function Annual_Report() {
    const [validated, setValidated] = useState(false);
    const [step, setStep] = useState(1);

    const [formData, setFormData] = useState({
        event_type: 'event',
        event_name: '',
        awareness_name: '',
        outing_name: '',
        event_date: '',
        event_place: '',
        event_rescue_count: '',
        awarness_date: '',
        awarness_place: '',
        awarness_rescue_count: '',
        outing_date: '',
        outing_place: '',
        outing_rescue_count: '',
        event_report: '',
        awarness_report: '',
        outing_report: '',
        celebration_name: '',
        celebration_date: '',
        celebration_place: '',
        celebration_rescue_count: '',
        celebration_report: '',
        program_name: '',
        program_date: '',
        program_place: '',
        program_rescue_count: '',
        program_report: '',
        staff_name: '',
        staff_date: '',
        staff_place: '',
        staff_rescue_count: '',
        staff_report: ''
    })

    //alert box values
    const [submissionMessage, setSubmissionMessage] = useState("");
    const [messageType, setMessageType] = useState(""); // 'success' or 'danger'

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const apiRoute = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
    });

    const handleNext = (event) => {
        const form = event.currentTarget;
        event.preventDefault(); // stop default submit behavior
        event.stopPropagation(); // stop bubbling

        if (form.checkValidity()) {
            // Proceed to next form if valid
            console.log("Form is valid, go to next step");
            setStep(2);
        }

        setValidated(true);
    };

    const handleGeneral = (event) => {
        const form = event.currentTarget;
        event.preventDefault(); // stop default submit behavior
        event.stopPropagation(); // stop bubbling

        if (form.checkValidity()) {
            // Proceed to next form if valid
            console.log("Form is valid, go to next step");
            setStep(3);
        }

        setValidated(true);
    }

    const handleCommunity = (event) => {
        const form = event.currentTarget;
        event.preventDefault(); // stop default submit behavior
        event.stopPropagation(); // stop bubbling

        if (form.checkValidity()) {
            // Proceed to next form if valid
            console.log("Form is valid, go to next step");
            setStep(4);
        }

        setValidated(true);
    }

    const handleInternship = (event) => {
        const form = event.currentTarget;
        event.preventDefault(); // stop default submit behavior
        event.stopPropagation(); // stop bubbling

        if (form.checkValidity()) {
            // Proceed to next form if valid
            console.log("Form is valid, go to next step");
            setStep(5);
        }

        setValidated(true);
    }

    const handleSubmitAll = async (e) => {
        e.preventDefault();

        try {
            const response = await apiRoute.post("/formality/createAnnualReport", formData);
            console.log(response);
            alert('Annual Report Form Created successfully!');
            window.location.reload();
        } catch (err) {
            console.error(err);
            alert('Submission failed.');
        }
    }

    const handleBack = () => {
        setStep(1);
    };
    const handleBack1 = () => {
        setStep(2);
    }
    const handleBack3 = () => {
        setStep(3);
    }

    const navigate = useNavigate();
    const handleViewAll = (id) => {
        navigate(`/view_annualReport`);
    };

    const handleEventSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await apiRoute.post("/formality/createEventReport", formData);
            console.log(response);

            if (response.data.message === "Event Report Form Created Successfully") {
                setSubmissionMessage("Form submitted successfully!");
                setMessageType("success");

                setTimeout(() => window.location.reload(), 3000);
            } else {
                setSubmissionMessage("Submission failed.");
                setMessageType("danger");
            }

            setStep(2);
        } catch (error) {
            console.error("Error submitting form", error.response?.data || error.message);
            setSubmissionMessage("Something went wrong.");
            setMessageType("danger");
        }
    }

    const handleCelebrationSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await apiRoute.post("/formality/createCelebrationReport", formData);
            console.log(response);

            if (response.data.message === "Celebration Report Form Created Successfully") {
                setSubmissionMessage("Form Submitted Successfully!");
                setMessageType("success");
                setTimeout(() => window.location.reload(), 3000);
            } else {
                setSubmissionMessage("Submission failed.");
                setMessageType("danger");
            }
        } catch (error) {
            console.error("Error submitting form", error.response?.data || error.message);
            setSubmissionMessage("Something went wrong.");
            setMessageType("danger");

        }

    }

    const handleCommunitySubmit =  async (e) =>{
        e.preventDefault();
        try{
            const reponse = await apiRoute.post("/formality/createCommunityReport", formData);
            console.log(reponse);
            if (reponse.data.message === "Community Report Form Created Successfully") {
                setSubmissionMessage("Form Submitted Successfully!");
                setMessageType("success");
                setTimeout(() => window.location.reload(), 3000);
            } else {
                setSubmissionMessage("Submission failed.");
                setMessageType("danger");
            }
        }catch (error) {   
            console.error("Error submitting form", error.response?.data || error.message);
            setSubmissionMessage("Something went wrong.");
            setMessageType("danger");
        }   
    }

    const handleStaffSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await apiRoute.post("/formality/createStaffReport", formData);
            console.log(response);

            if (response.data.message === "Staff Report Form Created Successfully") {
                setSubmissionMessage("Form Submitted Successfully!");
                setMessageType("success");
                setTimeout(() => window.location.reload(), 3000);
            } else {
                setSubmissionMessage("Submission failed.");
                setMessageType("danger");
            }
        } catch (error) {
            console.error("Error submitting form", error.response?.data || error.message);
            setSubmissionMessage("Something went wrong.");
            setMessageType("danger");
        }
    }

 const totalSteps = 5;

    const steps = [
        "Event / Awareness / Outing Details",
        "General Celebration Details",
        "Community Programs",
        "Staff Programs",
    ];

    return (
        <>
            <Container fluid>
                <Row className='d-flex align-items-center justify-content-between'>
                    <Col md={2} className='text-start'>
                        <Breadcrumb className="d-none d-md-inline-block mb-0" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
                            <Breadcrumb.Item></Breadcrumb.Item>
                            <Breadcrumb.Item>Home</Breadcrumb.Item>
                            <Breadcrumb.Item active>Admin Formality</Breadcrumb.Item>
                        </Breadcrumb>
                        <h6 className="breadcrumb_title">Report</h6>
                    </Col>
                    <Col md={8} className="text-start mb-4">
                        <h3 className="section_title">Resident Activities and Events Report Form</h3>
                    </Col>
                </Row>
            </Container>

             {/* Step Progress UI */}
            <div className="step-progressbar mb-4">
                {steps.map((label, index) => {
                    const stepNumber = index + 1;
                    const isActive = stepNumber === step;
                    const isCompleted = stepNumber < step;

                    return (
                        <div
                            key={index}
                            className={`step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}
                        >
                            <div className="step-number">{stepNumber}</div>
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



            {step === 1 && (
                <Container>
                    <Row className='d-flex align-items-center justify-content-center'>
                        <Col md={6}>
                            <Row className='d-flex align-items-center justify-content-between'>
                                <Col md={8} className="text-start">
                                    <h3 className="annual_section_title mt-3">Event / Awareness / Outing Details</h3>
                                </Col>
                                <Col md={4} className="text-start d-flex align-items-center justify-content-end">
                                    <Button type='button' className='btn btn-success' onClick={handleViewAll}>View All</Button>
                                </Col>
                            </Row>

                            <Form noValidate validated={validated} onSubmit={handleEventSubmit}>
                                {/* Dropdown for selecting type */}
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="4" className='text-start'>Select Type:</Form.Label>
                                    <Col sm="8">
                                        <Form.Select
                                            name="event_type"
                                            value={formData.event_type}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">-- Select --</option>
                                            <option value="event">Event</option>
                                            <option value="awareness">Awareness</option>
                                            <option value="outing">Outing</option>
                                        </Form.Select>
                                    </Col>
                                </Form.Group>

                                {/* Conditionally render name fields */}
                                {formData.event_type === 'event' && (
                                    <>
                                        <Form.Group as={Row} className="mb-3">
                                            <Form.Label column sm="4" className='text-start'>Name of the Event:</Form.Label>
                                            <Col sm="8">
                                                <Form.Control
                                                    type="text"
                                                    name="event_name"
                                                    value={formData.event_name}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </Col>
                                        </Form.Group>
                                        <Form.Group as={Row} className="mb-3">
                                            <Form.Label column sm="4" className='text-start'>Date:</Form.Label>
                                            <Col sm="8">
                                                <Form.Control
                                                    type="date"
                                                    name="event_date"
                                                    value={formData.event_date}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </Col>
                                        </Form.Group>

                                        <Form.Group as={Row} className="mb-3">
                                            <Form.Label column sm="4" className='text-start'>Venue:</Form.Label>
                                            <Col sm="8">
                                                <Form.Control
                                                    type="text"
                                                    name="event_place"
                                                    value={formData.event_place}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </Col>
                                        </Form.Group>

                                        <Form.Group as={Row} className="mb-3">
                                            <Form.Label column sm="4" className='text-start'>No. of Participants:</Form.Label>
                                            <Col sm="8">
                                                <Form.Control
                                                    type="text"
                                                    name="event_rescue_count"
                                                    value={formData.event_rescue_count}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </Col>
                                        </Form.Group>

                                        <Form.Group as={Row} className="mb-3">
                                            <Form.Label column sm="4" className='text-start'>Event Report:</Form.Label>
                                            <Col sm="8">
                                                <Form.Control
                                                    as="textarea"
                                                    name="event_report"
                                                    rows={3}
                                                    value={formData.event_report}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </Col>
                                        </Form.Group>

                                    </>

                                )}

                                {formData.event_type === 'awareness' && (
                                    <>
                                        <Form.Group as={Row} className="mb-3">
                                            <Form.Label column sm="4" className='text-start'>Awareness Camp Name:</Form.Label>
                                            <Col sm="8">
                                                <Form.Control
                                                    type="text"
                                                    name="awareness_name"
                                                    value={formData.awareness_name}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </Col>
                                        </Form.Group>
                                        <Form.Group as={Row} className="mb-3">
                                            <Form.Label column sm="4" className='text-start'>Date:</Form.Label>
                                            <Col sm="8">
                                                <Form.Control
                                                    type="date"
                                                    name="awarness_date"
                                                    value={formData.awarness_date}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </Col>
                                        </Form.Group>

                                        <Form.Group as={Row} className="mb-3">
                                            <Form.Label column sm="4" className='text-start'>Venue:</Form.Label>
                                            <Col sm="8">
                                                <Form.Control
                                                    type="text"
                                                    name="awarness_place"
                                                    value={formData.awarness_place}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </Col>
                                        </Form.Group>

                                        <Form.Group as={Row} className="mb-3">
                                            <Form.Label column sm="4" className='text-start'>No. of Participants:</Form.Label>
                                            <Col sm="8">
                                                <Form.Control
                                                    type="text"
                                                    name="awarness_rescue_count"
                                                    value={formData.awarness_rescue_count}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </Col>
                                        </Form.Group>
                                        <Form.Group as={Row} className="mb-3">
                                            <Form.Label column sm="4" className='text-start'>Awareness Report:</Form.Label>
                                            <Col sm="8">
                                                <Form.Control
                                                    as="textarea"
                                                    name="awarness_report"
                                                    rows={3}
                                                    value={formData.awarness_report}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </Col>
                                        </Form.Group>
                                    </>

                                )}

                                {formData.event_type === 'outing' && (
                                    <>
                                        <Form.Group as={Row} className="mb-3">
                                            <Form.Label column sm="4" className='text-start'>Outing Name:</Form.Label>
                                            <Col sm="8">
                                                <Form.Control
                                                    type="text"
                                                    name="outing_name"
                                                    value={formData.outing_name}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </Col>
                                        </Form.Group>
                                        <Form.Group as={Row} className="mb-3">
                                            <Form.Label column sm="4" className='text-start'>Date:</Form.Label>
                                            <Col sm="8">
                                                <Form.Control
                                                    type="date"
                                                    name="outing_date"
                                                    value={formData.outing_date}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </Col>
                                        </Form.Group>

                                        <Form.Group as={Row} className="mb-3">
                                            <Form.Label column sm="4" className='text-start'>Venue:</Form.Label>
                                            <Col sm="8">
                                                <Form.Control
                                                    type="text"
                                                    name="outing_place"
                                                    value={formData.outing_place}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </Col>
                                        </Form.Group>

                                        <Form.Group as={Row} className="mb-3">
                                            <Form.Label column sm="4" className='text-start'>No. of Participants:</Form.Label>
                                            <Col sm="8">
                                                <Form.Control
                                                    type="text"
                                                    name="outing_rescue_count"
                                                    value={formData.outing_rescue_count}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </Col>
                                        </Form.Group>
                                        <Form.Group as={Row} className="mb-3">
                                            <Form.Label column sm="4" className='text-start'>Outing Report:</Form.Label>
                                            <Col sm="8">
                                                <Form.Control
                                                    as="textarea"
                                                    name="outing_report"
                                                    rows={3}
                                                    value={formData.outing_report}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </Col>
                                        </Form.Group>
                                    </>

                                )}



                                <Col md={12} className='d-flex align-items-center justify-content-end'>
                                    <Button variant='btn btn-primary' className='m-1' type="submit">Submit</Button>
                                    <Button variant="outline-primary" className="m-1" type="button" onClick={handleNext}>
                                        <FontAwesomeIcon icon={faArrowRight} className="me-2" /> Next
                                    </Button>
                                </Col>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            )}

            {step === 2 && (
                <Container>
                    <Row className='d-flex align-items-center justify-content-center'>
                        <Col md={6}>
                            <Col md={12} className="text-start">
                                <h3 className="annual_section_title mt-3">General Celebration Details</h3>
                            </Col>
                            <Form noValidate validated={validated} onSubmit={handleCelebrationSubmit}>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="4" className='text-start'>
                                        Name of the Celebration :
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Select
                                            name="celebration_name"
                                            value={formData.celebration_name}
                                            onChange={handleInputChange}
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
                                            value={formData.celebration_date}
                                            onChange={handleInputChange}
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
                                            value={formData.celebration_place}
                                            onChange={handleInputChange}
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
                                            value={formData.celebration_rescue_count}
                                            onChange={handleInputChange}
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
                                            value={formData.celebration_report}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </Col>
                                </Form.Group>
                                <Col md={12} className='d-flex align-items-center justify-content-between'>
                                    <Button variant="outline-primary" className="m-1" onClick={handleBack}>
                                        <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Back
                                    </Button>
                                    <Button variant="btn btn-primary" className="m-1" type='submit'>Submit
                                    </Button>
                                    <Button variant="outline-primary" className="m-1" type="button" onClick={handleGeneral}>
                                        <FontAwesomeIcon icon={faArrowRight} className="me-2" /> Next
                                    </Button>
                                </Col>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            )}

            {step === 3 && (
                <Container>
                    <Row className='d-flex align-items-center justify-content-center'>
                        <Col md={6}>
                            <Col md={12} className="text-start">
                                <h3 className="annual_section_title mt-3">Community Programs</h3>
                            </Col>
                            <Form noValidate validated={validated} onSubmit={handleCommunitySubmit}>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="4" className='text-start'>
                                        Name of the Program :
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control type="text"
                                            name="program_name"
                                            value={formData.program_name}
                                            onChange={handleInputChange}
                                            required />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="4" className='text-start'>
                                        Date:
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control type="date"
                                            name="program_date"
                                            value={formData.program_date}
                                            onChange={handleInputChange}
                                            required />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="4" className='text-start'>
                                        Venue :
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control type="text"
                                            name="program_place"
                                            value={formData.program_place}
                                            onChange={handleInputChange}
                                            required />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="4" className='text-start'>
                                        No. of Participants
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control type="text"
                                            name="program_rescue_count"
                                            value={formData.program_rescue_count}
                                            onChange={handleInputChange}
                                            required />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="4" className='text-start'>Report:</Form.Label>
                                    <Col sm="8">
                                        <Form.Control
                                            as="textarea"
                                            name="program_report"
                                            rows={3}
                                            value={formData.program_report}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </Col>
                                </Form.Group>
                                <Col md={12} className='d-flex align-items-center justify-content-between'>
                                    <Button variant="outline-primary" className="m-1" onClick={handleBack1}>
                                        <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Back
                                    </Button>
                                    <Button variant='btn btn-primary' className='m-1' type='submit'>Submit</Button>
                                    <Button variant="outline-primary" className="m-1" type="button" onClick={handleCommunity}>
                                        <FontAwesomeIcon icon={faArrowRight} className="me-2" /> Next
                                    </Button>
                                </Col>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            )}

            {step === 4 && (
                <Container>
                    <Row className='d-flex align-items-center justify-content-center'>
                        <Col md={6}>
                            <Col md={12} className="text-start">
                                <h3 className="annual_section_title mt-3">Staff Programs</h3>
                            </Col>
                            <Form noValidate validated={validated} onSubmit={handleStaffSubmit}>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="4" className='text-start'>
                                        Name of the Programs :
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control type="text"
                                            name="staff_name"
                                            value={formData.staff_name}
                                            onChange={handleInputChange}
                                            required />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="4" className='text-start'>
                                        Date:
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control type="date"
                                            name="staff_date"
                                            value={formData.staff_date}
                                            onChange={handleInputChange}
                                            required />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="4" className='text-start'>
                                        Venue :
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control type="text"
                                            name="staff_place"
                                            value={formData.staff_place}
                                            onChange={handleInputChange}
                                            required />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="4" className='text-start'>
                                        No. of Participants
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control type="text"
                                            name="staff_rescue_count"
                                            value={formData.staff_rescue_count}
                                            onChange={handleInputChange}
                                            required />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="4" className='text-start'>Report:</Form.Label>
                                    <Col sm="8">
                                        <Form.Control
                                            as="textarea"
                                            name="staff_report"
                                            rows={3}
                                            value={formData.staff_report}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </Col>
                                </Form.Group>
                                <Col md={12} className='d-flex align-items-center justify-content-between'>
                                    <Button variant="outline-primary" className="m-1" onClick={handleBack3}>
                                        <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Back
                                    </Button>
                                    <Button variant="btn btn-primary" className="m-1" type="submit"> Submit
                                    </Button>
                                </Col>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            )}




        </>
    )
}

export default Annual_Report
