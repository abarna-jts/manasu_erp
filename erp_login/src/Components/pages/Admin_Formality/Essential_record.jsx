import React from 'react';
import { Breadcrumb, Container, Row, Col, Form, InputGroup, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from 'axios';
import { useState, useEffect } from 'react';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useRef } from "react";
import Modal from 'react-bootstrap/Modal';
import Cookies from 'js-cookie';
import { Alert } from "react-bootstrap";
import manasu_logo from '../Admission/Manasu-Logo.png';

function Essential_record() {
    const [admission_no, setAdmissionNumber] = useState('');
    const [previewRequested, setPreviewRequested] = useState(false);
    const [show, setShow] = useState(false);
    const [rescueImage, setRescueImage] = useState(null);
    const [rescueName, setRescueName] = useState("");
    const [error, setError] = useState("");
    const [formErrors, setFormErrors] = useState({});

    //alert box values
    const [submissionMessage, setSubmissionMessage] = useState("");
    const [messageType, setMessageType] = useState(""); // 'success' or 'danger'

    const handleClose = () => setShow(false);

    const userType = Cookies.get('usertype');

    const [formData, setFormData] = useState({
        admission_no: '',
        rescue_name: '',
        aadhar_card: '',
        udid_no: '',
        disability_no: '',
        voter_id: '',
        form_7: '',
        bank_name: '',
        account_no: '',
        ifsc_code: '',
        insurance_provider: '',
        policy_no: '',
        validity_period: '',
        other_gvt_scheme: '',
        any_other: ''
    })

    const [files, setFiles] = useState({
        bank_passbook: null,
        form7_attach: null,
    });

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFiles(prev => ({
            ...prev,
            [name]: files[0]
        }));
    };

    const apiRoute = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
    });

    const validateField = (name, value) => {
        let error = "";

        if (name === "aadhar_card") {
            const aadhaarPattern = /^([0-9]{4} [0-9]{4} [0-9]{4}|UNKNOWN)$/;
            if (!aadhaarPattern.test(value)) {
                error = "Enter a valid Aadhaar (XXXX XXXX XXXX) or type 0000 0000 0000";
            }
        }

        if (name === "udid_no") {
            const udidPattern = /^([A-Z0-9]{20}|UNKNOWN)$/;
            if (!udidPattern.test(value)) {
                error = "Enter a valid 20-character UDID or type UNKNOWN";
            }
        }

        if (name === "voter_id") {
            const voterPattern = /^([A-Z]{3}[0-9]{7}|UNKNOWN)$/;
            if (!voterPattern.test(value)) {
                error = "Enter 3 letters and 7 digits (e.g., ABC1234567) or type UNKNOWN";
            }
        }

        if (name === "ifsc_code") {
            const ifscPattern = /^([A-Z]{4}0[A-Z0-9]{6}|UNKNOWN)$/;
            if (!ifscPattern.test(value)) {
                error = "Enter valid IFSC code (e.g., SBIN0001234) or type UNKNOWN";
            }
        }

        return error;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let updatedValue = value.toUpperCase();

        // Custom formatting logic
        if (name === "aadhar_card" && updatedValue !== "UNKNOWN") {
            updatedValue = value.replace(/\D/g, '').slice(0, 12);
            updatedValue = updatedValue.replace(/(.{4})/g, '$1 ').trim();
        }

        if (name === "udid_no" && updatedValue !== "UNKNOWN") {
            updatedValue = updatedValue.replace(/[^A-Z0-9]/gi, '').slice(0, 20).toUpperCase();
        }

        if (name === "voter_id" && updatedValue !== "UNKNOWN") {
            updatedValue = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
            if (updatedValue.length > 10) return;
        }

        if (name === "ifsc_code" && updatedValue !== "UNKNOWN") {
            updatedValue = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
            if (updatedValue.length > 11) return;
        }

        // Set form data
        setFormData(prev => ({
            ...prev,
            [name]: updatedValue
        }));

        // Validate and set error
        const errorMsg = validateField(name, updatedValue);
        setFormErrors(prev => ({
            ...prev,
            [name]: errorMsg
        }));
    };



    const handleCheckChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Automatically fetch data when admission number is typed
    useEffect(() => {
        if (admission_no.trim().length >= 8) { // Adjust minimum length as needed
            fetchFormData();
        }
    }, [admission_no]);

    const fetchFormData = async () => {
        try {
            const response = await apiRoute.get(`/reunion/get_information/${admission_no}`);
            setFormData(response.data.data[0]);
        } catch (error) {
            console.error('Error fetching data', error);
            alert("Admission Number Not found");
        }
    };

    const createFormData = () => {
        const targetElement = document.querySelector('.essential_records');
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        let errors = {};

        if (!admission_no || admission_no.trim() === '') {
            alert("Admission Number is required.");
            return;
        }

        const trimmedAdNo = admission_no.trim();

        if (!/^\d{8}$/.test(trimmedAdNo) && !/^\d{10}$/.test(trimmedAdNo)) {
            alert("Admission Number must be exactly 8 or 10 digits (numbers only).");
            return;
        }

        // Aadhaar Validation
        if (formData.aadhar_card && formData.aadhar_card !== "UNKNOWN") {
            const digitsOnly = formData.aadhar_card.replace(/\D/g, '');
            if (digitsOnly.length !== 12) {
                alert("Aadhaar number must be 12 digits or type UNKNOWN");
                return;
            }
        }

        // UDID Validation
        if (formData.udid_no && formData.udid_no !== "UNKNOWN") {
            const cleaned = formData.udid_no.replace(/[^A-Z0-9]/gi, '');
            if (cleaned.length !== 20) {
                alert("UDID must be exactly 20 alphanumeric characters or type UNKNOWN");
                return;
            }
        }

        // Voter ID Validation
        if (formData.voter_id && formData.voter_id !== "UNKNOWN") {
            const cleaned = formData.voter_id.replace(/[^A-Za-z0-9]/g, '');
            if (!/^[A-Z]{3}[0-9]{7}$/.test(cleaned)) {
                alert("Voter ID must be 3 letters followed by 7 digits or type UNKNOWN");
                return;
            }
        }

        // IFSC Code Validation
        if (formData.ifsc_code && formData.ifsc_code !== "UNKNOWN") {
            const cleaned = formData.ifsc_code.replace(/[^A-Za-z0-9]/g, '');
            if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(cleaned)) {
                alert("IFSC Code must follow format like SBIN0001234 or type UNKNOWN");
                return;
            }
        }


        const data = new FormData();
        data.append('admission_no', admission_no);
        data.append('rescue_name', formData.rescue_name);
        data.append('aadhar_card', formData.aadhar_card);
        data.append('udid_no', formData.udid_no);
        data.append('disability_no', formData.disability_no);
        data.append('voter_id', formData.voter_id);
        data.append('form7_attach', files.form7_attach);
        data.append('form_7', formData.form_7);
        data.append('bank_name', formData.bank_name);
        data.append('account_no', formData.account_no);
        data.append('ifsc_code', formData.ifsc_code);
        data.append('bank_passbook', files.bank_passbook);
        data.append('insurance_provider', formData.insurance_provider);
        data.append('policy_no', formData.policy_no);
        data.append('validity_period', formData.validity_period);
        data.append('other_gvt_scheme', formData.other_gvt_scheme);
        data.append('any_other', formData.any_other);

        try {
            const res = await apiRoute.post('/formality/createRecords', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            console.log(res);
            if (res.data.message === "Essential Records Form Created Successfully") {
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
    };

    const ViewFormData = async () => {
        try {
            const response = await apiRoute.get(`/formality/getEssentialRecord/${admission_no}`);
            const data = response.data;

            setFormData((formData) => ({
                ...formData,
                admission_no: data.admission_no || '',
                rescue_name: data.rescue_name || '',
                aadhar_card: data.aadhar_card || '',
                udid_no: data.udid_no || '',
                disability_no: data.disability_no || '',
                voter_id: data.voter_id || '',
                form_7: data.form_7 || '',
                bank_name: data.bank_name || '',
                account_no: data.account_no || '',
                ifsc_code: data.ifsc_code || '',
                insurance_provider: data.insurance_provider || '',
                policy_no: data.policy_no || '',
                validity_period: data.validity_period || '',
                other_gvt_scheme: data.other_gvt_scheme || '',
                any_other: data.any_other || '',
            }));

            const passbookPath = data.bank_passbook ? `https://www.pahrultours.com/app2/${data.bank_passbook}` : null;
            const Form7Path = data.form7_attach ? `https://www.pahrultours.com/app2/${data.form7_attach}` : null;

            console.log("bank_passbook path:", data.bank_passbook);
            console.log("Full URL:", passbookPath);

            console.log("Form 7 path:", data.form7_attach);
            console.log("Full URL:", Form7Path);

            // Set files state
            setFiles((files) => ({
                ...files,
                bank_passbook: passbookPath,
                form7_attach: Form7Path
            }));

            setPreviewRequested(true); // trigger the effect after state updates
        } catch (error) {
            console.error("Error fetching form data:", error);
            alert("Admission Number not found");
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

    const handleShow = async (admission_no) => {
        try {
            const response = await apiRoute.get(`/formality/getEssentialRecord/${admission_no}`);
            const data = response.data;

            setFormData((formData) => ({
                ...formData,
                admission_no: data.admission_no || '',
                rescue_name: data.rescue_name || '',
                aadhar_card: data.aadhar_card || '',
                udid_no: data.udid_no || '',
                disability_no: data.disability_no || '',
                voter_id: data.voter_id || '',
                form_7: data.form_7 || '',
                bank_name: data.bank_name || '',
                account_no: data.account_no || '',
                ifsc_code: data.ifsc_code || '',
                insurance_provider: data.insurance_provider || '',
                policy_no: data.policy_no || '',
                validity_period: data.validity_period || '',
                other_gvt_scheme: data.other_gvt_scheme || '',
                any_other: data.any_other || '',
            }));


            // Handle old and new photo paths correctly
            const bankPassbookPath = data.bank_passbook ? `https://www.pahrultours.com/app2/${data.bank_passbook}` : null;
            const Form7Path = data.form7_attach ? `https://www.pahrultours.com/app2/${data.form7_attach}` : null;


            // Set files state
            setFiles((files) => ({
                ...files,
                bank_passbook: bankPassbookPath,
                form7_attach: Form7Path,
            }));


            setShow(true);
        } catch (error) {
            console.error("Error fetching form data:", error);
            alert("Admission Number not found");
        }
    };

    // const handleUpdate = async (e, admission_no) => {
    //     e.preventDefault();
    //     try {
    //         const response = await apiRoute.put(`/formality/updateEssentialRecords/${admission_no}`, formData);
    //         console.log(response.data);
    //         if (response.status === 200) {
    //             alert('Form Updated successfully!');
    //             handleClose(true);
    //             window.location.reload();
    //         } else {
    //             alert('Error Updating form.');
    //         }
    //     } catch (error) {
    //         console.error('There was an error Updating the form:', error);
    //         alert('There was an error Updating the form.');
    //     }
    // };

    const handleUpdate = async (e, admission_no) => {
        e.preventDefault();

        const data = new FormData();
        data.append('rescue_name', formData.rescue_name);
        data.append('aadhar_card', formData.aadhar_card);
        data.append('udid_no', formData.udid_no);
        data.append('disability_no', formData.disability_no);
        data.append('voter_id', formData.voter_id);
        data.append('form_7', formData.form_7);
        data.append('form7_attach', files.form7_attach);
        data.append('bank_name', formData.bank_name);
        data.append('account_no', formData.account_no);
        data.append('ifsc_code', formData.ifsc_code);
        data.append('bank_passbook', files.bank_passbook);
        data.append('insurance_provider', formData.insurance_provider);
        data.append('policy_no', formData.policy_no);
        data.append('validity_period', formData.validity_period);
        data.append('other_gvt_scheme', formData.other_gvt_scheme);
        data.append('any_other', formData.any_other);

        try {
            const res = await apiRoute.put(`/formality/updateEssentialRecords/${admission_no}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert('Updated successfully!');
            window.location.reload();
        } catch (err) {
            console.error(err);
            alert('Update failed.');
        }
    };

    const handleDelete = async (admission_no) => {
        alert("Are you sure want to delete");
        try {
            const response = await apiRoute.delete(`/formality/deleteEssentailRecord/${admission_no}`);
            console.log(response);
            alert("Resident Document Form Deleted successfully");
            // Refresh data after deletion
            getRescueDetails(); // if this function fetches updated student list
        } catch (error) {
            console.error('Failed to delete item:', error);
        }
    };

    const fetchRescueDetails = async (admission_no) => {
        try {
            const response = await apiRoute.get(`/admision/get_scrbform2data/${admission_no}`);
            const result = response.data.data[0];
            console.log("API Result:", result);

            if (result && result.rescue_image) {
                const imagePath = result.rescue_image.startsWith("http")
                    ? result.rescue_image
                    : `https://www.pahrultours.com/app2/${result.rescue_image}`;

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
        if (admission_no.trim() !== "") {
            fetchRescueDetails(admission_no);
        } else {
            setRescueImage(null);
            setRescueName("");
            setError("");
        }
    }, [admission_no]);

    return (
        <>
            <Container fluid>
                <Row className='d-flex align-items-center justify-content-between'>
                    <Col md={2} className='text-start'>
                        <Breadcrumb className="d-none d-md-inline-block mb-0 mobile_breadcrumb" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
                            <Breadcrumb.Item></Breadcrumb.Item>
                            <Breadcrumb.Item>Home</Breadcrumb.Item>
                            <Breadcrumb.Item active>Admin Formality</Breadcrumb.Item>
                        </Breadcrumb>
                        <h6 className="breadcrumb_title">Records</h6>
                    </Col>
                    <Col md={7} className="text-center">
                        <h3 className="section_title">Resident Document Information Form</h3>
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
                        {/* {userType === "2" && (
                            <button type="button" className="btn btn-danger mx-1" onClick={() => {
                                if (!admission_no.trim()) {
                                    alert("Please enter admission number.");
                                } else {
                                    handleDelete(admission_no); // Fetch & populate data before generating PDF
                                }
                            }}><FontAwesomeIcon icon={faTrash} className="me-0" /></button>
                        )} */}
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


                <Row className='d-flex align-items-center justify-content-center'>
                    <Col md={8} className="consultant_box my-4">
                        <div className="consultant_details">
                            <Form className='media_consent' onSubmit={handleSubmit}>
                                <Row>
                                    <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                        <Form.Label column sm="4" className='text-start'>
                                            Name :
                                        </Form.Label>
                                        <Col sm="8" className='d-flex align-items-center'>
                                            <Form.Control
                                                type="text"
                                                name="rescue_name"
                                                value={formData.rescue_name}
                                                onChange={handleInputChange}
                                                required />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} className="mb-3 text-start">
                                        <Form.Label className='form_title' column sm="4">
                                            ID Cards :
                                        </Form.Label>
                                        <Col sm="8">
                                            {/* Aadhar Card */}
                                            <Form.Label className="mb-1">Aadhaar Card Number</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="aadhar_card"
                                                value={formData.aadhar_card}
                                                onChange={handleInputChange}
                                                className={`mb-2 ${formErrors.aadhar_card ? 'is-invalid' : ''}`}
                                                required
                                            />
                                            {formErrors.aadhar_card && (
                                                <div className="text-danger small">{formErrors.aadhar_card}</div>
                                            )}


                                            {/* UDID */}
                                            <Form.Label className="mb-1">UDID Card Number (Unique Disability ID)</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="udid_no"
                                                value={formData.udid_no}
                                                onChange={handleInputChange}
                                                className={`mb-2 ${formErrors.udid_no ? 'is-invalid' : ''}`}
                                                required />
                                            {formErrors.udid_no && (
                                                <div className="text-danger small">{formErrors.udid_no}</div>
                                            )}

                                            {/* Disability Passport */}
                                            <Form.Label className="mb-1">Disability Certificate No. & Issuing Authority</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="disability_no"
                                                value={formData.disability_no}
                                                onChange={handleInputChange}
                                                className="mb-2"
                                                required
                                            />

                                            {/* Voter ID */}
                                            <Form.Label className="mb-1">Voter ID</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="voter_id"
                                                value={formData.voter_id}
                                                onChange={handleInputChange}
                                                className={`mb-2 ${formErrors.voter_id ? 'is-invalid' : ''}`}
                                                required />
                                            {formErrors.voter_id && (
                                                <div className="text-danger small">{formErrors.voter_id}</div>
                                            )}

                                            {/* Form 7 */}
                                            <Form.Label className="mb-1">Form 7</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="form_7"
                                                value={formData.form_7}
                                                onChange={handleInputChange}
                                                className="mb-2"
                                                required
                                            />

                                            {/* Form 7  attachment*/}
                                            <Form.Label className="mb-1">Form 7 Attachment</Form.Label>
                                            <Form.Control
                                                type="file"
                                                name="form7_attach"
                                                accept=".jpg,.jpeg,.png"
                                                onChange={handleFileChange}
                                                required
                                            />
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} className="mb-3 text-start">
                                        <Form.Label className='form_title' column sm="4">
                                            Financial Details :
                                        </Form.Label>
                                        <Col sm="8">
                                            {/* Aadhar Card */}
                                            <Form.Label className="mb-1">Bank Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="bank_name"
                                                value={formData.bank_name}
                                                onChange={handleInputChange}
                                                className="mb-2"
                                                required
                                            />

                                            {/* UDID */}
                                            <Form.Label className="mb-1">Account Number</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="account_no"
                                                value={formData.account_no}
                                                onChange={handleInputChange}
                                                className="mb-2"
                                                required
                                            />

                                            {/* Disability Passport */}
                                            <Form.Label className="mb-1">IFSC Code</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="ifsc_code"
                                                value={formData.ifsc_code}
                                                onChange={handleInputChange}
                                                className={`mb-2 ${formErrors.ifsc_code ? 'is-invalid' : ''}`}
                                                required
                                            />
                                            {formErrors.ifsc_code && (
                                                <div className="text-danger small">{formErrors.ifsc_code}</div>
                                            )}

                                            <Form.Label className="mb-1">Copy of Bank Passbook (attach)</Form.Label>
                                            <Form.Control
                                                type="file"
                                                accept=".jpg,.jpeg,.png"
                                                name="bank_passbook"
                                                onChange={handleFileChange}
                                            />
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} className="mb-3 text-start">
                                        <Form.Label column sm="4" className='form_title'>
                                            CMCHIS(Chief Minister's Comprehensive Health Insurance Scheme):
                                        </Form.Label>
                                        <Col sm="8">
                                            {/* Aadhar Card */}
                                            <Form.Label className="mb-1">Insurance Provider</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="insurance_provider"
                                                value={formData.insurance_provider}
                                                onChange={handleInputChange}
                                                className="mb-2"
                                                required
                                            />

                                            {/* UDID */}
                                            <Form.Label className="mb-1">Policy Number</Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="policy_no"
                                                value={formData.policy_no}
                                                onChange={handleInputChange}
                                                className="mb-2"
                                                required
                                            />

                                            {/* Disability Passport */}
                                            <Form.Label className="mb-1">Validity Period</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="validity_period"
                                                value={formData.validity_period}
                                                onChange={handleInputChange}
                                                className="mb-2"
                                                required
                                            />

                                            <Form.Label className="mb-1">Other Govt. Scheme </Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="other_gvt_scheme"
                                                value={formData.other_gvt_scheme}
                                                onChange={handleInputChange}
                                                className="mb-2"

                                            />

                                            <Form.Label className="mb-1">Any Other </Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="any_other"
                                                value={formData.any_other}
                                                onChange={handleInputChange}
                                                className="mb-2"
                                            />
                                        </Col>
                                    </Form.Group>

                                    <div>
                                        {userType === "1" && (
                                            <Button variant="success" className="m-1" type="submit">Submit</Button>
                                        )}
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
                        <h4 className="text-center">4. Resident Document Information Form</h4>
                    </Col>
                </Row>

                <Form className='media_consent'>
                    <Row>

                        <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                            <Form.Label column sm="4" className='text-start'>
                                Name :
                            </Form.Label>
                            <Col sm="8" className='d-flex align-items-center'>
                                <Form.Control
                                    type="text"
                                    name="rescue_name"
                                    value={formData.rescue_name}
                                    onChange={handleInputChange}
                                    required />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3 text-start">
                            <Form.Label column sm="4">
                                ID Cards :
                            </Form.Label>
                            <Col sm="8">
                                {/* Aadhar Card */}
                                <Form.Label className="mb-1">Aadhaar Card Number</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="aadhar_card"
                                    value={formData.aadhar_card}
                                    onChange={handleInputChange}
                                    className="mb-2"
                                    required
                                />


                                {/* UDID */}
                                <Form.Label className="mb-1">UDID Card Number (Unique Disability ID)</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="udid_no"
                                    value={formData.udid_no}
                                    onChange={handleInputChange}
                                    className="mb-2"
                                />

                                {/* Disability Passport */}
                                <Form.Label className="mb-1">Disability Certificate No. & Issuing Authority</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="disability_no"
                                    value={formData.disability_no}
                                    onChange={handleInputChange}
                                    accept=".pdf,.jpg,.jpeg,.png"
                                />

                                {/* Voter ID */}
                                <Form.Label className="mb-1">Voter ID</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="voter_id"
                                    value={formData.voter_id}
                                    onChange={handleInputChange}
                                    className="mb-2"
                                />

                                {/* Form 7 */}
                                <Form.Label className="mb-1">Form 7</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="form_7"
                                    value={formData.form_7}
                                    onChange={handleInputChange}
                                    className="mb-2"
                                />

                                <Form.Label className="mb-1">Form 7 Attachment</Form.Label>
                                <img
                                    src={files.form7_attach}
                                    alt="Form 7"
                                    style={{ width: "100px", height: "100px", marginTop: "10px", border: "1px solid #ccc" }}
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3 text-start">
                            <Form.Label column sm="4">
                                Financial Details :
                            </Form.Label>
                            <Col sm="8">
                                {/* Aadhar Card */}
                                <Form.Label className="mb-1">Bank Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="bank_name"
                                    value={formData.bank_name}
                                    onChange={handleInputChange}
                                    className="mb-2"
                                />

                                {/* UDID */}
                                <Form.Label className="mb-1">Account Number</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="account_no"
                                    value={formData.account_no}
                                    onChange={handleInputChange}
                                    className="mb-2"
                                />

                                {/* Disability Passport */}
                                <Form.Label className="mb-1">IFSC Code</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="ifsc_code"
                                    value={formData.ifsc_code}
                                    onChange={handleInputChange}
                                    className="mb-2"
                                />

                                <Form.Label className="mb-1">Copy of Bank Passbook (attach)</Form.Label>
                                {files?.bank_passbook ? (
                                    <img
                                        src={files.bank_passbook}
                                        alt="Bank Passbook"
                                        style={{ width: "100px", height: "100px", marginTop: "10px", border: "1px solid #ccc" }}
                                    />
                                ) : (
                                    <p style={{ marginTop: "10px" }}>No new photo available</p>
                                )}
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3 text-start">
                            <Form.Label column sm="4">
                                Health Insurance Details:
                            </Form.Label>
                            <Col sm="8">
                                {/* Aadhar Card */}
                                <Form.Label className="mb-1">Insurance Provider</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="insurance_provider"
                                    value={formData.insurance_provider}
                                    onChange={handleInputChange}
                                    className="mb-2"
                                />

                                {/* UDID */}
                                <Form.Label className="mb-1 mt-5">Policy Number</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="policy_no"
                                    value={formData.policy_no}
                                    onChange={handleInputChange}
                                    className="mb-2"
                                />

                                {/* Disability Passport */}
                                <Form.Label className="mb-1">Validity Period</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="validity_period"
                                    value={formData.validity_period}
                                    onChange={handleInputChange}
                                    className="mb-2"
                                />

                                <Form.Label className="mb-1">Other Govt. Scheme </Form.Label>
                                <Form.Control
                                    type="text"
                                    name="other_gvt_scheme"
                                    value={formData.other_gvt_scheme}
                                    onChange={handleInputChange}
                                    className="mb-2"
                                />
                            </Col>
                        </Form.Group>
                        <Col md={12}>
                            <Row className="d-flex align-items-center justify-content-center mt-3">
                                <Col md={6} className="mt-3 down_title">
                                    <h5 className="text-start">Signature / Thumprint</h5>
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
                    <Modal.Title>Edit Document Information Form</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Col md={12}>
                        <Form className='media_consent'>
                            <Row>

                                <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                    <Form.Label column sm="6" className='text-start'>
                                        Name :
                                    </Form.Label>
                                    <Col sm="6" className='d-flex align-items-center'>
                                        <Form.Control
                                            type="text"
                                            name="rescue_name"
                                            value={formData.rescue_name}
                                            onChange={handleInputChange}
                                            required />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                    <Form.Label column sm="6" className='text-start'>
                                        Aadhaar Card Number :
                                    </Form.Label>
                                    <Col sm="6" className='d-flex align-items-center'>
                                        <Form.Control
                                            type="text"
                                            name="aadhar_card"
                                            value={formData.aadhar_card}
                                            onChange={handleInputChange}
                                            className={`mb-2 ${formErrors.aadhar_card ? 'is-invalid' : ''}`}
                                            required
                                        />

                                    </Col>
                                    {formErrors.aadhar_card && (
                                        <div className="text-danger small">{formErrors.aadhar_card}</div>
                                    )}
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                    <Form.Label column sm="6" className='text-start'>
                                        UDID Card Number (Unique Disability ID) :
                                    </Form.Label>
                                    <Col sm="6" className='d-flex align-items-center'>
                                        <Form.Control
                                            type="text"
                                            name="udid_no"
                                            value={formData.udid_no}
                                            onChange={handleInputChange}
                                            className={`mb-2 ${formErrors.udid_no ? 'is-invalid' : ''}`}
                                            required /><br />

                                    </Col>
                                    {formErrors.udid_no && (
                                        <div className="text-danger small">{formErrors.udid_no}</div>
                                    )}
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                    <Form.Label column sm="6" className='text-start'>
                                        Disability Certificate No. & Issuing Authority :
                                    </Form.Label>
                                    <Col sm="6" className='d-flex align-items-center'>
                                        <Form.Control
                                            type="text"
                                            name="disability_no"
                                            value={formData.disability_no}
                                            onChange={handleInputChange}
                                            required />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                    <Form.Label column sm="6" className='text-start'>
                                        Voter ID :
                                    </Form.Label>
                                    <Col sm="6" className='d-flex align-items-center'>
                                        <Form.Control
                                            type="text"
                                            name="voter_id"
                                            value={formData.voter_id}
                                            onChange={handleInputChange}
                                            className={`mb-2 ${formErrors.voter_id ? 'is-invalid' : ''}`}
                                            required />

                                    </Col>
                                    {formErrors.voter_id && (
                                        <div className="text-danger small">{formErrors.voter_id}</div>
                                    )}
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                    <Form.Label column sm="6" className='text-start'>
                                        Form 7 :
                                    </Form.Label>
                                    <Col sm="6" className='d-flex align-items-center'>
                                        <Form.Control
                                            type="text"
                                            name="form_7"
                                            value={formData.form_7}
                                            onChange={handleInputChange}
                                            required />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                    <Form.Label column sm="6" className='text-start'>
                                        Form 7 Attachment:
                                    </Form.Label>
                                    <Col sm="6" className='d-flex flex-column align-items-start'>
                                        <Form.Control
                                            type="file"
                                            name="form7_attach"
                                            accept=".jpg,.jpeg,.png"
                                            onChange={handleFileChange}
                                            required
                                        />

                                        {/* Preview Image Below File Input */}
                                        {files?.form7_attach ? (
                                            <img
                                                src={files.form7_attach}
                                                alt="form7_attach"
                                                style={{ width: "100px", height: "100px", marginTop: "10px", border: "1px solid #ccc" }}
                                            />
                                        ) : (
                                            <p style={{ marginTop: "10px" }}>No new photo available</p>
                                        )}
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                    <Form.Label column sm="6" className='text-start'>
                                        Bank Name :
                                    </Form.Label>
                                    <Col sm="6" className='d-flex align-items-center'>
                                        <Form.Control
                                            type="text"
                                            name="bank_name"
                                            value={formData.bank_name}
                                            onChange={handleInputChange}
                                            required />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                    <Form.Label column sm="6" className='text-start'>
                                        Account Number :
                                    </Form.Label>
                                    <Col sm="6" className='d-flex align-items-center'>
                                        <Form.Control
                                            type="number"
                                            name="account_no"
                                            value={formData.account_no}
                                            onChange={handleInputChange}
                                            required />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                    <Form.Label column sm="6" className='text-start'>
                                        IFSC Code :
                                    </Form.Label>
                                    <Col sm="6" className='d-flex align-items-center'>
                                        <Form.Control
                                            type="text"
                                            name="ifsc_code"
                                            value={formData.ifsc_code}
                                            onChange={handleInputChange}
                                            className={`mb-2 ${formErrors.ifsc_code ? 'is-invalid' : ''}`}
                                            required
                                        />

                                    </Col>
                                    {formErrors.ifsc_code && (
                                        <div className="text-danger small">{formErrors.ifsc_code}</div>
                                    )}
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                    <Form.Label column sm="6" className='text-start'>
                                        Copy of Bank Passbook (attach):
                                    </Form.Label>
                                    <Col sm="6" className='d-flex flex-column align-items-start'>
                                        <Form.Control
                                            type="file"
                                            name="bank_passbook"
                                            accept=".jpg,.jpeg,.png"
                                            onChange={handleFileChange}
                                        />

                                        {/* Preview Image Below File Input */}
                                        {files?.bank_passbook ? (
                                            <img
                                                src={files.bank_passbook}
                                                alt="Bank Passbook"
                                                style={{ width: "100px", height: "100px", marginTop: "10px", border: "1px solid #ccc" }}
                                            />
                                        ) : (
                                            <p style={{ marginTop: "10px" }}>No new photo available</p>
                                        )}
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                    <Form.Label column sm="6" className='text-start'>
                                        Insurance Provider :
                                    </Form.Label>
                                    <Col sm="6" className='d-flex align-items-center'>
                                        <Form.Control
                                            type="text"
                                            name="insurance_provider"
                                            value={formData.insurance_provider}
                                            onChange={handleInputChange}
                                            required />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                    <Form.Label column sm="6" className='text-start'>
                                        Policy Number :
                                    </Form.Label>
                                    <Col sm="6" className='d-flex align-items-center'>
                                        <Form.Control
                                            type="text"
                                            name="policy_no"
                                            value={formData.policy_no}
                                            onChange={handleInputChange}
                                            required />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                    <Form.Label column sm="6" className='text-start'>
                                        Validity Period :
                                    </Form.Label>
                                    <Col sm="6" className='d-flex align-items-center'>
                                        <Form.Control
                                            type="text"
                                            name="validity_period"
                                            value={formData.validity_period}
                                            onChange={handleInputChange}
                                            required />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                    <Form.Label column sm="6" className='text-start'>
                                        Other Govt. Scheme :
                                    </Form.Label>
                                    <Col sm="6" className='d-flex align-items-center'>
                                        <Form.Control
                                            type="text"
                                            name="other_gvt_scheme"
                                            value={formData.other_gvt_scheme}
                                            onChange={handleInputChange}
                                            required />
                                    </Col>
                                </Form.Group>

                                <div className="mt-3 d-flex align-tems-cente justify-content-between">
                                    <Button variant="success" className="m-1" type="submit" onClick={(e) => handleUpdate(e, admission_no)}>Update</Button>
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

export default Essential_record
