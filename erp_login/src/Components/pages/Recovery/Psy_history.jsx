import React from 'react'
import { Breadcrumb, Form, InputGroup, Container, Row, Col, Table, Button } from '@themesberg/react-bootstrap';
import { useState, useEffect } from "react";
import axios from 'axios';
import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import manasu_logo from "../Admission/Manasu-Logo.png";

function Psy_history() {
    const [visitDetails, setVisitDetails] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [previewRequested, setPreviewRequested] = useState(false);

    const filteredRescueDetails = (visitDetails || []).filter((item) => {
        const searchTerm = searchQuery.toLowerCase();
        return (
            String(item.name).toLowerCase().includes(searchTerm) ||
            String(item.date).toLowerCase().includes(searchTerm) ||
            String(item.living_arrangement).toLowerCase().includes(searchTerm)
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
        setPresentingData((prev) => ({ ...prev, [name]: value }));
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
                            {filteredRescueDetails.length > 0 ? (
                                filteredRescueDetails.map((item, index) => (
                                    <tr key={item.id}>
                                        <td>{index + 1}</td>
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
                                            {/* <button className="btn btn-primary icon_details"
                                                onClick={() => {
                                                    handleEditform(item.id);
                                                }}
                                            ><i className="fas fa-edit"></i> </button> */}
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

                </Form>
            </div>
        </>
    )
}

export default Psy_history
