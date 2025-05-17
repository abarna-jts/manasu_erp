import React from 'react'
import { Breadcrumb, Col, Container, Form, Row, Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function Edit_Annual_Report() {

    const { id } = useParams();

    

    const apiRoute = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
    });

    const [formData, setFormData] = useState({
        id:'',
        event_name: '',
        event_date: '',
        event_place: '',
        event_rescue_count: '',
        celebration_name: '',
        celebration_date: '',
        celebration_place: '',
        celebration_rescue_count: '',
        program_name: '',
        program_date: '',
        program_place: '',
        program_rescue_count: '',
        internship_duration: '',
        internship_date: '',
        internship_place: '',
        internship_rescue_count: '',
        staff_name: '',
        staff_date: '',
        staff_place: '',
        staff_rescue_count: ''
    })

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await apiRoute.get(`/formality/getAnnualReport/${id}`);
                const data = response.data;

                setFormData({
                    event_name: data.event_name || '',
                    event_date: data.event_date || '',
                    event_place: data.event_place || '',
                    event_rescue_count: data.event_rescue_count || '',
                    celebration_name: data.celebration_name || '',
                    celebration_date: data.celebration_date || '',
                    celebration_place: data.celebration_place || '',
                    celebration_rescue_count: data.celebration_rescue_count || '',
                    program_name: data.program_name || '',
                    program_date: data.program_date || '',
                    program_place: data.program_place || '',
                    program_rescue_count: data.program_rescue_count || '',
                    internship_duration: data.internship_duration || '',
                    internship_date: data.internship_date || '',
                    internship_place: data.internship_place || '',
                    internship_rescue_count: data.internship_rescue_count || '',
                    staff_name: data.staff_name || '',
                    staff_date: data.staff_date || '',
                    staff_place: data.staff_place || '',
                    staff_rescue_count: data.staff_rescue_count || ''

                });
            } catch (error) {
                console.error('Failed to fetch:', error);
            }
        };

        fetchDetails();
    }, [id]);

   const handleUpdate = async (e, id) => {
        e.preventDefault();
        console.log("formData:", formData);
        try {
            const response = await apiRoute.put(`/formality/updateAnnualReport/${id}`, formData);
            console.log(response.data);
            if (response.status === 200) {
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



    // const handleUpdate = async (e, id) => {
    //     e.preventDefault();
    //     try {
    //         const response = await apiRoute.put(`/formality/updateAnnualReport/${id}`, formData);
    //         console.log(response.data);
    //         if (response.status === 200) {
    //             alert('Form Updated successfully!');
    //             handleClose(true);
    //             window.location.reload();
    //         } else {
    //             alert('Error Updating form.');
    //         }
    //     } catch (error) {
    //         console.error('There was an error Updating the form:', error);
    //         alert('There was an error Updating the form.');
    //     }
    // };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (`0${date.getMonth() + 1}`).slice(-2); // Month is 0-indexed
        const day = (`0${date.getDate()}`).slice(-2);
        return `${year}-${month}-${day}`;
    };

    return (
        <>
            <div className="d-xl-flex align-items-center flex-wrap flex-md-nowrap text-start py-2">
                <div className="d-block mb-4 mb-xl-0 px-4 ">
                    <Breadcrumb className="d-none d-md-inline-block mb-0" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
                        <Breadcrumb.Item></Breadcrumb.Item>
                        <Breadcrumb.Item>Home</Breadcrumb.Item>
                    </Breadcrumb>
                    <h6 className="breadcrumb_title">Annual Report</h6>

                </div>

                <Col md={9} className="text-center">
                    <h4 className="section_title_1">Edit Annual Report Form</h4>
                </Col>
            </div>

            <Container>
                <Row >
                    <Col md={12}>
                        <Form>
                            <Row className='d-flex align-items-center justify-content-center'>
                                <Col md={9}>
                                    <h5 className="pdfsub_heading">Event Details:</h5>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group as={Row} className="mb-3">
                                                <Form.Label column sm="6" className='text-start'>
                                                    Event Name :
                                                </Form.Label>
                                                <Col sm="6">
                                                    <Form.Control type="text"
                                                        name="event_name"
                                                        value={formData.event_name}
                                                        onChange={handleInputChange}
                                                        required />
                                                </Col>
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group as={Row} className="mb-3">
                                                <Form.Label column sm="6" className='text-start'>
                                                    Event Date :
                                                </Form.Label>
                                                <Col sm="6">
                                                    <Form.Control type="date"
                                                        name="event_date"
                                                        value={formatDate(formData.event_date)}
                                                        onChange={handleInputChange}
                                                        required />
                                                </Col>
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md={6}>
                                            <Form.Group as={Row} className="mb-3">
                                                <Form.Label column sm="6" className='text-start'>
                                                    Event Place :
                                                </Form.Label>
                                                <Col sm="6">
                                                    <Form.Control type="text"
                                                        name="event_place"
                                                        value={formData.event_place}
                                                        onChange={handleInputChange}
                                                        required />
                                                </Col>
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group as={Row} className="mb-3">
                                                <Form.Label column sm="6" className='text-start'>
                                                    How many rescue attended the events?
                                                </Form.Label>
                                                <Col sm="6">
                                                    <Form.Control type="text"
                                                        name="event_rescue_count"
                                                        value={formData.event_rescue_count}
                                                        onChange={handleInputChange}
                                                        required />
                                                </Col>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <h5 className="pdfsub_heading">General Celebration Details:</h5>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group as={Row} className="mb-3">
                                                <Form.Label column sm="6" className='text-start'>
                                                    Celebration Name :
                                                </Form.Label>
                                                <Col sm="6">
                                                    <Form.Control type="text"
                                                        name="celebration_name"
                                                        value={formData.celebration_name}
                                                        onChange={handleInputChange}
                                                        required />
                                                </Col>
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group as={Row} className="mb-3">
                                                <Form.Label column sm="6" className='text-start'>
                                                    Celebration Date:
                                                </Form.Label>
                                                <Col sm="6">
                                                    <Form.Control type="date"
                                                        name="celebration_date"
                                                        value={formatDate(formData.celebration_date)}
                                                        onChange={handleInputChange}
                                                        required />
                                                </Col>
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md={6}>
                                            <Form.Group as={Row} className="mb-3">
                                                <Form.Label column sm="6" className='text-start'>
                                                    Conducted Place :
                                                </Form.Label>
                                                <Col sm="6">
                                                    <Form.Control type="text"
                                                        name="celebration_place"
                                                        value={formData.celebration_place}
                                                        onChange={handleInputChange}
                                                        required />
                                                </Col>
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group as={Row} className="mb-3">
                                                <Form.Label column sm="6" className='text-start'>
                                                    How many rescue attended the Celebration?
                                                </Form.Label>
                                                <Col sm="6">
                                                    <Form.Control type="text"
                                                        name="celebration_rescue_count"
                                                        value={formData.celebration_rescue_count}
                                                        onChange={handleInputChange}
                                                        required />
                                                </Col>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <h5 className="pdfsub_heading">Community Programs :</h5>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group as={Row} className="mb-3">
                                                <Form.Label column sm="6" className='text-start'>
                                                    Program Name :
                                                </Form.Label>
                                                <Col sm="6">
                                                    <Form.Control type="text"
                                                        name="program_name"
                                                        value={formData.program_name}
                                                        onChange={handleInputChange}
                                                        required />
                                                </Col>
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group as={Row} className="mb-3">
                                                <Form.Label column sm="6" className='text-start'>
                                                    Program Date:
                                                </Form.Label>
                                                <Col sm="6">
                                                    <Form.Control type="date"
                                                        name="program_date"
                                                        value={formatDate(formData.program_date)}
                                                        onChange={handleInputChange}
                                                        required />
                                                </Col>
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md={6}>
                                            <Form.Group as={Row} className="mb-3">
                                                <Form.Label column sm="6" className='text-start'>
                                                    Conducted Place :
                                                </Form.Label>
                                                <Col sm="6">
                                                    <Form.Control type="text"
                                                        name="program_place"
                                                        value={formData.program_place}
                                                        onChange={handleInputChange}
                                                        required />
                                                </Col>
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group as={Row} className="mb-3">
                                                <Form.Label column sm="6" className='text-start'>
                                                    How many rescue attended the Programs?
                                                </Form.Label>
                                                <Col sm="6">
                                                    <Form.Control type="text"
                                                        name="program_rescue_count"
                                                        value={formData.program_rescue_count}
                                                        onChange={handleInputChange}
                                                        required />
                                                </Col>
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <h5 className="pdfsub_heading">Internship Form :</h5>

                                    <Row>
                                        <Col md={6}>
                                            <Form.Group as={Row} className="mb-3">
                                                <Form.Label column sm="6" className='text-start'>
                                                    Internship duration :
                                                </Form.Label>
                                                <Col sm="6">
                                                    <Form.Control type="text"
                                                        name="internship_duration"
                                                        value={formData.internship_duration}
                                                        onChange={handleInputChange}
                                                        required />
                                                </Col>
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group as={Row} className="mb-3">
                                                <Form.Label column sm="6" className='text-start'>
                                                    Internship Date:
                                                </Form.Label>
                                                <Col sm="6">
                                                    <Form.Control type="date"
                                                        name="internship_date"
                                                        value={formatDate(formData.internship_date)}
                                                        onChange={handleInputChange}
                                                        required />
                                                </Col>
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md={6}>
                                            <Form.Group as={Row} className="mb-3">
                                                <Form.Label column sm="6" className='text-start'>
                                                    Conducted Place :
                                                </Form.Label>
                                                <Col sm="6">
                                                    <Form.Control type="text"
                                                        name="internship_place"
                                                        value={formData.internship_place}
                                                        onChange={handleInputChange}
                                                        required />
                                                </Col>
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group as={Row} className="mb-3">
                                                <Form.Label column sm="6" className='text-start'>
                                                    How many rescue attended the Internship?
                                                </Form.Label>
                                                <Col sm="6">
                                                    <Form.Control type="text"
                                                        name="internship_rescue_count"
                                                        value={formData.internship_rescue_count}
                                                        onChange={handleInputChange}
                                                        required />
                                                </Col>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <h5 className="pdfsub_heading">Staff Programs</h5>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group as={Row} className="mb-3">
                                                <Form.Label column sm="6" className='text-start'>
                                                    Staff Programs Name :
                                                </Form.Label>
                                                <Col sm="6">
                                                    <Form.Control type="text"
                                                        name="staff_name"
                                                        value={formData.staff_name}
                                                        onChange={handleInputChange}
                                                        required />
                                                </Col>
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group as={Row} className="mb-3">
                                                <Form.Label column sm="6" className='text-start'>
                                                    Staff Programs Date:
                                                </Form.Label>
                                                <Col sm="6">
                                                    <Form.Control type="date"
                                                        name="staff_date"
                                                        value={formatDate(formData.staff_date)}
                                                        onChange={handleInputChange}
                                                        required />
                                                </Col>
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md={6}>
                                            <Form.Group as={Row} className="mb-3">
                                                <Form.Label column sm="6" className='text-start'>
                                                    Conducted Place :
                                                </Form.Label>
                                                <Col sm="6">
                                                    <Form.Control type="text"
                                                        name="staff_place"
                                                        value={formData.staff_place}
                                                        onChange={handleInputChange}
                                                        required />
                                                </Col>
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group as={Row} className="mb-3">
                                                <Form.Label column sm="6" className='text-start'>
                                                    How many rescue attended the Staff Programs?
                                                </Form.Label>
                                                <Col sm="6">
                                                    <Form.Control type="text"
                                                        name="staff_rescue_count"
                                                        value={formData.staff_rescue_count}
                                                        onChange={handleInputChange}
                                                        required />
                                                </Col>
                                            </Form.Group>
                                        </Col>
                                    </Row>

                                    <Button type="submit" className='mb-5' onClick={(e) => handleUpdate(e, id)}>Update</Button>
                                </Col>


                            </Row>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Edit_Annual_Report
