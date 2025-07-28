import React, { useRef } from 'react';
import { Breadcrumb, Container, Row, Table, Button } from 'react-bootstrap';
import { Col, Form, InputGroup } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Cookies from 'js-cookie';
import manasu_logo from '../Admission/Manasu-Logo.png';

function Rescue_Record_Sheet() {
    const [condition_details, setConditionDetails] = useState([]);
    const [show, setShow] = useState(false);
    const [editshow, setEditShow] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [admission_no, setAdmissionNumber] = useState("");
    const [rescueName, setRescueName] = useState("");
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [previewRequested, setPreviewRequested] = useState(false);


    const userType = Cookies.get('usertype');

    const handleEditClose = () => setEditShow(false);

    const apiRoute = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
    });

    const [formData, setFormData] = useState({
        admission_no: '',
        resident_name: '',
        follow_up: '',
        date: '',
    });

    const [files, setFiles] = useState({
        rescue_recovery_photo: null,
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFiles({
            ...files,
            [e.target.name]: Array.from(e.target.files)  // Store all selected files as an array
        });
    };



    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!admission_no || admission_no.trim() === '') {
            alert("Admission Number is required.");
            return;
        }

        const trimmedAdNo = admission_no.trim();

        if (!/^\d{8}$/.test(trimmedAdNo) && !/^\d{10}$/.test(trimmedAdNo)) {
            alert("Admission Number must be exactly 8 or 10 digits (numbers only).");
            return;
        }

        const data = new FormData();
        data.append('admission_no', admission_no);
        data.append('resident_name', rescueName);
        data.append('date', formData.date);
        data.append('rescue_recovery_photo', files.rescue_recovery_photo);
        data.append('follow_up', formData.follow_up);

        if (files.rescue_recovery_photo && files.rescue_recovery_photo.length > 0) {
            files.rescue_recovery_photo.forEach(file => {
                data.append('rescue_recovery_photo', file); // ✅ no []
            });
        }

        try {
            const res = await apiRoute.post('/residency/rescue_condition', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            alert('Consultation Report Form submitted successfully!');
            setFormData({
                admission_no: '',
                resident_name: '',
                follow_up: '',
                date: '',
            })
            setAdmissionNumber("");
            setRescueName("");
            handleClose(true);
            getConditionDetails();
        } catch (err) {
            console.error(err);
            alert('Submission failed.');
        }
    };


    useEffect(() => {
        getConditionDetails();
    }, []);

    const getConditionDetails = async () => {
        try {
            const response = await apiRoute.get('/residency/get_conidition_details');
            console.log("API response:", response.data);
            setConditionDetails(response.data.data);
        } catch (error) {
            console.error('Error fetching Student:', error);
        }
    };

    const filteredRescueDetails = condition_details.filter((item) => {
        const searchTerm = searchQuery.toLowerCase();
        return (
            String(item.admission_no).toLowerCase().includes(searchTerm) ||
            String(item.resident_name).toLowerCase().includes(searchTerm) ||
            String(item.follow_up).toLowerCase().includes(searchTerm)
        );
    });

    const formatDate = (dateObj) => {
        const d = new Date(dateObj);
        if (isNaN(d)) return '';
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };

    // const handleDelete = async (id) => {
    //     alert("Are you sure want to delete");
    //     try {
    //         const response = await apiRoute.delete(`https://www.pahrultours.com/app2/residency/delete_condition_details/${id}`);
    //         console.log(response);
    //         alert("First Form Details Deleted successfully");
    //         // Refresh data after deletion
    //         getConditionDetails(); // if this function fetches updated student list
    //     } catch (error) {
    //         console.error('Failed to delete item:', error);
    //     }
    // };

    const handleEdiShow = async (id) => {
        try {
            const response = await apiRoute.get(`/residency/rescueConditionShow/${id}`);
            const data = response.data;

            const [fromFormatted, toFormatted] = data.date.split(' to ');

            const parseDate = (dmy) => {
                const [day, month, year] = dmy.split("-");
                return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
            };

            setFormData((formData) => ({
                ...formData,
                admission_no: data.admission_no || '',
                resident_name: data.resident_name || '',
                follow_up: data.follow_up || '',
                date: parseDate(fromFormatted) || '',
                rescue_recovery_photo: data.rescue_recovery_photo,
            }));

            const parseImageField = (fieldData) => {
                let paths = [];
                if (fieldData) {
                    try {
                        const parsed = JSON.parse(fieldData);
                        if (Array.isArray(parsed)) {
                            paths = parsed.map((p) =>
                                `https://www.pahrultours.com/app2/${p.replace(/"/g, '')}`
                            );
                        }
                    } catch (err) {
                        // Fallback to comma-separated string
                        paths = fieldData
                            .split(',')
                            .map((p) =>
                                `https://www.pahrultours.com/app2/${p.trim().replace(/^"|"$/g, '')}`
                            );
                    }
                }
                return paths;
            };

            const ConsultantPhoto = parseImageField(data.rescue_recovery_photo);

            // Base path for images
            // const resrecovery_photoPath = data.rescue_recovery_photo ? `https://www.pahrultours.com/app2/${data.rescue_recovery_photo}` : null;

            // Set files state
            setFiles((files) => ({
                ...files,
                rescue_recovery_photo: ConsultantPhoto,
            }));



            setEditShow(true);
        } catch (error) {
            console.error("Error fetching form data:", error);
            alert("Error to upload data");
        }
    }

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

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('admission_no', formData.admission_no);
        data.append('resident_name', formData.resident_name);
        data.append('date', formData.date);
        data.append('follow_up', formData.follow_up);

        // ✅ Only append recovery photo if it's a new file
        if (files.rescue_recovery_photo && files.rescue_recovery_photo.length > 0) {
            files.rescue_recovery_photo.forEach(file => {
                data.append('rescue_recovery_photo', file); // ✅ no []
            });
        }
        try {
            const res = await apiRoute.post(`/residency/updateRescueCondition/${formData.admission_no}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            console.log(res.data);
            alert('Consultation Report updated successfully!');
            setEditShow(false);
            getConditionDetails(); // Refresh data
        } catch (err) {
            console.error(err);
            alert('Update failed.');
        }
    };

    const handleAdmissionChange = (e) => {
        setAdmissionNumber(e.target.value);
    };

    useEffect(() => {
        if (admission_no.trim() !== "") {
            fetchRescueDetails(admission_no);
        } else {
            setRescueName("");
        }
    }, [admission_no]);

    const fetchRescueDetails = async (admission_no) => {
        try {
            const response = await apiRoute.get(`/admision/get_scrbform2data/${admission_no}`);
            const result = response.data.data[0];
            console.log("API Result:", result);

            if (result && result.rescue_name) {

                setRescueName(result.rescue_name || "");
            } else {

                setError("Image not found for this admission number");
            }
        } catch (error) {
            console.error("Error fetching data", error);
            setRescueName("");
        }
    };

    const ViewFormData = async (id) => {
        try {
            const response = await apiRoute.get(`/residency/rescueConditionShow/${id}`);
            const data = response.data;

            const [fromFormatted, toFormatted] = data.date.split(' to ');

            const parseDate = (dmy) => {
                const [day, month, year] = dmy.split("-");
                return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
            };

            // Update form fields
            setFormData((formData) => ({
                ...formData,
                admission_no: data.admission_no || '',
                resident_name: data.resident_name || '',
                follow_up: data.follow_up || '',
                date: parseDate(fromFormatted) || '',
            }));

            let rescue_recovery_photoPath = [];
            if (data.rescue_recovery_photo) {
                try {
                    const parsed = JSON.parse(data.rescue_recovery_photo);
                    if (Array.isArray(parsed)) {
                        rescue_recovery_photoPath = parsed.map((p) => `https://www.pahrultours.com/app2/${p.replace(/"/g, '')}`);
                    }
                } catch (err) {
                    console.warn('Failed to parse signature:', err);
                    // Fallback: comma-separated string
                    rescue_recovery_photoPath = data.rescue_recovery_photo
                        .split(',')
                        .map((p) => `https://www.pahrultours.com/app2/${p.trim().replace(/^"|"$/g, '')}`);
                }
            }
            console.log(rescue_recovery_photoPath);
            // Set files state
            setFiles((files) => ({
                ...files,
                rescue_recovery_photo: rescue_recovery_photoPath,
            }));

            setPreviewRequested(true);
        } catch (error) {
            console.error("Error fetching form data:", error);
            alert("Admission Number not found");
        }
    }
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


    return (
        <>
            <Container fluid>
                <Row className='d-flex align-items-center justify-content-between'>
                    <Col md={2} className='text-start'>
                        <Breadcrumb className="d-none d-md-inline-block mb-0" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
                            <Breadcrumb.Item></Breadcrumb.Item>
                            <Breadcrumb.Item>Home</Breadcrumb.Item>
                            <Breadcrumb.Item active>Residency Time</Breadcrumb.Item>
                        </Breadcrumb>
                        <h6 className="breadcrumb_title">Record Sheet</h6>
                    </Col>
                    <Col md={5} className="text-center">
                        <h3 className="section_title">Consultation Report by Doctor</h3>
                    </Col>
                    <Col md={2}>
                        <Form className="navbar-search">
                            <Form.Group id="topbarSearch">
                                <InputGroup className="input-group-merge search-bar">
                                    <Form.Control
                                        type="text"
                                        placeholder="Search"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    {userType === "3" && (
                                        <InputGroup.Text style={{ cursor: 'pointer', background: "#6abc15", color: "#fff" }} onClick={handleShow}>

                                            <i className="fas fa-plus"></i>

                                        </InputGroup.Text>
                                    )}

                                </InputGroup>
                            </Form.Group>
                        </Form>
                    </Col>
                </Row>
            </Container>
            <Container>
                <Row>
                    <Col md={4}>
                        {userType === "3" && (
                            <Button variant="success" className="m-1 d-flex justify-content-start align-items-center" type="submit" onClick={handleShow}>Enter Condition</Button>
                        )}
                        {/* <Button variant="success" className="m-1 d-flex justify-content-start align-items-center" type="submit" onClick={handleShow}>Enter Condition</Button> */}
                    </Col>
                    <Col md={12} className="mt-3 my-3">

                        <Table responsive className="table-centered table-nowrap rounded mb-0">
                            <thead className="thead-light">
                                <tr>
                                    <th scope="col">S.No.</th>
                                    <th scope="col">Date</th>
                                    <th scope="col">Admission Number</th>
                                    <th scope="col">Resident Name</th>
                                    <th scope="col">Follow Up </th>
                                    <th scope="col">Recovery Photo</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRescueDetails.length > 0 ? (
                                    filteredRescueDetails.map((item, index) => (
                                        <tr key={item.id}>
                                            <td>{index + 1}</td>
                                            <td>{item.date}</td>
                                            <td>{item.admission_no}</td>
                                            <td>{item.resident_name}</td>

                                            <td className='text-justify'>{item.follow_up}</td>
                                            {/* <td>
                                                <img
                                                    src={`https://www.pahrultours.com/app2/${item.rescue_recovery_photo}`}
                                                    alt="Rescue Condition Photo"
                                                    style={{ width: "70px", height: "70px", objectFit: "cover" }}
                                                />
                                            </td> */}
                                            <td className='d-flex align-items-center justify-content-center'>
                                                {(() => {
                                                    let imagePath = item.rescue_recovery_photo;

                                                    try {
                                                        const parsed = JSON.parse(item.rescue_recovery_photo);
                                                        if (Array.isArray(parsed) && parsed.length > 0) {
                                                            imagePath = parsed[0];
                                                        }
                                                    } catch (e) {
                                                        // fallback to original string
                                                    }

                                                    const fullUrl = `https://www.pahrultours.com/app2/${imagePath}`;
                                                    const filename = imagePath?.split("/").pop();

                                                    return imagePath ? (
                                                        <div className="image-container">
                                                            <img
                                                                src={fullUrl}
                                                                alt="Rescue Recovery Photo"
                                                                className="preview-image"
                                                            />
                                                            <div className="image-overlay">
                                                                {/* View icon */}
                                                                <a
                                                                    href={fullUrl}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    title="View Image"
                                                                    className="icon-button"
                                                                >
                                                                    <i className="fas fa-eye"></i>
                                                                </a>

                                                                {/* Download icon */}
                                                                <button
                                                                    title="Download Image"
                                                                    className="icon-button"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        fetch(fullUrl, { mode: "cors" })
                                                                            .then((res) => res.blob())
                                                                            .then((blob) => {
                                                                                const url = window.URL.createObjectURL(blob);
                                                                                const a = document.createElement("a");
                                                                                a.href = url;
                                                                                a.download = filename || "image.jpg";
                                                                                a.click();
                                                                                window.URL.revokeObjectURL(url);
                                                                            })
                                                                            .catch(() => alert("Download failed."));
                                                                    }}
                                                                >
                                                                    <i className="fas fa-download"></i>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <span>No image</span>
                                                    );
                                                })()}
                                            </td>




                                            <td>
                                                <button className="btn btn-success icon_details" onClick={() => ViewFormData(item.id)}>
                                                    <i className="fas fa-eye"></i>
                                                </button>
                                                <button className="btn btn-secondary icon_details" onClick={() => handleEdiShow(item.id)}>
                                                    <i className="fas fa-edit"></i>
                                                </button>

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
                    <Modal.Title>Enter Rescue Condition</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Col md={12}>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="formAdmissionNo">
                                <Form.Label>Admission No. <span style={{ color: 'red' }}>*</span></Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Enter Admission Number"
                                    name="admission_no"
                                    value={admission_no}
                                    onChange={handleAdmissionChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formResidentName">
                                <Form.Label>Resident Name <span style={{ color: 'red' }}>*</span></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="resident_name"
                                    placeholder="Enter Resident Name"
                                    value={rescueName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Date <span style={{ color: 'red' }}>*</span></Form.Label>
                                <Form.Control
                                    type="date"
                                    name="date"
                                    max="9999-12-31"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>

                            <Form.Group controlId="formFile" className="mb-3">
                                <Form.Label>Rescue Recovery Photo Attachment </Form.Label>
                                <Form.Control
                                    type="file"
                                    accept=".jpg,.jpeg,.png"
                                    onChange={handleFileChange}
                                    name="rescue_recovery_photo"
                                    multiple
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formFollowUp">
                                <Form.Label>Follow Up <span style={{ color: 'red' }}>*</span></Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={formData.follow_up}
                                    onChange={handleInputChange}
                                    name="follow_up"
                                    required

                                />
                            </Form.Group>

                            <div className="btn_footer d-flex align-items-center justify-content-end">
                                <Button variant="success" type="submit" className="m-1">
                                    Submit
                                </Button>
                                <Button variant="secondary" onClick={handleClose}>
                                    Close
                                </Button>
                            </div>
                        </Form>
                    </Col>
                </Modal.Body>
            </Modal>

            <Modal show={editshow} onHide={handleEditClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Rescue Condition</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Col md={12}>
                        <Form>
                            <Form.Group className="mb-3" controlId="formAdmissionNo">
                                <Form.Label>Admission No. <span style={{ color: 'red' }}>*</span></Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Enter Admission Number"
                                    name="admission_no"
                                    value={formData.admission_no}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formResidentName">
                                <Form.Label>Resident Name <span style={{ color: 'red' }}>*</span></Form.Label>
                                <Form.Control
                                    type="text"
                                    name="resident_name"
                                    placeholder="Enter Resident Name"
                                    value={formData.resident_name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="date"
                                    max="9999-12-31"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label column sm="5" className='text-start'>Attach Photos:</Form.Label>
                                <Col sm="12">
                                    {Array.isArray(files.rescue_recovery_photo) &&
                                        files.rescue_recovery_photo.map((imgUrl, index) => {
                                            const filename = `rescue_recovery_photo_${index}.jpg`;

                                            return (
                                                <div
                                                    key={index}
                                                    className="image-container"
                                                    style={{
                                                        position: "relative",
                                                        width: "100px",
                                                        height: "100px",
                                                        margin: "10px",
                                                        display: "inline-block",
                                                    }}
                                                >
                                                    <img
                                                        src={imgUrl}
                                                        alt={`Recovery Photo - ${index}`}
                                                        loading="lazy"
                                                        style={{
                                                            width: "100%",
                                                            height: "100%",
                                                            objectFit: "cover",
                                                            border: "1px solid #ccc",
                                                            borderRadius: "4px",
                                                        }}
                                                        onError={(e) => {
                                                            if (!e.target.dataset.errorHandled) {
                                                                e.target.src = "/fallback-image.png";
                                                                e.target.dataset.errorHandled = "true";
                                                            }
                                                        }}
                                                    />

                                                    <div className="image-overlay">
                                                        {/* View icon */}
                                                        <a
                                                            href={imgUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            title="View Image"
                                                            className="icon-button"
                                                        >
                                                            <i className="fas fa-eye"></i>
                                                        </a>

                                                        {/* Download icon */}
                                                        <button
                                                            title="Download Image"
                                                            className="icon-button"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                fetch(imgUrl, { mode: "cors" })
                                                                    .then((res) => res.blob())
                                                                    .then((blob) => {
                                                                        const url = window.URL.createObjectURL(blob);
                                                                        const a = document.createElement("a");
                                                                        a.href = url;
                                                                        a.download = filename;
                                                                        a.click();
                                                                        window.URL.revokeObjectURL(url);
                                                                    })
                                                                    .catch(() => alert("Download failed."));
                                                            }}
                                                        >
                                                            <i className="fas fa-download"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    <Form.Control
                                        type="file"
                                        accept=".jpg,.jpeg,.png"
                                        name="rescue_recovery_photo"
                                        onChange={handleFileChange}
                                        multiple
                                    />
                                </Col>
                            </Form.Group>


                            <Form.Group className="mb-3" controlId="formFollowUp">
                                <Form.Label>Follow Up <span style={{ color: 'red' }}>*</span></Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={formData.follow_up}
                                    onChange={handleInputChange}
                                    name="follow_up"
                                    multiple

                                />
                            </Form.Group>

                            <div className="btn_footer d-flex align-items-center justify-content-end">
                                <Button variant="success" type="submit" onClick={handleUpdateSubmit} className="m-1">
                                    Update
                                </Button>
                                <Button variant="secondary" onClick={handleEditClose}>
                                    Close
                                </Button>
                            </div>
                        </Form>
                    </Col>
                </Modal.Body>
            </Modal>

            <div ref={formRef} style={{ position: "absolute", left: "-9999px", top: 0, background: "#fff", padding: "20px", width: "210mm" }}>
                <Row className="d-flex align-items-center justify-content-center mb-2">
                    <Col md={3} className='d-flex align-items-center pdf_logo'>
                        <img src={manasu_logo} className="pdf_logo" alt="" />
                        {/* <div className="logo_text">
                                        <h4><span>MANASU</span> <br />Mental Health Charity Home <br />Chennai,</h4>
                                    </div> */}
                    </Col>
                    <Col md={9}>
                        <h4 className="text-center">Consultation Report by Doctor</h4>
                    </Col>
                </Row>
                <Col md={12}>
                    <Form>
                        <Form.Group as={Row} className="mb-3" controlId="formAdmissionNo">
                            <Form.Label column sm="4" className='text-start'>Admission No. : <span style={{ color: 'red' }}>*</span></Form.Label>
                            <Col sm="6">
                                <Form.Control
                                    type="number"
                                    placeholder="Enter Admission Number"
                                    name="admission_no"
                                    value={formData.admission_no}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Col>

                        </Form.Group>

                        <Form.Group as={Row} className="mb-3" controlId="formResidentName">
                            <Form.Label column sm="4" className='text-start'>Resident Name : <span style={{ color: 'red' }}>*</span></Form.Label>
                            <Col sm="6">
                                <Form.Control
                                    type="text"
                                    name="resident_name"
                                    placeholder="Enter Resident Name"
                                    value={formData.resident_name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Col>

                        </Form.Group>

                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="4" className='text-start'>Date</Form.Label>
                            <Col sm="6">
                                <Form.Control
                                    type="date"
                                    name="date"
                                    max="9999-12-31"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Col>

                        </Form.Group>

                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="4" className='text-start'>Attach Photos:</Form.Label>
                            <Col sm="6">
                                {Array.isArray(files.rescue_recovery_photo) &&
                                    files.rescue_recovery_photo.map((imgUrl, index) => (
                                        <img
                                            key={index}
                                            src={imgUrl}
                                            alt={`rescue_recovery_photo - ${index}`}
                                            loading="lazy"
                                            style={{
                                                width: "100px",
                                                height: "auto",
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
                            </Col>
                        </Form.Group>


                        <Form.Group as={Row} className="mb-3" controlId="formFollowUp">
                            <Form.Label column sm="4" className='text-start'>Follow Up : <span style={{ color: 'red' }}>*</span></Form.Label>
                            <Col sm="6">
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={formData.follow_up}
                                    onChange={handleInputChange}
                                    name="follow_up"
                                    multiple

                                />
                            </Col>

                        </Form.Group>
                    </Form>
                </Col>
                <Col md={12}>
                    <Row className="d-flex align-items-center justify-content-center mt-5">
                        <Col md={6} className="mt-3 down_title">
                            <h5 className="text-start">Signature / Thumbnail of Resident's</h5>
                        </Col>
                        <Col md={6} className="mt-3 down_title">
                            <h5 className="text-end">Manasu Seal</h5>
                        </Col>
                    </Row>
                </Col>

            </div>
        </>
    )
}

export default Rescue_Record_Sheet
