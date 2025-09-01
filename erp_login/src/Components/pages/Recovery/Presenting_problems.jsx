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

function Presenting_problems() {
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
            String(item.history_presenting).toLowerCase().includes(searchTerm) ||
            String(item.appetite_weight).toLowerCase().includes(searchTerm) ||
            String(item.energy_level).toLowerCase().includes(searchTerm) ||
            String(item.interpersonal_relationship).toLowerCase().includes(searchTerm)
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

    const renderCheckbox = (field, id, label) => (
        <Form.Check
            type="checkbox"
            id={id}
            label={label}
            checked={presentingData[field]?.includes(label)}
            onChange={(e) => {
                const updated = e.target.checked
                    ? [...presentingData[field], label]
                    : presentingData[field].filter(item => item !== label);

                setPresentingData(prev => ({
                    ...prev,
                    [field]: updated
                }));
            }}
        />
    );

    const handleEditform = async (id) => {
        try {
            const response = await apiRoute.get(`/recovery/get_presentingData/${id}`);
            const data = response.data;

            setPresentingData((presentingData) => ({
                ...presentingData,
                id: data.id || '',
                admission_no: data.admission_no || '',
                date: data.date || '',
                history_presenting: data.history_presenting || '',
                mood_affect: data.mood_affect?.split(',').map(i => i.trim()) || [],
                though_content: data.though_content?.split(',').map(i => i.trim()) || [],
                though_process: data.though_process?.split(',').map(i => i.trim()) || [],
                perception: data.perception?.split(',').map(i => i.trim()) || [],
                behavioural_changes: data.behavioural_changes?.split(',').map(i => i.trim()) || [],
                sleep_patterns: data.sleep_patterns?.split(',').map(i => i.trim()) || [],
                energy_level: data.energy_level || '',
                appetite_weight: data.appetite_weight || '',
                occupation_academic: data.occupation_academic || '',
                interpersonal_relationship: data.interpersonal_relationship || '',
                selfCare_activity: data.selfCare_activity || '',
                recreation_activity: data.recreation_activity || ''
            }));

            setShow(true);

        } catch (error) {
            console.error("Error fetching form data:", error);
            alert("Presenting Problems ID is not found");
        }
    };

    const handlePresentingUpdate = async (e, id) => {
        e.preventDefault();
        try {
            const res = await apiRoute.post(`/recovery/updatePresentingData/${id}`, presentingData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log(res);
            alert('Presenting Problems Form updated successfully!');
            setPresentingData({
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
                            {currentItems.length > 0 ? (
                                currentItems.map((item, index) => (
                                    <tr key={item.id}>
                                        <td>{indexOfFirstItem + index + 1}</td>
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
                        <h4 className="text-center">PRESENTING PROBLEMS </h4>
                    </Col>
                </Row>
                <Row className='d-flex align-items-center justify-content-center'>
                    <Col md={5}>
                        <Form.Group className="mb-3 d-flex align-items-center" as={Row}>
                            <Form.Label column sm="6" className='text-start'>Admission No. :</Form.Label>
                            <Col md={6}>
                                <div className='text-start'>
                                    {presentingData.admission_no}
                                </div>
                            </Col>
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group className="mb-3 d-flex align-items-center" as={Row}>
                            <Form.Label column sm="6" className='text-start'>Date :</Form.Label>
                            <Col md={6}>
                                <div className='text-start'>
                                    {formatDateTime(presentingData.date)}
                                </div>
                            </Col>
                        </Form.Group>
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
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Presenting Problems</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <li className='icon-li'>
                            <h4>Introduction to Presenting Problems:</h4>
                        </li>
                        <Form.Group className="mb-3" >
                            <Form.Label>History of Presenting Illness: </Form.Label>
                            <Form.Control as="textarea" rows={2}
                                name='history_presenting'
                                value={presentingData.history_presenting}
                                onChange={handleInputChange}
                                required />
                        </Form.Group>

                        <li className='icon-li'>
                            <h4>Detailed Exploration of Symptoms:</h4>
                        </li>

                        <Form.Group as={Row} className="mb-3">
                            <Form.Label>a.	Mood and Affect: </Form.Label>
                            <div className="d-flex flex-wrap gap-3 mt-2">
                                {[
                                    ["Predominant mood", "Predominant mood"],
                                    ["Appropriateness of Affect", "Appropriateness of Affect"],

                                ].map(([id, label]) => renderCheckbox("mood_affect", id, label))}
                            </div>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3">
                            <Form.Label>b.	Thought Content: </Form.Label>
                            <div className="d-flex flex-wrap gap-3 mt-2">
                                {[
                                    ["Recurrent", "Recurrent"],
                                    ["Intrusive", "Intrusive"],
                                    ["obsessive", "obsessive"],
                                    ["Cognitive Distortions", "Cognitive Distortions"],

                                ].map(([id, label]) => renderCheckbox("though_content", id, label))}
                            </div>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3">
                            <Form.Label>c.	Thought Process: </Form.Label>
                            <div className="d-flex flex-wrap gap-3 mt-2">
                                {[
                                    ["Speed of thoughts", "Speed of thoughts"],
                                    ["Coherence", "Coherence"],
                                    ["Organization", "Organization"],
                                    ["Signs of Racing thoughts", "Signs of Racing thoughts"],
                                    ["Tangentiality", "Tangentiality"],
                                    ["Thought Blocking", "Thought Blocking"],

                                ].map(([id, label]) => renderCheckbox("though_process", id, label))}
                            </div>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3">
                            <Form.Label>d.	Perceptions: </Form.Label>
                            <div className="d-flex flex-wrap gap-3 mt-2">
                                {[
                                    ["Hallucinations", "Hallucinations"],
                                    ["Perceptual Disturbances", "Perceptual Disturbances"],
                                    ["Unusual Experiences related to Hearing", "Unusual Experiences related to Hearing"],
                                    ["Seeing", "Seeing"],
                                    ["Interpreting Stimuli", "Interpreting Stimuli"],

                                ].map(([id, label]) => renderCheckbox("perception", id, label))}
                            </div>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3">
                            <Form.Label>e.	Behavioural Changes: </Form.Label>
                            <div className="d-flex flex-wrap gap-3 mt-2">
                                {[
                                    ["Activity level", "Activity level"],
                                    ["Social Withdrawal", "Social Withdrawal"],
                                    ["Impulsivity", "Impulsivity"],
                                    ["Engagement in Risky Behaviours", "Engagement in Risky Behaviours"],
                                    ["Disruptions in Daily Routines", "Disruptions in Daily Routines"],
                                    ["Self-Care Activities", "Self-Care Activities"]

                                ].map(([id, label]) => renderCheckbox("behavioural_changes", id, label))}
                            </div>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3">
                            <Form.Label>f.	Sleep Patterns: </Form.Label>
                            <div className="d-flex flex-wrap gap-3 mt-2">
                                {[
                                    ["Difficulties falling asleep", "Difficulties falling asleep"],
                                    ["Staying asleep", "Staying asleep"],
                                    ["Experiencing Nightmares", "Experiencing Nightmares"]

                                ].map(([id, label]) => renderCheckbox("sleep_patterns", id, label))}
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-3" >
                            <Form.Label>Appetite and Weight Changes: </Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                name='appetite_weight'
                                value={presentingData.appetite_weight}
                                onChange={handleInputChange}
                                required
                            />

                        </Form.Group>

                        <Form.Group className="mb-3" >
                            <Form.Label>Energy Level: </Form.Label>
                            <Form.Control as="textarea" rows={2}
                                name='energy_level'
                                value={presentingData.energy_level}
                                onChange={handleInputChange}
                                required />
                        </Form.Group>

                        <li className='icon-li'>
                            <h4>Impact on Daily Functioning:</h4>
                        </li>

                        <Form.Group className="mb-3" >
                            <Form.Label>Occupational or Academic Functioning: </Form.Label>
                            <Form.Control as="textarea" rows={2}
                                name='occupation_academic'
                                value={presentingData.occupation_academic}
                                onChange={handleInputChange}
                                required />
                        </Form.Group>

                        <Form.Group className="mb-3" >
                            <Form.Label>Interpersonal Relationships: </Form.Label>
                            <Form.Control as="textarea" rows={2}
                                name='interpersonal_relationship'
                                value={presentingData.interpersonal_relationship}
                                onChange={handleInputChange}
                                required />
                        </Form.Group>

                        <Form.Group className="mb-3" >
                            <Form.Label>Self-Care and Activities of Daily Living: </Form.Label>
                            <Form.Control as="textarea" rows={2}
                                name='selfCare_activity'
                                value={presentingData.selfCare_activity}
                                onChange={handleInputChange}
                                required />
                        </Form.Group>

                        <Form.Group className="mb-3" >
                            <Form.Label>Recreational Activities: </Form.Label>
                            <Form.Control as="textarea" rows={2}
                                name='recreation_activity'
                                value={presentingData.recreation_activity}
                                onChange={handleInputChange}
                                required />
                        </Form.Group>

                        <div className="mt-3">
                            <Button variant="success" className="m-1" type="submit" onClick={(e) => handlePresentingUpdate(e, presentingData.id)}>Update</Button>
                            <Button variant="secondary" className="m-1" onClick={handleClose}>Close</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default Presenting_problems
