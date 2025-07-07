import React from 'react';
import { Breadcrumb, Form, InputGroup, Container, Row, Col, Table, Button } from '@themesberg/react-bootstrap';
import { useState, useEffect } from "react";
import axios from 'axios';
import Cookies from 'js-cookie';
import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import manasu_logo from "../Admission/Manasu-Logo.png";
import Modal from 'react-bootstrap/Modal';
import { Alert } from "react-bootstrap";

function Dr_visitView() {
    const [visitDetails, setVisitDetails] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [previewRequested, setPreviewRequested] = useState(false);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);

    //alert box values
    const [submissionMessage, setSubmissionMessage] = useState("");
    const [messageType, setMessageType] = useState(""); // 'success' or 'danger'

    const [formData, setFormData] = useState({
        dr_name: '',
        hospital_name: '',
        date_time: '',
        resident_examinite: '',
        report: ''
    })

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const userType = Cookies.get('usertype');

    const filteredRescueDetails = visitDetails.filter((item) => {
        const searchTerm = searchQuery.toLowerCase();
        return (
            String(item.resident_examinite).toLowerCase().includes(searchTerm) ||
            String(item.dr_name).toLowerCase().includes(searchTerm) ||
            String(item.hospital_name).toLowerCase().includes(searchTerm)
        );
    });

    const apiRoute = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
    });

    useEffect(() => {
        const getVisitDetails = async () => {
            try {
                const response = await apiRoute.get('/residency/getDrVisit');
                setVisitDetails(response.data.data); // Should be an array
            } catch (error) {
                console.error("Error fetching annual report:", error);
            }
        };

        getVisitDetails();
    }, []);

    const formatDateTime = (dateStr) => {
        const date = new Date(dateStr);
        if (isNaN(date)) return ""; // Invalid date fallback

        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();

        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");

        return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
    };

    const formatForInput = (dateStr) => {
        if (!dateStr) return '';

        const dateObj = new Date(dateStr);

        if (isNaN(dateObj)) return '';

        const pad = (n) => String(n).padStart(2, '0');

        const yyyy = dateObj.getFullYear();
        const mm = pad(dateObj.getMonth() + 1);
        const dd = pad(dateObj.getDate());
        const hh = pad(dateObj.getHours());
        const min = pad(dateObj.getMinutes());

        return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
    };


    const fetchFormData = async (id) => {
        try {
            const response = await apiRoute.get(`/residency/getDrVisitbyID/${id}`);
            const data = response.data;

            setFormData((formData) => ({
                ...formData,
                dr_name: data.dr_name || '',
                hospital_name: data.hospital_name || '',
                date_time: data.date_time || '',
                resident_examinite: data.resident_examinite || '',
                report: data.report || '',
            }));

            setPreviewRequested(true); // trigger the effect after state updates
        } catch (error) {
            console.error("Error fetching form data:", error);
            alert("Doctor ID is not found");
        }
    };

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
            const response = await apiRoute.get(`/residency/getDrVisitbyID/${id}`);
            const data = response.data;

            setFormData({
                id: data.id || '',
                dr_name: data.dr_name || '',
                hospital_name: data.hospital_name || '',
                date_time: data.date_time || '',
                resident_examinite: data.resident_examinite || '',
                report: data.report || ''
            });

            setShow(true);

        } catch (error) {
            console.error("Error fetching form data:", error);
            alert("Doctor ID is not found");
        }
    };

    const handleUpdate = async (e, id) => {
        e.preventDefault();

        try {
            const response = await apiRoute.put(`/residency/updateDrVisit/${id}`, formData);
            console.log(response.data);

            if (response.data.message === "Dr Visit updated successfully!") {
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
                        <h6 className="breadcrumb_title">Dr_visit</h6>
                    </Col>
                    <Col md={8} className="text-start mb-4">
                        <h3 className="section_title text-center">Doctor’s Visit Details</h3>
                    </Col>
                    <Col md={2}>
                        <div className="d-flex align-items-center px-3">

                            <Form className="navbar-search">
                                <Form.Group id="topbarSearch">
                                    <InputGroup className="input-group-merge search-bar">

                                        <Form.Control
                                            type="text"
                                            placeholder="Search"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </InputGroup>
                                </Form.Group>
                            </Form>
                        </div>
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
                                <th>Doctor Name</th>
                                <th>Hospital Name</th>
                                <th>Date & Time</th>
                                <th>No. of Resident Checked</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRescueDetails.length > 0 ? (
                                filteredRescueDetails.map((item, index) => (
                                    <tr key={item.id}>
                                        <td>{index + 1}</td>
                                        <td>{item.dr_name}</td>
                                        <td>{item.hospital_name}</td>
                                        <td>{formatDateTime(item.date_time)}</td>
                                        <td>{item.resident_examinite}</td>
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
                                            {/* {userType === "2" && (
                                                <button className="btn btn-danger icon_details"
                                                    onClick={() => handleDelete(item.id)}
                                                ><i className="fas fa-trash"></i></button>
                                            )} */}
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

            <div ref={formRef} style={{ position: "absolute", left: "-9999px", top: 0, background: "#fff", padding: "20px", width: "210mm" }}>
                <Row className="d-flex align-items-center justify-content-center mb-2">
                    <Col md={3} className='d-flex align-items-center pdf_logo'>
                        <img src={manasu_logo} className="pdf_logo" alt="" />
                        {/* <div className="logo_text">
                                                <h4><span>MANASU</span> <br />Mental Health Charity Home <br />Chennai,</h4>
                                            </div> */}
                    </Col>
                    <Col md={9}>
                        <h4 className="text-center">Doctor's Visit Details </h4>
                    </Col>
                </Row>
                <Form className='dr_consultant'>
                    <Row>
                        <Col md={12}>
                            <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                <Form.Label column sm="5" className='text-start'>
                                    Doctor Name :
                                </Form.Label>
                                <Col sm="7">
                                    <Form.Control
                                        type="text"
                                        name="dr_name"
                                        value={formData.dr_name}
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
                                    Date & Time :
                                </Form.Label>
                                <Col sm="7">
                                    <Form.Control
                                        type="datetime-local"
                                        name="date_time"
                                        max={new Date().toISOString().slice(0, 16)}
                                        value={formatForInput(formData.date_time)}
                                        onChange={handleChange}
                                        required />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                <Form.Label column sm="5" className='text-start'>
                                    No. of Resident Checked :
                                </Form.Label>
                                <Col sm="7">
                                    <Form.Control
                                        type="text"
                                        name="resident_examinite"
                                        value={formData.resident_examinite}
                                        onChange={handleChange}
                                        required />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3 mt-3" controlId="formRescueName">
                                <Form.Label column sm="5" className='text-start'>
                                    Report :
                                </Form.Label>
                                <Col sm="7">
                                    <Form.Control
                                        as="textarea"
                                        name="report"
                                        value={formData.report}
                                        onChange={handleChange}
                                        required />
                                </Col>
                            </Form.Group>
                        </Col>

                    </Row>
                </Form>

            </div>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Doctor's visit Form</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Col md={12}>
                        <Form className='dr_consultant'>
                            <Row>
                                <Col md={12}>
                                    <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                        <Form.Label column sm="5" className='text-start'>
                                            Doctor Name : <span style={{ color: 'red' }}>*</span>
                                        </Form.Label>
                                        <Col sm="7">
                                            <Form.Control
                                                type="text"
                                                name="dr_name"
                                                value={formData.dr_name}
                                                onChange={handleChange}
                                                required />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                        <Form.Label column sm="5" className='text-start'>
                                            Hospital Name : <span style={{ color: 'red' }}>*</span>
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
                                            Date & Time : <span style={{ color: 'red' }}>*</span>
                                        </Form.Label>
                                        <Col sm="7">
                                            <Form.Control
                                                type="datetime-local"
                                                name="date_time"
                                                max={new Date().toISOString().slice(0, 16)}
                                                value={formatForInput(formData.date_time)}
                                                onChange={handleChange}
                                                required />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                        <Form.Label column sm="5" className='text-start'>
                                            No. of Resident examinite : <span style={{ color: 'red' }}>*</span>
                                        </Form.Label>
                                        <Col sm="7">
                                            <Form.Control
                                                type="text"
                                                name="resident_examinite"
                                                value={formData.resident_examinite}
                                                onChange={handleChange}
                                                required />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} className="mb-3 mt-3" controlId="formRescueName">
                                        <Form.Label column sm="5" className='text-start'>
                                            Report :
                                        </Form.Label>
                                        <Col sm="7">
                                            <Form.Control
                                                as="textarea"
                                                name="report"
                                                value={formData.report}
                                                onChange={handleChange}
                                                 />
                                        </Col>
                                    </Form.Group>
                                </Col>

                                <div className="btn_footer d-flex align-items-center justify-content-end">
                                    <Button variant="success" type="button" className="m-1" onClick={(e) => handleUpdate(e, formData.id)}>
                                        Update
                                    </Button>
                                    <Button variant="secondary" onClick={handleClose}>
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

export default Dr_visitView
