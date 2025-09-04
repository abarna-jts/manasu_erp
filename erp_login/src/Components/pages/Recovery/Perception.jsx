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

function Perception() {
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
            String(item.hallucination_type).toLowerCase().includes(searchTerm) ||
            String(item.illusion).toLowerCase().includes(searchTerm) ||
            String(item.perception_changes).toLowerCase().includes(searchTerm)
        );
    });

    const [perceptionData, setPerceptionData] = useState({
        hallucination_type: [],
        heard: '',
        voices_heard: '',
        part_of_day: '',
        female_male_voices: '',
        interpreted_person: '',
        illusion: [],
        perception_changes: [],
        somatic: [],
        others: [],
        admission_no: '',
        date: '',
    })

    const apiRoute = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
    });
    const getVisitDetails = async () => {
        try {
            const response = await apiRoute.get('/recovery/get_perception');
            console.log(response.data);
            setVisitDetails(response.data.data); // Should be an array
        } catch (error) {
            console.error("Error fetching Speech Details:", error);
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
            const response = await apiRoute.get(`/recovery/getPerception/${id}`);
            const data = response.data;

            setPerceptionData((perceptionData) => ({
                ...perceptionData,
                admission_no: data.admission_no || 'NULL',
                date: data.date || 'NULL',
                hallucination_type: data.hallucination_type?.split(',') || ["NULL"],
                heard: data.heard || 'NULL',
                voices_heard: data.voices_heard || 'NULL',
                part_of_day: data.part_of_day || 'NULL',
                female_male_voices: data.female_male_voices || 'NULL',
                interpreted_person: data.interpreted_person || 'NULL',
                illusion: data.illusion?.split(',') || ["NULL"],
                perception_changes: data.perception_changes?.split(',') || ["NULL"],
                somatic: data.somatic?.split(',') || ["NULL"],
                others: data.others?.split(',') || ["NULL"],
            }));

            setPreviewRequested(true); // trigger the effect after state updates
        } catch (error) {
            console.error("Error fetching form data:", error);
            alert("Speech ID is not found");
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

        await new Promise((resolve) => setTimeout(resolve, 100)); // Wait for DOM to update

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

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;

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
            const response = await apiRoute.get(`/recovery/getPerception/${id}`);
            const data = response.data;

            setPerceptionData(perceptionData => ({
                ...perceptionData,
                id: data.id || '',
                admission_no: data.admission_no || '',
                date: data.date || '',
                hallucination_type: data.hallucination_type?.split(',').map(i => i.trim()) || [],
                heard: data.heard || '',
                voices_heard: data.voices_heard || '',
                part_of_day: data.part_of_day || '',
                female_male_voices: data.female_male_voices || '',
                interpreted_person: data.interpreted_person || '',
                illusion: data.illusion?.split(',').map(i => i.trim()) || [],
                perception_changes: data.perception_changes?.split(',').map(i => i.trim()) || [],
                somatic: data.somatic?.split(',').map(i => i.trim()) || [],
                others: data.others?.split(',').map(i => i.trim()) || [],
            }));

            setShow(true);

        } catch (error) {
            console.error("Error fetching form data:", error);
            alert("Basic Detail is not found");
        }
    };

    const handlePerceptionUpdate = async (e, id) => {
        e.preventDefault();

        try {
            const res = await apiRoute.post(`/recovery/updatePerception/${id}`, perceptionData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            alert('Perception Form updated successfully!');
            setPerceptionData({
                hallucination_type: [],
                heard: '',
                voices_heard: '',
                part_of_day: '',
                female_male_voices: '',
                interpreted_person: '',
                illusion: [],
                perception_changes: [],
                somatic: [],
                others: [],
            })
            handleClose(true);
            getVisitDetails();
        } catch (err) {
            console.error(err);
            alert('Update failed.');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPerceptionData((prev) => ({ ...prev, [name]: value }));
    };

    const renderhallucinationCheck = (field, id, label) => (
        <Form.Check
            type="checkbox"
            id={id}
            label={label}
            checked={perceptionData[field]?.includes(label)}
            onChange={(e) => {
                const updated = e.target.checked
                    ? [...perceptionData[field], label]
                    : perceptionData[field].filter(item => item !== label);

                setPerceptionData(prev => ({
                    ...prev,
                    [field]: updated
                }));
            }}
        />
    );
    const renderillusion = (field, id, label) => (
        <Form.Check
            type="checkbox"
            id={id}
            label={label}
            checked={perceptionData[field]?.includes(label)}
            onChange={(e) => {
                const updated = e.target.checked
                    ? [...perceptionData[field], label]
                    : perceptionData[field].filter(item => item !== label);

                setPerceptionData(prev => ({
                    ...prev,
                    [field]: updated
                }));
            }}
        />
    );

    const renderPerceptionChanges = (field, id, label) => (
        <Form.Check
            type="checkbox"
            id={id}
            label={label}
            checked={perceptionData[field]?.includes(label)}
            onChange={(e) => {
                const updated = e.target.checked
                    ? [...perceptionData[field], label]
                    : perceptionData[field].filter(item => item !== label);

                setPerceptionData(prev => ({
                    ...prev,
                    [field]: updated
                }));
            }}
        />
    );

    const rendersomatic = (field, id, label) => (
        <Form.Check
            type="checkbox"
            id={id}
            label={label}
            checked={perceptionData[field]?.includes(label)}
            onChange={(e) => {
                const updated = e.target.checked
                    ? [...perceptionData[field], label]
                    : perceptionData[field].filter(item => item !== label);

                setPerceptionData(prev => ({
                    ...prev,
                    [field]: updated
                }));
            }}
        />
    );

    const renderothers = (field, id, label) => (
        <Form.Check
            type="checkbox"
            id={id}
            label={label}
            checked={perceptionData[field]?.includes(label)}
            onChange={(e) => {
                const updated = e.target.checked
                    ? [...perceptionData[field], label]
                    : perceptionData[field].filter(item => item !== label);

                setPerceptionData(prev => ({
                    ...prev,
                    [field]: updated
                }));
            }}
        />
    );

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
            const res = await apiRoute.delete(`/social_remover/PreceptionToRecBin/${admission_no}`);
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
        <>
            <Container fluid>
                <Row className='d-flex align-items-center justify-content-between'>
                    <Col md={2} className='text-start'>
                        <Breadcrumb className="d-none d-md-inline-block mb-0" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
                            <Breadcrumb.Item></Breadcrumb.Item>
                            <Breadcrumb.Item>Home</Breadcrumb.Item>
                            <Breadcrumb.Item active>MSE Form</Breadcrumb.Item>
                        </Breadcrumb>
                        <h6 className="breadcrumb_title">Mental Status Examination</h6>
                    </Col>
                    <Col md={8} className="text-start mb-4">
                        <h3 className="section_title text-center">PERCEPTION </h3>
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
                                <th>Hallucinations</th>
                                <th>Illusions and misinterpretations</th>
                                <th>Perception Changes</th>
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
                                        <td>{item.hallucination_type || "Null"}</td>
                                        <td>{item.illusion || "Null"}</td>
                                        <td>{item.perception_changes || "Null"}</td>
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
                        <h4 className="text-center">PERCEPTION</h4>
                    </Col>
                </Row>
                <Row className='d-flex align-items-center justify-content-center'>
                    <Col md={5}>
                        <Form.Group className="mb-3 d-flex align-items-center" as={Row}>
                            <Form.Label column sm="6" className='text-start'>Admission No. :</Form.Label>
                            <Col md={6}>
                                <div className='text-start'>
                                    {perceptionData.admission_no}
                                </div>
                            </Col>
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group className="mb-3 d-flex align-items-center" as={Row}>
                            <Form.Label column sm="6" className='text-start'>Date :</Form.Label>
                            <Col md={6}>
                                <div className='text-start'>
                                    {formatDateTime(perceptionData.date)}
                                </div>
                            </Col>
                        </Form.Group>
                    </Col>
                </Row>
                <Form className='mt-4'>
                    <Form.Group className="mb-3 d-flex align-items-center" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <li className='icon-li'>
                                <h5>Hallucinations: </h5>
                            </li>
                        </Form.Label>
                        <Col md={6}>
                            <div
                                className="wrap-textarea"
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '8px',
                                    borderRadius: "5px",
                                    minHeight: '40px',
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word',
                                    overflowWrap: 'break-word',
                                    textAlign: "justify"
                                }}
                            >
                                {perceptionData.hallucination_type.join(', ')}
                            </div>

                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3 d-flex align-items-center" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <h5>1. What was heard?  </h5>
                        </Form.Label>
                        <Col md={6}>
                            <div
                                className="wrap-textarea"
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '8px',
                                    borderRadius: "5px",
                                    minHeight: '40px',
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word',
                                    overflowWrap: 'break-word',
                                    textAlign: "justify"
                                }}
                            >
                                {perceptionData.heard}
                            </div>

                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3 d-flex align-items-center" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <h5>2. How many voices were heard? </h5>
                        </Form.Label>
                        <Col md={6}>
                            <div
                                className="wrap-textarea"
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '8px',
                                    borderRadius: "5px",
                                    minHeight: '40px',
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word',
                                    overflowWrap: 'break-word',
                                    textAlign: "justify"
                                }}
                            >
                                {perceptionData.voices_heard}
                            </div>

                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3 d-flex align-items-center" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <h5>3. In which part of the day? </h5>
                        </Form.Label>
                        <Col md={6}>
                            <div
                                className="wrap-textarea"
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '8px',
                                    borderRadius: "5px",
                                    minHeight: '40px',
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word',
                                    overflowWrap: 'break-word',
                                    textAlign: "justify"
                                }}
                            >
                                {perceptionData.part_of_day}
                            </div>

                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3 d-flex align-items-center" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <h5>4. Male or Female voices? </h5>
                        </Form.Label>
                        <Col md={6}>
                            <div
                                className="wrap-textarea"
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '8px',
                                    borderRadius: "5px",
                                    minHeight: '40px',
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word',
                                    overflowWrap: 'break-word',
                                    textAlign: "justify"
                                }}
                            >
                                {perceptionData.female_male_voices}
                            </div>

                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3 d-flex align-items-center" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <h5>5. How interpreted and whether second person or third person hallucinations? </h5>
                        </Form.Label>
                        <Col md={6}>
                            <div
                                className="wrap-textarea"
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '8px',
                                    borderRadius: "5px",
                                    minHeight: '40px',
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word',
                                    overflowWrap: 'break-word',
                                    textAlign: "justify"
                                }}
                            >
                                {perceptionData.interpreted_person}
                            </div>

                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3 d-flex align-items-center" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <li className='icon-li'>
                                <h5>Illusions and misinterpretations : </h5>
                            </li>
                        </Form.Label>
                        <Col md={6}>
                            <div
                                className="wrap-textarea"
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '8px',
                                    borderRadius: "5px",
                                    minHeight: '40px',
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word',
                                    overflowWrap: 'break-word',
                                    textAlign: "justify"
                                }}
                            >
                                {perceptionData.illusion.join(', ')}
                            </div>

                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3 d-flex align-items-center" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <li className='icon-li'>
                                <h5>Perception Changes : </h5>
                            </li>

                        </Form.Label>
                        <Col md={6}>
                            <div
                                className="wrap-textarea"
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '8px',
                                    borderRadius: "5px",
                                    minHeight: '40px',
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word',
                                    overflowWrap: 'break-word',
                                    textAlign: "justify"
                                }}
                            >
                                {perceptionData.perception_changes.join(', ')}
                            </div>

                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3 d-flex align-items-center" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <li className='icon-li'>
                                <h5>Somatic passivity phenomenon : </h5>
                            </li>

                        </Form.Label>
                        <Col md={6}>
                            <div
                                className="wrap-textarea"
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '8px',
                                    borderRadius: "5px",
                                    minHeight: '40px',
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word',
                                    overflowWrap: 'break-word',
                                    textAlign: "justify"
                                }}
                            >
                                {perceptionData.somatic.join(', ')}
                            </div>

                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3 d-flex align-items-center" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <li className='icon-li'>
                                <h5>Others : </h5>
                            </li>

                        </Form.Label>
                        <Col md={6}>
                            <div
                                className="wrap-textarea"
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '8px',
                                    borderRadius: "5px",
                                    minHeight: '40px',
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word',
                                    overflowWrap: 'break-word',
                                    textAlign: "justify"
                                }}
                            >
                                {perceptionData.others.join(', ')}
                            </div>

                        </Col>
                    </Form.Group>
                </Form>
            </div>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Perception Form </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Col md={12}>
                        <Form>
                            <ul>
                                <li className='icon-li'>
                                    <h4 style={{ display: "inline" }}>Hallucinations:</h4>
                                    <div className="d-flex flex-wrap gap-3 mt-2">
                                        {[
                                            ["auditory", "Auditory"],
                                            ["visual", "Visual"],
                                            ["olfactory", "Olfactory"],
                                            ["gustatory", "Gustatory"],
                                            ["tactile", "Tactile"],
                                        ].map(([id, label]) => renderhallucinationCheck("hallucination_type", id, label))}
                                    </div>

                                    <div className='d-flex flex-wrap gap-3 mt-2'>
                                        <Col md={4}>
                                            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                                <Form.Label>What was heard?</Form.Label>
                                                <Form.Control as="textarea" rows={2}
                                                    name='heard'
                                                    value={perceptionData.heard}
                                                    onChange={handleInputChange} />
                                            </Form.Group>
                                            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                                <Form.Label>How many voices were heard?</Form.Label>
                                                <Form.Control as="textarea" rows={2}
                                                    name='voices_heard'
                                                    value={perceptionData.voices_heard}
                                                    onChange={handleInputChange} />
                                            </Form.Group>
                                        </Col>
                                        <Col md={4}>

                                            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                                <Form.Label>in which part of the day?</Form.Label>
                                                <Form.Control as="textarea" rows={2}
                                                    name='part_of_day'
                                                    value={perceptionData.part_of_day}
                                                    onChange={handleInputChange} />
                                            </Form.Group>
                                            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                                <Form.Label>Male or Female voices?</Form.Label>
                                                <Form.Control as="textarea" rows={2}
                                                    name='female_male_voices'
                                                    value={perceptionData.female_male_voices}
                                                    onChange={handleInputChange} />
                                            </Form.Group>
                                        </Col>

                                        <Col md={4}>

                                            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                                <Form.Label>How interpreted and whether second person or third person hallucinations? (i.e., whether the voices are addressing the patient or are discussing him in third person)</Form.Label>
                                                <Form.Control as="textarea" rows={2}
                                                    name='interpreted_person'
                                                    value={perceptionData.interpreted_person}
                                                    onChange={handleInputChange} />
                                            </Form.Group>
                                        </Col>


                                    </div>
                                </li>

                                <li className='icon-li'>
                                    <h4 style={{ display: "inline" }}>Illusions and misinterpretations:</h4>
                                    <div className="d-flex flex-wrap gap-3 mt-2">
                                        {[
                                            ["Illusions_visual", "Visual"],
                                            ["Illusions_auditory", "Auditory"],
                                            ["other_sensory_fields", "Other Sensory Fields"],
                                            ["clearConsciousness", "Occur in clear consciousness"],
                                            ["unclearConsciousness", "Occur in unclear consciousness"],
                                        ].map(([id, label]) => renderillusion("illusion", id, label))}
                                    </div>



                                </li>

                                <li className='icon-li'>
                                    <h4 style={{ display: "inline" }}>Perception Changes :</h4>
                                    <div className="d-flex flex-wrap gap-3 mt-2">
                                        {[
                                            ["Depersonalization", "Depersonalization"],
                                            ["derealization", "derealization"],
                                        ].map(([id, label]) => renderPerceptionChanges("perception_changes", id, label))}
                                    </div>
                                </li>

                                <li className='icon-li'>
                                    <h4 style={{ display: "inline" }}>Somatic passivity phenomenon :</h4>
                                    <div className="d-flex flex-wrap gap-3 mt-2">
                                        {[
                                            ["strangeSensations", "Strange sensations imposed by 'somebody'"]
                                        ].map(([id, label]) => rendersomatic("somatic", id, label))}
                                    </div>

                                </li>

                                <li className='icon-li'>
                                    <h4 style={{ display: "inline" }}>Others :</h4>
                                    <div className="d-flex flex-wrap gap-3 mt-2">
                                        {[
                                            ["autoscopy", "Autoscopy"],
                                            ["abnormalVestibular", "Abnormal vestibular sensations"],
                                            ["senseOfPresence", "Sense of presence"],
                                        ].map(([id, label]) => renderothers("others", id, label))}
                                    </div>

                                    <div className="mt-3">
                                        <Button variant="success" className="m-1" type="submit" onClick={(e) => handlePerceptionUpdate(e, perceptionData.id)}>Update</Button>
                                        <Button variant="secondary" className="m-1" onClick={handleClose}>Close</Button>
                                    </div>

                                </li>


                            </ul>
                        </Form>
                    </Col>
                </Modal.Body>
            </Modal>

        </>
    )
}

export default Perception
