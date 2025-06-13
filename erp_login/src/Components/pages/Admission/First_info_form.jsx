import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Container, Row, Form, InputGroup, Col, Button } from "react-bootstrap";
import { Breadcrumb } from '@themesberg/react-bootstrap';
import { useState, useEffect } from "react";
import axios from "axios";
import { Alert } from "react-bootstrap";

function First_info_form() {
    const [admissionNumber, setAdmissionNo] = useState('');
    const [step, setStep] = useState(1);
    const [validated, setValidated] = useState(false);
    // formdata usestate
    const [referred_by, setReferredBy] = useState('');
    const [from_place, setFromPlace] = useState('');
    const [date_time, setDateTime] = useState('');
    const [police_memo, setPoliceMemo] = useState('');
    const [information_public, setInformationPulic] = useState('');
    const [admission_date, setAdmissionDate] = useState('');
    const [admission_no, setAdmisisonNo] = useState('');
    const [rescue_image, setRescueImage] = useState(null);
    const [attach_policeMemo, setAttachPoliceMemo] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isStep1Invalid, setIsStep1Invalid] = useState(false);
    const [isStep2Invalid, setIsStep2Invalid] = useState(false);
    const [isStep3Invalid, setIsStep3Invalid] = useState(false);
    const [isStep4Invalid, setIsStep4Invalid] = useState(false);
    const [isStep5Invalid, setIsStep5Invalid] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setRescueImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleMemoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAttachPoliceMemo(file);
            setImagePreview(URL.createObjectURL(file));
        }
    }
    const [rescue_name, setRescueName] = useState('');
    const [age, setAge] = useState('');
    const [rescue_status, setRescueStatus] = useState('');
    const [religion, setReligion] = useState('');
    const [language1, setLanguage1] = useState('');
    const [language2, setLanguage2] = useState('');
    const [language3, setLanguage3] = useState('');
    const [education, setEducation] = useState('');
    const [father, setFather] = useState('');
    const [fatherError, setFatherError] = useState(false);
    const [mother, setMother] = useState('');
    const [motherError, setMotherError] = useState(false);
    const [other_relation, setOtherRelation] = useState('');
    const [other_relationError, setOtherRelationError] = useState(false);
    const [place, setPlace] = useState('');
    const [placeError, setPlaceError] = useState(false);
    const [phone_no, setPhoneNumber] = useState('');
    const [phone_noError, setPhoneNoError] = useState(false);
    const [phone_no_two, setPhoneNumberTwo] = useState('');
    const [clothing, setClothing] = useState('');
    const [clothingError, setClothingError] = useState(false);
    const [dress_code, setDressCode] = useState('');
    const [dress_codeError, setDressCodeError] = useState(false);
    const [complexion, setComplexion] = useState('');
    const [complexionError, setComplexionError] = useState(false);
    const [indentification_mark, setIdentification] = useState('');
    const [identificationMarkError, setIdentificationError] = useState(false);
    const [tattoo, setTattoo] = useState('');
    const [tattooError, setTattooError] = useState(false);
    const [wound_infection, setWoundInfection] = useState('');
    const [woundInfectionError, setWoundInfectionError] = useState(false);
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [things_carried, setThingsCarried] = useState('');
    const [thingsCarrierError, setThingsCarriedError] = useState(false);
    const [heightError, setHeightError] = useState(false);
    const [weightError, setWeightError] = useState(false);
    const [remark, setRemark] = useState('');
    const [mental_status, setMentalStatus] = useState('');
    const [behaviour, setBehaviour] = useState('');
    const [community_ability, setCommunityAbility] = useState('');
    const [self_careCapacity, setSelfCareCapacity] = useState('');
    const [diagnosis, setDiagnosis] = useState('');
    // const [rescued_by, setRescuedBy] = useState('');
    // const [information, setInformation] = useState('');
    const [govIdType, setGovIdType] = useState('');
    const [govIdNumber, setGovIdNumber] = useState('');
    const [govIdFile, setGovIdFile] = useState(null);
    // const [articles_carried, setArticlesCarried] = useState('');
    // const [rescue_relationship, setRescueRelationship] = useState('');
    // const [f_member_name, setFMemberName] = useState('');
    // const [f_member_phone, setFMemberPhone] = useState('');
    // const [f_member_address, setFMemberAddress] = useState('');
    // const [f_aadhar_card, setFAadharCard] = useState('');
    // const [f_ration_card, setRationCard] = useState('');
    // const [res_aadhar_card, setRescueAadharCard] = useState('');
    const [police_station, setPoliceStation] = useState('');

    //alert box values
    const [submissionMessage, setSubmissionMessage] = useState("");
    const [messageType, setMessageType] = useState(""); // 'success' or 'danger'


    const apiRoute = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
    });


    const AdmissionNumber = async () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const baseAdmissionNo = `${year}${month}${day}`;

        let newAdmissionNo = baseAdmissionNo;
        let counter = 1;

        try {
            // Keep checking until a unique admission number is found
            while (true) {
                const checkResponse = await apiRoute.get(`/admision/check_admission_no/${newAdmissionNo}`);
                if (!checkResponse.data.exists) {
                    // Unique number found, break the loop
                    break;
                }

                // Admission number exists, try next suffix
                const suffix = String(counter).padStart(2, '0');
                newAdmissionNo = `${baseAdmissionNo}${suffix}`;
                counter++;

                // Optional: prevent infinite loop
                if (counter > 99) {
                    throw new Error("Too many admission numbers for today");
                }
            }

            setAdmisisonNo(newAdmissionNo); // Make sure this matches your state variable

        } catch (error) {
            console.error("Error generating admission number", error);
            alert("Failed to generate unique admission number.");
        }
    };

    const currentDate = () => {
        const today = new Date();
        const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        setAdmissionDate(formattedDate);
    };


    const handleNext = (event) => {
        event.preventDefault();
        event.stopPropagation(); // prevents default bubbling for better control

        // Set validated true for Bootstrap's validation feedback
        setValidated(true);

        // List of all required values in Step 1
        const requiredFields = [
            referred_by,
            from_place,
            date_time,
            police_memo,
            attach_policeMemo,
            police_station,
            information_public,
            admission_no,
            rescue_image,
        ];

        const allFilled = requiredFields.every(field => {
            if (typeof field === "string") {
                return field.trim() !== "";
            }
            return !!field;
        });

        if (!allFilled) {
            setIsStep1Invalid(true); // mark step 1 red in progress bar
        } else {
            setIsStep1Invalid(false);
        }

        // Always move to next step
        setStep(2);
    };


    const handleInmateForm = (event) => {
        event.preventDefault();
        event.stopPropagation();

        setValidated(true);

        const requiredFields = [
            rescue_name,
            rescue_status,
            language1,
            education,
            govIdType
        ];

        console.log(govIdType);
        console.log(govIdNumber);
        console.log(govIdFile);

        const allRequiredFilled = requiredFields.every(field => {
            if (typeof field === "string") {
                return field.trim() !== "";
            }
            return !!field;
        });

        console.log("All fields filled?", allRequiredFilled);

        setIsStep2Invalid(!allRequiredFilled); // this controls the red color
        setStep(3); // always go to step 3
    };




    const handleFamilyForm = (event) => {
        const form = event.currentTarget;
        event.preventDefault(); // stop default submit behavior
        event.stopPropagation(); // stop bubbling

        setValidated(true); // for Bootstrap feedback

        let isValid = true;

        // Custom validation for 'father'
        if (
            father.trim() === '' ||
            (!['unknown', 'na'].includes(father.trim().toLowerCase()) && father.trim() === '')
        ) {
            setFatherError(true);
            isValid = false;
        } else {
            setFatherError(false);
        }

        // Custom validation for 'mother'
        if (
            mother.trim() === '' ||
            (!['unknown', 'na'].includes(mother.trim().toLowerCase()) && mother.trim() === '')
        ) {
            setMotherError(true);
            isValid = false;
        } else {
            setMotherError(false);
        }

        // Custom validation for 'other_relation'
        const nameWithRelationRegex = /^[a-zA-Z]+(?:\s[a-zA-Z]+)*\s\([a-zA-Z]+\)$/;

        if (
            other_relation.trim() === '' ||
            (!nameWithRelationRegex.test(other_relation.trim()) &&
                !['unknown', 'na'].includes(other_relation.trim().toLowerCase()))
        ) {
            setOtherRelationError(true);
            isValid = false;
        } else {
            setOtherRelationError(false);
        }


        // Custom validation for 'place'
        if (
            place.trim() === '' ||
            (!['unknown', 'na'].includes(place.trim().toLowerCase()) && place.trim() === '')
        ) {
            setPlaceError(true);
            isValid = false;
        } else {
            setPlaceError(false);
        }

        // Custom validation for 'phone_no'
        if (
            phone_no.trim() === '' ||
            (!['unknown', 'na'].includes(phone_no.trim().toLowerCase()) && phone_no.trim() === '')
        ) {
            setPhoneNoError(true);
            isValid = false;
        } else {
            setPhoneNoError(false);
        }

        // ✅ Always go to next step, but mark invalid if needed
        if (form.checkValidity() && isValid) {
            setIsStep3Invalid(false); // valid: no red mark
        } else {
            setIsStep3Invalid(true); // invalid: show red mark
        }

        // ✅ Always move to next step
        setStep(4);
    };


    const handlePhysicalForm = (event) => {
        event.preventDefault();
        event.stopPropagation();

        setValidated(true);

        let isValid = true;

        // Helper function to check if a field is empty (required)
        const checkField = (value, setError) => {
            if (value.trim() === '') {
                setError(true);
                return false;
            }
            setError(false);
            return true;
        };

        // Validate all fields
        if (!checkField(clothing, setClothingError)) isValid = false;
        if (!checkField(dress_code, setDressCodeError)) isValid = false;
        if (!checkField(complexion, setComplexionError)) isValid = false;
        if (!checkField(indentification_mark, setIdentificationError)) isValid = false;
        if (!checkField(tattoo, setTattooError)) isValid = false;
        if (!checkField(wound_infection, setWoundInfectionError)) isValid = false;
        if (!checkField(things_carried, setThingsCarriedError)) isValid = false;
        if (!checkField(height, setHeightError)) isValid = false;
        if (!checkField(weight, setWeightError)) isValid = false;

        // Set the step 4 invalid flag based on validation results
        setIsStep4Invalid(!isValid);

        // Always move to next step (step 5)
        setStep(5);
    };





    // const handleMentalStatus = (event) => {
    //     const form = event.currentTarget;
    //     event.preventDefault(); // stop default submit behavior
    //     event.stopPropagation(); // stop bubbling

    //     if (form.checkValidity()) {
    //         // Proceed to next form if valid
    //         console.log("Form is valid, go to next step");
    //         setStep(6);
    //     }
    //     else {
    //         alert("Enter the Physical Apperance Correctly");
    //     }

    //     setValidated(true);
    // }

    // const handleArticlesForm = (event) => {
    //     const form = event.currentTarget;
    //     event.preventDefault(); // stop default submit behavior
    //     event.stopPropagation(); // stop bubbling

    //     if (form.checkValidity()) {
    //         // Proceed to next form if valid
    //         console.log("Form is valid, go to next step");
    //         setStep(7);
    //     }
    //     else {
    //         alert("Enter the Physical Apperance Correctly");
    //     }

    //     setValidated(true);
    // }

    // Validate Step 1 (Example)
    const validateStep1 = () => {
        let valid = true;
        if (!admission_no || admission_no.trim() === "") valid = false;
        if (!admission_date || admission_date.trim() === "") valid = false;
        if (!referred_by || referred_by.trim() === "") valid = false;
        if (!from_place || from_place.trim() === "") valid = false;
        if (!date_time || date_time.trim() === "") valid = false;
        if (!police_memo || police_memo.trim() === "") valid = false;
        if (!attach_policeMemo || attach_policeMemo.trim() === "") valid = false;
        if (!police_station || police_station.trim() === "") valid = false;
        if (!information_public || information_public.trim() === "") valid = false;
        if (!rescue_image || rescue_image.trim() === "") valid = false;
        // Add other required Step 1 fields here...
        setIsStep1Invalid(!valid);
        return valid;
    };

    // Validate Step 2 (Example)
    const validateStep2 = () => {
        let valid = true;
        if (!rescue_name || rescue_name.trim() === "") valid = false;
        if (!rescue_status || rescue_status.trim() === "") valid = false;
        if (!language1 || language1.trim() === "") valid = false;
        if (!education || education.trim() === "") valid = false;
        if (!govIdType || govIdType.trim() === "") valid = false;
        // Add other required Step 2 fields here...
        setIsStep2Invalid(!valid);
        return valid;
    };

    // Validate Step 3 (Example)
    const validateStep3 = () => {
        let valid = true;
        if (!father || father.trim() === "") valid = false;
        // Add other required Step 3 fields here...
        setIsStep3Invalid(!valid);
        return valid;
    };

    // Validate Step 4 (physical form)
    const validateStep4 = () => {
        let valid = true;

        // Here assuming these fields are required, but if not, you can tweak conditions
        if (clothing.trim() === "") valid = false;
        if (dress_code.trim() === "") valid = false;
        if (complexion.trim() === "") valid = false;
        if (indentification_mark.trim() === "") valid = false;
        if (tattoo.trim() === "") valid = false;
        if (wound_infection.trim() === "") valid = false;
        if (things_carried.trim() === "") valid = false;
        if (height.trim() === "") valid = false;
        if (weight.trim() === "") valid = false;

        setIsStep4Invalid(!valid);
        return valid;
    };

    // Validate Step 5 (physical form)
    const validateStep5 = () => {
        let valid = true;

        // Here assuming these fields are required, but if not, you can tweak conditions
        if (mental_status.trim() === "") valid = false;
        if (behaviour.trim() === "") valid = false;
        if (community_ability.trim() === "") valid = false;
        if (self_careCapacity.trim() === "") valid = false;
        if (diagnosis.trim() === "") valid = false;

        setIsStep5Invalid(!valid);
        return valid;
    };


    const handleSubmitFinallForm = async (e) => {
        e.preventDefault();

        const requiredFields = [
            rescue_name,
            rescue_status,
            language1,
            education,
            govIdType
        ];

        const allRequiredFilled = requiredFields.every(field => {
            if (typeof field === "string") {
                return field.trim() !== "";
            }
            return !!field;
        });

        console.log("All fields filled?", allRequiredFilled);

        setIsStep5Invalid(!allRequiredFilled); 

        // Validate all steps before submitting
        const step1Valid = validateStep1();
        const step2Valid = validateStep2();
        const step3Valid = validateStep3();
        const step4Valid = validateStep4();
        const step5Valid = validateStep5();

        if (!step1Valid || !step2Valid || !step3Valid || !step4Valid || !step5Valid) {
            alert("Please fill all required fields in the previous steps.");
            return; // Prevent submission if any step invalid
        }


        try {
            // Step 1: Check if admission_no already exists
            const checkResponse = await apiRoute.get(`/admision/check_admission_no/${admission_no}`);
            if (checkResponse.data.exists) {
                alert("Admission number already exists. Please use a different one.");
                return; // Stop form submission
            }
        } catch (error) {
            console.error("Error checking admission number", error);
            alert("Failed to validate admission number.");
            return; // Stop submission on error
        }


        const formData = new FormData();

        formData.append('referred_by', referred_by);
        formData.append('from_place', from_place);
        formData.append('date_time', date_time);
        formData.append('police_memo', police_memo);
        formData.append('police_station', police_station);
        formData.append('information_public', information_public);
        formData.append('admission_date', admission_date);
        formData.append('admission_no', admission_no);
        formData.append('rescue_name', rescue_name);
        formData.append('age', age);
        formData.append('rescue_status', rescue_status);
        formData.append('religion', religion);
        formData.append('language1', language1);
        formData.append('language2', language2);
        formData.append('language3', language3);
        formData.append('education', education);
        formData.append('father', father);
        formData.append('mother', mother);
        formData.append('other_relation', other_relation);
        formData.append('place', place);
        formData.append('phone_no', phone_no);
        formData.append('phone_no_two', phone_no_two);
        formData.append('clothing', clothing);
        formData.append('dress_code', dress_code);
        formData.append('complexion', complexion);
        formData.append('indentification_mark', indentification_mark);
        formData.append('tattoo', tattoo);
        formData.append('wound_infection', wound_infection);
        formData.append('height', height);
        formData.append('weight', weight);
        formData.append('things_carried', things_carried);
        formData.append('remark', remark);
        formData.append('mental_status', mental_status);
        formData.append('behaviour', behaviour);
        formData.append('community_ability', community_ability);
        formData.append('self_careCapacity', self_careCapacity);
        formData.append('diagnosis', diagnosis);
        // formData.append('rescued_by', rescued_by);
        // formData.append('information', information);
        formData.append('govIdType', govIdType);
        formData.append('govIdNumber', govIdNumber);

        // formData.append('articles_carried', articles_carried);
        // formData.append('rescue_relationship', rescue_relationship);
        // formData.append('f_member_name', f_member_name);
        // formData.append('f_member_phone', f_member_phone);
        // formData.append('f_member_address', f_member_address);



        formData.append('rescue_image', rescue_image);
        formData.append('attach_policeMemo', attach_policeMemo);
        formData.append('govIdFile', govIdFile);

        console.log("Rescue Image File", rescue_image);
        console.log("Police Memo:", attach_policeMemo);
        // formData.append('f_aadhar_card', f_aadhar_card);
        // formData.append('f_ration_card', f_ration_card);
        // formData.append('res_aadhar_card', res_aadhar_card);
        // console.log("mentalstatus", mental_status);
        // console.log("behaviour", behaviour);
        // console.log("community_ability", community_ability);
        // console.log("self_careCapacity", self_careCapacity);
        // console.log("diagnosis", diagnosis);

        console.log("Submitting values:", admission_no, admission_date);
        try {
            const response = await apiRoute.post("/admision/create_first_form", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Important for file uploads
                }
            });
            console.log("Full Response:", response.data);
            if (response.data.message === "First Form Created Successfully") {
                setSubmissionMessage("Form submitted successfully!");
                setMessageType("success");

                // Optionally reload after 3 seconds
                setTimeout(() => window.location.reload(), 3000);
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



    const handleBack = () => {
        setStep(1);
    };

    const handleBack1 = () => {
        setStep(2);
    };

    const handleBack2 = () => {
        setStep(3);
    };

    const handleBack3 = () => {
        setStep(4);
    };

    // const handleBack4 = () => {
    //     setStep(5);
    // };

    // const handleBack5 = () => {
    //     setStep(6);
    // };

    useEffect(() => {
        currentDate();
        AdmissionNumber();
    }, [])

    const totalSteps = 5;

    const steps = [
        "Rescue Details",
        "Resident's Details",
        "Family Details",
        "Physical Appearance",
        "Mental Status"
    ];

    return (
        <>
            <div className="d-xl-flex justify-content-between align-items-center flex-wrap flex-md-nowrap text-start py-2">
                <div className="d-block mb-4 mb-xl-0 px-4 ">
                    <Breadcrumb className="d-none d-md-inline-block mb-0" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
                        <Breadcrumb.Item></Breadcrumb.Item>
                        <Breadcrumb.Item>Home</Breadcrumb.Item>
                        <Breadcrumb.Item active>Admission</Breadcrumb.Item>
                    </Breadcrumb>
                    <h6 className="breadcrumb_title">Resident Intake Form</h6>

                </div>
                <Col md={7} className="text-center mb-4">
                    <h3 className="section_title">Resident Intake Form</h3>
                </Col>
                <Col md={2}></Col>

                
            </div>

            {/* Step Progress UI */}
            <div className="step-progressbar mb-4">
                {steps.map((label, index) => {
                    const stepNumber = index + 1;
                    const isActive = stepNumber === step;
                    const isCompleted = stepNumber < step;

                    const isInvalid =
                        (stepNumber === 1 && isStep1Invalid) ||
                        (stepNumber === 2 && isStep2Invalid) ||
                        (stepNumber === 3 && isStep3Invalid) ||
                        (stepNumber === 4 && isStep4Invalid) ||
                        (stepNumber === 5 && isStep5Invalid);

                    return (
                        <div
                            key={index}
                            className={`step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}
                        >
                            <div
                                className="step-number"
                                style={{
                                    color: isInvalid ? 'white' : 'inherit',
                                    fontWeight: isInvalid ? 'bold' : 'normal',
                                    background: isInvalid ? 'red' : '#84c342',
                                }}
                            >
                                {stepNumber}
                            </div>
                            <div className="step-label">{label}</div>
                        </div>
                    );
                })}
            </div>





            <div>
                {/* Show success or error message box */}
                {submissionMessage && (
                    <Alert variant={messageType} className="mt-3">
                        {submissionMessage}
                    </Alert>
                )}
            </div>



            {step === 1 && (
                <Container>
                    <Row>
                        <Col md={12} className="text-start">
                            <h3 className="section_title">Rescue Details</h3>
                        </Col>
                        <Form noValidate validated={validated} onSubmit={handleNext} className="first_infoForm">
                            <Row className="d-flex justify-content-between first_infoFormRow">
                                <Col md={6}>
                                    <Form.Group className="mb-3 text-start" controlId="formReferredby">
                                        <Form.Label>Rescued / Referred by: </Form.Label>
                                        <Form.Control type="text"
                                            name="referred_by"
                                            value={referred_by}
                                            onChange={(e) => setReferredBy(e.target.value)}
                                            required />
                                        <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group className="mb-3 text-start" controlId="formtakePlace">
                                        <Form.Label>Taken from (Rescue Place) : </Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="from_place"
                                            value={from_place}
                                            onChange={(e) => setFromPlace(e.target.value)}
                                            required />
                                    </Form.Group>
                                    <Form.Group className="mb-3 text-start" controlId="formdatetime">
                                        <Form.Label>Date & Time : </Form.Label>
                                        <Form.Control
                                            type="datetime-local"
                                            name="date_time"
                                            value={date_time}
                                            onChange={(e) => setDateTime(e.target.value)}
                                            required />
                                    </Form.Group>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3 text-start" controlId="formPoliceMemo">
                                                <Form.Label>Police Memo : </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="police_memo"
                                                    value={police_memo}
                                                    onChange={(e) => setPoliceMemo(e.target.value)}
                                                    required />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6} className="text-start">
                                            <Form.Group>
                                                <Form.Label>Attach Police Memo : </Form.Label>
                                                <Form.Control
                                                    type="file"
                                                    name="attach_policeMemo"
                                                    accept="image/*"
                                                    onChange={handleMemoChange}
                                                    required={!attach_policeMemo}
                                                />
                                                {/* {attach_policeMemo && (
                                                    <>
                                                        <div className="mt-1 text-success">
                                                            Selected file: {attach_policeMemo.name}
                                                        </div>
                                                        <img
                                                            src={imagePreview}
                                                            alt="Preview"
                                                            className="mt-2"
                                                            style={{ maxWidth: "200px", maxHeight: "200px", border: "1px solid #ccc" }}
                                                        />
                                                    </>
                                                )} */}
                                            </Form.Group>
                                        </Col>
                                    </Row>


                                    <Form.Group className="mb-3 text-start" controlId="formPoliceStation">
                                        <Form.Label>Police Station : </Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="police_station"
                                            value={police_station}
                                            onChange={(e) => setPoliceStation(e.target.value)}
                                            required />
                                    </Form.Group>
                                    <Form.Group className="mb-3 text-start" controlId="formPublicInfo">
                                        <Form.Label>Information from Public / Spot : </Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="information_public"
                                            value={information_public}
                                            onChange={(e) => setInformationPulic(e.target.value)}
                                            required />
                                    </Form.Group>
                                </Col>
                                <Col md={4}>
                                    <Form.Group as={Row} className="mb-3 text-start" controlId="formDate">
                                        <Form.Label column sm={6}>Date :</Form.Label>
                                        <Col sm={6}>
                                            <Form.Control
                                                type="date"
                                                name="admission_date"
                                                value={admission_date}
                                                onChange={(e) => setAdmissionDate(e.target.value)}
                                                readOnly
                                            />
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} className="mb-3 text-start" controlId="formAdmissionType">
                                        <Form.Label column sm={6}>Admission No. :</Form.Label>
                                        <Col sm={6}>
                                            <Form.Control
                                                type="number"
                                                placeholder={admissionNumber}
                                                name="admission_no"
                                                value={admission_no}
                                                onChange={(e) => setAdmisisonNo(e.target.value)}
                                                readOnly required />
                                        </Col>
                                    </Form.Group>

                                    <Form.Group controlId="formFile" className="mb-3 text-start">
                                        <Form.Label>Attach Rescue Image</Form.Label>
                                        <Form.Control
                                            type="file"
                                            name="rescue_image"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            required={!rescue_image}
                                        />
                                        {rescue_image && (
                                            <>
                                                <div className="mt-1 text-success">
                                                    Selected file: {rescue_image.name}
                                                </div>
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    className="mt-2"
                                                    style={{ maxWidth: "200px", maxHeight: "200px", border: "1px solid #ccc" }}
                                                />
                                            </>
                                        )}
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Col md={11}>
                                <Button variant="outline-success" className="m-1 mb-5" type="submit">
                                    <FontAwesomeIcon icon={faArrowRight} className="me-2" /> Next
                                </Button>
                            </Col>
                        </Form>
                    </Row >
                </Container >
            )
            }

            {
                step === 2 && (
                    <Container>
                        <Row>


                            <Form noValidate validated={validated} onSubmit={handleInmateForm}>
                                <Row className="d-flex justify-content-between first_infoFormRow">
                                    <Col md={6}>
                                        <Col md={12} className="text-start">
                                            <h3 className="section_title">Resident's Details</h3>
                                        </Col>
                                        <Form.Group className="mb-3 text-start" controlId="formName">
                                            <Form.Label>Name at the time of Rescue : </Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="rescue_name"
                                                value={rescue_name}
                                                onChange={(e) => setRescueName(e.target.value)}
                                                required />
                                        </Form.Group>
                                        <Form.Group className="mb-3 text-start" controlId="formAge">
                                            <Form.Label>Approximate age :</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="age"
                                                value={age}
                                                onChange={(e) => {
                                                    const value = e.target.value;
                                                    if (value === '' || /^[0-9\b]+$/.test(value)) {
                                                        setAge(value); // Only numbers allowed
                                                    } else {
                                                        setAge('Unknown'); // Anything else sets to Unknown
                                                    }
                                                }}
                                            />
                                        </Form.Group>
                                        <Form.Group className="mb-3 text-start" controlId="formstatus">
                                            <Form.Label>Status :</Form.Label>
                                            <Form.Select
                                                name="rescue_status"
                                                value={rescue_status}
                                                onChange={(e) => setRescueStatus(e.target.value)}
                                                required
                                            >
                                                <option value="">-- Select Status --</option>
                                                <option value="Single">Single</option>
                                                <option value="Married">Married</option>
                                            </Form.Select>
                                        </Form.Group>
                                        <Form.Group className="mb-3 text-start" controlId="formReligion">
                                            <Form.Label>Religion : </Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="religion"
                                                value={religion}
                                                onChange={(e) => setReligion(e.target.value)} />
                                        </Form.Group>
                                        <Form.Group className="mb-3 text-start" controlId="formLanguage">
                                            <Form.Label>Known Languages:</Form.Label>
                                            <Row>
                                                <Col md={4}>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Language 1"
                                                        value={language1}
                                                        onChange={(e) => setLanguage1(e.target.value)}
                                                        className="mb-2"
                                                        required
                                                    />
                                                </Col>
                                                <Col md={4}>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Language 2"
                                                        value={language2}
                                                        onChange={(e) => setLanguage2(e.target.value)}
                                                        className="mb-2"
                                                    />
                                                </Col>
                                                <Col md={4}>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Language 3"
                                                        value={language3}
                                                        onChange={(e) => setLanguage3(e.target.value)}
                                                    />
                                                </Col>
                                            </Row>



                                        </Form.Group>

                                        <Form.Group className="mb-3 text-start" controlId="formEducation">
                                            <Form.Label>Education : </Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="education"
                                                value={education}
                                                onChange={(e) => setEducation(e.target.value)}
                                                required />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group as={Row} className="mb-3 text-start" controlId="formDate">
                                            <Form.Label column sm={6}>Date :</Form.Label>
                                            <Col sm={6}>
                                                <Form.Control
                                                    type="date"
                                                    name="admission_date"
                                                    value={admission_date}
                                                    onChange={(e) => setAdmissionDate(e.target.value)}
                                                    readOnly
                                                />
                                            </Col>
                                        </Form.Group>

                                        <Form.Group as={Row} className="mb-3 text-start" controlId="formAdmissionType">
                                            <Form.Label column sm={6}>Admission No. :</Form.Label>
                                            <Col sm={6}>
                                                <Form.Control
                                                    type="number"
                                                    name="admission_no"
                                                    value={admission_no}
                                                    onChange={(e) => setAdmisisonNo(e.target.value)}
                                                    placeholder={admissionNumber}
                                                    readOnly />
                                            </Col>
                                        </Form.Group>

                                        <Form.Group className="mb-3 text-start">
                                            <Form.Label column sm={12}>Government ID Type:</Form.Label>
                                            <Col sm={12}>
                                                <Form.Select
                                                    value={govIdType}
                                                    name="govIdType"
                                                    onChange={(e) => setGovIdType(e.target.value)}
                                                    required
                                                >
                                                    <option value="">Select ID Type</option>
                                                    <option value="NA">Not Available</option>
                                                    <option value="Aadhar">Aadhar Card</option>
                                                    <option value="PAN">PAN Card</option>
                                                    <option value="Voter">Voter ID</option>
                                                    <option value="Driving">Driving License</option>
                                                    <option value="Passport">Passport</option>
                                                </Form.Select>
                                            </Col>
                                        </Form.Group>

                                        {/* Show only if govIdType is not NA or empty */}
                                        {govIdType !== 'NA' && govIdType !== '' && (
                                            <>
                                                <Form.Group className="mb-3 text-start">
                                                    <Form.Label column sm={12}>{govIdType} Number:</Form.Label>
                                                    <Col sm={12}>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder={`Enter ${govIdType} number`}
                                                            value={govIdNumber}
                                                            name="govIdNumber"
                                                            onChange={(e) => setGovIdNumber(e.target.value)}
                                                        />
                                                    </Col>
                                                </Form.Group>

                                                <Form.Group className="mb-3 text-start">
                                                    <Form.Label column sm={12}>Upload {govIdType} File:</Form.Label>
                                                    <Col sm={12}>
                                                        <Form.Control
                                                            type="file"
                                                            name="govIdFile"
                                                            accept=".pdf,image/*"
                                                            onChange={(e) => setGovIdFile(e.target.files[0])}
                                                        />
                                                        {govIdFile && (
                                                            <div className="mt-1 text-success">
                                                                Selected file: {govIdFile.name}
                                                            </div>
                                                        )}
                                                    </Col>
                                                </Form.Group>
                                            </>
                                        )}



                                    </Col>
                                </Row>
                                <Col md={11}>
                                    <Button variant="outline-secondary" className="m-1 mb-5" onClick={handleBack}>
                                        <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Back
                                    </Button>
                                    <Button variant="outline-success" className="m-1 mb-5" type="submit">
                                        <FontAwesomeIcon icon={faArrowRight} className="me-2" /> Next
                                    </Button>
                                </Col>

                            </Form>



                        </Row>
                    </Container>

                )
            }

            {
                step === 3 && (
                    <Container>
                        <Row>

                            <Col md={12} className="text-start">
                                <h3 className="section_title">Family Details</h3>
                            </Col>
                            <Form noValidate validated={validated} onSubmit={handleFamilyForm}>
                                <Row className="d-flex justify-content-between first_infoFormRow">
                                    <Col md={6}>
                                        <Form.Group className="mb-3 text-start" controlId="formFather">
                                            <Form.Label>Father:</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="father"
                                                value={father}
                                                onChange={(e) => setFather(e.target.value)}
                                                isInvalid={fatherError}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                Please enter "Unknown" or "NA" if not available.
                                            </Form.Control.Feedback>
                                        </Form.Group>

                                        <Form.Group className="mb-3 text-start" controlId="formMother">
                                            <Form.Label>Mother : </Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="mother"
                                                value={mother}
                                                onChange={(e) => setMother(e.target.value)}
                                                isInvalid={motherError} />
                                            <Form.Control.Feedback type="invalid">
                                                Please enter "Unknown" or "NA" if not available.
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group className="mb-3 text-start" controlId="formOther">
                                            <Form.Label>Any Other Relationship: </Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="other_relation"
                                                value={other_relation}
                                                placeholder="Eg.Smith John (Brother)"
                                                onChange={(e) => setOtherRelation(e.target.value)}
                                                isInvalid={other_relationError}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                Please enter in the format: "Name (Relation)", or enter "Unknown" or "NA" if not applicable.
                                            </Form.Control.Feedback>

                                        </Form.Group>
                                        <Form.Group className="mb-3 text-start" controlId="formPlace">
                                            <Form.Label>Address : </Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="place"
                                                value={place}
                                                onChange={(e) => setPlace(e.target.value)}
                                                isInvalid={placeError}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                Please enter "Unknown" or "NA" if not available.
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group className="mb-3 text-start" controlId="formContactNo">
                                            <Form.Label>Contact Number : </Form.Label>
                                            <Row>
                                                <Col md={6}>
                                                    <Form.Control
                                                        type="text"
                                                        name="phone_no"
                                                        value={phone_no}
                                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                                        isInvalid={phone_noError}
                                                    />
                                                </Col>
                                                <Form.Control.Feedback type="invalid">
                                                    Please enter "Unknown" or "NA" if not available.
                                                </Form.Control.Feedback>
                                                <Col md={6}>
                                                    <Form.Control
                                                        type="text"
                                                        name="phone_no_two"
                                                        value={phone_no_two}
                                                        onChange={(e) => setPhoneNumberTwo(e.target.value)}
                                                    />
                                                </Col>
                                            </Row>

                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group as={Row} className="mb-3 text-start" controlId="formDate">
                                            <Form.Label column sm={6}>Date :</Form.Label>
                                            <Col sm={6}>
                                                <Form.Control
                                                    type="date"
                                                    name="admission_date"
                                                    value={admission_date}
                                                    onChange={(e) => setAdmissionDate(e.target.value)}
                                                    readOnly
                                                />
                                            </Col>
                                        </Form.Group>

                                        <Form.Group as={Row} className="mb-3 text-start" controlId="formAdmissionType">
                                            <Form.Label column sm={6}>Admission No. :</Form.Label>
                                            <Col sm={6}>
                                                <Form.Control
                                                    type="number"
                                                    name="admission_no"
                                                    value={admission_no}
                                                    onChange={(e) => setAdmisisonNo(e.target.value)}
                                                    placeholder={admissionNumber}
                                                    readOnly />
                                            </Col>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Col md={11}>
                                    <Button variant="outline-secondary" className="m-1 mb-5" onClick={handleBack1}>
                                        <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Back
                                    </Button>
                                    <Button variant="outline-success" className="m-1 mb-5" type="submit">
                                        <FontAwesomeIcon icon={faArrowRight} className="me-2" /> Next
                                    </Button>
                                </Col>
                            </Form>


                        </Row>
                    </Container>

                )
            }

            {
                step === 4 && (
                    <Container>
                        <Row>

                            <Col md={12} className="text-start">
                                <h3 className="section_title">Physical Appearance</h3>
                            </Col>
                            <Form noValidate validated={validated} onSubmit={handlePhysicalForm}>
                                <Row className="d-flex justify-content-between first_infoFormRow">
                                    <Col md={6}>
                                        <Row>
                                            <Col>
                                                <Form.Group className="mb-3 text-start" controlId="formClothing">
                                                    <Form.Label>Clothing : </Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="clothing"
                                                        value={clothing}
                                                        onChange={(e) => setClothing(e.target.value)}
                                                        isInvalid={clothingError} />
                                                    <Form.Control.Feedback type="invalid">
                                                        Please enter "Unknown" or "NA" if not available.
                                                    </Form.Control.Feedback>
                                                </Form.Group>
                                            </Col>
                                            <Col>
                                                <Form.Group className="mb-3 text-start" controlId="formDressColor">
                                                    <Form.Label>Dress Color : </Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="dress_code"
                                                        value={dress_code}
                                                        onChange={(e) => setDressCode(e.target.value)}
                                                        isInvalid={dress_codeError} />
                                                    <Form.Control.Feedback type="invalid">
                                                        Please enter "Unknown" or "NA" if not available.
                                                    </Form.Control.Feedback>
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        <Form.Group className="mb-3 text-start" controlId="formComplexion">
                                            <Form.Label>Complexion : </Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="complexion"
                                                value={complexion}
                                                onChange={(e) => setComplexion(e.target.value)}
                                                isInvalid={complexionError} />
                                            <Form.Control.Feedback type="invalid">
                                                Please enter "Unknown" or "NA" if not available.
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group className="mb-3 text-start" controlId="formIdentificationMark">
                                            <Form.Label>Indentification Mark : </Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="indentification_mark"
                                                value={indentification_mark}
                                                onChange={(e) => setIdentification(e.target.value)}
                                                isInvalid={identificationMarkError} />
                                            <Form.Control.Feedback type="invalid">
                                                Please enter "Unknown" or "NA" if not available.
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <Row>
                                            <Col>
                                                <Form.Group className="mb-3 text-start" controlId="formTatoo">
                                                    <Form.Label>Tattoo : </Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="tattoo"
                                                        value={tattoo}
                                                        onChange={(e) => setTattoo(e.target.value)}
                                                        isInvalid={tattooError} />
                                                    <Form.Control.Feedback type="invalid">
                                                        Please enter "Unknown" or "NA" if not available.
                                                    </Form.Control.Feedback>
                                                </Form.Group>
                                            </Col>
                                            <Col>
                                                <Form.Group className="mb-3 text-start" controlId="formWound">
                                                    <Form.Label>Any Wound / Infection : </Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="wound_infection"
                                                        value={wound_infection}
                                                        onChange={(e) => setWoundInfection(e.target.value)}
                                                        isInvalid={woundInfectionError} />
                                                    <Form.Control.Feedback type="invalid">
                                                        Please enter "Unknown" or "NA" if not available.
                                                    </Form.Control.Feedback>
                                                </Form.Group>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col>
                                                <Form.Group className="mb-3 text-start" controlId="formHeight">
                                                    <Form.Label>Height : </Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="height"
                                                        value={height}
                                                        onChange={(e) => setHeight(e.target.value)}
                                                        isInvalid={heightError}
                                                        required />
                                                </Form.Group>
                                            </Col>
                                            <Col>
                                                <Form.Group className="mb-3 text-start" controlId="formWeight">
                                                    <Form.Label>Weight : </Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="weight"
                                                        value={weight}
                                                        onChange={(e) => setWeight(e.target.value)}
                                                        isInvalid={weightError}
                                                        required />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                        <Form.Group className="mb-3 text-start" controlId="formThingsCarried">
                                            <Form.Label>Possessions & Items Carried at the Time of Rescue  : </Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="things_carried"
                                                value={things_carried}
                                                onChange={(e) => setThingsCarried(e.target.value)}
                                                isInvalid={thingsCarrierError} />
                                            <Form.Control.Feedback type="invalid">
                                                Please enter "Unknown" or "NA" if not available.
                                            </Form.Control.Feedback>
                                        </Form.Group>
                                        <Form.Group className="mb-3 text-start" controlId="formRemark">
                                            <Form.Label>Notes : </Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                name="remark"
                                                value={remark}
                                                onChange={(e) => setRemark(e.target.value)}
                                                rows={3} />
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group as={Row} className="mb-3 text-start" controlId="formDate">
                                            <Form.Label column sm={6}>Date :</Form.Label>
                                            <Col sm={6}>
                                                <Form.Control
                                                    type="date"
                                                    name="admission_date"
                                                    value={admission_date}
                                                    onChange={(e) => setAdmissionDate(e.target.value)}
                                                    readOnly
                                                />
                                            </Col>
                                        </Form.Group>

                                        <Form.Group as={Row} className="mb-3 text-start" controlId="formAdmissionType">
                                            <Form.Label column sm={6}>Admission No. :</Form.Label>
                                            <Col sm={6}>
                                                <Form.Control
                                                    type="number"
                                                    name="admission_no"
                                                    value={admission_no}
                                                    onChange={(e) => setAdmissionNo(e.target.value)}
                                                    placeholder={admissionNumber}
                                                    readOnly />
                                            </Col>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Col md={11} className="mb-4">
                                    <Button variant="outline-secondary" className="m-1 mb-5" onClick={handleBack2}>
                                        <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Back
                                    </Button>
                                    <Button variant="outline-success" className="m-1 mb-5" type="submit">
                                        <FontAwesomeIcon icon={faArrowRight} className="me-2" /> Next
                                    </Button>
                                </Col>
                            </Form>



                        </Row>
                    </Container>

                )
            }

            {
                step === 5 && (
                    <Container>
                        <Row>
                            <Col md={12} className="text-start">
                                <h3 className="section_title"> Initial Psychological Assessment.</h3>
                            </Col>
                            <Form noValidate validated={validated}>
                                <Row className="d-flex justify-content-between first_infoFormRow">
                                    <Col md={6}>
                                        <Form.Group className="mb-3 text-start">
                                            <Form.Label>Mental status : </Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                name="mental_status"
                                                value={mental_status}
                                                onChange={(e) => setMentalStatus(e.target.value)}
                                                rows={3}
                                                required />
                                        </Form.Group>
                                        <Form.Group className="mb-3 text-start">
                                            <Form.Label>Cognitive Behavior : </Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                name="behaviour"
                                                value={behaviour}
                                                onChange={(e) => setBehaviour(e.target.value)}
                                                rows={3}
                                                required />
                                        </Form.Group>
                                        <Form.Group className="mb-3 text-start">
                                            <Form.Label>Communication Ability : </Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                name="community_ability"
                                                value={community_ability}
                                                onChange={(e) => setCommunityAbility(e.target.value)}
                                                rows={3}
                                                required />
                                        </Form.Group>
                                        <Form.Group className="mb-3 text-start">
                                            <Form.Label>Self-Care Capacity : </Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                name="self_careCapacity"
                                                value={self_careCapacity}
                                                onChange={(e) => setSelfCareCapacity(e.target.value)}
                                                rows={3}
                                                required />
                                        </Form.Group>
                                        <Form.Group className="mb-3 text-start">
                                            <Form.Label>Diagnosis : </Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                name="diagnosis"
                                                value={diagnosis}
                                                onChange={(e) => setDiagnosis(e.target.value)}
                                                rows={3}
                                                required />
                                        </Form.Group>

                                    </Col>
                                    <Col md={4}>
                                        <Form.Group as={Row} className="mb-3 text-start" controlId="formDate">
                                            <Form.Label column sm={6}>Date :</Form.Label>
                                            <Col sm={6}>
                                                <Form.Control
                                                    type="date"
                                                    name="admission_date"
                                                    value={admission_date}
                                                    onChange={(e) => setAdmissionDate(e.target.value)}
                                                    readOnly
                                                />
                                            </Col>
                                        </Form.Group>

                                        <Form.Group as={Row} className="mb-3 text-start" controlId="formAdmissionType">
                                            <Form.Label column sm={6}>Admission No. :</Form.Label>
                                            <Col sm={6}>
                                                <Form.Control
                                                    type="number"
                                                    name="admission_no"
                                                    value={admission_no}
                                                    onChange={(e) => setAdmisisonNo(e.target.value)}
                                                    placeholder={admissionNumber}
                                                    readOnly />
                                            </Col>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                <Col md={11} className="mb-4">
                                    <Button variant="outline-secondary" className="m-1" onClick={handleBack3}>
                                        <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Back
                                    </Button>
                                    <Button variant="outline-success" className="m-1" type="submit" onClick={handleSubmitFinallForm}>
                                        <FontAwesomeIcon icon={faArrowRight} className="me-2" /> Submit
                                    </Button>
                                </Col>

                            </Form>



                        </Row>
                    </Container>

                )
            }

            {/* {step === 6 && (
                <Container>
                    <Row>
                        <Col md={12} className="text-start">
                            <h3 className="section_title">Articles carried from Rescue</h3>
                        </Col>
                        <Form noValidate validated={validated} onSubmit={handleArticlesForm}>
                            <Row className="d-flex justify-content-between">
                                <Col md={6}>
                                    <Form.Group className="mb-3 text-start" controlId="formArticles">
                                        <Form.Label>Items Found During Rescue : </Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            name="articles_carried"
                                            value={articles_carried}
                                            onChange={(e) => setArticlesCarried(e.target.value)}
                                            rows={3}
                                            required />
                                    </Form.Group>

                                </Col>
                                <Col md={4}>
                                    <Form.Group as={Row} className="mb-3 text-start" controlId="formDate">
                                        <Form.Label column sm={6}>Date :</Form.Label>
                                        <Col sm={6}>
                                            <Form.Control
                                                type="date"
                                                name="admission_date"
                                                value={admission_date}
                                                onChange={(e) => setAdmissionDate(e.target.value)}
                                                readOnly
                                            />
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} className="mb-3 text-start" controlId="formAdmissionType">
                                        <Form.Label column sm={6}>Admission No. :</Form.Label>
                                        <Col sm={6}>
                                            <Form.Control
                                                type="number"
                                                name="admission_no"
                                                value={admission_no}
                                                onChange={(e) => setAdmisisonNo(e.target.value)}
                                                placeholder={admissionNumber}
                                                readOnly />
                                        </Col>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Col md={11}>
                                <Button variant="outline-primary" className="m-1" onClick={handleBack4}>
                                    <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Back
                                </Button>
                                <Button variant="outline-primary" className="m-1" type="submit">
                                    <FontAwesomeIcon icon={faArrowRight} className="me-2" /> Submit
                                </Button>
                            </Col>
                        </Form>
                    </Row>
                </Container>
            )}

            {step === 7 && (
                <Container>
                    <Row>
                        <Col md={12} className="text-start">
                            <h3 className="section_title">Family Member Identification</h3>
                        </Col>
                        <Form noValidate validated={validated}>
                            <Row className="d-flex justify-content-between">
                                <Col md={6}>
                                    <Form.Group className="mb-3 text-start" controlId="formRelationship">
                                        <Form.Label>Relationship :</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="rescue_relationship"
                                            value={rescue_relationship}
                                            onChange={(e) => setRescueRelationship(e.target.value)}
                                            required />
                                    </Form.Group>
                                    <Form.Group className="mb-3 text-start" controlId="formMemberName">
                                        <Form.Label>Family Member Name :</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="f_member_name"
                                            value={f_member_name}
                                            onChange={(e) => setFMemberName(e.target.value)}
                                            required />
                                    </Form.Group>
                                    <Form.Group className="mb-3 text-start" controlId="formMemberPhone">
                                        <Form.Label>Family Member Phone No. :</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="f_member_phone"
                                            value={f_member_phone}
                                            onChange={(e) => setFMemberPhone(e.target.value)}
                                            required />
                                    </Form.Group>
                                    <Form.Group className="mb-3 text-start" controlId="formMemberAddress">
                                        <Form.Label>Family Member Address :</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="f_member_address"
                                            value={f_member_address}
                                            onChange={(e) => setFMemberAddress(e.target.value)}
                                            required />
                                    </Form.Group>
                                    <Form.Group controlId="formAdharCard" className="mb-3">
                                        <Form.Label>Family Member Aadhar Card Original :</Form.Label>
                                        <Form.Control
                                            type="file"
                                            name="f_aadhar_card"
                                            onChange={(e) => setFAadharCard(e.target.files[0])} // Set the actual file object
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="formRationCard" className="mb-3">
                                        <Form.Label>Ration Card :</Form.Label>
                                        <Form.Control
                                            type="file"
                                            name="f_ration_card"
                                            onChange={(e) => setRationCard(e.target.files[0])} // Set the actual file object
                                            required
                                        />
                                    </Form.Group>
                                    <Form.Group controlId="formRescueAadhar" className="mb-3">
                                        <Form.Label>Rescue Aadhar Card :</Form.Label>
                                        <Form.Control
                                            type="file"
                                            name="res_aadhar_card"
                                            onChange={(e) => setRescueAadharCard(e.target.files[0])} // Set the actual file object
                                            required
                                        />
                                    </Form.Group>

                                </Col>
                                <Col md={4}>
                                    <Form.Group as={Row} className="mb-3 text-start" controlId="formDate">
                                        <Form.Label column sm={6}>Date :</Form.Label>
                                        <Col sm={6}>
                                            <Form.Control
                                                type="date"
                                                name="admission_date"
                                                value={admission_date}
                                                onChange={(e) => setAdmissionDate(e.target.value)}
                                                readOnly
                                            />
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} className="mb-3 text-start" controlId="formAdmissionType">
                                        <Form.Label column sm={6}>Admission No. :</Form.Label>
                                        <Col sm={6}>
                                            <Form.Control
                                                type="number"
                                                name="admission_no"
                                                value={admission_no}
                                                onChange={(e) => setAdmisisonNo(e.target.value)}
                                                placeholder={admissionNumber}
                                                readOnly />
                                        </Col>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Col md={11}>
                                <Button variant="outline-primary" className="m-1" onClick={handleBack5}>
                                    <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Back
                                </Button>
                                <Button variant="outline-primary" className="m-1" button="submit" onClick={handleSubmitFinallForm}>
                                    <FontAwesomeIcon icon={faArrowRight} className="me-2" /> Submit
                                </Button>
                            </Col>
                        </Form>
                    </Row>
                </Container>
            )} */}
        </>
    )
}

export default First_info_form;