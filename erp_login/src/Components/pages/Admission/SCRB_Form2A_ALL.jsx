import React from 'react'
import { Breadcrumb, Form, InputGroup, Container, Row, Col, Table } from '@themesberg/react-bootstrap';
import { useState, useEffect } from "react";
import axios from 'axios';
import { Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from 'react-router-dom';

function SCRB_Form2A_ALL() {
    const [scrbForm2AList, setScrbForm2AList] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [show, setShow] = useState(false);
    const [category, setCategory] = useState([]);
    const [complexion, setComplexion] = useState([]);
    const [face, setFace] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [formData, setFormData] = useState({
        name_ngo: 'MANASU (Mental Health Charity Home)',
        admission_no: '',
        file_no: '',
        addition_category: '',
        addition_complexion: '',
        addition_face: '',
    });

    const handleClose = () => setShow(false);

    const fetchSCRBForm2AReport = async () => {
        try {
            const response = await apiRoute.get('/scrb_form/getAllSCRBForm2A');
            setScrbForm2AList(response.data.data); // ✅ Only set the actual data
            console.log(response);
        } catch (err) {
            console.error('Error fetching SCRB Form2A Report:', err);
        }
    };

    useEffect(() => {
        fetchSCRBForm2AReport();
    }, []);

    const searchFilteredRescueDetails = scrbForm2AList.filter((item) => {
        const searchTerm = searchQuery.toLowerCase();
        return (
            String(item.admission_no).toLowerCase().includes(searchTerm) ||
            String(item.category).toLowerCase().includes(searchTerm) ||
            String(item.name_ngo).toLowerCase().includes(searchTerm) ||
            String(item.file_no).toLowerCase().includes(searchTerm) ||
            String(item.complexion).toLowerCase().includes(searchTerm) ||
            String(item.face).toLowerCase().includes(searchTerm)
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
            const response = await apiRoute.get(`/scrb_form/getSCRB_form2A/${id}`);
            const data = response.data; // Access the first object in the 'data' array
            console.log(data.id);
            setFormData({
                id: data.id || '',
                name_ngo: data.name_ngo || 'NULL',
                admission_no: data.admission_no || 'NULL',
                file_no: data.file_no || 'NULL',
                addition_category: data.addition_category || 'NULL',
                addition_complexion: data.addition_complexion || 'NULL',
                addition_face: data.addition_face || 'NULL'
            });

            // ✅ Properly parse comma-separated values into arrays
            setCategory(typeof data.category === 'string' ? data.category.split(',').map(c => c.trim()) : []);
            setComplexion(typeof data.complexion === 'string' ? data.complexion.split(',').map(c => c.trim()) : []);
            setFace(typeof data.face === 'string' ? data.face.split(',').map(c => c.trim()) : []);

            setShow(true);
        } catch (error) {
            console.error("Error fetching form data:", error);
        }
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
        data.append('addition_category', formData.addition_category);
        data.append('addition_complexion', formData.addition_complexion);
        data.append('addition_face', formData.addition_face);

        data.append('category', category.join(", "));
        data.append('complexion', complexion.join(", "));
        data.append('face', face.join(", "));

        const payload = {
            ...formData,
            category,
            complexion,
            face
        }

        try {
            const response = await apiRoute.put(`/scrb_form/updateForm2A/${id}`, payload);

            console.log(response.data);
            if (response.status === 200 || response.status === 201) {
                alert('Form Updated successfully!');
                handleClose(true);
                fetchSCRBForm2AReport();
                setFormData({
                    name_ngo: '',
                    file_no: '',
                    addition_category: '',
                    addition_complexion: '',
                    addition_face: ''
                });
                setCategory([]);
                setComplexion([]);
                setFace([]);
            } else {
                alert('Error Updating form.');
            }

        } catch (error) {
            console.error('There was an error Updating the form:', error);
            alert('There was an error Updating the form.');
        }
    };

    const handleCheckboxChange = (value, type) => {
        const updater = (prev) => {
            const current = Array.isArray(prev) ? prev : [];
            return current.includes(value)
                ? current.filter((v) => v !== value)
                : [...current, value];
        };

        if (type === 'category') setCategory(updater);
        if (type === 'complexion') setComplexion(updater);
        if (type === 'face') setFace(updater);
    };


    const rows = [
        { id: 1, category: 'Abandoned', complexion: 'Dark', face: 'Dimpled Cheek' },
        { id: 2, category: 'Addiction', complexion: 'Fair', face: 'Dimpled Chin' },
        { id: 3, category: 'Aids Victim', complexion: 'Very Fair', face: 'Double Chin' },
        { id: 4, category: 'Distressed Person', complexion: 'Wheatish', face: 'Forehead Broad' },
        { id: 5, category: 'Dying Destitue', complexion: '', face: 'Forehead Narrow' },
        { id: 6, category: 'Handicapped', complexion: '', face: 'High Cheek' },
        { id: 7, category: 'Mentally Retarded', complexion: '', face: 'Long' },
        { id: 8, category: 'Psychiatric patient', complexion: '', face: 'Oval' },
        { id: 9, category: 'Run Away', complexion: '', face: 'Poxpitted' },
        { id: 10, category: 'Senior Citizen', complexion: '', face: 'Prominent Cheek' },
        { id: 11, category: '', complexion: '', face: 'Protruding Chin' },
        { id: 12, category: '', complexion: '', face: 'Receding Forehead' },
        { id: 13, category: '', complexion: '', face: 'Round' },
        { id: 14, category: '', complexion: '', face: 'Square / Heavy Jaw' },
        { id: 15, category: '', complexion: '', face: 'Sunken Cheeks' },
        { id: 16, category: '', complexion: '', face: 'Wrinkled' },
    ];

    const navigate = useNavigate();

    const gotoSCRBForm2B = () => {
        navigate("/scrb_form2bALL");
    }

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = searchFilteredRescueDetails.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(searchFilteredRescueDetails.length / itemsPerPage);
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    return (
        <div>
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
                        <h4 className="section_title_1">FORM 2A - FOUND PERSON DETAILS - PHYSICAL PARAMETERS -1</h4>
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
                        <Button type='button' className='btn btn-success' onClick={() => gotoSCRBForm2B()}>Next</Button>
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
                                        <th>Category</th>
                                        <th>Complexion</th>
                                        <th>Face</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.length > 0 ? (
                                        currentItems.map((item, index) => (
                                            <tr key={item.id}>
                                                <td>{index + 1}</td>
                                                <td>{item.admission_no || "null"}</td>
                                                <td>{item.name_ngo || "null"}</td>
                                                <td>{item.file_no || "null"}</td>
                                                <td>{item.category || "null"}</td>
                                                <td>{item.complexion || "null"}</td>
                                                <td>{item.face || "null"}</td>

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
                </>

            </Container>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit SCRB Form 2A</Modal.Title>
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
                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="6" className="text-start">
                                    Category:
                                </Form.Label>
                                <Col sm="6">
                                    {rows.map((row, index) => (
                                        row.category && (
                                            <div key={row.id} className="d-flex align-items-center mb-2">
                                                <Form.Check
                                                    type="checkbox"
                                                    className="me-2"
                                                    checked={category.includes(row.category)}
                                                    onChange={() => handleCheckboxChange(row.category, 'category')}
                                                />
                                                <span>{row.category}</span>
                                            </div>
                                        )
                                    ))}
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="6" className="text-start">
                                    Complexion:
                                </Form.Label>
                                <Col sm="6">
                                    {rows.map((row, index) => (
                                        row.complexion && (
                                            <div key={row.id} className="d-flex align-items-center mb-2">
                                                <Form.Check
                                                    type="checkbox"
                                                    className="me-2"
                                                    checked={complexion.includes(row.complexion)}
                                                    onChange={() => handleCheckboxChange(row.complexion, 'complexion')}
                                                />
                                                <span>{row.complexion}</span>
                                            </div>
                                        )
                                    ))}
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="6" className="text-start">
                                    Face:
                                </Form.Label>
                                <Col sm="6">
                                    {rows.map((row, index) => (
                                        row.face && (
                                            <div key={row.id} className="d-flex align-items-center mb-2">
                                                <Form.Check
                                                    type="checkbox"
                                                    className="me-2"
                                                    checked={face.includes(row.face)}
                                                    onChange={() => handleCheckboxChange(row.face, 'face')}
                                                />
                                                <span>{row.face}</span>
                                            </div>
                                        )
                                    ))}
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="6" className="text-start">
                                    Any Other Category:
                                </Form.Label>
                                <Col sm="6">
                                    <Form.Control
                                        type="text"
                                        name="addition_category"
                                        value={formData.addition_category}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="6" className="text-start">
                                    Any Other Complexion:
                                </Form.Label>
                                <Col sm="6">
                                    <Form.Control
                                        type="text"
                                        name="addition_complexion"
                                        value={formData.addition_complexion}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="6" className="text-start">
                                    Any Other Face:
                                </Form.Label>
                                <Col sm="6">
                                    <Form.Control
                                        type="text"
                                        name="addition_face"
                                        value={formData.addition_face}
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


        </div>
    )
}

export default SCRB_Form2A_ALL
