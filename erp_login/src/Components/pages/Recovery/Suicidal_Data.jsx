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

function Suicidal_Data() {
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
            String(item.suicide_history).toLowerCase().includes(searchTerm) ||
            String(item.triggers_stressors).toLowerCase().includes(searchTerm) ||
            String(item.homicidal_ideation).toLowerCase().includes(searchTerm) ||
            String(item.target_method).toLowerCase().includes(searchTerm)
        );
    });

    const [suicidalData, setSuicidalData] = useState({
        admission_no: '',
        date: '',
        suicide_history: '',
        triggers_stressors: '',
        homicidal_ideation: '',
        target_method: '',
        immediate_threat: '',
        emergency_response: '',
        hospital_required: '',
    })

    const apiRoute = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
    });
    const getVisitDetails = async () => {
        try {
            const response = await apiRoute.get('/recovery/get_suicidalUse');
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
            const response = await apiRoute.get(`/recovery/get_suicidal/${id}`);
            const data = response.data;

            setSuicidalData((suicidalData) => ({
                ...suicidalData,
                admission_no: data.admission_no || 'NULL',
                date: data.date || 'NULL',
                suicide_history: data.suicide_history || 'NULL',
                triggers_stressors: data.triggers_stressors || 'NULL',
                homicidal_ideation: data.homicidal_ideation || 'NULL',
                target_method: data.target_method || 'NULL',
                immediate_threat: data.immediate_threat || 'NULL',
                emergency_response: data.emergency_response || "NULL",
                hospital_required: data.hospital_required || "NULL",
            }));

            setPreviewRequested(true); // trigger the effect after state updates
        } catch (error) {
            console.error("Error fetching form data:", error);
            alert("Suicidal Data is not found");
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
        setSuicidalData((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditform = async (id) => {
        try {
            const response = await apiRoute.get(`/recovery/get_suicidal/${id}`);
            const data = response.data;

            setSuicidalData((suicidalData) => ({
                ...suicidalData,
                id: data.id || '',
                admission_no: data.admission_no || 'NULL',
                date: data.date || 'NULL',
                suicide_history: data.suicide_history || 'NULL',
                triggers_stressors: data.triggers_stressors || 'NULL',
                homicidal_ideation: data.homicidal_ideation || 'NULL',
                target_method: data.target_method || 'NULL',
                immediate_threat: data.immediate_threat || 'NULL',
                emergency_response: data.emergency_response || "NULL",
                hospital_required: data.hospital_required || "NULL",
            }));

            setShow(true);

        } catch (error) {
            console.error("Error fetching form data:", error);
            alert("Suicidal Data ID is not found");
        }
    };

    const handleSuicidalUpdate = async (e, id) => {
        e.preventDefault();
        try {
            const res = await apiRoute.post(`/recovery/updateSuicidal/${id}`, suicidalData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            alert('Suicidal and Homicidal Ideation Form updated successfully!');
            setSuicidalData({
                suicide_history: '',
                triggers_stressors: '',
                homicidal_ideation: '',
                target_method: '',
                immediate_threat: '',
                emergency_response: '',
                hospital_required: '',
            })
            handleClose(true);
            getVisitDetails();
        } catch (err) {
            console.error(err);
            alert('Update failed.');
        }
    }
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
            const res = await apiRoute.delete(`/social_remover/suicidialUseToRecBin/${admission_no}`);
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
                        <h3 className="section_title text-center">Suicidal and Homicidal Ideation</h3>
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
                                <th>History of Suicide Attempts</th>
                                <th>Triggers and Stressors</th>
                                <th>History of Homicidal Ideation</th>
                                <th>Target and Method</th>
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
                                        <td>{item.suicide_history || "Null"}</td>
                                        <td>{item.triggers_stressors || "Null"}</td>
                                        <td>{item.homicidal_ideation || "Null"}</td>
                                        <td>{item.target_method || "Null"}</td>
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
                        <h4 className="text-center">SUICIDAL AND HOMICIDAL IDEATION </h4>
                    </Col>
                </Row>
                <Row className='d-flex align-items-center justify-content-center'>
                    <Col md={5}>
                        <Form.Group className="mb-3 d-flex align-items-center" as={Row}>
                            <Form.Label column sm="6" className='text-start'>Admission No. :</Form.Label>
                            <Col md={6}>
                                <div className='text-start'>
                                    {suicidalData.admission_no}
                                </div>
                            </Col>
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group className="mb-3 d-flex align-items-center" as={Row}>
                            <Form.Label column sm="6" className='text-start'>Date :</Form.Label>
                            <Col md={6}>
                                <div className='text-start'>
                                    {formatDateTime(suicidalData.date)}
                                </div>
                            </Col>
                        </Form.Group>
                    </Col>
                </Row>
                <Form className='mt-4'>
                    <Form.Group className="mb-3" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <li className='icon-li'>
                                <h5>History of Suicide Attempts: </h5>
                            </li>
                        </Form.Label>
                        {/* <Col md={6}>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                name='suicide_history'
                                value={suicidalData.suicide_history}
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
                                {suicidalData.suicide_history}
                            </div>

                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <li className='icon-li'>
                                <h5>Triggers and Stressors: </h5>
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
                                {suicidalData.triggers_stressors}
                            </div>

                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <li className='icon-li'>
                                <h5>History of Homicidal Ideation: </h5>
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
                                {suicidalData.homicidal_ideation}
                            </div>

                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <li className='icon-li'>
                                <h5>Target and Method: </h5>
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
                                {suicidalData.target_method}
                            </div>

                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <li className='icon-li'>
                                <h5>Immediate Threat: </h5>
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
                                {suicidalData.immediate_threat}
                            </div>

                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <li className='icon-li'>
                                <h5>Necessity of Emergency Response: </h5>
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
                                {suicidalData.emergency_response}
                            </div>

                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <li className='icon-li'>
                                <h5>Hospitalization Required: </h5>
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
                                {suicidalData.hospital_required}
                            </div>

                        </Col>
                    </Form.Group>
                </Form>
            </div>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Suicidal and Homicidal Ideation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <li className='icon-li'>
                            <h5>History of Suicide Attempts :</h5>
                        </li>
                        <Form.Group>
                            <Form.Control
                                type='text'
                                name='suicide_history'
                                value={suicidalData.suicide_history}
                                onChange={handleInputChange}
                                required />
                        </Form.Group>

                        <li className='icon-li'>
                            <h5>Triggers and Stressors:</h5>
                        </li>
                        <Form.Group>
                            <Form.Control
                                type='text'
                                name='triggers_stressors'
                                value={suicidalData.triggers_stressors}
                                onChange={handleInputChange}
                                required />
                        </Form.Group>

                        <li className='icon-li'>
                            <h5>History of Homicidal Ideation:</h5>
                        </li>
                        <Form.Group>
                            <Form.Control
                                type='text'
                                name='homicidal_ideation'
                                value={suicidalData.homicidal_ideation}
                                onChange={handleInputChange}
                                required />
                        </Form.Group>

                        <li className='icon-li'>
                            <h5>Target and Method:</h5>
                        </li>
                        <Form.Group>
                            <Form.Control
                                type='text'
                                name='target_method'
                                value={suicidalData.target_method}
                                onChange={handleInputChange}
                                required />
                        </Form.Group>

                        <li className='icon-li'>
                            <h5>Immediate Threat:</h5>
                            <p className='text-muted small' style={{ marginTop: "5px" }}>(assessed by history taker)</p>
                        </li>
                        <Form.Group>
                            <Form.Control
                                type='text'
                                name='immediate_threat'
                                value={suicidalData.immediate_threat}
                                onChange={handleInputChange}
                                required />
                        </Form.Group>

                        <li className='icon-li'>
                            <h5>Necessity of Emergency Response:</h5>
                        </li>
                        <Form.Group>
                            <Form.Check
                                type='radio'
                                label='Yes'
                                name='emergency_response'
                                value='Yes'
                                checked={suicidalData.emergency_response === 'Yes'}
                                onChange={handleInputChange}
                                required
                            />
                            <Form.Check
                                type='radio'
                                label='No'
                                name='emergency_response'
                                value='No'
                                checked={suicidalData.emergency_response === 'No'}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>

                        <li className='icon-li'>
                            <h5>Hospitalization Required:</h5>
                        </li>
                        <Form.Group>
                            <Form.Check
                                type='radio'
                                label='Yes'
                                name='hospital_required'
                                value='Yes'
                                checked={suicidalData.hospital_required === 'Yes'}
                                onChange={handleInputChange}
                                required
                            />
                            <Form.Check
                                type='radio'
                                label='No'
                                name='hospital_required'
                                value='No'
                                checked={suicidalData.hospital_required === 'No'}
                                onChange={handleInputChange}
                                required
                            />
                        </Form.Group>
                        <div className="mt-3">
                            <Button variant="success" className="m-1" type="submit" onClick={(e) => handleSuicidalUpdate(e, suicidalData.id)}>Update</Button>
                            <Button variant="secondary" className="m-1" onClick={handleClose}>Close</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default Suicidal_Data
