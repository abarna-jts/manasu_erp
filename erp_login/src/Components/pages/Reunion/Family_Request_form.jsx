import React from 'react';
import { Breadcrumb, Container, Row, Table, Button } from 'react-bootstrap';
import { Col, Form, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Modal from 'react-bootstrap/Modal';
import Cookies from 'js-cookie';
import { Alert } from "react-bootstrap";
import manasu_logo from '../Admission/Manasu-Logo.png';

function Family_Request_form() {
    const [show, setShow] = useState(false);
    const [admissionNumber, setAdmissionNumber] = useState('');
    const [files, setFiles] = useState({});
    const [previewRequested, setPreviewRequested] = useState(false);
    const [rescueImage, setRescueImage] = useState(null);
    const [rescueName, setRescueName] = useState("");
    const [error, setError] = useState("");
    const [formErrors, setFormErrors] = useState({});
    const [admissionNumberError, setAdmissionNumberError] = useState("");

    //alert box values
    const [submissionMessage, setSubmissionMessage] = useState("");
    const [messageType, setMessageType] = useState(""); // 'success' or 'danger'


    const userType = Cookies.get('usertype');

    const handleClose = () => setShow(false);

    const apiRoute = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
    });

    const [formData, setFormData] = useState({
        admission_no: '',
        rescue_name: '',
        age: '',
        gender: 'Male',
        phone_no: '',
        family_relationship: '',
        f_member_name: '',
        f_member_age: '',
        f_member_address: '',
        f_member_phone: '',
        f_aadhar_card_no: '',
        f_ration_card_no: '',
        r_aadhar_card_no: '',
        r_ration_card_no: '',
        description: '',
    })

    const [refData, setRefData] = useState({
        admission_no: '',
        rescue_name: '',
        age: '',
        gender: 'Male',
        phone_no: '',
        rescue_relationship: '',
        f_member_name: '',
        f_member_age: '',
        f_member_address: '',
        f_member_phone: '',
        f_aadhar_card_no: '',
        f_ration_card_no: '',
        r_aadhar_card_no: '',
        r_ration_card_no: '',
        description: '',
    })

    const [storeData, setStoreData] = useState({
        admission_no: '',
        rescue_name: '',
        age: '',
        gender: 'Male',
        phone_no: '',
        rescue_relationship: '',
        f_member_name: '',
        f_member_age: '',
        f_member_address: '',
        f_member_phone: '',
        f_aadhar_card_no: '',
        f_ration_card_no: '',
        r_aadhar_card_no: '',
        r_ration_card_no: '',
        any_other: '',
        description: '',
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        let updatedValue = value;

        // Aadhaar card formatting
        if (name === "f_aadhar_card_no" || name === "r_aadhar_card_no") {
            const digitsOnly = value.replace(/\D/g, '').slice(0, 12); // Get only digits, max 12
            updatedValue = digitsOnly.replace(/(.{4})/g, '$1 ').trim(); // Format with space

            // Aadhaar error check: must be exactly 12 digits
            setFormErrors((prevErrors) => ({
                ...prevErrors,
                [name]: digitsOnly.length === 12 ? "" : "Aadhaar number must be exactly 12 digits"
            }));
        }

        // Phone number validation
        if (name === "f_member_phone" || name === "phone_no") {
            updatedValue = value.replace(/\D/g, '').slice(0, 10);

            // Phone error check: must be exactly 10 digits
            setFormErrors((prevErrors) => ({
                ...prevErrors,
                [name]: updatedValue.length === 10 ? "" : "Please enter exactly 10 digits"
            }));
        }

        setFormData(prev => ({
            ...prev,
            [name]: updatedValue
        }));
    };

    const handleInputChange1 = (e) => {
        const { name, value } = e.target;
        let updatedValue = value;

        // Aadhaar card formatting
        if (name === "f_aadhar_card_no" || name === "r_aadhar_card_no") {
            const digitsOnly = value.replace(/\D/g, '').slice(0, 12); // Get only digits, max 12
            updatedValue = digitsOnly.replace(/(.{4})/g, '$1 ').trim(); // Format with space

            // Aadhaar error check: must be exactly 12 digits
            setFormErrors((prevErrors) => ({
                ...prevErrors,
                [name]: digitsOnly.length === 12 ? "" : "Aadhaar number must be exactly 12 digits"
            }));
        }



        // Phone number validation
        if (name === "f_member_phone" || name === "phone_no") {
            updatedValue = value.replace(/\D/g, '').slice(0, 10);

            // Phone error check: must be exactly 10 digits
            setFormErrors((prevErrors) => ({
                ...prevErrors,
                [name]: updatedValue.length === 10 ? "" : "Please enter exactly 10 digits"
            }));
        }

        setStoreData(prev => ({
            ...prev,
            [name]: updatedValue
        }));
    };



    const handleInputChange2 = (e) => {
        setRefData({ ...refData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFiles({
            ...files,
            [e.target.name]: Array.from(e.target.files)  // Store all selected files as an array
        });
    };

    // Automatically fetch data when admission number is typed
    useEffect(() => {
        if (admissionNumber.trim().length >= 8) { // Adjust minimum length as needed
            fetchFormData();
        }
    }, [admissionNumber]);

    const fetchFormData = async () => {
        try {
            const response = await apiRoute.get(`/admision/get_scrb_formdata/${admissionNumber}`);
            setStoreData(response.data.data[0]);
        } catch (error) {
            console.error('Error fetching data', error);
            alert("Admission Number Not found");
        }
    };

    const f_aadhar_cardRef = useRef(null);
    const f_ration_cardRef = useRef(null);
    const r_aadhar_cardRef = useRef(null);
    const r_ration_cardRef = useRef(null);
    const govt_idRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!admissionNumber || admissionNumber.trim() === '') {
            alert("Admission Number is required.");
            return;
        }

        const trimmedAdNo = admissionNumber.trim();

        if (!/^\d{8}$/.test(trimmedAdNo) && !/^\d{10}$/.test(trimmedAdNo)) {
            alert("Admission Number must be exactly 8 or 10 digits (numbers only).");
            return;
        }

        // Aadhaar Validation
        if (storeData.f_aadhar_card_no && storeData.f_aadhar_card_no !== "UNKNOWN") {
            const digitsOnly = storeData.f_aadhar_card_no.replace(/\D/g, '');
            if (digitsOnly.length !== 12) {
                alert("Aadhaar number must be 12 digits or type UNKNOWN");
                return;
            }
        }

        if (storeData.f_member_phone && storeData.f_member_phone !== "UNKNOWN") {
            const digitsOnly = storeData.f_member_phone.replace(/\D/g, '');
            if (digitsOnly.length !== 10) {
                alert("Phone number must be 10 digits or type UNKNOWN");
                return;
            }
        }

        const data = new FormData();
        data.append('admissionNumber', admissionNumber);
        data.append('rescue_name', storeData.rescue_name);
        data.append('f_member_age', storeData.f_member_age);
        data.append('description', storeData.description);
        data.append('f_aadhar_card', files.f_aadhar_card);
        data.append('f_ration_card', files.f_ration_card);
        data.append('r_aadhar_card', files.r_aadhar_card);
        data.append('r_ration_card', files.r_ration_card);
        data.append('govt_id', files.govt_id);
        data.append('rescue_relationship', storeData.rescue_relationship);
        data.append('f_member_name', storeData.f_member_name);
        data.append('f_member_phone', storeData.f_member_phone);
        data.append('f_member_address', storeData.f_member_address);
        data.append('f_aadhar_card_no', storeData.f_aadhar_card_no);
        data.append('f_ration_card_no', storeData.f_ration_card_no);
        data.append('r_aadhar_card_no', storeData.r_aadhar_card_no);
        data.append('r_ration_card_no', storeData.r_ration_card_no);
        data.append('any_other', storeData.any_other);

        if (files.f_aadhar_card && files.f_aadhar_card.length > 0) {
            files.f_aadhar_card.forEach(file => {
                data.append('f_aadhar_card', file); // ✅ no []
            });
        }

        if (files.f_ration_card && files.f_ration_card.length > 0) {
            files.f_ration_card.forEach(file => {
                data.append('f_ration_card', file); // ✅ no []
            });
        }

        if (files.r_aadhar_card && files.r_aadhar_card.length > 0) {
            files.r_aadhar_card.forEach(file => {
                data.append('r_aadhar_card', file); // ✅ no []
            });
        }

        if (files.r_ration_card && files.r_ration_card.length > 0) {
            files.r_ration_card.forEach(file => {
                data.append('r_ration_card', file); // ✅ no []
            });
        }

        if (files.govt_id && files.govt_id.length > 0) {
            files.govt_id.forEach(file => {
                data.append('govt_id', file); // ✅ no []
            });
        }

        try {
            const res = await apiRoute.post('/reunion/create_family_letter', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (res.data.message === "Family Request Letter Form Created Successfully") {
                alert("Family Request Form Submitted Successfully");
                setStoreData({
                    admission_no: '',
                    rescue_name: '',
                    age: '',
                    gender: 'Male',
                    phone_no: '',
                    rescue_relationship: '',
                    f_member_name: '',
                    f_member_age: '',
                    f_member_address: '',
                    f_member_phone: '',
                    f_aadhar_card_no: '',
                    f_ration_card_no: '',
                    r_aadhar_card_no: '',
                    r_ration_card_no: '',
                    any_other: '',
                    description: '',
                })
                setAdmissionNumber("");
                if (f_aadhar_cardRef.current) f_aadhar_cardRef.current.value = "";
                if (f_ration_cardRef.current) f_ration_cardRef.current.value = "";
                if (r_aadhar_cardRef.current) r_aadhar_cardRef.current.value = "";
                if (r_ration_cardRef.current) r_ration_cardRef.current.value = "";
                if (govt_idRef.current) govt_idRef.current.value = "";
            } else {
                setSubmissionMessage("Submission failed.");
                setMessageType("danger");
            }

        } catch (error) {
            console.error("Error submitting form", error);
            setSubmissionMessage("Something went wrong.");
            setMessageType("danger");
        }
    }

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

    const ViewFormData = async () => {
        try {
            const response = await apiRoute.get(`/reunion/get_family_letter/${admissionNumber}`);
            const data = response.data;

            // Update form fields
            setRefData((refData) => ({
                ...refData,
                rescue_name: data.rescue_name || '',
                f_member_age: data.age || '',
                description: data.description || '',
                family_relationship: data.family_relationship || '',
                f_aadhar_card_no: data.f_aadhar_card_no || '',
                f_ration_card_no: data.f_ration_card_no || '',
                r_aadhar_card_no: data.r_aadhar_card_no || '',
                r_ration_card_no: data.r_ration_card_no || '',
                f_member_name: data.f_member_name || '',
                f_member_phone: data.f_member_phone || 'NULL',
                f_member_address: data.f_member_address || '',
            }));
            console.log("Fetched Data:", data);

            // Parse form7_attach image array
            let f_aadhar_cardPaths = [];
            if (data.f_aadhar_card) {
                try {
                    const parsed = JSON.parse(data.f_aadhar_card);
                    if (Array.isArray(parsed)) {
                        f_aadhar_cardPaths = parsed.map((p) => `https://www.pahrultours.com/app2/${p.replace(/"/g, '')}`);
                    }
                } catch (err) {
                    console.warn('Failed to parse form7_attach:', err);
                    // Fallback: comma-separated string
                    f_aadhar_cardPaths = data.f_aadhar_card
                        .split(',')
                        .map((p) => `https://www.pahrultours.com/app2/${p.trim().replace(/^"|"$/g, '')}`);
                }
            }

            let f_ration_cardPaths = [];
            if (data.f_ration_card) {
                try {
                    const parsed = JSON.parse(data.f_ration_card);
                    if (Array.isArray(parsed)) {
                        f_ration_cardPaths = parsed.map((p) => `https://www.pahrultours.com/app2/${p.replace(/"/g, '')}`);
                    }
                } catch (err) {
                    console.warn('Failed to parse form7_attach:', err);
                    // Fallback: comma-separated string
                    f_ration_cardPaths = data.f_ration_card
                        .split(',')
                        .map((p) => `https://www.pahrultours.com/app2/${p.trim().replace(/^"|"$/g, '')}`);
                }
            }

            let r_aadhar_cardPaths = [];
            if (data.r_aadhar_card) {
                try {
                    const parsed = JSON.parse(data.r_aadhar_card);
                    if (Array.isArray(parsed)) {
                        r_aadhar_cardPaths = parsed.map((p) => `https://www.pahrultours.com/app2/${p.replace(/"/g, '')}`);
                    }
                } catch (err) {
                    console.warn('Failed to parse form7_attach:', err);
                    // Fallback: comma-separated string
                    r_aadhar_cardPaths = data.r_aadhar_card
                        .split(',')
                        .map((p) => `https://www.pahrultours.com/app2/${p.trim().replace(/^"|"$/g, '')}`);
                }
            }

            let r_ration_cardPaths = [];
            if (data.r_ration_card) {
                try {
                    const parsed = JSON.parse(data.r_ration_card);
                    if (Array.isArray(parsed)) {
                        r_ration_cardPaths = parsed.map((p) => `https://www.pahrultours.com/app2/${p.replace(/"/g, '')}`);
                    }
                } catch (err) {
                    console.warn('Failed to parse form7_attach:', err);
                    // Fallback: comma-separated string
                    r_ration_cardPaths = data.r_ration_card
                        .split(',')
                        .map((p) => `https://www.pahrultours.com/app2/${p.trim().replace(/^"|"$/g, '')}`);
                }
            }

            let govt_idPaths = [];
            if (data.govt_id) {
                try {
                    const parsed = JSON.parse(data.govt_id);
                    if (Array.isArray(parsed)) {
                        govt_idPaths = parsed.map((p) => `https://www.pahrultours.com/app2/${p.replace(/"/g, '')}`);
                    }
                } catch (err) {
                    console.warn('Failed to parse form7_attach:', err);
                    // Fallback: comma-separated string
                    govt_idPaths = data.govt_id
                        .split(',')
                        .map((p) => `https://www.pahrultours.com/app2/${p.trim().replace(/^"|"$/g, '')}`);
                }
            }

            console.log(f_aadhar_cardPaths);
            console.log(f_ration_cardPaths);
            console.log(r_aadhar_cardPaths);
            console.log(r_ration_cardPaths);
            console.log(govt_idPaths);

            // Handle old and new photo paths correctly
            // const aadharCardPath = data.f_aadhar_card ? `https://www.pahrultours.com/app2/${data.f_aadhar_card}` : null;
            // const rationCardPath = data.f_ration_card ? `https://www.pahrultours.com/app2/${data.f_ration_card}` : null;
            // const residentaadharCardPath = data.r_aadhar_card ? `https://www.pahrultours.com/app2/${data.r_aadhar_card}` : null;
            // const residentrationCardPath = data.r_ration_card ? `https://www.pahrultours.com/app2/${data.r_ration_card}` : null;
            // const govt_idPath = data.govt_id ? `https://www.pahrultours.com/app2/${data.govt_id}` : null;
            // Set files state
            setFiles((files) => ({
                ...files,
                f_aadhar_card: f_aadhar_cardPaths,
                f_ration_card: f_ration_cardPaths,
                r_aadhar_card: r_aadhar_cardPaths,
                r_ration_card: r_ration_cardPaths,
                govt_id: govt_idPaths,
            }));

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

    const handleShow = async (admissionNumber) => {
        try {
            const response = await apiRoute.get(`/reunion/get_family_letter/${admissionNumber}`);
            const data = response.data;

            setFormData((formData) => ({
                ...formData,
                rescue_name: data.rescue_name || 'NULL',
                f_member_age: data.age || 'NULL',
                description: data.description || 'NULL',
                family_relationship: data.family_relationship || 'NULL',
                f_member_name: data.f_member_name || 'NULL',
                f_member_phone: data.f_member_phone || 'NULL',
                f_member_address: data.f_member_address || 'NULL',
                f_aadhar_card_no: data.f_aadhar_card_no || 'NULL',
                f_ration_card_no: data.f_ration_card_no || 'NULL',
                r_aadhar_card_no: data.r_aadhar_card_no || 'NULL',
                r_ration_card_no: data.r_ration_card_no || 'NULL',
            }));

            // Helper function to parse image paths
            const parseImageField = (fieldData) => {
                let paths = [];
                if (fieldData) {
                    try {
                        const parsed = JSON.parse(fieldData);
                        if (Array.isArray(parsed)) {
                            paths = parsed.map((p) =>
                                `https://www.pahrultours.com/app2/${p.replace(/"/g, '')}`
                            );
                        }
                    } catch (err) {
                        // Fallback to comma-separated string
                        paths = fieldData
                            .split(',')
                            .map((p) =>
                                `https://www.pahrultours.com/app2/${p.trim().replace(/^"|"$/g, '')}`
                            );
                    }
                }
                return paths;
            };

            const aadharCardPath = parseImageField(data.f_aadhar_card);
            const rationCardPath = parseImageField(data.f_ration_card);
            const residentaadharCardPath = parseImageField(data.r_aadhar_card);
            const residentrationCardPath = parseImageField(data.r_ration_card);
            const govt_idPath = parseImageField(data.govt_id);

            // Set files state
            setFiles((files) => ({
                ...files,
                f_aadhar_card: aadharCardPath,
                f_ration_card: rationCardPath,
                r_aadhar_card: residentaadharCardPath,
                r_ration_card: residentrationCardPath,
                govt_id: govt_idPath,
            }));

            setShow(true);
        } catch (error) {
            console.error("Error fetching form data:", error);
            alert("Admission Number not found");
        }
    };

    const createFormData = () => {
        const targetElement = document.querySelector('.family_request_form');
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: 'smooth' });
        }
    }

    const handleUpdate = async (e, admissionNumber) => {
        e.preventDefault();

        // Aadhaar Validation
        if (formData.f_aadhar_card_no && formData.f_aadhar_card_no !== "UNKNOWN") {
            const digitsOnly = formData.f_aadhar_card_no.replace(/\D/g, '');
            if (digitsOnly.length !== 12) {
                alert("Aadhaar number must be 12 digits or type UNKNOWN");
                return;
            }
        }

        if (formData.f_member_phone && formData.f_member_phone !== "UNKNOWN") {
            const digitsOnly = formData.f_member_phone.replace(/\D/g, '');
            if (digitsOnly.length !== 10) {
                alert("Phone number must be 10 digits or type UNKNOWN");
                return;
            }
        }

        const data = new FormData();
        data.append('rescue_name', formData.rescue_name);
        data.append('f_member_age', formData.f_member_age);
        data.append('description', formData.description);
        data.append('phone_no', formData.phone_no);
        data.append('family_relationship', formData.family_relationship);
        data.append('f_member_name', formData.f_member_name);
        data.append('f_member_phone', formData.f_member_phone);
        data.append('f_member_address', formData.f_member_address);
        data.append('f_aadhar_card_no', formData.f_aadhar_card_no);
        data.append('f_ration_card_no', formData.f_ration_card_no);
        data.append('r_aadhar_card_no', formData.r_aadhar_card_no);
        data.append('r_ration_card_no', formData.r_ration_card_no);
        data.append('f_aadhar_card', files.f_aadhar_card);
        data.append('f_ration_card', files.f_ration_card);
        data.append('r_aadhar_card', files.r_aadhar_card);
        data.append('r_ration_card', files.r_ration_card);
        data.append('govt_id', files.govt_id);
        if (files.f_aadhar_card && files.f_aadhar_card.length > 0) {
            files.f_aadhar_card.forEach(file => {
                data.append('f_aadhar_card', file); // ✅ no []
            });
        }

        if (files.f_ration_card && files.f_ration_card.length > 0) {
            files.f_ration_card.forEach(file => {
                data.append('f_ration_card', file); // ✅ no []
            });
        }

        if (files.r_aadhar_card && files.r_aadhar_card.length > 0) {
            files.r_aadhar_card.forEach(file => {
                data.append('r_aadhar_card', file); // ✅ no []
            });
        }

        if (files.r_ration_card && files.r_ration_card.length > 0) {
            files.r_ration_card.forEach(file => {
                data.append('r_ration_card', file); // ✅ no []
            });
        }

        if (files.govt_id && files.govt_id.length > 0) {
            files.govt_id.forEach(file => {
                data.append('govt_id', file); // ✅ no []
            });
        }

        try {
            const res = await apiRoute.post(`/reunion/update_family_letter/${admissionNumber}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            console.log("Update response:", res.data);

            const message = res.data.message?.toLowerCase() || "";

            if (message.includes("updated successfully")) {
                alert("Form Updated Successfully");
                handleClose(true);
                setFormData({
                    admission_no: '',
                    rescue_name: '',
                    age: '',
                    gender: 'Male',
                    phone_no: '',
                    rescue_relationship: '',
                    f_member_name: '',
                    f_member_age: '',
                    f_member_address: '',
                    f_member_phone: '',
                    f_aadhar_card_no: '',
                    f_ration_card_no: '',
                    r_aadhar_card_no: '',
                    r_ration_card_no: '',
                    any_other: '',
                    description: '',
                })
                setStoreData({
                    rescue_name: '',
                    age: '',
                    gender: '',
                    phone_no: '',
                })
                setAdmissionNumber("");
                if (f_aadhar_cardRef.current) f_aadhar_cardRef.current.value = "";
                if (f_ration_cardRef.current) f_ration_cardRef.current.value = "";
                if (r_aadhar_cardRef.current) r_aadhar_cardRef.current.value = "";
                if (r_ration_cardRef.current) r_ration_cardRef.current.value = "";
                if (govt_idRef.current) govt_idRef.current.value = "";
            } else {
                setSubmissionMessage(res.data.message || "Update failed.");
                setMessageType("danger");
            }
        } catch (err) {
            console.error("Update error:", err);
            setSubmissionMessage("Something went wrong while updating the form.");
            setMessageType("danger");
        }
    };


    const handleDelete = async (admissionNumber) => {
        alert("Are you sure want to delete");
        try {
            const response = await apiRoute.delete(`/reunion/deleteFamilyRequest/${admissionNumber}`);
            console.log(response);
            alert("First Form Details Deleted successfully");
            // Refresh data after deletion
            getRescueDetails(); // if this function fetches updated student list
        } catch (error) {
            console.error('Failed to delete item:', error);
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
                            imagePath = `https://www.pahrultours.com/app2/${imageArray[0]}`;
                        }
                    } catch (parseError) {
                        console.error("Error parsing image array:", parseError);
                        imagePath = null;
                    }
                } else {
                    // It's a single image path
                    imagePath = result.rescue_image.startsWith("http")
                        ? result.rescue_image
                        : `https://www.pahrultours.com/app2/${result.rescue_image}`;
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

    // Trigger when admission number changes
    useEffect(() => {
        if (admissionNumber.trim() !== "") {
            fetchRescueDetails(admissionNumber);
        } else {
            setRescueImage(null);
            setRescueName("");
            setError("");
        }
    }, [admissionNumber]);


    return (
        <div>
            <Container fluid>
                <Row className='d-flex align-items-center justify-content-between'>
                    <Col md={2} className='text-start'>
                        <Breadcrumb className="d-none d-md-inline-block mb-0" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
                            <Breadcrumb.Item></Breadcrumb.Item>
                            <Breadcrumb.Item>Home</Breadcrumb.Item>
                            <Breadcrumb.Item active>Reunion</Breadcrumb.Item>
                        </Breadcrumb>
                        <h6 className="breadcrumb_title">Rescue Reunion</h6>
                    </Col>
                    <Col md={8} className="text-center">
                        <h3 className="section_title">1. Family Request Form – Discharge of Resident</h3>
                    </Col>
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
                </Row>
            </Container>

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
                                    value={admissionNumber}
                                    onChange={(e) => setAdmissionNumber(e.target.value)}
                                />
                            </InputGroup>
                        </Col>
                        <button type="button" className="btn btn-secondary mx-1" onClick={() => {
                            if (!admissionNumber.trim()) {
                                alert("Please enter admission number.");
                            } else {
                                ViewFormData(); // Fetch & populate data before generating PDF
                            }
                        }}><FontAwesomeIcon icon={faEye} className="me-0" /></button>
                        {userType === "1" && (
                            <button type="button" className="btn btn-success mx-1" onClick={() => {
                                if (!admissionNumber.trim()) {
                                    alert("Please enter admission number.");
                                } else {
                                    createFormData(); // Fetch & populate data before generating PDF
                                }
                            }}><FontAwesomeIcon icon={faPlus} className="me-0" /></button>
                        )}
                        <button type="button" className="btn btn-success mx-1" onClick={() => {
                            if (!admissionNumber.trim()) {
                                alert("Please enter admission number.");
                            } else {
                                handleShow(admissionNumber); // Fetch & populate data before generating PDF
                            }
                        }}><FontAwesomeIcon icon={faEdit} className="me-0" /></button>
                        {/* {userType === "2" && (
                            <button type="button" className="btn btn-success mx-1" onClick={() => {
                                if (!admissionNumber.trim()) {
                                    alert("Please enter admission number.");
                                } else {
                                    handleDelete(admissionNumber); // Fetch & populate data before generating PDF
                                }
                            }}><FontAwesomeIcon icon={faTrash} className="me-0" /></button>
                        )} */}
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

                <Row>
                    <Form className='d-flex align-items-center justify-content-center flex-column family_request_form' onSubmit={handleSubmit}>

                        <Col md={8} className='family_form'>
                            <h5 className="pdfsub_heading">Rescue Details:</h5>

                            <Form.Group as={Row} className="mb-1 text-start" controlId="formInformation">
                                <Form.Label column sm="4">
                                    Admission No : <span style={{ color: 'red' }}>*</span>
                                </Form.Label>
                                <Col sm="8">
                                    <Form.Control
                                        name="admission_no"
                                        type='text'
                                        value={admissionNumber}
                                        onChange={handleInputChange1}
                                        isInvalid={!!admissionNumberError}
                                        required />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-1 text-start" controlId="formEmailID">
                                <Form.Label column sm="4">
                                    Name : <span style={{ color: 'red' }}>*</span>
                                </Form.Label>
                                <Col sm="8">
                                    <Form.Control
                                        name="rescue_name"
                                        type="text"
                                        value={storeData.rescue_name}
                                        onChange={handleInputChange1}
                                        required
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-1 text-start" controlId="formTakenFrom">
                                <Form.Label column sm="4">
                                    Age : <span style={{ color: 'red' }}>*</span>
                                </Form.Label>
                                <Col sm="8">
                                    <Form.Control
                                        name="age"
                                        type='text'
                                        value={storeData.age}
                                        onChange={handleInputChange1}
                                        required />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-1 text-start" controlId="formDateTime">
                                <Form.Label column sm="4">
                                    Gender : <span style={{ color: 'red' }}>*</span>
                                </Form.Label>
                                <Col sm="8">
                                    <Form.Control
                                        name="gender"
                                        type='text'
                                        value={"Male"}
                                        onChange={handleInputChange1}
                                        required />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-1 text-start">
                                <Form.Label column sm="4">
                                    Phone Number : <span style={{ color: 'red' }}>*</span>
                                </Form.Label>
                                <Col sm="8">
                                    <Form.Control
                                        name="phone_no"
                                        type='number'
                                        value={storeData.phone_no}
                                        onChange={handleInputChange1}
                                        isInvalid={!!formErrors.phone_no}
                                        required />
                                    {formErrors.phone_no && (
                                        <div className="text-danger small mt-1">
                                            {formErrors.phone_no}
                                        </div>
                                    )}
                                </Col>
                            </Form.Group>

                        </Col>

                        <Col md={8} className='family_form'>
                            <h5 className="pdfsub_heading">Family Details</h5>

                            <Form.Group as={Row} className="mb-1 text-start" controlId="formInformation">
                                <Form.Label column sm="4">
                                    Relationship : <span style={{ color: 'red' }}>*</span>
                                </Form.Label>
                                <Col sm="8">
                                    <Form.Control
                                        name="rescue_relationship"
                                        type='text'
                                        value={storeData.rescue_relationship}
                                        onChange={handleInputChange1}
                                        required />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-1 text-start" controlId="formEmailID">
                                <Form.Label column sm="4">
                                    Name : <span style={{ color: 'red' }}>*</span>
                                </Form.Label>
                                <Col sm="8">
                                    <Form.Control
                                        name="f_member_name"
                                        type="text"
                                        value={storeData.f_member_name}
                                        onChange={handleInputChange1}
                                        required
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-1 text-start" controlId="formTakenFrom">
                                <Form.Label column sm="4">
                                    Age : <span style={{ color: 'red' }}>*</span>
                                </Form.Label>
                                <Col sm="8">
                                    <Form.Control
                                        name="f_member_age"
                                        type='text'
                                        value={storeData.f_member_age}
                                        onChange={handleInputChange1}
                                        required
                                    />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-1 text-start" controlId="formDateTime">
                                <Form.Label column sm="4">
                                    Phone No : <span style={{ color: 'red' }}>*</span>
                                </Form.Label>
                                <Col sm="8">
                                    <Form.Control
                                        name="f_member_phone"
                                        type='text'
                                        value={storeData.f_member_phone}
                                        onChange={handleInputChange1}
                                        required />
                                    {formErrors.f_member_phone && (
                                        <div className="text-danger small mt-1">
                                            {formErrors.f_member_phone}
                                        </div>
                                    )}
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-1 text-start" controlId="formPoliceMemo">
                                <Form.Label column sm="4">
                                    Address : <span style={{ color: 'red' }}>*</span>
                                </Form.Label>
                                <Col sm="8">
                                    <Form.Control
                                        name="f_member_address"
                                        type='text'
                                        value={storeData.f_member_address}
                                        onChange={handleInputChange1}
                                        required />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-1 text-start" controlId="formPoliceMemo">
                                <Form.Label column sm="4">
                                    Aadhar Card Number (Relation): <span style={{ color: 'red' }}>*</span>
                                </Form.Label>
                                <Col sm="8">
                                    <Form.Control
                                        type="text"
                                        name='f_aadhar_card_no'
                                        value={storeData.f_aadhar_card_no}
                                        onChange={handleInputChange1}
                                        required />
                                    {formErrors.f_aadhar_card_no && (
                                        <div className="text-danger small mt-1">
                                            {formErrors.f_aadhar_card_no}
                                        </div>
                                    )}
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-1 text-start" controlId="formPoliceMemo">
                                <Form.Label column sm="4">
                                    Aadhar Card  (Relation):
                                </Form.Label>
                                <Col sm="8">
                                    <Form.Control
                                        type="file"
                                        accept=".jpg,.jpeg,.png"
                                        name='f_aadhar_card'
                                        ref={f_aadhar_cardRef}
                                        multiple
                                        onChange={handleFileChange} />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-1 text-start" controlId="formPoliceMemo">
                                <Form.Label column sm="4">
                                    Ration Card Number (Relation): <span style={{ color: 'red' }}>*</span>
                                </Form.Label>
                                <Col sm="8">
                                    <Form.Control
                                        type="text"
                                        name="f_ration_card_no"
                                        value={storeData.f_ration_card_no}
                                        onChange={handleInputChange1}
                                        required />
                                    {/* {formErrors.f_ration_card_no && (
                                        <div className="text-danger small mt-1">
                                            {formErrors.f_ration_card_no}
                                        </div>
                                    )} */}
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-1 text-start" controlId="formPoliceMemo">
                                <Form.Label column sm="4">
                                    Ration Card  (Relation):
                                </Form.Label>
                                <Col sm="8">
                                    <Form.Control
                                        type="file"
                                        accept=".jpg,.jpeg,.png"
                                        name="f_ration_card"
                                        multiple
                                        ref={f_ration_cardRef}
                                        onChange={handleFileChange} />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-1 text-start" controlId="formPoliceMemo">
                                <Form.Label column sm="4">
                                    Aadhar Card Number (Resident):
                                </Form.Label>
                                <Col sm="8">
                                    <Form.Control
                                        type="text"
                                        name='r_aadhar_card_no'
                                        value={storeData.r_aadhar_card_no}
                                        onChange={handleInputChange1}
                                        isInvalid={!!formErrors.r_aadhar_card_no}
                                    />
                                    {formErrors.r_aadhar_card_no && (
                                        <div className="text-danger small mt-1">
                                            {formErrors.r_aadhar_card_no}
                                        </div>
                                    )}
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-1 text-start" controlId="formPoliceMemo">
                                <Form.Label column sm="4">
                                    Aadhar Card  (Resident):
                                </Form.Label>
                                <Col sm="8">
                                    <Form.Control
                                        type="file"
                                        accept=".jpg,.jpeg,.png"
                                        name='r_aadhar_card'
                                        multiple
                                        ref={r_aadhar_cardRef}
                                        onChange={handleFileChange} />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-1 text-start" controlId="formPoliceMemo">
                                <Form.Label column sm="4">
                                    Ration Card Number (Resident):
                                </Form.Label>
                                <Col sm="8">
                                    <Form.Control
                                        type="text"
                                        name="r_ration_card_no"
                                        value={storeData.r_ration_card_no}
                                        // isInvalid={!!formErrors.r_aadhar_card_no}
                                        onChange={handleInputChange1} />
                                    {/* {formErrors.r_ration_card_no && (
                                        <div className="text-danger small mt-1">
                                            {formErrors.r_ration_card_no}
                                        </div>
                                    )} */}
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-1 text-start" controlId="formPoliceMemo">
                                <Form.Label column sm="4">
                                    Ration Card  (Resident):
                                </Form.Label>
                                <Col sm="8">
                                    <Form.Control
                                        type="file"
                                        accept=".jpg,.jpeg,.png"
                                        name="r_ration_card"
                                        multiple
                                        ref={r_ration_cardRef}
                                        onChange={handleFileChange} />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-1 text-start" controlId="formPoliceMemo">
                                <Form.Label column sm="4">
                                    Any other :
                                </Form.Label>
                                <Col sm="8">
                                    <Form.Control
                                        type="text"
                                        name="any_other"
                                        value={storeData.any_other}
                                        onChange={handleInputChange1} />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-1 text-start" controlId="formPoliceMemo">
                                <Form.Label column sm="4">
                                    Any other Document:
                                </Form.Label>
                                <Col sm="8">
                                    <Form.Control
                                        type="file"
                                        accept=".jpg,.jpeg,.png"
                                        name="govt_id"
                                        ref={govt_idRef}
                                        multiple
                                        onChange={handleFileChange} />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-1 text-start" controlId="formPoliceMemo">
                                <Form.Label column sm="4">
                                    Description : <span style={{ color: 'red' }}>*</span>
                                </Form.Label>
                                <Col sm="8">
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        name="description"
                                        type='number'
                                        value={storeData.description}
                                        onChange={handleInputChange1}
                                        required />
                                </Col>
                            </Form.Group>

                        </Col>
                        <div className="mt-3 d-flex align-tems-cente justify-content-between">
                            <Button variant="success" className="m-1 mb-5" type="submit">Submit</Button>
                        </div>

                    </Form>

                    <div ref={formRef} style={{ position: "absolute", left: "-9999px", top: 0, background: "#fff", padding: "20px", width: "210mm" }}>
                        <Row className="d-flex align-items-center justify-content-center mb-2">
                            <Col md={3} className='d-flex align-items-center pdf_logo'>
                                <img src={manasu_logo} className="pdf_logo" alt="" />
                                {/* <div className="logo_text">
                                    <h4><span>MANASU</span> <br />Mental Health Charity Home <br/>Chennai-43,</h4>
                                </div> */}
                            </Col>
                            <Col md={9}>
                                <h4 className="text-center">1. Family Request Form – Discharge of Resident</h4>
                            </Col>
                        </Row>

                        <Form className='d-flex align-items-center justify-content-center flex-column'>

                            <Col md={11}>
                                <h5 className="pdfsub_heading">Rescue Details:</h5>

                                <Form.Group as={Row} className="mb-1 text-start" controlId="formInformation">
                                    <Form.Label column sm="4">
                                        Admission No :
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control
                                            name="admission_no"
                                            type='number'
                                            value={admissionNumber}
                                            onChange={handleInputChange2}
                                            required />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1 text-start" controlId="formEmailID">
                                    <Form.Label column sm="4">
                                        Name :
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control
                                            name="rescue_name"
                                            type="text"
                                            value={refData.rescue_name}
                                            onChange={handleInputChange2}
                                            required
                                        />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-1 text-start" controlId="formTakenFrom">
                                    <Form.Label column sm="4">
                                        Age :
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control
                                            name="age"
                                            type='text'
                                            value={storeData.age || "NULL"}
                                            onChange={handleInputChange2}
                                            required />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1 text-start" controlId="formDateTime">
                                    <Form.Label column sm="4">
                                        Gender :
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control
                                            name="gender"
                                            type='text'
                                            value={"Male"}
                                            onChange={handleInputChange2}
                                            required />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1 text-start" controlId="formPoliceMemo">
                                    <Form.Label column sm="4">
                                        Phone Number :
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control
                                            name="phone_no"
                                            type='number'
                                            value={storeData.phone_no || "NULL"}
                                            onChange={handleInputChange2}
                                            required />
                                    </Col>
                                </Form.Group>

                            </Col>

                            <Col md={11}>
                                <h5 className="pdfsub_heading">Family Details</h5>

                                <Form.Group as={Row} className="mb-1 text-start" controlId="formInformation">
                                    <Form.Label column sm="4">
                                        Relationship :
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control
                                            name="family_relationship"
                                            type='text'
                                            value={refData.family_relationship}
                                            onChange={handleInputChange2}
                                            required />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1 text-start" controlId="formEmailID">
                                    <Form.Label column sm="4">
                                        Name :
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control
                                            name="f_member_name"
                                            type="text"
                                            value={refData.f_member_name}
                                            onChange={handleInputChange2}
                                            required
                                        />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-1 text-start" controlId="formTakenFrom">
                                    <Form.Label column sm="4">
                                        Age :
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control
                                            name="f_member_age"
                                            type='text'
                                            value={refData.f_member_age}
                                            onChange={handleInputChange2}
                                            required
                                        />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1 text-start" controlId="formDateTime">
                                    <Form.Label column sm="4">
                                        Phone No :
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control
                                            name="f_member_phone"
                                            type='text'
                                            value={refData.f_member_phone}
                                            onChange={handleInputChange2}
                                            required />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1 text-start" controlId="formPoliceMemo">
                                    <Form.Label column sm="4">
                                        Address :
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control
                                            name="f_member_address"
                                            type='text'
                                            value={refData.f_member_address}
                                            onChange={handleInputChange2}
                                            required />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-1 text-start" controlId="formPoliceMemo">
                                    <Form.Label column sm="4">
                                        Aadhar Card Number (Relation):
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control
                                            type="text"
                                            name='f_aadhar_card_no'
                                            value={refData.f_aadhar_card_no}
                                            onChange={handleInputChange2}
                                            required />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3 text-start" controlId="formPoliceMemo">
                                    <Form.Label column sm="4">
                                        Aadhar Card (Relation) :
                                    </Form.Label>
                                    <Col sm="8">
                                        {Array.isArray(files.f_aadhar_card) &&
                                            files.f_aadhar_card.map((imgUrl, index) => (
                                                <img
                                                    key={index}
                                                    src={imgUrl}
                                                    alt={`f_aadhar_card - ${index}`}
                                                    style={{
                                                        width: "150px",
                                                        height: "auto",
                                                        margin: "10px",
                                                        border: "1px solid #ccc",
                                                    }}
                                                    onError={(e) => {
                                                        e.target.src = "/fallback-image.png";
                                                    }}
                                                />
                                            ))}
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-1 text-start" controlId="formPoliceMemo">
                                    <Form.Label column sm="4">
                                        Ration Card Number (Relation):
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control
                                            type="text"
                                            name="f_ration_card_no"
                                            value={refData.f_ration_card_no}
                                            onChange={handleInputChange2}
                                            required />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-3 text-start" controlId="formPoliceMemo">
                                    <Form.Label column sm="4">
                                        Ration Card (Relation):
                                    </Form.Label>
                                    <Col sm="8">
                                        {Array.isArray(files.f_ration_card) &&
                                            files.f_ration_card.map((imgUrl, index) => (
                                                <img
                                                    key={index}
                                                    src={imgUrl}
                                                    alt={`f_ration_card - ${index}`}
                                                    style={{
                                                        width: "150px",
                                                        height: "auto",
                                                        margin: "10px",
                                                        border: "1px solid #ccc",
                                                    }}
                                                    onError={(e) => {
                                                        e.target.src = "/fallback-image.png";
                                                    }}
                                                />
                                            ))}

                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-4 text-start" controlId="formPoliceMemo">
                                    <Form.Label column sm="4">
                                        Aadhar Card Number (Resident):
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control
                                            type="text"
                                            name='r_aadhar_card_no'
                                            value={refData.r_aadhar_card_no}
                                            onChange={handleInputChange2}
                                            required />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-5 mt-5 text-start" controlId="formPoliceMemo">
                                    <Form.Label column sm="4">
                                        Aadhar Card (Resident):
                                    </Form.Label>
                                    <Col sm="8">
                                        {Array.isArray(files.r_aadhar_card) &&
                                            files.r_aadhar_card.map((imgUrl, index) => (
                                                <img
                                                    key={index}
                                                    src={imgUrl}
                                                    alt={`r_aadhar_card - ${index}`}
                                                    style={{
                                                        width: "150px",
                                                        height: "auto",
                                                        margin: "10px",
                                                        border: "1px solid #ccc",
                                                    }}
                                                    onError={(e) => {
                                                        e.target.src = "/fallback-image.png";
                                                    }}
                                                />
                                            ))}
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-1 text-start" controlId="formPoliceMemo">
                                    <Form.Label column sm="4">
                                        Ration Card Number (Resident):
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control
                                            type="text"
                                            name="r_ration_card_no"
                                            value={refData.r_ration_card_no}
                                            onChange={handleInputChange2} required />
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-5 text-start" controlId="formPoliceMemo">
                                    <Form.Label column sm="4">
                                        Ration Card (Resident):
                                    </Form.Label>
                                    <Col sm="8">
                                        {Array.isArray(files.r_ration_card) &&
                                            files.r_ration_card.map((imgUrl, index) => (
                                                <img
                                                    key={index}
                                                    src={imgUrl}
                                                    alt={`r_ration_card - ${index}`}
                                                    style={{
                                                        width: "150px",
                                                        height: "auto",
                                                        margin: "10px",
                                                        border: "1px solid #ccc",
                                                    }}
                                                    onError={(e) => {
                                                        e.target.src = "/fallback-image.png";
                                                    }}
                                                />
                                            ))}
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-1 text-start" controlId="formPoliceMemo">
                                    <Form.Label column sm="4">
                                        Any other :
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control
                                            type="text"
                                            name="any_other"
                                            value={refData.any_other}
                                            onChange={handleInputChange2} />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-5 mt-5 text-start" controlId="formPoliceMemo">
                                    <Form.Label column sm="4">
                                        Any other Government ID :
                                    </Form.Label>
                                    <Col sm="8">
                                        {Array.isArray(files.govt_id) &&
                                            files.govt_id.map((imgUrl, index) => (
                                                <img
                                                    key={index}
                                                    src={imgUrl}
                                                    alt={`govt_id - ${index}`}
                                                    style={{
                                                        width: "150px",
                                                        height: "auto",
                                                        margin: "10px",
                                                        border: "1px solid #ccc",
                                                    }}
                                                    onError={(e) => {
                                                        e.target.src = "/fallback-image.png";
                                                    }}
                                                />
                                            ))}
                                    </Col>
                                </Form.Group>

                                <Form.Group as={Row} className="mb-5 mt-5 text-start" controlId="formPoliceMemo">
                                    <Form.Label column sm="4">
                                        Description :
                                    </Form.Label>
                                    <Col sm="8">
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            name="description"
                                            type='number'
                                            value={refData.description}
                                            onChange={handleInputChange2}
                                            required />
                                    </Col>
                                </Form.Group>

                            </Col>
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

                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Edit Family Request Letter</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Col md={12}>
                                <Form>

                                    <Col md={12}>
                                        <h5 className="pdfsub_heading">Rescue Details:</h5>

                                        <Form.Group as={Row} className="mb-1 text-start" controlId="formInformation">
                                            <Form.Label column sm="6">
                                                Admission No : <span style={{ color: 'red' }}>*</span>
                                            </Form.Label>
                                            <Col sm="6">
                                                <Form.Control
                                                    name="admission_no"
                                                    type='number'
                                                    value={admissionNumber}
                                                    onChange={handleInputChange}
                                                    readOnly />
                                            </Col>
                                        </Form.Group>

                                        <Form.Group as={Row} className="mb-1 text-start" controlId="formEmailID">
                                            <Form.Label column sm="6">
                                                Name : <span style={{ color: 'red' }}>*</span>
                                            </Form.Label>
                                            <Col sm="6">
                                                <Form.Control
                                                    name="rescue_name"
                                                    type="text"
                                                    value={formData.rescue_name}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </Col>
                                        </Form.Group>
                                        <Form.Group as={Row} className="mb-1 text-start" controlId="formTakenFrom">
                                            <Form.Label column sm="6">
                                                Age : <span style={{ color: 'red' }}>*</span>
                                            </Form.Label>
                                            <Col sm="6">
                                                <Form.Control
                                                    name="age"
                                                    type='text'
                                                    value={storeData.age} // ✅ use formData here
                                                    onChange={handleInputChange1}
                                                    required
                                                />
                                            </Col>
                                        </Form.Group>

                                        <Form.Group as={Row} className="mb-1 text-start" controlId="formDateTime">
                                            <Form.Label column sm="6">
                                                Gender : <span style={{ color: 'red' }}>*</span>
                                            </Form.Label>
                                            <Col sm="6">
                                                <Form.Control
                                                    name="gender"
                                                    type='text'
                                                    value={"Male"}
                                                    onChange={handleInputChange}
                                                    required />
                                            </Col>
                                        </Form.Group>

                                        <Form.Group as={Row} className="mb-1 text-start" controlId="formPoliceMemo">
                                            <Form.Label column sm="6">
                                                Phone Number : <span style={{ color: 'red' }}>*</span>
                                            </Form.Label>
                                            <Col sm="6">
                                                <Form.Control
                                                    name="phone_no"
                                                    type='number'
                                                    value={storeData.phone_no}
                                                    onChange={handleInputChange1}
                                                    isInvalid={!!formErrors.phone_no}
                                                    required />
                                            </Col>
                                            {formErrors.phone_no && (
                                                <div className="text-danger small mt-1">
                                                    {formErrors.phone_no}
                                                </div>
                                            )}
                                        </Form.Group>

                                    </Col>

                                    <Col md={12}>
                                        <h5 className="pdfsub_heading">Family Details</h5>

                                        <Form.Group as={Row} className="mb-1 text-start" controlId="formInformation">
                                            <Form.Label column sm="6">
                                                Relationship : <span style={{ color: 'red' }}>*</span>
                                            </Form.Label>
                                            <Col sm="6">
                                                <Form.Control
                                                    name="family_relationship"
                                                    type='text'
                                                    value={formData.family_relationship}
                                                    onChange={handleInputChange}
                                                    required />
                                            </Col>
                                        </Form.Group>

                                        <Form.Group as={Row} className="mb-1 text-start" controlId="formEmailID">
                                            <Form.Label column sm="6">
                                                Name : <span style={{ color: 'red' }}>*</span>
                                            </Form.Label>
                                            <Col sm="6">
                                                <Form.Control
                                                    name="f_member_name"
                                                    type="text"
                                                    value={formData.f_member_name}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </Col>
                                        </Form.Group>
                                        <Form.Group as={Row} className="mb-1 text-start" controlId="formTakenFrom">
                                            <Form.Label column sm="6">
                                                Age : <span style={{ color: 'red' }}>*</span>
                                            </Form.Label>
                                            <Col sm="6">
                                                <Form.Control
                                                    name="f_member_age"
                                                    type='text'
                                                    value={formData.f_member_age}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </Col>
                                        </Form.Group>

                                        <Form.Group as={Row} className="mb-1 text-start" controlId="formDateTime">
                                            <Form.Label column sm="6">
                                                Phone No : <span style={{ color: 'red' }}>*</span>
                                            </Form.Label>
                                            <Col sm="6">
                                                <Form.Control
                                                    name="f_member_phone"
                                                    type='text'
                                                    value={formData.f_member_phone}
                                                    isInvalid={!!formErrors.f_member_phone}
                                                    onChange={handleInputChange}
                                                    required />
                                            </Col>
                                            {formErrors.f_member_phone && (
                                                <div className="text-danger small mt-1">
                                                    {formErrors.f_member_phone}
                                                </div>
                                            )}
                                        </Form.Group>

                                        <Form.Group as={Row} className="mb-1 text-start" controlId="formPoliceMemo">
                                            <Form.Label column sm="6">
                                                Address : <span style={{ color: 'red' }}>*</span>
                                            </Form.Label>
                                            <Col sm="6">
                                                <Form.Control
                                                    name="f_member_address"
                                                    type='text'
                                                    value={formData.f_member_address}
                                                    onChange={handleInputChange}
                                                    required />
                                            </Col>
                                        </Form.Group>
                                        <Form.Group as={Row} className="mb-1 text-start" controlId="formPoliceMemo">
                                            <Form.Label column sm="6">
                                                Aadhar Card Number (Relation): <span style={{ color: 'red' }}>*</span>
                                            </Form.Label>
                                            <Col sm="6">
                                                <Form.Control
                                                    type="text"
                                                    name='f_aadhar_card_no'
                                                    value={formData.f_aadhar_card_no || "Null"}
                                                    onChange={handleInputChange}
                                                    required />
                                            </Col>
                                            {formErrors.f_aadhar_card_no && (
                                                <div className="text-danger small mt-1">
                                                    {formErrors.f_aadhar_card_no}
                                                </div>
                                            )}
                                        </Form.Group>
                                        {Array.isArray(files.f_aadhar_card) &&
                                            files.f_aadhar_card.map((imgUrl, index) => {
                                                const filename = `f_aadhar_card_${index}.jpg`;

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
                                                            alt={`f_aadhar_card - ${index}`}
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
                                        <Form.Group as={Row} className="mb-1 text-start" controlId="formPoliceMemo">
                                            <Form.Label column sm="6">
                                                Aadhar Card (Relation):
                                            </Form.Label>
                                            <Col sm="6" className='d-flex align-items-center justify-content-center'>

                                                <Form.Control
                                                    type="file"
                                                    accept=".jpg,.jpeg,.png"
                                                    onChange={handleFileChange}
                                                    name="f_aadhar_card"
                                                    multiple
                                                />
                                            </Col>
                                        </Form.Group>
                                        <Form.Group as={Row} className="mb-1 text-start" controlId="formPoliceMemo">
                                            <Form.Label column sm="6">
                                                Ration Card Number (Relation): <span style={{ color: 'red' }}>*</span>
                                            </Form.Label>
                                            <Col sm="6">
                                                <Form.Control
                                                    type="text"
                                                    name="f_ration_card_no"
                                                    value={formData.f_ration_card_no}
                                                    onChange={handleInputChange}
                                                    required />
                                            </Col>
                                        </Form.Group>
                                        {Array.isArray(files.f_ration_card) &&
                                            files.f_ration_card.map((imgUrl, index) => {
                                                const filename = `f_ration_card_${index}.jpg`;

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
                                                            alt={`f_ration_card - ${index}`}
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
                                        <Form.Group as={Row} className="mb-1 text-start" controlId="formPoliceMemo">
                                            <Form.Label column sm="6">
                                                Ration Card (Relation):
                                            </Form.Label>
                                            <Col sm="6" className='d-flex align-items-center justify-content-center'>
                                                <Form.Control
                                                    type="file"
                                                    accept=".jpg,.jpeg,.png"
                                                    onChange={handleFileChange}
                                                    name="f_ration_card"
                                                    multiple
                                                />
                                            </Col>
                                        </Form.Group>
                                        <Form.Group as={Row} className="mb-1 text-start" controlId="formPoliceMemo">
                                            <Form.Label column sm="6">
                                                Aadhar Card No. (Resident): <span style={{ color: 'red' }}>*</span>
                                            </Form.Label>
                                            <Col sm="6">
                                                <Form.Control
                                                    type="text"
                                                    name='r_aadhar_card_no'
                                                    value={formData.r_aadhar_card_no}
                                                    onChange={handleInputChange}
                                                    required />
                                            </Col>
                                            {formErrors.r_aadhar_card_no && (
                                                <div className="text-danger small mt-1">
                                                    {formErrors.r_aadhar_card_no}
                                                </div>
                                            )}
                                        </Form.Group>
                                        {Array.isArray(files.r_aadhar_card) &&
                                            files.r_aadhar_card.map((imgUrl, index) => {
                                                const filename = `r_aadhar_card_${index}.jpg`;

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
                                                            alt={`r_aadhar_card - ${index}`}
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
                                        <Form.Group as={Row} className="mb-1 text-start" controlId="formPoliceMemo">
                                            <Form.Label column sm="6">
                                                Aadhar Card No (Resident):
                                            </Form.Label>
                                            <Col sm="6" className='d-flex align-items-center justify-content-center'>
                                                <Form.Control
                                                    type="file"
                                                    accept=".jpg,.jpeg,.png"
                                                    onChange={handleFileChange}
                                                    name="r_aadhar_card"
                                                    multiple
                                                />
                                            </Col>
                                        </Form.Group>

                                        <Form.Group as={Row} className="mb-1 text-start" controlId="formPoliceMemo">
                                            <Form.Label column sm="6">
                                                Ration Card Number (Resident):
                                            </Form.Label>
                                            <Col sm="6">
                                                <Form.Control
                                                    type="text"
                                                    name="r_ration_card_no"
                                                    value={formData.r_ration_card_no}
                                                    onChange={handleInputChange} required />
                                            </Col>
                                        </Form.Group>

                                        {Array.isArray(files.r_ration_card) &&
                                            files.r_ration_card.map((imgUrl, index) => {
                                                const filename = `r_ration_card_${index}.jpg`;

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
                                                            alt={`r_ration_card - ${index}`}
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
                                        <Form.Group as={Row} className="mb-1 text-start" controlId="formPoliceMemo">
                                            <Form.Label column sm="6">
                                                Ration Card (Resident):
                                            </Form.Label>
                                            <Col sm="6" className='d-flex align-items-center justify-content-center'>
                                                <Form.Control
                                                    type="file"
                                                    accept=".jpg,.jpeg,.png"
                                                    onChange={handleFileChange}
                                                    name="r_ration_card"
                                                    multiple
                                                />
                                            </Col>
                                        </Form.Group>
                                        <Form.Group as={Row} className="mb-1 text-start" controlId="formPoliceMemo">
                                            <Form.Label column sm="6">
                                                Any other :
                                            </Form.Label>
                                            <Col sm="6">
                                                <Form.Control
                                                    type="text"
                                                    name="any_other"
                                                    value={formData.any_other}
                                                    onChange={handleInputChange} />
                                            </Col>
                                        </Form.Group>
                                        {Array.isArray(files.govt_id) &&
                                            files.govt_id.map((imgUrl, index) => {
                                                const filename = `govt_id_${index}.jpg`;

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
                                                            alt={`govt_id - ${index}`}
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


                                        <Form.Group as={Row} className="mb-1 text-start" controlId="formPoliceMemo">
                                            <Form.Label column sm="6">
                                                Any other Government ID :
                                            </Form.Label>
                                            <Col sm="6" className='d-flex flex-row align-items-start'>
                                                <Form.Control
                                                    type="file"
                                                    name="govt_id"
                                                    accept=".jpg,.jpeg,.png"
                                                    onChange={handleFileChange}
                                                    multiple
                                                />
                                            </Col>
                                        </Form.Group>

                                        <Form.Group as={Row} className="mb-1 text-start" controlId="formPoliceMemo">
                                            <Form.Label column sm="6">
                                                Description : <span style={{ color: 'red' }}>*</span>
                                            </Form.Label>
                                            <Col sm="6">
                                                <Form.Control
                                                    as="textarea"
                                                    rows={2}
                                                    name="description"
                                                    value={formData.description}
                                                    onChange={handleInputChange}
                                                    required />
                                            </Col>
                                        </Form.Group>

                                    </Col>
                                    <div className="mt-3 d-flex align-tems-cente justify-content-between">
                                        <Button
                                            variant="success"
                                            className="m-1"
                                            type="submit"
                                            onClick={(e) => handleUpdate(e, admissionNumber)}
                                        >Update</Button>
                                        <Button variant="secondary" className="m-1" onClick={handleClose}>Close</Button>
                                    </div>

                                </Form>
                            </Col>
                        </Modal.Body>
                    </Modal>

                </Row>
            </Container>
        </div>
    )
}

export default Family_Request_form
