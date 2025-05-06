import React from 'react';
import { Container, Row, Col, Form, InputGroup } from 'react-bootstrap';
import { Breadcrumb } from '@themesberg/react-bootstrap';
import { useState,useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faEye, faPlus} from "@fortawesome/free-solid-svg-icons";
import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function SCRB_Form2C() {
  const [admissionNumber, setAdmissionNumber] = useState('');
  const [upperdress_1, setUpperDress1] = useState([]);
  const [upperdress_2, setUpperDress2] = useState([]);
  const [lowerdress, setLowerDress] = useState([]);
  const [previewRequested, setPreviewRequested] = useState(false);

  const [formData, setFormData] = useState({
    name_ngo: 'MANASU (Mana Nala Sugalayam)',
    admissionNumber: '',
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

    const payload = {
      ...formData,
      admissionNumber,
      upperdress_1,
      upperdress_2,
      lowerdress,
    };
    console.log(payload);

    try {
      const response = await axios.post('http://localhost:5000/scrb_form/create_form_2C', payload);
      console.log(response.data);
      alert('Form submitted successfully');
       // ✅ Refresh the page
     window.location.reload();
    } catch (error) {
      console.error('Submission failed:', error);
    }
  };
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

  const createFormData = () =>{
    const targetElement = document.querySelector('.form_2C');
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  const fetchFormData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/scrb_form/get_scrb_form2cdata/${admissionNumber}`);
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
            <h4 className="section_title_1">FORM 2C - FOUND PERSON DETAILS - DRESS CODE</h4>
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
                      <div className="mb-3 text-start">
                        <label>Any Other Upper Dress:</label>
                        <textarea
                          className="form-control"
                          name="addition_upperdress"
                          rows="2"
                          value={formData.addition_upperdress}
                          onChange={handleChange}
                          placeholder="Specify any other upper dress details"
                          required
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
                          required
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
                          required
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
                          required
                        />
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td className="text-center">
                      <button type="submit" className="btn btn-primary">
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
            <h4 className="text-center">FORM 2C - PDF PREVIEW</h4>
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
                        <div className="mb-3 text-start">
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
                        <div className="mb-3 text-start">
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
                        <div className="mb-3 text-start">
                          <label>Upper Dress Color:</label>
                          <input
                            type="text"
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
                        <div className="mb-3 text-start">
                          <label>Lower Dress Color:</label>
                          <input
                            type="text"
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
              </form>
          </div>

        </Row>
      </Container>

    </>
  )
}

export default SCRB_Form2C