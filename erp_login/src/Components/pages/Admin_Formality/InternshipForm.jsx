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
        email: '',
        phone: '',
        secondary_phone: '',
        field: '',
        clg_name: '',
        duration: '',
        from_date: '',
        to_date: '',
        supervisor_name: '',
        supervisor_email: '',
        supervisor_phone: '',
        choose_intern: '',
    });

    const [files, setFiles] = useState({
        stud_photo: null
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

    const handleFileChange = (e) => {
        setFiles({ ...files, stud_photo: e.target.files[0] });
    };

    const navigate = useNavigate();

    const handleViewAll = () => {
        navigate("/allStudentDetails");
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = new FormData();

            // Append file from files state
            data.append("stud_photo", files.stud_photo);

            // Append any other form fields
            data.append("stud_name", formData.stud_name);
            data.append("stud_id", formData.stud_id);
            data.append("department", formData.department);
            data.append("email", formData.email);
            data.append("phone", formData.phone);
            data.append("secondary_phone", formData.secondary_phone);
            data.append("field", formData.field);
            data.append("clg_name", formData.clg_name);
            data.append("duration", formData.duration);
            data.append("from_date", formData.from_date);
            data.append("to_date", formData.to_date);
            data.append("supervisor_name", formData.supervisor_name);
            data.append("supervisor_email", formData.supervisor_email);
            data.append("supervisor_phone", formData.supervisor_phone);
            data.append("choose_intern", formData.choose_intern);
            // Add other fields as needed

            const response = await apiRoute.post("/formality/createInternForm", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

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
                                    Attach Student Photo :
                                </Form.Label>
                                <Col sm="8">
                                    <Form.Control
                                        name="stud_photo"
                                        type="file"
                                        value={formData.stud_photo}
                                        onChange={handleFileChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-1 text-start" controlId="formEmailID">
                                <Form.Label column sm="4">
                                    Name of the College :
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
                                    Name of the Department :
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
                                    Email ID :
                                </Form.Label>
                                <Col sm="8">
                                    <Form.Control
                                        name="email"
                                        type="text"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>
                            {/* <Form.Group as={Row} className="mb-1 text-start" controlId="formEmailID">
                                <Form.Label column sm="4">
                                    Contact Number :
                                </Form.Label>
                                <Col sm="8">
                                    <Form.Control
                                        name="phone"
                                        type="number"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group> */}

                            <Form.Group as={Row} className="mb-1 text-start" controlId="formPhoneNumbers">
                                <Form.Label column sm="4">
                                    Contact Number:
                                </Form.Label>
                                <Col sm="8">
                                    <Form.Control
                                        name="phone"
                                        type="text"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                                
                            </Form.Group>

                            <Form.Group as={Row} className="mb-1 text-start" controlId="formPhoneNumbers">
                                 <Form.Label column sm="4">
                                        Emergency Contact Number:
                                    </Form.Label>
                                <Col sm="8">
                                   
                                    <Form.Control
                                        name="secondary_phone"
                                        type="text"
                                        value={formData.secondary_phone}
                                        onChange={handleInputChange}
                                    />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-1 text-start d-flex align-items-center" controlId="formEmailID">
                                <Form.Label column sm="4">
                                    Supervisor's Name from College/Institution :
                                </Form.Label>
                                <Col sm="8">
                                    <Form.Control
                                        name="supervisor_name"
                                        type="text"
                                        value={formData.supervisor_name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-1 text-start" controlId="formEmailID">
                                <Form.Label column sm="4">
                                    Supervisor's Email :
                                </Form.Label>
                                <Col sm="8">
                                    <Form.Control
                                        name="supervisor_email"
                                        type="text"
                                        value={formData.supervisor_email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-1 text-start" controlId="formEmailID">
                                <Form.Label column sm="4">
                                    Supervisor's Contact Number :
                                </Form.Label>
                                <Col sm="8">
                                    <Form.Control
                                        name="supervisor_phone"
                                        type="text"
                                        value={formData.supervisor_phone}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>


                            <Form.Group as={Row} className="mb-1 text-start" controlId="formField">
                                <Form.Label column sm="4">Preferred Field :</Form.Label>
                                <Col sm="8">
                                    <Form.Control
                                        as="select"
                                        name="field"
                                        value={formData.field}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">-- Select --</option>

                                        <optgroup label="Social Worker">
                                            <option value="Medical and Psychiatry">Medical and Psychiatry</option>
                                            <option value="Community Development">Community Development</option>
                                            <option value="Human Resource Management">Human Resource Management</option>
                                            <option value="Human Rights">Human Rights</option>
                                            <option value="Any other">Any other</option>
                                        </optgroup>
                                        
                                        <option value="Social Services">Social Services</option>
                                        <option value="Psychology">Psychology</option>

                                    </Form.Control>
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
                                    Internship Date :
                                </Form.Label>
                                <Col sm="4" className='intern_class'>
                                    <Form.Control
                                        name="from_date"
                                        type="date"
                                        value={formData.from_date}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                                <Col sm="4" className='intern_class'>
                                    <Form.Control
                                        name="to_date"
                                        type="date"
                                        value={formData.to_date}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-1 text-start" controlId="formEmailID">
                                <Form.Label column sm="4">
                                    Why did you choose MANASU for your internship?
                                </Form.Label>
                                <Col sm="8">
                                    <Form.Control
                                        as="textarea" rows={3}
                                        name="choose_intern"
                                        type="text"
                                        value={formData.choose_intern}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>
                            <Col md={12} className='d-flex align-items-center justify-content-center'>
                                <div className="d-flex align-tems-cente justify-content-between">
                                    <Button variant="success" className="m-1" type="submit">Submit</Button>
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
