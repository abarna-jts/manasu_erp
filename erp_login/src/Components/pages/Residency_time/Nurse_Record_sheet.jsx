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

function Nurse_Record_sheet() {
    const [show, setShow] = useState(false);
    const [currentMonth, setCurrentMonth] = useState("");
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [nurse_record, setNurseRecord] = useState([]);
    const [show1, setShow1] = useState(false);
    
    const handleClose1 = () => setShow1(false);

    const [startDate, setStartDate] = useState("");

  // Set end date only if start date is selected
  const endDate = startDate
    ? new Date(new Date(startDate).setDate(new Date(startDate).getDate() + 14))
        .toISOString()
        .split("T")[0]
    : "";

    const [formData, setFormData] = useState({
        admission_no: '',
        currentMonth: '',
        temperature: '',
        bp: '',
        pulse: '',
        weight: '',
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        const monthName = new Date().toLocaleString('default', { month: 'long' });
        setCurrentMonth(monthName);
        setFormData((prev) => ({ ...prev, currentMonth: monthName }));
    }, []);

    const apiRoute = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
    });


    const handleSubmit = async (e) => {
    e.preventDefault();

    // Set from_date and to_date based on the selected start date
    const from_date = startDate;
    const to_date = endDate;

    // Ensure you send the correct data
    const newFormData = {
        ...formData,
        from_date,
        to_date,
    };

    try {
        const response = await apiRoute.post("/residency/nurse_record", newFormData);
        console.log(response);  // Log the response to check status and content

        if (response.status === 201) {
            alert("Record submitted successfully!");
            handleClose(); // close the modal
            window.location.reload();
            setFormData({
                id:'',
                admission_no: '',
                currentMonth: '',
                temperature: '',
                bp: '',
                pulse: '',
                weight: '',
                from_date: '',
                to_date: ''
            });
        } else {
            alert("Submission failed. Please try again.");
        }
    } catch (error) {
        console.error("Error submitting form:", error);
        alert("An error occurred while submitting the form.");
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

     const calculateToDate = (fromDate) => {
        const date = new Date(fromDate);
        date.setDate(date.getDate() + 15);
        return date.toISOString().split("T")[0];
    };

    const handleStartDateChange = (e) => {
        const fromDate = e.target.value;
        const toDate = calculateToDate(fromDate);
        setFormData((prev) => ({
        ...prev,
        from_date: fromDate,
        to_date: toDate,
        }));
    };

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
            from_date: parseDate(fromFormatted),
            to_date: parseDate(toFormatted),
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
            if (response.status === 200) {
                alert('Form Updated successfully!');
                handleClose1(true);
                window.location.reload();
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
                            <Breadcrumb.Item active>Residency Time</Breadcrumb.Item>
                        </Breadcrumb>
                        <h6 className="breadcrumb_title">Record Sheet</h6>
                    </Col>
                    <Col md={5} className="text-start">
                        <h3 className="section_title">Nurse Record Sheet for Rescue Condition</h3>
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
                                    <InputGroup.Text style={{ cursor: 'pointer', background: "#6abc15", color: "#fff" }} onClick={handleShow}>
                                        <i className="fas fa-plus"></i>
                                    </InputGroup.Text>

                                </InputGroup>
                            </Form.Group>
                        </Form>
                    </Col>
                </Row>
            </Container>

            <Container>
                <Row>
                    <Col md={4}>
                        <Button variant="success"
                            className="m-1 d-flex justify-content-start align-items-center"
                            type="submit"
                            onClick={handleShow}>Enter Condition</Button>
                    </Col>
                    <Col md={12} className="mt-3 my-3">

                        <Table responsive className="table-centered table-nowrap rounded mb-0">
                            <thead className="thead-light">
                                <tr>
                                    <th scope="col">S.No.</th>
                                    <th scope="col">Rescue Name</th>
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
                                                <td>{item.rescue_name}</td>
                                                <td>{item.month}</td>
                                                <td>{item.date}</td>
                                                <td>{item.temperature}</td>
                                                <td>{item.bp}</td>
                                                <td>{item.pulse}</td>
                                                <td>{item.weight}</td>
                                                <td>
                                                    <button className="btn btn-primary icon_details" onClick={() => {
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
                                        <Form.Control
                                            type="text"
                                            name="currentMonth"
                                            value={currentMonth}
                                            readOnly
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                    <Form.Label>Start Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="start_date"
                                        value={startDate}
                                        min={new Date().toISOString().split("T")[0]} // No past dates
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                    <Form.Label>End Date (15 days from Start)</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="end_date"
                                        value={endDate}
                                        readOnly
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
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                    <Form.Label>Start Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="from_date"
                                        value={formData.from_date}
                                        min={new Date().toISOString().split("T")[0]}
                                        onChange={handleStartDateChange}
                                        required
                                    />
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                    <Form.Label>End Date (15 days from Start)</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="to_date"
                                        value={formData.to_date}
                                        readOnly
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
