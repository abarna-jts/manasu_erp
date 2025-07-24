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

function Programms_report() {
    const [programms_details, setProgramsDetail] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [previewRequested, setPreviewRequested] = useState(false);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);

    // Dummy function: Replace with real API call
    const fetchProgramsReport = async () => {
        try {
            const response = await apiRoute.get('/formality/getProgramsReport');
            setProgramsDetail(response.data.data); // ✅ Only set the actual data
            console.log(response);
        } catch (err) {
            console.error('Error fetching Programs Report:', err);
        }
    };

    useEffect(() => {
        fetchProgramsReport();
    }, []);


    const userType = Cookies.get('usertype');

    const [programData, setProgramData] = useState({
        community_name: '',
        clg_name: '',
        clg_dept: '',
        resource_person: '',
        community_date: '',
        community_place: '',
        community_rescue_count: '',
        community_report: ''
    })

    const filteredRescueDetails = programms_details.filter((item) => {
        const searchTerm = searchQuery.toLowerCase();
        return (
            String(item.community_name).toLowerCase().includes(searchTerm) ||
            String(item.clg_name).toLowerCase().includes(searchTerm) ||
            String(item.clg_dept).toLowerCase().includes(searchTerm) ||
            String(item.community_date).toLowerCase().includes(searchTerm) ||
            String(item.community_place).toLowerCase().includes(searchTerm)
        );
    });

    const apiRoute = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
    });

    const handleInputChange = (e) => {
        setProgramData({ ...programData, [e.target.name]: e.target.value });
    };



    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (`0${date.getMonth() + 1}`).slice(-2);
        const day = (`0${date.getDate()}`).slice(-2);
        return `${year}-${month}-${day}`;
    };

    const formatDate1 = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // 01 to 12
        const day = String(date.getDate()).padStart(2, '0'); // 01 to 31
        return `${year}-${month}-${day}`;
    };

    const formatDate2 = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // 01 to 12
        const day = String(date.getDate()).padStart(2, '0'); // 01 to 31
        return `${day}-${month}-${year}`;
    };

    const navigate = useNavigate();

    const handleInputChange1 = (e) => {
        setProgramData({ ...programData, [e.target.name]: e.target.value });
    };


    const [files, setFiles] = useState({
        programms_photos: null,
    });

    const handleFileChange = (e) => {
        setFiles({
            ...files,
            [e.target.name]: Array.from(e.target.files)  // Store all selected files as an array
        });
    };

    const fetchFormData = async (id) => {
        try {
            const response = await apiRoute.get(`/formality/getProgramsbyID/${id}`);
            const data = response.data.data;

            setProgramData((programData) => ({
                ...programData,
                community_name: data.community_name || 'NULL',
                clg_name: data.clg_name || 'NULL',
                clg_dept: data.clg_dept || 'NULL',
                resource_person: data.resource_person || 'NULL',
                community_date: data.community_date || 'NULL',
                community_place: data.community_place || 'NULL',
                community_rescue_count: data.community_rescue_count || 'NULL',
                community_report: data.community_report || 'NULL'
            }));

            let ProgrammsImage = [];
            if (data.programms_photos) {
                try {
                    const parsed = JSON.parse(data.programms_photos);
                    if (Array.isArray(parsed)) {
                        ProgrammsImage = parsed.map((p) => `http://localhost:5002/${p.replace(/"/g, '')}`);
                    }
                } catch (err) {
                    console.warn('Failed to parse signature:', err);
                    // Fallback: comma-separated string
                    ProgrammsImage = data.programms_photos
                        .split(',')
                        .map((p) => `http://localhost:5002/${p.trim().replace(/^"|"$/g, '')}`);
                }
            }

            // Base path for images
            // const basePath = "https://www.pahrultours.com/app2/uploads/Event_Photos";
            // const ProgramImage = data.program_photos ? `https://www.pahrultours.com/app2/${data.program_photos}` : null;

            console.log("Program Image Path", ProgrammsImage);
            setFiles((files) => ({
                ...files,
                programms_photos: ProgrammsImage,
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
            const response = await apiRoute.get(`/formality/getProgramsbyID/${id}`);
            const data = response.data.data; // Access the first object in the 'data' array

            setProgramData({
                id: data.id || '',
                community_name: data.community_name || 'NULL',
                clg_name: data.clg_name || 'NULL',
                clg_dept: data.clg_dept || 'NULL',
                resource_person: data.resource_person || 'NULL',
                community_date: formatDate(data.community_date || 'NULL'),
                community_place: data.community_place || 'NULL',
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

            const ProgramsPath = parseImageField(data.programms_photos);

            setFiles((files) => ({
                ...files,
                programms_photos: ProgramsPath,
            }));

            setShow(true);

        } catch (error) {
            console.error("Error fetching form data:", error);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const id = programData.id; // ✅ Get it from form data
        console.log("Updating form with ID:", id);
        if (!id) {
            alert("ID not found.");
            return;
        }
        const data = new FormData();
        data.append('community_name', programData.community_name);
        data.append('clg_name', programData.clg_name);
        data.append('clg_dept', programData.clg_dept);
        data.append('resource_person', programData.resource_person);
        data.append('community_date', programData.community_date);
        data.append('community_place', programData.community_place);
        data.append('community_report', programData.community_report);
        data.append('community_rescue_count', programData.community_rescue_count);


        if (files.programms_photos && files.programms_photos.length > 0) {
            files.programms_photos.forEach(file => {
                data.append('programms_photos', file); // ✅ no []
            });
        }
        try {
            const response = await apiRoute.put(`/formality/updateProgrambyID/${id}`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log(response.data);
            if (response.status === 200 || response.status === 201) {
                alert('Form Updated successfully!');
                handleClose(true);
                setProgramData({
                    community_name: '',
                    clg_name: '',
                    clg_dept: '',
                    resource_person: '',
                    community_date: '',
                    community_place: '',
                    community_rescue_count: '',
                    community_report: ''
                })
            } else {
                alert('Error Updating form.');
            }

        } catch (error) {
            console.error('There was an error Updating the form:', error);
            alert('There was an error Updating the form.');
        }
    };

    const downloadImage = (url, filename) => {
        fetch(url)
            .then(response => response.blob())
            .then(blob => {
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
            .catch(console.error);
    };

    const handleStaff = () => {
        navigate("/staffPrograms_report");  
    }


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
                        <h3 className="section_title text-center">Community Programs Report Detail</h3>
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

            <Row className='d-flex align-items-center justify-content-between mb-3'>
                <Col md={3}>
                    <Button type='button' className='btn btn-success' onClick={() => window.history.back()}>Back</Button>
                </Col>
                <Col md={3}>
                    <Button type='button' className='btn btn-success' onClick={() => handleStaff()}>Next</Button>
                </Col>
            </Row>

            <Container>
                <>
                    <Row>
                        <Col md={12}>
                            <Table responsive="sm">
                                <thead>
                                    <tr>
                                        <th>S.No</th>
                                        <th>Program Name</th>
                                        <th>Program Date</th>
                                        <th>Name of the College</th>
                                        <th>Resource Person</th>
                                        <th>Program Venue</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredRescueDetails.length > 0 ? (
                                        filteredRescueDetails.map((item, index) => (
                                            <tr key={item.id}>
                                                <td>{index + 1}</td>
                                                <td>{item.community_name || "null"}</td>
                                                <td>{formatDate2(item.community_date) || "null"}</td>
                                                <td>{item.clg_name || "null"}</td>
                                                <td>{item.resource_person || "null"}</td>
                                                <td>{item.community_place || "null"}</td>
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
                        <h4 className="pdf_heading text-center">COMMUNITY PROGRAMS REPORT DETAILS</h4>
                    </Col>
                </Row>
                <Container>
                    <Form>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="5" className='text-start'>
                                Name of the Program :
                            </Form.Label>
                            <Col sm="7">
                                <Form.Control type="text"
                                    name="community_name"
                                    value={programData.community_name}
                                    onChange={handleInputChange1}
                                    required />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="5" className='text-start'>
                                College Name :
                            </Form.Label>
                            <Col sm="7">
                                <Form.Control type="text"
                                    name="clg_name"
                                    value={programData.clg_name}
                                    onChange={handleInputChange1}
                                    required />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="5" className='text-start'>
                                College Department :
                            </Form.Label>
                            <Col sm="7">
                                <Form.Control type="text"
                                    name="clg_dept"
                                    value={programData.clg_dept}
                                    onChange={handleInputChange1}
                                    required />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="5" className='text-start'>
                                Resource Person :
                            </Form.Label>
                            <Col sm="7">
                                <Form.Control type="text"
                                    name="resource_person"
                                    value={programData.resource_person}
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
                                    name="community_date"
                                    value={formatDate1(programData.community_date)}
                                    max="9999-12-31"
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
                                    name="community_place"
                                    value={programData.community_place}
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
                                    name="community_rescue_count"
                                    value={programData.community_rescue_count}
                                    onChange={handleInputChange1}
                                    required />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="5" className='text-start'>
                                Community Photos
                            </Form.Label>
                            <Col sm="7">
                                {Array.isArray(files.programms_photos) &&
                                    files.programms_photos.map((imgUrl, index) => (
                                        <img
                                            key={index}
                                            src={imgUrl}
                                            alt={`programms_photos - ${index}`}
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
                                    name="community_report"
                                    rows={3}
                                    value={programData.community_report}
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
                    <Modal.Title>Edit Community Programs</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Col md={12}>
                        <Form>
                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="5" className='text-start'>
                                    Name of the Program :
                                </Form.Label>
                                <Col sm="7">
                                    <Form.Control type="text"
                                        name="community_name"
                                        value={programData.community_name}
                                        onChange={handleInputChange1}
                                        required />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="5" className='text-start'>
                                    College Name :
                                </Form.Label>
                                <Col sm="7">
                                    <Form.Control type="text"
                                        name="clg_name"
                                        value={programData.clg_name}
                                        onChange={handleInputChange1}
                                        required />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="5" className='text-start'>
                                    College Department :
                                </Form.Label>
                                <Col sm="7">
                                    <Form.Control type="text"
                                        name="clg_dept"
                                        value={programData.clg_dept}
                                        onChange={handleInputChange1}
                                        required />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="5" className='text-start'>
                                    Resource Person :
                                </Form.Label>
                                <Col sm="7">
                                    <Form.Control type="text"
                                        name="resource_person"
                                        value={programData.resource_person}
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
                                        name="community_date"
                                        value={programData.community_date}
                                        max="9999-12-31"
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
                                        name="community_place"
                                        value={programData.community_place}
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
                                        name="community_rescue_count"
                                        value={programData.community_rescue_count}
                                        onChange={handleInputChange1}
                                        required />
                                </Col>
                            </Form.Group>
                            {Array.isArray(files.programms_photos) &&
                                files.programms_photos.map((imgUrl, index) => (
                                    <img
                                        key={index}
                                        src={imgUrl}
                                        alt={`programms_photos - ${index}`}
                                        loading="lazy"
                                        style={{
                                            width: "100px",
                                            height: "100px",
                                            objectFit: "cover",
                                            margin: "10px",
                                            border: "1px solid #ccc",
                                        }}
                                        onClick={() => downloadImage(imgUrl, `programms_photos_${index}.jpg`)}
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
                                    Community Photos : <span style={{ color: 'red' }}>*</span>
                                </Form.Label>
                                <Col sm="6">
                                    <Form.Control
                                        type="file"
                                        accept=".jpg,.jpeg,.png"
                                        name="programms_photos"
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
                                        name="community_report"
                                        rows={3}
                                        value={programData.community_report}
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

export default Programms_report
