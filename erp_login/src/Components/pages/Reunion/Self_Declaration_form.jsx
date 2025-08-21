import React, { useState, useEffect } from 'react';
import { Breadcrumb, Container, Row, Col, Form, InputGroup, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from 'axios';
import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Modal from 'react-bootstrap/Modal';
import Cookies from 'js-cookie';
import manasu_logo from '../Admission/Manasu-Logo.png';

function Self_Declaration_form() {
    const [show, setShow] = useState(false);
    const [admission_no, setAdmissionNumber] = useState('');
    const [files, setFiles] = useState('');
    const [previewRequested, setPreviewRequested] = useState(false);
    const [rescueImage, setRescueImage] = useState(null);
    const [rescueName, setRescueName] = useState("");
    const [error, setError] = useState("");

    const handleClose = () => setShow(false);

    const userType = Cookies.get('usertype');

    const apiRoute = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
    });

    const handleFileChange = (e) => {
        setFiles({
            ...files,
            [e.target.name]: Array.from(e.target.files)  // Store all selected files as an array
        });
    };

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

    const createFormData = () => {
        const targetElement = document.querySelector('.self_declaration');
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    }

    const [formData, setFormData] = useState({
        rescue_name: '',
        age: '',
        description: '',
    })

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
            const response = await apiRoute.get(`/reunion/getSelfDeclaration/${admission_no}`);
            const data = response.data;

            // Update form fields
            setFormData((formData) => ({
                ...formData,
                rescue_name: data.rescue_name || '',
                f_member_age: data.age || '',
                description: data.description || '',
            }));

            let signaturePath = [];
            if (data.signature) {
                try {
                    const parsed = JSON.parse(data.signature);
                    if (Array.isArray(parsed)) {
                        signaturePath = parsed.map((p) => `https://www.pahrultours.com/app2/${p.replace(/"/g, '')}`);
                    }
                } catch (err) {
                    console.warn('Failed to parse signature:', err);
                    // Fallback: comma-separated string
                    signaturePath = data.signature
                        .split(',')
                        .map((p) => `https://www.pahrultours.com/app2/${p.trim().replace(/^"|"$/g, '')}`);
                }
            }

            let photoPath = [];
            if (data.photo) {
                try {
                    const parsed = JSON.parse(data.photo);
                    if (Array.isArray(parsed)) {
                        photoPath = parsed.map((p) => `https://www.pahrultours.com/app2/${p.replace(/"/g, '')}`);
                    }
                } catch (err) {
                    console.warn('Failed to parse signature:', err);
                    // Fallback: comma-separated string
                    photoPath = data.photo
                        .split(',')
                        .map((p) => `https://www.pahrultours.com/app2/${p.trim().replace(/^"|"$/g, '')}`);
                }
            }

            let handwritten_documentPath = [];
            if (data.handwritten_document) {
                try {
                    const parsed = JSON.parse(data.handwritten_document);
                    if (Array.isArray(parsed)) {
                        handwritten_documentPath = parsed.map((p) => `https://www.pahrultours.com/app2/${p.replace(/"/g, '')}`);
                    }
                } catch (err) {
                    console.warn('Failed to parse signature:', err);
                    // Fallback: comma-separated string
                    handwritten_documentPath = data.handwritten_document
                        .split(',')
                        .map((p) => `https://www.pahrultours.com/app2/${p.trim().replace(/^"|"$/g, '')}`);
                }
            }

            // Handle old and new photo paths correctly
            // const signaturePath = data.signature ? `https://www.pahrultours.com/app2/${data.signature}` : null;
            // const photoPath = data.photo ? `https://www.pahrultours.com/app2/${data.photo}` : null;
            // const handwritten_documentPath = data.handwritten_document ? `https://www.pahrultours.com/app2/${data.handwritten_document}` : null;
            console.log(signaturePath);
            console.log(photoPath);
            console.log(handwritten_documentPath);
            // Set files state
            setFiles((files) => ({
                ...files,
                signature: signaturePath,
                photo: photoPath,
                handwritten_document: handwritten_documentPath,
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

    const handwritten_documentRef = useRef(null);
    const signatureRef = useRef(null);
    const photoRef = useRef(null);

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


        const data = new FormData();
        data.append('admission_no', admission_no);
        data.append('rescue_name', formData.rescue_name);
        data.append('age', formData.age);
        data.append('description', formData.description);
        data.append('handwritten_document', files.handwritten_document);
        data.append('signature', files.signature);
        data.append('photo', files.photo);

        if (files.handwritten_document && files.handwritten_document.length > 0) {
            files.handwritten_document.forEach(file => {
                data.append('handwritten_document', file); // ✅ no []
            });
        }

        if (files.signature && files.signature.length > 0) {
            files.signature.forEach(file => {
                data.append('signature', file); // ✅ no []
            });
        }

        if (files.photo && files.photo.length > 0) {
            files.photo.forEach(file => {
                data.append('photo', file); // ✅ no []
            });
        }

        try {
            const res = await apiRoute.post('/reunion/create_selfDeclaration', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert('Self Declaration Form Created Successfully!');
            setFormData({
                rescue_name: '',
                age: '',
                description: '',
            })
            setAdmissionNumber("");
            if (handwritten_documentRef.current) handwritten_documentRef.current.value = "";
            if (signatureRef.current) signatureRef.current.value = "";
            if (photoRef.current) photoRef.current.value = "";
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                alert(err.response.data.message);
            } else {
                alert("Something went wrong.");
            }
            console.error(err);
            alert('Submission failed.');
        }
    }

    const handleShow = async (admission_no) => {
        try {
            const response = await apiRoute.get(`/reunion/getSelfDeclaration/${admission_no}`);
            const data = response.data;

            setFormData((formData) => ({
                ...formData,
                rescue_name: data.rescue_name || '',
                age: data.age || '',
                description: data.description || '',
            }));

            // Handle old and new photo paths correctly
            // const signaturePath = data.signature ? `https://www.pahrultours.com/app2/${data.signature}` : null;
            // const photoPath = data.photo ? `https://www.pahrultours.com/app2/${data.photo}` : null;
            // const handwritten_documentPath = data.handwritten_document ? `https://www.pahrultours.com/app2/${data.handwritten_document}` : null;

            // Helper function to parse image paths
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

            const signaturePath = parseImageField(data.signature);
            const photoPath = parseImageField(data.photo);
            const handwritten_documentPath = parseImageField(data.handwritten_document);

            // Set files state
            setFiles((files) => ({
                ...files,
                handwritten_document: handwritten_documentPath,
                signature: signaturePath,
                photo: photoPath,
            }));

            setShow(true);
        } catch (error) {
            console.error("Error fetching form data:", error);
            alert("Admission Number not found");
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

    const handleUpdate = async (e, admission_no) => {
        e.preventDefault();

        const data = new FormData();
        data.append('rescue_name', formData.rescue_name);
        data.append('age', formData.age);
        data.append('description', formData.description);
        data.append('signature', files.signature);
        data.append('handwritten_document', files.handwritten_document);
        data.append('photo', files.photo);

        if (files.signature && files.signature.length > 0) {
            files.signature.forEach(file => {
                data.append('signature', file); // ✅ no []
            });
        }

        if (files.photo && files.photo.length > 0) {
            files.photo.forEach(file => {
                data.append('photo', file); // ✅ no []
            });
        }

        if (files.handwritten_document && files.handwritten_document.length > 0) {
            files.handwritten_document.forEach(file => {
                data.append('handwritten_document', file); // ✅ no []
            });
        }

        try {
            const res = await apiRoute.post(`/reunion/updateSelfDecl/${admission_no}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert("Self Declaration Form Updated successfully");
            handleClose(true);
            setAdmissionNumber("");
            setFormData({
                rescue_name: '',
                age: '',
                description: '',
            })
            if (handwritten_documentRef.current) handwritten_documentRef.current.value = "";
            if (signatureRef.current) signatureRef.current.value = "";
            if (photoRef.current) photoRef.current.value = "";
        } catch (err) {
            console.error(err);
            alert('Update failed.');
        }
    };

    const handleDelete = async (admission_no) => {
        alert("Are you sure want to delete");
        try {
            const response = await apiRoute.delete(`/reunion/deleteSelfDecl/${admission_no}`);
            console.log(response);
            alert("Self Declaration Form Deleted successfully");
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
                        <h6 className="breadcrumb_title">Self Declaration</h6>
                    </Col>
                    <Col md={8} className="text-center">
                        <h3 className="section_title">2. Self-Declaration Form for Discharge by Resident</h3>
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
                <Row className='d-flex align-items-center justify-content-center'>
                    <Col md={8} className="consultant_box my-4 self_declaration_form">
                        <div className="consultant_details">
                            <Form className='self_declaration' onSubmit={handleSubmit}>
                                <Row>
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
                                    <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                        <Form.Label column sm="4" className='text-start'>
                                            Age : <span style={{ color: 'red' }}>*</span>
                                        </Form.Label>
                                        <Col sm="8">
                                            <Form.Control
                                                type="text"
                                                name="age"
                                                value={formData.age}
                                                onChange={handleInputChange}
                                                required />
                                        </Col>
                                    </Form.Group>


                                    <Form.Group as={Row} className="mb-3 mt-3">
                                        <Form.Label column sm="4" className='text-start'>
                                            Handwritten Document : <span style={{ color: 'red' }}>*</span>
                                        </Form.Label>
                                        <Col sm="8">
                                            <Form.Control
                                                type="file"
                                                accept=".jpg,.jpeg,.png"
                                                name='handwritten_document'
                                                ref={handwritten_documentRef}
                                                onChange={handleFileChange}
                                                multiple
                                                required />
                                        </Col>
                                    </Form.Group>


                                    <Form.Group as={Row} className="mb-3 mt-3">
                                        <Form.Label column sm="4" className='text-start'>
                                            Signature : <span style={{ color: 'red' }}>*</span>
                                        </Form.Label>
                                        <Col sm="8">
                                            <Form.Control
                                                type="file"
                                                name='signature'
                                                ref={signatureRef}
                                                accept=".jpg,.jpeg,.png"
                                                onChange={handleFileChange}
                                                multiple
                                                required />
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} className="mb-3 mt-3">
                                        <Form.Label column sm="4" className='text-start'>
                                            Photo : <span style={{ color: 'red' }}>*</span>
                                        </Form.Label>
                                        <Col sm="8">
                                            <Form.Control
                                                type="file"
                                                name='photo'
                                                ref={photoRef}
                                                accept=".jpg,.jpeg,.png"
                                                onChange={handleFileChange}
                                                multiple
                                                required />
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                        <Form.Label column sm="4" className='text-start'>
                                            Description : <span style={{ color: 'red' }}>*</span>
                                        </Form.Label>
                                        <Col sm="8">
                                            <Form.Control
                                                type="text"
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
                        <h4 className="text-center">2. Self-Declaration Form for Discharge by Resident</h4>
                    </Col>
                </Row>
                <Form className='self_declaration'>
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
                        <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                            <Form.Label column sm="4" className='text-start'>
                                Age :
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control
                                    type="text"
                                    name="age"
                                    value={formData.age}
                                    onChange={handleInputChange}
                                    required />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                            <Form.Label column sm="4" className='text-start'>
                                Description :
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control
                                    type="text"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    required />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3 mt-3">
                            <Form.Label column sm="4" className='text-start'>
                                HandWritten Document :
                            </Form.Label>
                            <Col sm="8">
                                {Array.isArray(files.handwritten_document) && files.handwritten_document.length > 0 ? (
                                    files.handwritten_document.map((imgUrl, index) => (
                                        <img
                                            key={index}
                                            src={imgUrl}
                                            alt={`rescue recovery ${index + 1}`}
                                            loading="lazy"
                                            style={{
                                                width: "100px",
                                                height: "auto",
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
                                    ))
                                ) : (
                                    <div style={{ padding: "10px", fontStyle: "italic" }}>No image</div>
                                )}
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3 mt-3">
                            <Form.Label column sm="4" className='text-start'>
                                Signation :
                            </Form.Label>
                            <Col sm="8">
                                {Array.isArray(files.signature) && files.signature.length > 0 ? (
                                    files.signature.map((imgUrl, index) => (
                                        <img
                                            key={index}
                                            src={imgUrl}
                                            alt={`rescue recovery ${index + 1}`}
                                            loading="lazy"
                                            style={{
                                                width: "100px",
                                                height: "auto",
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
                                    ))
                                ) : (
                                    <div style={{ padding: "10px", fontStyle: "italic" }}>No image</div>
                                )}
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3 mt-3">
                            <Form.Label column sm="4" className='text-start'>
                                Photo :
                            </Form.Label>
                            <Col sm="8">
                                {Array.isArray(files.photo) && files.photo.length > 0 ? (
                                    files.photo.map((imgUrl, index) => (
                                        <img
                                            key={index}
                                            src={imgUrl}
                                            alt={`rescue recovery ${index + 1}`}
                                            loading="lazy"
                                            style={{
                                                width: "100px",
                                                height: "auto",
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
                                    ))
                                ) : (
                                    <div style={{ padding: "10px", fontStyle: "italic" }}>No image</div>
                                )}
                            </Col>
                        </Form.Group>

                    </Row>
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
                </Form>
            </div>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Self Decaration Form</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Col md={12}>
                        <Form className='self_declaration'>
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
                                <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                    <Form.Label column sm="6" className='text-start'>
                                        Age : <span style={{ color: 'red' }}>*</span>
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

                                {Array.isArray(files.handwritten_document) &&
                                    files.handwritten_document.map((imgUrl, index) => {
                                        const filename = `handwritten_document_${index}.jpg`;

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
                                                    alt={`handwritten_document - ${index}`}
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
                                        HandWritten Document : <span style={{ color: 'red' }}>*</span>
                                    </Form.Label>
                                    <Col sm="6">
                                        <Form.Control
                                            type="file"
                                            accept=".jpg,.jpeg,.png"
                                            onChange={handleFileChange}
                                            name="handwritten_document"
                                            multiple
                                        />
                                    </Col>
                                </Form.Group>

                                {Array.isArray(files.signature) &&
                                    files.signature.map((imgUrl, index) => {
                                        const filename = `signature_${index}.jpg`;

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
                                                    alt={`signature - ${index}`}
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
                                        Signation : <span style={{ color: 'red' }}>*</span>
                                    </Form.Label>
                                    <Col sm="6">
                                        <Form.Control
                                            type="file"
                                            accept=".jpg,.jpeg,.png"
                                            onChange={handleFileChange}
                                            name="signature"
                                            multiple
                                        />
                                    </Col>
                                </Form.Group>
                                {Array.isArray(files.photo) &&
                                    files.photo.map((imgUrl, index) => {
                                        const filename = `photo_${index}.jpg`;

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
                                                    alt={`photo - ${index}`}
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
                                        Photo : <span style={{ color: 'red' }}>*</span>
                                    </Form.Label>
                                    <Col sm="6">
                                        <Form.Control
                                            type="file"
                                            accept=".jpg,.jpeg,.png"
                                            onChange={handleFileChange}
                                            name="photo"
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
                                            type="text"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                        />
                                    </Col>
                                </Form.Group>


                                <div className="mt-3">
                                    <Button variant="success" className="m-1" type="submit" onClick={(e) => handleUpdate(e, admission_no)}>Submit</Button>
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

export default Self_Declaration_form
