import React from 'react'
import { Container, Row, Col, Form, InputGroup, Button, Table } from 'react-bootstrap';
import { Breadcrumb } from '@themesberg/react-bootstrap';
import { useState, useEffect } from 'react';
import axios from 'axios';

function User_permission() {
  const [userDetails, setUserDetails] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState({});

  const apiRoute = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
  });

  const filteredRescueDetails = userDetails.filter((item) => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      String(item.email).toLowerCase().includes(searchTerm) 
    );
  });

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const response = await apiRoute.get('/api/userDetails');
        setUserDetails(response.data.data); // Should be an array
      } catch (error) {
        console.error("Error fetching User Details:", error);
      }
    };

    getUserDetails();
  }, []);

  const handleUserTypeChange = async (id, selectedValue) => {
    let userTypeCode = null;

    if (selectedValue === 'Nurse') {
      userTypeCode = 3;
    } else if (selectedValue === 'Social Worker') {
      userTypeCode = 4;
    }

    try {
      // Call backend API to update user_type
      await apiRoute.post('/api/updateUserType', {
        id,
        user_type: userTypeCode,
      });
      alert(`User changed to ${selectedValue} successfully`);

      // Optionally update frontend state
      setSelectedItems((prev) => ({
        ...prev,
        [id]: userTypeCode,
      }));
    } catch (error) {
      console.error("Error updating user_type:", error);
      alert("Failed to update user type.");
    }
  };

  return (
    <>
      <div className="d-xl-flex justify-content-between align-items-center flex-wrap flex-md-nowrap text-start py-2">
        <Row className='w-100 d-flex align-items-center'>
          <Col md={2}>
            <div className="d-block mb-4 mb-xl-0 form_2A_breadcrumb">
              <Breadcrumb className="d-none d-md-inline-block mb-0" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
                <Breadcrumb.Item></Breadcrumb.Item>
                <Breadcrumb.Item>Home</Breadcrumb.Item>
                <Breadcrumb.Item active>Director</Breadcrumb.Item>
              </Breadcrumb>
              <h6 className="breadcrumb_title">User Permission</h6>

            </div>
          </Col>

          <Col md={8} className="text-center">
            <h4 className="section_title_1">User Permission</h4>
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
      </div>

      <Container>
        <Row className='d-flex align-items-center justify-content-center'>
          <Col md={6}>
            <Table responsive="sm">
              <thead>
                <tr>
                  <th>S.No</th>

                  <th>User Email</th>
                  <th>Choose User Type</th>
                </tr>
              </thead>
              <tbody>
                {filteredRescueDetails.length > 0 ? (
                  filteredRescueDetails.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td>{item.email}</td>
                      <td>
                        <Form.Select
                          value={selectedItems[item.id] || item.user_type || ""}
                          onChange={(e) => handleUserTypeChange(item.id, e.target.value)}
                        >
                          <option value="">Select</option>
                          <option value="Nurse">Nurse</option>
                          <option value="Social Worker">Social Worker</option>
                        </Form.Select>
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
    </>
  )
}

export default User_permission

