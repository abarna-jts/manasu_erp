import React from 'react';
import { Card, Row, Col, Button, Container, Image, ListGroup } from 'react-bootstrap';
import profileImg from '../img/logo/avatar.jpg'; 
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";

function Profile() {
    const userType = Cookies.get('usertype');

    const navigate = useNavigate();
       const handleLogout = () => {
        const confirmLogout = window.confirm("Are you sure you want to log out?");
        if (confirmLogout) {
          localStorage.removeItem('jwt'); 
          navigate('/'); // Redirect to login page
        }
      };

  return (
    <>
    <Container className="mt-5">
        <Row className='d-flex align-items-center justify-content-center'>
            <Col md={6}>
                <Card className="shadow-sm">
                    <Card.Body>
                    <Row className='d-flex'>
                        
                        <Col md={4} className="text-center">
                        <Image src={profileImg} roundedCircle width="150" height="150" />
                        <h4 className="mt-3">
                            {userType === "1" ? "Admin" : userType === "2" ? "Director" : userType === "3" ? "Nurse" : userType === "4" ? "Social Worker" : "User"}
                        </h4>
                        {/* <Button variant="primary" className="mt-2">Edit Profile</Button> */}
                        </Col>
                        <Col md={8}>
                        <h3 className="section_title">User Information</h3>
                        <ListGroup variant="flush">
                            <ListGroup.Item className='text-start'><strong>Email:</strong> {userType === "1" ? "admin@gmail.com" : userType === "2" ? "director@gmail.com" : userType === "3" ? "nurse@gmail.com" : userType === "4" ? "socialworker@gmail.com" : "user@gmail.com"}</ListGroup.Item>
                            <ListGroup.Item className='text-start'><strong>Name:</strong> {userType === "1" ? "Admin" : userType === "2" ? "Director" : userType === "3" ? "Nurse" : userType === "4" ? "Social Worker" : "User"}</ListGroup.Item>
                        </ListGroup>
                        </Col>
                    </Row>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
      
    </Container>

    {/* <Button className="btn btn-danger" onClick={handleLogout}>
                LogOut
            </Button> */}
    </>
    

    
  );
}

export default Profile;

