import React from 'react';
import { Container, Row, Col, Form, InputGroup, Button } from 'react-bootstrap';
import { Breadcrumb } from '@themesberg/react-bootstrap';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPlus, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useNavigate } from 'react-router-dom';
import { Alert } from "react-bootstrap";
import manasu_logo from '../Admission/Manasu-Logo.png';

function SCRB_Form2C() {
  const [admission_no, setAdmissionNumber] = useState('');
  const [upperdress_1, setUpperDress1] = useState([]);
  const [upperdress_2, setUpperDress2] = useState([]);
  const [lowerdress, setLowerDress] = useState([]);
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
    addition_upperdress: '',
    addition_lowerdress: '',
    upperdress_color: '',
    lowerdress_color: '',
  });

  const handleAdmissionChange = (e) => {
    setAdmissionNumber(e.target.value);
  };

  const handleCheckboxChange = (value, type) => {
    const updater = (prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value];

    if (type === 'upperdress_1') setUpperDress1(updater);
    if (type === 'upperdress_2') setUpperDress2(updater);
    if (type === 'lowerdress') setLowerDress(updater);
  };

  const rows = [
    { id: 1, upperdress_1: 'Shirt (Full)', upperdress_2: 'Jeans Shirt', lowerdress: 'Pant' },
    { id: 2, upperdress_1: 'Shirt (Half)', upperdress_2: 'Shirt (Full)', lowerdress: 'Half Pant' },
    { id: 3, upperdress_1: 'T-Shirt (Sleeveless)', upperdress_2: 'Shirt (Half)', lowerdress: 'Dhoti' },
    { id: 4, upperdress_1: 'T-Shirt (Full)', upperdress_2: 'Half Saree', lowerdress: 'Lungi' },
    { id: 5, upperdress_1: 'T-Shirt (Half)', upperdress_2: 'Churidhar', lowerdress: 'Shorts' },
    { id: 6, upperdress_1: 'Kadhar Shirt', upperdress_2: 'Salwar', lowerdress: 'Jeans Pant' },
    { id: 7, upperdress_1: 'Gurtha', upperdress_2: 'Nighty', lowerdress: 'Burmudas' },
    { id: 8, upperdress_1: 'Jeans Shirt', upperdress_2: 'Track Suit (Upper)', lowerdress: 'Pyjama Pant' },
    { id: 9, upperdress_1: 'Jersy', upperdress_2: 'Pyjama Suit', lowerdress: '3/4 Pant' },
    { id: 10, upperdress_1: 'Pyjama', upperdress_2: 'Collar Less T-Shirt (Full)', lowerdress: 'Safari Suit' },
    { id: 11, upperdress_1: 'Collar Less T-Shirt (Full/Half)', upperdress_2: 'Collar Less T-Shirt (Half)', lowerdress: 'Track Suit' },
    { id: 12, upperdress_1: 'Safari Shirt', upperdress_2: 'Sweater', lowerdress: 'Shirt (Half)' },
    { id: 13, upperdress_1: 'Coat', upperdress_2: 'Stone Wash Shirt', lowerdress: 'Ladies Pant' },
    { id: 14, upperdress_1: 'Sweater', upperdress_2: 'Short Shirt', lowerdress: 'Ladies Jeans Pant' },
    { id: 15, upperdress_1: 'Bare Body', upperdress_2: '', lowerdress: 'Ladies 3/4 Pant' },
    { id: 16, upperdress_1: 'Stone Wash Shirt', upperdress_2: '', lowerdress: 'Churidhar Pant' },
    { id: 17, upperdress_1: 'Short Shirt', upperdress_2: '', lowerdress: 'Kameezh' },
    { id: 18, upperdress_1: 'Saree', upperdress_2: '', lowerdress: 'Track Suit (Lower)' },
    { id: 19, upperdress_1: 'Blousee', upperdress_2: '', lowerdress: 'Shirt (Full)' },
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!admission_no || admission_no.trim() === '') {
      alert("Admission Number is required.");
      return;
    }

    const trimmedAdNo = admission_no.trim();

    if (!/^\d{8,13}$/.test(trimmedAdNo)) {
      alert("Admission Number must be between 8 to 13 digits (numbers only).");
      return;
    }

    if (
      upperdress_1.length === 0 &&
      upperdress_2.length === 0 ||
      lowerdress.length === 0
    ) {
      alert("Please select at least one dress item from Upperdress or Lowerdress.");
      return;
    }

    const payload = {
      ...formData,
      admission_no,
      upperdress_1,
      upperdress_2,
      lowerdress,
    };
    console.log(payload);

    try {
      const response = await apiRoute.post('/scrb_form/create_form_2C', payload);
      console.log(response.data);
      if (response.status === 201 || response.status === 200) {
        alert("SCRB Form2C Submitted Successfully");
        setFormData({
          admission_no: '',
          file_no: '',
          addition_upperdress: '',
          addition_lowerdress: '',
          upperdress_color: '',
          lowerdress_color: '',
        })
        setAdmissionNumber("");
        setUpperDress1("");
        setUpperDress2("");
        setLowerDress("");
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

  const createFormData = () => {
    const targetElement = document.querySelector('.form_2C');
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  const fetchFormData = async () => {
    try {
      const response = await apiRoute.get(`/scrb_form/get_scrb_form2cdata/${admission_no}`);

      if(!admission_no){
        alert("Admission Number not found form Scrb Form 2c");
      }
      const data = response.data;

      setFormData((formData) => ({
        ...formData,
        file_no: data.file_no || '',
        addition_upperdress: data.addition_upperdress || '',
        addition_lowerdress: data.addition_lowerdress || '',
        upperdress_color: data.upperdress_color || '',
        lowerdress_color: data.lowerdress_color || ''
      }));

      setUpperDress1(data.upperdress_1 || []);
      setUpperDress2(data.upperdress_2 || []);
      setLowerDress(data.lowerdress || []);
      // Wait for DOM update then generate PDF

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

  const handleDownload = async () => {
    if (!admission_no.trim()) {
      alert("Please enter admission number.");
      return;
    }

    try {
      const response = await apiRoute.get(`/scrb_form/getallSCRBFormData/${admission_no}`);
      console.log("Fetched data from API:", response.data);

      const fetchedData = response.data.data || response.data;
      console.log(fetchedData);

      if (!fetchedData || typeof fetchedData !== "object") {
        alert("Invalid or missing data from server.");
        return;
      }

      exportToExcel(fetchedData);
    } catch (error) {
      console.error("Error fetching or downloading:", error);
      alert("This form does not have a valid admission number");
    }
  };

  const exportToExcel = (data) => {
    if (!data || typeof data !== "object") {
      alert("Invalid data for Excel export.");
      return;
    }

    const sections = ['form_2', 'form_2a', 'form_2b', 'form_2c'];

    // Collect key-value pairs for each form section
    const sectionRows = sections.map(section => {
      const sectionData = data[section];
      if (!sectionData || typeof sectionData !== "object") return [];

      return Object.entries(sectionData).map(([key, value]) => ({
        [`${section}_key`]: key,
        [`${section}_value`]: value
      }));
    });

    // Find the max length among all form sections to determine total rows
    const maxLength = Math.max(...sectionRows.map(rows => rows.length));

    // Combine into one sheet row-wise
    const finalRows = [];

    for (let i = 0; i < maxLength; i++) {
      const row = {};
      sectionRows.forEach((sectionData, index) => {
        const sectionName = sections[index];
        row[`${sectionName}_key`] = sectionData[i]?.[`${sectionName}_key`] || "";
        row[`${sectionName}_value`] = sectionData[i]?.[`${sectionName}_value`] || "";
      });
      finalRows.push(row);
    }

    const worksheet = XLSX.utils.json_to_sheet(finalRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "SCRB Form");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array"
    });

    const fileData = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });

    const fileName = `SCRB_Form_${data.form_2?.admission_no || "data"}.xlsx`;
    saveAs(fileData, fileName);
  };

  const handleForm2CDownload = async () => {
    try {
      const response = await apiRoute.get(`/scrb_form/getAllSCRBForm2C`);
      console.log("Full response:", response);

      const fetchedData = response.data?.data; // <-- Correct way to access it
      console.log("Fetched data:", fetchedData);

      if (!Array.isArray(fetchedData) || fetchedData.length === 0) {
        alert("No form data available to export.");
        return;
      }

      Form2CexportToExcel(fetchedData);
    } catch (error) {
      console.error("Error fetching or downloading:", error);
      alert("This form does not have a valid admission number.");
    }
  };

  const Form2CexportToExcel = (data) => {
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

    saveAs(fileData, `SCRB_Form2C_${admission_no}.xlsx`);
  };


  const navigate = useNavigate();

  const handleBackPage = () => {
    navigate("/scrb_form2B");
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

  const EditSCRBForm2C = async () => {
    navigate("/scrb_form2cALL");
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
            <h4 className="section_title_1">FORM 2C - FOUND PERSON DETAILS - DRESS CODE</h4>
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
                          alert("Please give admission number.");
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
                      <button type="button" className="btn btn-success col-md-2 view_all_size" onClick={EditSCRBForm2C}>
                        View All
                      </button>
                      <button type="button" className="btn btn-success mx-2" onClick={handleForm2CDownload}>
                        <i className="bi bi-file-earmark-excel"></i>
                      </button>
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
                <button type="button" className="btn btn-success mx-2" onClick={handleDownload}>
                  <i className="bi bi-file-earmark-excel me-2"></i>Export All Form to Excel
                </button>
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

          <div className="container mt-3 form_2C_container">
            <form onSubmit={handleSubmit} className='form_2C'>
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
                    <th>UPPER DRESS</th>
                    <th>TICK</th>
                    <th>UPPER DRESS</th>
                    <th>TICK</th>
                    <th>LOWER DRESS</th>
                    <th>TICK</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id}>
                      <td>{row.id}</td>
                      <td>{row.upperdress_1}</td>
                      <td>
                        {row.upperdress_1 && (
                          <input
                            type="checkbox"
                            onChange={() => handleCheckboxChange(row.upperdress_1, 'upperdress_1')}
                            checked={upperdress_1.includes(row.upperdress_1)}
                          />
                        )}
                      </td>
                      <td>{row.upperdress_2}</td>
                      <td>
                        {row.upperdress_2 && (
                          <input
                            type="checkbox"
                            onChange={() => handleCheckboxChange(row.upperdress_2, 'upperdress_2')}
                            checked={upperdress_2.includes(row.upperdress_2)}
                          />
                        )}
                      </td>
                      <td>{row.lowerdress}</td>
                      <td>
                        {row.lowerdress && (
                          <input
                            type="checkbox"
                            onChange={() => handleCheckboxChange(row.lowerdress, 'lowerdress')}
                            checked={lowerdress.includes(row.lowerdress)}
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
                        <label>Any Other Upper Dress:</label>
                        <textarea
                          className="form-control"
                          name="addition_upperdress"
                          rows="2"
                          value={formData.addition_upperdress}
                          onChange={handleChange}
                          placeholder="Specify any other upper dress details"

                        />
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <div className="mb-3 text-start">
                        <label>Any Other Lower Dress:</label>
                        <textarea
                          className="form-control"
                          name="addition_lowerdress"
                          rows="2"
                          value={formData.addition_lowerdress}
                          onChange={handleChange}
                          placeholder="Specify any other lower dress details"

                        />
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <div className="mb-3 text-start">
                        <label>Upper Dress Color:</label>
                        <input
                          type="text"
                          className="form-control"
                          name="upperdress_color"
                          value={formData.upperdress_color}
                          onChange={handleChange}
                          placeholder="Enter color"

                        />
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <div className="mb-3 text-start">
                        <label>Lower Dress Color:</label>
                        <input
                          type="text"
                          className="form-control"
                          name="lowerdress_color"
                          value={formData.lowerdress_color}
                          onChange={handleChange}
                          placeholder="Enter color"

                        />
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td className="text-center">
                      <button type="submit" className="btn btn-success">
                        Submit
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </form>
          </div>

          {/* pdf formate view  */}
          <div ref={formRef} style={{ position: "absolute", left: "-9999px", top: 0, background: "#fff", padding: "20px", width: "210mm" }}>
            <Row className="d-flex align-items-center justify-content-center mb-2">
              <Col md={2}>
                <img src={manasu_logo} className="pdf_logo" alt="" />
              </Col>
              <Col md={10}>
                <h4 className="text-center">FORM 2C - PDF PREVIEW</h4>
              </Col>
            </Row>
            <form >
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
                    <th>UPPER DRESS</th>
                    <th>TICK</th>
                    <th>UPPER DRESS</th>
                    <th>TICK</th>
                    <th>LOWER DRESS</th>
                    <th>TICK</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id}>
                      <td>{row.id}</td>
                      <td>{row.upperdress_1}</td>
                      <td>
                        {row.upperdress_1 && (
                          <input
                            type="checkbox"
                            onChange={() => handleCheckboxChange(row.upperdress_1, 'upperdress_1')}
                            checked={upperdress_1.includes(row.upperdress_1)}
                          />
                        )}
                      </td>
                      <td>{row.upperdress_2}</td>
                      <td>
                        {row.upperdress_2 && (
                          <input
                            type="checkbox"
                            onChange={() => handleCheckboxChange(row.upperdress_2, 'upperdress_2')}
                            checked={upperdress_2.includes(row.upperdress_2)}
                          />
                        )}
                      </td>
                      <td>{row.lowerdress}</td>
                      <td>
                        {row.lowerdress && (
                          <input
                            type="checkbox"
                            onChange={() => handleCheckboxChange(row.lowerdress, 'lowerdress')}
                            checked={lowerdress.includes(row.lowerdress)}
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
                      <div className="mb-2 text-start">
                        <label>Any Other Upper Dress:</label>
                        <textarea
                          className="form-control"
                          name="addition_upperdress"
                          rows="2"
                          value={formData.addition_upperdress}
                          onChange={handleChange}

                          required
                        />
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <div className="mb-2 text-start">
                        <label>Any Other Lower Dress:</label>
                        <textarea
                          className="form-control"
                          name="addition_lowerdress"
                          rows="2"
                          value={formData.addition_lowerdress}
                          onChange={handleChange}

                          required
                        />
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <div className="mb-5 text-start">
                        <label>Upper Dress Color:</label>
                        <textarea
                          className="form-control"
                          name="upperdress_color"
                          value={formData.upperdress_color}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <div className="mb-2 mt-2 text-start">
                        <label>Lower Dress Color:</label>
                        <textarea
                          className="form-control"
                          name="lowerdress_color"
                          value={formData.lowerdress_color}
                          onChange={handleChange}
                          required
                        />
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

export default SCRB_Form2C