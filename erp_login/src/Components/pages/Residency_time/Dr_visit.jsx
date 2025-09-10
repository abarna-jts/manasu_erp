import React from 'react';
import { Breadcrumb, Container, Row, Form, Button, InputGroup } from 'react-bootstrap';
import { Col } from 'react-bootstrap';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useSelector, useDispatch } from 'react-redux';
import {
    setDrVisitField, resetDrVisit
} from '../../../store/drVisitSlice.js';
import { Link } from 'react-router-dom';

function Dr_visit() {

    const dispatch = useDispatch();
    const formData = useSelector((state) => state.dr_visit);


    const userType = Cookies.get('usertype');


    const handleChange = (e) => {
        const { name, value } = e.target;
        dispatch(setDrVisitField({ field: name, value }));
    };

    const apiRoute = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
    });


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await apiRoute.post("/residency/createDrVisit", formData);

            if (response.status === 200 || response.status === 201) {
                alert('Form submitted successfully!');
                dispatch(resetDrVisit());

            } else {
                alert('Error submitting form.');
            }
        } catch (err) {
            console.error('There was an error submitting the form:', err);
            alert('There was an error submitting the form.');
        }
    };


    const navigate = useNavigate();

    const handleViewPage = () => {

        navigate("/dr_visitView");
    }

    const handleClearData = () => {
        dispatch(resetDrVisit());
    }


    return (
        <>
            <Container fluid>
                <Row className='d-flex align-items-center justify-content-between'>
                    <Col md={2} className='text-start'>
                        <Breadcrumb className="d-none d-md-inline-block mb-0" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
                            <Breadcrumb.Item></Breadcrumb.Item>
                            <Breadcrumb.Item><Link to="/dashboard">Home</Link></Breadcrumb.Item>
                            <Breadcrumb.Item active>Residency Time</Breadcrumb.Item>
                        </Breadcrumb>
                        <h6 className="breadcrumb_title">Doctor Visit</h6>
                    </Col>
                    <Col md={7} className="text-start">
                        <h3 className="section_title">Doctor Visit Form</h3>
                    </Col>
                </Row>
            </Container>

            <Container>
                <Row className='d-flex flex-column align-items-center justify-content-center'>
                    <Col md={8} className='d-flex align-items-center justify-content-end mt-3'>
                        <Button type='button' className='btn btn-success' onClick={handleViewPage}>View All</Button>
                        <Button type='button' className='btn btn-danger mx-3' onClick={handleClearData}>Clear All</Button>
                    </Col>
                    <Col md={8} className="consultant_box my-1">
                        <div className="consultant_details">
                            <Form className='dr_consultant' onSubmit={handleSubmit}>
                                <Row>
                                    <Col md={12}>
                                        <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                            <Form.Label column sm="5" className='text-start'>
                                                Doctor Name : <span style={{ color: 'red' }}>*</span>
                                            </Form.Label>
                                            <Col sm="7">
                                                <Form.Control
                                                    type="text"
                                                    name="dr_name"
                                                    value={formData.dr_name}
                                                    onChange={handleChange}
                                                    required />
                                            </Col>
                                        </Form.Group>
                                        <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                            <Form.Label column sm="5" className='text-start'>
                                                Hospital Name : <span style={{ color: 'red' }}>*</span>
                                            </Form.Label>
                                            <Col sm="7">
                                                <Form.Control
                                                    type="text"
                                                    name="hospital_name"
                                                    value={formData.hospital_name}
                                                    onChange={handleChange}
                                                    required />
                                            </Col>
                                        </Form.Group>
                                        <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                            <Form.Label column sm="5" className='text-start'>
                                                Date & Time : <span style={{ color: 'red' }}>*</span>
                                            </Form.Label>
                                            <Col sm="7">
                                                <Form.Control
                                                    type="datetime-local"
                                                    name="date_time"
                                                    value={formData.date_time}
                                                    onChange={handleChange}
                                                    max="9999-12-31T24:60"
                                                    required />
                                            </Col>
                                        </Form.Group>
                                        <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                            <Form.Label column sm="5" className='text-start'>
                                                No. of Resident Checked : <span style={{ color: 'red' }}>*</span>
                                            </Form.Label>
                                            <Col sm="7">
                                                <Form.Control
                                                    type="text"
                                                    name="resident_examinite"
                                                    value={formData.resident_examinite}
                                                    onChange={handleChange}
                                                    required />
                                            </Col>
                                        </Form.Group>
                                        <Form.Group as={Row} className="mb-3 mt-3" controlId="formRescueName">
                                            <Form.Label column sm="5" className='text-start'>
                                                Report : <span style={{ color: 'red' }}>*</span>
                                            </Form.Label>
                                            <Col sm="7">
                                                <Form.Control
                                                    as="textarea"
                                                    name="report"
                                                    value={formData.report}
                                                    onChange={handleChange}
                                                    required />
                                            </Col>
                                        </Form.Group>
                                    </Col>

                                    {userType === "3" && (
                                        <div className="mt-3">
                                            <Button variant="success" className="m-1" type="submit">Submit</Button>
                                        </div>
                                    )}

                                </Row>
                            </Form>

                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Dr_visit
