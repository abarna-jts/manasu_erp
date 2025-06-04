import React from 'react'
import { Breadcrumb, Form, InputGroup, Container, Row, Col, Table } from '@themesberg/react-bootstrap';
import { useState, useEffect } from "react";
import axios from 'axios';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useRef } from "react";
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import manasu_logo from "../Admission/manasu_logo.png";

function View_annualReport() {
    const [report_details, setReportDetail] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [previewRequested, setPreviewRequested] = useState(false);

    const userType = Cookies.get('usertype');

    const [formData, setFormData] = useState({
        event_type: '',
        event_name: '',
        event_date: '',
        event_place: '',
        event_report: '',
        event_rescue_count: '',
        celebration_name: '',
        celebration_date: '',
        celebration_place: '',
        celebration_rescue_count: '',
        celebration_report: '',
        program_name: '',
        program_date: '',
        program_place: '',
        program_rescue_count: '',
        program_report: '',
        staff_name: '',
        staff_date: '',
        staff_place: '',
        staff_rescue_count: '',
        staff_report:''
    })

    const filteredRescueDetails = report_details.filter((item) => {
        const searchTerm = searchQuery.toLowerCase();
        return (
            String(item.event_name).toLowerCase().includes(searchTerm) ||
            String(item.celebration_name).toLowerCase().includes(searchTerm) ||
            String(item.program_name).toLowerCase().includes(searchTerm) ||
            String(item.internship_duration).toLowerCase().includes(searchTerm) ||
            String(item.police_memo).toLowerCase().includes(searchTerm) ||
            String(item.staff_name).toLowerCase().includes(searchTerm)
        );
    });

    const apiRoute = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    useEffect(() => {
    const fetchAnnualReport = async () => {
        try {
            const response = await apiRoute.get('/formality/getReport');
            setReportDetail(response.data.data); // Should be an array
        } catch (error) {
            console.error("Error fetching annual report:", error);
        }
    };

    fetchAnnualReport();
}, []);


    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (`0${date.getMonth() + 1}`).slice(-2); // Month is 0-indexed
        const day = (`0${date.getDate()}`).slice(-2);
        return `${year}-${month}-${day}`;
    };


    const fetchFormData = async (id) => {
        try {
            const response = await apiRoute.get(`/formality/getAnnualReport/${id}`);
            const data = response.data;

            setFormData((formData) => ({
                ...formData,
                event_type: data.event_type || '',
                event_name: data.event_name || '',
                event_date: data.event_date || '',
                event_place: data.event_place || '',
                event_rescue_count: data.event_rescue_count || '',
                celebration_name: data.celebration_name || '',
                celebration_date: data.celebration_date || '',
                celebration_place: data.celebration_place || '',
                celebration_rescue_count: data.celebration_rescue_count || '',
                program_name: data.program_name || '',
                program_date: data.program_date || '',
                program_place: data.program_place || '',
                program_rescue_count: data.program_rescue_count || '',
                internship_duration: data.internship_duration || '',
                internship_date: data.internship_date || '',
                internship_place: data.internship_place || '',
                internship_rescue_count: data.internship_rescue_count || '',
                staff_name: data.staff_name || '',
                staff_date: data.staff_date || '',
                staff_place: data.staff_place || '',
                staff_rescue_count: data.staff_rescue_count || '',
            }));

            setPreviewRequested(true); // trigger the effect after state updates
        } catch (error) {
            console.error("Error fetching form data:", error);
            alert("Admission Number not found");
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

    const navigate = useNavigate();
    const handleEditform = (id) => {
        navigate(`/edit_annual_report/${id}`);
    };

    const handleDelete = async (id) => {
        alert("Are you sure want to delete");
        try {
            const response = await apiRoute.delete(`/formality/deleteAnnualReport/${id}`);
            console.log(response);
            alert("Annual Report Deleted successfully");
        } catch (error) {
            console.error('Failed to delete item:', error);
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
                            <Breadcrumb.Item active>Admin Formality</Breadcrumb.Item>
                        </Breadcrumb>
                        <h6 className="breadcrumb_title">Report</h6>
                    </Col>
                    <Col md={8} className="text-start mb-4">
                        <h3 className="section_title text-center">Resident Activities and Events Report Detail</h3>
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

            <Container>
                <Row>
                    <Col md={12}>
                        <Table responsive="sm">

                            <thead>
                                <tr>
                                    <th>S.No</th>
                                    <th>Event Type</th>
                                    <th>Event Name</th>
                                    <th>Awarness Camp</th>
                                    <th>Name of the Outing program</th>
                                    <th>General Celebration</th>
                                    <th>Community Programs</th>
                                    <th>Staff Programs</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRescueDetails.length > 0 ? (
                                    filteredRescueDetails.map((item, index) => (
                                        <tr key={item.id}>
                                            <td>{index + 1}</td>
                                            <td>{item.event_type}</td>
                                            <td>{item.event_name || "null"}</td>
                                            <td>{item.awareness_name || "null"}</td>
                                            <td>{item.outing_name || "null"}</td>
                                            <td>{item.celebration_name || "null"}</td>
                                            <td>{item.program_name || "null"}</td>
                                            {/* <td>{item.internship_duration || "null"}</td> */}
                                            <td>{item.staff_name || "null"}</td>
                                            <td>
                                                <button className="btn btn-success icon_details"
                                                    onClick={() => {
                                                        fetchFormData(item.id);
                                                    }}
                                                >
                                                    <i className="fas fa-eye"></i>
                                                </button>
                                                <button className="btn btn-primary icon_details"
                                                    onClick={() => {
                                                        handleEditform(item.id);
                                                    }}
                                                ><i className="fas fa-edit"></i> </button>
                                                {userType === "2" && (
                                                    <button className="btn btn-danger icon_details"
                                                        onClick={() => {
                                                            handleDelete(item.id);
                                                        }}
                                                    >
                                                        <i className="fas fa-trash"></i>
                                                    </button>
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
                    </Col>
                </Row>
            </Container>

            <div ref={formRef} style={{ position: "absolute", left: "-9999px", top: 0, background: "#fff", padding: "20px", width: "210mm" }}>

                <Container>
                    <Row className="d-flex align-items-center justify-content-center mb-2">
                        <Col md={3} className='d-flex align-items-center pdf_logo'>
                            <img src={manasu_logo} className="pdf_logo" alt="" />
                            <div className="logo_text">
                                <h4><span>MANASU</span> <br />Mental Health Charity Home <br />Chennai,</h4>
                            </div>
                        </Col>
                        <Col md={9}>
                            <h4 className="text-center">Resident Activities and Events Report Form (Annual)</h4>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={10}>
                            <Form>
                                <Col md={8} className="text-start">
                                    <h5 className="pdfsub_heading">Event / Awarness/ Outing Details</h5>
                                </Col>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="6" className='text-start'>Event Type:</Form.Label>
                                    <Col sm="6">
                                        <Form.Control type="text"
                                            name="event_type"
                                            value={formData.event_type || "Null"}
                                            onChange={handleInputChange}
                                            required />
                                    </Col>
                                </Form.Group>
                                {formData.event_type === 'event' && (
                                    <>
                                        <Form.Group as={Row} className="mb-3">
                                            <Form.Label column sm="4" className='text-start'>Name of the Event:</Form.Label>
                                            <Col sm="8">
                                                <Form.Control
                                                    type="text"
                                                    name="event_name"
                                                    value={formData.event_name || "Null"}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </Col>
                                        </Form.Group>
                                        <Form.Group as={Row} className="mb-3">
                                            <Form.Label column sm="4" className='text-start'>Date:</Form.Label>
                                            <Col sm="8">
                                                <Form.Control
                                                    type="date"
                                                    name="event_date"
                                                    value={formData.event_date || "Null"}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </Col>
                                        </Form.Group>
                                        <Form.Group as={Row} className="mb-3">
                                            <Form.Label column sm="4" className='text-start'>Venue:</Form.Label>
                                            <Col sm="8">
                                                <Form.Control
                                                    type="text"
                                                    name="event_place"
                                                    value={formData.event_place || "Null"}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </Col>
                                        </Form.Group>
                                        <Form.Group as={Row} className="mb-3">
                                            <Form.Label column sm="4" className='text-start'>No. of Participants:</Form.Label>
                                            <Col sm="8">
                                                <Form.Control
                                                    type="text"
                                                    name="event_rescue_count"
                                                    value={formData.event_rescue_count || "Null"}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </Col>
                                        </Form.Group>
                                        <Form.Group as={Row} className="mb-3">
                                            <Form.Label column sm="4" className='text-start'>Event Report:</Form.Label>
                                            <Col sm="8">
                                                <Form.Control
                                                    as="textarea"
                                                    name="event_report"
                                                    rows={3}
                                                    value={formData.event_report || "Null"}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </Col>
                                        </Form.Group>
                                    </>

                                )}
                                {formData.event_type === 'awarness' && (
                                    <>
                                        <Form.Group as={Row} className="mb-3">
                                            <Form.Label column sm="4" className='text-start'>Awareness Report:</Form.Label>
                                            <Col sm="8">
                                                <Form.Control
                                                    as="textarea"
                                                    name="awarness_report"
                                                    rows={3}
                                                    value={formData.awarness_report || "Null"}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </Col>
                                        </Form.Group>
                                    </>
                                )}
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="6" className='text-start'>
                                        Name of the Event: :
                                    </Form.Label>
                                    <Col sm="6">
                                        <Form.Control type="text"
                                            name="event_name"
                                            value={formData.event_name || "Null"}
                                            onChange={handleInputChange}
                                            required />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="6" className='text-start'>
                                        Date :
                                    </Form.Label>
                                    <Col sm="6">
                                        <Form.Control type="date"
                                            name="event_date"
                                            value={formatDate(formData.event_date) || "Null"}
                                            onChange={handleInputChange}
                                            required />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="6" className='text-start'>
                                        Venue :
                                    </Form.Label>
                                    <Col sm="6">
                                        <Form.Control type="text"
                                            name="event_place"
                                            value={formData.event_place || "Null"}
                                            onChange={handleInputChange}
                                            required />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="6" className='text-start'>
                                        No. of Participants
                                    </Form.Label>
                                    <Col sm="6">
                                        <Form.Control type="text"
                                            name="event_rescue_count"
                                            value={formData.event_rescue_count || "Null"}
                                            onChange={handleInputChange}
                                            required />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="4" className='text-start'>Event Report:</Form.Label>
                                    <Col sm="8">
                                        <Form.Control
                                            as="textarea"
                                            name="event_report"
                                            rows={3}
                                            value={formData.event_report}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </Col>
                                </Form.Group>
                                <Col md={12} className="text-start">
                                    <h5 className="pdfsub_heading">General Celebration Details</h5>
                                </Col>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="6" className='text-start'>
                                        Name of the Celebration :
                                    </Form.Label>
                                    <Col sm="6">
                                        <Form.Control type="text"
                                            name="celebration_name"
                                            value={formData.celebration_name || "Null"}
                                            onChange={handleInputChange}
                                            required />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="6" className='text-start'>
                                        Date:
                                    </Form.Label>
                                    <Col sm="6">
                                        <Form.Control type="date"
                                            name="celebration_date"
                                            value={formatDate(formData.celebration_date) || "Null"}
                                            onChange={handleInputChange}
                                            required />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="6" className='text-start'>
                                        Venue :
                                    </Form.Label>
                                    <Col sm="6">
                                        <Form.Control type="text"
                                            name="celebration_place"
                                            value={formData.celebration_place || "Null"}
                                            onChange={handleInputChange}
                                            required />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="6" className='text-start'>
                                        No. of Participants
                                    </Form.Label>
                                    <Col sm="6">
                                        <Form.Control type="text"
                                            name="celebration_rescue_count"
                                            value={formData.celebration_rescue_count || "Null"}
                                            onChange={handleInputChange}
                                            required />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="4" className='text-start'>Celebration Report:</Form.Label>
                                    <Col sm="8">
                                        <Form.Control
                                            as="textarea"
                                            name="celebration_report"
                                            rows={3}
                                            value={formData.celebration_report}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </Col>
                                </Form.Group>
                                <Col md={12} className="text-start">
                                    <h5 className="pdfsub_heading">Community Programs</h5>
                                </Col>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="6" className='text-start'>
                                        Name of the Program :
                                    </Form.Label>
                                    <Col sm="6">
                                        <Form.Control type="text"
                                            name="program_name"
                                            value={formData.program_name || "Null"}
                                            onChange={handleInputChange}
                                            required />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="4" className='text-start'>
                                        College Name :
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control type="text"
                                            name="clg_name"
                                            value={formData.clg_name}
                                            onChange={handleInputChange}
                                            required />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="4" className='text-start'>
                                        College Department :
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control type="text"
                                            name="clg_dept"
                                            value={formData.clg_dept}
                                            onChange={handleInputChange}
                                            required />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="4" className='text-start'>
                                        Resource Person :
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control type="text"
                                            name="resource_person"
                                            value={formData.resource_person}
                                            onChange={handleInputChange}
                                            required />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="6" className='text-start'>
                                        Date:
                                    </Form.Label>
                                    <Col sm="6">
                                        <Form.Control type="date"
                                            name="program_date"
                                            value={formatDate(formData.program_date) || "Null"}
                                            onChange={handleInputChange}
                                            required />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="6" className='text-start'>
                                        Venue :
                                    </Form.Label>
                                    <Col sm="6">
                                        <Form.Control type="text"
                                            name="program_place"
                                            value={formData.program_place || "Null"}
                                            onChange={handleInputChange}
                                            required />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="6" className='text-start'>
                                        No. of Participants :
                                    </Form.Label>
                                    <Col sm="6">
                                        <Form.Control type="text"
                                            name="program_rescue_count"
                                            value={formData.program_rescue_count || "Null"}
                                            onChange={handleInputChange}
                                            required />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="4" className='text-start'>Report:</Form.Label>
                                    <Col sm="8">
                                        <Form.Control
                                            as="textarea"
                                            name="program_report"
                                            rows={3}
                                            value={formData.program_report}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </Col>
                                </Form.Group>

                                <Col md={12} className="text-start mt-5">
                                    <h5 className="pdfsub_heading">Staff Programs</h5>
                                </Col>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="6" className='text-start'>
                                        Name of the Programs  :
                                    </Form.Label>
                                    <Col sm="6">
                                        <Form.Control type="text"
                                            name="staff_name"
                                            value={formData.staff_name || "Null"}
                                            onChange={handleInputChange}
                                            required />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="6" className='text-start'>
                                        Date:
                                    </Form.Label>
                                    <Col sm="6">
                                        <Form.Control type="date"
                                            name="staff_date"
                                            value={formatDate(formData.staff_date) || "Null"}
                                            onChange={handleInputChange}
                                            required />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="6" className='text-start'>
                                        Venue :
                                    </Form.Label>
                                    <Col sm="6">
                                        <Form.Control type="text"
                                            name="staff_place"
                                            value={formData.staff_place || "Null"}
                                            onChange={handleInputChange}
                                            required />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="6" className='text-start'>
                                        No. of Participants
                                    </Form.Label>
                                    <Col sm="6">
                                        <Form.Control type="text"
                                            name="staff_rescue_count"
                                            value={formData.staff_rescue_count || "Null"}
                                            onChange={handleInputChange}
                                            required />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="4" className='text-start'>Report:</Form.Label>
                                    <Col sm="8">
                                        <Form.Control
                                            as="textarea"
                                            name="staff_report"
                                            rows={3}
                                            value={formData.staff_report}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </Col>
                                </Form.Group>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    )
}

export default View_annualReport
