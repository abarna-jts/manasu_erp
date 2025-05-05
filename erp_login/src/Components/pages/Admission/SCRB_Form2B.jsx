import React from 'react';
import { Container, Row, Col, Form, InputGroup } from 'react-bootstrap';
import { Breadcrumb } from '@themesberg/react-bootstrap';
import { useState } from 'react';

function SCRB_Form2B() {
  const [admissionNumber, setAdmissionNumber] = useState('');
  const [selectedTattoo, setSelectedTattoo] = useState('');
  const [fileNo, setFileNo] = useState('');
  const [addition_tatoo,setAdditionTatoo] = useState('');
  const [scar,setScar] = useState('');
  const [mole, setMole] = useState('');
  const [height, setHeight] = useState('');

  const handleAdmissionChange = (e) => {
    setAdmissionNumber(e.target.value);
  };

  const tattooOptions = [
    "Back Left Side",
    "Back Right Side",
    "Cheek Left",
    "Cheek Right",
    "Chest Middle",
    "Chest Left Side",
    "Chest Right Side",
    "Chin",
    "Ear Left",
    "Ear Right",
    "Eye Brow Left",
    "Eye Brow Right",
    "Face",
    "Foot Left",
    "Foot Right",
    "Forehead",
    "Hip",
    "Toe Right",
    "Thumb Right",
    "Hand Left",
    "Hand Left - Letter",
    "Hand Left - Figure",
    "Hand Right",
    "Forearm Right - Figure",
    "Forearm Right - Letter",
    "Head",
    "Leg Left",
    "Leg Right",
    "Lip Lower",
    "Lip Upper",
    "Neck",
    "Nose",
    "Shoulder Left",
    "Shoulder Right",
    "Stomach",
    "Toe Left",
    "Thumb Left",
    "Thigh Left",
    "Toe Right",
    "Thumb Right",
    "Thigh Right",
    "Palm Right",
    "Palm Left",
    "Finger(s) Left Hand",
    "Finger(s) Right Hand",
    "Finger(s) Left Foot",
    "Finger(s) Right Foot",
    "Ankle",
    "Wrist",
    "Elbow",
    "Abdomen",
    "Upper Arm",
    "Cleft Lip",
    "Knee Right",
    "Knee Left",
    "Rib"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const data = {
      name_ngo: "MANASU (Mana Nala Sugalayam)",
      admissionNumber: admissionNumber,
      file_no: fileNo,
      addition_tatoo: addition_tatoo,
      scar:scar,
      mole:mole,
      height:height,
      tattoo: selectedTattoo,
    };
  
    try {
      const response = await fetch('http://localhost:5000/scrb_form/create_form_2B', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    
      const text = await response.text(); // read plain text instead of JSON
      console.log(text);
    
      if (response.ok) {
        alert(text);
      } else {
        alert('Submission failed!');
      }
    
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred.');
    }
    
    
  };
  
  


  return (
    <>
      <div className="d-xl-flex justify-content-between align-items-center flex-wrap flex-md-nowrap text-start py-2">
        <Row className='w-100'>
          <Col md={3}>
            <div className="d-block mb-4 mb-xl-0 px-4 ">
              <Breadcrumb className="d-none d-md-inline-block mb-0" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
                <Breadcrumb.Item></Breadcrumb.Item>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item active>Admission</Breadcrumb.Item>
              </Breadcrumb>
              <h6 className="breadcrumb_title">SCRB Form</h6>

            </div>
          </Col>

          <Col md={9} className="text-center">
            <h4 className="section_title_1">FORM 2B - FOUND PERSON DETAILS - PHYSICAL PARAMETERS -2</h4>
          </Col>
        </Row>


      </div>

      <Container>
        <Row>


          <div className="d-flex align-items-center px-3">

            <Form className="navbar-search">
              <Form.Group id="topbarSearch" className="d-flex align-items-center">
                <Col md={8}>
                  <Form.Label>Enter Your Admission Number:</Form.Label>
                </Col>
                <Col md={4}>
                  <InputGroup className="input-group-merge search-bar">
                    <Form.Control
                      type="text"
                      value={admissionNumber}
                      onChange={handleAdmissionChange}
                    />
                  </InputGroup>
                </Col>
              </Form.Group>
            </Form>

          </div>

          <div className="container mt-3">
          <Form onSubmit={handleSubmit}>
            <Form.Group as={Row} className="mb-3" controlId="formNGOName">
              <Form.Label column sm="2" className='text-start'>
                NAME OF THE NGO :
              </Form.Label>
              <Col sm="10">
                <Form.Control className='text-center' value={"MANASU (Mana Nala Sugalayam)"} readOnly/>
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formFileNo">
              <Form.Label column sm="2" className='text-start'>
                FILE NO :
              </Form.Label>
              <Col sm="10">
              <Form.Control
                className='text-center'
                type="text"
                required
                value={fileNo}
                onChange={(e) => setFileNo(e.target.value)}
              />

              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formTattoo">
              <Form.Label column sm="2" className="text-start">
                SELECT THE TATOO:
              </Form.Label>
              <Col sm="10">
                <Form.Select
                  aria-label="Tattoo select"
                  value={selectedTattoo}
                  required
                  onChange={(e) => setSelectedTattoo(e.target.value)}
                >
                  <option>Select the Tatoo</option>
                  {tattooOptions.map((label, index) => (
                    <option key={index} value={label}>
                      {label}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Form.Group>

            <Form.Group className='text-start' controlId="formAdditionTatoo">
              <Form.Label>TATOO IN LETTERS :</Form.Label>
              <Form.Control
                type="text"
                value={addition_tatoo}
                onChange={(e) => setAdditionTatoo(e.target.value)}
              />
            </Form.Group>


            <Form.Group className="mb-3 text-start" controlId="Scar">
              <Form.Label>Scar</Form.Label>
              <Form.Control type="text" 
              name='scar'
              value={scar}
              onChange={(e) => setScar(e.target.value)}/>
            </Form.Group>

            <Form.Group className="mb-3 text-start" controlId="formMole">
              <Form.Label>Mole</Form.Label>
              <Form.Control type="text" 
              name='mole'
              value={mole}
              onChange={(e) => setMole(e.target.value)}/>
            </Form.Group>

            <Form.Group className="mb-3 text-start" controlId="formHeight">
              <Form.Label>Height (cms)</Form.Label>
              <Form.Control type="text" 
              name='height'
              value={height}
              onChange={(e) => setHeight (e.target.value)}
              required/>
            </Form.Group>


            <div className="mb-3">

              <button type="submit" className="btn btn-primary">
                Submit Form
              </button>
              </div>
            
          </Form>
          </div>

        </Row>
      </Container>
    </>
  )
}

export default SCRB_Form2B