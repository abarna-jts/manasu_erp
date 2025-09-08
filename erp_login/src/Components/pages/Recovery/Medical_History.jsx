import React from 'react'
import { Breadcrumb, Form, InputGroup, Container, Row, Col, Table, Button } from '@themesberg/react-bootstrap';
import { useState, useEffect } from "react";
import axios from 'axios';
import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import manasu_logo from "../Admission/Manasu-Logo.png";
import Modal from 'react-bootstrap/Modal';
import Cookies from 'js-cookie';

function Medical_History() {
    const [visitDetails, setVisitDetails] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [previewRequested, setPreviewRequested] = useState(false);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;


    const userType = Cookies.get('usertype');

    const searchFilteredRescueDetails = (visitDetails || []).filter((item) => {
        const searchTerm = searchQuery.toLowerCase();
        return (
            String(item.admission_no).toLowerCase().includes(searchTerm) ||
            String(item.disability_status).toLowerCase().includes(searchTerm) ||
            String(item.medication).toLowerCase().includes(searchTerm) ||
            String(item.acute_health).toLowerCase().includes(searchTerm) ||
            String(item.medication_allergies).toLowerCase().includes(searchTerm)
        );
    });

    const [medicalData, setMedicalData] = useState({
        admission_no: '',
        date: '',
        disability_status: '',
        chronic_medical: '',
        acute_health: '',
        medication: '',
        medication_allergies: '',
        other_allergy: [],
        significant_medical: [],
        traumatic_injuries: '',
        sexual_health: []
    })

    const apiRoute = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
    });
    const getVisitDetails = async () => {
        try {
            const response = await apiRoute.get('/recovery/get_medical');
            console.log(response.data);
            setVisitDetails(response.data.data); // Should be an array
        } catch (error) {
            console.error("Error fetching Basic Details:", error);
        }
    };
    useEffect(() => {
        getVisitDetails();
    }, []);

    const formatDateTime = (dateStr) => {
        const date = new Date(dateStr);
        if (isNaN(date)) return ""; // Invalid date fallback

        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();

        return `${day}-${month}-${year}`;
    };

    const fetchFormData = async (id) => {
        try {
            const response = await apiRoute.get(`/recovery/get_medicalHistory/${id}`);
            const data = response.data;

            setMedicalData((medicalData) => ({
                ...medicalData,
                admission_no: data.admission_no || '',
                date: data.date || '',
                disability_status: data.disability_status || '',
                chronic_medical: data.chronic_medical || '',
                acute_health: data.acute_health || '',
                medication: data.medication || '',
                medication_allergies: data.medication_allergies || '',
                other_allergy: data.other_allergy?.split(',') || ["NULL"],
                significant_medical: data.significant_medical?.split(',') || ["NULL"],
                traumatic_injuries: data.traumatic_injuries || '',
                sexual_health: data.sexual_health?.split(',') || ["NULL"]
            }));

            setPreviewRequested(true); // trigger the effect after state updates
        } catch (error) {
            console.error("Error fetching form data:", error);
            alert("Doctor ID is not found");
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

        const canvas = await html2canvas(input, { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const imgProps = pdf.getImageProperties(imgData);
        const imgWidth = pdfWidth;
        const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

        let heightLeft = imgHeight;
        let position = 0;

        // First page
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;

        // Additional pages if needed
        while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pdfHeight;
        }

        const pdfBlob = pdf.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl, '_blank');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setMedicalData((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditform = async (id) => {
        try {
            const response = await apiRoute.get(`/recovery/get_medicalHistory/${id}`);
            const data = response.data;

            setMedicalData((medicalData) => ({
                ...medicalData,
                id: data.id || '',
                admission_no: data.admission_no || '',
                date: data.date || '',
                disability_status: data.disability_status || '',
                chronic_medical: data.chronic_medical || '',
                acute_health: data.acute_health || '',
                medication: data.medication || '',
                medication_allergies: data.medication_allergies || '',
                other_allergy: data.other_allergy?.split(',').map(i => i.trim()) || [],
                significant_medical: data.significant_medical?.split(',').map(i => i.trim()) || [],
                traumatic_injuries: data.traumatic_injuries || '',
                sexual_health: data.sexual_health?.split(',').map(i => i.trim()) || []
            }));

            setShow(true);

        } catch (error) {
            console.error("Error fetching form data:", error);
            alert("Basic Detail is not found");
        }
    };

    const handleMedicalUpdate = async (e, id) => {
        e.preventDefault();
        try {
            const res = await apiRoute.post(`/recovery/updateMedicalHistory/${id}`, medicalData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            alert('Medical History Form updated successfully!');
            setMedicalData({
                disability_status: '',
                chronic_medical: '',
                acute_health: '',
                medication: '',
                medication_allergies: '',
                other_allergy: [],
                significant_medical: [],
                traumatic_injuries: '',
                sexual_health: []
            })
            handleClose(true);
            getVisitDetails();
        } catch (err) {
            console.error(err);
            alert('Update failed.');
        }
    }

    const renderMedCheckbox = (field, id, label) => (
        <Form.Check
            type="checkbox"
            id={id}
            label={label}
            checked={medicalData[field]?.includes(label)}
            onChange={(e) => {
                const updated = e.target.checked
                    ? [...medicalData[field], label]
                    : medicalData[field].filter(item => item !== label);

                setMedicalData(prev => ({
                    ...prev,
                    [field]: updated
                }));
            }}
        />
    );
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = searchFilteredRescueDetails.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(searchFilteredRescueDetails.length / itemsPerPage);
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const handleDelete = async (admission_no) => {
        try {
            const confirmDelete = window.confirm("Are you sure you want to delete this record?");
            if (!confirmDelete) return; // if user clicks 'Cancel', do nothing
            const res = await apiRoute.delete(`/social_remover/MedHistoryToRecBin/${admission_no}`);
            console.log(res.data);
            alert("Moved to recycle bin");
            getVisitDetails();
            // refresh table
        } catch (err) {
            console.error(err);
            alert("Error deleting");
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
                            <Breadcrumb.Item active>Psychiatric Form</Breadcrumb.Item>
                        </Breadcrumb>
                        <h6 className="breadcrumb_title">Psychiatric Case History</h6>
                    </Col>
                    <Col md={8} className="text-start mb-4">
                        <h3 className="section_title text-center">Medical History</h3>
                    </Col>
                    <Col md={2}>
                        <div className="d-flex align-items-center px-3">

                            <Form className="navbar-search">
                                <Form.Group id="topbarSearch">
                                    <InputGroup className="input-group-merge search-bar">

                                        <Form.Control
                                            type="text"
                                            placeholder="Search"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </InputGroup>
                                </Form.Group>
                            </Form>
                        </div>
                    </Col>

                </Row>
            </Container>
            <Col md={3}>
                <Button type='button' className='btn btn-success' onClick={() => window.history.back()}>Back</Button>
            </Col>
            <Container>
                <Row>
                    <Table responsive="sm">
                        <thead>
                            <tr>
                                <th>S.No</th>
                                <th>Admission Number</th>
                                <th>Date</th>
                                <th>Disability Status</th>
                                <th>Medication</th>
                                <th>Acute Health Concerns</th>
                                <th>Medication Allergies</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.length > 0 ? (
                                currentItems.map((item, index) => (
                                    <tr key={item.id}>
                                        <td>{indexOfFirstItem + index + 1}</td>
                                        <td>{item.admission_no || "Null"}</td>
                                        <td>{formatDateTime(item.date) || "Null"}</td>
                                        <td>{item.disability_status || "Null"}</td>
                                        <td>{item.medication || "Null"}</td>
                                        <td>{item.acute_health || "Null"}</td>
                                        <td>{item.medication_allergies || "Null"}</td>
                                        <td>
                                            <button className="btn btn-success icon_details"
                                                onClick={() => {
                                                    fetchFormData(item.id);
                                                }}
                                            >
                                                <i className="fas fa-eye"></i>
                                            </button>
                                            {userType === "4" && (
                                                <button className="btn btn-secondary icon_details"
                                                    onClick={() => {
                                                        handleEditform(item.id);
                                                    }}
                                                ><i className="fas fa-edit"></i> </button>
                                            )}
                                            {userType === "2" && (
                                                <button className="btn btn-danger icon_details"
                                                    onClick={() => handleDelete(item.admission_no)}
                                                ><i className="fas fa-trash"></i></button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="10" className="text-center text-danger">No data found</td>
                                </tr>
                            )}
                        </tbody>

                    </Table>
                    <div className="d-flex justify-content-end align-items-center mb-3 mx-3">
                        <button
                            className="btn btn-success me-2"
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            <i className="fas fa-chevron-left"></i>
                        </button>

                        <span> Page {currentPage} of {totalPages} </span>

                        <button
                            className="btn btn-success ms-2"
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            <i className="fas fa-chevron-right"></i>
                        </button>
                    </div>
                </Row>
            </Container>
            <div ref={formRef} style={{ position: "absolute", left: "-9999px", top: 0, background: "#fff", padding: "20px", width: "210mm" }}>
                <Row className="d-flex align-items-center justify-content-start mb-2">
                    <Col md={2} className='d-flex align-items-center pdf_logo'>
                        <img src={manasu_logo} className="pdf_logo" alt="" />
                    </Col>
                    <Col md={8}>
                        <h4 className="text-center">MEDICAL HISTORY </h4>
                    </Col>
                </Row>
                <Row className='d-flex align-items-center justify-content-center'>
                    <Col md={5}>
                        <Form.Group className="mb-3 d-flex align-items-center" as={Row}>
                            <Form.Label column sm="6" className='text-start'>Admission No. :</Form.Label>
                            <Col md={6}>
                                <div className='text-start'>
                                    {medicalData.admission_no}
                                </div>
                            </Col>
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group className="mb-3 d-flex align-items-center" as={Row}>
                            <Form.Label column sm="6" className='text-start'>Date :</Form.Label>
                            <Col md={6}>
                                <div className='text-start'>
                                    {formatDateTime(medicalData.date)}
                                </div>
                            </Col>
                        </Form.Group>
                    </Col>
                </Row>
                <Form className='mt-4'>
                    <Form.Group className="mb-3" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <li className='icon-li'>
                                <h5>Disability Status (Physical or Psychological): </h5>
                            </li>
                        </Form.Label>
                        {/* <Col md={6}>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                name='disability_status'
                                value={medicalData.disability_status}
                                onChange={handleInputChange}
                                required
                            />
                        </Col> */}
                        <Col md={6} className='text-start mr-5' style={{ border: "1px solid #ccc", padding: "8px", borderRadius: "5px" }}>
                            <div
                                className="wrap-textarea"
                                style={{

                                    minHeight: '40px',
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word',
                                    overflowWrap: 'break-word',
                                    textAlign: "justify"
                                }}
                            >
                                {medicalData.disability_status}
                            </div>

                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <li className='icon-li'>
                                <h5>Chronic Medical Conditions: </h5>
                            </li>
                        </Form.Label>
                        {/* <Col md={6}>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                name='chronic_medical'
                                value={medicalData.chronic_medical}
                                onChange={handleInputChange}
                                required
                            />
                        </Col> */}
                        <Col md={6} className='text-start mr-5' style={{ border: "1px solid #ccc", padding: "8px", borderRadius: "5px" }}>
                            <div
                                className="wrap-textarea"
                                style={{

                                    minHeight: '40px',
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word',
                                    overflowWrap: 'break-word',
                                    textAlign: "justify"
                                }}
                            >
                                {medicalData.chronic_medical}
                            </div>

                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <li className='icon-li'>
                                <h5>Acute Health Concerns: </h5>
                            </li>
                        </Form.Label>
                        <Col md={6} className='text-start mr-5' style={{ border: "1px solid #ccc", padding: "8px", borderRadius: "5px" }}>
                            <div
                                className="wrap-textarea"
                                style={{

                                    minHeight: '40px',
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word',
                                    overflowWrap: 'break-word',
                                    textAlign: "justify"
                                }}
                            >
                                {medicalData.acute_health}
                            </div>

                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <li className='icon-li'>
                                <h5>Medication (Duration and Outcomes): </h5>
                            </li>
                        </Form.Label>
                       <Col md={6} className='text-start mr-5' style={{ border: "1px solid #ccc", padding: "8px", borderRadius: "5px" }}>
                            <div
                                className="wrap-textarea"
                                style={{

                                    minHeight: '40px',
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word',
                                    overflowWrap: 'break-word',
                                    textAlign: "justify"
                                }}
                            >
                                {medicalData.medication}
                            </div>

                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <li className='icon-li'>
                                <h5>Medication Allergies: </h5>
                            </li>
                        </Form.Label>
                        <Col md={6} className='text-start mr-5' style={{ border: "1px solid #ccc", padding: "8px", borderRadius: "5px" }}>
                            <div
                                className="wrap-textarea"
                                style={{

                                    minHeight: '40px',
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word',
                                    overflowWrap: 'break-word',
                                    textAlign: "justify"
                                }}
                            >
                                {medicalData.medication_allergies}
                            </div>

                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <li className='icon-li'>
                                <h5>Other Allergies or Sensitivities: </h5>
                            </li>
                        </Form.Label>
                        <Col md={6} className='text-start mr-5' style={{ border: "1px solid #ccc", padding: "8px", borderRadius: "5px" }}>
                            <div
                                className="wrap-textarea"
                                style={{

                                    minHeight: '40px',
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word',
                                    overflowWrap: 'break-word',
                                    textAlign: "justify"
                                }}
                            >
                                {medicalData.other_allergy}
                            </div>

                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <li className='icon-li'>
                                <h5>Significant Medical Events: </h5>
                            </li>
                        </Form.Label>
                        <Col md={6} className='text-start mr-5' style={{ border: "1px solid #ccc", padding: "8px", borderRadius: "5px" }}>
                            <div
                                className="wrap-textarea"
                                style={{

                                    minHeight: '40px',
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word',
                                    overflowWrap: 'break-word',
                                    textAlign: "justify"
                                }}
                            >
                                {medicalData.significant_medical}
                            </div>

                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <li className='icon-li'>
                                <h5>Traumatic Injuries: </h5>
                            </li>
                        </Form.Label>
                        <Col md={6} className='text-start mr-5' style={{ border: "1px solid #ccc", padding: "8px", borderRadius: "5px" }}>
                            <div
                                className="wrap-textarea"
                                style={{

                                    minHeight: '40px',
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word',
                                    overflowWrap: 'break-word',
                                    textAlign: "justify"
                                }}
                            >
                                {medicalData.traumatic_injuries}
                            </div>

                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <li className='icon-li'>
                                <h5>Sexual Health: </h5>
                            </li>
                        </Form.Label>
                        <Col md={6} className='text-start mr-5' style={{ border: "1px solid #ccc", padding: "8px", borderRadius: "5px" }}>
                            <div
                                className="wrap-textarea"
                                style={{

                                    minHeight: '40px',
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word',
                                    overflowWrap: 'break-word',
                                    textAlign: "justify"
                                }}
                            >
                                {medicalData.sexual_health}
                            </div>

                        </Col>
                    </Form.Group>
                </Form>

            </div>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Medical History</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <li className='icon-li'>
                            <h6>Disability Status (Physical or Psychological):</h6>
                        </li>
                        <Form.Group>
                            <Form.Control as="textarea" rows={2}
                                name='disability_status'
                                value={medicalData.disability_status}
                                onChange={handleInputChange}
                                required />
                        </Form.Group>

                        <li className='icon-li'>
                            <h6>Chronic Medical Conditions:</h6>
                        </li>
                        <Form.Group>
                            <Form.Control as="textarea" rows={2}
                                name='chronic_medical'
                                value={medicalData.chronic_medical}
                                onChange={handleInputChange}
                                required />
                        </Form.Group>

                        <li className='icon-li'>
                            <h6>Acute Health Concerns:</h6>
                        </li>
                        <Form.Group>
                            <Form.Control as="textarea" rows={2}
                                name='acute_health'
                                value={medicalData.acute_health}
                                onChange={handleInputChange}
                                required />
                        </Form.Group>

                        <li className='icon-li'>
                            <h6>Medication (Duration and Outcomes):</h6>
                        </li>
                        <Form.Group>
                            <Form.Control as="textarea" rows={2}
                                name='medication'
                                value={medicalData.medication}
                                onChange={handleInputChange}
                                required />
                        </Form.Group>

                        <li className='icon-li'>
                            <h6>Medication Allergies:</h6>
                        </li>
                        <Form.Group>
                            <Form.Control as="textarea" rows={2}
                                name='medication_allergies'
                                value={medicalData.medication_allergies}
                                onChange={handleInputChange}
                                required />
                        </Form.Group>

                        <li className='icon-li'>
                            <h6>Other Allergies or Sensitivities: </h6>
                        </li>
                        <Form.Group as={Row} className="mb-3">
                            <div className="d-flex flex-wrap gap-3 mt-2">
                                {[
                                    ["Foods", "Foods"],
                                    ["Environmental Factors", "Environmental Factors"],
                                    ["Substances ", "Substances"],
                                    ["Nothing", "Nothing"]
                                ].map(([id, label]) => renderMedCheckbox("other_allergy", id, label))}
                            </div>
                        </Form.Group>

                        <li className='icon-li'>
                            <h6>Significant Medical Events: </h6>
                        </li>
                        <Form.Group as={Row} className="mb-3">
                            <div className="d-flex flex-wrap gap-3 mt-2">
                                {[
                                    ["Surgeries", "Surgeries"],
                                    ["Hospitalizations", "Hospitalizations"],
                                    ["Major Illnesses ", "Major Illnesses"],
                                    ["Factor", "Factor"]
                                ].map(([id, label]) => renderMedCheckbox("significant_medical", id, label))}
                            </div>
                        </Form.Group>

                        <li className='icon-li'>
                            <h6>Traumatic Injuries: </h6>
                        </li>
                        <Form.Group>
                            <Form.Control as="textarea" rows={2}
                                name='traumatic_injuries'
                                value={medicalData.traumatic_injuries}
                                onChange={handleInputChange}
                                required />
                        </Form.Group>

                        <li className='icon-li'>
                            <h6>Sexual Health: </h6>
                        </li>
                        <Form.Group as={Row} className="mb-3">
                            <div className="d-flex flex-wrap gap-3 mt-2">
                                {[
                                    ["Any concerns", "Any concerns"],
                                    ["Conditions", "Conditions"],
                                    ["Treatments ", "Treatments"],
                                    ["Impact", "Impact"]
                                ].map(([id, label]) => renderMedCheckbox("sexual_health", id, label))}
                            </div>
                        </Form.Group>
                        <div className="mt-3">
                            <Button variant="success" className="m-1" type="submit" onClick={(e) => handleMedicalUpdate(e, medicalData.id)}>Update</Button>
                            <Button variant="secondary" className="m-1" onClick={handleClose}>Close</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

        </>
    )
}

export default Medical_History
