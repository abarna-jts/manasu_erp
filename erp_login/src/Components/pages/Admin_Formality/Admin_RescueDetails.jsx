import React from 'react'
import { Breadcrumb, Container, Row, Col, Form, InputGroup, Button, Table } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useRef } from "react";
import Cookies from 'js-cookie';
import manasu_logo from '../Admission/Manasu-Logo.png';

function Admin_RescueDetails() {
    const [show, setShow] = useState(false);
    const [show1, setShow1] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [report_details, setReportDetail] = useState([]);
    const [previewRequested, setPreviewRequested] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    const userType = Cookies.get('usertype');

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleEditClose = () => setShow1(false);

    const [formData, setFormData] = useState({
        admission_no: '',
        rescue_name: '',
        referred_by: '',
        escape: '',
        death: '',
        discharge: '',
        transfer: '',
        reunited: '',
        state_venue: '',
        state: ''
    });

    const apiRoute = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === 'admission_no') {
            fetchRescueDetails(value); // Call fetch when admission_no changes
        }
    };

    const handleCheckChange = (e) => {
        const { name, value } = e.target;

        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
            ...(name === 'transfer' && value === 'No' && { state_venue: '' }), // Clear state_venue if Transfer = No
            ...(name === 'reunited' && value === 'No' && { state: '' }) // Clear state if Reunited = No
        }));
    };


    const fetchRescueDetails = async (admissionNo) => {
        if (!admissionNo) return;

        try {
            const response = await apiRoute.get(`/formality/getRescueDetails/${admissionNo}`);
            const data = response.data;

            setFormData(prev => ({
                ...prev,
                rescue_name: data.rescue_name || '',
                referred_by: data.referred_by || ''
            }));
        } catch (error) {
            console.error('Error fetching rescue details:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await apiRoute.post('/formality/create_dischargeInfo', formData, {
                headers: { 'Content-Type': 'application/json' },
            });
            alert('Rescue Discharge Summary Form Created successfully!');
            handleClose(true);
            setFormData({
                admission_no: '',
                rescue_name: '',
                referred_by: '',
                escape: '',
                death: '',
                discharge: '',
                transfer: '',
                reunited: '',
                state_venue: '',
                state: ''
            })
            getRerportDetail();
        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                alert(err.response.data.message);
            } else {
                alert("Something went wrong.");
            }
            console.error(err);
            alert('Submission failed.');
        }
    }

    const filteredRescueDetails = report_details.filter((item) => {
        const searchTerm = searchQuery.toLowerCase();
        return (
            String(item.rescue_name).toLowerCase().includes(searchTerm) ||
            String(item.state).toLowerCase().includes(searchTerm) ||
            String(item.state_venue).toLowerCase().includes(searchTerm) ||
            String(item.referred_by).toLowerCase().includes(searchTerm) ||
            String(item.admission_no).toLowerCase().includes(searchTerm)
        );
    });

    const getRerportDetail = async () => {
        try {
            const response = await apiRoute.get('/formality/getDischargeSummary');
            console.log("API response:", response.data);
            setReportDetail(response.data.data);
        } catch (error) {
            console.error('Error fetching Student:', error);
        }
    };
    useEffect(() => {
        getRerportDetail();
    }, []);

    const fetchFormData = async (id) => {
        try {
            const response = await apiRoute.get(`/formality/getDischargeSummaryID/${id}`);
            const data = response.data;

            setFormData((formData) => ({
                ...formData,
                rescue_name: data.rescue_name || '',
                referred_by: data.referred_by || '',
                admission_no: data.admission_no || '',
                escape: data.escape || '',
                death: data.death || '',
                discharge: data.discharge || '',
                reunited: data.reunited || '',
                transfer: data.transfer || '',
                state_venue: data.state_venue || '',
                state: data.state || '',

            }));

            setPreviewRequested(true); // trigger the effect after state updates
        } catch (error) {
            console.error("Error fetching form data:", error);
            alert("Rescue not found");
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

    const handleEditform = async (id) => {
        try {
            const response = await apiRoute.get(`/formality/getDischargeSummaryID/${id}`);
            const data = response.data;

            setFormData({
                admission_no: data.admission_no || '',
                rescue_name: data.rescue_name || '',
                referred_by: data.referred_by || '',
                escape: data.escape || '',
                death: data.death || '',
                discharge: data.discharge || '',
                reunited: data.reunited || '',
                transfer: data.transfer || '',
                state_venue: data.state_venue || '',
                state: data.state || '',
            });

            setSelectedId(id); // ✅ Store the ID
            setShow1(true);
        } catch (error) {
            console.error("Error fetching form data:", error);
            alert("Rescue not found");
        }
    };


    const handleUpdate = async (e, id) => {
        e.preventDefault();
        try {
            const response = await apiRoute.put(`/formality/updateDischargeSummary/${id}`, formData);
            console.log(response.data);
            if (response.status === 200) {
                alert('Form Updated successfully!');
                setFormData({
                    admission_no: '',
                    rescue_name: '',
                    referred_by: '',
                    escape: '',
                    death: '',
                    discharge: '',
                    transfer: '',
                    reunited: '',
                    state_venue: '',
                    state: ''
                })
                handleEditClose(true);
                getRerportDetail();
            } else {
                alert('Error Updating form.');
            }
        } catch (error) {
            console.error('There was an error Updating the form:', error);
            alert('There was an error Updating the form.');
        }
    };

    const handleDelete = async (id) => {
        alert("Are you sure want to delete");
        try {
            const response = await apiRoute.delete(`/formality/deleteDischargeSummary/${id}`);
            console.log(response);
            alert("Discharge Summary Deleted successfully");
            window.location.reload();
        } catch (error) {
            console.error('Failed to delete item:', error);
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
                            <Breadcrumb.Item active>Admin Formality</Breadcrumb.Item>
                        </Breadcrumb>
                        <h6 className="breadcrumb_title">Discharge Details</h6>
                    </Col>
                    <Col md={8} className="text-start mb-4">
                        <h3 className="section_title">Resident's Discharge Information</h3>
                    </Col>
                </Row>
            </Container>

            <Container>
                <Row className='d-flex align-items-center justify-content-between'>
                    <Col md={4} className='d-flex align-items-center justify-content-start'>
                        <Button type="button" className="btn btn-success" onClick={handleShow}>Add Details</Button>
                    </Col>
                    <Col md={3}>
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
                <Row>
                    <Col md={12}>
                        <Table responsive="sm">
                            <thead>
                                <tr>
                                    <th>S.No</th>
                                    <th>Resident's Id</th>
                                    <th>Resident's Name</th>
                                    <th>Self Discharge</th>
                                    <th>Transfer</th>
                                    <th>Transferred Place</th>
                                    <th>Escape</th>
                                    <th>Death</th>
                                    <th>Reunited</th>
                                    <th>Reunited State</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRescueDetails.length > 0 ? (
                                    filteredRescueDetails.map((item, index) => (
                                        <tr key={item.id}>
                                            <td>{index + 1}</td>
                                            <td>{item.admission_no || "Null"}</td>
                                            <td>{item.rescue_name || "Null"}</td>
                                            <td>{item.discharge || "Null"}</td>
                                            <td>{item.transfer || "Null"}</td>
                                            <td>{item.state_venue || "Null"}</td>
                                            <td>{item.escape || "Null"}</td>
                                            <td>{item.death || "Null"}</td>
                                            <td>{item.reunited || "Null"}</td>
                                            <td>{item.state || "Null"}</td>
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
                                                {/* {userType === "2" && (
                                                    <button className="btn btn-danger icon_details"
                                                        onClick={() => {
                                                            handleDelete(item.id);
                                                        }}
                                                    >
                                                        <i className="fas fa-trash"></i>
                                                    </button>
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
                    </Col>
                </Row>
            </Container>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Create Rescue Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Col md={12}>
                        <Form className='rescue_details' onSubmit={handleSubmit}>
                            <Row>

                                <Form.Group as={Row} className="mb-1">
                                    <Form.Label column sm="6" className='text-start'>
                                        Admission No :
                                    </Form.Label>
                                    <Col sm="6" className='d-flex align-items-center'>
                                        <Form.Control
                                            type="text"
                                            name="admission_no"
                                            value={formData.admission_no}
                                            onChange={handleInputChange}
                                            required />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                    <Form.Label column sm="6" className='text-start'>
                                        Rescue Name :
                                    </Form.Label>
                                    <Col sm="6" className='d-flex align-items-center'>
                                        <Form.Control
                                            type="text"
                                            name="rescue_name"
                                            value={formData.rescue_name}
                                            onChange={handleInputChange}
                                            required />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1">
                                    <Form.Label column sm="6" className='text-start'>
                                        Admitting Authority for Rescue :
                                    </Form.Label>
                                    <Col sm="6" className='d-flex align-items-center'>
                                        <Form.Control
                                            type="text"
                                            name="referred_by"
                                            value={formData.referred_by}
                                            onChange={handleInputChange}
                                            required />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-1" controlId="formSocialMediaConsent">
                                    <Form.Label column sm="4" className="text-start">
                                        Escape :
                                    </Form.Label>
                                    <Col sm="8" className='d-flex align-items-center'>
                                        <Form.Check
                                            type="radio"
                                            label="Yes"
                                            name="escape"
                                            value="Yes"
                                            checked={formData.escape === 'Yes'}
                                            onChange={handleCheckChange}
                                        />
                                        <Form.Check
                                            type="radio"
                                            label="No"
                                            name="escape"
                                            value="No"
                                            checked={formData.escape === 'No'}
                                            onChange={handleCheckChange}
                                        />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1" controlId="formSocialMediaConsent">
                                    <Form.Label column sm="4" className="text-start">
                                        Death :
                                    </Form.Label>
                                    <Col sm="8" className='d-flex align-items-center'>
                                        <Form.Check
                                            type="radio"
                                            label="Yes"
                                            name="death"
                                            value="Yes"
                                            checked={formData.death === 'Yes'}
                                            onChange={handleCheckChange}
                                        />
                                        <Form.Check
                                            type="radio"
                                            label="No"
                                            name="death"
                                            value="No"
                                            checked={formData.death === 'No'}
                                            onChange={handleCheckChange}
                                        />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1" controlId="formSocialMediaConsent">
                                    <Form.Label column sm="4" className="text-start">
                                        Self Discharge :
                                    </Form.Label>
                                    <Col sm="8" className='d-flex align-items-center'>
                                        <Form.Check
                                            type="radio"
                                            label="Yes"
                                            name="discharge"
                                            value="Yes"
                                            checked={formData.discharge === 'Yes'}
                                            onChange={handleCheckChange}
                                        />
                                        <Form.Check
                                            type="radio"
                                            label="No"
                                            name="discharge"
                                            value="No"
                                            checked={formData.discharge === 'No'}
                                            onChange={handleCheckChange}
                                        />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1" controlId="formSocialMediaConsent">
                                    <Form.Label column sm="4" className="text-start">
                                        Transfer :
                                    </Form.Label>
                                    <Col sm="8" className='d-flex align-items-center'>
                                        <Form.Check
                                            type="radio"
                                            label="Yes"
                                            name="transfer"
                                            value="Yes"
                                            checked={formData.transfer === 'Yes'}
                                            onChange={handleCheckChange}
                                        />
                                        <Form.Check
                                            type="radio"
                                            label="No"
                                            name="transfer"
                                            value="No"
                                            checked={formData.transfer === 'No'}
                                            onChange={handleCheckChange}
                                        />
                                    </Col>
                                </Form.Group>
                                {/* Show the State / Venue field only if transfer is "Yes" */}
                                {formData.transfer === 'Yes' && (
                                    <Form.Group as={Row} className="mb-3" controlId="formStateVenue">
                                        <Form.Label column sm="4" className="text-start">
                                            State / Venue :
                                        </Form.Label>
                                        <Col sm="8">
                                            <Form.Control
                                                type="text"
                                                name="state_venue"
                                                value={formData.state_venue || ''}
                                                onChange={handleInputChange}
                                                placeholder="Enter State or Venue"
                                                required={formData.transfer === 'Yes'}  // Required only if transfer is yes
                                            />
                                        </Col>
                                    </Form.Group>
                                )}

                                <Form.Group as={Row} className="mb-1" controlId="formSocialMediaConsent">
                                    <Form.Label column sm="4" className="text-start">
                                        Reunited :
                                    </Form.Label>
                                    <Col sm="8" className='d-flex align-items-center'>
                                        <Form.Check
                                            type="radio"
                                            label="Yes"
                                            name="reunited"
                                            value="Yes"
                                            checked={formData.reunited === 'Yes'}
                                            onChange={handleCheckChange}
                                        />
                                        <Form.Check
                                            type="radio"
                                            label="No"
                                            name="reunited"
                                            value="No"
                                            checked={formData.reunited === 'No'}
                                            onChange={handleCheckChange}
                                        />
                                    </Col>
                                </Form.Group>

                                {/* Show the State / Venue field only if transfer is "Yes" */}
                                {formData.reunited === 'Yes' && (
                                    <Form.Group as={Row} className="mb-3" controlId="formStateVenue">
                                        <Form.Label column sm="4" className="text-start">
                                            State :
                                        </Form.Label>
                                        <Col sm="8">
                                            <Form.Control
                                                type="text"
                                                name="state"
                                                value={formData.state || ''}
                                                onChange={handleInputChange}
                                                placeholder="Enter State"
                                                required={formData.reunited === 'Yes'}  // Required only if transfer is yes
                                            />
                                        </Col>
                                    </Form.Group>
                                )}

                                <div className="mt-3 d-flex align-tems-cente justify-content-between">
                                    <Button variant="success" className="m-1" type="submit">Submit</Button>
                                    <Button variant="secondary" onClick={handleClose}>
                                        Close
                                    </Button>
                                </div>

                            </Row>
                        </Form>
                    </Col>
                </Modal.Body>
            </Modal>

            <div ref={formRef} style={{ position: "absolute", left: "-9999px", top: 0, background: "#fff", padding: "20px", width: "210mm" }}>
                <Row className="d-flex align-items-center justify-content-center mb-2">
                    <Col md={2}>
                        <img src={manasu_logo} className="pdf_logo" alt="" />
                    </Col>
                    <Col md={10}>
                        <h4 className="text-center">Rescue Discharge Information</h4>
                    </Col>
                </Row>
                <Form className='rescue_details'>
                    <Row>

                        <Form.Group as={Row} className="mb-1">
                            <Form.Label column sm="6" className='text-start'>
                                Admission No :
                            </Form.Label>
                            <Col sm="6" className='d-flex align-items-center'>
                                <Form.Control
                                    type="text"
                                    name="admission_no"
                                    value={formData.admission_no}
                                    onChange={handleInputChange}
                                    required />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                            <Form.Label column sm="6" className='text-start'>
                                Rescue Name :
                            </Form.Label>
                            <Col sm="6" className='d-flex align-items-center'>
                                <Form.Control
                                    type="text"
                                    name="rescue_name"
                                    value={formData.rescue_name}
                                    onChange={handleInputChange}
                                    required />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-1">
                            <Form.Label column sm="6" className='text-start'>
                                Admitting Authority for Rescue :
                            </Form.Label>
                            <Col sm="6" className='d-flex align-items-center'>
                                <Form.Control
                                    type="text"
                                    name="referred_by"
                                    value={formData.referred_by}
                                    onChange={handleInputChange}
                                    required />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-1" controlId="formSocialMediaConsent">
                            <Form.Label column sm="4" className="text-start">
                                Escape :
                            </Form.Label>
                            <Col sm="8" className='d-flex align-items-center'>
                                <Form.Check
                                    type="radio"
                                    label="Yes"
                                    name="escape"
                                    value="Yes"
                                    checked={formData.escape === 'Yes'}
                                    onChange={handleCheckChange}
                                />
                                <Form.Check
                                    type="radio"
                                    label="No"
                                    name="escape"
                                    value="No"
                                    checked={formData.escape === 'No'}
                                    onChange={handleCheckChange}
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-1" controlId="formSocialMediaConsent">
                            <Form.Label column sm="4" className="text-start">
                                Death :
                            </Form.Label>
                            <Col sm="8" className='d-flex align-items-center'>
                                <Form.Check
                                    type="radio"
                                    label="Yes"
                                    name="death"
                                    value="Yes"
                                    checked={formData.death === 'Yes'}
                                    onChange={handleCheckChange}
                                />
                                <Form.Check
                                    type="radio"
                                    label="No"
                                    name="death"
                                    value="No"
                                    checked={formData.death === 'No'}
                                    onChange={handleCheckChange}
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-1" controlId="formSocialMediaConsent">
                            <Form.Label column sm="4" className="text-start">
                                Self Discharge :
                            </Form.Label>
                            <Col sm="8" className='d-flex align-items-center'>
                                <Form.Check
                                    type="radio"
                                    label="Yes"
                                    name="discharge"
                                    value="Yes"
                                    checked={formData.discharge === 'Yes'}
                                    onChange={handleCheckChange}
                                />
                                <Form.Check
                                    type="radio"
                                    label="No"
                                    name="discharge"
                                    value="No"
                                    checked={formData.discharge === 'No'}
                                    onChange={handleCheckChange}
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-1" controlId="formSocialMediaConsent">
                            <Form.Label column sm="4" className="text-start">
                                Reunited :
                            </Form.Label>
                            <Col sm="8" className='d-flex align-items-center'>
                                <Form.Check
                                    type="radio"
                                    label="Yes"
                                    name="reunited"
                                    value="Yes"
                                    checked={formData.reunited === 'Yes'}
                                    onChange={handleCheckChange}
                                />
                                <Form.Check
                                    type="radio"
                                    label="No"
                                    name="reunited"
                                    value="No"
                                    checked={formData.reunited === 'No'}
                                    onChange={handleCheckChange}
                                />
                            </Col>
                        </Form.Group>

                        {/* Show the State / Venue field only if transfer is "Yes" */}
                        {formData.reunited === 'Yes' && (
                            <Form.Group as={Row} className="mb-3" controlId="formStateVenue">
                                <Form.Label column sm="4" className="text-start">
                                    State :
                                </Form.Label>
                                <Col sm="8">
                                    <Form.Control
                                        type="text"
                                        name="state"
                                        value={formData.state || ''}
                                        onChange={handleInputChange}
                                        placeholder="Enter State"
                                        required={formData.reunited === 'Yes'}  // Required only if transfer is yes
                                    />
                                </Col>
                            </Form.Group>
                        )}

                        <Form.Group as={Row} className="mb-1" controlId="formSocialMediaConsent">
                            <Form.Label column sm="4" className="text-start">
                                Transfer :
                            </Form.Label>
                            <Col sm="8" className='d-flex align-items-center'>
                                <Form.Check
                                    type="radio"
                                    label="Yes"
                                    name="transfer"
                                    value="Yes"
                                    checked={formData.transfer === 'Yes'}
                                    onChange={handleCheckChange}
                                />
                                <Form.Check
                                    type="radio"
                                    label="No"
                                    name="transfer"
                                    value="No"
                                    checked={formData.transfer === 'No'}
                                    onChange={handleCheckChange}
                                />
                            </Col>
                        </Form.Group>

                        {/* Show the State / Venue field only if transfer is "Yes" */}
                        {formData.transfer === 'Yes' && (
                            <Form.Group as={Row} className="mb-3" controlId="formStateVenue">
                                <Form.Label column sm="4" className="text-start">
                                    State / Venue :
                                </Form.Label>
                                <Col sm="8">
                                    <Form.Control
                                        type="text"
                                        name="state_venue"
                                        value={formData.state_venue || ''}
                                        onChange={handleInputChange}
                                        placeholder="Enter State or Venue"
                                        required={formData.transfer === 'Yes'}  // Required only if transfer is yes
                                    />
                                </Col>
                            </Form.Group>
                        )}

                    </Row>
                </Form>
            </div>

            <Modal show={show1} onHide={handleEditClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Rescue Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Col md={12}>
                        <Form className='rescue_details'>
                            <Row>
                                <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                    <Form.Label column sm="6" className='text-start'>
                                        Rescue Name :
                                    </Form.Label>
                                    <Col sm="6" className='d-flex align-items-center'>
                                        <Form.Control
                                            type="text"
                                            name="rescue_name"
                                            value={formData.rescue_name}
                                            onChange={handleInputChange}
                                            readOnly />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1">
                                    <Form.Label column sm="6" className='text-start'>
                                        Admitting Authority for Rescue :
                                    </Form.Label>
                                    <Col sm="6" className='d-flex align-items-center'>
                                        <Form.Control
                                            type="text"
                                            name="referred_by"
                                            value={formData.referred_by}
                                            onChange={handleInputChange}
                                            readOnly />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-1" controlId="formSocialMediaConsent">
                                    <Form.Label column sm="4" className="text-start">
                                        Escape :
                                    </Form.Label>
                                    <Col sm="8" className='d-flex align-items-center'>
                                        <Form.Check
                                            type="radio"
                                            label="Yes"
                                            name="escape"
                                            value="Yes"
                                            checked={formData.escape === 'Yes'}
                                            onChange={handleCheckChange}
                                        />
                                        <Form.Check
                                            type="radio"
                                            label="No"
                                            name="escape"
                                            value="No"
                                            checked={formData.escape === 'No'}
                                            onChange={handleCheckChange}
                                        />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1" controlId="formSocialMediaConsent">
                                    <Form.Label column sm="4" className="text-start">
                                        Death :
                                    </Form.Label>
                                    <Col sm="8" className='d-flex align-items-center'>
                                        <Form.Check
                                            type="radio"
                                            label="Yes"
                                            name="death"
                                            value="Yes"
                                            checked={formData.death === 'Yes'}
                                            onChange={handleCheckChange}
                                        />
                                        <Form.Check
                                            type="radio"
                                            label="No"
                                            name="death"
                                            value="No"
                                            checked={formData.death === 'No'}
                                            onChange={handleCheckChange}
                                        />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1" controlId="formSocialMediaConsent">
                                    <Form.Label column sm="4" className="text-start">
                                        Self Discharge :
                                    </Form.Label>
                                    <Col sm="8" className='d-flex align-items-center'>
                                        <Form.Check
                                            type="radio"
                                            label="Yes"
                                            name="discharge"
                                            value="Yes"
                                            checked={formData.discharge === 'Yes'}
                                            onChange={handleCheckChange}
                                        />
                                        <Form.Check
                                            type="radio"
                                            label="No"
                                            name="discharge"
                                            value="No"
                                            checked={formData.discharge === 'No'}
                                            onChange={handleCheckChange}
                                        />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1" controlId="formSocialMediaConsent">
                                    <Form.Label column sm="4" className="text-start">
                                        Reunited :
                                    </Form.Label>
                                    <Col sm="8" className='d-flex align-items-center'>
                                        <Form.Check
                                            type="radio"
                                            label="Yes"
                                            name="reunited"
                                            value="Yes"
                                            checked={formData.reunited === 'Yes'}
                                            onChange={handleCheckChange}
                                        />
                                        <Form.Check
                                            type="radio"
                                            label="No"
                                            name="reunited"
                                            value="No"
                                            checked={formData.reunited === 'No'}
                                            onChange={handleCheckChange}
                                        />
                                    </Col>
                                </Form.Group>

                                {/* Show the State / Venue field only if transfer is "Yes" */}
                                {formData.reunited === 'Yes' && (
                                    <Form.Group as={Row} className="mb-3" controlId="formStateVenue">
                                        <Form.Label column sm="4" className="text-start">
                                            State :
                                        </Form.Label>
                                        <Col sm="8">
                                            <Form.Control
                                                type="text"
                                                name="state"
                                                value={formData.state || ''}
                                                onChange={handleInputChange}
                                                placeholder="Enter State"
                                                required={formData.reunited === 'Yes'}  // Required only if transfer is yes
                                            />
                                        </Col>
                                    </Form.Group>
                                )}

                                <Form.Group as={Row} className="mb-1" controlId="formSocialMediaConsent">
                                    <Form.Label column sm="4" className="text-start">
                                        Transfer :
                                    </Form.Label>
                                    <Col sm="8" className='d-flex align-items-center'>
                                        <Form.Check
                                            type="radio"
                                            label="Yes"
                                            name="transfer"
                                            value="Yes"
                                            checked={formData.transfer === 'Yes'}
                                            onChange={handleCheckChange}
                                        />
                                        <Form.Check
                                            type="radio"
                                            label="No"
                                            name="transfer"
                                            value="No"
                                            checked={formData.transfer === 'No'}
                                            onChange={handleCheckChange}
                                        />
                                    </Col>
                                </Form.Group>

                                {/* Show the State / Venue field only if transfer is "Yes" */}
                                {formData.transfer === 'Yes' && (
                                    <Form.Group as={Row} className="mb-3" controlId="formStateVenue">
                                        <Form.Label column sm="4" className="text-start">
                                            State :
                                        </Form.Label>
                                        <Col sm="8">
                                            <Form.Control
                                                type="text"
                                                name="state_venue"
                                                value={formData.state_venue || ''}
                                                onChange={handleInputChange}
                                                placeholder="Enter State"
                                                required={formData.transfer === 'Yes'}  // Required only if transfer is yes
                                            />
                                        </Col>
                                    </Form.Group>
                                )}

                                <div className="mt-3 d-flex align-tems-cente justify-content-between">
                                    <Button variant="success" className="m-1" type="submit" onClick={(e) => handleUpdate(e, selectedId)}>Update</Button>
                                    <Button variant="secondary" onClick={handleEditClose}>
                                        Close
                                    </Button>
                                </div>

                            </Row>
                        </Form>
                    </Col>
                </Modal.Body>
            </Modal>

        </div>
    )
}

export default Admin_RescueDetails
