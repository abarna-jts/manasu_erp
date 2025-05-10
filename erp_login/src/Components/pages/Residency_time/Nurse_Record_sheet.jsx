import React from 'react';
import { Breadcrumb, Container, Row, Table, Button } from 'react-bootstrap';
import { Col, Form, InputGroup } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import { useState, useEffect } from 'react';
import { DateRange } from 'react-date-range';
import axios from 'axios';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css

function Nurse_Record_sheet() {
    const [show, setShow] = useState(false);
    const [currentMonth, setCurrentMonth] = useState("");
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [nurse_record, setNurseRecord] = useState([]);

    const [formData, setFormData] = useState({
        admission_no: '',
        currentMonth:'',
        temperature: '',
        bp: '',
        pulse: '',
        weight: '',
        from_date: '',
        to_date: '',
        from_date2: '',
        to_date2: '',
      });
      
    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        const monthName = new Date().toLocaleString('default', { month: 'long' });
        setCurrentMonth(monthName);
        setFormData((prev) => ({ ...prev, currentMonth: monthName }));
      }, []);

    const apiRoute = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
    });

    const [state, setState] = useState([
        {
          startDate: new Date(),
          endDate: new Date(),
          key: 'selection1'
        },
        {
          startDate: new Date(),
          endDate: new Date(),
          key: 'selection2'
        }
      ]);

    // Ensure from_date and to_date are set when modal opens
    useEffect(() => {
        if (show) {
          const today = new Date().toISOString().split('T')[0];
          setFormData((prev) => ({
            ...prev,
            from_date: today,
            to_date: today,
            from_date2: today,
            to_date2: today,
          }));
        }
      }, [show]);

    const handleSelect = (ranges) => {
        const selection = ranges.selection1;
        const startDate = selection.startDate;
        let endDate = selection.endDate;
      
        const maxEndDate = new Date(startDate);
        maxEndDate.setDate(startDate.getDate() + 14);
      
        if (endDate > maxEndDate) {
          endDate = maxEndDate;
        }
      
        setState((prevState) =>
          prevState.map((range) =>
            range.key === 'selection1' ? { ...range, endDate } : range
          )
        );
      
        setFormData((prev) => ({
          ...prev,
          from_date: startDate.toISOString().split('T')[0],
          to_date: endDate.toISOString().split('T')[0]
        }));
      };
      
      const handleSelect2 = (ranges) => {
        const selection = ranges.selection2;
        const startDate = selection.startDate;
        let endDate = selection.endDate;
      
        const maxEndDate = new Date(startDate);
        maxEndDate.setDate(startDate.getDate() + 14);
      
        if (endDate > maxEndDate) {
          endDate = maxEndDate;
        }
      
        setState((prevState) =>
          prevState.map((range) =>
            range.key === 'selection2' ? { ...range, endDate } : range
          )
        );
      
        setFormData((prev) => ({
          ...prev,
          from_date2: startDate.toISOString().split('T')[0],
          to_date2: endDate.toISOString().split('T')[0]
        }));
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
      
        try {
          const response = await apiRoute.post("/residency/nurse_record", formData);
          console.log(response);  // Log the response to check status and content
      
          if (response.status === 201) {
            alert("Record submitted successfully!");
            handleClose(); // close the modal
            // Optionally reset form
            setFormData({
                admission_no: '',
                currentMonth: '',
                temperature: '',
                bp: '',
                pulse: '',
                weight: '',
                from_date: '',
                to_date: '',
                from_date2: '',
                to_date2: '',
            });
          } else {
            alert("Submission failed. Please try again.");
          }
        } catch (error) {
          console.error("Error submitting form:", error);
          alert("An error occurred while submitting the form.");
        }
      };

      useEffect(() => {
              getNurseRecords();
          }, []);
      
          const getNurseRecords = async () => {
              try {
                  const response = await apiRoute.get('/residency/get_nurse_record');
                  console.log("API response:", response.data);
                  setNurseRecord(response.data.data);
              } catch (error) {
                  console.error('Error fetching Student:', error);
              }
          };
      
      const filteredRescueDetails = nurse_record.filter((item) => {
        const searchTerm = searchQuery.toLowerCase();
        return (
            String(item.admission_no).toLowerCase().includes(searchTerm) ||
            String(item.resident_name).toLowerCase().includes(searchTerm) ||
            String(item.follow_up).toLowerCase().includes(searchTerm)
        );
    });
      

    return (
        <>
            <Container fluid>
                <Row className='d-flex align-items-center justify-content-between'>
                    <Col md={2} className='text-start'>
                        <Breadcrumb className="d-none d-md-inline-block mb-0" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
                            <Breadcrumb.Item></Breadcrumb.Item>
                            <Breadcrumb.Item>Home</Breadcrumb.Item>
                            <Breadcrumb.Item active>Residency Time</Breadcrumb.Item>
                        </Breadcrumb>
                        <h6 className="breadcrumb_title">Record Sheet</h6>
                    </Col>
                    <Col md={5} className="text-start">
                        <h3 className="section_title">Nurse Record Sheet for Rescue Condition</h3>
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
                                    <InputGroup.Text style={{ cursor: 'pointer', background: "#6abc15", color: "#fff" }} onClick={handleShow}>
                                        <i className="fas fa-plus"></i>
                                    </InputGroup.Text>

                                </InputGroup>
                            </Form.Group>
                        </Form>
                    </Col>
                </Row>
            </Container>

            <Container>
                <Row>
                    <Col md={4}>
                        <Button variant="success"
                            className="m-1 d-flex justify-content-start align-items-center"
                            type="submit"
                            onClick={handleShow}>Enter Condition</Button>
                    </Col>
                    <Col md={12} className="mt-3 my-3">

                        <Table responsive className="table-centered table-nowrap rounded mb-0">
                            <thead className="thead-light">
                                <tr>
                                    <th scope="col">S.No.</th>
                                    <th scope="col">Month</th>
                                    <th scope="col">Date</th>
                                    <th scope="col">Temperature</th>
                                    <th scope="col">BP </th>
                                    <th scope="col">Pulse</th>
                                    <th scope="col">WT</th>
                                    <th scope="col">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                            {filteredRescueDetails.length > 0 ? (
                                filteredRescueDetails.map((item, index) => (
                                    <>
                                        <tr key={item.id}>
                                            <td rowSpan="2">{index + 1}</td>
                                            <td rowSpan="2">{item.month}</td>
                                            <td>{item.first_record_date}</td>
                                            <td>{item.temperature}</td>
                                            <td>{item.bp}</td>
                                            <td>{item.pulse}</td>
                                            <td>{item.weight}</td>
                                            <td rowSpan="2">
                                                <button className="btn btn-primary icon_details">
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button className="btn btn-danger icon_details">
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>{item.second_record_date}</td>
                                            <td>{item.temperature2}</td>
                                            <td>{item.bp2}</td>
                                            <td>{item.pulse2}</td>
                                            <td>{item.weight2}</td>
                                        </tr>
                                    </>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="text-center text-danger">No data found</td>
                                </tr>
                            )}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>


            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Enter your Record for this month</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Col md={12}>
                        <Form onSubmit={handleSubmit}>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="formAdmissionNo">
                                        <Form.Label>Admission Number</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="admission_no"
                                            value={formData.admission_no}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="formAdmissionNo">
                                        <Form.Label>Month</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="currentMonth"
                                            value={currentMonth}
                                            readOnly
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                    <Form.Label>First Record</Form.Label>
                                    <div className="custom-calendar">
                                        <DateRange
                                            editableDateInputs={true}
                                            onChange={handleSelect}
                                            ranges={[state.find((r) => r.key === 'selection1')]}
                                            />
                                    </div>
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                    <Form.Label>Second Record</Form.Label>
                                    <div className="custom-calendar">
                                    <DateRange
                                            editableDateInputs={true}
                                            onChange={handleSelect2}
                                            ranges={[state.find((r) => r.key === 'selection2')]}
                                            />
                                    </div>
                                    </Form.Group>
                                </Col>
                            </Row>

                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="formResidentName">
                                        <Form.Label>Temperature</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="temperature"
                                            value={formData.temperature}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="formResidentName">
                                        <Form.Label>BP</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="bp"
                                            value={formData.bp}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>


                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="formResidentName">
                                        <Form.Label>Pulse</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="pulse"
                                            value={formData.pulse}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3" controlId="formResidentName">
                                        <Form.Label>Weight</Form.Label>
                                        <Form.Control
                                            type="number"
                                            name="weight"
                                            value={formData.weight}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>




                            <div className="btn_footer d-flex align-items-center justify-content-end">
                                <Button variant="success" type="submit" className="m-1">
                                    Submit
                                </Button>
                                <Button variant="secondary" onClick={handleClose}>
                                    Close
                                </Button>
                            </div>
                        </Form>
                    </Col>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default Nurse_Record_sheet
