import React from 'react';
import { Breadcrumb, Container, Row, Col, Form, InputGroup, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from 'axios';
import { useState, useEffect } from 'react';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useRef } from "react";
import Modal from 'react-bootstrap/Modal';
import Cookies from 'js-cookie';
import { Alert } from "react-bootstrap";
import manasu_logo from '../Admission/Manasu-Logo.png';
import imageCompression from 'browser-image-compression';

function Essential_record() {
    const [admission_no, setAdmissionNumber] = useState('');
    const [previewRequested, setPreviewRequested] = useState(false);
    const [show, setShow] = useState(false);
    const [rescueImage, setRescueImage] = useState(null);
    const [rescue_name, setRescueName] = useState("");
    const [error, setError] = useState("");
    const [formErrors, setFormErrors] = useState({});


    //alert box values
    const [submissionMessage, setSubmissionMessage] = useState("");
    const [messageType, setMessageType] = useState(""); // 'success' or 'danger'

    const handleClose = () => {
        setShow(false);
        setRescueName("");
    }

    const userType = Cookies.get('usertype');

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

    const [editData, setEditData] = useState({
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

    const [refData, setRefData] = useState({
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

    const bankPassbookRef = useRef(null);
    const form7AttachRef = useRef(null);
    const AadharAttachRef = useRef(null);
    const UDIDAttachRef = useRef(null);

    const [files, setFiles] = useState({
        bank_passbook: null,
        form7_attach: null,
        attach_aadhar: null,
        udid_attach: null
    });

    // const handleFileChange = (e) => {
    //     setFiles({
    //         ...files,
    //         [e.target.name]: Array.from(e.target.files)  // Store all selected files as an array
    //     });
    // };

    const handleFileChange = async (event) => {
        const selectedFiles = Array.from(event.target.files);
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

            setFiles((prev) => ({
                ...prev,
                [event.target.name]: compressedFiles // ✅ store compressed files
            }));

            console.log("✅ Final compressed files array:", compressedFiles);
        } catch (e) {
            console.error("Compression error:", e);
        }
    };


    const apiRoute = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
    });

    const validateField = (name, value) => {
        let error = "";

        if (name === "aadhar_card") {
            const aadhaarPattern = /^([0-9]{4} [0-9]{4} [0-9]{4}|UNKNOWN)$/;
            if (!aadhaarPattern.test(value)) {
                error = "Enter a valid Aadhaar (XXXX XXXX XXXX) or type 0000 0000 0000";
            }
        }

        if (name === "udid_no") {
            const udidPattern = /^([A-Z0-9]{18}|UNKNOWN)$/;
            if (!udidPattern.test(value)) {
                error = "Enter a valid 18-character UDID or type UNKNOWN";
            }
        }

        if (name === "voter_id") {
            const voterPattern = /^([A-Z]{3}[0-9]{7}|UNKNOWN)$/;
            if (!voterPattern.test(value)) {
                error = "Enter 3 letters and 7 digits (e.g., ABC1234567) or type UNKNOWN";
            }
        }

        if (name === "ifsc_code") {
            const ifscPattern = /^([A-Z]{4}0[A-Z0-9]{6}|UNKNOWN)$/;
            if (!ifscPattern.test(value)) {
                error = "Enter valid IFSC code (e.g., SBIN0001234) or type UNKNOWN";
            }
        }

        return error;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let updatedValue = value.toUpperCase();

        // Custom formatting logic
        if (name === "aadhar_card" && updatedValue !== "UNKNOWN") {
            updatedValue = value.replace(/\D/g, '').slice(0, 12);
            updatedValue = updatedValue.replace(/(.{4})/g, '$1 ').trim();
        }

        if (name === "udid_no" && updatedValue !== "UNKNOWN") {
            updatedValue = updatedValue.replace(/[^A-Z0-9]/gi, '').slice(0, 20).toUpperCase();
        }

        if (name === "voter_id" && updatedValue !== "UNKNOWN") {
            updatedValue = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
            if (updatedValue.length > 10) return;
        }

        if (name === "ifsc_code" && updatedValue !== "UNKNOWN") {
            updatedValue = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
            if (updatedValue.length > 11) return;
        }

        // Set form data
        setFormData(prev => ({
            ...prev,
            [name]: updatedValue
        }));

        // Validate and set error
        const errorMsg = validateField(name, updatedValue);
        setFormErrors(prev => ({
            ...prev,
            [name]: errorMsg
        }));
    };

    const handleInputChange1 = (e) => {
        const { name, value } = e.target;
        let updatedValue = value.toUpperCase();

        // Custom formatting logic
        if (name === "aadhar_card" && updatedValue !== "UNKNOWN") {
            updatedValue = value.replace(/\D/g, '').slice(0, 12);
            updatedValue = updatedValue.replace(/(.{4})/g, '$1 ').trim();
        }

        if (name === "udid_no" && updatedValue !== "UNKNOWN") {
            updatedValue = updatedValue.replace(/[^A-Z0-9]/gi, '').slice(0, 20).toUpperCase();
        }

        if (name === "voter_id" && updatedValue !== "UNKNOWN") {
            updatedValue = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
            if (updatedValue.length > 10) return;
        }

        if (name === "ifsc_code" && updatedValue !== "UNKNOWN") {
            updatedValue = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
            if (updatedValue.length > 11) return;
        }

        // Set form data
        setEditData(prev => ({
            ...prev,
            [name]: updatedValue
        }));

        // Validate and set error
        const errorMsg = validateField(name, updatedValue);
        setFormErrors(prev => ({
            ...prev,
            [name]: errorMsg
        }));
    };


    const handleCheckChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Automatically fetch data when admission number is typed
    useEffect(() => {
        if (admission_no.trim().length >= 12) { // Adjust minimum length as needed
            fetchFormData();
        }
    }, [admission_no]);

    const fetchFormData = async () => {
        try {
            const response = await apiRoute.get(`/reunion/get_information/${admission_no}`);
            setFormData(response.data.data[0]);
        } catch (error) {
            console.error('Error fetching data', error);
            alert("Admission Number Not found");
        }
    };

    useEffect(() => {
        if (admission_no.trim() !== "") {
            fetchRescuePastDetails(admission_no);
        } else {
            setRescueName("");
        }
    }, [admission_no]);

    const fetchRescuePastDetails = async (admission_no) => {
        try {
            const response = await apiRoute.get(`/admision/get_scrbform2data/${admission_no}`);
            const result = response.data.data[0];
            console.log("API Result:", result);

            if (result && result.rescue_name) {

                setRescueName(result.rescue_name || "");
            } else {

                setError("Image not found for this admission number");
            }
        } catch (error) {
            console.error("Error fetching data", error);
            setRescueName("");
        }
    };

    const createFormData = () => {
        const targetElement = document.querySelector('.essential_records');
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    }

    const downloadImage = (url, filename) => {
        fetch(url)
            .then(response => response.blob())
            .then(blob => {
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
            .catch(console.error);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        let errors = {};

        if (!admission_no || admission_no.trim() === '') {
            alert("Admission Number is required.");
            return;
        }

        const trimmedAdNo = admission_no.trim();

        if (!/^\d{8,13}$/.test(trimmedAdNo)) {
            alert("Admission Number must be between 8 to 13 digits (numbers only).");
            return;
        }


        // Aadhaar Validation
        if (formData.aadhar_card && formData.aadhar_card !== "UNKNOWN") {
            const digitsOnly = formData.aadhar_card.replace(/\D/g, '');
            if (digitsOnly.length !== 12) {
                alert("Aadhaar number must be 12 digits or type UNKNOWN");
                return;
            }
        }

        // UDID Validation
        if (formData.udid_no && formData.udid_no !== "UNKNOWN") {
            const cleaned = formData.udid_no.replace(/[^A-Z0-9]/gi, '');
            if (cleaned.length !== 18) {
                alert("UDID must be exactly 18 alphanumeric characters or type UNKNOWN");
                return;
            }
        }

        // Voter ID Validation
        if (formData.voter_id && formData.voter_id !== "UNKNOWN") {
            const cleaned = formData.voter_id.replace(/[^A-Za-z0-9]/g, '');
            if (!/^[A-Z]{3}[0-9]{7}$/.test(cleaned)) {
                alert("Voter ID must be 3 letters followed by 7 digits or type UNKNOWN");
                return;
            }
        }

        // IFSC Code Validation
        if (formData.ifsc_code && formData.ifsc_code !== "UNKNOWN") {
            const cleaned = formData.ifsc_code.replace(/[^A-Za-z0-9]/g, '');
            if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(cleaned)) {
                alert("IFSC Code must follow format like SBIN0001234 or type UNKNOWN");
                return;
            }
        }

        const data = new FormData();
        data.append('admission_no', admission_no);
        data.append('rescue_name', rescue_name);
        data.append('aadhar_card', formData.aadhar_card);
        data.append('udid_no', formData.udid_no);
        data.append('disability_no', formData.disability_no);
        data.append('voter_id', formData.voter_id);
        data.append('form7_attach', files.form7_attach);
        data.append('form_7', formData.form_7);
        data.append('bank_name', formData.bank_name);
        data.append('account_no', formData.account_no);
        data.append('ifsc_code', formData.ifsc_code);
        data.append('bank_passbook', files.bank_passbook);
        data.append('insurance_provider', formData.insurance_provider);
        data.append('policy_no', formData.policy_no);
        data.append('validity_period', formData.validity_period);
        data.append('other_gvt_scheme', formData.other_gvt_scheme);
        data.append('any_other', formData.any_other);

        if (files.form7_attach && files.form7_attach.length > 0) {
            files.form7_attach.forEach(file => {
                data.append('form7_attach', file); // ✅ no []
            });
        }

        if (files.bank_passbook && files.bank_passbook.length > 0) {
            files.bank_passbook.forEach(file => {
                data.append('bank_passbook', file); // ✅ no []
            });
        }

        if (files.attach_aadhar && files.attach_aadhar.length > 0) {
            files.attach_aadhar.forEach(file => {
                data.append('attach_aadhar', file); // ✅ no []
            });
        }

        if (files.udid_attach && files.udid_attach.length > 0) {
            files.udid_attach.forEach(file => {
                data.append('udid_attach', file); // ✅ no []
            });
        }

        try {
            const res = await apiRoute.post('/formality/createRecords', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            console.log(res);
            if (res.data.message === "Essential Records Form Created Successfully") {

                alert("Form Created Successfully");
                setFormData({
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
                setAdmissionNumber("");
                setRescueName("");
                setFiles({
                    bank_passbook: null,
                    form7_attach: null,
                })
                // Clear the file input elements in the DOM
                if (bankPassbookRef.current) bankPassbookRef.current.value = "";
                if (form7AttachRef.current) form7AttachRef.current.value = "";
                if (AadharAttachRef.current) AadharAttachRef.current.value = "";
                if (UDIDAttachRef.current) UDIDAttachRef.current.value = "";
            } else {
                alert("Submission failed.");
            }
        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                alert(error.response.data.message);
            } else {
                alert("Something went wrong.");
            }
            console.error("Error submitting form", error);
        }

    };

    const ViewFormData = async () => {
        try {
            const response = await apiRoute.get(`/formality/getEssentialRecord/${admission_no}`);
            const data = response.data;

            setRefData((refData) => ({
                ...refData,
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

            // Parse bank passbook image
            const passbookPath = data.bank_passbook
                ? [`http://localhost:5002/${data.bank_passbook}`]
                : [];

            // Parse form7_attach image array
            let form7Paths = [];
            if (data.form7_attach) {
                try {
                    const parsed = JSON.parse(data.form7_attach);
                    if (Array.isArray(parsed)) {
                        form7Paths = parsed.map((p) => `http://localhost:5002/${p.replace(/"/g, '')}`);
                    }
                } catch (err) {
                    console.warn('Failed to parse form7_attach:', err);
                    // Fallback: comma-separated string
                    form7Paths = data.form7_attach
                        .split(',')
                        .map((p) => `http://localhost:5002/${p.trim().replace(/^"|"$/g, '')}`);
                }
            }

            let bank_passbookPath = [];
            if (data.bank_passbook) {
                try {
                    const parsed = JSON.parse(data.bank_passbook);
                    if (Array.isArray(parsed)) {
                        bank_passbookPath = parsed.map((p) => `http://localhost:5002/${p.replace(/"/g, '')}`);
                    }
                } catch (err) {
                    console.warn('Failed to parse bank passbook:', err);
                    // Fallback: comma-separated string
                    bank_passbookPath = data.bank_passbook
                        .split(',')
                        .map((p) => `http://localhost:5002/${p.trim().replace(/^"|"$/g, '')}`);
                }
            }

            let attachAadharPath = [];
            if (data.attach_aadhar) {
                try {
                    const parsed = JSON.parse(data.attach_aadhar);
                    if (Array.isArray(parsed)) {
                        attachAadharPath = parsed.map((p) => `http://localhost:5002/${p.replace(/"/g, '')}`);
                    }
                } catch (err) {
                    console.warn('Failed to parse Aadhar Card:', err);
                    // Fallback: comma-separated string
                    attachAadharPath = data.attach_aadhar
                        .split(',')
                        .map((p) => `http://localhost:5002/${p.trim().replace(/^"|"$/g, '')}`);
                }
            }

            let UDIDPhotoPath = [];
            if (data.udid_attach) {
                try {
                    const parsed = JSON.parse(data.udid_attach);
                    if (Array.isArray(parsed)) {
                        UDIDPhotoPath = parsed.map((p) => `http://localhost:5002/${p.replace(/"/g, '')}`);
                    }
                } catch (err) {
                    console.warn('Failed to parse UDID Card:', err);
                    // Fallback: comma-separated string
                    UDIDPhotoPath = data.udid_attach
                        .split(',')
                        .map((p) => `http://localhost:5002/${p.trim().replace(/^"|"$/g, '')}`);
                }
            }

            setFiles((files) => ({
                ...files,
                bank_passbook: bank_passbookPath,
                form7_attach: form7Paths,
                attach_aadhar: attachAadharPath,
                udid_attach: UDIDPhotoPath
            }));

            setPreviewRequested(true);
        } catch (error) {
            console.error("Error fetching data:", error);
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

    const handleShow = async (admission_no) => {
        try {
            const response = await apiRoute.get(`/formality/getEssentialRecord/${admission_no}`);
            const data = response.data;

            // Set formData
            setEditData((editData) => ({
                ...editData,
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

            // Helper function to parse image paths
            const parseImageField = (fieldData) => {
                let paths = [];
                if (fieldData) {
                    try {
                        const parsed = JSON.parse(fieldData);
                        if (Array.isArray(parsed)) {
                            paths = parsed.map((p) =>
                                `http://localhost:5002/${p.replace(/"/g, '')}`
                            );
                        }
                    } catch (err) {
                        // Fallback to comma-separated string
                        paths = fieldData
                            .split(',')
                            .map((p) =>
                                `http://localhost:5002/${p.trim().replace(/^"|"$/g, '')}`
                            );
                    }
                }
                return paths;
            };

            const form7Paths = parseImageField(data.form7_attach);
            const bankPassbookPaths = parseImageField(data.bank_passbook);
            const attachAadharPath = parseImageField(data.attach_aadhar);
            const UDIDPhotoPath = parseImageField(data.udid_attach);

            console.log("UDID Path:", UDIDPhotoPath);
            console.log("Aadhar Card Path:", attachAadharPath);

            // Set image files
            setFiles((files) => ({
                ...files,
                form7_attach: form7Paths,
                bank_passbook: bankPassbookPaths,
                attach_aadhar: attachAadharPath,
                udid_attach: UDIDPhotoPath
            }));

            setShow(true);
        } catch (error) {
            console.error("Error fetching form data:", error);
            alert("Admission Number not found");
        }
    };


    // const handleUpdate = async (e, admission_no) => {
    //     e.preventDefault();
    //     try {
    //         const response = await apiRoute.put(`/formality/updateEssentialRecords/${admission_no}`, formData);
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

    const handleUpdate = async (e, admission_no) => {
        e.preventDefault();
        // Aadhaar Validation
        if (editData.aadhar_card && editData.aadhar_card !== "UNKNOWN") {
            const digitsOnly = editData.aadhar_card.replace(/\D/g, '');
            if (digitsOnly.length !== 12) {
                alert("Aadhaar number must be 12 digits or type UNKNOWN");
                return;
            }
        }

        // UDID Validation
        if (editData.udid_no && editData.udid_no !== "UNKNOWN") {
            const cleaned = editData.udid_no.replace(/[^A-Z0-9]/gi, '');
            if (cleaned.length !== 18) {
                alert("UDID must be exactly 18 alphanumeric characters or type UNKNOWN");
                return;
            }
        }

        // Voter ID Validation
        if (editData.voter_id && editData.voter_id !== "UNKNOWN") {
            const cleaned = editData.voter_id.replace(/[^A-Za-z0-9]/g, '');
            if (!/^[A-Z]{3}[0-9]{7}$/.test(cleaned)) {
                alert("Voter ID must be 3 letters followed by 7 digits or type UNKNOWN");
                return;
            }
        }

        // IFSC Code Validation
        if (editData.ifsc_code && editData.ifsc_code !== "UNKNOWN") {
            const cleaned = editData.ifsc_code.replace(/[^A-Za-z0-9]/g, '');
            if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(cleaned)) {
                alert("IFSC Code must follow format like SBIN0001234 or type UNKNOWN");
                return;
            }
        }

        const data = new FormData();
        data.append('rescue_name', editData.rescue_name);
        data.append('aadhar_card', editData.aadhar_card);
        data.append('udid_no', editData.udid_no);
        data.append('disability_no', editData.disability_no);
        data.append('voter_id', editData.voter_id);
        data.append('form_7', editData.form_7);
        data.append('form7_attach', files.form7_attach);
        data.append('bank_name', editData.bank_name);
        data.append('account_no', editData.account_no);
        data.append('ifsc_code', editData.ifsc_code);
        data.append('bank_passbook', files.bank_passbook);
        data.append('insurance_provider', editData.insurance_provider);
        data.append('policy_no', editData.policy_no);
        data.append('validity_period', editData.validity_period);
        data.append('other_gvt_scheme', editData.other_gvt_scheme);
        data.append('any_other', editData.any_other);

        // Append multiple images for form7_attach
        if (files.form7_attach && files.form7_attach.length > 0) {
            for (let i = 0; i < files.form7_attach.length; i++) {
                data.append('form7_attach', files.form7_attach[i]);
            }
        }

        // Append multiple images for bank_passbook
        if (files.bank_passbook && files.bank_passbook.length > 0) {
            for (let i = 0; i < files.bank_passbook.length; i++) {
                data.append('bank_passbook', files.bank_passbook[i]);
            }
        }

        if (files.attach_aadhar && files.attach_aadhar.length > 0) {
            for (let i = 0; i < files.attach_aadhar.length; i++) {
                data.append('attach_aadhar', files.attach_aadhar[i]);
            }
        }

        if (files.udid_attach && files.udid_attach.length > 0) {
            for (let i = 0; i < files.udid_attach.length; i++) {
                data.append('udid_attach', files.udid_attach[i]);
            }
        }

        try {
            const res = await apiRoute.put(`/formality/updateEssentialRecords/${admission_no}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert('Updated successfully!');
            handleClose(true);
            setEditData({
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
            setRescueName("");
            setAdmissionNumber("");
            // Clear the file input elements in the DOM
            if (bankPassbookRef.current) bankPassbookRef.current.value = "";
            if (form7AttachRef.current) form7AttachRef.current.value = "";
            if (AadharAttachRef.current) AadharAttachRef.current.value = "";
            if (UDIDAttachRef.current) UDIDAttachRef.current.value = "";
        } catch (err) {
            console.error(err);
            alert('Update failed.');
        }
    };

    const handleDelete = async (admission_no) => {
        try {
            const confirmDelete = window.confirm("Are you sure you want to delete this record?");
            if (!confirmDelete) return; // if user clicks 'Cancel', do nothing
            const res = await apiRoute.delete(`/remove/EssentialRectoRecycleBin/${admission_no}`);
            console.log(res.data);
            alert("Moved to recycle bin");
            setAdmissionNumber("");
            setRescueName("");
            // refresh table
        } catch (err) {
            console.error(err);
            alert("Error deleting");
        }
    };

    const fetchRescueDetails = async (admission_no) => {
        try {
            const response = await apiRoute.get(`/admision/get_scrbform2data/${admission_no}`);
            const result = response.data.data[0];
            console.log("API Result:", result);

            if (result && result.rescue_image) {
                let imagePath = null;

                // Check if rescue_image is an array-like string
                if (result.rescue_image.startsWith("[") && result.rescue_image.endsWith("]")) {
                    try {
                        // Parse the string to get the array
                        const imageArray = JSON.parse(result.rescue_image.replace(/&quot;/g, '"'));

                        if (Array.isArray(imageArray) && imageArray.length > 0) {
                            imagePath = `http://localhost:5002/${imageArray[0]}`;
                        }
                    } catch (parseError) {
                        console.error("Error parsing image array:", parseError);
                        imagePath = null;
                    }
                } else {
                    // It's a single image path
                    imagePath = result.rescue_image.startsWith("http")
                        ? result.rescue_image
                        : `http://localhost:5002/${result.rescue_image}`;
                }

                if (imagePath) {
                    setRescueImage(imagePath);
                    setRescueName(result.rescue_name || "");
                    setError("");
                } else {
                    setRescueImage(null);
                    setRescueName("");
                    setError("Image not found for this admission number");
                }
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


    // const fetchRescueDetails = async (admission_no) => {
    //     try {
    //         const response = await apiRoute.get(`/admision/get_scrbform2data/${admission_no}`);
    //         const result = response.data.data[0];
    //         console.log("API Result:", result);

    //         if (result && result.rescue_image) {
    //             let imagePath = "";

    //             try {
    //                 // Attempt to parse rescue_image as JSON (in case it's a stringified array)
    //                 const parsedImage = JSON.parse(result.rescue_image);
    //                 if (Array.isArray(parsedImage)) {
    //                     imagePath = `http://localhost:5002/${parsedImage[0]}`; // Use first image
    //                 } else {
    //                     imagePath = `http://localhost:5002/${result.rescue_image}`;
    //                 }
    //             } catch (e) {
    //                 // If it's not a stringified array, treat as normal string path
    //                 imagePath = result.rescue_image.startsWith("http")
    //                     ? result.rescue_image
    //                     : `http://localhost:5002/${result.rescue_image}`;
    //             }

    //             setRescueImage(imagePath);
    //             setRescueName(result.rescue_name || "");
    //             setError(""); // Clear previous error
    //         } else {
    //             setRescueImage(null);
    //             setRescueName("");
    //             setError("Image not found for this admission number");
    //         }
    //     } catch (error) {
    //         console.error("Error fetching data", error);
    //         setRescueImage(null);
    //         setRescueName("");
    //         setError("Admission Number Not found");
    //     }
    // };


    // Trigger when admission number changes
    useEffect(() => {
        if (admission_no.trim() !== "") {
            fetchRescueDetails(admission_no);
        } else {
            setRescueImage(null);
            setRescueName("");
            setError("");
        }
    }, [admission_no]);

    return (
        <>
            <Container fluid>
                <Row className='d-flex align-items-center justify-content-between'>
                    <Col md={2} className='text-start'>
                        <Breadcrumb className="d-none d-md-inline-block mb-0 mobile_breadcrumb" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
                            <Breadcrumb.Item></Breadcrumb.Item>
                            <Breadcrumb.Item>Home</Breadcrumb.Item>
                            <Breadcrumb.Item active>Admin Formality</Breadcrumb.Item>
                        </Breadcrumb>
                        <h6 className="breadcrumb_title">Records</h6>
                    </Col>
                    <Col md={7} className="text-center">
                        <h3 className="section_title">Resident Document Information Form</h3>
                    </Col>
                    <Col md={2} className='text-center'>
                        {error && <div className="text-danger mt-2">{error}</div>}
                        {/* Rescue Name and Image */}
                        {rescueImage && (
                            <div>
                                <img
                                    alt={rescue_name || "Rescue Image"}
                                    style={{ width: "100px", height: "100px" }}
                                    src={rescueImage}
                                />
                                {rescue_name && <h6 className="mb-2">{rescue_name}</h6>}
                            </div>
                        )}
                    </Col>
                </Row>
            </Container>

            <Container>
                <Form className="navbar-search col-md-9 d-flex justify-content-center align-items-center mt-3">
                    <Form.Group id="topbarSearch" className="d-flex align-items-center">
                        <Col md={6}>
                            <Form.Label>Admission Number:</Form.Label>
                        </Col>
                        <Col md={6}>
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
                                alert("Please enter admission number.");
                            } else {
                                ViewFormData(); // Fetch & populate data before generating PDF
                            }
                        }}><FontAwesomeIcon icon={faEye} className="me-0" /></button>
                        {userType === "1" && (
                            <button type="button" className="btn btn-success mx-1" onClick={() => {
                                if (!admission_no.trim()) {
                                    alert("Please enter admission number.");
                                } else {
                                    createFormData(); // Fetch & populate data before generating PDF
                                }
                            }}><FontAwesomeIcon icon={faPlus} className="me-0" /></button>
                        )}
                        <button type="button" className="btn btn-success mx-1" onClick={() => {
                            if (!admission_no.trim()) {
                                alert("Please enter admission number.");
                            } else {
                                handleShow(admission_no); // Fetch & populate data before generating PDF
                            }
                        }}><FontAwesomeIcon icon={faEdit} className="me-0" /></button>
                        {userType === "2" && (
                            <button type="button" className="btn btn-danger mx-1" onClick={() => {
                                if (!admission_no.trim()) {
                                    alert("Please enter admission number.");
                                } else {
                                    handleDelete(admission_no); // Fetch & populate data before generating PDF
                                }
                            }}><FontAwesomeIcon icon={faTrash} className="me-0" /></button>
                        )}
                    </Form.Group>
                </Form>

                <div>
                    {/* Show success or error message box */}
                    {submissionMessage && (
                        <Alert variant={messageType} className="mt-3">
                            {submissionMessage}
                        </Alert>
                    )}
                </div>


                <Row className='d-flex align-items-center justify-content-center'>
                    <Col md={8} className="consultant_box my-4 essential_record">
                        <div className="consultant_details">
                            <Form className='media_consent' onSubmit={handleSubmit}>
                                <Row>
                                    <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                        <Form.Label column sm="4" className='text-start'>
                                            Name : <span style={{ color: 'red' }}>*</span>
                                        </Form.Label>
                                        <Col sm="8" className='d-flex align-items-center'>
                                            <Form.Control
                                                type="text"
                                                name="rescue_name"
                                                value={rescue_name || formData.rescue_name}
                                                onChange={handleInputChange}
                                                required />
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} className="mb-3 text-start">
                                        <Form.Label className='form_title' column sm="4">
                                            ID Cards :
                                        </Form.Label>
                                        <Col sm="8">
                                            {/* Aadhar Card */}
                                            <Form.Label className="mb-1">Aadhaar Card Number <span style={{ color: 'red' }}>*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="aadhar_card"
                                                value={formData.aadhar_card}
                                                onChange={handleInputChange}
                                                className={`mb-2 ${formErrors.aadhar_card ? 'is-invalid' : ''}`}
                                                required
                                            />
                                            {formErrors.aadhar_card && (
                                                <div className="text-danger small">{formErrors.aadhar_card}</div>
                                            )}
                                            <Form.Label className="mb-1">Attach Aadhaar Card : </Form.Label>
                                            <Form.Control
                                                type="file"
                                                name="attach_aadhar"
                                                accept=".jpg,.jpeg,.png"
                                                onChange={handleFileChange}
                                                ref={AadharAttachRef}
                                                multiple
                                            />

                                            {/* UDID */}
                                            <Form.Label className="mb-1">UDID Card Number (Unique Disability ID):  <span style={{ color: 'red' }}>*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="udid_no"
                                                value={formData.udid_no}
                                                onChange={handleInputChange}
                                                className={`mb-2 ${formErrors.udid_no ? 'is-invalid' : ''}`}
                                                required />
                                            {formErrors.udid_no && (
                                                <div className="text-danger small">{formErrors.udid_no}</div>
                                            )}
                                            <Form.Label className="mb-1">Attach UDID Card : </Form.Label>
                                            <Form.Control
                                                type="file"
                                                name="udid_attach"
                                                accept=".jpg,.jpeg,.png"
                                                onChange={handleFileChange}
                                                ref={UDIDAttachRef}
                                                multiple
                                            />

                                            {/* Disability Passport */}
                                            <Form.Label className="mb-1">Disability Certificate No. & Issuing Authority:  <span style={{ color: 'red' }}>*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="disability_no"
                                                value={formData.disability_no}
                                                onChange={handleInputChange}
                                                className="mb-2"
                                                required
                                            />

                                            {/* Voter ID */}
                                            <Form.Label className="mb-1">Voter ID :  <span style={{ color: 'red' }}>*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="voter_id"
                                                value={formData.voter_id}
                                                onChange={handleInputChange}
                                                className={`mb-2 ${formErrors.voter_id ? 'is-invalid' : ''}`}
                                                required />
                                            {formErrors.voter_id && (
                                                <div className="text-danger small">{formErrors.voter_id}</div>
                                            )}

                                            {/* Form 7 */}
                                            <Form.Label className="mb-1">Form 7 <span style={{ color: 'red' }}>*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="form_7"
                                                value={formData.form_7}
                                                onChange={handleInputChange}
                                                className="mb-2"

                                                required
                                            />

                                            {/* Form 7  attachment*/}
                                            <Form.Label className="mb-1">Form 7 Attachment <span style={{ color: 'red' }}>*</span></Form.Label>
                                            <Form.Control
                                                type="file"
                                                name="form7_attach"
                                                accept=".jpg,.jpeg,.png"
                                                onChange={handleFileChange}
                                                multiple
                                                ref={form7AttachRef}
                                                required
                                            />
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} className="mb-3 text-start">
                                        <Form.Label className='form_title' column sm="4">
                                            Financial Details :
                                        </Form.Label>
                                        <Col sm="8">
                                            {/* Aadhar Card */}
                                            <Form.Label className="mb-1">Bank Name <span style={{ color: 'red' }}>*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="bank_name"
                                                value={formData.bank_name}
                                                onChange={handleInputChange}
                                                className="mb-2"
                                                required
                                            />

                                            {/* UDID */}
                                            <Form.Label className="mb-1">Account Number <span style={{ color: 'red' }}>*</span></Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="account_no"
                                                value={formData.account_no}
                                                onChange={handleInputChange}
                                                className="mb-2"
                                                required
                                            />

                                            {/* Disability Passport */}
                                            <Form.Label className="mb-1">IFSC Code <span style={{ color: 'red' }}>*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="ifsc_code"
                                                value={formData.ifsc_code}
                                                onChange={handleInputChange}
                                                className={`mb-2 ${formErrors.ifsc_code ? 'is-invalid' : ''}`}
                                                required
                                            />
                                            {formErrors.ifsc_code && (
                                                <div className="text-danger small">{formErrors.ifsc_code}</div>
                                            )}

                                            <Form.Label className="mb-1">Copy of Bank Passbook (attach)</Form.Label>
                                            <Form.Control
                                                type="file"
                                                accept=".jpg,.jpeg,.png"
                                                name="bank_passbook"
                                                onChange={handleFileChange}
                                                multiple
                                                ref={bankPassbookRef}
                                            />
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} className="mb-3 text-start">
                                        <Form.Label column sm="4" className='form_title'>
                                            CMCHIS(Chief Minister's Comprehensive Health Insurance Scheme):
                                        </Form.Label>
                                        <Col sm="8">
                                            {/* Aadhar Card */}
                                            <Form.Label className="mb-1">Insurance Provider <span style={{ color: 'red' }}>*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="insurance_provider"
                                                value={formData.insurance_provider}
                                                onChange={handleInputChange}
                                                className="mb-2"
                                                required
                                            />

                                            {/* UDID */}
                                            <Form.Label className="mb-1">Policy Number <span style={{ color: 'red' }}>*</span></Form.Label>
                                            <Form.Control
                                                type="number"
                                                name="policy_no"
                                                value={formData.policy_no}
                                                onChange={handleInputChange}
                                                className="mb-2"
                                                required
                                            />

                                            {/* Disability Passport */}
                                            <Form.Label className="mb-1">Validity Period <span style={{ color: 'red' }}>*</span></Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="validity_period"
                                                value={formData.validity_period}
                                                onChange={handleInputChange}
                                                className="mb-2"
                                                required
                                            />

                                            <Form.Label className="mb-1">Other Govt. Scheme </Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="other_gvt_scheme"
                                                value={formData.other_gvt_scheme}
                                                onChange={handleInputChange}
                                                className="mb-2"

                                            />

                                            <Form.Label className="mb-1">Any Other </Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="any_other"
                                                value={formData.any_other}
                                                onChange={handleInputChange}
                                                className="mb-2"
                                            />
                                        </Col>
                                    </Form.Group>

                                    <div>
                                        <Button variant="success" className="m-1" type="submit">Submit</Button>
                                    </div>

                                </Row>
                            </Form>

                        </div>
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
                                    value={refData.rescue_name}
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
                                    value={refData.aadhar_card}
                                    onChange={handleInputChange}
                                    className="mb-2"
                                    required
                                />
                                <Form.Label className="mb-1">Aadhar Card Attachment </Form.Label>
                                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                    {Array.isArray(files.aadhar_card) && files.aadhar_card.length > 0 ? (
                                        files.aadhar_card.map((imgUrl, index) => (
                                            <img
                                                key={index}
                                                src={imgUrl}
                                                alt={`rescue recovery ${index + 1}`}
                                                loading="lazy"
                                                style={{
                                                    width: "100px",
                                                    height: "auto",
                                                    margin: "10px",
                                                    border: "1px solid #ccc",
                                                }}
                                                onError={(e) => {
                                                    if (!e.target.dataset.errorHandled) {
                                                        e.target.src = "/fallback-image.png";
                                                        e.target.dataset.errorHandled = "true";
                                                    }
                                                }}
                                            />
                                        ))
                                    ) : (
                                        <div style={{ padding: "10px", fontStyle: "italic" }}>No image</div>
                                    )}
                                </div>

                                {/* UDID */}
                                <Form.Label className="mb-1">UDID Card Number (Unique Disability ID)</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="udid_no"
                                    value={refData.udid_no}
                                    onChange={handleInputChange}
                                    className="mb-2"
                                />

                                <Form.Label className="mb-1">UDID Card Attachment </Form.Label>
                                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                    {Array.isArray(files.udid_attach) && files.udid_attach.length > 0 ? (
                                        files.udid_attach.map((imgUrl, index) => (
                                            <img
                                                key={index}
                                                src={imgUrl}
                                                alt={`rescue recovery ${index + 1}`}
                                                loading="lazy"
                                                style={{
                                                    width: "100px",
                                                    height: "auto",
                                                    margin: "10px",
                                                    border: "1px solid #ccc",
                                                }}
                                                onError={(e) => {
                                                    if (!e.target.dataset.errorHandled) {
                                                        e.target.src = "/fallback-image.png";
                                                        e.target.dataset.errorHandled = "true";
                                                    }
                                                }}
                                            />
                                        ))
                                    ) : (
                                        <div style={{ padding: "10px", fontStyle: "italic" }}>No image</div>
                                    )}
                                </div>

                                {/* Disability Passport */}
                                <Form.Label className="mb-1">Disability Certificate No. & Issuing Authority</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="disability_no"
                                    value={refData.disability_no}
                                    onChange={handleInputChange}
                                    accept=".pdf,.jpg,.jpeg,.png"
                                />

                                {/* Voter ID */}
                                <Form.Label className="mb-1">Voter ID</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="voter_id"
                                    value={refData.voter_id}
                                    onChange={handleInputChange}
                                    className="mb-2"
                                />

                                {/* Form 7 */}
                                <Form.Label className="mb-1">Form 7</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="form_7"
                                    value={refData.form_7}
                                    onChange={handleInputChange}
                                    className="mb-2"
                                />

                                <Form.Label className="mb-1">Form 7 Attachment</Form.Label>
                                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                    {Array.isArray(files.form7_attach) && files.form7_attach.length > 0 ? (
                                        files.form7_attach.map((imgUrl, index) => (
                                            <img
                                                key={index}
                                                src={imgUrl}
                                                alt={`rescue recovery ${index + 1}`}
                                                loading="lazy"
                                                style={{
                                                    width: "100px",
                                                    height: "auto",
                                                    margin: "10px",
                                                    border: "1px solid #ccc",
                                                }}
                                                onError={(e) => {
                                                    if (!e.target.dataset.errorHandled) {
                                                        e.target.src = "/fallback-image.png";
                                                        e.target.dataset.errorHandled = "true";
                                                    }
                                                }}
                                            />
                                        ))
                                    ) : (
                                        <div style={{ padding: "10px", fontStyle: "italic" }}>No image</div>
                                    )}
                                </div>


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
                                    value={refData.bank_name}
                                    onChange={handleInputChange}
                                    className="mb-3"
                                />

                                {/* UDID */}
                                <Form.Label className="mb-1">Account Number</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="account_no"
                                    value={refData.account_no}
                                    onChange={handleInputChange}
                                    className="mb-3"
                                />

                                {/* Disability Passport */}
                                <Form.Label className="mb-1">IFSC Code</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="ifsc_code"
                                    value={refData.ifsc_code}
                                    onChange={handleInputChange}
                                    className="mb-5"
                                />

                                <Form.Label className="mb-1 mt-5">Copy of Bank Passbook (attach)</Form.Label>
                                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                    {Array.isArray(files.bank_passbook) && files.bank_passbook.length > 0 ? (
                                        files.bank_passbook.map((imgUrl, index) => (
                                            <img
                                                key={index}
                                                src={imgUrl}
                                                alt={`rescue recovery ${index + 1}`}
                                                loading="lazy"
                                                style={{
                                                    width: "100px",
                                                    height: "auto",
                                                    margin: "10px",
                                                    border: "1px solid #ccc",
                                                }}
                                                onError={(e) => {
                                                    if (!e.target.dataset.errorHandled) {
                                                        e.target.src = "/fallback-image.png";
                                                        e.target.dataset.errorHandled = "true";
                                                    }
                                                }}
                                            />
                                        ))
                                    ) : (
                                        <div style={{ padding: "10px", fontStyle: "italic" }}>No image</div>
                                    )}
                                </div>

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
                                    value={refData.insurance_provider}
                                    onChange={handleInputChange}
                                    className="mb-2"
                                />

                                {/* UDID */}
                                <Form.Label className="mb-1 mt-5">Policy Number</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="policy_no"
                                    value={refData.policy_no}
                                    onChange={handleInputChange}
                                    className="mb-2"
                                />

                                {/* Disability Passport */}
                                <Form.Label className="mb-1">Validity Period</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="validity_period"
                                    value={refData.validity_period}
                                    onChange={handleInputChange}
                                    className="mb-2"
                                />

                                <Form.Label className="mb-1">Other Govt. Scheme </Form.Label>
                                <Form.Control
                                    type="text"
                                    name="other_gvt_scheme"
                                    value={refData.other_gvt_scheme}
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
                                    <Form.Label column sm="6" className='text-start'>
                                        Name : <span style={{ color: 'red' }}>*</span>
                                    </Form.Label>
                                    <Col sm="6" className='d-flex align-items-center'>
                                        <Form.Control
                                            type="text"
                                            name="rescue_name"
                                            value={editData.rescue_name}
                                            onChange={handleInputChange1}
                                            required />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                    <Form.Label column sm="6" className='text-start'>
                                        Aadhaar Card Number : <span style={{ color: 'red' }}>*</span>
                                    </Form.Label>
                                    <Col sm="6" className='d-flex align-items-center'>
                                        <Form.Control
                                            type="text"
                                            name="aadhar_card"
                                            value={editData.aadhar_card}
                                            onChange={handleInputChange1}
                                            className={`mb-2 ${formErrors.aadhar_card ? 'is-invalid' : ''}`}
                                            required
                                        />

                                    </Col>
                                    {formErrors.aadhar_card && (
                                        <div className="text-danger small">{formErrors.aadhar_card}</div>
                                    )}
                                </Form.Group>
                                {Array.isArray(files.attach_aadhar) &&
                                    files.attach_aadhar.map((imgUrl, index) => {
                                        const filename = `attach_aadhar${index}.jpg`;

                                        return (
                                            <div
                                                key={index}
                                                className="image-container"
                                                style={{
                                                    position: "relative",
                                                    width: "100px",
                                                    height: "100px",
                                                    margin: "10px",
                                                    padding: "0px",
                                                    display: "inline-block",
                                                }}
                                            >
                                                <img
                                                    src={imgUrl}
                                                    alt={`attach_aadhar - ${index}`}
                                                    loading="lazy"
                                                    style={{
                                                        width: "100%",
                                                        height: "100%",
                                                        objectFit: "cover",
                                                        border: "1px solid #ccc",
                                                        borderRadius: "4px",
                                                    }}
                                                    onError={(e) => {
                                                        if (!e.target.dataset.errorHandled) {
                                                            e.target.src = "/fallback-image.png";
                                                            e.target.dataset.errorHandled = "true";
                                                        }
                                                    }}
                                                />

                                                <div className="image-overlay">
                                                    {/* View icon */}
                                                    <a
                                                        href={imgUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        title="View Image"
                                                        className="icon-button"
                                                    >
                                                        <i className="fas fa-eye"></i>
                                                    </a>

                                                    {/* Download icon */}
                                                    <button
                                                        title="Download Image"
                                                        className="icon-button"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            fetch(imgUrl, { mode: "cors" })
                                                                .then((res) => res.blob())
                                                                .then((blob) => {
                                                                    const url = window.URL.createObjectURL(blob);
                                                                    const a = document.createElement("a");
                                                                    a.href = url;
                                                                    a.download = filename;
                                                                    a.click();
                                                                    window.URL.revokeObjectURL(url);
                                                                })
                                                                .catch(() => alert("Download failed."));
                                                        }}
                                                    >
                                                        <i className="fas fa-download"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                <Form.Label className="mb-1">Attach Aadhaar Card : <span style={{ color: 'red' }}>*</span></Form.Label>
                                <Form.Control
                                    type="file"
                                    name="attach_aadhar"
                                    accept=".jpg,.jpeg,.png"
                                    onChange={handleFileChange}
                                    ref={AadharAttachRef}
                                    multiple
                                />

                                <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                    <Form.Label column sm="6" className='text-start'>
                                        UDID Card Number (Unique Disability ID) : <span style={{ color: 'red' }}>*</span>
                                    </Form.Label>
                                    <Col sm="6" className='d-flex align-items-center'>
                                        <Form.Control
                                            type="text"
                                            name="udid_no"
                                            value={editData.udid_no}
                                            onChange={handleInputChange1}
                                            className={`mb-2 ${formErrors.udid_no ? 'is-invalid' : ''}`}
                                            required /><br />

                                    </Col>
                                    {formErrors.udid_no && (
                                        <div className="text-danger small">{formErrors.udid_no}</div>
                                    )}
                                </Form.Group>

                                {Array.isArray(files.udid_attach) &&
                                    files.udid_attach.map((imgUrl, index) => {
                                        const filename = `udid_attach_${index}.jpg`;

                                        return (
                                            <div
                                                key={index}
                                                className="image-container"
                                                style={{
                                                    position: "relative",
                                                    width: "100px",
                                                    height: "100px",
                                                    margin: "10px",
                                                    padding: "0px",
                                                    display: "inline-block",
                                                }}
                                            >
                                                <img
                                                    src={imgUrl}
                                                    alt={`udid_attach - ${index}`}
                                                    loading="lazy"
                                                    style={{
                                                        width: "100%",
                                                        height: "100%",
                                                        objectFit: "cover",
                                                        border: "1px solid #ccc",
                                                        borderRadius: "4px",
                                                    }}
                                                    onError={(e) => {
                                                        if (!e.target.dataset.errorHandled) {
                                                            e.target.src = "/fallback-image.png";
                                                            e.target.dataset.errorHandled = "true";
                                                        }
                                                    }}
                                                />

                                                <div className="image-overlay">
                                                    {/* View icon */}
                                                    <a
                                                        href={imgUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        title="View Image"
                                                        className="icon-button"
                                                    >
                                                        <i className="fas fa-eye"></i>
                                                    </a>

                                                    {/* Download icon */}
                                                    <button
                                                        title="Download Image"
                                                        className="icon-button"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            fetch(imgUrl, { mode: "cors" })
                                                                .then((res) => res.blob())
                                                                .then((blob) => {
                                                                    const url = window.URL.createObjectURL(blob);
                                                                    const a = document.createElement("a");
                                                                    a.href = url;
                                                                    a.download = filename;
                                                                    a.click();
                                                                    window.URL.revokeObjectURL(url);
                                                                })
                                                                .catch(() => alert("Download failed."));
                                                        }}
                                                    >
                                                        <i className="fas fa-download"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}

                                <Form.Label className="mb-1">Attach UDID Card : <span style={{ color: 'red' }}>*</span></Form.Label>
                                <Form.Control
                                    type="file"
                                    name="udid_attach"
                                    accept=".jpg,.jpeg,.png"
                                    onChange={handleFileChange}
                                    ref={UDIDAttachRef}
                                    multiple
                                />

                                <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                    <Form.Label column sm="6" className='text-start'>
                                        Disability Certificate No. & Issuing Authority : <span style={{ color: 'red' }}>*</span>
                                    </Form.Label>
                                    <Col sm="6" className='d-flex align-items-center'>
                                        <Form.Control
                                            type="text"
                                            name="disability_no"
                                            value={editData.disability_no}
                                            onChange={handleInputChange1}
                                            required />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                    <Form.Label column sm="6" className='text-start'>
                                        Voter ID : <span style={{ color: 'red' }}>*</span>
                                    </Form.Label>
                                    <Col sm="6" className='d-flex align-items-center'>
                                        <Form.Control
                                            type="text"
                                            name="voter_id"
                                            value={editData.voter_id}
                                            onChange={handleInputChange1}
                                            className={`mb-2 ${formErrors.voter_id ? 'is-invalid' : ''}`}
                                            required />

                                    </Col>
                                    {formErrors.voter_id && (
                                        <div className="text-danger small">{formErrors.voter_id}</div>
                                    )}
                                </Form.Group>

                                <Form.Label className="mb-1">Form 7 Attachment</Form.Label>
                                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                    {Array.isArray(files.form7_attach) &&
                                        files.form7_attach.map((imgUrl, index) => {
                                            const filename = `form7_attach_${index}.jpg`;

                                            return (
                                                <div
                                                    key={index}
                                                    className="image-container"
                                                    style={{
                                                        position: "relative",
                                                        width: "100px",
                                                        height: "100px",
                                                        margin: "10px",
                                                        display: "inline-block",
                                                    }}
                                                >
                                                    <img
                                                        src={imgUrl}
                                                        alt={`form7_attach - ${index}`}
                                                        loading="lazy"
                                                        style={{
                                                            width: "100%",
                                                            height: "100%",
                                                            objectFit: "cover",
                                                            border: "1px solid #ccc",
                                                            borderRadius: "4px",
                                                        }}
                                                        onError={(e) => {
                                                            if (!e.target.dataset.errorHandled) {
                                                                e.target.src = "/fallback-image.png";
                                                                e.target.dataset.errorHandled = "true";
                                                            }
                                                        }}
                                                    />

                                                    <div className="image-overlay">
                                                        {/* View icon */}
                                                        <a
                                                            href={imgUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            title="View Image"
                                                            className="icon-button"
                                                        >
                                                            <i className="fas fa-eye"></i>
                                                        </a>

                                                        {/* Download icon */}
                                                        <button
                                                            title="Download Image"
                                                            className="icon-button"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                fetch(imgUrl, { mode: "cors" })
                                                                    .then((res) => res.blob())
                                                                    .then((blob) => {
                                                                        const url = window.URL.createObjectURL(blob);
                                                                        const a = document.createElement("a");
                                                                        a.href = url;
                                                                        a.download = filename;
                                                                        a.click();
                                                                        window.URL.revokeObjectURL(url);
                                                                    })
                                                                    .catch(() => alert("Download failed."));
                                                            }}
                                                        >
                                                            <i className="fas fa-download"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>



                                <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                    <Form.Label column sm="6" className='text-start'>
                                        Form 7 Attachment: <span style={{ color: 'red' }}>*</span>
                                    </Form.Label>
                                    <Col sm="6" className='d-flex flex-column align-items-start'>
                                        <Form.Control
                                            type="file"
                                            name="form7_attach"
                                            accept=".jpg,.jpeg,.png"
                                            onChange={handleFileChange}
                                            bank_passbook
                                            multiple
                                            required
                                        />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                    <Form.Label column sm="6" className='text-start'>
                                        Bank Name : <span style={{ color: 'red' }}>*</span>
                                    </Form.Label>
                                    <Col sm="6" className='d-flex align-items-center'>
                                        <Form.Control
                                            type="text"
                                            name="bank_name"
                                            value={editData.bank_name}
                                            onChange={handleInputChange1}
                                            required />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                    <Form.Label column sm="6" className='text-start'>
                                        Account Number : <span style={{ color: 'red' }}>*</span>
                                    </Form.Label>
                                    <Col sm="6" className='d-flex align-items-center'>
                                        <Form.Control
                                            type="number"
                                            name="account_no"
                                            value={editData.account_no}
                                            onChange={handleInputChange1}
                                            required />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                    <Form.Label column sm="6" className='text-start'>
                                        IFSC Code : <span style={{ color: 'red' }}>*</span>
                                    </Form.Label>
                                    <Col sm="6" className='d-flex align-items-center'>
                                        <Form.Control
                                            type="text"
                                            name="ifsc_code"
                                            value={editData.ifsc_code}
                                            onChange={handleInputChange1}
                                            className={`mb-2 ${formErrors.ifsc_code ? 'is-invalid' : ''}`}
                                            required
                                        />

                                    </Col>
                                    {formErrors.ifsc_code && (
                                        <div className="text-danger small">{formErrors.ifsc_code}</div>
                                    )}
                                </Form.Group>

                                <Form.Label className="mb-1">Copy of Bank Passbook</Form.Label>
                                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                    {Array.isArray(files.bank_passbook) &&
                                        files.bank_passbook.map((imgUrl, index) => {
                                            const filename = `bank_passbook_${index}.jpg`;

                                            return (
                                                <div
                                                    key={index}
                                                    className="image-container"
                                                    style={{
                                                        position: "relative",
                                                        width: "100px",
                                                        height: "100px",
                                                        margin: "10px",
                                                        display: "inline-block",
                                                    }}
                                                >
                                                    <img
                                                        src={imgUrl}
                                                        alt={`bank_passbook - ${index}`}
                                                        loading="lazy"
                                                        style={{
                                                            width: "100%",
                                                            height: "100%",
                                                            objectFit: "cover",
                                                            border: "1px solid #ccc",
                                                            borderRadius: "4px",
                                                        }}
                                                        onError={(e) => {
                                                            if (!e.target.dataset.errorHandled) {
                                                                e.target.src = "/fallback-image.png";
                                                                e.target.dataset.errorHandled = "true";
                                                            }
                                                        }}
                                                    />

                                                    <div className="image-overlay">
                                                        {/* View icon */}
                                                        <a
                                                            href={imgUrl}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            title="View Image"
                                                            className="icon-button"
                                                        >
                                                            <i className="fas fa-eye"></i>
                                                        </a>

                                                        {/* Download icon */}
                                                        <button
                                                            title="Download Image"
                                                            className="icon-button"
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                fetch(imgUrl, { mode: "cors" })
                                                                    .then((res) => res.blob())
                                                                    .then((blob) => {
                                                                        const url = window.URL.createObjectURL(blob);
                                                                        const a = document.createElement("a");
                                                                        a.href = url;
                                                                        a.download = filename;
                                                                        a.click();
                                                                        window.URL.revokeObjectURL(url);
                                                                    })
                                                                    .catch(() => alert("Download failed."));
                                                            }}
                                                        >
                                                            <i className="fas fa-download"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>

                                <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                    <Form.Label column sm="6" className='text-start'>
                                        Copy of Bank Passbook (attach):
                                    </Form.Label>
                                    <Col sm="6" className='d-flex flex-column align-items-start'>
                                        <Form.Control
                                            type="file"
                                            name="bank_passbook"
                                            accept=".jpg,.jpeg,.png"
                                            onChange={handleFileChange}
                                            multiple
                                        />


                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                    <Form.Label column sm="6" className='text-start'>
                                        Insurance Provider : <span style={{ color: 'red' }}>*</span>
                                    </Form.Label>
                                    <Col sm="6" className='d-flex align-items-center'>
                                        <Form.Control
                                            type="text"
                                            name="insurance_provider"
                                            value={editData.insurance_provider}
                                            onChange={handleInputChange1}
                                            required />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                    <Form.Label column sm="6" className='text-start'>
                                        Policy Number : <span style={{ color: 'red' }}>*</span>
                                    </Form.Label>
                                    <Col sm="6" className='d-flex align-items-center'>
                                        <Form.Control
                                            type="text"
                                            name="policy_no"
                                            value={editData.policy_no}
                                            onChange={handleInputChange1}
                                            required />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                                    <Form.Label column sm="6" className='text-start'>
                                        Validity Period : <span style={{ color: 'red' }}>*</span>
                                    </Form.Label>
                                    <Col sm="6" className='d-flex align-items-center'>
                                        <Form.Control
                                            type="text"
                                            name="validity_period"
                                            value={editData.validity_period}
                                            onChange={handleInputChange1}
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
                                            value={editData.other_gvt_scheme}
                                            onChange={handleInputChange1}
                                            required />
                                    </Col>
                                </Form.Group>

                                <div className="mt-3 d-flex align-tems-cente justify-content-between">
                                    <Button variant="success" className="m-1" type="submit" onClick={(e) => handleUpdate(e, admission_no)}>Update</Button>
                                    <Button variant="secondary" onClick={handleClose}>
                                        Close
                                    </Button>
                                </div>

                            </Row>
                        </Form>
                    </Col>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default Essential_record
