import React from 'react';
import { Breadcrumb, Container, Row, Form, Button, InputGroup, Table } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPlus, faEdit } from "@fortawesome/free-solid-svg-icons";
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import manasu_logo from "../Admission/Manasu-Logo.png";
import { Alert } from "react-bootstrap";
import Cookies from 'js-cookie';

function Reunion_summary() {
    const [admission_no, setAdmissionNumber] = useState('');
    const [previewRequested, setPreviewRequested] = useState(false);
    const [files, setFiles] = useState('');
    const [rescueImage, setRescueImage] = useState(null);
    const [rescueName, setRescueName] = useState("");
    const [error, setError] = useState("");
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);

    const userType = Cookies.get('usertype');

    const [formData, setFormData] = useState({
        rescue_name: '',
        date: '',
        report: '',
    })

    const apiRoute = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
    });

    const createFormData = () => {
        const targetElement = document.querySelector('.reunion_summary');
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    }

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAdmissionChange = (e) => {
        const value = e.target.value;
        setAdmissionNumber(value);
        setFormData((prevData) => ({
            ...prevData,
            admission_no: value
        }));
    };

    const handleFileChange = (e) => {
        setFiles({
            ...files,
            [e.target.name]: Array.from(e.target.files)  // Store all selected files as an array
        });
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

    const summary_attachRef = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!admission_no || admission_no.trim() === '') {
            alert("Admission Number is required.");
            return; // Stop form submission
        }
        const trimmedAdNo = admission_no.trim();

        if (!/^\d{8}$/.test(trimmedAdNo) && !/^\d{10}$/.test(trimmedAdNo)) {
            alert("Admission Number must be exactly 8 or 10 digits (numbers only).");
            return;
        }

        const data = new FormData();
        data.append('admission_no', admission_no);
        data.append('rescue_name', formData.rescue_name);
        data.append('date', formData.date);
        data.append('summary_attach', files.summary_attach);
        data.append('report', formData.report);

        if (files.summary_attach && files.summary_attach.length > 0) {
            files.summary_attach.forEach(file => {
                data.append('summary_attach', file); // ✅ no []
            });
        }

        try {
            const res = await apiRoute.post('/residency/createSummary', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert('Reunion Summary Form submitted successfully!');
            setFormData({
                rescue_name: '',
                date: '',
                report: '',
            })
            setAdmissionNumber("");
            if (summary_attachRef.current) summary_attachRef.current.value = "";
        } catch (err) {
            console.error(err);
            alert('Submission failed.');
        }
    }

    const ViewFormData = async () => {
        try {
            const response = await apiRoute.get(`/residency/getSummary/${admission_no}`);
            const data = response.data;

            // Update form fields
            setFormData((formData) => ({
                ...formData,
                rescue_name: data.rescue_name || '',
                date: data.date || '',
                report: data.report || '',
            }));

            let summaryAttachPath = [];
            if (data.summary_attach) {
                try {
                    const parsed = JSON.parse(data.summary_attach);
                    if (Array.isArray(parsed)) {
                        summaryAttachPath = parsed.map((p) => `http://localhost:5002/${p.replace(/"/g, '')}`);
                    }
                } catch (err) {
                    console.warn('Failed to parse signature:', err);
                    // Fallback: comma-separated string
                    summaryAttachPath = data.summary_attach
                        .split(',')
                        .map((p) => `http://localhost:5002/${p.trim().replace(/^"|"$/g, '')}`);
                }
            }

            // console.log(scanReportPath);


            // Handle old and new photo paths correctly
            // const summaryAttachPath = data.summary_attach ? `https://www.pahrultours.com/app2/${data.summary_attach}` : null;

            console.log(summaryAttachPath);
            // Set files state
            setFiles((files) => ({
                ...files,
                summary_attach: summaryAttachPath,
            }));

            setPreviewRequested(true);
        } catch (error) {
            console.error("Error fetching form data:", error);
            alert("Admission Number not found");
        }
    }

    const formatDateForInput = (isoDateStr) => {
        if (!isoDateStr) return "";

        const date = new Date(isoDateStr);
        if (isNaN(date.getTime())) return "";

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`; // ✅ format for <input type="date">
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
        if (!input) return;

        // Wait for image to load
        const images = input.querySelectorAll("img");
        const imageLoadPromises = Array.from(images).map((img) => {
            if (img.complete) return Promise.resolve();
            return new Promise((resolve) => {
                img.onload = img.onerror = resolve;
            });
        });

        await Promise.all(imageLoadPromises);

        const canvas = await html2canvas(input, { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

        let position = 0;
        let heightLeft = imgHeight;

        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();

        while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
            heightLeft -= pdf.internal.pageSize.getHeight();
        }

        const pdfBlob = pdf.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl, '_blank');
    };

    //alert box values
    const [submissionMessage, setSubmissionMessage] = useState("");
    const [messageType, setMessageType] = useState(""); // 'success' or 'danger'

    const formatForInput = (dateStr) => {
        if (!dateStr) return '';

        const dateObj = new Date(dateStr);

        if (isNaN(dateObj)) return '';

        const pad = (n) => String(n).padStart(2, '0');

        const yyyy = dateObj.getFullYear();
        const mm = pad(dateObj.getMonth() + 1);
        const dd = pad(dateObj.getDate());

        return `${yyyy}-${mm}-${dd}`;
    };

    const handleShow = async (admission_no) => {
        try {
            const response = await apiRoute.get(`/residency/getSummary/${admission_no}`);
            const data = response.data;

            setFormData((formData) => ({
                ...formData,
                rescue_name: data.rescue_name || '',
                date: data.date || '',
                report: data.report || '',
            }));

            const parseImageField = (fieldData) => {
                let paths = [];
                if (fieldData) {
                    try {
                        const parsed = JSON.parse(fieldData);
                        if (Array.isArray(parsed)) {
                            paths = parsed.map((p) =>
                                `http://localhost:5002/${p.replace(/"/g, '')}`
                            );
                        }
                    } catch (err) {
                        // Fallback to comma-separated string
                        paths = fieldData
                            .split(',')
                            .map((p) =>
                                `http://localhost:5002/${p.trim().replace(/^"|"$/g, '')}`
                            );
                    }
                }
                return paths;
            };

            const summaryAttachPath = parseImageField(data.summary_attach);

            // Handle old and new photo paths correctly
            // const summaryAttachPath = data.summary_attach ? `https://www.pahrultours.com/app2/${data.summary_attach}` : null;

            // Set files state
            setFiles((files) => ({
                ...files,
                summary_attach: summaryAttachPath,
            }));

            setShow(true);
        } catch (error) {
            console.error("Error fetching form data:", error);
            alert("Admission Number not found");
        }
    };

    const handleUpdate = async (e, admission_no) => {
        e.preventDefault();

        const data = new FormData();
        data.append('rescue_name', formData.rescue_name);
        data.append('date', formData.date);
        data.append('report', formData.report);
        data.append('summary_attach', files.summary_attach);

        // ✅ Only append summary_attach if it's a new file
        if (files.summary_attach && files.summary_attach.length > 0) {
            files.summary_attach.forEach(file => {
                data.append('summary_attach', file); // ✅ no []
            });
        }

        try {
            const res = await apiRoute.put(`/residency/updateSummary/${admission_no}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert("Updated Successfully");
            handleClose(true);
            setFormData({
                rescue_name: '',
                date: '',
                report: '',
            })
            if (summary_attachRef.current) summary_attachRef.current.value = "";
            setAdmissionNumber("");
        } catch (err) {
            console.error(err);
            alert('Update failed.');
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
                        <h6 className="breadcrumb_title">Case Summary</h6>
                    </Col>
                    <Col md={7} className="text-center">
                        <h3 className="section_title">Reunion Summary</h3>
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

            <div>
                {/* Show success or error message box */}
                {submissionMessage && (
                    <Alert variant={messageType} className="mt-3">
                        {submissionMessage}
                    </Alert>
                )}
            </div>

            <Container>
                <Form className="navbar-search col-md-12 mt-4 ">
                    <Form.Group id="topbarSearch" className="d-flex align-items-center justify-content-center">
                        <Col md={3}>
                            <Form.Label>Admission Number:</Form.Label>
                        </Col>
                        <Col md={2}>
                            <InputGroup className="input-group-merge search-bar">
                                <Form.Control
                                    type="text"
                                    value={admission_no}
                                    onChange={handleAdmissionChange}
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
                        {userType === "4" && (
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
                    </Form.Group>
                </Form>
                <Row className='d-flex align-items-center justify-content-center'>
                    <Col md={8} className="consultant_box my-2">
                        <div className="consultant_details">
                            <Form className='reunion_summary' onSubmit={handleSubmit}>
                                <Row>
                                    <Col md={12}>
                                        <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                            <Form.Label column sm="5" className='text-start'>
                                                Resident's Name : <span style={{ color: 'red' }}>*</span>
                                            </Form.Label>
                                            <Col sm="7">
                                                <Form.Control
                                                    type="text"
                                                    name="rescue_name"
                                                    value={formData.rescue_name}
                                                    onChange={handleChange}
                                                    required />
                                            </Col>
                                        </Form.Group>
                                        <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                            <Form.Label column sm="5" className='text-start'>
                                                Date : <span style={{ color: 'red' }}>*</span>
                                            </Form.Label>
                                            <Col sm="7">
                                                <Form.Control
                                                    type="date"
                                                    name="date"
                                                    value={formData.date}
                                                    onChange={handleChange}
                                                    max="9999-12-31"
                                                    required />
                                            </Col>
                                        </Form.Group>
                                        <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                            <Form.Label column sm="5" className='text-start'>
                                                Summary Attach : <span style={{ color: 'red' }}>*</span>
                                            </Form.Label>
                                            <Col sm="7">
                                                <Form.Control
                                                    type="File"
                                                    accept=".jpg,.jpeg,.png"
                                                    name="summary_attach"
                                                    ref={summary_attachRef}
                                                    onChange={handleFileChange}
                                                    multiple />
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

                                    <div className="mt-3">
                                        {userType === "4" && (
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
                    </Col>
                    <Col md={9}>
                        <h4 className="text-center">Reunion Summary</h4>
                    </Col>
                </Row>
                <Form className='reunion_summary'>
                    <Row>
                        <Col md={12}>
                            <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                <Form.Label column sm="5" className='text-start'>
                                    Resident's Name :
                                </Form.Label>
                                <Col sm="7">
                                    <Form.Control
                                        type="text"
                                        name="rescue_name"
                                        value={formData.rescue_name}
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
                                        value={formatForInput(formData.date)}
                                        onChange={handleChange}
                                        required />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                <Form.Label column sm="5" className='text-start'>
                                    Summary Attach :
                                </Form.Label>
                                <Col sm="7">
                                    {Array.isArray(files.summary_attach) &&
                                        files.summary_attach.map((imgUrl, index) => (
                                            <img
                                                key={index}
                                                src={imgUrl}
                                                alt={`summary_attach - ${index}`}
                                                style={{
                                                    width: "100px",
                                                    height: "100px",
                                                    objectFit: "cover",
                                                    margin: "10px",
                                                    border: "1px solid #ccc",
                                                }}
                                                onError={(e) => {
                                                    e.target.src = "/fallback-image.png";
                                                }}
                                            />
                                        ))}
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

                        <div className="mt-3">
                            <Button variant="success" className="m-1" type="submit">Submit</Button>
                        </div>

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
                                            Resident's Name :
                                        </Form.Label>
                                        <Col sm="7">
                                            <Form.Control
                                                type="text"
                                                name="rescue_name"
                                                value={formData.rescue_name}
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
                                    <Form.Group className="mb-1" controlId="formRescueName">
                                        <Form.Label column sm="5" className='text-start'>
                                            Summary Attachment :
                                        </Form.Label>
                                        <Col sm="12">
                                            {Array.isArray(files.summary_attach) &&
                                                files.summary_attach.map((imgUrl, index) => (
                                                    <img
                                                        key={index}
                                                        src={imgUrl}
                                                        alt={`summary_attach - ${index}`}
                                                        loading="lazy"
                                                        style={{
                                                            width: "100px",
                                                            height: "100px",
                                                            objectFit: "cover",
                                                            margin: "10px",
                                                            border: "1px solid #ccc",
                                                        }}
                                                        onError={(e) => {
                                                            if (!e.target.dataset.errorHandled) {
                                                                e.target.src = "/fallback-image.png";
                                                                e.target.dataset.errorHandled = "true";
                                                            }
                                                        }}
                                                    />
                                                ))}

                                            <Form.Control
                                                type="file"
                                                accept=".jpg,.jpeg,.png"
                                                onChange={handleFileChange}
                                                name="summary_attach"
                                                multiple
                                            />
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

                                <div className="btn_footer d-flex align-items-center justify-content-end">
                                    <Button variant="success" type="button" className="m-1" onClick={(e) => handleUpdate(e, admission_no)}>
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

export default Reunion_summary
