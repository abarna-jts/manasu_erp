import React from 'react'
import { Breadcrumb, Form, InputGroup, Container, Row, Col, Table, Button } from '@themesberg/react-bootstrap';
import { useState, useEffect } from "react";
import axios from 'axios';
import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import manasu_logo from "../Admission/Manasu-Logo.png";

function Presenting_problems() {
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

    const [presentingData, setPresentingData] = useState({
        admission_no: '',
        date: '',
        history_presenting: '',
        mood_affect: [],
        though_content: [],
        though_process: [],
        perception: [],
        behavioural_changes: [],
        sleep_patterns: [],
        energy_level: '',
        appetite_weight: '',
        occupation_academic: '',
        interpersonal_relationship: '',
        selfCare_activity: '',
        recreation_activity: '',
    });

    const apiRoute = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
    });
    const getVisitDetails = async () => {
        try {
            const response = await apiRoute.get('/recovery/get_presenting');
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
            const response = await apiRoute.get(`/recovery/get_presentingData/${id}`);
            const data = response.data;

            setPresentingData((presentingData) => ({
                ...presentingData,
                admission_no: data.admission_no || '',
                date: data.date || '',
                history_presenting: data.history_presenting || '',
                mood_affect: data.mood_affect?.split(',') || ["NULL"],
                though_content: data.though_content || '',
                though_process: data.though_process || '',
                perception: data.perception || '',
                behavioural_changes: data.behavioural_changes || '',
                sleep_patterns: data.sleep_patterns || '',
                energy_level: data.energy_level || '',
                appetite_weight: data.appetite_weight || '',
                occupation_academic: data.occupation_academic || '',
                interpersonal_relationship: data.interpersonal_relationship || '',
                selfCare_activity: data.selfCare_activity || '',
                recreation_activity: data.recreation_activity || ''
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
        <div>
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
                        <h3 className="section_title text-center">Presenting Problems</h3>
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
                                <th>History of Presenting Illness</th>
                                <th>Appetite and Weight Changes</th>
                                <th>Energy Level</th>
                                <th>Interpersonal Relationships</th>
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
                                        <td>{item.history_presenting || "Null"}</td>
                                        <td>{item.appetite_weight || "Null"}</td>
                                        <td>{item.energy_level || "Null"}</td>
                                        <td>{item.interpersonal_relationship || "Null"}</td>
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
                <Row className="d-flex align-items-center justify-content-center mb-2">
                    <Col md={3} className='d-flex align-items-center pdf_logo'>
                        <img src={manasu_logo} className="pdf_logo" alt="" />

                    </Col>
                    <Col md={9}>
                        <h4 className="text-center">PRESENTING PROBLEMS </h4>
                    </Col>
                </Row>
                <Form className='mt-4'>
                    <li className='icon-li'>
                        <h4 className='text-start'>Introduction to Presenting Problems:</h4>
                    </li>
                    <Form.Group className="mb-3" as={Row}>
                        <Form.Label column sm="4" className='text-start'>History of Presenting Illness:</Form.Label>
                        <Col sm="8">
                            <Form.Control as="textarea" rows={2}
                                name='history_presenting'
                                value={presentingData.history_presenting}
                                onChange={handleInputChange}
                                required />
                        </Col>

                    </Form.Group>

                    <li className='icon-li'>
                        <h4 className='text-start'>Detailed Exploration of Symptoms:</h4>
                    </li>

                    <Form.Group as={Row} className="mb-3" >
                        <Form.Label column sm="4" className='text-start'>a.	Mood and Affect: </Form.Label>
                        <Col md={8}>
                            <Form.Control
                                type='text'
                                name='mood_affect'
                                value={presentingData.mood_affect || "NULL"}
                                onChange={handleInputChange} />
                        </Col>

                    </Form.Group>

                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm="4" className='text-start'>b.	Thought Content: </Form.Label>
                        <Col md={8}>
                            <Form.Control
                                type='text'
                                name='though_content'
                                value={presentingData.though_content || "NULL"}
                                onChange={handleInputChange} />
                        </Col>

                    </Form.Group>

                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm="4" className='text-start'>c.	Thought Process: </Form.Label>
                        <Col md={8}>
                            <Form.Control
                                type='text'
                                name='though_process'
                                value={presentingData.though_process || "NULL"}
                                onChange={handleInputChange} />
                        </Col>

                    </Form.Group>

                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm="4" className='text-start'>d.	Perceptions: </Form.Label>
                        <Col md={8}>
                            <Form.Control
                                type='text'
                                name='perception'
                                value={presentingData.perception || "NULL"}
                                onChange={handleInputChange} />
                        </Col>

                    </Form.Group>

                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm="4" className='text-start'>e.	Behavioural Changes: </Form.Label>
                        <Col md={8}>
                            <Form.Control
                                type='text'
                                name='behavioural_changes'
                                value={presentingData.behavioural_changes || "NULL"}
                                onChange={handleInputChange} />
                        </Col>

                    </Form.Group>

                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm="4" className='text-start'>f.	Sleep Patterns: </Form.Label>
                        <Col md={8}>
                            <Form.Control
                                type='text'
                                name='sleep_patterns'
                                value={presentingData.sleep_patterns || "NULL"}
                                onChange={handleInputChange} />
                        </Col>

                    </Form.Group>

                    <Form.Group className="mb-3" as={Row}>
                        <Form.Label column sm="4" className='text-start'>Appetite and Weight Changes: </Form.Label>
                        <Col md={8}>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                name='appetite_weight'
                                value={presentingData.appetite_weight}
                                onChange={handleInputChange}
                                required
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group className="mb-3" as={Row}>
                        <Form.Label column sm="4" className='text-start'>Energy Level: </Form.Label>
                        <Col md={8}>
                            <Form.Control as="textarea" rows={2}
                                name='energy_level'
                                value={presentingData.energy_level}
                                onChange={handleInputChange}
                                required />
                        </Col>

                    </Form.Group>

                    <li className='icon-li'>
                        <h4 className='text-start'>Impact on Daily Functioning: </h4>
                    </li>

                    <Form.Group className="mb-3" as={Row}>
                        <Form.Label column sm="4" className='text-start'>Occupational or Academic Functioning: </Form.Label>
                        <Col md={8}>
                        <Form.Control as="textarea" rows={2}
                            name='occupation_academic'
                            value={presentingData.occupation_academic}
                            onChange={handleInputChange}
                            required />
                        </Col>
                    </Form.Group>

                    <Form.Group className="mb-3" as={Row} >
                        <Form.Label column sm="4" className='text-start'>Interpersonal Relationships: </Form.Label>
                        <Col md={8}>
                        <Form.Control as="textarea" rows={2}
                            name='interpersonal_relationship'
                            value={presentingData.interpersonal_relationship}
                            onChange={handleInputChange}
                            required />
                        </Col>
                    </Form.Group>

                    <Form.Group className="mb-3" as={Row} >
                        <Form.Label column sm="4" className='text-start'>Self-Care and Activities of Daily Living: </Form.Label>
                        <Col md={8}>
                            <Form.Control as="textarea" rows={2}
                            name='selfCare_activity'
                            value={presentingData.selfCare_activity}
                            onChange={handleInputChange}
                            required />
                        </Col>
                    </Form.Group>

                    <Form.Group className="mb-3" as={Row} >
                        <Form.Label column sm="4" className='text-start'>Recreational Activities: </Form.Label>
                        <Col md={8}>
                        <Form.Control as="textarea" rows={2}
                            name='recreation_activity'
                            value={presentingData.recreation_activity}
                            onChange={handleInputChange}
                            required />
                        
                        </Col>
                    </Form.Group>
                </Form>
            </div>
        </div>
    )
}

export default Presenting_problems
