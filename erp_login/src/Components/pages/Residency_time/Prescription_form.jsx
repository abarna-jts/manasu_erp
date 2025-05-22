import React from 'react';
import { Container, Row, Col, Breadcrumb, Form, InputGroup, Button, Table } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';

function Prescription_form() {
    const [searchQuery, setSearchQuery] = useState("");
    const [nurse_record, setNurseRecord] = useState([]);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [rows, setRows] = useState([{}, {}]);
    const [admission_no, setAdmission_no] = useState("");
    const [intake, setIntake] = useState("");

    const [formData, setFormData] = useState({
        rescue_name: '',
        age: '',
        op_no: '',
        hospital_name: '',
        department: '',
        masterHealthCheckup: '',
        phone_no: '',
        instruction: '',
        advice: '',
        follow_up: '',
        medicine: "",
        medicine_type: "",
        duration: "",
        intake: "",
        med_instruction: "",
        morning: "",
        afternoon: "",
        night: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleAdmissionChange = (e) => {
        setAdmission_no(e.target.value);
    }
    const handleAddRow = () => {
        setRows([...rows, {}]); // Add one more row
    };

    const handleRemoveRow = (index) => {
        if (rows.length > 1) {
            const newRows = rows.filter((_, i) => i !== index);
            setRows(newRows);
        }
    };

    const apiRoute = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
    });

    useEffect(() => {
        if (admission_no.trim().length >= 8) { // Adjust minimum length as needed
            fetchFormData();
        }
    }, [admission_no]);

    const fetchFormData = async () => {
        try {
            const response = await apiRoute.get(`/admision/get_scrb_formdata/${admission_no}`);
            setFormData(response.data.data[0]);
        } catch (error) {
            console.error('Error fetching data', error);
            alert("Admission Number Not found");
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

    const handlePrescriptionShow = () => {
        window.location.reload();
    }

    const handleCheckChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleRowChange = (index, e) => {
        const { name, value } = e.target;
        const updatedRows = [...rows];
        updatedRows[index][name] = value;
        setRows(updatedRows);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const finalData = {
        ...formData,
        medicine: JSON.stringify(rows)
        };

        try {
        await apiRoute.post('/residency/createPrescription', finalData);
        alert('Data submitted successfully!');
        } catch (error) {
        console.error(error);
        alert('Submission failed');
        }
    };



    return (
        <div>
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
                        <h3 className="section_title">Nursing Prescription</h3>
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
                                    <InputGroup.Text style={{ cursor: 'pointer', background: "#6abc15", color: "#fff" }}>
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
                            onClick={handleShow}
                        >Add Prescription</Button>
                    </Col>
                    <Col md={12} className="mt-3 my-3">

                        <Table responsive className="table-centered table-nowrap rounded mb-0">
                            <thead className="thead-light">
                                <tr>
                                    <th scope="col">S.No.</th>
                                    <th scope="col">Prescription Id</th>
                                    <th scope="col">Resident's Name</th>
                                    <th scope="col">Admission No</th>
                                    <th scope="col">Out Patient No.</th>
                                    <th scope="col">Date</th>
                                    <th scope="col">Checkup</th>
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

            <Modal show={show} onHide={handleClose} size="lg" aria-labelledby="contained-modal-title-vcenter" centered className="prescription_modal">
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        <div className="header_section d-flex justify-content-center align-items-center">
                            <Button className="btn btn-success" onClick={handlePrescriptionShow}>Prescription List</Button>
                            <div className="date_class">
                                <h6 className='mb-0 mx-3'>Date : {new Date().toLocaleString() + ""}</h6>
                            </div>
                        </div>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Row className='d-flex align-items-center justify-content-center'>
                            <Col md={4}>
                                <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                                    <Form.Label column sm="5" style={{ paddingRight: "5px" }}>
                                        Admission No:
                                    </Form.Label>
                                    <Col sm="7">
                                        <Form.Control type='number'
                                            name='admission_no'
                                            value={admission_no}
                                            onChange={handleAdmissionChange}
                                            placeholder='Admission No'
                                            required />
                                    </Col>
                                </Form.Group>
                            </Col>
                            <Col md={5}>
                                <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                                    <Form.Label column sm="5" style={{ paddingRight: "5px" }}>
                                        Resident's Name:
                                    </Form.Label>
                                    <Col sm="6">
                                        <Form.Control type='text'
                                            placeholder='Name'
                                            name="rescue_name"
                                            value={formData.rescue_name}
                                            onChange={handleInputChange}
                                            required />
                                    </Col>
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group as={Row} className="mb-3 d-flex align-items-center justify-content-center" controlId="formPlaintextEmail">
                                    <Form.Label column sm="3" style={{ paddingRight: "5px" }}>
                                        Age:
                                    </Form.Label>
                                    <Col sm="6">
                                        <Form.Control type='number'
                                            placeholder='Age'
                                            name='age'
                                            value={formData.age}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </Col>
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row className='d-flex align-items-center justify-content-center'>
                            <Col md={4}>
                                <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                                    <Form.Label column sm="5" style={{ paddingRight: "5px" }}>
                                        Out Patient No:
                                    </Form.Label>
                                    <Col sm="7">
                                        <Form.Control type='number'
                                            placeholder='OP No.'
                                            name='op_no'
                                            value={formData.op_no}
                                            onChange={handleInputChange}
                                            required />
                                    </Col>
                                </Form.Group>
                            </Col>
                            <Col md={5}>
                                <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                                    <Form.Label column sm="6" style={{ paddingRight: "5px" }}>
                                        Name of the Hospital:
                                    </Form.Label>
                                    <Col sm="6">
                                        <Form.Control type='text'
                                            placeholder='Hospital Name'
                                            name='hospital_name'
                                            value={formData.hospital_name}
                                            onChange={handleInputChange}
                                            required />
                                    </Col>
                                </Form.Group>
                            </Col>
                            <Col md={3}>
                                <Form.Group as={Row} className="mb-3 d-flex align-items-center justify-content-center" controlId="formPlaintextEmail">
                                    <Form.Label column sm="6" style={{ paddingRight: "5px" }}>
                                        Department:
                                    </Form.Label>
                                    <Col sm="6">
                                        <Form.Control type='text'
                                            placeholder='Dept'
                                            name='department'
                                            value={formData.department}
                                            onChange={handleInputChange}
                                            required />
                                    </Col>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className='d-flex align-items-center justify-content-center'>
                            <Col md={5}>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="6" style={{ paddingRight: "5px" }}>
                                        Master Health Check UP:
                                    </Form.Label>
                                    <Col sm="5" className='d-flex align-items-center justify-content-start'>
                                        <Form.Check
                                            type="radio"
                                            label="Yes"
                                            name="masterHealthCheckup"
                                            value="yes"
                                            checked={formData.masterHealthCheckup === 'Yes'}
                                            onChange={handleCheckChange}
                                        />
                                        <Form.Check
                                            type="radio"
                                            label="No"
                                            name="masterHealthCheckup"
                                            value="no"
                                            checked={formData.masterHealthCheckup === 'No'}
                                            onChange={handleCheckChange}
                                        />
                                    </Col>
                                </Form.Group>

                            </Col>
                            <Col md={4}>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="6" style={{ paddingRight: "5px" }}>
                                        Phone Number:
                                    </Form.Label>
                                    <Col sm="6">
                                        <Form.Control
                                            type='number'
                                            placeholder='Phone No'
                                            name='phone_no'
                                            value={formData.phone_no ?? ''}  // <-- Ensures it's not null
                                            onChange={handleInputChange}
                                            required
                                        />

                                    </Col>
                                </Form.Group>
                            </Col>
                            <Col md={3}>

                            </Col>

                        </Row>
                        <Row className='d-flex align-items-center justify-content-center'>
                            <Col md={4}>
                                <Form.Group as={Row} className="mb-3">

                                    <Col sm="12">
                                        <Form.Control as="textarea"
                                            rows={1}
                                            placeholder='Instruction'
                                            name='instruction'
                                            value={formData.instruction}
                                            onChange={handleInputChange}
                                            required />
                                    </Col>
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group as={Row} className="mb-3">

                                    <Col sm="12">
                                        <Form.Control as="textarea"
                                            rows={1}
                                            placeholder='Advice'
                                            name='advice'
                                            value={formData.advice}
                                            onChange={handleInputChange}
                                            required />
                                    </Col>
                                </Form.Group>
                            </Col>
                            <Col md={4}>
                                <Form.Group as={Row} className="mb-3">

                                    <Col sm="12">
                                        <Form.Control as="textarea"
                                            rows={1}
                                            placeholder='Follow-Up'
                                            name='follow_up'
                                            value={formData.follow_up}
                                            onChange={handleInputChange}
                                            required />
                                    </Col>
                                </Form.Group>
                            </Col>

                        </Row>
                        <table className="table mt-2" style={{ overflowWrap: 'break-word', marginBottom: '0px' }}>
                            <thead>
                                <tr style={{ backgroundColor: '#428bca', color: 'white' }}>
                                    <th>Action</th>
                                    <th className="text-center">Medicine Name / Units</th>
                                    <th style={{ width: '50px', margin: 'auto' }}>Duration(Days)</th>
                                    <th>Instruction Intake</th>
                                    <th className="text-center" >Instruction</th>
                                    <th style={{ width: '20px', margin: 'auto' }}>Morning</th>
                                    <th style={{ width: '20px', margin: 'auto' }}>Afternoon</th>
                                    <th style={{ width: '20px', margin: 'auto' }}>Night</th>
                                </tr>
                            </thead>
                            <tbody id="medicine">
                                {rows.map((_, i) => (
                                    <tr key={i}>
                                        <td>
                                            <button type="button" id="meadd" className="btn btn-sm btn-primary add" onClick={handleAddRow}>+</button>
                                            {' '}
                                            <button type="button" className="btn btn-sm btn-danger remove" onClick={() => handleRemoveRow(i)}>-</button>
                                        </td>

                                        <td>
                                            <div className="input-group mb-2" style={{ width: 'auto', margin: 'auto' }}>
                                                <input
                                                    type="text"
                                                    id="prescription_medicine"
                                                    className="form-control"
                                                    name="medicine"
                                                    value={rows[i].medicine}
                                                    onChange={(e) => handleRowChange(i, e)}
                                                    required
                                                    placeholder="medicine name"
                                                    style={{ width: '45%' }}
                                                />
                                                <select
                                                    className="form-select"
                                                    name="medicine_type"
                                                    value={formData.medicine_type} // ← controlled via state
                                                    onChange={handleInputChange}
                                                    required
                                                    style={{ width: '20%' }}
                                                >
                                                    <option value="" disabled hidden>Select Type</option>
                                                    <option value="mg">mg</option>
                                                    <option value="dl">dl</option>
                                                    <option value="ml">ml</option>
                                                </select>

                                            </div>
                                        </td>

                                        <td>
                                            <input
                                                type="number"
                                                min={1}
                                                name="duration"
                                                value={formData.duration}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="duration"
                                                autoComplete="off"
                                                className="form-control"

                                            />
                                        </td>

                                        <td>
                                            <select
                                                className="form-select"
                                                name="intake"
                                                defaultValue="" // ← for initial default
                                                value={formData.intake}
                                                onChange={(e) => setIntake(e.target.value)}
                                                required
                                                style={{ width: '140px', margin: 'auto' }}
                                            >
                                                <option value="" disabled hidden>Select Intake</option>
                                                <option value="before_food">Before Food</option>
                                                <option value="after_food">After Food</option>
                                            </select>
                                        </td>

                                        <td>
                                            <textarea
                                                name="med_instruction"
                                                placeholder="instruction"
                                                value={formData.med_instruction}
                                                onChange={handleInputChange}
                                                rows="1"
                                                className="form-control"

                                            ></textarea>
                                        </td>

                                        <td>
                                            <input
                                                type="text"
                                                name="morning"
                                                value={formData.morning}
                                                onChange={handleInputChange}
                                                min={0}
                                                placeholder="morning"
                                                autoComplete="off"
                                                className="form-control"
                                                style={{ width: '40px', margin: 'auto' }}
                                            />
                                        </td>

                                        <td>
                                            <input
                                                type="text"
                                                name="afternoon"
                                                value={formData.afternoon}
                                                onChange={handleInputChange}
                                                min={0}
                                                placeholder="afternoon"
                                                autoComplete="off"
                                                className="form-control"
                                                style={{ width: '40px', margin: 'auto' }}
                                            />
                                        </td>

                                        <td>
                                            <input
                                                type="text"
                                                name="night"
                                                value={formData.night}
                                                onChange={handleInputChange}
                                                min={0}
                                                placeholder="Days"
                                                autoComplete="off"
                                                className="form-control"
                                                style={{ width: '40px', margin: 'auto' }}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <Col md={12} className="mt-3 d-flex justify-content-center align-items-center">
                            <Button variant="btn btn-primary" type='submit'>Save</Button>
                        </Col>
                    </Form>

                </Modal.Body>
            </Modal>
        </div>
    )
}

export default Prescription_form
