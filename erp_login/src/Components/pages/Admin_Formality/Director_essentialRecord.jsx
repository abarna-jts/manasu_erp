import React from 'react';
import { Breadcrumb, Container, Row, Col, Form, InputGroup, Button, Table } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useRef } from "react";
import Modal from 'react-bootstrap/Modal';
import { Alert } from "react-bootstrap";
import manasu_logo from '../Admission/Manasu-Logo.png';
import { id } from 'date-fns/locale';

function Director_essentialRecord() {
    const [show, setShow] = useState(false);
    const [record_details, setRecordDetail] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [previewRequested, setPreviewRequested] = useState(false);

    //alert box values
    const [submissionMessage, setSubmissionMessage] = useState("");
    const [messageType, setMessageType] = useState(""); // 'success' or 'danger'

    const handleClose = () => setShow(false);

    const filteredRescueDetails = record_details.filter((item) => {
        const searchTerm = searchQuery.toLowerCase();
        return (
            String(item.rescue_name).toLowerCase().includes(searchTerm) ||
            String(item.admission_no).toLowerCase().includes(searchTerm) ||
            String(item.aadhar_card).toLowerCase().includes(searchTerm) ||
            String(item.udid_no).toLowerCase().includes(searchTerm) ||
            String(item.form_7).toLowerCase().includes(searchTerm) ||
            String(item.account_no).toLowerCase().includes(searchTerm)
        );
    });

    const apiRoute = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
    });

    useEffect(() => {
        const fetchEssentialRecord = async () => {
            try {
                const response = await apiRoute.get('/formality/getAllDocument');
                setRecordDetail(response.data.data); // Should be an array
            } catch (error) {
                console.error("Error fetching annual report:", error);
            }
        };

        fetchEssentialRecord();
    }, []);

    const [formData, setFormData] = useState({
        admission_no: '',
        rescue_name: '',
        aadhar_card: '',
        udid_no: '',
        disability_no: '',
        voter_id: '',
        form_7: '',
        bank_name: '',
        account_no: '',
        ifsc_code: '',
        insurance_provider: '',
        policy_no: '',
        validity_period: '',
        other_gvt_scheme: '',
        any_other: ''
    })

    const [files, setFiles] = useState({
        bank_passbook: null,
        form7_attach: null,
    });

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFiles(prev => ({
            ...prev,
            [name]: files[0]
        }));
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const ViewFormData = async (id) => {
        try {
            const response = await apiRoute.get(`/formality/getEssentialRecordshow/${id}`);
            const data = response.data;

            setFormData((formData) => ({
                ...formData,
                admission_no: data.admission_no || '',
                rescue_name: data.rescue_name || '',
                aadhar_card: data.aadhar_card || '',
                udid_no: data.udid_no || '',
                disability_no: data.disability_no || '',
                voter_id: data.voter_id || '',
                form_7: data.form_7 || '',
                bank_name: data.bank_name || '',
                account_no: data.account_no || '',
                ifsc_code: data.ifsc_code || '',
                insurance_provider: data.insurance_provider || '',
                policy_no: data.policy_no || '',
                validity_period: data.validity_period || '',
                other_gvt_scheme: data.other_gvt_scheme || '',
                any_other: data.any_other || '',
            }));

            const passbookPath = data.bank_passbook ? `https://www.pahrultours.com/app2/${data.bank_passbook}` : null;
            const Form7Path = data.form7_attach ? `https://www.pahrultours.com/app2/${data.form7_attach}` : null;

            console.log("bank_passbook path:", data.bank_passbook);
            console.log("Full URL:", passbookPath);

            console.log("Form 7 path:", data.form7_attach);
            console.log("Full URL:", Form7Path);

            // Set files state
            setFiles((files) => ({
                ...files,
                bank_passbook: passbookPath,
                form7_attach: Form7Path
            }));

            setPreviewRequested(true); // trigger the effect after state updates
        } catch (error) {
            console.error("Error fetching form data:", error);
            alert("Admission Number not found");
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

    const handleShow = async (id) => {
        try {
            const response = await apiRoute.get(`/formality/getEssentialRecordshow/${id}`);
            const data = response.data;

            setFormData((formData) => ({
                ...formData,
                admission_no: data.admission_no || '',
                rescue_name: data.rescue_name || '',
                aadhar_card: data.aadhar_card || '',
                udid_no: data.udid_no || '',
                disability_no: data.disability_no || '',
                voter_id: data.voter_id || '',
                form_7: data.form_7 || '',
                bank_name: data.bank_name || '',
                account_no: data.account_no || '',
                ifsc_code: data.ifsc_code || '',
                insurance_provider: data.insurance_provider || '',
                policy_no: data.policy_no || '',
                validity_period: data.validity_period || '',
                other_gvt_scheme: data.other_gvt_scheme || '',
                any_other: data.any_other || '',
            }));


            // Handle old and new photo paths correctly
            const bankPassbookPath = data.bank_passbook ? `https://www.pahrultours.com/app2/${data.bank_passbook}` : null;
            const Form7Path = data.form7_attach ? `https://www.pahrultours.com/app2/${data.form7_attach}` : null;


            // Set files state
            setFiles((files) => ({
                ...files,
                bank_passbook: bankPassbookPath,
                form7_attach: Form7Path,
            }));


            setShow(true);
        } catch (error) {
            console.error("Error fetching form data:", error);
            alert("Admission Number not found");
        }
    };

    const handleUpdate = async (e, admission_no) => {
        e.preventDefault();

        const data = new FormData();
        data.append('rescue_name', formData.rescue_name);
        data.append('aadhar_card', formData.aadhar_card);
        data.append('udid_no', formData.udid_no);
        data.append('disability_no', formData.disability_no);
        data.append('voter_id', formData.voter_id);
        data.append('form_7', formData.form_7);
        data.append('form7_attach', files.form7_attach);
        data.append('bank_name', formData.bank_name);
        data.append('account_no', formData.account_no);
        data.append('ifsc_code', formData.ifsc_code);
        data.append('bank_passbook', files.bank_passbook);
        data.append('insurance_provider', formData.insurance_provider);
        data.append('policy_no', formData.policy_no);
        data.append('validity_period', formData.validity_period);
        data.append('other_gvt_scheme', formData.other_gvt_scheme);
        data.append('any_other', formData.any_other);

        try {
            const res = await apiRoute.put(`/formality/updateEssentialRecords/${admission_no}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert('Updated successfully!');
            window.location.reload();
        } catch (err) {
            console.error(err);
            alert('Update failed.');
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
                            <Breadcrumb.Item active>Admin Formality</Breadcrumb.Item>
                        </Breadcrumb>
                        <h6 className="breadcrumb_title">Records</h6>
                    </Col>
                    <Col md={8} className="text-center">
                        <h3 className="section_title">Resident Document Information Form</h3>
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
                <Row>
                    <Col md={12}>
                        <Table responsive="sm">

                            <thead>
                                <tr>
                                    <th>S.No</th>
                                    <th>Admission No</th>
                                    <th>Rescue Name</th>
                                    <th>Aadhar Card</th>
                                    <th>UDID No</th>
                                    <th>Disability No</th>
                                    <th>Form 7</th>
                                    <th>Bank Account No</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRescueDetails.length > 0 ? (
                                    filteredRescueDetails.map((item, index) => (
                                        <tr key={item.id}>
                                            <td>{index + 1}</td>
                                            <td>{item.admission_no}</td>
                                            <td>{item.rescue_name || "null"}</td>
                                            <td>{item.aadhar_card || "null"}</td>
                                            <td>{item.udid_no || "null"}</td>
                                            <td>{item.disability_no || "null"}</td>
                                            <td>{item.form_7 || "null"}</td>
                                            <td>{item.account_no || "null"}</td>
                                            <td>
                                                <button className="btn btn-success icon_details"
                                                    onClick={() => {
                                                        ViewFormData(item.id);
                                                    }}
                                                >
                                                    <i className="fas fa-eye"></i>
                                                </button>
                                                <button className="btn btn-primary icon_details"
                                                    onClick={() => {
                                                        handleShow(item.id);
                                                    }}
                                                ><i className="fas fa-edit"></i> </button>

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

            <div ref={formRef} style={{ position: "absolute", left: "-9999px", top: 0, background: "#fff", padding: "20px", width: "210mm" }}>
                <Row className="d-flex align-items-center justify-content-center mb-2">
                    <Col md={3} className='d-flex align-items-center pdf_logo'>
                        <img src={manasu_logo} className="pdf_logo" alt="" />
                        {/* <div className="logo_text">
                                        <h4><span>MANASU</span> <br />Mental Health Charity Home <br />Chennai,</h4>
                                    </div> */}
                    </Col>
                    <Col md={9}>
                        <h4 className="text-center">4. Resident Document Information Form</h4>
                    </Col>
                </Row>

                <Form className='media_consent'>
                    <Row>

                        <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                            <Form.Label column sm="4" className='text-start'>
                                Name :
                            </Form.Label>
                            <Col sm="8" className='d-flex align-items-center'>
                                <Form.Control
                                    type="text"
                                    name="rescue_name"
                                    value={formData.rescue_name}
                                    onChange={handleInputChange}
                                    required />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className="mb-3 text-start">
                            <Form.Label column sm="4">
                                ID Cards :
                            </Form.Label>
                            <Col sm="8">
                                {/* Aadhar Card */}
                                <Form.Label className="mb-1">Aadhaar Card Number</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="aadhar_card"
                                    value={formData.aadhar_card}
                                    onChange={handleInputChange}
                                    className="mb-2"
                                />

                                {/* UDID */}
                                <Form.Label className="mb-1">UDID Card Number (Unique Disability ID)</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="udid_no"
                                    value={formData.udid_no}
                                    onChange={handleInputChange}
                                    className="mb-2"
                                />

                                {/* Disability Passport */}
                                <Form.Label className="mb-1">Disability Certificate No. & Issuing Authority</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="disability_no"
                                    value={formData.disability_no}
                                    onChange={handleInputChange}
                                    accept=".pdf,.jpg,.jpeg,.png"
                                />

                                {/* Voter ID */}
                                <Form.Label className="mb-1">Voter ID</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="voter_id"
                                    value={formData.voter_id}
                                    onChange={handleInputChange}
                                    className="mb-2"
                                />

                                {/* Form 7 */}
                                <Form.Label className="mb-1">Form 7</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="form_7"
                                    value={formData.form_7}
                                    onChange={handleInputChange}
                                    className="mb-2"
                                />

                                <Form.Label className="mb-1">Form 7 Attachment</Form.Label>
                                <img
                                    src={files.form7_attach}
                                    alt="Form 7"
                                    style={{ width: "100px", height: "100px", marginTop: "10px", border: "1px solid #ccc" }}
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3 text-start">
                            <Form.Label column sm="4">
                                Financial Details :
                            </Form.Label>
                            <Col sm="8">
                                {/* Aadhar Card */}
                                <Form.Label className="mb-1">Bank Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="bank_name"
                                    value={formData.bank_name}
                                    onChange={handleInputChange}
                                    className="mb-2"
                                />

                                {/* UDID */}
                                <Form.Label className="mb-1">Account Number</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="account_no"
                                    value={formData.account_no}
                                    onChange={handleInputChange}
                                    className="mb-2"
                                />

                                {/* Disability Passport */}
                                <Form.Label className="mb-1">IFSC Code</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="ifsc_code"
                                    value={formData.ifsc_code}
                                    onChange={handleInputChange}
                                    className="mb-2"
                                />

                                <Form.Label className="mb-1">Copy of Bank Passbook (attach)</Form.Label>
                                {files?.bank_passbook ? (
                                    <img
                                        src={files.bank_passbook}
                                        alt="Bank Passbook"
                                        style={{ width: "100px", height: "100px", marginTop: "10px", border: "1px solid #ccc" }}
                                    />
                                ) : (
                                    <p style={{ marginTop: "10px" }}>No new photo available</p>
                                )}
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3 text-start">
                            <Form.Label column sm="4">
                                Health Insurance Details:
                            </Form.Label>
                            <Col sm="8">
                                {/* Aadhar Card */}
                                <Form.Label className="mb-1">Insurance Provider</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="insurance_provider"
                                    value={formData.insurance_provider}
                                    onChange={handleInputChange}
                                    className="mb-5"
                                />

                                {/* UDID */}
                                <Form.Label className="mb-1 mt-3">Policy Number</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="policy_no"
                                    value={formData.policy_no}
                                    onChange={handleInputChange}
                                    className="mb-2"
                                />

                                {/* Disability Passport */}
                                <Form.Label className="mb-1">Validity Period</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="validity_period"
                                    value={formData.validity_period}
                                    onChange={handleInputChange}
                                    className="mb-2"
                                />

                                <Form.Label className="mb-1">Other Govt. Scheme </Form.Label>
                                <Form.Control
                                    type="text"
                                    name="other_gvt_scheme"
                                    value={formData.other_gvt_scheme}
                                    onChange={handleInputChange}
                                    className="mb-2"
                                />
                            </Col>
                        </Form.Group>
                        <Col md={12}>
                            <Row className="d-flex align-items-center justify-content-center mt-3">
                                <Col md={6} className="mt-3 down_title">
                                    <h5 className="text-start">Signature / Thumprint</h5>
                                </Col>
                                <Col md={6} className="mt-3 down_title">
                                    <h5 className="text-end">Manasu Seal</h5>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Form>

            </div>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Document Information Form</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Col md={12}>
                        <Form className='media_consent'>
                            <Row>

                                <Form.Group as={Row} className="mb-1" controlId="formRescueName">

                                    <Col sm="6" className='d-flex align-items-center'>
                                        <Form.Control
                                            type="text"
                                            name="admission_no"
                                            value={formData.admission_no}
                                            onChange={handleInputChange}
                                            required hidden />
                                    </Col>
                                </Form.Group>


                                <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                    <Form.Label column sm="6" className='text-start'>
                                        Name :
                                    </Form.Label>
                                    <Col sm="6" className='d-flex align-items-center'>
                                        <Form.Control
                                            type="text"
                                            name="rescue_name"
                                            value={formData.rescue_name}
                                            onChange={handleInputChange}
                                            required />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                    <Form.Label column sm="6" className='text-start'>
                                        Aadhaar Card Number :
                                    </Form.Label>
                                    <Col sm="6" className='d-flex align-items-center'>
                                        <Form.Control
                                            type="text"
                                            name="aadhar_card"
                                            value={formData.aadhar_card}
                                            onChange={handleInputChange}
                                            required />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                    <Form.Label column sm="6" className='text-start'>
                                        UDID Card Number :
                                    </Form.Label>
                                    <Col sm="6" className='d-flex align-items-center'>
                                        <Form.Control
                                            type="text"
                                            name="udid_no"
                                            value={formData.udid_no}
                                            onChange={handleInputChange}
                                            required />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                    <Form.Label column sm="6" className='text-start'>
                                        Disability Certificate No :
                                    </Form.Label>
                                    <Col sm="6" className='d-flex align-items-center'>
                                        <Form.Control
                                            type="text"
                                            name="disability_no"
                                            value={formData.disability_no}
                                            onChange={handleInputChange}
                                            required />
                                    </Col>
                                </Form.Group>


                                <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                    <Form.Label column sm="6" className='text-start'>
                                        Voter ID :
                                    </Form.Label>
                                    <Col sm="6" className='d-flex align-items-center'>
                                        <Form.Control
                                            type="text"
                                            name="voter_id"
                                            value={formData.voter_id || "Null"}
                                            onChange={handleInputChange}
                                            required />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                    <Form.Label column sm="6" className='text-start'>
                                        Form 7 :
                                    </Form.Label>
                                    <Col sm="6" className='d-flex align-items-center'>
                                        <Form.Control
                                            type="text"
                                            name="form_7"
                                            value={formData.form_7}
                                            onChange={handleInputChange}
                                            required />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                    <Form.Label column sm="6" className='text-start'>
                                        Form 7 Attachment:
                                    </Form.Label>
                                    <Col sm="6" className='d-flex flex-column align-items-start'>
                                        <Form.Control
                                            type="file"
                                            name="form7_attach"
                                            onChange={handleFileChange}
                                            required
                                        />

                                        {/* Preview Image Below File Input */}
                                        {files?.form7_attach ? (
                                            <img
                                                src={files.form7_attach}
                                                alt="form7_attach"
                                                style={{ width: "70px", height: "70px", marginTop: "10px", border: "1px solid #ccc" }}
                                            />
                                        ) : (
                                            <p style={{ marginTop: "10px" }}>No new photo available</p>
                                        )}
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                    <Form.Label column sm="6" className='text-start'>
                                        Bank Name :
                                    </Form.Label>
                                    <Col sm="6" className='d-flex align-items-center'>
                                        <Form.Control
                                            type="text"
                                            name="bank_name"
                                            value={formData.bank_name}
                                            onChange={handleInputChange}
                                            required />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                    <Form.Label column sm="6" className='text-start'>
                                        Account Number :
                                    </Form.Label>
                                    <Col sm="6" className='d-flex align-items-center'>
                                        <Form.Control
                                            type="text"
                                            name="account_no"
                                            value={formData.account_no}
                                            onChange={handleInputChange}
                                            required />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                    <Form.Label column sm="6" className='text-start'>
                                        IFSC Code :
                                    </Form.Label>
                                    <Col sm="6" className='d-flex align-items-center'>
                                        <Form.Control
                                            type="text"
                                            name="ifsc_code"
                                            value={formData.ifsc_code}
                                            onChange={handleInputChange}
                                            required />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                    <Form.Label column sm="6" className='text-start'>
                                        Copy of Bank Passbook:
                                    </Form.Label>
                                    <Col sm="6" className='d-flex flex-column align-items-start'>
                                        <Form.Control
                                            type="file"
                                            name="bank_passbook"
                                            onChange={handleFileChange}
                                            required
                                        />

                                        {/* Preview Image Below File Input */}
                                        {files?.bank_passbook ? (
                                            <img
                                                src={files.bank_passbook}
                                                alt="Bank Passbook"
                                                style={{ width: "70px", height: "70px", marginTop: "10px", border: "1px solid #ccc" }}
                                            />
                                        ) : (
                                            <p style={{ marginTop: "10px" }}>No new photo available</p>
                                        )}
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                    <Form.Label column sm="6" className='text-start'>
                                        Insurance Provider :
                                    </Form.Label>
                                    <Col sm="6" className='d-flex align-items-center'>
                                        <Form.Control
                                            type="text"
                                            name="insurance_provider"
                                            value={formData.insurance_provider}
                                            onChange={handleInputChange}
                                            required />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                    <Form.Label column sm="6" className='text-start'>
                                        Policy Number :
                                    </Form.Label>
                                    <Col sm="6" className='d-flex align-items-center'>
                                        <Form.Control
                                            type="text"
                                            name="policy_no"
                                            value={formData.policy_no}
                                            onChange={handleInputChange}
                                            required />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                    <Form.Label column sm="6" className='text-start'>
                                        Validity Period :
                                    </Form.Label>
                                    <Col sm="6" className='d-flex align-items-center'>
                                        <Form.Control
                                            type="text"
                                            name="validity_period"
                                            value={formData.validity_period}
                                            onChange={handleInputChange}
                                            required />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                    <Form.Label column sm="6" className='text-start'>
                                        Other Govt. Scheme :
                                    </Form.Label>
                                    <Col sm="6" className='d-flex align-items-center'>
                                        <Form.Control
                                            type="text"
                                            name="other_gvt_scheme"
                                            value={formData.other_gvt_scheme}
                                            onChange={handleInputChange}
                                            required />
                                    </Col>
                                </Form.Group>

                                <div className="mt-3 d-flex align-tems-cente justify-content-between">
                                    <Button
                                        variant="success"
                                        className="m-1"
                                        type="submit"
                                        onClick={(e) => {
                                            if (formData && formData.admission_no) {
                                                handleUpdate(e, formData.admission_no);
                                            } else {
                                                alert("Admission number is missing.");
                                            }
                                        }}
                                    >
                                        Update
                                    </Button>
                                    <Button variant="secondary" onClick={handleClose}>
                                        Close
                                    </Button>
                                </div>

                            </Row>
                        </Form>
                    </Col>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default Director_essentialRecord
