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

function Basic_detail() {
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
            String(item.patient_name).toLowerCase().includes(searchTerm) ||
            String(item.patient_age).toLowerCase().includes(searchTerm) ||
            String(item.marital_status).toLowerCase().includes(searchTerm) ||
            String(item.living_arrangements).toLowerCase().includes(searchTerm) ||
            String(item.family_structure).toLowerCase().includes(searchTerm)
        );
    });
    const [formData, setFormData] = useState({
        id: '',
        admission_no: '',
        date: '',
        patient_name: '',
        patient_age: '',
        patient_gender: 'Male',
        sexual_orientation: '',
        education_bg: '',
        occupation: '',
        marital_status: '',
        economic_status: '',
        religion: '',
        informant: '',
        residential_address: '',
        living_arrangements: '',
        family_structure: '',
        cultural_identity: '',
        language1: '',
        language2: '',
    });

    const apiRoute = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
    });
    const getVisitDetails = async () => {
        try {
            const response = await apiRoute.get('/recovery/get_info');
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
            const response = await apiRoute.get(`/recovery/get_information/${id}`);
            const data = response.data;

            setFormData((formData) => ({
                ...formData,
                admission_no: data.admission_no || '',
                date: data.date || '',
                patient_name: data.patient_name || '',
                patient_age: data.patient_age || '',
                patient_gender: data.patient_gender || '',
                sexual_orientation: data.sexual_orientation || '',
                education_bg: data.education_bg || '',
                occupation: data.occupation || '',
                marital_status: data.marital_status || '',
                economic_status: data.economic_status || '',
                religion: data.religion || '',
                informant: data.informant || '',
                residential_address: data.residential_address || '',
                living_arrangements: data.living_arrangements || '',
                family_structure: data.family_structure || '',
                cultural_identity: data.cultural_identity || '',
                language1: data.language1 || '',
                language2: data.language2 || '',
            }));

            setPreviewRequested(true); // trigger the effect after state updates
        } catch (error) {
            console.error("Error fetching form data:", error);
            alert("Basic Details ID is not found");
        }
    };

    const handleEditform = async (id) => {
        try {
            const response = await apiRoute.get(`/recovery/get_information/${id}`);
            const data = response.data;

            setFormData((formData) => ({
                ...formData,
                admission_no: data.admission_no || '',
                id: data.id || '',
                date: data.date || '',
                patient_name: data.patient_name || '',
                patient_age: data.patient_age || '',
                patient_gender: data.patient_gender || '',
                sexual_orientation: data.sexual_orientation || '',
                education_bg: data.education_bg || '',
                occupation: data.occupation || '',
                marital_status: data.marital_status || '',
                economic_status: data.economic_status || '',
                religion: data.religion || '',
                informant: data.informant || '',
                residential_address: data.residential_address || '',
                living_arrangements: data.living_arrangements || '',
                family_structure: data.family_structure || '',
                cultural_identity: data.cultural_identity || '',
                language1: data.language1 || '',
                language2: data.language2 || '',
            }));

            setShow(true);

        } catch (error) {
            console.error("Error fetching form data:", error);
            alert("Basic Detail is not found");
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
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async (e, id) => {
        e.preventDefault();

        try {
            const res = await apiRoute.post(`/recovery/updateInformation/${id}`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            alert('Demographic Information Form updated successfully!');
            // window.location.reload();
            setFormData({
                patient_name: '',
                patient_age: '',
                patient_gender: 'Male',
                sexual_orientation: '',
                education_bg: '',
                occupation: '',
                marital_status: '',
                economic_status: '',
                religion: '',
                informant: '',
                residential_address: '',
                living_arrangements: '',
                family_structure: '',
                cultural_identity: '',
                language1: '',
                language2: '',
            })
            handleClose(true);
            getVisitDetails();
        } catch (err) {
            console.error(err);
            alert('Update failed.');
        }
    };

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
            const res = await apiRoute.delete(`/social_remover/BasicDetailToRecBin/${admission_no}`);
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
                        <h3 className="section_title text-center">Demographic Information</h3>
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
                                <th>Name</th>
                                <th>Age</th>
                                <th>Marital Status</th>
                                <th>Living Arrangements</th>
                                <th>Family Structure</th>
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
                                        <td>{item.patient_name || "Null"}</td>
                                        <td>{item.patient_age || "Null"}</td>
                                        <td>{item.marital_status || "Null"}</td>
                                        <td>{item.living_arrangements || "Null"}</td>
                                        <td>{item.family_structure || "Null"}</td>
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
                        <h4 className="text-center">DEMOGRAPHIC IDENTIFICATION </h4>
                    </Col>
                </Row>
                <Row className='d-flex align-items-center justify-content-center'>
                    <Col md={5}>
                        <Form.Group className="mb-3 d-flex align-items-center" as={Row}>
                            <Form.Label column sm="6" className='text-start'>Admission No. :</Form.Label>
                            <Col md={6}>
                                <div className='text-start'>
                                    {formData.admission_no}
                                </div>
                            </Col>
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group className="mb-3 d-flex align-items-center" as={Row}>
                            <Form.Label column sm="6" className='text-start'>Date :</Form.Label>
                            <Col md={6}>
                                <div className='text-start'>
                                    {formatDateTime(formData.date)}
                                </div>
                            </Col>
                        </Form.Group>
                    </Col>
                </Row>
                <Form className='mt-4'>
                    <Form.Group as={Row} className="mb-2 text-start" >
                        <Form.Label column sm="4">Name: </Form.Label>
                        <Col sm="8">
                            <Form.Control type='text'
                                name='patient_name'
                                value={formData.patient_name}
                                onChange={handleInputChange}
                                required
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-2 text-start" >
                        <Form.Label column sm="4">Age: </Form.Label>
                        <Col sm="8">
                            <Form.Control type='text'
                                name='patient_age'
                                value={formData.patient_age}
                                onChange={handleInputChange}
                                required
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-2 text-start" >
                        <Form.Label column sm="4">Gender: </Form.Label>
                        <Col sm="8">
                            <Form.Control type='text'
                                name='patient_gender'
                                value={formData.patient_gender}
                                onChange={handleInputChange}
                                readOnly
                                required
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-2 text-start" >
                        <Form.Label column sm="4">Sexual Orientation: </Form.Label>
                        <Col sm="8">
                            <Form.Control type='text'
                                name='sexual_orientation'
                                value={formData.sexual_orientation}
                                onChange={handleInputChange}
                                required
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-2 text-start" >
                        <Form.Label column sm="4">Educational Background: </Form.Label>
                        <Col sm="8">
                            <Form.Control type='text'
                                name='education_bg'
                                value={formData.education_bg}
                                onChange={handleInputChange}
                                required
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-2 text-start" >
                        <Form.Label column sm="4">Occupation and Employment Status: </Form.Label>
                        <Col sm="8">
                            <Form.Control type='text'
                                name='occupation'
                                value={formData.occupation}
                                onChange={handleInputChange}
                                required
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-2 text-start" >
                        <Form.Label column sm="4">Marital Status: </Form.Label>
                        <Col sm="8">
                            <Form.Control type='text'
                                name='marital_status'
                                value={formData.marital_status}
                                onChange={handleInputChange}
                                required
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-2 text-start" >
                        <Form.Label column sm="4">Socio Economic Status: </Form.Label>
                        <Col sm="8">
                            <Form.Control type='text'
                                name='economic_status'
                                value={formData.economic_status}
                                onChange={handleInputChange}
                                required
                            />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-2 text-start" >
                        <Form.Label column sm="4">Religion: </Form.Label>
                        <Col sm="8">
                            <Form.Control type="text"
                                name='religion'
                                value={formData.religion}
                                onChange={handleInputChange}
                                required />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-2 text-start" >
                        <Form.Label column sm="4">Informant: </Form.Label>
                        <Col sm="8">
                            <Form.Control type="text"
                                name='informant'
                                value={formData.informant}
                                onChange={handleInputChange}
                                required />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-2 text-start" >
                        <Form.Label column sm="4">Residential Address (current address): </Form.Label>
                        <Col sm="8">
                            <Form.Control type="text"
                                name='residential_address'
                                value={formData.residential_address}
                                onChange={handleInputChange}
                                required />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-2 text-start" >
                        <Form.Label column sm="4">Living Arrangements: </Form.Label>
                        <Col sm="8">
                            <Form.Select name="living_arrangements"
                                value={formData.living_arrangements}
                                onChange={handleInputChange}
                                required>
                                <option>Select</option>
                                <option value="Family">Family</option>
                                <option value="Parents">Parents</option>
                                <option value="Roommates">Roommates</option>
                                <option value="Alone">Alone</option>
                            </Form.Select>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-2 text-start" >
                        <Form.Label column sm="4">Family Structure: </Form.Label>
                        <Col sm="8">
                            <Form.Select name="family_structure"
                                value={formData.family_structure}
                                onChange={handleInputChange}
                                required>
                                <option>Select</option>
                                <option value="Nuclear">Nuclear</option>
                                <option value="Joint">Joint</option>
                                <option value="Alone">Alone</option>
                            </Form.Select>
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-2 text-start" >
                        <Form.Label column sm="4">Cultural Identity: </Form.Label>
                        <Col sm="8">
                            <Form.Control type="text"
                                name='cultural_identity'
                                value={formData.cultural_identity}
                                onChange={handleInputChange}
                                required />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-2 text-start" >
                        <Form.Label column sm="4">Language Preferences:  </Form.Label>
                        <Col sm="4">
                            <Form.Control type="text"
                                name='language1'
                                value={formData.language1}
                                onChange={handleInputChange}
                                required />
                        </Col>
                        <Col sm="4">
                            <Form.Control type="text"
                                name='language2'
                                value={formData.language2}
                                onChange={handleInputChange} />
                        </Col>
                    </Form.Group>

                </Form>
            </div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Demographic Information</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Col md={12}>
                        <Form>
                            <Form.Group as={Row} className="mb-2 text-start d-flex align-items-center justify-content-center" >
                                <Form.Label column sm="4">Name: </Form.Label>
                                <Col sm="8">
                                    <Form.Control type='text'
                                        name='patient_name'
                                        value={formData.patient_name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-2 text-start d-flex align-items-center justify-content-center" >
                                <Form.Label column sm="4">Age: </Form.Label>
                                <Col sm="8">
                                    <Form.Control type='text'
                                        name='patient_age'
                                        value={formData.patient_age}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-2 text-start d-flex align-items-center justify-content-center" >
                                <Form.Label column sm="4">Gender: </Form.Label>
                                <Col sm="8">
                                    <Form.Control type='text'
                                        name='patient_gender'
                                        value={formData.patient_gender}
                                        onChange={handleInputChange}
                                        readOnly
                                    />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-2 text-start d-flex align-items-center justify-content-center" >
                                <Form.Label column sm="4">Sexual Orientation:</Form.Label>
                                <Col sm="8">
                                    <Form.Control type='text'
                                        name='sexual_orientation'
                                        value={formData.sexual_orientation}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-2 text-start d-flex align-items-center justify-content-center" >
                                <Form.Label column sm="4">Educational Background: </Form.Label>
                                <Col sm="8">
                                    <Form.Control type='text'
                                        name='education_bg'
                                        value={formData.education_bg}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-2 text-start d-flex align-items-center justify-content-center" >
                                <Form.Label column sm="4">Occupation and Employment Status: </Form.Label>
                                <Col sm="8">
                                    <Form.Control type='text'
                                        name='occupation'
                                        value={formData.occupation}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-2 text-start d-flex align-items-center justify-content-center" >
                                <Form.Label column sm="4">Marital Status: </Form.Label>
                                <Col sm="8">
                                    <Form.Control type='text'
                                        name='marital_status'
                                        value={formData.marital_status}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-2 text-start d-flex align-items-center justify-content-center" >
                                <Form.Label column sm="4">Socio Economic Status: </Form.Label>
                                <Col sm="8">
                                    <Form.Control type='text'
                                        name='economic_status'
                                        value={formData.economic_status}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-2 text-start d-flex align-items-center justify-content-center" >
                                <Form.Label column sm="4">Religion: </Form.Label>
                                <Col sm="8">
                                    <Form.Control type="text"
                                        name='religion'
                                        value={formData.religion}
                                        onChange={handleInputChange}
                                        required />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-2 text-start d-flex align-items-center justify-content-center" >
                                <Form.Label column sm="4">Informant: </Form.Label>
                                <Col sm="8">
                                    <Form.Control type="text"
                                        name='informant'
                                        value={formData.informant}
                                        onChange={handleInputChange}
                                        required />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-2 text-start d-flex align-items-center justify-content-center" >
                                <Form.Label column sm="4">Residential Address (current address):  </Form.Label>
                                <Col sm="8">
                                    <Form.Control type="text"
                                        name='residential_address'
                                        value={formData.residential_address}
                                        onChange={handleInputChange}
                                        required />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-2 text-start d-flex align-items-center justify-content-center" >
                                <Form.Label column sm="4">Living Arrangements: </Form.Label>
                                <Col sm="8">
                                    <Form.Select name="living_arrangements"
                                        value={formData.living_arrangements}
                                        onChange={handleInputChange}
                                        required>
                                        <option>Select</option>
                                        <option value="Family">Family</option>
                                        <option value="Parents">Parents</option>
                                        <option value="Roommates">Roommates</option>
                                        <option value="Alone">Alone</option>
                                    </Form.Select>
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-2 text-start d-flex align-items-center justify-content-center" >
                                <Form.Label column sm="4">Family Structure: </Form.Label>
                                <Col sm="8">
                                    <Form.Select name="family_structure"
                                        value={formData.family_structure}
                                        onChange={handleInputChange}
                                        required>
                                        <option>Select</option>
                                        <option value="Nuclear">Nuclear</option>
                                        <option value="Joint">Joint</option>
                                        <option value="Alone">Alone</option>
                                    </Form.Select>
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-2 text-start d-flex align-items-center justify-content-center" >
                                <Form.Label column sm="4">Cultural Identity:  </Form.Label>
                                <Col sm="8">
                                    <Form.Control type="text"
                                        name='cultural_identity'
                                        value={formData.cultural_identity}
                                        onChange={handleInputChange}
                                        required />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-2 text-start d-flex align-items-center justify-content-center" >
                                <Form.Label column sm="4">Language Preferences:  </Form.Label>
                                <Col sm="4">
                                    <Form.Control type="text"
                                        name='language1'
                                        value={formData.language1}
                                        onChange={handleInputChange}
                                        required />
                                </Col>
                                <Col sm="4">
                                    <Form.Control type="text"
                                        name='language2'
                                        value={formData.language2}
                                        onChange={handleInputChange} />
                                </Col>
                            </Form.Group>

                            <div className="mt-3">
                                <Button variant="success" className="m-1" type="submit" onClick={(e) => handleUpdate(e, formData.id)}>Update</Button>
                                <Button variant="secondary" className="m-1" onClick={handleClose}>Close</Button>
                            </div>

                        </Form>
                    </Col>
                </Modal.Body>
            </Modal>
        </div>


    )
}

export default Basic_detail
