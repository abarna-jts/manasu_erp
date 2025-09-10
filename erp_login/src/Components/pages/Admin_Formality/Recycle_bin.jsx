import React from 'react'
import { Breadcrumb, Container, Row, Col } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Recycle_bin() {
    const [recycle_details, setRecycleDetail] = useState([]); // not undefined
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const fetchRecycleReport = async () => {
        try {
            const response = await apiRoute.get('/remove/getRecycleBin');
            setRecycleDetail(response.data.data); // ✅ Only set the actual data
            console.log(response);
        } catch (err) {
            console.error('Error fetching Event Report:', err);
        }
    };

    useEffect(() => {
        fetchRecycleReport();

    }, []);

    const searchFilteredRescueDetails = (recycle_details || []).filter((item) => {
        const searchTerm = searchQuery.toLowerCase();
        return (
            String(item.admission_no).toLowerCase().includes(searchTerm) ||
            String(item.source_table).toLowerCase().includes(searchTerm) // use correct field
        );
    });

    const apiRoute = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = searchFilteredRescueDetails.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(searchFilteredRescueDetails.length / itemsPerPage);
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    const handleRestore = async (id) => {
        try {
            const confirmDelete = window.confirm("Are you sure you want to restore this record?");
            if (!confirmDelete) return; // if user clicks 'Cancel', do nothing
            const res = await apiRoute.post(`remove/restoreRecycleBin/${id}`);
            alert("Record restored successfully ✅");
            // refresh recycle bin table
            fetchRecycleReport();
        } catch (err) {
            console.error(err);
            alert("Error restoring record ❌");
        }
    };
    const sourceNameMapping = {
        first_information: "Resident Rescue Details",
        essential_records: "Resident Document Information Form",
        form_2: "SCRB Form2",
        form_2a: "SCRB Form2A",
        form_2b: "SCRB Form2B",
        form_2c: "SCRB Form2C",
        rescue_condition: "Consultation Report by Doctor",
        dr_visit: "Doctor’s Visit Details",
        nurse_record: "Nursing Record Sheet – Resident Health & Medications",
        prescription_medicines: "Nurse Prescription Form",
        medical_camp: "Medical Camp Report",
        observation_report: "Resident Observation & Progress Report – Social Worker",
        basic_detail: "Psychiatric Demographic Information",
        cheif_complaint: "Psychiatric The Chief Complaint",
        presenting_problems: "Psychiatric Presenting Problems",
        psy_history: "Psychiatric HISTORY",
        medical_history: "Psychiatric Medical History",
        familyhis_data: "Psychiatric Family History",
        social_history: "Psychiatric Social History",
        development_history: "Psychiatric Developmental History",
        substance_use: "Psychiatric Substance Use History",
        suicidal_data: "Psychiatric Suicidal and Homicidal Ideation",
        general_appearance: "MSE General Appearance and Behaviour",
        speech: "MSE Speech",
        mood_affect: "MSE Mood and Affect",
        though_form: "MSE Though",
        perception: "MSE Perception",
        conginition: "MSE Cognition or Neuropsychiatric Assessment",
        judgement: "MSE Judgement",
        insight: "MSE Insight",
        reunion_summary: "Reunion Summary",
        family_request_form: "Family Request Letter",
        self_declaration: "Self Declaration Form",
        media_consent: "Media Consent",
        formality_declaration: "Resident's Possessions and Document Handover Form",
        discharge_checklist: "Resident Discharge Summary and Checklist",
        event_report: "Resident Activities and Events Report Detail",
        celebration_report: "Celebration Events Report Detail",
        community_report: "Community Programs Report Detail",
        staff_report: "Staff Programs Report Detail",
        discharge_summary: "Resident's Discharge Information",
        internship_form: "Internship Student Details",
        patient_info: "Patient Information",
        // add more mappings here
    };


    return (
        <>
            <Container fluid>
                <Row className='d-flex align-items-center justify-content-between'>
                    <Col md={2} className='text-start'>
                        <Breadcrumb className="d-none d-md-inline-block mb-0" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
                            <Breadcrumb.Item></Breadcrumb.Item>
                            <Breadcrumb.Item><Link to="/dashboard">Home</Link></Breadcrumb.Item>
                            <Breadcrumb.Item active>Director</Breadcrumb.Item>
                        </Breadcrumb>
                        <h6 className="breadcrumb_title">Restore Datas</h6>
                    </Col>
                    <Col md={8} className="text-center">
                        <h3 className="section_title">Recycle Bin</h3>
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
            <Container>
                <Row>
                    <Table responsive="sm">

                        <thead>
                            <tr>
                                <th>S.No</th>
                                <th>Admission No. / ID</th>
                                <th>Form Name</th>
                                <th>Datas</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.length > 0 ? (
                                currentItems.map((item, index) => (
                                    <tr key={item.id}>
                                        <td>{indexOfFirstItem + index + 1}</td>
                                        <td>{item.ref_id}</td>
                                        <td>{sourceNameMapping[item.source_table] || item.source_table}</td>
                                        <td>
                                            {(() => {
                                                try {
                                                    const parsedData = JSON.parse(item.data); // convert string to object
                                                    // Filter out the 'id' key
                                                    const entries = Object.entries(parsedData)
                                                        .filter(([key]) => key !== 'id'&& key !=='admission_no') // exclude 'id'
                                                        .slice(0, 5); // take first 5 items after filtering
                                                    return entries.map(([key, value]) => (
                                                        <div key={key}>
                                                            <strong>{key}:</strong> {value}
                                                        </div>
                                                    ));
                                                } catch (e) {
                                                    return item.data; // fallback if not JSON
                                                }
                                            })()}
                                        </td>



                                        <td>
                                            <button
                                                className="btn btn-secondary icon_details mx-1"
                                                onClick={() => handleRestore(item.id)}
                                            >
                                                <i className="fas fa-undo"></i> {/* Restore Icon */}
                                            </button>

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
        </>
    )
}

export default Recycle_bin
