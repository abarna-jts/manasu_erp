import React from 'react'
import { Breadcrumb, Form, InputGroup, Container, Row, Col, Table, Button } from '@themesberg/react-bootstrap';
import { useState, useEffect } from "react";
import axios from 'axios';
import { useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import manasu_logo from "../Admission/Manasu-Logo.png";
import Modal from 'react-bootstrap/Modal';
import Cookies from 'js-cookie';

function Cognition() {
    const [visitDetails, setVisitDetails] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [previewRequested, setPreviewRequested] = useState(false);
    const [canConcentrate, setCanConcentrate] = useState('');
    const [selectedStates, setSelectedStates] = useState([]);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const userType = Cookies.get('usertype');

    const searchFilteredRescueDetails = (visitDetails || []).filter((item) => {
        const searchTerm = searchQuery.toLowerCase();
        return (
            String(item.admission_no).toLowerCase().includes(searchTerm) ||
            String(item.consciousness).toLowerCase().includes(searchTerm) ||
            String(item.immediate_retention).toLowerCase().includes(searchTerm) ||
            String(item.recall).toLowerCase().includes(searchTerm)
        );
    });

    const [cognitionData, setCognitionData] = useState({
        consciousness: [],
        orientation_time: '',
        orientation_place: '',
        orientation_person: '',
        consciousnessState: '',
        canConcentrate: '',
        distractibility: '',
        asking_test: '',
        names_months: '',
        test_performance: '',
        immediate_retention: '',
        recall: '',
        patient_place: '',
        dinner_ate: '',
        date_ofMrg: '',
        birthdays_children: '',
        person_past: '',
        amnesia: '',
        live_growing: '',
        person_school: '',
        breakfast_ques: '',
        do_yesterday: '',
        general_info: '',
        test_red_wri: '',
        calculation_test: '',
        proverb_testing: '',
        familiar_object: '',
        admission_no: '',
        date: '',

    })

    const apiRoute = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
    });
    const getVisitDetails = async () => {
        try {
            const response = await apiRoute.get('/recovery/get_cognition');
            console.log(response.data);
            setVisitDetails(response.data.data); // Should be an array
        } catch (error) {
            console.error("Error fetching Speech Details:", error);
        }
    };
    useEffect(() => {
        getVisitDetails();
    }, []);

    const formatDateTime = (dateStr) => {
        const date = new Date(dateStr);
        if (isNaN(date)) return ""; // Invalid date fallback

        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();

        return `${day}-${month}-${year}`;
    };

    const fetchFormData = async (id) => {
        try {
            const response = await apiRoute.get(`/recovery/getCognition/${id}`);
            const data = response.data;

            setCognitionData((cognitionData) => ({
                ...cognitionData,
                admission_no: data.admission_no || 'NULL',
                date: data.date || 'NULL',
                consciousness: data.consciousness?.split(',') || ["NULL"],
                orientation_time: data.orientation_time || 'NULL',
                orientation_place: data.orientation_place || 'NULL',
                orientation_person: data.orientation_person || 'NULL',
                consciousnessState: data.consciousnessState || 'NULL',
                canConcentrate: data.canConcentrate || 'NULL',
                distractibility: data.distractibility || 'NULL',
                asking_test: data.asking_test || 'NULL',
                names_months: data.names_months || 'NULL',
                test_performance: data.test_performance || 'NULL',
                immediate_retention: data.immediate_retention || 'NULL',
                recall: data.recall || 'NULL',
                patient_place: data.patient_place || 'NULL',
                dinner_ate: data.dinner_ate || 'NULL',
                date_ofMrg: data.date_ofMrg || 'NULL',
                birthdays_children: data.birthdays_children || 'NULL',
                person_past: data.person_past || 'NULL',
                amnesia: data.amnesia || 'NULL',
                live_growing: data.live_growing || 'NULL',
                person_school: data.person_school || 'NULL',
                breakfast_ques: data.breakfast_ques || 'NULL',
                do_yesterday: data.do_yesterday || 'NULL',
                general_info: data.general_info || 'NULL',
                test_red_wri: data.test_red_wri || 'NULL',
                calculation_test: data.calculation_test || 'NULL',
                proverb_testing: data.proverb_testing || 'NULL',
                familiar_object: data.familiar_object || 'NULL',
            }));

            setPreviewRequested(true); // trigger the effect after state updates
        } catch (error) {
            console.error("Error fetching form data:", error);
            alert("Cognition ID is not found");
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

    const formRef = useRef();

    const generatePDF = async () => {

        await new Promise((resolve) => setTimeout(resolve, 100)); // Wait for DOM to update

        const input = formRef.current;
        if (!input) {
            console.error("Form reference is not defined");
            return;
        }

        const canvas = await html2canvas(input, { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const imgProps = pdf.getImageProperties(imgData);
        const imgWidth = pdfWidth;
        const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;

        while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pdfHeight;
        }
        const pdfBlob = pdf.output('blob');
        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl, '_blank');
    };

    const handleEditform = async (id) => {
        try {
            const response = await apiRoute.get(`/recovery/getCognition/${id}`);
            const data = response.data;

            // Split and trim fetched checkbox values
            const consciousnessStateArray = data.consciousnessState?.split(',').map(i => i.trim()) || [];

            setCognitionData(cognitionData => ({
                ...cognitionData,
                id: data.id || '',
                admission_no: data.admission_no || '',
                date: data.date || '',
                consciousness: data.consciousness?.split(',').map(i => i.trim()) || [],
                orientation_time: data.orientation_time || '',
                orientation_place: data.orientation_place || '',
                orientation_person: data.orientation_person || '',
                consciousnessState: consciousnessStateArray,
                canConcentrate: data.canConcentrate || '',
                distractibility: data.distractibility || '',
                asking_test: data.asking_test || '',
                names_months: data.names_months || '',
                test_performance: data.test_performance || '',
                immediate_retention: data.immediate_retention || '',
                recall: data.recall || '',
                patient_place: data.patient_place || '',
                dinner_ate: data.dinner_ate || '',
                date_ofMrg: data.date_ofMrg || '',
                birthdays_children: data.birthdays_children || '',
                person_past: data.person_past || '',
                amnesia: data.amnesia || '',
                live_growing: data.live_growing || '',
                person_school: data.person_school || '',
                breakfast_ques: data.breakfast_ques || '',
                do_yesterday: data.do_yesterday || '',
                general_info: data.general_info || '',
                test_red_wri: data.test_red_wri || '',
                calculation_test: data.calculation_test || '',
                proverb_testing: data.proverb_testing || '',
                familiar_object: data.familiar_object || ''
            }));
            setCanConcentrate(data.canConcentrate || '');

            // ✅ Update selectedStates so checkboxes reflect the fetched data
            setSelectedStates(consciousnessStateArray);
            setShow(true);

        } catch (error) {
            console.error("Error fetching form data:", error);
            alert("Basic Detail is not found");
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCognitionData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCognitionUpdate = async (e, id) => {
        e.preventDefault();
        const completeCognition = {
            ...cognitionData,
            canConcentrate
        };
        try {
            const res = await apiRoute.post(`/recovery/updateCognition/${id}`, completeCognition, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            alert('Cognition Form updated successfully!');
            setCognitionData({
                consciousness: [],
                orientation_time: '',
                orientation_place: '',
                orientation_person: '',
                consciousnessState: '',
                canConcentrate: '',
                distractibility: '',
                asking_test: '',
                names_months: '',
                test_performance: '',
                immediate_retention: '',
                recall: '',
                patient_place: '',
                dinner_ate: '',
                date_ofMrg: '',
                birthdays_children: '',
                person_past: '',
                amnesia: '',
                live_growing: '',
                person_school: '',
                breakfast_ques: '',
                do_yesterday: '',
                general_info: '',
                test_red_wri: '',
                calculation_test: '',
                proverb_testing: '',
                familiar_object: '',
            })
            handleClose(true);
            setCanConcentrate('');
            setSelectedStates("");
            getVisitDetails();
        } catch (err) {
            console.error(err);
            alert('Update failed.');
        }
    };

    const handleRadioChange = (e) => {
        setCanConcentrate(e.target.value);
    };

    const renderConginationCheck = (field, id, label) => (
        <Form.Check
            type="checkbox"
            id={id}
            label={label}
            checked={cognitionData[field]?.includes(label)}
            onChange={(e) => {
                const updated = e.target.checked
                    ? [...cognitionData[field], label]
                    : cognitionData[field].filter(item => item !== label);

                setCognitionData(prev => ({
                    ...prev,
                    [field]: updated
                }));
            }}
        />


    );

    const handleChange1 = (e) => {
        const { name, value } = e.target;

        setCognitionData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };
    const handleCheckboxChange1 = (e) => {
        const { id, checked } = e.target;

        let updatedStates = [...selectedStates];

        if (checked) {
            updatedStates.push(id);
        } else {
            updatedStates = updatedStates.filter((item) => item !== id);
        }

        setSelectedStates(updatedStates);

        // Sync with cognitionData
        setCognitionData((prevData) => ({
            ...prevData,
            consciousnessState: updatedStates,
        }));
    };

    const consciousnessStates = [
        { id: "Conscious", img: "../assets/img/attention/attention 1.png" },
        { id: "Confusion", img: "../assets/img/attention/attention 2.png" },
        { id: "Clouding", img: "../assets/img/attention/attention 3.png" },
        { id: "Delirium", img: "../assets/img/attention/attention 4.png" },
        { id: "Stupor", img: "../assets/img/attention/attention 5.png" },
        { id: "Coma", img: "../assets/img/attention/attention 6.png" },
    ];

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = searchFilteredRescueDetails.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(searchFilteredRescueDetails.length / itemsPerPage);
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const handleDelete = async (admission_no) => {
        try {
            const confirmDelete = window.confirm("Are you sure you want to delete this record?");
            if (!confirmDelete) return; // if user clicks 'Cancel', do nothing
            const res = await apiRoute.delete(`/social_remover/CognitionToRecBin/${admission_no}`);
            console.log(res.data);
            alert("Moved to recycle bin");
            getVisitDetails();
            // refresh table
        } catch (err) {
            console.error(err);
            alert("Error deleting");
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
                            <Breadcrumb.Item active>MSE Form</Breadcrumb.Item>
                        </Breadcrumb>
                        <h6 className="breadcrumb_title">Mental Status Examination</h6>
                    </Col>
                    <Col md={8} className="text-start mb-4">
                        <h3 className="section_title text-center">Cognition or Neuropsychiatric Assessment </h3>
                    </Col>
                    <Col md={2}>
                        <div className="d-flex align-items-center px-3">

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
                        </div>
                    </Col>
                </Row>
            </Container>
            <Col md={3}>
                <Button type='button' className='btn btn-success' onClick={() => window.history.back()}>Back</Button>
            </Col>
            <Container>
                <Row>
                    <Table responsive="sm">
                        <thead>
                            <tr>
                                <th>S.No</th>
                                <th>Admission Number</th>
                                <th>Date</th>
                                <th>Consciousness</th>
                                <th>Immediate Retention</th>
                                <th>Recall after a delay</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.length > 0 ? (
                                currentItems.map((item, index) => (
                                    <tr key={item.id}>
                                        <td>{indexOfFirstItem + index + 1}</td>
                                        <td>{item.admission_no || "Null"}</td>
                                        <td>{formatDateTime(item.date) || "Null"}</td>
                                        <td>{item.consciousness || "Null"}</td>
                                        <td>{item.immediate_retention || "Null"}</td>
                                        <td>{item.recall || "Null"}</td>
                                        <td>
                                            <button className="btn btn-success icon_details"
                                                onClick={() => {
                                                    fetchFormData(item.id);
                                                }}
                                            >
                                                <i className="fas fa-eye"></i>
                                            </button>
                                            {userType === "4" && (
                                                <button className="btn btn-primary icon_details"
                                                    onClick={() => {
                                                        handleEditform(item.id);
                                                    }}
                                                ><i className="fas fa-edit"></i> </button>
                                            )}

                                            {userType === "2" && (
                                                <button className="btn btn-danger icon_details"
                                                    onClick={() => handleDelete(item.admission_no)}
                                                ><i className="fas fa-trash"></i></button>
                                            )}

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
                    <div className="d-flex justify-content-end align-items-center mb-3 mx-3">
                        <button
                            className="btn btn-success me-2"
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            <i className="fas fa-chevron-left"></i>
                        </button>

                        <span> Page {currentPage} of {totalPages} </span>

                        <button
                            className="btn btn-success ms-2"
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            <i className="fas fa-chevron-right"></i>
                        </button>
                    </div>
                </Row>

            </Container>
            <div ref={formRef} style={{ position: "absolute", left: "-9999px", top: 0, background: "#fff", padding: "20px", width: "210mm" }}>
                <Row className="d-flex align-items-center justify-content-start mb-2">
                    <Col md={2} className='d-flex align-items-center pdf_logo'>
                        <img src={manasu_logo} className="pdf_logo" alt="" />

                    </Col>
                    <Col md={8}>
                        <h4 className="text-center">COGNITION OR NEUROPSYCHIATRIC ASSESSMENT</h4>
                    </Col>
                </Row>
                <Row className='d-flex align-items-center justify-content-center'>
                    <Col md={5}>
                        <Form.Group className="mb-3 d-flex align-items-center" as={Row}>
                            <Form.Label column sm="6" className='text-start'>Admission No. :</Form.Label>
                            <Col md={6}>
                                <div className='text-start'>
                                    {cognitionData.admission_no}
                                </div>
                            </Col>
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group className="mb-3 d-flex align-items-center" as={Row}>
                            <Form.Label column sm="6" className='text-start'>Date :</Form.Label>
                            <Col md={6}>
                                <div className='text-start'>
                                    {formatDateTime(cognitionData.date)}
                                </div>
                            </Col>
                        </Form.Group>
                    </Col>
                </Row>
                <Form className='mt-4 cognition_style'>
                    <Form.Group className="mb-3 d-flex align-items-center" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <li className='icon-li'>
                                <h5>Consciousness: </h5>
                            </li>
                        </Form.Label>
                        <Col md={6}>
                            <div
                                className="wrap-textarea"
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '8px',
                                    borderRadius: "5px",
                                    minHeight: '40px',
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word',
                                    overflowWrap: 'break-word',
                                    textAlign: "justify"
                                }}
                            >
                                {cognitionData.consciousness.join(', ')}
                            </div>

                        </Col>
                    </Form.Group>
                    <li className='icon-li'>
                        <h5 className='text-start'>Orientation:</h5>
                    </li>
                    <Form.Group className="mb-3 d-flex align-items-center" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <h5>1. Oriented to Time: </h5>
                        </Form.Label>
                        <Col md={6}>
                            <div
                                className="wrap-textarea"
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '8px',
                                    borderRadius: "5px",
                                    minHeight: '40px',
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word',
                                    overflowWrap: 'break-word',
                                    textAlign: "justify"
                                }}
                            >
                                {cognitionData.orientation_time}
                            </div>

                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3 d-flex align-items-center" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <h5>2. Oriented to Place: </h5>
                        </Form.Label>
                        <Col md={6}>
                            <div
                                className="wrap-textarea"
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '8px',
                                    borderRadius: "5px",
                                    minHeight: '40px',
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word',
                                    overflowWrap: 'break-word',
                                    textAlign: "justify"
                                }}
                            >
                                {cognitionData.orientation_place}
                            </div>

                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3 d-flex align-items-center" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <h5>3. Oriented to Person: </h5>
                        </Form.Label>
                        <Col md={6}>
                            <div
                                className="wrap-textarea"
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '8px',
                                    borderRadius: "5px",
                                    minHeight: '40px',
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word',
                                    overflowWrap: 'break-word',
                                    textAlign: "justify"
                                }}
                            >
                                {cognitionData.orientation_person}
                            </div>

                        </Col>
                    </Form.Group>
                    <li className='icon-li'>
                        <h5 className='text-start'>Attention:</h5>
                    </li>
                    <Form.Group className="mb-3 d-flex align-items-center" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <h5>Is the attention easily aroused and sustained. Ask the patient to repeat digits forwards backwards. </h5>
                        </Form.Label>
                        <Col md={6}>
                            <div
                                className="wrap-textarea"
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '8px',
                                    borderRadius: "5px",
                                    minHeight: '40px',
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word',
                                    overflowWrap: 'break-word',
                                    textAlign: "justify"
                                }}
                            >
                                {cognitionData.consciousnessState}
                            </div>

                        </Col>
                    </Form.Group>
                    <li className='icon-li'>
                        <h5 className='text-start'>Concentration</h5>
                    </li>
                    <Form.Group className="mb-3 d-flex align-items-center" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <h5>1. Can the patient concentrate ?</h5>
                        </Form.Label>
                        <Col md={6}>
                            <div
                                className="wrap-textarea"
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '8px',
                                    borderRadius: "5px",
                                    minHeight: '40px',
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word',
                                    overflowWrap: 'break-word',
                                    textAlign: "justify"
                                }}
                            >
                                {cognitionData.canConcentrate}
                            </div>

                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3 d-flex align-items-center" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <h5>2. Ease of distractibility</h5>
                        </Form.Label>
                        <Col md={6}>
                            <div
                                className="wrap-textarea"
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '8px',
                                    borderRadius: "5px",
                                    minHeight: '40px',
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word',
                                    overflowWrap: 'break-word',
                                    textAlign: "justify"
                                }}
                            >
                                {cognitionData.distractibility}
                            </div>

                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3 d-flex align-items-center" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <h5>3. Ask to subtract serial sevens from hundred (100-7 test), or serial threes from forty (40-3 test), or to count backwards from 20</h5>
                        </Form.Label>
                        <Col md={6}>
                            <div
                                className="wrap-textarea"
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '8px',
                                    borderRadius: "5px",
                                    minHeight: '40px',
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word',
                                    overflowWrap: 'break-word',
                                    textAlign: "justify"
                                }}
                            >
                                {cognitionData.asking_test}
                            </div>

                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3 d-flex align-items-center" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <h5>4. Enumerate the names of the months (or days of the week) in the reverse order.</h5>
                        </Form.Label>
                        <Col md={6}>
                            <div
                                className="wrap-textarea"
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '8px',
                                    borderRadius: "5px",
                                    minHeight: '40px',
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word',
                                    overflowWrap: 'break-word',
                                    textAlign: "justify"
                                }}
                            >
                                {cognitionData.names_months}
                            </div>

                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3 d-flex align-items-center" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <h5>5. Note down the answers and the time take perform the tests.</h5>
                        </Form.Label>
                        <Col md={6}>
                            <div
                                className="wrap-textarea"
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '8px',
                                    borderRadius: "5px",
                                    minHeight: '40px',
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word',
                                    overflowWrap: 'break-word',
                                    textAlign: "justify"
                                }}
                            >
                                {cognitionData.test_performance}
                            </div>

                        </Col>
                    </Form.Group>
                    <li className='icon-li'>
                        <h5 className='text-start'>Memory</h5>
                    </li>
                    <Form.Group className="mb-3 d-flex align-items-center mt-5" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <h5>Immediate Retention (IR)</h5>
                        </Form.Label>
                        <Col md={6}>
                            <div
                                className="wrap-textarea"
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '8px',
                                    borderRadius: "5px",
                                    minHeight: '40px',
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word',
                                    overflowWrap: 'break-word',
                                    textAlign: "justify"
                                }}
                            >
                                {cognitionData.immediate_retention}
                            </div>

                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3 d-flex align-items-center" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <h5>Recall (R) after a delay</h5>
                        </Form.Label>
                        <Col md={6}>
                            <div
                                className="wrap-textarea"
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '8px',
                                    borderRadius: "5px",
                                    minHeight: '40px',
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word',
                                    overflowWrap: 'break-word',
                                    textAlign: "justify"
                                }}
                            >
                                {cognitionData.recall}
                            </div>

                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3 d-flex align-items-center" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <h5>How did the patient come to the room/hospital ?</h5>
                        </Form.Label>
                        <Col md={6}>
                            <div
                                className="wrap-textarea"
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '8px',
                                    borderRadius: "5px",
                                    minHeight: '40px',
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word',
                                    overflowWrap: 'break-word',
                                    textAlign: "justify"
                                }}
                            >
                                {cognitionData.patient_place}
                            </div>

                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3 d-flex align-items-center" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <h5>What he ate for dinner the day before or for breakfast the same morning ?</h5>
                        </Form.Label>
                        <Col md={6}>
                            <div
                                className="wrap-textarea"
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '8px',
                                    borderRadius: "5px",
                                    minHeight: '40px',
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word',
                                    overflowWrap: 'break-word',
                                    textAlign: "justify"
                                }}
                            >
                                {cognitionData.dinner_ate}
                            </div>

                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3 d-flex align-items-center" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <h5>Ask for the date of marriage :</h5>
                        </Form.Label>
                        <Col md={6}>
                            <div
                                className="wrap-textarea"
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '8px',
                                    borderRadius: "5px",
                                    minHeight: '40px',
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word',
                                    overflowWrap: 'break-word',
                                    textAlign: "justify"
                                }}
                            >
                                {cognitionData.date_ofMrg}
                            </div>

                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3 d-flex align-items-center" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <h5>Name and birthdays of children :</h5>
                        </Form.Label>
                        <Col md={6}>
                            <div
                                className="wrap-textarea"
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '8px',
                                    borderRadius: "5px",
                                    minHeight: '40px',
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word',
                                    overflowWrap: 'break-word',
                                    textAlign: "justify"
                                }}
                            >
                                {cognitionData.birthdays_children}
                            </div>

                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3 d-flex align-items-center" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <h5>Any other relevant questions from the person's past :</h5>
                        </Form.Label>
                        <Col md={6}>
                            <div
                                className="wrap-textarea"
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '8px',
                                    borderRadius: "5px",
                                    minHeight: '40px',
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word',
                                    overflowWrap: 'break-word',
                                    textAlign: "justify"
                                }}
                            >
                                {cognitionData.person_past}
                            </div>

                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3 d-flex align-items-center" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <h5>Note any amnesia :</h5>
                        </Form.Label>
                        <Col md={6}>
                            <div
                                className="wrap-textarea"
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '8px',
                                    borderRadius: "5px",
                                    minHeight: '40px',
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word',
                                    overflowWrap: 'break-word',
                                    textAlign: "justify"
                                }}
                            >
                                {cognitionData.amnesia}
                            </div>

                        </Col>
                    </Form.Group>
                    <li className='icon-li'>
                        <h5 className='text-start'>Question to ask for the Memory</h5>
                    </li>
                    <Form.Group className="mb-3 d-flex align-items-center" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <h5>Note any amnesia :</h5>
                        </Form.Label>
                        <Col md={6}>
                            <div
                                className="wrap-textarea"
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '8px',
                                    borderRadius: "5px",
                                    minHeight: '40px',
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word',
                                    overflowWrap: 'break-word',
                                    textAlign: "justify"
                                }}
                            >
                                {cognitionData.amnesia}
                            </div>

                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3 d-flex align-items-center" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <h5>Where did you live when you were growing up?</h5>
                        </Form.Label>
                        <Col md={6}>
                            <div
                                className="wrap-textarea"
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '8px',
                                    borderRadius: "5px",
                                    minHeight: '40px',
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word',
                                    overflowWrap: 'break-word',
                                    textAlign: "justify"
                                }}
                            >
                                {cognitionData.live_growing}
                            </div>

                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3 d-flex align-items-center" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <h5>What was the name of the school you went to?</h5>
                        </Form.Label>
                        <Col md={6}>
                            <div
                                className="wrap-textarea"
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '8px',
                                    borderRadius: "5px",
                                    minHeight: '40px',
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word',
                                    overflowWrap: 'break-word',
                                    textAlign: "justify"
                                }}
                            >
                                {cognitionData.person_school}
                            </div>

                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3 d-flex align-items-center" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <h5>What did you have for breakfast?</h5>
                        </Form.Label>
                        <Col md={6}>
                            <div
                                className="wrap-textarea"
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '8px',
                                    borderRadius: "5px",
                                    minHeight: '40px',
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word',
                                    overflowWrap: 'break-word',
                                    textAlign: "justify"
                                }}
                            >
                                {cognitionData.breakfast_ques}
                            </div>

                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3 d-flex align-items-center" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <h5>What did you do Yesterday?</h5>
                        </Form.Label>
                        <Col md={6}>
                            <div
                                className="wrap-textarea"
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '8px',
                                    borderRadius: "5px",
                                    minHeight: '40px',
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word',
                                    overflowWrap: 'break-word',
                                    textAlign: "justify"
                                }}
                            >
                                {cognitionData.do_yesterday}
                            </div>

                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3 d-flex align-items-center" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <h5>Ask questions about general information,
                                keeping in mind the patient's educational
                                and social background, his experiences and
                                interests</h5>
                        </Form.Label>
                        <Col md={6}>
                            <div
                                className="wrap-textarea"
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '8px',
                                    borderRadius: "5px",
                                    minHeight: '40px',
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word',
                                    overflowWrap: 'break-word',
                                    textAlign: "justify"
                                }}
                            >
                                {cognitionData.general_info}
                            </div>

                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3 d-flex align-items-center mt-3" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <h5>Test for reading and writing</h5>
                        </Form.Label>
                        <Col md={6}>
                            <div
                                className="wrap-textarea"
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '8px',
                                    borderRadius: "5px",
                                    minHeight: '40px',
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word',
                                    overflowWrap: 'break-word',
                                    textAlign: "justify"
                                }}
                            >
                                {cognitionData.test_red_wri}
                            </div>

                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3 d-flex align-items-center mt-5" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <h5>Give simple tests of calculation</h5>
                        </Form.Label>
                        <Col md={6}>
                            <div
                                className="wrap-textarea"
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '8px',
                                    borderRadius: "5px",
                                    minHeight: '40px',
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word',
                                    overflowWrap: 'break-word',
                                    textAlign: "justify"
                                }}
                            >
                                {cognitionData.calculation_test}
                            </div>

                        </Col>
                    </Form.Group>
                    <li className='icon-li'>
                        <h5 className='text-start'>Abstract thinking:</h5>
                    </li>
                    <Form.Group className="mb-3 d-flex align-items-center" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <h5>Proverb testing: Asking the meaning of simple proverbs.</h5>
                        </Form.Label>
                        <Col md={6}>
                            <div
                                className="wrap-textarea"
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '8px',
                                    borderRadius: "5px",
                                    minHeight: '40px',
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word',
                                    overflowWrap: 'break-word',
                                    textAlign: "justify"
                                }}
                            >
                                {cognitionData.proverb_testing}
                            </div>

                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3 d-flex align-items-center" as={Row}>
                        <Form.Label column sm="6" className='text-start'>
                            <h5>Ask the resident to identify the similarities and differences between familiar objects such as a table and a chair, a banana and an orange, a dog and a lion, and an eye and an ear. </h5>
                        </Form.Label>
                        <Col md={6}>
                            <div
                                className="wrap-textarea"
                                style={{
                                    border: '1px solid #ccc',
                                    padding: '8px',
                                    borderRadius: "5px",
                                    minHeight: '40px',
                                    whiteSpace: 'pre-wrap',
                                    wordWrap: 'break-word',
                                    overflowWrap: 'break-word',
                                    textAlign: "justify"
                                }}
                            >
                                {cognitionData.familiar_object}
                            </div>

                        </Col>
                    </Form.Group>
                </Form>
            </div>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Cognition Form </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Col md={12}>
                        <Form>
                            <ul>
                                <li className='icon-li'>
                                    <h4 style={{ display: "inline" }}>Consciousness:</h4>
                                    <div className="d-flex flex-wrap gap-3 mt-2">
                                        {[
                                            ["Conscious", "Conscious"],
                                            ["Confusion", "Confusion"],
                                            ["Clouding", "Clouding"],
                                            ["Delirium", "Delirium"],
                                            ["stupor", "Stupor"],
                                            ["coma", "Coma"],
                                        ].map(([id, label]) => renderConginationCheck("consciousness", id, label))}
                                        <p className="w-100 mt-2">Any disturbance of consciousness should be rated on Glasgow Coma Scale.</p>
                                    </div>
                                </li>

                                <li className='icon-li'>
                                    <h4 style={{ display: "inline" }}>Orientation:</h4>
                                    <div className="d-flex flex-wrap gap-3 mt-2">
                                        <label>Oriented to Time:</label>
                                        <select id="orientation_time" name="orientation_time" className="form-control" required
                                            value={cognitionData.orientation_time}
                                            onChange={handleChange1}>
                                            <option value="">-- Select --</option>
                                            <option value="yes">Yes (knows time, date, season, etc.)</option>
                                            <option value="no">No</option>
                                        </select>

                                        <label>Oriented to Place:</label>
                                        <select id="orientation_place" name="orientation_place" className="form-control" required
                                            value={cognitionData.orientation_place}
                                            onChange={handleChange1}>
                                            <option value="">-- Select --</option>
                                            <option value="yes">Yes (knows location, residence)</option>
                                            <option value="no">No</option>
                                        </select>

                                        <label>Oriented to Person:</label>
                                        <select id="orientation_person" name="orientation_person" className="form-control" required
                                            value={cognitionData.orientation_person}
                                            onChange={handleChange1}>
                                            <option value="">-- Select --</option>
                                            <option value="yes">Yes (knows name, identifies others)</option>
                                            <option value="no">No</option>
                                        </select>

                                    </div>
                                </li>

                                <li className='icon-li'>
                                    <h4 style={{ display: "inline" }}>Attention:</h4>
                                    <p>Is the attention easily aroused and sustained. Ask the patient to repeat digits forwards backwards.</p>
                                    <div className="d-flex flex-wrap gap-3 mt-2">
                                        {consciousnessStates.map((state) => (
                                            <div key={state.id} style={{ width: "30%", minWidth: "200px" }}>
                                                <Form.Check
                                                    type="checkbox"
                                                    id={state.id}
                                                    checked={selectedStates.includes(state.id)}
                                                    onChange={handleCheckboxChange1}
                                                    label={
                                                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                                            <img
                                                                src={state.img}
                                                                alt={state.label}
                                                                style={{ width: "100%", height: "auto", objectFit: "contain" }}
                                                            />
                                                            <span>{state.label}</span>
                                                        </div>
                                                    }
                                                />
                                            </div>
                                        ))}
                                    </div>

                                </li>

                                <li className='icon-li'>
                                    <h4 style={{ display: "inline" }}>Concentration</h4>
                                    <Form.Group className="mb-3">
                                        <Form.Label>1. Can the patient concentrate?</Form.Label>
                                        <Form.Check
                                            type="radio"
                                            label="Yes"
                                            name="canConcentrate"
                                            value="Yes"
                                            checked={canConcentrate.toLowerCase() === 'yes'}
                                            onChange={handleRadioChange}
                                        />
                                        <Form.Check
                                            type="radio"
                                            label="No"
                                            name="canConcentrate"
                                            value="No"
                                            checked={canConcentrate.toLowerCase() === 'no'}
                                            onChange={handleRadioChange}
                                        />

                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>2. Ease of distractibility</Form.Label>
                                        <Form.Control as="textarea" rows={2}
                                            placeholder="Describe how easily the Resident's is distracted"
                                            name='distractibility'
                                            value={cognitionData.distractibility}
                                            onChange={handleInputChange} />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>3. Ask to subtract serial sevens from hundred (100-7 test), or serial threes from forty (40-3 test), or to count backwards from 20</Form.Label>
                                        <Form.Control as="textarea" rows={2}
                                            placeholder="Describe the resident's response."
                                            name='asking_test'
                                            value={cognitionData.asking_test}
                                            onChange={handleInputChange} />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>4. Enumerate the names of the months (or days of the week) in the reverse order.</Form.Label>
                                        <Form.Control as="textarea" rows={2}
                                            placeholder="Describe or write the resident's response here"
                                            name="names_months"
                                            value={cognitionData.names_months}
                                            onChange={handleInputChange} />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>5. Note down the answers and the time take perform the tests.</Form.Label>
                                        <Form.Control as="textarea" rows={2}
                                            placeholder="Describe here..."
                                            value={cognitionData.test_performance}
                                            name="test_performance"
                                            onChange={handleInputChange} />
                                    </Form.Group>
                                </li>

                                <li className='icon-li'>
                                    <h4 style={{ display: "inline" }}>Memory:</h4>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Immediate Retention (IR)</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={2}
                                            name="immediate_retention"
                                            value={cognitionData.immediate_retention}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Recall (R) after a delay</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={2}
                                            name="recall"
                                            value={cognitionData.recall}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>How did the patient come to the room/hospital ?</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={2}
                                            name="patient_place"
                                            value={cognitionData.patient_place}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>What he ate for dinner the day before or for breakfast the same morning ?</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={2}
                                            name="dinner_ate"
                                            value={cognitionData.dinner_ate}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Ask for the date of marriage</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={2}
                                            name="date_ofMrg"
                                            value={cognitionData.date_ofMrg}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Name and birthdays of children</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            name="birthdays_children"
                                            value={cognitionData.birthdays_children}
                                            onChange={handleInputChange}
                                            rows={2}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Any other relevant questions from the person's past</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            value={cognitionData.person_past}
                                            name='person_past'
                                            onChange={handleInputChange}
                                            rows={2}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Note any amnesia (anterograde/retrograde)</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={2}
                                            name="amnesia"
                                            value={cognitionData.amnesia}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>
                                </li>

                                <li className='icon-li'>
                                    <h4 style={{ display: "inline" }}>Question to ask for the Memory</h4>
                                    <h5>Long-term Memory</h5>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Where did you live when you were growing up?</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            name="live_growing"
                                            value={cognitionData.live_growing}
                                            onChange={handleInputChange}
                                            rows={2}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>What was the name of the school you went to?</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={2}
                                            name="person_school"
                                            value={cognitionData.person_school}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>

                                    <h5>Short-term Memory</h5>

                                    <Form.Group className="mb-3">
                                        <Form.Label>What did you have for breakfast?</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={2}
                                            name="breakfast_ques"
                                            value={cognitionData.breakfast_ques}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>What did you do Yesterday?</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={2}
                                            name="do_yesterday"
                                            value={cognitionData.do_yesterday}
                                            onChange={handleInputChange}
                                        />
                                    </Form.Group>


                                </li>

                                <li className='icon-li'>
                                    <h4 style={{ display: "inline" }}>Intelligence:</h4>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Ask questions about general information, keeping in mind the patient's educational and social background, his experiences and interests</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={2}
                                            name="general_info"
                                            value={cognitionData.general_info}
                                            onChange={handleInputChange}
                                            placeholder="Describe what you asked and how the resident responded."
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Test for reading and writing</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={2}
                                            name='test_red_wri'
                                            value={cognitionData.test_red_wri}
                                            onChange={handleInputChange}
                                            placeholder="Describe what you asked and how the resident responded."
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Give simple tests of calculation</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={2}
                                            name='calculation_test'
                                            value={cognitionData.calculation_test}
                                            onChange={handleInputChange}
                                            placeholder="Describe what you asked and how the resident responded."
                                        />
                                    </Form.Group>
                                </li>

                                <li>
                                    <h4 style={{ display: "inline" }}>Abstract thinking:</h4>
                                    <p>Abstract thinking testing assesses patient's concept formation. The methods used are:</p>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Proverb testing: Asking the meaning of simple proverbs.</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={2}
                                            name="proverb_testing"
                                            value={cognitionData.proverb_testing}
                                            onChange={handleInputChange}
                                            placeholder="Describe what you asked and how the resident responded."
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-3">
                                        <Form.Label>Ask the resident to identify the similarities and differences between familiar objects such as a table and a chair, a banana and an orange, a dog and a lion, and an eye and an ear.</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={2}
                                            name="familiar_object"
                                            value={cognitionData.familiar_object}
                                            onChange={handleInputChange}
                                            placeholder="Describe what you asked and how the resident responded."
                                        />
                                    </Form.Group>
                                </li>
                                <div className="mt-3">
                                    <Button variant="success" className="m-1" type="submit" onClick={(e) => handleCognitionUpdate(e, cognitionData.id)}>Update</Button>
                                    <Button variant="secondary" className="m-1" onClick={handleClose}>Close</Button>
                                </div>

                            </ul>
                        </Form>
                    </Col>
                </Modal.Body>
            </Modal>

        </>
    )
}

export default Cognition
