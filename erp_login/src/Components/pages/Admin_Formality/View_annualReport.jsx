import React from 'react'
import { Breadcrumb, Form, InputGroup, Container, Row, Col, Table } from '@themesberg/react-bootstrap';
import { useState, useEffect } from "react";
import axios from 'axios';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useRef } from "react";
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import manasu_logo from "../Admission/Manasu-Logo.png";
import { useLocation } from 'react-router-dom';

function View_annualReport() {
    const [report_details, setReportDetail] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [previewRequested, setPreviewRequested] = useState(false);
    const location = useLocation();
    const reportType = location.state?.reportType;

    const [reportData, setReportData] = useState([]);

    // Dummy function: Replace with real API call
    const fetchEventReport = async () => {
        try {
            const response = await fetch('/formality/getReport');
            const result = await response.json();
            setReportData(result.data); // ✅ Corrected
        } catch (err) {
            console.error('Error fetching Event Report:', err);
        }
    };


    // Dummy function: Replace with real API call
    const fetchCelebrationReport = async () => {
        try {
            // Replace with your actual API call
            const response = await fetch('/api/celebration-report');
            const data = await response.json();
            setReportData(data);
        } catch (err) {
            console.error('Error fetching Celebration Report:', err);
        }
    };

    useEffect(() => {
        if (reportType === 'event') {
            fetchEventReport();
        } else if (reportType === 'celebration') {
            fetchCelebrationReport();
        }
    }, [reportType]);

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
        staff_report: ''
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
                const response = await apiRoute.get('/formality/getReport'); // You’re using axios for apiRoute
                setReportData(response.data.data);
            } catch (err) {
                console.error('Error fetching Event Report:', err);
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
                {reportType === 'event' ? (
                    <>
                        <Row>
                            <Col md={12}>
                                <Table responsive="sm">
                                    <thead>
                                        <tr>
                                            <th>S.No</th>
                                            <th>Event Type</th>
                                            <th>Event Name</th>
                                            <th>Awareness Camp</th>
                                            <th>Name of the Outing Program</th>
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
                                                    <td>{item.staff_name || "null"}</td>
                                                    <td>
                                                        <button
                                                            className="btn btn-success icon_details"
                                                            onClick={() => fetchFormData(item.id)}
                                                        >
                                                            <i className="fas fa-eye"></i>
                                                        </button>
                                                        <button
                                                            className="btn btn-primary icon_details"
                                                            onClick={() => handleEditform(item.id)}
                                                        >
                                                            <i className="fas fa-edit"></i>
                                                        </button>
                                                        {userType === "2" && (
                                                            <button
                                                                className="btn btn-danger icon_details"
                                                                onClick={() => handleDelete(item.id)}
                                                            >
                                                                <i className="fas fa-trash"></i>
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="10" className="text-center text-danger">
                                                    No data found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </Col>
                        </Row>
                    </>
                ) : (
                    <>
                        <h2>Celebration Report</h2>
                        {/* Render celebration-specific table here */}
                    </>
                )}

            </Container>
        </>
    )
}

export default View_annualReport
