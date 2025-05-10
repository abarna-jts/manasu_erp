import React from 'react';
import { Breadcrumb, Col, Container, Form, Row, Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function Edit_Rescue_details() {
  const [formData, setFormData] = useState({
    referred_by: '',
    from_place: '',
    date_time: '',
    police_memo: '',
    police_station: '',
    information_public: '',
    admission_date: '',
    admission_no: '',
    rescue_name: '',
    age: '',
    rescue_status: '',
    religion: '',
    language: '',
    education: '',
    father: '',
    mother: '',
    other_relation: '',
    place: '',
    phone_no: '',
    clothing: '',
    dress_code: '',
    complexion: '',
    indentification_mark: '',
    tattoo: '',
    wound_infection: '',
    height: '',
    weight: '',
    things_carried: '',
    remark: '',
    symptoms: '',
    rescued_by: '',
    information: '',
    rescue_relationship: '',
    articles_carried: '',
    f_member_name: '',
    f_member_phone: '',
    f_member_address: '',

    rescue_image: null,
    rescue_image_url: '', // for preview
    f_aadhar_card: null,
    f_aadhar_card_url: '',
    f_ration_card: null,
    f_ration_card_url: '',
    res_aadhar_card: null,
    res_aadhar_card_url: '',
  });
  const { id } = useParams();

  const apiRoute = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
  });

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await apiRoute.get(`/admision/get_rescue_details/${id}`);
        const data = response.data;

        setFormData({
          referred_by: data.referred_by || '',
          from_place: data.from_place || '',
          date_time: data.date_time || '',
          police_memo: data.police_memo || '',
          police_station: data.police_station || '',
          information_public: data.information_public || '',
          admission_date: data.admission_date || '',
          admission_no: data.admission_no || '',
          rescue_name: data.rescue_name || '',
          age: data.age || '',
          rescue_status: data.rescue_status || '',
          religion: data.religion || '',
          language: data.language || '',
          education: data.education || '',
          father: data.father || '',
          mother: data.mother || '',
          other_relation: data.other_relation || '',
          place: data.place || '',
          phone_no: data.phone_no || '',
          clothing: data.clothing || '',
          dress_code: data.dress_code || '',
          complexion: data.complexion || '',
          indentification_mark: data.indentification_mark || '',
          wound_infection: data.wound_infection || '',
          height: data.height || '',
          weight: data.weight || '',
          things_carried: data.things_carried || '',
          remark: data.remark || '',
          symptoms: data.symptoms || '',
          tattoo: data.tattoo || '',
          rescued_by: data.rescued_by || '',
          information: data.information || '',
          rescue_relationship: data.rescue_relationship || '',
          articles_carried: data.articles_carried || '',
          f_member_name: data.f_member_name || '',
          f_member_phone: data.f_member_phone || '',
          f_member_address: data.f_member_address || '',

          rescue_image_url: data.rescue_image,
          f_aadhar_card_url: data.f_aadhar_card,
          f_ration_card_url: data.f_ration_card,
          res_aadhar_card_url: data.res_aadhar_card,
        });
      } catch (error) {
        console.error('Failed to fetch:', error);
      }
    };

    fetchDetails();
  }, [id]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const { name } = e.target;

    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        [name]: file
      }));
    }
  };


  const formatDateTimeLocal = (dateString) => {
    if (!dateString) return ''; // Return empty string if input is invalid or undefined

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return ''; // Invalid date

    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    return localDate.toISOString().slice(0, 16); // "yyyy-MM-ddThh:mm"
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const formatDateOnly = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toISOString().slice(0, 10); // "yyyy-MM-dd"
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("referred_by", formData.referred_by);
    formDataToSend.append("from_place", formData.from_place);
    formDataToSend.append("date_time", formData.date_time);
    formDataToSend.append("police_memo", formData.police_memo);
    formDataToSend.append("police_station", formData.police_station);
    formDataToSend.append("information_public", formData.information_public);
    formDataToSend.append("admission_date", formData.admission_date);
    formDataToSend.append("admission_no", formData.admission_no);

    if (formData.rescue_image) {
      formDataToSend.append("rescue_image", formData.rescue_image);
    }
    if (formData.f_aadhar_card) {
      formDataToSend.append("f_aadhar_card", formData.f_aadhar_card);
    }
    if (formData.f_ration_card) {
      formDataToSend.append("f_ration_card", formData.f_ration_card);
    }
    if (formData.res_aadhar_card) {
      formDataToSend.append("res_aadhar_card", formData.res_aadhar_card);
    }

    try {
      const response = await fetch(`http://localhost:5000/admision/update_first_form/${id}`, {
        method: "PUT", // or "POST" based on your backend route
        body: formDataToSend,
      });

      const result = await response.json();

      if (response.ok) {
        alert("Rescue details updated successfully.");
        window.location.reload();
      } else {
        console.error("Update failed:", result.message);
      }
    } catch (err) {
      console.error("Error while updating:", err);
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
          <h6 className="breadcrumb_title">Rescue Details</h6>

        </div>

        <Col md={9} className="text-center">
          <h4 className="section_title_1">Edit Rescue Details</h4>
        </Col>
      </div>

      <Container>
        <Row >
          <Col md={12}>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={8}>
                  <h5 className="pdfsub_heading">Rescue Details:</h5>
                  <Form.Group as={Row} className="mb-1 text-start" controlId="formEmailID">
                    <Form.Label column sm="4">
                      Rescued / Referred by :
                    </Form.Label>
                    <Col sm="8">
                      <Form.Control
                        name="referred_by"
                        type="text"
                        value={formData.referred_by}
                        onChange={handleInputChange}
                        required
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-1 text-start" controlId="formTakenFrom">
                    <Form.Label column sm="4">
                      Taken From :
                    </Form.Label>
                    <Col sm="8">
                      <Form.Control
                        name="from_place"
                        type='text'
                        value={formData.from_place}
                        onChange={handleInputChange}
                        required />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className="mb-1 text-start" controlId="formDateTime">
                    <Form.Label column sm="4">
                      Date & Time :
                    </Form.Label>
                    <Col sm="8">
                      <Form.Control
                        name="date_time"
                        type='datetime-local'
                        value={formatDateTimeLocal(formData.date_time)}// Make sure `rescueDate` is a valid date string
                        onChange={handleInputChange}
                        required />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className="mb-1 text-start" controlId="formPoliceMemo">
                    <Form.Label column sm="4">
                      Police Memo :
                    </Form.Label>
                    <Col sm="8">
                      <Form.Control
                        name="police_memo"
                        type='text'
                        value={formData.police_memo}
                        onChange={handleInputChange}
                        required />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className="mb-1 text-start" controlId="formPoliceStation">
                    <Form.Label column sm="4">
                      Police Station :
                    </Form.Label>
                    <Col sm="8">
                      <Form.Control
                        name="police_station"
                        type='text'
                        value={formData.police_station}
                        onChange={handleInputChange}
                        required />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className="mb-1 text-start" controlId="formInformation">
                    <Form.Label column sm="4">
                      Information from Public / Spot :
                    </Form.Label>
                    <Col sm="8">
                      <Form.Control
                        name="information_public"
                        type='text'
                        value={formData.information_public}
                        onChange={handleInputChange}
                        required />
                    </Col>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group as={Row} className="mb-1 text-start" controlId="formDate">
                    <Form.Label column sm="5">
                      Date :
                    </Form.Label>
                    <Col sm="7">
                      <Form.Control
                        name="date"
                        type='date'
                        value={formatDateOnly(formData.admission_date)}
                        onChange={handleInputChange}
                        required />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-1 text-start" controlId="formAdmissionNo">
                    <Form.Label column sm="5">
                      Admission Number :
                    </Form.Label>
                    <Col sm="7">
                      <Form.Control
                        name="admission_no"
                        type='number'
                        value={formData.admission_no}
                        onChange={handleInputChange}
                        required />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} controlId="formFile" className="mb-3 text-start">
                    <Form.Label column sm="5">
                      Rescue Image :
                    </Form.Label>
                    <Col sm="7 d-flex flex-column align-items-center">

                      {formData.rescue_image_url && (
                        <img
                          src={`http://localhost:5000/${formData.rescue_image_url}`}
                          alt="Rescue Preview"
                          style={{ marginTop: '10px', width: '100px', maxHeight: '200px', objectFit: 'cover' }}
                        />
                      )}
                      <Form.Control
                        type="file"
                        name="rescue_image"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </Col>
                  </Form.Group>

                </Col>
                <Col md={8}>
                  <h5 className="pdfsub_heading">Inmate Details:</h5>
                  <Form.Group as={Row} className="mb-1 text-start" controlId="formRescueName">
                    <Form.Label column sm="4">
                      Name :
                    </Form.Label>
                    <Col sm="8">
                      <Form.Control
                        name="rescue_name"
                        type='text'
                        value={formData.rescue_name}
                        onChange={handleInputChange}
                        required />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-1 text-start" controlId="formAge">
                    <Form.Label column sm="4">
                      Age :
                    </Form.Label>
                    <Col sm="8">
                      <Form.Control
                        name="age"
                        type='number'
                        value={formData.age}
                        onChange={handleInputChange}
                        required />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-1 text-start" controlId="formEducation">
                    <Form.Label column sm="4">
                      Education :
                    </Form.Label>
                    <Col sm="8">
                      <Form.Control
                        name="education"
                        type='text'
                        value={formData.education}
                        onChange={handleInputChange}
                        required />
                    </Col>
                  </Form.Group>
                  <Row className="d-flex">
                    <Col md={4}>
                      <Form.Group as={Row} className="mb-1 text-start" controlId="formStatus">
                        <Form.Label column sm="5">
                          Status :
                        </Form.Label>
                        <Col sm="7">
                          <Form.Control
                            name="rescue_status"
                            type='text'
                            value={formData.rescue_status}
                            onChange={handleInputChange}
                            required />
                        </Col>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group as={Row} className="mb-1 text-start" controlId="formReligion">
                        <Form.Label column sm="5">
                          Religion :
                        </Form.Label>
                        <Col sm="7">
                          <Form.Control
                            name="religion"
                            type='text'
                            value={formData.religion}
                            onChange={handleInputChange}
                            required />
                        </Col>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group as={Row} className="mb-1 text-start" controlId="formLanguage">
                        <Form.Label column sm="6">
                          Language :
                        </Form.Label>
                        <Col sm="6">
                          <Form.Control
                            name="language"
                            type='text'
                            value={formData.language}
                            onChange={handleInputChange}
                            required />
                        </Col>
                      </Form.Group>
                    </Col>
                  </Row>
                </Col>
                <Col md={8}>
                  <h5 className="pdfsub_heading">Family Details:</h5>
                  <Form.Group as={Row} className="mb-1 text-start" controlId="formFather">
                    <Form.Label column sm="4">
                      Father :
                    </Form.Label>
                    <Col sm="8">
                      <Form.Control
                        name="father"
                        type='text'
                        value={formData.father}
                        onChange={handleInputChange}
                        required />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-1 text-start" controlId="formMother">
                    <Form.Label column sm="4">
                      Mother :
                    </Form.Label>
                    <Col sm="8">
                      <Form.Control
                        name="mother"
                        type='text'
                        value={formData.mother}
                        onChange={handleInputChange}
                        required />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-1 text-start" controlId="formanyother">
                    <Form.Label column sm="4">
                      Any other :
                    </Form.Label>
                    <Col sm="8">
                      <Form.Control
                        name="other_relation"
                        type='text'
                        value={formData.other_relation}
                        onChange={handleInputChange}
                        required />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-1 text-start" controlId="formPlace">
                    <Form.Label column sm="4">
                      Place :
                    </Form.Label>
                    <Col sm="8">
                      <Form.Control
                        name="place"
                        type='text'
                        value={formData.place}
                        onChange={handleInputChange}
                        required />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-1 text-start" controlId="formContactNo">
                    <Form.Label column sm="4">
                      Contact Number :
                    </Form.Label>
                    <Col sm="8">
                      <Form.Control
                        name="phone_no"
                        type='text'
                        value={formData.phone_no}
                        onChange={handleInputChange}
                        required />
                    </Col>
                  </Form.Group>
                </Col>
                <Col md={8}>
                  <h5 className="pdfsub_heading">Physical Appearance:</h5>
                  <Form.Group as={Row} className="mb-1 text-start" controlId="formClothing">
                    <Form.Label column sm="4">
                      Clothing :
                    </Form.Label>
                    <Col sm="8">
                      <Form.Control
                        name="clothing"
                        type='text'
                        value={formData.clothing}
                        onChange={handleInputChange}
                        required />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-1 text-start" controlId="formDressColor">
                    <Form.Label column sm="4">
                      Dress Color :
                    </Form.Label>
                    <Col sm="8">
                      <Form.Control
                        name="dress_code"
                        type='text'
                        value={formData.dress_code}
                        onChange={handleInputChange}
                        required />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-1 text-start" controlId="formComplexion">
                    <Form.Label column sm="4">
                      Complexion :
                    </Form.Label>
                    <Col sm="8">
                      <Form.Control
                        name="complexion"
                        type='text'
                        value={formData.complexion}
                        onChange={handleInputChange}
                        required />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-1 text-start" controlId="formIdentificationMark">
                    <Form.Label column sm="4">
                      Indentification Mark :
                    </Form.Label>
                    <Col sm="8">
                      <Form.Control
                        name="indentification_mark"
                        type='text'
                        value={formData.indentification_mark}
                        onChange={handleInputChange}
                        required />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-1 text-start" controlId="formTatoo">
                    <Form.Label column sm="4">
                      Tattoo :
                    </Form.Label>
                    <Col sm="8">
                      <Form.Control
                        name="tattoo"
                        type='text'
                        value={formData.tattoo}
                        onChange={handleInputChange}
                        required />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-1 text-start" controlId="formWound">
                    <Form.Label column sm="4">
                      Any Wound/ infection :
                    </Form.Label>
                    <Col sm="8">
                      <Form.Control
                        name="wound_infection"
                        type='text'
                        value={formData.wound_infection}
                        onChange={handleInputChange}
                        required />
                    </Col>
                  </Form.Group>
                  <Row>

                    <Col md={6}>
                      <Form.Group as={Row} className="mb-1 text-start" controlId="formHeight">
                        <Form.Label column sm="8">
                          Height :
                        </Form.Label>
                        <Col sm="4">
                          <Form.Control
                            name="height"
                            type='number'
                            value={formData.height}
                            onChange={handleInputChange}
                            required />
                        </Col>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group as={Row} className="mb-1 text-start" controlId="formWeight">
                        <Form.Label column sm="4">
                          Weight :
                        </Form.Label>
                        <Col sm="8">
                          <Form.Control
                            name="weight"
                            type='number'
                            value={formData.weight}
                            onChange={handleInputChange}
                            required />
                        </Col>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group as={Row} className="mb-1 text-start" controlId="formThingsCarried">
                    <Form.Label column sm="4">
                      Things carried :
                    </Form.Label>
                    <Col sm="8">
                      <Form.Control
                        name="things_carried"
                        type='text'
                        value={formData.things_carried}
                        onChange={handleInputChange}
                        required />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-1 text-start" controlId="formRemark">
                    <Form.Label column sm="4">
                      Remark :
                    </Form.Label>
                    <Col sm="8">
                      <Form.Control
                        as="textarea"
                        name="remark"
                        type='text'
                        value={formData.remark || 'null'}
                        onChange={handleInputChange} />
                    </Col>
                  </Form.Group>
                </Col>
                <Col md={8}>
                  <h5 className="pdfsub_heading">Mental Status:</h5>
                  <Form.Group as={Row} className="mb-1 text-start" controlId="formSymptoms">
                    <Form.Label column sm="4">
                      Symptoms :
                    </Form.Label>
                    <Col sm="8">
                      <Form.Control
                        as="textarea"
                        name="symptoms"
                        type='text'
                        value={formData.symptoms}
                        onChange={handleInputChange}
                        required />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-1 text-start" controlId="formIntimated">
                    <Form.Label column sm="4">
                      Intimated / Rescued by :
                    </Form.Label>
                    <Col sm="8">
                      <Form.Control
                        name="rescued_by"
                        type='text'
                        value={formData.rescued_by}
                        onChange={handleInputChange}
                        required />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-1 text-start" controlId="formInformation">
                    <Form.Label column sm="4">
                      Information filed by :
                    </Form.Label>
                    <Col sm="8">
                      <Form.Control
                        name="information"
                        type='text'
                        value={formData.information}
                        onChange={handleInputChange}
                        required />
                    </Col>
                  </Form.Group>
                </Col>
                <Col md={8}>
                  <h5 className="pdfsub_heading">Articles carried from Rescue:</h5>

                  <Form.Group as={Row} className="mb-1 text-start" controlId="formRescueName">
                    <Form.Label column sm="4">
                      Name :
                    </Form.Label>
                    <Col sm="8">
                      <Form.Control
                        name="rescue_name"
                        value={formData.rescue_name}
                        onChange={handleInputChange} />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className="mb-1 text-start" controlId="formArticles">
                    <Form.Label column sm="4">
                      Items Found During Rescue :
                    </Form.Label>
                    <Col sm="8">
                      <Form.Control
                        as="textarea"
                        name="articles_carried"
                        type='text'
                        value={formData.articles_carried}
                        onChange={handleInputChange}
                        required />
                    </Col>
                  </Form.Group>
                </Col>
                <Col md={8}>
                  <h5 className="pdfsub_heading">Family Member Identification:</h5>
                  <Form.Group as={Row} className="mb-1 text-start" controlId="formRelationship">
                    <Form.Label column sm="4">
                      Relationship :
                    </Form.Label>
                    <Col sm="8">
                      <Form.Control
                        name="rescue_relationship"
                        type='text'
                        value={formData.rescue_relationship}
                        onChange={handleInputChange}
                        required />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-1 text-start" controlId="formMemberName">
                    <Form.Label column sm="4">
                      Family Member Name :
                    </Form.Label>
                    <Col sm="8">
                      <Form.Control
                        name="f_member_name"
                        type='text'
                        value={formData.f_member_name}
                        onChange={handleInputChange}
                        required />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-1 text-start" controlId="formMemberPhone">
                    <Form.Label column sm="4">
                      Family Member Phone No. :
                    </Form.Label>
                    <Col sm="8">
                      <Form.Control
                        name="f_member_phone"
                        type='text'
                        value={formData.f_member_phone}
                        onChange={handleInputChange}
                        required />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-1 text-start" controlId="formMemberAddress">
                    <Form.Label column sm="4">
                      Family Member Address :
                    </Form.Label>
                    <Col sm="8">
                      <Form.Control
                        name="f_member_address"
                        type='text'
                        value={formData.f_member_address}
                        onChange={handleInputChange}
                        required />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-1 text-start" controlId="formAdharCard">
                    <Form.Label column sm="4">
                      Family Member Aadhar Card Original :
                    </Form.Label>
                    <Col sm="8" className='d-flex align-items-center justify-content-center'>
                      {formData.f_aadhar_card_url && (
                        <img
                          src={`http://localhost:5000/${formData.f_aadhar_card_url}`}
                          alt="Rescue Preview"
                          style={{ marginTop: '10px', width: '100px', maxHeight: 'auto', objectFit: 'cover' }}
                        />
                      )}
                      <Form.Control
                        className='mx-3'
                        type="file"
                        name="f_aadhar_card"
                        onChange={handleFileChange}
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-1 text-start" controlId="formRationCard">
                    <Form.Label column sm="4">
                      Ration Card :
                    </Form.Label>
                    <Col sm="8" className='d-flex align-items-center justify-content-center'>
                      {formData.f_ration_card_url && (
                        <img
                          src={`http://localhost:5000/${formData.f_ration_card_url}`}
                          alt="Rescue Preview"
                          style={{ marginTop: '10px', width: '100px', maxHeight: 'auto', objectFit: 'cover' }}
                        />
                      )}
                      <Form.Control
                        className='mx-3'
                        type="file"
                        name="f_ration_card"
                        onChange={handleFileChange}
                      />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-1 text-start" controlId="formRescueAadhar">
                    <Form.Label column sm="4">
                      Rescue Aadhar Card :
                    </Form.Label>
                    <Col sm="8" className='d-flex align-items-center justify-content-center'>
                      {formData.res_aadhar_card_url && (
                        <img
                          src={`http://localhost:5000/${formData.res_aadhar_card_url}`}
                          alt="Rescue Preview"
                          style={{ marginTop: '10px', width: '100px', maxHeight: 'auto', objectFit: 'cover' }}
                        />
                      )}
                      <Form.Control
                        className='mx-3'
                        type="file"
                        name="res_aadhar_card"
                        onChange={handleFileChange}
                      />
                    </Col>
                  </Form.Group>
                </Col>
              </Row>
              <Button type="submit">Update</Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default Edit_Rescue_details
