import React from 'react';
import { Breadcrumb, Container, Row, Col, Form, InputGroup, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from 'axios';
import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Modal from 'react-bootstrap/Modal';
import Cookies from 'js-cookie';
import manasu_logo from '../Admission/Manasu-Logo.png';

function Formality_declaration() {
    const [show, setShow] = useState(false);
    const [admission_no, setAdmissionNumber] = useState('');
    const [previewRequested, setPreviewRequested] = useState(false);
    const [error, setError] = useState("");
    const [rescueImage, setRescueImage] = useState(null);
    const [rescue_name, setRescueName] = useState("");
    const [age, setAge] = useState("");

    const userType = Cookies.get('usertype');

    const handleClose = () => setShow(false);

    const [formData, setFormData] = useState({
        admission_no: '',
        rescue_name: '',
        age: '',
        medicine_provided: '',
        toiletries_provided: '',
        dress_provided: '',
        travel_expenses: '',
        welfare_expenses: '',
        medical_prescription: '',
        discharge_summary: '',
        travel_letter: ''
    })

    const [editData, setEditData] = useState({
        admission_no: '',
        rescue_name: '',
        age: '',
        medicine_provided: '',
        toiletries_provided: '',
        dress_provided: '',
        travel_expenses: '',
        welfare_expenses: '',
        medical_prescription: '',
        discharge_summary: '',
        travel_letter: ''
    })

    const apiRoute = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleInputChange1 = (e) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    const handleCheckChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCheckChange1 = (e) => {
        const { name, value } = e.target;
        setEditData((prev) => ({ ...prev, [name]: value }));
    };

    const fetchRescueDetails = async (admission_no) => {
        try {
            const response = await apiRoute.get(`/admision/get_scrbform2data/${admission_no}`);
            const result = response.data.data[0];
            console.log("API Result:", result);

            if (result && result.rescue_image) {
                let imagePath = null;

                // Check if rescue_image is an array-like string
                if (result.rescue_image.startsWith("[") && result.rescue_image.endsWith("]")) {
                    try {
                        // Parse the string to get the array
                        const imageArray = JSON.parse(result.rescue_image.replace(/&quot;/g, '"'));

                        if (Array.isArray(imageArray) && imageArray.length > 0) {
                            imagePath = `https://www.pahrultours.com/app2/${imageArray[0]}`;
                        }
                    } catch (parseError) {
                        console.error("Error parsing image array:", parseError);
                        imagePath = null;
                    }
                } else {
                    // It's a single image path
                    imagePath = result.rescue_image.startsWith("http")
                        ? result.rescue_image
                        : `https://www.pahrultours.com/app2/${result.rescue_image}`;
                }

                if (imagePath) {
                    setRescueImage(imagePath);
                    setRescueName(result.rescue_name || "");
                    setAge(result.age || "");
                    setError("");
                } else {
                    setRescueImage(null);
                    setRescueName("");
                    setAge("");
                    setError("Image not found for this admission number");
                }
            } else {
                setRescueImage(null);
                setRescueName("");
                setAge("");
                setError("Image not found for this admission number");
            }
        } catch (error) {
            console.error("Error fetching data", error);
            setRescueImage(null);
            setRescueName("");
            setAge("");
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


    // Automatically fetch data when admission number is typed
    useEffect(() => {
        if (admission_no.trim().length >= 12) { // Adjust minimum length as needed
            fetchFormData();
        }
    }, [admission_no]);

    const fetchFormData = async () => {
        try {
            const response = await apiRoute.get(`/reunion/get_information/${admission_no}`);
            console.log("Fetched data:", response.data);
            if (response.data && response.data.data) {
                setFormData(response.data.data);
            } else {
                console.warn("Unexpected response structure:", response.data);
            }
        } catch (error) {
            console.error('Error fetching data', error);
            alert("Admission Number Not found");
        }
    };


    const createFormData = () => {
        const targetElement = document.querySelector('.self_declaration');
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!admission_no || admission_no.trim() === '') {
            alert("Admission Number is required.");
            return;
        }

        const trimmedAdNo = admission_no.trim();

        if (!/^\d{8,13}$/.test(trimmedAdNo)) {
            alert("Admission Number must be between 8 to 13 digits (numbers only).");
            return;
        }

        if (!formData.medicine_provided || formData.medicine_provided.trim() === '') {
            alert("Please select Medicine Provided field Yes or No.");
            return;
        }

        if (!formData.toiletries_provided || formData.toiletries_provided.trim() === '') {
            alert("Please select Toiletries provided field Yes or No.");
            return;
        }
        if (!formData.dress_provided || formData.dress_provided.trim() === '') {
            alert("Please select Dress Provided field Yes or No.");
            return;
        }
        if (!formData.travel_expenses || formData.travel_expenses.trim() === '') {
            alert("Please select Travel Expenses Provided field Yes or No.");
            return;
        }
        if (!formData.welfare_expenses || formData.welfare_expenses.trim() === '') {
            alert("Please select Welfare Expenses field Yes or No.");
            return;
        }
        if (!formData.medical_prescription || formData.medical_prescription.trim() === '') {
            alert("Please select Medical Prescription field Yes or No.");
            return;
        }
        if (!formData.discharge_summary || formData.discharge_summary.trim() === '') {
            alert("Please select Copy of Discharge Summary field Yes or No.");
            return;
        }
        if (!formData.travel_letter || formData.travel_letter.trim() === '') {
            alert("Please select Travel Safety Letter field Yes or No.");
            return;
        }
        console.log("Submitting form data:", formData);
        console.log("Trimmed Admission No:", trimmedAdNo);
        const payload = {
            ...formData,
            admission_no,
            rescue_name: rescue_name,
            age: age
        }
        try {
            const res = await apiRoute.post('/formality/createDeclaration', payload);
            alert('Document Handover Form submitted successfully!');
            setFormData({
                admission_no: '',
                rescue_name: '',
                age: '',
                medicine_provided: '',
                toiletries_provided: '',
                dress_provided: '',
                travel_expenses: '',
                welfare_expenses: '',
                medical_prescription: '',
                discharge_summary: '',
                travel_letter: ''
            })
            setAdmissionNumber("");
            setRescueName("");
            setAge("");
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                alert(err.response.data.message);
            } else {
                alert("Something went wrong.");
            }
            console.error(err);
            alert('Submission failed.');
        }
    };

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
            const response = await apiRoute.get(`/formality/getFormalityForm/${admission_no}`);
            const data = response.data;

            // Update form fields
            setFormData((formData) => ({
                ...formData,
                rescue_name: data.rescue_name || '',
                age: data.age || '',
                admission_no: data.admission_no || '',
                medicine_provided: data.medicine_provided || '',
                toiletries_provided: data.toiletries_provided || '',
                dress_provided: data.dress_provided || '',
                travel_expenses: data.travel_expenses || '',
                welfare_expenses: data.welfare_expenses || '',
                medical_prescription: data.medical_prescription || '',
                discharge_summary: data.discharge_summary || '',
                travel_letter: data.travel_letter || '',
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
                setFormData('');
            }, 100); // 100ms delay is often enough
        }
    }, [previewRequested]);

    const handleShow = async (admission_no) => {
        try {
            const response = await apiRoute.get(`/formality/getFormalityForm/${admission_no}`);
            const data = response.data;

            setEditData((editData) => ({
                ...editData,
                rescue_name: data.rescue_name || '',
                age: data.age || '',
                admission_no: data.admission_no || '',
                medicine_provided: data.medicine_provided || '',
                toiletries_provided: data.toiletries_provided || '',
                dress_provided: data.dress_provided || '',
                travel_expenses: data.travel_expenses || '',
                welfare_expenses: data.welfare_expenses || '',
                medical_prescription: data.medical_prescription || '',
                discharge_summary: data.discharge_summary || '',
                travel_letter: data.travel_letter || '',
            }));

            setShow(true);
        } catch (error) {
            console.error("Error fetching form data:", error);
            alert("Admission Number not found");
        }
    };

    const handleUpdate = async (e, admission_no) => {
        e.preventDefault();
        try {
            const response = await apiRoute.put(`/formality/updateFormalityForm/${admission_no}`, editData);
            console.log(response.data);
            if (response.status === 200) {
                alert('Form Updated successfully!');
                handleClose(true);
                setEditData({
                    admission_no: '',
                    rescue_name: '',
                    age: '',
                    medicine_provided: '',
                    toiletries_provided: '',
                    dress_provided: '',
                    travel_expenses: '',
                    welfare_expenses: '',
                    medical_prescription: '',
                    discharge_summary: '',
                    travel_letter: ''
                })
                setAdmissionNumber("");
                setRescueName("");
                setAge("");
            } else {
                alert('Error Updating form.');
            }
        } catch (error) {
            console.error('There was an error Updating the form:', error);
            alert('There was an error Updating the form.');
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
                            <Breadcrumb.Item active>Admin Formality</Breadcrumb.Item>
                        </Breadcrumb>
                        <h6 className="breadcrumb_title">Declaration Form</h6>
                    </Col>
                    <Col md={8} className="text-center">
                        <h3 className="section_title">5. Resident's Possessions and Document Handover Form</h3>
                    </Col>

                    <Col md={2} className='text-center'>
                        {error && <div className="text-danger mt-2">{error}</div>}

                        {/* Rescue Name and Image */}
                        {rescueImage && (
                            <div>

                                <img

                                    alt={rescue_name || "Rescue Image"}
                                    style={{ width: "100px", height: "100px" }}
                                    src={rescueImage}
                                />
                                {rescue_name && <h6 className="mb-2">{rescue_name}</h6>}
                            </div>
                        )}
                    </Col>
                </Row>
            </Container>

            <Container>
                <Form className="navbar-search col-md-9 d-flex justify-content-center align-items-center mt-3">
                    <Form.Group id="topbarSearch" className="d-flex align-items-center">
                        <Col md={6}>
                            <Form.Label>Admission Number:</Form.Label>
                        </Col>
                        <Col md={6}>
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
                                ViewFormData(); // Fetch & populate data before generating PDF
                            }
                        }}><FontAwesomeIcon icon={faEye} className="me-0" /></button>
                        {userType === "1" && (
                            <button type="button" className="btn btn-success mx-1" onClick={() => {
                                if (!admission_no.trim()) {
                                    alert("Please enter admission number.");
                                } else {
                                    createFormData(); // Fetch & populate data before generating PDF
                                }
                            }}><FontAwesomeIcon icon={faPlus} className="me-0" /></button>
                        )}
                        <button type="button" className="btn btn-success mx-1" onClick={() => {
                            if (!admission_no.trim()) {
                                alert("Please enter admission number.");
                            } else {
                                handleShow(admission_no); // Fetch & populate data before generating PDF
                            }
                        }}><FontAwesomeIcon icon={faEdit} className="me-0" /></button>
                        {userType === "2" && (
                            <button type="button" className="btn btn-danger mx-1" onClick={() => {
                                if (!admission_no.trim()) {
                                    alert("Please enter admission number.");
                                } else {
                                    handleDelete(admission_no); // Fetch & populate data before generating PDF
                                }
                            }}><FontAwesomeIcon icon={faTrash} className="me-0" /></button>
                        )}
                    </Form.Group>
                </Form>
                <Row className='d-flex align-items-center justify-content-center'>
                    <Col md={8} className="consultant_box my-4 hand_over_form">
                        <div className="consultant_details">
                            <Form className='self_declaration' onSubmit={handleSubmit}>
                                <Row>
                                    <Form.Group as={Row} className="mb-1">
                                        <Form.Label column sm="4" className='text-start'>
                                            Name : <span style={{ color: 'red' }}>*</span>
                                        </Form.Label>
                                        <Col sm="8">
                                            <Form.Control
                                                type="text"
                                                name="rescue_name"
                                                value={rescue_name || formData.rescue_name}
                                                onChange={handleInputChange}
                                                required />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} className="mb-1">
                                        <Form.Label column sm="4" className='text-start'>
                                            Age : <span style={{ color: 'red' }}>*</span>
                                        </Form.Label>
                                        <Col sm="8">
                                            <Form.Control
                                                type="text"
                                                name="age"
                                                value={age || formData.age}
                                                onChange={handleInputChange}
                                                required />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} className="mb-1">
                                        <Form.Label column sm="4" className="text-start">
                                            30 days Medicine Provided : <span style={{ color: 'red' }}>*</span>
                                        </Form.Label>
                                        <Col sm="8" className='d-flex align-items-center'>
                                            <Form.Check
                                                type="radio"
                                                label="Yes"
                                                name="medicine_provided"
                                                value="Yes"
                                                checked={formData.medicine_provided === 'Yes'}
                                                onChange={handleCheckChange}
                                            />
                                            <Form.Check
                                                type="radio"
                                                label="No"
                                                name="medicine_provided"
                                                checked={formData.medicine_provided === 'No'}
                                                onChange={handleCheckChange}
                                                value="No"
                                            />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} className="mb-1">
                                        <Form.Label column sm="4" className="text-start">
                                            Toiletries provided : <span style={{ color: 'red' }}>*</span>
                                        </Form.Label>
                                        <Col sm="8" className='d-flex align-items-center'>
                                            <Form.Check
                                                type="radio"
                                                label="Yes"
                                                name="toiletries_provided"
                                                value="Yes"
                                                checked={formData.toiletries_provided === 'Yes'}
                                                onChange={handleCheckChange}
                                            />
                                            <Form.Check
                                                type="radio"
                                                label="No"
                                                name="toiletries_provided"
                                                value="No"
                                                checked={formData.toiletries_provided === 'No'}
                                                onChange={handleCheckChange}
                                            />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} className="mb-1">
                                        <Form.Label column sm="4" className="text-start">
                                            1 month dress provided : <span style={{ color: 'red' }}>*</span>
                                        </Form.Label>
                                        <Col sm="8" className='d-flex align-items-center'>
                                            <Form.Check
                                                type="radio"
                                                label="Yes"
                                                name="dress_provided"
                                                value="Yes"
                                                checked={formData.dress_provided === 'Yes'}
                                                onChange={handleCheckChange}
                                            />
                                            <Form.Check
                                                type="radio"
                                                label="No"
                                                name="dress_provided"
                                                value="No"
                                                checked={formData.dress_provided === 'No'}
                                                onChange={handleCheckChange}
                                            />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} className="mb-1">
                                        <Form.Label column sm="4" className="text-start">
                                            Travel Expenses Provided: <span style={{ color: 'red' }}>*</span>
                                        </Form.Label>
                                        <Col sm="8" className='d-flex align-items-center'>
                                            <Form.Check
                                                type="radio"
                                                label="Yes"
                                                name="travel_expenses"
                                                value="Yes"
                                                checked={formData.travel_expenses === 'Yes'}
                                                onChange={handleCheckChange}
                                            />
                                            <Form.Check
                                                type="radio"
                                                label="No"
                                                name="travel_expenses"
                                                value="No"
                                                checked={formData.travel_expenses === 'No'}
                                                onChange={handleCheckChange}
                                            />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} className="mb-1">
                                        <Form.Label column sm="4" className="text-start">
                                            Welfare Expenses : <span style={{ color: 'red' }}>*</span>
                                        </Form.Label>
                                        <Col sm="8" className='d-flex align-items-center'>
                                            <Form.Check
                                                type="radio"
                                                label="Yes"
                                                name="welfare_expenses"
                                                value="Yes"
                                                checked={formData.welfare_expenses === 'Yes'}
                                                onChange={handleCheckChange}
                                            />
                                            <Form.Check
                                                type="radio"
                                                label="No"
                                                name="welfare_expenses"
                                                value="No"
                                                checked={formData.welfare_expenses === 'No'}
                                                onChange={handleCheckChange}
                                            />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} className="mb-1">
                                        <Form.Label column sm="4" className="text-start">
                                            Medical Prescription : <span style={{ color: 'red' }}>*</span>
                                        </Form.Label>
                                        <Col sm="8" className='d-flex align-items-center'>
                                            <Form.Check
                                                type="radio"
                                                label="Yes"
                                                name="medical_prescription"
                                                value="Yes"
                                                checked={formData.medical_prescription === 'Yes'}
                                                onChange={handleCheckChange}
                                            />
                                            <Form.Check
                                                type="radio"
                                                label="No"
                                                name="medical_prescription"
                                                value="No"
                                                checked={formData.medical_prescription === 'No'}
                                                onChange={handleCheckChange}
                                            />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} className="mb-1">
                                        <Form.Label column sm="4" className="text-start">
                                            Copy of Discharge Summary : <span style={{ color: 'red' }}>*</span>
                                        </Form.Label>
                                        <Col sm="8" className='d-flex align-items-center'>
                                            <Form.Check
                                                type="radio"
                                                label="Yes"
                                                name="discharge_summary"
                                                value="Yes"
                                                checked={formData.discharge_summary === 'Yes'}
                                                onChange={handleCheckChange}
                                            />
                                            <Form.Check
                                                type="radio"
                                                label="No"
                                                name="discharge_summary"
                                                value="No"
                                                checked={formData.discharge_summary === 'No'}
                                                onChange={handleCheckChange}
                                            />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} className="mb-1">
                                        <Form.Label column sm="4" className="text-start">
                                            Travel Safety Letter : <span style={{ color: 'red' }}>*</span>
                                        </Form.Label>
                                        <Col sm="8" className='d-flex align-items-center'>
                                            <Form.Check
                                                type="radio"
                                                label="Yes"
                                                name="travel_letter"
                                                value="Yes"
                                                checked={formData.travel_letter === 'Yes'}
                                                onChange={handleCheckChange}
                                            />
                                            <Form.Check
                                                type="radio"
                                                label="No"
                                                name="travel_letter"
                                                value="No"
                                                checked={formData.travel_letter === 'No'}
                                                onChange={handleCheckChange}
                                            />
                                        </Col>
                                    </Form.Group>

                                    <div className="mt-3">
                                        <Button variant="success" className="m-1" type="submit">Submit</Button>
                                    </div>

                                </Row>
                            </Form>

                        </div>
                    </Col>
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
                        <h4 className="text-center">5. Resident's Possessions and Document Handover Form</h4>
                    </Col>
                </Row>
                <Form className='self_declaration d-flex align-items-center justify-content-center'>
                    <Row>
                        <Form.Group as={Row} className="mb-1">
                            <Form.Label column sm="4" className='text-start'>
                                Name :
                            </Form.Label>
                            <Col sm="6">
                                <Form.Control
                                    type="text"
                                    name="rescue_name"
                                    value={formData.rescue_name}
                                    onChange={handleInputChange}
                                    required />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-1">
                            <Form.Label column sm="4" className='text-start'>
                                Age :
                            </Form.Label>
                            <Col sm="6">
                                <Form.Control
                                    type="text"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleInputChange}
                                    required />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-1">
                            <Form.Label column sm="4" className='text-start'>
                                Admission No. :
                            </Form.Label>
                            <Col sm="6">
                                <Form.Control
                                    type="number"
                                    name="admission_no"
                                    value={formData.admission_no}
                                    onChange={handleInputChange}
                                    required />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-1">
                            <Form.Label column sm="4" className="text-start">
                                30 days Medicine Provided :
                            </Form.Label>
                            <Col sm="6" className='d-flex align-items-center'>
                                <Form.Check
                                    type="radio"
                                    label="Yes"
                                    name="medicine_provided"
                                    value="Yes"
                                    checked={formData.medicine_provided === 'Yes'}
                                    onChange={handleCheckChange}
                                />
                                <Form.Check
                                    type="radio"
                                    label="No"
                                    name="medicine_provided"
                                    checked={formData.medicine_provided === 'No'}
                                    onChange={handleCheckChange}
                                    value="No"
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-1">
                            <Form.Label column sm="4" className="text-start">
                                Toiletries provided :
                            </Form.Label>
                            <Col sm="6" className='d-flex align-items-center'>
                                <Form.Check
                                    type="radio"
                                    label="Yes"
                                    name="toiletries_provided"
                                    value="Yes"
                                    checked={formData.toiletries_provided === 'Yes'}
                                    onChange={handleCheckChange}
                                />
                                <Form.Check
                                    type="radio"
                                    label="No"
                                    name="toiletries_provided"
                                    value="No"
                                    checked={formData.toiletries_provided === 'No'}
                                    onChange={handleCheckChange}
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-1">
                            <Form.Label column sm="4" className="text-start">
                                1 month dress provided :
                            </Form.Label>
                            <Col sm="6" className='d-flex align-items-center'>
                                <Form.Check
                                    type="radio"
                                    label="Yes"
                                    name="dress_provided"
                                    value="Yes"
                                    checked={formData.dress_provided === 'Yes'}
                                    onChange={handleCheckChange}
                                />
                                <Form.Check
                                    type="radio"
                                    label="No"
                                    name="dress_provided"
                                    value="No"
                                    checked={formData.dress_provided === 'No'}
                                    onChange={handleCheckChange}
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-1">
                            <Form.Label column sm="4" className="text-start">
                                Discharge Allowance / Travel Expenses Provided:
                            </Form.Label>
                            <Col sm="6" className='d-flex align-items-center'>
                                <Form.Check
                                    type="radio"
                                    label="Yes"
                                    name="travel_expenses"
                                    value="Yes"
                                    checked={formData.travel_expenses === 'Yes'}
                                    onChange={handleCheckChange}
                                />
                                <Form.Check
                                    type="radio"
                                    label="No"
                                    name="travel_expenses"
                                    value="No"
                                    checked={formData.travel_expenses === 'No'}
                                    onChange={handleCheckChange}
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-1">
                            <Form.Label column sm="4" className="text-start">
                                Welfare Expenses :
                            </Form.Label>
                            <Col sm="8" className='d-flex align-items-center'>
                                <Form.Check
                                    type="radio"
                                    label="Yes"
                                    name="welfare_expenses"
                                    value="Yes"
                                    checked={formData.welfare_expenses === 'Yes'}
                                    onChange={handleCheckChange}
                                />
                                <Form.Check
                                    type="radio"
                                    label="No"
                                    name="welfare_expenses"
                                    value="No"
                                    checked={formData.welfare_expenses === 'No'}
                                    onChange={handleCheckChange}
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-1">
                            <Form.Label column sm="4" className="text-start">
                                Medical Prescription :
                            </Form.Label>
                            <Col sm="8" className='d-flex align-items-center'>
                                <Form.Check
                                    type="radio"
                                    label="Yes"
                                    name="medical_prescription"
                                    value="Yes"
                                    checked={formData.medical_prescription === 'Yes'}
                                    onChange={handleCheckChange}
                                />
                                <Form.Check
                                    type="radio"
                                    label="No"
                                    name="medical_prescription"
                                    value="No"
                                    checked={formData.medical_prescription === 'No'}
                                    onChange={handleCheckChange}
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-1">
                            <Form.Label column sm="4" className="text-start">
                                Copy of Discharge Summary :
                            </Form.Label>
                            <Col sm="8" className='d-flex align-items-center'>
                                <Form.Check
                                    type="radio"
                                    label="Yes"
                                    name="discharge_summary"
                                    value="Yes"
                                    checked={formData.discharge_summary === 'Yes'}
                                    onChange={handleCheckChange}
                                />
                                <Form.Check
                                    type="radio"
                                    label="No"
                                    name="discharge_summary"
                                    value="No"
                                    checked={formData.discharge_summary === 'No'}
                                    onChange={handleCheckChange}
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-1">
                            <Form.Label column sm="4" className="text-start">
                                Travel Safety Letter :
                            </Form.Label>
                            <Col sm="8" className='d-flex align-items-center'>
                                <Form.Check
                                    type="radio"
                                    label="Yes"
                                    name="travel_letter"
                                    value="Yes"
                                    checked={formData.travel_letter === 'Yes'}
                                    onChange={handleCheckChange}
                                />
                                <Form.Check
                                    type="radio"
                                    label="No"
                                    name="travel_letter"
                                    value="No"
                                    checked={formData.travel_letter === 'No'}
                                    onChange={handleCheckChange}
                                />
                            </Col>
                        </Form.Group>
                        <Col md={12}>
                            <Row className="d-flex align-items-center justify-content-center mt-3">
                                <Col md={6} className="mt-3 down_title">
                                    <h5 className="text-start">Signature / Thumbprint of Resident's</h5>
                                </Col>
                                <Col md={6} className="mt-3 down_title">
                                    <h5 className="text-end">Manasu Seal</h5>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Form>
            </div>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Family Request Letter</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Col md={12}>
                        <Form className='self_declaration'>
                            <Row>
                                <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                    <Form.Label column sm="6" className='text-start'>
                                        Name :
                                    </Form.Label>
                                    <Col sm="6">
                                        <Form.Control
                                            type="text"
                                            name="rescue_name"
                                            value={editData.rescue_name}
                                            onChange={handleInputChange1}
                                            required />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                    <Form.Label column sm="6" className='text-start'>
                                        Age :
                                    </Form.Label>
                                    <Col sm="6">
                                        <Form.Control
                                            type="text"
                                            name="age"
                                            value={editData.age}
                                            onChange={handleInputChange1}
                                            required />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-1">
                                    <Form.Label column sm="6" className="text-start">
                                        30 days Medicine Provided : <span style={{ color: 'red' }}>*</span>
                                    </Form.Label>
                                    <Col sm="6" className='d-flex align-items-center'>
                                        <Form.Check
                                            type="radio"
                                            label="Yes"
                                            name="medicine_provided"
                                            value="Yes"
                                            checked={editData.medicine_provided === 'Yes'}
                                            onChange={handleCheckChange1}
                                        />
                                        <Form.Check
                                            type="radio"
                                            label="No"
                                            name="medicine_provided"
                                            checked={editData.medicine_provided === 'No'}
                                            onChange={handleCheckChange1}
                                            value="No"
                                        />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-1">
                                    <Form.Label column sm="6" className="text-start">
                                        Toiletries provided : <span style={{ color: 'red' }}>*</span>
                                    </Form.Label>
                                    <Col sm="6" className='d-flex align-items-center'>
                                        <Form.Check
                                            type="radio"
                                            label="Yes"
                                            name="toiletries_provided"
                                            value="Yes"
                                            checked={editData.toiletries_provided === 'Yes'}
                                            onChange={handleCheckChange1}
                                        />
                                        <Form.Check
                                            type="radio"
                                            label="No"
                                            name="toiletries_provided"
                                            value="No"
                                            checked={editData.toiletries_provided === 'No'}
                                            onChange={handleCheckChange1}
                                        />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-1">
                                    <Form.Label column sm="6" className="text-start">
                                        1 month dress provided : <span style={{ color: 'red' }}>*</span>
                                    </Form.Label>
                                    <Col sm="6" className='d-flex align-items-center'>
                                        <Form.Check
                                            type="radio"
                                            label="Yes"
                                            name="dress_provided"
                                            value="Yes"
                                            checked={editData.dress_provided === 'Yes'}
                                            onChange={handleCheckChange1}
                                        />
                                        <Form.Check
                                            type="radio"
                                            label="No"
                                            name="dress_provided"
                                            value="No"
                                            checked={editData.dress_provided === 'No'}
                                            onChange={handleCheckChange1}
                                        />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1">
                                    <Form.Label column sm="6" className="text-start">
                                        Discharge Allowance / Travel Expenses Provided : <span style={{ color: 'red' }}>*</span>
                                    </Form.Label>
                                    <Col sm="6" className='d-flex align-items-center'>
                                        <Form.Check
                                            type="radio"
                                            label="Yes"
                                            name="travel_expenses"
                                            value="Yes"
                                            checked={editData.travel_expenses === 'Yes'}
                                            onChange={handleCheckChange1}
                                        />
                                        <Form.Check
                                            type="radio"
                                            label="No"
                                            name="travel_expenses"
                                            value="No"
                                            checked={editData.travel_expenses === 'No'}
                                            onChange={handleCheckChange1}
                                        />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-1">
                                    <Form.Label column sm="6" className="text-start">
                                        Welfare Expenses : <span style={{ color: 'red' }}>*</span>
                                    </Form.Label>
                                    <Col sm="6" className='d-flex align-items-center'>
                                        <Form.Check
                                            type="radio"
                                            label="Yes"
                                            name="welfare_expenses"
                                            value="Yes"
                                            checked={editData.welfare_expenses === 'Yes'}
                                            onChange={handleCheckChange1}
                                        />
                                        <Form.Check
                                            type="radio"
                                            label="No"
                                            name="welfare_expenses"
                                            value="No"
                                            checked={editData.welfare_expenses === 'No'}
                                            onChange={handleCheckChange1}
                                        />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-1">
                                    <Form.Label column sm="6" className="text-start">
                                        Medical Prescription : <span style={{ color: 'red' }}>*</span>
                                    </Form.Label>
                                    <Col sm="6" className='d-flex align-items-center'>
                                        <Form.Check
                                            type="radio"
                                            label="Yes"
                                            name="medical_prescription"
                                            value="Yes"
                                            checked={editData.medical_prescription === 'Yes'}
                                            onChange={handleCheckChange1}
                                        />
                                        <Form.Check
                                            type="radio"
                                            label="No"
                                            name="medical_prescription"
                                            value="No"
                                            checked={editData.medical_prescription === 'No'}
                                            onChange={handleCheckChange1}
                                        />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-1">
                                    <Form.Label column sm="6" className="text-start">
                                        Copy of Discharge Summary : <span style={{ color: 'red' }}>*</span>
                                    </Form.Label>
                                    <Col sm="6" className='d-flex align-items-center'>
                                        <Form.Check
                                            type="radio"
                                            label="Yes"
                                            name="discharge_summary"
                                            value="Yes"
                                            checked={editData.discharge_summary === 'Yes'}
                                            onChange={handleCheckChange1}
                                        />
                                        <Form.Check
                                            type="radio"
                                            label="No"
                                            name="discharge_summary"
                                            value="No"
                                            checked={editData.discharge_summary === 'No'}
                                            onChange={handleCheckChange1}
                                        />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-1">
                                    <Form.Label column sm="6" className="text-start">
                                        Travel Safety Letter : <span style={{ color: 'red' }}>*</span>
                                    </Form.Label>
                                    <Col sm="6" className='d-flex align-items-center'>
                                        <Form.Check
                                            type="radio"
                                            label="Yes"
                                            name="travel_letter"
                                            value="Yes"
                                            checked={editData.travel_letter === 'Yes'}
                                            onChange={handleCheckChange1}
                                        />
                                        <Form.Check
                                            type="radio"
                                            label="No"
                                            name="travel_letter"
                                            value="No"
                                            checked={editData.travel_letter === 'No'}
                                            onChange={handleCheckChange1}
                                        />
                                    </Col>
                                </Form.Group>


                                <div className="mt-3">
                                    <Button variant="success" className="m-1" type="submit" onClick={(e) => handleUpdate(e, admission_no)}>Update</Button>
                                    <Button variant="secondary" className="m-1" onClick={handleClose}>Close</Button>
                                </div>

                            </Row>
                        </Form>
                    </Col>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default Formality_declaration
