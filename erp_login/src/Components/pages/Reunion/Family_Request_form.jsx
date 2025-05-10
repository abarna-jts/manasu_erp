import React from 'react';
import { Breadcrumb, Container, Row, Table, Button } from 'react-bootstrap';
import { Col, Form, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPlus, faEdit } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from 'react';
import axios from 'axios';

function Family_Request_form() {
    const [admissionNumber, setAdmissionNumber] = useState('');
    
    const apiRoute = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
      });

    const [formData, setFormData] = useState({
        admission_no:'',
        rescue_name:'',
        age:'',
        gender:'Male',
        phone_no:'',
        rescue_relationship:'',
        f_member_name:'',
        f_member_age:'',
        f_member_address:'',
        f_member_phone:'',
    })

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };



    // Automatically fetch data when admission number is typed
useEffect(() => {
    if (admissionNumber.trim().length >= 5) { // Adjust minimum length as needed
      fetchFormData();
    }
  }, [admissionNumber]);

  const fetchFormData = async () => {
    try {
        const response = await apiRoute.get(`http://localhost:5000/admision/get_scrb_formdata/${admissionNumber}`);
        setFormData(response.data.data[0]);
    } catch (error) {
        console.error('Error fetching data', error);
        alert("Admission Number Not found");
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
                            <Breadcrumb.Item active>Reunion</Breadcrumb.Item>
                        </Breadcrumb>
                        <h6 className="breadcrumb_title">Rescue Reunion</h6>
                    </Col>
                    <Col md={3} className="text-start">
                        <h3 className="section_title">Family Request Letter</h3>
                    </Col>
                    <Col md={2}>
                        <Form className="navbar-search">
                            <Form.Group id="topbarSearch">
                                <InputGroup className="input-group-merge search-bar">
                                    <Form.Control
                                        type="text"
                                        placeholder="Search"
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
                <Form className="navbar-search col-md-12 d-flex align-items-center justify-content-center">
                    <Form.Group id="topbarSearch" className="mt-3 d-flex align-items-center justify-content-center">
                        <Col md={5}>
                            <Form.Label>Enter Your Admission Number:</Form.Label>
                        </Col>
                        <Col md={4}>
                            <InputGroup className="input-group-merge search-bar">
                                <Form.Control
                                    type="text"
                                    value={admissionNumber}
                                    onChange={(e) => setAdmissionNumber(e.target.value)}
                                />
                            </InputGroup>
                        </Col>
                        <button type="button" className="btn btn-secondary mx-1" onClick={() => {
                            if (!admissionNumber.trim()) {
                                alert("Please enter your admission number.");
                            } else {
                                fetchFormData(); // Fetch & populate data before generating PDF
                            }
                        }}><FontAwesomeIcon icon={faEye} className="me-0" /></button>
                        <button type="button" className="btn btn-primary mx-1" onClick={() => {
                            if (!admissionNumber.trim()) {
                                alert("Please enter your admission number.");
                            } else {
                                createFormData(); // Fetch & populate data before generating PDF
                            }
                        }}><FontAwesomeIcon icon={faPlus} className="me-0" /></button>
                        <button type="button" className="btn btn-primary mx-1" onClick={() => {
                            if (!admissionNumber.trim()) {
                                alert("Please enter your admission number.");
                            } else {
                                handleShow(admissionNumber); // Fetch & populate data before generating PDF
                            }
                        }}><FontAwesomeIcon icon={faEdit} className="me-0" /></button>
                    </Form.Group>
                </Form>

                <Row>
                    <Form className='d-flex align-items-center justify-content-center flex-column'>

                    <Col md={8}>
                        <h5 className="pdfsub_heading">Rescue Details:</h5>
                        
                        <Form.Group as={Row} className="mb-1 text-start" controlId="formInformation">
                            <Form.Label column sm="4">
                                Admission No :
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control
                                    name="admission_no"
                                    type='number'
                                    value={admissionNumber}
                                    onChange={handleInputChange}
                                    required />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-1 text-start" controlId="formEmailID">
                            <Form.Label column sm="4">
                                Name :
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control
                                    name="rescue_name"
                                    type="text"
                                    value={formData.rescue_name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-1 text-start" controlId="formTakenFrom">
                            <Form.Label column sm="4">
                                Age :
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control
                                    name="age"
                                    type='text'
                                    value={formData.age}
                                    onChange={handleInputChange}
                                    required />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-1 text-start" controlId="formDateTime">
                            <Form.Label column sm="4">
                                Gender :
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control
                                    name="gender"
                                    type='text'
                                    value={"Male"}
                                    onChange={handleInputChange}
                                    required />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-1 text-start" controlId="formPoliceMemo">
                            <Form.Label column sm="4">
                                Phone Number :
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control
                                    name="phone_no"
                                    type='number'
                                    value={formData.phone_no}
                                    onChange={handleInputChange}
                                    required />
                            </Col>
                        </Form.Group>

                    </Col>

                    <Col md={8}>
                        <h5 className="pdfsub_heading">Family Details</h5>
                        
                        <Form.Group as={Row} className="mb-1 text-start" controlId="formInformation">
                            <Form.Label column sm="4">
                             Relationship :
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control
                                    name="rescue_relationship"
                                    type='text'
                                    value={formData.rescue_relationship}
                                    onChange={handleInputChange}
                                    required />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-1 text-start" controlId="formEmailID">
                            <Form.Label column sm="4">
                                Person Name :
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control
                                    name="f_member_name"
                                    type="text"
                                    value={formData.f_member_name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-1 text-start" controlId="formTakenFrom">
                            <Form.Label column sm="4">
                            Person Age :
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control
                                    name="f_member_age"
                                    type='text'
                                    required />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-1 text-start" controlId="formDateTime">
                            <Form.Label column sm="4">
                            Person Phone No :
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control
                                    name="f_member_phone"
                                    type='text'
                                    value={formData.f_member_phone}
                                    onChange={handleInputChange}
                                    required />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-1 text-start" controlId="formPoliceMemo">
                            <Form.Label column sm="4">
                                Person Address :
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control
                                    name="f_member_address"
                                    type='text'
                                    value={formData.f_member_address}
                                    onChange={handleInputChange}
                                    required />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-1 text-start" controlId="formPoliceMemo">
                            <Form.Label column sm="4">
                                Aadhar Card No :
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control 
                                type="file" />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-1 text-start" controlId="formPoliceMemo">
                            <Form.Label column sm="4">
                                Ration Card :
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control 
                                type="file" />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-1 text-start" controlId="formPoliceMemo">
                            <Form.Label column sm="4">
                                Description :
                            </Form.Label>
                            <Col sm="8">
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    name="description"
                                    type='number'
                                    required />
                            </Col>
                        </Form.Group>
                        

                        
                    </Col>

                    </Form>
                    
                </Row>
            </Container>
        </div>
    )
}

export default Family_Request_form
