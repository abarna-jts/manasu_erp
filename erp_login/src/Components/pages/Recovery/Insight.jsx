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

function Insight() {
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
            String(item.denail_illness).toLowerCase().includes(searchTerm) ||
            String(item.slight_awareness).toLowerCase().includes(searchTerm) ||
            String(item.intellectual_insight).toLowerCase().includes(searchTerm) ||
            String(item.true_emotion).toLowerCase().includes(searchTerm)
        );
    });

    const [insightData, setInsightData] = useState({
        denail_illness: '',
        slight_awareness: '',
        awarness_sick: '',
        awarness_illness: '',
        intellectual_insight: '',
        true_emotion: '',
        admission_no: '',
        date: '',
    })

    const apiRoute = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
    });
    const getVisitDetails = async () => {
        try {
            const response = await apiRoute.get('/recovery/get_insight');
            console.log(response.data);
            setVisitDetails(response.data.data); // Should be an array
        } catch (error) {
            console.error("Error fetching Speech Details:", error);
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
            const response = await apiRoute.get(`/recovery/getInsight/${id}`);
            const data = response.data;

            setInsightData((insightData) => ({
                ...insightData,
                admission_no: data.admission_no || 'NULL',
                date: data.date || 'NULL',
                denail_illness: data.denail_illness || 'NULL',
                slight_awareness: data.slight_awareness || 'NULL',
                awarness_sick: data.awarness_sick || 'NULL',
                awarness_illness: data.awarness_illness || 'NULL',
                intellectual_insight: data.intellectual_insight || 'NULL',
                true_emotion: data.true_emotion || 'NULL',
            }));

            setPreviewRequested(true); // trigger the effect after state updates
        } catch (error) {
            console.error("Error fetching form data:", error);
            alert("Insight ID is not found");
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

    const handleEditform = async (id) => {
        try {
            const response = await apiRoute.get(`/recovery/getInsight/${id}`);
            const data = response.data;

            setInsightData(insightData => ({
                ...insightData,
                admission_no: data.admission_no || '',
                id: data.id || '',
                date: data.date || '',
                denail_illness: data.denail_illness || '',
                slight_awareness: data.slight_awareness || '',
                awarness_sick: data.awarness_sick || '',
                awarness_illness: data.awarness_illness || '',
                intellectual_insight: data.intellectual_insight || '',
                true_emotion: data.true_emotion || ''
            }));

            setShow(true);

        } catch (error) {
            console.error("Error fetching form data:", error);
            alert("Insight ID is not found");
        }
    };

    const handleInsightUpdate = async (e, id) => {
        e.preventDefault();

        try {
            const res = await apiRoute.post(`/recovery/updateInsight/${id}`, insightData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            alert('Insight Form updated successfully!');
            setInsightData({
                denail_illness: '',
                slight_awareness: '',
                awarness_sick: '',
                awarness_illness: '',
                intellectual_insight: '',
                true_emotion: ''
            })
            handleClose(true);
            getVisitDetails();
        } catch (err) {
            console.error(err);
            alert('Update failed.');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInsightData((prev) => ({ ...prev, [name]: value }));
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = searchFilteredRescueDetails.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(searchFilteredRescueDetails.length / itemsPerPage);
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    return (
        <>
            <Container fluid>
                <Row className='d-flex align-items-center justify-content-between'>
                    <Col md={2} className='text-start'>
                        <Breadcrumb className="d-none d-md-inline-block mb-0" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
                            <Breadcrumb.Item></Breadcrumb.Item>
                            <Breadcrumb.Item>Home</Breadcrumb.Item>
                            <Breadcrumb.Item active>MSE Form</Breadcrumb.Item>
                        </Breadcrumb>
                        <h6 className="breadcrumb_title">Mental Status Examination</h6>
                    </Col>
                    <Col md={8} className="text-start mb-4">
                        <h3 className="section_title text-center">INSIGHT </h3>
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
                                <th>Complete denial of illness</th>
                                <th>Slight Awarness</th>
                                <th>Intellectual insight</th>
                                <th>True emotional insight</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.length > 0 ? (
                                currentItems.map((item, index) => (
                                    <tr key={item.id}>
                                        <td>{index + 1}</td>
                                        <td>{item.admission_no || "Null"}</td>
                                        <td>{formatDateTime(item.date) || "Null"}</td>
                                        <td>{item.denail_illness || "Null"}</td>
                                        <td>{item.slight_awareness || "Null"}</td>
                                        <td>{item.intellectual_insight || "Null"}</td>
                                        <td>{item.true_emotion || "Null"}</td>
                                        <td>
                                            <button className="btn btn-success icon_details"
                                                onClick={() => {
                                                    fetchFormData(item.id);
                                                }}
                                            >
                                                <i className="fas fa-eye"></i>
                                            </button>
                                            {userType === "4" && (
                                                <button className="btn btn-primary icon_details"
                                                    onClick={() => {
                                                        handleEditform(item.id);
                                                    }}
                                                ><i className="fas fa-edit"></i> </button>
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
                        <h4 className="text-center">INSIGHT</h4>
                    </Col>
                </Row>
                <Row className='d-flex align-items-center justify-content-center'>
                    <Col md={5}>
                        <Form.Group className="mb-3 d-flex align-items-center" as={Row}>
                            <Form.Label column sm="6" className='text-start'>Admission No. :</Form.Label>
                            <Col md={6}>
                                <div className='text-start'>
                                    {insightData.admission_no}
                                </div>
                            </Col>
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group className="mb-3 d-flex align-items-center" as={Row}>
                            <Form.Label column sm="6" className='text-start'>Date :</Form.Label>
                            <Col md={6}>
                                <div className='text-start'>
                                    {formatDateTime(insightData.date)}
                                </div>
                            </Col>
                        </Form.Group>
                    </Col>
                </Row>
                <Form className='mt-4'>
                    <li className='icon-li'>
                        <h5 className='text-start'>LEVELS OF INSIGHT: </h5>
                    </li>
                    <Form.Group className="mb-3 d-flex align-items-center" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <h5>1. Complete denial of illness </h5>
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
                                {insightData.denail_illness}
                            </div>

                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3 d-flex align-items-center" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <h5>2. Slight awareness of being sick & needing help but denying it at the same time </h5>
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
                                {insightData.slight_awareness}
                            </div>

                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3 d-flex align-items-center" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <h5>3. Awareness of being sick but blaming it on others, on external factors, or on organic factors : </h5>
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
                                {insightData.awarness_sick}
                            </div>

                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3 d-flex align-items-center" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <h5>4. Awareness that illness is due to something unknown in the patient : </h5>
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
                                {insightData.awarness_illness}
                            </div>

                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3 d-flex align-items-center" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <h5>5. Intellectual insight : </h5>
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
                                {insightData.intellectual_insight}
                            </div>

                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3 d-flex align-items-center" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <h5>6. True emotional insight : </h5>
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
                                {insightData.true_emotion}
                            </div>

                        </Col>
                    </Form.Group>
                </Form>
            </div>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Insight Form </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Col md={12}>
                        <Form>
                            <li className="icon-li">
                                <h4 style={{ display: "inline" }}>LEVELS OF INSIGHT:</h4>
                                <p>Insight is assessed using a six-point scale ranging from one to six.</p>
                                <Form.Group className="mb-3">
                                    <Form.Label>1. Complete denial of illness</Form.Label>
                                    <Form.Control as="textarea" rows={2}
                                        name='denail_illness'
                                        value={insightData.denail_illness}
                                        onChange={handleInputChange} />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>2. Slight awareness of being sick & needing help but denying it at the same time</Form.Label>
                                    <Form.Control as="textarea" rows={2}
                                        name='slight_awareness'
                                        value={insightData.slight_awareness}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>3. Awareness of being sick but blaming it on others, on external factors, or on organic factors.</Form.Label>
                                    <Form.Control as="textarea" rows={2}
                                        name='awarness_sick'
                                        value={insightData.awarness_sick}
                                        onChange={handleInputChange} />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>4. Awareness that illness is due to something unknown in the patient</Form.Label>
                                    <Form.Control as="textarea" rows={2}
                                        name='awarness_illness'
                                        value={insightData.awarness_illness}
                                        onChange={handleInputChange} />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>5. Intellectual insight</Form.Label>
                                    <Form.Control as="textarea" rows={2}
                                        name='intellectual_insight'
                                        value={insightData.intellectual_insight}
                                        onChange={handleInputChange} />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>6. True emotional insight</Form.Label>
                                    <Form.Control as="textarea" rows={2}
                                        name='true_emotion'
                                        value={insightData.true_emotion}
                                        onChange={handleInputChange} />
                                </Form.Group>
                            </li>



                            <div className="mt-3">
                                <Button variant="success" className="m-1" type="submit" onClick={(e) => handleInsightUpdate(e, insightData.id)}>Update</Button>
                                <Button variant="secondary" className="m-1" onClick={handleClose}>Close</Button>
                            </div>

                        </Form>
                    </Col>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default Insight
