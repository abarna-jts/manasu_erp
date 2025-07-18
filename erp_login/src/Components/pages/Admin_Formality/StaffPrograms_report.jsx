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
import { Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';

function StaffPrograms_report() {
    const [staffprogramms_details, setStaffProgramsDetail] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [previewRequested, setPreviewRequested] = useState(false);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);

    // Dummy function: Replace with real API call
    const fetchStaffProgramsReport = async () => {
        try {
            const response = await apiRoute.get('/formality/getStaffProgramsReport');
            setStaffProgramsDetail(response.data.data); // ✅ Only set the actual data
            console.log(response);
        } catch (err) {
            console.error('Error fetching Staff Programs Report:', err);
        }
    };

    useEffect(() => {
        fetchStaffProgramsReport();
    }, []);


    const userType = Cookies.get('usertype');

    const [staffProgramData, setStaffProgramData] = useState({
        staff_name: '',
        staff_date: '',
        staff_place: '',
        staff_rescue_count: '',
        staff_report: ''
    })

    const filteredRescueDetails = staffprogramms_details.filter((item) => {
        const searchTerm = searchQuery.toLowerCase();
        return (
            String(item.staff_name).toLowerCase().includes(searchTerm) ||
            String(item.staff_date).toLowerCase().includes(searchTerm) ||
            String(item.staff_place).toLowerCase().includes(searchTerm) ||
            String(item.staff_rescue_count).toLowerCase().includes(searchTerm)
        );
    });

    const apiRoute = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
    });

    const handleInputChange = (e) => {
        setStaffProgramData({ ...staffProgramData, [e.target.name]: e.target.value });
    };



    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (`0${date.getMonth() + 1}`).slice(-2); // Month is 0-indexed
        const day = (`0${date.getDate()}`).slice(-2);
        return `${day}-${month}-${year}`;
    };

    const formatDate1 = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (`0${date.getMonth() + 1}`).slice(-2);
        const day = (`0${date.getDate()}`).slice(-2);
        return `${year}-${month}-${day}`;
    };

    const navigate = useNavigate();

    const handleInputChange1 = (e) => {
        setStaffProgramData({ ...staffProgramData, [e.target.name]: e.target.value });
    };


    const [files, setFiles] = useState({
        staff_photos: null,
    });

    const handleFileChange = (e) => {
        setFiles({
            ...files,
            [e.target.name]: Array.from(e.target.files)  // Store all selected files as an array
        });
    };

    const fetchFormData = async (id) => {
        try {
            const response = await apiRoute.get(`/formality/getStaffProgramsbyID/${id}`);
            const data = response.data.data;

            setStaffProgramData((staffProgramData) => ({
                ...staffProgramData,
                staff_name: data.staff_name || 'NULL',
                staff_date: data.staff_date || 'NULL',
                staff_place: data.staff_place || 'NULL',
                staff_rescue_count: data.staff_rescue_count || 'NULL',
                staff_report: data.staff_report || 'NULL'
            }));

            let StaffProgramImage = [];
            if (data.staff_photos) {
                try {
                    const parsed = JSON.parse(data.staff_photos);
                    if (Array.isArray(parsed)) {
                        StaffProgramImage = parsed.map((p) => `http://localhost:5002/${p.replace(/"/g, '')}`);
                    }
                } catch (err) {
                    console.warn('Failed to parse staff_photos:', err);
                    // Fallback: comma-separated string
                    StaffProgramImage = data.staff_photos
                        .split(',')
                        .map((p) => `http://localhost:5002/${p.trim().replace(/^"|"$/g, '')}`);
                }
            }

            console.log(StaffProgramImage);

            setFiles((files) => ({
                ...files,
                staff_photos: StaffProgramImage,
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

    const handleEditform = async (id) => {
        try {
            const response = await apiRoute.get(`/formality/getStaffProgramsbyID/${id}`);
            const data = response.data.data; // Access the first object in the 'data' array

            setStaffProgramData({
                id: data.id || '',
                staff_name: data.staff_name || 'NULL',
                staff_date: formatDate1(data.staff_date || 'NULL'),
                staff_place: data.staff_place || 'NULL',
                staff_rescue_count: data.staff_rescue_count || 'NULL',
                staff_report: data.staff_report || 'NULL',
                community_rescue_count: data.community_rescue_count || "NULL",
                community_report: data.community_report || "NULL"
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

            const StaffPath = parseImageField(data.staff_photos);

            setFiles((files) => ({
                ...files,
                staff_photos: StaffPath,
            }));

            setShow(true);

        } catch (error) {
            console.error("Error fetching form data:", error);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const id = staffProgramData.id; // ✅ Get it from form data
        console.log("Updating form with ID:", id);
        if (!id) {
            alert("ID not found.");
            return;
        }
        const data = new FormData();
        data.append('staff_name', staffProgramData.staff_name);
        data.append('staff_date', staffProgramData.staff_date);
        data.append('staff_place', staffProgramData.staff_place);
        data.append('staff_report', staffProgramData.staff_report);
        data.append('staff_rescue_count', staffProgramData.staff_rescue_count);

        if (files.staff_photos && files.staff_photos.length > 0) {
            files.staff_photos.forEach(file => {
                data.append('staff_photos', file); // ✅ no []
            });
        }
        try {
            const response = await apiRoute.put(`/formality/updateStaffProgrambyID/${id}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            console.log(response.data);
            if (response.status === 200 || response.status === 201) {
                alert('Form Updated successfully!');
                window.location.reload();
            } else {
                alert('Error Updating form.');
            }

        } catch (error) {
            console.error('There was an error Updating the form:', error);
            alert('There was an error Updating the form.');
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
                        <h3 className="section_title text-center">Staff Programs Report Detail</h3>
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
                                        <th>Staff Programms Name</th>
                                        <th>Staff Programms Date</th>
                                        <th>Staff Programms Venue</th>
                                        <th>No.of Participants</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredRescueDetails.length > 0 ? (
                                        filteredRescueDetails.map((item, index) => (
                                            <tr key={item.id}>
                                                <td>{index + 1}</td>
                                                <td>{item.staff_name || "null"}</td>
                                                <td>{formatDate(item.staff_date) || "null"}</td>
                                                <td>{item.staff_place || "null"}</td>
                                                <td>{item.staff_rescue_count || "null"}</td>
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
                        <h4 className="pdf_heading text-center">STAFF PROGRAMS REPORT DETAILS</h4>
                    </Col>
                </Row>
                <Container>
                    <Form>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="5" className='text-start'>
                                Name of the Programs :
                            </Form.Label>
                            <Col sm="7">
                                <Form.Control type="text"
                                    name="staff_name"
                                    value={staffProgramData.staff_name}
                                    onChange={handleInputChange1}
                                    required />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="5" className='text-start'>
                                Date:
                            </Form.Label>
                            <Col sm="7">
                                <Form.Control type="date"
                                    name="staff_date"
                                    max="9999-12-31"
                                    value={formatDate1(staffProgramData.staff_date)}
                                    onChange={handleInputChange1}
                                    required />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="5" className='text-start'>
                                Venue :
                            </Form.Label>
                            <Col sm="7">
                                <Form.Control type="text"
                                    name="staff_place"
                                    value={staffProgramData.staff_place}
                                    onChange={handleInputChange1}
                                    required />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="5" className='text-start'>
                                No. of Participants
                            </Form.Label>
                            <Col sm="7">
                                <Form.Control type="text"
                                    name="staff_rescue_count"
                                    value={staffProgramData.staff_rescue_count}
                                    onChange={handleInputChange1}
                                    required />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className='mb-3'>
                            <Form.Label column sm="5" className='text-start'>Staff Photos :</Form.Label>
                            <Col sm="7">
                                {Array.isArray(files.staff_photos) &&
                                    files.staff_photos.map((imgUrl, index) => (
                                        <img
                                            key={index}
                                            src={imgUrl}
                                            alt={`staff_photos - ${index}`}
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
                            <Form.Label column sm="5" className='text-start'>Report:</Form.Label>
                            <Col sm="7">
                                <Form.Control
                                    as="textarea"
                                    name="staff_report"
                                    rows={3}
                                    value={staffProgramData.staff_report}
                                    onChange={handleInputChange1}
                                    
                                />
                            </Col>
                        </Form.Group>
                    </Form>
                </Container>
            </div>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Staff Programs Report</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Col md={12}>
                        <Form>
                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="5" className='text-start'>
                                    Name of the Programs :
                                </Form.Label>
                                <Col sm="7">
                                    <Form.Control type="text"
                                        name="staff_name"
                                        value={staffProgramData.staff_name}
                                        onChange={handleInputChange1}
                                        required />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="5" className='text-start'>
                                    Date:
                                </Form.Label>
                                <Col sm="7">
                                    <Form.Control type="date"
                                        name="staff_date"
                                        max="9999-12-31"
                                        value={staffProgramData.staff_date}
                                        onChange={handleInputChange1}
                                        required />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="5" className='text-start'>
                                    Venue :
                                </Form.Label>
                                <Col sm="7">
                                    <Form.Control type="text"
                                        name="staff_place"
                                        value={staffProgramData.staff_place}
                                        onChange={handleInputChange1}
                                        required />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="5" className='text-start'>
                                    No. of Participants
                                </Form.Label>
                                <Col sm="7">
                                    <Form.Control type="text"
                                        name="staff_rescue_count"
                                        value={staffProgramData.staff_rescue_count}
                                        onChange={handleInputChange1}
                                        required />
                                </Col>
                            </Form.Group>
                            {Array.isArray(files.staff_photos) &&
                                files.staff_photos.map((imgUrl, index) => (
                                    <img
                                        key={index}
                                        src={imgUrl}
                                        alt={`staff_photos - ${index}`}
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
                            <Form.Group as={Row} className="mb-3 mt-3">
                                <Form.Label column sm="6" className='text-start'>
                                    Staff Photos :
                                </Form.Label>
                                <Col sm="6">
                                    <Form.Control
                                        type="file"
                                        accept=".jpg,.jpeg,.png"
                                        name="staff_photos"
                                        onChange={handleFileChange}
                                        multiple
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="5" className='text-start'>Report:</Form.Label>
                                <Col sm="7">
                                    <Form.Control
                                        as="textarea"
                                        name="staff_report"
                                        rows={3}
                                        value={staffProgramData.staff_report}
                                        onChange={handleInputChange1}
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

export default StaffPrograms_report
