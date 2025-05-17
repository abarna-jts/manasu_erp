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
        const { name, files: selectedFiles } = e.target;
        setFiles(prevFiles => ({
            ...prevFiles,
            [name]: selectedFiles[0]
        }));
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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

            // Handle old and new photo paths correctly
            const signaturePath = data.signature ? `http://localhost:5000/${data.signature}` : null;
            const photoPath = data.photo ? `http://localhost:5000/${data.photo}` : null;

            // Set files state
            setFiles((files) => ({
                ...files,
                signature: signaturePath,
                photo: photoPath,
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('admission_no', admission_no);
        data.append('rescue_name', formData.rescue_name);
        data.append('age', formData.age);
        data.append('description', formData.description);
        data.append('signature', files.signature);
        data.append('photo', files.photo);

        try {
            const res = await apiRoute.post('/reunion/create_selfDeclaration', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert('Family Request Letter submitted successfully!');
            window.location.reload();
        } catch (err) {
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
            const signaturePath = data.signature ? `http://localhost:5000/${data.signature}` : null;
            const photoPath = data.photo ? `http://localhost:5000/${data.photo}` : null;


            // Set files state
            setFiles((files) => ({
                ...files,
                signature: signaturePath,
                photo: photoPath,
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
        data.append('age', formData.age);
        data.append('description', formData.description);
        data.append('signature', files.signature);
        data.append('photo', files.photo);

        try {
            const res = await apiRoute.post(`/reunion/updateSelfDecl/${admission_no}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert('Family Resquest Letter updated successfully!');
            window.location.reload();
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
                        <h6 className="breadcrumb_title">Self Declaration</h6>
                    </Col>
                    <Col md={8} className="text-center">
                        <h3 className="section_title">Self-Declaration Form for Discharge by Resident</h3>
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
                            <Form.Label>Enter Your Admission Number:</Form.Label>
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
                <Row className='d-flex align-items-center justify-content-center'>
                    <Col md={8} className="consultant_box my-4">
                        <div className="consultant_details">
                            <Form className='self_declaration' onSubmit={handleSubmit}>
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
                                            Signation :
                                        </Form.Label>
                                        <Col sm="8">
                                            <Form.Control
                                                type="file"
                                                name='signature'
                                                onChange={handleFileChange}
                                                required />
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} className="mb-3 mt-3">
                                        <Form.Label column sm="4" className='text-start'>
                                            Photo :
                                        </Form.Label>
                                        <Col sm="8">
                                            <Form.Control
                                                type="file"
                                                name='photo'
                                                onChange={handleFileChange}
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
                <h3 className='section_title'>Self-Declaration Form for Discharge by Resident</h3>
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
                                Signation :
                            </Form.Label>
                            <Col sm="8">
                                {files.signature ? (
                                    <>
                                        <img
                                            src={files.signature}
                                            alt="New"
                                            style={{ width: "100px", height: "100px", marginTop: "10px" }}
                                        />
                                    </>
                                ) : (
                                    <p>No new photo available</p> // Display if no photo
                                )}
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3 mt-3">
                            <Form.Label column sm="4" className='text-start'>
                                Photo :
                            </Form.Label>
                            <Col sm="8">
                                {files.photo ? (
                                    <>
                                        <img
                                            src={files.photo}
                                            alt="New"
                                            style={{ width: "100px", height: "100px", marginTop: "10px" }}
                                        />
                                    </>
                                ) : (
                                    <p>No new photo available</p> // Display if no photo
                                )}
                            </Col>
                        </Form.Group>

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
                                        Signation :
                                    </Form.Label>
                                    <Col sm="8">
                                        {files.signature ? (
                                            <>
                                                <img
                                                    src={files.signature}
                                                    alt="Old"
                                                    style={{ width: "100px", height: "100px", marginTop: "10px" }}
                                                />
                                            </>
                                        ) : (
                                            <p>No old photo available</p> // Display if no photo
                                        )}

                                        <Form.Control
                                            type="file"
                                            onChange={handleFileChange}
                                            name="signature"
                                        />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-3 mt-3">
                                    <Form.Label column sm="4" className='text-start'>
                                        Photo :
                                    </Form.Label>
                                    <Col sm="8">
                                        {files.photo ? (
                                            <>
                                                <img
                                                    src={files.photo}
                                                    alt="Old"
                                                    style={{ width: "100px", height: "100px", marginTop: "10px" }}
                                                />
                                            </>
                                        ) : (
                                            <p>No old photo available</p> // Display if no photo
                                        )}

                                        <Form.Control
                                            type="file"
                                            onChange={handleFileChange}
                                            name="photo"
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
