import { useState, useEffect } from 'react';
import { Breadcrumb, Container, Row, Col, Form, InputGroup, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from 'axios';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useRef } from "react";
import Modal from 'react-bootstrap/Modal';
import Cookies from 'js-cookie';
import { Alert } from "react-bootstrap";
import manasu_logo from '../Admission/Manasu-Logo.png';

function Media_consent_form() {
    const [admission_no, setAdmissionNumber] = useState('');
    const [previewRequested, setPreviewRequested] = useState(false);
    const [show, setShow] = useState(false);
    const [rescueImage, setRescueImage] = useState(null);
    const [rescueName, setRescueName] = useState("");
    const [error, setError] = useState("");
    const [files, setFiles] = useState({});

    //alert box values
    const [submissionMessage, setSubmissionMessage] = useState("");
    const [messageType, setMessageType] = useState(""); // 'success' or 'danger'

    const handleClose = () => setShow(false);

    const userType = Cookies.get('usertype');

    const apiRoute = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
    });

    const [formData, setFormData] = useState({
        rescue_name: '',
        social_media_consent: '',
        description: '',
    })

    const createFormData = () => {
        const targetElement = document.querySelector('.media_consent');
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    }

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Automatically fetch data when admission number is typed
    useEffect(() => {
        if (admission_no.trim().length >= 12) { // Adjust minimum length as needed
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

    const handleCheckChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const ViewFormData = async () => {

        try {
            const response = await apiRoute.get(`/reunion/getMediaConsent/${admission_no}`);
            const data = response.data;

            // Update form fields
            setFormData((formData) => ({
                ...formData,
                admission_no: data.admission_no || '',
                rescue_name: data.rescue_name || '',
                social_media_consent: data.social_media_consent || '',
                description: data.description || '',
            }));
            let scanReportPath = [];
            if (data.scan_report) {
                try {
                    const parsed = JSON.parse(data.scan_report);
                    if (Array.isArray(parsed)) {
                        scanReportPath = parsed.map((p) => `https://www.pahrultours.com/app2/${p.replace(/"/g, '')}`);
                    }
                } catch (err) {
                    console.warn('Failed to parse signature:', err);
                    // Fallback: comma-separated string
                    scanReportPath = data.scan_report
                        .split(',')
                        .map((p) => `https://www.pahrultours.com/app2/${p.trim().replace(/^"|"$/g, '')}`);
                }
            }

            console.log(scanReportPath);
            // Set files state
            setFiles((files) => ({
                ...files,
                scan_report: scanReportPath,
            }));

            setPreviewRequested(true);
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

    const scan_reportRef = useRef(null);

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

        if (!formData.social_media_consent || formData.social_media_consent.trim() === '') {
            alert("Please select Yes or No.");
            return;
        }

        const data = new FormData();
        data.append('admission_no', admission_no);
        data.append('rescue_name', formData.rescue_name);
        data.append('social_media_consent', formData.social_media_consent);
        data.append('description', formData.description);

        if (files.scan_report && files.scan_report.length > 0) {
            files.scan_report.forEach(file => {
                data.append('scan_report', file); // ✅ no []
            });
        }

        try {
            const res = await apiRoute.post('/reunion/createMediaConsent', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (res.data.message === "Media Consent Form Created Successfully") {
                alert("Media consent form Submitted Successfully");
                setFormData({
                    rescue_name: '',
                    social_media_consent: '',
                    description: '',
                })
                setAdmissionNumber("");
                if (scan_reportRef.current) scan_reportRef.current.value = "";
            } else {
                setSubmissionMessage("Submission failed.");
                setMessageType("danger");
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                alert(error.response.data.message);
            } else {
                alert("Something went wrong.");
            }
            console.error("Error submitting form", error);
            setSubmissionMessage("Something went wrong.");
            setMessageType("danger");
        }
    };


    const handleImageUpload = (e) => {
        setFiles({
            ...files,
            [e.target.name]: Array.from(e.target.files)  // Store all selected files as an array
        });
    };

    // const handleShow = async (admission_no) => {
    //     try {
    //         const response = await apiRoute.get(`/reunion/getMediaConsent/${admission_no}`);
    //         const data = response.data;

    //         setFormData((formData) => ({
    //             ...formData,
    //             admission_no: data.admission_no || '',
    //             rescue_name: data.rescue_name || '',
    //             social_media_consent: data.social_media_consent || '',
    //             description: data.description || '',
    //         }));

    //         setShow(true);
    //     } catch (error) {
    //         console.error("Error fetching form data:", error);
    //         alert("Admission Number not found");
    //     }
    // };

    const handleShow = async (admission_no) => {
        try {
            const response = await apiRoute.get(`/reunion/getMediaConsent/${admission_no}`);
            const data = response.data;

            setFormData((formData) => ({
                ...formData,
                rescue_name: data.rescue_name || '',
                social_media_consent: data.social_media_consent || '',
                description: data.description || '',
            }));

            const parseImageField = (fieldData) => {
                let paths = [];
                if (fieldData) {
                    try {
                        const parsed = JSON.parse(fieldData);
                        if (Array.isArray(parsed)) {
                            paths = parsed.map((p) =>
                                `https://www.pahrultours.com/app2/${p.replace(/"/g, '')}`
                            );
                        }
                    } catch (err) {
                        // Fallback to comma-separated string
                        paths = fieldData
                            .split(',')
                            .map((p) =>
                                `https://www.pahrultours.com/app2/${p.trim().replace(/^"|"$/g, '')}`
                            );
                    }
                }
                return paths;
            };

            const scanReportPath = parseImageField(data.scan_report);
            // Set files state
            setFiles((files) => ({
                ...files,
                scan_report: scanReportPath,
            }));

            setShow(true);
        } catch (error) {
            console.error("Error fetching form data:", error);
            alert("Admission Number not found");
        }
    }

    // const handleUpdate = async (e, admission_no) => {
    //     e.preventDefault();
    //     try {
    //         const response = await apiRoute.put(`/reunion/updateMediaConsent/${admission_no}`, formData);
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
        data.append('social_media_consent', formData.social_media_consent);
        data.append('description', formData.description);
        data.append('scan_report', files.scan_report);

        if (files.scan_report && files.scan_report.length > 0) {
            files.scan_report.forEach(file => {
                data.append('scan_report', file); // ✅ no []
            });
        }

        try {
            const res = await apiRoute.post(`/reunion/updateMediaConsent/${admission_no}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert("Media Consent Form Updated successfully");
            handleClose(true);
            setFormData({
                rescue_name: '',
                social_media_consent: '',
                description: '',
            })
            setAdmissionNumber("");
            if (scan_reportRef.current) scan_reportRef.current.value = "";
        } catch (err) {
            console.error(err);
            alert('Update failed.');
        }
    }

    const handleDelete = async (admission_no) => {
        alert("Are you sure want to delete");
        try {
            const response = await apiRoute.delete(`/reunion/deleteMediaConsent/${admission_no}`);
            console.log(response);
            alert("Media Consent Form Deleted successfully");
            window.location.reload();
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
                    setError("");
                } else {
                    setRescueImage(null);
                    setRescueName("");
                    setError("Image not found for this admission number");
                }
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

    const downloadImage = (url, filename) => {
        fetch(url)
            .then(response => response.blob())
            .then(blob => {
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
            .catch(console.error);
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
                        <Breadcrumb className="d-none d-md-inline-block mb-0" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
                            <Breadcrumb.Item></Breadcrumb.Item>
                            <Breadcrumb.Item>Home</Breadcrumb.Item>
                            <Breadcrumb.Item active>Reunion</Breadcrumb.Item>
                        </Breadcrumb>
                        <h6 className="breadcrumb_title">Media Consent</h6>
                    </Col>
                    <Col md={7} className="text-center">
                        <h3 className="section_title">3. Resident Consent Form for Social Media Use</h3>
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
                            <button type="button" className="btn btn-success mx-1" onClick={() => {
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
                    <Col md={8} className="consultant_box my-4 media_consent_form">
                        <div className="consultant_details">
                            <Form className='media_consent' onSubmit={handleSubmit}>
                                <Row>
                                    {/* <Form.Group as={Row} className="mb-1" controlId="formAdmissionNo">
                                        <Form.Label column sm="4" className='text-start'>
                                            Admission Number :
                                        </Form.Label>
                                        <Col sm="8">
                                            <Form.Control
                                                type="text"
                                                name="admission_no"
                                                value={formData.admission_no}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </Col>
                                    </Form.Group> */}

                                    <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                        <Form.Label column sm="4" className='text-start'>
                                            Name : <span style={{ color: 'red' }}>*</span>
                                        </Form.Label>
                                        <Col sm="8">
                                            <Form.Control
                                                type="text"
                                                name="rescue_name"
                                                value={formData.rescue_name}
                                                onChange={handleInputChange}
                                                required />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} className="mb-1" controlId="formSocialMediaConsent">
                                        <Form.Label column sm="4" className="text-start">
                                            Did the Resident give the Media Consent? : <span style={{ color: 'red' }}>*</span>
                                        </Form.Label>
                                        <Col sm="8">
                                            <Form.Check
                                                type="radio"
                                                label="Yes"
                                                name="social_media_consent"
                                                value="Yes"
                                                checked={formData.social_media_consent === 'Yes'}
                                                onChange={handleCheckChange}
                                            />
                                            <Form.Check
                                                type="radio"
                                                label="No"
                                                name="social_media_consent"
                                                value="No"
                                                checked={formData.social_media_consent === 'No'}
                                                onChange={handleCheckChange}
                                            />
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} className="mb-1" controlId="formScanImage">
                                        <Form.Label column sm="4" className="text-start">
                                            Scan The Report : <span style={{ color: 'red' }}>*</span>
                                        </Form.Label>
                                        <Col sm="8">
                                            <Form.Control
                                                type="file"
                                                accept=".jpg,.jpeg,.png"
                                                name="scan_report"
                                                ref={scan_reportRef}
                                                onChange={handleImageUpload}
                                                required
                                                multiple
                                            />
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                        <Form.Label column sm="4" className='text-start'>
                                            Description :  <span style={{ color: 'red' }}>*</span>
                                        </Form.Label>
                                        <Col sm="8">
                                            <Form.Control
                                                as="textarea"
                                                rows={2}
                                                name="description"
                                                value={formData.description}
                                                onChange={handleInputChange}
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
                        <h4 className="text-center">3. Resident Consent Form for Social Media Use</h4>
                    </Col>
                </Row>

                <Form className='media_consent'>
                    <Row>

                        <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                            <Form.Label column sm="4" className='text-start'>
                                Name :
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control
                                    type="text"
                                    name="rescue_name"
                                    value={formData.rescue_name}
                                    onChange={handleInputChange}
                                    required />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-1" controlId="formSocialMediaConsent">
                            <Form.Label column sm="4" className="text-start">
                                Is our rescue's face used on social media? :
                            </Form.Label>
                            <Col sm="8">
                                <Form.Check
                                    type="radio"
                                    label="Yes"
                                    name="social_media_consent"
                                    value="Yes"
                                    checked={formData.social_media_consent === 'Yes'}
                                    onChange={handleCheckChange}
                                />
                                <Form.Check
                                    type="radio"
                                    label="No"
                                    name="social_media_consent"
                                    value="No"
                                    checked={formData.social_media_consent === 'No'}
                                    onChange={handleCheckChange}
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3 mt-3">
                            <Form.Label column sm="4" className='text-start'>
                                Scan The Report :
                            </Form.Label>
                            <Col sm="8">
                                {Array.isArray(files.scan_report) &&
                                    files.scan_report.map((imgUrl, index) => (
                                        <img
                                            key={index}
                                            src={imgUrl}
                                            alt={`scan_report - ${index}`}
                                            style={{
                                                width: "150px",
                                                height: "auto",
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

                        <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                            <Form.Label column sm="4" className='text-start'>
                                Description :
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control
                                    as="textarea"
                                    rows={2}
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    required />
                            </Col>
                        </Form.Group>
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
                    </Row>
                </Form>
            </div>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Media Consent Form</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Col md={12}>
                        <Form className='media_consent'>
                            <Row>
                                <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                    <Form.Label column sm="6" className='text-start'>
                                        Name : <span style={{ color: 'red' }}>*</span>
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
                                <Form.Group as={Row} className="mb-1" controlId="formSocialMediaConsent">
                                    <Form.Label column sm="6" className="text-start">
                                        Is our rescue's face used on social media? : <span style={{ color: 'red' }}>*</span>
                                    </Form.Label>
                                    <Col sm="6">
                                        <Form.Check
                                            type="radio"
                                            label="Yes"
                                            name="social_media_consent"
                                            value="Yes"
                                            checked={formData.social_media_consent === 'Yes'}
                                            onChange={handleCheckChange}
                                        />
                                        <Form.Check
                                            type="radio"
                                            label="No"
                                            name="social_media_consent"
                                            value="No"
                                            checked={formData.social_media_consent === 'No'}
                                            onChange={handleCheckChange}
                                        />
                                    </Col>
                                </Form.Group>
                                {Array.isArray(files.scan_report) &&
                                    files.scan_report.map((imgUrl, index) => {
                                        const filename = `scan_report_${index}.jpg`;

                                        return (
                                            <div
                                                key={index}
                                                className="image-container"
                                                style={{
                                                    position: "relative",
                                                    width: "100px",
                                                    height: "100px",
                                                    margin: "10px",
                                                    padding: "0px",
                                                    display: "inline-block",
                                                }}
                                            >
                                                <img
                                                    src={imgUrl}
                                                    alt={`scan_report - ${index}`}
                                                    loading="lazy"
                                                    style={{
                                                        width: "100%",
                                                        height: "100%",
                                                        objectFit: "cover",
                                                        border: "1px solid #ccc",
                                                        borderRadius: "4px",
                                                    }}
                                                    onError={(e) => {
                                                        if (!e.target.dataset.errorHandled) {
                                                            e.target.src = "/fallback-image.png";
                                                            e.target.dataset.errorHandled = "true";
                                                        }
                                                    }}
                                                />

                                                <div className="image-overlay">
                                                    {/* View icon */}
                                                    <a
                                                        href={imgUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        title="View Image"
                                                        className="icon-button"
                                                    >
                                                        <i className="fas fa-eye"></i>
                                                    </a>

                                                    {/* Download icon */}
                                                    <button
                                                        title="Download Image"
                                                        className="icon-button"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            fetch(imgUrl, { mode: "cors" })
                                                                .then((res) => res.blob())
                                                                .then((blob) => {
                                                                    const url = window.URL.createObjectURL(blob);
                                                                    const a = document.createElement("a");
                                                                    a.href = url;
                                                                    a.download = filename;
                                                                    a.click();
                                                                    window.URL.revokeObjectURL(url);
                                                                })
                                                                .catch(() => alert("Download failed."));
                                                        }}
                                                    >
                                                        <i className="fas fa-download"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                <Form.Group as={Row} className="mb-3 mt-3">
                                    <Form.Label column sm="6" className='text-start'>
                                        Scan The Report : <span style={{ color: 'red' }}>*</span>
                                    </Form.Label>
                                    <Col sm="6">
                                        <Form.Control
                                            type="file"
                                            accept=".jpg,.jpeg,.png"
                                            name="scan_report"
                                            onChange={handleImageUpload}
                                            required
                                            multiple
                                        />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                    <Form.Label column sm="6" className='text-start'>
                                        Description :
                                    </Form.Label>
                                    <Col sm="6">
                                        <Form.Control
                                            as="textarea"
                                            rows={2}
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                        />
                                    </Col>
                                </Form.Group>

                            </Row>

                            <div className="mt-3 d-flex align-tems-cente justify-content-between">
                                <Button variant="success" className="m-1" type="submit" onClick={(e) => handleUpdate(e, admission_no)}>Update</Button>
                                <Button variant="secondary" onClick={handleClose}>
                                    Close
                                </Button>
                            </div>

                        </Form>
                    </Col>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default Media_consent_form
