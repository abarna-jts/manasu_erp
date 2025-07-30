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

function Judgement() {
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
            String(item.personal_judgement).toLowerCase().includes(searchTerm) ||
            String(item.social_judgement).toLowerCase().includes(searchTerm) ||
            String(item.test_judgement).toLowerCase().includes(searchTerm) ||
            String(item.judgement).toLowerCase().includes(searchTerm)
        );
    });

    const [judgementData, setJudgementFormData] = useState({
        personal_judgement: '',
        social_judgement: '',
        test_judgement: '',
        judgement: '',
        admission_no: '',
        date: '',
    })

    const apiRoute = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
    });
    const getVisitDetails = async () => {
        try {
            const response = await apiRoute.get('/recovery/get_judgement');
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
            const response = await apiRoute.get(`/recovery/getJudgement/${id}`);
            const data = response.data;

            setJudgementFormData((judgementData) => ({
                ...judgementData,
                admission_no: data.admission_no || 'NULL',
                date: data.date || 'NULL',
                personal_judgement: data.personal_judgement || 'NULL',
                social_judgement: data.social_judgement || 'NULL',
                test_judgement: data.test_judgement || 'NULL',
                judgement: data.judgement || 'NULL',

            }));

            setPreviewRequested(true); // trigger the effect after state updates
        } catch (error) {
            console.error("Error fetching form data:", error);
            alert("Judgement ID is not found");
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
            const response = await apiRoute.get(`/recovery/getJudgement/${id}`);
            const data = response.data;

            setJudgementFormData(judgementData => ({
                ...judgementData,
                admission_no: data.admission_no || '',
                id: data.id || '',
                date: data.date || '',
                personal_judgement: data.personal_judgement || '',
                social_judgement: data.social_judgement || '',
                test_judgement: data.test_judgement || '',
                judgement: data.judgement || '',
            }));
            setShow(true);
        } catch (error) {
            console.error("Error fetching form data:", error);
            alert("Judgement ID is not found");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setJudgementFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setJudgementFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleJudgementUpdate = async (e, id) => {
        e.preventDefault();

        try {
            const res = await apiRoute.post(`/recovery/updateJudgement/${id}`, judgementData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            alert('Judgement Form updated successfully!');
            setJudgementFormData({
                personal_judgement: '',
                social_judgement: '',
                test_judgement: '',
                judgement: ''
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
                        <h3 className="section_title text-center">JUDGEMENT </h3>
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
                                <th>Personal judgement</th>
                                <th>Social judgement</th>
                                <th>Test judgement</th>
                                <th>Judgement</th>
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
                                        <td>{item.personal_judgement || "Null"}</td>
                                        <td>{item.social_judgement || "Null"}</td>
                                        <td>{item.test_judgement || "Null"}</td>
                                        <td>{item.judgement || "Null"}</td>
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
                        <h4 className="text-center">JUDGEMENT</h4>
                    </Col>
                </Row>
                <Row className='d-flex align-items-center justify-content-center'>
                    <Col md={5}>
                        <Form.Group className="mb-3 d-flex align-items-center" as={Row}>
                            <Form.Label column sm="6" className='text-start'>Admission No. :</Form.Label>
                            <Col md={6}>
                                <div className='text-start'>
                                    {judgementData.admission_no}
                                </div>
                            </Col>
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group className="mb-3 d-flex align-items-center" as={Row}>
                            <Form.Label column sm="6" className='text-start'>Date :</Form.Label>
                            <Col md={6}>
                                <div className='text-start'>
                                    {formatDateTime(judgementData.date)}
                                </div>
                            </Col>
                        </Form.Group>
                    </Col>
                </Row>
                <Form className='mt-4'>
                    <Form.Group className="mb-3 d-flex align-items-center" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <li className='icon-li'>
                                <h5>Personal Judgement: </h5>
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
                                {judgementData.personal_judgement}
                            </div>

                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3 d-flex align-items-center" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <li className='icon-li'>
                                <h5>Social Judgement: </h5>
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
                                {judgementData.social_judgement}
                            </div>

                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3 d-flex align-items-center" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <li className='icon-li'>
                                <h5>Test Judgement: </h5>
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
                                {judgementData.test_judgement}
                            </div>

                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3 d-flex align-items-center" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <li className='icon-li'>
                                <h5>Judgement: </h5>
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
                                {judgementData.judgement}
                            </div>

                        </Col>
                    </Form.Group>
                </Form>
            </div>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Judgement Form </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Col md={12}>
                        <Form>
                            <li className="icon-li">
                                <h4 style={{ display: "inline" }}>Personal judgement:</h4>
                                <Form.Group className="mb-3">
                                    <Form.Control as="textarea" rows={2}
                                        name='personal_judgement'
                                        value={judgementData.personal_judgement}
                                        onChange={handleInputChange} />
                                </Form.Group>
                            </li>

                            <li className="icon-li">
                                <h4 style={{ display: "inline" }}>Social judgement:</h4>
                                <Form.Group className="mb-3">
                                    <Form.Control as="textarea" rows={2}
                                        name='social_judgement'
                                        value={judgementData.social_judgement}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </li>

                            <li className="icon-li">
                                <h4 style={{ display: "inline" }}>Test judgement:</h4>
                                <Form.Group className="mb-3">
                                    <Form.Label>Please explain what actions you would take in the following situations: a house on fire, a man lying on the road, and a sealed, stamped envelope on the street.</Form.Label>
                                    <Form.Control as="textarea" rows={2}
                                        name='test_judgement'
                                        value={judgementData.test_judgement}
                                        onChange={handleInputChange} />
                                </Form.Group>
                            </li>

                            <li className="icon-li">
                                <h4 style={{ display: "inline" }}>Judgement:</h4>
                                <Form.Group>
                                    <div>
                                        {["Good", "Intact", "Normal", "Poor", "Impaired", "Abnormal"].map((value) => (
                                            <Form.Check
                                                key={value}
                                                type="radio"
                                                id={`judgement-${value.toLowerCase()}`}
                                                label={value}
                                                name="judgement"
                                                value={value}
                                                checked={judgementData.judgement === value}
                                                onChange={handleChange}
                                            />
                                        ))}
                                    </div>
                                </Form.Group>



                            </li>

                            <div className="mt-3">
                                <Button variant="success" className="m-1" type="submit" onClick={(e) => handleJudgementUpdate(e, judgementData.id)}>Update</Button>
                                <Button variant="secondary" className="m-1" onClick={handleClose}>Close</Button>
                            </div>

                        </Form>
                    </Col>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default Judgement
