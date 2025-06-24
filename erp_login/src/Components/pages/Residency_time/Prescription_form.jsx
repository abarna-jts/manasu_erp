import React from 'react';
import { Container, Row, Col, Breadcrumb, Form, InputGroup, Button, Table } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import { Alert } from "react-bootstrap";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useRef } from "react";
import Cookies from 'js-cookie';
import manasu_logo from '../Admission/Manasu-Logo.png';

function Prescription_form() {
    const [searchQuery, setSearchQuery] = useState("");
    const [prescription_details, setPrescriptionDetails] = useState([]);
    const [show, setShow] = useState(false);
    const [Editshow, setEditShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleEditClose = () => setEditShow(false);
    const [admission_no, setAdmissionNo] = useState('');
    const [previewRequested, setPreviewRequested] = useState(false);
    const [medicalType, setMedicalType] = useState('');

    const [formData, setFormData] = useState({
        admission_no: '',
        rescue_name: '',
        age: '',
        op_no: '',
        hospital_name: '',
        department: '',
        masterHealthCheckup: '',
        medical_type: '',
        instruction: '',
        advice: '',
        follow_up: '',

    });

    const [rows, setRows] = React.useState([
        {
            medicine: '',
            medicine_type: '',
            duration: '',
            intake: '',
            med_instruction: '',
            morning: '',
            afternoon: '',
            night: '',
        },
    ]);

    const [viewData, setViewData] = useState({
        id:'',
        admission_no: '',
        rescue_name: '',
        age: '',
        op_no: '',
        hospital_name: '',
        department: '',
        masterHealthCheckup: '',
        instruction: '',
        advice: '',
        follow_up: '',
        prescription_medicines: [],
    });


    const generalMedicines = [
        "AMLONG 5MG", "ENALAPRIL 2.5 MG", "GLYNASE 5MG", "METFORMIN 500 MG",
        "METOPROLOL 25 MG", "DOLO 650", "BRUFEN 400 MG", "EMESET 4 MG",
        "DULCOLAX 10 MG", "PARACETAMOL 150MG", "EMESET 2MG", "AVIL 2ML",
        "DEXA 4MG", "BETADINE OINTMENT 15GM", "BETAMETHASONE OINTMENT 30GM",
        "MOOV CREAM 50GM", "LIQUID PARAFFIN", "CANDID POWDER"
    ];

    const psychiatristMedicines = [
        "AMLONG 5 MG", "B COMPLEX", "CALCIUM", "CARBAMAZEPINE 200 MG", "CHLORPROMAZINE 100 MG",
        "CLOAZEPAM 0.5MG", "CLOZAPINE 50MG", "DIAZEPAM 5MG", "ENALAPRIL 2.5MG",
        "FLUOXETINE 20 MG", "FST", "GLIPIZIDE 5 MG", "HALOPERIDOL 1.5 MG", "HALOPERIDOL 5 MG",
        "LORAZEPAM 2 MG", "METFORMIN 500 MG", "METOPROLOL 25MG", "NITRAZEPAM 5MG",
        "OLANZIPINE 5MG", "OMEZ 20 MG", "PANDAP 40GM", "PHENITION SODIUM 100 MG",
        "PROPANOLOL 40 MG", "RANTAC 150 MG", "RISPERIDONE 2MG", "SODIUM VALPROATE 200MG",
        "TRIHEXYPHENIDYL 2MG", "VITAMIN C"
    ];


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleInputChange1 = (e) => {
        const { name, value } = e.target;
        setViewData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };



    const handleAdmissionChange = (e) => {
        setAdmissionNo(e.target.value);
    }
    const handleAddRow = () => {
        setRows(prevRows => [...prevRows, {
            medicine: '',
            medicine_type: '',
            duration: '',
            intake: '',
            med_instruction: '',
            morning: '',
            afternoon: '',
            night: '',
        }]);
    };

    const handleAddRow1 = () => {
        const newRow = {
            prescription_id: viewData.prescription_id, // Auto assign existing prescription ID
            medicine: '',
            medicine_type: '',
            duration: '',
            intake: '',
            med_instruction: '',
            morning: '',
            afternoon: '',
            night: '',
        };

        setViewData((prevData) => ({
            ...prevData,
            prescription_medicines: [...prevData.prescription_medicines, newRow],
        }));
    };



    const userType = Cookies.get('usertype');

    const handleRemoveRow1 = (index) => {
        setViewData(prev => {
            const newMedicines = [...prev.prescription_medicines];
            newMedicines.splice(index, 1); // remove the item at the given index
            return { ...prev, prescription_medicines: newMedicines };
        });
    };

    const handleRowChange1 = (index, e) => {
        const { name, value } = e.target;

        if (name === 'id') return; // prevent changing ID

        const updatedMedicines = [...viewData.prescription_medicines];
        updatedMedicines[index] = {
            ...updatedMedicines[index],
            [name]: value,
        };

        setViewData((prev) => ({
            ...prev,
            prescription_medicines: updatedMedicines,
        }));
    };




    const handleRemoveRow = (index) => {
        setRows(prevRows => prevRows.filter((_, i) => i !== index));
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
            const fetchedData = response.data.data[0];

            // Preserve form values for fields user may have already filled
            setFormData(prevData => ({
                ...prevData,
                rescue_name: fetchedData.rescue_name ?? prevData.rescue_name,
                age: fetchedData.age ?? prevData.age,

            }));
        } catch (error) {
            console.error('Error fetching data', error);
            alert("Admission Number Not found");
        }
    };


    //alert box values
    const [submissionMessage, setSubmissionMessage] = useState("");
    const [messageType, setMessageType] = useState(""); // 'success' or 'danger'

    const filteredRescueDetails = Array.isArray(prescription_details)
        ? prescription_details.filter((item) => {
            const searchTerm = searchQuery.toLowerCase();
            return (
                String(item.admission_no).toLowerCase().includes(searchTerm) ||
                String(item.resident_name).toLowerCase().includes(searchTerm) ||
                String(item.follow_up).toLowerCase().includes(searchTerm)
            );
        })
        : [];


    const handlePrescriptionShow = () => {
        window.location.reload();
    }

    const handleCheckChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleRowChange = (index, e) => {
        const updatedRows = [...rows];
        updatedRows[index][e.target.name] = e.target.value;
        setRows(updatedRows);
    };

    const medicineOptions = medicalType === 'General' ? generalMedicines : psychiatristMedicines;

    const handleSubmit = async (e) => {
        e.preventDefault();

        const admissionNumber = admission_no || formData.admission_no;

        if (!admissionNumber || admissionNumber.trim() === '') {
            setSubmissionMessage("Admission number is required.");
            setMessageType("danger");
            return;
        }

        const todayDate = new Date().toISOString().split('T')[0]; // e.g., "2025-05-23"

        // Construct data object to send
        const data = {
            ...formData,
            admission_no: admissionNumber.trim(),
            current_date: todayDate,
            prescription_medicines: rows,  // ← include your dynamic table data
        };

        console.log("Submitting data:", data);

        try {
            const res = await apiRoute.post('/residency/createPrescription', data);
            console.log(res);
            alert("Prescription and Medicine Summary Saved Successfully");

            if (res.data.message === "Prescription and Medicine Summary Saved Successfully") {
                setSubmissionMessage("Form submitted successfully!");
                setMessageType("success");
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


    //fetching prescription details
    const getPrescriptionDetails = async () => {
        try {
            const response = await apiRoute.get('/residency/getPrescription');
            console.log("API response:", response.data);
            setPrescriptionDetails(response.data.data);
        } catch (error) {
            console.error('Error fetching Student:', error);
        }
    };
    useEffect(() => {
        getPrescriptionDetails();
    }, []);

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        if (isNaN(date)) return ""; // Handle invalid dates
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    };

    const fetchPrescriptionData = async (id) => {
        try {
            const response = await apiRoute.get(`/residency/getPrescription/${id}`);
            const data = response.data;

            const meds = data.prescription?.prescription_medicines;

            if (!meds || meds.length === 0) {
                console.warn("No prescription medicines found.");
                setViewData({ ...data.prescription, prescription_medicines: [] });
                return;
            }

            // Check if data is row-wise (array of objects)
            if (typeof meds[0].medicine === "string" && !meds[0].medicine.startsWith("[")) {
                // Plain strings like "CALCIUM"
                setViewData({
                    ...data.prescription,
                    prescription_medicines: meds,
                });
            } else {
                // Data is column-wise JSON stringified
                const medData = meds[0];

                const medicines = JSON.parse(medData.medicine || "[]");
                const types = JSON.parse(medData.medicine_type || "[]");
                const durations = JSON.parse(medData.duration || "[]");
                const instructions = JSON.parse(medData.med_instruction || "[]");
                const mornings = JSON.parse(medData.morning || "[]");
                const afternoons = JSON.parse(medData.afternoon || "[]");
                const nights = JSON.parse(medData.night || "[]");
                const intakes = JSON.parse(medData.intake || "[]");

                setViewData({
                    ...data.prescription,
                    prescription_medicines: medicines.map((_, i) => ({
                        medicine: medicines[i],
                        medicine_type: types[i],
                        duration: durations[i],
                        med_instruction: instructions[i],
                        morning: mornings[i],
                        afternoon: afternoons[i],
                        night: nights[i],
                        intake: intakes[i],
                    })),
                });
            }

            setPreviewRequested(true);
        } catch (err) {
            console.error("Fetch error:", err);
        }
    };



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

        const canvas = await html2canvas(input, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        const pdfBlob = pdf.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl, '_blank');
    };

    const handleEditform = async (id) => {
        try {
            const response = await apiRoute.get(`/residency/getPrescription/${id}`);
            const data = response.data.prescription;
            const meds = data.prescription_medicines;

            // Helper function to safely parse JSON strings
            const safeParse = (value) => {
                try {
                    return JSON.parse(value);
                } catch {
                    return value;
                }
            };

            if (
                Array.isArray(meds) &&
                meds.length > 0 &&
                typeof meds[0].medicine === "string" &&
                !meds[0].medicine.trim().startsWith("[")
            ) {
                // ✅ Row-wise data format (already good for rendering)
                console.log("Detected row-wise medicine format.");
                setViewData({
                    ...data,
                    prescription_medicines: meds || [],
                });
            } else if (Array.isArray(meds) && meds.length > 0) {
                // 🔄 Column-wise format — parse each field
                console.log("Detected column-wise medicine format.");
                const medData = meds[0]; // Only one row where all fields are arrays

                const medicines = safeParse(medData.medicine);
                const types = safeParse(medData.medicine_type);
                const durations = safeParse(medData.duration);
                const instructions = safeParse(medData.med_instruction);
                const mornings = safeParse(medData.morning);
                const afternoons = safeParse(medData.afternoon);
                const nights = safeParse(medData.night);
                const intakes = safeParse(medData.intake);

                const normalizedMeds = medicines.map((_, i) => ({
                    medicine: medicines[i] || '',
                    medicine_type: types[i] || '',
                    duration: durations[i] || '',
                    med_instruction: instructions[i] || '',
                    morning: mornings[i] || '',
                    afternoon: afternoons[i] || '',
                    night: nights[i] || '',
                    intake: intakes[i] || '',
                }));

                setViewData({
                    ...data,
                    prescription_medicines: normalizedMeds,
                });
            } else {
                // ❌ No prescription data
                console.warn("No valid prescription_medicines data.");
                setViewData({
                    ...data,
                    prescription_medicines: [],
                });
            }

            setEditShow(true); // Show the modal or section
        } catch (error) {
            console.error('Error fetching prescription:', error);
        }
    };


   const handleUpdate = async (e) => {
    e.preventDefault();

    try {
        const response = await apiRoute.put(
            `/residency/updatePrescription/${viewData.id}`, 
            viewData
        );

        if (response.status === 200) {
            alert("Updated successfully!");
            // Optional: refresh data or redirect
        } else {
            alert(`Update failed: ${response.data.message}`);
        }
    } catch (error) {
        console.error("Axios update error:", error);
        if (error.response) {
            alert(`Error: ${error.response.data.message}`);
        } else {
            alert("Network or server error occurred.");
        }
    }
};





    const handleMedicalTypeChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        setMedicalType(e.target.value);
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
                        <h3 className="section_title">Nurse Prescription Form</h3>
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
                                onClick={handleShow}
                            >Add Prescription</Button>
                        )}
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
                                                <td>{item.prescription_id}</td>
                                                <td>{item.rescue_name}</td>
                                                <td>{item.admission_no}</td>
                                                <td>{item.op_no}</td>
                                                <td>{formatDate(item.created_date)}</td>
                                                <td>{item.masterHealthCheckup}</td>

                                                <td>
                                                    <button className="btn btn-success icon_details" onClick={() => {
                                                        fetchPrescriptionData(item.id);
                                                    }}>
                                                        <i className="fas fa-eye"></i>
                                                    </button>
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
                                <h6 className='mb-0 mx-3'>
                                    Date: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </h6>
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
                        <Row className='d-flex align-items-center justify-content-start'>
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
                                            checked={formData.masterHealthCheckup === 'yes'}
                                            onChange={handleCheckChange}
                                        />
                                        <Form.Check
                                            type="radio"
                                            label="No"
                                            name="masterHealthCheckup"
                                            value="no"
                                            checked={formData.masterHealthCheckup === 'no'}
                                            onChange={handleCheckChange}
                                        />
                                    </Col>
                                </Form.Group>

                            </Col>
                            <Col md={4}>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="6" style={{ paddingRight: "5px" }}>
                                        Medicine Type:
                                    </Form.Label>
                                    <Col sm="6">
                                        <Form.Select
                                            name="medical_type"
                                            value={formData.medical_type ?? ''}
                                            onChange={handleMedicalTypeChange}
                                            required
                                        >
                                            <option value="" disabled hidden>Select Type</option>
                                            <option value="General">General</option>
                                            <option value="Psychiatrist">Psychiatrist</option>
                                        </Form.Select>
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
                                                <select
                                                    className="form-select"
                                                    name="medicine"
                                                    value={rows[i].medicine}
                                                    onChange={(e) => handleRowChange(i, e)}
                                                    required
                                                    style={{ width: '45%' }}
                                                >
                                                    <option value="" disabled hidden>Select Medicine</option>
                                                    {medicineOptions.map((med, idx) => (
                                                        <option key={idx} value={med}>{med}</option>
                                                    ))}
                                                </select>
                                                <select
                                                    className="form-select"
                                                    name="medicine_type"
                                                    value={rows[i].medicine_type}
                                                    onChange={(e) => handleRowChange(i, e)}
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
                                                value={rows[i].duration}
                                                onChange={(e) => handleRowChange(i, e)}
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
                                                value={rows[i].intake}
                                                onChange={(e) => handleRowChange(i, e)}
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
                                                value={rows[i].med_instruction}
                                                onChange={(e) => handleRowChange(i, e)}
                                                rows="1"
                                                className="form-control"

                                            ></textarea>
                                        </td>

                                        <td>
                                            <input
                                                type="text"
                                                name="morning"
                                                value={rows[i].morning}
                                                onChange={(e) => handleRowChange(i, e)}
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
                                                value={rows[i].afternoon}
                                                onChange={(e) => handleRowChange(i, e)} // ✅
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
                                                value={rows[i].night}
                                                onChange={(e) => handleRowChange(i, e)} // ✅
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

            <div ref={formRef} style={{ position: "absolute", left: "-9999px", top: 0, background: "#fff", padding: "20px", width: "210mm" }}>
                <Row className="d-flex align-items-center justify-content-center mb-2">
                    <Col md={3} className='d-flex align-items-center pdf_logo'>
                        <img src={manasu_logo} className="pdf_logo" alt="" />
                        {/* <div className="logo_text">
                                            <h4><span>MANASU</span> <br />Mental Health Charity Home <br />Chennai,</h4>
                                        </div> */}
                    </Col>
                    <Col md={9}>
                        <h4 className="text-center">Prescription Medicine Details</h4>
                    </Col>
                </Row>
                <Container>
                    <Row>
                        <Col md={12}>
                            <Form>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group as={Row} className="mb-3">
                                            <Form.Label column sm="5">Admission No.:</Form.Label>
                                            <Col sm="7">
                                                <Form.Control readOnly value={viewData.admission_no} />
                                            </Col>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group as={Row} className="mb-3">
                                            <Form.Label column sm="5">Resident's Name:</Form.Label>
                                            <Col sm="7">
                                                <Form.Control readOnly value={viewData.rescue_name} />
                                            </Col>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group as={Row} className="mb-3">
                                            <Form.Label column sm="5">Prescription ID:</Form.Label>
                                            <Col sm="7">
                                                <Form.Control readOnly value={viewData.prescription_medicines[0]?.prescription_id || ''} />
                                            </Col>
                                        </Form.Group>
                                    </Col>

                                    <Col md={6}>
                                        <Form.Group as={Row} className="mb-3">
                                            <Form.Label column sm="5">Age:</Form.Label>
                                            <Col sm="7">
                                                <Form.Control readOnly value={viewData.age} />
                                            </Col>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group as={Row} className="mb-3">
                                            <Form.Label column sm="5">Out Patient No.:</Form.Label>
                                            <Col sm="7">
                                                <Form.Control readOnly value={viewData.op_no} />
                                            </Col>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group as={Row} className="mb-3">
                                            <Form.Label column sm="5">Hospital Name:</Form.Label>
                                            <Col sm="7">
                                                <Form.Control readOnly value={viewData.hospital_name} />
                                            </Col>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group as={Row} className="mb-3">
                                            <Form.Label column sm="5">Department:</Form.Label>
                                            <Col sm="7">
                                                <Form.Control readOnly value={viewData.department} />
                                            </Col>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group as={Row} className="mb-3">
                                            <Form.Label column sm="5">Date:</Form.Label>
                                            <Col sm="7">
                                                <Form.Control readOnly value={formatDate(viewData.created_date)} />
                                            </Col>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group as={Row} className="mb-3">
                                            <Form.Label column sm="5">Instruction:</Form.Label>
                                            <Col sm="7">
                                                <Form.Control as="textarea" rows={1} readOnly value={viewData.instruction} />
                                            </Col>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group as={Row} className="mb-3">
                                            <Form.Label column sm="5">Advice:</Form.Label>
                                            <Col sm="7">
                                                <Form.Control as="textarea" rows={1} readOnly value={viewData.advice} />
                                            </Col>
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group as={Row} className="mb-3">
                                            <Form.Label column sm="5">Follow Up:</Form.Label>
                                            <Col sm="7">
                                                <Form.Control as="textarea" rows={1} readOnly value={viewData.follow_up} />
                                            </Col>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <table className="table table-bordered mt-3">
                                    <thead>
                                        <tr>
                                            <th rowSpan="2">Drug Name</th>
                                            <th rowSpan="2">Units</th>
                                            <th rowSpan="2">Days</th>
                                            <th rowSpan="2">Instruction</th>
                                            <th colSpan="3">Frequency</th>
                                            <th rowSpan="2">Intake</th>
                                        </tr>
                                        <tr>
                                            <th>MNG</th>
                                            <th>AFN</th>
                                            <th>NIGHT</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {viewData.prescription_medicines.map((med, index) => (
                                            <tr key={index}>
                                                <td>{med.medicine}</td>
                                                <td>{med.medicine_type}</td>
                                                <td>{med.duration}</td>
                                                <td>{med.med_instruction}</td>
                                                <td>{med.morning}</td>
                                                <td>{med.afternoon}</td>
                                                <td>{med.night}</td>
                                                <td>{med.intake}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </div>

            <Modal show={Editshow} onHide={handleEditClose} size="lg" aria-labelledby="contained-modal-title-vcenter" centered className="prescription_modal">
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        <div className="header_section d-flex justify-content-center align-items-center">
                            <Button className="btn btn-success" onClick={handlePrescriptionShow}>Prescription List</Button>
                            <div className="date_class">
                                <h6 className='mb-0 mx-3'>
                                    Date: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </h6>
                            </div>

                        </div>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row className='d-flex align-items-center justify-content-center'>
                            <Col md={4}>
                                <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                                    <Form.Label column sm="5" style={{ paddingRight: "5px" }}>
                                        Admission No:
                                    </Form.Label>
                                    <Col sm="7">
                                        <Form.Control type='number'
                                            name='admission_no'
                                            value={viewData.admission_no}
                                            onChange={handleInputChange1}
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
                                            value={viewData.rescue_name}
                                            onChange={handleInputChange1}
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
                                            value={viewData.age}
                                            onChange={handleInputChange1}
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
                                            value={viewData.op_no}
                                            onChange={handleInputChange1}
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
                                            value={viewData.hospital_name}
                                            onChange={handleInputChange1}
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
                                            value={viewData.department}
                                            onChange={handleInputChange1}
                                            required />
                                    </Col>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className='d-flex align-items-center justify-content-start'>
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
                                            checked={viewData.masterHealthCheckup === 'yes'}
                                            onChange={handleInputChange1}
                                        />
                                        <Form.Check
                                            type="radio"
                                            label="No"
                                            name="masterHealthCheckup"
                                            value="no"
                                            checked={viewData.masterHealthCheckup === 'no'}
                                            onChange={handleInputChange1}
                                        />
                                    </Col>
                                </Form.Group>

                            </Col>
                            <Col md={4}>
                                <Form.Group as={Row} className="mb-3">
                                    <Form.Label column sm="6" style={{ paddingRight: "5px" }}>
                                        Medicine Type:
                                    </Form.Label>
                                    <Col sm="6">
                                        <Form.Select
                                            name="medical_type"
                                            value={viewData.medical_type}
                                            onChange={handleMedicalTypeChange}
                                            required
                                        >
                                            <option value="" disabled hidden>Select Type</option>
                                            <option value="General">General</option>
                                            <option value="Psychiatrist">Psychiatrist</option>
                                        </Form.Select>
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
                                            value={viewData.instruction}
                                            onChange={handleInputChange1}
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
                                            value={viewData.advice}
                                            onChange={handleInputChange1}
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
                                            value={viewData.follow_up}
                                            onChange={handleInputChange1}
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
                                {viewData.prescription_medicines.map((med, index) => (
                                    <tr key={med.id}>

                                        <td>
                                            <button type="button" className="btn btn-sm btn-primary add" onClick={handleAddRow1}>+</button>{' '}
                                            <button type="button" className="btn btn-sm btn-danger remove" onClick={() => handleRemoveRow1(index)}>-</button>
                                        </td>

                                        <td>
                                            <div className="input-group mb-2" style={{ width: 'auto', margin: 'auto' }}>
                                                <select
                                                    className="form-select"
                                                    name="medicine"
                                                    value={med.medicine}
                                                    onChange={(e) => handleRowChange1(index, e)}
                                                    required
                                                    style={{ width: '45%' }}
                                                >
                                                    <option value="" disabled hidden>Select Medicine</option>
                                                    {medicineOptions.map((med, idx) => (
                                                        <option key={idx} value={med}>{med}</option>
                                                    ))}
                                                </select>
                                                <select
                                                    className="form-select"
                                                    name="medicine_type"
                                                    value={med.medicine_type}
                                                    onChange={(e) => handleRowChange1(index, e)}
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
                                                value={med.duration}
                                                onChange={(e) => handleRowChange1(index, e)}
                                                required
                                                placeholder="Duration"
                                                className="form-control"
                                            />
                                        </td>

                                        <td>
                                            <select
                                                className="form-select"
                                                name="intake"
                                                value={med.intake}
                                                onChange={(e) => handleRowChange1(index, e)}
                                                required
                                                style={{ width: '140px', margin: 'auto' }}
                                            >
                                                <option value="" disabled hidden>Select Intake</option>
                                                <option value="Before Food">Before Food</option>
                                                <option value="After Food">After Food</option>
                                            </select>
                                        </td>

                                        <td>
                                            <textarea
                                                name="med_instruction"
                                                placeholder="Instruction"
                                                value={med.med_instruction}
                                                onChange={(e) => handleRowChange1(index, e)}
                                                rows="1"
                                                className="form-control"
                                            ></textarea>
                                        </td>

                                        <td>
                                            <input
                                                type="text"
                                                name="morning"
                                                value={med.morning}
                                                onChange={(e) => handleRowChange1(index, e)}
                                                placeholder="Morning"
                                                className="form-control"
                                            />
                                        </td>

                                        <td>
                                            <input
                                                type="text"
                                                name="afternoon"
                                                value={med.afternoon}
                                                onChange={(e) => handleRowChange1(index, e)}
                                                placeholder="Afternoon"
                                                className="form-control"
                                            />
                                        </td>

                                        <td>
                                            <input
                                                type="text"
                                                name="night"
                                                value={med.night}
                                                onChange={(e) => handleRowChange1(index, e)}
                                                placeholder="Night"
                                                className="form-control"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <Col md={12} className="mt-3 d-flex justify-content-center align-items-center">
                            <Button variant="btn btn-primary" type='submit' onClick={handleUpdate}>Update</Button>
                        </Col>
                    </Form>

                </Modal.Body>
            </Modal>

        </div>


    )
}

export default Prescription_form
