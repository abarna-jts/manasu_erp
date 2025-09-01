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

function Psy_history() {
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
            String(item.psychiatric_diagnoses).toLowerCase().includes(searchTerm) ||
            String(item.treatment_history).toLowerCase().includes(searchTerm) ||
            String(item.medications).toLowerCase().includes(searchTerm) ||
            String(item.hospitalisation_reason).toLowerCase().includes(searchTerm)
        );
    });

    const apiRoute = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
    });

    const [psyHistoryData, setPsyHistoryData] = useState({
        admission_no: '',
        date: '',
        psychiatric_diagnoses: '',
        treatment_history: '',
        medications: '',
        dosage: '',
        adherence: '',
        sideEffect: '',
        experience_reaction: '',
        hospitalisation_reason: '',
        duration: '',
        crisis_episodes: '',
        fm_mentalHealth: '',
        significant_life: '',
        chronic_stressors: '',
        other_exploration: '',
        other_legalEnvironment: '',
        trauma_exploration: [],
        legal_environment: []
    });


    const getVisitDetails = async () => {
        try {
            const response = await apiRoute.get('/recovery/get_psy');
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
            const response = await apiRoute.get(`/recovery/get_psychiatric/${id}`);
            const data = response.data;

            setPsyHistoryData((psyHistoryData) => ({
                ...psyHistoryData,
                admission_no: data.admission_no || '',
                date: data.date || '',
                psychiatric_diagnoses: data.psychiatric_diagnoses || '',
                treatment_history: data.treatment_history || '',
                medications: data.medications || '',
                dosage: data.dosage || '',
                adherence: data.adherence || '',
                sideEffect: data.sideEffect || '',
                experience_reaction: data.experience_reaction || '',
                hospitalisation_reason: data.hospitalisation_reason || '',
                duration: data.duration || '',
                crisis_episodes: data.crisis_episodes || '',
                fm_mentalHealth: data.fm_mentalHealth || '',
                significant_life: data.significant_life || '',
                chronic_stressors: data.chronic_stressors || '',
                other_exploration: data.other_exploration || '',
                other_legalEnvironment: data.other_legalEnvironment || '',
                trauma_exploration: data.trauma_exploration?.split(',') || ["NULL"],
                legal_environment: data.legal_environment?.split(',') || ["NULL"]
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
        setPsyHistoryData((prev) => ({ ...prev, [name]: value }));
    };

    const renderpsyCheckbox = (field, id, label) => (
        <Form.Check
            type="checkbox"
            id={id}
            label={label}
            checked={Array.isArray(psyHistoryData[field]) && psyHistoryData[field].includes(label)}
            onChange={(e) => {
                const updated = e.target.checked
                    ? [...psyHistoryData[field], label]
                    : psyHistoryData[field].filter(item => item !== label);

                setPsyHistoryData(prev => ({
                    ...prev,
                    [field]: updated
                }));
            }}
        />
    );

    const handleEditform = async (id) => {
        try {
            const response = await apiRoute.get(`/recovery/get_psychiatric/${id}`);
            const data = response.data;

            setPsyHistoryData((psyHistoryData) => ({
                ...psyHistoryData,
                id: data.id || '',
                admission_no: data.admission_no || '',
                date: data.date || '',
                psychiatric_diagnoses: data.psychiatric_diagnoses || '',
                treatment_history: data.treatment_history || '',
                medications: data.medications || '',
                dosage: data.dosage || '',
                adherence: data.adherence || '',
                sideEffect: data.sideEffect || '',
                experience_reaction: data.experience_reaction || '',
                hospitalisation_reason: data.hospitalisation_reason || '',
                duration: data.duration || '',
                crisis_episodes: data.crisis_episodes || '',
                fm_mentalHealth: data.fm_mentalHealth || '',
                significant_life: data.significant_life || '',
                chronic_stressors: data.chronic_stressors || '',
                other_exploration: data.other_exploration || '',
                other_legalEnvironment: data.other_legalEnvironment || '',
                trauma_exploration: data.trauma_exploration?.split(',').map(i => i.trim()) || [],
                legal_environment: data.legal_environment?.split(',').map(i => i.trim()) || []
            }));

            setShow(true);

        } catch (error) {
            console.error("Error fetching form data:", error);
            alert("Basic Detail is not found");
        }
    };

    const handlePsyciatricUpdate = async (e, id) => {
        e.preventDefault();
        try {
            const res = await apiRoute.post(`/recovery/updatePsychiatricData/${id}`, psyHistoryData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            alert('Psychiatric History Form updated successfully!');
            setPsyHistoryData({
                psychiatric_diagnoses: '',
                treatment_history: '',
                medications: '',
                dosage: '',
                adherence: '',
                sideEffect: '',
                experience_reaction: '',
                hospitalisation_reason: '',
                duration: '',
                crisis_episodes: '',
                fm_mentalHealth: '',
                significant_life: '',
                chronic_stressors: '',
                trauma_exploration: [],
                legal_environment: []
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
                        <h3 className="section_title text-center">Psychiatric History</h3>
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
                                <th>Previous Psychiatric Diagnoses</th>
                                <th>Treatment History</th>
                                <th>Medication History</th>
                                <th>Psychiatric Hospitalizations</th>
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
                                        <td>{item.psychiatric_diagnoses || "Null"}</td>
                                        <td>{item.treatment_history || "Null"}</td>
                                        <td>{item.medications || "Null"}</td>
                                        <td>{item.hospitalisation_reason || "Null"}</td>
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
                                            {/* {userType === "2" && (
                                                <button className="btn btn-danger icon_details"
                                                    onClick={() => handleDelete(item.id)}
                                                ><i className="fas fa-trash"></i></button>
                                            )} */}
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
                        <h4 className="text-center">PSYCHIATRICS HISTORY </h4>
                    </Col>
                </Row>
                <Row className='d-flex align-items-center justify-content-center'>
                    <Col md={5}>
                        <Form.Group className="mb-3 d-flex align-items-center" as={Row}>
                            <Form.Label column sm="6" className='text-start'>Admission No. :</Form.Label>
                            <Col md={6}>
                                <div className='text-start'>
                                    {psyHistoryData.admission_no}
                                </div>
                            </Col>
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group className="mb-3 d-flex align-items-center" as={Row}>
                            <Form.Label column sm="6" className='text-start'>Date :</Form.Label>
                            <Col md={6}>
                                <div className='text-start'>
                                    {formatDateTime(psyHistoryData.date)}
                                </div>
                            </Col>
                        </Form.Group>
                    </Col>
                </Row>
                <Form className='mt-4'>
                    <Form.Group className="mb-3" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <li className='icon-li'>
                                <h5>Previous Psychiatric Diagnoses: </h5>
                            </li>
                        </Form.Label>
                        <Col md={6}>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                name='psychiatric_diagnoses'
                                value={psyHistoryData.psychiatric_diagnoses}
                                onChange={handleInputChange}
                                required
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <li className='icon-li'>
                                <h5>Treatment History: </h5>
                            </li>
                        </Form.Label>
                        <Col md={6}>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                name='treatment_history'
                                value={psyHistoryData.treatment_history}
                                onChange={handleInputChange}
                                required
                            />
                        </Col>
                    </Form.Group>
                    <li className='icon-li text-start'>
                        <h5>Medication History: </h5>
                    </li>
                    <Row>
                        <Col sm={4}>
                            <Form.Group>
                                <Form.Label className='text-start'>
                                    Medications :
                                </Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={2}
                                    name='medications'
                                    value={psyHistoryData.medications}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col sm={4}>
                            <Form.Group>
                                <Form.Label className='text-start'>
                                    Dosage :
                                </Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={2}
                                    name='dosage'
                                    value={psyHistoryData.dosage}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col sm={4}>
                            <Form.Group>
                                <Form.Label className='text-start'>
                                    Adherence :
                                </Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={2}
                                    name='adherence'
                                    value={psyHistoryData.adherence}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col sm={4}>
                            <Form.Group>
                                <Form.Label className='text-start'>
                                    Any side effects :
                                </Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={2}
                                    name='sideEffect'
                                    value={psyHistoryData.sideEffect}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col sm={4}>
                            <Form.Group>
                                <Form.Label className='text-start'>
                                    Experienced Reactions :
                                </Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={2}
                                    name='experience_reaction'
                                    value={psyHistoryData.experience_reaction}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <li className='icon-li text-start'>
                        <h5>Psychiatric Hospitalizations: </h5>
                    </li>
                    <Row>
                        <Col sm={4}>
                            <Form.Group>
                                <Form.Label className='text-start'>
                                    Reasons :
                                </Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={2}
                                    name='hospitalisation_reason'
                                    value={psyHistoryData.hospitalisation_reason}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col sm={4}>
                            <Form.Group>
                                <Form.Label className='text-start'>
                                    Duration and the Outcomes :
                                </Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={2}
                                    name='duration'
                                    value={psyHistoryData.duration}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Form.Group className="mb-3 mt-3" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <li className='icon-li'>
                                <h5>Crisis Episodes: </h5>
                            </li>
                        </Form.Label>
                        <Col md={6}>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                name='crisis_episodes'
                                value={psyHistoryData.crisis_episodes}
                                onChange={handleInputChange}
                                required
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <li className='icon-li'>
                                <h5>Family Members with Mental Health Diagnoses: </h5>
                            </li>
                        </Form.Label>
                        <Col md={6}>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                name='fm_mentalHealth'
                                value={psyHistoryData.fm_mentalHealth}
                                onChange={handleInputChange}
                                required
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <li className='icon-li'>
                                <h5>Significant Life Events and Stressors: </h5>
                            </li>
                        </Form.Label>
                        <Col md={6}>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                name='significant_life'
                                value={psyHistoryData.significant_life}
                                onChange={handleInputChange}
                                required
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <li className='icon-li'>
                                <h5>Chronic Stressors: </h5>
                            </li>
                        </Form.Label>
                        <Col md={6}>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                name='chronic_stressors'
                                value={psyHistoryData.chronic_stressors}
                                onChange={handleInputChange}
                                required
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <li className='icon-li'>
                                <h5>Exploration of Trauma: </h5>
                            </li>
                        </Form.Label>
                        <Col md={6}>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                name='trauma_exploration'
                                value={psyHistoryData.trauma_exploration}
                                onChange={handleInputChange}
                                required
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <li className='icon-li'>
                                <h5>Others Exploration of Trauma: </h5>
                            </li>
                        </Form.Label>
                        <Col md={6}>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                name='other_exploration'
                                value={psyHistoryData.other_exploration || "Null"}
                                onChange={handleInputChange}
                                required
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <li className='icon-li'>
                                <h5>Legal Involvement: </h5>
                            </li>
                        </Form.Label>
                        <Col md={6}>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                name='legal_environment'
                                value={psyHistoryData.legal_environment}
                                onChange={handleInputChange}
                                required
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <li className='icon-li'>
                                <h5>Others Legal Involvement: </h5>
                            </li>
                        </Form.Label>
                        <Col md={6}>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                name='other_legalEnvironment'
                                value={psyHistoryData.other_legalEnvironment || "Null"}
                                onChange={handleInputChange}
                                required
                            />
                        </Col>
                    </Form.Group>

                </Form>
            </div>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Psychiatric History</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form className='mt-4'>
                        <li className='icon-li'>
                            <h5>Previous Psychiatric Diagnoses:</h5>
                        </li>
                        <Form.Group className="mb-3" >
                            <Form.Control as="textarea" rows={2}
                                name='psychiatric_diagnoses'
                                value={psyHistoryData.psychiatric_diagnoses}
                                onChange={handleInputChange}
                                required />
                        </Form.Group>
                        <li className='icon-li'>
                            <h5>Treatment History:</h5>
                        </li>
                        <Form.Group className="mb-3" >
                            <Form.Control as="textarea" rows={2}
                                name='treatment_history'
                                value={psyHistoryData.treatment_history}
                                onChange={handleInputChange}
                                required />
                        </Form.Group>

                        <li className='icon-li'>
                            <h5>Medication History:</h5>
                        </li>
                        <Row>
                            <Col md={4}>
                                <Form.Group className="mb-3" >
                                    <Form.Label>Medications:  </Form.Label>
                                    <Form.Control
                                        name='medications'
                                        type='text'
                                        value={psyHistoryData.medications}
                                        onChange={handleInputChange}
                                        required />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3" >
                                    <Form.Label>Dosage:  </Form.Label>
                                    <Form.Control
                                        name='dosage'
                                        type='text'
                                        value={psyHistoryData.dosage}
                                        onChange={handleInputChange}
                                        required />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3" >
                                    <Form.Label>Adherence:  </Form.Label>
                                    <Form.Control
                                        name='adherence'
                                        type='text'
                                        value={psyHistoryData.adherence}
                                        onChange={handleInputChange}
                                        required />
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group className="mb-3" >
                                    <Form.Label>Any side effects :  </Form.Label>
                                    <Form.Control
                                        name='sideEffect'
                                        type='text'
                                        value={psyHistoryData.sideEffect}
                                        onChange={handleInputChange}
                                        required />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3" >
                                    <Form.Label>Experienced Reactions :  </Form.Label>
                                    <Form.Control
                                        name='experience_reaction'
                                        type='text'
                                        value={psyHistoryData.experience_reaction}
                                        onChange={handleInputChange}
                                        required />
                                </Form.Group>
                            </Col>
                        </Row>

                        <li className='icon-li'>
                            <h5>Psychiatric Hospitalizations:</h5>
                        </li>
                        <Row>
                            <Col md={4}>
                                <Form.Label>Reasons</Form.Label>
                                <Form.Control as="textarea" rows={1}
                                    name='hospitalisation_reason'
                                    value={psyHistoryData.hospitalisation_reason}
                                    onChange={handleInputChange}
                                    required />
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Duration and the Outcomes</Form.Label>
                                    <Form.Control
                                        name='duration'
                                        text="text"
                                        value={psyHistoryData.duration}
                                        onChange={handleInputChange}
                                        required />

                                </Form.Group>
                            </Col>
                        </Row>

                        <li className='icon-li'>
                            <h5>Crisis Episodes:</h5>
                        </li>
                        <Form.Group className="mb-3" >
                            <Form.Control as="textarea" rows={2}
                                name='crisis_episodes'
                                value={psyHistoryData.crisis_episodes}
                                onChange={handleInputChange}
                                required />
                        </Form.Group>

                        <li className='icon-li'>
                            <h5>Family Members with Mental Health Diagnoses:</h5>
                        </li>
                        <Form.Group className="mb-3" >
                            <Form.Control as="textarea" rows={2}
                                name='fm_mentalHealth'
                                value={psyHistoryData.fm_mentalHealth}
                                onChange={handleInputChange}
                                required />
                        </Form.Group>

                        <li className='icon-li'>
                            <h5>Significant Life Events and Stressors:</h5>
                        </li>
                        <Form.Group className="mb-3" >
                            <Form.Control as="textarea" rows={2}
                                name='significant_life'
                                value={psyHistoryData.significant_life}
                                onChange={handleInputChange}
                                required />
                        </Form.Group>

                        <li className='icon-li'>
                            <h5>Chronic Stressors:</h5>
                        </li>
                        <Form.Group className="mb-3" >
                            <Form.Control as="textarea" rows={2}
                                name='chronic_stressors'
                                value={psyHistoryData.chronic_stressors}
                                onChange={handleInputChange}
                                required />
                        </Form.Group>

                        <li className='icon-li'>
                            <h5>Exploration of Trauma:</h5>
                        </li>
                        <Form.Group as={Row} className="mb-3">
                            <div className="d-flex flex-wrap gap-3 mt-2">
                                {[
                                    ["Physical", "Physical"],
                                    ["Emotional", "Emotional"],
                                    ["Sexual abuse ", "Sexual abuse"],
                                    ["Coping mechanisms", "Coping mechanisms"],
                                    ["Others", "Others"]

                                ].map(([id, label]) => renderpsyCheckbox("trauma_exploration", id, label))}

                                {Array.isArray(psyHistoryData.trauma_exploration) &&
                                    psyHistoryData.trauma_exploration.includes("Others") && (
                                        <Col md={6}>
                                            <Form.Group as={Row} className="mb-3">
                                                <Form.Label column sm="4" className="text-start">
                                                    Others:
                                                </Form.Label>
                                                <Col sm="8">
                                                    <Form.Control
                                                        as="textarea"
                                                        rows={2}
                                                        name="other_exploration"
                                                        value={psyHistoryData.other_exploration}
                                                        onChange={handleInputChange}
                                                        required
                                                    />
                                                </Col>
                                            </Form.Group>
                                        </Col>
                                    )}
                            </div>
                        </Form.Group>

                        <li className='icon-li'>
                            <h4>Legal Involvement: <span style={{ color: 'red' }}>*</span></h4>
                        </li>
                        <Form.Group as={Row} className="mb-3">
                            <div className="d-flex flex-wrap gap-3 mt-2">
                                {[
                                    ["Involuntary Hospitalizations", "Involuntary Hospitalizations"],
                                    ["Legal conflicts", "Legal conflicts"],
                                    ["Involvement with the criminal justice system ", "Involvement with the criminal justice system"],
                                    ["Others", "Others"]

                                ].map(([id, label]) => renderpsyCheckbox("legal_environment", id, label))}
                            </div>
                            {Array.isArray(psyHistoryData.legal_environment) &&
                                psyHistoryData.legal_environment.includes("Others") && (
                                    <Col md={6}>
                                        <Form.Group as={Row} className="mb-3">
                                            <Form.Label column sm="4" className="text-start">
                                                Others:
                                            </Form.Label>
                                            <Col sm="8">
                                                <Form.Control
                                                    as="textarea"
                                                    rows={2}
                                                    type="text"
                                                    name="other_legalEnvironment"
                                                    value={psyHistoryData.other_legalEnvironment}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </Col>
                                        </Form.Group>
                                    </Col>
                                )}
                        </Form.Group>

                        <div className="mt-3">
                            <Button variant="success" className="m-1" type="submit" onClick={(e) => handlePsyciatricUpdate(e, psyHistoryData.id)}>Update</Button>
                            <Button variant="secondary" className="m-1" onClick={handleClose}>Close</Button>
                        </div>

                    </Form>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default Psy_history
