import React from 'react'
import { Breadcrumb, Form, InputGroup, Container, Row, Col, Table } from '@themesberg/react-bootstrap';
import { useState, useEffect } from "react";
import axios from 'axios';
import { Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

function SCRB_Form2B_All() {
    const [scrbForm2BList, setScrbForm2BList] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [show, setShow] = useState(false);
    const [selectedTattoos, setSelectedTattoos] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [formData, setFormData] = useState({
        name_ngo: 'MANASU (Mental Health Charity Home)',
        admission_no: '',
        file_no: '',
        addition_tatoo: '',
        scar: '',
        mole: '',
        height: ''
    });

    const userType = Cookies.get('usertype');

    const handleClose = () => setShow(false);

    const fetchSCRBForm2BReport = async () => {
        try {
            const response = await apiRoute.get('/scrb_form/getAllSCRBForm2B');
            setScrbForm2BList(response.data.data); // ✅ Only set the actual data
            console.log(response);
        } catch (err) {
            console.error('Error fetching SCRB Form2B Report:', err);
        }
    };

    useEffect(() => {
        fetchSCRBForm2BReport();
    }, []);

    const searchFilteredRescueDetails = scrbForm2BList.filter((item) => {
        const searchTerm = searchQuery.toLowerCase();
        return (
            String(item.admission_no).toLowerCase().includes(searchTerm) ||
            String(item.rescue_name).toLowerCase().includes(searchTerm) ||
            String(item.name_ngo).toLowerCase().includes(searchTerm) ||
            String(item.koppu_en).toLowerCase().includes(searchTerm)
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
            const response = await apiRoute.get(`/scrb_form/getSCRB_form2B/${id}`);
            const data = response.data; // Access the first object in the 'data' array
            console.log(data.id);
            setFormData({
                id: data.id || '',
                name_ngo: data.name_ngo || 'NULL',
                file_no: data.file_no || 'NULL',
                addition_tatoo: data.addition_tatoo || 'NULL',
                scar: data.scar || 'NULL',
                mole: data.mole || 'NULL',
                height: data.height || 'NULL',
                tatoo: data.tatoo || 'NULL'
            });
            setSelectedTattoos(typeof data.tatoo === 'string' ? data.tatoo.split(',').map(c => c.trim()) : []);

            setShow(true);
        } catch (error) {
            console.error("Error fetching form data:", error);
        }
    };

    const tattooRows = [
        { id: 1, bodyPart: "Back Left Side" },
        { id: 2, bodyPart: "Back Right Side" },
        { id: 3, bodyPart: "Cheek Left" },
        { id: 4, bodyPart: "Cheek Right" },
        { id: 5, bodyPart: "Chest Middle" },
        { id: 6, bodyPart: "Chest Left Side" },
        { id: 7, bodyPart: "Chest Right Side" },
        { id: 8, bodyPart: "Chin" },
        { id: 9, bodyPart: "Ear Left" },
        { id: 10, bodyPart: "Ear Right" },
        { id: 11, bodyPart: "Eye Brow Left" },
        { id: 12, bodyPart: "Eye Brow Right" },
        { id: 13, bodyPart: "Face" },
        { id: 14, bodyPart: "Foot Left" },
        { id: 15, bodyPart: "Foot Right" },
        { id: 16, bodyPart: "Forehead" },
        { id: 17, bodyPart: "Hip" },
        { id: 18, bodyPart: "Toe Right" },
        { id: 19, bodyPart: "Thumb Right" },
        { id: 20, bodyPart: "Hand Left" },
        { id: 21, bodyPart: "Hand Left - Letter" },
        { id: 22, bodyPart: "Hand Left - Figure" },
        { id: 23, bodyPart: "Hand Right" },
        { id: 24, bodyPart: "Forearm Right - Figure" },
        { id: 25, bodyPart: "Forearm Right - Letter" },
        { id: 26, bodyPart: "Head" },
        { id: 27, bodyPart: "Leg Left" },
        { id: 28, bodyPart: "Leg Right" },
        { id: 29, bodyPart: "Lip Lower" },
        { id: 30, bodyPart: "Lip Upper" },
        { id: 31, bodyPart: "Neck" },
        { id: 32, bodyPart: "Nose" },
        { id: 33, bodyPart: "Shoulder Left" },
        { id: 34, bodyPart: "Shoulder Right" },
        { id: 35, bodyPart: "Stomach" },
        { id: 36, bodyPart: "Toe Left" },
        { id: 37, bodyPart: "Thumb Left" },
        { id: 38, bodyPart: "Thigh Left" },
        { id: 39, bodyPart: "Thigh Right" },
        { id: 40, bodyPart: "Palm Right" },
        { id: 41, bodyPart: "Palm Left" },
        { id: 42, bodyPart: "Finger(s) Left Hand" },
        { id: 43, bodyPart: "Finger(s) Right Hand" },
        { id: 44, bodyPart: "Finger(s) Left Foot" },
        { id: 45, bodyPart: "Finger(s) Right Foot" },
        { id: 46, bodyPart: "Ankle" },
        { id: 47, bodyPart: "Wrist" },
        { id: 48, bodyPart: "Elbow" },
        { id: 49, bodyPart: "Abdomen" },
        { id: 50, bodyPart: "Upper Arm" },
        { id: 51, bodyPart: "Cleft Lip" },
        { id: 52, bodyPart: "Knee Right" },
        { id: 53, bodyPart: "Knee Left" },
        { id: 54, bodyPart: "Rib" }
    ];

    const handleTattooCheckboxChange = (bodyPart) => {
        setSelectedTattoos((prev) => {
            const current = Array.isArray(prev) ? prev : [];

            if (current.includes(bodyPart)) {
                return current.filter(item => item !== bodyPart);
            } else {
                return [...current, bodyPart];
            }
        });
    };


    const handleUpdate = async () => {
        try {
            const updatedData = {
                name_ngo: "MANASU (Mental Health Charity Home)", // since it's readonly
                file_no: formData.file_no,
                tatoo: selectedTattoos.join(", "),  // join selected checkboxes
                addition_tatoo: formData.addition_tatoo,
                scar: formData.scar,
                mole: formData.mole,
                height: formData.height
            };

            const response = await apiRoute.put(`/scrb_form/updateForm2B/${formData.id}`, updatedData);

            if (response.status === 200) {
                alert("Form updated successfully!");
                handleClose(true);
                fetchSCRBForm2BReport();
                setFormData({
                    name_ngo: "MANASU (Mental Health Charity Home)", // since it's readonly
                    file_no: '',
                    tatoo: '',  // join selected checkboxes
                    addition_tatoo: '',
                    scar: '',
                    mole: '',
                    height: ''
                })
            }
        } catch (error) {
            console.error("Error updating form:", error);
            alert("Failed to update the form. Please try again.");
        }
    };

    const navigate = useNavigate();

    const gotoSCRBForm2c = () => {
        navigate("/scrb_form2cALL");
    }

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
            const res = await apiRoute.delete(`/remove/SCRBForm2BtoRecycleBin/${admission_no}`);
            console.log(res.data);
            alert("Moved to recycle bin");
            fetchSCRBForm2BReport();
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
                            <Breadcrumb.Item active>Admission</Breadcrumb.Item>
                        </Breadcrumb>
                        <h6 className="breadcrumb_title">SCRB Form</h6>
                    </Col>
                    <Col md={8} className="text-center">
                        <h4 className="section_title_1">FORM 2B - FOUND PERSON DETAILS - PHYSICAL PARAMETERS -2</h4>
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
                        <Button type='button' className='btn btn-success' onClick={() => gotoSCRBForm2c()}>Next</Button>
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
                                        <th>Tatoo</th>
                                        <th>Scar</th>
                                        <th>Height</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.length > 0 ? (
                                        currentItems.map((item, index) => (
                                            <tr key={item.id}>
                                                <td>{indexOfFirstItem + index + 1}</td>
                                                <td>{item.admission_no || "null"}</td>
                                                <td>{item.name_ngo || "null"}</td>
                                                <td>{item.file_no || "null"}</td>
                                                <td>{item.tatoo || "null"}</td>
                                                <td>{item.scar || "null"}</td>
                                                <td>{item.height || "null"}</td>

                                                <td>
                                                    <Button
                                                        className="btn btn-success icon_details"
                                                        onClick={() => handleEditform(item.id)}
                                                    >
                                                        <i className="fas fa-edit"></i>
                                                    </Button>
                                                    {userType === "2" && (
                                                        <Button
                                                            className="btn btn-danger icon_details"
                                                            onClick={() => handleDelete(item.admission_no)}
                                                        >
                                                            <i className="fas fa-trash"></i>
                                                        </Button>
                                                    )}
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
                    <Modal.Title>Edit SCRB Form 2B</Modal.Title>
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
                                <Form.Label column sm="6" className="text-start">
                                    Tattoo:
                                </Form.Label>
                                {Array.from({ length: Math.ceil(tattooRows.length / 3) }, (_, i) => {
                                    const group = tattooRows.slice(i * 3, i * 3 + 3);
                                    return (
                                        <Row key={i} className="mb-2 mx-0">
                                            {group.map((row) => (
                                                <Col md={4} key={row.id} className="d-flex px-0 align-items-center">
                                                    <Form.Check
                                                        type="checkbox"
                                                        label={row.bodyPart}
                                                        onChange={() => handleTattooCheckboxChange(row.bodyPart)}
                                                        checked={selectedTattoos.includes(row.bodyPart)}
                                                    />
                                                </Col>
                                            ))}
                                        </Row>
                                    );
                                })}

                            </Form.Group>

                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="6" className="text-start">
                                    Tattoo in Letters:
                                </Form.Label>
                                <Col sm="6">
                                    <Form.Control
                                        type="text"
                                        name="addition_tatoo"
                                        value={formData.addition_tatoo}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="6" className="text-start">
                                    Scar:
                                </Form.Label>
                                <Col sm="6">
                                    <Form.Control
                                        type="text"
                                        name="scar"
                                        value={formData.scar}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="6" className="text-start">
                                    Mole:
                                </Form.Label>
                                <Col sm="6">
                                    <Form.Control
                                        type="text"
                                        name="mole"
                                        value={formData.mole}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-3">
                                <Form.Label column sm="6" className="text-start">
                                    Height (cms):
                                </Form.Label>
                                <Col sm="6">
                                    <Form.Control
                                        type="text"
                                        name="height"
                                        value={formData.height}
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

export default SCRB_Form2B_All
