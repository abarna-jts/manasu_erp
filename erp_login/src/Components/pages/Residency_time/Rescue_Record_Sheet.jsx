import React from 'react';
import { Breadcrumb, Container, Row, Table, Button } from 'react-bootstrap';
import { Col, Form, InputGroup } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css
import Cookies from 'js-cookie';

function Rescue_Record_Sheet() {
    const [condition_details, setConditionDetails] = useState([]);
    const [show, setShow] = useState(false);
    const [editshow, setEditShow] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [admission_no, setAdmissionNumber] = useState("");
    const [rescueName, setRescueName] = useState("");
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

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
        const file = e.target.files[0];
        if (file) {
            setFiles({ ...files, rescue_recovery_photo: file });
        }
    };



    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('admission_no', admission_no);
        data.append('resident_name', rescueName);
        data.append('date', formData.date);
        data.append('rescue_recovery_photo', files.rescue_recovery_photo);
        data.append('follow_up', formData.follow_up);

        try {
            const res = await apiRoute.post('/residency/rescue_condition', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            
            alert('Rescue Condition submitted successfully!');
            window.location.reload();
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

            // Base path for images
            const resrecovery_photoPath = data.rescue_recovery_photo ? `https://www.pahrultours.com/app2/${data.rescue_recovery_photo}` : null;

            // Set files state
            setFiles((files) => ({
                ...files,
                rescue_recovery_photo: resrecovery_photoPath,
            }));



            setEditShow(true);
        } catch (error) {
            console.error("Error fetching form data:", error);
            alert("Error to upload data");
        }
    }

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('admission_no', formData.admission_no);
        data.append('resident_name', formData.resident_name);
        data.append('date', formData.date);
        data.append('follow_up', formData.follow_up);

        // ✅ Only append recovery photo if it's a new file
        if (files.rescue_recovery_photo instanceof File) {
            data.append('rescue_recovery_photo', files.rescue_recovery_photo);
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
                                            <td>
                                                <img
                                                    src={`https://www.pahrultours.com/app2/${item.rescue_recovery_photo}`}
                                                    alt="Rescue Condition Photo"
                                                    style={{ width: "70px", height: "70px", objectFit: "cover" }}
                                                />
                                            </td>
                                            <td>
                                                <button className="btn btn-success icon_details" onClick={() => handleEdiShow(item.id)}>
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
                                <Form.Label>Admission No.</Form.Label>
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
                                <Form.Label>Resident Name</Form.Label>
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
                                <Form.Label>Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>

                            <Form.Group controlId="formFile" className="mb-3">
                                <Form.Label>Rescue Recovery Photo Attachment</Form.Label>
                                <Form.Control
                                    type="file"
                                    accept=".jpg,.jpeg,.png"
                                    onChange={handleFileChange}
                                    name="rescue_recovery_photo"
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formFollowUp">
                                <Form.Label>Follow Up</Form.Label>
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
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="formAdmissionNo">
                                <Form.Label>Admission No.</Form.Label>
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
                                <Form.Label>Resident Name</Form.Label>
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
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Form.Group>

                            <Form.Group controlId="formFile" className="mb-3 d-flex flex-column">
                                <Form.Label>Rescue Recovery Photo Attachment</Form.Label>
                                <div className="photorow d-flex align-items-center justify-content-between">
                                    {files.rescue_recovery_photo ? (
                                        <>
                                            <img
                                                src={files.rescue_recovery_photo}
                                                alt="Old"
                                                style={{ width: "100px", height: "100px", marginTop: "10px" }}
                                            />
                                        </>
                                    ) : (
                                        <p>No old photo available</p> // Display if no photo
                                    )}

                                    <Form.Control
                                        type="file"
                                        accept=".jpg,.jpeg,.png"
                                        onChange={handleFileChange}
                                        name="rescue_recovery_photo"
                                        required={!formData.rescue_recovery_photo}
                                    />
                                </div>

                            </Form.Group>


                            <Form.Group className="mb-3" controlId="formFollowUp">
                                <Form.Label>Follow Up</Form.Label>
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
        </>
    )
}

export default Rescue_Record_Sheet
