import React from 'react';
import { Breadcrumb, Container, Row, Table, Button } from 'react-bootstrap';
import { Col, Form, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPlus, faEdit } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Modal from 'react-bootstrap/Modal';

function Family_Request_form() {
    const [show, setShow] = useState(false);
    const [admissionNumber, setAdmissionNumber] = useState('');
    const [files, setFiles] = useState({});
    const [previewRequested, setPreviewRequested] = useState(false);

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
        if (admissionNumber.trim().length >= 5) { // Adjust minimum length as needed
            fetchFormData();
        }
    }, [admissionNumber]);

    const fetchFormData = async () => {
        try {
            const response = await apiRoute.get(`http://localhost:5000/admision/get_scrb_formdata/${admissionNumber}`);
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
        data.append('rescue_relationship', storeData.rescue_relationship);
        data.append('f_member_name', storeData.f_member_name);
        data.append('f_member_phone', storeData.f_member_phone);
        data.append('f_member_address', storeData.f_member_address);

        try {
            const res = await apiRoute.post('/reunion/create_family_letter', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert('Family Request Letter submitted successfully!');
            window.location.reload();
        } catch (err) {
            console.error(err);
            alert('Submission failed.');
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
                f_member_phone: data.f_member_phone || '',
                f_member_address: data.f_member_address || '',
            }));
            console.log("Fetched Data:", data);

            // Handle old and new photo paths correctly
            const aadharCardPath = data.f_aadhar_card ? `http://localhost:5000/${data.f_aadhar_card}` : null;
            const rationCardPath = data.f_ration_card ? `http://localhost:5000/${data.f_ration_card}` : null;

            // Set files state
            setFiles((files) => ({
                ...files,
                f_aadhar_card: aadharCardPath,
                f_ration_card: rationCardPath,
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


            // Set files state
            setFiles((files) => ({
                ...files,
                f_aadhar_card: aadharCardPath,
                f_ration_card: rationCardPath,
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
        data.append('description',formData.description);
        data.append('family_relationship',formData.family_relationship);
        data.append('f_member_name',formData.f_member_name);
        data.append('f_member_phone',formData.f_member_phone);
        data.append('f_member_address',formData.f_member_address);
        data.append('f_aadhar_card', files.f_aadhar_card);
        data.append('f_ration_card', files.f_ration_card);
      
        try {
          const res = await apiRoute.post(`/reunion/update_family_letter/${admissionNumber}`, data, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          alert('Family Resquest Letter updated successfully!');
        } catch (err) {
          console.error(err);
          alert('Update failed.');
        }
    };

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
                    <Col md={3} className="text-start">
                        <h3 className="section_title">Family Request Letter</h3>
                    </Col>
                    <Col md={2}>
                        <Form className="navbar-search">
                            <Form.Group id="topbarSearch">
                                <InputGroup className="input-group-merge search-bar">
                                    <Form.Control
                                        type="text"
                                        placeholder="Search"
                                    />
                                    <InputGroup.Text style={{ cursor: 'pointer', background: "#6abc15", color: "#fff" }}>
                                        <i className="fas fa-plus"></i>
                                    </InputGroup.Text>

                                </InputGroup>
                            </Form.Group>
                        </Form>
                    </Col>
                </Row>
            </Container>

            <Container>
                <Form className="navbar-search col-md-12 d-flex align-items-center justify-content-center">
                    <Form.Group id="topbarSearch" className="mt-3 d-flex align-items-center justify-content-center">
                        <Col md={5}>
                            <Form.Label>Enter Your Admission Number:</Form.Label>
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
                        <button type="button" className="btn btn-primary mx-1" onClick={() => {
                            if (!admissionNumber.trim()) {
                                alert("Please enter your admission number.");
                            } else {
                                createFormData(); // Fetch & populate data before generating PDF
                            }
                        }}><FontAwesomeIcon icon={faPlus} className="me-0" /></button>
                        <button type="button" className="btn btn-primary mx-1" onClick={() => {
                            if (!admissionNumber.trim()) {
                                alert("Please enter your admission number.");
                            } else {
                                handleShow(admissionNumber); // Fetch & populate data before generating PDF
                            }
                        }}><FontAwesomeIcon icon={faEdit} className="me-0" /></button>
                    </Form.Group>
                </Form>

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

                            <Form.Group as={Row} className="mb-1 text-start" controlId="formPoliceMemo">
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
                                    Person Name :
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
                                    Person Age :
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
                                    Person Phone No :
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
                                    Person Address :
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
                                    Aadhar Card No :
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
                                    Ration Card :
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
                        <Form className='d-flex align-items-center justify-content-center flex-column'>

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
                                            value={storeData.age}
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
                                            value={storeData.phone_no}
                                            onChange={handleInputChange2}
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
                                        Aadhar Card No :
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
                                            <p>No new photo available</p> // Display if no photo
                                        )}
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-1 text-start" controlId="formPoliceMemo">
                                    <Form.Label column sm="4">
                                        Ration Card :
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
                                            <p>No new photo available</p> // Display if no photo
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
                                                Aadhar Card No :
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
                                                Ration Card :
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
