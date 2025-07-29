import React from 'react';
import { Breadcrumb } from '@themesberg/react-bootstrap';
import { Container, Row, Col, Form, InputGroup, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPlus, faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRef } from "react";
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useNavigate } from "react-router-dom";
import { Alert } from "react-bootstrap";
import manasu_logo from '../Admission/Manasu-Logo.png';

function SCRB_Form2B() {
  const [admission_no, setAdmissionNumber] = useState('');
  const [selectedTattoos, setSelectedTattoos] = useState('');
  // const [fileNo, setFileNo] = useState('');
  // const [addition_tatoo, setAdditionTatoo] = useState('');
  // const [scar, setScar] = useState('');
  // const [mole, setMole] = useState('');
  // const [height, setHeight] = useState('');
  const [rescueImage, setRescueImage] = useState(null);
  const [rescueName, setRescueName] = useState("");
  const [error, setError] = useState("");
  const [previewRequested, setPreviewRequested] = useState(false);

  const apiRoute = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
  });

  const [formData, setFormData] = useState({
    name_ngo: 'MANASU (Mental Health Charity Home)',
    admission_no: '',
    file_no: '',
    addition_tatoo: '',
    scar: '',
    mole: '',
    height: ''
  });

  const handleAdmissionChange = (e) => {
    setAdmissionNumber(e.target.value);
  };

  //alert box values
  const [submissionMessage, setSubmissionMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'danger'


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
    { id: 54, bodyPart: "Rib" },
    { id: 55, bodyPart: "No Tattoos" },
    { id: 56, bodyPart: "No Tattoos" },
    { id: 57, bodyPart: "No Tattoos" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };


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

    if (!admission_no || admission_no.trim() === '') {
      alert("Admission Number is required.");
      return;
    }

    const trimmedAdNo = admission_no.trim();

    if (!/^\d{8}$/.test(trimmedAdNo) && !/^\d{10}$/.test(trimmedAdNo)) {
      alert("Admission Number must be exactly 8 or 10 digits (numbers only).");
      return;
    }

    if (selectedTattoos.length === 0) {
      alert("Please select at least one Tattoo option.");
      return;
    }

    const payload = {
      ...formData,
      admission_no,
      tattoo: selectedTattoos,
    };

    // const data = {
    //   name_ngo: "MANASU (Mana Nala Sugalayam)",
    //   admission_no: admission_no,
    //   file_no: fileNo,
    //   addition_tatoo: addition_tatoo,
    //   scar: scar,
    //   mole: mole,
    //   height: height,
    //   tattoo: selectedTattoos,
    // };

    try {
      const response = await apiRoute.post('/scrb_form/create_form_2B', payload);
      console.log(response.data);
      if (response.status === 201 || response.status === 200) {
        alert("SCRB Form2B Submitted Successfuly");
        setFormData({
          admission_no: '',
          file_no: '',
          addition_tatoo: '',
          scar: '',
          mole: '',
          height: ''
        })
        setAdmissionNumber("");
        setSelectedTattoos("");
      } else {
        setSubmissionMessage("Submission failed.");
        setMessageType("danger");
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message);
      } else {
        alert("Something went wrong.");
      }
      console.error("Error submitting form", error);
      setSubmissionMessage("Something went wrong.");
      setMessageType("danger");
    }
  };

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



  const fetchFormData = async () => {
    try {
      const response = await apiRoute.get(`/scrb_form/get_scrb_form2bdata/${admission_no}`);
      const data = response.data;

      setFormData((prev) => ({
        ...prev,
        file_no: data.file_no || '',
        addition_tatoo: data.addition_tatoo || '',
        scar: data.scar || '',
        mole: data.mole || '',
        height: data.height || ''
      }));

      setSelectedTattoos(data.tatoo || []);

      // Wait for DOM update then generate PDF
      setTimeout(() => {
        generatePDF();
      }, 300); // 300ms delay to allow state render
    } catch (error) {
      console.error("Error fetching form data:", error);
      alert("Admission Number not found");
    }
  };


  const handleDownload = async () => {
    try {
      const response = await apiRoute.get(`/scrb_form/getAllSCRBForm2B`);
      console.log("Full response:", response);

      const fetchedData = response.data?.data; // <-- Correct way to access it
      console.log("Fetched data:", fetchedData);

      if (!Array.isArray(fetchedData) || fetchedData.length === 0) {
        alert("No form data available to export.");
        return;
      }

      exportToExcel(fetchedData);
    } catch (error) {
      console.error("Error fetching or downloading:", error);
      alert("This form does not have a valid admission number.");
    }
  };

  const exportToExcel = (data) => {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      alert("Invalid data for Excel export.");
      return;
    }

    const rows = Array.isArray(data) ? data : [data];

    // Convert keys to UPPERCASE
    const transformedRows = rows.map(row => {
      const newRow = {};
      for (let key in row) {
        newRow[key.toUpperCase()] = row[key];
      }
      return newRow;
    });

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(transformedRows);

    // Dynamically set column widths
    const keys = Object.keys(transformedRows[0]);
    worksheet['!cols'] = [
      { wch: 10 }, // Column A
      { wch: 35 }, // Column B
      { wch: 15 }, // Column C
      { wch: 15 },
      { wch: 30 },
      { wch: 30 },
      { wch: 30 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
    ];

    // Create workbook and append worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "SCRB Form");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const fileData = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(fileData, `SCRB_Form2B_${admission_no}.xlsx`);
  };

  const navigate = useNavigate();

  const handleNextpage = () => {
    navigate("/scrb_form2C");

  }

  const handleBackPage = () => {
    navigate("/scrb_form2A");
  }


  // Mock API call or fetch
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
    if (admission_no.trim() !== "") {
      fetchRescueDetails(admission_no);
    } else {
      setRescueImage(null);
      setRescueName("");
      setError("");
    }
  }, [admission_no]);

  const EditSCRBForm2B = async () => {
    navigate("/scrb_form2bALL");
  }


  return (
    <>
      <div className="d-xl-flex justify-content-between align-items-center flex-wrap flex-md-nowrap text-start py-2">
        <Row className='w-100 d-flex align-items-center'>
          <Col md={2}>
            <div className="d-block mb-4 mb-xl-0 form_2A_breadcrumb">
              <Breadcrumb className="d-none d-md-inline-block mb-0" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
                <Breadcrumb.Item></Breadcrumb.Item>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item active>Admission</Breadcrumb.Item>
              </Breadcrumb>
              <h6 className="breadcrumb_title">SCRB Form</h6>

            </div>
          </Col>

          <Col md={8} className="text-center">
            <h4 className="section_title_1">FORM 2B - FOUND PERSON DETAILS - PHYSICAL PARAMETERS -2</h4>
          </Col>

          <Col md={1} className='text-center'>
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


      </div>

      <Container>
        <Row>
          <Col md={12}>
            <Row>
              <Col md={8}>
                <div className="d-flex align-items-center px-3">

                  <Form className="navbar-search col-md-9">
                    <Form.Group id="topbarSearch" className="d-flex align-items-center">
                      <Col md={4}>
                        <Form.Label>Admission Number:</Form.Label>
                      </Col>
                      <Col md={3}>
                        <InputGroup className="input-group-merge search-bar">
                          <Form.Control
                            type="text"
                            value={admission_no}
                            onChange={handleAdmissionChange}
                          />
                        </InputGroup>
                      </Col>
                      <button type="button" className="btn btn-secondary mx-3" onClick={() => {
                        if (!admission_no.trim()) {
                          alert("Please enter admission number.");
                        } else {
                          fetchFormData(); // Fetch & populate data before generating PDF
                        }
                      }}><FontAwesomeIcon icon={faEye} className="me-0" /></button>
                      <button type="button" className="btn btn-success mx-1" onClick={() => {
                        if (!admission_no.trim()) {
                          alert("Please enter admission number.");
                        } else {
                          createFormData(); // Fetch & populate data before generating PDF
                        }
                      }}><FontAwesomeIcon icon={faPlus} className="me-0" /></button>
                      <button type="button" className="btn btn-success col-md-2 view_all_size" onClick={EditSCRBForm2B}>
                        View All
                      </button>
                      <button type="button" className="btn btn-success mx-1" onClick={handleDownload}>
                        <i className="bi bi-file-earmark-excel"></i>
                      </button>
                    </Form.Group>
                  </Form>

                </div>
              </Col>
              <Col md={4} className="d-flex align-items-center justify-content-end">
                <Button variant="outline-secondary" className="m-1" type="button" onClick={handleBackPage}>
                  <FontAwesomeIcon icon={faArrowLeft} className="me-2" />Back
                </Button>
                <Button variant="outline-success" className="m-1" type="button" onClick={handleNextpage} >
                  <FontAwesomeIcon icon={faArrowRight} className="me-2" /> Next
                </Button>
              </Col>


            </Row>
          </Col>

          <div>
            {/* Show success or error message box */}
            {submissionMessage && (
              <Alert variant={messageType} className="mt-3">
                {submissionMessage}
              </Alert>
            )}
          </div>

          <div className="container mt-3 form_2B_container">
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
                            value={"MANASU (Mental Health Charity Home)"}
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
                          <label>FILE NO  <span style={{ color: 'red' }}>*</span></label>
                        </div>
                      </div>
                    </td>
                    <td style={{ width: '65%' }}>
                      <div className="row">
                        <div className="col-md-12">
                          <input
                            type="text"
                            name="file_no"
                            value={formData.file_no}
                            onChange={handleInputChange} className="form-control text-center"
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
                        <label>Tattoo in Letters: <span style={{ color: 'red' }}>*</span></label>
                        <textarea
                          className="form-control"
                          name="addition_tatoo"
                          rows="2"
                          value={formData.addition_tatoo}
                          onChange={handleInputChange}
                          required
                        ></textarea>
                      </div>
                      <div className="mb-3 text-start">
                        <label>Scar: <span style={{ color: 'red' }}>*</span></label>
                        <textarea
                          className="form-control"
                          name="scar"
                          rows="2"
                          value={formData.scar}
                          onChange={handleInputChange}
                          required
                        ></textarea>
                      </div>
                      <div className="mb-3 text-start">
                        <label>Mole: <span style={{ color: 'red' }}>*</span></label>
                        <textarea
                          className="form-control"
                          name="mole"
                          value={formData.mole}
                          onChange={handleInputChange} rows="2"
                          required
                        ></textarea>

                      </div>
                      <div className="mb-3 text-start">
                        <label>Height (cms): <span style={{ color: 'red' }}>*</span></label>
                        <textarea
                          className="form-control"
                          name="height"
                          value={formData.height}
                          onChange={handleInputChange} rows="2"
                          required
                        ></textarea>

                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="mb-3">

                <button type="submit" className="btn btn-success mx-3">
                  Submit Form
                </button>

              </div>
            </form>
          </div>

          {/* pdf view content */}
          <div ref={formRef} style={{ position: "absolute", left: "-9999px", top: 0, background: "#fff", padding: "20px", width: "210mm" }}>
            <Row className="d-flex align-items-center justify-content-center mb-2">
              <Col md={2}>
                <img src={manasu_logo} className="pdf_logo" alt="" />
              </Col>
              <Col md={10}>
                <h4 className="text-center">FORM 2B - PDF PREVIEW</h4>
              </Col>
            </Row>
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
                            value={formData.file_no}
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
                      <div className="mb-2 text-start">
                        <label>Tattoo in Letters:</label>
                        <textarea
                          className="form-control"
                          name="addition_tatoo"
                          rows="2"
                          value={formData.addition_tatoo}
                          onChange={(e) => setAdditionTatoo(e.target.value)}
                          required
                        ></textarea>
                      </div>
                      <div className="mb-2 text-start">
                        <label>Scar:</label>
                        <textarea
                          className="form-control"
                          name="scar"
                          rows="2"
                          value={formData.scar}
                          onChange={(e) => setScar(e.target.value)}
                          required
                        ></textarea>
                      </div>
                      <div className="mb-2 text-start">
                        <label>Mole:</label>
                        <textarea
                          className="form-control"
                          name="mole"
                          value={formData.mole}
                          onChange={(e) => setMole(e.target.value)}
                          rows="2"
                          required
                        ></textarea>

                      </div>
                      <div className="mb-2 text-start">
                        <label>Height (cms):</label>
                        <textarea
                          className="form-control"
                          name="height"
                          value={formData.height}
                          onChange={(e) => setHeight(e.target.value)}
                          rows="1"
                          required
                        ></textarea>

                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>

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

            </form>
          </div>
        </Row>
      </Container>
    </>
  )
}

export default SCRB_Form2B
