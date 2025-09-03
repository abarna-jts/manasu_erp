import React from 'react'
import { Breadcrumb, Container, Row, Col } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import axios from 'axios';

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

    const handleRestore = async (admission_no) => {
        try {
            const confirmDelete = window.confirm("Are you sure you want to restore this record?");
            if (!confirmDelete) return; // if user clicks 'Cancel', do nothing
            const res = await apiRoute.post(`remove/restoreRecycleBin/${admission_no}`);
            alert("Record restored successfully ✅");
            // refresh recycle bin table
            fetchRecycleReport();
        } catch (err) {
            console.error(err);
            alert("Error restoring record ❌");
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
                                <th>Admission No.</th>
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
                                        <td>{item.admission_no}</td>
                                        <td>{item.source_table}</td>
                                        <td>{item.data}</td>
                                        <td>
                                            <button
                                                className="btn btn-secondary icon_details mx-1"
                                                onClick={() => handleRestore(item.admission_no)}
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
