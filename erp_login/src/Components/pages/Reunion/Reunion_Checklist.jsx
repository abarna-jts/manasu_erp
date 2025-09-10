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
import imageCompression from 'browser-image-compression';
import { Link } from 'react-router-dom';

function Reunion_Checklist() {
    // const [admission_no, setAdmissionNumber] = useState();
    const [previewRequested, setPreviewRequested] = useState(false);
    const [files, setFiles] = useState({});
    const [rescueImage, setRescueImage] = useState(null);
    const [rescueName, setRescueName] = useState("");
    const [error, setError] = useState("");
    const [admission_no, setAdmissionNumber] = useState('');
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

    // const handleChange = (e) => {
    //     const { name, value, files } = e.target;

    //     if (e.target.type === 'file') {
    //         setFormData(prev => ({
    //             ...prev,
    //             [name]: e.target.files, // Save entire FileList
    //         }));
    //         return;
    //     } else {
    //         setFormData((prevState) => ({
    //             ...prevState,
    //             [name]: value,
    //         }));
    //     }
    // };

    const handleChange = async (e) => {
        const { name, value, files } = e.target;

        if (e.target.type === 'file') {
            const selectedFiles = Array.from(e.target.files);
            if (!selectedFiles.length) return;
            const options = {
                maxSizeMB: 0.5,
                maxWidthOrHeight: 1024,
                useWebWorker: true,
                fileType: "image/jpeg", // force JPEG output
            };
            try {
                // Compress all images
                const compressedFiles = await Promise.all(
                    selectedFiles.map(async (file, idx) => {
                        const compressed = await imageCompression(file, options);

                        // ✅ Log original vs compressed
                        console.log(`File ${idx + 1} Original:`, {
                            name: file.name,
                            size: (file.size / 1024).toFixed(2) + " KB",
                            type: file.type,
                        });
                        console.log(`File ${idx + 1} Compressed:`, {
                            name: `essential_${Date.now()}_${idx}.jpeg`,
                            size: (compressed.size / 1024).toFixed(2) + " KB",
                            type: compressed.type,
                        });

                        // Rename to avoid .blob
                        const ext = compressed.type.split("/")[1]; // e.g. jpeg
                        return new File([compressed], `essential_${Date.now()}_${idx}.${ext}`, {
                            type: compressed.type,
                        });
                    })
                );
                // setFormData(prev => ({
                //     ...prev,
                //     [name]: e.target.files, // Save entire FileList
                // }));
                setFormData((prev) => ({
                    ...prev,
                    [e.target.name]: compressedFiles // ✅ store compressed files
                }));
                console.log("✅ Final compressed files array:", compressedFiles);
            } catch (e) {
                console.error("Compression error:", e);
            }

        } else if (e.target.type === 'radio') {
            setFormData((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        }
    }

    const familyRequestLetterFileRef = useRef(null);
    const selfDeclarationFileRef = useRef(null);
    const mediaConsentFileRef = useRef(null);
    const residentIDproofFileRef = useRef(null);
    const familyIDproofFileRef = useRef(null);
    const aadharCardFileRef = useRef(null);
    const udidCardFileRef = useRef(null);
    const disabilityCertificateFileRef = useRef(null);
    const bankPassbookFileRef = useRef(null);
    const healthInsuranceFileRef = useRef(null);
    const medicalReportFileRef = useRef(null);
    const dischargeSummaryFileRef = useRef(null);
    const medicationsFileRef = useRef(null);
    const ClothesFileRef = useRef(null);
    const possessionsRecoveredFileRef = useRef(null);
    const dischargeAllowanceFileRef = useRef(null);
    const travelExpensesFileRef = useRef(null);
    const copyOfdischargeSummaryFileRef = useRef(null);
    const travelSafetyLetterFileRef = useRef(null);
    const reunionPhotoFileRef = useRef(null);
    const witnessSignatureFileRef = useRef(null);

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

        const data = new FormData();

        for (const key in formData) {
            if (formData[key] instanceof FileList || Array.isArray(formData[key])) {
                for (let i = 0; i < formData[key].length; i++) {
                    data.append(`${key}`, formData[key][i]); // DO NOT append as key[]
                }
            } else {
                data.append(key, formData[key]);
            }
        }



        try {
            await apiRoute.post("/reunion/createDischarge_checklist", data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert('Form submitted successfully!');
            setFormData({
                admission_no: '',
                familyRequestLetter: '',
                selfDeclarationLetter: '',
                mediaConsentLetter: '',
                residentIDproof: '',
                familyIDproof: '',
                aadharCard: '',
                udidCard: '',
                disabilityCertificate: '',
                bankPassbook: '',
                healthInsurance: '',
                medicalReport: '',
                dischargeSummary: '',
                medications: '',
                Clothes: '',
                possessionsRecovered: '',
                dischargeAllowance: '',
                travelExpenses: '',
                copyOfdischargeSummary: '',
                travelSafetyLetter: '',
                reunionPhoto: '',
                witnessSignature: '',
                any_other: '',
            })
            // Clear the file input elements in the DOM
            if (familyRequestLetterFileRef.current) familyRequestLetterFileRef.current.value = "";
            if (selfDeclarationFileRef.current) selfDeclarationFileRef.current.value = "";
            if (mediaConsentFileRef.current) mediaConsentFileRef.current.value = "";
            if (residentIDproofFileRef.current) residentIDproofFileRef.current.value = "";
            if (familyIDproofFileRef.current) familyIDproofFileRef.current.value = "";
            if (aadharCardFileRef.current) aadharCardFileRef.current.value = "";
            if (udidCardFileRef.current) udidCardFileRef.current.value = "";
            if (disabilityCertificateFileRef.current) disabilityCertificateFileRef.current.value = "";
            if (bankPassbookFileRef.current) bankPassbookFileRef.current.value = "";
            if (healthInsuranceFileRef.current) healthInsuranceFileRef.current.value = "";
            if (medicalReportFileRef.current) medicalReportFileRef.current.value = "";
            if (dischargeSummaryFileRef.current) dischargeSummaryFileRef.current.value = "";
            if (medicationsFileRef.current) medicationsFileRef.current.value = "";
            if (ClothesFileRef.current) ClothesFileRef.current.value = "";
            if (possessionsRecoveredFileRef.current) possessionsRecoveredFileRef.current.value = "";
            if (dischargeAllowanceFileRef.current) dischargeAllowanceFileRef.current.value = "";
            if (travelExpensesFileRef.current) travelExpensesFileRef.current.value = "";
            if (copyOfdischargeSummaryFileRef.current) copyOfdischargeSummaryFileRef.current.value = "";
            if (travelSafetyLetterFileRef.current) travelSafetyLetterFileRef.current.value = "";
            if (reunionPhotoFileRef.current) reunionPhotoFileRef.current.value = "";
            if (witnessSignatureFileRef.current) witnessSignatureFileRef.current.value = "";

        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                alert(err.response.data.message);
            } else {
                alert("Something went wrong.");
            }
            console.error(err);
            alert('Error submitting form.');
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
            const response = await apiRoute.get(`/reunion/get_checklist/${admission_no}`);
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
                dischargeAllowance: data.dischargeAllowance || '',
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
                dischargeAllowanceFile: getFilePath(data.dischargeAllowanceFile),
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

    const fetchRescueDetails = async (admission_no) => {
        try {
            const response = await apiRoute.get(`/admision/get_scrbform2data/${admission_no}`);
            const result = response.data.data[0];
            console.log("API Result:", result);

            if (result && result.rescue_image) {
                const imagePath = result.rescue_image.startsWith("http")
                    ? result.rescue_image
                    : `https://www.pahrultours.com/app2/${result.rescue_image}`;

                setRescueImage(imagePath);
                setRescueName(result.rescue_name || "");
                setError("");
            } else {
                setRescueImage(null);
                setRescueName("");
                setError("Image not found for this admission number");
            }
        } catch (error) {
            console.error("Error fetching data", error);
            setRescueImage(null);
            setRescueName("");
            setError("Admission Number Not found");
        }
    };


    // Trigger when admission number changes
    useEffect(() => {
        const adNo = String(admission_no || '').trim();

        if (adNo !== "") {
            fetchRescueDetails(adNo);  // also pass trimmed value
        } else {
            setRescueImage(null);
            setRescueName("");
            setError("");
        }
    }, [admission_no]);

    const handleDelete = async (admission_no) => {
        try {
            const confirmDelete = window.confirm("Are you sure you want to delete this record?");
            if (!confirmDelete) return; // if user clicks 'Cancel', do nothing
            const res = await apiRoute.delete(`/remove/DischargeSummarytoRecycleBin/${admission_no}`);
            console.log(res.data);
            alert("Moved to recycle bin");
            setAdmissionNumber("");
            // refresh table
        } catch (err) {
            console.error(err);
            alert("Error deleting");
        }
    };


    return (
        <>
            <div className="d-flex justify-content-between align-items-center flex-wrap flex-md-nowrap text-start py-2">
                <div className="d-block mb-4 mb-xl-0 px-4 ">
                    <Breadcrumb className="d-none d-md-inline-block mb-0" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
                        <Breadcrumb.Item></Breadcrumb.Item>
                        <Breadcrumb.Item><Link to="/dashboard">Home</Link></Breadcrumb.Item>
                        <Breadcrumb.Item active>Rescue Details</Breadcrumb.Item>
                    </Breadcrumb>
                    <h6 className="breadcrumb_title">Rescue Details</h6>

                </div>
                <div className="text-center col-md-8"><h3 className="section_title">Resident Discharge Summary and Checklist</h3></div>

                <Col md={2} className='text-center'>
                    {error && <div className="text-danger mt-2">{error}</div>}

                    {/* Rescue Name and Image */}
                    {rescueImage && (
                        <div>

                            <img

                                alt={rescueName || "Rescue Image"}
                                style={{ width: "100px", height: "100px" }}
                                src={rescueImage}
                            />
                            {rescueName && <h6 className="mb-2">{rescueName}</h6>}
                        </div>
                    )}
                </Col>
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
                                    name='admission_no'
                                    value={admission_no}
                                    onChange={(e) => setAdmissionNumber(e.target.value)}
                                />
                            </InputGroup>
                        </Col>
                        <button type="button" className="btn btn-secondary mx-1" onClick={() => {
                            if (!admission_no || String(admission_no).trim() === '') {
                                alert("Please enter admission number.");
                            } else {
                                ViewFormData();
                            }
                        }}><FontAwesomeIcon icon={faEye} className="me-0" /></button>
                        {userType === "1" && (
                            <button type="button" className="btn btn-success mx-1" onClick={() => {
                                if (!admission_no.trim()) {
                                    alert("Please enter admission number.");
                                } else {
                                    createFormData();
                                }
                            }}><FontAwesomeIcon icon={faPlus} className="me-0" /></button>
                        )}
                        <button type="button" className="btn btn-success mx-1" onClick={() => {
                            if (!admission_no.trim()) {
                                alert("Please enter admission number.");
                            } else {
                                handleShow(admission_no);
                            }
                        }}><FontAwesomeIcon icon={faEdit} className="me-0" /></button>
                        {userType === "2" && (
                            <button type="button" className="btn btn-danger mx-1" onClick={() => {
                                if (!admission_no.trim()) {
                                    alert("Please enter admission number.");
                                } else {
                                    handleDelete(admission_no); 
                                }
                            }}><FontAwesomeIcon icon={faTrash} className="me-0" /></button>
                        )}
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
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="2">Attach:</Form.Label>
                                                <Col sm="10">
                                                    <Form.Control type="file"
                                                        accept=".jpg,.jpeg,.png"
                                                        name='familyRequestLetterFile'
                                                        onChange={handleChange}
                                                        multiple
                                                        ref={familyRequestLetterFileRef}
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
                                                checked={formData.selfDeclarationLetter === "Yes"}
                                                value="Yes"
                                                onChange={handleChange}
                                            />
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="No"
                                                name="selfDeclarationLetter"
                                                id="selfDeclarationNo"
                                                checked={formData.selfDeclarationLetter === "No"}
                                                value="No"
                                                onChange={handleChange}
                                            />
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="2">Attach:</Form.Label>
                                                <Col sm="10">
                                                    <Form.Control type="file"
                                                        name='selfDeclarationFile'
                                                        accept=".jpg,.jpeg,.png"
                                                        onChange={handleChange}
                                                        multiple
                                                        ref={selfDeclarationFileRef}
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
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="2">Attach:</Form.Label>
                                                <Col sm="10">
                                                    <Form.Control type="file"
                                                        name='mediaConsentFile'
                                                        accept=".jpg,.jpeg,.png"
                                                        ref={medicalReportFileRef}
                                                        multiple
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
                                                checked={formData.familyIDproof === "Yes"}
                                                onChange={handleChange}
                                            />
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="No"
                                                name="familyIDproof"
                                                id="familyIDproofNo"
                                                checked={formData.familyIDproof === "No"}
                                                value="No"
                                                onChange={handleChange}
                                            />
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="2">Attach:</Form.Label>
                                                <Col sm="10">
                                                    <Form.Control type="file"
                                                        name='familyIDproofFile'
                                                        accept=".jpg,.jpeg,.png"
                                                        multiple
                                                        onChange={handleChange}
                                                        ref={familyIDproofFileRef}
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
                                                checked={formData.residentIDproof === "Yes"}
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
                                                checked={formData.residentIDproof === "No"}
                                                onChange={handleChange}
                                            />
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="2">Attach:</Form.Label>
                                                <Col sm="10">
                                                    <Form.Control type="file"
                                                        name='residentIDproofFile'
                                                        accept=".jpg,.jpeg,.png"
                                                        onChange={handleChange}
                                                        multiple
                                                        ref={residentIDproofFileRef}
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
                                                checked={formData.aadharCard === "Yes"}
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
                                                checked={formData.aadharCard === "No"}
                                                onChange={handleChange}
                                            />
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="2">Attach:</Form.Label>
                                                <Col sm="10">
                                                    <Form.Control type="file"
                                                        name='aadharCardFile'
                                                        accept=".jpg,.jpeg,.png"
                                                        onChange={handleChange}
                                                        multiple
                                                        ref={aadharCardFileRef}
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
                                                checked={formData.udidCard === "Yes"}
                                                value="Yes"
                                                onChange={handleChange}
                                            />
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="No"
                                                name="udidCard"
                                                id="udidCardNo"
                                                checked={formData.udidCard === "No"}
                                                value="No"
                                                onChange={handleChange}
                                            />
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="2">Attach:</Form.Label>
                                                <Col sm="10">
                                                    <Form.Control type="file"
                                                        name='udidCardFile'
                                                        accept=".jpg,.jpeg,.png"
                                                        onChange={handleChange}
                                                        multiple
                                                        ref={udidCardFileRef}
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
                                                checked={formData.disabilityCertificate === "Yes"}
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
                                                checked={formData.disabilityCertificate === "No"}
                                                onChange={handleChange}
                                            />
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="2">Attach:</Form.Label>
                                                <Col sm="10">
                                                    <Form.Control type="file"
                                                        name='disabilityCertificateFile'
                                                        accept=".jpg,.jpeg,.png"
                                                        onChange={handleChange}
                                                        ref={disabilityCertificateFileRef}
                                                        multiple
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
                                                checked={formData.bankPassbook === "Yes"}
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
                                                checked={formData.bankPassbook === "No"}
                                                onChange={handleChange}
                                            />
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="2">Attach:</Form.Label>
                                                <Col sm="10">
                                                    <Form.Control type="file"
                                                        name='bankPassbookFile'
                                                        accept=".jpg,.jpeg,.png"
                                                        onChange={handleChange}
                                                        ref={bankPassbookFileRef}
                                                        multiple
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
                                                checked={formData.healthInsurance === "Yes"}
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
                                                checked={formData.healthInsurance === "No"}
                                                onChange={handleChange}
                                            />
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="2">Attach:</Form.Label>
                                                <Col sm="10">
                                                    <Form.Control type="file"
                                                        name='healthInsuranceFile'
                                                        accept=".jpg,.jpeg,.png"
                                                        ref={healthInsuranceFileRef}
                                                        onChange={handleChange}
                                                        multiple
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
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="2">Attach:</Form.Label>
                                                <Col sm="10">
                                                    <Form.Control type="file"
                                                        name='medicalReportFile'
                                                        accept=".jpg,.jpeg,.png"
                                                        ref={medicalReportFileRef}
                                                        onChange={handleChange}
                                                        multiple
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
                                                checked={formData.dischargeSummary === "Yes"}
                                                onChange={handleChange}
                                            />
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="No"
                                                name="dischargeSummary"
                                                id="dischargeSummaryNo"
                                                checked={formData.dischargeSummary === "No"}
                                                value="No"
                                                onChange={handleChange}
                                            />
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="2">Attach:</Form.Label>
                                                <Col sm="10">
                                                    <Form.Control type="file"
                                                        name='dischargeSummaryFile'
                                                        accept=".jpg,.jpeg,.png"
                                                        ref={dischargeSummaryFileRef}
                                                        onChange={handleChange}
                                                        multiple
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
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="2">Attach:</Form.Label>
                                                <Col sm="10">
                                                    <Form.Control type="file"
                                                        name='medicationsFile'
                                                        accept=".jpg,.jpeg,.png"
                                                        ref={medicalReportFileRef}
                                                        onChange={handleChange}
                                                        multiple
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
                                                checked={formData.Clothes === "Yes"}
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
                                                checked={formData.Clothes === "No"}
                                                onChange={handleChange}
                                            />
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="2">Attach:</Form.Label>
                                                <Col sm="10">
                                                    <Form.Control type="file"
                                                        name='ClothesFile'
                                                        onChange={handleChange}
                                                        accept=".jpg,.jpeg,.png"
                                                        ref={ClothesFileRef}
                                                        multiple
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
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="2">Attach:</Form.Label>
                                                <Col sm="10">
                                                    <Form.Control type="file"
                                                        accept=".jpg,.jpeg,.png"
                                                        name='possessionsRecoveredFile'
                                                        onChange={handleChange}
                                                        ref={possessionsRecoveredFileRef}
                                                        multiple
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
                                                checked={formData.dischargeAllowance === "Yes"}
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
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="2">Attach:</Form.Label>
                                                <Col sm="10">
                                                    <Form.Control type="file"
                                                        name='dischargeAllowanceFile'
                                                        accept=".jpg,.jpeg,.png"
                                                        onChange={handleChange}
                                                        ref={dischargeAllowanceFileRef}
                                                        multiple
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
                                                checked={formData.travelExpenses === "Yes"}
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
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="2">Attach:</Form.Label>
                                                <Col sm="10">
                                                    <Form.Control type="file"
                                                        name='travelExpensesFile'
                                                        accept=".jpg,.jpeg,.png"
                                                        ref={travelExpensesFileRef}
                                                        onChange={handleChange}
                                                        multiple
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
                                                checked={formData.copyOfdischargeSummary === "Yes"}
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
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="2">Attach:</Form.Label>
                                                <Col sm="10">
                                                    <Form.Control type="file"
                                                        name='copyOfdischargeSummaryFile'
                                                        onChange={handleChange}
                                                        ref={copyOfdischargeSummaryFileRef}
                                                        accept=".jpg,.jpeg,.png"
                                                        multiple
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
                                                checked={formData.travelSafetyLetter === "Yes"}
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
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="2">Attach:</Form.Label>
                                                <Col sm="10">
                                                    <Form.Control type="file"
                                                        name='travelSafetyLetterFile'
                                                        onChange={handleChange}
                                                        ref={travelSafetyLetterFileRef}
                                                        accept=".jpg,.jpeg,.png"
                                                        multiple
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
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="2">Attach:</Form.Label>
                                                <Col sm="10">
                                                    <Form.Control type="file"
                                                        name='reunionPhotoFile'
                                                        accept=".jpg,.jpeg,.png"
                                                        ref={reunionPhotoFileRef}
                                                        onChange={handleChange}
                                                        multiple
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
                                                checked={formData.witnessSignature === "Yes"}
                                                onChange={handleChange}
                                            />
                                            <Form.Check
                                                inline
                                                type="radio"
                                                label="No"
                                                name="witnessSignature"
                                                id="witnessSignatureNo"
                                                value="No"
                                                checked={formData.witnessSignature === "No"}
                                                onChange={handleChange}
                                            />
                                            <Form.Group as={Row}>
                                                <Form.Label column sm="2">Attach:</Form.Label>
                                                <Col sm="10">
                                                    <Form.Control type="file"
                                                        name='witnessSignatureFile'
                                                        onChange={handleChange}
                                                        accept=".jpg,.jpeg,.png"
                                                        ref={witnessSignatureFileRef}
                                                        multiple
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
                                                value={formData.any_other}
                                                onChange={handleInputChange} />
                                        </Col>
                                    </Form.Group>

                                </li>
                            </ol>
                            <Button type='submit' className='btn btn-success mb-5'>Submit</Button>

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
                                        value={formData.any_other || "Null"}
                                        onChange={handleInputChange} />
                                </Col>
                            </Form.Group>

                        </li>
                    </ol>
                    <Col md={12}>
                        <Row className="d-flex align-items-center justify-content-center mt-3">
                            <Col md={6} className="mt-3 down_title">
                                <h5 className="text-start">Signature / Thumbprint of Resident's</h5>
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