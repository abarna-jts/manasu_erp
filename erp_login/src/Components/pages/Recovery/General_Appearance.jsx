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

function General_Appearance() {
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
            String(item.general_appearance).toLowerCase().includes(searchTerm) ||
            String(item.comprehension).toLowerCase().includes(searchTerm) ||
            String(item.gait_posture).toLowerCase().includes(searchTerm) ||
            String(item.motor_activity).toLowerCase().includes(searchTerm)
        );
    });

    const [formData, setFormData] = useState({
        id: '',
        admission_no: '',
        date: '',
        general_appearance: [],
        attitude: [],
        comprehension: [],
        gait_posture: [],
        motor_activity: [],
        catatonic_sign: [],
        conversion_dissociative: [],
        social_manner: [],
        rapport: [],
        hallucinatory_behaviour: []
    });

    const apiRoute = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
    });
    const getVisitDetails = async () => {
        try {
            const response = await apiRoute.get('/recovery/get_genAppearance');
            console.log(response.data);
            setVisitDetails(response.data.data); // Should be an array
        } catch (error) {
            console.error("Error fetching General Appearance Details:", error);
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
            const response = await apiRoute.get(`/recovery/getappearance/${id}`);
            const data = response.data;

            setFormData((formData) => ({
                ...formData,
                admission_no: data.admission_no || 'NULL',
                date: data.date || 'NULL',
                general_appearance: data.general_appearance?.split(',') || ["NULL"],
                attitude: data.attitude?.split(',') || ["NULL"],
                comprehension: data.comprehension?.split(',') || ["NULL"],
                gait_posture: data.gait_posture?.split(',') || ["NULL"],
                motor_activity: data.motor_activity?.split(',') || ["NULL"],
                catatonic_sign: data.catatonic_sign?.split(',') || ["NULL"],
                conversion_dissociative: data.conversion_dissociative?.split(',') || ["NULL"],
                social_manner: data.social_manner?.split(',') || ["NULL"],
                rapport: data.rapport?.split(',') || ["NULL"],
                hallucinatory_behaviour: data.hallucinatory_behaviour?.split(',') || ["NULL"],
            }));

            setPreviewRequested(true); // trigger the effect after state updates
        } catch (error) {
            console.error("Error fetching form data:", error);
            alert("General Appearance ID is not found");
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

        await new Promise((resolve) => setTimeout(resolve, 100)); // Wait for DOM to update

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

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;

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
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const renderCheckbox = (field, id, label) => (
        <Form.Check
            type="checkbox"
            id={id}
            label={label}
            checked={formData[field]?.includes(label)}
            onChange={(e) => {
                const updated = e.target.checked
                    ? [...formData[field], label]
                    : formData[field].filter(item => item !== label);

                setFormData(prev => ({
                    ...prev,
                    [field]: updated
                }));
            }}
        />
    );

    const handleEditform = async (id) => {
        try {
            const response = await apiRoute.get(`/recovery/getappearance/${id}`);
            const data = response.data;

            setFormData(formData => ({
                ...formData,
                id: data.id || '',
                admission_no: String(data.admission_no || ''),
                date: data.date || '',
                general_appearance: data.general_appearance?.split(',').map(i => i.trim()) || [],
                attitude: data.attitude?.split(',').map(i => i.trim()) || [],
                comprehension: data.comprehension?.split(',').map(i => i.trim()) || [],
                gait_posture: data.gait_posture?.split(',').map(i => i.trim()) || [],
                motor_activity: data.motor_activity?.split(',').map(i => i.trim()) || [],
                catatonic_sign: data.catatonic_sign?.split(',').map(i => i.trim()) || [],
                conversion_dissociative: data.conversion_dissociative?.split(',').map(i => i.trim()) || [],
                social_manner: data.social_manner?.split(',').map(i => i.trim()) || [],
                rapport: data.rapport?.split(',').map(i => i.trim()) || [],
                hallucinatory_behaviour: data.hallucinatory_behaviour?.split(',').map(i => i.trim()) || [],
            }));

            setShow(true);

        } catch (error) {
            console.error("Error fetching form data:", error);
            alert("Basic Detail is not found");
        }
    };

    const handleUpdate = async (e, id) => {
        e.preventDefault();

        try {
            const res = await apiRoute.post(`/recovery/updateAppearance/${id}`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            alert('General Appearance Form updated successfully!');
            setFormData({
                general_appearance: [],
                attitude: [],
                comprehension: [],
                gait_posture: [],
                motor_activity: [],
                catatonic_sign: [],
                conversion_dissociative: [],
                social_manner: [],
                rapport: [],
                hallucinatory_behaviour: []
            })
            handleClose(true);
            getVisitDetails();
        } catch (err) {
            console.error(err);
            alert('Update failed.');
        }
    };

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
            const res = await apiRoute.delete(`/social_remover/GeneralAppyToRecBin/${admission_no}`);
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
                        <h3 className="section_title text-center">General Appearance and Behaviour</h3>
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
                                <th>General Appearance</th>
                                <th>Comprehension</th>
                                <th>Gait and posture</th>
                                <th>Motor activity</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.length > 0 ? (
                                currentItems.map((item, index) => (
                                    <tr key={item.id}>
                                        <td>{indexOfFirstItem + index + 1}</td>
                                        <td>{item.admission_no || "Null"}</td>
                                        <td style={{ width: "8%" }}>{formatDateTime(item.date) || "Null"}</td>
                                        <td>{item.general_appearance || "Null"}</td>
                                        <td>{item.comprehension || "Null"}</td>
                                        <td>{item.gait_posture || "Null"}</td>
                                        <td>{item.motor_activity || "Null"}</td>
                                        <td>
                                            <Row className='d-flex align-items-center justify-content-center'>
                                                <Col md={5}>
                                                    <button className="btn btn-success icon_details"
                                                        onClick={() => {
                                                            fetchFormData(item.id);
                                                        }}
                                                    >
                                                        <i className="fas fa-eye"></i>
                                                    </button>
                                                </Col>

                                                <Col md={5}>
                                                    {userType === "4" && (
                                                        <button className="btn btn-primary icon_details"
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
                                                </Col>
                                            </Row>


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
                        <h4 className="text-center">GENERAL APPEARANCE AND BEHAVIOUR</h4>
                    </Col>
                </Row>
                <Row className='d-flex align-items-center justify-content-center'>
                    <Col md={5}>
                        <Form.Group className="mb-3 d-flex align-items-center" as={Row}>
                            <Form.Label column sm="6" className='text-start'>Admission No. :</Form.Label>
                            <Col md={6}>
                                <div className='text-start'>
                                    {formData.admission_no}
                                </div>
                            </Col>
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group className="mb-3 d-flex align-items-center" as={Row}>
                            <Form.Label column sm="6" className='text-start'>Date :</Form.Label>
                            <Col md={6}>
                                <div className='text-start'>
                                    {formatDateTime(formData.date)}
                                </div>
                            </Col>
                        </Form.Group>
                    </Col>
                </Row>
                <Form className='mt-4'>
                    <Form.Group className="mb-3" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <li className='icon-li'>
                                <h5>General Appearance: </h5>
                            </li>
                        </Form.Label>
                        <Col md={6}>
                            <div
                                className="wrap-textarea"
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '8px',
                                    borderRadius: "5px",
                                    minHeight: '40px',
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word',
                                    overflowWrap: 'break-word',
                                    textAlign: "justify"
                                }}
                            >
                                {formData.general_appearance.join(', ')}
                            </div>

                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <li className='icon-li'>
                                <h5>Attitude towards the examiner : </h5>
                            </li>
                        </Form.Label>
                        <Col md={6}>
                            <div
                                className="wrap-textarea"
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '8px',
                                    borderRadius: "5px",
                                    minHeight: '38px',
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word',
                                    overflowWrap: 'break-word',
                                    textAlign: "justify"
                                }}
                            >
                                {formData.attitude.join(', ')}
                            </div>

                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <li className='icon-li'>
                                <h5>Comprehension : </h5>
                            </li>
                        </Form.Label>
                        <Col md={6}>
                            <div
                                className="wrap-textarea"
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '8px',
                                    borderRadius: "5px",
                                    minHeight: '38px',
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word',
                                    overflowWrap: 'break-word',
                                    textAlign: "justify"
                                }}
                            >
                                {formData.comprehension.join(', ')}
                            </div>

                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <li className='icon-li'>
                                <h5>Gait and posture : </h5>
                            </li>
                        </Form.Label>
                        <Col md={6}>
                            <div
                                className="wrap-textarea"
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '8px',
                                    borderRadius: "5px",
                                    minHeight: '38px',
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word',
                                    overflowWrap: 'break-word',
                                    textAlign: "justify"
                                }}
                            >
                                {formData.gait_posture.join(', ')}
                            </div>

                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <li className='icon-li'>
                                <h5>Motor activity : </h5>
                            </li>
                        </Form.Label>
                        <Col md={6}>
                            <div
                                className="wrap-textarea"
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '8px',
                                    borderRadius: "5px",
                                    minHeight: '38px',
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word',
                                    overflowWrap: 'break-word',
                                    textAlign: "justify"
                                }}
                            >
                                {formData.motor_activity.join(', ')}
                            </div>

                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <li className='icon-li'>
                                <h5>Catatonic signs : </h5>
                            </li>
                        </Form.Label>
                        <Col md={6}>
                            <div
                                className="wrap-textarea"
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '8px',
                                    borderRadius: "5px",
                                    minHeight: '38px',
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word',
                                    overflowWrap: 'break-word',
                                    textAlign: "justify"
                                }}
                            >
                                {formData.catatonic_sign.join(', ')}
                            </div>
                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <li className='icon-li'>
                                <h5>Conversion and dissociative signs : </h5>
                            </li>
                        </Form.Label>
                        <Col md={6}>
                            <div
                                className="wrap-textarea"
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '8px',
                                    borderRadius: "5px",
                                    minHeight: '38px',
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word',
                                    overflowWrap: 'break-word',
                                    textAlign: "justify"
                                }}
                            >
                                {formData.conversion_dissociative.join(', ')}
                            </div>
                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <li className='icon-li'>
                                <h5>Social manner : </h5>
                            </li>
                        </Form.Label>
                        <Col md={6}>
                            <div
                                className="wrap-textarea"
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '8px',
                                    borderRadius: "5px",
                                    minHeight: '38px',
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word',
                                    overflowWrap: 'break-word',
                                    textAlign: "justify"
                                }}
                            >
                                {formData.social_manner.join(', ')}
                            </div>
                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <li className='icon-li'>
                                <h5>Rapport : </h5>
                            </li>
                        </Form.Label>
                        <Col md={6}>
                            <div
                                className="wrap-textarea"
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '8px',
                                    borderRadius: "5px",
                                    minHeight: '38px',
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word',
                                    overflowWrap: 'break-word',
                                    textAlign: "justify"
                                }}
                            >
                                {formData.rapport.join(', ')}
                            </div>
                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <li className='icon-li'>
                                <h5>Hallucinatory behaviour : </h5>
                            </li>
                        </Form.Label>
                        <Col md={6}>
                            <div
                                className="wrap-textarea"
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '8px',
                                    borderRadius: "5px",
                                    minHeight: '38px',
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word',
                                    overflowWrap: 'break-word',
                                    textAlign: "justify"
                                }}
                            >
                                {formData.hallucinatory_behaviour.join(', ')}
                            </div>
                        </Col>
                    </Form.Group>
                </Form>
            </div>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit General Appearance and Behaviour </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Col md={12}>
                        <Form>
                            {/* General Appearance */}
                            <Form.Group controlId="general_appearance" className="icon-li" required>
                                <h4>General Appearance:</h4>
                                <div className="d-flex flex-wrap gap-3 mt-2">
                                    {[
                                        ["Approximate height", "Approximate height"],
                                        ["Approximate weight", "Approximate weight"],
                                        ["Looks comfortable", "Looks comfortable"],
                                        ["Looks uncomfortable", "Looks uncomfortable"],
                                        ["Physical health", "Physical health"],
                                        ["Grooming", "Grooming"],
                                        ["Hygiene", "Hygiene"],
                                        ["Self-Care", "Self-Care"],
                                        ["Proper Dressing", "Proper Dressing"],
                                        ["Dressing Neatly", "Dressing Neatly"],
                                        ["Facial Expression", "Facial Expression"],
                                    ].map(([id, label]) => renderCheckbox("general_appearance", id, label))}
                                </div>
                            </Form.Group>

                            {/* Attitude */}
                            <Form.Group controlId="attitude" className="icon-li" required>
                                <h4>Attitude towards the examiner:</h4>
                                <div className="d-flex flex-wrap gap-3 mt-2">
                                    {[
                                        ["cooperation", "Cooperation"],
                                        ["guardedness", "Guardedness"],
                                        ["evasiveness", "Evasiveness"],
                                        ["hostility", "Hostility"],
                                        ["attentiveness", "Attentiveness"],
                                        ["Shows Interest", "Shows Interest"],
                                        ["Lacks Interest", "Lacks Interest"],
                                    ].map(([id, label]) => renderCheckbox("attitude", id, label))}
                                </div>
                            </Form.Group>

                            {/* Comprehension */}
                            <Form.Group controlId="comprehension" className="icon-li" required>
                                <h4>Comprehension:</h4>
                                <div className="d-flex flex-wrap gap-3 mt-2">
                                    {[
                                        ["intact", "Intact"],
                                        ["partially-impaired", "Partially Impaired"],
                                        ["fully-impaired", "Fully Impaired"],
                                    ].map(([id, label]) => renderCheckbox("comprehension", id, label))}
                                </div>
                            </Form.Group>

                            {/* Gait and Posture */}
                            <Form.Group controlId="gait_posture" className="icon-li" required>
                                <h4>Gait and posture:</h4>
                                <div className="d-flex flex-wrap gap-3 mt-2">
                                    {[
                                        ["sitting-normal", "Normal Sitting"],
                                        ["sitting-abnormal", "Abnormal Sitting"],
                                        ["standing-normal", "Normal Standing"],
                                        ["standing-abnormal", "Abnormal Standing"],
                                        ["walking-normal", "Normal Walking Pattern"],
                                        ["walking-abnormal", "Abnormal Walking Pattern"],
                                        ["lying-normal", "Normal Lying Position"],
                                        ["lying-abnormal", "Abnormal Lying Position"],
                                    ].map(([id, label]) => renderCheckbox("gait_posture", id, label))}
                                </div>
                            </Form.Group>

                            {/* Motor Activity */}
                            <Form.Group controlId="motor_activity" className="icon-li" required>
                                <h4>Motor activity:</h4>
                                <div className="d-flex flex-wrap gap-3 mt-2">
                                    {[
                                        ["increased", "Increased"],
                                        ["decreased", "Decreased"],
                                        ["excitement", "Excitement"],
                                        ["stupor", "Stupor"],
                                        ["AIMS", "Abnormal involuntary movements (AIMS) tics"],
                                        ["tremors", "Tremors"],
                                        ["restlessness", "Restlessness"],
                                        ["akathisia", "Skathisia"],
                                        ["social withdrawal", "Social Withdrawal"],
                                        ["autism", "Autism"],
                                    ].map(([id, label]) => renderCheckbox("motor_activity", id, label))}
                                </div>
                            </Form.Group>

                            {/* Catatonic Signs */}
                            <Form.Group controlId="catatonic_sign" className="icon-li" required>
                                <h4>Catatonic signs:</h4>
                                <div className="d-flex flex-wrap gap-3 mt-2">
                                    {[
                                        ["mannerisms", "Mannerisms"],
                                        ["stereotypes", "Stereotypes"],
                                        ["posturing", "Posturing"],
                                        ["waxy flexibility", "Waxy Flexibility"],
                                        ["negativism", "Negativism"],
                                        ["ambitendency", "Ambitendency"],
                                        ["automatic obedience", "Automatic Obedience"],
                                        ["Echo- Praxia", "Echo- Praxia"],
                                        ["psychological-pillow", "Psychological-Pillow"],
                                    ].map(([id, label]) => renderCheckbox("catatonic_sign", id, label))}
                                </div>
                            </Form.Group>

                            {/* Conversion and Dissociative Signs */}
                            <Form.Group controlId="conversion_dissociative" className="icon-li" required>
                                <h4>Conversion and dissociative signs:</h4>
                                <div className="d-flex flex-wrap gap-3 mt-2">
                                    {[
                                        ["pseudo seizures", "Pseudo Seizures"],
                                        ["possession states", "possession States"],
                                    ].map(([id, label]) => renderCheckbox("conversion_dissociative", id, label))}
                                </div>
                            </Form.Group>

                            {/* Social Manner */}
                            <Form.Group controlId="social_manner" className="icon-li" required>
                                <h4>Social manner:</h4>
                                <div className="d-flex flex-wrap gap-3 mt-2">
                                    {[
                                        ["social-increased", "Increased"],
                                        ["social-decreased", "Decreased"],
                                        ["inappropriate", "Inappropriate"],
                                    ].map(([id, label]) => renderCheckbox("social_manner", id, label))}
                                </div>
                            </Form.Group>

                            {/* Rapport */}
                            <Form.Group controlId="rapport" className="icon-li" required>
                                <h4>Rapport:</h4>
                                <div className="d-flex flex-wrap gap-3 mt-2">
                                    {[
                                        [
                                            "relationship_patient",
                                            "Whether a working empathic relationship can be established with the patient, should mentioned.",
                                        ],
                                    ].map(([id, label]) => renderCheckbox("rapport", id, label))}
                                </div>
                            </Form.Group>

                            {/* Hallucinatory Behaviour */}
                            <Form.Group controlId="hallucinatory_behaviour" className="icon-li" required>
                                <h4>Hallucinatory behaviour:</h4>
                                <div className="d-flex flex-wrap gap-3 mt-2">
                                    {[
                                        ["Smiling without reason", "Smiling without reason"],
                                        ["Crying without reason", "Crying without reason"],
                                        ["Muttering to self", "Muttering to self"],
                                        ["Talking to self audibly", "Talking to self audibly"],
                                        ["Engages in non-social speech", "Engages in non-social speech"],
                                        ["Odd gesturing in response to auditory", "Odd gesturing in response to auditory"],
                                        ["visual hallucinations", "Visual Hallucinations"],
                                    ].map(([id, label]) => renderCheckbox("hallucinatory_behaviour", id, label))}
                                </div>
                            </Form.Group>

                            <div className="mt-3">
                                <Button variant="success" className="m-1" type="submit" onClick={(e) => handleUpdate(e, formData.id)}>Update</Button>
                                <Button variant="secondary" className="m-1" onClick={handleClose}>Close</Button>
                            </div>
                        </Form>
                    </Col>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default General_Appearance
