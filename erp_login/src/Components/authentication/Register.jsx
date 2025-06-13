import React, { useState } from "react";
import { Col, Row, Form, Card, Button, FormCheck, Container, InputGroup } from '@themesberg/react-bootstrap';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function Register (){
    const [formData, setForm] = useState({
        email: '',
        password: '',
        confirmPassword: ''
      });
    const navigate = useNavigate();

    const apiRoute = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
    });
    
    const handleChange = (e) => {
        setForm({ ...formData, [e.target.name]: e.target.value });
      };
      
      const handleRegister = async (e) => {
        e.preventDefault();
      
        // Optional: check password match before sending
        if (formData.password !== formData.confirmPassword) {
          alert("Passwords do not match");
          return;
        }
      
        try {
          const response = await apiRoute.post('/api/register', {
            email: formData.email,
            password: formData.password
          });
          console.log(response);
          alert('Registered successfully');
          navigate('/');
        } catch (err) {
          console.error(err);
          alert('Registration error');
        }
      };

    return(
        <>
            <main>
                <section className="d-flex align-items-center my-5 mt-lg-6 mb-lg-5">
                    <Container>
                    <Row className="justify-content-center form-bg-image">
                        <Col xs={12} className="d-flex align-items-center justify-content-center">
                        <div className="mb-4 mb-lg-0 bg-white shadow-soft border rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                            <div className="text-center text-md-center mb-4 mt-md-0">
                            <h3 className="mb-0">Create an account</h3>
                            </div>
                            <Form className="mt-4">
                            <Form.Group id="email" className="mb-4 text-start">
                                <Form.Label>Email</Form.Label>
                                <InputGroup>
                                <Form.Control
                                    autoFocus
                                    required
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group id="password" className="mb-4 text-start">
                                <Form.Label>Password</Form.Label>
                                <InputGroup>
                                <Form.Control
                                    required
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    />
                                </InputGroup>
                            </Form.Group>
                            <Form.Group id="confirmPassword" className="mb-4 text-start">
                                <Form.Label>Confirm Password</Form.Label>
                                <InputGroup>
                                <Form.Control
                                    required
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    />
                                </InputGroup>
                            </Form.Group>
                            
                            
                            <Button variant="primary" type="submit" className="w-100" onClick={handleRegister}>
                                Register
                            </Button>

                            <div className="d-flex justify-content-center align-items-center mt-4">
                                <span className="fw-normal">
                                    Already have an account?
                                    <Card.Link onClick={() =>{navigate('/')}} className="fw-bold">
                                    Login here
                                    </Card.Link>
                                </span>
                            </div>
                            </Form>

                            
                        </div>
                        </Col>
                    </Row>
                    </Container>
                </section>
                </main>
        </>
    )
}

export default Register