import React, { useState } from 'react';
import { Container, Row, Col, Breadcrumb, InputGroup, Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';


function Reunion_Checklist() {
    const [admission_no, setAdmissionNumber] = useState();

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
                                    value={admission_no}
                                    onChange={(e) => setAdmissionNumber(e.target.value)}
                                />
                            </InputGroup>
                        </Col>
                        <button type="button" className="btn btn-secondary mx-1" onClick={() => {
                            if (!admission_no.trim()) {
                                alert("Please enter your admission number.");
                            } else {
                                ViewFormData(); // Fetch & populate data before generating PDF
                            }
                        }}><FontAwesomeIcon icon={faEye} className="me-0" /></button>
                        <button type="button" className="btn btn-success mx-1" onClick={() => {
                            if (!admission_no.trim()) {
                                alert("Please enter your admission number.");
                            } else {
                                createFormData(); // Fetch & populate data before generating PDF
                            }
                        }}><FontAwesomeIcon icon={faPlus} className="me-0" /></button>
                        <button type="button" className="btn btn-success mx-1" onClick={() => {
                            if (!admission_no.trim()) {
                                alert("Please enter your admission number.");
                            } else {
                                handleShow(admission_no); // Fetch & populate data before generating PDF
                            }
                        }}><FontAwesomeIcon icon={faEdit} className="me-0" /></button>
                        {userType === "2" && (
                            <button type="button" className="btn btn-success mx-1" onClick={() => {
                                if (!admission_no.trim()) {
                                    alert("Please enter your admission number.");
                                } else {
                                    handleDelete(admission_no); // Fetch & populate data before generating PDF
                                }
                            }}><FontAwesomeIcon icon={faTrash} className="me-0" /></button>
                        )}
                    </Form.Group>
                </Form>
            </Container>

            <Container>
                <Row className='d-flex align-items-center justify-content-center'>
                    <Col md={10}>
                        <Form>
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
                                            />
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="No"
                                                name="familyRequestLetter"
                                                id="familyRequestLetterNo"
                                            />
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="2">Attach:</Form.Label>
                                                <Col sm="10">
                                                    <Form.Control type="file"
                                                        name='familyRequestLetterFile' />
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
                                            />
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="No"
                                                name="selfDeclarationLetter"
                                                id="selfDeclarationNo"
                                            />
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="2">Attach:</Form.Label>
                                                <Col sm="10">
                                                    <Form.Control type="file"
                                                        name='selfDeclarationFile' />
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
                                            />
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="No"
                                                name="mediaConsentLetter"
                                                id="mediaConsentNo"
                                            />
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="2">Attach:</Form.Label>
                                                <Col sm="10">
                                                    <Form.Control type="file"
                                                        name='mediaConsentFile' />
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
                                            />
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="No"
                                                name="familyIDproof"
                                                id="familyIDproofNo"
                                            />
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="2">Attach:</Form.Label>
                                                <Col sm="10">
                                                    <Form.Control type="file"
                                                        name='familyIDproofFile' />
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
                                            />
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="No"
                                                name="aadharCard"
                                                id="aadharCardNo"
                                            />
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="2">Attach:</Form.Label>
                                                <Col sm="10">
                                                    <Form.Control type="file"
                                                        name='aadharCardFile' />
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
                                            />
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="No"
                                                name="udidCard"
                                                id="udidCardNo"
                                            />
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="2">Attach:</Form.Label>
                                                <Col sm="10">
                                                    <Form.Control type="file"
                                                        name='udidCardFile' />
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
                                            />
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="No"
                                                name="disabilityCertificate"
                                                id="disabilityCertificateNo"
                                            />
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="2">Attach:</Form.Label>
                                                <Col sm="10">
                                                    <Form.Control type="file"
                                                        name='disabilityCertificateFile' />
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
                                            />
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="No"
                                                name="bankPassbook"
                                                id="bankPassbookNo"
                                            />
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="2">Attach:</Form.Label>
                                                <Col sm="10">
                                                    <Form.Control type="file"
                                                        name='bankPassbookFile' />
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
                                            />
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="No"
                                                name="healthInsurance"
                                                id="healthInsuranceNo"
                                            />
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="2">Attach:</Form.Label>
                                                <Col sm="10">
                                                    <Form.Control type="file"
                                                        name='healthInsuranceFile' />
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
                                            />
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="No"
                                                name="medicalReport"
                                                id="medicalReportNo"
                                            />
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="2">Attach:</Form.Label>
                                                <Col sm="10">
                                                    <Form.Control type="file"
                                                        name='medicalReportFile' />
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
                                            />
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="No"
                                                name="dischargeSummary"
                                                id="dischargeSummaryNo"
                                            />
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="2">Attach:</Form.Label>
                                                <Col sm="10">
                                                    <Form.Control type="file"
                                                        name='dischargeSummaryFile' />
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
                                            />
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="No"
                                                name="medications"
                                                id="medicationsNo"
                                            />
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="2">Attach:</Form.Label>
                                                <Col sm="10">
                                                    <Form.Control type="file"
                                                        name='medicationsFile' />
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
                                            />
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="No"
                                                name="Clothes"
                                                id="ClothesNo"
                                            />
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="2">Attach:</Form.Label>
                                                <Col sm="10">
                                                    <Form.Control type="file"
                                                        name='ClothesFile' />
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
                                            />
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="No"
                                                name="possessionsRecovered"
                                                id="possessionsRecoveredNo"
                                            />
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="2">Attach:</Form.Label>
                                                <Col sm="10">
                                                    <Form.Control type="file"
                                                        name='possessionsRecoveredFile' />
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
                                            />
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="No"
                                                name="travelExpenses"
                                                id="travelExpensesNo"
                                            />
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="2">Attach:</Form.Label>
                                                <Col sm="10">
                                                    <Form.Control type="file"
                                                        name='travelExpensesFile' />
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
                                                name="dischargeSummary"
                                                id="dischargeSummaryYes"
                                            />
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="No"
                                                name="dischargeSummary"
                                                id="dischargeSummaryNo"
                                            />
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="2">Attach:</Form.Label>
                                                <Col sm="10">
                                                    <Form.Control type="file"
                                                        name='dischargeSummaryFile' />
                                                </Col>
                                            </Form.Group>

                                        </Col>
                                    </Form.Group>

                                </li>

                                <li className='checklist_ul'>
                                    <h4>Safety and Travel Arrangements</h4>

                                    <Form.Check type="checkbox" className="checkbox_class" label="Travel Safety Letter" />
                                    <Form.Check type="checkbox" className="checkbox_class" label="Reunion Photo" />

                                </li>

                                <li className='checklist_ul'>
                                    <h4>Signatures and Final Verifications</h4>

                                    <Form.Check type="checkbox" className="checkbox_class" label="Witness Signature" />
                                    <Form.Group controlId="otherSignature">
                                        <Form.Check type="checkbox" className="checkbox_class" label="Other:" />
                                        <Form.Control type="text" placeholder="__________________________" className="mt-1" />
                                    </Form.Group>

                                </li>
                            </ol>
                        </Form>

                    </Col>

                </Row>
            </Container>
        </>
    )
}

export default Reunion_Checklist
