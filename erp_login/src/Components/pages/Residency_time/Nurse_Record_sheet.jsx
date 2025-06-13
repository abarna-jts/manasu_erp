import React from 'react';
import { Breadcrumb, Container, Row, Table, Button } from 'react-bootstrap';
import { Col, Form, InputGroup } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { useState, useEffect } from 'react';
import { DateRange } from 'react-date-range';
import axios from 'axios';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css
// import { addDays } from 'date-fns';
import { Alert } from "react-bootstrap";
import Cookies from 'js-cookie';

function Nurse_Record_sheet() {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [nurse_record, setNurseRecord] = useState([]);
    const [show1, setShow1] = useState(false);

    const handleClose1 = () => setShow1(false);

    const userType = Cookies.get('usertype');

    const [formData, setFormData] = useState({
        admission_no: '',
        month: '',
        temperature: '',
        bp: '',
        pulse: '',
        weight: '',
        date: ''
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    
    const apiRoute = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
    });

    //alert box values
        const [submissionMessage, setSubmissionMessage] = useState("");
        const [messageType, setMessageType] = useState(""); // 'success' or 'danger'


    const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await apiRoute.post("/residency/nurse_record", formData);
        console.log(response);

        if (response.data.message === "Nurse Record Sheet Created Successfully") {
            setSubmissionMessage("Form submitted successfully!");
            setMessageType("success");

            // Reset the form
            setFormData({
                id: '',
                admission_no: '',
                month: '',
                temperature: '',
                bp: '',
                pulse: '',
                weight: '',
                date:''
            });

            handleClose(); // Close modal

            // Reload after 3 seconds
            setTimeout(() => window.location.reload(), 3000);
        } else {
            setSubmissionMessage("Submission failed.");
            setMessageType("danger");
        }
    } catch (error) {
        console.error("Error submitting form", error);
        setSubmissionMessage("Something went wrong.");
        setMessageType("danger");
    }
};



    useEffect(() => {
        getNurseRecords();
    }, []);

    const getNurseRecords = async () => {
        try {
            const response = await apiRoute.get('/residency/get_nurse_record');
            console.log("API response:", response.data);
            setNurseRecord(response.data.data);
        } catch (error) {
            console.error('Error fetching Student:', error);
        }
    };

    const filteredRescueDetails = nurse_record.filter((item) => {
        const searchTerm = searchQuery.toLowerCase();
        return (
            String(item.admission_no).toLowerCase().includes(searchTerm) ||
            String(item.resident_name).toLowerCase().includes(searchTerm) ||
            String(item.follow_up).toLowerCase().includes(searchTerm)
        );
    });

    // const calculateToDate = (fromDate) => {
    //     const date = new Date(fromDate);
    //     date.setDate(date.getDate() + 15);
    //     return date.toISOString().split("T")[0];
    // };

    // const handleStartDateChange = (e) => {
    //     const fromDate = e.target.value;
    //     const toDate = calculateToDate(fromDate);
    //     setFormData((prev) => ({
    //         ...prev,
    //         from_date: fromDate,
    //         to_date: toDate,
    //     }));
    // };

    const handleEditform = async (id) => {
        try {
            const response = await apiRoute.get(`/residency/getNurseRecordbyID/${id}`);
            const data = response.data;

            const [fromFormatted, toFormatted] = data.date.split(' to ');

            const parseDate = (dmy) => {
                const [day, month, year] = dmy.split("-");
                return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
            };

            setFormData({
                id: data.id,
                currentMonth: data.month || '',
                date: parseDate(fromFormatted),
                temperature: data.temperature || '',
                bp: data.bp || '',
                pulse: data.pulse || '',
                weight: data.weight || ''
            });
            setShow1(true);
        } catch (error) {
            console.error("Error fetching form data:", error);
            alert("Admission Number not found");
        }
    };



   const handleUpdate = async (e, id) => {
    e.preventDefault();

    try {
        const response = await apiRoute.put(`/residency/updateRecords/${id}`, formData);
        console.log(response.data);

        if (response.data.message === "Nurse Record updated successfully!") {
            setSubmissionMessage("Form updated successfully!");
            setMessageType("success");

            handleClose1(true);

            // Reload after 3 seconds
            setTimeout(() => window.location.reload(), 1000);
        } else {
            setSubmissionMessage("Error updating the form.");
            setMessageType("danger");
        }
    } catch (error) {
        console.error("There was an error updating the form:", error);
        setSubmissionMessage("Something went wrong.");
        setMessageType("danger");
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
                    <Col md={7} className="text-center">
                        <h3 className="section_title">Nursing Record Sheet – Resident Health & Medications</h3>
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

            <div>
                    {/* Show success or error message box */}
                    {submissionMessage && (
                        <Alert variant={messageType} className="mt-3">
                            {submissionMessage}
                        </Alert>
                    )}
                </div>

            <Container>
                <Row>
                    <Col md={4}>
                    {userType === "3" && (
                        <Button variant="success"
                            className="m-1 d-flex justify-content-start align-items-center"
                            type="submit"
                            onClick={handleShow}>Enter Condition</Button>
                    )}
                    </Col>
                    <Col md={12} className="mt-3 my-3">

                        <Table responsive className="table-centered table-nowrap rounded mb-0">
                            <thead className="thead-light">
                                <tr>
                                    <th scope="col">S.No.</th>
                                    <th scope="col">Admission No.</th>
                                    <th scope="col">Resident Name</th>
                                    <th scope="col">Month</th>
                                    <th scope="col">Date</th>
                                    <th scope="col">Temperature</th>
                                    <th scope="col">BP </th>
                                    <th scope="col">Pulse</th>
                                    <th scope="col">WT</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRescueDetails.length > 0 ? (
                                    filteredRescueDetails.map((item, index) => (
                                        <>
                                            <tr key={item.id}>
                                                <td>{index + 1}</td>
                                                <td>{item.admission_no}</td>
                                                <td>{item.rescue_name}</td>
                                                <td>{item.month}</td>
                                                <td>{item.date}</td>
                                                <td>{item.temperature}</td>
                                                <td>{item.bp}</td>
                                                <td>{item.pulse}</td>
                                                <td>{item.weight}</td>
                                                <td>
                                                    <button className="btn btn-success icon_details" onClick={() => {
                                                        handleEditform(item.id);
                                                    }}>
                                                        <i className="fas fa-edit"></i>
                                                    </button>
                                                    {/* <button className="btn btn-danger icon_details">
                                                        <i className="fas fa-trash"></i>
                                                    </button> */}
                                                </td>
                                            </tr>

                                        </>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="8" className="text-center text-danger">No data found</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>

            


            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Enter your Record for this month</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Col md={12}>
                        <Form onSubmit={handleSubmit}>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="formAdmissionNo">
                                        <Form.Label>Admission Number</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="admission_no"
                                            value={formData.admission_no}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="formAdmissionNo">
                                        <Form.Label>Month</Form.Label>
                                        <Form.Select
                                            name="month"
                                            value={formData.month}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">-- Select --</option>
                                            <option value="January">January</option>
                                            <option value="February">February</option>
                                            <option value="March">March</option>
                                            <option value="April">April</option>
                                            <option value="May">May</option>
                                            <option value="June">June</option>
                                            <option value="July">July</option>
                                            <option value="August">August</option>
                                            <option value="September">September</option>
                                            <option value="October">October</option>
                                            <option value="November">November</option>
                                            <option value="December">December</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={9}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Date</Form.Label>
                                        <Form.Control
                                            type="date"
                                            name="date"
                                            value={formData.date}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                </Col>

                            </Row>

                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="formResidentName">
                                        <Form.Label>Temperature</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="temperature"
                                            value={formData.temperature}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="formResidentName">
                                        <Form.Label>BP</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="bp"
                                            value={formData.bp}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>


                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="formResidentName">
                                        <Form.Label>Pulse</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="pulse"
                                            value={formData.pulse}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="formResidentName">
                                        <Form.Label>Weight</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="weight"
                                            value={formData.weight}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>




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

            <Modal show={show1} onHide={handleClose1}>
                <Modal.Header closeButton>
                    <Modal.Title>Enter your Record for this month</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Col md={12}>
                        <Form>
                            <Row>

                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="formAdmissionNo">
                                        <Form.Label>Month</Form.Label>
                                        <Form.Select
                                            name="currentMonth"
                                            value={formData.currentMonth}
                                            onChange={(e) =>
                                                setFormData({ ...formData, currentMonth: e.target.value })
                                            }
                                            required
                                        >
                                            <option value="">-- Select Month --</option>
                                            <option value="January">January</option>
                                            <option value="February">February</option>
                                            <option value="March">March</option>
                                            <option value="April">April</option>
                                            <option value="May">May</option>
                                            <option value="June">June</option>
                                            <option value="July">July</option>
                                            <option value="August">August</option>
                                            <option value="September">September</option>
                                            <option value="October">October</option>
                                            <option value="November">November</option>
                                            <option value="December">December</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
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
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="formResidentName">
                                        <Form.Label>Temperature</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="temperature"
                                            value={formData.temperature}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="formResidentName">
                                        <Form.Label>BP</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="bp"
                                            value={formData.bp}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>


                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="formResidentName">
                                        <Form.Label>Pulse</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="pulse"
                                            value={formData.pulse}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="formResidentName">
                                        <Form.Label>Weight</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="weight"
                                            value={formData.weight}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>




                            <div className="btn_footer d-flex align-items-center justify-content-end">
                                <Button variant="success" type="button" className="m-1" onClick={(e) => handleUpdate(e, formData.id)}>
                                    Submit
                                </Button>
                                <Button variant="secondary" onClick={handleClose1}>
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

export default Nurse_Record_sheet
