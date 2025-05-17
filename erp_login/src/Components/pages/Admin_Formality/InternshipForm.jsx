import axios from 'axios';
import React, { useState } from 'react';
import { Breadcrumb, Container, Row, Table, Button } from 'react-bootstrap';
import { Col, Form } from 'react-bootstrap';
import { Alert } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';


function InternshipForm() {
    const [formData, setFormData] = useState({
        stud_name: '',
        stud_id: '',
        department: '',
        clg_name: '',
        duration: '',
        from_date: '',
        to_date: '',
    });

    //alert box values
    const [submissionMessage, setSubmissionMessage] = useState("");
    const [messageType, setMessageType] = useState(""); // 'success' or 'danger'

    const apiRoute = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
    });


    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const navigate = useNavigate();

    const handleViewAll = () =>{
        navigate("/allStudentDetails");
    }


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await apiRoute.post("/formality/createInternForm", formData);
            console.log(response);
            if (response.data.message === "Internship Form Created successfully") {
                setSubmissionMessage("Form submitted successfully!");
                setMessageType("success");
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
    };
    return (
        <>
            <Container fluid>
                <Row className='d-flex align-items-center justify-content-between'>
                    <Col md={2} className='text-start'>
                        <Breadcrumb className="d-none d-md-inline-block mb-0" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
                            <Breadcrumb.Item></Breadcrumb.Item>
                            <Breadcrumb.Item>Home</Breadcrumb.Item>
                            <Breadcrumb.Item active>Reunion</Breadcrumb.Item>
                        </Breadcrumb>
                        <h6 className="breadcrumb_title">Internship</h6>
                    </Col>
                    <Col md={7} className="text-start">
                        <h3 className="section_title">Intern Information Form</h3>
                    </Col>

                </Row>
            </Container>

            <div>
                {/* Show success or error message box */}
                {submissionMessage && (
                    <Alert variant={messageType} className="mt-3">
                        {submissionMessage}
                    </Alert>
                )}
            </div>


            <Container>
                <Row>
                    <Col md={10} className='d-flex align-items-center justify-content-end'>
                        <div className="d-flex align-tems-center justify-content-end">
                            <Button variant="success" className="m-1" type="button" onClick={handleViewAll}>View All</Button>
                        </div>
                    </Col>
                </Row>


                <Form onSubmit={handleSubmit} className="navbar-search col-md-12 d-flex align-items-center justify-content-center">
                    <Col md={8} className="consultant_box my-2 p-3">
                        <Row>

                            <Form.Group as={Row} className="mb-1 text-start" controlId="formEmailID">
                                <Form.Label column sm="4">
                                    Student Name :
                                </Form.Label>
                                <Col sm="8">
                                    <Form.Control
                                        name="stud_name"
                                        type="text"
                                        value={formData.stud_name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-1 text-start" controlId="formEmailID">
                                <Form.Label column sm="4">
                                    Student ID :
                                </Form.Label>
                                <Col sm="8">
                                    <Form.Control
                                        name="stud_id"
                                        type="number"
                                        value={formData.stud_id}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-1 text-start" controlId="formEmailID">
                                <Form.Label column sm="4">
                                    Department :
                                </Form.Label>
                                <Col sm="8">
                                    <Form.Control
                                        name="department"
                                        type="text"
                                        value={formData.department}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-1 text-start" controlId="formEmailID">
                                <Form.Label column sm="4">
                                    College Name :
                                </Form.Label>
                                <Col sm="8">
                                    <Form.Control
                                        name="clg_name"
                                        type="text"
                                        value={formData.clg_name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-1 text-start" controlId="formEmailID">
                                <Form.Label column sm="4">
                                    Duration :
                                </Form.Label>
                                <Col sm="8">
                                    <Form.Control
                                        name="duration"
                                        type="text"
                                        value={formData.duration}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>

                            {/* From and To Date in the same row */}
                            <Form.Group as={Row} className="mb-3 text-start">
                                <Form.Label column sm="4">
                                    Intern Date :
                                </Form.Label>
                                <Col sm="4">
                                    <Form.Control
                                        name="from_date"
                                        type="date"
                                        value={formData.from_date}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                                <Col sm="4">
                                    <Form.Control
                                        name="to_date"
                                        type="date"
                                        value={formData.to_date}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>
                            <Col md={12} className='d-flex align-items-center justify-content-center'>
                                <div className="d-flex align-tems-cente justify-content-between">
                                    <Button variant="primary" className="m-1" type="submit">Submit</Button>
                                </div>

                            </Col>

                        </Row>
                    </Col>
                </Form>
            </Container>

            
        </>
    )
}

export default InternshipForm
