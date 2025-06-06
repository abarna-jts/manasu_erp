import React from 'react';
import { Breadcrumb, Container, Row, Form, Button, InputGroup, Table } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import manasu_logo from "../Admission/Manasu-Logo.png";
import { Alert } from "react-bootstrap";

function Medical_camp() {
    const [searchQuery, setSearchQuery] = useState("");
    const [campDetails, setCampDetail] = useState([]);
    const [previewRequested, setPreviewRequested] = useState(false);
    const [show, setShow] = useState(false);
    const [show1, setShow1] = useState(false);
    const handleClose = () => setShow(false);
    const handleClose1 = () => setShow1(false);
    const handleShow = () => setShow(true);

    const userType = Cookies.get('usertype');

    const [formData, setFormData] = useState({
        camp_name: '',
        hospital_name: '',
        date: '',
        camp_type: '',
        organised_by: '',
        participants: '',
        feedback: '',
        general_details: ''
    })

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        getMedicalCamp();
    }, []);

    const apiRoute = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
    });

    const getMedicalCamp = async () => {
        try {
            const response = await apiRoute.get('/residency/getAllMedicalCamp');
            console.log("API response:", response.data);
            setCampDetail(response.data.data);
        } catch (error) {
            console.error('Error fetching Medical Camp:', error);
        }
    };

    const filteredRescueDetails = campDetails.filter((item) => {
        const searchTerm = searchQuery.toLowerCase();
        return (
            String(item.camp_name).toLowerCase().includes(searchTerm) ||
            String(item.hospital_name).toLowerCase().includes(searchTerm) ||
            String(item.organised_by).toLowerCase().includes(searchTerm) ||
            String(item.date).toLowerCase().includes(searchTerm)
        );
    });

    const handlesubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await apiRoute.post("/residency/createMedicalCamp", formData);
            // console.log(response.formData);
            if (response.status === 200) {
                alert('Form submitted successfully!');
                window.location.reload();
            } else {
                alert('Error submitting form.');
            }
        }
        catch (err) {
            console.error('There was an error submitting the form:', err);
            alert('There was an error submitting the form.');
        }
    }

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        if (isNaN(date)) return ""; // Invalid date fallback

        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();

        return `${day}-${month}-${year}`;
    };

    const formatDateForInput = (dateStr) => {
        const date = new Date(dateStr);
        if (isNaN(date)) return ""; // Invalid date fallback

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`; // ✅ required for input type="date"
    };

    const fetchFormData = async (id) => {
        try {
            const response = await apiRoute.get(`/residency/getMedicalCampID/${id}`);
            const data = response.data;

            setFormData((formData) => ({
                ...formData,
                camp_name: data.camp_name || '',
                hospital_name: data.hospital_name || '',
                date: data.date || '',
                camp_type: data.camp_type || '',
                organised_by: data.organised_by || '',
                participants: data.participants || '',
                feedback: data.feedback || '',
                general_details: data.general_details || '',
            }));

            setPreviewRequested(true); // trigger the effect after state updates
        } catch (error) {
            console.error("Error fetching form data:", error);
            alert("Doctor ID is not found");
        }
    };

    //alert box values
    const [submissionMessage, setSubmissionMessage] = useState("");
    const [messageType, setMessageType] = useState(""); // 'success' or 'danger'

    useEffect(() => {
        if (previewRequested) {
            // Delay slightly to allow DOM updates
            setTimeout(() => {
                generatePDF();
                setPreviewRequested(false);
            }, 100); // 100ms delay is often enough
        }
    }, [previewRequested]);

    const formRef = useRef();

    const generatePDF = async () => {
        const input = formRef.current;
        if (!input) {
            console.error("Form reference is not defined");
            return;
        }

        const canvas = await html2canvas(input, { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const imgProps = pdf.getImageProperties(imgData);
        const imgWidth = pdfWidth;
        const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

        let heightLeft = imgHeight;
        let position = 0;

        // First page
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;

        // Additional pages if needed
        while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pdfHeight;
        }

        const pdfBlob = pdf.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl, '_blank');
    };

    const handleEditform = async (id) => {
        try {
            const response = await apiRoute.get(`/residency/getMedicalCampID/${id}`);
            const data = response.data;

            setFormData({
                id: data.id || '',
                camp_name: data.camp_name || '',
                hospital_name: data.hospital_name || '',
                date: data.date || '',
                camp_type: data.camp_type || '',
                organised_by: data.organised_by || '',
                participants: data.participants || '',
                feedback: data.feedback || '',
                general_details: data.general_details || '',
            });

            setShow1(true);

        } catch (error) {
            console.error("Error fetching form data:", error);
            alert("Medical Camp ID is not found");
        }
    };

    const handleUpdate = async (e, id) => {
        e.preventDefault();

        try {
            const response = await apiRoute.put(`/residency/updateMedicalCamp/${id}`, formData);
            console.log(response.data);

            if (response.data.message === "Medical Camp updated successfully!") {
                setSubmissionMessage("Form updated successfully!");
                setMessageType("success");

                handleClose(true);

                // Reload after 3 seconds
                setTimeout(() => window.location.reload(), 1000);
            } else {
                setSubmissionMessage("Error updating the form.");
                setMessageType("danger");
            }
        } catch (error) {
            console.error("There was an error updating the form:", error);
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
                            <Breadcrumb.Item active>Residency Time</Breadcrumb.Item>
                        </Breadcrumb>
                        <h6 className="breadcrumb_title">Record Sheet</h6>
                    </Col>
                    <Col md={7} className="text-center">
                        <h3 className="section_title">Medical Camp Report </h3>
                    </Col>
                    <Col md={2}>
                        <Form className="navbar-search">
                            <Form.Group id="topbarSearch">
                                <InputGroup className="input-group-merge search-bar">
                                    <Form.Control
                                        type="text"
                                        placeholder="Search"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <InputGroup.Text style={{ cursor: 'pointer', background: "#6abc15", color: "#fff" }} onClick={handleShow}>
                                        <i className="fas fa-plus"></i>
                                    </InputGroup.Text>

                                </InputGroup>
                            </Form.Group>
                        </Form>
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
                    <Table responsive="sm">

                        <thead>
                            <tr>
                                <th>S.No</th>
                                <th>Camp Name</th>
                                <th>Hospital Name</th>
                                <th>Date</th>
                                <th>Camp Type</th>
                                <th>Organised By</th>
                                <th>Participants</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRescueDetails.length > 0 ? (
                                filteredRescueDetails.map((item, index) => (
                                    <tr key={item.id}>
                                        <td>{index + 1}</td>
                                        <td>{item.camp_name}</td>
                                        <td>{item.hospital_name}</td>
                                        <td>{formatDate(item.date)}</td>
                                        <td>{item.camp_type}</td>
                                        <td>{item.organised_by}</td>
                                        <td>{item.participants}</td>
                                        <td>
                                            <button className="btn btn-success icon_details"
                                                onClick={() => {
                                                    fetchFormData(item.id);
                                                }}
                                            >
                                                <i className="fas fa-eye"></i>
                                            </button>
                                            <button className="btn btn-primary icon_details"
                                                onClick={() => {
                                                    handleEditform(item.id);
                                                }}
                                            ><i className="fas fa-edit"></i> </button>
                                            {userType === "2" && (
                                                <button className="btn btn-danger icon_details"
                                                    onClick={() => handleDelete(item.id)}
                                                ><i className="fas fa-trash"></i></button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="10" className="text-center text-danger">No data found</td>
                                </tr>
                            )}
                        </tbody>

                    </Table>
                </Row>
            </Container>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Enter Medical Camp Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Col md={12}>
                        <Form className='dr_consultant' onSubmit={handlesubmit}>
                            <Row>
                                <Col md={12}>
                                    <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                        <Form.Label column sm="5" className='text-start'>
                                            Camp Name :
                                        </Form.Label>
                                        <Col sm="7">
                                            <Form.Control
                                                type="text"
                                                name="camp_name"
                                                value={formData.camp_name}
                                                onChange={handleChange}
                                                required />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                        <Form.Label column sm="5" className='text-start'>
                                            Hospital Name :
                                        </Form.Label>
                                        <Col sm="7">
                                            <Form.Control
                                                type="text"
                                                name="hospital_name"
                                                value={formData.hospital_name}
                                                onChange={handleChange}
                                                required />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                        <Form.Label column sm="5" className='text-start'>
                                            Date :
                                        </Form.Label>
                                        <Col sm="7">
                                            <Form.Control
                                                type="date"
                                                name="date"
                                                value={formData.date}
                                                onChange={handleChange}
                                                required />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} className="mb-3" controlId="formAdmissionNo">
                                        <Form.Label column sm="5" className='text-start'>Camp Type</Form.Label>
                                        <Col sm="7">
                                            <Form.Select
                                                name="camp_type"
                                                value={formData.camp_type}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">-- Select --</option>
                                                <option value="General">General</option>
                                                <option value="Dental">Dental</option>
                                                <option value="Eye">Eye</option>
                                            </Form.Select>
                                        </Col>

                                    </Form.Group>
                                    {formData.camp_type === "General" && (
                                        <Form.Group as={Row} className="mb-3" controlId="formGeneralDetails">
                                            <Form.Label column sm="5" className='text-start'>General Camp Details</Form.Label>
                                            <Col sm="7">
                                                <Form.Control
                                                    type="text"
                                                    name="general_details"
                                                    value={formData.general_details || ''}
                                                    onChange={handleChange}
                                                    placeholder="Enter details for General camp"
                                                    required
                                                />
                                            </Col>
                                        </Form.Group>
                                    )}
                                    <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                        <Form.Label column sm="5" className='text-start'>
                                            Organised by :
                                        </Form.Label>
                                        <Col sm="7">
                                            <Form.Control
                                                type="text"
                                                name="organised_by"
                                                value={formData.organised_by}
                                                onChange={handleChange}
                                                required />
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                        <Form.Label column sm="5" className='text-start'>
                                            No. of Participants :
                                        </Form.Label>
                                        <Col sm="7">
                                            <Form.Control
                                                type="text"
                                                name="participants"
                                                value={formData.participants}
                                                onChange={handleChange}
                                                required />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} className="mb-3 mt-3" controlId="formRescueName">
                                        <Form.Label column sm="5" className='text-start'>
                                            Feedback :
                                        </Form.Label>
                                        <Col sm="7">
                                            <Form.Control
                                                as="textarea"
                                                name="feedback"
                                                value={formData.feedback}
                                                onChange={handleChange}
                                                required />
                                        </Col>
                                    </Form.Group>
                                </Col>

                                <div className="mt-3">
                                    <Button variant="success" className="m-1" type="submit">Submit</Button>
                                </div>

                            </Row>
                        </Form>
                    </Col>
                </Modal.Body>
            </Modal>

            <div ref={formRef} style={{ position: "absolute", left: "-9999px", top: 0, background: "#fff", padding: "20px", width: "210mm" }}>
                <Row className="d-flex align-items-center justify-content-center mb-2">
                    <Col md={3} className='d-flex align-items-center pdf_logo'>
                        <img src={manasu_logo} className="pdf_logo" alt="" />
                    </Col>
                    <Col md={9}>
                        <h4 className="text-center">Medical Camp Details </h4>
                    </Col>
                </Row>
                <Form className='dr_consultant'>
                    <Row>
                        <Col md={12}>
                            <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                <Form.Label column sm="5" className='text-start'>
                                    Camp Name :
                                </Form.Label>
                                <Col sm="7">
                                    <Form.Control
                                        type="text"
                                        name="camp_name"
                                        value={formData.camp_name}
                                        onChange={handleChange}
                                        required />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                <Form.Label column sm="5" className='text-start'>
                                    Hospital Name :
                                </Form.Label>
                                <Col sm="7">
                                    <Form.Control
                                        type="text"
                                        name="hospital_name"
                                        value={formData.hospital_name}
                                        onChange={handleChange}
                                        required />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                <Form.Label column sm="5" className='text-start'>
                                    Date :
                                </Form.Label>
                                <Col sm="7">
                                    <Form.Control
                                        type="date"
                                        name="date"
                                        value={formatDateForInput(formData.date)}
                                        onChange={handleChange}
                                        required />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3" controlId="formAdmissionNo">
                                <Form.Label column sm="5" className='text-start'>Camp Type</Form.Label>
                                <Col sm="7">
                                    <Form.Select
                                        name="camp_type"
                                        value={formData.camp_type}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">-- Select --</option>
                                        <option value="General">General</option>
                                        <option value="Dental">Dental</option>
                                        <option value="Eye">Eye</option>
                                    </Form.Select>
                                </Col>

                            </Form.Group>
                            {formData.camp_type === "General" && (
                                <Form.Group as={Row} className="mb-3" controlId="formGeneralDetails">
                                    <Form.Label column sm="5" className='text-start'>General Camp Details</Form.Label>
                                    <Col sm="7">
                                        <Form.Control
                                            type="text"
                                            name="general_details"
                                            value={formData.general_details || ''}
                                            onChange={handleChange}
                                            placeholder="Enter details for General camp"
                                            required
                                        />
                                    </Col>
                                </Form.Group>
                            )}
                            <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                <Form.Label column sm="5" className='text-start'>
                                    Organised by :
                                </Form.Label>
                                <Col sm="7">
                                    <Form.Control
                                        type="text"
                                        name="organised_by"
                                        value={formData.organised_by}
                                        onChange={handleChange}
                                        required />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                <Form.Label column sm="5" className='text-start'>
                                    No. of Participants :
                                </Form.Label>
                                <Col sm="7">
                                    <Form.Control
                                        type="text"
                                        name="participants"
                                        value={formData.participants}
                                        onChange={handleChange}
                                        required />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3 mt-3" controlId="formRescueName">
                                <Form.Label column sm="5" className='text-start'>
                                    Feedback :
                                </Form.Label>
                                <Col sm="7">
                                    <Form.Control
                                        as="textarea"
                                        name="feedback"
                                        value={formData.feedback}
                                        onChange={handleChange}
                                        required />
                                </Col>
                            </Form.Group>
                        </Col>

                    </Row>
                </Form>
            </div>

            <Modal show={show1} onHide={handleClose1}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Medical Camp</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Col md={12}>
                        <Form className='med_camp'>
                            <Row>
                                <Col md={12}>
                                    <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                        <Form.Label column sm="5" className='text-start'>
                                            Camp Name :
                                        </Form.Label>
                                        <Col sm="7">
                                            <Form.Control
                                                type="text"
                                                name="camp_name"
                                                value={formData.camp_name}
                                                onChange={handleChange}
                                                required />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                        <Form.Label column sm="5" className='text-start'>
                                            Hospital Name :
                                        </Form.Label>
                                        <Col sm="7">
                                            <Form.Control
                                                type="text"
                                                name="hospital_name"
                                                value={formData.hospital_name}
                                                onChange={handleChange}
                                                required />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                        <Form.Label column sm="5" className='text-start'>
                                            Date :
                                        </Form.Label>
                                        <Col sm="7">
                                            <Form.Control
                                                type="date"
                                                name="date"
                                                value={formatDateForInput(formData.date)}
                                                onChange={handleChange}
                                                required />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} className="mb-3" controlId="formAdmissionNo">
                                        <Form.Label column sm="5" className='text-start'>Camp Type</Form.Label>
                                        <Col sm="7">
                                            <Form.Select
                                                name="camp_type"
                                                value={formData.camp_type}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">-- Select --</option>
                                                <option value="General">General</option>
                                                <option value="Dental">Dental</option>
                                                <option value="Eye">Eye</option>
                                            </Form.Select>
                                        </Col>

                                    </Form.Group>
                                    {formData.camp_type === "General" && (
                                        <Form.Group as={Row} className="mb-3" controlId="formGeneralDetails">
                                            <Form.Label column sm="5" className='text-start'>General Camp Details</Form.Label>
                                            <Col sm="7">
                                                <Form.Control
                                                    type="text"
                                                    name="general_details"
                                                    value={formData.general_details || ''}
                                                    onChange={handleChange}
                                                    placeholder="Enter details for General camp"
                                                    required
                                                />
                                            </Col>
                                        </Form.Group>
                                    )}
                                    <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                        <Form.Label column sm="5" className='text-start'>
                                            Organised by :
                                        </Form.Label>
                                        <Col sm="7">
                                            <Form.Control
                                                type="text"
                                                name="organised_by"
                                                value={formData.organised_by}
                                                onChange={handleChange}
                                                required />
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                        <Form.Label column sm="5" className='text-start'>
                                            No. of Participants :
                                        </Form.Label>
                                        <Col sm="7">
                                            <Form.Control
                                                type="text"
                                                name="participants"
                                                value={formData.participants}
                                                onChange={handleChange}
                                                required />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} className="mb-3 mt-3" controlId="formRescueName">
                                        <Form.Label column sm="5" className='text-start'>
                                            Feedback :
                                        </Form.Label>
                                        <Col sm="7">
                                            <Form.Control
                                                as="textarea"
                                                name="feedback"
                                                value={formData.feedback}
                                                onChange={handleChange}
                                                required />
                                        </Col>
                                    </Form.Group>
                                </Col>

                                <div className="btn_footer d-flex align-items-center justify-content-end">
                                    <Button variant="success" type="button" className="m-1" onClick={(e) => handleUpdate(e, formData.id)}>
                                        Update
                                    </Button>
                                    <Button variant="secondary" onClick={handleClose1}>
                                        Close
                                    </Button>
                                </div>

                            </Row>
                        </Form>
                    </Col>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default Medical_camp
