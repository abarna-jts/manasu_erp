import React from 'react'
import { Breadcrumb, Form, InputGroup, Container, Row, Col, Table, Button } from '@themesberg/react-bootstrap';
import { useState, useEffect } from "react";
import axios from 'axios';
import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import manasu_logo from "../Admission/Manasu-Logo.png";

function Family_History() {
    const [visitDetails, setVisitDetails] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [previewRequested, setPreviewRequested] = useState(false);

    const filteredRescueDetails = (visitDetails || []).filter((item) => {
        const searchTerm = searchQuery.toLowerCase();
        return (
            String(item.name).toLowerCase().includes(searchTerm) ||
            String(item.date).toLowerCase().includes(searchTerm) ||
            String(item.living_arrangement).toLowerCase().includes(searchTerm)
        );
    });

    const [familyData, setFamilyData] = useState({
        admission_no: '',
        date: '',
        family_composition: [],
        family_dynamics: [],
        marriage_type: '',
        family_history: '',
        genetic_predisposition: '',
        family_changes: [],
        family_substance: ''
    })

    const apiRoute = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
    });
    const getVisitDetails = async () => {
        try {
            const response = await apiRoute.get('/recovery/get_family');
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
            const response = await apiRoute.get(`/recovery/get_familyHistory/${id}`);
            const data = response.data;

            setFamilyData((familyData) => ({
                ...familyData,
                admission_no: data.admission_no || 'NULL',
                date: data.date || 'NULL',
                family_composition: data.family_composition?.split(',') || ["NULL"],
                family_dynamics: data.family_dynamics?.split(',') || ["NULL"],
                marriage_type: data.marriage_type || 'NULL',
                family_history: data.family_history || 'NULL',
                genetic_predisposition: data.genetic_predisposition || 'NULL',
                family_changes: data.family_changes?.split(',') || ["NULL"],
                family_substance: data.family_substance || "NULL"
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
        setFamilyData((prev) => ({ ...prev, [name]: value }));
    };
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
                        <h3 className="section_title text-center">Family History</h3>
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
                                <th>Family Composition</th>
                                <th>Family Dynamics</th>
                                <th>Type of Marriage</th>
                                <th>Genetic Predispositions</th>
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
                                        <td>{item.family_composition || "Null"}</td>
                                        <td>{item.family_dynamics || "Null"}</td>
                                        <td>{item.marriage_type || "Null"}</td>
                                        <td>{item.genetic_predisposition || "Null"}</td>
                                        <td>
                                            <button className="btn btn-success icon_details"
                                                onClick={() => {
                                                    fetchFormData(item.id);
                                                }}
                                            >
                                                <i className="fas fa-eye"></i>
                                            </button>
                                            {/* <button className="btn btn-primary icon_details"
                                                            onClick={() => {
                                                                handleEditform(item.id);
                                                            }}
                                                        ><i className="fas fa-edit"></i> </button> */}
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
                        <h4 className="text-center">FAMILY HISTORY </h4>
                    </Col>
                </Row>
                <Row className='d-flex align-items-center justify-content-center'>
                    <Col md={5}>
                        <Form.Group className="mb-3 d-flex align-items-center" as={Row}>
                            <Form.Label column sm="6" className='text-start'>Admission No. :</Form.Label>
                            <Col md={6}>
                                <div className='text-start'>
                                    {familyData.admission_no}
                                </div>
                            </Col>
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group className="mb-3 d-flex align-items-center" as={Row}>
                            <Form.Label column sm="6" className='text-start'>Date :</Form.Label>
                            <Col md={6}>
                                <div className='text-start'>
                                    {formatDateTime(familyData.date)}
                                </div>
                            </Col>
                        </Form.Group>
                    </Col>
                </Row>
                <Form className='mt-4'>
                    <Form.Group className="mb-3" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <li className='icon-li'>
                                <h5>Family Composition: </h5>
                            </li>
                        </Form.Label>
                        <Col md={6}>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                name='family_composition'
                                value={familyData.family_composition}
                                onChange={handleInputChange}
                                required
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <li className='icon-li'>
                                <h5>Family Dynamics: </h5>
                            </li>
                        </Form.Label>
                        <Col md={6}>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                name='family_dynamics'
                                value={familyData.family_dynamics}
                                onChange={handleInputChange}
                                required
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <li className='icon-li'>
                                <h5>Type of Marriage: </h5>
                            </li>
                        </Form.Label>
                        <Col md={6}>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                name='marriage_type'
                                value={familyData.marriage_type}
                                onChange={handleInputChange}
                                required
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <li className='icon-li'>
                                <h5>Family History of Psychiatric Disorders (any hereditary conditions) : </h5>
                            </li>
                        </Form.Label>
                        <Col md={6}>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                name='family_history'
                                value={familyData.family_history}
                                onChange={handleInputChange}
                                required
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <li className='icon-li'>
                                <h5>Genetic Predispositions: (genetic conditions or predispositions) : </h5>
                            </li>
                        </Form.Label>
                        <Col md={6}>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                name='genetic_predisposition'
                                value={familyData.genetic_predisposition}
                                onChange={handleInputChange}
                                required
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <li className='icon-li'>
                                <h5>Family Changes or Transitions : </h5>
                            </li>
                        </Form.Label>
                        <Col md={6}>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                name='family_changes'
                                value={familyData.family_changes}
                                onChange={handleInputChange}
                                required
                            />
                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <li className='icon-li'>
                                <h5>Substance Use within the Family : </h5>
                            </li>
                        </Form.Label>
                        <Col md={6}>
                            <Form.Control
                                as="textarea"
                                rows={2}
                                name='family_substance'
                                value={familyData.family_substance}
                                onChange={handleInputChange}
                                required
                            />
                        </Col>
                    </Form.Group>
                </Form>
            </div>
        </>
    )
}

export default Family_History
