import React, { useState } from "react";
import { Col, Row, Form, Card, Button, FormCheck, Container, InputGroup } from '@themesberg/react-bootstrap';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import Cookies from 'js-cookie';

function Login() {
    const [form, setForm] = useState({ email: '', password: '' });
    const [token, setToken] = useState('');

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const apiRoute = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
    });

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const res = await apiRoute.post('/api/login', form);

            // ✅ Save token
            const token = res.data.token;
            localStorage.setItem('jwt', token);

            const userType = res.data.usertype;
            Cookies.set('usertype', userType); // you're already doing this

            navigate('/dashboard');
        } catch (err) {
            const message = err.response?.data?.message || 'Login failed';
            alert(message);
            console.error("Login error:", message);
        }
    };


    return (
        <>
            <main>
                <section className="d-flex align-items-center my-5 mt-lg-6 mb-lg-5">
                    <Container>
                        <Row className="justify-content-center form-bg-image">
                            <Col xs={12} className="d-flex align-items-center justify-content-center">
                                <div className="bg-white shadow-soft border rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                                    <div className="text-center text-md-center mb-4 mt-md-0">
                                        <h3 className="mb-0">Sign In</h3>
                                    </div>
                                    <Form className="mt-4">
                                        <Form.Group id="email" className="mb-4 text-start">
                                            <Form.Label>Your Email</Form.Label>
                                            <InputGroup>

                                                <Form.Control autoFocus required type="email" name="email" onChange={handleChange} />
                                            </InputGroup>
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Group id="password" className="mb-4 text-start">
                                                <Form.Label>Your Password</Form.Label>
                                                <InputGroup>
                                                    {/* <InputGroup.Text>
                                    <FontAwesomeIcon icon={faUnlockAlt} />
                                    </InputGroup.Text> */}
                                                    <Form.Control required type="password" name="password" onChange={handleChange} />
                                                </InputGroup>
                                            </Form.Group>
                                            <div className="d-flex justify-content-between align-items-center mb-4">
                                                <Form.Check type="checkbox">
                                                    <FormCheck.Input id="defaultCheck5" className="me-2" />
                                                    <FormCheck.Label htmlFor="defaultCheck5" className="mb-0">Remember me</FormCheck.Label>
                                                </Form.Check>
                                                <Card.Link className="small text-end" onClick={() => navigate('/forgot_password')}>Lost password?</Card.Link>
                                            </div>
                                        </Form.Group>
                                        <Button variant="primary" type="submit" className="w-100" onClick={handleLogin}>
                                            Sign in
                                        </Button>
                                    </Form>
                                    <div className="d-flex justify-content-center align-items-center mt-4">
                                        <span className="fw-normal">
                                            Not registered?
                                            <Card.Link className="fw-bold" onClick={() => { navigate('/register'); }}>
                                                Create account
                                            </Card.Link>
                                        </span>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </section>
            </main>
        </>
    )
}

export default Login