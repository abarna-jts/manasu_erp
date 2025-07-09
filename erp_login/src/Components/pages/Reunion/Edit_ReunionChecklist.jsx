import React from 'react';
import { Breadcrumb, Col, Container, Form, Row, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function Edit_ReunionChecklist() {
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
        const { name, value, type, files } = e.target;

        setFormData(prevData => ({
            ...prevData,
            [name]: type === 'file' ? files[0] : value
        }));
    };

    const { admission_no } = useParams();

    const apiRoute = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
    });

    useEffect(() => {
        if (!admission_no) return; // prevent empty or undefined admission_no from calling API

        const fetchDetails = async () => {
            try {
                const response = await apiRoute.get(`/reunion/get_allCheckList/${admission_no}`);
                const data = response.data;

                console.log('Checklist data:', data); // Optional: for debugging

                setFormData(prevFormData => ({
                    ...prevFormData,
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
                    travelExpenses: data.travelExpenses || '',
                    dischargeAllowance: data.dischargeAllowance || '',
                    copyOfdischargeSummary: data.copyOfdischargeSummary || '',
                    travelSafetyLetter: data.travelSafetyLetter || '',
                    reunionPhoto: data.reunionPhoto || '',
                    witnessSignature: data.witnessSignature || '',
                    any_other: data.any_other || '',
                    familyRequestLetterFile: data.familyRequestLetterFile || null,
                    selfDeclarationFile: data.selfDeclarationFile || null,
                    mediaConsentFile: data.mediaConsentFile || null,
                    residentIDproofFile: data.residentIDproofFile || null,
                    familyIDproofFile: data.familyIDproofFile || null,
                    aadharCardFile: data.aadharCardFile || null,
                    udidCardFile: data.udidCardFile || null,
                    disabilityCertificateFile: data.disabilityCertificateFile || null,
                    bankPassbookFile: data.bankPassbookFile || null,
                    healthInsuranceFile: data.healthInsuranceFile || null,
                    medicalReportFile: data.medicalReportFile || null,
                    dischargeSummaryFile: data.dischargeSummaryFile || null,
                    medicationsFile: data.medicationsFile || null,
                    ClothesFile: data.ClothesFile || null,
                    possessionsRecoveredFile: data.possessionsRecoveredFile || null,
                    travelExpensesFile: data.travelExpensesFile || null,
                    copyOfdischargeSummaryFile: data.copyOfdischargeSummaryFile || null,
                    travelSafetyLetterFile: data.travelSafetyLetterFile || null,
                    reunionPhotoFile: data.reunionPhotoFile || null,
                    witnessSignatureFile: data.witnessSignatureFile || null,
                }));
                console.log("Fetched file URL:", data.familyRequestLetterFile);
                // console.log(mediaConsentFile);
            } catch (error) {
                console.error('Failed to fetch checklist data:', error);
            }
        };

        fetchDetails();
    }, [admission_no]);

    const navigate = useNavigate();

    const updateFormData = async (e) => {
        e.preventDefault();

        if (!formData.familyRequestLetter || formData.familyRequestLetter.trim() === '') {
            alert("Please select Family Request Letter field Yes or No.");
            return;
        }
         if (!formData.selfDeclarationLetter || formData.selfDeclarationLetter.trim() === '') {
            alert("Please select Self-Declaration Letter field Yes or No.");
            return;
        }
         if (!formData.mediaConsentLetter || formData.mediaConsentLetter.trim() === '') {
            alert("Please select Media Consent Letter field Yes or No.");
            return;
        }
         if (!formData.residentIDproof || formData.residentIDproof.trim() === '') {
            alert("Please select Resident’s ID Proof field Yes or No.");
            return;
        }
         if (!formData.aadharCard || formData.aadharCard.trim() === '') {
            alert("Please select Aadhaar Card field Yes or No.");
            return;
        }
         if (!formData.udidCard || formData.udidCard.trim() === '') {
            alert("Please select UDID Card field Yes or No.");
            return;
        }
         if (!formData.disabilityCertificate || formData.disabilityCertificate.trim() === '') {
            alert("Please select Disability Certificate field Yes or No.");
            return;
        }
         if (!formData.bankPassbook || formData.bankPassbook.trim() === '') {
            alert("Please select Bank Passbook / ATM Card field Yes or No.");
            return;
        }
         if (!formData.healthInsurance || formData.healthInsurance.trim() === '') {
            alert("Please select Health Insurance Document field Yes or No.");
            return;
        }
         if (!formData.medicalReport || formData.medicalReport.trim() === '') {
            alert("Please select Medical Report field Yes or No.");
            return;
        }
         if (!formData.dischargeSummary || formData.familyRequestLetter.trim() === '') {
            alert("Please select Discharge Summary Report field Yes or No.");
            return;
        }
         if (!formData.medications || formData.medications.trim() === '') {
            alert("Please select One-Month Supply of Prescribed Medications field Yes or No.");
            return;
        }
         if (!formData.Clothes || formData.Clothes.trim() === '') {
            alert("Please select Clothes field Yes or No.");
            return;
        }
         if (!formData.possessionsRecovered || formData.possessionsRecovered.trim() === '') {
            alert("Please select Possessions Recovered field Yes or No.");
            return;
        }
         if (!formData.dischargeAllowance || formData.dischargeAllowance.trim() === '') {
            alert("Please select Discharge Allowance field Yes or No.");
            return;
        }
         if (!formData.travelExpenses || formData.travelExpenses.trim() === '') {
            alert("Please select Travel Expenses field Yes or No.");
            return;
        }
         if (!formData.copyOfdischargeSummary || formData.copyOfdischargeSummary.trim() === '') {
            alert("Please select Copy of Discharge Summary field Yes or No.");
            return;
        }
         if (!formData.travelSafetyLetter || formData.travelSafetyLetter.trim() === '') {
            alert("Please select Safety and Travel Arrangements field Yes or No.");
            return;
        }
         if (!formData.reunionPhoto || formData.reunionPhoto.trim() === '') {
            alert("Please select Reunion Photo field Yes or No.");
            return;
        }
         if (!formData.witnessSignature || formData.witnessSignature.trim() === '') {
            alert("Please select Witness Signature field Yes or No.");
            return;
        }

        const formPayload = new FormData();

        for (const key in formData) {
            if (formData[key] !== null && formData[key] !== '') {
                formPayload.append(key, formData[key]);
            }
        }

        try {
            const response = await apiRoute.post(`/reunion/updatechecklist/${admission_no}`, formPayload, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200) {
                alert('Form updated successfully');
                navigate("/reunion_checklist")
                // reset or update state if needed
            } else {
                alert('Update failed');
            }
        } catch (error) {
            console.error('Error updating form:', error);
            alert('Something went wrong. Please try again later.');
        }
    };



    return (
        <>
            <div className="d-xl-flex align-items-center flex-wrap flex-md-nowrap text-start py-2">
                <div className="d-block mb-4 mb-xl-0 px-4 ">
                    <Breadcrumb className="d-none d-md-inline-block mb-0" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
                        <Breadcrumb.Item></Breadcrumb.Item>
                        <Breadcrumb.Item>Home</Breadcrumb.Item>
                    </Breadcrumb>
                    <h6 className="breadcrumb_title">Reunion Checklist</h6>

                </div>

                <Col md={9} className="text-center">
                    <h4 className="section_title_1">Edit Resident Discharge Summary and Checklist</h4>
                </Col>
            </div>

            <Container>
                <Row >
                    <Col md={12}>
                        <Form className="checklist_form">
                            <ol className="ps-3 text-start my-3">
                                <li className='checklist_ul'>
                                    <h4>Request and Consent Documentation</h4>

                                    {/* family request letter */}
                                    <Form.Group as={Row} className="mb-1 align-items-center icon_checkList">
                                        <Form.Label column sm="3">
                                            Family Request Letter:
                                        </Form.Label>

                                        {/* Radio buttons */}
                                        <Col sm="3" className="d-flex align-items-center">
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="Yes"
                                                name="familyRequestLetter"
                                                id="familyRequestLetterYes"
                                                value="Yes"
                                                checked={formData.familyRequestLetter === "Yes"}
                                                onChange={handleChange}
                                            />
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="No"
                                                name="familyRequestLetter"
                                                id="familyRequestLetterNo"
                                                value="No"
                                                checked={formData.familyRequestLetter === "No"}
                                                onChange={handleChange}
                                            />
                                        </Col>

                                        {/* File upload */}
                                        <Col sm="6" className="d-flex align-items-center">
                                            <Form.Label column sm="3">
                                                Attach:
                                            </Form.Label>
                                            <Form.Control
                                                type="file"
                                                accept=".jpg,.jpeg,.png"
                                                name="familyRequestLetterFile"
                                                onChange={handleChange}
                                                required={formData.familyRequestLetter === "Yes"}
                                            />
                                            {formData.familyRequestLetterFile && typeof formData.familyRequestLetterFile === "string" && (
                                                <a
                                                    href={`https://www.pahrultours.com/app2/${formData.familyRequestLetterFile}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="ms-2"
                                                >
                                                    View
                                                </a>
                                            ) || " Null"}
                                        </Col>

                                    </Form.Group>



                                    {/* self declaration letter */}
                                    <Form.Group as={Row} className="mb-1 align-items-center icon_checkList">
                                        <Form.Label column sm="3">
                                            Self-Declaration Letter :
                                        </Form.Label>
                                        <Col sm="3" className='d-flex align-items-center justify-content-start'>
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="Yes"
                                                name="selfDeclarationLetter"
                                                id="selfDeclarationYes"
                                                value="Yes"
                                                checked={formData.selfDeclarationLetter === "Yes"}
                                                onChange={handleChange}
                                            />
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="No"
                                                name="selfDeclarationLetter"
                                                id="selfDeclarationNo"
                                                value="No"
                                                checked={formData.selfDeclarationLetter === "No"}
                                                onChange={handleChange}
                                            />

                                        </Col>

                                        {/* File upload */}
                                        <Col sm="6" className="d-flex align-items-center">
                                            <Form.Label column sm="3">
                                                Attach:
                                            </Form.Label>
                                            <Form.Control
                                                type="file"
                                                accept=".jpg,.jpeg,.png"
                                                name="selfDeclarationFile"
                                                onChange={handleChange}
                                                required={formData.selfDeclarationFile === "Yes"}
                                            />
                                            {formData.selfDeclarationFile && typeof formData.selfDeclarationFile === "string" && (
                                                <a
                                                    href={`https://www.pahrultours.com/app2/${formData.selfDeclarationFile}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="ms-2"
                                                >
                                                    View
                                                </a>
                                            ) || " Null"}
                                        </Col>
                                    </Form.Group>

                                    {/* self declaration letter */}
                                    <Form.Group as={Row} className="mb-1 align-items-center icon_checkList">
                                        <Form.Label column sm="3">
                                            Media Consent Letter :
                                        </Form.Label>
                                        <Col sm="3" className='d-flex align-items-center justify-content-start'>
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="Yes"
                                                name="mediaConsentLetter"
                                                id="mediaConsentYes"
                                                value="Yes"
                                                checked={formData.mediaConsentLetter === "Yes"}
                                                onChange={handleChange}
                                            />
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="No"
                                                name="mediaConsentLetter"
                                                id="mediaConsentNo"
                                                value="No"
                                                checked={formData.mediaConsentLetter === "No"}
                                                onChange={handleChange}
                                            />


                                        </Col>
                                        {/* File upload */}
                                        <Col sm="6" className="d-flex align-items-center">
                                            <Form.Label column sm="3">
                                                Attach:
                                            </Form.Label>
                                            <Form.Control
                                                type="file"
                                                accept=".jpg,.jpeg,.png"
                                                name="mediaConsentFile"
                                                onChange={handleChange}
                                                required={formData.mediaConsentFile === "Yes"}
                                            />
                                            {formData.mediaConsentFile && (
                                                <a
                                                    href={`https://www.pahrultours.com/app2/${formData.mediaConsentFile}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="ms-2"
                                                >
                                                    View
                                                </a>
                                            ) || " Null"}
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
                                        <Col sm="3" className='d-flex align-items-center justify-content-start'>
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="Yes"
                                                name="familyIDproof"
                                                id="familyIDproofYes"
                                                value="Yes"
                                                checked={formData.familyIDproof === "Yes"}
                                                onChange={handleChange}
                                            />
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="No"
                                                name="familyIDproof"
                                                id="familyIDproofNo"
                                                value="No"
                                                checked={formData.familyIDproof === "No"}
                                                onChange={handleChange}
                                            />


                                        </Col>
                                        {/* File upload */}
                                        <Col sm="6" className="d-flex align-items-center">
                                            <Form.Label column sm="3">
                                                Attach:
                                            </Form.Label>
                                            <Form.Control
                                                type="file"
                                                accept=".jpg,.jpeg,.png"
                                                name="familyIDproofFile"
                                                onChange={handleChange}
                                                required={formData.familyIDproofFile === "Yes"}
                                            />
                                            {formData.familyIDproofFile && (
                                                <a
                                                    href={`https://www.pahrultours.com/app2/${formData.familyIDproofFile}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="ms-2"
                                                >
                                                    View
                                                </a>
                                            ) || " Null"}
                                        </Col>
                                    </Form.Group>

                                    {/* Resident’s ID Proof*/}
                                    <Form.Group as={Row} className="mb-1 align-items-center icon_checkList">
                                        <Form.Label column sm="3">
                                            Resident’s ID Proof :
                                        </Form.Label>
                                        <Col sm="3" className='d-flex align-items-center justify-content-start'>
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="Yes"
                                                name="residentIDproof"
                                                id="residentIDproofYes"
                                                value="Yes"
                                                checked={formData.residentIDproof === "Yes"}
                                                onChange={handleChange}
                                            />
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="No"
                                                name="residentIDproof"
                                                id="residentIDproofNo"
                                                value="No"
                                                checked={formData.residentIDproof === "No"}
                                                onChange={handleChange}
                                            />
                                        </Col>
                                        {/* File upload */}
                                        <Col sm="6" className="d-flex align-items-center">
                                            <Form.Label column sm="3">
                                                Attach:
                                            </Form.Label>
                                            <Form.Control
                                                type="file"
                                                accept=".jpg,.jpeg,.png"
                                                name="residentIDproofFile"
                                                onChange={handleChange}
                                                required={formData.residentIDproofFile === "Yes"}
                                            />
                                            {formData.residentIDproofFile && (
                                                <a
                                                    href={`https://www.pahrultours.com/app2/${formData.residentIDproofFile}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="ms-2"
                                                >
                                                    View
                                                </a>
                                            ) || " Null"}
                                        </Col>
                                    </Form.Group>

                                    {/* Aadhar Card*/}
                                    <Form.Group as={Row} className="mb-1 align-items-center icon_checkList">
                                        <Form.Label column sm="3">
                                            Aadhaar Card :
                                        </Form.Label>
                                        <Col sm="3" className='d-flex align-items-center justify-content-start'>
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="Yes"
                                                name="aadharCard"
                                                id="aadharCardYes"
                                                value="Yes"
                                                checked={formData.aadharCard === "Yes"}
                                                onChange={handleChange}
                                            />
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="No"
                                                name="aadharCard"
                                                id="aadharCardNo"
                                                value="No"
                                                checked={formData.aadharCard === "No"}
                                                onChange={handleChange}
                                            />
                                        </Col>
                                        <Col sm="6" className="d-flex align-items-center">
                                            <Form.Label column sm="3">
                                                Attach:
                                            </Form.Label>
                                            <Form.Control
                                                type="file"
                                                accept=".jpg,.jpeg,.png"
                                                name="aadharCardFile"
                                                onChange={handleChange}
                                                required={formData.aadharCardFile === "Yes"}
                                            />
                                            {formData.aadharCardFile && (
                                                <a
                                                    href={`https://www.pahrultours.com/app2/${formData.aadharCardFile}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="ms-2"
                                                >
                                                    View
                                                </a>
                                            ) || " Null"}
                                        </Col>
                                    </Form.Group>

                                    {/* UDID Card*/}
                                    <Form.Group as={Row} className="mb-1 align-items-center icon_checkList">
                                        <Form.Label column sm="3">
                                            UDID Card :
                                        </Form.Label>
                                        <Col sm="3" className='d-flex align-items-center justify-content-start'>
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="Yes"
                                                name="udidCard"
                                                id="udidCardYes"
                                                value="Yes"
                                                checked={formData.udidCard === "Yes"}
                                                onChange={handleChange}
                                            />
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="No"
                                                name="udidCard"
                                                id="udidCardNo"
                                                value="No"
                                                checked={formData.udidCard === "No"}
                                                onChange={handleChange}
                                            />
                                        </Col>
                                        <Col sm="6" className="d-flex align-items-center">
                                            <Form.Label column sm="3">
                                                Attach:
                                            </Form.Label>
                                            <Form.Control
                                                type="file"
                                                accept=".jpg,.jpeg,.png"
                                                name="udidCardFile"
                                                onChange={handleChange}
                                                required={formData.udidCardFile === "Yes"}
                                            />
                                            {formData.udidCardFile && (
                                                <a
                                                    href={`https://www.pahrultours.com/app2/${formData.udidCardFile}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="ms-2"
                                                >
                                                    View
                                                </a>
                                            ) || " Null"}
                                        </Col>
                                    </Form.Group>

                                    {/* Disability Certificate*/}
                                    <Form.Group as={Row} className="mb-1 align-items-center icon_checkList">
                                        <Form.Label column sm="3">
                                            Disability Certificate :
                                        </Form.Label>
                                        <Col sm="3" className='d-flex align-items-center justify-content-start'>
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="Yes"
                                                name="disabilityCertificate"
                                                id="disabilityCertificateYes"
                                                value="Yes"
                                                checked={formData.disabilityCertificate === "Yes"}
                                                onChange={handleChange}
                                            />
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="No"
                                                name="disabilityCertificate"
                                                id="disabilityCertificateNo"
                                                value="No"
                                                checked={formData.disabilityCertificate === "No"}
                                                onChange={handleChange}
                                            />
                                        </Col>
                                        <Col sm="6" className="d-flex align-items-center">
                                            <Form.Label column sm="3">
                                                Attach:
                                            </Form.Label>
                                            <Form.Control
                                                type="file"
                                                accept=".jpg,.jpeg,.png"
                                                name="disabilityCertificateFile"
                                                onChange={handleChange}
                                                required={formData.disabilityCertificateFile === "Yes"}
                                            />
                                            {formData.disabilityCertificateFile && (
                                                <a
                                                    href={`https://www.pahrultours.com/app2/${formData.disabilityCertificateFile}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="ms-2"
                                                >
                                                    View
                                                </a>
                                            ) || " Null"}
                                        </Col>
                                    </Form.Group>

                                    {/* Bank Passbook / ATM Card*/}
                                    <Form.Group as={Row} className="mb-1 align-items-center icon_checkList">
                                        <Form.Label column sm="3">
                                            Bank Passbook / ATM Card :
                                        </Form.Label>
                                        <Col sm="3" className='d-flex align-items-center justify-content-start'>
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="Yes"
                                                name="bankPassbook"
                                                id="bankPassbookYes"
                                                value="Yes"
                                                checked={formData.bankPassbook === "Yes"}
                                                onChange={handleChange}
                                            />
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="No"
                                                name="bankPassbook"
                                                id="bankPassbookNo"
                                                value="No"
                                                checked={formData.bankPassbook === "No"}
                                                onChange={handleChange}
                                            />
                                        </Col>
                                        <Col sm="6" className="d-flex align-items-center">
                                            <Form.Label column sm="3">
                                                Attach:
                                            </Form.Label>
                                            <Form.Control
                                                type="file"
                                                accept=".jpg,.jpeg,.png"
                                                name="bankPassbookFile"
                                                onChange={handleChange}
                                                required={formData.bankPassbookFile === "Yes"}
                                            />
                                            {formData.bankPassbookFile && (
                                                <a
                                                    href={`https://www.pahrultours.com/app2/${formData.bankPassbookFile}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="ms-2"
                                                >
                                                    View
                                                </a>
                                            ) || " Null"}
                                        </Col>
                                    </Form.Group>

                                    {/* Health Insurance Document*/}
                                    <Form.Group as={Row} className="mb-1 align-items-center icon_checkList">
                                        <Form.Label column sm="3">
                                            Health Insurance Document :
                                        </Form.Label>
                                        <Col sm="3" className='d-flex align-items-center justify-content-start'>
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="Yes"
                                                name="healthInsurance"
                                                id="healthInsuranceYes"
                                                value="Yes"
                                                checked={formData.healthInsurance === "Yes"}
                                                onChange={handleChange}
                                            />
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="No"
                                                name="healthInsurance"
                                                id="healthInsuranceNo"
                                                value="No"
                                                checked={formData.healthInsurance === "No"}
                                                onChange={handleChange}
                                            />
                                        </Col>
                                        <Col sm="6" className="d-flex align-items-center">
                                            <Form.Label column sm="3">
                                                Attach:
                                            </Form.Label>
                                            <Form.Control
                                                type="file"
                                                accept=".jpg,.jpeg,.png"
                                                name="healthInsuranceFile"
                                                onChange={handleChange}
                                                required={formData.healthInsuranceFile === "Yes"}
                                            />
                                            {formData.healthInsuranceFile && (
                                                <a
                                                    href={`https://www.pahrultours.com/app2/${formData.healthInsuranceFile}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="ms-2"
                                                >
                                                    View
                                                </a>
                                            ) || " Null"}
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
                                        <Col sm="3" className='d-flex align-items-center justify-content-start'>
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="Yes"
                                                name="medicalReport"
                                                id="medicalReportYes"
                                                value="Yes"
                                                checked={formData.medicalReport === "Yes"}
                                                onChange={handleChange}
                                            />
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="No"
                                                name="medicalReport"
                                                id="medicalReportNo"
                                                value="No"
                                                checked={formData.medicalReport === "No"}
                                                onChange={handleChange}
                                            />
                                        </Col>
                                        <Col sm="6" className="d-flex align-items-center">
                                            <Form.Label column sm="3">
                                                Attach:
                                            </Form.Label>
                                            <Form.Control
                                                type="file"
                                                accept=".jpg,.jpeg,.png"
                                                name="medicalReportFile"
                                                onChange={handleChange}
                                                required={formData.medicalReportFile === "Yes"}
                                            />
                                            {formData.medicalReportFile && (
                                                <a
                                                    href={`https://www.pahrultours.com/app2/${formData.medicalReportFile}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="ms-2"
                                                >
                                                    View
                                                </a>
                                            ) || " Null"}
                                        </Col>
                                    </Form.Group>

                                    {/* Discharge Summary Report (Prepared by Social Worker) */}
                                    <Form.Group as={Row} className="mb-1 align-items-center icon_checkList">
                                        <Form.Label column sm="3">
                                            Discharge Summary Report (Prepared by Social Worker) :
                                        </Form.Label>
                                        <Col sm="3" className='d-flex align-items-center justify-content-start'>
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="Yes"
                                                name="dischargeSummary"
                                                id="dischargeSummaryYes"
                                                value="Yes"
                                                checked={formData.dischargeSummary === "Yes"}
                                                onChange={handleChange}
                                            />
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="No"
                                                name="dischargeSummary"
                                                id="dischargeSummaryNo"
                                                value="No"
                                                checked={formData.dischargeSummary === "No"}
                                                onChange={handleChange}
                                            />
                                        </Col>
                                        <Col sm="6" className="d-flex align-items-center">
                                            <Form.Label column sm="3">
                                                Attach:
                                            </Form.Label>
                                            <Form.Control
                                                type="file"
                                                accept=".jpg,.jpeg,.png"
                                                name="dischargeSummaryFile"
                                                onChange={handleChange}
                                                required={formData.dischargeSummaryFile === "Yes"}
                                            />
                                            {formData.dischargeSummaryFile && (
                                                <a
                                                    href={`https://www.pahrultours.com/app2/${formData.dischargeSummaryFile}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="ms-2"
                                                >
                                                    View
                                                </a>
                                            ) || " Null"}
                                        </Col>
                                    </Form.Group>

                                    {/* One-Month Supply of Prescribed Medications */}
                                    <Form.Group as={Row} className="mb-1 align-items-center icon_checkList">
                                        <Form.Label column sm="3">
                                            One-Month Supply of Prescribed Medications :
                                        </Form.Label>
                                        <Col sm="3" className='d-flex align-items-center justify-content-start'>
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="Yes"
                                                name="medications"
                                                id="medicationsYes"
                                                value="Yes"
                                                checked={formData.medications === "Yes"}
                                                onChange={handleChange}
                                            />
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="No"
                                                name="medications"
                                                id="medicationsNo"
                                                value="No"
                                                checked={formData.medications === "No"}
                                                onChange={handleChange}
                                            />
                                        </Col>
                                        <Col sm="6" className="d-flex align-items-center">
                                            <Form.Label column sm="3">
                                                Attach:
                                            </Form.Label>
                                            <Form.Control
                                                type="file"
                                                accept=".jpg,.jpeg,.png"
                                                name="medicationsFile"
                                                onChange={handleChange}
                                                required={formData.medicationsFile === "Yes"}
                                            />
                                            {formData.medicationsFile && (
                                                <a
                                                    href={`https://www.pahrultours.com/app2/${formData.medicationsFile}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="ms-2"
                                                >
                                                    View
                                                </a>
                                            ) || " Null"}
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
                                        <Col sm="3" className='d-flex align-items-center justify-content-start'>
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="Yes"
                                                name="Clothes"
                                                id="ClothesYes"
                                                value="Yes"
                                                checked={formData.Clothes === "Yes"}
                                                onChange={handleChange}
                                            />
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="No"
                                                name="Clothes"
                                                id="ClothesNo"
                                                value="No"
                                                checked={formData.Clothes === "No"}
                                                onChange={handleChange}
                                            />
                                        </Col>
                                        <Col sm="6" className="d-flex align-items-center">
                                            <Form.Label column sm="3">
                                                Attach:
                                            </Form.Label>
                                            <Form.Control
                                                type="file"
                                                accept=".jpg,.jpeg,.png"
                                                name="ClothesFile"
                                                onChange={handleChange}
                                                required={formData.ClothesFile === "Yes"}
                                            />
                                            {formData.medicationsFile && (
                                                <a
                                                    href={`https://www.pahrultours.com/app2/${formData.ClothesFile}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="ms-2"
                                                >
                                                    View
                                                </a>
                                            ) || " Null"}
                                        </Col>
                                    </Form.Group>

                                    {/* Possessions Recovered */}
                                    <Form.Group as={Row} className="mb-1 align-items-center icon_checkList">
                                        <Form.Label column sm="3">
                                            Possessions Recovered at Time of Rescue :
                                        </Form.Label>
                                        <Col sm="3" className='d-flex align-items-center justify-content-start'>
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="Yes"
                                                name="possessionsRecovered"
                                                id="possessionsRecoveredYes"
                                                value="Yes"
                                                checked={formData.possessionsRecovered === "Yes"}
                                                onChange={handleChange}
                                            />
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="No"
                                                name="possessionsRecovered"
                                                id="possessionsRecoveredNo"
                                                value="No"
                                                checked={formData.possessionsRecovered === "No"}
                                                onChange={handleChange}
                                            />
                                        </Col>
                                        <Col sm="6" className="d-flex align-items-center">
                                            <Form.Label column sm="3">
                                                Attach:
                                            </Form.Label>
                                            <Form.Control
                                                type="file"
                                                accept=".jpg,.jpeg,.png"
                                                name="possessionsRecoveredFile"
                                                onChange={handleChange}
                                                required={formData.possessionsRecoveredFile === "Yes"}
                                            />
                                            {formData.medicationsFile && (
                                                <a
                                                    href={`https://www.pahrultours.com/app2/${formData.possessionsRecoveredFile}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="ms-2"
                                                >
                                                    View
                                                </a>
                                            ) || " Null"}
                                        </Col>
                                    </Form.Group>

                                    {/*  Discharge Allowance Provided */}
                                    <Form.Group as={Row} className="mb-1 align-items-center icon_checkList">
                                        <Form.Label column sm="3">
                                            Discharge Allowance Provided :
                                        </Form.Label>
                                        <Col sm="3" className='d-flex align-items-center justify-content-start'>
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="Yes"
                                                name="dischargeAllowance"
                                                id="dischargeAllowanceYes"
                                                checked={formData.dischargeAllowance === "Yes"}
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
                                                checked={formData.dischargeAllowance === "No"}
                                                onChange={handleChange}
                                            />
                                        </Col>
                                        <Col sm="6" className="d-flex align-items-center">
                                            <Form.Label column sm="3">
                                                Attach:
                                            </Form.Label>
                                            <Form.Control
                                                type="file"
                                                accept=".jpg,.jpeg,.png"
                                                name="dischargeAllowanceFile"
                                                onChange={handleChange}
                                                required={formData.dischargeAllowanceFile === "Yes"}
                                            />
                                            {formData.dischargeAllowanceFile && (
                                                <a
                                                    href={`https://www.pahrultours.com/app2/${formData.dischargeAllowanceFile}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="ms-2"
                                                >
                                                    View
                                                </a>
                                            ) || " Null"}
                                        </Col>
                                    </Form.Group>

                                    {/*  Travel Expenses Provided */}
                                    <Form.Group as={Row} className="mb-1 align-items-center icon_checkList">
                                        <Form.Label column sm="3">
                                            Travel Expenses Provided :
                                        </Form.Label>
                                        <Col sm="3" className='d-flex align-items-center justify-content-start'>
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="Yes"
                                                name="travelExpenses"
                                                id="travelExpensesYes"
                                                checked={formData.travelExpenses === "Yes"}
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
                                                checked={formData.travelExpenses === "No"}
                                                onChange={handleChange}
                                            />
                                        </Col>
                                        <Col sm="6" className="d-flex align-items-center">
                                            <Form.Label column sm="3">
                                                Attach:
                                            </Form.Label>
                                            <Form.Control
                                                type="file"
                                                accept=".jpg,.jpeg,.png"
                                                name="travelExpensesFile"
                                                onChange={handleChange}
                                                required={formData.travelExpensesFile === "Yes"}
                                            />
                                            {formData.travelExpensesFile && (
                                                <a
                                                    href={`https://www.pahrultours.com/app2/${formData.travelExpensesFile}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="ms-2"
                                                >
                                                    View
                                                </a>
                                            ) || " Null"}
                                        </Col>
                                    </Form.Group>

                                    {/* Copy of Discharge Summary */}
                                    <Form.Group as={Row} className="mb-1 align-items-center icon_checkList">
                                        <Form.Label column sm="3">
                                            Copy of Discharge Summary :
                                        </Form.Label>
                                        <Col sm="3" className='d-flex align-items-center justify-content-start'>
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="Yes"
                                                name="copyOfdischargeSummary"
                                                id="copyOfdischargeSummaryYes"
                                                checked={formData.copyOfdischargeSummary === "Yes"}
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
                                                checked={formData.copyOfdischargeSummary === "No"}
                                                onChange={handleChange}
                                            />
                                        </Col>
                                        <Col sm="6" className="d-flex align-items-center">
                                            <Form.Label column sm="3">
                                                Attach:
                                            </Form.Label>
                                            <Form.Control
                                                type="file"
                                                accept=".jpg,.jpeg,.png"
                                                name="copyOfdischargeSummaryFile"
                                                onChange={handleChange}
                                                required={formData.copyOfdischargeSummaryFile === "Yes"}
                                            />
                                            {formData.copyOfdischargeSummaryFile && (
                                                <a
                                                    href={`https://www.pahrultours.com/app2/${formData.copyOfdischargeSummaryFile}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="ms-2"
                                                >
                                                    View
                                                </a>
                                            ) || " Null"}
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
                                        <Col sm="3" className='d-flex align-items-center justify-content-start'>
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="Yes"
                                                name="travelSafetyLetter"
                                                id="travelSafetyLetterYes"
                                                checked={formData.travelSafetyLetter === "Yes"}
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
                                                checked={formData.travelSafetyLetter === "No"}
                                                onChange={handleChange}
                                            />
                                        </Col>
                                        <Col sm="6" className="d-flex align-items-center">
                                            <Form.Label column sm="3">
                                                Attach:
                                            </Form.Label>
                                            <Form.Control
                                                type="file"
                                                accept=".jpg,.jpeg,.png"
                                                name="travelSafetyLetterFile"
                                                onChange={handleChange}
                                                required={formData.travelSafetyLetterFile === "Yes"}
                                            />
                                            {formData.travelSafetyLetterFile && (
                                                <a
                                                    href={`https://www.pahrultours.com/app2/${formData.travelSafetyLetterFile}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="ms-2"
                                                >
                                                    View
                                                </a>
                                            ) || " Null"}
                                        </Col>
                                    </Form.Group>

                                    {/* Reunion Photo */}
                                    <Form.Group as={Row} className="mb-1 align-items-center icon_checkList">
                                        <Form.Label column sm="3">
                                            Reunion Photo :
                                        </Form.Label>
                                        <Col sm="3" className='d-flex align-items-center justify-content-start'>
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="Yes"
                                                name="reunionPhoto"
                                                id="reunionPhotoYes"
                                                value="Yes"
                                                checked={formData.reunionPhoto === "Yes"}
                                                onChange={handleChange}
                                            />
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="No"
                                                name="reunionPhoto"
                                                id="reunionPhotoNo"
                                                value="No"
                                                checked={formData.reunionPhoto === "No"}
                                                onChange={handleChange}
                                            />
                                        </Col>
                                        <Col sm="6" className="d-flex align-items-center">
                                            <Form.Label column sm="3">
                                                Attach:
                                            </Form.Label>
                                            <Form.Control
                                                type="file"
                                                accept=".jpg,.jpeg,.png"
                                                name="reunionPhotoFile"
                                                onChange={handleChange}
                                                required={formData.reunionPhotoFile === "Yes"}
                                            />
                                            {formData.reunionPhotoFile && (
                                                <a
                                                    href={`https://www.pahrultours.com/app2/${formData.reunionPhotoFile}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="ms-2"
                                                >
                                                    View
                                                </a>
                                            ) || " Null"}
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
                                        <Col sm="3" className='d-flex align-items-center justify-content-start'>
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="Yes"
                                                name="witnessSignature"
                                                id="witnessSignatureYes"
                                                checked={formData.witnessSignature === "Yes"}
                                                value="Yes"
                                                onChange={handleChange}
                                            />
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="No"
                                                name="witnessSignature"
                                                id="witnessSignatureNo"
                                                checked={formData.witnessSignature === "No"}
                                                value="No"
                                                onChange={handleChange}
                                            />
                                        </Col>
                                        <Col sm="6" className="d-flex align-items-center">
                                            <Form.Label column sm="3">
                                                Attach:
                                            </Form.Label>
                                            <Form.Control
                                                type="file"
                                                accept=".jpg,.jpeg,.png"
                                                name="witnessSignatureFile"
                                                onChange={handleChange}
                                                required={formData.witnessSignatureFile === "Yes"}
                                            />
                                            {formData.witnessSignatureFile && (
                                                <a
                                                    href={`https://www.pahrultours.com/app2/${formData.witnessSignatureFile}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="ms-2"
                                                >
                                                    View
                                                </a>
                                            ) || " Null"}
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} className='icon_checkList'>
                                        <Form.Label column sm="3">Any Other:</Form.Label>
                                        <Col sm="7">
                                            <Form.Control type="text"
                                                name='any_other'
                                                onChange={handleChange}
                                                value={formData.any_other}
                                            />
                                        </Col>
                                    </Form.Group>

                                </li>
                            </ol>
                            <Button type='submit' className='btn btn-success' onClick={updateFormData}>Update</Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Edit_ReunionChecklist
