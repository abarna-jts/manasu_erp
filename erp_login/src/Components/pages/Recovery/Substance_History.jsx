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

function Substance_History() {
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
            String(item.substance_use).toLowerCase().includes(searchTerm) ||
            String(item.frequency).toLowerCase().includes(searchTerm) ||
            String(item.quantity).toLowerCase().includes(searchTerm) ||
            String(item.motivation_use).toLowerCase().includes(searchTerm)
        );
    });

    const [substanceData, setSubstanceData] = useState({
        admission_no: '',
        date: '',
        substance_use: '',
        age_onset: '',
        frequency: '',
        quantity: '',
        motivation_use: '',
        environmental_trigger: '',
        impact_occupation: '',
        impact_interpersonal: '',
        financial_consequences: '',
        craving_intensity: '',
        previous_treatment: '',
        relapse_history: '',
    })

    const apiRoute = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
    });
    const getVisitDetails = async () => {
        try {
            const response = await apiRoute.get('/recovery/get_subUse');
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
            const response = await apiRoute.get(`/recovery/get_substance/${id}`);
            const data = response.data;

            setSubstanceData((substanceData) => ({
                ...substanceData,
                admission_no: data.admission_no || 'NULL',
                date: data.date || 'NULL',
                substance_use: data.substance_use || 'NULL',
                age_onset: data.age_onset || 'NULL',
                frequency: data.frequency || 'NULL',
                quantity: data.quantity || 'NULL',
                motivation_use: data.motivation_use || 'NULL',
                environmental_trigger: data.environmental_trigger || "NULL",
                impact_occupation: data.impact_occupation || "NULL",
                impact_interpersonal: data.impact_interpersonal || 'NULL',
                financial_consequences: data.financial_consequences || 'NULL',
                craving_intensity: data.craving_intensity || 'NULL',
                previous_treatment: data.previous_treatment || 'NULL',
                relapse_history: data.relapse_history || 'NULL',
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
        setSubstanceData((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditform = async (id) => {
        try {
            const response = await apiRoute.get(`/recovery/get_substance/${id}`);
            const data = response.data;

            setSubstanceData((substanceData) => ({
                ...substanceData,
                id: data.id || '',
                admission_no: data.admission_no || 'NULL',
                date: data.date || 'NULL',
                substance_use: data.substance_use || 'NULL',
                age_onset: data.age_onset || 'NULL',
                frequency: data.frequency || 'NULL',
                quantity: data.quantity || 'NULL',
                motivation_use: data.motivation_use || 'NULL',
                environmental_trigger: data.environmental_trigger || "NULL",
                impact_occupation: data.impact_occupation || "NULL",
                impact_interpersonal: data.impact_interpersonal || 'NULL',
                financial_consequences: data.financial_consequences || 'NULL',
                craving_intensity: data.craving_intensity || 'NULL',
                previous_treatment: data.previous_treatment || 'NULL',
                relapse_history: data.relapse_history || 'NULL',
            }));

            setShow(true);

        } catch (error) {
            console.error("Error fetching form data:", error);
            alert("Basic Detail is not found");
        }
    };

    const handleSubstanceUpdate = async (e, id) => {
        e.preventDefault();
        try {
            const res = await apiRoute.post(`/recovery/updateSubstance/${id}`, substanceData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            alert('Substance Use History Form updated successfully!');
            setSubstanceData({
                substance_use: '',
                age_onset: '',
                frequency: '',
                quantity: '',
                motivation_use: '',
                environmental_trigger: '',
                impact_occupation: '',
                impact_interpersonal: '',
                financial_consequences: '',
                craving_intensity: '',
                previous_treatment: '',
                relapse_history: '',
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
                        <h3 className="section_title text-center">Substance Use History</h3>
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
                                <th>Types of Substances Used</th>
                                <th>Frequency </th>
                                <th>Quantity </th>
                                <th>Motivations for Use</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.length > 0 ? (
                                currentItems.map((item, index) => (
                                    <tr key={item.id}>
                                        <td>{index + 1}</td>
                                        <td>{item.admission_no || "Null"}</td>
                                        <td>{formatDateTime(item.date) || "Null"}</td>
                                        <td>{item.substance_use || "Null"}</td>
                                        <td>{item.frequency || "Null"}</td>
                                        <td>{item.quantity || "Null"}</td>
                                        <td>{item.motivation_use || "Null"}</td>
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
                        <h4 className="text-center">SUBSTANCE USE HISTORY </h4>
                    </Col>
                </Row>
                <Row className='d-flex align-items-center justify-content-center'>
                    <Col md={5}>
                        <Form.Group className="mb-3 d-flex align-items-center" as={Row}>
                            <Form.Label column sm="6" className='text-start'>Admission No. :</Form.Label>
                            <Col md={6}>
                                <div className='text-start'>
                                    {substanceData.admission_no}
                                </div>
                            </Col>
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group className="mb-3 d-flex align-items-center" as={Row}>
                            <Form.Label column sm="6" className='text-start'>Date :</Form.Label>
                            <Col md={6}>
                                <div className='text-start'>
                                    {formatDateTime(substanceData.date)}
                                </div>
                            </Col>
                        </Form.Group>
                    </Col>
                </Row>
                <Form className='mt-4'>
                    <Form.Group className="mb-3" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <li className='icon-li'>
                                <h5>Types of Substances Used: </h5>
                            </li>
                        </Form.Label>
                        <Col md={6}>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                name='substance_use'
                                value={substanceData.substance_use}
                                onChange={handleInputChange}
                                required
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <li className='icon-li'>
                                <h5>Age of Onset: </h5>
                            </li>
                        </Form.Label>
                        <Col md={6}>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                name='age_onset'
                                value={substanceData.age_onset}
                                onChange={handleInputChange}
                                required
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <li className='icon-li'>
                                <h5>Frequency : </h5>
                            </li>
                        </Form.Label>
                        <Col md={6}>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                name='frequency'
                                value={substanceData.frequency}
                                onChange={handleInputChange}
                                required
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <li className='icon-li'>
                                <h5>Quantity  : </h5>
                            </li>
                        </Form.Label>
                        <Col md={6}>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                name='quantity'
                                value={substanceData.quantity}
                                onChange={handleInputChange}
                                required
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <li className='icon-li'>
                                <h5>Motivations for Use  : </h5>
                            </li>
                        </Form.Label>
                        <Col md={6}>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                name='motivation_use'
                                value={substanceData.motivation_use}
                                onChange={handleInputChange}
                                required
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <li className='icon-li'>
                                <h5>Environmental Triggers  : </h5>
                            </li>
                        </Form.Label>
                        <Col md={6}>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                name='environmental_trigger'
                                value={substanceData.environmental_trigger}
                                onChange={handleInputChange}
                                required
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <li className='icon-li'>
                                <h5>Impact on Occupational or Academic Functioning :  </h5>
                            </li>
                        </Form.Label>
                        <Col md={6}>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                name='impact_occupation'
                                value={substanceData.impact_occupation}
                                onChange={handleInputChange}
                                required
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <li className='icon-li'>
                                <h5>Impact on Interpersonal Relationships :  </h5>
                            </li>
                        </Form.Label>
                        <Col md={6}>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                name='impact_interpersonal'
                                value={substanceData.impact_interpersonal}
                                onChange={handleInputChange}
                                required
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <li className='icon-li'>
                                <h5>Legal or Financial Consequences :  </h5>
                            </li>
                        </Form.Label>
                        <Col md={6}>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                name='financial_consequences'
                                value={substanceData.financial_consequences}
                                onChange={handleInputChange}
                                required
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <li className='icon-li'>
                                <h5>Craving intensity :  </h5>
                            </li>
                        </Form.Label>
                        <Col md={6}>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                name='craving_intensity'
                                value={substanceData.craving_intensity}
                                onChange={handleInputChange}
                                required
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <li className='icon-li'>
                                <h5>Previous Treatment Attempts :  </h5>
                            </li>
                        </Form.Label>
                        <Col md={6}>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                name='previous_treatment'
                                value={substanceData.previous_treatment}
                                onChange={handleInputChange}
                                required
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <li className='icon-li'>
                                <h5>Relapse History :  </h5>
                            </li>
                        </Form.Label>
                        <Col md={6}>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                name='relapse_history'
                                value={substanceData.relapse_history}
                                onChange={handleInputChange}
                                required
                            />
                        </Col>
                    </Form.Group>
                </Form>
            </div>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Substance Use History</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <li className='icon-li'>
                            <h5>Types of Substances Used:</h5>
                            <p className='text-muted small' style={{ marginTop: "5px" }}>(Mother's health during pregnancy, exposure to toxins, and any complications)</p>
                        </li>
                        <Form.Select name="substance_use"
                            value={substanceData.substance_use}
                            onChange={handleInputChange}
                            required>
                            <option>Select</option>
                            <option value="Alcohol">Alcohol </option>
                            <option value="Illicit Drugs">Illicit Drugs</option>
                            <option value="Prescription Drugs">Prescription Drugs</option>
                        </Form.Select>

                        <li className='icon-li'>
                            <h5>Age of Onset :</h5>
                        </li>
                        <Form.Group>
                            <Form.Control
                                type='text'
                                name='age_onset'
                                value={substanceData.age_onset}
                                onChange={handleInputChange}
                                required />
                        </Form.Group>

                        <li className='icon-li'>
                            <h5>Frequency :</h5>
                        </li>
                        <Form.Group>
                            <Form.Control
                                type='text'
                                name='frequency'
                                value={substanceData.frequency}
                                onChange={handleInputChange}
                                required />
                        </Form.Group>

                        <li className='icon-li'>
                            <h5>Quantity :</h5>
                        </li>
                        <Form.Group>
                            <Form.Control
                                type='text'
                                name='quantity'
                                value={substanceData.quantity}
                                onChange={handleInputChange}
                                required />
                        </Form.Group>

                        <li className='icon-li'>
                            <h5>Motivations for Use :</h5>
                        </li>
                        <Form.Group>
                            <Form.Control
                                type='text'
                                name='motivation_use'
                                value={substanceData.motivation_use}
                                onChange={handleInputChange}
                                required />
                        </Form.Group>

                        <li className='icon-li'>
                            <h5>Environmental Triggers :</h5>
                        </li>
                        <Form.Group>
                            <Form.Control
                                type='text'
                                name='environmental_trigger'
                                value={substanceData.environmental_trigger}
                                onChange={handleInputChange}
                                required />
                        </Form.Group>

                        <li className='icon-li'>
                            <h5>Impact on Occupational or Academic Functioning :</h5>
                        </li>
                        <Form.Group>
                            <Form.Control
                                type='text'
                                name='impact_occupation'
                                value={substanceData.impact_occupation}
                                onChange={handleInputChange}
                                required />
                        </Form.Group>

                        <li className='icon-li'>
                            <h5>Impact on Interpersonal Relationships :</h5>
                        </li>
                        <Form.Group>
                            <Form.Control
                                type='text'
                                name='impact_interpersonal'
                                value={substanceData.impact_interpersonal}
                                onChange={handleInputChange}
                                required />
                        </Form.Group>

                        <li className='icon-li'>
                            <h5>Legal or Financial Consequences :</h5>
                        </li>
                        <Form.Group>
                            <Form.Control
                                type='text'
                                name='financial_consequences'
                                value={substanceData.financial_consequences}
                                onChange={handleInputChange}
                                required />
                        </Form.Group>

                        <li className='icon-li'>
                            <h5>Craving intensity :</h5>
                        </li>
                        <Form.Group>
                            <Form.Control
                                type='text'
                                name='craving_intensity'
                                value={substanceData.craving_intensity}
                                onChange={handleInputChange}
                                required />
                        </Form.Group>

                        <li className='icon-li'>
                            <h5>Previous Treatment Attempts :</h5>
                        </li>
                        <Form.Group>
                            <Form.Control
                                type='text'
                                name='previous_treatment'
                                value={substanceData.previous_treatment}
                                onChange={handleInputChange}
                                required />
                        </Form.Group>

                        <li className='icon-li'>
                            <h5>Relapse History :</h5>
                        </li>
                        <Form.Group>
                            <Form.Control
                                type='text'
                                name='relapse_history'
                                value={substanceData.relapse_history}
                                onChange={handleInputChange}
                                required />
                        </Form.Group>
                        <div className="mt-3">
                            <Button variant="success" className="m-1" type="submit" onClick={(e) => handleSubstanceUpdate(e, substanceData.id)}>Update</Button>
                            <Button variant="secondary" className="m-1" onClick={handleClose}>Close</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

        </>
    )
}

export default Substance_History
