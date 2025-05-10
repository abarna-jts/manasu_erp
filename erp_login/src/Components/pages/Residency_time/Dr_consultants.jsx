import React from 'react'
import { Breadcrumb, Container, Row, Form, Button, InputGroup } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPlus, faEdit } from "@fortawesome/free-solid-svg-icons";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useRef } from "react";
import Modal from 'react-bootstrap/Modal';

function Dr_consultants() {
    const [admissionNumber, setAdmissionNumber] = useState('');
    const [previewRequested, setPreviewRequested] = useState(false);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);

    const [formData, setFormData] = useState({
        admissionNumber: '',
        rescue_name: '',
        rescue_age: '',
        rescue_gender: '',
        mfm_no: '',
        ward_no: '',
        bed_no: '',
        consultants: '',
        dr_name: '',
        dr_qualification: '',
        consult_dr_name: '',
        consult_dr_quali: ''

    });

    const [refData, setRefData] = useState({
        admissionNumber: '',
        rescue_name: '',
        rescue_age: '',
        rescue_gender: '',
        mfm_no: '',
        ward_no: '',
        bed_no: '',
        consultants: '',
        dr_name: '',
        dr_qualification: '',
        consult_dr_name: '',
        consult_dr_quali: ''
    })

    const [storeData, setStoreData] = useState({
        rescue_name: '',
        rescue_age: '',
        rescue_gender: '',
        mfm_no: '',
        ward_no: '',
        bed_no: '',
        consultants: '',
        dr_name: '',
        dr_qualification: '',
        consult_dr_name: '',
        consult_dr_quali: ''
    })


    const apiRoute = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
    });

    const createFormData = () => {
        const targetElement = document.querySelector('.dr_consultant');
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    }

    const handleChange = (e) => {
        setStoreData({ ...storeData, [e.target.name]: e.target.value });
    };

    const handleEditChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAdmissionChange = (e) => {
        const value = e.target.value;
        setAdmissionNumber(value);
        setStoreData((prevData) => ({
            ...prevData,
            admissionNumber: value
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await apiRoute.post('/residency/create_dr_consults', storeData);
            console.log(response.storeData);
            if (response.status === 200) {
                alert('Form submitted successfully!');
                window.location.reload();
            } else {
                alert('Error submitting form.');
            }
        } catch (error) {
            console.error('There was an error submitting the form:', error);
            alert('There was an error submitting the form.');
        }
    };

    const handleShow = async (admissionNumber) => {
        try {
            const response = await apiRoute.get(`/residency/get_dr_consultant/${admissionNumber}`);
            const data = response.data;

            setFormData((formData) => ({
                ...formData,
                admissionNumber: data.admissionNumber || '',
                rescue_name: data.rescue_name || '',
                rescue_age: data.rescue_age || '',
                rescue_gender: data.rescue_gender || '',
                mfm_no: data.mfm_no || '',
                ward_no: data.ward_no || '',
                bed_no: data.bed_no || '',
                consultants: data.consultants || '',
                dr_name: data.dr_name || '',
                dr_qualification: data.dr_qualification || '',
                consult_dr_name: data.consult_dr_name || '',
                consult_dr_quali: data.consult_dr_quali || '',
            }));

            setShow(true);
        } catch (error) {
            console.error("Error fetching form data:", error);
            alert("Admission Number not found");
        }
    };

    const handleUpdate = async (e, admissionNumber) => {
        e.preventDefault();
        try {
            const response = await apiRoute.put(`/residency/update_dr_consultant/${admissionNumber}`, formData);
            console.log(response.data);
            if (response.status === 200) {
                alert('Form Updated successfully!');
                handleClose(true);
            } else {
                alert('Error Updating form.');
            }
        } catch (error) {
            console.error('There was an error Updating the form:', error);
            alert('There was an error Updating the form.');
        }
    };
    


    const fetchFormData = async () => {
        try {
            const response = await apiRoute.get(`/residency/get_dr_consultant/${admissionNumber}`);
            const data = response.data;

            setRefData((refData) => ({
                ...refData,
                admissionNumber: data.admissionNumber || '',
                rescue_name: data.rescue_name || '',
                rescue_age: data.rescue_age || '',
                rescue_gender: data.rescue_gender || '',
                mfm_no: data.mfm_no || '',
                ward_no: data.ward_no || '',
                bed_no: data.bed_no || '',
                consultants: data.consultants || '',
                dr_name: data.dr_name || '',
                dr_qualification: data.dr_qualification || '',
                consult_dr_name: data.consult_dr_name || '',
                consult_dr_quali: data.consult_dr_quali || '',
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
                        <h6 className="breadcrumb_title">Doctor Consultancy</h6>
                    </Col>
                    <Col md={7} className="text-start">
                        <h3 className="section_title">Doctor Consultants Form</h3>
                    </Col>
                </Row>
            </Container>


            <Container>
                <Form className="navbar-search col-md-9">
                    <Form.Group id="topbarSearch" className="d-flex align-items-center">
                        <Col md={3}>
                            <Form.Label>Enter Your Admission Number:</Form.Label>
                        </Col>
                        <Col md={2}>
                            <InputGroup className="input-group-merge search-bar">
                                <Form.Control
                                    type="text"
                                    value={admissionNumber}
                                    onChange={handleAdmissionChange}
                                />
                            </InputGroup>
                        </Col>
                        <button type="button" className="btn btn-secondary mx-1" onClick={() => {
                            if (!admissionNumber.trim()) {
                                alert("Please enter your admission number.");
                            } else {
                                fetchFormData(); // Fetch & populate data before generating PDF
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
                    <Col md={12} className="consultant_box my-4">
                        <div className="consultant_details">
                            <Form onSubmit={handleSubmit} className='dr_consultant'>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                            <Form.Label column sm="4" className='text-start'>
                                                Name :
                                            </Form.Label>
                                            <Col sm="8">
                                                <Form.Control
                                                    type="text"
                                                    name="rescue_name"
                                                    value={storeData.rescue_name}
                                                    onChange={handleChange}
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
                                                    name="rescue_age"
                                                    value={storeData.rescue_age}
                                                    onChange={handleChange}
                                                    required />
                                            </Col>
                                        </Form.Group>
                                        <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                            <Form.Label column sm="4" className='text-start'>
                                                Sex :
                                            </Form.Label>
                                            <Col sm="8">
                                                <Form.Control
                                                    type="text"
                                                    name="rescue_gender"
                                                    value={storeData.rescue_gender}
                                                    onChange={handleChange}
                                                    required />
                                            </Col>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group as={Row} className="mb-1" controlId="formMFMNo">
                                            <Form.Label column sm="4" className='text-start'>
                                                MFM No. :
                                            </Form.Label>
                                            <Col sm="8">
                                                <Form.Control
                                                    type="number"
                                                    name="mfm_no"
                                                    value={storeData.mfm_no}
                                                    onChange={handleChange}
                                                    required />
                                            </Col>
                                        </Form.Group>
                                        <Form.Group as={Row} className="mb-1" controlId="formWard">
                                            <Form.Label column sm="4" className='text-start'>
                                                Ward :
                                            </Form.Label>
                                            <Col sm="8">
                                                <Form.Control
                                                    type="number"
                                                    name="ward_no"
                                                    value={storeData.ward_no}
                                                    onChange={handleChange}
                                                    required />
                                            </Col>
                                        </Form.Group>
                                        <Form.Group as={Row} className="mb-1" controlId="formBed">
                                            <Form.Label column sm="4" className='text-start'>
                                                Bed :
                                            </Form.Label>
                                            <Col sm="8">
                                                <Form.Control
                                                    type="number"
                                                    name="bed_no"
                                                    value={storeData.bed_no}
                                                    onChange={handleChange}
                                                    required />
                                            </Col>
                                        </Form.Group>
                                    </Col>

                                    <Form.Group as={Row} className="mb-3 mt-3" controlId="formRescueName">
                                        <Form.Label column sm="2" className='text-start'>
                                            Consultants :
                                        </Form.Label>
                                        <Col sm="8">
                                            <Form.Control
                                                as="textarea"
                                                name="consultants"
                                                value={storeData.consultants}
                                                onChange={handleChange}
                                                required />
                                        </Col>
                                    </Form.Group>

                                    <Col md={6}>
                                        <Form.Group as={Row} className="mb-1" controlId="formBed">
                                            <Form.Label column sm="4" className='text-start'>
                                                Doctor Name :
                                            </Form.Label>
                                            <Col sm="8">
                                                <Form.Control
                                                    type="text"
                                                    name="dr_name"
                                                    value={storeData.dr_name}
                                                    onChange={handleChange}
                                                    required />
                                            </Col>
                                        </Form.Group>
                                        <Form.Group as={Row} className="mb-1" controlId="formBed">
                                            <Form.Label column sm="4" className='text-start'>
                                                Doctor Qualification :
                                            </Form.Label>
                                            <Col sm="8">
                                                <Form.Control
                                                    type="text"
                                                    name="dr_qualification"
                                                    value={storeData.dr_qualification}
                                                    onChange={handleChange}
                                                    required />
                                            </Col>
                                        </Form.Group>
                                    </Col>

                                    <Col md={6}>
                                        <Form.Group as={Row} className="mb-1" controlId="formBed">
                                            <Form.Label column sm="4" className='text-start'>
                                                Consultant Doctor :
                                            </Form.Label>
                                            <Col sm="8">
                                                <Form.Control
                                                    type="text"
                                                    name="consult_dr_name"
                                                    value={storeData.consult_dr_name}
                                                    onChange={handleChange}
                                                    required />
                                            </Col>
                                        </Form.Group>
                                        <Form.Group as={Row} className="mb-1" controlId="formBed">
                                            <Form.Label column sm="4" className='text-start'>
                                                Doctor Qualification :
                                            </Form.Label>
                                            <Col sm="8">
                                                <Form.Control
                                                    type="text"
                                                    name="consult_dr_quali"
                                                    value={storeData.consult_dr_quali}
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
                    </Col>
                </Row>
            </Container>

            <div ref={formRef} style={{ position: "absolute", left: "-9999px", top: 0, background: "#fff", padding: "20px", width: "210mm" }}>

                <h4 className="text-center">Doctor Consultants Form</h4>

                <Form className='dr_consultant'>
                    <Row>
                        <Col md={6}>
                            <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                <Form.Label column sm="4" className='text-start'>
                                    Name :
                                </Form.Label>
                                <Col sm="8">
                                    <Form.Control
                                        type="text"
                                        name="rescue_name"
                                        value={refData.rescue_name}
                                        onChange={handleChange}
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
                                        name="rescue_age"
                                        value={refData.rescue_age}
                                        onChange={handleChange}
                                        required />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                <Form.Label column sm="4" className='text-start'>
                                    Sex :
                                </Form.Label>
                                <Col sm="8">
                                    <Form.Control
                                        type="text"
                                        name="rescue_gender"
                                        value={refData.rescue_gender}
                                        onChange={handleChange}
                                        required />
                                </Col>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group as={Row} className="mb-1" controlId="formMFMNo">
                                <Form.Label column sm="4" className='text-start'>
                                    MFM No. :
                                </Form.Label>
                                <Col sm="8">
                                    <Form.Control
                                        type="number"
                                        name="mfm_no"
                                        value={refData.mfm_no}
                                        onChange={handleChange}
                                        required />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-1" controlId="formWard">
                                <Form.Label column sm="4" className='text-start'>
                                    Ward :
                                </Form.Label>
                                <Col sm="8">
                                    <Form.Control
                                        type="number"
                                        name="ward_no"
                                        value={refData.ward_no}
                                        onChange={handleChange}
                                        required />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-1" controlId="formBed">
                                <Form.Label column sm="4" className='text-start'>
                                    Bed :
                                </Form.Label>
                                <Col sm="8">
                                    <Form.Control
                                        type="number"
                                        name="bed_no"
                                        value={refData.bed_no}
                                        onChange={handleChange}
                                        required />
                                </Col>
                            </Form.Group>
                        </Col>

                        <Form.Group as={Row} className="mb-3 mt-3" controlId="formRescueName">
                            <Form.Label column sm="2" className='text-start'>
                                Consultants :
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control
                                    as="textarea"
                                    name="consultants"
                                    value={refData.consultants}
                                    onChange={handleChange}
                                    required />
                            </Col>
                        </Form.Group>

                        <Col md={6}>
                            <Form.Group as={Row} className="mb-1" controlId="formBed">
                                <Form.Label column sm="7" className='text-start'>
                                    Doctor Name :
                                </Form.Label>
                                <Col sm="5">
                                    <Form.Control
                                        type="text"
                                        name="dr_name"
                                        value={refData.dr_name}
                                        onChange={handleChange}
                                        required />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-1" controlId="formBed">
                                <Form.Label column sm="7" className='text-start'>
                                    Doctor Qualification :
                                </Form.Label>
                                <Col sm="5">
                                    <Form.Control
                                        type="text"
                                        name="dr_qualification"
                                        value={refData.dr_qualification}
                                        onChange={handleChange}
                                        required />
                                </Col>
                            </Form.Group>
                        </Col>

                        <Col md={6}>
                            <Form.Group as={Row} className="mb-1" controlId="formBed">
                                <Form.Label column sm="7" className='text-start'>
                                    Consultant Doctor :
                                </Form.Label>
                                <Col sm="5">
                                    <Form.Control
                                        type="text"
                                        name="consult_dr_name"
                                        value={refData.consult_dr_name}
                                        onChange={handleChange}
                                        required />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-1" controlId="formBed">
                                <Form.Label column sm="7" className='text-start'>
                                    Doctor Qualification :
                                </Form.Label>
                                <Col sm="5">
                                    <Form.Control
                                        type="text"
                                        name="consult_dr_quali"
                                        value={refData.consult_dr_quali}
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
                    <Modal.Title>Edit Doctor Consultancy Form</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Col md={12}>
                        <Form className='dr_consultant'>
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
                                                onChange={handleEditChange}
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
                                                name="rescue_age"
                                                value={formData.rescue_age}
                                                onChange={handleEditChange}
                                                required />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                        <Form.Label column sm="4" className='text-start'>
                                            Sex :
                                        </Form.Label>
                                        <Col sm="8">
                                            <Form.Control
                                                type="text"
                                                name="rescue_gender"
                                                value={formData.rescue_gender}
                                                onChange={handleEditChange}
                                                required />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} className="mb-1" controlId="formMFMNo">
                                        <Form.Label column sm="4" className='text-start'>
                                            MFM No. :
                                        </Form.Label>
                                        <Col sm="8">
                                            <Form.Control
                                                type="number"
                                                name="mfm_no"
                                                value={formData.mfm_no}
                                                onChange={handleEditChange}
                                                required />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} className="mb-1" controlId="formWard">
                                        <Form.Label column sm="4" className='text-start'>
                                            Ward :
                                        </Form.Label>
                                        <Col sm="8">
                                            <Form.Control
                                                type="number"
                                                name="ward_no"
                                                value={formData.ward_no}
                                                onChange={handleEditChange}
                                                required />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} className="mb-1" controlId="formBed">
                                        <Form.Label column sm="4" className='text-start'>
                                            Bed :
                                        </Form.Label>
                                        <Col sm="8">
                                            <Form.Control
                                                type="number"
                                                name="bed_no"
                                                value={formData.bed_no}
                                                onChange={handleEditChange}
                                                required />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} className="mb-3 mt-3" controlId="formRescueName">
                                    <Form.Label column sm="4" className='text-start'>
                                        Consultants :
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control
                                            as="textarea"
                                            name="consultants"
                                            value={formData.consultants}
                                            onChange={handleEditChange}
                                            required />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-1" controlId="formBed">
                                        <Form.Label column sm="4" className='text-start'>
                                            Doctor Name :
                                        </Form.Label>
                                        <Col sm="8">
                                            <Form.Control
                                                type="text"
                                                name="dr_name"
                                                value={formData.dr_name}
                                                onChange={handleEditChange}
                                                required />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} className="mb-1" controlId="formBed">
                                        <Form.Label column sm="5" className='text-start'>
                                            Doctor Qualification :
                                        </Form.Label>
                                        <Col sm="7">
                                            <Form.Control
                                                type="text"
                                                name="dr_qualification"
                                                value={formData.dr_qualification}
                                                onChange={handleEditChange}
                                                required />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} className="mb-1" controlId="formBed">
                                        <Form.Label column sm="5" className='text-start'>
                                            Consultant Doctor :
                                        </Form.Label>
                                        <Col sm="7">
                                            <Form.Control
                                                type="text"
                                                name="consult_dr_name"
                                                value={formData.consult_dr_name}
                                                onChange={handleEditChange}
                                                required />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} className="mb-1" controlId="formBed">
                                        <Form.Label column sm="5" className='text-start'>
                                            Doctor Qualification :
                                        </Form.Label>
                                        <Col sm="7">
                                            <Form.Control
                                                type="text"
                                                name="consult_dr_quali"
                                                value={formData.consult_dr_quali}
                                                onChange={handleEditChange}
                                                required />
                                        </Col>
                                    </Form.Group>

                                <div className="mt-3 d-flex align-tems-cente justify-content-between">
                                    <Button variant="success" className="m-1" type="submit" onClick={(e) => handleUpdate(e, admissionNumber)}>Update</Button>
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

export default Dr_consultants
