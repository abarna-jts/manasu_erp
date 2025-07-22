import React from 'react';
import { Container, Row, Col, Breadcrumb, InputGroup, Button, Form, FormLabel } from "react-bootstrap";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from 'react';
import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import Cookies from 'js-cookie';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import manasu_logo from '../Admission/Manasu-Logo.png';

function Psychiatrics_form() {
    const [admission_no, setAdmissionNumber] = useState('');
    const [date, setDate] = useState('');
    const [rescueImage, setRescueImage] = useState(null);
    const [rescueName, setRescueName] = useState("");
    const [error, setError] = useState("");
    const [shouldGeneratePDF, setShouldGeneratePDF] = useState(false);
    const [allFormEntries, setAllFormEntries] = useState([]);

    const [formData, setFormData] = useState({
        admission_no: '',
        date: '',
        patient_name: '',
        patient_age: '',
        patient_gender: 'Male',
        sexual_orientation: '',
        education_bg: '',
        occupation: '',
        marital_status: '',
        economic_status: '',
        religion: '',
        informant: '',
        residential_address: '',
        living_arrangements: '',
        family_structure: '',
        cultural_identity: '',
        language1: '',
        language2: '',

    });

    const [chiefData, setChiefData] = useState({
        chief_complaint: '',
        onset_duration: '',
        nature_symptoms: '',
        severity: '',
        course_type: '',
        nature_illness: '',
        identify_trigger: '',
        life_changes: '',
        biological: '',
        psychological: '',
        social_environment: '',
        date: '',
        admission_no: '',
    });

    const [presentingData, setPresentingData] = useState({
        admission_no: '',
        date: '',
        history_presenting: '',
        mood_affect: [],
        though_content: [],
        though_process: [],
        perception: [],
        behavioural_changes: [],
        sleep_patterns: [],
        energy_level: '',
        appetite_weight: '',
        occupation_academic: '',
        interpersonal_relationship: '',
        selfCare_activity: '',
        recreation_activity: '',
    });

    const [psyHistoryData, setPsyHistoryData] = useState({
        admission_no: '',
        date: '',
        psychiatric_diagnoses: '',
        treatment_history: '',
        medications: '',
        dosage: '',
        adherence: '',
        sideEffect: '',
        experience_reaction: '',
        hospitalisation_reason: '',
        duration: '',
        crisis_episodes: '',
        fm_mentalHealth: '',
        significant_life: '',
        chronic_stressors: '',
        trauma_exploration: [],
        legal_environment: []
    });

    const [medicalData, setMedicalData] = useState({
        admission_no: '',
        date: '',
        disability_status: '',
        chronic_medical: '',
        acute_health: '',
        medication: '',
        medication_allergies: '',
        other_allergy: [],
        significant_medical: [],
        traumatic_injuries: '',
        sexual_health: []
    })

    const [familyData, setFamilyData] = useState({
        admission_no: '',
        date: '',
        family_composition: [],
        family_dynamics: [],
        marriage_type: '',
        family_history: '',
        genetic_predisposition: '',
        family_changes: [],
        family_substance: ''
    })

    const [socialData, setSocialData] = useState({
        family_relationship: '',
        admission_no: '',
        date: '',
        socialCircle_relationship: '',
        relationship_significant: '',
        living_arrangements: '',
        education_bg: '',
        currentEmp_status: '',
        socialRecreation_activity: '',
        social_outlets: '',
        socialMed_engagement: '',
        technology_related: '',
    })

    const [developmentalData, setDeveleopmentData] = useState({
        admission_no: '',
        date: '',
        prenatal_factors: '',
        birth_details: '',
        birth_order: '',
        siblings_number: '',
        bonding_attachment: '',
        milestones_development: '',
        childhood_illness: '',
        siblings_relationship: '',
        parenting_style: '',
        learning_challenge: '',
        pubertal_development: '',
    })

    const [substanceData, setSubstanceData] = useState({
        admission_no: '',
        date: '',
        substance_use: '',
        age_onset: '',
        frequency: '',
        quantity: '',
        motivation_use: '',
        environmental_trigger: '',
        impact_occupation: '',
        impact_interpersonal: '',
        financial_consequences: '',
        craving_intensity: '',
        previous_treatment: '',
        relapse_history: '',
    })

    const [suicidalData, setSuicidalData] = useState({
        admission_no: '',
        date: '',
        suicide_history: '',
        triggers_stressors: '',
        homicidal_ideation: '',
        target_method: '',
        immediate_threat: '',
        emergency_response: '',
        hospital_required: '',
    })

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleInputChange1 = (e) => {
        const { name, value } = e.target;
        setChiefData((prev) => ({ ...prev, [name]: value }));
    };

    const handleInputChange2 = (e) => {
        const { name, value } = e.target;
        setPresentingData(prev => ({
            ...prev,
            [name]: value,
        }));
    };
    const handleInputChange3 = (e) => {
        const { name, value } = e.target;
        setPsyHistoryData((prev) => ({ ...prev, [name]: value }));
    };

    const handleInputChange4 = (e) => {
        const { name, value } = e.target;
        setMedicalData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleInputChange5 = (e) => {
        const { name, value } = e.target;
        setFamilyData((prev) => ({ ...prev, [name]: value }));
    };

    const handleInputChange6 = (e) => {
        const { name, value } = e.target;
        setSocialData((prev) => ({ ...prev, [name]: value }));
    };

    const handleInputChange7 = (e) => {
        const { name, value } = e.target;
        setDeveleopmentData((prev) => ({ ...prev, [name]: value }));
    };

    const handleInputChange8 = (e) => {
        const { name, value } = e.target;
        setSubstanceData((prev) => ({ ...prev, [name]: value }));
    };

    const handleInputChange9 = (e) => {
        const { name, value } = e.target;
        setSuicidalData((prev) => ({ ...prev, [name]: value }));
    };

    const apiRoute = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
    });

    const handleAdmissionChange = (e) => {
        setAdmissionNumber(e.target.value);
    };

    const handleDateChange = (e) => {
        setDate(e.target.value);
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

    const [submissionMessage, setSubmissionMessage] = useState("");
    const [messageType, setMessageType] = useState(""); // 'success' or 'danger'


    const userType = Cookies.get('usertype');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!admission_no || admission_no.trim() === '') {
            alert("Admission Number is required.");
            return;
        }

        const trimmedAdNo = admission_no.trim();

        if (!/^\d{8}$/.test(trimmedAdNo) && !/^\d{10}$/.test(trimmedAdNo)) {
            alert("Admission Number must be exactly 8 or 10 digits (numbers only).");
            return;
        }

        if (!date || date.trim() === '') {
            alert("Date is required.");
            return;
        }

        const completeFormData = {
            ...formData,
            date: date,
            admission_no: admission_no.trim()
        };

        try {
            const response = await apiRoute.post('/recovery/create_information', completeFormData);
            console.log("Form submitted successfully:", response.data);
            alert("Demographic Information submitted successfully!");
            // window.location.reload();
            setFormData({
                patient_name: '',
                patient_age: '',
                patient_gender: 'Male',
                sexual_orientation: '',
                education_bg: '',
                occupation: '',
                marital_status: '',
                economic_status: '',
                religion: '',
                informant: '',
                residential_address: '',
                living_arrangements: '',
                family_structure: '',
                cultural_identity: '',
                language1: '',
                language2: '',
            })
        } catch (error) {
            console.error(error);
            alert("Error submitting form.");
        }
    };

    const handleChiefSubmit = async (e) => {
        e.preventDefault();

        if (!admission_no || admission_no.trim() === '') {
            alert("Admission Number is required.");
            return;
        }
        const trimmedAdNo = admission_no.trim();

        if (!/^\d{8}$/.test(trimmedAdNo) && !/^\d{10}$/.test(trimmedAdNo)) {
            alert("Admission Number must be exactly 8 or 10 digits (numbers only).");
            return;
        }
        if (!date || date.trim() === '') {
            alert("Date is required.");
            return;
        }

        const completeChiefData = {
            ...chiefData,
            date: date,
            admission_no: admission_no.trim()
        };

        try {
            const response = await apiRoute.post('/recovery/create_chiefComplaint', completeChiefData);
            console.log("Chief Complaint submitted successfully:", response.data);
            alert("Chief Complaint submitted successfully!");
            setChiefData({
                chief_complaint: '',
                onset_duration: '',
                nature_symptoms: '',
                severity: '',
                course_type: '',
                nature_illness: '',
                identify_trigger: '',
                life_changes: '',
                biological: '',
                psychological: '',
                social_environment: '',
            })
            // window.location.reload();
        } catch (error) {
            console.error(error);
            alert("Error submitting form.");
        }

    }

    const handlePresentingSubmit = async (e) => {
        e.preventDefault();

        if (!admission_no || admission_no.trim() === '') {
            alert("Admission Number is required.");
            return;
        }
        const trimmedAdNo = admission_no.trim();

        if (!/^\d{8}$/.test(trimmedAdNo) && !/^\d{10}$/.test(trimmedAdNo)) {
            alert("Admission Number must be exactly 8 or 10 digits (numbers only).");
            return;
        }
        if (!date || date.trim() === '') {
            alert("Date is required.");
            return;
        }

        if (!presentingData.mood_affect || presentingData.mood_affect.length === 0) {
            alert("Mood and affect is required.");
            return;
        }

        if (!presentingData.though_content || presentingData.though_content.length === 0) {
            alert("Thought Content is required.");
            return;
        }

        if (!presentingData.though_process || presentingData.though_process.length === 0) {
            alert("Thought Process is required.");
            return;
        }

        if (!presentingData.perception || presentingData.perception.length === 0) {
            alert("Perception is required.");
            return;
        }
        if (!presentingData.behavioural_changes || presentingData.behavioural_changes.length === 0) {
            alert("Behavioral Changes is required.");
            return;
        }
        if (!presentingData.sleep_patterns || presentingData.sleep_patterns.length === 0) {
            alert("Sleep patterns is required.");
            return;
        }

        const completedPresentingData = {
            ...presentingData,
            date: date,
            admission_no: admission_no.trim()
        }

        try {
            const response = await apiRoute.post('/recovery/create_presenting', completedPresentingData);
            console.log("Presenting Problems submitted successfully:", response.data);
            alert("Presenting Problems submitted successfully!");
            setPresentingData({
                history_presenting: '',
                mood_affect: [],
                though_content: [],
                though_process: [],
                perception: [],
                behavioural_changes: [],
                sleep_patterns: [],
                energy_level: '',
                appetite_weight: '',
                occupation_academic: '',
                interpersonal_relationship: '',
                selfCare_activity: '',
                recreation_activity: '',
            })
            // window.location.reload();
        } catch (error) {
            console.error(error);
            alert("Error submitting form.");
        }
    }

    const handlePsyHistorySubmit = async (e) => {
        e.preventDefault();

        if (!admission_no || admission_no.trim() === '') {
            alert("Admission Number is required.");
            return;
        }
        const trimmedAdNo = admission_no.trim();

        if (!/^\d{8}$/.test(trimmedAdNo) && !/^\d{10}$/.test(trimmedAdNo)) {
            alert("Admission Number must be exactly 8 or 10 digits (numbers only).");
            return;
        }
        if (!date || date.trim() === '') {
            alert("Date is required.");
            return;
        }
        if (!psyHistoryData.trauma_exploration || psyHistoryData.trauma_exploration.length === 0) {
            alert("Exploration of Trauma is required.");
            return;
        }
        if (!psyHistoryData.legal_environment || psyHistoryData.legal_environment.length === 0) {
            alert("Legal Involvement is required.");
            return;
        }

        const completePsyHistoryData = {
            ...psyHistoryData,
            date: date,
            admission_no: admission_no.trim()
        }
        try {
            const response = await apiRoute.post('/recovery/create_psyhistory', completePsyHistoryData);
            console.log("Psychiatric History submitted successfully:", response.data);
            alert("Psychiatric History submitted successfully!");
            setPsyHistoryData({
                psychiatric_diagnoses: '',
                treatment_history: '',
                medications: '',
                dosage: '',
                adherence: '',
                sideEffect: '',
                experience_reaction: '',
                hospitalisation_reason: '',
                duration: '',
                crisis_episodes: '',
                fm_mentalHealth: '',
                significant_life: '',
                chronic_stressors: '',
                trauma_exploration: [],
                legal_environment: []
            })
            // window.location.reload();
        } catch (error) {
            console.error(error);
            alert("Error submitting form.");
        }
    }

    const handleMedicalSubmit = async (e) => {
        e.preventDefault();

        if (!admission_no || admission_no.trim() === '') {
            alert("Admission Number is required.");
            return;
        }
        const trimmedAdNo = admission_no.trim();

        if (!/^\d{8}$/.test(trimmedAdNo) && !/^\d{10}$/.test(trimmedAdNo)) {
            alert("Admission Number must be exactly 8 or 10 digits (numbers only).");
            return;
        }
        if (!date || date.trim() === '') {
            alert("Date is required.");
            return;
        }
        if (!medicalData.significant_medical || medicalData.significant_medical.length === 0) {
            alert("Significant Medical Events is required.");
            return;
        }
        if (!medicalData.sexual_health || medicalData.sexual_health.length === 0) {
            alert("Sexual Health is required.");
            return;
        }
        if (!medicalData.other_allergy || medicalData.other_allergy.length === 0) {
            alert("Other Allergies or Sensitivities is required.");
            return;
        }

        const completeMedicalData = {
            ...medicalData,
            date: date,
            admission_no: admission_no.trim()
        }
        try {
            const response = await apiRoute.post('/recovery/create_medicalData', completeMedicalData);
            console.log("Medical History submitted successfully:", response.data);
            alert("Medical History submitted successfully!");
            setMedicalData({
                disability_status: '',
                chronic_medical: '',
                acute_health: '',
                medication: '',
                medication_allergies: '',
                other_allergy: [],
                significant_medical: [],
                traumatic_injuries: '',
                sexual_health: []
            })
            // window.location.reload();
        } catch (error) {
            console.error(error);
            alert("Error submitting form.");
        }
    }

    const handleFamilySubmit = async (e) => {
        e.preventDefault();
        if (!admission_no || admission_no.trim() === '') {
            alert("Admission Number is required.");
            return;
        }
        const trimmedAdNo = admission_no.trim();

        if (!/^\d{8}$/.test(trimmedAdNo) && !/^\d{10}$/.test(trimmedAdNo)) {
            alert("Admission Number must be exactly 8 or 10 digits (numbers only).");
            return;
        }
        if (!date || date.trim() === '') {
            alert("Date is required.");
            return;
        }
        if (!familyData.family_composition || familyData.family_composition.length === 0) {
            alert("Family Composition is required.");
            return;
        }
        if (!familyData.family_dynamics || familyData.family_dynamics.length === 0) {
            alert("Family Dynamics is required.");
            return;
        }
        if (!familyData.family_changes || familyData.family_changes.length === 0) {
            alert("Family Changes or Transitions is required.");
            return;
        }

        const completeFamilyData = {
            ...familyData,
            date: date,
            admission_no: admission_no.trim()
        }
        try {
            const response = await apiRoute.post('/recovery/create_familyData', completeFamilyData);
            console.log("Family History submitted successfully:", response.data);
            alert("Family History submitted successfully!");
            setFamilyData({
                family_composition: [],
                family_dynamics: [],
                marriage_type: '',
                family_history: '',
                genetic_predisposition: '',
                family_changes: [],
                family_substance: ''
            })
            // window.location.reload();
        } catch (error) {
            console.error(error);
            alert("Error submitting form.");
        }
    }

    const handleSocialSubmit = async (e) => {
        e.preventDefault();
        if (!admission_no || admission_no.trim() === '') {
            alert("Admission Number is required.");
            return;
        }
        const trimmedAdNo = admission_no.trim();

        if (!/^\d{8}$/.test(trimmedAdNo) && !/^\d{10}$/.test(trimmedAdNo)) {
            alert("Admission Number must be exactly 8 or 10 digits (numbers only).");
            return;
        }
        if (!date || date.trim() === '') {
            alert("Date is required.");
            return;
        }
        const completeSocialData = {
            ...socialData,
            date: date,
            admission_no: admission_no.trim()
        }
        try {
            const response = await apiRoute.post('/recovery/create_socialData', completeSocialData);
            console.log("Social History submitted successfully:", response.data);
            alert("Social History submitted successfully!");
            setSocialData({
                family_relationship: '',
                socialCircle_relationship: '',
                relationship_significant: '',
                living_arrangements: '',
                education_bg: '',
                currentEmp_status: '',
                socialRecreation_activity: '',
                social_outlets: '',
                socialMed_engagement: '',
                technology_related: ''
            })
            // window.location.reload();
        } catch (error) {
            console.error(error);
            alert("Error submitting form.");
        }
    }

    const handleDevelopmentHistory = async (e) => {
        e.preventDefault();
        if (!admission_no || admission_no.trim() === '') {
            alert("Admission Number is required.");
            return;
        }
        const trimmedAdNo = admission_no.trim();

        if (!/^\d{8}$/.test(trimmedAdNo) && !/^\d{10}$/.test(trimmedAdNo)) {
            alert("Admission Number must be exactly 8 or 10 digits (numbers only).");
            return;
        }
        if (!date || date.trim() === '') {
            alert("Date is required.");
            return;
        }
        const completeDevelopmentalData = {
            ...developmentalData,
            date: date,
            admission_no: admission_no.trim()
        }
        try {
            const response = await apiRoute.post('/recovery/create_developmentalData', completeDevelopmentalData);
            console.log("Developmental History submitted successfully:", response.data);
            alert("Developmental History submitted successfully!");
            setDeveleopmentData({
                prenatal_factors: '',
                birth_details: '',
                birth_order: '',
                siblings_number: '',
                bonding_attachment: '',
                milestones_development: '',
                childhood_illness: '',
                siblings_relationship: '',
                parenting_style: '',
                learning_challenge: '',
                pubertal_development: '',
            })
            // window.location.reload();
        } catch (error) {
            console.error(error);
            alert("Error submitting form.");
        }
    }

    const handleSubstanceSubmit = async (e) => {
        e.preventDefault();
        if (!admission_no || admission_no.trim() === '') {
            alert("Admission Number is required.");
            return;
        }
        const trimmedAdNo = admission_no.trim();

        if (!/^\d{8}$/.test(trimmedAdNo) && !/^\d{10}$/.test(trimmedAdNo)) {
            alert("Admission Number must be exactly 8 or 10 digits (numbers only).");
            return;
        }
        if (!date || date.trim() === '') {
            alert("Date is required.");
            return;
        }
        const completeSubstanceData = {
            ...substanceData,
            date: date,
            admission_no: admission_no.trim()
        }
        try {
            const response = await apiRoute.post('/recovery/create_substanceData', completeSubstanceData);
            console.log("Substance Use History submitted successfully:", response.data);
            alert("Substance Use History submitted successfully!");
            setSubstanceData({
                substance_use: '',
                age_onset: '',
                frequency: '',
                quantity: '',
                motivation_use: '',
                environmental_trigger: '',
                impact_occupation: '',
                impact_interpersonal: '',
                financial_consequences: '',
                craving_intensity: '',
                previous_treatment: '',
                relapse_history: '',
            })
        } catch (error) {
            console.error(error);
            alert("Error submitting form.");
        }

    }

    const handleSuicidalSubmit = async (e) => {
        e.preventDefault();
        if (!admission_no || admission_no.trim() === '') {
            alert("Admission Number is required.");
            return;
        }
        const trimmedAdNo = admission_no.trim();

        if (!/^\d{8}$/.test(trimmedAdNo) && !/^\d{10}$/.test(trimmedAdNo)) {
            alert("Admission Number must be exactly 8 or 10 digits (numbers only).");
            return;
        }
        if (!date || date.trim() === '') {
            alert("Date is required.");
            return;
        }
        const completeSuicidalData = {
            ...suicidalData,
            date: date,
            admission_no: admission_no.trim()
        }
        try {
            const response = await apiRoute.post('/recovery/create_suicidalData', completeSuicidalData);
            console.log("Suicidal and Homicidal Ideation submitted successfully:", response.data);
            alert("Suicidal and Homicidal Ideation submitted successfully!");
            setSuicidalData({
                suicide_history: '',
                triggers_stressors: '',
                homicidal_ideation: '',
                target_method: '',
                immediate_threat: '',
                emergency_response: '',
                hospital_required: ''
            })
        } catch (error) {
            console.error(error);
            alert("Error submitting form.");
        }
    }

    const handleCheckChange = (e) => {
        const { name, value } = e.target;
        setPsychiatricData((prev) => ({ ...prev, [name]: value }));
    };

    const navigate = useNavigate();

    const handleNavigateMSE = () => {
        navigate("/mseform");
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setRescueImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const renderCheckbox = (field, id, label) => (
        <Form.Check
            type="checkbox"
            id={id}
            label={label}
            checked={presentingData[field]?.includes(label)}
            onChange={(e) => {
                const updated = e.target.checked
                    ? [...presentingData[field], label]
                    : presentingData[field].filter(item => item !== label);

                setPresentingData(prev => ({
                    ...prev,
                    [field]: updated
                }));
            }}
        />
    );

    const renderpsyCheckbox = (field, id, label) => (
        <Form.Check
            type="checkbox"
            id={id}
            label={label}
            checked={psyHistoryData[field]?.includes(label)}
            onChange={(e) => {
                const updated = e.target.checked
                    ? [...psyHistoryData[field], label]
                    : psyHistoryData[field].filter(item => item !== label);

                setPsyHistoryData(prev => ({
                    ...prev,
                    [field]: updated
                }));
            }}
        />
    );
    const renderMedCheckbox = (field, id, label) => (
        <Form.Check
            type="checkbox"
            id={id}
            label={label}
            checked={medicalData[field]?.includes(label)}
            onChange={(e) => {
                const updated = e.target.checked
                    ? [...medicalData[field], label]
                    : medicalData[field].filter(item => item !== label);

                setMedicalData(prev => ({
                    ...prev,
                    [field]: updated
                }));
            }}
        />
    );
    const renderFamCheckbox = (field, id, label) => (
        <Form.Check
            type="checkbox"
            id={id}
            label={label}
            checked={familyData[field]?.includes(label)}
            onChange={(e) => {
                const updated = e.target.checked
                    ? [...familyData[field], label]
                    : familyData[field].filter(item => item !== label);

                setFamilyData(prev => ({
                    ...prev,
                    [field]: updated
                }));
            }}
        />
    );


    const ViewFormData = async () => {
        if (!admission_no.trim()) {
            alert("Please enter admission number.");
            return;
        }

        const formatDate = (dateString) => {
            if (!dateString) return '';
            const dateObj = new Date(dateString);
            if (isNaN(dateObj)) return dateString;
            const day = String(dateObj.getDate()).padStart(2, '0');
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const year = dateObj.getFullYear();
            return `${day}-${month}-${year}`;
        };

        try {
            const response = await apiRoute.get(`/recovery/getallPsychiatric/${admission_no}`);
            const fetchedData = response.data;

            if (!Array.isArray(fetchedData) || fetchedData.length === 0) {
                alert("No data found for this admission number.");
                return;
            }

            // Map and format all entries
            const formattedEntries = fetchedData.map(entry => ({
                basic_detail: {
                    ...entry.basic_detail,
                    date: formatDate(entry.basic_detail?.date || '')
                },
                cheif_complaint: {
                    ...entry.cheif_complaint,
                    date: formatDate(entry.cheif_complaint?.date || '')
                },
                // Add all other sections like presenting_problems, etc.
                presenting_problems: {
                    ...entry.presenting_problems,
                    date: formatDate(entry.presenting_problems?.date || ''),
                    mood_affect: entry.presenting_problems?.mood_affect?.split(',') || ["NULL"],
                    though_content: entry.presenting_problems?.though_content?.split(',') || ["NULL"],
                    though_process: entry.presenting_problems?.though_process?.split(',') || ["NULL"],
                    perception: entry.presenting_problems?.perception?.split(',') || ["NULL"],
                    behavioural_changes: entry.presenting_problems?.behavioural_changes?.split(',') || ["NULL"],
                    sleep_patterns: entry.presenting_problems?.sleep_patterns?.split(',') || ["NULL"],
                    sexual_health: entry.medical_history?.sexual_health?.split(',') || ["NULL"],
                    // ... more arrays you need to split
                },
                psy_history: {
                    ...entry.psy_history,
                    date: formatDate(entry.psy_history?.date || ''),
                    trauma_exploration: entry.psy_history?.trauma_exploration?.split(',') || ["NULL"],
                    legal_environment: entry.psy_history?.legal_environment?.split(',') || ["NULL"]
                },
                medical_history: {
                    ...entry.medical_history,
                    date: formatDate(entry.medical_history?.date || ''),
                    other_allergy: entry.medical_history?.other_allergy?.split(',') || ["NULL"],
                    significant_medical: entry.medical_history?.significant_medical?.split(',') || ["NULL"]
                },
                familyhis_data: {
                    ...entry.familyhis_data,
                    date: formatDate(entry.familyhis_data?.date || ''),
                    family_composition: entry.familyhis_data?.family_composition?.split(',') || ["NULL"],
                    family_dynamics: entry.familyhis_data?.family_dynamics?.split(',') || ["NULL"],
                    family_changes: entry.familyhis_data?.family_changes?.split(',') || ["NULL"]
                },
                social_history: {
                    ...entry.social_history,
                    date: formatDate(entry.social_history?.date || '')
                },
                development_history: {
                    ...entry.development_history,
                    date: formatDate(entry.development_history?.date || '')
                },
                substance_use: {
                    ...entry.substance_use,
                    date: formatDate(entry.substance_use?.date || '')
                },
                suicidal_data: {
                    ...entry.suicidal_data,
                    date: formatDate(entry.suicidal_data?.date || '')
                }
            }));

            setAllFormEntries(formattedEntries);
            setShouldGeneratePDF(true);
        } catch (error) {
            console.error("Error fetching data:", error);
            alert("This form does not have a valid admission number");
        }
    };




    useEffect(() => {
        if (shouldGeneratePDF) {
            generatePDF();
            setShouldGeneratePDF(false); // Reset the flag
        }
    }, [shouldGeneratePDF]);

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

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const imgProps = pdf.getImageProperties(imgData);
        const imgWidth = pdfWidth;
        const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

        let heightLeft = imgHeight;
        let position = 0;

        // First page
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;

        // Add more pages if content overflows
        while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pdfHeight;
        }

        const pdfBlob = pdf.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl, '_blank');
    };

    const handleBasicNavigate = () =>{
        navigate("/basic_detail");
    }

    const handleCheifNavigate = () =>{
        navigate("/cheif_complaint");
    }

    const handlePresentingNavigate = () =>{
        navigate("/presenting_problem");
    }

    const handlepsyHistoryNavigate = () =>{
        navigate("/psy_history");
    }
    const handleMedicalNavigate = () =>{
        navigate("/medical_history");
    }
    const handleFamHistoryNavigate = () =>{
        navigate("/family_history");
    }
    const handleSocHistoryNavigate = () =>{
        navigate("/social_history");
    }
    const handleDevHistoryNavigate = () =>{
        navigate("/developmental_history");
    }
    const handleSubstanceNavigate = () =>{
        navigate("/substance_history");
    }
    const handleSuicidalNavigate = () =>{
        navigate("/suicidal_data");
    }

    return (
        <>
            <div className="d-xl-flex justify-content-between align-items-center flex-wrap flex-md-nowrap text-start py-2">
                <div className="d-block mb-4 mb-xl-0 px-4 ">
                    <Breadcrumb className="d-none d-md-inline-block mb-0" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
                        <Breadcrumb.Item></Breadcrumb.Item>
                        <Breadcrumb.Item>Home</Breadcrumb.Item>
                        <Breadcrumb.Item active>Recovery</Breadcrumb.Item>
                    </Breadcrumb>
                    <h6 className="breadcrumb_title">Social Worker</h6>

                </div>
                <div className="text-center col-md-7"><h3 className="section_title">Psychiatric Case History</h3></div>

                    <Col md={2} className='d-flex flex-column align-items-center'>
                        {error && <div className="text-danger mt-2">{error}</div>}
                        {/* Rescue Name and Image */}
                        {rescueImage && (
                            <div>
                                <img
                                    alt={rescueName || "Rescue Image"}
                                    style={{ width: "150px", height: "120px" }}
                                    src={rescueImage}
                                />
                                {rescueName && <h6 className="mb-2">{rescueName}</h6>}
                            </div>
                        )}
                    </Col>
            </div>


            <div>
                {/* Show success or error message box */}
                {submissionMessage && (
                    <Alert variant={messageType} className="mt-3">
                        {submissionMessage}
                    </Alert>
                )}
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
                                    name="admission_no"
                                    value={admission_no}
                                    onChange={handleAdmissionChange}
                                    required
                                />
                            </InputGroup>
                        </Col>
                        {/* <button type="button" className="btn btn-secondary mx-1" onClick={() => {
                            if (!admission_no.trim()) {
                                alert("Please enter admission number.");
                            } else {
                                ViewFormData();
                            }
                        }}><FontAwesomeIcon icon={faEye} className="me-0" /></button> */}
                        {userType === "1" && (
                            <button type="button" className="btn btn-success mx-1" onClick={() => {
                                if (!admission_no.trim()) {
                                    alert("Please enter admission number.");
                                } else {
                                    createFormData();
                                }
                            }}><FontAwesomeIcon icon={faPlus} className="me-0" /></button>
                        )}

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
                    <Form.Group className="mt-3 d-flex align-items-center justify-content-center">
                        <Form.Label className='mx-3'>Date:</Form.Label>
                        <Form.Control name='date'
                            type='date'
                            value={date}
                            max="9999-12-31"
                            onChange={handleDateChange} />
                    </Form.Group>
                </Form>
            </Container>

            <Container className='psychiatric_container'>
                <Row>
                    <Col>
                        <div className="page">
                            {/* tabs */}
                            <div className="pcss3t pcss3t-effect-scale pcss3t-theme-1 psychiatrics_tab">
                                <input type="radio" name="pcss3t" defaultChecked id="tab1" className="tab-content-first" />
                                <label htmlFor="tab1">Demographic Information</label>

                                <input type="radio" name="pcss3t" id="tab2" className="tab-content-2" />
                                <label htmlFor="tab2">Chief Complaint</label>

                                <input type="radio" name="pcss3t" id="tab3" className="tab-content-3" />
                                <label htmlFor="tab3">Presenting Problems</label>

                                <input type="radio" name="pcss3t" id="tab4" className="tab-content-4" />
                                <label htmlFor="tab4">Psychiatric History</label>

                                <input type="radio" name="pcss3t" id="tab5" className="tab-content-5" />
                                <label htmlFor="tab5">Medical History</label>

                                <input type="radio" name="pcss3t" id="tab6" className="tab-content-6" />
                                <label htmlFor="tab6">Family History</label>

                                <input type="radio" name="pcss3t" id="tab7" className="tab-content-7" />
                                <label htmlFor="tab7">Social History</label>

                                <input type="radio" name="pcss3t" id="tab8" className="tab-content-8" />
                                <label htmlFor="tab8">Developmental History</label>

                                <input type="radio" name="pcss3t" id="tab9" className="tab-content-9" />
                                <label htmlFor="tab9">Substance Use History</label>

                                <input type="radio" name="pcss3t" id="tab10" className="tab-content-10" />
                                <label htmlFor="tab10">Suicidal and Homicidal Ideation</label>

                                {/* <input type="radio" name="pcss3t" id="tab11" className="tab-content-last" onClick={handleNavigateMSE} />
                                <label htmlFor="tab11">MSE</label> */}


                                <ul>
                                    {/* Basic details START*/}
                                    <li className="tab-content tab-content-first typography">
                                        <div className="update_class d-flex align-items-center justify-content-center">
                                            <h1>DEMOGRAPHIC INFORMATION</h1>
                                            
                                            <Button className='btn btn-success mx-3' type='button' onClick={handleBasicNavigate}>View All</Button>
                                        </div>
                                        <Row className='d-flex justify-content-around'>
                                            <Col md={9}>
                                                <Form className='mt-4' onSubmit={handleSubmit}>
                                                    <Form.Group as={Row} className="mb-2 text-start" >
                                                        <Form.Label column sm="4">Name: <span style={{ color: 'red' }}>*</span></Form.Label>
                                                        <Col sm="8">
                                                            <Form.Control type='text'
                                                                name='patient_name'
                                                                value={formData.patient_name}
                                                                onChange={handleInputChange}
                                                                required
                                                            />
                                                        </Col>
                                                    </Form.Group>

                                                    <Form.Group as={Row} className="mb-2 text-start" >
                                                        <Form.Label column sm="4">Age:  <span style={{ color: 'red' }}>*</span></Form.Label>
                                                        <Col sm="8">
                                                            <Form.Control type='text'
                                                                name='patient_age'
                                                                value={formData.patient_age}
                                                                onChange={handleInputChange}
                                                                required
                                                            />
                                                        </Col>
                                                    </Form.Group>

                                                    <Form.Group as={Row} className="mb-2 text-start" >
                                                        <Form.Label column sm="4">Gender:  <span style={{ color: 'red' }}>*</span></Form.Label>
                                                        <Col sm="8">
                                                            <Form.Control type='text'
                                                                name='patient_gender'
                                                                value={formData.patient_gender}
                                                                onChange={handleInputChange}
                                                                readOnly
                                                                required
                                                            />
                                                        </Col>
                                                    </Form.Group>

                                                    <Form.Group as={Row} className="mb-2 text-start" >
                                                        <Form.Label column sm="4">Sexual Orientation: <span style={{ color: 'red' }}>*</span></Form.Label>
                                                        <Col sm="8">
                                                            <Form.Control type='text'
                                                                name='sexual_orientation'
                                                                value={formData.sexual_orientation}
                                                                onChange={handleInputChange}
                                                                required
                                                            />
                                                        </Col>
                                                    </Form.Group>

                                                    <Form.Group as={Row} className="mb-2 text-start" >
                                                        <Form.Label column sm="4">Educational Background:  <span style={{ color: 'red' }}>*</span></Form.Label>
                                                        <Col sm="8">
                                                            <Form.Control type='text'
                                                                name='education_bg'
                                                                value={formData.education_bg}
                                                                onChange={handleInputChange}
                                                                required
                                                            />
                                                        </Col>
                                                    </Form.Group>

                                                    <Form.Group as={Row} className="mb-2 text-start" >
                                                        <Form.Label column sm="4">Occupation and Employment Status:  <span style={{ color: 'red' }}>*</span></Form.Label>
                                                        <Col sm="8">
                                                            <Form.Control type='text'
                                                                name='occupation'
                                                                value={formData.occupation}
                                                                onChange={handleInputChange}
                                                                required
                                                            />
                                                        </Col>
                                                    </Form.Group>

                                                    <Form.Group as={Row} className="mb-2 text-start" >
                                                        <Form.Label column sm="4">Marital Status:  <span style={{ color: 'red' }}>*</span></Form.Label>
                                                        <Col sm="8">
                                                            <Form.Control type='text'
                                                                name='marital_status'
                                                                value={formData.marital_status}
                                                                onChange={handleInputChange}
                                                                required
                                                            />
                                                        </Col>
                                                    </Form.Group>

                                                    <Form.Group as={Row} className="mb-2 text-start" >
                                                        <Form.Label column sm="4">Socio Economic Status:  <span style={{ color: 'red' }}>*</span></Form.Label>
                                                        <Col sm="8">
                                                            <Form.Control type='text'
                                                                name='economic_status'
                                                                value={formData.economic_status}
                                                                onChange={handleInputChange}
                                                                required
                                                            />
                                                        </Col>
                                                    </Form.Group>

                                                    <Form.Group as={Row} className="mb-2 text-start" >
                                                        <Form.Label column sm="4">Religion:  <span style={{ color: 'red' }}>*</span></Form.Label>
                                                        <Col sm="8">
                                                            <Form.Control type="text"
                                                                name='religion'
                                                                value={formData.religion}
                                                                onChange={handleInputChange}
                                                                required />
                                                        </Col>
                                                    </Form.Group>

                                                    <Form.Group as={Row} className="mb-2 text-start" >
                                                        <Form.Label column sm="4">Informant: <span style={{ color: 'red' }}>*</span></Form.Label>
                                                        <Col sm="8">
                                                            <Form.Control type="text"
                                                                name='informant'
                                                                value={formData.informant}
                                                                onChange={handleInputChange}
                                                                required />
                                                        </Col>
                                                    </Form.Group>

                                                    <Form.Group as={Row} className="mb-2 text-start" >
                                                        <Form.Label column sm="4">Residential Address (current address):  <span style={{ color: 'red' }}>*</span> </Form.Label>
                                                        <Col sm="8">
                                                            <Form.Control type="text"
                                                                name='residential_address'
                                                                value={formData.residential_address}
                                                                onChange={handleInputChange}
                                                                required />
                                                        </Col>
                                                    </Form.Group>

                                                    <Form.Group as={Row} className="mb-2 text-start" >
                                                        <Form.Label column sm="4">Living Arrangements: <span style={{ color: 'red' }}>*</span> </Form.Label>
                                                        <Col sm="8">
                                                            <Form.Select name="living_arrangements"
                                                                value={formData.living_arrangements}
                                                                onChange={handleInputChange}
                                                                required>
                                                                <option>Select</option>
                                                                <option value="Family">Family</option>
                                                                <option value="Parents">Parents</option>
                                                                <option value="Roommates">Roommates</option>
                                                                <option value="Alone">Alone</option>
                                                            </Form.Select>
                                                        </Col>
                                                    </Form.Group>

                                                    <Form.Group as={Row} className="mb-2 text-start" >
                                                        <Form.Label column sm="4">Family Structure:  <span style={{ color: 'red' }}>*</span></Form.Label>
                                                        <Col sm="8">
                                                            <Form.Select name="family_structure"
                                                                value={formData.family_structure}
                                                                onChange={handleInputChange}
                                                                required>
                                                                <option>Select</option>
                                                                <option value="Nuclear">Nuclear</option>
                                                                <option value="Joint">Joint</option>
                                                                <option value="Alone">Alone</option>
                                                            </Form.Select>
                                                        </Col>
                                                    </Form.Group>

                                                    <Form.Group as={Row} className="mb-2 text-start" >
                                                        <Form.Label column sm="4">Cultural Identity: <span style={{ color: 'red' }}>*</span>  </Form.Label>
                                                        <Col sm="8">
                                                            <Form.Control type="text"
                                                                name='cultural_identity'
                                                                value={formData.cultural_identity}
                                                                onChange={handleInputChange}
                                                                required />
                                                        </Col>
                                                    </Form.Group>

                                                    <Form.Group as={Row} className="mb-2 text-start" >
                                                        <Form.Label column sm="4">Language Preferences:  <span style={{ color: 'red' }}>*</span> </Form.Label>
                                                        <Col sm="4">
                                                            <Form.Control type="text"
                                                                name='language1'
                                                                value={formData.language1}
                                                                onChange={handleInputChange}
                                                                required />
                                                        </Col>
                                                        <Col sm="4">
                                                            <Form.Control type="text"
                                                                name='language2'
                                                                value={formData.language2}
                                                                onChange={handleInputChange} />
                                                        </Col>
                                                    </Form.Group>

                                                    <Col md={12} className='d-flex align-items-center justify-content-center mt-4'>
                                                        <Button className='btn btn-success' type='submit'>Submit</Button>
                                                    </Col>

                                                </Form>
                                            </Col>
                                            
                                        </Row>


                                    </li>
                                    {/* Basic details END*/}

                                    {/* Clinical History START*/}
                                    <li className="tab-content tab-content-2 typography">
                                        <div className="update_class d-flex align-items-center justify-content-center">
                                            <h1>THE CHIEF COMPLAINT</h1>
                                            
                                            <Button className='btn btn-success mx-3' type='button' onClick={handleCheifNavigate}>View All</Button>
                                        </div>
                                        <Row className='d-flex justify-content-around'>
                                            <Col md={9}>
                                                <Form className='mt-4' onSubmit={handleChiefSubmit}>
                                                    <li className='icon-li'>
                                                        <h4>The Chief Complaint: <span style={{ color: 'red' }}>*</span></h4>
                                                    </li>
                                                    <Form.Group as={Row} className="mb-2 text-start" >
                                                        <Form.Label column sm="4">Chief Complaint:  </Form.Label>
                                                        <Col sm="8">
                                                            <Form.Control type="text"
                                                                name='chief_complaint'
                                                                value={chiefData.chief_complaint}
                                                                onChange={handleInputChange1}
                                                                required />
                                                        </Col>
                                                    </Form.Group>

                                                    <Form.Group as={Row} className="mb-2 text-start" >
                                                        <Form.Label column sm="4">Onset and Duration:  <span style={{ color: 'red' }}>*</span> </Form.Label>
                                                        <Col sm="8">
                                                            <Form.Control type="text"
                                                                name='onset_duration'
                                                                value={chiefData.onset_duration}
                                                                onChange={handleInputChange1}
                                                                required />
                                                        </Col>
                                                    </Form.Group>

                                                    <Form.Group as={Row} className="mb-2 text-start" >
                                                        <Form.Label column sm="4">Nature of Symptoms:  <span style={{ color: 'red' }}>*</span> </Form.Label>
                                                        <Col sm="8">
                                                            <Form.Control type="text"
                                                                name='nature_symptoms'
                                                                value={chiefData.nature_symptoms}
                                                                onChange={handleInputChange1}
                                                                required />
                                                        </Col>
                                                    </Form.Group>

                                                    <Form.Group as={Row} className="mb-2 text-start" >
                                                        <Form.Label column sm="4">Severity: <span style={{ color: 'red' }}>*</span>  </Form.Label>
                                                        <Col sm="8">
                                                            <Form.Select name="severity"
                                                                value={chiefData.severity}
                                                                onChange={handleInputChange1}
                                                                required>
                                                                <option>Select</option>
                                                                <option value="Mild">Mild</option>
                                                                <option value="Moderate">Moderate</option>
                                                                <option value="Severe">Severe</option>
                                                            </Form.Select>
                                                        </Col>
                                                    </Form.Group>

                                                    <Form.Group as={Row} className="mb-2 text-start" >
                                                        <Form.Label column sm="4">Course Type:  <span style={{ color: 'red' }}>*</span> </Form.Label>
                                                        <Col sm="8">
                                                            <Form.Select name="course_type"
                                                                value={chiefData.course_type}
                                                                onChange={handleInputChange1}
                                                                required>
                                                                <option>Select</option>
                                                                <option value="Continuous">Continuous</option>
                                                                <option value="Episodic">Episodic</option>
                                                                <option value="Fluctuating">Fluctuating</option>
                                                            </Form.Select>
                                                        </Col>
                                                    </Form.Group>

                                                    <Form.Group as={Row} className="mb-2 text-start" >
                                                        <Form.Label column sm="4">Nature of Illness:  <span style={{ color: 'red' }}>*</span> </Form.Label>
                                                        <Col sm="8">
                                                            <Form.Select name="nature_illness"
                                                                value={chiefData.nature_illness}
                                                                onChange={handleInputChange1}
                                                                required>
                                                                <option>Select</option>
                                                                <option value="Progressive">Progressive</option>
                                                                <option value="Static">Static</option>
                                                                <option value="Improving">Improving</option>
                                                            </Form.Select>
                                                        </Col>
                                                    </Form.Group>

                                                    <li className='icon-li'>
                                                        <h4>Precipitating Factors:</h4>
                                                    </li>

                                                    <Form.Group as={Row} className="mb-2 text-start" >
                                                        <Form.Label column sm="4">Identify Triggers:  <span style={{ color: 'red' }}>*</span> </Form.Label>
                                                        <Col sm="8">
                                                            <Form.Control type="text"
                                                                name='identify_trigger'
                                                                value={chiefData.identify_trigger}
                                                                onChange={handleInputChange1}
                                                                required />
                                                        </Col>
                                                    </Form.Group>

                                                    <Form.Group as={Row} className="mb-2 text-start" >
                                                        <Form.Label column sm="4">Life Changes and Stressors:  <span style={{ color: 'red' }}>*</span> </Form.Label>
                                                        <Col sm="8">
                                                            <Form.Control type="text"
                                                                name='life_changes'
                                                                value={chiefData.life_changes}
                                                                onChange={handleInputChange1}
                                                                required />
                                                        </Col>
                                                    </Form.Group>

                                                    <li className='icon-li'>
                                                        <h4>Predisposing Factors:</h4>
                                                    </li>

                                                    <Form.Group as={Row} className="mb-2 text-start" >
                                                        <Form.Label column sm="4">Biological:  <span style={{ color: 'red' }}>*</span> </Form.Label>
                                                        <Col sm="8">
                                                            <Form.Control type="text"
                                                                name='biological'
                                                                value={chiefData.biological}
                                                                onChange={handleInputChange1}
                                                                required />
                                                        </Col>
                                                    </Form.Group>

                                                    <Form.Group as={Row} className="mb-2 text-start" >
                                                        <Form.Label column sm="4">Psychological:   <span style={{ color: 'red' }}>*</span></Form.Label>
                                                        <Col sm="8">
                                                            <Form.Control type="text"
                                                                name='psychological'
                                                                value={chiefData.psychological}
                                                                onChange={handleInputChange1}
                                                                required />
                                                        </Col>
                                                    </Form.Group>

                                                    <Form.Group as={Row} className="mb-2 text-start" >
                                                        <Form.Label column sm="4">Social / Environmental:  <span style={{ color: 'red' }}>*</span> </Form.Label>
                                                        <Col sm="8">
                                                            <Form.Control type="text"
                                                                name='social_environment'
                                                                value={chiefData.social_environment}
                                                                onChange={handleInputChange1}
                                                                required />
                                                        </Col>
                                                    </Form.Group>


                                                    <Col md={12} className='d-flex align-items-center justify-content-center mt-4'>
                                                        <Button className='btn btn-success' type='submit'>Submit</Button>
                                                    </Col>
                                                </Form>

                                            </Col>

                                        </Row>
                                    </li>
                                    {/* Clinical History END*/}

                                    {/* Psychiatric History START*/}
                                    <li className="tab-content tab-content-3 typography">
                                        <div className="update_class d-flex align-items-center justify-content-center">
                                            <h1>PRESENTING PROBLEMS</h1>
                                            
                                            <Button className='btn btn-success mx-3' type='button' onClick={handlePresentingNavigate}>View All</Button>
                                        </div>
                                        <Row className='d-flex justify-content-around'>
                                            <Col md={9}>
                                                <Form className='mt-4' onSubmit={handlePresentingSubmit}>
                                                    <li className='icon-li'>
                                                        <h4>Introduction to Presenting Problems:</h4>
                                                    </li>
                                                    <Form.Group className="mb-3" >
                                                        <Form.Label>History of Presenting Illness:  <span style={{ color: 'red' }}>*</span></Form.Label>
                                                        <Form.Control as="textarea" rows={2}
                                                            name='history_presenting'
                                                            value={presentingData.history_presenting}
                                                            onChange={handleInputChange2}
                                                            required />
                                                    </Form.Group>

                                                    <li className='icon-li'>
                                                        <h4>Detailed Exploration of Symptoms:</h4>
                                                    </li>

                                                    <Form.Group as={Row} className="mb-3">
                                                        <Form.Label>a.	Mood and Affect: <span style={{ color: 'red' }}>*</span> </Form.Label>
                                                        <div className="d-flex flex-wrap gap-3 mt-2">
                                                            {[
                                                                ["Predominant mood", "Predominant mood"],
                                                                ["Appropriateness of Affect", "Appropriateness of Affect"],

                                                            ].map(([id, label]) => renderCheckbox("mood_affect", id, label))}
                                                        </div>
                                                    </Form.Group>

                                                    <Form.Group as={Row} className="mb-3">
                                                        <Form.Label>b.	Thought Content: <span style={{ color: 'red' }}>*</span> </Form.Label>
                                                        <div className="d-flex flex-wrap gap-3 mt-2">
                                                            {[
                                                                ["Recurrent", "Recurrent"],
                                                                ["Intrusive", "Intrusive"],
                                                                ["obsessive", "obsessive"],
                                                                ["Cognitive Distortions", "Cognitive Distortions"],

                                                            ].map(([id, label]) => renderCheckbox("though_content", id, label))}
                                                        </div>
                                                    </Form.Group>

                                                    <Form.Group as={Row} className="mb-3">
                                                        <Form.Label>c.	Thought Process:  <span style={{ color: 'red' }}>*</span></Form.Label>
                                                        <div className="d-flex flex-wrap gap-3 mt-2">
                                                            {[
                                                                ["Speed of thoughts", "Speed of thoughts"],
                                                                ["Coherence", "Coherence"],
                                                                ["Organization", "Organization"],
                                                                ["Signs of Racing thoughts", "Signs of Racing thoughts"],
                                                                ["Tangentiality", "Tangentiality"],
                                                                ["Thought Blocking", "Thought Blocking"],

                                                            ].map(([id, label]) => renderCheckbox("though_process", id, label))}
                                                        </div>
                                                    </Form.Group>

                                                    <Form.Group as={Row} className="mb-3">
                                                        <Form.Label>d.	Perceptions:  <span style={{ color: 'red' }}>*</span></Form.Label>
                                                        <div className="d-flex flex-wrap gap-3 mt-2">
                                                            {[
                                                                ["Hallucinations", "Hallucinations"],
                                                                ["Perceptual Disturbances", "Perceptual Disturbances"],
                                                                ["Unusual Experiences related to Hearing", "Unusual Experiences related to Hearing"],
                                                                ["Seeing", "Seeing"],
                                                                ["Interpreting Stimuli", "Interpreting Stimuli"],

                                                            ].map(([id, label]) => renderCheckbox("perception", id, label))}
                                                        </div>
                                                    </Form.Group>

                                                    <Form.Group as={Row} className="mb-3">
                                                        <Form.Label>e.	Behavioural Changes:  <span style={{ color: 'red' }}>*</span></Form.Label>
                                                        <div className="d-flex flex-wrap gap-3 mt-2">
                                                            {[
                                                                ["Activity level", "Activity level"],
                                                                ["Social Withdrawal", "Social Withdrawal"],
                                                                ["Impulsivity", "Impulsivity"],
                                                                ["Engagement in Risky Behaviours", "Engagement in Risky Behaviours"],
                                                                ["Disruptions in Daily Routines", "Disruptions in Daily Routines"],
                                                                ["Self-Care Activities", "Self-Care Activities"]

                                                            ].map(([id, label]) => renderCheckbox("behavioural_changes", id, label))}
                                                        </div>
                                                    </Form.Group>

                                                    <Form.Group as={Row} className="mb-3">
                                                        <Form.Label>f.	Sleep Patterns: <span style={{ color: 'red' }}>*</span> </Form.Label>
                                                        <div className="d-flex flex-wrap gap-3 mt-2">
                                                            {[
                                                                ["Difficulties falling asleep", "Difficulties falling asleep"],
                                                                ["Staying asleep", "Staying asleep"],
                                                                ["Experiencing Nightmares", "Experiencing Nightmares"]

                                                            ].map(([id, label]) => renderCheckbox("sleep_patterns", id, label))}
                                                        </div>
                                                    </Form.Group>

                                                    <Form.Group className="mb-3" >
                                                        <Form.Label>Appetite and Weight Changes:  <span style={{ color: 'red' }}>*</span></Form.Label>
                                                        <Form.Control
                                                            as="textarea"
                                                            rows={2}
                                                            name='appetite_weight'
                                                            value={presentingData.appetite_weight}
                                                            onChange={handleInputChange2}
                                                            required
                                                        />

                                                    </Form.Group>

                                                    <Form.Group className="mb-3" >
                                                        <Form.Label>Energy Level: <span style={{ color: 'red' }}>*</span> </Form.Label>
                                                        <Form.Control as="textarea" rows={2}
                                                            name='energy_level'
                                                            value={presentingData.energy_level}
                                                            onChange={handleInputChange2}
                                                            required />
                                                    </Form.Group>

                                                    <li className='icon-li'>
                                                        <h4>Impact on Daily Functioning: <span style={{ color: 'red' }}>*</span></h4>
                                                    </li>

                                                    <Form.Group className="mb-3" >
                                                        <Form.Label>Occupational or Academic Functioning: </Form.Label>
                                                        <Form.Control as="textarea" rows={2}
                                                            name='occupation_academic'
                                                            value={presentingData.occupation_academic}
                                                            onChange={handleInputChange2}
                                                            required />
                                                    </Form.Group>

                                                    <Form.Group className="mb-3" >
                                                        <Form.Label>Interpersonal Relationships: <span style={{ color: 'red' }}>*</span> </Form.Label>
                                                        <Form.Control as="textarea" rows={2}
                                                            name='interpersonal_relationship'
                                                            value={presentingData.interpersonal_relationship}
                                                            onChange={handleInputChange2}
                                                            required />
                                                    </Form.Group>

                                                    <Form.Group className="mb-3" >
                                                        <Form.Label>Self-Care and Activities of Daily Living: <span style={{ color: 'red' }}>*</span> </Form.Label>
                                                        <Form.Control as="textarea" rows={2}
                                                            name='selfCare_activity'
                                                            value={presentingData.selfCare_activity}
                                                            onChange={handleInputChange2}
                                                            required />
                                                    </Form.Group>

                                                    <Form.Group className="mb-3" >
                                                        <Form.Label>Recreational Activities:  <span style={{ color: 'red' }}>*</span></Form.Label>
                                                        <Form.Control as="textarea" rows={2}
                                                            name='recreation_activity'
                                                            value={presentingData.recreation_activity}
                                                            onChange={handleInputChange2}
                                                            required />
                                                    </Form.Group>


                                                    <Col md={12} className='d-flex align-items-center justify-content-center mt-4'>
                                                        <Button className='btn btn-success' type='submit'>Submit</Button>
                                                    </Col>
                                                </Form>
                                            </Col>

                                        </Row>
                                    </li>
                                    {/* Psychiatric History END*/}

                                    {/* Medical & Drug History START*/}
                                    <li className="tab-content tab-content-4 typography">
                                        <div className="update_class d-flex align-items-center justify-content-center">
                                            <h1>PSYCHIATRIC HISTORY</h1>
                                            
                                            <Button className='btn btn-success mx-3' type='button' onClick={handlepsyHistoryNavigate}>View All</Button>
                                        </div>
                                        <Row className='d-flex justify-content-around'>
                                            <Col md={9}>
                                                <Form className='mt-4' onSubmit={handlePsyHistorySubmit}>
                                                    <li className='icon-li'>
                                                        <h4>Previous Psychiatric Diagnoses: <span style={{ color: 'red' }}>*</span></h4>
                                                    </li>
                                                    <Form.Group className="mb-3" >
                                                        <Form.Control as="textarea" rows={2}
                                                            name='psychiatric_diagnoses'
                                                            value={psyHistoryData.psychiatric_diagnoses}
                                                            onChange={handleInputChange3}
                                                            required />
                                                    </Form.Group>
                                                    <li className='icon-li'>
                                                        <h4>Treatment History: <span style={{ color: 'red' }}>*</span></h4>
                                                    </li>
                                                    <Form.Group className="mb-3" >
                                                        <Form.Control as="textarea" rows={2}
                                                            name='treatment_history'
                                                            value={psyHistoryData.treatment_history}
                                                            onChange={handleInputChange3}
                                                            required />
                                                    </Form.Group>

                                                    <li className='icon-li'>
                                                        <h4>Medication History: </h4>
                                                    </li>
                                                    <Row>
                                                        <Col md={4}>
                                                            <Form.Group className="mb-3" >
                                                                <Form.Label>Medications:   <span style={{ color: 'red' }}>*</span></Form.Label>
                                                                <Form.Control
                                                                    name='medications'
                                                                    type='text'
                                                                    value={psyHistoryData.medications}
                                                                    onChange={handleInputChange3}
                                                                    required />
                                                            </Form.Group>
                                                        </Col>
                                                        <Col md={4}>
                                                            <Form.Group className="mb-3" >
                                                                <Form.Label>Dosage:   <span style={{ color: 'red' }}>*</span></Form.Label>
                                                                <Form.Control
                                                                    name='dosage'
                                                                    type='text'
                                                                    value={psyHistoryData.dosage}
                                                                    onChange={handleInputChange3}
                                                                    required />
                                                            </Form.Group>
                                                        </Col>
                                                        <Col md={4}>
                                                            <Form.Group className="mb-3" >
                                                                <Form.Label>Adherence:   <span style={{ color: 'red' }}>*</span></Form.Label>
                                                                <Form.Control
                                                                    name='adherence'
                                                                    type='text'
                                                                    value={psyHistoryData.adherence}
                                                                    onChange={handleInputChange3}
                                                                    required />
                                                            </Form.Group>
                                                        </Col>
                                                        <Col md={4}>
                                                            <Form.Group className="mb-3" >
                                                                <Form.Label>Any side effects :  <span style={{ color: 'red' }}>*</span> </Form.Label>
                                                                <Form.Control
                                                                    name='sideEffect'
                                                                    type='text'
                                                                    value={psyHistoryData.sideEffect}
                                                                    onChange={handleInputChange3}
                                                                    required />
                                                            </Form.Group>
                                                        </Col>
                                                        <Col md={4}>
                                                            <Form.Group className="mb-3" >
                                                                <Form.Label>Experienced Reactions : <span style={{ color: 'red' }}>*</span></Form.Label>
                                                                <Form.Control
                                                                    name='experience_reaction'
                                                                    type='text'
                                                                    value={psyHistoryData.experience_reaction}
                                                                    onChange={handleInputChange3}
                                                                    required />
                                                            </Form.Group>
                                                        </Col>
                                                    </Row>

                                                    <li className='icon-li'>
                                                        <h4>Psychiatric Hospitalizations:</h4>
                                                    </li>
                                                    <Row>
                                                        <Col md={4}>
                                                            <Form.Label>Reasons <span style={{ color: 'red' }}>*</span></Form.Label>
                                                            <Form.Control as="textarea" rows={1}
                                                                name='hospitalisation_reason'
                                                                value={psyHistoryData.hospitalisation_reason}
                                                                onChange={handleInputChange3}
                                                                required />
                                                        </Col>
                                                        <Col md={4}>
                                                            <Form.Group>
                                                                <Form.Label>Duration and the Outcomes <span style={{ color: 'red' }}>*</span></Form.Label>
                                                                <Form.Control
                                                                    name='duration'
                                                                    text="text"
                                                                    value={psyHistoryData.duration}
                                                                    onChange={handleInputChange3}
                                                                    required />

                                                            </Form.Group>
                                                        </Col>
                                                    </Row>

                                                    <li className='icon-li'>
                                                        <h4>Crisis Episodes: <span style={{ color: 'red' }}>*</span></h4>
                                                    </li>
                                                    <Form.Group className="mb-3" >
                                                        <Form.Control as="textarea" rows={2}
                                                            name='crisis_episodes'
                                                            value={psyHistoryData.crisis_episodes}
                                                            onChange={handleInputChange3}
                                                            required />
                                                    </Form.Group>

                                                    <li className='icon-li'>
                                                        <h4>Family Members with Mental Health Diagnoses: <span style={{ color: 'red' }}>*</span></h4>
                                                    </li>
                                                    <Form.Group className="mb-3" >
                                                        <Form.Control as="textarea" rows={2}
                                                            name='fm_mentalHealth'
                                                            value={psyHistoryData.fm_mentalHealth}
                                                            onChange={handleInputChange3}
                                                            required />
                                                    </Form.Group>

                                                    <li className='icon-li'>
                                                        <h4>Significant Life Events and Stressors: <span style={{ color: 'red' }}>*</span></h4>
                                                    </li>
                                                    <Form.Group className="mb-3" >
                                                        <Form.Control as="textarea" rows={2}
                                                            name='significant_life'
                                                            value={psyHistoryData.significant_life}
                                                            onChange={handleInputChange3}
                                                            required />
                                                    </Form.Group>

                                                    <li className='icon-li'>
                                                        <h4>Chronic Stressors: <span style={{ color: 'red' }}>*</span></h4>
                                                    </li>
                                                    <Form.Group className="mb-3" >
                                                        <Form.Control as="textarea" rows={2}
                                                            name='chronic_stressors'
                                                            value={psyHistoryData.chronic_stressors}
                                                            onChange={handleInputChange3}
                                                            required />
                                                    </Form.Group>

                                                    <li className='icon-li'>
                                                        <h4>Exploration of Trauma: <span style={{ color: 'red' }}>*</span></h4>
                                                    </li>
                                                    <Form.Group as={Row} className="mb-3">
                                                        <div className="d-flex flex-wrap gap-3 mt-2">
                                                            {[
                                                                ["Physical", "Physical"],
                                                                ["Emotional", "Emotional"],
                                                                ["Sexual abuse ", "Sexual abuse"],
                                                                ["Coping mechanisms", "Coping mechanisms"]

                                                            ].map(([id, label]) => renderpsyCheckbox("trauma_exploration", id, label))}
                                                        </div>
                                                    </Form.Group>

                                                    <li className='icon-li'>
                                                        <h4>Legal Involvement: <span style={{ color: 'red' }}>*</span></h4>
                                                    </li>
                                                    <Form.Group as={Row} className="mb-3">
                                                        <div className="d-flex flex-wrap gap-3 mt-2">
                                                            {[
                                                                ["Involuntary Hospitalizations", "Involuntary Hospitalizations"],
                                                                ["Legal conflicts", "Legal conflicts"],
                                                                ["Involvement with the criminal justice system ", "Involvement with the criminal justice system"]

                                                            ].map(([id, label]) => renderpsyCheckbox("legal_environment", id, label))}
                                                        </div>
                                                    </Form.Group>

                                                    <Col md={12} className='d-flex align-items-center justify-content-center mt-4'>
                                                        <Button className='btn btn-success' type='submit'>Submit</Button>
                                                    </Col>

                                                </Form>
                                            </Col>
                                        </Row>
                                    </li>
                                    {/* Medical & Drug History END*/}

                                    {/* Substance History START*/}
                                    <li className="tab-content tab-content-5 typography">
                                        <div className="update_class d-flex align-items-center justify-content-center">
                                            <h1>MEDICAL HISTORY</h1>
                                            
                                            <Button className='btn btn-success mx-3' type='button' onClick={handleMedicalNavigate}>View All</Button>
                                        </div>
                                        <Row className='d-flex justify-content-around'>
                                            <Col md={9}>
                                                <Form className='mt-4' onSubmit={handleMedicalSubmit}>
                                                    <li className='icon-li'>
                                                        <h4>Disability Status (Physical or Psychological): <span style={{ color: 'red' }}>*</span></h4>
                                                    </li>
                                                    <Form.Group>
                                                        <Form.Control as="textarea" rows={2}
                                                            name='disability_status'
                                                            value={medicalData.disability_status}
                                                            onChange={handleInputChange4}
                                                            required />
                                                    </Form.Group>

                                                    <li className='icon-li'>
                                                        <h4>Chronic Medical Conditions: <span style={{ color: 'red' }}>*</span></h4>
                                                    </li>
                                                    <Form.Group>
                                                        <Form.Control as="textarea" rows={2}
                                                            name='chronic_medical'
                                                            value={medicalData.chronic_medical}
                                                            onChange={handleInputChange4}
                                                            required />
                                                    </Form.Group>

                                                    <li className='icon-li'>
                                                        <h4>Acute Health Concerns: <span style={{ color: 'red' }}>*</span></h4>
                                                    </li>
                                                    <Form.Group>
                                                        <Form.Control as="textarea" rows={2}
                                                            name='acute_health'
                                                            value={medicalData.acute_health}
                                                            onChange={handleInputChange4}
                                                            required />
                                                    </Form.Group>

                                                    <li className='icon-li'>
                                                        <h4>Medication (Duration and Outcomes):  <span style={{ color: 'red' }}>*</span></h4>
                                                    </li>
                                                    <Form.Group>
                                                        <Form.Control as="textarea" rows={2}
                                                            name='medication'
                                                            value={medicalData.medication}
                                                            onChange={handleInputChange4}
                                                            required />
                                                    </Form.Group>

                                                    <li className='icon-li'>
                                                        <h4>Medication Allergies: <span style={{ color: 'red' }}>*</span></h4>
                                                    </li>
                                                    <Form.Group>
                                                        <Form.Control as="textarea" rows={2}
                                                            name='medication_allergies'
                                                            value={medicalData.medication_allergies}
                                                            onChange={handleInputChange4}
                                                            required />
                                                    </Form.Group>

                                                    <li className='icon-li'>
                                                        <h4>Other Allergies or Sensitivities:  <span style={{ color: 'red' }}>*</span></h4>
                                                    </li>
                                                    <Form.Group as={Row} className="mb-3">
                                                        <div className="d-flex flex-wrap gap-3 mt-2">
                                                            {[
                                                                ["Foods", "Foods"],
                                                                ["Environmental Factors", "Environmental Factors"],
                                                                ["Substances ", "Substances"]
                                                            ].map(([id, label]) => renderMedCheckbox("other_allergy", id, label))}
                                                        </div>
                                                    </Form.Group>

                                                    <li className='icon-li'>
                                                        <h4>Significant Medical Events:  <span style={{ color: 'red' }}>*</span></h4>
                                                    </li>
                                                    <Form.Group as={Row} className="mb-3">
                                                        <div className="d-flex flex-wrap gap-3 mt-2">
                                                            {[
                                                                ["Surgeries", "Surgeries"],
                                                                ["Hospitalizations", "Hospitalizations"],
                                                                ["Major Illnesses ", "Major Illnesses"]

                                                            ].map(([id, label]) => renderMedCheckbox("significant_medical", id, label))}
                                                        </div>
                                                    </Form.Group>

                                                    <li className='icon-li'>
                                                        <h4>Traumatic Injuries:  <span style={{ color: 'red' }}>*</span></h4>
                                                    </li>
                                                    <Form.Group>
                                                        <Form.Control as="textarea" rows={2}
                                                            name='traumatic_injuries'
                                                            value={medicalData.traumatic_injuries}
                                                            onChange={handleInputChange4}
                                                            required />
                                                    </Form.Group>

                                                    <li className='icon-li'>
                                                        <h4>Sexual Health: <span style={{ color: 'red' }}>*</span></h4>
                                                    </li>
                                                    <Form.Group as={Row} className="mb-3">
                                                        <div className="d-flex flex-wrap gap-3 mt-2">
                                                            {[
                                                                ["Any concerns", "Any concerns"],
                                                                ["Conditions", "Conditions"],
                                                                ["Treatments ", "Treatments"]

                                                            ].map(([id, label]) => renderMedCheckbox("sexual_health", id, label))}
                                                        </div>
                                                    </Form.Group>



                                                    <Col md={12} className='d-flex align-items-center justify-content-center mt-4'>
                                                        <Button className='btn btn-success' type='submit'>Submit</Button>
                                                    </Col>
                                                </Form>
                                            </Col>
                                        </Row>
                                    </li>
                                    {/* Substance History END*/}

                                    {/* Premorbid Personality START*/}
                                    <li className="tab-content tab-content-6 typography">
                                        <div className="update_class d-flex align-items-center justify-content-center">
                                            <h1>FAMILY HISTORY</h1>
                                            
                                            <Button className='btn btn-success mx-3' type='button' onClick={handleFamHistoryNavigate}>View All</Button>
                                        </div>
                                        <Row className='d-flex justify-content-around'>
                                            <Col md={9}>
                                                <Form className='mt-4' onSubmit={handleFamilySubmit}>
                                                    <li className='icon-li'>
                                                        <h4>Family Composition: <span style={{ color: 'red' }}>*</span></h4>
                                                    </li>
                                                    <Form.Group as={Row} className="mb-3">
                                                        <div className="d-flex flex-wrap gap-3 mt-2">
                                                            {[
                                                                ["Parents", "Parents"],
                                                                ["Siblings", "Siblings"],
                                                                ["Extended Family Members ", "Extended Family Members"]
                                                            ].map(([id, label]) => renderFamCheckbox("family_composition", id, label))}
                                                        </div>
                                                    </Form.Group>
                                                    <li className='icon-li'>
                                                        <h4>Family Dynamics: <span style={{ color: 'red' }}>*</span></h4>
                                                    </li>
                                                    <Form.Group as={Row} className="mb-3">
                                                        <div className="d-flex flex-wrap gap-3 mt-2">
                                                            {[
                                                                ["Communication Patterns", "Communication Patterns"],
                                                                ["Roles", "Roles"],
                                                                ["Relationships ", "Relationships"]
                                                            ].map(([id, label]) => renderFamCheckbox("family_dynamics", id, label))}
                                                        </div>
                                                    </Form.Group>
                                                    <li className='icon-li'>
                                                        <h4>Type of Marriage: <span style={{ color: 'red' }}>*</span> </h4>
                                                    </li>
                                                    <Form.Group>
                                                        <Form.Control
                                                            type='text'
                                                            name='marriage_type'
                                                            value={familyData.marriage_type}
                                                            onChange={handleInputChange5}
                                                            required />
                                                    </Form.Group>

                                                    <li className='icon-li'>
                                                        <h4>Family History of Psychiatric Disorders: <span>(any hereditary conditions)</span> <span style={{ color: 'red' }}>*</span> </h4>
                                                    </li>
                                                    <Form.Group>
                                                        <Form.Control
                                                            type='text'
                                                            name='family_history'
                                                            value={familyData.family_history}
                                                            onChange={handleInputChange5}
                                                            required />
                                                    </Form.Group>

                                                    <li className='icon-li'>
                                                        <h4>Genetic Predispositions: <span>(genetic conditions or predispositions)</span> <span style={{ color: 'red' }}>*</span> </h4>
                                                    </li>
                                                    <Form.Group>
                                                        <Form.Control
                                                            type='text'
                                                            name='genetic_predisposition'
                                                            value={familyData.genetic_predisposition}
                                                            onChange={handleInputChange5}
                                                            required />
                                                    </Form.Group>

                                                    <li className='icon-li'>
                                                        <h4>Family Changes or Transitions: <span style={{ color: 'red' }}>*</span> </h4>
                                                    </li>
                                                    <Form.Group as={Row} className="mb-3">
                                                        <div className="d-flex flex-wrap gap-3 mt-2">
                                                            {[
                                                                ["Moves", "Moves"],
                                                                ["Divorces", "Divorces"],
                                                                ["Births ", "Births"],
                                                                ["Deaths", "Deaths"]

                                                            ].map(([id, label]) => renderFamCheckbox("family_changes", id, label))}
                                                        </div>
                                                    </Form.Group>

                                                    <li className='icon-li'>
                                                        <h4>Substance Use within the Family  <span style={{ color: 'red' }}>*</span></h4>
                                                    </li>
                                                    <Form.Group>
                                                        <Form.Control
                                                            type='text'
                                                            name='family_substance'
                                                            value={familyData.family_substance}
                                                            onChange={handleInputChange5}
                                                            required />
                                                    </Form.Group>
                                                    <Col md={12} className='d-flex align-items-center justify-content-center mt-4'>
                                                        <Button className='btn btn-success' type='submit'>Submit</Button>
                                                    </Col>
                                                </Form>
                                            </Col>

                                        </Row>
                                    </li>
                                    {/* Premorbid Personality END*/}

                                    {/* MSE START*/}
                                    <li className="tab-content tab-content-7 typography">
                                        <div className="update_class d-flex align-items-center justify-content-center">
                                            <h1>SOCIAL HISTORY </h1>
                                            
                                            <Button className='btn btn-success mx-3' type='button' onClick={handleSocHistoryNavigate}>View All</Button>
                                        </div>
                                        <Row className='d-flex justify-content-around'>
                                            <Col md={9}>
                                                <Form className='mt-4' onSubmit={handleSocialSubmit}>
                                                    <li className='icon-li'>
                                                        <h4>Relationship with Family:<span style={{ color: 'red' }}>*</span></h4>
                                                    </li>
                                                    <Form.Group>
                                                        <Form.Control
                                                            type='text'
                                                            name='family_relationship'
                                                            value={socialData.family_relationship}
                                                            onChange={handleInputChange6}
                                                            required />
                                                    </Form.Group>

                                                    <li className='icon-li'>
                                                        <h4>Relationship with Friends and Social Circles:<span style={{ color: 'red' }}>*</span></h4>
                                                    </li>
                                                    <Form.Group>
                                                        <Form.Control
                                                            type='text'
                                                            name='socialCircle_relationship'
                                                            value={socialData.socialCircle_relationship}
                                                            onChange={handleInputChange6}
                                                            required />
                                                    </Form.Group>

                                                    <li className='icon-li'>
                                                        <h4>Relationship with Significant Others:<span style={{ color: 'red' }}>*</span></h4>
                                                    </li>
                                                    <Form.Group>
                                                        <Form.Control
                                                            type='text'
                                                            name='relationship_significant'
                                                            value={socialData.relationship_significant}
                                                            onChange={handleInputChange6}
                                                            required />
                                                    </Form.Group>

                                                    <li className='icon-li'>
                                                        <h4>Current Living Arrangements:<span style={{ color: 'red' }}>*</span></h4>
                                                    </li>
                                                    <Form.Group>
                                                        <Form.Control
                                                            type='text'
                                                            name='living_arrangements'
                                                            value={socialData.living_arrangements}
                                                            onChange={handleInputChange6}
                                                            required />
                                                    </Form.Group>

                                                    <li className='icon-li'>
                                                        <h4>Educational Background :<span style={{ color: 'red' }}>*</span></h4>
                                                    </li>
                                                    <Form.Group>
                                                        <Form.Control
                                                            type='text'
                                                            name='education_bg'
                                                            value={socialData.education_bg}
                                                            onChange={handleInputChange6}
                                                            required />
                                                    </Form.Group>

                                                    <li className='icon-li'>
                                                        <h4>Current Employment Status :<span style={{ color: 'red' }}>*</span></h4>
                                                    </li>
                                                    <Form.Group>
                                                        <Form.Control
                                                            type='text'
                                                            name='currentEmp_status'
                                                            value={socialData.currentEmp_status}
                                                            onChange={handleInputChange6}
                                                            required />
                                                    </Form.Group>

                                                    <li className='icon-li'>
                                                        <h4>Recreational Activities :<span style={{ color: 'red' }}>*</span></h4>
                                                    </li>
                                                    <Form.Group>
                                                        <Form.Control
                                                            type='text'
                                                            name='socialRecreation_activity'
                                                            value={socialData.socialRecreation_activity}
                                                            onChange={handleInputChange6}
                                                            required />
                                                    </Form.Group>

                                                    <li className='icon-li'>
                                                        <h4>Social Outlets :<span style={{ color: 'red' }}>*</span></h4>
                                                    </li>
                                                    <Form.Group>
                                                        <Form.Control
                                                            type='text'
                                                            name='social_outlets'
                                                            value={socialData.social_outlets}
                                                            onChange={handleInputChange6}
                                                            required />
                                                    </Form.Group>

                                                    <li className='icon-li'>
                                                        <h4>Social Media Engagement : <span style={{ color: 'red' }}>*</span></h4>
                                                    </li>
                                                    <Form.Group>
                                                        <Form.Control
                                                            type='text'
                                                            name='socialMed_engagement'
                                                            value={socialData.socialMed_engagement}
                                                            onChange={handleInputChange6}
                                                            required />
                                                    </Form.Group>

                                                    <li className='icon-li'>
                                                        <h4>Technology-related Stressors : <span style={{ color: 'red' }}>*</span></h4>
                                                    </li>
                                                    <Form.Group>
                                                        <Form.Control
                                                            type='text'
                                                            name='technology_related'
                                                            value={socialData.technology_related}
                                                            onChange={handleInputChange6}
                                                            required />
                                                    </Form.Group>
                                                    <Col md={12} className='d-flex align-items-center justify-content-center mt-4'>
                                                        <Button className='btn btn-success' type='submit'>Submit</Button>
                                                    </Col>
                                                </Form>
                                            </Col>
                                        </Row>

                                    </li>
                                    {/* MSE END*/}

                                    {/* Physical Assessment START*/}
                                    <li className="tab-content tab-content-8 typography">
                                        <div className="update_class d-flex align-items-center justify-content-center">
                                            <h1>DEVELOPMENTAL HISTORY </h1>
                                            
                                            <Button className='btn btn-success mx-3' type='button' onClick={handleDevHistoryNavigate}>View All</Button>
                                        </div>
                                        <Row className='d-flex justify-content-around'>
                                            <Col md={9}>
                                                <Form className='mt-4' onSubmit={handleDevelopmentHistory}>
                                                    <li className='icon-li'>
                                                        <h4>Prenatal Factors:<span style={{ color: 'red' }}>*</span></h4>
                                                        <p className='text-muted small' style={{ marginTop: "5px" }}>(Mother's health during pregnancy, exposure to toxins, and any complications)</p>
                                                    </li>
                                                    <Form.Group>
                                                        <Form.Control
                                                            as="textarea" rows={2}
                                                            name='prenatal_factors'
                                                            value={developmentalData.prenatal_factors}
                                                            onChange={handleInputChange7}
                                                            required />
                                                    </Form.Group>

                                                    <li className='icon-li'>
                                                        <h4>Birth Details:<span style={{ color: 'red' }}>*</span></h4>
                                                        <p className='text-muted small' style={{ marginTop: "5px" }}>(any complications, premature birth, or medical interventions)</p>
                                                    </li>
                                                    <Form.Group>
                                                        <Form.Control
                                                            as="textarea" rows={2}
                                                            name='birth_details'
                                                            value={developmentalData.birth_details}
                                                            onChange={handleInputChange7}
                                                            required />
                                                    </Form.Group>

                                                    <li className='icon-li'>
                                                        <h4>Birth Order: <span style={{ color: 'red' }}>*</span></h4>
                                                    </li>
                                                    <Form.Group>
                                                        <Form.Control
                                                            type='text'
                                                            name='birth_order'
                                                            value={developmentalData.birth_order}
                                                            onChange={handleInputChange7}
                                                            required />
                                                    </Form.Group>

                                                    <li className='icon-li'>
                                                        <h4>Number of Siblings: <span style={{ color: 'red' }}>*</span></h4>
                                                    </li>
                                                    <Form.Group>
                                                        <Form.Control
                                                            type='text'
                                                            name='siblings_number'
                                                            value={developmentalData.siblings_number}
                                                            onChange={handleInputChange7}
                                                            required />
                                                    </Form.Group>

                                                    <li className='icon-li'>
                                                        <h4>Attachment and Bonding: <span style={{ color: 'red' }}>*</span></h4>
                                                    </li>
                                                    <Form.Group>
                                                        <Form.Control
                                                            type='text'
                                                            name='bonding_attachment'
                                                            value={developmentalData.bonding_attachment}
                                                            onChange={handleInputChange7}
                                                            required />
                                                    </Form.Group>

                                                    <li className='icon-li'>
                                                        <h4>Developmental Milestones: <span style={{ color: 'red' }}>*</span></h4>
                                                    </li>
                                                    <Form.Group>
                                                        <Form.Control
                                                            type='text'
                                                            name='milestones_development'
                                                            value={developmentalData.milestones_development}
                                                            onChange={handleInputChange7}
                                                            required />
                                                    </Form.Group>

                                                    <li className='icon-li'>
                                                        <h4>Childhood Illnesses and Injuries:<span style={{ color: 'red' }}>*</span></h4>
                                                    </li>
                                                    <Form.Group>
                                                        <Form.Control
                                                            type='text'
                                                            name='childhood_illness'
                                                            value={developmentalData.childhood_illness}
                                                            onChange={handleInputChange7}
                                                            required />
                                                    </Form.Group>

                                                    <li className='icon-li'>
                                                        <h4>Siblings and Relationships: <span style={{ color: 'red' }}>*</span></h4>
                                                    </li>
                                                    <Form.Group>
                                                        <Form.Control
                                                            type='text'
                                                            name='siblings_relationship'
                                                            value={developmentalData.siblings_relationship}
                                                            onChange={handleInputChange7}
                                                            required />
                                                    </Form.Group>

                                                    <li className='icon-li'>
                                                        <h4>Parenting Styles:</h4>
                                                    </li>
                                                    <Form.Group>
                                                        <Form.Control
                                                            type='text'
                                                            name='parenting_style'
                                                            value={developmentalData.parenting_style}
                                                            onChange={handleInputChange7}
                                                            required />
                                                    </Form.Group>

                                                    <li className='icon-li'>
                                                        <h4>Learning Challenges: <span style={{ color: 'red' }}>*</span></h4>
                                                    </li>
                                                    <Form.Group>
                                                        <Form.Control
                                                            type='text'
                                                            name='learning_challenge'
                                                            value={developmentalData.learning_challenge}
                                                            onChange={handleInputChange7}
                                                            required />
                                                    </Form.Group>

                                                    <li className='icon-li'>
                                                        <h4>Pubertal Development:<span style={{ color: 'red' }}>*</span></h4>
                                                    </li>
                                                    <Form.Group>
                                                        <Form.Control
                                                            type='text'
                                                            name='pubertal_development'
                                                            value={developmentalData.pubertal_development}
                                                            onChange={handleInputChange7}
                                                            required />
                                                    </Form.Group>
                                                    <Col md={12} className='d-flex align-items-center justify-content-center mt-4'>
                                                        <Button className='btn btn-success' type='submit'>Submit</Button>
                                                    </Col>
                                                </Form>
                                            </Col>
                                        </Row>
                                    </li>
                                    {/* Physical Assessment END*/}

                                    {/* Risk Evaluation START*/}
                                    <li className="tab-content tab-content-9 typography">
                                        <div className="update_class d-flex align-items-center justify-content-center">
                                            <h1>SUBSTANCE USE HISTORY</h1>
                                            
                                            <Button className='btn btn-success mx-3' type='button' onClick={handleSubstanceNavigate}>View All</Button>
                                        </div>
                                        <Row className='d-flex justify-content-around'>
                                            <Col md={9}>
                                                <Form className='mt-4' onSubmit={handleSubstanceSubmit}>
                                                    <li className='icon-li'>
                                                        <h4>Types of Substances Used:<span style={{ color: 'red' }}>*</span></h4>
                                                        <p className='text-muted small' style={{ marginTop: "5px" }}>(Mother's health during pregnancy, exposure to toxins, and any complications)</p>
                                                    </li>
                                                    <Form.Select name="substance_use"
                                                        value={substanceData.substance_use}
                                                        onChange={handleInputChange8}
                                                        required>
                                                        <option>Select</option>
                                                        <option value="Alcohol">Alcohol </option>
                                                        <option value="Illicit Drugs">Illicit Drugs</option>
                                                        <option value="Prescription Drugs">Prescription Drugs</option>
                                                    </Form.Select>

                                                    <li className='icon-li'>
                                                        <h4>Age of Onset :<span style={{ color: 'red' }}>*</span></h4>
                                                    </li>
                                                    <Form.Group>
                                                        <Form.Control
                                                            type='text'
                                                            name='age_onset'
                                                            value={substanceData.age_onset}
                                                            onChange={handleInputChange8}
                                                            required />
                                                    </Form.Group>

                                                    <li className='icon-li'>
                                                        <h4>Frequency :<span style={{ color: 'red' }}>*</span></h4>
                                                    </li>
                                                    <Form.Group>
                                                        <Form.Control
                                                            type='text'
                                                            name='frequency'
                                                            value={substanceData.frequency}
                                                            onChange={handleInputChange8}
                                                            required />
                                                    </Form.Group>

                                                    <li className='icon-li'>
                                                        <h4>Quantity :<span style={{ color: 'red' }}>*</span></h4>
                                                    </li>
                                                    <Form.Group>
                                                        <Form.Control
                                                            type='text'
                                                            name='quantity'
                                                            value={substanceData.quantity}
                                                            onChange={handleInputChange8}
                                                            required />
                                                    </Form.Group>

                                                    <li className='icon-li'>
                                                        <h4>Motivations for Use :<span style={{ color: 'red' }}>*</span></h4>
                                                    </li>
                                                    <Form.Group>
                                                        <Form.Control
                                                            type='text'
                                                            name='motivation_use'
                                                            value={substanceData.motivation_use}
                                                            onChange={handleInputChange8}
                                                            required />
                                                    </Form.Group>

                                                    <li className='icon-li'>
                                                        <h4>Environmental Triggers :<span style={{ color: 'red' }}>*</span></h4>
                                                    </li>
                                                    <Form.Group>
                                                        <Form.Control
                                                            type='text'
                                                            name='environmental_trigger'
                                                            value={substanceData.environmental_trigger}
                                                            onChange={handleInputChange8}
                                                            required />
                                                    </Form.Group>

                                                    <li className='icon-li'>
                                                        <h4>Impact on Occupational or Academic Functioning : <span style={{ color: 'red' }}>*</span></h4>
                                                    </li>
                                                    <Form.Group>
                                                        <Form.Control
                                                            type='text'
                                                            name='impact_occupation'
                                                            value={substanceData.impact_occupation}
                                                            onChange={handleInputChange8}
                                                            required />
                                                    </Form.Group>

                                                    <li className='icon-li'>
                                                        <h4>Impact on Interpersonal Relationships :<span style={{ color: 'red' }}>*</span></h4>
                                                    </li>
                                                    <Form.Group>
                                                        <Form.Control
                                                            type='text'
                                                            name='impact_interpersonal'
                                                            value={substanceData.impact_interpersonal}
                                                            onChange={handleInputChange8}
                                                            required />
                                                    </Form.Group>

                                                    <li className='icon-li'>
                                                        <h4>Legal or Financial Consequences :<span style={{ color: 'red' }}>*</span></h4>
                                                    </li>
                                                    <Form.Group>
                                                        <Form.Control
                                                            type='text'
                                                            name='financial_consequences'
                                                            value={substanceData.financial_consequences}
                                                            onChange={handleInputChange8}
                                                            required />
                                                    </Form.Group>

                                                    <li className='icon-li'>
                                                        <h4>Craving intensity :<span style={{ color: 'red' }}>*</span></h4>
                                                    </li>
                                                    <Form.Group>
                                                        <Form.Control
                                                            type='text'
                                                            name='craving_intensity'
                                                            value={substanceData.craving_intensity}
                                                            onChange={handleInputChange8}
                                                            required />
                                                    </Form.Group>

                                                    <li className='icon-li'>
                                                        <h4>Previous Treatment Attempts :<span style={{ color: 'red' }}>*</span></h4>
                                                    </li>
                                                    <Form.Group>
                                                        <Form.Control
                                                            type='text'
                                                            name='previous_treatment'
                                                            value={substanceData.previous_treatment}
                                                            onChange={handleInputChange8}
                                                            required />
                                                    </Form.Group>

                                                    <li className='icon-li'>
                                                        <h4>Relapse History :<span style={{ color: 'red' }}>*</span></h4>
                                                    </li>
                                                    <Form.Group>
                                                        <Form.Control
                                                            type='text'
                                                            name='relapse_history'
                                                            value={substanceData.relapse_history}
                                                            onChange={handleInputChange8}
                                                            required />
                                                    </Form.Group>
                                                    <Col md={12} className='d-flex align-items-center justify-content-center mt-4'>
                                                        <Button className='btn btn-success' type='submit'>Submit</Button>
                                                    </Col>
                                                </Form>
                                            </Col>
                                        </Row>
                                    </li>
                                    {/* Risk Evaluation END*/}

                                    {/* Treatment Plan START*/}
                                    <li className="tab-content tab-content-10 typography">
                                        <div className="update_class d-flex align-items-center justify-content-center">
                                            <h1>SUICIDAL AND HOMICIDAL IDEATION</h1>
                                            
                                            <Button className='btn btn-success mx-3' type='button' onClick={handleSuicidalNavigate}>View All</Button>
                                        </div>
                                        <Row className='d-flex justify-content-around'>
                                            <Col md={9}>
                                                <Form className='mt-4' onSubmit={handleSuicidalSubmit}>
                                                    <li className='icon-li'>
                                                        <h4>History of Suicide Attempts : <span style={{ color: 'red' }}>*</span></h4>
                                                    </li>
                                                    <Form.Group>
                                                        <Form.Control
                                                            type='text'
                                                            name='suicide_history'
                                                            value={suicidalData.suicide_history}
                                                            onChange={handleInputChange9}
                                                            required />
                                                    </Form.Group>

                                                    <li className='icon-li'>
                                                        <h4>Triggers and Stressors: <span style={{ color: 'red' }}>*</span></h4>
                                                    </li>
                                                    <Form.Group>
                                                        <Form.Control
                                                            type='text'
                                                            name='triggers_stressors'
                                                            value={suicidalData.triggers_stressors}
                                                            onChange={handleInputChange9}
                                                            required />
                                                    </Form.Group>

                                                    <li className='icon-li'>
                                                        <h4>History of Homicidal Ideation: <span style={{ color: 'red' }}>*</span></h4>
                                                    </li>
                                                    <Form.Group>
                                                        <Form.Control
                                                            type='text'
                                                            name='homicidal_ideation'
                                                            value={suicidalData.homicidal_ideation}
                                                            onChange={handleInputChange9}
                                                            required />
                                                    </Form.Group>

                                                    <li className='icon-li'>
                                                        <h4>Target and Method: <span style={{ color: 'red' }}>*</span></h4>
                                                    </li>
                                                    <Form.Group>
                                                        <Form.Control
                                                            type='text'
                                                            name='target_method'
                                                            value={suicidalData.target_method}
                                                            onChange={handleInputChange9}
                                                            required />
                                                    </Form.Group>

                                                    <li className='icon-li'>
                                                        <h4>Immediate Threat: <span style={{ color: 'red' }}>*</span></h4>
                                                        <p className='text-muted small' style={{ marginTop: "5px" }}>(assessed by history taker)</p>
                                                    </li>
                                                    <Form.Group>
                                                        <Form.Control
                                                            type='text'
                                                            name='immediate_threat'
                                                            value={suicidalData.immediate_threat}
                                                            onChange={handleInputChange9}
                                                            required />
                                                    </Form.Group>

                                                    <li className='icon-li'>
                                                        <h4>Necessity of Emergency Response: <span style={{ color: 'red' }}>*</span></h4>
                                                    </li>
                                                    <Form.Group>
                                                        <Form.Check
                                                            type='radio'
                                                            label='Yes'
                                                            name='emergency_response'
                                                            value='Yes'
                                                            checked={suicidalData.emergency_response === 'Yes'}
                                                            onChange={handleInputChange9}
                                                            required
                                                        />
                                                        <Form.Check
                                                            type='radio'
                                                            label='No'
                                                            name='emergency_response'
                                                            value='No'
                                                            checked={suicidalData.emergency_response === 'No'}
                                                            onChange={handleInputChange9}
                                                            required
                                                        />
                                                    </Form.Group>

                                                    <li className='icon-li'>
                                                        <h4>Hospitalization Required: <span style={{ color: 'red' }}>*</span></h4>
                                                    </li>
                                                    <Form.Group>
                                                        <Form.Check
                                                            type='radio'
                                                            label='Yes'
                                                            name='hospital_required'
                                                            value='Yes'
                                                            checked={suicidalData.hospital_required === 'Yes'}
                                                            onChange={handleInputChange9}
                                                            required
                                                        />
                                                        <Form.Check
                                                            type='radio'
                                                            label='No'
                                                            name='hospital_required'
                                                            value='No'
                                                            checked={suicidalData.hospital_required === 'No'}
                                                            onChange={handleInputChange9}
                                                            required
                                                        />
                                                    </Form.Group>
                                                    <Col md={12} className='d-flex align-items-center justify-content-center mt-4'>
                                                        <Button className='btn btn-success' type='submit'>Submit</Button>
                                                    </Col>
                                                </Form>
                                            </Col>
                                        </Row>
                                    </li>
                                    {/* Treatment Plan END*/}

                                </ul>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container >

            <div ref={formRef} style={{ position: "absolute", left: "-9999px", top: 0, background: "#fff", padding: "20px", width: "210mm" }}>
                <Row className="d-flex align-items-center justify-content-center mb-2">
                    <Col md={2}>
                        <img src={manasu_logo} className="pdf_logo" alt="" />
                    </Col>
                    <Col md={10}>
                    </Col>
                </Row>
                {allFormEntries.map((entry, index) => (
                    <div key={index} style={{ pageBreakAfter: "always" }}>
                        {/* BASIC DETAILS */}
                        <Row className="d-flex align-items-center justify-content-center mb-2">
                            <Col md={1}>

                            </Col>
                            <Col md={11}>
                                <h4 className="text-center">Psychiatrics Case History of {entry.basic_detail?.date}</h4>
                            </Col>
                        </Row>

                        <ul style={{ listStyleType: "none", textAlign: "start" }}>
                            <li className="tab-content my-3">
                                <h5><strong>DEMOGRAPHIC INFORMATION</strong> DATE: {entry.basic_detail?.date}</h5>
                                <ul style={{ listStyleType: "none", textAlign: "start" }}>
                                    <li className='d-flex'>
                                        <strong>Name : </strong>
                                        <p className='mx-3'>{entry.basic_detail?.patient_name || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Age : </strong>
                                        <p className='mx-3'>{entry.basic_detail?.patient_age || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Gender : </strong>
                                        <p className='mx-3'>{entry.basic_detail?.patient_gender || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Sexual Orientation : </strong>
                                        <p className='mx-3'>{entry.basic_detail?.sexual_orientation || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Educational Background : </strong>
                                        <p className='mx-3'>{entry.basic_detail?.education_bg || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Occupation and Employment Status : </strong>
                                        <p className='mx-3'>{entry.basic_detail?.occupation || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Marital Status : </strong>
                                        <p className='mx-3'>{entry.basic_detail?.marital_status || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Socio Economic Status : </strong>
                                        <p className='mx-3'>{entry.basic_detail?.economic_status || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Religion : </strong>
                                        <p className='mx-3'>{entry.basic_detail?.religion || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Informant : </strong>
                                        <p className='mx-3'>{entry.basic_detail?.informant || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Residential Address (current address) : </strong>
                                        <p className='mx-3'>{entry.basic_detail?.residential_address || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Living Arrangements : </strong>
                                        <p className='mx-3'>{entry.basic_detail?.living_arrangements || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Family Structure : </strong>
                                        <p className='mx-3'>{entry.basic_detail?.family_structure || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Cultural Identity : </strong>
                                        <p className='mx-3'>{entry.basic_detail?.family_structure || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Language Preferences : </strong>
                                        <p className='mx-3'>{entry.basic_detail?.family_structure || "NULL"}</p>
                                    </li>
                                    {/* Repeat for all other fields like Age, Gender, etc. */}
                                </ul>
                            </li>

                            <li className="tab-content my-3">
                                <h5><strong>THE CHIEF COMPLAINT</strong> DATE: {entry.cheif_complaint?.date}</h5>
                                <ul style={{ listStyleType: "none", textAlign: "start" }}>
                                    <li className='d-flex'>
                                        <strong>Chief Complaint :</strong>
                                        <p className='mx-3'>{entry.cheif_complaint?.chief_complaint || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Onset and Duration :</strong>
                                        <p className='mx-3'>{entry.cheif_complaint?.onset_duration || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Nature of Symptoms :</strong>
                                        <p className='mx-3'>{entry.cheif_complaint?.nature_symptoms || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Severity :</strong>
                                        <p className='mx-3'>{entry.cheif_complaint?.severity || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Course Type :</strong>
                                        <p className='mx-3'>{entry.cheif_complaint?.course_type || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Nature of Illness :</strong>
                                        <p className='mx-3'>{entry.cheif_complaint?.nature_illness || "NULL"}</p>
                                    </li>
                                    <h6>Precipitating Factors:</h6>
                                    <li className='d-flex'>
                                        <strong>Identify Triggers :</strong>
                                        <p className='mx-3'>{entry.cheif_complaint?.identify_trigger || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Life Changes and Stressors :</strong>
                                        <p className='mx-3'>{entry.cheif_complaint?.life_changes || "NULL"}</p>
                                    </li>
                                    <h6>Predisposing Factors:</h6>
                                    <li className='d-flex'>
                                        <strong>Biological :</strong>
                                        <p className='mx-3'>{entry.cheif_complaint?.biological || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Psychological :</strong>
                                        <p className='mx-3'>{entry.cheif_complaint?.psychological || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Social / Environmental :</strong>
                                        <p className='mx-3'>{entry.cheif_complaint?.social_environment || "NULL"}</p>
                                    </li>
                                </ul>
                            </li>
                            <li className="tab-content my-3">
                                <h5><strong>PRESENTING PROBLEMS</strong> DATE: {entry.presenting_problems?.date}</h5>
                                <ul style={{ listStyleType: "none", textAlign: "start" }}>
                                    <h6>Introduction to Presenting Problems : </h6>
                                    <li className='d-flex'>
                                        <strong>History of Presenting Illness :</strong>
                                        <p className='mx-3'>{entry.presenting_problems?.history_presenting || "NULL"}</p>
                                    </li>
                                    <h6>Detailed Exploration of Symptoms : </h6>
                                    <li className='d-flex'>
                                        <strong>a.	Mood and Affect :</strong>
                                        <p className='mx-3'>{entry.presenting_problems?.mood_affect || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>b.	Thought Content :</strong>
                                        <p className='mx-3'>{entry.presenting_problems?.though_content || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>c.	Thought Process :</strong>
                                        <p className='mx-3'>{entry.presenting_problems?.though_process || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>d.	Perceptions :</strong>
                                        <p className='mx-3'>{entry.presenting_problems?.perception || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>e.	Behavioural Changes :</strong>
                                        <p className='mx-3'>{entry.presenting_problems?.behavioural_changes || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>f.	Sleep Patterns :</strong>
                                        <p className='mx-3'>{entry.presenting_problems?.sleep_patterns || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Appetite and Weight Changes :</strong>
                                        <p className='mx-3'>{entry.presenting_problems?.appetite_weight || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Energy Level :</strong>
                                        <p className='mx-3'>{entry.presenting_problems?.energy_level || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Impact on Daily Functioning :</strong>
                                        <p className='mx-3'>{entry.presenting_problems?.occupation_academic || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Interpersonal Relationships :</strong>
                                        <p className='mx-3'>{entry.presenting_problems?.interpersonal_relationship || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Self-Care and Activities of Daily Living :</strong>
                                        <p className='mx-3'>{entry.presenting_problems?.selfCare_activity || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Recreational Activities :</strong>
                                        <p className='mx-3'>{entry.presenting_problems?.recreation_activity || "NULL"}</p>
                                    </li>
                                </ul>
                            </li>
                            <li className="tab-content my-3">
                                <h5><strong>PSYCHIATRIC HISTORY</strong> DATE: {entry.psy_history?.date}</h5>
                                <ul style={{ listStyleType: "none", textAlign: "start" }}>
                                    <li className='d-flex'>
                                        <strong>Previous Psychiatric Diagnoses :</strong>
                                        <p className='mx-3'>{entry.psy_history?.psychiatric_diagnoses || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Treatment History :</strong>
                                        <p className='mx-3'>{entry.psy_history?.treatment_history || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Medication History :</strong>
                                        <p className='mx-3'>{entry.psy_history?.medications || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Dosage :</strong>
                                        <p className='mx-3'>{entry.psy_history?.dosage || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Adherence :</strong>
                                        <p className='mx-3'>{entry.psy_history?.adherence || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Any side effects :</strong>
                                        <p className='mx-3'>{entry.psy_history?.sideEffect || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Experienced Reactions :</strong>
                                        <p className='mx-3'>{entry.psy_history?.experience_reaction || "NULL"}</p>
                                    </li>
                                    <h6>Psychiatric Hospitalizations :</h6>
                                    <li className='d-flex'>
                                        <strong>Reasons :</strong>
                                        <p className='mx-3'>{entry.psy_history?.hospitalisation_reason || "NULL"}</p>
                                    </li>
                                     <li className='d-flex'>
                                        <strong>Duration and the Outcomes :</strong>
                                        <p className='mx-3'>{entry.psy_history?.duration || "NULL"}</p>
                                    </li>
                                     <li className='d-flex'>
                                        <strong>Crisis Episodes :</strong>
                                        <p className='mx-3'>{entry.psy_history?.crisis_episodes || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Family Members with Mental Health Diagnoses :</strong>
                                        <p className='mx-3'>{entry.psy_history?.fm_mentalHealth || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Significant Life Events and Stressors :</strong>
                                        <p className='mx-3'>{entry.psy_history?.significant_life || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Chronic Stressors :</strong>
                                        <p className='mx-3'>{entry.psy_history?.chronic_stressors || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Exploration of Trauma :</strong>
                                        <p className='mx-3'>{entry.psy_history?.trauma_exploration || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Legal Involvement :</strong>
                                        <p className='mx-3'>{entry.psy_history?.legal_environment || "NULL"}</p>
                                    </li>
                                </ul>
                            </li>
                            <li className="tab-content my-3">
                                <h5><strong>MEDICAL HISTORY</strong> DATE: {entry.medical_history?.date}</h5>
                                <ul style={{ listStyleType: "none", textAlign: "start" }}>
                                    <li className='d-flex'>
                                        <strong>Disability Status (Physical or Psychological) :</strong>
                                        <p className='mx-3'>{entry.medical_history?.disability_status || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Chronic Medical Conditions :</strong>
                                        <p className='mx-3'>{entry.medical_history?.chronic_medical || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Acute Health Concerns :</strong>
                                        <p className='mx-3'>{entry.medical_history?.acute_health || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Medication (Duration and Outcomes) :</strong>
                                        <p className='mx-3'>{entry.medical_history?.medication || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Medication Allergies :</strong>
                                        <p className='mx-3'>{entry.medical_history?.medication_allergies || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Other Allergies or Sensitivities :</strong>
                                        <p className='mx-3'>{entry.medical_history?.other_allergy || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Significant Medical Events :</strong>
                                        <p className='mx-3'>{entry.medical_history?.significant_medical || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Traumatic Injuries :</strong>
                                        <p className='mx-3'>{entry.medical_history?.traumatic_injuries || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Sexual Health :</strong>
                                        <p className='mx-3'>{entry.medical_history?.sexual_health || "NULL"}</p>
                                    </li>
                                </ul>
                            </li>
                            <li className="tab-content my-3">
                                <h5><strong>FAMILY HISTORY</strong> DATE: {entry.familyhis_data?.date}</h5>
                                <ul style={{ listStyleType: "none", textAlign: "start" }}>
                                    <li className='d-flex'>
                                        <strong>Family Composition :</strong>
                                        <p className='mx-3'>{entry.familyhis_data?.family_composition || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Family Dynamics :</strong>
                                        <p className='mx-3'>{entry.familyhis_data?.family_dynamics || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Type of Marriage :</strong>
                                        <p className='mx-3'>{entry.familyhis_data?.marriage_type || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Family History of Psychiatric Disorders :</strong>
                                        <p className='mx-3'>{entry.familyhis_data?.family_history || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Genetic Predispositions :</strong>
                                        <p className='mx-3'>{entry.familyhis_data?.genetic_predisposition || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Family Changes or Transitions :</strong>
                                        <p className='mx-3'>{entry.familyhis_data?.family_changes || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Substance Use within the Family :</strong>
                                        <p className='mx-3'>{entry.familyhis_data?.family_substance || "NULL"}</p>
                                    </li>
                                </ul>
                            </li>
                            <li className="tab-content my-3">
                                <h5><strong>SOCIAL HISTORY</strong> DATE: {entry.social_history?.date}</h5>
                                <ul style={{ listStyleType: "none", textAlign: "start" }}>
                                    <li className='d-flex'>
                                        <strong>Relationship with Family :</strong>
                                        <p className='mx-3'>{entry.social_history?.family_relationship || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Relationship with Friends and Social Circles :</strong>
                                        <p className='mx-3'>{entry.social_history?.socialCircle_relationship || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Relationship with Significant Others :</strong>
                                        <p className='mx-3'>{entry.social_history?.relationship_significant || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Current Living Arrangements :</strong>
                                        <p className='mx-3'>{entry.social_history?.living_arrangements || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Educational Background :</strong>
                                        <p className='mx-3'>{entry.social_history?.education_bg || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Current Employment Status :</strong>
                                        <p className='mx-3'>{entry.social_history?.currentEmp_status || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Recreational Activities :</strong>
                                        <p className='mx-3'>{entry.social_history?.socialRecreation_activity || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Social Outlets :</strong>
                                        <p className='mx-3'>{entry.social_history?.social_outlets || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Social Media Engagement :</strong>
                                        <p className='mx-3'>{entry.social_history?.socialMed_engagement || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Technology-related Stressors :</strong>
                                        <p className='mx-3'>{entry.social_history?.technology_related || "NULL"}</p>
                                    </li>
                                </ul>
                            </li>
                            <li className="tab-content my-3">
                                <h5><strong>DEVELOPMENTAL HISTORY</strong> DATE: {entry.development_history?.date}</h5>
                                <ul style={{ listStyleType: "none", textAlign: "start" }}>
                                    <li className='d-flex'>
                                        <strong>Prenatal Factors :</strong>
                                        <p className='mx-3'>{entry.development_history?.prenatal_factors || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Birth Details :</strong>
                                        <p className='mx-3'>{entry.development_history?.birth_details || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Birth Order :</strong>
                                        <p className='mx-3'>{entry.development_history?.birth_order || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Number of Siblings :</strong>
                                        <p className='mx-3'>{entry.development_history?.siblings_number || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Attachment and Bonding :</strong>
                                        <p className='mx-3'>{entry.development_history?.bonding_attachment || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Developmental Milestones :</strong>
                                        <p className='mx-3'>{entry.development_history?.milestones_development || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Childhood Illnesses and Injuries :</strong>
                                        <p className='mx-3'>{entry.development_history?.childhood_illness || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Siblings and Relationships :</strong>
                                        <p className='mx-3'>{entry.development_history?.siblings_relationship || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Parenting Styles :</strong>
                                        <p className='mx-3'>{entry.development_history?.parenting_style || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Learning Challenges :</strong>
                                        <p className='mx-3'>{entry.development_history?.learning_challenge || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Pubertal Development :</strong>
                                        <p className='mx-3'>{entry.development_history?.pubertal_development || "NULL"}</p>
                                    </li>
                                    
                                </ul>
                            </li>
                            <li className="tab-content my-3 mt-5">
                                <h5><strong>SUBSTANCE USE HISTORY</strong> DATE: {entry.substance_use?.date}</h5>
                                <ul style={{ listStyleType: "none", textAlign: "start" }}>
                                    <li className='d-flex'>
                                        <strong>Types of Substances Used :</strong>
                                        <p className='mx-3'>{entry.substance_use?.substance_use || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Age of Onset :</strong>
                                        <p className='mx-3'>{entry.substance_use?.age_onset || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Frequency :</strong>
                                        <p className='mx-3'>{entry.substance_use?.frequency || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Quantity :</strong>
                                        <p className='mx-3'>{entry.substance_use?.quantity || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Motivations for Use :</strong>
                                        <p className='mx-3'>{entry.substance_use?.motivation_use || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Environmental Triggers :</strong>
                                        <p className='mx-3'>{entry.substance_use?.environmental_trigger || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Impact on Occupational or Academic Functioning :</strong>
                                        <p className='mx-3'>{entry.substance_use?.impact_occupation || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Impact on Interpersonal Relationships :</strong>
                                        <p className='mx-3'>{entry.substance_use?.impact_interpersonal || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Legal or Financial Consequences :</strong>
                                        <p className='mx-3'>{entry.substance_use?.financial_consequences || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Craving intensity :</strong>
                                        <p className='mx-3'>{entry.substance_use?.craving_intensity || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Previous Treatment Attempts :</strong>
                                        <p className='mx-3'>{entry.substance_use?.previous_treatment || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Relapse History :</strong>
                                        <p className='mx-3'>{entry.substance_use?.relapse_history || "NULL"}</p>
                                    </li>
                                </ul>
                            </li>
                            <li className="tab-content my-3">
                                <h5><strong>SUICIDAL AND HOMICIDAL IDEATION</strong> DATE: {entry.suicidal_data?.date}</h5>
                                <ul style={{ listStyleType: "none", textAlign: "start" }}>
                                    <li className='d-flex'>
                                        <strong>History of Suicide Attempts :</strong>
                                        <p className='mx-3'>{entry.suicidal_data?.suicide_history || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Triggers and Stressors :</strong>
                                        <p className='mx-3'>{entry.suicidal_data?.triggers_stressors || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>History of Homicidal Ideation :</strong>
                                        <p className='mx-3'>{entry.suicidal_data?.homicidal_ideation || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Target and Method :</strong>
                                        <p className='mx-3'>{entry.suicidal_data?.target_method || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Immediate Threat :</strong>
                                        <p className='mx-3'>{entry.suicidal_data?.immediate_threat || "NULL"}</p>
                                    </li>
                                    <li className='d-flex'>
                                        <strong>Necessity of Emergency Response :</strong>
                                        <p className='mx-3'>{entry.suicidal_data?.emergency_response || "NULL"}</p>
                                    </li>

                                    <li className='d-flex'>
                                        <strong>Hospitalization Required :</strong>
                                        <p className='mx-3'>{entry.suicidal_data?.hospital_required || "NULL"}</p>
                                    </li>
                                </ul>
                            </li>

                            {/* Repeat for all other sections like presenting_problems, medical_history, etc. */}
                        </ul>
                    </div>
                ))}
            </div>


        </>
    )
}

export default Psychiatrics_form

