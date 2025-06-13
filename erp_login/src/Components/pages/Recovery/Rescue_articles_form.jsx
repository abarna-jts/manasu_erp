import React, { useState, useEffect } from 'react';
import { Container, Row, Breadcrumb, Col, Table, Form, Button, InputGroup } from "react-bootstrap";
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPlus, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import Cookies from 'js-cookie';
import { useRef } from "react";
import jsPDF from "jspdf";
import Modal from 'react-bootstrap/Modal';
import html2canvas from "html2canvas";
import manasu_logo from "../Admission/manasu_logo.png";

function Rescue_articles_form() {
  const [admission_no, setAdmissionNumber] = useState('');
  const [show, setShow] = useState(false);
  const [rescueImage, setRescueImage] = useState(null);
  const [rescueName, setRescueName] = useState("");
  const [error, setError] = useState("");
  const [files, setFiles] = useState('');
  const [previewRequested, setPreviewRequested] = useState(false);
  const handleClose = () => setShow(false);

  const [formData, setFormData] = useState({
    rescue_name: '',
    date_time: '',
    collected_items: '',
  })

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    setFiles(prevFiles => ({
      ...prevFiles,
      [name]: selectedFiles[0]
    }));
  };
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const userType = Cookies.get('usertype');

  const apiRoute = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
  });

  const fetchRescueDetails = async (admission_no) => {
    try {
      const response = await apiRoute.get(`/admision/get_scrbform2data/${admission_no}`);
      const result = response.data.data[0];
      console.log("API Result:", result);

      if (result && result.rescue_image) {
        const imagePath = result.rescue_image.startsWith("http")
          ? result.rescue_image
          : `https://www.pahrultours.com/app2/${result.rescue_image}`;

        setRescueImage(imagePath);
        setRescueName(result.rescue_name || "");
        setError(""); // clear any previous error
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

  useEffect(() => {
    if (admission_no.trim() !== "") {
      fetchRescueDetails(admission_no);
    } else {
      setRescueImage(null);
      setRescueName("");
      setError("");
    }
  }, [admission_no]);

  function formatDateForInput(datetimeString) {
    if (!datetimeString) return '';

    const date = new Date(datetimeString);
    if (isNaN(date.getTime())) return '';

    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60000);
    return localDate.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:mm"
  }



  // Automatically fetch data when admission number is typed
  useEffect(() => {
    if (admission_no.trim().length >= 8) { // Adjust minimum length as needed
      fetchFormData();
    }
  }, [admission_no]);

  const fetchFormData = async () => {
    try {
      const response = await apiRoute.get(`/reunion/get_information/${admission_no}`);
      setFormData(response.data.data[0]);
    } catch (error) {
      console.error('Error fetching data', error);
      alert("Admission Number Not found");
    }
  };

  const createFormData = () => {
    const targetElement = document.querySelector('.articles_caried');
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('admission_no', admission_no);
    data.append('rescue_name', formData.rescue_name);
    data.append('date_time', formData.date_time);
    data.append('collected_items', formData.collected_items);
    data.append('attach_items', files.attach_items);

    try {
      const res = await apiRoute.post('/recovery/create_articles', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Articles Form Created Successfully!');
    } catch (err) {
      console.error(err);
      alert('Submission failed.');
    }
  }

  const ViewFormData = async () => {
    try {
      const response = await apiRoute.get(`/recovery/getArticles/${admission_no}`);
      const data = response.data;

      // Update form fields
      setFormData((formData) => ({
        ...formData,
        rescue_name: data.rescue_name || '',
        date_time: data.date_time || '',
        collected_items: data.collected_items || '',
      }));


      // Handle old and new photo paths correctly
      const attachItemsPath = data.attach_items ? `https://www.pahrultours.com/app2/${data.attach_items}` : null;
      console.log(attachItemsPath);
      // Set files state
      setFiles((files) => ({
        ...files,
        attach_items: attachItemsPath,
      }));

      setPreviewRequested(true);
    } catch (error) {
      console.error("Error fetching form data:", error);
      alert("Admission Number not found");
    }
  }

  useEffect(() => {
    if (previewRequested) {
      // Delay slightly to allow DOM updates
      setTimeout(() => {
        generatePDF();
        setPreviewRequested(false);
      }, 100); // 100ms delay is often enough
    }
  }, [previewRequested]);

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

  const handleShow = async (admission_no) => {
    try {
      const response = await apiRoute.get(`/recovery/getArticles/${admission_no}`);
      const data = response.data;

      setFormData((formData) => ({
        ...formData,
        rescue_name: data.rescue_name || '',
        date_time: data.date_time || '',
        collected_items: data.collected_items || '',
      }));

      const attachItemsPath = data.attach_items ? `https://www.pahrultours.com/app2/${data.attach_items}` : null;
      console.log(attachItemsPath);
      // Set files state
      setFiles((files) => ({
        ...files,
        attach_items: attachItemsPath,
      }));

      setShow(true);
    } catch (error) {
      console.error("Error fetching form data:", error);
      alert("Admission Number not found");
    }
  };

  const handleUpdate = async (e, admission_no) => {
    e.preventDefault();

    const data = new FormData();
    data.append('rescue_name', formData.rescue_name);
    data.append('date_time', formData.date_time);
    data.append('collected_items', formData.collected_items);
    data.append('attach_items', files.attach_items);

    try {
      const res = await apiRoute.post(`/recovery/updateArticles/${admission_no}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Self Declaration Form updated successfully!');
    } catch (err) {
      console.error(err);
      alert('Update failed.');
    }
  };

  const handleDelete = async (admission_no) => {
    alert("Are you sure want to delete");
    try {
      const response = await apiRoute.delete(`/reunion/deleteSelfDecl/${admission_no}`);
      console.log(response);
      alert("Self Declaration Form Deleted successfully");
      window.location.reload();
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  return (
    <>
      <Container fluid>
        <Row className='d-flex align-items-center justify-content-between'>
          <Col md={2} className='text-start'>
            <Breadcrumb className="d-none d-md-inline-block mb-0" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
              <Breadcrumb.Item></Breadcrumb.Item>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item active>Recovery</Breadcrumb.Item>
            </Breadcrumb>
            <h6 className="breadcrumb_title">Articles Form</h6>
          </Col>
          <Col md={8} className="text-center">
            <h3 className="section_title">Items Carried at Time of Rescue</h3>
          </Col>
          <Col md={2} className='text-center'>
            {error && <div className="text-danger mt-2">{error}</div>}
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
      </Container>
      <Container>
        <Form className="navbar-search col-md-9 d-flex justify-content-center align-items-center mt-3">
          <Form.Group id="topbarSearch" className="d-flex align-items-center">
            <Col md={6}>
              <Form.Label>Admission Number:</Form.Label>
            </Col>
            <Col md={6}>
              <InputGroup className="input-group-merge search-bar">
                <Form.Control
                  type="text"
                  value={admission_no}
                  onChange={(e) => setAdmissionNumber(e.target.value)}
                />
              </InputGroup>
            </Col>
            <button type="button" className="btn btn-secondary mx-1" onClick={() => {
              if (!admission_no.trim()) {
                alert("Please enter admission number.");
              } else {
                ViewFormData(); // Fetch & populate data before generating PDF
              }
            }}><FontAwesomeIcon icon={faEye} className="me-0" /></button>
            <button type="button" className="btn btn-success mx-1" onClick={() => {
              if (!admission_no.trim()) {
                alert("Please enter admission number.");
              } else {
                createFormData(); // Fetch & populate data before generating PDF
              }
            }}><FontAwesomeIcon icon={faPlus} className="me-0" /></button>
            <button type="button" className="btn btn-success mx-1" onClick={() => {
              if (!admission_no.trim()) {
                alert("Please enter admission number.");
              } else {
                handleShow(admission_no); // Fetch & populate data before generating PDF
              }
            }}><FontAwesomeIcon icon={faEdit} className="me-0" /></button>
            {userType === "2" && (
              <button type="button" className="btn btn-success mx-1" onClick={() => {
                if (!admission_no.trim()) {
                  alert("Please enter admission number.");
                } else {
                  handleDelete(admission_no); // Fetch & populate data before generating PDF
                }
              }}><FontAwesomeIcon icon={faTrash} className="me-0" /></button>
            )}
          </Form.Group>
        </Form>

        <Row className='d-flex align-items-center justify-content-center'>
          <Col md={8} className="consultant_box my-4">
            <div className="consultant_details">
              <Form className='articles_caried' onSubmit={handleSubmit}>
                <Row>
                  <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                    <Form.Label column sm="4" className='text-start'>
                      Name :
                    </Form.Label>
                    <Col sm="8">
                      <Form.Control
                        type="text"
                        name="rescue_name"
                        value={formData.rescue_name}
                        onChange={handleInputChange}
                        required />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                    <Form.Label column sm="4" className='text-start'>
                      Date at the time of Rescue :
                    </Form.Label>
                    <Col sm="8">
                      <Form.Control
                        type="datetime-local"
                        name="date_time"
                        value={formatDateForInput(formData.date_time)}
                        onChange={handleInputChange}
                        required />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                    <Form.Label column sm="4" className='text-start'>
                      Collected Items :
                    </Form.Label>
                    <Col sm="8">
                      <Form.Control
                        type="text"
                        name="collected_items"
                        value={formData.collected_items}
                        onChange={handleInputChange}
                        required />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className="mb-3 mt-3">
                    <Form.Label column sm="4" className='text-start'>
                      Attach Items :
                    </Form.Label>
                    <Col sm="8">
                      <Form.Control
                        type="file"
                        name='attach_items'
                        onChange={handleFileChange}
                        required />
                    </Col>
                  </Form.Group>


                  <div className="mt-3">
                    <Button variant="success" className="m-1" type="submit">Submit</Button>
                  </div>

                </Row>
              </Form>

            </div>
          </Col>
        </Row>

        <div ref={formRef} style={{ position: "absolute", left: "-9999px", top: 0, background: "#fff", padding: "20px", width: "210mm" }}>
          <Row className="d-flex align-items-center justify-content-center mb-2">
            <Col md={2}>
              <img src={manasu_logo} className="pdf_logo" alt="" />
            </Col>
            <Col md={10}>
              <h4 className="text-center">Items Carried at Time of Rescue</h4>
            </Col>
          </Row>
          <Form className='articles_caried'>
            <Row>
              <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                <Form.Label column sm="4" className='text-start'>
                  Name :
                </Form.Label>
                <Col sm="8">
                  <Form.Control
                    type="text"
                    name="rescue_name"
                    value={formData.rescue_name}
                    onChange={handleInputChange}
                    required />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                <Form.Label column sm="4" className='text-start'>
                  Date at the time of Rescue :
                </Form.Label>
                <Col sm="8">
                  <Form.Control
                    type="datetime-local"
                    name="date_time"
                    value={formatDateForInput(formData.date_time)}
                    onChange={handleInputChange}
                    required />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                <Form.Label column sm="4" className='text-start'>
                  Collected Items :
                </Form.Label>
                <Col sm="8">
                  <Form.Control
                    type="text"
                    name="collected_items"
                    value={formData.collected_items}
                    onChange={handleInputChange}
                    required />
                </Col>
              </Form.Group>

              <Form.Group as={Row} className="mb-3 mt-3">
                <Form.Label column sm="4" className='text-start'>
                  Attach Items :
                </Form.Label>
                <Col sm="8">
                  {files.attach_items ? (
                    <>
                      <img
                        src={files.attach_items}
                        alt="New"
                        style={{ width: "100px", height: "100px", marginTop: "10px" }}
                      />
                    </>
                  ) : (
                    <p>No Items photo available</p> // Display if no photo
                  )}
                </Col>
              </Form.Group>
              <Row className="d-flex align-items-center justify-content-center">
                <Col md={6} className="mt-3">
                  <h5 className="text-start">Signature</h5>
                </Col>
                <Col md={6} className="mt-3">
                  <h5 className="text-end">Seal</h5>
                </Col>
              </Row>

            </Row>
          </Form>


        </div>
      </Container>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Items Carried Form</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Col md={12}>
            <Form className='articles_caried'>
              <Row>
                <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                  <Form.Label column sm="4" className='text-start'>
                    Name :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      type="text"
                      name="rescue_name"
                      value={formData.rescue_name}
                      onChange={handleInputChange}
                      required />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                  <Form.Label column sm="4" className='text-start'>
                    Date at the time of Rescue :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      type="datetime-local"
                      name="date_time"
                      value={formatDateForInput(formData.date_time)}
                      onChange={handleInputChange}
                      required />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-1" controlId="formRescueName">
                  <Form.Label column sm="4" className='text-start'>
                    Collected Items :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      type="text"
                      name="collected_items"
                      value={formData.collected_items}
                      onChange={handleInputChange}
                      required />
                  </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3 mt-3">
                  <Form.Label column sm="4" className='text-start'>
                    Attach Items :
                  </Form.Label>
                  <Col sm="8">
                    {files.attach_items ? (
                      <>
                        <img
                          src={files.attach_items}
                          alt="Old"
                          style={{ width: "100px", height: "100px", marginTop: "10px" }}
                        />
                      </>
                    ) : (
                      <p>No Items photo available</p> // Display if no photo
                    )}

                    <Form.Control
                      type="file"
                      onChange={handleFileChange}
                      name="attach_items"
                    />
                  </Col>
                </Form.Group>


                <div className="mt-3">
                  <Button variant="success" className="m-1" type="submit" onClick={(e) => handleUpdate(e, admission_no)}>Update</Button>
                  <Button variant="secondary" className="m-1" onClick={handleClose}>Close</Button>
                </div>

              </Row>
            </Form>
          </Col>
        </Modal.Body>
      </Modal>


    </>
  )
}

export default Rescue_articles_form
