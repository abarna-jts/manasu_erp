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
    const [isStep1Invalid, setIsStep1Invalid] = useState(false);
    const [isStep2Invalid, setIsStep2Invalid] = useState(false);
    const [isStep3Invalid, setIsStep3Invalid] = useState(false);
    const [isStep4Invalid, setIsStep4Invalid] = useState(false);
    const [eventPhotos, setEventPhotos] = useState(null);


    const [staffData, setStaffData] = useState({
        staff_name: '',
        staff_date: '',
        staff_place: '',
        staff_rescue_count: '',
        staff_report: ''
    })

    const [eventData, setEventData] = useState({
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
    })

    const [celebrationData, setCelebrationData] = useState({
        celebration_name: '',
        celebration_date: '',
        celebration_place: '',
        celebration_rescue_count: '',
        celebration_report: '',
        other_celebration: ''
    })

    const [programData, setProgramData] = useState({
        program_name: '',
        clg_name: '',
        clg_dept: '',
        resource_person: '',
        program_date: '',
        program_place: '',
        program_rescue_count: '',
        program_report: '',
    })

    //alert box values
    const [submissionMessage, setSubmissionMessage] = useState("");
    const [messageType, setMessageType] = useState(""); // 'success' or 'danger'

    const handleInputChange = (e) => {
        setEventData({ ...eventData, [e.target.name]: e.target.value });
    };

    const handleInputChange1 = (e) => {
        setCelebrationData({ ...celebrationData, [e.target.name]: e.target.value });
    };

    const handleInputChange2 = (e) => {
        setProgramData({ ...programData, [e.target.name]: e.target.value });
    };

    const handleInputChange3 = (e) => {
        setStaffData({ ...staffData, [e.target.name]: e.target.value });
    };

    const apiRoute = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
    });

    const handleNext = (event) => {
        // Always go to Step 2
        setStep(2);

        // Check if event_type is selected
        if (!eventData.event_type) {
            setIsStep1Invalid(true);
            return;
        }

        // Validate required fields based on selected type
        const requiredFields = {
            event: ["event_name", "event_date", "event_place", "event_rescue_count", "event_report"],
            awareness: ["awareness_name", "awarness_date", "awarness_place", "awarness_rescue_count", "awarness_report"],
            outing: ["outing_name", "outing_date", "outing_place", "outing_rescue_count", "outing_report"],
        };

        const fields = requiredFields[eventData.event_type];
        const allFilled = fields.every(field => eventData[field]);

        // Update red color status
        setIsStep1Invalid(!allFilled); // if not filled, set to true
    };


    const handleGeneral = (event) => {
        // Always go to Step 3
        setStep(3);

        // No need to check for event_type here

        const requiredFields = [
            "celebration_name",
            "celebration_date",
            "celebration_place",
            "celebration_rescue_count",
            "celebration_report"
        ];

        const allFilled = requiredFields.every(field => celebrationData[field]);

        // Set red color for step 2 if invalid
        setIsStep2Invalid(!allFilled); // true if something is missing
    };


    const handleCommunity = (event) => {
        // Always go to Step 3
        setStep(4);

        // No need to check for event_type here

        const requiredFields = [
            "program_name",
            "clg_name",
            "clg_dept",
            "resource_person",
            "program_date",
            "program_place",
            "program_rescue_count",
            "program_report"
        ];

        const allFilled = requiredFields.every(field => programData[field]);

        // Set red color for step 2 if invalid
        setIsStep3Invalid(!allFilled); // true if something is missing
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

    // const handleEventSubmit = async (e) => {
    //     e.preventDefault();

    //     try {
    //         const response = await apiRoute.post("/formality/createEventReport", eventData);
    //         console.log(response);

    //         if (response.data.message === "Event Report Form Created Successfully") {
    //             setSubmissionMessage("Form submitted successfully!");
    //             setMessageType("success");
    //         } else {
    //             setSubmissionMessage("Submission failed.");
    //             setMessageType("danger");
    //         }

    //         setStep(2);
    //     } catch (error) {
    //         console.error("Error submitting form", error.response?.data || error.message);
    //         setSubmissionMessage("Something went wrong.");
    //         setMessageType("danger");
    //     }
    // }

    const [files, setFiles] = useState({
        event_photos: null,
        awarness_photos: null,
        outing_photos: null,
    });

    const handleFileChange = (e) => {
        setFiles({ ...files, [e.target.name]: e.target.files[0] });
    };

    const handleEventSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('event_type', eventData.event_type);
        data.append('event_name', eventData.event_name);
        data.append('event_date', eventData.event_date);
        data.append('event_place', eventData.event_place);
        data.append('event_rescue_count', eventData.event_rescue_count);
        data.append('event_report', eventData.event_report);
        data.append('awareness_name', eventData.awareness_name);
        data.append('awarness_date', eventData.awarness_date);
        data.append('awarness_place', eventData.awarness_place);
        data.append('awarness_rescue_count', eventData.awarness_rescue_count);
        data.append('awarness_report', eventData.awarness_report);
        data.append('outing_name', eventData.outing_name);
        data.append('outing_date', eventData.outing_date);
        data.append('outing_place', eventData.outing_place);
        data.append('outing_rescue_count', eventData.outing_rescue_count);
        data.append('outing_report', eventData.outing_report);
        data.append('event_photos', files.event_photos);
        data.append('awarness_photos', files.awarness_photos);
        data.append('outing_photos', files.outing_photos);

        try {
            const res = await apiRoute.post('/formality/createEventReport', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            console.log(res);
            if (res.data.message === "Event Report Form Created Successfully") {
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

    const handleCelebrationSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await apiRoute.post("/formality/createCelebrationReport", celebrationData);
            console.log(response);

            if (response.data.message === "Celebration Report Form Created Successfully") {
                setSubmissionMessage("Form Submitted Successfully!");
                setMessageType("success");
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

    const handleCommunitySubmit = async (e) => {
        e.preventDefault();
        try {
            const reponse = await apiRoute.post("/formality/createCommunityReport", programData);
            console.log(reponse);
            if (reponse.data.message === "Community Report Form Created Successfully") {
                setSubmissionMessage("Form Submitted Successfully!");
                setMessageType("success");
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

    const handleStaffSubmit = async (e) => {
        e.preventDefault();

        // Step 4 required fields
        const requiredFields = [
            "staff_name",
            "staff_date",
            "staff_place",
            "staff_rescue_count",
            "staff_report"
        ];

        const allFilled = requiredFields.every(field => staffData[field]);

        if (!allFilled) {
            setIsStep4Invalid(true); // Show red step number
            return;
        } else {
            setIsStep4Invalid(false);
        }

        try {
            const response = await apiRoute.post("/formality/createStaffReport", staffData);
            console.log(response);

            if (response.data.message === "Staff Report Form Created Successfully") {
                setSubmissionMessage("Form Submitted Successfully!");
                setMessageType("success");
            } else {
                setSubmissionMessage("Submission failed.");
                setMessageType("danger");
            }
        } catch (error) {
            console.error("Error submitting form", error.response?.data || error.message);
            setSubmissionMessage("Something went wrong.");
            setMessageType("danger");
        }
    };


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
                        <h3 className="section_title">Resident Activities and Events Report Form (Annual)</h3>
                    </Col>
                </Row>
            </Container>

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
                                            value={eventData.event_type}
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
                                {eventData.event_type === 'event' && (
                                    <>
                                        <Form.Group as={Row} className="mb-3">
                                            <Form.Label column sm="4" className='text-start'>Name of the Event:</Form.Label>
                                            <Col sm="8">
                                                <Form.Control
                                                    type="text"
                                                    name="event_name"
                                                    value={eventData.event_name}
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
                                                    value={eventData.event_date}
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
                                                    value={eventData.event_place}
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
                                                    value={eventData.event_rescue_count}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </Col>
                                        </Form.Group>

                                        <Form.Group as={Row} className="mb-3">
                                            <Form.Label column sm="4" className='text-start'>Attach Photos:</Form.Label>
                                            <Col sm="8">
                                                <Form.Control
                                                    type="file"
                                                    name="event_photos"
                                                    onChange={handleFileChange}
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
                                                    value={eventData.event_report}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </Col>
                                        </Form.Group>

                                    </>

                                )}

                                {eventData.event_type === 'awareness' && (
                                    <>
                                        <Form.Group as={Row} className="mb-3">
                                            <Form.Label column sm="4" className='text-start'>Awareness Camp Name:</Form.Label>
                                            <Col sm="8">
                                                <Form.Control
                                                    type="text"
                                                    name="awareness_name"
                                                    value={eventData.awareness_name}
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
                                                    value={eventData.awarness_date}
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
                                                    value={eventData.awarness_place}
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
                                                    value={eventData.awarness_rescue_count}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </Col>
                                        </Form.Group>
                                        <Form.Group as={Row} className="mb-3">
                                            <Form.Label column sm="4" className='text-start'>Attach Photos:</Form.Label>
                                            <Col sm="8">
                                                <Form.Control
                                                    type="file"
                                                    name="awarness_photos"
                                                    onChange={handleFileChange}
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
                                                    value={eventData.awarness_report}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </Col>
                                        </Form.Group>
                                    </>

                                )}

                                {eventData.event_type === 'outing' && (
                                    <>
                                        <Form.Group as={Row} className="mb-3">
                                            <Form.Label column sm="4" className='text-start'>Outing Name:</Form.Label>
                                            <Col sm="8">
                                                <Form.Control
                                                    type="text"
                                                    name="outing_name"
                                                    value={eventData.outing_name}
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
                                                    value={eventData.outing_date}
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
                                                    value={eventData.outing_place}
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
                                                    value={eventData.outing_rescue_count}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </Col>
                                        </Form.Group>
                                        <Form.Group as={Row} className="mb-3">
                                            <Form.Label column sm="4" className='text-start'>Attach Photos:</Form.Label>
                                            <Col sm="8">
                                                <Form.Control
                                                    type="file"
                                                    name="outing_photos"
                                                    onChange={handleFileChange}
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
                                                    value={eventData.outing_report}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </Col>
                                        </Form.Group>
                                    </>

                                )}



                                <Col md={12} className='d-flex align-items-center justify-content-end'>
                                    <Button variant='btn btn-success' className='m-1' type="submit">Submit</Button>
                                    <Button variant="outline-success" className="m-1" type="button" onClick={handleNext}>
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
                            <Row className='d-flex align-items-center justify-content-between'>
                                <Col md={8} className="text-start">
                                    <h3 className="annual_section_title mt-3">General Celebration Details</h3>
                                </Col>
                                <Col md={4} className="text-start d-flex align-items-center justify-content-end">
                                    <Button type='button' className='btn btn-success' onClick={handleViewAll}>View All</Button>
                                </Col>
                            </Row>

                            <Form noValidate validated={validated} onSubmit={handleCelebrationSubmit}>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="4" className='text-start'>
                                        Name of the Celebration :
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Select
                                            name="celebration_name"
                                            value={celebrationData.celebration_name}
                                            onChange={handleInputChange1}
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
                                {celebrationData.celebration_name === "Any other" && (
                                    <Form.Group as={Row} className="mb-3">
                                        <Form.Label column sm="4" className="text-start">
                                            Specify Other Celebration:
                                        </Form.Label>
                                        <Col sm="8">
                                            <Form.Control
                                                type="text"
                                                name="other_celebration"
                                                value={celebrationData.other_celebration || ""}
                                                onChange={handleInputChange1}
                                                placeholder="Enter celebration name"
                                                required
                                            />
                                        </Col>
                                    </Form.Group>
                                )}
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="4" className='text-start'>
                                        Date:
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control type="date"
                                            name="celebration_date"
                                            value={celebrationData.celebration_date}
                                            onChange={handleInputChange1}
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
                                            value={celebrationData.celebration_place}
                                            onChange={handleInputChange1}
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
                                            value={celebrationData.celebration_rescue_count}
                                            onChange={handleInputChange1}
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
                                            value={celebrationData.celebration_report}
                                            onChange={handleInputChange1}
                                            required
                                        />
                                    </Col>
                                </Form.Group>
                                <Col md={12} className='d-flex align-items-center justify-content-between'>
                                    <Button variant="outline-secondary" className="m-1" onClick={handleBack}>
                                        <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Back
                                    </Button>
                                    <Button variant="btn btn-success" className="m-1" type='submit'>Submit
                                    </Button>
                                    <Button variant="outline-success" className="m-1" type="button" onClick={handleGeneral}>
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
                            <Row className='d-flex align-items-center justify-content-center'>
                                <Col md={8} className="text-start">
                                    <h3 className="annual_section_title mt-3">Community Programs</h3>
                                </Col>
                                <Col md={4} className="text-start d-flex align-items-center justify-content-end">
                                    <Button type='button' className='btn btn-success' onClick={handleViewAll}>View All</Button>
                                </Col>
                            </Row>

                            <Form noValidate validated={validated} onSubmit={handleCommunitySubmit}>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="4" className='text-start'>
                                        Name of the Program :
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control type="text"
                                            name="program_name"
                                            value={programData.program_name}
                                            onChange={handleInputChange2}
                                            required />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="4" className='text-start'>
                                        College Name :
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control type="text"
                                            name="clg_name"
                                            value={programData.clg_name}
                                            onChange={handleInputChange2}
                                            required />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="4" className='text-start'>
                                        College Department :
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control type="text"
                                            name="clg_dept"
                                            value={programData.clg_dept}
                                            onChange={handleInputChange2}
                                            required />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="4" className='text-start'>
                                        Resource Person :
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control type="text"
                                            name="resource_person"
                                            value={programData.resource_person}
                                            onChange={handleInputChange2}
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
                                            value={programData.program_date}
                                            onChange={handleInputChange2}
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
                                            value={programData.program_place}
                                            onChange={handleInputChange2}
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
                                            value={programData.program_rescue_count}
                                            onChange={handleInputChange2}
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
                                            value={programData.program_report}
                                            onChange={handleInputChange2}
                                            required
                                        />
                                    </Col>
                                </Form.Group>
                                <Col md={12} className='d-flex align-items-center justify-content-between'>
                                    <Button variant="outline-secondary" className="m-1" onClick={handleBack1}>
                                        <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Back
                                    </Button>
                                    <Button variant='btn btn-success' className='m-1' type='submit'>Submit</Button>
                                    <Button variant="outline-success" className="m-1" type="button" onClick={handleCommunity}>
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
                            <Row className='d-flex align-items-center justify-content-center'>
                                <Col md={8} className="text-start">
                                    <h3 className="annual_section_title mt-3">Staff Programs</h3>
                                </Col>
                                <Col md={4} className="text-start d-flex align-items-center justify-content-end">
                                    <Button type='button' className='btn btn-success' onClick={handleViewAll}>View All</Button>
                                </Col>
                            </Row>

                            <Form noValidate validated={validated} onSubmit={handleStaffSubmit}>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="4" className='text-start'>
                                        Name of the Programs :
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control type="text"
                                            name="staff_name"
                                            value={staffData.staff_name}
                                            onChange={handleInputChange3}
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
                                            value={staffData.staff_date}
                                            onChange={handleInputChange3}
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
                                            value={staffData.staff_place}
                                            onChange={handleInputChange3}
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
                                            value={staffData.staff_rescue_count}
                                            onChange={handleInputChange3}
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
                                            value={staffData.staff_report}
                                            onChange={handleInputChange3}
                                            required
                                        />
                                    </Col>
                                </Form.Group>
                                <Col md={12} className='d-flex align-items-center justify-content-between'>
                                    <Button variant="outline-secondary" className="m-1" onClick={handleBack3}>
                                        <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Back
                                    </Button>
                                    <Button variant="btn btn-success" className="m-1" type="submit"> Submit
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
