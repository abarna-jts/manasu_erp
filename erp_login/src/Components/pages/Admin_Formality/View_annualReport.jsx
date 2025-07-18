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
import { Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';

function View_annualReport() {
    const [report_details, setReportDetail] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);

    // Dummy function: Replace with real API call
    const fetchEventReport = async () => {
        try {
            const response = await apiRoute.get('/formality/getReport');
            setReportDetail(response.data.data); // ✅ Only set the actual data
            console.log(response);
        } catch (err) {
            console.error('Error fetching Event Report:', err);
        }
    };

    useEffect(() => {
        fetchEventReport();
    }, []);


    const userType = Cookies.get('usertype');

    const [eventData, setEventData] = useState({
        id: '',
        event_type: '',
        event_name: '',
        event_date: '',
        event_place: '',
        event_report: '',
        event_rescue_count: '',
        awareness_name: '',
        awarness_date: '',
        awarness_place: '',
        awarness_report: '',
        awarness_rescue_count: '',
        outing_name: '',
        outing_date: '',
        outing_place: '',
        outing_rescue_count: '',
        outing_report: '',
    })

    const filteredRescueDetails = report_details.filter((item) => {
        const searchTerm = searchQuery.toLowerCase();
        return (
            String(item.event_place).toLowerCase().includes(searchTerm) ||
            String(item.event_name).toLowerCase().includes(searchTerm) ||
            String(item.celebration_name).toLowerCase().includes(searchTerm) ||
            String(item.program_name).toLowerCase().includes(searchTerm) ||
            String(item.internship_duration).toLowerCase().includes(searchTerm) ||
            String(item.police_memo).toLowerCase().includes(searchTerm) ||
            String(item.staff_name).toLowerCase().includes(searchTerm) ||
            String(item.outing_name).toLowerCase().includes(searchTerm)
        );
    });

    const apiRoute = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
    });

    const handleInputChange = (e) => {
        setEventData({ ...eventData, [e.target.name]: e.target.value });
    };


    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (`0${date.getMonth() + 1}`).slice(-2);
        const day = (`0${date.getDate()}`).slice(-2);
        return `${year}-${month}-${day}`;
    };


    const navigate = useNavigate();
    const handleEditform = async (id) => {
        try {
            const response = await apiRoute.get(`/formality/getEventReportbyID/${id}`);
            const data = response.data.data; // Access the first object in the 'data' array

            setEventData({
                id: data.id || '',
                event_type: data.event_type || '',
                event_name: data.event_name || '',
                event_date: formatDate(data.event_date || ''),
                event_place: data.event_place || '',
                event_report: data.event_report || '',
                event_rescue_count: data.event_rescue_count || '',
                awareness_name: data.awareness_name || '',
                awarness_date: formatDate(data.awareness_date || ''),
                awarness_place: data.awareness_place || '',
                awarness_report: data.awarness_report || '',
                awarness_rescue_count: data.awarness_rescue_count || '',
                outing_name: data.outing_name || '',
                outing_date: formatDate(data.outing_date || ''),
                outing_place: data.outing_place || '',
                outing_report: data.outing_report || '',
            });

            const parseImageField = (fieldData) => {
                let paths = [];
                if (fieldData) {
                    try {
                        const parsed = JSON.parse(fieldData);
                        if (Array.isArray(parsed)) {
                            paths = parsed.map((p) =>
                                `http://localhost:5002/${p.replace(/"/g, '')}`
                            );
                        }
                    } catch (err) {
                        // Fallback to comma-separated string
                        paths = fieldData
                            .split(',')
                            .map((p) =>
                                `http://localhost:5002/${p.trim().replace(/^"|"$/g, '')}`
                            );
                    }
                }
                return paths;
            };

            const EventPath = parseImageField(data.event_photos);
            const AwarnessPath = parseImageField(data.awarness_photos);
            const OutingPath = parseImageField(data.outing_photos);

            setFiles((files) => ({
                ...files,
                event_photos: EventPath,
                awarness_photos: AwarnessPath,
                outing_photos: OutingPath,
            }));

            setShow(true);

        } catch (error) {
            console.error("Error fetching form data:", error);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const id = eventData.id; // ✅ Get it from form data
        console.log("Updating form with ID:", id);
        if (!id) {
            alert("ID not found.");
            return;
        }
        const data = new FormData();
        data.append('event_type', eventData.event_type);
        data.append('event_name', eventData.event_name);
        data.append('event_date', eventData.event_date);
        data.append('event_place', eventData.event_place);
        data.append('event_report', eventData.event_report);
        data.append('event_rescue_count', eventData.event_rescue_count);
        data.append('awareness_name', eventData.awareness_name);
        data.append('awarness_date', eventData.awarness_date);
        data.append('awarness_place', eventData.awarness_place);
        data.append('awarness_report', eventData.awarness_report);
        data.append('awarness_rescue_count', eventData.awarness_rescue_count);
        data.append('outing_name', eventData.outing_name);
        data.append('outing_date', eventData.outing_date);
        data.append('outing_place', eventData.outing_place);
        data.append('outing_rescue_count', eventData.outing_rescue_count);
        data.append('outing_report', eventData.outing_report);

        if (files.event_photos && files.event_photos.length > 0) {
            files.event_photos.forEach(file => {
                data.append('event_photos', file); // ✅ no []
            });
        }

        if (files.awarness_photos && files.awarness_photos.length > 0) {
            files.awarness_photos.forEach(file => {
                data.append('awarness_photos', file); // ✅ no []
            });
        }

        if (files.outing_photos && files.outing_photos.length > 0) {
            files.outing_photos.forEach(file => {
                data.append('outing_photos', file); // ✅ no []
            });
        }
        try {
            const response = await apiRoute.put(`/formality/updateEventDetail/${id}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            console.log(response.data);
            if (response.status === 200 || response.status === 201) {
                alert('Form Updated successfully!');
                handleClose(true);
                setEventData({
                    event_type: '',
                    event_name: '',
                    event_date: '',
                    event_place: '',
                    event_report: '',
                    event_rescue_count: '',
                    awareness_name: '',
                    awarness_date: '',
                    awarness_place: '',
                    awarness_report: '',
                    awarness_rescue_count: '',
                    outing_name: '',
                    outing_date: '',
                    outing_place: '',
                    outing_rescue_count: '',
                    outing_report: '',
                });
            } else {
                alert('Error Updating form.');
            }

        } catch (error) {
            console.error('There was an error Updating the form:', error);
            alert('There was an error Updating the form.');
        }
    };

    const [files, setFiles] = useState({
        event_photos: null,
        awarness_photos: null,
        outing_photos: null,
    });

    const handleFileChange = (e) => {
        setFiles({
            ...files,
            [e.target.name]: Array.from(e.target.files)  // Store all selected files as an array
        });
    };

    const fetchFormData = async (id) => {
        try {
            const response = await apiRoute.get(`/formality/getEventReportbyID/${id}`);
            const data = response.data.data;

            setEventData((eventData) => ({
                ...eventData,
                event_type: data.event_type || 'NULL',
                event_name: data.event_name || 'NULL',
                event_date: data.event_date || 'NULL',
                event_place: data.event_place || 'NULL',
                event_report: data.event_report || 'NULL',
                event_rescue_count: data.event_rescue_count || 'NULL',
                awareness_name: data.awareness_name || 'NULL',
                awarness_date: data.awareness_date || 'NULL',
                awarness_place: data.awareness_place || 'NULL',
                awarness_report: data.awarness_report || 'NULL',
                awarness_rescue_count: data.awarness_rescue_count || 'NULL',
                outing_name: data.outing_name || 'NULL',
                outing_date: data.outing_date || 'NULL',
                outing_place: data.outing_place || 'NULL',
                outing_report: data.outing_report || 'NULL',

            }));

            let EventImage = [];
            if (data.event_photos) {
                try {
                    const parsed = JSON.parse(data.event_photos);
                    if (Array.isArray(parsed)) {
                        EventImage = parsed.map((p) => `http://localhost:5002/${p.replace(/"/g, '')}`);
                    }
                } catch (err) {
                    console.warn('Failed to parse signature:', err);
                    // Fallback: comma-separated string
                    EventImage = data.event_photos
                        .split(',')
                        .map((p) => `http://localhost:5002/${p.trim().replace(/^"|"$/g, '')}`);
                }
            }

            let AwarnessPhoto = [];
            if (data.awarness_photos) {
                try {
                    const parsed = JSON.parse(data.awarness_photos);
                    if (Array.isArray(parsed)) {
                        AwarnessPhoto = parsed.map((p) => `http://localhost:5002/${p.replace(/"/g, '')}`);
                    }
                } catch (err) {
                    console.warn('Failed to parse signature:', err);
                    // Fallback: comma-separated string
                    AwarnessPhoto = data.awarness_photos
                        .split(',')
                        .map((p) => `http://localhost:5002/${p.trim().replace(/^"|"$/g, '')}`);
                }
            }

            let OutingPhoto = [];
            if (data.outing_photos) {
                try {
                    const parsed = JSON.parse(data.outing_photos);
                    if (Array.isArray(parsed)) {
                        OutingPhoto = parsed.map((p) => `http://localhost:5002/${p.replace(/"/g, '')}`);
                    }
                } catch (err) {
                    console.warn('Failed to parse signature:', err);
                    // Fallback: comma-separated string
                    OutingPhoto = data.outing_photos
                        .split(',')
                        .map((p) => `http://localhost:5002/${p.trim().replace(/^"|"$/g, '')}`);
                }
            }

            // Base path for images
            // const basePath = "https://www.pahrultours.com/app2/uploads/Event_Photos";
            // const EventImage = data.event_photos ? `https://www.pahrultours.com/app2/${data.event_photos}` : null;
            // const AwarnessPhoto = data.awarness_photos ? `https://www.pahrultours.com/app2/${data.awarness_photos}` : null;
            // const OutingPhoto = data.outing_photos ? `https://www.pahrultours.com/app2/${data.outing_photos}` : null;

            console.log("Event Image Path", EventImage);
            console.log("Awarness Image Path", AwarnessPhoto);
            console.log("Outing Image Path", OutingPhoto);
            // Set files state
            setFiles((files) => ({
                ...files,
                event_photos: EventImage,
                awarness_photos: AwarnessPhoto,
                outing_photos: OutingPhoto
            }));

            setTimeout(() => {
                generatePDF();
            }, 500);

        } catch (error) {
            console.error("Error fetching form data:", error);
        }
    }
    const formRef = useRef();

    const generatePDF = async () => {
        const input = formRef.current;
        if (!input) {
            console.error("Form reference is not defined");
            return;
        }

        try {
            const canvas = await html2canvas(input, { scale: 2, useCORS: true });
            const imgData = canvas.toDataURL("image/png");

            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            const imgProps = pdf.getImageProperties(imgData);
            const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

            let heightLeft = imgHeight;
            let position = 0;

            while (heightLeft > 0) {
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
                heightLeft -= pdfHeight;
                if (heightLeft > 0) {
                    pdf.addPage();
                    position = -imgHeight + heightLeft;
                }
            }

            const pdfBlob = pdf.output('blob');
            const pdfUrl = URL.createObjectURL(pdfBlob);
            window.open(pdfUrl, '_blank');
        } catch (err) {
            console.error("Error generating PDF:", err);
            alert("Failed to generate PDF.");
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
            <Col md={3}>
                <Button type='button' className='btn btn-success' onClick={() => window.history.back()}>Back</Button>
            </Col>
            <Container>
                <>
                    <Row>
                        <Col md={12}>
                            <Table responsive="sm">
                                <thead>
                                    <tr>
                                        <th>S.No</th>
                                        <th>Event Name</th>
                                        <th>Event Place</th>
                                        <th>Awareness Camp</th>
                                        <th>Awareness Place</th>
                                        <th>Name of the Outing Program</th>
                                        <th>Outing Place</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredRescueDetails.length > 0 ? (
                                        filteredRescueDetails.map((item, index) => (
                                            <tr key={item.id}>
                                                <td>{index + 1}</td>
                                                <td>{item.event_name || "null"}</td>
                                                <td>{item.event_place || "null"}</td>
                                                <td>{item.awareness_name || "null"}</td>
                                                <td>{item.awareness_place || "null"}</td>
                                                <td>{item.outing_name || "null"}</td>
                                                <td>{item.outing_place || "null"}</td>
                                                <td>
                                                    <Button
                                                        className="btn btn-success icon_details"
                                                        onClick={() => fetchFormData(item.id)}
                                                    >
                                                        <i className="fas fa-eye"></i>
                                                    </Button>
                                                    <Button
                                                        className="btn btn-primary icon_details"
                                                        onClick={() => handleEditform(item.id)}
                                                    >
                                                        <i className="fas fa-edit"></i>
                                                    </Button>
                                                    {/* {userType === "2" && (
                                                            <Button
                                                                className="btn btn-danger icon_details"
                                                                onClick={() => handleDelete(item.id)}
                                                            >
                                                                <i className="fas fa-trash"></i>
                                                            </Button>
                                                        )} */}
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

            </Container>

            <div ref={formRef} style={{ position: "absolute", left: "-9999px", top: 0, background: "#fff", padding: "20px", width: "210mm" }}>
                <Row>
                    <Col md={2}>
                        <img src={manasu_logo} className="pdf_logo" alt="" />
                    </Col>
                    <Col md={10}>
                        <h4 className="pdf_heading text-center">EVENT / AWARNESS / OUTING DETAILS REPORT</h4>
                    </Col>
                </Row>
                <Container>
                    <h5 className='text-start'>Event Report</h5>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm="5" className='text-start'>Event Type:</Form.Label>
                        <Col sm="7">
                            <Form.Control
                                type="text"
                                name="event_type"
                                value={eventData.event_type}
                                onChange={handleInputChange}
                                required
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm="5" className='text-start'>Name of the Event:</Form.Label>
                        <Col sm="7">
                            <Form.Control
                                type="text"
                                name="event_name"
                                value={eventData.event_name}
                                onChange={handleInputChange}
                                required
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm="5" className='text-start'>Date:</Form.Label>
                        <Col sm="7">
                            <Form.Control
                                type="date"
                                name="event_date"
                                max="9999-12-31"
                                value={formatDate(eventData.event_date)}
                                onChange={handleInputChange}
                                required
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm="5" className='text-start'>Venue:</Form.Label>
                        <Col sm="7">
                            <Form.Control
                                type="text"
                                name="event_place"
                                value={eventData.event_place}
                                onChange={handleInputChange}
                                required
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm="5" className='text-start'>No. of Participants:</Form.Label>
                        <Col sm="7">
                            <Form.Control
                                type="text"
                                name="event_rescue_count"
                                value={eventData.event_rescue_count}
                                onChange={handleInputChange}
                                required
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm="5" className='text-start'>Attach Photos:</Form.Label>
                        <Col sm="7">
                            {Array.isArray(files.event_photos) &&
                                files.event_photos.map((imgUrl, index) => (
                                    <img
                                        key={index}
                                        src={imgUrl}
                                        alt={`event_photos - ${index}`}
                                        style={{
                                            width: "100px",
                                            height: "100px",
                                            objectFit: "cover",
                                            margin: "10px",
                                            border: "1px solid #ccc",
                                        }}
                                        onError={(e) => {
                                            e.target.src = "/fallback-image.png";
                                        }}
                                    />
                                ))}
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm="5" className='text-start'>Event Report:</Form.Label>
                        <Col sm="7">
                            <Form.Control
                                as="textarea"
                                name="event_report"
                                rows={3}
                                value={eventData.event_report}
                                onChange={handleInputChange}
                                required
                            />
                        </Col>
                    </Form.Group>
                    <h5 className='text-start'>Awarness Report</h5>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm="5" className='text-start'>Awareness Camp Name:</Form.Label>
                        <Col sm="7">
                            <Form.Control
                                type="text"
                                name="awareness_name"
                                value={eventData.awareness_name}
                                onChange={handleInputChange}
                                required
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm="5" className='text-start'>Date:</Form.Label>
                        <Col sm="7">
                            <Form.Control
                                type="date"
                                name="awarness_date"
                                value={formatDate(eventData.awarness_date)}
                                max="9999-12-31"
                                onChange={handleInputChange}
                                required
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm="5" className='text-start'>Venue:</Form.Label>
                        <Col sm="7">
                            <Form.Control
                                type="text"
                                name="awarness_place"
                                value={eventData.awarness_place}
                                onChange={handleInputChange}
                                required
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm="5" className='text-start'>No. of Participants:</Form.Label>
                        <Col sm="7">
                            <Form.Control
                                type="text"
                                name="awarness_rescue_count"
                                value={eventData.awarness_rescue_count}
                                onChange={handleInputChange}
                                required
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm="5" className='text-start'>Attach Photos:</Form.Label>
                        <Col sm="7">
                            {Array.isArray(files.awarness_photos) &&
                                files.awarness_photos.map((imgUrl, index) => (
                                    <img
                                        key={index}
                                        src={imgUrl}
                                        alt={`awarness_photos - ${index}`}
                                        style={{
                                            width: "100px",
                                            height: "100px",
                                            objectFit: "cover",
                                            margin: "10px",
                                            border: "1px solid #ccc",
                                        }}
                                        onError={(e) => {
                                            e.target.src = "/fallback-image.png";
                                        }}
                                    />
                                ))}
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm="5" className='text-start'>Awareness Report:</Form.Label>
                        <Col sm="7">
                            <Form.Control
                                as="textarea"
                                name="awarness_report"
                                rows={3}
                                value={eventData.awarness_report}
                                onChange={handleInputChange}
                                required
                            />
                        </Col>
                    </Form.Group>
                    <h5 className='text-start'>Outing Report</h5>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm="5" className='text-start'>Outing Name:</Form.Label>
                        <Col sm="7">
                            <Form.Control
                                type="text"
                                name="outing_name"
                                value={eventData.outing_name}
                                onChange={handleInputChange}
                                required
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm="5" className='text-start'>Date:</Form.Label>
                        <Col sm="7">
                            <Form.Control
                                type="date"
                                name="outing_date"
                                value={formatDate(eventData.outing_date)}
                                max="9999-12-31"
                                onChange={handleInputChange}
                                required
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm="5" className='text-start'>Venue:</Form.Label>
                        <Col sm="7">
                            <Form.Control
                                type="text"
                                name="outing_place"
                                value={eventData.outing_place}
                                onChange={handleInputChange}
                                required
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm="5" className='text-start'>No. of Participants:</Form.Label>
                        <Col sm="7">
                            <Form.Control
                                type="text"
                                name="outing_rescue_count"
                                value={eventData.outing_rescue_count}
                                onChange={handleInputChange}
                                required
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm="5" className='text-start'>Attach Photos:</Form.Label>
                        <Col sm="7">
                            {Array.isArray(files.outing_photos) &&
                                files.outing_photos.map((imgUrl, index) => (
                                    <img
                                        key={index}
                                        src={imgUrl}
                                        alt={`outing_photos - ${index}`}
                                        style={{
                                            width: "100px",
                                            height: "100px",
                                            objectFit: "cover",
                                            margin: "10px",
                                            border: "1px solid #ccc",
                                        }}
                                        onError={(e) => {
                                            e.target.src = "/fallback-image.png";
                                        }}
                                    />
                                ))}
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm="5" className='text-start'>Outing Report:</Form.Label>
                        <Col sm="7">
                            <Form.Control
                                as="textarea"
                                name="outing_report"
                                rows={3}
                                value={eventData.outing_report}
                                onChange={handleInputChange}
                                required
                            />
                        </Col>
                    </Form.Group>
                </Container>
            </div>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Event/Awarness/Outing Report</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Col md={12}>
                        <Form>
                            {/* Dropdown for selecting type */}
                            <h5>Event Report</h5>
                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="5" className='text-start'>Event Type:</Form.Label>
                                <Col sm="7">
                                    <Form.Control
                                        type="text"
                                        name="event_type"
                                        value={eventData.event_type || "NULL"}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="5" className='text-start'>Name of the Event:</Form.Label>
                                <Col sm="7">
                                    <Form.Control
                                        type="text"
                                        name="event_name"
                                        value={eventData.event_name || "NULL"}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="5" className='text-start'>Date:</Form.Label>
                                <Col sm="7">
                                    <Form.Control
                                        type="date"
                                        name="event_date"
                                        max="9999-12-31"
                                        value={eventData.event_date || "NULL"}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="5" className='text-start'>Venue:</Form.Label>
                                <Col sm="7">
                                    <Form.Control
                                        type="text"
                                        name="event_place"
                                        value={eventData.event_place || "NULL"}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="5" className='text-start'>No. of Participants:</Form.Label>
                                <Col sm="7">
                                    <Form.Control
                                        type="text"
                                        name="event_rescue_count"
                                        value={eventData.event_rescue_count || "NULL"}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="5" className='text-start'>Attach Photos:</Form.Label>
                                <Col sm="7">
                                    {Array.isArray(files.event_photos) &&
                                        files.event_photos.map((imgUrl, index) => (
                                            <img
                                                key={index}
                                                src={imgUrl}
                                                alt={`event_photos - ${index}`}
                                                loading="lazy"
                                                style={{
                                                    width: "100px",
                                                    height: "100px",
                                                    objectFit: "cover",
                                                    margin: "10px",
                                                    border: "1px solid #ccc",
                                                }}
                                                onError={(e) => {
                                                    if (!e.target.dataset.errorHandled) {
                                                        e.target.src = "/fallback-image.png";
                                                        e.target.dataset.errorHandled = "true";
                                                    }
                                                }}
                                            />
                                        ))}
                                    <Form.Control
                                        type="file"
                                        accept=".jpg,.jpeg,.png"
                                        name="event_photos"
                                        onChange={handleFileChange}
                                        multiple
                                    />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="5" className='text-start'>Event Report:</Form.Label>
                                <Col sm="7">
                                    <Form.Control
                                        as="textarea"
                                        name="event_report"
                                        rows={3}
                                        value={eventData.event_report || "NULL"}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>
                            <h5>Awarness Report</h5>
                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="5" className='text-start'>Awareness Camp Name:</Form.Label>
                                <Col sm="7">
                                    <Form.Control
                                        type="text"
                                        name="awareness_name"
                                        value={eventData.awareness_name || "NULL"}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="5" className='text-start'>Date:</Form.Label>
                                <Col sm="7">
                                    <Form.Control
                                        type="date"
                                        name="awarness_date"
                                        max="9999-12-31"
                                        value={eventData.awarness_date || "NULL"}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="5" className='text-start'>Venue:</Form.Label>
                                <Col sm="7">
                                    <Form.Control
                                        type="text"
                                        name="awarness_place"
                                        value={eventData.awarness_place || "NULL"}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="5" className='text-start'>No. of Participants:</Form.Label>
                                <Col sm="7">
                                    <Form.Control
                                        type="text"
                                        name="awarness_rescue_count"
                                        value={eventData.awarness_rescue_count || "NULL"}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="5" className='text-start'>Attach Photos:</Form.Label>
                                <Col sm="7">
                                    {Array.isArray(files.awarness_photos) &&
                                        files.awarness_photos.map((imgUrl, index) => (
                                            <img
                                                key={index}
                                                src={imgUrl}
                                                alt={`awarness_photos - ${index}`}
                                                loading="lazy"
                                                style={{
                                                    width: "100px",
                                                    height: "100px",
                                                    objectFit: "cover",
                                                    margin: "10px",
                                                    border: "1px solid #ccc",
                                                }}
                                                onError={(e) => {
                                                    if (!e.target.dataset.errorHandled) {
                                                        e.target.src = "/fallback-image.png";
                                                        e.target.dataset.errorHandled = "true";
                                                    }
                                                }}
                                            />
                                        ))}
                                    <Form.Control
                                        type="file"
                                        accept=".jpg,.jpeg,.png"
                                        name="awarness_photos"
                                        onChange={handleFileChange}
                                        multiple
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="5" className='text-start'>Awareness Report:</Form.Label>
                                <Col sm="7">
                                    <Form.Control
                                        as="textarea"
                                        name="awarness_report"
                                        rows={3}
                                        value={eventData.awarness_report || "NULL"}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>
                            <h5>Outing Report</h5>
                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="5" className='text-start'>Outing Name:</Form.Label>
                                <Col sm="7">
                                    <Form.Control
                                        type="text"
                                        name="outing_name"
                                        value={eventData.outing_name || "NULL"}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="5" className='text-start'>Date:</Form.Label>
                                <Col sm="7">
                                    <Form.Control
                                        type="date"
                                        name="outing_date"
                                        max="9999-12-31"
                                        value={eventData.outing_date} // remove || "NULL"
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="5" className='text-start'>Venue:</Form.Label>
                                <Col sm="7">
                                    <Form.Control
                                        type="text"
                                        name="outing_place"
                                        value={eventData.outing_place || "NULL"}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="5" className='text-start'>No. of Participants:</Form.Label>
                                <Col sm="7">
                                    <Form.Control
                                        type="text"
                                        name="outing_rescue_count"
                                        value={eventData.outing_rescue_count || "NULL"}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="5" className='text-start'>Attach Photos:</Form.Label>
                                <Col sm="7">
                                    {Array.isArray(files.outing_photos) &&
                                        files.outing_photos.map((imgUrl, index) => (
                                            <img
                                                key={index}
                                                src={imgUrl}
                                                alt={`outing_photos - ${index}`}
                                                loading="lazy"
                                                style={{
                                                    width: "100px",
                                                    height: "100px",
                                                    objectFit: "cover",
                                                    margin: "10px",
                                                    border: "1px solid #ccc",
                                                }}
                                                onError={(e) => {
                                                    if (!e.target.dataset.errorHandled) {
                                                        e.target.src = "/fallback-image.png";
                                                        e.target.dataset.errorHandled = "true";
                                                    }
                                                }}
                                            />
                                        ))}
                                    <Form.Control
                                        type="file"
                                        accept=".jpg,.jpeg,.png"
                                        name="outing_photos"
                                        onChange={handleFileChange}
                                        multiple
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="5" className='text-start'>Outing Report:</Form.Label>
                                <Col sm="7">
                                    <Form.Control
                                        as="textarea"
                                        name="outing_report"
                                        rows={3}
                                        value={eventData.outing_report || "NULL"}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>

                            <Col md={12} className='d-flex align-items-center justify-content-between'>
                                <div className="mt-3 d-flex align-tems-cente justify-content-between">
                                    <Button variant="success" className="m-1" type="button" onClick={handleUpdate}>Update</Button>
                                    <Button variant="secondary" className="m-1" type="button" onClick={handleClose}>
                                        Close
                                    </Button>
                                </div>

                            </Col>
                        </Form>
                    </Col>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default View_annualReport
