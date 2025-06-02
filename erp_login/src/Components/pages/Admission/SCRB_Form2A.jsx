import React from 'react';
import { Container, Row, Col, Form, InputGroup, Button } from 'react-bootstrap';
import { Breadcrumb } from '@themesberg/react-bootstrap';
import { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRef } from "react";
import { faEye, faPlus, faArrowRight, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useNavigate } from "react-router-dom";
import { Alert } from "react-bootstrap";

function SCRB_Form2A() {
  const [admission_no, setAdmissionNumber] = useState('');
  const [category, setCategory] = useState([]);
  const [complexion, setComplexion] = useState([]);
  const [face, setFace] = useState([]);
  const [previewRequested, setPreviewRequested] = useState(false);
   const [rescueImage, setRescueImage] = useState(null);
  const [rescueName, setRescueName] = useState("");
  const [error, setError] = useState("");

  //alert box values
  const [submissionMessage, setSubmissionMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'danger'

  const apiRoute = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
  });

  const [formData, setFormData] = useState({
    name_ngo: 'MANASU (Mental Health Charity Home)',
    admission_no: '',
    file_no: '',
    addition_category: '',
    addition_complexion: '',
    addition_face: '',
  });


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
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    const pdfBlob = pdf.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');
  };

  const handleAdmissionChange = (e) => {
    setAdmissionNumber(e.target.value);
  };

  const handleCheckboxChange = (value, type) => {
    const updater = (prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value];

    if (type === 'category') setCategory(updater);
    if (type === 'complexion') setComplexion(updater);
    if (type === 'face') setFace(updater);
  };

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


  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      admission_no,
      category,
      complexion,
      face,
    };

    try {
      const response = await apiRoute.post('/scrb_form/create_form_2A', payload);
      console.log(response.data);
      if (response.data.message === "SCRB form2A Created Successfully") {
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
  };

  const fetchFormData = async () => {
    try {
      const response = await apiRoute.get(`/scrb_form/get_scrb_form2adata/${admission_no}`);
      const data = response.data;

      setFormData((formData) => ({
        ...formData,
        file_no: data.file_no || '',
        addition_category: data.addition_category || '',
        addition_complexion: data.addition_complexion || '',
        addition_face: data.addition_face || ''
      }));

      setCategory(data.category || []);
      setComplexion(data.complexion || []);
      setFace(data.face || []);

      setPreviewRequested(true); // trigger the effect after state updates
    } catch (error) {
      console.error("Error fetching form data:", error);
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

  const createFormData = () => {
    const targetElement = document.querySelector('.form_2A');
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  const rows = [
    { id: 1, category: 'Abandoned', complexion: 'Dark', face: 'Dimpled Cheek' },
    { id: 2, category: 'Addiction', complexion: 'Fair', face: 'Dimpled Chin' },
    { id: 3, category: 'Aids Victim', complexion: 'Very Fair', face: 'Double Chin' },
    { id: 4, category: 'Distressed Person', complexion: 'Wheatish', face: 'Forehead Broad' },
    { id: 5, category: 'Dying Destitue', complexion: '', face: 'Forehead Narrow' },
    { id: 6, category: 'Handicapped', complexion: '', face: 'High Cheek' },
    { id: 7, category: 'Mentally Retarded', complexion: '', face: 'Long' },
    { id: 8, category: 'Psychiatric patient', complexion: '', face: 'Oval' },
    { id: 9, category: 'Run Away', complexion: '', face: 'Poxpitted' },
    { id: 10, category: 'Senior Citizen', complexion: '', face: 'Prominent Cheek' },
    { id: 11, category: '', complexion: '', face: 'Protruding Chin' },
    { id: 12, category: '', complexion: '', face: 'Receding Forehead' },
    { id: 13, category: '', complexion: '', face: 'Round' },
    { id: 14, category: '', complexion: '', face: 'Square / Heavy Jaw' },
    { id: 15, category: '', complexion: '', face: 'Sunken Cheeks' },
    { id: 16, category: '', complexion: '', face: 'Wrinkled' },
  ];

  const handleDownload = async () => {
    if (!admission_no.trim()) {
      alert("Please enter your admission number.");
      return;
    }

    try {
      const response = await apiRoute.get(`/admision/getSCRB2AFormData/${admission_no}`);
      console.log("Full response:", response);

      const fetchedData = response.data?.data;
      console.log(fetchedData);

      if (!fetchedData || typeof fetchedData !== "object") {
        alert("Invalid or missing data from server.");
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

    // Ensure data is an array of objects
    const rows = Array.isArray(data) ? data : [data];

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "SCRB Form");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const fileData = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(fileData, `SCRB_Form2A_${rows[0].admission_no || "data"}.xlsx`);
  };

  const navigate = useNavigate();

  const handleNextpage = () => {
      navigate("/scrb_form2B");
    
  }

  const handleBackPage = () => {
    navigate("/scrb_form");
  }

   // Mock API call or fetch
  const fetchRescueDetails = async (admission_no) => {
  try {
      const response = await apiRoute.get(`/admision/get_scrbform2data/${admission_no}`);
      const result = response.data.data[0];
      console.log("API Result:", result);

      if (result && result.rescue_image) {
        const imagePath = result.rescue_image.startsWith("http")
          ? result.rescue_image
          : `http://localhost:5000/${result.rescue_image}`;

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


  return (
    <>
      <div className="d-xl-flex justify-content-between align-items-center flex-wrap flex-md-nowrap text-start py-2">
        <Row className='w-100 d-flex align-items-center'>
          <Col md={2}>
            <div className="d-block mb-4 mb-xl-0 px-4 ">
              <Breadcrumb className="d-none d-md-inline-block mb-0" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
                <Breadcrumb.Item></Breadcrumb.Item>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item active>Admission</Breadcrumb.Item>
              </Breadcrumb>
              <h6 className="breadcrumb_title">SCRB Form</h6>

            </div>
          </Col>

          <Col md={8} className="text-center">
            <h4 className="section_title_1">FORM 2A - FOUND PERSON DETAILS - PHYSICAL PARAMETERS -1</h4>
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
              <Col md="8">
                <div className="d-flex align-items-center px-3">

                  <Form className="navbar-search col-md-9">
                    <Form.Group id="topbarSearch" className="d-flex align-items-center">
                      <Col md={3}>
                        <Form.Label>Admission Number:</Form.Label>
                      </Col>
                      <Col md={2}>
                        <InputGroup className="input-group-merge search-bar">
                          <Form.Control
                            type="text"
                            value={admission_no}
                            onChange={handleAdmissionChange}
                          />
                        </InputGroup>
                      </Col>
                      <button type="button" className="btn btn-secondary mx-2" onClick={() => {
                        if (!admission_no.trim()) {
                          alert("Please enter admission number.");
                        } else {
                          fetchFormData(); // Fetch & populate data before generating PDF
                        }
                      }}><FontAwesomeIcon icon={faEye} className="me-0" /></button>
                      <button type="button" className="btn btn-success mx-2" onClick={() => {
                        if (!admission_no.trim()) {
                          alert("Please enter your admission number.");
                        } else {
                          createFormData(); // Fetch & populate data before generating PDF
                        }
                      }}><FontAwesomeIcon icon={faPlus} className="me-0" /></button>
                      {/* <button type="button" className="btn btn-success mx-2" onClick={handleDownload}>
                        Import Excel Sheet
                      </button> */}
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



          <div className="container mt-3">
            <form onSubmit={handleSubmit} className='form_2A'>
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
                            className="form-control text-center"
                            value={formData.file_no}
                            onChange={handleInputChange}
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
                    <th>#</th>
                    <th>CATEGORY</th>
                    <th>TICK</th>
                    <th>COMPLEXION</th>
                    <th>TICK</th>
                    <th>FACE</th>
                    <th>TICK</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, index) => (
                    <tr key={row.id}>
                      <td>{row.id}</td>

                      {/* CATEGORY */}
                      <td>{row.category}</td>
                      <td className="text-center">
                        {row.category && (
                          <Form.Check
                            type="checkbox"
                            checked={category.includes(row.category)}
                            onChange={() => handleCheckboxChange(row.category, 'category')}
                          />
                        )}
                      </td>

                      {/* COMPLEXION */}
                      <td>{row.complexion}</td>
                      <td className="text-center">
                        {row.complexion && (
                          <Form.Check
                            type="checkbox"
                            checked={complexion.includes(row.complexion)}
                            onChange={() => handleCheckboxChange(row.complexion, 'complexion')}
                          />
                        )}
                      </td>

                      {/* FACE */}
                      <td>{row.face}</td>
                      <td className="text-center">
                        {row.face && (
                          <Form.Check
                            type="checkbox"
                            checked={face.includes(row.face)}
                            onChange={() => handleCheckboxChange(row.face, 'face')}
                          />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <table className="table table-bordered" style={{ border: "2px solid rgb(143 143 143)" }}>
                <tbody>
                  <tr>
                    <td>
                      <div className="mb-3 text-start">
                        <label>Any Other Category:</label>
                        <textarea
                          className="form-control"
                          name="addition_category"
                          rows="2"
                          value={formData.addition_category}
                          onChange={handleChange}
                          required
                        ></textarea>
                      </div>
                      <div className="mb-3 text-start">
                        <label>Any Other Complexion:</label>
                        <textarea
                          className="form-control"
                          name="addition_complexion"
                          rows="2"
                          value={formData.addition_complexion}
                          onChange={handleChange}
                          required
                        ></textarea>
                      </div>
                      <div className="mb-3 text-start">
                        <label>Any Other Face:</label>
                        <textarea
                          className="form-control"
                          name="addition_face"
                          rows="2"
                          value={formData.addition_face}
                          onChange={handleChange}
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


            {/* pdf formate view  */}
            <div ref={formRef} style={{ position: "absolute", left: "-9999px", top: 0, background: "#fff", padding: "20px", width: "210mm" }}>
              <h4 className="text-center">FORM 2A - PDF PREVIEW</h4>
              <form>
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
                              onChange={handleInputChange}
                              value={formData.file_no}
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
                      <th>#</th>
                      <th>CATEGORY</th>
                      <th>TICK</th>
                      <th>COMPLEXION</th>
                      <th>TICK</th>
                      <th>FACE</th>
                      <th>TICK</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.id}>
                        <td>{row.id}</td>
                        <td>{row.category}</td>
                        <td>
                          {row.category && (
                            <input
                              type="checkbox"
                              onChange={() => handleCheckboxChange(row.category, 'category')}
                              checked={category.includes(row.category)}
                            />
                          )}
                        </td>
                        <td>{row.complexion}</td>
                        <td>
                          {row.complexion && (
                            <input
                              type="checkbox"
                              onChange={() => handleCheckboxChange(row.complexion, 'complexion')}
                              checked={complexion.includes(row.complexion)}
                            />
                          )}
                        </td>
                        <td>{row.face}</td>
                        <td>
                          {row.face && (
                            <input
                              type="checkbox"
                              onChange={() => handleCheckboxChange(row.face, 'face')}
                              checked={face.includes(row.face)}
                            />
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <table className="table table-bordered" style={{ border: "2px solid rgb(143 143 143)" }}>
                  <tbody>
                    <tr>
                      <td>
                        <div className="mb-3 text-start">
                          <label>Any Other Category:</label>
                          <textarea
                            className="form-control"
                            name="addition_category"
                            rows="2"
                            value={formData.addition_category}
                            onChange={handleChange}
                            required
                          ></textarea>
                        </div>
                        <div className="mb-3 text-start">
                          <label>Any Other Complexion:</label>
                          <textarea
                            className="form-control"
                            name="addition_complexion"
                            rows="2"
                            value={formData.addition_complexion}
                            onChange={handleChange}
                            required
                          ></textarea>
                        </div>
                        <div className="mb-3 text-start">
                          <label>Any Other Face:</label>
                          <textarea
                            className="form-control"
                            name="addition_face"
                            rows="2"
                            value={formData.addition_face}
                            onChange={handleChange}
                            required
                          ></textarea>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="mb-3">


                </div>
              </form>
            </div>


          </div>
        </Row>
      </Container>
    </>

  )
}

export default SCRB_Form2A