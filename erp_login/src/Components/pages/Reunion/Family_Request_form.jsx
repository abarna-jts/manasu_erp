import React from 'react';
import { Breadcrumb, Container, Row, Table, Button } from 'react-bootstrap';
import { Col, Form, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Modal from 'react-bootstrap/Modal';
import Cookies from 'js-cookie';
import { Alert } from "react-bootstrap";
import manasu_logo from '../Admission/manasu_logo.png';

function Family_Request_form() {
    const [show, setShow] = useState(false);
    const [admissionNumber, setAdmissionNumber] = useState('');
    const [files, setFiles] = useState({});
    const [previewRequested, setPreviewRequested] = useState(false);
    const [rescueImage, setRescueImage] = useState(null);
    const [rescueName, setRescueName] = useState("");
    const [error, setError] = useState("");

    //alert box values
    const [submissionMessage, setSubmissionMessage] = useState("");
    const [messageType, setMessageType] = useState(""); // 'success' or 'danger'


    const userType = Cookies.get('usertype');

    const handleClose = () => setShow(false);

    const apiRoute = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
    });

    const [formData, setFormData] = useState({
        admission_no: '',
        rescue_name: '',
        age: '',
        gender: 'Male',
        phone_no: '',
        family_relationship: '',
        f_member_name: '',
        f_member_age: '',
        f_member_address: '',
        f_member_phone: '',
        description: '',
    })

    const [refData, setRefData] = useState({
        admission_no: '',
        rescue_name: '',
        age: '',
        gender: 'Male',
        phone_no: '',
        rescue_relationship: '',
        f_member_name: '',
        f_member_age: '',
        f_member_address: '',
        f_member_phone: '',
        description: '',
    })

    const [storeData, setStoreData] = useState({
        admission_no: '',
        rescue_name: '',
        age: '',
        gender: 'Male',
        phone_no: '',
        rescue_relationship: '',
        f_member_name: '',
        f_member_age: '',
        f_member_address: '',
        f_member_phone: '',
        f_aadhar_card_no: '',
        f_ration_card_no: '',
        r_aadhar_card_no: '',
        r_ration_card_no: '',
        any_other: '',
        description: '',
    })

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleInputChange1 = (e) => {
        setStoreData({ ...storeData, [e.target.name]: e.target.value });
    };

    const handleInputChange2 = (e) => {
        setRefData({ ...refData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const { name, files: selectedFiles } = e.target;
        setFiles(prevFiles => ({
            ...prevFiles,
            [name]: selectedFiles[0]
        }));
    };

    // Automatically fetch data when admission number is typed
    useEffect(() => {
        if (admissionNumber.trim().length >= 8) { // Adjust minimum length as needed
            fetchFormData();
        }
    }, [admissionNumber]);

    const fetchFormData = async () => {
        try {
            const response = await apiRoute.get(`/admision/get_scrb_formdata/${admissionNumber}`);
            setStoreData(response.data.data[0]);
        } catch (error) {
            console.error('Error fetching data', error);
            alert("Admission Number Not found");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('admissionNumber', admissionNumber);
        data.append('rescue_name', storeData.rescue_name);
        data.append('f_member_age', storeData.f_member_age);
        data.append('description', storeData.description);
        data.append('f_aadhar_card', files.f_aadhar_card);
        data.append('f_ration_card', files.f_ration_card);
        data.append('r_aadhar_card', files.r_aadhar_card);
        data.append('r_ration_card', files.r_ration_card);
        data.append('govt_id', storeData.govt_id);
        data.append('rescue_relationship', storeData.rescue_relationship);
        data.append('f_member_name', storeData.f_member_name);
        data.append('f_member_phone', storeData.f_member_phone);
        data.append('f_member_address', storeData.f_member_address);
        data.append('f_aadhar_card_no', storeData.f_aadhar_card_no);
        data.append('f_ration_card_no', storeData.f_ration_card_no);
        data.append('r_aadhar_card_no', storeData.r_aadhar_card_no);
        data.append('r_ration_card_no', storeData.r_ration_card_no);
        data.append('any_other', storeData.any_other);


        try {
            const res = await apiRoute.post('/reunion/create_family_letter', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (res.data.message === "Family Request Letter Form Created Successfully") {
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

    const formRef = useRef();

    const generatePDF = async () => {
        const input = formRef.current;
        if (!input) {
            console.error("Form reference is not defined");
            return;
        }

        try {
            const canvas = await html2canvas(input, { scale: 2, useCORS: true });
            const imgData = canvas.toDataURL("image/png");

            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            const imgProps = pdf.getImageProperties(imgData);
            const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

            let heightLeft = imgHeight;
            let position = 0;

            while (heightLeft > 0) {
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
                heightLeft -= pdfHeight;
                if (heightLeft > 0) {
                    pdf.addPage();
                    position = -imgHeight + heightLeft;
                }
            }

            const pdfBlob = pdf.output('blob');
            const pdfUrl = URL.createObjectURL(pdfBlob);
            window.open(pdfUrl, '_blank');
        } catch (err) {
            console.error("Error generating PDF:", err);
            alert("Failed to generate PDF.");
        }
    };

    const ViewFormData = async () => {
        try {
            const response = await apiRoute.get(`/reunion/get_family_letter/${admissionNumber}`);
            const data = response.data;

            // Update form fields
            setRefData((refData) => ({
                ...refData,
                rescue_name: data.rescue_name || '',
                f_member_age: data.age || '',
                description: data.description || '',
                family_relationship: data.family_relationship || '',
                f_member_name: data.f_member_name || '',
                f_member_phone: data.f_member_phone || 'NULL',
                f_member_address: data.f_member_address || '',
            }));
            console.log("Fetched Data:", data);

            // Handle old and new photo paths correctly
            const aadharCardPath = data.f_aadhar_card ? `http://localhost:5000/${data.f_aadhar_card}` : null;
            const rationCardPath = data.f_ration_card ? `http://localhost:5000/${data.f_ration_card}` : null;
            const residentaadharCardPath = data.r_aadhar_card ? `http://localhost:5000/${data.r_aadhar_card}` : null;
            const residentrationCardPath = data.r_ration_card ? `http://localhost:5000/${data.r_ration_card}` : null;
            const govt_idPath = data.govt_id ? `http://localhost:5000/${data.govt_id}` : null;
            // Set files state
            setFiles((files) => ({
                ...files,
                f_aadhar_card: aadharCardPath,
                f_ration_card: rationCardPath,
                r_aadhar_card: residentaadharCardPath,
                r_ration_card: residentrationCardPath,
                govt_id: govt_idPath,
            }));

            setPreviewRequested(true);
        } catch (error) {
            console.error("Error fetching form data:", error);
            alert("Admission Number not found");
        }
    }

    useEffect(() => {
        if (previewRequested) {
            // Delay slightly to allow DOM updates
            setTimeout(() => {
                generatePDF();
                setPreviewRequested(false);
            }, 100); // 100ms delay is often enough
        }
    }, [previewRequested]);

    const handleShow = async (admissionNumber) => {
        try {
            const response = await apiRoute.get(`/reunion/get_family_letter/${admissionNumber}`);
            const data = response.data;

            setFormData((formData) => ({
                ...formData,
                rescue_name: data.rescue_name || '',
                f_member_age: data.age || '',
                description: data.description || '',
                family_relationship: data.family_relationship || '',
                f_member_name: data.f_member_name || '',
                f_member_phone: data.f_member_phone || '',
                f_member_address: data.f_member_address || '',
            }));

            // Handle old and new photo paths correctly
            const aadharCardPath = data.f_aadhar_card ? `http://localhost:5000/${data.f_aadhar_card}` : null;
            const rationCardPath = data.f_ration_card ? `http://localhost:5000/${data.f_ration_card}` : null;
            const residentaadharCardPath = data.r_aadhar_card ? `http://localhost:5000/${data.r_aadhar_card}` : null;
            const residentrationCardPath = data.r_ration_card ? `http://localhost:5000/${data.r_ration_card}` : null;
            const govt_idPath = data.govt_id ? `http://localhost:5000/${data.govt_id}` : null;


            // Set files state
            setFiles((files) => ({
                ...files,
                f_aadhar_card: aadharCardPath,
                f_ration_card: rationCardPath,
                r_aadhar_card: residentaadharCardPath,
                r_ration_card: residentrationCardPath,
                govt_id: govt_idPath,
            }));

            setShow(true);
        } catch (error) {
            console.error("Error fetching form data:", error);
            alert("Admission Number not found");
        }
    };

    const createFormData = () => {
        const targetElement = document.querySelector('.family_request_form');
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    }

    const handleUpdate = async (e, admissionNumber) => {
        e.preventDefault();

        const data = new FormData();
        data.append('rescue_name', formData.rescue_name);
        data.append('f_member_age', formData.f_member_age);
        data.append('description', formData.description);
        data.append('phone_no', formData.phone_no);
        data.append('family_relationship', formData.family_relationship);
        data.append('f_member_name', formData.f_member_name);
        data.append('f_member_phone', formData.f_member_phone);
        data.append('f_member_address', formData.f_member_address);
        data.append('f_aadhar_card', files.f_aadhar_card);
        data.append('f_ration_card', files.f_ration_card);
        data.append('r_aadhar_card', files.r_aadhar_card);
        data.append('r_ration_card', files.r_ration_card);
        data.append('govt_id', files.govt_id);

        try {
            const res = await apiRoute.post(`/reunion/update_family_letter/${admissionNumber}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            console.log("Update response:", res.data);

            const message = res.data.message?.toLowerCase() || "";

            if (message.includes("updated successfully")) {
                setSubmissionMessage("Family Request Letter updated successfully!");
                setMessageType("success");

                // Optional: reload after 3s
                setTimeout(() => window.location.reload(), 3000);
            } else {
                setSubmissionMessage(res.data.message || "Update failed.");
                setMessageType("danger");
            }
        } catch (err) {
            console.error("Update error:", err);
            setSubmissionMessage("Something went wrong while updating the form.");
            setMessageType("danger");
        }
    };


    const handleDelete = async (admissionNumber) => {
        alert("Are you sure want to delete");
        try {
            const response = await axios.delete(`http://localhost:5000/reunion/deleteFamilyRequest/${admissionNumber}`);
            console.log(response);
            alert("First Form Details Deleted successfully");
            // Refresh data after deletion
            getRescueDetails(); // if this function fetches updated student list
        } catch (error) {
            console.error('Failed to delete item:', error);
        }
    };

    const fetchRescueDetails = async (admissionNumber) => {
        try {
            const response = await apiRoute.get(`/admision/get_scrbform2data/${admissionNumber}`);
            const result = response.data.data[0];
            console.log("API Result:", result);

            if (result && result.rescue_image) {
                const imagePath = result.rescue_image.startsWith("http")
                    ? result.rescue_image
                    : `http://localhost:5000/${result.rescue_image}`;

                setRescueImage(imagePath);
                setRescueName(result.rescue_name || "");
                setError(""); // clear any previous error
            } else {
                setRescueImage(null);
                setRescueName("");
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
        if (admissionNumber.trim() !== "") {
            fetchRescueDetails(admissionNumber);
        } else {
            setRescueImage(null);
            setRescueName("");
            setError("");
        }
    }, [admissionNumber]);


    return (
        <div>
            <Container fluid>
                <Row className='d-flex align-items-center justify-content-between'>
                    <Col md={2} className='text-start'>
                        <Breadcrumb className="d-none d-md-inline-block mb-0" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
                            <Breadcrumb.Item></Breadcrumb.Item>
                            <Breadcrumb.Item>Home</Breadcrumb.Item>
                            <Breadcrumb.Item active>Reunion</Breadcrumb.Item>
                        </Breadcrumb>
                        <h6 className="breadcrumb_title">Rescue Reunion</h6>
                    </Col>
                    <Col md={8} className="text-center">
                        <h3 className="section_title">1. Family Request Form – Discharge of Resident</h3>
                    </Col>
                    <Col md={2} className='text-center'>
                        {error && <div className="text-danger mt-2">{error}</div>}

                        {/* Rescue Name and Image */}
                        {rescueImage && (
                            <div>

                                <img

                                    alt={rescueName || "Rescue Image"}
                                    style={{ width: "100px", height: "100px" }}
                                    src={rescueImage}
                                />
                                {rescueName && <h6 className="mb-2">{rescueName}</h6>}
                            </div>
                        )}
                    </Col>
                </Row>
            </Container>

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
                                    value={admissionNumber}
                                    onChange={(e) => setAdmissionNumber(e.target.value)}
                                />
                            </InputGroup>
                        </Col>
                        <button type="button" className="btn btn-secondary mx-1" onClick={() => {
                            if (!admissionNumber.trim()) {
                                alert("Please enter your admission number.");
                            } else {
                                ViewFormData(); // Fetch & populate data before generating PDF
                            }
                        }}><FontAwesomeIcon icon={faEye} className="me-0" /></button>
                        <button type="button" className="btn btn-success mx-1" onClick={() => {
                            if (!admissionNumber.trim()) {
                                alert("Please enter your admission number.");
                            } else {
                                createFormData(); // Fetch & populate data before generating PDF
                            }
                        }}><FontAwesomeIcon icon={faPlus} className="me-0" /></button>
                        <button type="button" className="btn btn-success mx-1" onClick={() => {
                            if (!admissionNumber.trim()) {
                                alert("Please enter your admission number.");
                            } else {
                                handleShow(admissionNumber); // Fetch & populate data before generating PDF
                            }
                        }}><FontAwesomeIcon icon={faEdit} className="me-0" /></button>
                        {userType === "2" && (
                            <button type="button" className="btn btn-success mx-1" onClick={() => {
                                if (!admissionNumber.trim()) {
                                    alert("Please enter your admission number.");
                                } else {
                                    handleDelete(admissionNumber); // Fetch & populate data before generating PDF
                                }
                            }}><FontAwesomeIcon icon={faTrash} className="me-0" /></button>
                        )}
                    </Form.Group>
                </Form>

                <div>
                    {/* Show success or error message box */}
                    {submissionMessage && (
                        <Alert variant={messageType} className="mt-3">
                            {submissionMessage}
                        </Alert>
                    )}
                </div>

                <Row>
                    <Form className='d-flex align-items-center justify-content-center flex-column family_request_form' onSubmit={handleSubmit}>

                        <Col md={8}>
                            <h5 className="pdfsub_heading">Rescue Details:</h5>

                            <Form.Group as={Row} className="mb-1 text-start" controlId="formInformation">
                                <Form.Label column sm="4">
                                    Admission No :
                                </Form.Label>
                                <Col sm="8">
                                    <Form.Control
                                        name="admission_no"
                                        type='number'
                                        value={admissionNumber}
                                        onChange={handleInputChange1}
                                        required />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-1 text-start" controlId="formEmailID">
                                <Form.Label column sm="4">
                                    Name :
                                </Form.Label>
                                <Col sm="8">
                                    <Form.Control
                                        name="rescue_name"
                                        type="text"
                                        value={storeData.rescue_name}
                                        onChange={handleInputChange1}
                                        required
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-1 text-start" controlId="formTakenFrom">
                                <Form.Label column sm="4">
                                    Age :
                                </Form.Label>
                                <Col sm="8">
                                    <Form.Control
                                        name="age"
                                        type='text'
                                        value={storeData.age}
                                        onChange={handleInputChange1}
                                        required />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-1 text-start" controlId="formDateTime">
                                <Form.Label column sm="4">
                                    Gender :
                                </Form.Label>
                                <Col sm="8">
                                    <Form.Control
                                        name="gender"
                                        type='text'
                                        value={"Male"}
                                        onChange={handleInputChange1}
                                        required />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-1 text-start">
                                <Form.Label column sm="4">
                                    Phone Number :
                                </Form.Label>
                                <Col sm="8">
                                    <Form.Control
                                        name="phone_no"
                                        type='number'
                                        value={storeData.phone_no}
                                        onChange={handleInputChange1}
                                        required />
                                </Col>
                            </Form.Group>

                        </Col>

                        <Col md={8}>
                            <h5 className="pdfsub_heading">Family Details</h5>

                            <Form.Group as={Row} className="mb-1 text-start" controlId="formInformation">
                                <Form.Label column sm="4">
                                    Relationship :
                                </Form.Label>
                                <Col sm="8">
                                    <Form.Control
                                        name="rescue_relationship"
                                        type='text'
                                        value={storeData.rescue_relationship}
                                        onChange={handleInputChange1}
                                        required />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-1 text-start" controlId="formEmailID">
                                <Form.Label column sm="4">
                                    Name :
                                </Form.Label>
                                <Col sm="8">
                                    <Form.Control
                                        name="f_member_name"
                                        type="text"
                                        value={storeData.f_member_name}
                                        onChange={handleInputChange1}
                                        required
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-1 text-start" controlId="formTakenFrom">
                                <Form.Label column sm="4">
                                    Age :
                                </Form.Label>
                                <Col sm="8">
                                    <Form.Control
                                        name="f_member_age"
                                        type='text'
                                        value={storeData.f_member_age}
                                        onChange={handleInputChange1}
                                        required
                                    />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-1 text-start" controlId="formDateTime">
                                <Form.Label column sm="4">
                                    Phone No :
                                </Form.Label>
                                <Col sm="8">
                                    <Form.Control
                                        name="f_member_phone"
                                        type='text'
                                        value={storeData.f_member_phone}
                                        onChange={handleInputChange1}
                                        required />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-1 text-start" controlId="formPoliceMemo">
                                <Form.Label column sm="4">
                                    Address :
                                </Form.Label>
                                <Col sm="8">
                                    <Form.Control
                                        name="f_member_address"
                                        type='text'
                                        value={storeData.f_member_address}
                                        onChange={handleInputChange1}
                                        required />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-1 text-start" controlId="formPoliceMemo">
                                <Form.Label column sm="4">
                                    Aadhar Card Number (Relation):
                                </Form.Label>
                                <Col sm="8">
                                    <Form.Control
                                        type="text"
                                        name='f_aadhar_card_no'
                                        value={storeData.f_aadhar_card_no}
                                        onChange={handleInputChange1} />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-1 text-start" controlId="formPoliceMemo">
                                <Form.Label column sm="4">
                                    Aadhar Card  (Relation):
                                </Form.Label>
                                <Col sm="8">
                                    <Form.Control
                                        type="file"
                                        name='f_aadhar_card'
                                        onChange={handleFileChange} />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-1 text-start" controlId="formPoliceMemo">
                                <Form.Label column sm="4">
                                    Ration Card Number (Relation):
                                </Form.Label>
                                <Col sm="8">
                                    <Form.Control
                                        type="text"
                                        name="f_ration_card_no"
                                        value={storeData.f_ration_card_no}
                                        onChange={handleInputChange1} />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-1 text-start" controlId="formPoliceMemo">
                                <Form.Label column sm="4">
                                    Ration Card  (Relation):
                                </Form.Label>
                                <Col sm="8">
                                    <Form.Control
                                        type="file"
                                        name="f_ration_card"
                                        onChange={handleFileChange} />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-1 text-start" controlId="formPoliceMemo">
                                <Form.Label column sm="4">
                                    Aadhar Card Number (Resident):
                                </Form.Label>
                                <Col sm="8">
                                    <Form.Control
                                        type="text"
                                        name='r_aadhar_card_no'
                                        value={storeData.r_aadhar_card_no}
                                        onChange={handleInputChange1} />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-1 text-start" controlId="formPoliceMemo">
                                <Form.Label column sm="4">
                                    Aadhar Card  (Resident):
                                </Form.Label>
                                <Col sm="8">
                                    <Form.Control
                                        type="file"
                                        name='r_aadhar_card'
                                        onChange={handleFileChange} />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-1 text-start" controlId="formPoliceMemo">
                                <Form.Label column sm="4">
                                    Ration Card Number (Resident):
                                </Form.Label>
                                <Col sm="8">
                                    <Form.Control
                                        type="text"
                                        name="r_ration_card_no"
                                        value={storeData.r_ration_card_no}
                                        onChange={handleInputChange1} />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-1 text-start" controlId="formPoliceMemo">
                                <Form.Label column sm="4">
                                    Ration Card  (Resident):
                                </Form.Label>
                                <Col sm="8">
                                    <Form.Control
                                        type="file"
                                        name="r_ration_card"
                                        onChange={handleFileChange} />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-1 text-start" controlId="formPoliceMemo">
                                <Form.Label column sm="4">
                                    Any other :
                                </Form.Label>
                                <Col sm="8">
                                    <Form.Control
                                        type="text"
                                        name="any_other"
                                        value={storeData.any_other}
                                        onChange={handleInputChange1} />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-1 text-start" controlId="formPoliceMemo">
                                <Form.Label column sm="4">
                                    Any other Document:
                                </Form.Label>
                                <Col sm="8">
                                    <Form.Control
                                        type="file"
                                        name="govt_id"
                                        onChange={handleFileChange} />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-1 text-start" controlId="formPoliceMemo">
                                <Form.Label column sm="4">
                                    Description :
                                </Form.Label>
                                <Col sm="8">
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        name="description"
                                        type='number'
                                        value={storeData.description}
                                        onChange={handleInputChange1}
                                        required />
                                </Col>
                            </Form.Group>

                        </Col>
                        <div className="mt-3 d-flex align-tems-cente justify-content-between">
                            <Button variant="success" className="m-1" type="submit">Submit</Button>
                        </div>

                    </Form>

                    <div ref={formRef} style={{ position: "absolute", left: "-9999px", top: 0, background: "#fff", padding: "20px", width: "210mm" }}>
                        <Row className="d-flex align-items-center justify-content-center mb-2">
                            <Col md={3} className='d-flex align-items-center pdf_logo'>
                                <img src={manasu_logo} className="pdf_logo" alt="" />
                                <div className="logo_text">
                                    <h4><span>MANASU</span> <br />Mental Health Charity Home <br/>Chennai,</h4>
                                </div>
                            </Col>
                            <Col md={9}>
                                <h4 className="text-center">1. Family Request Form – Discharge of Resident</h4>
                            </Col>
                        </Row>

                        <Form className='d-flex align-items-center justify-content-center flex-column'>

                            <Col md={11}>
                                <h5 className="pdfsub_heading">Rescue Details:</h5>

                                <Form.Group as={Row} className="mb-1 text-start" controlId="formInformation">
                                    <Form.Label column sm="4">
                                        Admission No :
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control
                                            name="admission_no"
                                            type='number'
                                            value={admissionNumber}
                                            onChange={handleInputChange2}
                                            required />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1 text-start" controlId="formEmailID">
                                    <Form.Label column sm="4">
                                        Name :
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control
                                            name="rescue_name"
                                            type="text"
                                            value={refData.rescue_name}
                                            onChange={handleInputChange2}
                                            required
                                        />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-1 text-start" controlId="formTakenFrom">
                                    <Form.Label column sm="4">
                                        Age :
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control
                                            name="age"
                                            type='text'
                                            value={storeData.age || "NULL"}
                                            onChange={handleInputChange2}
                                            required />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1 text-start" controlId="formDateTime">
                                    <Form.Label column sm="4">
                                        Gender :
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control
                                            name="gender"
                                            type='text'
                                            value={"Male"}
                                            onChange={handleInputChange2}
                                            required />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1 text-start" controlId="formPoliceMemo">
                                    <Form.Label column sm="4">
                                        Phone Number :
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control
                                            name="phone_no"
                                            type='number'
                                            value={storeData.phone_no || "NULL"}
                                            onChange={handleInputChange2}
                                            required />
                                    </Col>
                                </Form.Group>

                            </Col>

                            <Col md={11}>
                                <h5 className="pdfsub_heading">Family Details</h5>

                                <Form.Group as={Row} className="mb-1 text-start" controlId="formInformation">
                                    <Form.Label column sm="4">
                                        Relationship :
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control
                                            name="family_relationship"
                                            type='text'
                                            value={refData.family_relationship}
                                            onChange={handleInputChange2}
                                            required />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1 text-start" controlId="formEmailID">
                                    <Form.Label column sm="4">
                                        Person Name :
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control
                                            name="f_member_name"
                                            type="text"
                                            value={refData.f_member_name}
                                            onChange={handleInputChange2}
                                            required
                                        />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-1 text-start" controlId="formTakenFrom">
                                    <Form.Label column sm="4">
                                        Person Age :
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control
                                            name="f_member_age"
                                            type='text'
                                            value={refData.f_member_age}
                                            onChange={handleInputChange2}
                                            required
                                        />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1 text-start" controlId="formDateTime">
                                    <Form.Label column sm="4">
                                        Person Phone No :
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control
                                            name="f_member_phone"
                                            type='text'
                                            value={refData.f_member_phone}
                                            onChange={handleInputChange2}
                                            required />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1 text-start" controlId="formPoliceMemo">
                                    <Form.Label column sm="4">
                                        Person Address :
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control
                                            name="f_member_address"
                                            type='text'
                                            value={refData.f_member_address}
                                            onChange={handleInputChange2}
                                            required />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-1 text-start" controlId="formPoliceMemo">
                                    <Form.Label column sm="4">
                                        Aadhar Card No(Relation) :
                                    </Form.Label>
                                    <Col sm="8">
                                        {files.f_aadhar_card ? (
                                            <>
                                                <img
                                                    src={files.f_aadhar_card}
                                                    alt="New"
                                                    style={{ width: "100px", height: "100px", marginTop: "10px" }}
                                                />
                                            </>
                                        ) : (
                                            <p>Unknown</p> // Display if no photo
                                        )}
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-1 text-start" controlId="formPoliceMemo">
                                    <Form.Label column sm="4">
                                        Ration Card (Relation):
                                    </Form.Label>
                                    <Col sm="8">
                                        {files.f_ration_card ? (
                                            <>
                                                <img
                                                    src={files.f_ration_card}
                                                    alt="New"
                                                    style={{ width: "100px", height: "100px", marginTop: "10px" }}
                                                />
                                            </>
                                        ) : (
                                            <p>Unknown</p> // Display if no photo
                                        )}
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-5 text-start" controlId="formPoliceMemo">
                                    <Form.Label column sm="4">
                                        Aadhar Card No (Resident):
                                    </Form.Label>
                                    <Col sm="8">
                                        {files.r_aadhar_card ? (
                                            <>
                                                <img
                                                    src={files.r_aadhar_card}
                                                    alt="New"
                                                    style={{ width: "100px", height: "100px", marginTop: "10px" }}
                                                />
                                            </>
                                        ) : (
                                            <p>Unknown</p> // Display if no photo
                                        )}
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-5 text-start" controlId="formPoliceMemo">
                                    <Form.Label column sm="4">
                                        Ration Card (Resident):
                                    </Form.Label>
                                    <Col sm="8">
                                        {files.r_ration_card ? (
                                            <>
                                                <img
                                                    src={files.r_ration_card}
                                                    alt="New"
                                                    style={{ width: "100px", height: "100px", marginTop: "10px" }}
                                                />
                                            </>
                                        ) : (
                                            <p>Unknown</p> // Display if no photo
                                        )}
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-4 mt-5 text-start" controlId="formPoliceMemo">
                                    <Form.Label column sm="4">
                                        Any other Government ID :
                                    </Form.Label>
                                    <Col sm="8">
                                        {files.govt_id ? (
                                            <>
                                                <img
                                                    src={files.govt_id}
                                                    alt="New"
                                                    style={{ width: "100px", height: "100px", marginTop: "10px" }}
                                                />
                                            </>
                                        ) : (
                                            <p>Unknown</p> // Display if no photo
                                        )}
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1 text-start" controlId="formPoliceMemo">
                                    <Form.Label column sm="4">
                                        Description :
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            name="description"
                                            type='number'
                                            value={refData.description}
                                            onChange={handleInputChange2}
                                            required />
                                    </Col>
                                </Form.Group>

                            </Col>
                            <Col md={12}>
                                <Row className="d-flex align-items-center justify-content-center mt-3">
                                    <Col md={6} className="mt-3 down_title">
                                        <h5 className="text-start">Signature / Thumbnail of Resident's</h5>
                                    </Col>
                                    <Col md={6} className="mt-3 down_title">
                                        <h5 className="text-end">Manasu Seal</h5>
                                    </Col>
                                </Row>
                            </Col>


                        </Form>
                    </div>

                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Edit Family Request Letter</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Col md={12}>
                                <Form>

                                    <Col md={12}>
                                        <h5 className="pdfsub_heading">Rescue Details:</h5>

                                        <Form.Group as={Row} className="mb-1 text-start" controlId="formInformation">
                                            <Form.Label column sm="6">
                                                Admission No :
                                            </Form.Label>
                                            <Col sm="6">
                                                <Form.Control
                                                    name="admission_no"
                                                    type='number'
                                                    value={admissionNumber}
                                                    onChange={handleInputChange}
                                                    required />
                                            </Col>
                                        </Form.Group>

                                        <Form.Group as={Row} className="mb-1 text-start" controlId="formEmailID">
                                            <Form.Label column sm="6">
                                                Name :
                                            </Form.Label>
                                            <Col sm="6">
                                                <Form.Control
                                                    name="rescue_name"
                                                    type="text"
                                                    value={formData.rescue_name}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </Col>
                                        </Form.Group>
                                        <Form.Group as={Row} className="mb-1 text-start" controlId="formTakenFrom">
                                            <Form.Label column sm="6">
                                                Age :
                                            </Form.Label>
                                            <Col sm="6">
                                                <Form.Control
                                                    name="age"
                                                    type='text'
                                                    value={storeData.age} // ✅ use formData here
                                                    onChange={handleInputChange1}
                                                    required
                                                />
                                            </Col>
                                        </Form.Group>

                                        <Form.Group as={Row} className="mb-1 text-start" controlId="formDateTime">
                                            <Form.Label column sm="6">
                                                Gender :
                                            </Form.Label>
                                            <Col sm="6">
                                                <Form.Control
                                                    name="gender"
                                                    type='text'
                                                    value={"Male"}
                                                    onChange={handleInputChange}
                                                    required />
                                            </Col>
                                        </Form.Group>

                                        <Form.Group as={Row} className="mb-1 text-start" controlId="formPoliceMemo">
                                            <Form.Label column sm="6">
                                                Phone Number :
                                            </Form.Label>
                                            <Col sm="6">
                                                <Form.Control
                                                    name="phone_no"
                                                    type='number'
                                                    value={storeData.phone_no}
                                                    onChange={handleInputChange1}
                                                    required />
                                            </Col>
                                        </Form.Group>

                                    </Col>

                                    <Col md={12}>
                                        <h5 className="pdfsub_heading">Family Details</h5>

                                        <Form.Group as={Row} className="mb-1 text-start" controlId="formInformation">
                                            <Form.Label column sm="6">
                                                Relationship :
                                            </Form.Label>
                                            <Col sm="6">
                                                <Form.Control
                                                    name="family_relationship"
                                                    type='text'
                                                    value={formData.family_relationship}
                                                    onChange={handleInputChange}
                                                    required />
                                            </Col>
                                        </Form.Group>

                                        <Form.Group as={Row} className="mb-1 text-start" controlId="formEmailID">
                                            <Form.Label column sm="6">
                                                Person Name :
                                            </Form.Label>
                                            <Col sm="6">
                                                <Form.Control
                                                    name="f_member_name"
                                                    type="text"
                                                    value={formData.f_member_name}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </Col>
                                        </Form.Group>
                                        <Form.Group as={Row} className="mb-1 text-start" controlId="formTakenFrom">
                                            <Form.Label column sm="6">
                                                Person Age :
                                            </Form.Label>
                                            <Col sm="6">
                                                <Form.Control
                                                    name="f_member_age"
                                                    type='text'
                                                    value={formData.f_member_age}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </Col>
                                        </Form.Group>

                                        <Form.Group as={Row} className="mb-1 text-start" controlId="formDateTime">
                                            <Form.Label column sm="6">
                                                Person Phone No :
                                            </Form.Label>
                                            <Col sm="6">
                                                <Form.Control
                                                    name="f_member_phone"
                                                    type='text'
                                                    value={formData.f_member_phone}
                                                    onChange={handleInputChange}
                                                    required />
                                            </Col>
                                        </Form.Group>

                                        <Form.Group as={Row} className="mb-1 text-start" controlId="formPoliceMemo">
                                            <Form.Label column sm="6">
                                                Person Address :
                                            </Form.Label>
                                            <Col sm="6">
                                                <Form.Control
                                                    name="f_member_address"
                                                    type='text'
                                                    value={formData.f_member_address}
                                                    onChange={handleInputChange}
                                                    required />
                                            </Col>
                                        </Form.Group>
                                        <Form.Group as={Row} className="mb-1 text-start" controlId="formPoliceMemo">
                                            <Form.Label column sm="6">
                                                Aadhar Card No (Relation):
                                            </Form.Label>
                                            <Col sm="6" className='d-flex align-items-center justify-content-center'>
                                                {files.f_aadhar_card ? (
                                                    <>
                                                        <img
                                                            src={files.f_aadhar_card}
                                                            alt="Old"
                                                            style={{ width: "100px", height: "80px", marginTop: "10px" }}
                                                        />
                                                    </>
                                                ) : (
                                                    <p>No old photo available</p> // Display if no photo
                                                )}

                                                <Form.Control
                                                    type="file"
                                                    onChange={handleFileChange}
                                                    name="f_aadhar_card"
                                                />
                                            </Col>
                                        </Form.Group>
                                        <Form.Group as={Row} className="mb-1 text-start" controlId="formPoliceMemo">
                                            <Form.Label column sm="6">
                                                Ration Card (Relation):
                                            </Form.Label>
                                            <Col sm="6" className='d-flex align-items-center justify-content-center'>
                                                {files.f_ration_card ? (
                                                    <>
                                                        <img
                                                            src={files.f_ration_card}
                                                            alt="Old"
                                                            style={{ width: "100px", height: "80px", marginTop: "10px" }}
                                                        />
                                                    </>
                                                ) : (
                                                    <p>No old photo available</p> // Display if no photo
                                                )}

                                                <Form.Control
                                                    type="file"
                                                    onChange={handleFileChange}
                                                    name="f_ration_card"
                                                />
                                            </Col>
                                        </Form.Group>
                                        <Form.Group as={Row} className="mb-1 text-start" controlId="formPoliceMemo">
                                            <Form.Label column sm="6">
                                                Aadhar Card No (Resident):
                                            </Form.Label>
                                            <Col sm="6" className='d-flex align-items-center justify-content-center'>
                                                {files.r_aadhar_card ? (
                                                    <>
                                                        <img
                                                            src={files.r_aadhar_card}
                                                            alt="Old"
                                                            style={{ width: "100px", height: "80px", marginTop: "10px" }}
                                                        />
                                                    </>
                                                ) : (
                                                    <p>No old photo available</p> // Display if no photo
                                                )}

                                                <Form.Control
                                                    type="file"
                                                    onChange={handleFileChange}
                                                    name="r_aadhar_card"
                                                />
                                            </Col>
                                        </Form.Group>

                                        <Form.Group as={Row} className="mb-1 text-start" controlId="formPoliceMemo">
                                            <Form.Label column sm="6">
                                                Ration Card (Resident):
                                            </Form.Label>
                                            <Col sm="6" className='d-flex align-items-center justify-content-center'>
                                                {files.r_ration_card ? (
                                                    <>
                                                        <img
                                                            src={files.r_ration_card}
                                                            alt="Old"
                                                            style={{ width: "100px", height: "80px", marginTop: "10px" }}
                                                        />
                                                    </>
                                                ) : (
                                                    <p>No old photo available</p> // Display if no photo
                                                )}

                                                <Form.Control
                                                    type="file"
                                                    onChange={handleFileChange}
                                                    name="r_ration_card"
                                                />
                                            </Col>
                                        </Form.Group>
                                        <Form.Group as={Row} className="mb-1 text-start" controlId="formPoliceMemo">
                                            <Form.Label column sm="6">
                                                Any other Government ID :
                                            </Form.Label>
                                            <Col sm="6" className='d-flex align-items-center justify-content-center'>
                                                {files.govt_id ? (
                                                    <>
                                                        <img
                                                            src={files.govt_id}
                                                            alt="Old"
                                                            style={{ width: "100px", height: "80px", marginTop: "10px" }}
                                                        />
                                                    </>
                                                ) : (
                                                    <p>No old photo available</p> // Display if no photo
                                                )}

                                                <Form.Control
                                                    type="file"
                                                    onChange={handleFileChange}
                                                    name="govt_id"
                                                />
                                            </Col>
                                        </Form.Group>

                                        <Form.Group as={Row} className="mb-1 text-start" controlId="formPoliceMemo">
                                            <Form.Label column sm="6">
                                                Description :
                                            </Form.Label>
                                            <Col sm="6">
                                                <Form.Control
                                                    as="textarea"
                                                    rows={2}
                                                    name="description"
                                                    value={formData.description}
                                                    onChange={handleInputChange}
                                                    required />
                                            </Col>
                                        </Form.Group>

                                    </Col>
                                    <div className="mt-3 d-flex align-tems-cente justify-content-between">
                                        <Button
                                            variant="success"
                                            className="m-1"
                                            type="submit"
                                            onClick={(e) => handleUpdate(e, admissionNumber)}
                                        >Update</Button>
                                        <Button variant="secondary" className="m-1" onClick={handleClose}>Close</Button>
                                    </div>

                                </Form>
                            </Col>
                        </Modal.Body>
                    </Modal>

                </Row>
            </Container>
        </div>
    )
}

export default Family_Request_form
