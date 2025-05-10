import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Container, Row, Form, InputGroup, Col, Button} from "react-bootstrap";
import { Breadcrumb } from '@themesberg/react-bootstrap';
import { useState, useEffect } from "react";
import axios from "axios";

function First_info_form(){
    const[admissionNumber,setAdmissionNo]=useState('');
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
    const [rescue_image,setRescueImage] = useState('');
    const [rescue_name, setRescueName] = useState('');
    const [age, setAge] = useState('');
    const [rescue_status, setRescueStatus] = useState('');
    const [religion, setReligion] = useState('');
    const [language, setLanguage] = useState('');
    const [education, setEducation] = useState('');
    const [father, setFather] = useState('');
    const [mother, setMother] = useState('');
    const [other_relation, setOtherRelation] = useState('');
    const [place, setPlace] = useState('');
    const [phone_no, setPhoneNumber] = useState('');
    const [clothing, setClothing] = useState('');
    const [dress_code, setDressCode] = useState('');
    const [complexion, setComplexion] = useState('');
    const [indentification_mark, setIdentification] = useState('');
    const [tattoo, setTattoo] = useState('');
    const [wound_infection, setWoundInfection] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [things_carried, setThingsCarried] = useState('');
    const [remark, setRemark] = useState('');
    const [symptoms, setSymptoms] = useState('');
    const [rescued_by, setRescuedBy] = useState('');
    const [information, setInformation] = useState('');
    const [articles_carried, setArticlesCarried] = useState('');
    const [rescue_relationship, setRescueRelationship] = useState('');
    const [f_member_name,setFMemberName] = useState('');
    const [f_member_phone, setFMemberPhone] = useState('');
    const [f_member_address,setFMemberAddress]= useState('');
    const [f_aadhar_card,setFAadharCard] = useState('');
    const [f_ration_card,setRationCard] = useState('');
    const [res_aadhar_card, setRescueAadharCard] = useState('');
    const [police_station, setPoliceStation] = useState('');


    const apiRoute = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
      });


    const AdmissionNumber = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const formatAdmissionNo = `${year}${month}${day}`;
        setAdmisisonNo(formatAdmissionNo); // Make sure spelling matches your state
    };
    
    const currentDate = () => {
        const today = new Date();
        const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
        setAdmissionDate(formattedDate);
    };
    
      
    

    const handleNext = (event) => {
        const form = event.currentTarget;
        event.preventDefault(); // stop default submit behavior
        event.stopPropagation(); // stop bubbling
    
        if (form.checkValidity()) {
          // Proceed to next form if valid
          console.log("Form is valid, go to next step");
          setStep(2);
        }
        // else{
        //     alert("Enter the Rescue Details Correctly");
        // }
    
        setValidated(true);
      };

      const handleInmateForm = (event) => {
        const form = event.currentTarget;
        event.preventDefault(); // stop default submit behavior
        event.stopPropagation(); // stop bubbling
    
        if (form.checkValidity()) {
          // Proceed to next form if valid
          console.log("Form is valid, go to next step");
          setStep(3);
        }
        else{
            alert("Enter the Inmate Details Correctly");
        }
    
        setValidated(true);
      };

      const handleFamilyForm = (event) => {
        const form = event.currentTarget;
        event.preventDefault(); // stop default submit behavior
        event.stopPropagation(); // stop bubbling
    
        if (form.checkValidity()) {
          // Proceed to next form if valid
          console.log("Form is valid, go to next step");
          setStep(4);
        }
        else{
            alert("Enter the Family Details Correctly");
        }
    
        setValidated(true);
      };

      const handlePhysicalForm = (event) => {
        const form = event.currentTarget;
        event.preventDefault(); // stop default submit behavior
        event.stopPropagation(); // stop bubbling
    
        if (form.checkValidity()) {
          // Proceed to next form if valid
          console.log("Form is valid, go to next step");
          setStep(5);
        }
        else{
            alert("Enter the Physical Apperance Correctly");
        }
    
        setValidated(true);
      };

      const handleMentalStatus = (event) =>{
        const form = event.currentTarget;
        event.preventDefault(); // stop default submit behavior
        event.stopPropagation(); // stop bubbling
    
        if (form.checkValidity()) {
          // Proceed to next form if valid
          console.log("Form is valid, go to next step");
          setStep(6);
        }
        else{
            alert("Enter the Physical Apperance Correctly");
        }
    
        setValidated(true);
      }

      const handleArticlesForm = (event) =>{
        const form = event.currentTarget;
        event.preventDefault(); // stop default submit behavior
        event.stopPropagation(); // stop bubbling
    
        if (form.checkValidity()) {
          // Proceed to next form if valid
          console.log("Form is valid, go to next step");
          setStep(7);
        }
        else{
            alert("Enter the Physical Apperance Correctly");
        }
    
        setValidated(true);
      }
    
      const handleSubmitFinallForm  = async (e) => {
        e.preventDefault();
        
            const formData = new FormData();
            
            formData.append('referred_by', referred_by);
            formData.append('from_place', from_place);
            formData.append('date_time', date_time);
            formData.append('police_memo', police_memo);
            formData.append('police_station',police_station);
            formData.append('information_public', information_public);
            formData.append('admission_date', admission_date);
            formData.append('admission_no', admission_no);
            formData.append('rescue_name', rescue_name);
            formData.append('age', age);
            formData.append('rescue_status', rescue_status);
            formData.append('religion', religion);
            formData.append('language', language);
            formData.append('education', education);
            formData.append('father', father);
            formData.append('mother', mother);
            formData.append('other_relation', other_relation);
            formData.append('place', place);
            formData.append('phone_no', phone_no);
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
            formData.append('symptoms', symptoms);
            formData.append('rescued_by', rescued_by);
            formData.append('information', information);
            formData.append('articles_carried', articles_carried);
            formData.append('rescue_relationship',rescue_relationship);
            formData.append('f_member_name', f_member_name);
            formData.append('f_member_phone', f_member_phone);
            formData.append('f_member_address', f_member_address);
            
            
            
            formData.append('rescue_image', rescue_image);
            formData.append('f_aadhar_card', f_aadhar_card);
            formData.append('f_ration_card',f_ration_card);
            formData.append('res_aadhar_card',res_aadhar_card);


                console.log("Submitting values:", admission_no, admission_date);
            try{
                const response = await apiRoute.post("http://localhost:5000/admision/create_first_form", formData, {
                    headers: {
                    'Content-Type': 'multipart/form-data', // Important for file uploads
                    }
                });
                console.log("Full Response:", response.data);
                if (response.data.message === "First Form Created Successfully") {
                    alert("Form submitted successfully!");
                } else {
                    alert("Submission failed.");
                }
            }catch (error) {
                console.error("Error submitting form", error);
                alert("Something went wrong.");
            }
      }

   

    const handleBack = () =>{
        setStep(1);
    };

    const handleBack1 = () =>{
        setStep(2);
    };

    const handleBack2 = () =>{
        setStep(3);
    };

    const handleBack3 = () =>{
        setStep(4);
    };

    const handleBack4 = () =>{
        setStep(5);
    };

    const handleBack5 = () =>{
        setStep(6);
    };

    useEffect(()=>{
        currentDate();
        AdmissionNumber();
    },[])
    
    return(
        <>
        <div className="d-xl-flex justify-content-between align-items-center flex-wrap flex-md-nowrap text-start py-2">
        <div className="d-block mb-4 mb-xl-0 px-4 ">
          <Breadcrumb className="d-none d-md-inline-block mb-0" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
            <Breadcrumb.Item></Breadcrumb.Item>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item active>Admission</Breadcrumb.Item>
          </Breadcrumb>
          <h6 className="breadcrumb_title">First Information Sheet</h6>
          
        </div>
        
        <div className="d-flex align-items-center px-3">
            
            <Form className="navbar-search">
              <Form.Group id="topbarSearch">
                <InputGroup className="input-group-merge search-bar">
                  
                  <Form.Control type="text" placeholder="Search" />
                </InputGroup>
              </Form.Group>
            </Form>
          </div>
      </div>

      {step === 1 && (
            <Container>
                <Row>
                    <Col md={12} className="text-start">
                        <h3 className="section_title">Rescue Details</h3>
                    </Col>
                    <Form noValidate validated={validated} onSubmit={handleNext}>
                        <Row className="d-flex justify-content-between">
                            <Col md={6}>
                                <Form.Group className="mb-3 text-start" controlId="formReferredby"> 
                                    <Form.Label>Rescued / Referred by: </Form.Label>
                                    <Form.Control type="text"
                                     name="referred_by"
                                     value={referred_by}
                                     onChange={(e) => setReferredBy(e.target.value)}
                                    required/>
                                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group className="mb-3 text-start" controlId="formtakePlace">
                                    <Form.Label>Taken from : </Form.Label>
                                    <Form.Control 
                                    type="text"
                                    name="from_place"
                                    value={from_place}
                                     onChange={(e) => setFromPlace(e.target.value)}
                                    required/>
                                </Form.Group>
                                <Form.Group className="mb-3 text-start" controlId="formdatetime">
                                    <Form.Label>Date & Time : </Form.Label>
                                    <Form.Control 
                                    type="datetime-local"
                                    name="date_time"
                                    value={date_time}
                                     onChange={(e) => setDateTime(e.target.value)}
                                    required/>
                                </Form.Group>
                                <Form.Group className="mb-3 text-start" controlId="formPoliceMemo">
                                    <Form.Label>Police Memo : </Form.Label>
                                    <Form.Control 
                                    type="text" 
                                    name="police_memo"
                                    value={police_memo}
                                     onChange={(e) => setPoliceMemo(e.target.value)}
                                    required/>
                                </Form.Group>
                                <Form.Group className="mb-3 text-start" controlId="formPoliceStation">
                                    <Form.Label>Police Station : </Form.Label>
                                    <Form.Control 
                                    type="text" 
                                    name="police_station"
                                    value={police_station}
                                     onChange={(e) => setPoliceStation(e.target.value)}
                                    required/>
                                </Form.Group>
                                <Form.Group className="mb-3 text-start" controlId="formPublicInfo">
                                    <Form.Label>Information from Public / Spot : </Form.Label>
                                    <Form.Control
                                     type="text" 
                                     name="information_public"
                                     value={information_public}
                                     onChange={(e) => setInformationPulic(e.target.value)}
                                     required/>
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
                                    readOnly required/>
                                </Col>
                                </Form.Group>

                                <Form.Group controlId="formFile" className="mb-3">
                                    <Form.Label>Attach Rescue Image</Form.Label>
                                    <Form.Control 
                                    type="file"
                                    name="rescue_image"
                                    accept="image/*"
                                    onChange={(e) => setRescueImage(e.target.files[0])} // Set the actual file object
                                    required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        
                        <Col md={11}>
                            <Button variant="outline-primary" className="m-1" type="submit">
                                <FontAwesomeIcon icon={faArrowRight} className="me-2" /> Next
                            </Button>
                        </Col>
                    </Form>
                </Row>
            </Container>
          )}

            {step === 2 && (
                <Container>
                    <Row>

                        
                        <Form noValidate validated={validated} onSubmit={handleInmateForm}>
                            <Row className="d-flex justify-content-between">
                                <Col md={6}>
                                    <Col md={12} className="text-start">
                                        <h3 className="section_title">Residency Details</h3>
                                    </Col>
                                    <Form.Group className="mb-3 text-start" controlId="formName"> 
                                        <Form.Label>Name : </Form.Label>
                                        <Form.Control 
                                        type="text"
                                        name="rescue_name" 
                                        value={rescue_name}
                                         onChange={(e) => setRescueName(e.target.value)}
                                        required/>
                                    </Form.Group>
                                    <Form.Group className="mb-3 text-start" controlId="formAge">
                                        <Form.Label>Age : </Form.Label>
                                        <Form.Control 
                                        type="text" 
                                        name="age"
                                        value={age}
                                        onChange={(e) => setAge(e.target.value)}
                                        required/>
                                    </Form.Group>
                                    <Form.Group className="mb-3 text-start" controlId="formstatus">
                                        <Form.Label>Status : </Form.Label>
                                        <Form.Control 
                                        type="text" 
                                        name="rescue_status"
                                        value={rescue_status}
                                         onChange={(e) => setRescueStatus(e.target.value)}
                                        required/>
                                    </Form.Group>
                                    <Form.Group className="mb-3 text-start" controlId="formReligion">
                                        <Form.Label>Religion : </Form.Label>
                                        <Form.Control 
                                        type="text" 
                                        name="religion"
                                        value={religion}
                                        onChange={(e) => setReligion(e.target.value)}
                                        required/>
                                    </Form.Group>
                                    <Form.Group className="mb-3 text-start" controlId="formLanguage">
                                        <Form.Label>Language : </Form.Label>
                                        <Form.Control 
                                        type="text" 
                                        name="language"
                                        value={language}
                                        onChange={(e) => setLanguage(e.target.value)}
                                        required/>
                                    </Form.Group>
                                    <Form.Group className="mb-3 text-start" controlId="formEducation">
                                        <Form.Label>Education : </Form.Label>
                                        <Form.Control 
                                        type="text" 
                                        name="education"
                                        value={education}
                                         onChange={(e) => setEducation(e.target.value)}
                                        required/>
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
                                            readOnly/>
                                        </Col>
                                        </Form.Group>

                                </Col>
                            </Row>
                            <Col md={11}>
                                <Button variant="outline-primary" className="m-1" onClick={handleBack}>
                                    <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Back
                                </Button>
                                <Button variant="outline-primary" className="m-1" type="submit">
                                    <FontAwesomeIcon icon={faArrowRight} className="me-2" /> Next
                                </Button>
                            </Col>
                            
                        </Form>
                    

                    
                    </Row>
                </Container>
                    
                )}

            {step === 3 && (
                <Container>
                    <Row>
                        
                        <Col md={12} className="text-start">
                            <h3 className="section_title">Family Details</h3>
                        </Col>
                        <Form noValidate validated={validated} onSubmit={handleFamilyForm}>
                            <Row className="d-flex justify-content-between">
                                <Col md={6}>
                                    <Form.Group className="mb-3 text-start" controlId="formFather"> 
                                        <Form.Label>Father : </Form.Label>
                                        <Form.Control 
                                        type="text"
                                        name="father"
                                        value={father}
                                        onChange={(e) => setFather(e.target.value)}
                                        required/>
                                    </Form.Group>
                                    <Form.Group className="mb-3 text-start" controlId="formMother">
                                        <Form.Label>Mother : </Form.Label>
                                        <Form.Control 
                                        type="text" 
                                        name="mother"
                                        value={mother}
                                        onChange={(e) => setMother(e.target.value)}
                                        required/>
                                    </Form.Group>
                                    <Form.Group className="mb-3 text-start" controlId="formOther">
                                        <Form.Label>Any Other : </Form.Label>
                                        <Form.Control 
                                        type="text" 
                                        name="other_relation"
                                        value={other_relation}
                                        onChange={(e) => setOtherRelation(e.target.value)}
                                        required/>
                                    </Form.Group>
                                    <Form.Group className="mb-3 text-start" controlId="formPlace">
                                        <Form.Label>Place : </Form.Label>
                                        <Form.Control 
                                        type="text" 
                                        name="place"
                                        value={place}
                                        onChange={(e) => setPlace(e.target.value)}
                                        required/>
                                    </Form.Group> 
                                    <Form.Group className="mb-3 text-start" controlId="formContactNo">
                                        <Form.Label>Contact Number : </Form.Label>
                                        <Form.Control 
                                        type="text" 
                                        name="phone_no"
                                        value={phone_no}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        required/>
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
                                        readOnly/>
                                    </Col>
                                    </Form.Group>
                                </Col>
                            </Row>
                            
                            <Col md={11}>
                                <Button variant="outline-primary" className="m-1" onClick={handleBack1}>
                                    <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Back
                                </Button>
                                <Button variant="outline-primary" className="m-1" type="submit">
                                    <FontAwesomeIcon icon={faArrowRight} className="me-2" /> Next
                                </Button>
                            </Col>
                        </Form>

                    
                    </Row>
                </Container>
                    
                )}

            {step === 4 && (
                <Container>
                    <Row>

                        <Col md={12} className="text-start">
                            <h3 className="section_title">Physical Appearance</h3>
                        </Col>
                        <Form noValidate validated={validated} onSubmit={handlePhysicalForm}>
                            <Row className="d-flex justify-content-between">
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
                                                required/>
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
                                                required/>
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
                                        required/>
                                    </Form.Group>
                                    <Form.Group className="mb-3 text-start" controlId="formIdentificationMark">
                                        <Form.Label>Indentification Mark : </Form.Label>
                                        <Form.Control 
                                        type="text" 
                                        name="indentification_mark"
                                        value={indentification_mark}
                                        onChange={(e) => setIdentification(e.target.value)}
                                        required/>
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
                                                required/>
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
                                                required/>
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
                                                required/>
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
                                                required/>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Form.Group className="mb-3 text-start" controlId="formThingsCarried">
                                        <Form.Label>Things carried : </Form.Label>
                                        <Form.Control 
                                        type="text" 
                                        name="things_carried"
                                        value={things_carried}
                                        onChange={(e) => setThingsCarried(e.target.value)}
                                        required/>
                                    </Form.Group>
                                    <Form.Group className="mb-3 text-start" controlId="formRemark">
                                        <Form.Label>Remark : </Form.Label>
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
                                            readOnly/>
                                        </Col>
                                        </Form.Group>
                                </Col>
                            </Row>
                            <Col md={11}>
                                <Button variant="outline-primary" className="m-1" onClick={handleBack2}>
                                    <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> Back
                                </Button>
                                <Button variant="outline-primary" className="m-1" type="submit">
                                    <FontAwesomeIcon icon={faArrowRight} className="me-2" /> Next
                                </Button>
                            </Col>
                        </Form>
                    

                    
                    </Row>
                </Container>
                    
                )}

            {step === 5 && (
                <Container>
                    <Row>

                        <Col md={12} className="text-start">
                            <h3 className="section_title">Mental Status</h3>
                        </Col>
                        <Form noValidate validated={validated} onSubmit={handleMentalStatus}>
                            <Row className="d-flex justify-content-between">
                                <Col md={6}>
                                    <Form.Group className="mb-3 text-start" controlId="formSymptoms">
                                        <Form.Label>Symptoms : </Form.Label>
                                        <Form.Control 
                                        as="textarea" 
                                        name="symptoms"
                                        value={symptoms}
                                        onChange={(e) => setSymptoms(e.target.value)}
                                        rows={3}  
                                        required/>
                                    </Form.Group>
                                    <Form.Group className="mb-3 text-start" controlId="formIntimated">
                                        <Form.Label>Intimated / Rescued by : </Form.Label>
                                        <Form.Control 
                                        type="text" 
                                        name="rescued_by"
                                        value={rescued_by}
                                        onChange={(e) => setRescuedBy(e.target.value)}
                                        required/>
                                    </Form.Group>
                                    
                                    <Form.Group className="mb-3 text-start" controlId="formInformation">
                                        <Form.Label>Information filed by : </Form.Label>
                                        <Form.Control 
                                        type="text" 
                                        name="information"
                                        value={information}
                                        onChange={(e) => setInformation(e.target.value)}
                                        required/>
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
                                        readOnly/>
                                    </Col>
                                    </Form.Group>
                                </Col>
                            </Row>
                            
                            <Col md={11}>
                                <Button variant="outline-primary" className="m-1" onClick={handleBack3}>
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

            {step === 6 && (
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
                                        required/>
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
                                        readOnly/>
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
                                        required/>
                                    </Form.Group>
                                    <Form.Group className="mb-3 text-start" controlId="formMemberName">
                                        <Form.Label>Family Member Name :</Form.Label>
                                        <Form.Control 
                                        type="text" 
                                        name="f_member_name"
                                        value={f_member_name}
                                        onChange={(e) => setFMemberName(e.target.value)}
                                        required/>
                                    </Form.Group>
                                    <Form.Group className="mb-3 text-start" controlId="formMemberPhone">
                                        <Form.Label>Family Member Phone No. :</Form.Label>
                                        <Form.Control 
                                        type="number" 
                                        name="f_member_phone"
                                        value={f_member_phone}
                                        onChange={(e) => setFMemberPhone(e.target.value)}
                                        required/>
                                    </Form.Group>
                                    <Form.Group className="mb-3 text-start" controlId="formMemberAddress">
                                        <Form.Label>Family Member Address :</Form.Label>
                                        <Form.Control 
                                        type="text" 
                                        name="f_member_address"
                                        value={f_member_address}
                                        onChange={(e) => setFMemberAddress(e.target.value)}
                                        required/>
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
                                        readOnly/>
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
            )}
        </>
    )
}

export default First_info_form;