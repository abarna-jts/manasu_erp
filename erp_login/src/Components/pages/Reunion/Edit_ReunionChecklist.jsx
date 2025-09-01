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
        dischargeAllowance: '',
        dischargeAllowanceFile: null,
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
        const { name, type, files, value } = e.target;

        if (type === "file") {
            // Convert FileList to Array
            setFormData((prev) => ({
                ...prev,
                [name]: Array.from(files),
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
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
                    familyRequestLetterFile: data.familyRequestLetterFile
                        ? JSON.parse(data.familyRequestLetterFile)
                        : [],
                    selfDeclarationFile: data.selfDeclarationFile
                        ? JSON.parse(data.selfDeclarationFile)
                        : [],
                    mediaConsentFile: data.mediaConsentFile
                        ? JSON.parse(data.mediaConsentFile)
                        : [],
                    residentIDproofFile: data.residentIDproofFile
                        ? JSON.parse(data.residentIDproofFile)
                        : [],
                    familyIDproofFile: data.familyIDproofFile
                        ? JSON.parse(data.familyIDproofFile)
                        : [],
                    aadharCardFile: data.aadharCardFile
                        ? JSON.parse(data.aadharCardFile)
                        : [],
                    udidCardFile: data.udidCardFile
                        ? JSON.parse(data.udidCardFile)
                        : [],
                    disabilityCertificateFile: data.disabilityCertificateFile
                        ? JSON.parse(data.disabilityCertificateFile)
                        : [],
                    bankPassbookFile: data.bankPassbookFile
                        ? JSON.parse(data.bankPassbookFile)
                        : [],
                    healthInsuranceFile: data.healthInsuranceFile
                        ? JSON.parse(data.healthInsuranceFile)
                        : [],
                    medicalReportFile: data.medicalReportFile
                        ? JSON.parse(data.medicalReportFile)
                        : [],
                    dischargeSummaryFile: data.dischargeSummaryFile
                        ? JSON.parse(data.dischargeSummaryFile)
                        : [],
                    medicationsFile: data.medicationsFile
                        ? JSON.parse(data.medicationsFile)
                        : [],
                    ClothesFile: data.ClothesFile
                        ? JSON.parse(data.ClothesFile)
                        : [],
                    possessionsRecoveredFile: data.possessionsRecoveredFile
                        ? JSON.parse(data.possessionsRecoveredFile)
                        : [],
                    dischargeAllowanceFile: data.dischargeAllowanceFile
                        ? JSON.parse(data.dischargeAllowanceFile)
                        : [],
                    travelExpensesFile: data.travelExpensesFile
                        ? JSON.parse(data.travelExpensesFile)
                        : [],
                    copyOfdischargeSummaryFile: data.copyOfdischargeSummaryFile
                        ? JSON.parse(data.copyOfdischargeSummaryFile)
                        : [],
                    travelSafetyLetterFile: data.travelSafetyLetterFile
                        ? JSON.parse(data.travelSafetyLetterFile)
                        : [],
                    reunionPhotoFile: data.reunionPhotoFile
                        ? JSON.parse(data.reunionPhotoFile)
                        : [],
                    witnessSignatureFile: data.witnessSignatureFile
                        ? JSON.parse(data.witnessSignatureFile)
                        : [],
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
            if (formData[key] instanceof FileList || Array.isArray(formData[key])) {
                for (let i = 0; i < formData[key].length; i++) {
                    formPayload.append(key, formData[key][i]); // ✅ appends multiple files correctly
                }


            }

            else {
                formPayload.append(key, formData[key]);
            }
        }

        console.log("FamilyRequestLetterFile:", formData.familyRequestLetterFile);


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
                                        <Col sm="5" className="d-flex align-items-center">
                                            <Form.Label column sm="2">
                                                Attach:
                                            </Form.Label>
                                            <Col sm="5">
                                                <Form.Control
                                                    type="file"
                                                    accept=".jpg,.jpeg,.png"
                                                    name="familyRequestLetterFile"
                                                    onChange={handleChange}
                                                    multiple
                                                    required={formData.familyRequestLetter === "Yes"}
                                                />
                                            </Col>
                                            <Col md="4" className='d-flex'>
                                                {Array.isArray(formData.familyRequestLetterFile) && formData.familyRequestLetterFile.length > 0 ? (
                                                    <div className="mt-2 d-flex align-items-center justify-content-between">
                                                        {formData.familyRequestLetterFile.map((filePath, index) => {
                                                            const fullUrl = `http://localhost:5002/${filePath}`;
                                                            const filename = filePath?.split('/').pop();
                                                            return (
                                                                <a
                                                                    key={index}
                                                                    href={fullUrl}
                                                                    download={filename}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="d-block text-primary mx-3"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        fetch(fullUrl)
                                                                            .then((res) => res.blob())
                                                                            .then((blob) => {
                                                                                const url = window.URL.createObjectURL(blob);
                                                                                const a = document.createElement('a');
                                                                                a.href = url;
                                                                                a.download = filename || 'image.jpg';
                                                                                a.click();
                                                                                window.URL.revokeObjectURL(url);

                                                                                // Open in new tab after download
                                                                                window.open(fullUrl, '_blank', 'noopener,noreferrer');
                                                                            })
                                                                            .catch(() => alert('Download failed.'));
                                                                    }}
                                                                >
                                                                    View {index + 1}
                                                                </a>
                                                            );
                                                        })}
                                                    </div>
                                                ) : (
                                                    <div className="text-muted">Null</div>
                                                )}
                                            </Col>

                                            {/* Show view links if files exist */}

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
                                        <Col sm="5" className="d-flex align-items-center">
                                            <Form.Label column sm="2">
                                                Attach:
                                            </Form.Label>
                                            <Col sm="5">
                                                <Form.Control
                                                    type="file"
                                                    accept=".jpg,.jpeg,.png"
                                                    name="selfDeclarationFile"
                                                    onChange={handleChange}
                                                    multiple
                                                    required={formData.selfDeclarationLetter === "Yes"}
                                                />
                                            </Col>
                                            <Col md="4" className='d-flex'>
                                                {Array.isArray(formData.selfDeclarationFile) && formData.selfDeclarationFile.length > 0 ? (
                                                    <div className="mt-2 d-flex align-items-center justify-content-between">
                                                        {formData.selfDeclarationFile.map((filePath, index) => {
                                                            const fullUrl = `http://localhost:5002/${filePath}`;
                                                            const filename = filePath?.split('/').pop();
                                                            return (
                                                                <a
                                                                    key={index}
                                                                    href={fullUrl}
                                                                    download={filename}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="d-block text-primary mx-3"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        fetch(fullUrl)
                                                                            .then((res) => res.blob())
                                                                            .then((blob) => {
                                                                                const url = window.URL.createObjectURL(blob);
                                                                                const a = document.createElement('a');
                                                                                a.href = url;
                                                                                a.download = filename || 'image.jpg';
                                                                                a.click();
                                                                                window.URL.revokeObjectURL(url);

                                                                                // Open in new tab after download
                                                                                window.open(fullUrl, '_blank', 'noopener,noreferrer');
                                                                            })
                                                                            .catch(() => alert('Download failed.'));
                                                                    }}
                                                                >
                                                                    View {index + 1}
                                                                </a>
                                                            );
                                                        })}
                                                    </div>
                                                ) : (
                                                    <div className="text-muted">Null</div>
                                                )}
                                            </Col>

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
                                        <Col sm="5" className="d-flex align-items-center">
                                            <Form.Label column sm="2">
                                                Attach:
                                            </Form.Label>
                                            <Col sm="5">
                                                <Form.Control
                                                    type="file"
                                                    accept=".jpg,.jpeg,.png"
                                                    name="mediaConsentFile"
                                                    onChange={handleChange}
                                                    multiple
                                                    required={formData.mediaConsentLetter === "Yes"}
                                                />
                                            </Col>
                                            <Col md="4" className='d-flex'>
                                                {Array.isArray(formData.mediaConsentFile) && formData.mediaConsentFile.length > 0 ? (
                                                    <div className="mt-2 d-flex align-items-center justify-content-between">
                                                        {formData.mediaConsentFile.map((filePath, index) => {
                                                            const fullUrl = `http://localhost:5002/${filePath}`;
                                                            const filename = filePath?.split('/').pop();
                                                            return (
                                                                <a
                                                                    key={index}
                                                                    href={fullUrl}
                                                                    download={filename}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="d-block text-primary mx-3"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        fetch(fullUrl)
                                                                            .then((res) => res.blob())
                                                                            .then((blob) => {
                                                                                const url = window.URL.createObjectURL(blob);
                                                                                const a = document.createElement('a');
                                                                                a.href = url;
                                                                                a.download = filename || 'image.jpg';
                                                                                a.click();
                                                                                window.URL.revokeObjectURL(url);

                                                                                // Open in new tab after download
                                                                                window.open(fullUrl, '_blank', 'noopener,noreferrer');
                                                                            })
                                                                            .catch(() => alert('Download failed.'));
                                                                    }}
                                                                >
                                                                    View {index + 1}
                                                                </a>
                                                            );
                                                        })}
                                                    </div>
                                                ) : (
                                                    <div className="text-muted">Null</div>
                                                )}
                                            </Col>

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
                                        <Col sm="5" className="d-flex align-items-center">
                                            <Form.Label column sm="2">
                                                Attach:
                                            </Form.Label>
                                            <Col sm="5">
                                                <Form.Control
                                                    type="file"
                                                    accept=".jpg,.jpeg,.png"
                                                    name="familyIDproofFile"
                                                    onChange={handleChange}
                                                    multiple
                                                    required={formData.familyIDproof === "Yes"}
                                                />
                                            </Col>
                                            <Col md="4" className='d-flex'>
                                                {Array.isArray(formData.familyIDproofFile) && formData.familyIDproofFile.length > 0 ? (
                                                    <div className="mt-2 d-flex align-items-center justify-content-between">
                                                        {formData.familyIDproofFile.map((filePath, index) => {
                                                            const fullUrl = `https://www.pahrultours.com/app2/${filePath}`;
                                                            const filename = filePath?.split('/').pop();
                                                            return (
                                                                <a
                                                                    key={index}
                                                                    href={fullUrl}
                                                                    download={filename}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="d-block text-primary mx-3"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        fetch(fullUrl)
                                                                            .then((res) => res.blob())
                                                                            .then((blob) => {
                                                                                const url = window.URL.createObjectURL(blob);
                                                                                const a = document.createElement('a');
                                                                                a.href = url;
                                                                                a.download = filename || 'image.jpg';
                                                                                a.click();
                                                                                window.URL.revokeObjectURL(url);

                                                                                // Open in new tab after download
                                                                                window.open(fullUrl, '_blank', 'noopener,noreferrer');
                                                                            })
                                                                            .catch(() => alert('Download failed.'));
                                                                    }}
                                                                >
                                                                    View {index + 1}
                                                                </a>
                                                            );
                                                        })}
                                                    </div>
                                                ) : (
                                                    <div className="text-muted">Null</div>
                                                )}
                                            </Col>

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
                                        <Col sm="5" className="d-flex align-items-center">
                                            <Form.Label column sm="2">
                                                Attach:
                                            </Form.Label>
                                            <Col sm="5">
                                                <Form.Control
                                                    type="file"
                                                    accept=".jpg,.jpeg,.png"
                                                    name="residentIDproofFile"
                                                    onChange={handleChange}
                                                    multiple
                                                    required={formData.residentIDproof === "Yes"}
                                                />
                                            </Col>
                                            <Col md="4" className='d-flex'>
                                                {Array.isArray(formData.residentIDproofFile) && formData.residentIDproofFile.length > 0 ? (
                                                    <div className="mt-2 d-flex align-items-center justify-content-between">
                                                        {formData.residentIDproofFile.map((filePath, index) => {
                                                            const fullUrl = `https://www.pahrultours.com/app2/${filePath}`;
                                                            const filename = filePath?.split('/').pop();
                                                            return (
                                                                <a
                                                                    key={index}
                                                                    href={fullUrl}
                                                                    download={filename}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="d-block text-primary mx-3"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        fetch(fullUrl)
                                                                            .then((res) => res.blob())
                                                                            .then((blob) => {
                                                                                const url = window.URL.createObjectURL(blob);
                                                                                const a = document.createElement('a');
                                                                                a.href = url;
                                                                                a.download = filename || 'image.jpg';
                                                                                a.click();
                                                                                window.URL.revokeObjectURL(url);

                                                                                // Open in new tab after download
                                                                                window.open(fullUrl, '_blank', 'noopener,noreferrer');
                                                                            })
                                                                            .catch(() => alert('Download failed.'));
                                                                    }}
                                                                >
                                                                    View {index + 1}
                                                                </a>
                                                            );
                                                        })}
                                                    </div>
                                                ) : (
                                                    <div className="text-muted">Null</div>
                                                )}
                                            </Col>

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
                                        <Col sm="5" className="d-flex align-items-center">
                                            <Form.Label column sm="2">
                                                Attach:
                                            </Form.Label>
                                            <Col sm="5">
                                                <Form.Control
                                                    type="file"
                                                    accept=".jpg,.jpeg,.png"
                                                    name="aadharCardFile"
                                                    onChange={handleChange}
                                                    multiple
                                                    required={formData.aadharCard === "Yes"}
                                                />
                                            </Col>
                                            <Col md="4" className='d-flex'>
                                                {Array.isArray(formData.aadharCardFile) && formData.aadharCardFile.length > 0 ? (
                                                    <div className="mt-2 d-flex align-items-center justify-content-between">
                                                        {formData.aadharCardFile.map((filePath, index) => {
                                                            const fullUrl = `https://www.pahrultours.com/app2/${filePath}`;
                                                            const filename = filePath?.split('/').pop();
                                                            return (
                                                                <a
                                                                    key={index}
                                                                    href={fullUrl}
                                                                    download={filename}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="d-block text-primary mx-3"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        fetch(fullUrl)
                                                                            .then((res) => res.blob())
                                                                            .then((blob) => {
                                                                                const url = window.URL.createObjectURL(blob);
                                                                                const a = document.createElement('a');
                                                                                a.href = url;
                                                                                a.download = filename || 'image.jpg';
                                                                                a.click();
                                                                                window.URL.revokeObjectURL(url);

                                                                                // Open in new tab after download
                                                                                window.open(fullUrl, '_blank', 'noopener,noreferrer');
                                                                            })
                                                                            .catch(() => alert('Download failed.'));
                                                                    }}
                                                                >
                                                                    View {index + 1}
                                                                </a>
                                                            );
                                                        })}
                                                    </div>
                                                ) : (
                                                    <div className="text-muted">Null</div>
                                                )}
                                            </Col>

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
                                        <Col sm="5" className="d-flex align-items-center">
                                            <Form.Label column sm="2">
                                                Attach:
                                            </Form.Label>
                                            <Col sm="5">
                                                <Form.Control
                                                    type="file"
                                                    accept=".jpg,.jpeg,.png"
                                                    name="udidCardFile"
                                                    onChange={handleChange}
                                                    multiple
                                                    required={formData.udidCard === "Yes"}
                                                />
                                            </Col>

                                            <Col md="4" className='d-flex'>
                                                {Array.isArray(formData.udidCardFile) && formData.udidCardFile.length > 0 ? (
                                                    <div className="mt-2 d-flex align-items-center justify-content-between">
                                                        {formData.udidCardFile.map((filePath, index) => {
                                                            const fullUrl = `https://www.pahrultours.com/app2/${filePath}`;
                                                            const filename = filePath?.split('/').pop();
                                                            return (
                                                                <a
                                                                    key={index}
                                                                    href={fullUrl}
                                                                    download={filename}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="d-block text-primary mx-3"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        fetch(fullUrl)
                                                                            .then((res) => res.blob())
                                                                            .then((blob) => {
                                                                                const url = window.URL.createObjectURL(blob);
                                                                                const a = document.createElement('a');
                                                                                a.href = url;
                                                                                a.download = filename || 'image.jpg';
                                                                                a.click();
                                                                                window.URL.revokeObjectURL(url);

                                                                                // Open in new tab after download
                                                                                window.open(fullUrl, '_blank', 'noopener,noreferrer');
                                                                            })
                                                                            .catch(() => alert('Download failed.'));
                                                                    }}
                                                                >
                                                                    View {index + 1}
                                                                </a>
                                                            );
                                                        })}
                                                    </div>
                                                ) : (
                                                    <div className="text-muted">Null</div>
                                                )}
                                            </Col>

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
                                        <Col sm="5" className="d-flex align-items-center">
                                            <Form.Label column sm="2">
                                                Attach:
                                            </Form.Label>
                                            <Col sm="5">
                                                <Form.Control
                                                    type="file"
                                                    accept=".jpg,.jpeg,.png"
                                                    name="disabilityCertificateFile"
                                                    onChange={handleChange}
                                                    multiple
                                                    required={formData.disabilityCertificate === "Yes"}
                                                />
                                            </Col>
                                            <Col md="4" className='d-flex'>
                                                {Array.isArray(formData.disabilityCertificateFile) && formData.disabilityCertificateFile.length > 0 ? (
                                                    <div className="mt-2 d-flex align-items-center justify-content-between">
                                                        {formData.disabilityCertificateFile.map((filePath, index) => {
                                                            const fullUrl = `https://www.pahrultours.com/app2/${filePath}`;
                                                            const filename = filePath?.split('/').pop();
                                                            return (
                                                                <a
                                                                    key={index}
                                                                    href={fullUrl}
                                                                    download={filename}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="d-block text-primary mx-3"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        fetch(fullUrl)
                                                                            .then((res) => res.blob())
                                                                            .then((blob) => {
                                                                                const url = window.URL.createObjectURL(blob);
                                                                                const a = document.createElement('a');
                                                                                a.href = url;
                                                                                a.download = filename || 'image.jpg';
                                                                                a.click();
                                                                                window.URL.revokeObjectURL(url);

                                                                                // Open in new tab after download
                                                                                window.open(fullUrl, '_blank', 'noopener,noreferrer');
                                                                            })
                                                                            .catch(() => alert('Download failed.'));
                                                                    }}
                                                                >
                                                                    View {index + 1}
                                                                </a>
                                                            );
                                                        })}
                                                    </div>
                                                ) : (
                                                    <div className="text-muted">Null</div>
                                                )}
                                            </Col>

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
                                        <Col sm="5" className="d-flex align-items-center">
                                            <Form.Label column sm="2">
                                                Attach:
                                            </Form.Label>
                                            <Col sm="5">
                                                <Form.Control
                                                    type="file"
                                                    accept=".jpg,.jpeg,.png"
                                                    name="bankPassbookFile"
                                                    multiple
                                                    onChange={handleChange}
                                                    required={formData.bankPassbook === "Yes"}
                                                />
                                            </Col>

                                            <Col md="4" className='d-flex'>
                                                {Array.isArray(formData.bankPassbookFile) && formData.bankPassbookFile.length > 0 ? (
                                                    <div className="mt-2 d-flex align-items-center justify-content-between">
                                                        {formData.bankPassbookFile.map((filePath, index) => {
                                                            const fullUrl = `https://www.pahrultours.com/app2/${filePath}`;
                                                            const filename = filePath?.split('/').pop();
                                                            return (
                                                                <a
                                                                    key={index}
                                                                    href={fullUrl}
                                                                    download={filename}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="d-block text-primary mx-3"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        fetch(fullUrl)
                                                                            .then((res) => res.blob())
                                                                            .then((blob) => {
                                                                                const url = window.URL.createObjectURL(blob);
                                                                                const a = document.createElement('a');
                                                                                a.href = url;
                                                                                a.download = filename || 'image.jpg';
                                                                                a.click();
                                                                                window.URL.revokeObjectURL(url);

                                                                                // Open in new tab after download
                                                                                window.open(fullUrl, '_blank', 'noopener,noreferrer');
                                                                            })
                                                                            .catch(() => alert('Download failed.'));
                                                                    }}
                                                                >
                                                                    View {index + 1}
                                                                </a>
                                                            );
                                                        })}
                                                    </div>
                                                ) : (
                                                    <div className="text-muted">Null</div>
                                                )}
                                            </Col>

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
                                        <Col sm="5" className="d-flex align-items-center">
                                            <Form.Label column sm="2">
                                                Attach:
                                            </Form.Label>
                                            <Col sm="5">
                                                <Form.Control
                                                    type="file"
                                                    accept=".jpg,.jpeg,.png"
                                                    name="healthInsuranceFile"
                                                    onChange={handleChange}
                                                    multiple
                                                    required={formData.healthInsurance === "Yes"}
                                                />
                                            </Col>
                                            <Col md="4" className='d-flex'>
                                                {Array.isArray(formData.healthInsuranceFile) && formData.healthInsuranceFile.length > 0 ? (
                                                    <div className="mt-2 d-flex align-items-center justify-content-between">
                                                        {formData.healthInsuranceFile.map((filePath, index) => {
                                                            const fullUrl = `https://www.pahrultours.com/app2/${filePath}`;
                                                            const filename = filePath?.split('/').pop();
                                                            return (
                                                                <a
                                                                    key={index}
                                                                    href={fullUrl}
                                                                    download={filename}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="d-block text-primary mx-3"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        fetch(fullUrl)
                                                                            .then((res) => res.blob())
                                                                            .then((blob) => {
                                                                                const url = window.URL.createObjectURL(blob);
                                                                                const a = document.createElement('a');
                                                                                a.href = url;
                                                                                a.download = filename || 'image.jpg';
                                                                                a.click();
                                                                                window.URL.revokeObjectURL(url);

                                                                                // Open in new tab after download
                                                                                window.open(fullUrl, '_blank', 'noopener,noreferrer');
                                                                            })
                                                                            .catch(() => alert('Download failed.'));
                                                                    }}
                                                                >
                                                                    View {index + 1}
                                                                </a>
                                                            );
                                                        })}
                                                    </div>
                                                ) : (
                                                    <div className="text-muted">Null</div>
                                                )}
                                            </Col>

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
                                        <Col sm="5" className="d-flex align-items-center">
                                            <Form.Label column sm="2">
                                                Attach:
                                            </Form.Label>
                                            <Col sm="5">
                                                <Form.Control
                                                    type="file"
                                                    accept=".jpg,.jpeg,.png"
                                                    name="medicalReportFile"
                                                    onChange={handleChange}
                                                    multiple
                                                    required={formData.medicalReport === "Yes"}
                                                />
                                            </Col>

                                            <Col md="4" className='d-flex'>
                                                {Array.isArray(formData.medicalReportFile) && formData.medicalReportFile.length > 0 ? (
                                                    <div className="mt-2 d-flex align-items-center justify-content-between">
                                                        {formData.medicalReportFile.map((filePath, index) => {
                                                            const fullUrl = `https://www.pahrultours.com/app2/${filePath}`;
                                                            const filename = filePath?.split('/').pop();
                                                            return (
                                                                <a
                                                                    key={index}
                                                                    href={fullUrl}
                                                                    download={filename}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="d-block text-primary mx-3"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        fetch(fullUrl)
                                                                            .then((res) => res.blob())
                                                                            .then((blob) => {
                                                                                const url = window.URL.createObjectURL(blob);
                                                                                const a = document.createElement('a');
                                                                                a.href = url;
                                                                                a.download = filename || 'image.jpg';
                                                                                a.click();
                                                                                window.URL.revokeObjectURL(url);

                                                                                // Open in new tab after download
                                                                                window.open(fullUrl, '_blank', 'noopener,noreferrer');
                                                                            })
                                                                            .catch(() => alert('Download failed.'));
                                                                    }}
                                                                >
                                                                    View {index + 1}
                                                                </a>
                                                            );
                                                        })}
                                                    </div>
                                                ) : (
                                                    <div className="text-muted">Null</div>
                                                )}
                                            </Col>

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
                                        <Col sm="5" className="d-flex align-items-center">
                                            <Form.Label column sm="2">
                                                Attach:
                                            </Form.Label>
                                            <Col sm="5">
                                                <Form.Control
                                                    type="file"
                                                    accept=".jpg,.jpeg,.png"
                                                    name="dischargeSummaryFile"
                                                    onChange={handleChange}
                                                    multiple
                                                    required={formData.dischargeSummary === "Yes"}
                                                />
                                            </Col>
                                            <Col md="4" className='d-flex'>
                                                {Array.isArray(formData.dischargeSummaryFile) && formData.dischargeSummaryFile.length > 0 ? (
                                                    <div className="mt-2 d-flex align-items-center justify-content-between">
                                                        {formData.dischargeSummaryFile.map((filePath, index) => {
                                                            const fullUrl = `https://www.pahrultours.com/app2/${filePath}`;
                                                            const filename = filePath?.split('/').pop();
                                                            return (
                                                                <a
                                                                    key={index}
                                                                    href={fullUrl}
                                                                    download={filename}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="d-block text-primary mx-3"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        fetch(fullUrl)
                                                                            .then((res) => res.blob())
                                                                            .then((blob) => {
                                                                                const url = window.URL.createObjectURL(blob);
                                                                                const a = document.createElement('a');
                                                                                a.href = url;
                                                                                a.download = filename || 'image.jpg';
                                                                                a.click();
                                                                                window.URL.revokeObjectURL(url);

                                                                                // Open in new tab after download
                                                                                window.open(fullUrl, '_blank', 'noopener,noreferrer');
                                                                            })
                                                                            .catch(() => alert('Download failed.'));
                                                                    }}
                                                                >
                                                                    View {index + 1}
                                                                </a>
                                                            );
                                                        })}
                                                    </div>
                                                ) : (
                                                    <div className="text-muted">Null</div>
                                                )}
                                            </Col>

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
                                        <Col sm="5" className="d-flex align-items-center">
                                            <Form.Label column sm="2">
                                                Attach:
                                            </Form.Label>
                                            <Col sm="5">
                                                <Form.Control
                                                    type="file"
                                                    accept=".jpg,.jpeg,.png"
                                                    name="medicationsFile"
                                                    onChange={handleChange}
                                                    multiple
                                                    required={formData.medications === "Yes"}
                                                />
                                            </Col>

                                            <Col md="4" className='d-flex'>
                                                {Array.isArray(formData.medicationsFile) && formData.medicationsFile.length > 0 ? (
                                                    <div className="mt-2 d-flex align-items-center justify-content-between">
                                                        {formData.medicationsFile.map((filePath, index) => {
                                                            const fullUrl = `https://www.pahrultours.com/app2/${filePath}`;
                                                            const filename = filePath?.split('/').pop();
                                                            return (
                                                                <a
                                                                    key={index}
                                                                    href={fullUrl}
                                                                    download={filename}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="d-block text-primary mx-3"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        fetch(fullUrl)
                                                                            .then((res) => res.blob())
                                                                            .then((blob) => {
                                                                                const url = window.URL.createObjectURL(blob);
                                                                                const a = document.createElement('a');
                                                                                a.href = url;
                                                                                a.download = filename || 'image.jpg';
                                                                                a.click();
                                                                                window.URL.revokeObjectURL(url);

                                                                                // Open in new tab after download
                                                                                window.open(fullUrl, '_blank', 'noopener,noreferrer');
                                                                            })
                                                                            .catch(() => alert('Download failed.'));
                                                                    }}
                                                                >
                                                                    View {index + 1}
                                                                </a>
                                                            );
                                                        })}
                                                    </div>
                                                ) : (
                                                    <div className="text-muted">Null</div>
                                                )}
                                            </Col>

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
                                        <Col sm="5" className="d-flex align-items-center">
                                            <Form.Label column sm="2">
                                                Attach:
                                            </Form.Label>
                                            <Col sm="5">
                                                <Form.Control
                                                    type="file"
                                                    accept=".jpg,.jpeg,.png"
                                                    name="ClothesFile"
                                                    onChange={handleChange}
                                                    multiple
                                                    required={formData.Clothes === "Yes"}
                                                />
                                            </Col>
                                            <Col md="4" className='d-flex'>
                                                {Array.isArray(formData.ClothesFile) && formData.ClothesFile.length > 0 ? (
                                                    <div className="mt-2 d-flex align-items-center justify-content-between">
                                                        {formData.ClothesFile.map((filePath, index) => {
                                                            const fullUrl = `https://www.pahrultours.com/app2/${filePath}`;
                                                            const filename = filePath?.split('/').pop();
                                                            return (
                                                                <a
                                                                    key={index}
                                                                    href={fullUrl}
                                                                    download={filename}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="d-block text-primary mx-3"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        fetch(fullUrl)
                                                                            .then((res) => res.blob())
                                                                            .then((blob) => {
                                                                                const url = window.URL.createObjectURL(blob);
                                                                                const a = document.createElement('a');
                                                                                a.href = url;
                                                                                a.download = filename || 'image.jpg';
                                                                                a.click();
                                                                                window.URL.revokeObjectURL(url);

                                                                                // Open in new tab after download
                                                                                window.open(fullUrl, '_blank', 'noopener,noreferrer');
                                                                            })
                                                                            .catch(() => alert('Download failed.'));
                                                                    }}
                                                                >
                                                                    View {index + 1}
                                                                </a>
                                                            );
                                                        })}
                                                    </div>
                                                ) : (
                                                    <div className="text-muted">Null</div>
                                                )}
                                            </Col>

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
                                        <Col sm="5" className="d-flex align-items-center">
                                            <Form.Label column sm="2">
                                                Attach:
                                            </Form.Label>
                                            <Col sm="5">
                                                <Form.Control
                                                    type="file"
                                                    accept=".jpg,.jpeg,.png"
                                                    name="possessionsRecoveredFile"
                                                    onChange={handleChange}
                                                    multiple
                                                    required={formData.possessionsRecovered === "Yes"}
                                                />
                                            </Col>

                                            <Col md="4" className='d-flex'>
                                                {Array.isArray(formData.possessionsRecoveredFile) && formData.possessionsRecoveredFile.length > 0 ? (
                                                    <div className="mt-2 d-flex align-items-center justify-content-between">
                                                        {formData.possessionsRecoveredFile.map((filePath, index) => {
                                                            const fullUrl = `https://www.pahrultours.com/app2/${filePath}`;
                                                            const filename = filePath?.split('/').pop();
                                                            return (
                                                                <a
                                                                    key={index}
                                                                    href={fullUrl}
                                                                    download={filename}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="d-block text-primary mx-3"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        fetch(fullUrl)
                                                                            .then((res) => res.blob())
                                                                            .then((blob) => {
                                                                                const url = window.URL.createObjectURL(blob);
                                                                                const a = document.createElement('a');
                                                                                a.href = url;
                                                                                a.download = filename || 'image.jpg';
                                                                                a.click();
                                                                                window.URL.revokeObjectURL(url);

                                                                                // Open in new tab after download
                                                                                window.open(fullUrl, '_blank', 'noopener,noreferrer');
                                                                            })
                                                                            .catch(() => alert('Download failed.'));
                                                                    }}
                                                                >
                                                                    View {index + 1}
                                                                </a>
                                                            );
                                                        })}
                                                    </div>
                                                ) : (
                                                    <div className="text-muted">Null</div>
                                                )}
                                            </Col>

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
                                        <Col sm="5" className="d-flex align-items-center">
                                            <Form.Label column sm="2">
                                                Attach:
                                            </Form.Label>
                                            <Col sm="5">
                                                <Form.Control
                                                    type="file"
                                                    accept=".jpg,.jpeg,.png"
                                                    name="dischargeAllowanceFile"
                                                    onChange={handleChange}
                                                    multiple
                                                    required={formData.dischargeAllowance === "Yes"}
                                                />
                                            </Col>
                                            <Col md="4" className='d-flex'>
                                                {Array.isArray(formData.dischargeAllowanceFile) && formData.dischargeAllowanceFile.length > 0 ? (
                                                    <div className="mt-2 d-flex align-items-center justify-content-between">
                                                        {formData.dischargeAllowanceFile.map((filePath, index) => {
                                                            const fullUrl = `https://www.pahrultours.com/app2/${filePath}`;
                                                            const filename = filePath?.split('/').pop();
                                                            return (
                                                                <a
                                                                    key={index}
                                                                    href={fullUrl}
                                                                    download={filename}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="d-block text-primary mx-3"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        fetch(fullUrl)
                                                                            .then((res) => res.blob())
                                                                            .then((blob) => {
                                                                                const url = window.URL.createObjectURL(blob);
                                                                                const a = document.createElement('a');
                                                                                a.href = url;
                                                                                a.download = filename || 'image.jpg';
                                                                                a.click();
                                                                                window.URL.revokeObjectURL(url);

                                                                                // Open in new tab after download
                                                                                window.open(fullUrl, '_blank', 'noopener,noreferrer');
                                                                            })
                                                                            .catch(() => alert('Download failed.'));
                                                                    }}
                                                                >
                                                                    View {index + 1}
                                                                </a>
                                                            );
                                                        })}
                                                    </div>
                                                ) : (
                                                    <div className="text-muted">Null</div>
                                                )}
                                            </Col>

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
                                        <Col sm="5" className="d-flex align-items-center">
                                            <Form.Label column sm="2">
                                                Attach:
                                            </Form.Label>
                                            <Col sm="5">
                                                <Form.Control
                                                    type="file"
                                                    accept=".jpg,.jpeg,.png"
                                                    name="travelExpensesFile"
                                                    onChange={handleChange}
                                                    multiple
                                                    required={formData.travelExpenses === "Yes"}
                                                />
                                            </Col>
                                            <Col md="4" className='d-flex'>
                                                {Array.isArray(formData.travelExpensesFile) && formData.travelExpensesFile.length > 0 ? (
                                                    <div className="mt-2 d-flex align-items-center justify-content-between">
                                                        {formData.travelExpensesFile.map((filePath, index) => {
                                                            const fullUrl = `https://www.pahrultours.com/app2/${filePath}`;
                                                            const filename = filePath?.split('/').pop();
                                                            return (
                                                                <a
                                                                    key={index}
                                                                    href={fullUrl}
                                                                    download={filename}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="d-block text-primary mx-3"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        fetch(fullUrl)
                                                                            .then((res) => res.blob())
                                                                            .then((blob) => {
                                                                                const url = window.URL.createObjectURL(blob);
                                                                                const a = document.createElement('a');
                                                                                a.href = url;
                                                                                a.download = filename || 'image.jpg';
                                                                                a.click();
                                                                                window.URL.revokeObjectURL(url);

                                                                                // Open in new tab after download
                                                                                window.open(fullUrl, '_blank', 'noopener,noreferrer');
                                                                            })
                                                                            .catch(() => alert('Download failed.'));
                                                                    }}
                                                                >
                                                                    View {index + 1}
                                                                </a>
                                                            );
                                                        })}
                                                    </div>
                                                ) : (
                                                    <div className="text-muted">Null</div>
                                                )}
                                            </Col>

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
                                        <Col sm="5" className="d-flex align-items-center">
                                            <Form.Label column sm="2">
                                                Attach:
                                            </Form.Label>
                                            <Col sm="5">
                                                <Form.Control
                                                    type="file"
                                                    accept=".jpg,.jpeg,.png"
                                                    name="copyOfdischargeSummaryFile"
                                                    onChange={handleChange}
                                                    multiple
                                                    required={formData.copyOfdischargeSummary === "Yes"}
                                                />
                                            </Col>
                                            <Col md="4" className='d-flex'>
                                                {Array.isArray(formData.copyOfdischargeSummaryFile) && formData.copyOfdischargeSummaryFile.length > 0 ? (
                                                    <div className="mt-2 d-flex align-items-center justify-content-between">
                                                        {formData.copyOfdischargeSummaryFile.map((filePath, index) => {
                                                            const fullUrl = `https://www.pahrultours.com/app2/${filePath}`;
                                                            const filename = filePath?.split('/').pop();
                                                            return (
                                                                <a
                                                                    key={index}
                                                                    href={fullUrl}
                                                                    download={filename}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="d-block text-primary mx-3"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        fetch(fullUrl)
                                                                            .then((res) => res.blob())
                                                                            .then((blob) => {
                                                                                const url = window.URL.createObjectURL(blob);
                                                                                const a = document.createElement('a');
                                                                                a.href = url;
                                                                                a.download = filename || 'image.jpg';
                                                                                a.click();
                                                                                window.URL.revokeObjectURL(url);

                                                                                // Open in new tab after download
                                                                                window.open(fullUrl, '_blank', 'noopener,noreferrer');
                                                                            })
                                                                            .catch(() => alert('Download failed.'));
                                                                    }}
                                                                >
                                                                    View {index + 1}
                                                                </a>
                                                            );
                                                        })}
                                                    </div>
                                                ) : (
                                                    <div className="text-muted">Null</div>
                                                )}
                                            </Col>

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
                                        <Col sm="5" className="d-flex align-items-center">
                                            <Form.Label column sm="2">
                                                Attach:
                                            </Form.Label>
                                            <Col sm="5">
                                                <Form.Control
                                                    type="file"
                                                    accept=".jpg,.jpeg,.png"
                                                    name="travelSafetyLetterFile"
                                                    onChange={handleChange}
                                                    multiple
                                                    required={formData.travelSafetyLetter === "Yes"}
                                                />
                                            </Col>
                                            <Col md="4" className='d-flex'>
                                                {Array.isArray(formData.travelSafetyLetterFile) && formData.travelSafetyLetterFile.length > 0 ? (
                                                    <div className="mt-2 d-flex align-items-center justify-content-between">
                                                        {formData.travelSafetyLetterFile.map((filePath, index) => {
                                                            const fullUrl = `https://www.pahrultours.com/app2/${filePath}`;
                                                            const filename = filePath?.split('/').pop();
                                                            return (
                                                                <a
                                                                    key={index}
                                                                    href={fullUrl}
                                                                    download={filename}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="d-block text-primary mx-3"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        fetch(fullUrl)
                                                                            .then((res) => res.blob())
                                                                            .then((blob) => {
                                                                                const url = window.URL.createObjectURL(blob);
                                                                                const a = document.createElement('a');
                                                                                a.href = url;
                                                                                a.download = filename || 'image.jpg';
                                                                                a.click();
                                                                                window.URL.revokeObjectURL(url);

                                                                                // Open in new tab after download
                                                                                window.open(fullUrl, '_blank', 'noopener,noreferrer');
                                                                            })
                                                                            .catch(() => alert('Download failed.'));
                                                                    }}
                                                                >
                                                                    View {index + 1}
                                                                </a>
                                                            );
                                                        })}
                                                    </div>
                                                ) : (
                                                    <div className="text-muted">Null</div>
                                                )}
                                            </Col>

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
                                        <Col sm="5" className="d-flex align-items-center">
                                            <Form.Label column sm="2">
                                                Attach:
                                            </Form.Label>
                                            <Col sm="5">
                                                <Form.Control
                                                    type="file"
                                                    accept=".jpg,.jpeg,.png"
                                                    name="reunionPhotoFile"
                                                    onChange={handleChange}
                                                    multiple
                                                    required={formData.reunionPhoto === "Yes"}
                                                />
                                            </Col>
                                            <Col md="4" className='d-flex'>
                                                {Array.isArray(formData.reunionPhotoFile) && formData.reunionPhotoFile.length > 0 ? (
                                                    <div className="mt-2 d-flex align-items-center justify-content-between">
                                                        {formData.reunionPhotoFile.map((filePath, index) => {
                                                            const fullUrl = `https://www.pahrultours.com/app2/${filePath}`;
                                                            const filename = filePath?.split('/').pop();
                                                            return (
                                                                <a
                                                                    key={index}
                                                                    href={fullUrl}
                                                                    download={filename}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="d-block text-primary mx-3"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        fetch(fullUrl)
                                                                            .then((res) => res.blob())
                                                                            .then((blob) => {
                                                                                const url = window.URL.createObjectURL(blob);
                                                                                const a = document.createElement('a');
                                                                                a.href = url;
                                                                                a.download = filename || 'image.jpg';
                                                                                a.click();
                                                                                window.URL.revokeObjectURL(url);

                                                                                // Open in new tab after download
                                                                                window.open(fullUrl, '_blank', 'noopener,noreferrer');
                                                                            })
                                                                            .catch(() => alert('Download failed.'));
                                                                    }}
                                                                >
                                                                    View {index + 1}
                                                                </a>
                                                            );
                                                        })}
                                                    </div>
                                                ) : (
                                                    <div className="text-muted">Null</div>
                                                )}
                                            </Col>

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
                                        <Col sm="5" className="d-flex align-items-center">
                                            <Form.Label column sm="2">
                                                Attach:
                                            </Form.Label>
                                            <Col sm="5">
                                                <Form.Control
                                                    type="file"
                                                    accept=".jpg,.jpeg,.png"
                                                    name="witnessSignatureFile"
                                                    onChange={handleChange}
                                                    multiple
                                                    required={formData.witnessSignature === "Yes"}
                                                />
                                            </Col>
                                            <Col md="4" className='d-flex'>
                                                {Array.isArray(formData.witnessSignatureFile) && formData.witnessSignatureFile.length > 0 ? (
                                                    <div className="mt-2 d-flex align-items-center justify-content-between">
                                                        {formData.witnessSignatureFile.map((filePath, index) => {
                                                            const fullUrl = `https://www.pahrultours.com/app2/${filePath}`;
                                                            const filename = filePath?.split('/').pop();
                                                            return (
                                                                <a
                                                                    key={index}
                                                                    href={fullUrl}
                                                                    download={filename}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="d-block text-primary mx-3"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        fetch(fullUrl)
                                                                            .then((res) => res.blob())
                                                                            .then((blob) => {
                                                                                const url = window.URL.createObjectURL(blob);
                                                                                const a = document.createElement('a');
                                                                                a.href = url;
                                                                                a.download = filename || 'image.jpg';
                                                                                a.click();
                                                                                window.URL.revokeObjectURL(url);

                                                                                // Open in new tab after download
                                                                                window.open(fullUrl, '_blank', 'noopener,noreferrer');
                                                                            })
                                                                            .catch(() => alert('Download failed.'));
                                                                    }}
                                                                >
                                                                    View {index + 1}
                                                                </a>
                                                            );
                                                        })}
                                                    </div>
                                                ) : (
                                                    <div className="text-muted">Null</div>
                                                )}
                                            </Col>

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