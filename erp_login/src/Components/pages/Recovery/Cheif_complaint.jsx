import React from 'react';
import { Breadcrumb, Form, InputGroup, Container, Row, Col, Table, Button } from '@themesberg/react-bootstrap';
import { useState, useEffect } from "react";
import axios from 'axios';
import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import manasu_logo from "../Admission/Manasu-Logo.png";
import Modal from 'react-bootstrap/Modal';
import Cookies from 'js-cookie';

function Cheif_complaint() {
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
            String(item.chief_complaint).toLowerCase().includes(searchTerm) ||
            String(item.onset_duration).toLowerCase().includes(searchTerm) ||
            String(item.course_type).toLowerCase().includes(searchTerm) ||
            String(item.identify_trigger).toLowerCase().includes(searchTerm) ||
            String(item.biological).toLowerCase().includes(searchTerm)
        );
    });

    const [chiefData, setChiefData] = useState({
        chief_complaint: '',
        onset_duration: '',
        nature_symptoms: '',
        severity: '',
        course_type: '',
        nature_illness: '',
        identify_trigger: '',
        life_changes: '',
        biological: '',
        psychological: '',
        social_environment: '',
        date: '',
        admission_no: '',
    });

    const apiRoute = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
    });
    const getVisitDetails = async () => {
        try {
            const response = await apiRoute.get('/recovery/get_chief');
            console.log(response.data);
            setVisitDetails(response.data.data); // Should be an array
        } catch (error) {
            console.error("Error fetching Chief Complaint:", error);
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
            const response = await apiRoute.get(`/recovery/get_chiefComplaint/${id}`);
            const data = response.data;

            setChiefData((chiefData) => ({
                ...chiefData,
                admission_no: data.admission_no || '',
                date: data.date || '',
                chief_complaint: data.chief_complaint || '',
                onset_duration: data.onset_duration || '',
                nature_symptoms: data.nature_symptoms || '',
                severity: data.severity || '',
                course_type: data.course_type || '',
                nature_illness: data.nature_illness || '',
                identify_trigger: data.identify_trigger || '',
                life_changes: data.life_changes || '',
                biological: data.biological || '',
                psychological: data.psychological || '',
                social_environment: data.social_environment || ''
            }));

            setPreviewRequested(true); // trigger the effect after state updates
        } catch (error) {
            console.error("Error fetching form data:", error);
            alert("Cheif Complaint ID is not found");
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
        setChiefData((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditform = async (id) => {
        try {
            const response = await apiRoute.get(`/recovery/get_chiefComplaint/${id}`);
            const data = response.data;

            setChiefData((chiefData) => ({
                ...chiefData,
                id: data.id || '',
                admission_no: data.admission_no || '',
                date: data.date || '',
                chief_complaint: data.chief_complaint || '',
                onset_duration: data.onset_duration || '',
                nature_symptoms: data.nature_symptoms || '',
                severity: data.severity || '',
                course_type: data.course_type || '',
                nature_illness: data.nature_illness || '',
                identify_trigger: data.identify_trigger || '',
                life_changes: data.life_changes || '',
                biological: data.biological || '',
                psychological: data.psychological || '',
                social_environment: data.social_environment || ''
            }));

            setShow(true);

        } catch (error) {
            console.error("Error fetching form data:", error);
            alert("Basic Detail is not found");
        }
    };

    const handleCheifUpdate = async (e, id) => {
        e.preventDefault();
        try {
            const res = await apiRoute.post(`/recovery/updateCheifComplaint/${id}`, chiefData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            alert('Cheif Complaint Form updated successfully!');
            setChiefData({
                chief_complaint: '',
                onset_duration: '',
                nature_symptoms: '',
                severity: '',
                course_type: '',
                nature_illness: '',
                identify_trigger: '',
                life_changes: '',
                biological: '',
                psychological: '',
                social_environment: '',
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
            const res = await apiRoute.delete(`/social_remover/CheifComplainttoRecycleBin/${admission_no}`);
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
                        <h3 className="section_title text-center">The Chief Complaint</h3>
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
                                <th>Chief Complaint</th>
                                <th>Onset and Duration</th>
                                <th>Course Type</th>
                                <th>Identify Triggers</th>
                                <th>Biological</th>
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
                                        <td>{item.chief_complaint || "Null"}</td>
                                        <td>{item.onset_duration || "Null"}</td>
                                        <td>{item.course_type || "Null"}</td>
                                        <td>{item.identify_trigger || "Null"}</td>
                                        <td>{item.biological || "Null"}</td>
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
                        <h4 className="text-center">THE CHIEF COMPLAINT</h4>
                    </Col>
                </Row>
                <Row className='d-flex align-items-center justify-content-center'>
                    <Col md={5}>
                        <Form.Group className="mb-3 d-flex align-items-center" as={Row}>
                            <Form.Label column sm="6" className='text-start'>Admission No. :</Form.Label>
                            <Col md={6}>
                                <div className='text-start'>
                                    {chiefData.admission_no}
                                </div>
                            </Col>
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group className="mb-3 d-flex align-items-center" as={Row}>
                            <Form.Label column sm="6" className='text-start'>Date :</Form.Label>
                            <Col md={6}>
                                <div className='text-start'>
                                    {formatDateTime(chiefData.date)}
                                </div>
                            </Col>
                        </Form.Group>
                    </Col>
                </Row>
                <Form className='mt-4'>
                    <li className='icon-li'>
                        <h4 className='text-start'>The Chief Complaint:</h4>
                    </li>
                    <Form.Group as={Row} className="mb-2 text-start" >
                        <Form.Label column sm="4">Chief Complaint:  </Form.Label>
                        <Col sm="8">
                            <Form.Control type="text"
                                name='chief_complaint'
                                value={chiefData.chief_complaint}
                                onChange={handleInputChange}
                                required />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-2 text-start" >
                        <Form.Label column sm="4">Onset and Duration:  </Form.Label>
                        <Col sm="8">
                            <Form.Control type="text"
                                name='onset_duration'
                                value={chiefData.onset_duration}
                                onChange={handleInputChange}
                                required />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-2 text-start" >
                        <Form.Label column sm="4">Nature of Symptoms:  </Form.Label>
                        <Col sm="8">
                            <Form.Control type="text"
                                name='nature_symptoms'
                                value={chiefData.nature_symptoms}
                                onChange={handleInputChange}
                                required />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-2 text-start" >
                        <Form.Label column sm="4">Severity: </Form.Label>
                        <Col sm="8">
                            <Form.Select name="severity"
                                value={chiefData.severity}
                                onChange={handleInputChange}
                                required>
                                <option>Select</option>
                                <option value="Mild">Mild</option>
                                <option value="Moderate">Moderate</option>
                                <option value="Severe">Severe</option>
                            </Form.Select>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-2 text-start" >
                        <Form.Label column sm="4">Course Type:  </Form.Label>
                        <Col sm="8">
                            <Form.Select name="course_type"
                                value={chiefData.course_type}
                                onChange={handleInputChange}
                                required>
                                <option>Select</option>
                                <option value="Continuous">Continuous</option>
                                <option value="Episodic">Episodic</option>
                                <option value="Fluctuating">Fluctuating</option>
                            </Form.Select>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-2 text-start" >
                        <Form.Label column sm="4">Nature of Illness: </Form.Label>
                        <Col sm="8">
                            <Form.Select name="nature_illness"
                                value={chiefData.nature_illness}
                                onChange={handleInputChange}
                                required>
                                <option>Select</option>
                                <option value="Progressive">Progressive</option>
                                <option value="Static">Static</option>
                                <option value="Improving">Improving</option>
                            </Form.Select>
                        </Col>
                    </Form.Group>

                    <li className='icon-li'>
                        <h4 className='text-start'>Precipitating Factors:</h4>
                    </li>

                    <Form.Group as={Row} className="mb-2 text-start" >
                        <Form.Label column sm="4">Identify Triggers: </Form.Label>
                        <Col sm="8">
                            <Form.Control type="text"
                                name='identify_trigger'
                                value={chiefData.identify_trigger}
                                onChange={handleInputChange}
                                required />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-2 text-start" >
                        <Form.Label column sm="4">Life Changes and Stressors: </Form.Label>
                        <Col sm="8">
                            <Form.Control type="text"
                                name='life_changes'
                                value={chiefData.life_changes}
                                onChange={handleInputChange}
                                required />
                        </Col>
                    </Form.Group>

                    <li className='icon-li'>
                        <h4 className='text-start'>Predisposing Factors:</h4>
                    </li>

                    <Form.Group as={Row} className="mb-2 text-start" >
                        <Form.Label column sm="4">Biological:</Form.Label>
                        <Col sm="8">
                            <Form.Control type="text"
                                name='biological'
                                value={chiefData.biological}
                                onChange={handleInputChange}
                                required />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-2 text-start" >
                        <Form.Label column sm="4">Psychological:  </Form.Label>
                        <Col sm="8">
                            <Form.Control type="text"
                                name='psychological'
                                value={chiefData.psychological}
                                onChange={handleInputChange}
                                required />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-2 text-start" >
                        <Form.Label column sm="4">Social / Environmental: </Form.Label>
                        <Col sm="8">
                            <Form.Control type="text"
                                name='social_environment'
                                value={chiefData.social_environment}
                                onChange={handleInputChange}
                                required />
                        </Col>
                    </Form.Group>
                </Form>

            </div>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Chief Complaint</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <li className='icon-li'>
                            <h5>The Chief Complaint:</h5>
                        </li>
                        <Form.Group as={Row} className="mb-2 text-start" >
                            <Form.Label column sm="4">Chief Complaint:  </Form.Label>
                            <Col sm="8">
                                <Form.Control type="text"
                                    name='chief_complaint'
                                    value={chiefData.chief_complaint}
                                    onChange={handleInputChange}
                                    required />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-2 text-start" >
                            <Form.Label column sm="4">Onset and Duration:  </Form.Label>
                            <Col sm="8">
                                <Form.Control type="text"
                                    name='onset_duration'
                                    value={chiefData.onset_duration}
                                    onChange={handleInputChange}
                                    required />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-2 text-start" >
                            <Form.Label column sm="4">Nature of Symptoms:  </Form.Label>
                            <Col sm="8">
                                <Form.Control type="text"
                                    name='nature_symptoms'
                                    value={chiefData.nature_symptoms}
                                    onChange={handleInputChange}
                                    required />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-2 text-start" >
                            <Form.Label column sm="4">Severity:  </Form.Label>
                            <Col sm="8">
                                <Form.Select name="severity"
                                    value={chiefData.severity}
                                    onChange={handleInputChange}
                                    required>
                                    <option>Select</option>
                                    <option value="Mild">Mild</option>
                                    <option value="Moderate">Moderate</option>
                                    <option value="Severe">Severe</option>
                                </Form.Select>
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-2 text-start" >
                            <Form.Label column sm="4">Course Type:  </Form.Label>
                            <Col sm="8">
                                <Form.Select name="course_type"
                                    value={chiefData.course_type}
                                    onChange={handleInputChange}
                                    required>
                                    <option>Select</option>
                                    <option value="Continuous">Continuous</option>
                                    <option value="Episodic">Episodic</option>
                                    <option value="Fluctuating">Fluctuating</option>
                                </Form.Select>
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-2 text-start" >
                            <Form.Label column sm="4">Nature of Illness:  </Form.Label>
                            <Col sm="8">
                                <Form.Select name="nature_illness"
                                    value={chiefData.nature_illness}
                                    onChange={handleInputChange}
                                    required>
                                    <option>Select</option>
                                    <option value="Progressive">Progressive</option>
                                    <option value="Static">Static</option>
                                    <option value="Improving">Improving</option>
                                </Form.Select>
                            </Col>
                        </Form.Group>

                        <li className='icon-li'>
                            <h5>Precipitating Factors:</h5>
                        </li>

                        <Form.Group as={Row} className="mb-2 text-start" >
                            <Form.Label column sm="4">Identify Triggers:  </Form.Label>
                            <Col sm="8">
                                <Form.Control type="text"
                                    name='identify_trigger'
                                    value={chiefData.identify_trigger}
                                    onChange={handleInputChange}
                                    required />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-2 text-start" >
                            <Form.Label column sm="4">Life Changes and Stressors:  </Form.Label>
                            <Col sm="8">
                                <Form.Control type="text"
                                    name='life_changes'
                                    value={chiefData.life_changes}
                                    onChange={handleInputChange}
                                    required />
                            </Col>
                        </Form.Group>

                        <li className='icon-li'>
                            <h5>Predisposing Factors:</h5>
                        </li>

                        <Form.Group as={Row} className="mb-2 text-start" >
                            <Form.Label column sm="4">Biological:  </Form.Label>
                            <Col sm="8">
                                <Form.Control type="text"
                                    name='biological'
                                    value={chiefData.biological}
                                    onChange={handleInputChange}
                                    required />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-2 text-start" >
                            <Form.Label column sm="4">Psychological:  </Form.Label>
                            <Col sm="8">
                                <Form.Control type="text"
                                    name='psychological'
                                    value={chiefData.psychological}
                                    onChange={handleInputChange}
                                    required />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-2 text-start" >
                            <Form.Label column sm="4">Social / Environmental:  </Form.Label>
                            <Col sm="8">
                                <Form.Control type="text"
                                    name='social_environment'
                                    value={chiefData.social_environment}
                                    onChange={handleInputChange}
                                    required />
                            </Col>
                        </Form.Group>
                        <div className="mt-3">
                            <Button variant="success" className="m-1" type="submit" onClick={(e) => handleCheifUpdate(e, chiefData.id)}>Update</Button>
                            <Button variant="secondary" className="m-1" onClick={handleClose}>Close</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default Cheif_complaint
