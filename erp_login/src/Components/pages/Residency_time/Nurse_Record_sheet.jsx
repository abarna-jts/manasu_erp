import React from 'react';
import { Breadcrumb, Container, Row, Table, Button } from 'react-bootstrap';
import { Col, Form, InputGroup } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { useState, useEffect, useRef } from 'react';
import { DateRange } from 'react-date-range';
import axios from 'axios';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css
// import { addDays } from 'date-fns';
import { Alert } from "react-bootstrap";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Cookies from 'js-cookie';
import manasu_logo from '../Admission/Manasu-Logo.png';
import { useSelector, useDispatch } from 'react-redux';
import {
    setNurseRecordField, resetNurseRecord
} from '../../../store/nurseRecordSlice.js';

function Nurse_Record_sheet() {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [nurse_record, setNurseRecord] = useState([]);
    const [show1, setShow1] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [previewRequested, setPreviewRequested] = useState(false);
    const itemsPerPage = 10;


    const handleClose1 = () => setShow1(false);

    const userType = Cookies.get('usertype');

    const dispatch = useDispatch();

    const formData = useSelector((state) => state.nurse_record);

    const [formState, setFormData] = useState({
        admission_no: '',
        month: '',
        temperature: '',
        bp: '',
        pulse: '',
        weight: '',
        date: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        dispatch(setNurseRecordField({ field: name, value }));
    };

    const handleInputChange1 = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    }


    const apiRoute = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
    });

    //alert box values
    const [submissionMessage, setSubmissionMessage] = useState("");
    const [messageType, setMessageType] = useState(""); // 'success' or 'danger'


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.admission_no || formData.admission_no.trim() === '') {
            alert("Admission Number is required.");
            return;
        }

        const trimmedAdNo = formData.admission_no.trim();

        if (!/^\d{8,13}$/.test(trimmedAdNo)) {
            alert("Admission Number must be between 8 to 13 digits (numbers only).");
            return;
        }

        try {
            const response = await apiRoute.post("/residency/nurse_record", formData);
            console.log(response);

            if (response.data.message === "Nurse Record Sheet Created Successfully") {
                alert("Form submitted successfully!");
                dispatch(resetNurseRecord());
                // Reset the form
                setFormData({
                    id: '',
                    admission_no: '',
                    month: '',
                    temperature: '',
                    bp: '',
                    pulse: '',
                    weight: '',
                    date: ''
                });

                handleClose();
                getNurseRecords();
            } else {
                alert("Something Went Wrong to Create Form");
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

    const searchFilteredRescueDetails = nurse_record.filter((item) => {
        const searchTerm = searchQuery.toLowerCase();
        return (
            String(item.month).toLowerCase().includes(searchTerm) ||
            String(item.admission_no).toLowerCase().includes(searchTerm) ||
            String(item.rescue_name).toLowerCase().includes(searchTerm) ||
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
            const response = await apiRoute.put(`/residency/updateRecords/${id}`, formState);
            console.log(response.data);

            if (response.data.message === "Nurse Record updated successfully!") {
                alert("Form Updated Successfully");
                handleClose1(true);
                getNurseRecords();
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

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = searchFilteredRescueDetails.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(searchFilteredRescueDetails.length / itemsPerPage);
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const handleClearData = () => {
        dispatch(resetNurseRecord());
    }

    const ViewFormData = async (id) => {
        try {
            const response = await apiRoute.get(`/residency/getNurseRecordbyID/${id}`);
            const data = response.data;

            // Update form fields
            setFormData({
                id: data.id,
                currentMonth: data.month || '',
                date: data.date || '',
                temperature: data.temperature || '',
                bp: data.bp || '',
                pulse: data.pulse || '',
                weight: data.weight || ''
            });
            setPreviewRequested(true);
        } catch (error) {
            console.error("Error fetching form data:", error);
            alert("Admission Number not found");
        }
    }
    useEffect(() => {
        if (previewRequested) {
            // Delay slightly to allow DOM updates
            setTimeout(() => {
                generatePDF();
                setPreviewRequested(false);
            }, 100); // 100ms delay is often enough
        }
    }, [previewRequested]);

    const formRef = useRef();

    const generatePDF = async () => {
        const input = formRef.current;
        if (!input) {
            console.error("Form reference is not defined");
            return;
        }

        try {
            const canvas = await html2canvas(input, { scale: 2, useCORS: true });
            const imgData = canvas.toDataURL("image/png");

            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            const imgProps = pdf.getImageProperties(imgData);
            const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

            let heightLeft = imgHeight;
            let position = 0;

            while (heightLeft > 0) {
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
                heightLeft -= pdfHeight;
                if (heightLeft > 0) {
                    pdf.addPage();
                    position = -imgHeight + heightLeft;
                }
            }

            const pdfBlob = pdf.output('blob');
            const pdfUrl = URL.createObjectURL(pdfBlob);
            window.open(pdfUrl, '_blank');
        } catch (err) {
            console.error("Error generating PDF:", err);
            alert("Failed to generate PDF.");
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
                                {currentItems.length > 0 ? (
                                    currentItems.map((item, index) => (
                                        <>
                                            <tr key={item.id}>
                                                <td>{indexOfFirstItem + index + 1}</td>
                                                <td>{item.admission_no}</td>
                                                <td>{item.rescue_name}</td>
                                                <td>{item.month}</td>
                                                <td>{item.date}</td>
                                                <td>{item.temperature}</td>
                                                <td>{item.bp}</td>
                                                <td>{item.pulse}</td>
                                                <td>{item.weight}</td>
                                                <td>
                                                    <button className="btn btn-success icon_details" onClick={() => ViewFormData(item.id)}>
                                                        <i className="fas fa-eye"></i>
                                                    </button>
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
                        <div className="d-flex justify-content-end align-items-center mb-3 mx-3 mt-4">
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
            </Container>

            
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Enter your Record for this month</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="clear-btn d-flex align-items-end justify-content-end">
                        <Button variant="secondary" onClick={handleClearData}>Clear All</Button>
                    </div>

                    <Col md={12}>

                        <Form onSubmit={handleSubmit}>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="formAdmissionNo">
                                        <Form.Label>Admission Number <span style={{ color: 'red' }}>*</span></Form.Label>
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
                                        <Form.Label>Month <span style={{ color: 'red' }}>*</span></Form.Label>
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
                                        <Form.Label>Date <span style={{ color: 'red' }}>*</span></Form.Label>
                                        <Form.Control
                                            type="date"
                                            name="date"
                                            max="9999-12-31"
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
                                        <Form.Label>Temperature <span style={{ color: 'red' }}>*</span></Form.Label>
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
                                        <Form.Label>BP <span style={{ color: 'red' }}>*</span></Form.Label>
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
                                        <Form.Label>Pulse <span style={{ color: 'red' }}>*</span></Form.Label>
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
                                        <Form.Label>Weight <span style={{ color: 'red' }}>*</span></Form.Label>
                                        <Form.Control
                                            type="text"
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

            <div ref={formRef} style={{ position: "absolute", left: "-9999px", top: 0, background: "#fff", padding: "20px", width: "210mm" }}>
                <Row className="d-flex align-items-center justify-content-center mb-2">
                    <Col md={3} className='d-flex align-items-center pdf_logo'>
                        <img src={manasu_logo} className="pdf_logo" alt="" />

                    </Col>
                    <Col md={9}>
                        <h4 className="text-center">Nursing Record Sheet – Resident Health & Medications</h4>
                    </Col>
                </Row>
                <Col md={12}>
                    <Form>
                        <Form.Group as={Row} className="mb-3" controlId="formAdmissionNo">
                            <Form.Label column sm="4" className='text-start'>Month : </Form.Label>
                            <Col sm="6" className='text-start mr-5' style={{ border: "1px solid #ccc", padding: "8px", borderRadius: "5px", margin: "13px" }}>
                                {formState.currentMonth}
                            </Col>

                        </Form.Group>

                        <Form.Group as={Row} className="mb-3" controlId="formResidentName">
                            <Form.Label column sm="4" className='text-start'>Date : </Form.Label>
                            <Col sm="6" className='text-start mr-5' style={{ border: "1px solid #ccc", padding: "8px", borderRadius: "5px", margin: "13px" }}>
                                {formState.date}
                            </Col>

                        </Form.Group>

                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="4" className='text-start'>Temperature :</Form.Label>
                            <Col sm="6" className='text-start mr-5' style={{ border: "1px solid #ccc", padding: "8px", borderRadius: "5px", margin: "13px" }}>
                                {formState.temperature}
                            </Col>

                        </Form.Group>

                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="4" className='text-start'>BP :</Form.Label>
                            <Col sm="6" className='text-start mr-5' style={{ border: "1px solid #ccc", padding: "8px", borderRadius: "5px", margin: "13px" }}>
                                {formState.bp}
                            </Col>

                        </Form.Group>

                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="4" className='text-start'>Pulse :</Form.Label>
                            <Col sm="6" className='text-start mr-5' style={{ border: "1px solid #ccc", padding: "8px", borderRadius: "5px", margin: "13px" }}>
                                {formState.pulse}
                            </Col>

                        </Form.Group>

                        <Form.Group as={Row} className="mb-3">
                            <Form.Label column sm="4" className='text-start'>Weight :</Form.Label>
                            <Col sm="6" className='text-start mr-5' style={{ border: "1px solid #ccc", padding: "8px", borderRadius: "5px", margin: "13px" }}>
                                {formState.weight}
                            </Col>

                        </Form.Group>
                    </Form>
                </Col>
            </div>



            <Modal show={show1} onHide={handleClose1}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Nurse Record</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Col md={12}>
                        <Form>
                            <Row>

                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="formAdmissionNo">
                                        <Form.Label>Month <span style={{ color: 'red' }}>*</span></Form.Label>
                                        <Form.Select
                                            name="currentMonth"
                                            value={formState.currentMonth}
                                            onChange={(e) =>
                                                setFormData({ ...formState, currentMonth: e.target.value })
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
                                        <Form.Label>Date <span style={{ color: 'red' }}>*</span></Form.Label>
                                        <Form.Control
                                            type="date"
                                            name="date"
                                            max="9999-12-31"
                                            value={formState.date}
                                            onChange={handleInputChange1}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="formResidentName">
                                        <Form.Label>Temperature <span style={{ color: 'red' }}>*</span></Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="temperature"
                                            value={formState.temperature}
                                            onChange={handleInputChange1}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="formResidentName">
                                        <Form.Label>BP <span style={{ color: 'red' }}>*</span></Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="bp"
                                            value={formState.bp}
                                            onChange={handleInputChange1}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>


                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="formResidentName">
                                        <Form.Label>Pulse <span style={{ color: 'red' }}>*</span></Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="pulse"
                                            value={formState.pulse}
                                            onChange={handleInputChange1}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="formResidentName">
                                        <Form.Label>Weight <span style={{ color: 'red' }}>*</span></Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="weight"
                                            value={formState.weight}
                                            onChange={handleInputChange1}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>




                            <div className="btn_footer d-flex align-items-center justify-content-end">
                                <Button variant="success" type="button" className="m-1" onClick={(e) => handleUpdate(e, formState.id)}>
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
