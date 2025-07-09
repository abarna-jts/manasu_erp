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
    const [show, setShow] = useState(false);
    const [cheifShow, setCheifShow] = useState(false);
    const [presentingShow, setPresentingShow] = useState(false);
    const [psychiatricShow, setPsychiatricShow] = useState(false);
    const [medicalShow, setMedicalShow] = useState(false);
    const [familyShow, setFamilyShow] = useState(false);
    const [socialShow, setSocialShow] = useState(false);
    const [developmentalShow, setDevelopmentalShow] = useState(false);
    const [substanceShow, setSubstanceShow] = useState(false);
    const [suicidalShow, setSuicidalShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleChiefClose = () => setCheifShow(false);
    const handlePresentingClose = () => setPresentingShow(false);
    const handlePsychiatriClose = () => setPsychiatricShow(false);
    const handleMedicalClose = () => setMedicalShow(false);
    const handleFamilyClose = () => setFamilyShow(false);
    const handleSocialClose = () => setSocialShow(false);
    const handleDevelopmentalClose = () => setDevelopmentalShow(false);
    const handleSubstanceClose = () => setSubstanceShow(false);
    const handleSuicideClose = () => setSuicidalShow(false);
    const [shouldGeneratePDF, setShouldGeneratePDF] = useState(false);

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
                const imagePath = result.rescue_image.startsWith("http")
                    ? result.rescue_image
                    : `https://www.pahrultours.com/app2/${result.rescue_image}`;

                setRescueImage(imagePath);
                setRescueName(result.rescue_name || "");
                setError(""); // clear any previous error
            } else {
                setRescueImage(null);

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

    const handleShow = async () => {
        console.log("hi");
        if (!admission_no.trim()) {
            alert("Please enter admission number.");
            return;
        }
        console.log(admission_no);
        try {
            const response = await apiRoute.get(`/recovery/get_information/${admission_no}`);
            const data = response.data;
            console.log(response.data);
            setFormData(prev => ({
                ...prev,
                admission_no: data.admission_no || '',
                patient_name: data.patient_name || '',
                patient_age: data.patient_age || '',
                patient_gender: data.patient_gender || '',
                sexual_orientation: data.sexual_orientation || '',
                education_bg: data.education_bg || '',
                occupation: data.occupation || '',
                marital_status: data.marital_status || '',
                economic_status: data.economic_status || '',
                religion: data.religion || '',
                informant: data.informant || '',
                residential_address: data.residential_address || '',
                living_arrangements: data.living_arrangements || '',
                family_structure: data.family_structure || '',
                cultural_identity: data.cultural_identity || '',
                language1: data.language1 || '',
                language2: data.language2 || '',
            }));
            setShow(true);
        } catch (error) {
            console.error("Error fetching form data:", error);
            alert("Admission Number not found");
        }
    };

    const handleCheifComplaintShow = async () => {
        console.log("hi");
        if (!admission_no.trim()) {
            alert("Please enter admission number.");
            return;
        }
        console.log(admission_no);
        try {
            const response = await apiRoute.get(`/recovery/get_chiefComplaint/${admission_no}`);
            const data = response.data;
            console.log(response.data);
            setChiefData(prev => ({
                ...prev,
                admission_no: data.admission_no || '',
                chief_complaint: data.chief_complaint || '',
                onset_duration: data.onset_duration || '',
                nature_symptoms: data.nature_symptoms || '',
                severity: data.severity || '',
                course_type: data.course_type || '',
                nature_illness: data.nature_illness || '',
                identify_trigger: data.identify_trigger || '',
                life_changes: data.life_changes || '',
                biological: data.biological || '',
                psychological: data.psychological || '',
                social_environment: data.social_environment || '',
            }));
            setCheifShow(true);
        } catch (error) {
            console.error("Error fetching form data:", error);
            alert("Admission Number not found");
        }
    };

    const handlePresentingShow = async () => {
        console.log("hi");
        if (!admission_no.trim()) {
            alert("Please enter admission number.");
            return;
        }
        console.log(admission_no);
        try {
            const response = await apiRoute.get(`/recovery/get_presentingData/${admission_no}`);
            const data = response.data;
            console.log(response.data);
            setPresentingData(prev => ({
                ...prev,
                admission_no: data.admission_no || '',
                history_presenting: data.history_presenting || '',
                mood_affect: data.mood_affect?.split(',').map(i => i.trim()) || [],
                though_content: data.though_content?.split(',').map(i => i.trim()) || [],
                though_process: data.though_process?.split(',').map(i => i.trim()) || [],
                perception: data.perception?.split(',').map(i => i.trim()) || [],
                behavioural_changes: data.behavioural_changes?.split(',').map(i => i.trim()) || [],
                sleep_patterns: data.sleep_patterns?.split(',').map(i => i.trim()) || [],
                energy_level: data.energy_level || '',
                appetite_weight: data.appetite_weight || '',
                occupation_academic: data.occupation_academic || '',
                interpersonal_relationship: data.interpersonal_relationship || '',
                selfCare_activity: data.selfCare_activity || '',
                recreation_activity: data.recreation_activity || '',
            }));
            setPresentingShow(true);
        } catch (error) {
            console.error("Error fetching form data:", error);
            alert("Admission Number not found");
        }
    }

    const handlePsychiatricShow = async () => {
        console.log("hi");
        if (!admission_no.trim()) {
            alert("Please enter admission number.");
            return;
        }
        console.log(admission_no);
        try {
            const response = await apiRoute.get(`/recovery/get_psychiatric/${admission_no}`);
            const data = response.data;
            console.log(response.data);
            setPsyHistoryData(prev => ({
                ...prev,
                admission_no: data.admission_no || '',
                psychiatric_diagnoses: data.psychiatric_diagnoses || '',
                treatment_history: data.treatment_history || '',
                medications: data.medications || '',
                dosage: data.dosage || '',
                adherence: data.adherence || '',
                sideEffect: data.sideEffect || '',
                experience_reaction: data.experience_reaction || '',
                hospitalisation_reason: data.hospitalisation_reason || '',
                duration: data.duration || '',
                crisis_episodes: data.crisis_episodes || '',
                fm_mentalHealth: data.fm_mentalHealth || '',
                significant_life: data.significant_life || '',
                chronic_stressors: data.chronic_stressors || '',
                trauma_exploration: data.trauma_exploration?.split(',').map(i => i.trim()) || [],
                legal_environment: data.legal_environment?.split(',').map(i => i.trim()) || [],
            }));
            setPsychiatricShow(true);
        } catch (error) {
            console.error("Error fetching form data:", error);
            alert("Admission Number not found");
        }
    }

    const handleMedicalShow = async () => {
        console.log("hi");
        if (!admission_no.trim()) {
            alert("Please enter admission number.");
            return;
        }
        console.log(admission_no);
        try {
            const response = await apiRoute.get(`/recovery/get_medicalHistory/${admission_no}`);
            const data = response.data;
            console.log(response.data);
            setMedicalData(prev => ({
                ...prev,
                admission_no: data.admission_no || '',
                disability_status: data.disability_status || '',
                chronic_medical: data.chronic_medical || '',
                acute_health: data.acute_health || '',
                medication: data.medication || '',
                medication_allergies: data.medication_allergies || '',
                traumatic_injuries: data.traumatic_injuries || '',
                other_allergy: data.other_allergy?.split(',').map(i => i.trim()) || [],
                significant_medical: data.significant_medical?.split(',').map(i => i.trim()) || [],
                sexual_health: data.sexual_health?.split(',').map(i => i.trim()) || [],
            }));
            setMedicalShow(true);
        } catch (error) {
            console.error("Error fetching form data:", error);
            alert("Admission Number not found");
        }
    }

    const handleFamilyShow = async () => {
        console.log("hi");
        if (!admission_no.trim()) {
            alert("Please enter admission number.");
            return;
        }
        console.log(admission_no);
        try {
            const response = await apiRoute.get(`/recovery/get_familyHistory/${admission_no}`);
            const data = response.data;
            console.log(response.data);
            setFamilyData(prev => ({
                ...prev,
                admission_no: data.admission_no || '',
                family_composition: data.family_composition?.split(',').map(i => i.trim()) || [],
                family_dynamics: data.family_dynamics?.split(',').map(i => i.trim()) || [],
                marriage_type: data.marriage_type || '',
                family_history: data.family_history || '',
                genetic_predisposition: data.genetic_predisposition || '',
                family_changes: data.family_changes?.split(',').map(i => i.trim()) || [],
                family_substance: data.family_substance || '',

            }));
            setFamilyShow(true);
        } catch (error) {
            console.error("Error fetching form data:", error);
            alert("Admission Number not found");
        }
    }

    const handleSocialShow = async () => {
        console.log("hi");
        if (!admission_no.trim()) {
            alert("Please enter admission number.");
            return;
        }
        console.log(admission_no);
        try {
            const response = await apiRoute.get(`/recovery/get_SocialHistory/${admission_no}`);
            const data = response.data;
            console.log(response.data);
            setSocialData(prev => ({
                ...prev,
                admission_no: data.admission_no || '',
                family_relationship: data.family_relationship || '',
                socialCircle_relationship: data.socialCircle_relationship || '',
                relationship_significant: data.relationship_significant || '',
                living_arrangements: data.living_arrangements || '',
                education_bg: data.education_bg || '',
                currentEmp_status: data.currentEmp_status || '',
                socialRecreation_activity: data.socialRecreation_activity || '',
                social_outlets: data.social_outlets || '',
                socialMed_engagement: data.socialMed_engagement || '',
                technology_related: data.technology_related || '',
            }));
            setSocialShow(true);
        } catch (error) {
            console.error("Error fetching form data:", error);
            alert("Admission Number not found");
        }
    }

    const handleDevelopmentalShow = async () => {
        console.log("hi");
        if (!admission_no.trim()) {
            alert("Please enter admission number.");
            return;
        }
        console.log(admission_no);
        try {
            const response = await apiRoute.get(`/recovery/get_DevelopmentalHistory/${admission_no}`);
            const data = response.data;
            console.log(response.data);
            setDeveleopmentData(prev => ({
                ...prev,
                admission_no: data.admission_no || '',
                prenatal_factors: data.prenatal_factors || '',
                birth_details: data.birth_details || '',
                birth_order: data.birth_order || '',
                siblings_number: data.siblings_number || '',
                bonding_attachment: data.bonding_attachment || '',
                milestones_development: data.milestones_development || '',
                childhood_illness: data.childhood_illness || '',
                siblings_relationship: data.siblings_relationship || '',
                parenting_style: data.parenting_style || '',
                learning_challenge: data.learning_challenge || '',
                pubertal_development: data.pubertal_development || ''
            }));
            setDevelopmentalShow(true);
        } catch (error) {
            console.error("Error fetching form data:", error);
            alert("Admission Number not found");
        }
    }

    const handleSubstanceShow = async () => {
        if (!admission_no.trim()) {
            alert("Please enter admission number.");
            return;
        }
        console.log(admission_no);
        try {
            const response = await apiRoute.get(`/recovery/get_substance/${admission_no}`);
            const data = response.data;
            console.log(response.data);
            setSubstanceData(prev => ({
                ...prev,
                admission_no: data.admission_no || '',
                substance_use: data.substance_use || '',
                age_onset: data.age_onset || '',
                frequency: data.frequency || '',
                quantity: data.quantity || '',
                motivation_use: data.motivation_use || '',
                environmental_trigger: data.environmental_trigger || '',
                impact_occupation: data.impact_occupation || '',
                impact_interpersonal: data.impact_interpersonal || '',
                financial_consequences: data.financial_consequences || '',
                craving_intensity: data.craving_intensity || '',
                previous_treatment: data.previous_treatment || '',
                relapse_history: data.relapse_history || '',
            }));
            setSubstanceShow(true);
        } catch (error) {
            console.error("Error fetching form data:", error);
            alert("Admission Number not found");
        }
    }

    const handleSuicidalShow = async () => {
        if (!admission_no.trim()) {
            alert("Please enter admission number.");
            return;
        }
        console.log(admission_no);
        try {
            const response = await apiRoute.get(`/recovery/get_suicidal/${admission_no}`);
            const data = response.data;
            console.log(response.data);
            setSuicidalData(prev => ({
                ...prev,
                admission_no: data.admission_no || '',
                suicide_history: data.suicide_history || '',
                triggers_stressors: data.triggers_stressors || '',
                homicidal_ideation: data.homicidal_ideation || '',
                target_method: data.target_method || '',
                immediate_threat: data.immediate_threat || '',
                emergency_response: data.emergency_response || '',
                hospital_required: data.hospital_required || ''
            }));
            setSuicidalShow(true);
        } catch (error) {
            console.error("Error fetching form data:", error);
            alert("Admission Number not found");
        }
    }

    const handleUpdate = async (e, admission_no) => {
        e.preventDefault();

        try {
            const res = await apiRoute.post(`/recovery/updateInformation/${admission_no}`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            alert('Demographic Information Form updated successfully!');
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
            handleClose(true);
        } catch (err) {
            console.error(err);
            alert('Update failed.');
        }
    };

    const handleCheifUpdate = async (e, admission_no) => {
        e.preventDefault();
        try {
            const res = await apiRoute.post(`/recovery/updateCheifComplaint/${admission_no}`, chiefData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            alert('Cheif Complaint Form updated successfully!');
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
            handleChiefClose(true);
        } catch (err) {
            console.error(err);
            alert('Update failed.');
        }
    }

    const handlePresentingUpdate = async (e, admission_no) => {
        e.preventDefault();
        try {
            const res = await apiRoute.post(`/recovery/updatePresentingData/${admission_no}`, presentingData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            alert('Presenting Problems Form updated successfully!');
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
            handlePresentingClose(true);
        } catch (err) {
            console.error(err);
            alert('Update failed.');
        }
    }

    const handlePsyciatricUpdate = async (e, admission_no) => {
        e.preventDefault();
        try {
            const res = await apiRoute.post(`/recovery/updatePsychiatricData/${admission_no}`, psyHistoryData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            alert('Psychiatric History Form updated successfully!');
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
            handlePsychiatriClose(true);
        } catch (err) {
            console.error(err);
            alert('Update failed.');
        }
    }

    const handleMedicalUpdate = async (e, admission_no) => {
        e.preventDefault();
        try {
            const res = await apiRoute.post(`/recovery/updateMedicalHistory/${admission_no}`, medicalData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            alert('Medical History Form updated successfully!');
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
            handleMedicalClose(true);
        } catch (err) {
            console.error(err);
            alert('Update failed.');
        }
    }

    const handleFamilyUpdate = async (e, admission_no) => {
        e.preventDefault();
        try {
            const res = await apiRoute.post(`/recovery/updateFamilyHistory/${admission_no}`, familyData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            alert('Family History Form updated successfully!');
            setFamilyData({
                family_composition: [],
                family_dynamics: [],
                marriage_type: '',
                family_history: '',
                genetic_predisposition: '',
                family_changes: [],
                family_substance: ''
            })
            handleFamilyClose(true);
        } catch (err) {
            console.error(err);
            alert('Update failed.');
        }
    }

    const handleSocialUpdate = async (e, admission_no) => {
        e.preventDefault();
        try {
            const res = await apiRoute.post(`/recovery/updateSocialHistory/${admission_no}`, socialData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            alert('Social History Form updated successfully!');
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
                technology_related: '',
            })
            handleSocialClose(true);
        } catch (err) {
            console.error(err);
            alert('Update failed.');
        }
    }

    const handleSuicidalUpdate = async (e, admission_no) => {
        e.preventDefault();
        try {
            const res = await apiRoute.post(`/recovery/updateSuicidal/${admission_no}`, suicidalData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            alert('Suicidal and Homicidal Ideation Form updated successfully!');
            setSuicidalData({
                suicide_history: '',
                triggers_stressors: '',
                homicidal_ideation: '',
                target_method: '',
                immediate_threat: '',
                emergency_response: '',
                hospital_required: '',
            })
            handleSuicideClose(true);
        } catch (err) {
            console.error(err);
            alert('Update failed.');
        }
    }

    const handleDevelopmentalUpdate = async (e, admission_no) => {
        e.preventDefault();
        try {
            const res = await apiRoute.post(`/recovery/updateDevelopmentalHistory/${admission_no}`, developmentalData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            alert('Developmental History Form updated successfully!');
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
            handleDevelopmentalClose(true);
        } catch (err) {
            console.error(err);
            alert('Update failed.');
        }
    }

    const handleSubstanceUpdate = async (e, admission_no) => {
        e.preventDefault();
        try {
            const res = await apiRoute.post(`/recovery/updateSubstance/${admission_no}`, substanceData, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            alert('Substance Use History Form updated successfully!');
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
            handleSubstanceClose(true);
        } catch (err) {
            console.error(err);
            alert('Update failed.');
        }
    }

    const ViewFormData = async () => {
        if (!admission_no.trim()) {
            alert("Please enter admission number.");
            return;
        }

        try {
            const response = await apiRoute.get(`/recovery/getallPsychiatric/${admission_no}`);
            console.log("Fetched data from API:", response.data);

            const fetchedData = response.data;

            if (!fetchedData || typeof fetchedData !== "object") {
                alert("Invalid or missing data from server.");
                return;
            }

            // ✅ Set all necessary form states
            if (fetchedData.basic_detail) {
                setFormData({
                    ...fetchedData.basic_detail,
                    patient_name: fetchedData.basic_detail.patient_name || '',
                    patient_age: fetchedData.basic_detail.patient_age || '',
                    patient_gender: fetchedData.basic_detail.patient_gender || '',
                    sexual_orientation: fetchedData.basic_detail.sexual_orientation || '',
                    education_bg: fetchedData.basic_detail.education_bg || '',
                    occupation: fetchedData.basic_detail.occupation || '',
                    marital_status: fetchedData.basic_detail.marital_status || '',
                    economic_status: fetchedData.basic_detail.economic_status || '',
                    religion: fetchedData.basic_detail.religion || '',
                    informant: fetchedData.basic_detail.informant || '',
                    residential_address: fetchedData.basic_detail.residential_address || '',
                    living_arrangements: fetchedData.basic_detail.living_arrangements || '',
                    family_structure: fetchedData.basic_detail.family_structure || '',
                    cultural_identity: fetchedData.basic_detail.cultural_identity || '',
                    language1: fetchedData.basic_detail.language1 || '',
                    language2: fetchedData.basic_detail.language2 || '',
                });
            }

            if (fetchedData.cheif_complaint) {
                setChiefData({
                    ...fetchedData.cheif_complaint,
                    chief_complaint: fetchedData.cheif_complaint.chief_complaint || '',
                    onset_duration: fetchedData.cheif_complaint.onset_duration || '',
                    nature_symptoms: fetchedData.cheif_complaint.nature_symptoms || '',
                    severity: fetchedData.cheif_complaint.severity || '',
                    course_type: fetchedData.cheif_complaint.course_type || '',
                    nature_illness: fetchedData.cheif_complaint.nature_illness || '',
                    identify_trigger: fetchedData.cheif_complaint.identify_trigger || '',
                    life_changes: fetchedData.cheif_complaint.life_changes || '',
                    biological: fetchedData.cheif_complaint.biological || '',
                    psychological: fetchedData.cheif_complaint.psychological || '',
                    social_environment: fetchedData.cheif_complaint.social_environment || '',
                });
            }

            if (fetchedData.presenting_problems) {
                setPresentingData({
                    ...fetchedData.presenting_problems,
                    history_presenting: fetchedData.presenting_problems.history_presenting || '',
                    mood_affect: fetchedData.presenting_problems.mood_affect?.split(',') || [],
                    though_content: fetchedData.presenting_problems.though_content?.split(',') || [],
                    though_process: fetchedData.presenting_problems.though_process?.split(',') || [],
                    perception: fetchedData.presenting_problems.perception?.split(',') || [],
                    behavioural_changes: fetchedData.presenting_problems.behavioural_changes?.split(',') || [],
                    sleep_patterns: fetchedData.presenting_problems.sleep_patterns?.split(',') || [],
                    energy_level: fetchedData.presenting_problems.energy_level || '',
                    appetite_weight: fetchedData.presenting_problems.appetite_weight || '',
                    occupation_academic: fetchedData.presenting_problems.occupation_academic || '',
                    interpersonal_relationship: fetchedData.presenting_problems.interpersonal_relationship || '',
                    selfCare_activity: fetchedData.presenting_problems.selfCare_activity || '',
                    recreation_activity: fetchedData.presenting_problems.recreation_activity || '',
                });
            }

            if (fetchedData.psy_history) {
                setPsyHistoryData({
                    ...fetchedData.psy_history,
                    psychiatric_diagnoses: fetchedData.psy_history.psychiatric_diagnoses || '',
                    treatment_history: fetchedData.psy_history.treatment_history || '',
                    medications: fetchedData.psy_history.medications || '',
                    dosage: fetchedData.psy_history.dosage || '',
                    adherence: fetchedData.psy_history.adherence || '',
                    sideEffect: fetchedData.psy_history.sideEffect || '',
                    experience_reaction: fetchedData.psy_history.experience_reaction || '',
                    hospitalisation_reason: fetchedData.psy_history.hospitalisation_reason || '',
                    duration: fetchedData.psy_history.duration || '',
                    crisis_episodes: fetchedData.psy_history.crisis_episodes || '',
                    fm_mentalHealth: fetchedData.psy_history.fm_mentalHealth || '',
                    significant_life: fetchedData.psy_history.significant_life || '',
                    chronic_stressors: fetchedData.psy_history.chronic_stressors || '',
                    trauma_exploration: fetchedData.psy_history.trauma_exploration?.split(',') || [],
                    legal_environment: fetchedData.psy_history.legal_environment?.split(',') || [],
                });
            }

            if (fetchedData.medical_history) {
                setMedicalData({
                    ...fetchedData.medical_history,
                    disability_status: fetchedData.medical_history.disability_status,
                    chronic_medical: fetchedData.medical_history.chronic_medical,
                    acute_health: fetchedData.medical_history.acute_health,
                    medication: fetchedData.medical_history.medication,
                    medication_allergies: fetchedData.medical_history.medication_allergies,
                    other_allergy: fetchedData.medical_history.other_allergy?.split(',') || [],
                    significant_medical: fetchedData.medical_history.significant_medical?.split(',') || [],
                    traumatic_injuries: fetchedData.medical_history.traumatic_injuries,
                    sexual_health: fetchedData.medical_history.sexual_health?.split(',') || [],
                });
            }

            if (fetchedData.familyhis_data) {
                setFamilyData({
                    ...fetchedData.familyhis_data,
                    family_composition: fetchedData.familyhis_data.family_composition?.split(',') || [],
                    family_dynamics: fetchedData.familyhis_data.family_dynamics?.split(',') || [],
                    marriage_type: fetchedData.familyhis_data.marriage_type,
                    family_history: fetchedData.familyhis_data.family_history,
                    genetic_predisposition: fetchedData.familyhis_data.genetic_predisposition,
                    family_changes: fetchedData.familyhis_data.family_changes?.split(',') || [],
                    family_substance: fetchedData.familyhis_data.family_substance,
                });
            }

            if (fetchedData.social_history) {
                setSocialData({
                    ...fetchedData.social_history,
                    family_relationship: fetchedData.social_history.family_relationship,
                    socialCircle_relationship: fetchedData.social_history.socialCircle_relationship,
                    relationship_significant: fetchedData.social_history.relationship_significant,
                    living_arrangements: fetchedData.social_history.living_arrangements,
                    education_bg: fetchedData.social_history.education_bg,
                    currentEmp_status: fetchedData.social_history.currentEmp_status,
                    socialRecreation_activity: fetchedData.social_history.socialRecreation_activity,
                    social_outlets: fetchedData.social_history.social_outlets,
                    socialMed_engagement: fetchedData.social_history.socialMed_engagement,
                    technology_related: fetchedData.social_history.technology_related,
                });
            }

            if (fetchedData.development_history) {
                setDeveleopmentData({
                    ...fetchedData.development_history,
                    prenatal_factors: fetchedData.development_history.prenatal_factors,
                    birth_details: fetchedData.development_history.birth_details,
                    birth_order: fetchedData.development_history.birth_order,
                    siblings_number: fetchedData.development_history.siblings_number,
                    bonding_attachment: fetchedData.development_history.bonding_attachment,
                    milestones_development: fetchedData.development_history.milestones_development,
                    childhood_illness: fetchedData.development_history.childhood_illness,
                    siblings_relationship: fetchedData.development_history.siblings_relationship,
                    parenting_style: fetchedData.development_history.parenting_style,
                    learning_challenge: fetchedData.development_history.learning_challenge,
                    pubertal_development: fetchedData.development_history.pubertal_development,
                });
            }

            if (fetchedData.substance_use) {
                setSubstanceData({
                    ...fetchedData.substance_use,
                    substance_use: fetchedData.substance_use.substance_use,
                    age_onset: fetchedData.substance_use.age_onset,
                    frequency: fetchedData.substance_use.frequency,
                    quantity: fetchedData.substance_use.quantity,
                    motivation_use: fetchedData.substance_use.motivation_use,
                    environmental_trigger: fetchedData.substance_use.environmental_trigger,
                    impact_occupation: fetchedData.substance_use.impact_occupation,
                    impact_interpersonal: fetchedData.substance_use.impact_interpersonal,
                    financial_consequences: fetchedData.substance_use.financial_consequences,
                    craving_intensity: fetchedData.substance_use.craving_intensity,
                    previous_treatment: fetchedData.substance_use.previous_treatment,
                    relapse_history: fetchedData.substance_use.relapse_history,
                });
            }

            if (fetchedData.suicidal_data) {
                setSuicidalData({
                    ...fetchedData.suicidal_data,
                    suicide_history: fetchedData.suicidal_data.suicide_history,
                    triggers_stressors: fetchedData.suicidal_data.triggers_stressors,
                    homicidal_ideation: fetchedData.suicidal_data.homicidal_ideation,
                    target_method: fetchedData.suicidal_data.target_method,
                    immediate_threat: fetchedData.suicidal_data.immediate_threat,
                    emergency_response: fetchedData.suicidal_data.emergency_response,
                    hospital_required: fetchedData.suicidal_data.hospital_required
                });
            }

            // ✅ Now trigger PDF generation
            setShouldGeneratePDF(true);

        } catch (error) {
            console.error("Error fetching or downloading:", error);
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
                <div className="text-center col-md-8"><h3 className="section_title">Psychiatric Case History</h3></div>

                <div className="d-flex align-items-center px-3 justify-content-center">

                    <Col md={2} className='d-flex flex-column align-items-end'>
                        {error && <div className="text-danger mt-2">{error}</div>}
                        {/* Rescue Name and Image */}
                        {rescueImage && (
                            <div>
                                <img
                                    alt={rescueName || "Rescue Image"}
                                    style={{ width: "100px", height: "120px" }}
                                    src={rescueImage}
                                />
                                {rescueName && <h6 className="mb-2">{rescueName}</h6>}
                            </div>
                        )}
                    </Col>
                </div>
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
                        <button type="button" className="btn btn-secondary mx-1" onClick={() => {
                            if (!admission_no.trim()) {
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

                                <input type="radio" name="pcss3t" id="tab11" className="tab-content-last" onClick={handleNavigateMSE} />
                                <label htmlFor="tab11">MSE</label>


                                <ul>
                                    {/* Basic details START*/}
                                    <li className="tab-content tab-content-first typography">
                                        <div className="update_class d-flex align-items-center justify-content-center">
                                            <h1>DEMOGRAPHIC INFORMATION</h1>
                                            {userType === "4" && (
                                                <button type="button" className="btn btn-success mx-3" onClick={handleShow}>
                                                    <FontAwesomeIcon icon={faEdit} className="me-0" /></button>
                                            )}
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
                                            {/* <Col md={2} className='d-flex flex-column align-items-end'>
                                                {error && <div className="text-danger mt-2">{error}</div>}
                                                {rescueImage && (
                                                    <div>
                                                        <img
                                                            alt={rescueName || "Rescue Image"}
                                                            style={{ width: "100px", height: "120px" }}
                                                            src={rescueImage}
                                                        />
                                                        {rescueName && <h6 className="mb-2">{rescueName}</h6>}
                                                    </div>
                                                )}
                                            </Col> */}
                                        </Row>


                                    </li>
                                    {/* Basic details END*/}

                                    {/* Clinical History START*/}
                                    <li className="tab-content tab-content-2 typography">
                                        <div className="update_class d-flex align-items-center justify-content-center">
                                            <h1>THE CHIEF COMPLAINT</h1>
                                            {userType === "4" && (
                                                <button type="button" className="btn btn-success mx-3" onClick={handleCheifComplaintShow}>
                                                    <FontAwesomeIcon icon={faEdit} className="me-0" /></button>
                                            )}
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
                                            {userType === "4" && (
                                                <button type="button" className="btn btn-success mx-3" onClick={handlePresentingShow}>
                                                    <FontAwesomeIcon icon={faEdit} className="me-0" /></button>
                                            )}
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
                                            {userType === "4" && (
                                                <button type="button" className="btn btn-success mx-3" onClick={handlePsychiatricShow}>
                                                    <FontAwesomeIcon icon={faEdit} className="me-0" /></button>
                                            )}
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
                                            {userType === "4" && (
                                                <button type="button" className="btn btn-success mx-3" onClick={handleMedicalShow}>
                                                    <FontAwesomeIcon icon={faEdit} className="me-0" /></button>
                                            )}
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
                                            {userType === "4" && (
                                                <button type="button" className="btn btn-success mx-3" onClick={handleFamilyShow}>
                                                    <FontAwesomeIcon icon={faEdit} className="me-0" /></button>
                                            )}
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
                                            {userType === "4" && (
                                                <button type="button" className="btn btn-success mx-3" onClick={handleSocialShow}>
                                                    <FontAwesomeIcon icon={faEdit} className="me-0" /></button>
                                            )}
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
                                            {userType === "4" && (
                                                <button type="button" className="btn btn-success mx-3" onClick={handleDevelopmentalShow}>
                                                    <FontAwesomeIcon icon={faEdit} className="me-0" /></button>
                                            )}
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
                                            {userType === "4" && (
                                                <button type="button" className="btn btn-success mx-3" onClick={handleSubstanceShow}>
                                                    <FontAwesomeIcon icon={faEdit} className="me-0" /></button>
                                            )}
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
                                            {userType === "4" && (
                                                <button type="button" className="btn btn-success mx-3" onClick={handleSuicidalShow}>
                                                    <FontAwesomeIcon icon={faEdit} className="me-0" /></button>
                                            )}
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

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Demographic Information</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Col md={12}>
                        <Form>
                            <Form.Group as={Row} className="mb-2 text-start d-flex align-items-center justify-content-center" >
                                <Form.Label column sm="4">Name: </Form.Label>
                                <Col sm="8">
                                    <Form.Control type='text'
                                        name='patient_name'
                                        value={formData.patient_name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-2 text-start d-flex align-items-center justify-content-center" >
                                <Form.Label column sm="4">Age: </Form.Label>
                                <Col sm="8">
                                    <Form.Control type='text'
                                        name='patient_age'
                                        value={formData.patient_age}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-2 text-start d-flex align-items-center justify-content-center" >
                                <Form.Label column sm="4">Gender: </Form.Label>
                                <Col sm="8">
                                    <Form.Control type='text'
                                        name='patient_gender'
                                        value={formData.patient_gender}
                                        onChange={handleInputChange}
                                        readOnly
                                    />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-2 text-start d-flex align-items-center justify-content-center" >
                                <Form.Label column sm="4">Sexual Orientation:</Form.Label>
                                <Col sm="8">
                                    <Form.Control type='text'
                                        name='sexual_orientation'
                                        value={formData.sexual_orientation}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-2 text-start d-flex align-items-center justify-content-center" >
                                <Form.Label column sm="4">Educational Background: </Form.Label>
                                <Col sm="8">
                                    <Form.Control type='text'
                                        name='education_bg'
                                        value={formData.education_bg}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-2 text-start d-flex align-items-center justify-content-center" >
                                <Form.Label column sm="4">Occupation and Employment Status: </Form.Label>
                                <Col sm="8">
                                    <Form.Control type='text'
                                        name='occupation'
                                        value={formData.occupation}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-2 text-start d-flex align-items-center justify-content-center" >
                                <Form.Label column sm="4">Marital Status: </Form.Label>
                                <Col sm="8">
                                    <Form.Control type='text'
                                        name='marital_status'
                                        value={formData.marital_status}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-2 text-start d-flex align-items-center justify-content-center" >
                                <Form.Label column sm="4">Socio Economic Status: </Form.Label>
                                <Col sm="8">
                                    <Form.Control type='text'
                                        name='economic_status'
                                        value={formData.economic_status}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-2 text-start d-flex align-items-center justify-content-center" >
                                <Form.Label column sm="4">Religion: </Form.Label>
                                <Col sm="8">
                                    <Form.Control type="text"
                                        name='religion'
                                        value={formData.religion}
                                        onChange={handleInputChange}
                                        required />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-2 text-start d-flex align-items-center justify-content-center" >
                                <Form.Label column sm="4">Informant: </Form.Label>
                                <Col sm="8">
                                    <Form.Control type="text"
                                        name='informant'
                                        value={formData.informant}
                                        onChange={handleInputChange}
                                        required />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-2 text-start d-flex align-items-center justify-content-center" >
                                <Form.Label column sm="4">Residential Address (current address):  </Form.Label>
                                <Col sm="8">
                                    <Form.Control type="text"
                                        name='residential_address'
                                        value={formData.residential_address}
                                        onChange={handleInputChange}
                                        required />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-2 text-start d-flex align-items-center justify-content-center" >
                                <Form.Label column sm="4">Living Arrangements: </Form.Label>
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

                            <Form.Group as={Row} className="mb-2 text-start d-flex align-items-center justify-content-center" >
                                <Form.Label column sm="4">Family Structure: </Form.Label>
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

                            <Form.Group as={Row} className="mb-2 text-start d-flex align-items-center justify-content-center" >
                                <Form.Label column sm="4">Cultural Identity:  </Form.Label>
                                <Col sm="8">
                                    <Form.Control type="text"
                                        name='cultural_identity'
                                        value={formData.cultural_identity}
                                        onChange={handleInputChange}
                                        required />
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row} className="mb-2 text-start d-flex align-items-center justify-content-center" >
                                <Form.Label column sm="4">Language Preferences:  </Form.Label>
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

                            <div className="mt-3">
                                <Button variant="success" className="m-1" type="submit" onClick={(e) => handleUpdate(e, formData.admission_no)}>Update</Button>
                                <Button variant="secondary" className="m-1" onClick={handleClose}>Close</Button>
                            </div>

                        </Form>
                    </Col>
                </Modal.Body>
            </Modal>

            <Modal show={cheifShow} onHide={handleChiefClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Cheif Complaint</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <li className='icon-li'>
                            <h5>The Chief Complaint:</h5>
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
                            <Form.Label column sm="4">Onset and Duration:  </Form.Label>
                            <Col sm="8">
                                <Form.Control type="text"
                                    name='onset_duration'
                                    value={chiefData.onset_duration}
                                    onChange={handleInputChange1}
                                    required />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-2 text-start" >
                            <Form.Label column sm="4">Nature of Symptoms:  </Form.Label>
                            <Col sm="8">
                                <Form.Control type="text"
                                    name='nature_symptoms'
                                    value={chiefData.nature_symptoms}
                                    onChange={handleInputChange1}
                                    required />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-2 text-start" >
                            <Form.Label column sm="4">Severity:  </Form.Label>
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
                            <Form.Label column sm="4">Course Type:  </Form.Label>
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
                            <Form.Label column sm="4">Nature of Illness:  </Form.Label>
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
                            <h5>Precipitating Factors:</h5>
                        </li>

                        <Form.Group as={Row} className="mb-2 text-start" >
                            <Form.Label column sm="4">Identify Triggers:  </Form.Label>
                            <Col sm="8">
                                <Form.Control type="text"
                                    name='identify_trigger'
                                    value={chiefData.identify_trigger}
                                    onChange={handleInputChange1}
                                    required />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-2 text-start" >
                            <Form.Label column sm="4">Life Changes and Stressors:  </Form.Label>
                            <Col sm="8">
                                <Form.Control type="text"
                                    name='life_changes'
                                    value={chiefData.life_changes}
                                    onChange={handleInputChange1}
                                    required />
                            </Col>
                        </Form.Group>

                        <li className='icon-li'>
                            <h5>Predisposing Factors:</h5>
                        </li>

                        <Form.Group as={Row} className="mb-2 text-start" >
                            <Form.Label column sm="4">Biological:  </Form.Label>
                            <Col sm="8">
                                <Form.Control type="text"
                                    name='biological'
                                    value={chiefData.biological}
                                    onChange={handleInputChange1}
                                    required />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-2 text-start" >
                            <Form.Label column sm="4">Psychological:  </Form.Label>
                            <Col sm="8">
                                <Form.Control type="text"
                                    name='psychological'
                                    value={chiefData.psychological}
                                    onChange={handleInputChange1}
                                    required />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-2 text-start" >
                            <Form.Label column sm="4">Social / Environmental:  </Form.Label>
                            <Col sm="8">
                                <Form.Control type="text"
                                    name='social_environment'
                                    value={chiefData.social_environment}
                                    onChange={handleInputChange1}
                                    required />
                            </Col>
                        </Form.Group>
                        <div className="mt-3">
                            <Button variant="success" className="m-1" type="submit" onClick={(e) => handleCheifUpdate(e, chiefData.admission_no)}>Update</Button>
                            <Button variant="secondary" className="m-1" onClick={handleChiefClose}>Close</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={presentingShow} onHide={handlePresentingClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Presenting Problems</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <li className='icon-li'>
                            <h4>Introduction to Presenting Problems:</h4>
                        </li>
                        <Form.Group className="mb-3" >
                            <Form.Label>History of Presenting Illness: </Form.Label>
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
                            <Form.Label>a.	Mood and Affect: </Form.Label>
                            <div className="d-flex flex-wrap gap-3 mt-2">
                                {[
                                    ["Predominant mood", "Predominant mood"],
                                    ["Appropriateness of Affect", "Appropriateness of Affect"],

                                ].map(([id, label]) => renderCheckbox("mood_affect", id, label))}
                            </div>
                        </Form.Group>

                        <Form.Group as={Row} className="mb-3">
                            <Form.Label>b.	Thought Content: </Form.Label>
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
                            <Form.Label>c.	Thought Process: </Form.Label>
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
                            <Form.Label>d.	Perceptions: </Form.Label>
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
                            <Form.Label>e.	Behavioural Changes: </Form.Label>
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
                            <Form.Label>f.	Sleep Patterns: </Form.Label>
                            <div className="d-flex flex-wrap gap-3 mt-2">
                                {[
                                    ["Difficulties falling asleep", "Difficulties falling asleep"],
                                    ["Staying asleep", "Staying asleep"],
                                    ["Experiencing Nightmares", "Experiencing Nightmares"]

                                ].map(([id, label]) => renderCheckbox("sleep_patterns", id, label))}
                            </div>
                        </Form.Group>

                        <Form.Group className="mb-3" >
                            <Form.Label>Appetite and Weight Changes: </Form.Label>
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
                            <Form.Label>Energy Level: </Form.Label>
                            <Form.Control as="textarea" rows={2}
                                name='energy_level'
                                value={presentingData.energy_level}
                                onChange={handleInputChange2}
                                required />
                        </Form.Group>

                        <li className='icon-li'>
                            <h4>Impact on Daily Functioning:</h4>
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
                            <Form.Label>Interpersonal Relationships: </Form.Label>
                            <Form.Control as="textarea" rows={2}
                                name='interpersonal_relationship'
                                value={presentingData.interpersonal_relationship}
                                onChange={handleInputChange2}
                                required />
                        </Form.Group>

                        <Form.Group className="mb-3" >
                            <Form.Label>Self-Care and Activities of Daily Living: </Form.Label>
                            <Form.Control as="textarea" rows={2}
                                name='selfCare_activity'
                                value={presentingData.selfCare_activity}
                                onChange={handleInputChange2}
                                required />
                        </Form.Group>

                        <Form.Group className="mb-3" >
                            <Form.Label>Recreational Activities: </Form.Label>
                            <Form.Control as="textarea" rows={2}
                                name='recreation_activity'
                                value={presentingData.recreation_activity}
                                onChange={handleInputChange2}
                                required />
                        </Form.Group>

                        <div className="mt-3">
                            <Button variant="success" className="m-1" type="submit" onClick={(e) => handlePresentingUpdate(e, presentingData.admission_no)}>Update</Button>
                            <Button variant="secondary" className="m-1" onClick={handlePresentingClose}>Close</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={psychiatricShow} onHide={handlePsychiatriClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Psychiatric History</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form className='mt-4' onSubmit={handlePsyHistorySubmit}>
                        <li className='icon-li'>
                            <h5>Previous Psychiatric Diagnoses:</h5>
                        </li>
                        <Form.Group className="mb-3" >
                            <Form.Control as="textarea" rows={2}
                                name='psychiatric_diagnoses'
                                value={psyHistoryData.psychiatric_diagnoses}
                                onChange={handleInputChange3}
                                required />
                        </Form.Group>
                        <li className='icon-li'>
                            <h5>Treatment History:</h5>
                        </li>
                        <Form.Group className="mb-3" >
                            <Form.Control as="textarea" rows={2}
                                name='treatment_history'
                                value={psyHistoryData.treatment_history}
                                onChange={handleInputChange3}
                                required />
                        </Form.Group>

                        <li className='icon-li'>
                            <h5>Medication History:</h5>
                        </li>
                        <Row>
                            <Col md={4}>
                                <Form.Group className="mb-3" >
                                    <Form.Label>Medications:  </Form.Label>
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
                                    <Form.Label>Dosage:  </Form.Label>
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
                                    <Form.Label>Adherence:  </Form.Label>
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
                                    <Form.Label>Any side effects :  </Form.Label>
                                    <Form.Control
                                        name='sideEffect'
                                        type='text'
                                        value={psyHistoryData.sideEffect}
                                        onChange={handleInputChange3}
                                        required />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3" >
                                    <Form.Label>Experienced Reactions :  </Form.Label>
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
                            <h5>Psychiatric Hospitalizations:</h5>
                        </li>
                        <Row>
                            <Col md={4}>
                                <Form.Label>Reasons</Form.Label>
                                <Form.Control as="textarea" rows={1}
                                    name='hospitalisation_reason'
                                    value={psyHistoryData.hospitalisation_reason}
                                    onChange={handleInputChange3}
                                    required />
                            </Col>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Label>Duration and the Outcomes</Form.Label>
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
                            <h5>Crisis Episodes:</h5>
                        </li>
                        <Form.Group className="mb-3" >
                            <Form.Control as="textarea" rows={2}
                                name='crisis_episodes'
                                value={psyHistoryData.crisis_episodes}
                                onChange={handleInputChange3}
                                required />
                        </Form.Group>

                        <li className='icon-li'>
                            <h5>Family Members with Mental Health Diagnoses:</h5>
                        </li>
                        <Form.Group className="mb-3" >
                            <Form.Control as="textarea" rows={2}
                                name='fm_mentalHealth'
                                value={psyHistoryData.fm_mentalHealth}
                                onChange={handleInputChange3}
                                required />
                        </Form.Group>

                        <li className='icon-li'>
                            <h5>Significant Life Events and Stressors:</h5>
                        </li>
                        <Form.Group className="mb-3" >
                            <Form.Control as="textarea" rows={2}
                                name='significant_life'
                                value={psyHistoryData.significant_life}
                                onChange={handleInputChange3}
                                required />
                        </Form.Group>

                        <li className='icon-li'>
                            <h5>Chronic Stressors:</h5>
                        </li>
                        <Form.Group className="mb-3" >
                            <Form.Control as="textarea" rows={2}
                                name='chronic_stressors'
                                value={psyHistoryData.chronic_stressors}
                                onChange={handleInputChange3}
                                required />
                        </Form.Group>

                        <li className='icon-li'>
                            <h5>Exploration of Trauma:</h5>
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
                            <h5>Legal Involvement:</h5>
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

                        <div className="mt-3">
                            <Button variant="success" className="m-1" type="submit" onClick={(e) => handlePsyciatricUpdate(e, psyHistoryData.admission_no)}>Update</Button>
                            <Button variant="secondary" className="m-1" onClick={handlePsychiatriClose}>Close</Button>
                        </div>

                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={medicalShow} onHide={handleMedicalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Medical History</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <li className='icon-li'>
                            <h6>Disability Status (Physical or Psychological):</h6>
                        </li>
                        <Form.Group>
                            <Form.Control as="textarea" rows={2}
                                name='disability_status'
                                value={medicalData.disability_status}
                                onChange={handleInputChange4}
                                required />
                        </Form.Group>

                        <li className='icon-li'>
                            <h6>Chronic Medical Conditions:</h6>
                        </li>
                        <Form.Group>
                            <Form.Control as="textarea" rows={2}
                                name='chronic_medical'
                                value={medicalData.chronic_medical}
                                onChange={handleInputChange4}
                                required />
                        </Form.Group>

                        <li className='icon-li'>
                            <h6>Acute Health Concerns:</h6>
                        </li>
                        <Form.Group>
                            <Form.Control as="textarea" rows={2}
                                name='acute_health'
                                value={medicalData.acute_health}
                                onChange={handleInputChange4}
                                required />
                        </Form.Group>

                        <li className='icon-li'>
                            <h6>Medication (Duration and Outcomes):</h6>
                        </li>
                        <Form.Group>
                            <Form.Control as="textarea" rows={2}
                                name='medication'
                                value={medicalData.medication}
                                onChange={handleInputChange4}
                                required />
                        </Form.Group>

                        <li className='icon-li'>
                            <h6>Medication Allergies:</h6>
                        </li>
                        <Form.Group>
                            <Form.Control as="textarea" rows={2}
                                name='medication_allergies'
                                value={medicalData.medication_allergies}
                                onChange={handleInputChange4}
                                required />
                        </Form.Group>

                        <li className='icon-li'>
                            <h6>Other Allergies or Sensitivities: </h6>
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
                            <h6>Significant Medical Events: </h6>
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
                            <h6>Traumatic Injuries: </h6>
                        </li>
                        <Form.Group>
                            <Form.Control as="textarea" rows={2}
                                name='traumatic_injuries'
                                value={medicalData.traumatic_injuries}
                                onChange={handleInputChange4}
                                required />
                        </Form.Group>

                        <li className='icon-li'>
                            <h6>Sexual Health: </h6>
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
                        <div className="mt-3">
                            <Button variant="success" className="m-1" type="submit" onClick={(e) => handleMedicalUpdate(e, medicalData.admission_no)}>Update</Button>
                            <Button variant="secondary" className="m-1" onClick={handleMedicalClose}>Close</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={familyShow} onHide={handleFamilyClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Family History</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <li className='icon-li'>
                            <h5>Family Composition:</h5>
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
                            <h5>Family Dynamics:</h5>
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
                            <h5>Type of Marriage: </h5>
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
                            <h5>Family History of Psychiatric Disorders: <span>(any hereditary conditions)</span></h5>
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
                            <h5>Genetic Predispositions: <span>(genetic conditions or predispositions)</span></h5>
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
                            <h5>Family Changes or Transitions: </h5>
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
                            <h5>Substance Use within the Family</h5>
                        </li>
                        <Form.Group>
                            <Form.Control
                                type='text'
                                name='family_substance'
                                value={familyData.family_substance}
                                onChange={handleInputChange5}
                                required />
                        </Form.Group>
                        <div className="mt-3">
                            <Button variant="success" className="m-1" type="submit" onClick={(e) => handleFamilyUpdate(e, familyData.admission_no)}>Update</Button>
                            <Button variant="secondary" className="m-1" onClick={handleFamilyClose}>Close</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={socialShow} onHide={handleSocialClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Social History</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <li className='icon-li'>
                            <h6>Relationship with Family:</h6>
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
                            <h6>Relationship with Friends and Social Circles:</h6>
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
                            <h6>Relationship with Significant Others:</h6>
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
                            <h6>Current Living Arrangements:</h6>
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
                            <h6>Educational Background :</h6>
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
                            <h6>Current Employment Status :</h6>
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
                            <h6>Recreational Activities :</h6>
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
                            <h6>Social Outlets :</h6>
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
                            <h6>Social Media Engagement :</h6>
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
                            <h6>Technology-related Stressors :</h6>
                        </li>
                        <Form.Group>
                            <Form.Control
                                type='text'
                                name='technology_related'
                                value={socialData.technology_related}
                                onChange={handleInputChange6}
                                required />
                        </Form.Group>
                        <div className="mt-3">
                            <Button variant="success" className="m-1" type="submit" onClick={(e) => handleSocialUpdate(e, socialData.admission_no)}>Update</Button>
                            <Button variant="secondary" className="m-1" onClick={handleSocialClose}>Close</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={developmentalShow} onHide={handleDevelopmentalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Developmental History</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <li className='icon-li'>
                            <h5>Prenatal Factors:</h5>
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
                            <h5>Birth Details:</h5>
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
                            <h5>Birth Order:</h5>
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
                            <h5>Number of Siblings:</h5>
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
                            <h5>Attachment and Bonding:</h5>
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
                            <h5>Developmental Milestones:</h5>
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
                            <h5>Childhood Illnesses and Injuries:</h5>
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
                            <h5>Siblings and Relationships:</h5>
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
                            <h5>Parenting Styles:</h5>
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
                            <h5>Learning Challenges:</h5>
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
                            <h5>Pubertal Development:</h5>
                        </li>
                        <Form.Group>
                            <Form.Control
                                type='text'
                                name='pubertal_development'
                                value={developmentalData.pubertal_development}
                                onChange={handleInputChange7}
                                required />
                        </Form.Group>
                        <div className="mt-3">
                            <Button variant="success" className="m-1" type="submit" onClick={(e) => handleDevelopmentalUpdate(e, developmentalData.admission_no)}>Update</Button>
                            <Button variant="secondary" className="m-1" onClick={handleDevelopmentalClose}>Close</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={substanceShow} onHide={handleSubstanceClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Substance Use History</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <li className='icon-li'>
                            <h5>Types of Substances Used:</h5>
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
                            <h5>Age of Onset :</h5>
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
                            <h5>Frequency :</h5>
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
                            <h5>Quantity :</h5>
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
                            <h5>Motivations for Use :</h5>
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
                            <h5>Environmental Triggers :</h5>
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
                            <h5>Impact on Occupational or Academic Functioning :</h5>
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
                            <h5>Impact on Interpersonal Relationships :</h5>
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
                            <h5>Legal or Financial Consequences :</h5>
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
                            <h5>Craving intensity :</h5>
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
                            <h5>Previous Treatment Attempts :</h5>
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
                            <h5>Relapse History :</h5>
                        </li>
                        <Form.Group>
                            <Form.Control
                                type='text'
                                name='relapse_history'
                                value={substanceData.relapse_history}
                                onChange={handleInputChange8}
                                required />
                        </Form.Group>
                        <div className="mt-3">
                            <Button variant="success" className="m-1" type="submit" onClick={(e) => handleSubstanceUpdate(e, substanceData.admission_no)}>Update</Button>
                            <Button variant="secondary" className="m-1" onClick={handleSubstanceClose}>Close</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            <Modal show={suicidalShow} onHide={handleSuicideClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Suicidal and Homicidal Ideation</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <li className='icon-li'>
                            <h5>History of Suicide Attempts :</h5>
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
                            <h5>Triggers and Stressors:</h5>
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
                            <h5>History of Homicidal Ideation:</h5>
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
                            <h5>Target and Method:</h5>
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
                            <h5>Immediate Threat:</h5>
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
                            <h5>Necessity of Emergency Response:</h5>
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
                            <h5>Hospitalization Required:</h5>
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
                        <div className="mt-3">
                            <Button variant="success" className="m-1" type="submit" onClick={(e) => handleSuicidalUpdate(e, suicidalData.admission_no)}>Update</Button>
                            <Button variant="secondary" className="m-1" onClick={handleSuicideClose}>Close</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            <div ref={formRef} style={{ position: "absolute", left: "-9999px", top: 0, background: "#fff", padding: "20px", width: "210mm" }}>
                <Row className="d-flex align-items-center justify-content-center mb-2">
                    <Col md={2}>
                        <img src={manasu_logo} className="pdf_logo" alt="" />
                    </Col>
                    <Col md={10}>
                        <h4 className="text-center">Mental Status Examination (MSE)</h4>
                    </Col>
                </Row>

                <ul style={{ listStyleType: "none", textAlign: "start" }}>
                    <li className="tab-content my-3">
                        <h5 className='pdf_heading'><strong>DEMOGRAPHIC INFORMATION</strong></h5>
                        <ul style={{ listStyleType: "none", textAlign: "start" }}>
                            <li className='d-flex'>
                                <strong>Name : </strong>
                                <p className='mx-3'>{formData.patient_name}</p>
                            </li>
                            <li className='d-flex'>
                                <strong>Age : </strong>
                                <p className='mx-3'>{formData.patient_age}</p>
                            </li>
                            <li className='d-flex'>
                                <strong>Gender : </strong>
                                <p className='mx-3'>{formData.patient_gender}</p>
                            </li>
                            <li className='d-flex'>
                                <strong>Sexual Orientation : </strong>
                                <p className='mx-3'>{formData.sexual_orientation}</p>
                            </li>
                            <li className='d-flex'>
                                <strong>Educational Background : </strong>
                                <p className='mx-3'>{formData.education_bg}</p>
                            </li>
                            <li className='d-flex'>
                                <strong>Occupation and Employment Status : </strong>
                                <p className='mx-3'>{formData.occupation}</p>
                            </li>
                            <li className='d-flex'>
                                <strong>Marital Status : </strong>
                                <p className='mx-3'>{formData.marital_status}</p>
                            </li>
                            <li className='d-flex'>
                                <strong>Socio Economic Status : </strong>
                                <p className='mx-3'>{formData.economic_status}</p>
                            </li>
                            <li className='d-flex'>
                                <strong>Religion : </strong>
                                <p className='mx-3'>{formData.religion}</p>
                            </li>
                            <li className='d-flex'>
                                <strong>Informant : </strong>
                                <p className='mx-3'>{formData.informant}</p>
                            </li>
                            <li className='d-flex'>
                                <strong>Residential Address (current address) : </strong>
                                <p className='mx-3'>{formData.residential_address}</p>
                            </li>
                            <li className='d-flex'>
                                <strong>Living Arrangements : </strong>
                                <p className='mx-3'>{formData.living_arrangements}</p>
                            </li>
                            <li className='d-flex'>
                                <strong>Family Structure : </strong>
                                <p className='mx-3'>{formData.family_structure}</p>
                            </li>
                            <li className='d-flex'>
                                <strong>Cultural Identity : </strong>
                                <p className='mx-3'>{formData.cultural_identity}</p>
                            </li>
                            <li className='d-flex'>
                                <strong>Language Preferences : </strong>
                                <p className='mx-3'>{formData.language1}</p>,
                                <p className='mx-3'>{formData.language2}</p>
                            </li>
                        </ul>
                    </li>
                    <li className="tab-content my-3">
                        <h5 className='pdf_heading'><strong>THE CHIEF COMPLAINT</strong></h5>
                        <ul style={{ listStyleType: "none", textAlign: "start" }}>
                            <h5>The Chief Complaint:</h5>
                            <li className='d-flex'>
                                <strong>Chief Complaint :</strong>
                                <p className='mx-3'>{chiefData.chief_complaint}</p>
                            </li>
                            <li className='d-flex'>
                                <strong>Onset and Duration : </strong>
                                <p className='mx-3'>{chiefData.onset_duration}</p>
                            </li>
                            <li className='d-flex'>
                                <strong>Nature of Symptoms : </strong>
                                <p className='mx-3'>{chiefData.nature_symptoms}</p>
                            </li>
                            <li className='d-flex'>
                                <strong>Severity : </strong>
                                <p className='mx-3'>{chiefData.severity}</p>
                            </li>
                            <li className='d-flex'>
                                <strong>Course Type : </strong>
                                <p className='mx-3'>{chiefData.course_type}</p>
                            </li>
                            <li className='d-flex'>
                                <strong>Nature of Illness : </strong>
                                <p className='mx-3'>{chiefData.nature_illness}</p>
                            </li>
                            <h5>Precipitating Factors:</h5>
                            <li className='d-flex'>
                                <strong>Identify Triggers : </strong>
                                <p className='mx-3'>{chiefData.identify_trigger}</p>
                            </li>
                            <li className='d-flex'>
                                <strong>Life Changes and Stressors : </strong>
                                <p className='mx-3'>{chiefData.life_changes}</p>
                            </li>
                            <h5>Precipitating Factors:</h5>
                            <li className='d-flex'>
                                <strong>Biological : </strong>
                                <p className='mx-3'>{chiefData.biological}</p>
                            </li>
                            <li className='d-flex'>
                                <strong>Psychological : </strong>
                                <p className='mx-3'>{chiefData.psychological}</p>
                            </li>
                            <li className='d-flex'>
                                <strong>Social / Environmental : </strong>
                                <p className='mx-3'>{chiefData.social_environment}</p>
                            </li>
                        </ul>
                    </li>

                    <li className="tab-content my-3">
                        <h5 className='pdf_heading'><strong>PRESENTING PROBLEMS</strong></h5>
                        <ul style={{ listStyleType: "none", textAlign: "start" }}>
                            <h5>Introduction to Presenting Problems:</h5>

                            <li className='d-flex'>
                                <strong>History of Presenting Illness :</strong>
                                <p className='mx-3'>{presentingData.history_presenting}</p>
                            </li>
                            <h5>Detailed Exploration of Symptoms:</h5>

                            <li className='d-flex'>
                                <strong>a.	Mood and Affect:</strong>
                                <ul className='d-flex' style={{ listStyleType: "none" }}>
                                    {presentingData.mood_affect.map((item, idx) => (
                                        <li key={idx}>{item} ,</li>
                                    ))}
                                </ul>
                            </li>
                            <li className='d-flex'>
                                <strong>b.	Thought Content:</strong>
                                <ul className='d-flex' style={{ listStyleType: "none" }}>
                                    {presentingData.though_content.map((item, idx) => (
                                        <li key={idx}>{item} ,</li>
                                    ))}
                                </ul>
                            </li>
                            <li className='d-flex'>
                                <strong>c.	Thought Process:</strong>
                                <ul className='d-flex' style={{ listStyleType: "none" }}>
                                    {presentingData.though_process.map((item, idx) => (
                                        <li key={idx}>{item} ,</li>
                                    ))}
                                </ul>
                            </li>
                            <li className='d-flex'>
                                <strong>d.	Perceptions:</strong>
                                <ul className='d-flex' style={{ listStyleType: "none" }}>
                                    {presentingData.perception.map((item, idx) => (
                                        <li key={idx}>{item} ,</li>
                                    ))}
                                </ul>
                            </li>
                            <li className='d-flex'>
                                <strong>e.	Behavioural Changes:</strong>
                                <ul className='d-flex' style={{ listStyleType: "none" }}>
                                    {presentingData.behavioural_changes.map((item, idx) => (
                                        <li key={idx}>{item} ,</li>
                                    ))}
                                </ul>
                            </li>
                            <li className='d-flex'>
                                <strong>f.	Sleep Patterns:</strong>
                                <ul className='d-flex' style={{ listStyleType: "none" }}>
                                    {presentingData.sleep_patterns.map((item, idx) => (
                                        <li key={idx}>{item} ,</li>
                                    ))}
                                </ul>
                            </li>

                            <li className='d-flex'>
                                <strong>Appetite and Weight Changes : </strong>
                                <p className='mx-3'>{presentingData.appetite_weight}</p>
                            </li>
                            <li className='d-flex'>
                                <strong>Energy Level : </strong>
                                <p className='mx-3'>{presentingData.energy_level}</p>
                            </li>


                            <h5>Impact on Daily Functioning:</h5>

                            <li className='d-flex'>
                                <strong>Occupational or Academic Functioning : </strong>
                                <p className='mx-3'>{presentingData.occupation_academic}</p>
                            </li>
                            <li className='d-flex'>
                                <strong>Interpersonal Relationships : </strong>
                                <p className='mx-3'>{presentingData.interpersonal_relationship}</p>
                            </li>
                            <li className='d-flex'>
                                <strong>Self-Care and Activities of Daily Living : </strong>
                                <p className='mx-3'>{presentingData.selfCare_activity}</p>
                            </li>

                            <li className='d-flex'>
                                <strong>Recreational Activities : </strong>
                                <p className='mx-3'>{presentingData.recreation_activity}</p>
                            </li>

                        </ul>
                    </li>
                    <li className="tab-content my-3">
                        <h5 className='pdf_heading'><strong>PSYCHIATRIC HISTORY</strong></h5>
                        <ul style={{ listStyleType: "none", textAlign: "start" }}>

                            <li className='d-flex'>
                                <strong>Previous Psychiatric Diagnoses :</strong>
                                <p className='mx-3'>{psyHistoryData.psychiatric_diagnoses}</p>
                            </li>
                            <li className='d-flex'>
                                <strong>Treatment History : </strong>
                                <p className='mx-3'>{psyHistoryData.treatment_history}</p>
                            </li>
                            <h5>Medication History: </h5>
                            <li className='d-flex'>
                                <strong>Medications : </strong>
                                <p className='mx-3'>{psyHistoryData.medications}</p>
                            </li>
                            <li className='d-flex mt-5'>
                                <strong>Dosage : </strong>
                                <p className='mx-3'>{psyHistoryData.dosage}</p>
                            </li>
                            <li className='d-flex'>
                                <strong>Adherence : </strong>
                                <p className='mx-3'>{psyHistoryData.adherence}</p>
                            </li>
                            <li className='d-flex'>
                                <strong>Any side effects : </strong>
                                <p className='mx-3'>{psyHistoryData.sideEffect}</p>
                            </li>
                            <li className='d-flex'>
                                <strong>Experienced Reactions : </strong>
                                <p className='mx-3'>{psyHistoryData.experience_reaction}</p>
                            </li>
                            <h5>Psychiatric Hospitalizations: </h5>
                            <li className='d-flex'>
                                <strong>Reasons : </strong>
                                <p className='mx-3'>{psyHistoryData.experience_reaction}</p>
                            </li>
                            <li className='d-flex'>
                                <strong>Duration and the Outcomes : </strong>
                                <p className='mx-3'>{psyHistoryData.duration}</p>
                            </li>
                            <li className='d-flex'>
                                <strong>Crisis Episodes : </strong>
                                <p className='mx-3'>{psyHistoryData.crisis_episodes}</p>
                            </li>
                            <li className='d-flex'>
                                <strong>Family Members with Mental Health Diagnoses : </strong>
                                <p className='mx-3'>{psyHistoryData.fm_mentalHealth}</p>
                            </li>
                            <li className='d-flex'>
                                <strong>Significant Life Events and Stressors : </strong>
                                <p className='mx-3'>{psyHistoryData.significant_life}</p>
                            </li>
                            <li className='d-flex'>
                                <strong>Chronic Stressors : </strong>
                                <p className='mx-3'>{psyHistoryData.chronic_stressors}</p>
                            </li>
                            <li className='d-flex'>
                                <strong>Exploration of Trauma:</strong>
                                <ul className='d-flex' style={{ listStyleType: "none" }}>
                                    {psyHistoryData.trauma_exploration.map((item, idx) => (
                                        <li key={idx}>{item} ,</li>
                                    ))}
                                </ul>
                            </li>
                            <li className='d-flex'>
                                <strong>Legal Involvement:</strong>
                                <ul className='d-flex' style={{ listStyleType: "none" }}>
                                    {psyHistoryData.legal_environment.map((item, idx) => (
                                        <li key={idx}>{item} ,</li>
                                    ))}
                                </ul>
                            </li>
                        </ul>
                    </li>
                    <li className="tab-content my-3">
                        <h5 className='pdf_heading'><strong>MEDICAL HISTORY</strong></h5>
                        <ul style={{ listStyleType: "none", textAlign: "start" }}>
                            <li className='d-flex'>
                                <strong>Disability Status (Physical or Psychological) :</strong>
                                <p className='mx-3'>{medicalData.disability_status}</p>
                            </li>
                            <li className='d-flex'>
                                <strong>Chronic Medical Conditions :</strong>
                                <p className='mx-3'>{medicalData.chronic_medical}</p>
                            </li>
                            <li className='d-flex'>
                                <strong>Acute Health Concerns :</strong>
                                <p className='mx-3'>{medicalData.acute_health}</p>
                            </li>
                            <li className='d-flex'>
                                <strong>Medication (Duration and Outcomes) :</strong>
                                <p className='mx-3'>{medicalData.medication}</p>
                            </li>
                            <li className='d-flex'>
                                <strong>Medication Allergies :</strong>
                                <p className='mx-3'>{medicalData.medication_allergies}</p>
                            </li>
                            <li className='d-flex'>
                                <strong>Other Allergies or Sensitivities:</strong>
                                <ul className='d-flex' style={{ listStyleType: "none" }}>
                                    {medicalData.other_allergy.map((item, idx) => (
                                        <li key={idx}>{item} ,</li>
                                    ))}
                                </ul>
                            </li>
                            <li className='d-flex'>
                                <strong>Significant Medical Events:</strong>
                                <ul className='d-flex' style={{ listStyleType: "none" }}>
                                    {medicalData.significant_medical.map((item, idx) => (
                                        <li key={idx}>{item} ,</li>
                                    ))}
                                </ul>
                            </li>
                            <li className='d-flex'>
                                <strong>Traumatic Injuries :</strong>
                                <p className='mx-3'>{medicalData.traumatic_injuries}</p>
                            </li>
                            <li className='d-flex'>
                                <strong>Sexual Health:</strong>
                                <ul className='d-flex' style={{ listStyleType: "none" }}>
                                    {medicalData.significant_medical.map((item, idx) => (
                                        <li key={idx}>{item} ,</li>
                                    ))}
                                </ul>
                            </li>
                        </ul>
                    </li>
                    <li className="tab-content my-3">
                        <h5 className='pdf_heading'><strong>FAMILY HISTORY</strong></h5>
                        <ul style={{ listStyleType: "none", textAlign: "start" }}>
                            <li className='d-flex'>
                                <strong>Family Composition:</strong>
                                <ul className='d-flex' style={{ listStyleType: "none" }}>
                                    {familyData.family_composition.map((item, idx) => (
                                        <li key={idx}>{item} ,</li>
                                    ))}
                                </ul>
                            </li>
                            <li className='d-flex'>
                                <strong>Family Dynamics:</strong>
                                <ul className='d-flex' style={{ listStyleType: "none" }}>
                                    {familyData.family_dynamics.map((item, idx) => (
                                        <li key={idx}>{item} ,</li>
                                    ))}
                                </ul>
                            </li>
                            <li className='d-flex'>
                                <strong>Type of Marriage : </strong>
                                <p className='mx-3'>{familyData.marriage_type}</p>
                            </li>
                            <li className='d-flex'>
                                <strong>Family History of Psychiatric Disorders : </strong>
                                <p className='mx-3'>{familyData.family_history}</p>
                            </li>
                            <li className='d-flex mt-5'>
                                <strong>Genetic Predispositions : </strong>
                                <p className='mx-3'>{familyData.genetic_predisposition}</p>
                            </li>
                            <li className='d-flex'>
                                <strong>Family Changes or Transitions:</strong>
                                <ul className='d-flex' style={{ listStyleType: "none" }}>
                                    {familyData.family_changes.map((item, idx) => (
                                        <li key={idx}>{item} ,</li>
                                    ))}
                                </ul>
                            </li>
                        </ul>
                    </li>
                    <li className="tab-content my-3">
                        <h5 className='pdf_heading'><strong>SOCIAL HISTORY</strong></h5>
                        <ul style={{ listStyleType: "none", textAlign: "start" }}>
                            <li className='d-flex'>
                                <strong>Relationship with Family : </strong>
                                <p className='mx-3'>{socialData.family_relationship}</p>
                            </li>
                            <li className='d-flex'>
                                <strong>Relationship with Friends and Social Circles : </strong>
                                <p className='mx-3'>{socialData.socialCircle_relationship}</p>
                            </li>
                            <li className='d-flex'>
                                <strong>Relationship with Significant Others : </strong>
                                <p className='mx-3'>{socialData.relationship_significant}</p>
                            </li>
                            <li className='d-flex'>
                                <strong>Current Living Arrangements : </strong>
                                <p className='mx-3'>{socialData.living_arrangements}</p>
                            </li>
                            <li className='d-flex'>
                                <strong>Educational Background : </strong>
                                <p className='mx-3'>{socialData.education_bg}</p>
                            </li>
                            <li className='d-flex'>
                                <strong>Current Employment Status : </strong>
                                <p className='mx-3'>{socialData.currentEmp_status}</p>
                            </li>
                            <li className='d-flex'>
                                <strong>Recreational Activities : </strong>
                                <p className='mx-3'>{socialData.socialRecreation_activity}</p>
                            </li>
                            <li className='d-flex'>
                                <strong>Social Outlets : </strong>
                                <p className='mx-3'>{socialData.social_outlets}</p>
                            </li>
                            <li className='d-flex'>
                                <strong>Social Media Engagement : </strong>
                                <p className='mx-3'>{socialData.socialMed_engagement}</p>
                            </li>
                            <li className='d-flex'>
                                <strong>Technology-related Stressors : </strong>
                                <p className='mx-3'>{socialData.technology_related}</p>
                            </li>
                        </ul>
                    </li>
                    <li className="tab-content my-3">
                        <h5 className='pdf_heading'><strong>DEVELOPMENTAL HISTORY</strong></h5>
                        <ul style={{ listStyleType: "none", textAlign: "start" }}>
                            <li className='d-flex'>
                                <strong>Prenatal Factors : </strong>
                                <p className='mx-3'>{developmentalData.prenatal_factors}</p>
                            </li>
                            <li className='d-flex'>
                                <strong>Birth Details : </strong>
                                <p className='mx-3'>{developmentalData.birth_details}</p>
                            </li>
                            <li className='d-flex'>
                                <strong>Birth Order : </strong>
                                <p className='mx-3'>{developmentalData.birth_order}</p>
                            </li>
                            <li className='d-flex'>
                                <strong>Number of Siblings : </strong>
                                <p className='mx-3'>{developmentalData.siblings_number}</p>
                            </li>
                            <li className='d-flex'>
                                <strong>Attachment and Bonding : </strong>
                                <p className='mx-3'>{developmentalData.bonding_attachment}</p>
                            </li>
                            <li className='d-flex'>
                                <strong>Developmental Milestones : </strong>
                                <p className='mx-3'>{developmentalData.milestones_development}</p>
                            </li>
                            <li className='d-flex'>
                                <strong>Childhood Illnesses and Injuries : </strong>
                                <p className='mx-3'>{developmentalData.childhood_illness}</p>
                            </li>
                            <li className='d-flex'>
                                <strong>Siblings and Relationships : </strong>
                                <p className='mx-3'>{developmentalData.siblings_relationship}</p>
                            </li>
                            <li className='d-flex'>
                                <strong>Parenting Styles : </strong>
                                <p className='mx-3'>{developmentalData.parenting_style}</p>
                            </li>
                            <li className='d-flex'>
                                <strong>Learning Challenges : </strong>
                                <p className='mx-3'>{developmentalData.learning_challenge}</p>
                            </li>
                            <li className='d-flex'>
                                <strong>Pubertal Development : </strong>
                                <p className='mx-3'>{developmentalData.pubertal_development}</p>
                            </li>
                        </ul>
                    </li>
                    <li className="tab-content my-3 mt-5">
                        <h5 className='pdf_heading'><strong>SUBSTANCE USE HISTORY</strong></h5>
                        <ul style={{ listStyleType: "none", textAlign: "start" }}>
                            <li className='d-flex'>
                                <strong>Types of Substances Used : </strong>
                                <p className='mx-3'>{substanceData.substance_use}</p>
                            </li>
                            <li className='d-flex'>
                                <strong>Age of Onset : </strong>
                                <p className='mx-3'>{substanceData.age_onset}</p>
                            </li>
                            <li className='d-flex'>
                                <strong>Frequency : </strong>
                                <p className='mx-3'>{substanceData.frequency}</p>
                            </li>
                            <li className='d-flex'>
                                <strong>Quantity : </strong>
                                <p className='mx-3'>{substanceData.quantity}</p>
                            </li>
                            <li className='d-flex'>
                                <strong>Motivations for Use : </strong>
                                <p className='mx-3'>{substanceData.motivation_use}</p>
                            </li>
                            <li className='d-flex'>
                                <strong>Environmental Triggers : </strong>
                                <p className='mx-3'>{substanceData.environmental_trigger}</p>
                            </li>
                            <li className='d-flex'>
                                <strong>Impact on Occupational or Academic Functioning : </strong>
                                <p className='mx-3'>{substanceData.impact_occupation}</p>
                            </li>
                            <li className='d-flex'>
                                <strong>Impact on Interpersonal Relationships : </strong>
                                <p className='mx-3'>{substanceData.impact_interpersonal}</p>
                            </li>
                            <li className='d-flex'>
                                <strong>Legal or Financial Consequences : </strong>
                                <p className='mx-3'>{substanceData.financial_consequences}</p>
                            </li>
                            <li className='d-flex'>
                                <strong>Craving intensity : </strong>
                                <p className='mx-3'>{substanceData.craving_intensity}</p>
                            </li>
                            <li className='d-flex'>
                                <strong>Previous Treatment Attempts : </strong>
                                <p className='mx-3'>{substanceData.previous_treatment}</p>
                            </li>
                            <li className='d-flex'>
                                <strong>Relapse History : </strong>
                                <p className='mx-3'>{substanceData.relapse_history}</p>
                            </li>
                        </ul>
                    </li>
                    <li className="tab-content my-3">
                        <h5 className='pdf_heading'><strong>SUICIDAL AND HOMICIDAL IDEATION</strong></h5>
                        <ul style={{ listStyleType: "none", textAlign: "start" }}>
                            <li className='d-flex'>
                                <strong>History of Suicide Attempts : </strong>
                                <p className='mx-3'>{suicidalData.suicide_history}</p>
                            </li>
                            <li className='d-flex'>
                                <strong>Triggers and Stressors : </strong>
                                <p className='mx-3'>{suicidalData.triggers_stressors}</p>
                            </li>
                            <li className='d-flex'>
                                <strong>History of Homicidal Ideation : </strong>
                                <p className='mx-3'>{suicidalData.homicidal_ideation}</p>
                            </li>
                            <li className='d-flex'>
                                <strong>Target and Method : </strong>
                                <p className='mx-3'>{suicidalData.target_method}</p>
                            </li>
                            <li className='d-flex'>
                                <strong>Immediate Threat : </strong>
                                <p className='mx-3'>{suicidalData.immediate_threat}</p>
                            </li>
                            <li className='d-flex'>
                                <strong>Necessity of Emergency Response : </strong>
                                <p className='mx-3'>{suicidalData.emergency_response}</p>
                            </li>
                            <li className='d-flex'>
                                <strong>Hospitalization Required : </strong>
                                <p className='mx-3'>{suicidalData.hospital_required}</p>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>

        </>
    )
}

export default Psychiatrics_form

