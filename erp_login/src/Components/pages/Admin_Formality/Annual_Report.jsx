import React from 'react';
import { Breadcrumb, Container, Row, Col, Form, InputGroup, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Annual_Report() {
    const [validated, setValidated] = useState(false);
    const [step, setStep] = useState(1);

    const [formData, setFormData] = useState({
        event_name: '',
        event_date: '',
        event_place: '',
        event_rescue_count: '',
        celebration_name: '',
        celebration_date: '',
        celebration_place: '',
        celebration_rescue_count: '',
        program_name: '',
        program_date: '',
        program_place: '',
        program_rescue_count: '',
        internship_duration: '',
        internship_date: '',
        internship_place: '',
        internship_rescue_count: '',
        staff_name: '',
        staff_date: '',
        staff_place: '',
        staff_rescue_count: ''
    })

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
    const handleBack2 = () => {
        setStep(3);
    }
    const handleBack3 = () => {
        setStep(4);
    }

    const navigate = useNavigate();
    const handleViewAll = (id) => {
        navigate(`/view_annualReport`);
      };


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

            {step === 1 && (
                <Container>
                    <Row className='d-flex align-items-center justify-content-center'>
                        <Col md={6}>
                            <Row className='d-flex align-items-center justify-content-between'>
                                <Col md={6} className="text-start">
                                    <h3 className="annual_section_title mt-3">Event Details</h3>
                                </Col>
                                <Col md={6} className="text-start d-flex align-items-center justify-content-end">
                                    <Button type='button' className='btn btn-success' onClick={() => {
                                        handleViewAll();
                                    }}>View All</Button>
                                </Col>
                            </Row>
                            
                            <Form noValidate validated={validated} onSubmit={handleNext}>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="4" className='text-start'>
                                        Event Name :
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control type="text"
                                            name="event_name"
                                            value={formData.event_name}
                                            onChange={handleInputChange}
                                            required />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="4" className='text-start'>
                                        Event Date :
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control type="date"
                                            name="event_date"
                                            value={formData.event_date}
                                            onChange={handleInputChange}
                                            required />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="4" className='text-start'>
                                        Event Place :
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control type="text"
                                            name="event_place"
                                            value={formData.event_place}
                                            onChange={handleInputChange}
                                            required />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="4" className='text-start'>
                                        How many rescue attended the events?
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control type="text"
                                            name="event_rescue_count"
                                            value={formData.event_rescue_count}
                                            onChange={handleInputChange}
                                            required />
                                    </Col>
                                </Form.Group>
                                <Col md={12} className='d-flex align-items-center justify-content-end'>
                                    <Button variant="outline-primary" className="m-1" type="submit">
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
                            <Form noValidate validated={validated} onSubmit={handleGeneral}>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="4" className='text-start'>
                                        Celebration Name :
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control type="text"
                                            name="celebration_name"
                                            value={formData.celebration_name}
                                            onChange={handleInputChange}
                                            required />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="4" className='text-start'>
                                        Celebration Date:
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
                                        Conducted Place :
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
                                        How many rescue attended the Celebration?
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control type="text"
                                            name="celebration_rescue_count"
                                            value={formData.celebration_rescue_count}
                                            onChange={handleInputChange}
                                            required />
                                    </Col>
                                </Form.Group>
                                <Col md={12}>
                                    <Button variant="outline-primary" className="m-1" onClick={handleBack}>
                                        <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Back
                                    </Button>
                                    <Button variant="outline-primary" className="m-1" type="submit">
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
                            <Form noValidate validated={validated} onSubmit={handleCommunity}>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="4" className='text-start'>
                                        Program Name :
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
                                        Program Date:
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
                                        Conducted Place :
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
                                        How many rescue attended the Programs?
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control type="text"
                                            name="program_rescue_count"
                                            value={formData.program_rescue_count}
                                            onChange={handleInputChange}
                                            required />
                                    </Col>
                                </Form.Group>
                                <Col md={12}>
                                    <Button variant="outline-primary" className="m-1" onClick={handleBack1}>
                                        <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Back
                                    </Button>
                                    <Button variant="outline-primary" className="m-1" type="submit">
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
                                <h3 className="annual_section_title mt-3">Internship Form</h3>
                            </Col>
                            <Form noValidate validated={validated} onSubmit={handleInternship}>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="4" className='text-start'>
                                        Internship duration :
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control type="text"
                                            name="internship_duration"
                                            value={formData.internship_duration}
                                            onChange={handleInputChange}
                                            required />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="4" className='text-start'>
                                        Internship Date:
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control type="date"
                                            name="internship_date"
                                            value={formData.internship_date}
                                            onChange={handleInputChange}
                                            required />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="4" className='text-start'>
                                        Conducted Place :
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control type="text"
                                            name="internship_place"
                                            value={formData.internship_place}
                                            onChange={handleInputChange}
                                            required />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="4" className='text-start'>
                                        How many rescue attended the Internship?
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control type="text"
                                            name="internship_rescue_count"
                                            value={formData.internship_rescue_count}
                                            onChange={handleInputChange}
                                            required />
                                    </Col>
                                </Form.Group>
                                <Col md={12}>
                                    <Button variant="outline-primary" className="m-1" onClick={handleBack2}>
                                        <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Back
                                    </Button>
                                    <Button variant="outline-primary" className="m-1" type="submit">
                                        <FontAwesomeIcon icon={faArrowRight} className="me-2" /> Next
                                    </Button>
                                </Col>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            )}

            {step === 5 && (
                <Container>
                    <Row className='d-flex align-items-center justify-content-center'>
                        <Col md={6}>
                            <Col md={12} className="text-start">
                                <h3 className="annual_section_title mt-3">Staff Programs</h3>
                            </Col>
                            <Form noValidate validated={validated} onSubmit={handleSubmitAll}>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="4" className='text-start'>
                                        Staff Programs Name :
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
                                        Staff Programs Date:
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
                                        Conducted Place :
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
                                        How many rescue attended the Staff Programs?
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control type="text"
                                            name="staff_rescue_count"
                                            value={formData.staff_rescue_count}
                                            onChange={handleInputChange}
                                            required />
                                    </Col>
                                </Form.Group>
                                <Col md={12}>
                                    <Button variant="outline-primary" className="m-1" onClick={handleBack3}>
                                        <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Back
                                    </Button>
                                    <Button variant="outline-primary" className="m-1" type="submit">
                                        <FontAwesomeIcon icon={faArrowRight} className="me-2" /> Next
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
