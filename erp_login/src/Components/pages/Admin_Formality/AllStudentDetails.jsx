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
            const response = await apiRoute.get('/formality/getStudentDetails');;
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

    const filteredRescueDetails = stud_details.filter((item) => {
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
            const student = response.data.data[0]; // Access the first object in the 'data' array

            const photoUrl = student.stud_photo
                ? `https://www.pahrultours.com/app2/${student.stud_photo}`
                : ''; // fallback if photo not available

            console.log(photoUrl);

            setFormData((formData) => ({
                ...formData,
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
                choose_intern: student.choose_intern || '',
                stud_photo: photoUrl
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
            setFiles((files) => ({
                ...files,
                stud_photo: student.stud_photo ? `/uploads/Student_Photos/${student.stud_photo}` : null
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
            if (files.stud_photo instanceof File) {
                formDataToSend.append('stud_photo', files.stud_photo); // assuming files.stud_photo is File object
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
                window.location.reload();
            } else {
                alert('Error Updating form.');
            }
        } catch (error) {
            console.error('There was an error Updating the form:', error);
            alert('There was an error Updating the form.');
        }
    };


    const handleFileChange = (e) => {
        const { name, files: selectedFiles } = e.target;
        if (selectedFiles.length > 0) {
            setFiles(prev => ({
                ...prev,
                [name]: selectedFiles[0], // store File object
            }));
        }
    };


    const [files, setFiles] = useState({
        stud_photo: null
    });


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
                                {filteredRescueDetails.length > 0 ? (
                                    filteredRescueDetails.map((item, index) => (
                                        <tr key={item.id}>
                                            <td>{index + 1}</td>
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
                                                <button className="btn btn-primary icon_details"
                                                    onClick={() => {
                                                        handleEditform(item.id);
                                                    }}
                                                ><i className="fas fa-edit"></i> </button>
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
                                <Form.Label column sm="4">
                                    Student Name :
                                </Form.Label>
                                <Col sm="8">
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
                                <Form.Label column sm="4">
                                    Student ID :
                                </Form.Label>
                                <Col sm="8">
                                    <Form.Control
                                        name="stud_id"
                                        type="number"
                                        value={formData.stud_id}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-1 text-start" controlId="formEmailID">
                                <Form.Label column sm="4">
                                    Name of the College :
                                </Form.Label>
                                <Col sm="8">
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
                                <Form.Label column sm="4">
                                    Name of the Department :
                                </Form.Label>
                                <Col sm="8">
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
                                <Form.Label column sm="4">
                                    Email ID :
                                </Form.Label>
                                <Col sm="8">
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
                                <Form.Label column sm="4">
                                    Contact Number:
                                </Form.Label>
                                <Col sm="8">
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
                                <Form.Label column sm="4">
                                    Emergency Contact Number:
                                </Form.Label>
                                <Col sm="8">

                                    <Form.Control
                                        name="secondary_phone"
                                        type="text"
                                        value={formData.secondary_phone}
                                        onChange={handleInputChange}
                                    />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-1 text-start d-flex align-items-center" controlId="formEmailID">
                                <Form.Label column sm="4">
                                    Supervisor's Name from College/Institution :
                                </Form.Label>
                                <Col sm="8">
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
                                <Form.Label column sm="4">
                                    Supervisor's Email :
                                </Form.Label>
                                <Col sm="8">
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
                                <Form.Label column sm="4">
                                    Supervisor's Contact Number :
                                </Form.Label>
                                <Col sm="8">
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
                                <Form.Label column sm="4">
                                    Preferred Field :
                                </Form.Label>
                                <Col sm="8">
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
                                    <Form.Label column sm="4" className='text-start'>Any Other Field:</Form.Label>
                                    <Col sm="8">
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
                                <Form.Label column sm="4">
                                    Duration :
                                </Form.Label>
                                <Col sm="8">
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
                                <Col sm="4">
                                    <Form.Control
                                        name="from_date"
                                        type="date"
                                        max="9999-12-31"
                                        value={formData.from_date}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                                <Col sm="4">
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
                                <Form.Label column sm="4">
                                    Why did you choose MANASU for your internship?
                                </Form.Label>
                                <Col sm="8">
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
                                    <Form.Group as={Row} className="mb-1 text-start" controlId="formEmailID">
                                        <Form.Label column sm="6">
                                            Attach Student Photo :
                                        </Form.Label>
                                        <Col sm="6">
                                            {files.stud_photo ? (
                                                <img
                                                    src={files.stud_photo}
                                                    alt="Rescue"
                                                    style={{ width: "100px", height: "auto", border: "1px solid #ccc" }}
                                                />
                                            ) : (
                                                <div>No Image Available</div>
                                            )}
                                            <Form.Control
                                                name="stud_photo"
                                                type="file"
                                                accept=".jpg,.jpeg,.png"
                                                value={formData.stud_photo}
                                                onChange={handleFileChange}
                                                required
                                            />
                                        </Col>
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
