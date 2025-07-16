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

function Social_HIstory() {
    const [visitDetails, setVisitDetails] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [previewRequested, setPreviewRequested] = useState(false);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);

    const userType = Cookies.get('usertype');

    const filteredRescueDetails = (visitDetails || []).filter((item) => {
        const searchTerm = searchQuery.toLowerCase();
        return (
            String(item.admission_no).toLowerCase().includes(searchTerm) ||
            String(item.family_relationship).toLowerCase().includes(searchTerm) ||
            String(item.living_arrangements).toLowerCase().includes(searchTerm) ||
            String(item.education_bg).toLowerCase().includes(searchTerm) ||
            String(item.currentEmp_status).toLowerCase().includes(searchTerm) 
        );
    });

    const [socialData, setSocialData] = useState({
        family_relationship: '',
        admission_no: '',
        date: '',
        socialCircle_relationship: '',
        relationship_significant: '',
        living_arrangements: '',
        education_bg: '',
        currentEmp_status: '',
        socialRecreation_activity: '',
        social_outlets: '',
        socialMed_engagement: '',
        technology_related: '',
    })

    const apiRoute = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
    });
    const getVisitDetails = async () => {
        try {
            const response = await apiRoute.get('/recovery/get_social');
            console.log(response.data);
            setVisitDetails(response.data.data); // Should be an array
        } catch (error) {
            console.error("Error fetching Social Details:", error);
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
            const response = await apiRoute.get(`/recovery/get_socialHistory/${id}`);
            const data = response.data;

            setSocialData((socialData) => ({
                ...socialData,
                admission_no: data.admission_no || 'NULL',
                date: data.date || 'NULL',
                family_relationship: data.family_relationship || 'NULL',
                socialCircle_relationship: data.socialCircle_relationship || 'NULL',
                relationship_significant: data.relationship_significant || 'NULL',
                living_arrangements: data.living_arrangements || 'NULL',
                education_bg: data.education_bg || "NULL",
                currentEmp_status: data.currentEmp_status || "NULL",
                socialRecreation_activity: data.socialRecreation_activity || "NULL",
                social_outlets: data.social_outlets || "NULL",
                socialMed_engagement: data.socialMed_engagement || "NULL",
                technology_related: data.technology_related || "NULL"
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
        setSocialData((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditform = async (id) => {
        try {
            const response = await apiRoute.get(`/recovery/get_socialHistory/${id}`);
            const data = response.data;

            setSocialData((socialData) => ({
                ...socialData,
                id:data.id ||'',
                admission_no: data.admission_no || 'NULL',
                date: data.date || 'NULL',
                family_relationship: data.family_relationship || 'NULL',
                socialCircle_relationship: data.socialCircle_relationship || 'NULL',
                relationship_significant: data.relationship_significant || 'NULL',
                living_arrangements: data.living_arrangements || 'NULL',
                education_bg: data.education_bg || "NULL",
                currentEmp_status: data.currentEmp_status || "NULL",
                socialRecreation_activity: data.socialRecreation_activity || "NULL",
                social_outlets: data.social_outlets || "NULL",
                socialMed_engagement: data.socialMed_engagement || "NULL",
                technology_related: data.technology_related || "NULL"
            }));

            setShow(true);

        } catch (error) {
            console.error("Error fetching form data:", error);
            alert("Basic Detail is not found");
        }
    };

    const handleSocialUpdate = async (e, id) => {
        e.preventDefault();
        try {
            const res = await apiRoute.post(`/recovery/updateSocialHistory/${id}`, socialData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            alert('Social History Form updated successfully!');
            setSocialData({
                family_relationship: '',
                socialCircle_relationship: '',
                relationship_significant: '',
                living_arrangements: '',
                education_bg: '',
                currentEmp_status: '',
                socialRecreation_activity: '',
                social_outlets: '',
                socialMed_engagement: '',
                technology_related: '',
            })
            handleClose(true);
            getVisitDetails();
        } catch (err) {
            console.error(err);
            alert('Update failed.');
        }
    }

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
                        <h3 className="section_title text-center">Social History</h3>
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
                                <th>Relationship with Family</th>
                                <th>Current Living Arrangements</th>
                                <th>Educational Background</th>
                                <th>Current Employment Status</th>
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
                                        <td>{item.family_relationship || "Null"}</td>
                                        <td>{item.living_arrangements || "Null"}</td>
                                        <td>{item.education_bg || "Null"}</td>
                                        <td>{item.currentEmp_status || "Null"}</td>
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
                </Row>
            </Container>
            <div ref={formRef} style={{ position: "absolute", left: "-9999px", top: 0, background: "#fff", padding: "20px", width: "210mm" }}>
                <Row className="d-flex align-items-center justify-content-start mb-2">
                    <Col md={2} className='d-flex align-items-center pdf_logo'>
                        <img src={manasu_logo} className="pdf_logo" alt="" />

                    </Col>
                    <Col md={8}>
                        <h4 className="text-center">SOCIAL HISTORY </h4>
                    </Col>
                </Row>
                <Row className='d-flex align-items-center justify-content-center'>
                    <Col md={5}>
                        <Form.Group className="mb-3 d-flex align-items-center" as={Row}>
                            <Form.Label column sm="6" className='text-start'>Admission No. :</Form.Label>
                            <Col md={6}>
                                <div className='text-start'>
                                    {socialData.admission_no}
                                </div>
                            </Col>
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group className="mb-3 d-flex align-items-center" as={Row}>
                            <Form.Label column sm="6" className='text-start'>Date :</Form.Label>
                            <Col md={6}>
                                <div className='text-start'>
                                    {formatDateTime(socialData.date)}
                                </div>
                            </Col>
                        </Form.Group>
                    </Col>
                </Row>
                <Form className='mt-4'>
                    <Form.Group className="mb-3" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <li className='icon-li'>
                                <h5>Relationship with Family : </h5>
                            </li>
                        </Form.Label>
                        <Col md={6}>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                name='family_relationship'
                                value={socialData.family_relationship}
                                onChange={handleInputChange}
                                required
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <li className='icon-li'>
                                <h5>Relationship with Friends and Social Circles : </h5>
                            </li>
                        </Form.Label>
                        <Col md={6}>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                name='socialCircle_relationship'
                                value={socialData.socialCircle_relationship}
                                onChange={handleInputChange}
                                required
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <li className='icon-li'>
                                <h5>Relationship with Significant Others : </h5>
                            </li>
                        </Form.Label>
                        <Col md={6}>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                name='relationship_significant'
                                value={socialData.relationship_significant}
                                onChange={handleInputChange}
                                required
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <li className='icon-li'>
                                <h5>Current Living Arrangements : </h5>
                            </li>
                        </Form.Label>
                        <Col md={6}>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                name='living_arrangements'
                                value={socialData.living_arrangements}
                                onChange={handleInputChange}
                                required
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <li className='icon-li'>
                                <h5>Educational Background : </h5>
                            </li>
                        </Form.Label>
                        <Col md={6}>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                name='education_bg'
                                value={socialData.education_bg}
                                onChange={handleInputChange}
                                required
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <li className='icon-li'>
                                <h5>Current Employment Status : </h5>
                            </li>
                        </Form.Label>
                        <Col md={6}>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                name='currentEmp_status'
                                value={socialData.currentEmp_status}
                                onChange={handleInputChange}
                                required
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <li className='icon-li'>
                                <h5>Recreational Activities : </h5>
                            </li>
                        </Form.Label>
                        <Col md={6}>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                name='socialRecreation_activity'
                                value={socialData.socialRecreation_activity}
                                onChange={handleInputChange}
                                required
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <li className='icon-li'>
                                <h5>Social Outlets : </h5>
                            </li>
                        </Form.Label>
                        <Col md={6}>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                name='social_outlets'
                                value={socialData.social_outlets}
                                onChange={handleInputChange}
                                required
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <li className='icon-li'>
                                <h5>Social Media Engagement : </h5>
                            </li>
                        </Form.Label>
                        <Col md={6}>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                name='socialMed_engagement'
                                value={socialData.socialMed_engagement}
                                onChange={handleInputChange}
                                required
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <li className='icon-li'>
                                <h5>Technology-related Stressors : </h5>
                            </li>
                        </Form.Label>
                        <Col md={6}>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                name='technology_related'
                                value={socialData.technology_related}
                                onChange={handleInputChange}
                                required
                            />
                        </Col>
                    </Form.Group>
                </Form>
            </div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Social History</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <li className='icon-li'>
                            <h6>Relationship with Family:</h6>
                        </li>
                        <Form.Group>
                            <Form.Control
                                type='text'
                                name='family_relationship'
                                value={socialData.family_relationship}
                                onChange={handleInputChange}
                                required />
                        </Form.Group>

                        <li className='icon-li'>
                            <h6>Relationship with Friends and Social Circles:</h6>
                        </li>
                        <Form.Group>
                            <Form.Control
                                type='text'
                                name='socialCircle_relationship'
                                value={socialData.socialCircle_relationship}
                                onChange={handleInputChange}
                                required />
                        </Form.Group>

                        <li className='icon-li'>
                            <h6>Relationship with Significant Others:</h6>
                        </li>
                        <Form.Group>
                            <Form.Control
                                type='text'
                                name='relationship_significant'
                                value={socialData.relationship_significant}
                                onChange={handleInputChange}
                                required />
                        </Form.Group>

                        <li className='icon-li'>
                            <h6>Current Living Arrangements:</h6>
                        </li>
                        <Form.Group>
                            <Form.Control
                                type='text'
                                name='living_arrangements'
                                value={socialData.living_arrangements}
                                onChange={handleInputChange}
                                required />
                        </Form.Group>

                        <li className='icon-li'>
                            <h6>Educational Background :</h6>
                        </li>
                        <Form.Group>
                            <Form.Control
                                type='text'
                                name='education_bg'
                                value={socialData.education_bg}
                                onChange={handleInputChange}
                                required />
                        </Form.Group>

                        <li className='icon-li'>
                            <h6>Current Employment Status :</h6>
                        </li>
                        <Form.Group>
                            <Form.Control
                                type='text'
                                name='currentEmp_status'
                                value={socialData.currentEmp_status}
                                onChange={handleInputChange}
                                required />
                        </Form.Group>

                        <li className='icon-li'>
                            <h6>Recreational Activities :</h6>
                        </li>
                        <Form.Group>
                            <Form.Control
                                type='text'
                                name='socialRecreation_activity'
                                value={socialData.socialRecreation_activity}
                                onChange={handleInputChange}
                                required />
                        </Form.Group>

                        <li className='icon-li'>
                            <h6>Social Outlets :</h6>
                        </li>
                        <Form.Group>
                            <Form.Control
                                type='text'
                                name='social_outlets'
                                value={socialData.social_outlets}
                                onChange={handleInputChange}
                                required />
                        </Form.Group>

                        <li className='icon-li'>
                            <h6>Social Media Engagement :</h6>
                        </li>
                        <Form.Group>
                            <Form.Control
                                type='text'
                                name='socialMed_engagement'
                                value={socialData.socialMed_engagement}
                                onChange={handleInputChange}
                                required />
                        </Form.Group>

                        <li className='icon-li'>
                            <h6>Technology-related Stressors :</h6>
                        </li>
                        <Form.Group>
                            <Form.Control
                                type='text'
                                name='technology_related'
                                value={socialData.technology_related}
                                onChange={handleInputChange}
                                required />
                        </Form.Group>
                        <div className="mt-3">
                            <Button variant="success" className="m-1" type="submit" onClick={(e) => handleSocialUpdate(e, socialData.id)}>Update</Button>
                            <Button variant="secondary" className="m-1" onClick={handleClose}>Close</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default Social_HIstory
