import React from 'react';
import { Breadcrumb, Container, Row, Table, Button, InputGroup } from 'react-bootstrap';
import { Col, Form } from 'react-bootstrap';
import { useState, useEffect} from 'react';
import axios from 'axios';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { useRef } from "react";


function AllStudentDetails() {
    const [stud_details, setStudentDetails] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    const [formData, setFormData] = useState({
        stud_name:'',
        stud_id:'',
        department:'',
        clg_name:'',
        duration:'',
        from_date:'',
        to_date:''
    })

    const apiRoute = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
    });

    const getStudentDetails = async () => {
        try {
            const response = await apiRoute.get('/formality/getStudentDetails');;
            console.log("API response:", response.data);
            setStudentDetails(response.data.data);
        } catch (error) {
            console.error('Error fetching Student:', error);
        }
    };
    useEffect(() => {
        getStudentDetails();
    }, []);

    const formatDateTime = (dateStr) => {
        const date = new Date(dateStr);
        if (isNaN(date)) return ""; // Invalid date fallback
      
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
      
        return `${day}-${month}-${year}`;
      };

    const filteredRescueDetails = stud_details.filter((item) => {
        const searchTerm = searchQuery.toLowerCase();
        return (
            String(item.admission_no).toLowerCase().includes(searchTerm) ||
            String(item.rescue_name).toLowerCase().includes(searchTerm) ||
            String(item.referred_by).toLowerCase().includes(searchTerm) ||
            String(item.from_place).toLowerCase().includes(searchTerm) ||
            String(item.police_memo).toLowerCase().includes(searchTerm) ||
            String(item.information_public).toLowerCase().includes(searchTerm)
        );
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const fetchFormData =async (id) =>{
        try {

            const response = await apiRoute.get(`/formality/getStudentDet/${id}`);
            const data = response.data;

            setFormData((formData) => ({
                ...formData,
                stud_name: data.stud_name || '',
                stud_id: data.stud_id || '',
                department: data.department || '',
                clg_name: data.clg_name || '',
                duration: data.duration || '',
                from_date: data.from_date || '',
                to_date: data.to_date || '',
                
              }));
            
            setTimeout(() => {
                generatePDF();
              }, 500);

        }catch (error) {
            console.error("Error fetching form data:", error);
          }
      }

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


    return (
        <>
            <Container fluid>
                <Row className='d-flex align-items-center justify-content-between'>
                    <Col md={2} className='text-start'>
                        <Breadcrumb className="d-none d-md-inline-block mb-0" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
                            <Breadcrumb.Item></Breadcrumb.Item>
                            <Breadcrumb.Item>Home</Breadcrumb.Item>
                            <Breadcrumb.Item active>Reunion</Breadcrumb.Item>
                        </Breadcrumb>
                        <h6 className="breadcrumb_title">Internship</h6>
                    </Col>
                    <Col md={8} className="text-center">
                        <h3 className="section_title">Internship Student Details</h3>
                    </Col>

                    <Col md={2}>
                        <Form className="navbar-search">
                            <Form.Group id="topbarSearch">
                                <InputGroup className="input-group-merge search-bar">

                                    <Form.Control
                                        type="text"
                                        placeholder="Search"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </InputGroup>
                            </Form.Group>
                        </Form>
                    </Col>

                </Row>
            </Container>

            <Container>
                <Row className='mt-3'>
                    <Col md={12}>
                        <Table responsive="sm">

                            <thead>
                                <tr>
                                    <th>S.No</th>
                                    <th>Stud Id</th>
                                    <th>Student Name</th>
                                    <th>Department</th>
                                    <th>College Name</th>
                                    <th>Duration</th>
                                    <th>From Date</th>
                                    <th>To Date</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRescueDetails.length > 0 ? (
                                    filteredRescueDetails.map((item, index) => (
                                        <tr key={item.id}>
                                            <td>{index + 1}</td>
                                            <td>{item.stud_id}</td>
                                            <td>{item.stud_name}</td>
                                            <td>{item.department}</td>
                                            <td>{item.clg_name}</td>
                                            <td>{item.duration}</td>
                                            <td>{formatDateTime(item.from_date)}</td>
                                            <td>{formatDateTime(item.to_date)}</td>
                                            <td>
                                                <button className="btn btn-success icon_details"
                                                    onClick={() => {
                                                        fetchFormData(item.id);
                                                    }}
                                                >
                                                    <i className="fas fa-eye"></i>
                                                </button>
                                                <button className="btn btn-primary icon_details"
                                                    onClick={() => {
                                                        handleEditform(item.id);
                                                    }}
                                                ><i className="fas fa-edit"></i> </button>
                                                {/* {userType === "2" && (
                                                    <button className="btn btn-danger icon_details"
                                                        onClick={() => handleDelete(item.id)}
                                                    ><i className="fas fa-trash"></i></button>
                                                )} */}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="10" className="text-center text-danger">No data found</td>
                                    </tr>
                                )}
                            </tbody>

                        </Table>

                    </Col>
                </Row>
            </Container>

            <div ref={formRef} style={{ position: "absolute", left: "-9999px", top: 0, background: "#fff", padding: "20px", width: "210mm" }}>
                <Form>
                    <Col md={8} className="consultant_box my-2 p-3">
                        <Row>

                            <Form.Group as={Row} className="mb-1 text-start" controlId="formEmailID">
                                <Form.Label column sm="4">
                                    Student Name :
                                </Form.Label>
                                <Col sm="8">
                                    <Form.Control
                                        name="stud_name"
                                        type="text"
                                        value={formData.stud_name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-1 text-start" controlId="formEmailID">
                                <Form.Label column sm="4">
                                    Student ID :
                                </Form.Label>
                                <Col sm="8">
                                    <Form.Control
                                        name="stud_id"
                                        type="number"
                                        value={formData.stud_id}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-1 text-start" controlId="formEmailID">
                                <Form.Label column sm="4">
                                    Department :
                                </Form.Label>
                                <Col sm="8">
                                    <Form.Control
                                        name="department"
                                        type="text"
                                        value={formData.department}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-1 text-start" controlId="formEmailID">
                                <Form.Label column sm="4">
                                    College Name :
                                </Form.Label>
                                <Col sm="8">
                                    <Form.Control
                                        name="clg_name"
                                        type="text"
                                        value={formData.clg_name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} className="mb-1 text-start" controlId="formEmailID">
                                <Form.Label column sm="4">
                                    Duration :
                                </Form.Label>
                                <Col sm="8">
                                    <Form.Control
                                        name="duration"
                                        type="text"
                                        value={formData.duration}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>

                            {/* From and To Date in the same row */}
                            <Form.Group as={Row} className="mb-3 text-start">
                                <Form.Label column sm="4">
                                    Intern Date :
                                </Form.Label>
                                <Col sm="4">
                                    <Form.Control
                                        name="from_date"
                                        type="date"
                                        value={formData.from_date}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                                <Col sm="4">
                                    <Form.Control
                                        name="to_date"
                                        type="date"
                                        value={formData.to_date}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Col>
                            </Form.Group>

                        </Row>
                    </Col>
                </Form>
            </div>
        </>
    )
}

export default AllStudentDetails
