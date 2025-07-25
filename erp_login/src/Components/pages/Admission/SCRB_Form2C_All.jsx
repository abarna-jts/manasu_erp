import React from 'react'
import { Breadcrumb, Form, InputGroup, Container, Row, Col, Table } from '@themesberg/react-bootstrap';
import { useState, useEffect } from "react";
import axios from 'axios';
import { Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';

function SCRB_Form2C_All() {
    const [scrbForm2CList, setScrbForm2CList] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [show, setShow] = useState(false);
    const [upperdress_1, setUpperDress1] = useState([]);
    const [upperdress_2, setUpperDress2] = useState([]);
    const [lowerdress, setLowerDress] = useState([]);

    const [formData, setFormData] = useState({
        name_ngo: 'MANASU (Mental Health Charity Home)',
        admission_no: '',
        file_no: '',
        addition_upperdress: '',
        addition_lowerdress: '',
        upperdress_color: '',
        lowerdress_color: '',
    });

    const handleClose = () => setShow(false);

    const fetchSCRBForm2CReport = async () => {
        try {
            const response = await apiRoute.get('/scrb_form/getAllSCRBForm2C');
            setScrbForm2CList(response.data.data); // ✅ Only set the actual data
            console.log(response);
        } catch (err) {
            console.error('Error fetching SCRB Form2C Report:', err);
        }
    };

    useEffect(() => {
        fetchSCRBForm2CReport();
    }, []);

    const filteredRescueDetails = scrbForm2CList.filter((item) => {
        const searchTerm = searchQuery.toLowerCase();
        return (
            String(item.admission_no).toLowerCase().includes(searchTerm) ||
            String(item.upperdress_1).toLowerCase().includes(searchTerm) ||
            String(item.name_ngo).toLowerCase().includes(searchTerm) ||
            String(item.koppu_en).toLowerCase().includes(searchTerm) ||
            String(item.lowerdress_color).toLowerCase().includes(searchTerm) ||
            String(item.upperdress_color).toLowerCase().includes(searchTerm)

        );
    });

    const apiRoute = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEditform = async (id) => {
        if (!id) {
            console.warn("No valid ID provided to handleEditform");
            return;
        }
        try {
            const response = await apiRoute.get(`/scrb_form/getSCRB_form2C/${id}`);
            const data = response.data; // Access the first object in the 'data' array
            console.log(data.id);
            setFormData({
                id: data.id || '',
                name_ngo: data.name_ngo || 'NULL',
                admission_no: data.admission_no || 'NULL',
                file_no: data.file_no || 'NULL',
                addition_upperdress: data.addition_upperdress || 'NULL',
                addition_lowerdress: data.addition_lowerdress || 'NULL',
                upperdress_color: data.upperdress_color || 'NULL',
                lowerdress_color: data.lowerdress_color || 'NULL'
            });

            // ✅ Properly parse comma-separated values into arrays
            setUpperDress1(typeof data.upperdress_1 === 'string' ? data.upperdress_1.split(',').map(c => c.trim()) : []);
            setUpperDress2(typeof data.upperdress_2 === 'string' ? data.upperdress_2.split(',').map(c => c.trim()) : []);
            setLowerDress(typeof data.lowerdress === 'string' ? data.lowerdress.split(',').map(c => c.trim()) : []);

            setShow(true);
        } catch (error) {
            console.error("Error fetching form data:", error);
        }
    };

    const rows = [
        { id: 1, upperdress_1: 'Shirt (Full)', upperdress_2: 'Jeans Shirt', lowerdress: 'Pant' },
        { id: 2, upperdress_1: 'Shirt (Half)', upperdress_2: 'Shirt (Full)', lowerdress: 'Half Pant' },
        { id: 3, upperdress_1: 'T-Shirt (Sleeveless)', upperdress_2: 'Shirt (Half)', lowerdress: 'Dhoti' },
        { id: 4, upperdress_1: 'T-Shirt (Full)', upperdress_2: 'Half Saree', lowerdress: 'Lungi' },
        { id: 5, upperdress_1: 'T-Shirt (Half)', upperdress_2: 'Churidhar', lowerdress: 'Shorts' },
        { id: 6, upperdress_1: 'Kadhar Shirt', upperdress_2: 'Salwar', lowerdress: 'Jeans Pant' },
        { id: 7, upperdress_1: 'Gurtha', upperdress_2: 'Nighty', lowerdress: 'Burmudas' },
        { id: 8, upperdress_1: 'Jeans Shirt', upperdress_2: 'Track Suit (Upper)', lowerdress: 'Pyjama Pant' },
        { id: 9, upperdress_1: 'Jersy', upperdress_2: 'Pyjama Suit', lowerdress: '3/4 Pant' },
        { id: 10, upperdress_1: 'Pyjama', upperdress_2: 'Collar Less T-Shirt (Full)', lowerdress: 'Safari Suit' },
        { id: 11, upperdress_1: 'Collar Less T-Shirt (Full/Half)', upperdress_2: 'Collar Less T-Shirt (Half)', lowerdress: 'Track Suit' },
        { id: 12, upperdress_1: 'Safari Shirt', upperdress_2: 'Sweater', lowerdress: 'Shirt (Half)' },
        { id: 13, upperdress_1: 'Coat', upperdress_2: 'Stone Wash Shirt', lowerdress: 'Ladies Pant' },
        { id: 14, upperdress_1: 'Sweater', upperdress_2: 'Short Shirt', lowerdress: 'Ladies Jeans Pant' },
        { id: 15, upperdress_1: 'Bare Body', upperdress_2: '', lowerdress: 'Ladies 3/4 Pant' },
        { id: 16, upperdress_1: 'Stone Wash Shirt', upperdress_2: '', lowerdress: 'Churidhar Pant' },
        { id: 17, upperdress_1: 'Short Shirt', upperdress_2: '', lowerdress: 'Kameezh' },
        { id: 18, upperdress_1: 'Saree', upperdress_2: '', lowerdress: 'Track Suit (Lower)' },
        { id: 19, upperdress_1: 'Blousee', upperdress_2: '', lowerdress: 'Shirt (Full)' },
    ];

    const handleCheckboxChange = (value, type) => {
        const updater = (prev) =>
            prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value];

        if (type === 'upperdress_1') setUpperDress1(updater);
        if (type === 'upperdress_2') setUpperDress2(updater);
        if (type === 'lowerdress') setLowerDress(updater);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        const id = formData.id; // ✅ Get it from form data
        console.log("Updating form with ID:", id);
        if (!id) {
            alert("ID not found.");
            return;
        }
        const data = new FormData();
        data.append('name_ngo', formData.name_ngo);
        data.append('file_no', formData.file_no);
        data.append('addition_upperdress', formData.addition_upperdress);
        data.append('addition_lowerdress', formData.addition_lowerdress);
        data.append('upperdress_color', formData.upperdress_color);
        data.append('lowerdress_color', formData.lowerdress_color);

        const payload = {
            ...formData,
            upperdress_1: upperdress_1.join(", "),
            upperdress_2: upperdress_2.join(", "),
            lowerdress: lowerdress.join(", ")
        };


        try {
            const response = await apiRoute.put(`/scrb_form/updateForm2C/${id}`, payload);

            console.log(response.data);
            if (response.status === 200 || response.status === 201) {
                alert('Form Updated successfully!');
                handleClose(true);
                fetchSCRBForm2CReport();
                setFormData({
                    name_ngo: '',
                    file_no: '',
                    addition_upperdress: '',
                    addition_lowerdress: '',
                    upperdress_color: '',
                    lowerdress: ''
                });
                setUpperDress1([]);
                setUpperDress2([]);
                setLowerDress([]);
            } else {
                alert('Error Updating form.');
            }

        } catch (error) {
            console.error('There was an error Updating the form:', error);
            alert('There was an error Updating the form.');
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
                            <Breadcrumb.Item active>Admission</Breadcrumb.Item>
                        </Breadcrumb>
                        <h6 className="breadcrumb_title">SCRB Form</h6>
                    </Col>
                    <Col md={8} className="text-center">
                        <h4 className="section_title_1">FORM 2C - FOUND PERSON DETAILS - DRESS CODE</h4>
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
            <Container>
                <Row className='d-flex align-items-center justify-content-between mb-3'>
                    <Col md={3} className='d-flex align-items-start justify-content-start'>
                        <Button type='button' className='btn btn-success' onClick={() => window.history.back()}>Back</Button>
                    </Col>
                    <Col md={3} className='d-flex align-items-end justify-content-end'>
                        <Button type='button' className='btn btn-success' onClick={() => SCRBForm2()}>Next</Button>
                    </Col>
                </Row>

            </Container>

            <Container>
                <>
                    <Row>
                        <Col md={12}>
                            <Table responsive="sm">
                                <thead>
                                    <tr>
                                        <th>S.No</th>
                                        <th>Admission No.</th>
                                        <th>Name of the NGO</th>
                                        <th>File No.</th>
                                        <th>Upper Dress</th>
                                        <th>Lower Dress</th>
                                        <th>Upper Dress Color</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredRescueDetails.length > 0 ? (
                                        filteredRescueDetails.map((item, index) => (
                                            <tr key={item.id}>
                                                <td>{index + 1}</td>
                                                <td>{item.admission_no || "null"}</td>
                                                <td>{item.name_ngo || "null"}</td>
                                                <td>{item.file_no || "null"}</td>
                                                <td>{item.upperdress_1 || "null"}, {item.upperdress_2 || "null"}</td>
                                                <td>{item.lowerdress_color || "null"}</td>
                                                <td>{item.upperdress_color || "null"}</td>

                                                <td>
                                                    <Button
                                                        className="btn btn-success icon_details"
                                                        onClick={() => handleEditform(item.id)}
                                                    >
                                                        <i className="fas fa-edit"></i>
                                                    </Button>
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

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit SCRB Form 2C</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Col md={12}>
                        <Form>
                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="6" className='text-start'>
                                    Name of the NGO :
                                </Form.Label>
                                <Col sm="6">
                                    <Form.Control
                                        type="text"
                                        name="name_ngo"
                                        value={"MANASU (Mental Health Charity Home)"}
                                        onChange={handleInputChange}
                                        readOnly
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="6" className="text-start">
                                    File No.:
                                </Form.Label>
                                <Col sm="6">
                                    <Form.Control
                                        type="text"
                                        name="file_no"
                                        value={formData.file_no}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label className="text-start">Upper Dress:</Form.Label>
                                {rows.map((row, index) => (
                                    <Row key={index} className="mb-2">
                                        {row.upperdress_1 && (
                                            <Col md={6} className="d-flex align-items-center">
                                                <Form.Check
                                                    type="checkbox"
                                                    label={row.upperdress_1}
                                                    onChange={() => handleCheckboxChange(row.upperdress_1, 'upperdress_1')}
                                                    checked={upperdress_1.includes(row.upperdress_1)}
                                                />
                                            </Col>
                                        )}

                                        {row.upperdress_2 && (
                                            <Col md={6} className="d-flex align-items-center">
                                                <Form.Check
                                                    type="checkbox"
                                                    label={row.upperdress_2}
                                                    onChange={() => handleCheckboxChange(row.upperdress_2, 'upperdress_2')}
                                                    checked={upperdress_2.includes(row.upperdress_2)}
                                                />
                                            </Col>
                                        )}
                                    </Row>
                                ))}
                            </Form.Group>


                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm={6} className="text-start">Lower Dress:</Form.Label>
                                <Col md={6}>
                                    {rows.map((row, index) => (
                                        row.lowerdress && (
                                            <Row key={index} className="mb-2">
                                                <Col md={12} className="d-flex align-items-center">
                                                    <Form.Check
                                                        type="checkbox"
                                                        label={row.lowerdress}
                                                        onChange={() => handleCheckboxChange(row.lowerdress, 'lowerdress')}
                                                        checked={lowerdress.includes(row.lowerdress)}
                                                    />
                                                </Col>
                                            </Row>
                                        )
                                    ))}
                                </Col>
                            </Form.Group>


                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="6" className="text-start">
                                    Any Other Upper Dress:
                                </Form.Label>
                                <Col sm="6">
                                    <Form.Control
                                        type="text"
                                        name="addition_upperdress"
                                        value={formData.addition_upperdress}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="6" className="text-start">
                                    Any Other Lower Dress:
                                </Form.Label>
                                <Col sm="6">
                                    <Form.Control
                                        type="text"
                                        name="addition_lowerdress"
                                        value={formData.addition_lowerdress}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="6" className="text-start">
                                    Upper Dress Color:
                                </Form.Label>
                                <Col sm="6">
                                    <Form.Control
                                        type="text"
                                        name="upperdress_color"
                                        value={formData.upperdress_color}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="6" className="text-start">
                                    Lower Dress Color:
                                </Form.Label>
                                <Col sm="6">
                                    <Form.Control
                                        type="text"
                                        name="lowerdress_color"
                                        value={formData.lowerdress_color}
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
                        </Form>
                    </Col>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default SCRB_Form2C_All
