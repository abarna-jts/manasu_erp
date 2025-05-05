import React from 'react';
import { Breadcrumb } from '@themesberg/react-bootstrap';
import { Container, Row, Col, Form, InputGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect} from 'react';
import axios from 'axios';
import { useRef } from "react";
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

function SCRB_Form2B() {
  const [admissionNumber, setAdmissionNumber] = useState('');
  const [selectedTattoos, setSelectedTattoos] = useState('');
  const [fileNo, setFileNo] = useState('');
  const [addition_tatoo, setAdditionTatoo] = useState('');
  const [scar, setScar] = useState('');
  const [mole, setMole] = useState('');
  const [height, setHeight] = useState('');

  const [formData, setFormData] = useState({
      name_ngo: 'MANASU (Mana Nala Sugalayam)',
      admissionNumber: '',
      file_no: '',
      addition_tatoo: '',
      scar: '',
      mole: '',
      height: ''
    });

  const handleAdmissionChange = (e) => {
    setAdmissionNumber(e.target.value);
  };


  const tattooRows = [
    { id: 1, bodyPart: "Back Left Side" },
    { id: 2, bodyPart: "Back Right Side" },
    { id: 3, bodyPart: "Cheek Left" },
    { id: 4, bodyPart: "Cheek Right" },
    { id: 5, bodyPart: "Chest Middle" },
    { id: 6, bodyPart: "Chest Left Side" },
    { id: 7, bodyPart: "Chest Right Side" },
    { id: 8, bodyPart: "Chin" },
    { id: 9, bodyPart: "Ear Left" },
    { id: 10, bodyPart: "Ear Right" },
    { id: 11, bodyPart: "Eye Brow Left" },
    { id: 12, bodyPart: "Eye Brow Right" },
    { id: 13, bodyPart: "Face" },
    { id: 14, bodyPart: "Foot Left" },
    { id: 15, bodyPart: "Foot Right" },
    { id: 16, bodyPart: "Forehead" },
    { id: 17, bodyPart: "Hip" },
    { id: 18, bodyPart: "Toe Right" },
    { id: 19, bodyPart: "Thumb Right" },
    { id: 20, bodyPart: "Hand Left" },
    { id: 21, bodyPart: "Hand Left - Letter" },
    { id: 22, bodyPart: "Hand Left - Figure" },
    { id: 23, bodyPart: "Hand Right" },
    { id: 24, bodyPart: "Forearm Right - Figure" },
    { id: 25, bodyPart: "Forearm Right - Letter" },
    { id: 26, bodyPart: "Head" },
    { id: 27, bodyPart: "Leg Left" },
    { id: 28, bodyPart: "Leg Right" },
    { id: 29, bodyPart: "Lip Lower" },
    { id: 30, bodyPart: "Lip Upper" },
    { id: 31, bodyPart: "Neck" },
    { id: 32, bodyPart: "Nose" },
    { id: 33, bodyPart: "Shoulder Left" },
    { id: 34, bodyPart: "Shoulder Right" },
    { id: 35, bodyPart: "Stomach" },
    { id: 36, bodyPart: "Toe Left" },
    { id: 37, bodyPart: "Thumb Left" },
    { id: 38, bodyPart: "Thigh Left" },
    { id: 39, bodyPart: "Thigh Right" },
    { id: 40, bodyPart: "Palm Right" },
    { id: 41, bodyPart: "Palm Left" },
    { id: 42, bodyPart: "Finger(s) Left Hand" },
    { id: 43, bodyPart: "Finger(s) Right Hand" },
    { id: 44, bodyPart: "Finger(s) Left Foot" },
    { id: 45, bodyPart: "Finger(s) Right Foot" },
    { id: 46, bodyPart: "Ankle" },
    { id: 47, bodyPart: "Wrist" },
    { id: 48, bodyPart: "Elbow" },
    { id: 49, bodyPart: "Abdomen" },
    { id: 50, bodyPart: "Upper Arm" },
    { id: 51, bodyPart: "Cleft Lip" },
    { id: 52, bodyPart: "Knee Right" },
    { id: 53, bodyPart: "Knee Left" },
    { id: 54, bodyPart: "Rib" }
  ];

  const createFormData = () => {
    const targetElement = document.querySelector('.form_2B');
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  }


  const handleTattooCheckboxChange = (bodyPart) => {
    const current = selectedTattoos ? selectedTattoos.split(', ') : [];
  
    let updated;
    if (current.includes(bodyPart)) {
      updated = current.filter(item => item !== bodyPart);
    } else {
      updated = [...current, bodyPart];
    }
  
    setSelectedTattoos(updated.join(', '));
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      name_ngo: "MANASU (Mana Nala Sugalayam)",
      admissionNumber: admissionNumber,
      file_no: fileNo,
      addition_tatoo: addition_tatoo,
      scar: scar,
      mole: mole,
      height: height,
      tattoo: selectedTattoos,
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

  const formRef = useRef();

  const generatePDF = async (mode) => {
    const input = formRef.current;
  
    if (!input) {
      console.error("Form reference is not defined");
      return;
    }
  
    // Ensure html2canvas renders the form
    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
  
    const pdf = new jsPDF('p', 'mm', 'a4'); // portrait, millimeters, A4
  
    // Calculate width/height to fit A4 page
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
  
    // Open PDF in a new tab
    const pdfBlob = pdf.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
  
    window.open(pdfUrl, '_blank'); // Full screen preview
  };
  


  const fetchFormData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/scrb_form/get_scrb_form2bdata/${admissionNumber}`);
      const data = response.data;
  
      setFormData((formData) => ({
        ...formData,
        file_no: data.file_no || '',
        addition_tatoo: data.addition_tatoo || '',
        scar: data.scar || '',
        mole: data.mole || '',
        height: data.height || ''
      }));
  
      setSelectedTattoos(data.selectedTattoos || []);
  
      // Trigger PDF generation here after form data is fetched
      generatePDF("preview");
    } catch (error) {
      console.error("Error fetching form data:", error);
      alert("Admission Number not found");
    }
  };
  

  useEffect(() => {
    if (formData.file_no && selectedTattoos.length > 0) {
      generatePDF("preview");
    }
  }, [formData, selectedTattoos]);
  
  


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

            <Form className="navbar-search col-md-9">
              <Form.Group id="topbarSearch" className="d-flex align-items-center">
                <Col md={3}>
                  <Form.Label>Enter Your Admission Number:</Form.Label>
                </Col>
                <Col md={2}>
                  <InputGroup className="input-group-merge search-bar">
                    <Form.Control
                      type="text"
                      value={admissionNumber}
                      onChange={handleAdmissionChange}
                    />
                  </InputGroup>
                </Col>
                <button type="button" className="btn btn-secondary mx-3" onClick={() => {
                  if (!admissionNumber.trim()) {
                    alert("Please enter your admission number.");
                  } else {
                    fetchFormData(); // Fetch & populate data before generating PDF
                  }
                }}><FontAwesomeIcon icon={faEye} className="me-0" /></button>
                <button type="button" className="btn btn-primary mx-1" onClick={() => {
                  if (!admissionNumber.trim()) {
                    alert("Please enter your admission number.");
                  } else {
                    createFormData(); // Fetch & populate data before generating PDF
                  }
                }}><FontAwesomeIcon icon={faPlus} className="me-0" /></button>
              </Form.Group>
            </Form>

          </div>

          <div className="container mt-3">
            <form className='form_2B' onSubmit={handleSubmit}>
              <table className="table table-bordered" style={{ border: "2px solid rgb(143 143 143)", marginBottom: "0rem" }}>
                <tbody>
                  <tr>
                    <td style={{ width: '35%' }}>
                      <div className="row">
                        <div className="col-md-12">
                          <label>NAME OF THE NGO</label>
                        </div>
                      </div>
                    </td>
                    <td style={{ width: '65%' }}>
                      <div className="row">
                        <div className="col-md-12">
                          <input
                            type="text"
                            name="name_ngo"
                            className="form-control text-center"
                            value={"MANASU (Mana Nala Sugalayam)"}
                            readOnly

                          />
                        </div>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td style={{ width: '35%' }}>
                      <div className="row">
                        <div className="col-md-12">
                          <label>FILE NO </label>
                        </div>
                      </div>
                    </td>
                    <td style={{ width: '65%' }}>
                      <div className="row">
                        <div className="col-md-12">
                          <input
                            type="text"
                            name="file_no"
                            value={fileNo}
                            onChange={(e) => setFileNo(e.target.value)}
                            className="form-control text-center"
                            required
                          />
                        </div>

                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table style={{ width: "100%", borderCollapse: "collapse" }} border="1" className="form_2A_table">
                <thead>
                  <tr>
                    <th>TATTOO</th>
                    <th>TICK</th>
                    <th>TATTOO</th>
                    <th>TICK</th>
                    <th>TATTOO</th>
                    <th>TICK</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: Math.ceil(tattooRows.length / 3) }, (_, i) => {
                    const group = tattooRows.slice(i * 3, i * 3 + 3);
                    return (
                      <tr key={i}>
                        {group.map((row) => (
                          <React.Fragment key={row.id}>
                            <td>{row.bodyPart}</td>
                            <td>
                              <input
                                type="checkbox"
                                onChange={() => handleTattooCheckboxChange(row.bodyPart)}
                                checked={selectedTattoos.includes(row.bodyPart)}
                              />
                            </td>
                          </React.Fragment>
                        ))}
                        {/* Fill empty cells if row has less than 3 items */}
                        {group.length < 3 &&
                          Array.from({ length: 3 - group.length }).map((_, idx) => (
                            <React.Fragment key={`empty-${idx}`}>
                              <td></td>
                              <td></td>
                            </React.Fragment>
                          ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <table className="table table-bordered" style={{ border: "2px solid rgb(143 143 143)" }}>
                <tbody>
                  <tr>
                    <td>
                      <div className="mb-3 text-start">
                        <label>Tattoo in Letters:</label>
                        <textarea
                          className="form-control"
                          name="addition_tatoo"
                          rows="2"
                          value={addition_tatoo}
                          onChange={(e) => setAdditionTatoo(e.target.value)}
                          required
                        ></textarea>
                      </div>
                      <div className="mb-3 text-start">
                        <label>Scar:</label>
                        <textarea
                          className="form-control"
                          name="scar"
                          rows="2"
                          value={scar}
                          onChange={(e) => setScar(e.target.value)}
                          required
                        ></textarea>
                      </div>
                      <div className="mb-3 text-start">
                        <label>Mole:</label>
                        <textarea
                          className="form-control"
                          name="mole"
                          value={mole}
                          onChange={(e) => setMole(e.target.value)}
                          rows="2"
                          required
                        ></textarea>

                      </div>
                      <div className="mb-3 text-start">
                        <label>Height (cms):</label>
                        <textarea
                          className="form-control"
                          name="height"
                          value={height}
                          onChange={(e) => setHeight(e.target.value)}
                          rows="2"
                          required
                        ></textarea>

                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="mb-3">

                <button type="submit" className="btn btn-primary mx-3">
                  Submit Form
                </button>

              </div>
            </form>
          </div>

          {/* pdf view content */}
          <div ref={formRef} style={{ position: "absolute", left: "-9999px", top: 0, background: "#fff", padding: "20px", width: "210mm" }}>
              <h4 className="text-center">FORM 2B - PDF PREVIEW</h4>
              <form className='form_2B'>
              <table className="table table-bordered" style={{ border: "2px solid rgb(143 143 143)", marginBottom: "0rem" }}>
                <tbody>
                  <tr>
                    <td style={{ width: '35%' }}>
                      <div className="row">
                        <div className="col-md-12">
                          <label>NAME OF THE NGO</label>
                        </div>
                      </div>
                    </td>
                    <td style={{ width: '65%' }}>
                      <div className="row">
                        <div className="col-md-12">
                          <input
                            type="text"
                            name="name_ngo"
                            className="form-control text-center"
                            value={"MANASU (Mana Nala Sugalayam)"}
                            readOnly

                          />
                        </div>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td style={{ width: '35%' }}>
                      <div className="row">
                        <div className="col-md-12">
                          <label>FILE NO </label>
                        </div>
                      </div>
                    </td>
                    <td style={{ width: '65%' }}>
                      <div className="row">
                        <div className="col-md-12">
                          <input
                            type="text"
                            name="file_no"
                            value={fileNo}
                            onChange={(e) => setFileNo(e.target.value)}
                            className="form-control text-center"
                            required
                          />
                        </div>

                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <table style={{ width: "100%", borderCollapse: "collapse" }} border="1" className="form_2A_table">
                <thead>
                  <tr>
                    <th>TATTOO</th>
                    <th>TICK</th>
                    <th>TATTOO</th>
                    <th>TICK</th>
                    <th>TATTOO</th>
                    <th>TICK</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: Math.ceil(tattooRows.length / 3) }, (_, i) => {
                    const group = tattooRows.slice(i * 3, i * 3 + 3);
                    return (
                      <tr key={i}>
                        {group.map((row) => (
                          <React.Fragment key={row.id}>
                            <td>{row.bodyPart}</td>
                            <td>
                              <input
                                type="checkbox"
                                onChange={() => handleTattooCheckboxChange(row.bodyPart)}
                                checked={selectedTattoos.includes(row.bodyPart)}
                              />
                            </td>
                          </React.Fragment>
                        ))}
                        {/* Fill empty cells if row has less than 3 items */}
                        {group.length < 3 &&
                          Array.from({ length: 3 - group.length }).map((_, idx) => (
                            <React.Fragment key={`empty-${idx}`}>
                              <td></td>
                              <td></td>
                            </React.Fragment>
                          ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <table className="table table-bordered" style={{ border: "2px solid rgb(143 143 143)" }}>
                <tbody>
                  <tr>
                    <td>
                      <div className="mb-3 text-start">
                        <label>Tattoo in Letters:</label>
                        <textarea
                          className="form-control"
                          name="addition_tatoo"
                          rows="2"
                          value={addition_tatoo}
                          onChange={(e) => setAdditionTatoo(e.target.value)}
                          required
                        ></textarea>
                      </div>
                      <div className="mb-3 text-start">
                        <label>Scar:</label>
                        <textarea
                          className="form-control"
                          name="scar"
                          rows="2"
                          value={scar}
                          onChange={(e) => setScar(e.target.value)}
                          required
                        ></textarea>
                      </div>
                      <div className="mb-3 text-start">
                        <label>Mole:</label>
                        <textarea
                          className="form-control"
                          name="mole"
                          value={mole}
                          onChange={(e) => setMole(e.target.value)}
                          rows="2"
                          required
                        ></textarea>

                      </div>
                      <div className="mb-3 text-start">
                        <label>Height (cms):</label>
                        <textarea
                          className="form-control"
                          name="height"
                          value={height}
                          onChange={(e) => setHeight(e.target.value)}
                          rows="2"
                          required
                        ></textarea>

                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              
            </form>
          </div>
        </Row>
      </Container>
    </>
  )
}

export default SCRB_Form2B
