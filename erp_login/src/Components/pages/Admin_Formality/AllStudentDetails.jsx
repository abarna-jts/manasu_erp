import React from 'react';
import { Breadcrumb, Container, Row, Table, Button, InputGroup } from 'react-bootstrap';
import { Col, Form } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useRef } from "react";
import Modal from 'react-bootstrap/Modal';
import Cookies from 'js-cookie';
import manasu_logo from '../Admission/Manasu-Logo.png';

function AllStudentDetails() {
    const [stud_details, setStudentDetails] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [show, setShow] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const handleClose = () => setShow(false);

    const userType = Cookies.get('usertype');

    const [formData, setFormData] = useState({
        id: '',
        stud_name: '',
        stud_id: '',
        department: '',
        email: '',
        phone: '',
        secondary_phone: '',
        field: '',
        clg_name: '',
        duration: '',
        from_date: '',
        to_date: '',
        supervisor_name: '',
        supervisor_email: '',
        supervisor_phone: '',
        choose_intern: '',
    })

    const apiRoute = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
    });

    const getStudentDetails = async () => {
        try {
            const response = await apiRoute.get('/formality/getStudentDetails');
            console.log("API response:", response.data);
            setStudentDetails(response.data.data);
        } catch (error) {
            console.error('Error fetching Student:', error);
        }
    };
    useEffect(() => {
        getStudentDetails();
    }, []);

    const formatDateTime = (dateStr) => {
        const date = new Date(dateStr);
        if (isNaN(date)) return ""; // Invalid date fallback

        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();

        return `${day}-${month}-${year}`;
    };

    const searchFilteredRescueDetails = stud_details.filter((item) => {
        const searchTerm = searchQuery.toLowerCase();
        return (
            String(item.stud_name).toLowerCase().includes(searchTerm) ||
            String(item.stud_id).toLowerCase().includes(searchTerm) ||
            String(item.clg_name).toLowerCase().includes(searchTerm) ||
            String(item.department).toLowerCase().includes(searchTerm) ||
            String(item.information_public).toLowerCase().includes(searchTerm)
        );
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const fetchFormData = async (id) => {

        try {
            const response = await apiRoute.get(`/formality/getStudentDet/${id}`);
            const data = response.data.data[0];

            let StudPhotoAll = [];
            if (data.stud_photo) {
                try {
                    const parsed = JSON.parse(data.stud_photo);
                    if (Array.isArray(parsed)) {
                        StudPhotoAll = parsed.map((p) => `https://www.pahrultours.com/app2/${p}`);
                    } else if (typeof parsed === "string") {
                        StudPhotoAll = [`https://www.pahrultours.com/app2/${parsed}`];
                    }
                } catch (err) {
                    console.warn('Failed to parse signature:', err);
                    if (data.stud_photo.includes(",")) {
                        StudPhotoAll = data.stud_photo
                            .split(",")
                            .map((p) => `https://www.pahrultours.com/app2/${p.trim().replace(/^"|"$/g, "")}`);
                    } else {
                        StudPhotoAll = [`https://www.pahrultours.com/app2/${data.stud_photo.trim()}`];
                    }
                }
            }

            // Update form fields
            setFormData((formData) => ({
                ...formData,
                stud_name: data.stud_name || '',
                stud_id: data.stud_id || '',
                department: data.department || '',
                email: data.email || '',
                phone: data.phone || '',
                secondary_phone: data.secondary_phone || '',
                field: data.field || '',
                clg_name: data.clg_name || '',
                duration: data.duration || '',
                from_date: data.from_date ? data.from_date.slice(0, 10) : '', // format date
                to_date: data.to_date ? data.to_date.slice(0, 10) : '',
                supervisor_name: data.supervisor_name || '',
                supervisor_email: data.supervisor_email || '',
                supervisor_phone: data.supervisor_phone || '',
                choose_intern: data.choose_intern || '',
                stud_photo: StudPhotoAll[0] || ''
            }));


            console.log(StudPhotoAll);
            // Set files state
            setFiles((files) => ({
                ...files,
                stud_photo: StudPhotoAll,
            }));

            setTimeout(() => {
                generatePDF();
            }, 500);
        } catch (error) {
            console.error("Error fetching form data:", error);
            alert("Admission Number not found");
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
            const canvas = await html2canvas(input, {
                scale: 2,
                useCORS: true,
                allowTaint: true
            });
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
            const response = await apiRoute.get(`/formality/getStudentDet/${id}`);
            const student = response.data.data[0]; // Access the first object in the 'data' array

            setFormData((formData) => ({
                ...formData,
                id: student.id || '',
                stud_name: student.stud_name || '',
                stud_id: student.stud_id || '',
                department: student.department || '',
                email: student.email || '',
                phone: student.phone || '',
                secondary_phone: student.secondary_phone || '',
                field: student.field || '',
                clg_name: student.clg_name || '',
                duration: student.duration || '',
                from_date: student.from_date ? student.from_date.slice(0, 10) : '', // format date
                to_date: student.to_date ? student.to_date.slice(0, 10) : '',
                supervisor_name: student.supervisor_name || '',
                supervisor_email: student.supervisor_email || '',
                supervisor_phone: student.supervisor_phone || '',
                choose_intern: student.choose_intern || ''
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

            const StudPhoto = parseImageField(student.stud_photo);
            setFiles((files) => ({
                ...files,
                stud_photo: StudPhoto
            }));

            setShow(true);

        } catch (error) {
            console.error("Error fetching form data:", error);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const id = formData.id;

        if (!id) {
            alert("ID not found.");
            return;
        }

        try {
            const formDataToSend = new FormData();

            // Append all form fields
            for (const key in formData) {
                formDataToSend.append(key, formData[key]);
            }

            // Append the file (if selected)
            if (files.stud_photo) {
                if (Array.isArray(files.stud_photo)) {
                    files.stud_photo.forEach(file => {
                        formDataToSend.append('stud_photo', file);
                    });
                } else {
                    formDataToSend.append('stud_photo', files.stud_photo);
                }
            }



            const response = await apiRoute.put(
                `/formality/updateStudentDetail/${id}`,
                formDataToSend,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    }
                }
            );

            console.log(response.data);
            if (response.status === 200 || response.status === 201) {
                alert('Form Updated successfully!');
                handleClose(true);
                setFormData({
                    id: '',
                    stud_name: '',
                    stud_id: '',
                    department: '',
                    email: '',
                    phone: '',
                    secondary_phone: '',
                    field: '',
                    clg_name: '',
                    duration: '',
                    from_date: '',
                    to_date: '',
                    supervisor_name: '',
                    supervisor_email: '',
                    supervisor_phone: '',
                    choose_intern: '',
                })
                getStudentDetails();
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

    const handleFileChange = (e) => {
        setFiles({
            ...files,
            [e.target.name]: Array.from(e.target.files)  // Store all selected files as an array
        });
    };


    const [files, setFiles] = useState({
        stud_photo: null
    });


    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = searchFilteredRescueDetails.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(searchFilteredRescueDetails.length / itemsPerPage);
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const handleDelete = async (id) => {
        try {
            const confirmDelete = window.confirm("Are you sure you want to delete this record?");
            if (!confirmDelete) return; // if user clicks 'Cancel', do nothing
            const res = await apiRoute.delete(`/remove/InternShiptoRecycleBin/${id}`);
            console.log(res.data);
            alert("Moved to recycle bin");
            getStudentDetails();
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
                            <Breadcrumb.Item active>Reunion</Breadcrumb.Item>
                        </Breadcrumb>
                        <h6 className="breadcrumb_title">Internship</h6>
                    </Col>
                    <Col md={8} className="text-center">
                        <h3 className="section_title">Internship Student Details</h3>
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
                                </InputGroup>
                            </Form.Group>
                        </Form>
                    </Col>

                </Row>
            </Container>

            <Container>
                <Row className='mt-3'>
                    <Col md={12}>
                        <Table responsive="sm">

                            <thead>
                                <tr>
                                    <th>S.No</th>
                                    <th>Stud Id</th>
                                    <th>Student Name</th>
                                    <th>Department</th>
                                    <th>College Name</th>
                                    <th>Duration</th>
                                    <th>From Date</th>
                                    <th>To Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.length > 0 ? (
                                    currentItems.map((item, index) => (
                                        <tr key={item.id}>
                                            <td>{indexOfFirstItem + index + 1}</td>
                                            <td>{item.stud_id}</td>
                                            <td>{item.stud_name}</td>
                                            <td>{item.department}</td>
                                            <td>{item.clg_name}</td>
                                            <td>{item.duration}</td>
                                            <td>{formatDateTime(item.from_date)}</td>
                                            <td>{formatDateTime(item.to_date)}</td>
                                            <td>
                                                <button className="btn btn-success icon_details"
                                                    onClick={() => {
                                                        fetchFormData(item.id);
                                                    }}
                                                >
                                                    <i className="fas fa-eye"></i>
                                                </button>
                                                <button className="btn btn-secondary icon_details"
                                                    onClick={() => {
                                                        handleEditform(item.id);
                                                    }}
                                                ><i className="fas fa-edit"></i> </button>
                                                {userType === "2" && (
                                                    <button className="btn btn-danger icon_details"
                                                        onClick={() => handleDelete(item.id)}
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

                    </Col>
                </Row>
            </Container>

            <div ref={formRef} style={{ position: "absolute", left: "-9999px", top: 0, background: "#fff", padding: "20px", width: "210mm" }}>
                <Row className="d-flex align-items-center justify-content-center mb-2">
                    <Col md={2}>
                        <img src={manasu_logo} className="pdf_logo" alt="" />
                    </Col>
                    <Col md={8}>
                        <h4 className="text-center">Internship Student Details</h4>
                    </Col>
                    <Col md={2}>
                        {formData.stud_photo ? (
                            <img src={formData.stud_photo} className="pdf_logo" alt="Student" />
                        ) : (
                            <p>No photo available</p>
                        )}
                    </Col>
                </Row>
                <Form>
                    <Col md={12} className="consultant_box my-2 p-3">
                        <Row>

                            <Form.Group as={Row} className="mb-1 text-start" controlId="formEmailID">
                                <Form.Label column sm="5">
                                    Student Name :
                                </Form.Label>
                                <Col sm="6">
                                    <Form.Control
                                        name="stud_name"
                                        type="text"
                                        value={formData.stud_name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-1 text-start" controlId="formEmailID">
                                <Form.Label column sm="5">
                                    Student ID :
                                </Form.Label>
                                <Col sm="6">
                                    <Form.Control
                                        name="stud_id"
                                        type="number"
                                        value={formData.stud_id}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="5" className='text-start'>Attach Photos:</Form.Label>
                                <Col sm="7">
                                    {Array.isArray(files.stud_photo) && files.stud_photo.length > 0 ? (
                                        files.stud_photo.map((imgUrl, index) => (
                                            <img
                                                key={index}
                                                src={imgUrl}
                                                alt={`rescue recovery ${index + 1}`}
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
                                        ))
                                    ) : (
                                        <div style={{ padding: "10px", fontStyle: "italic" }}>No image</div>
                                    )}
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-1 text-start" controlId="formEmailID">
                                <Form.Label column sm="5">
                                    Name of the College :
                                </Form.Label>
                                <Col sm="6">
                                    <Form.Control
                                        name="clg_name"
                                        type="text"
                                        value={formData.clg_name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-1 text-start" controlId="formEmailID">
                                <Form.Label column sm="5">
                                    Name of the Department :
                                </Form.Label>
                                <Col sm="6">
                                    <Form.Control
                                        name="department"
                                        type="text"
                                        value={formData.department}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-1 text-start" controlId="formEmailID">
                                <Form.Label column sm="5">
                                    Email ID :
                                </Form.Label>
                                <Col sm="6">
                                    <Form.Control
                                        name="email"
                                        type="text"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-1 text-start" controlId="formPhoneNumbers">
                                <Form.Label column sm="5">
                                    Contact Number:
                                </Form.Label>
                                <Col sm="6">
                                    <Form.Control
                                        name="phone"
                                        type="text"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>

                            </Form.Group>

                            <Form.Group as={Row} className="mb-1 text-start" controlId="formPhoneNumbers">
                                <Form.Label column sm="5">
                                    Emergency Contact Number:
                                </Form.Label>
                                <Col sm="6">

                                    <Form.Control
                                        name="secondary_phone"
                                        type="text"
                                        value={formData.secondary_phone}
                                        onChange={handleInputChange}
                                    />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-1 text-start d-flex align-items-center" controlId="formEmailID">
                                <Form.Label column sm="5">
                                    Supervisor's Name from College/Institution :
                                </Form.Label>
                                <Col sm="6">
                                    <Form.Control
                                        name="supervisor_name"
                                        type="text"
                                        value={formData.supervisor_name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-1 text-start" controlId="formEmailID">
                                <Form.Label column sm="5">
                                    Supervisor's Email :
                                </Form.Label>
                                <Col sm="6">
                                    <Form.Control
                                        name="supervisor_email"
                                        type="text"
                                        value={formData.supervisor_email}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-1 text-start" controlId="formEmailID">
                                <Form.Label column sm="5">
                                    Supervisor's Contact Number :
                                </Form.Label>
                                <Col sm="6">
                                    <Form.Control
                                        name="supervisor_phone"
                                        type="text"
                                        value={formData.supervisor_phone}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-1 text-start" controlId="formEmailID">
                                <Form.Label column sm="5">
                                    Preferred Field :
                                </Form.Label>
                                <Col sm="6">
                                    <Form.Control
                                        as="select"
                                        name="field"
                                        value={formData.field}
                                        onChange={handleInputChange}
                                        required
                                    >
                                        <option value="">-- Select --</option>

                                        <optgroup label="Social Worker">
                                            <option value="Medical and Psychiatry">Medical and Psychiatry</option>
                                            <option value="Community Development">Community Development</option>
                                            <option value="Human Resource Management">Human Resource Management</option>
                                            <option value="Human Rights">Human Rights</option>
                                            <option value="Any other">Any other</option>
                                        </optgroup>

                                        <option value="Social Services">Social Services</option>
                                        <option value="Psychology">Psychology</option>

                                    </Form.Control>
                                </Col>
                            </Form.Group>

                            {formData.field === 'Any other' && (
                                <Form.Group as={Row} className="mb-1">
                                    <Form.Label column sm="5" className='text-start'>Any Other Field:</Form.Label>
                                    <Col sm="6">
                                        <Form.Control
                                            type="text"
                                            name="other_field"
                                            value={formData.other_field}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </Col>
                                </Form.Group>
                            )}

                            <Form.Group as={Row} className="mb-1 text-start" controlId="formEmailID">
                                <Form.Label column sm="5">
                                    Duration :
                                </Form.Label>
                                <Col sm="6">
                                    <Form.Control
                                        name="duration"
                                        type="text"
                                        value={formData.duration}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>

                            {/* From and To Date in the same row */}
                            <Form.Group as={Row} className="mb-3 text-start">
                                <Form.Label column sm="5">
                                    Internship Date :
                                </Form.Label>
                                <Col sm="3">
                                    <Form.Control
                                        name="from_date"
                                        type="date"
                                        max="9999-12-31"
                                        value={formData.from_date}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                                <Col sm="3">
                                    <Form.Control
                                        name="to_date"
                                        type="date"
                                        value={formData.to_date}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-1 text-start" controlId="formEmailID">
                                <Form.Label column sm="5">
                                    Why did you choose MANASU for your internship?
                                </Form.Label>
                                <Col sm="6">
                                    <Form.Control
                                        as="textarea" rows={3}
                                        name="choose_intern"
                                        type="text"
                                        value={formData.choose_intern}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>

                        </Row>
                    </Col>
                </Form>
            </div>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit InternShip Information Form</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Col md={12}>
                        <Form>
                            <Col md={12} className="my-2 edit_modal_padding">
                                <Row>

                                    <Form.Group as={Row} className="mb-1 text-start" controlId="formEmailID">
                                        <Form.Label column sm="6">
                                            Student Name :
                                        </Form.Label>
                                        <Col sm="6">
                                            <Form.Control
                                                name="stud_name"
                                                type="text"
                                                value={formData.stud_name}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} className="mb-1 text-start" controlId="formEmailID">
                                        <Form.Label column sm="6">
                                            Student ID :
                                        </Form.Label>
                                        <Col sm="6">
                                            <Form.Control
                                                name="stud_id"
                                                type="number"
                                                value={formData.stud_id}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group className="mb-3">
                                        <Form.Label column sm="5" className='text-start'>Attach Photos:</Form.Label>
                                        <Col sm="7" className='d-flex'>
                                            {Array.isArray(files.stud_photo) &&
                                                files.stud_photo.map((imgUrl, index) => {
                                                    const filename = `stud_photo_${index}.jpg`;

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
                                                                alt={`stud_photo - ${index}`}
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

                                        </Col>
                                        <Form.Control
                                            type="file"
                                            accept=".jpg,.jpeg,.png"
                                            name="stud_photo"
                                            onChange={handleFileChange}
                                            multiple
                                        />
                                    </Form.Group>
                                    <Form.Group as={Row} className="mb-1 text-start" controlId="formEmailID">
                                        <Form.Label column sm="6">
                                            Name of the College :
                                        </Form.Label>
                                        <Col sm="6">
                                            <Form.Control
                                                name="clg_name"
                                                type="text"
                                                value={formData.clg_name}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} className="mb-1 text-start" controlId="formEmailID">
                                        <Form.Label column sm="6">
                                            Name of the Department :
                                        </Form.Label>
                                        <Col sm="6">
                                            <Form.Control
                                                name="department"
                                                type="text"
                                                value={formData.department}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} className="mb-1 text-start" controlId="formEmailID">
                                        <Form.Label column sm="6">
                                            Email ID :
                                        </Form.Label>
                                        <Col sm="6">
                                            <Form.Control
                                                name="email"
                                                type="text"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} className="mb-1 text-start" controlId="formEmailID">
                                        <Form.Label column sm="6">
                                            Contact Number :
                                        </Form.Label>
                                        <Col sm="6">
                                            <Form.Control
                                                name="phone"
                                                type="number"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} className="mb-1 text-start" controlId="formPhoneNumbers">
                                        <Form.Label column sm="6">
                                            Emergency Contact Number:
                                        </Form.Label>
                                        <Col sm="6">

                                            <Form.Control
                                                name="secondary_phone"
                                                type="text"
                                                value={formData.secondary_phone}
                                                onChange={handleInputChange}
                                            />
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} className="mb-1 text-start d-flex align-items-center" controlId="formEmailID">
                                        <Form.Label column sm="6">
                                            Supervisor's Name from College/Institution :
                                        </Form.Label>
                                        <Col sm="6">
                                            <Form.Control
                                                name="supervisor_name"
                                                type="text"
                                                value={formData.supervisor_name}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} className="mb-1 text-start" controlId="formEmailID">
                                        <Form.Label column sm="6">
                                            Supervisor's Email :
                                        </Form.Label>
                                        <Col sm="6">
                                            <Form.Control
                                                name="supervisor_email"
                                                type="text"
                                                value={formData.supervisor_email}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} className="mb-1 text-start" controlId="formEmailID">
                                        <Form.Label column sm="6">
                                            Supervisor's Contact Number :
                                        </Form.Label>
                                        <Col sm="6">
                                            <Form.Control
                                                name="supervisor_phone"
                                                type="text"
                                                value={formData.supervisor_phone}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} className="mb-1 text-start" controlId="formEmailID">
                                        <Form.Label column sm="6">
                                            Preferred Field :
                                        </Form.Label>
                                        <Col sm="6">
                                            <Form.Control
                                                as="select"
                                                name="field"
                                                value={formData.field}
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="">-- Select --</option>

                                                <optgroup label="Social Worker">
                                                    <option value="Medical and Psychiatry">Medical and Psychiatry</option>
                                                    <option value="Community Development">Community Development</option>
                                                    <option value="Human Resource Management">Human Resource Management</option>
                                                    <option value="Human Rights">Human Rights</option>
                                                    <option value="Any other">Any other</option>
                                                </optgroup>

                                                <option value="Social Services">Social Services</option>
                                                <option value="Psychology">Psychology</option>

                                            </Form.Control>
                                        </Col>
                                    </Form.Group>
                                    {formData.field === 'Any other' && (
                                        <Form.Group as={Row} className="mb-1">
                                            <Form.Label column sm="6" className='text-start'>Any Other Field:</Form.Label>
                                            <Col sm="6">
                                                <Form.Control
                                                    type="text"
                                                    name="other_field"
                                                    value={formData.other_field}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </Col>
                                        </Form.Group>
                                    )}

                                    <Form.Group as={Row} className="mb-1 text-start" controlId="formEmailID">
                                        <Form.Label column sm="6">
                                            Duration :
                                        </Form.Label>
                                        <Col sm="6">
                                            <Form.Control
                                                name="duration"
                                                type="text"
                                                value={formData.duration}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </Col>
                                    </Form.Group>

                                    {/* From and To Date in the same row */}
                                    <Form.Group as={Row} className="mb-3 text-start">
                                        <Form.Label column sm="4">
                                            Internship Date :
                                        </Form.Label>
                                        <Col sm="4" className='intern_class'>
                                            <Form.Control
                                                name="from_date"
                                                type="date"
                                                max="9999-12-31"
                                                value={formData.from_date}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </Col>
                                        <Col sm="4" className='intern_class'>
                                            <Form.Control
                                                name="to_date"
                                                type="date"
                                                max="9999-12-31"
                                                value={formData.to_date}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} className="mb-1 text-start" controlId="formEmailID">
                                        <Form.Label column sm="6">
                                            Why did you choose MANASU for your internship?
                                        </Form.Label>
                                        <Col sm="6">
                                            <Form.Control
                                                as="textarea" rows={3}
                                                name="choose_intern"
                                                type="text"
                                                value={formData.choose_intern}
                                                onChange={handleInputChange}
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
                                </Row>
                            </Col>
                        </Form>
                    </Col>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default AllStudentDetails
