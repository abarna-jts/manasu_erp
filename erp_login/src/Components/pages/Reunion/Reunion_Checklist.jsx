import React, { useState } from 'react';
import { Container, Row, Col, Breadcrumb, InputGroup, Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import manasu_logo from '../Admission/Manasu-Logo.png';
import { useNavigate } from 'react-router-dom';

function Reunion_Checklist() {
    // const [admission_no, setAdmissionNumber] = useState();
    const [previewRequested, setPreviewRequested] = useState(false);
    const [files, setFiles] = useState({});
    const [formData, setFormData] = useState({
        admission_no: '',
        familyRequestLetter: '',
        selfDeclarationLetter: '',
        mediaConsentLetter: '',
        familyRequestLetterFile: null,
        selfDeclarationFile: null,
        mediaConsentFile: null,
        residentIDproof: '',
        residentIDproofFile: null,
        familyIDproof: '',
        familyIDproofFile: null,
        aadharCard: '',
        aadharCardFile: null,
        udidCard: '',
        udidCardFile: null,
        disabilityCertificate: '',
        disabilityCertificateFile: null,
        bankPassbook: '',
        bankPassbookFile: null,
        healthInsurance: '',
        healthInsuranceFile: null,
        medicalReport: '',
        medicalReportFile: null,
        dischargeSummary: '',
        dischargeSummaryFile: null,
        medications: '',
        medicationsFile: null,
        Clothes: '',
        ClothesFile: null,
        possessionsRecovered: '',
        possessionsRecoveredFile: null,
        dischargeAllowance:'',
        dischargeAllowanceFile:null,
        travelExpenses: '',
        travelExpensesFile: null,
        copyOfdischargeSummary: '',
        copyOfdischargeSummaryFile: null,
        travelSafetyLetter: '',
        travelSafetyLetterFile: null,
        reunionPhoto: '',
        reunionPhotoFile: null,
        witnessSignature: '',
        witnessSignatureFile: null,
        any_other: '',

    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        if (files && files.length > 0) {
            setFormData((prevState) => ({
                ...prevState,
                [name]: files[0], // store the file object
            }));
        } else {
            setFormData((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if admission_no is empty
        if (!formData.admission_no || formData.admission_no.trim() === '') {
            alert("Please enter admission number before submitting the form.");
            return; // Stop submission
        }

        const data = new FormData();

        for (const key in formData) {
            if (formData[key] instanceof File) {
                data.append(key, formData[key]); // file
            } else {
                data.append(key, formData[key]); // string/text
            }
        }


        try {
            await apiRoute.post("/reunion/createDischarge_checklist", data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('Form submitted successfully!');
        } catch (err) {
            console.error(err);
            alert('Error submitting form.');
        }
    };


    const userType = Cookies.get('usertype');

    const apiRoute = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
    });

    const createFormData = () => {
        const targetElement = document.querySelector('.checklist_form');
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    }

    const ViewFormData = async () => {
        try {
            const response = await apiRoute.get(`/reunion/get_checklist/${formData.admission_no}`);
            const data = response.data;

            // Prefix file fields with server path
            const getFilePath = (file) => file ? `https://www.pahrultours.com/app2/${file}` : null;

            // Update normal form fields
            setFormData((prevFormData) => ({
                ...prevFormData,
                admission_no: data.admission_no || '',
                familyRequestLetter: data.familyRequestLetter || '',
                selfDeclarationLetter: data.selfDeclarationLetter || '',
                mediaConsentLetter: data.mediaConsentLetter || '',
                residentIDproof: data.residentIDproof || '',
                familyIDproof: data.familyIDproof || '',
                aadharCard: data.aadharCard || '',
                udidCard: data.udidCard || '',
                disabilityCertificate: data.disabilityCertificate || '',
                bankPassbook: data.bankPassbook || '',
                healthInsurance: data.healthInsurance || '',
                medicalReport: data.medicalReport || '',
                dischargeSummary: data.dischargeSummary || '',
                medications: data.medications || '',
                Clothes: data.Clothes || '',
                possessionsRecovered: data.possessionsRecovered || '',
                dischargeAllowance:data.dischargeAllowance || '',
                travelExpenses: data.travelExpenses || '',
                copyOfdischargeSummary: data.copyOfdischargeSummary || '',
                travelSafetyLetter: data.travelSafetyLetter || '',
                reunionPhoto: data.reunionPhoto || '',
                witnessSignature: data.witnessSignature || '',
                any_other: data.any_other || ''
            }));

            // Update file-related fields separately
            setFiles({
                familyRequestLetterFile: getFilePath(data.familyRequestLetterFile),
                selfDeclarationFile: getFilePath(data.selfDeclarationFile),
                mediaConsentFile: getFilePath(data.mediaConsentFile),
                residentIDproofFile: getFilePath(data.residentIDproofFile),
                familyIDproofFile: getFilePath(data.familyIDproofFile),
                aadharCardFile: getFilePath(data.aadharCardFile),
                udidCardFile: getFilePath(data.udidCardFile),
                disabilityCertificateFile: getFilePath(data.disabilityCertificateFile),
                bankPassbookFile: getFilePath(data.bankPassbookFile),
                healthInsuranceFile: getFilePath(data.healthInsuranceFile),
                medicalReportFile: getFilePath(data.medicalReportFile),
                dischargeSummaryFile: getFilePath(data.dischargeSummaryFile),
                medicationsFile: getFilePath(data.medicationsFile),
                ClothesFile: getFilePath(data.ClothesFile),
                possessionsRecoveredFile: getFilePath(data.possessionsRecoveredFile),
                dischargeAllowanceFile:getFilePath(data.dischargeAllowanceFile),
                travelExpensesFile: getFilePath(data.travelExpensesFile),
                copyOfdischargeSummaryFile: getFilePath(data.copyOfdischargeSummaryFile),
                travelSafetyLetterFile: getFilePath(data.travelSafetyLetterFile),
                reunionPhotoFile: getFilePath(data.reunionPhotoFile),
                witnessSignatureFile: getFilePath(data.witnessSignatureFile)
            });

            console.log("Fetched Form Data:", data);
            setPreviewRequested(true);
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

    const navigate = useNavigate();
    const handleShow = (admission_no) => {
        navigate(`/edit_reunion_checklist/${admission_no}`);
    };


    return (
        <>
            <div className="d-xl-flex justify-content-between align-items-center flex-wrap flex-md-nowrap text-start py-2">
                <div className="d-block mb-4 mb-xl-0 px-4 ">
                    <Breadcrumb className="d-none d-md-inline-block mb-0" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
                        <Breadcrumb.Item></Breadcrumb.Item>
                        <Breadcrumb.Item>Home</Breadcrumb.Item>
                        <Breadcrumb.Item active>Rescue Details</Breadcrumb.Item>
                    </Breadcrumb>
                    <h6 className="breadcrumb_title">Rescue Details</h6>

                </div>
                <div className="text-center col-md-8"><h3 className="section_title">Resident Discharge Summary and Checklist</h3></div>

                <div className="d-flex align-items-center px-3 justify-content-center">

                    <Form className="navbar-search">
                        <Form.Group id="topbarSearch">
                            <InputGroup className="input-group-merge search-bar">

                                <Form.Control
                                    type="text"
                                    placeholder="Search"
                                />
                            </InputGroup>
                        </Form.Group>
                    </Form>
                </div>
            </div>

            <Container>
                <Form className="navbar-search col-md-12 d-flex align-items-center justify-content-center">
                    <Form.Group id="topbarSearch" className="mt-3 d-flex align-items-center justify-content-center">
                        <Col md={5}>
                            <Form.Label>Admission Number:</Form.Label>
                        </Col>
                        <Col md={4}>
                            <InputGroup className="input-group-merge search-bar">
                                <Form.Control
                                    type="text"
                                    value={formData.admission_no}
                                    onChange={(e) =>
                                        setFormData({ ...formData, admission_no: e.target.value })
                                    }
                                />
                            </InputGroup>
                        </Col>
                        <button type="button" className="btn btn-secondary mx-1" onClick={() => {
                            if (!formData.admission_no.trim()) {
                                alert("Please enter admission number.");
                            } else {
                                ViewFormData();
                            }
                        }}><FontAwesomeIcon icon={faEye} className="me-0" /></button>
                         {userType === "1" && (
                            <button type="button" className="btn btn-success mx-1" onClick={() => {
                                if (!formData.admission_no.trim()) {
                                    alert("Please enter admission number.");
                                } else {
                                    createFormData();
                                }
                            }}><FontAwesomeIcon icon={faPlus} className="me-0" /></button>
                        )}
                        <button type="button" className="btn btn-success mx-1" onClick={() => {
                            if (!formData.admission_no.trim()) {
                                alert("Please enter admission number.");
                            } else {
                                handleShow(formData.admission_no);
                            }
                        }}><FontAwesomeIcon icon={faEdit} className="me-0" /></button>
                        {/* {userType === "2" && (
                            <button type="button" className="btn btn-success mx-1" onClick={() => {
                                if (!formData.admission_no.trim()) {
                                    alert("Please enter admission number.");
                                } else {
                                    // handleDelete(admission_no); 
                                }
                            }}><FontAwesomeIcon icon={faTrash} className="me-0" /></button>
                        )} */}
                    </Form.Group>
                </Form>
            </Container>

            <Container>
                <Row className='d-flex align-items-center justify-content-center'>
                    <Col md={10}>
                        <Form onSubmit={handleSubmit} className="checklist_form">
                            <ol className="ps-3 text-start my-3">
                                <li className='checklist_ul'>
                                    <h4>Request and Consent Documentation</h4>

                                    {/* family request letter */}
                                    <Form.Group as={Row} className="mb-1 align-items-center icon_checkList">
                                        <Form.Label column sm="3">
                                            Family Request Letter :
                                        </Form.Label>
                                        <Col sm="9" className='d-flex align-items-center justify-content-start'>
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="Yes"
                                                name="familyRequestLetter"
                                                id="familyRequestLetterYes"
                                                value="Yes"
                                                onChange={handleChange}
                                            />
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="No"
                                                name="familyRequestLetter"
                                                id="familyRequestLetterNo"
                                                value="No"
                                                onChange={handleChange}
                                            />
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="2">Attach:</Form.Label>
                                                <Col sm="10">
                                                    <Form.Control type="file"
                                                        name='familyRequestLetterFile'
                                                        onChange={handleChange}
                                                        required={formData.familyRequestLetter === "Yes"} />
                                                </Col>
                                            </Form.Group>

                                        </Col>
                                    </Form.Group>

                                    {/* self declaration letter */}
                                    <Form.Group as={Row} className="mb-1 align-items-center icon_checkList">
                                        <Form.Label column sm="3">
                                            Self-Declaration Letter :
                                        </Form.Label>
                                        <Col sm="9" className='d-flex align-items-center justify-content-start'>
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="Yes"
                                                name="selfDeclarationLetter"
                                                id="selfDeclarationYes"
                                                value="Yes"
                                                onChange={handleChange}
                                            />
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="No"
                                                name="selfDeclarationLetter"
                                                id="selfDeclarationNo"
                                                value="No"
                                                onChange={handleChange}
                                            />
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="2">Attach:</Form.Label>
                                                <Col sm="10">
                                                    <Form.Control type="file"
                                                        name='selfDeclarationFile'
                                                        onChange={handleChange}
                                                        required={formData.selfDeclarationLetter === "Yes"} />
                                                </Col>
                                            </Form.Group>

                                        </Col>
                                    </Form.Group>

                                    {/* self declaration letter */}
                                    <Form.Group as={Row} className="mb-1 align-items-center icon_checkList">
                                        <Form.Label column sm="3">
                                            Media Consent Letter :
                                        </Form.Label>
                                        <Col sm="9" className='d-flex align-items-center justify-content-start'>
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="Yes"
                                                name="mediaConsentLetter"
                                                id="mediaConsentYes"
                                                value="Yes"
                                                onChange={handleChange}
                                            />
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="No"
                                                name="mediaConsentLetter"
                                                id="mediaConsentNo"
                                                value="No"
                                                onChange={handleChange}
                                            />
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="2">Attach:</Form.Label>
                                                <Col sm="10">
                                                    <Form.Control type="file"
                                                        name='mediaConsentFile'
                                                        onChange={handleChange}
                                                        required={formData.mediaConsentLetter === "Yes"} />
                                                </Col>
                                            </Form.Group>

                                        </Col>
                                    </Form.Group>
                                </li>


                                <li className='checklist_ul'>
                                    <h4>Identification and Proof Documents</h4>

                                    {/* Family ID Proof */}
                                    <Form.Group as={Row} className="mb-1 align-items-center icon_checkList">
                                        <Form.Label column sm="3">
                                            Family ID Proof :
                                        </Form.Label>
                                        <Col sm="9" className='d-flex align-items-center justify-content-start'>
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="Yes"
                                                name="familyIDproof"
                                                id="familyIDproofYes"
                                                value="Yes"
                                                onChange={handleChange}
                                            />
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="No"
                                                name="familyIDproof"
                                                id="familyIDproofNo"
                                                value="No"
                                                onChange={handleChange}
                                            />
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="2">Attach:</Form.Label>
                                                <Col sm="10">
                                                    <Form.Control type="file"
                                                        name='familyIDproofFile'
                                                        onChange={handleChange}
                                                        required={formData.familyIDproof === "Yes"} />
                                                </Col>
                                            </Form.Group>

                                        </Col>
                                    </Form.Group>

                                    {/* Resident’s ID Proof*/}
                                    <Form.Group as={Row} className="mb-1 align-items-center icon_checkList">
                                        <Form.Label column sm="3">
                                            Resident’s ID Proof :
                                        </Form.Label>
                                        <Col sm="9" className='d-flex align-items-center justify-content-start'>
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="Yes"
                                                name="residentIDproof"
                                                id="residentIDproofYes"
                                                value="Yes"
                                                onChange={handleChange}
                                            />
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="No"
                                                name="residentIDproof"
                                                id="residentIDproofNo"
                                                value="No"
                                                onChange={handleChange}
                                            />
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="2">Attach:</Form.Label>
                                                <Col sm="10">
                                                    <Form.Control type="file"
                                                        name='residentIDproofFile'
                                                        onChange={handleChange}
                                                        required={formData.residentIDproof === "Yes"} />
                                                </Col>
                                            </Form.Group>

                                        </Col>
                                    </Form.Group>

                                    {/* Aadhar Card*/}
                                    <Form.Group as={Row} className="mb-1 align-items-center icon_checkList">
                                        <Form.Label column sm="3">
                                            Aadhaar Card :
                                        </Form.Label>
                                        <Col sm="9" className='d-flex align-items-center justify-content-start'>
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="Yes"
                                                name="aadharCard"
                                                id="aadharCardYes"
                                                value="Yes"
                                                onChange={handleChange}
                                            />
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="No"
                                                name="aadharCard"
                                                id="aadharCardNo"
                                                value="No"
                                                onChange={handleChange}
                                            />
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="2">Attach:</Form.Label>
                                                <Col sm="10">
                                                    <Form.Control type="file"
                                                        name='aadharCardFile'
                                                        onChange={handleChange}
                                                        required={formData.aadharCard === "Yes"} />
                                                </Col>
                                            </Form.Group>

                                        </Col>
                                    </Form.Group>

                                    {/* UDID Card*/}
                                    <Form.Group as={Row} className="mb-1 align-items-center icon_checkList">
                                        <Form.Label column sm="3">
                                            UDID Card :
                                        </Form.Label>
                                        <Col sm="9" className='d-flex align-items-center justify-content-start'>
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="Yes"
                                                name="udidCard"
                                                id="udidCardYes"
                                                value="Yes"
                                                onChange={handleChange}
                                            />
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="No"
                                                name="udidCard"
                                                id="udidCardNo"
                                                value="No"
                                                onChange={handleChange}
                                            />
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="2">Attach:</Form.Label>
                                                <Col sm="10">
                                                    <Form.Control type="file"
                                                        name='udidCardFile'
                                                        onChange={handleChange}
                                                        required={formData.udidCard === "Yes"} />
                                                </Col>
                                            </Form.Group>

                                        </Col>
                                    </Form.Group>

                                    {/* Disability Certificate*/}
                                    <Form.Group as={Row} className="mb-1 align-items-center icon_checkList">
                                        <Form.Label column sm="3">
                                            Disability Certificate :
                                        </Form.Label>
                                        <Col sm="9" className='d-flex align-items-center justify-content-start'>
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="Yes"
                                                name="disabilityCertificate"
                                                id="disabilityCertificateYes"
                                                value="Yes"
                                                onChange={handleChange}
                                            />
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="No"
                                                name="disabilityCertificate"
                                                id="disabilityCertificateNo"
                                                value="No"
                                                onChange={handleChange}
                                            />
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="2">Attach:</Form.Label>
                                                <Col sm="10">
                                                    <Form.Control type="file"
                                                        name='disabilityCertificateFile'
                                                        onChange={handleChange}
                                                        required={formData.disabilityCertificate === "Yes"} />
                                                </Col>
                                            </Form.Group>

                                        </Col>
                                    </Form.Group>

                                    {/* Bank Passbook / ATM Card*/}
                                    <Form.Group as={Row} className="mb-1 align-items-center icon_checkList">
                                        <Form.Label column sm="3">
                                            Bank Passbook / ATM Card :
                                        </Form.Label>
                                        <Col sm="9" className='d-flex align-items-center justify-content-start'>
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="Yes"
                                                name="bankPassbook"
                                                id="bankPassbookYes"
                                                value="Yes"
                                                onChange={handleChange}
                                            />
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="No"
                                                name="bankPassbook"
                                                id="bankPassbookNo"
                                                value="No"
                                                onChange={handleChange}
                                            />
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="2">Attach:</Form.Label>
                                                <Col sm="10">
                                                    <Form.Control type="file"
                                                        name='bankPassbookFile'
                                                        onChange={handleChange}
                                                        required={formData.bankPassbook === "Yes"} />
                                                </Col>
                                            </Form.Group>

                                        </Col>
                                    </Form.Group>

                                    {/* Health Insurance Document*/}
                                    <Form.Group as={Row} className="mb-1 align-items-center icon_checkList">
                                        <Form.Label column sm="3">
                                            Health Insurance Document :
                                        </Form.Label>
                                        <Col sm="9" className='d-flex align-items-center justify-content-start'>
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="Yes"
                                                name="healthInsurance"
                                                id="healthInsuranceYes"
                                                value="Yes"
                                                onChange={handleChange}
                                            />
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="No"
                                                name="healthInsurance"
                                                id="healthInsuranceNo"
                                                value="No"
                                                onChange={handleChange}
                                            />
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="2">Attach:</Form.Label>
                                                <Col sm="10">
                                                    <Form.Control type="file"
                                                        name='healthInsuranceFile'
                                                        onChange={handleChange}
                                                        required={formData.healthInsurance === "Yes"} />
                                                </Col>
                                            </Form.Group>

                                        </Col>
                                    </Form.Group>


                                </li>

                                <li className='checklist_ul'>
                                    <h4>Medical and Social Work Documentation</h4>
                                    {/* family request letter */}
                                    <Form.Group as={Row} className="mb-1 align-items-center icon_checkList">
                                        <Form.Label column sm="3">
                                            Medical Report (Prepared by Nurse) :
                                        </Form.Label>
                                        <Col sm="9" className='d-flex align-items-center justify-content-start'>
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="Yes"
                                                name="medicalReport"
                                                id="medicalReportYes"
                                                value="Yes"
                                                onChange={handleChange}
                                            />
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="No"
                                                name="medicalReport"
                                                id="medicalReportNo"
                                                value="No"
                                                onChange={handleChange}
                                            />
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="2">Attach:</Form.Label>
                                                <Col sm="10">
                                                    <Form.Control type="file"
                                                        name='medicalReportFile'
                                                        onChange={handleChange}
                                                        required={formData.medicalReport === "Yes"} />
                                                </Col>
                                            </Form.Group>

                                        </Col>
                                    </Form.Group>

                                    {/* Discharge Summary Report (Prepared by Social Worker) */}
                                    <Form.Group as={Row} className="mb-1 align-items-center icon_checkList">
                                        <Form.Label column sm="3">
                                            Discharge Summary Report (Prepared by Social Worker) :
                                        </Form.Label>
                                        <Col sm="9" className='d-flex align-items-center justify-content-start'>
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="Yes"
                                                name="dischargeSummary"
                                                id="dischargeSummaryYes"
                                                value="Yes"
                                                onChange={handleChange}
                                            />
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="No"
                                                name="dischargeSummary"
                                                id="dischargeSummaryNo"
                                                value="No"
                                                onChange={handleChange}
                                            />
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="2">Attach:</Form.Label>
                                                <Col sm="10">
                                                    <Form.Control type="file"
                                                        name='dischargeSummaryFile'
                                                        onChange={handleChange}
                                                        required={formData.dischargeSummary === "Yes"} />
                                                </Col>
                                            </Form.Group>

                                        </Col>
                                    </Form.Group>

                                    {/* One-Month Supply of Prescribed Medications */}
                                    <Form.Group as={Row} className="mb-1 align-items-center icon_checkList">
                                        <Form.Label column sm="3">
                                            One-Month Supply of Prescribed Medications :
                                        </Form.Label>
                                        <Col sm="9" className='d-flex align-items-center justify-content-start'>
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="Yes"
                                                name="medications"
                                                id="medicationsYes"
                                                value="Yes"
                                                onChange={handleChange}
                                            />
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="No"
                                                name="medications"
                                                id="medicationsNo"
                                                value="No"
                                                onChange={handleChange}
                                            />
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="2">Attach:</Form.Label>
                                                <Col sm="10">
                                                    <Form.Control type="file"
                                                        name='medicationsFile'
                                                        onChange={handleChange}
                                                        required={formData.medications === "Yes"} />
                                                </Col>
                                            </Form.Group>

                                        </Col>
                                    </Form.Group>

                                </li>

                                <li className='checklist_ul'>
                                    <h4>Handover of Belongings and Support</h4>
                                    {/* Clothes */}
                                    <Form.Group as={Row} className="mb-1 align-items-center icon_checkList">
                                        <Form.Label column sm="3">
                                            Clothes :
                                        </Form.Label>
                                        <Col sm="9" className='d-flex align-items-center justify-content-start'>
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="Yes"
                                                name="Clothes"
                                                id="ClothesYes"
                                                value="Yes"
                                                onChange={handleChange}
                                            />
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="No"
                                                name="Clothes"
                                                id="ClothesNo"
                                                value="No"
                                                onChange={handleChange}
                                            />
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="2">Attach:</Form.Label>
                                                <Col sm="10">
                                                    <Form.Control type="file"
                                                        name='ClothesFile'
                                                        onChange={handleChange}
                                                        required={formData.Clothes === "Yes"} />
                                                </Col>
                                            </Form.Group>

                                        </Col>
                                    </Form.Group>

                                    {/* Possessions Recovered */}
                                    <Form.Group as={Row} className="mb-1 align-items-center icon_checkList">
                                        <Form.Label column sm="3">
                                            Possessions Recovered at Time of Rescue :
                                        </Form.Label>
                                        <Col sm="9" className='d-flex align-items-center justify-content-start'>
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="Yes"
                                                name="possessionsRecovered"
                                                id="possessionsRecoveredYes"
                                                value="Yes"
                                                onChange={handleChange}
                                            />
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="No"
                                                name="possessionsRecovered"
                                                id="possessionsRecoveredNo"
                                                value="No"
                                                onChange={handleChange}
                                            />
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="2">Attach:</Form.Label>
                                                <Col sm="10">
                                                    <Form.Control type="file"
                                                        name='possessionsRecoveredFile'
                                                        onChange={handleChange}
                                                        required={formData.possessionsRecovered === "Yes"} />
                                                </Col>
                                            </Form.Group>

                                        </Col>
                                    </Form.Group>
                                    {/* Discharge Allowance*/}
                                    <Form.Group as={Row} className="mb-1 align-items-center icon_checkList">
                                        <Form.Label column sm="3">
                                            Discharge Allowance Provided :
                                        </Form.Label>
                                        <Col sm="9" className='d-flex align-items-center justify-content-start'>
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="Yes"
                                                name="dischargeAllowance"
                                                id="dischargeAllowanceYes"
                                                value="Yes"
                                                onChange={handleChange}
                                            />
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="No"
                                                name="dischargeAllowance"
                                                id="dischargeAllowanceNo"
                                                value="No"
                                                onChange={handleChange}
                                            />
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="2">Attach:</Form.Label>
                                                <Col sm="10">
                                                    <Form.Control type="file"
                                                        name='dischargeAllowanceFile'
                                                        onChange={handleChange}
                                                        required={formData.dischargeAllowance === "Yes"} />
                                                </Col>
                                            </Form.Group>

                                        </Col>
                                    </Form.Group>

                                    {/* Travel Expenses Provided */}
                                    <Form.Group as={Row} className="mb-1 align-items-center icon_checkList">
                                        <Form.Label column sm="3">
                                            Travel Expenses Provided :
                                        </Form.Label>
                                        <Col sm="9" className='d-flex align-items-center justify-content-start'>
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="Yes"
                                                name="travelExpenses"
                                                id="travelExpensesYes"
                                                value="Yes"
                                                onChange={handleChange}
                                            />
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="No"
                                                name="travelExpenses"
                                                id="travelExpensesNo"
                                                value="No"
                                                onChange={handleChange}
                                            />
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="2">Attach:</Form.Label>
                                                <Col sm="10">
                                                    <Form.Control type="file"
                                                        name='travelExpensesFile'
                                                        onChange={handleChange}
                                                        required={formData.travelExpenses === "Yes"} />
                                                </Col>
                                            </Form.Group>

                                        </Col>
                                    </Form.Group>

                                    {/* Copy of Discharge Summary */}
                                    <Form.Group as={Row} className="mb-1 align-items-center icon_checkList">
                                        <Form.Label column sm="3">
                                            Copy of Discharge Summary :
                                        </Form.Label>
                                        <Col sm="9" className='d-flex align-items-center justify-content-start'>
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="Yes"
                                                name="copyOfdischargeSummary"
                                                id="copyOfdischargeSummaryYes"
                                                value="Yes"
                                                onChange={handleChange}
                                            />
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="No"
                                                name="copyOfdischargeSummary"
                                                id="copyOfdischargeSummaryNo"
                                                value="No"
                                                onChange={handleChange}
                                            />
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="2">Attach:</Form.Label>
                                                <Col sm="10">
                                                    <Form.Control type="file"
                                                        name='copyOfdischargeSummaryFile'
                                                        onChange={handleChange}
                                                        required={formData.copyOfdischargeSummary === "Yes"} />
                                                </Col>
                                            </Form.Group>

                                        </Col>
                                    </Form.Group>

                                </li>

                                <li className='checklist_ul'>
                                    <h4>Safety and Travel Arrangements</h4>

                                    {/* Travel Safety Letter */}
                                    <Form.Group as={Row} className="mb-1 align-items-center icon_checkList">
                                        <Form.Label column sm="3">
                                            Travel Safety Letter :
                                        </Form.Label>
                                        <Col sm="9" className='d-flex align-items-center justify-content-start'>
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="Yes"
                                                name="travelSafetyLetter"
                                                id="travelSafetyLetterYes"
                                                value="Yes"
                                                onChange={handleChange}
                                            />
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="No"
                                                name="travelSafetyLetter"
                                                id="travelSafetyLetterNo"
                                                value="No"
                                                onChange={handleChange}
                                            />
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="2">Attach:</Form.Label>
                                                <Col sm="10">
                                                    <Form.Control type="file"
                                                        name='travelSafetyLetterFile'
                                                        onChange={handleChange}
                                                        required={formData.travelSafetyLetter === "Yes"} />
                                                </Col>
                                            </Form.Group>

                                        </Col>
                                    </Form.Group>

                                    {/* Reunion Photo */}
                                    <Form.Group as={Row} className="mb-1 align-items-center icon_checkList">
                                        <Form.Label column sm="3">
                                            Reunion Photo :
                                        </Form.Label>
                                        <Col sm="9" className='d-flex align-items-center justify-content-start'>
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="Yes"
                                                name="reunionPhoto"
                                                id="reunionPhotoYes"
                                                value="Yes"
                                                onChange={handleChange}
                                            />
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="No"
                                                name="reunionPhoto"
                                                id="reunionPhotoNo"
                                                value="No"
                                                onChange={handleChange}
                                            />
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="2">Attach:</Form.Label>
                                                <Col sm="10">
                                                    <Form.Control type="file"
                                                        name='reunionPhotoFile'
                                                        onChange={handleChange}
                                                        required={formData.reunionPhoto === "Yes"} />
                                                </Col>
                                            </Form.Group>

                                        </Col>
                                    </Form.Group>

                                </li>

                                <li className='checklist_ul'>
                                    <h4>Signatures and Final Verifications</h4>

                                    {/*  Witness Signature */}
                                    <Form.Group as={Row} className="mb-1 align-items-center icon_checkList">
                                        <Form.Label column sm="3">
                                            Witness Signature :
                                        </Form.Label>
                                        <Col sm="9" className='d-flex align-items-center justify-content-start'>
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="Yes"
                                                name="witnessSignature"
                                                id="witnessSignatureYes"
                                                value="Yes"
                                                onChange={handleChange}
                                            />
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="No"
                                                name="witnessSignature"
                                                id="witnessSignatureNo"
                                                value="No"
                                                onChange={handleChange}
                                            />
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="2">Attach:</Form.Label>
                                                <Col sm="10">
                                                    <Form.Control type="file"
                                                        name='witnessSignatureFile'
                                                        onChange={handleChange}
                                                        required={formData.witnessSignature === "Yes"} />
                                                </Col>
                                            </Form.Group>

                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} className='icon_checkList'>
                                        <Form.Label column sm="3">Any Other:</Form.Label>
                                        <Col sm="7">
                                            <Form.Control type="text"
                                                name='any_other'
                                                onChange={handleChange} />
                                        </Col>
                                    </Form.Group>

                                </li>
                            </ol>
                             {userType === "1" && (
                            <Button type='submit' className='btn btn-success'>Submit</Button>
                             )}
                        </Form>

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
                        <h4 className="text-center">Resident Discharge Summary and Checklist</h4>
                    </Col>
                </Row>
                
                <Form>
                    <ol className="ps-3 text-start my-4">
                        <li className="checklist_ul">
                            <h4>Request and Consent Documentation</h4>
                            <Form.Group as={Row} className="mb-2 align-items-center">
                                <Form.Label column sm="4">Family Request Letter:</Form.Label>
                                <Col sm="3">
                                    <Form.Control
                                        type="text"
                                        name="familyRequestLetter"
                                        value={formData.familyRequestLetter}
                                        readOnly
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-2 align-items-center">
                                <Form.Label column sm="4">Self-Declaration Letter:</Form.Label>
                                <Col sm="3">
                                    <Form.Control
                                        type="text"
                                        name="selfDeclarationLetter"
                                        value={formData.selfDeclarationLetter}
                                        readOnly
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-2 align-items-center">
                                <Form.Label column sm="4">Media Consent Letter:</Form.Label>
                                <Col sm="3">
                                    <Form.Control
                                        type="text"
                                        name="mediaConsentLetter"
                                        value={formData.mediaConsentLetter}
                                        readOnly
                                    />
                                </Col>
                            </Form.Group>
                        </li>

                        <li className="checklist_ul">
                            <h4>Identification and Proof Documents</h4>
                            <Form.Group as={Row} className="mb-2 align-items-center">
                                <Form.Label column sm="4">Family ID Proof:</Form.Label>
                                <Col sm="3">
                                    <Form.Control
                                        type="text"
                                        name="familyIDproof"
                                        value={formData.familyIDproof}
                                        readOnly
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-2 align-items-center">
                                <Form.Label column sm="4">Resident’s ID Proof:</Form.Label>
                                <Col sm="3">
                                    <Form.Control
                                        type="text"
                                        name="residentIDproof"
                                        value={formData.residentIDproof}
                                        readOnly
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-2 align-items-center">
                                <Form.Label column sm="4">Aadhaar Card :</Form.Label>
                                <Col sm="3">
                                    <Form.Control
                                        type="text"
                                        name="aadharCard"
                                        value={formData.aadharCard}
                                        readOnly
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-2 align-items-center">
                                <Form.Label column sm="4">UDID Card :</Form.Label>
                                <Col sm="3">
                                    <Form.Control
                                        type="text"
                                        name="udidCard"
                                        value={formData.udidCard}
                                        readOnly
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-2 align-items-center">
                                <Form.Label column sm="4">Disability Certificate :</Form.Label>
                                <Col sm="3">
                                    <Form.Control
                                        type="text"
                                        name="disabilityCertificate"
                                        value={formData.disabilityCertificate}
                                        readOnly
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-2 align-items-center">
                                <Form.Label column sm="4">Bank Passbook / ATM Card :</Form.Label>
                                <Col sm="3">
                                    <Form.Control
                                        type="text"
                                        name="bankPassbook"
                                        value={formData.bankPassbook}
                                        readOnly
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-2 align-items-center">
                                <Form.Label column sm="4">Health Insurance Document :</Form.Label>
                                <Col sm="3">
                                    <Form.Control
                                        type="text"
                                        name="healthInsurance"
                                        value={formData.healthInsurance}
                                        readOnly
                                    />
                                </Col>
                            </Form.Group>
                        </li>

                        <li className="checklist_ul">
                            <h4>Medical and Social Work Documentation</h4>
                            <Form.Group as={Row} className="mb-2 align-items-center">
                                <Form.Label column sm="4">Medical Report (Prepared by Nurse):</Form.Label>
                                <Col sm="3">
                                    <Form.Control
                                        type="text"
                                        name="medicalReport"
                                        value={formData.medicalReport}
                                        readOnly
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-2 align-items-center">
                                <Form.Label column sm="4">Discharge Summary Report (Prepared by Social Worker):</Form.Label>
                                <Col sm="3">
                                    <Form.Control
                                        type="text"
                                        name="dischargeSummary"
                                        value={formData.dischargeSummary}
                                        readOnly
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-2 align-items-center">
                                <Form.Label column sm="4">One-Month Supply of Prescribed Medications:</Form.Label>
                                <Col sm="3">
                                    <Form.Control
                                        type="text"
                                        name="medications"
                                        value={formData.medications}
                                        readOnly
                                    />
                                </Col>
                            </Form.Group>
                        </li>

                        <li className="checklist_ul">
                            <h4>Handover of Belongings and Support</h4>
                            <Form.Group as={Row} className="mb-2 align-items-center">
                                <Form.Label column sm="4">Clothes:</Form.Label>
                                <Col sm="3">
                                    <Form.Control
                                        type="text"
                                        name="Clothes"
                                        value={formData.Clothes}
                                        readOnly
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-5 align-items-center">
                                <Form.Label column sm="4">Possessions Recovered at Time of Rescue:</Form.Label>
                                <Col sm="3">
                                    <Form.Control
                                        type="text"
                                        name="possessionsRecovered"
                                        value={formData.possessionsRecovered}
                                        readOnly
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-2 mt-5 align-items-center">
                                <Form.Label column sm="4">Discharge Allowance :</Form.Label>
                                <Col sm="3">
                                    <Form.Control
                                        type="text"
                                        name="dischargeAllowance"
                                        value={formData.dischargeAllowance}
                                        readOnly
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-2 mt-5 align-items-center">
                                <Form.Label column sm="4">Travel Expenses Provided:</Form.Label>
                                <Col sm="3">
                                    <Form.Control
                                        type="text"
                                        name="travelExpenses"
                                        value={formData.travelExpenses}
                                        readOnly
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-2 align-items-center">
                                <Form.Label column sm="4">Copy of Discharge Summary:</Form.Label>
                                <Col sm="3">
                                    <Form.Control
                                        type="text"
                                        name="copyOfdischargeSummary"
                                        value={formData.copyOfdischargeSummary}
                                        readOnly
                                    />
                                </Col>
                            </Form.Group>

                        </li>

                        <li className="checklist_ul">
                            <h4>Safety and Travel Arrangements</h4>
                            <Form.Group as={Row} className="mb-2 align-items-center">
                                <Form.Label column sm="4">Travel Safety Letter:</Form.Label>
                                <Col sm="3">
                                    <Form.Control
                                        type="text"
                                        name="travelSafetyLetter"
                                        value={formData.travelSafetyLetter}
                                        readOnly
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-2 align-items-center">
                                <Form.Label column sm="4">Reunion Photo :</Form.Label>
                                <Col sm="3">
                                    <Form.Control
                                        type="text"
                                        name="reunionPhoto"
                                        value={formData.reunionPhoto}
                                        readOnly
                                    />
                                </Col>
                            </Form.Group>

                        </li>

                        <li className="checklist_ul">
                            <h4>Signatures and Final Verifications</h4>
                            <Form.Group as={Row} className="mb-2 align-items-center">
                                <Form.Label column sm="4">Witness Signature:</Form.Label>
                                <Col sm="3">
                                    <Form.Control
                                        type="text"
                                        name="witnessSignature"
                                        value={formData.witnessSignature}
                                        readOnly
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className='icon_checkList'>
                                <Form.Label column sm="3">Any Other:</Form.Label>
                                <Col sm="7">
                                    <Form.Control type="text"
                                        name='any_other'
                                        value={formData.any_other || "Null"} />
                                </Col>
                            </Form.Group>

                        </li>
                    </ol>
                    <Col md={12}>
                        <Row className="d-flex align-items-center justify-content-center mt-3">
                            <Col md={6} className="mt-3 down_title">
                                <h5 className="text-start">Signature / Thumbnail of Resident's</h5>
                            </Col>
                            <Col md={6} className="mt-3 down_title">
                                <h5 className="text-end">Manasu Seal</h5>
                            </Col>
                        </Row>
                    </Col>
                </Form>
            </div>
        </>
    )
}

export default Reunion_Checklist
