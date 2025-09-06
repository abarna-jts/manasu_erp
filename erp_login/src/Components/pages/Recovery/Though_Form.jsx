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

function Though_Form() {
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
            String(item.stream_form_though).toLowerCase().includes(searchTerm) ||
            String(item.content_though).toLowerCase().includes(searchTerm)
        );
    });

    const [thoughFormData, setThoughFormData] = useState({
        stream_form_though: [],
        content_though: [],
        admission_no: '',
        date: '',
    })

    const apiRoute = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
    });
    const getVisitDetails = async () => {
        try {
            const response = await apiRoute.get('/recovery/get_though');
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
            const response = await apiRoute.get(`/recovery/getThough/${id}`);
            const data = response.data;

            setThoughFormData((thoughFormData) => ({
                ...thoughFormData,
                admission_no: data.admission_no || 'NULL',
                date: data.date || 'NULL',
                stream_form_though: data.stream_form_though?.split(',') || ["NULL"],
                content_though: data.content_though?.split(',') || ["NULL"]

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
            const response = await apiRoute.get(`/recovery/getThough/${id}`);
            const data = response.data;

            setThoughFormData(thoughFormData => ({
                ...thoughFormData,
                id: data.id || '',
                admission_no: data.admission_no || '',
                date: data.date || '',
                stream_form_though: data.stream_form_though?.split(',').map(i => i.trim()) || [],
                content_though: data.content_though?.split(',').map(i => i.trim()) || []
            }));

            setShow(true);

        } catch (error) {
            console.error("Error fetching form data:", error);
            alert("Basic Detail is not found");
        }
    };

    const handleThoughUpdate = async (e, id) => {
        e.preventDefault();

        try {
            const res = await apiRoute.post(`/recovery/updateThough/${id}`, thoughFormData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            alert('Though Form updated successfully!');
            setThoughFormData({
                stream_form_though: [],
                content_though: [],
            })
            handleClose(true);
            getVisitDetails();
        } catch (err) {
            console.error(err);
            alert('Update failed.');
        }
    };

    const renderthoughCheckbox = (field, id, label) => (
        <Form.Check
            type="checkbox"
            id={id}
            label={label}
            checked={thoughFormData[field]?.includes(label)}
            onChange={(e) => {
                const updated = e.target.checked
                    ? [...thoughFormData[field], label]
                    : thoughFormData[field].filter(item => item !== label);

                setThoughFormData(prev => ({
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
            const res = await apiRoute.delete(`/social_remover/ThoughToRecBin/${admission_no}`);
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
                        <h3 className="section_title text-center">THOUGHT </h3>
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
                                <th>Stream and form of thought</th>
                                <th>Content of thought</th>
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
                                        <td>{item.stream_form_though || "Null"}</td>
                                        <td>{item.content_though || "Null"}</td>
                                        <td>
                                            <button className="btn btn-success icon_details"
                                                onClick={() => {
                                                    fetchFormData(item.id);
                                                }}
                                            >
                                                <i className="fas fa-eye"></i>
                                            </button>
                                            {userType === "4" && (
                                                <button className="btn btn-secondary icon_details"
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
                        <h4 className="text-center">THOUGHT</h4>
                    </Col>
                </Row>
                <Row className='d-flex align-items-center justify-content-center'>
                    <Col md={5}>
                        <Form.Group className="mb-3 d-flex align-items-center" as={Row}>
                            <Form.Label column sm="6" className='text-start'>Admission No. :</Form.Label>
                            <Col md={6}>
                                <div className='text-start'>
                                    {thoughFormData.admission_no}
                                </div>
                            </Col>
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group className="mb-3 d-flex align-items-center" as={Row}>
                            <Form.Label column sm="6" className='text-start'>Date :</Form.Label>
                            <Col md={6}>
                                <div className='text-start'>
                                    {formatDateTime(thoughFormData.date)}
                                </div>
                            </Col>
                        </Form.Group>
                    </Col>
                </Row>
                <Form className='mt-4'>
                    <Form.Group className="mb-3 d-flex align-items-center" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <li className='icon-li'>
                                <h5>Stream and form of thought: </h5>
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
                                {thoughFormData.stream_form_though.join(', ')}
                            </div>

                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3 d-flex align-items-center" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <li className='icon-li'>
                                <h5>Content of thought: </h5>
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
                                {thoughFormData.content_though.join(', ')}
                            </div>

                        </Col>
                    </Form.Group>
                </Form>

            </div>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Though Form </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Col md={12}>
                        <Form>
                            <ul>
                                <li className='icon-li'>
                                    <h4 style={{ display: "inline" }}>Stream and form of thought:</h4>
                                    <div className="d-flex flex-wrap gap-3 mt-2">
                                        {[
                                            ["Spontaneity", "Spontaneity"],
                                            ["productivity", "Productivity"],
                                            ["flight of ideas", "Flight of Ideas"],
                                            ["poverty of content of speech", "Poverty of content of speech"],
                                            ["thought block", "thought block"],
                                            ["thought is assessed", "Continuity of thought is assessed"],
                                            ["questions asked", "Whether the thought processes are relevant to the questions asked."],
                                            ["loosening of associations", "Loose of associations"],
                                            ["loosening of tangentiality", "Loose of tangentiality"],
                                            ["loosening of circumstantiality", "Loose of circumstantiality"],
                                            ["Illogical thinking", "Illogical thinking"],
                                            ["perseveration", "Perseveration"],
                                            ["verbigeration is noted", "Verbigeration is noted"]
                                        ].map(([id, label]) => renderthoughCheckbox("stream_form_though", id, label))}
                                    </div>

                                </li>

                                <li className='icon-li'>
                                    <h4 style={{ display: "inline" }}>Content of thought:</h4>
                                    <div className="d-flex flex-wrap gap-3 mt-2">
                                        {[
                                            ["obession", "Obsessions and contents of phobias"],
                                            ["ideas and delusions", "Ideas and delusions of persecution"],
                                            ["reference", "Reference"],
                                            ["grandeur", "Grandeur"],
                                            ["love", "Love"],
                                            ["jealousy", "Jealousy (infidelity)"],
                                            ["guilt", "Guilt"],
                                            ["nihilism", "Nihilism"],
                                            ["poverty", "Poverty"],
                                            ["Hypochondriacal symptoms", "Hypochondriacal symptoms"],
                                            ["hopelessness", "Hopelessness"],
                                            ["helplessness", "Helplessness"],
                                            ["worthlessness", "Worthlessness"],
                                            ["suicidal ideation", "suicide should be explored"],
                                            ["Delusions of control", "Delusions of control"],
                                            ["thought insertion", "thought insertion"],
                                            ["thought withdrawal", "thought withdrawal"],
                                            ["thought broadcasting", "thought broadcasting"],
                                            ["Neologisms", "Neologisms"]
                                        ].map(([id, label]) => renderthoughCheckbox("content_though", id, label))}
                                    </div>

                                    <div className="mt-3">
                                        <Button variant="success" className="m-1" type="submit" onClick={(e) => handleThoughUpdate(e, thoughFormData.id)}>Update</Button>
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

export default Though_Form
