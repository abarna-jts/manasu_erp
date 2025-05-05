import React from 'react';
import { Container, Row, Col, Form, InputGroup } from 'react-bootstrap';
import { Breadcrumb } from '@themesberg/react-bootstrap';
import { useState } from 'react';
import axios from 'axios';
import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function SCRB_Form2A() {
  const [admissionNumber, setAdmissionNumber] = useState('');
  const [category, setCategory] = useState([]);
  const [complexion, setComplexion] = useState([]);
  const [face, setFace] = useState([]);
  
  const [formData, setFormData] = useState({
    name_ngo: 'MANASU (Mana Nala Sugalayam)',
    admissionNumber: '',
    file_no: '',
    addition_category: '',
    addition_complexion: '',
    addition_face: '',
  });

  const tableRef = useRef(null);

  const handlePreview = async () => {
    const input = tableRef.current;

    // Make sure element is visible for html2canvas
    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF('p', 'mm', 'a4'); // portrait, millimeters, A4

    // Calculate width/height to fit A4 page
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

    // Open PDF in new tab
    const pdfBlob = pdf.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);

    window.open(pdfUrl, '_blank'); // Full screen preview
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
      admissionNumber,
      category,
      complexion,
      face,
    };

    try {
      const response = await axios.post('http://localhost:5000/scrb_form/create_form_2A', payload);
      console.log(response.data);
      alert('Form submitted successfully');
    } catch (error) {
      console.error('Submission failed:', error);
    }
  };

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
            <h4 className="section_title_1">FORM 2A - FOUND PERSON DETAILS - PHYSICAL PARAMETERS -1</h4>
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
            <form onSubmit={handleSubmit}>
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
                            className="form-control text-center"
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

                <button type="submit" className="btn btn-primary mx-3">
                  Submit Form
                </button>
                <button type="submit" className="btn btn-secondary mx-3" onClick={handlePreview}>
                  Preview Pdf
                </button>
              </div>
            </form>
          </div>
        </Row>
      </Container>
    </>

  )
}

export default SCRB_Form2A