import React, { useState } from 'react';
import { Container, Row, Col, Breadcrumb, InputGroup, Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
// import { useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';


function Reunion_Checklist() {
    // const [admission_no, setAdmissionNumber] = useState();
    const [formData, setFormData] = useState({
        admission_no: '',
        familyRequestLetter: '',
        selfDeclarationLetter: '',
        mediaConsentLetter: '',
        familyRequestLetterFile: null,
        selfDeclarationFile: null,
        mediaConsentFile: null,
        familyIDproof:'',
        familyIDproofFile:null,
        aadharCard:'',
        aadharCardFile:null,
        udidCard:'',
        udidCardFile:null,
        disabilityCertificate:'',
        disabilityCertificateFile:null,
        bankPassbook:'',
        bankPassbookFile:null,
        healthInsurance:'',
        healthInsuranceFile:null,
        medicalReport:'',
        medicalReportFile:null,
        dischargeSummary:'',
        dischargeSummaryFile:null,
        medications:'',
        medicationsFile:null,
        Clothes:'',
        ClothesFile:null,
        possessionsRecovered:'',
        possessionsRecoveredFile:null,
        travelExpenses:'',
        travelExpensesFile:null,
        copyOfdischargeSummary:'',
        copyOfdischargeSummaryFile:null,
        travelSafetyLetter:'',
        travelSafetyLetterFile:null,
        reunionPhoto:'',
        reunionPhotoFile:null,
        witnessSignature:'',
        witnessSignatureFile:null,

    });

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'file' ? files[0] : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if admission_no is empty
    if (!formData.admission_no || formData.admission_no.trim() === '') {
        alert("Please enter your admission number before submitting the form.");
        return; // Stop submission
    }

        const data = new FormData();
        for (const key in formData) {
            data.append(key, formData[key]);
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

                <div className="d-flex align-items-center px-3">

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
                                alert("Please enter your admission number.");
                            } else {
                                // ViewFormData(); 
                            }
                        }}><FontAwesomeIcon icon={faEye} className="me-0" /></button>
                        <button type="button" className="btn btn-success mx-1" onClick={() => {
                            if (!formData.admission_no.trim()) {
                                alert("Please enter your admission number.");
                            } else {
                                // createFormData(); 
                            }
                        }}><FontAwesomeIcon icon={faPlus} className="me-0" /></button>
                        <button type="button" className="btn btn-success mx-1" onClick={() => {
                            if (!formData.admission_no.trim()) {
                                alert("Please enter your admission number.");
                            } else {
                                // handleShow(admission_no);
                            }
                        }}><FontAwesomeIcon icon={faEdit} className="me-0" /></button>
                        {userType === "2" && (
                            <button type="button" className="btn btn-success mx-1" onClick={() => {
                                if (!formData.admission_no.trim()) {
                                    alert("Please enter your admission number.");
                                } else {
                                    // handleDelete(admission_no); 
                                }
                            }}><FontAwesomeIcon icon={faTrash} className="me-0" /></button>
                        )}
                    </Form.Group>
                </Form>
            </Container>

            <Container>
                <Row className='d-flex align-items-center justify-content-center'>
                    <Col md={10}>
                        <Form onSubmit={handleSubmit}>
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
                                                        onChange={handleChange} />
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
                                                        onChange={handleChange} />
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
                                                        onChange={handleChange} />
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
                                                        onChange={handleChange}/>
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
                                            />
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="No"
                                                name="residentIDproof"
                                                id="residentIDproofNo"
                                            />
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="2">Attach:</Form.Label>
                                                <Col sm="10">
                                                    <Form.Control type="file"
                                                        name='residentIDproofFile' />
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
                                                        onChange={handleChange} />
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
                                                        onChange={handleChange} />
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
                                                        onChange={handleChange} />
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
                                                        onChange={handleChange} />
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
                                                        onChange={handleChange}/>
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
                                                        onChange={handleChange}/>
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
                                                        onChange={handleChange}/>
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
                                                        onChange={handleChange}/>
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
                                                        onChange={handleChange}/>
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
                                                        onChange={handleChange}/>
                                                </Col>
                                            </Form.Group>

                                        </Col>
                                    </Form.Group>

                                    {/* Discharge Allowance / Travel Expenses Provided */}
                                    <Form.Group as={Row} className="mb-1 align-items-center icon_checkList">
                                        <Form.Label column sm="3">
                                            Discharge Allowance / Travel Expenses Provided :
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
                                                        onChange={handleChange}/>
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
                                                value="Yes"
                                                onChange={handleChange}
                                            />
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="2">Attach:</Form.Label>
                                                <Col sm="10">
                                                    <Form.Control type="file"
                                                        name='copyOfdischargeSummaryFile' 
                                                        onChange={handleChange}/>
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
                                                        onChange={handleChange}/>
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
                                                        onChange={handleChange}/>
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
                                                        onChange={handleChange}/>
                                                </Col>
                                            </Form.Group>

                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} controlId="otherSignature">
                                        <Form.Check type="checkbox" className="checkbox_class" label="Other:" />
                                        <Form.Control type="text" placeholder="__________________________" className="mt-1" />
                                    </Form.Group>

                                </li>
                            </ol>
                            <Button type='submit' className='btn btn-success'>Submit</Button>
                        </Form>

                    </Col>

                </Row>
            </Container>
        </>
    )
}

export default Reunion_Checklist
