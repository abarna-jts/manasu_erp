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
        if (admission_no.trim().length >= 10) { // Adjust minimum length as needed
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
        // try {
        //     const response = await apiRoute.get(`/reunion/getMediaConsent/${admission_no}`);
        //     const data = response.data;

        //     setFormData((formData) => ({
        //         ...formData,
        //         admission_no: data.admission_no || '',
        //         rescue_name: data.rescue_name || '',
        //         social_media_consent: data.social_media_consent || '',
        //         description: data.description || ''
        //     }));

        //     setPreviewRequested(true); // trigger the effect after state updates
        // } catch (error) {
        //     console.error("Error fetching form data:", error);
        //     alert("Admission Number not found");
        // }
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


            // Handle old and new photo paths correctly
            const scanReportPath = data.scan_report ? `http://localhost:5000/${data.scan_report}` : null;

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

        const canvas = await html2canvas(input, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        const pdfBlob = pdf.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl, '_blank');
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('admission_no', admission_no);
        data.append('rescue_name', formData.rescue_name);
        data.append('social_media_consent', formData.social_media_consent);
        data.append('description', formData.description);

        if (files.scan_report) {
            data.append('scan_report', files.scan_report);
        }

        try {
            const res = await apiRoute.post('/reunion/createMediaConsent', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (res.data.message === "Media Consent Form Created Successfully") {
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


    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFiles((prev) => ({
                ...prev,
                scan_report: file,
            }));
        }
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

            // Handle old and new photo paths correctly
            const scanReportPath = data.scan_report ? `http://localhost:5000/${data.scan_report}` : null;


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

        try {
            const res = await apiRoute.post(`/reunion/updateMediaConsent/${admission_no}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
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
                                alert("Please enter your admission number.");
                            } else {
                                ViewFormData(); // Fetch & populate data before generating PDF
                            }
                        }}><FontAwesomeIcon icon={faEye} className="me-0" /></button>
                        <button type="button" className="btn btn-primary mx-1" onClick={() => {
                            if (!admission_no.trim()) {
                                alert("Please enter your admission number.");
                            } else {
                                createFormData(); // Fetch & populate data before generating PDF
                            }
                        }}><FontAwesomeIcon icon={faPlus} className="me-0" /></button>
                        <button type="button" className="btn btn-primary mx-1" onClick={() => {
                            if (!admission_no.trim()) {
                                alert("Please enter your admission number.");
                            } else {
                                handleShow(admission_no); // Fetch & populate data before generating PDF
                            }
                        }}><FontAwesomeIcon icon={faEdit} className="me-0" /></button>
                        {userType === "2" && (
                            <button type="button" className="btn btn-primary mx-1" onClick={() => {
                                if (!admission_no.trim()) {
                                    alert("Please enter your admission number.");
                                } else {
                                    handleDelete(admission_no); // Fetch & populate data before generating PDF
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



                <Row className='d-flex align-items-center justify-content-center'>
                    <Col md={8} className="consultant_box my-4">
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

                                    <Form.Group as={Row} className="mb-1" controlId="formScanImage">
                                        <Form.Label column sm="4" className="text-start">
                                            Scan The Report :
                                        </Form.Label>
                                        <Col sm="8">
                                            <Form.Control
                                                type="file"
                                                accept="image/*"
                                                name="scan_report"
                                                onChange={handleImageUpload}
                                                required
                                            />
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

                <h4 className="text-center MY-4">3. Resident Consent Form for Social Media Use</h4>

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
                                {files.scan_report ? (
                                    <img
                                        src={files.scan_report}
                                        alt="Report"
                                        style={{ width: "100px", height: "100px", marginTop: "10px" }}
                                    />
                                ) : (
                                    <p>No scan_report photo available</p>
                                )}
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
                                        {files.scan_report ? (
                                            <>
                                                <img
                                                    src={files.scan_report}
                                                    alt="Old"
                                                    style={{ width: "100px", height: "100px", marginTop: "10px" }}
                                                />
                                            </>
                                        ) : (
                                            <p>No handwritten_document photo available</p> // Display if no photo
                                        )}

                                        <Form.Control
                                            type="file"
                                            accept="image/*"
                                            name="scan_report"
                                            onChange={handleImageUpload}
                                            required
                                        />
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
