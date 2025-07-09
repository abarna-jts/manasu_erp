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

function Celebration_report() {
    const [celebration_details, setCelebrationDetail] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [previewRequested, setPreviewRequested] = useState(false);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);


    // Dummy function: Replace with real API call
    const fetchCelebrationReport = async () => {
        try {
            const response = await apiRoute.get('/formality/getCelebrationReport');
            setCelebrationDetail(response.data.data); // ✅ Only set the actual data
            console.log(response);
        } catch (err) {
            console.error('Error fetching Event Report:', err);
        }
    };

    useEffect(() => {
        fetchCelebrationReport();

    }, []);


    const userType = Cookies.get('usertype');

    const [celebrationData, setCelebrationData] = useState({
        celebration_name: '',
        other_celebration: '',
        celebration_date: '',
        celebration_place: '',
        celebration_report: '',
        celebration_rescue_count: '',

    })

    const filteredRescueDetails = celebration_details.filter((item) => {
        const searchTerm = searchQuery.toLowerCase();
        return (
            String(item.celebration_name).toLowerCase().includes(searchTerm) ||
            String(item.other_celebration).toLowerCase().includes(searchTerm) ||
            String(item.celebration_place).toLowerCase().includes(searchTerm) ||
            String(item.celebration_date).toLowerCase().includes(searchTerm)
        );
    });

    const apiRoute = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
    });

    const handleInputChange = (e) => {
        setCelebrationData({ ...celebrationData, [e.target.name]: e.target.value });
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
        const month = String(date.getMonth() + 1).padStart(2, '0'); // 01 to 12
        const day = String(date.getDate()).padStart(2, '0'); // 01 to 31
        return `${year}-${month}-${day}`;
    };

    const navigate = useNavigate();

    const handleInputChange1 = (e) => {
        setCelebrationData({ ...celebrationData, [e.target.name]: e.target.value });
    };


    const [files, setFiles] = useState({
        celebration_photos: null,
    });

    const handleFileChange = (e) => {
        setFiles({
            ...files,
            [e.target.name]: Array.from(e.target.files)  // Store all selected files as an array
        });
    };

    const fetchFormData = async (id) => {
        try {
            const response = await apiRoute.get(`/formality/getCelebrationbyID/${id}`);
            const data = response.data.data;

            setCelebrationData((celebrationData) => ({
                ...celebrationData,
                celebration_name: data.celebration_name || 'NULL',
                other_celebration: data.other_celebration || 'NULL',
                celebration_date: data.celebration_date || 'NULL',
                celebration_place: data.celebration_place || 'NULL',
                celebration_report: data.celebration_report || 'NULL',
                celebration_rescue_count: data.celebration_rescue_count || 'NULL'

            }));

            // Base path for images
            const basePath = "https://www.pahrultours.com/app2/uploads/Event_Photos";
            const CelebrationImage = data.celebration_photos ? `https://www.pahrultours.com/app2/${data.celebration_photos}` : null;

            console.log("Celebration Image Path", CelebrationImage);
            setFiles((files) => ({
                ...files,
                celebration_photos: CelebrationImage,
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
            const response = await apiRoute.get(`/formality/getCelebrationbyID/${id}`);
            const data = response.data.data; // Access the first object in the 'data' array

            setCelebrationData({
                id: data.id || '',
                celebration_name: data.celebration_name || 'NULL',
                other_celebration: data.other_celebration || 'NULL',
                celebration_date: formatDate1(data.celebration_date || 'NULL'),
                celebration_place: data.celebration_place || 'NULL',
                celebration_report: data.celebration_report || 'NULL',
                celebration_rescue_count: data.celebration_rescue_count || 'NULL'
            });

            setShow(true);

        } catch (error) {
            console.error("Error fetching form data:", error);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const id = celebrationData.id; // ✅ Get it from form data
        console.log("Updating form with ID:", id);
        if (!id) {
            alert("ID not found.");
            return;
        }
        try {
            const response = await apiRoute.put(`/formality/updateCelebrationDetail/${id}`, celebrationData);

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
                        <h3 className="section_title text-center">Celebration Events Report Detail</h3>
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
                                        <th>Celebration Name</th>
                                        <th>Celebration Date</th>
                                        <th>Celebration Venue</th>
                                        <th>No.of Participants</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredRescueDetails.length > 0 ? (
                                        filteredRescueDetails.map((item, index) => (
                                            <tr key={item.id}>
                                                <td>{index + 1}</td>
                                                <td>{item.celebration_name || "null"}</td>
                                                <td>{formatDate(item.celebration_date) || "null"}</td>
                                                <td>{item.celebration_place || "null"}</td>
                                                <td>{item.celebration_rescue_count || "null"}</td>
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
                        <h4 className="pdf_heading text-center">CELEBRATION REPORT DETAILS</h4>
                    </Col>
                </Row>
                <Container>
                    <Form>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="5" className='text-start'>
                                Name of the Celebration :
                            </Form.Label>
                            <Col sm="7">
                                <Form.Control
                                    type="text"
                                    name="celebration_name"
                                    value={celebrationData.celebration_name || ""}
                                    onChange={handleInputChange1}
                                    required
                                />
                            </Col>
                        </Form.Group>
                        {celebrationData.celebration_name === "Any other" && (
                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="5" className="text-start">
                                    Specify Other Celebration:
                                </Form.Label>
                                <Col sm="7">
                                    <Form.Control
                                        type="text"
                                        name="other_celebration"
                                        value={celebrationData.other_celebration || ""}
                                        onChange={handleInputChange1}
                                        placeholder="Enter celebration name"
                                        required
                                    />
                                </Col>
                            </Form.Group>
                        )}
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="5" className='text-start'>
                                Date:
                            </Form.Label>
                            <Col sm="7">
                                <Form.Control type="date"
                                    name="celebration_date"
                                    max="9999-12-31"
                                    value={formatDate1(celebrationData.celebration_date)}
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
                                    name="celebration_place"
                                    value={celebrationData.celebration_place}
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
                                    name="celebration_rescue_count"
                                    value={celebrationData.celebration_rescue_count}
                                    onChange={handleInputChange1}
                                    required />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="5" className='text-start'>Celebration Report:</Form.Label>
                            <Col sm="7">
                                <Form.Control
                                    as="textarea"
                                    name="celebration_report"
                                    rows={3}
                                    value={celebrationData.celebration_report}
                                    onChange={handleInputChange1}
                                    required
                                />
                            </Col>
                        </Form.Group>

                    </Form>
                </Container>
            </div>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Celebration Report</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Col md={12}>
                        <Form>
                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="6" className='text-start'>
                                    Name of the Celebration :
                                </Form.Label>
                                <Col sm="6">
                                    <Form.Control
                                        type="text"
                                        name="celebration_name"
                                        value={celebrationData.celebration_name || ""}
                                        onChange={handleInputChange1}
                                        required
                                    />
                                </Col>
                            </Form.Group>
                            {celebrationData.celebration_name === "Any other" && (
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="6" className="text-start">
                                        Specify Other Celebration:
                                    </Form.Label>
                                    <Col sm="6">
                                        <Form.Control
                                            type="text"
                                            name="other_celebration"
                                            value={celebrationData.other_celebration || ""}
                                            onChange={handleInputChange1}
                                            placeholder="Enter celebration name"
                                            required
                                        />
                                    </Col>
                                </Form.Group>
                            )}
                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="6" className='text-start'>
                                    Date:
                                </Form.Label>
                                <Col sm="6">
                                    <Form.Control type="date"
                                        name="celebration_date"
                                        max="9999-12-31"
                                        value={celebrationData.celebration_date}
                                        onChange={handleInputChange1}
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
                                        value={celebrationData.celebration_place}
                                        onChange={handleInputChange1}
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
                                        value={celebrationData.celebration_rescue_count}
                                        onChange={handleInputChange1}
                                        required />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="6" className='text-start'>Celebration Report:</Form.Label>
                                <Col sm="6">
                                    <Form.Control
                                        as="textarea"
                                        name="celebration_report"
                                        rows={3}
                                        value={celebrationData.celebration_report}
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

export default Celebration_report
