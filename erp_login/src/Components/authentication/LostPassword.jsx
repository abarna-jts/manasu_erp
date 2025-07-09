//created by sivakumar
import React, { useState } from "react";
import { Col, Row, Form, Card, Button, Container, InputGroup, Alert } from '@themesberg/react-bootstrap';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const apiRoute = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

function LostPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate('/');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setMessage('');

        try {
            const response = await apiRoute.post('/api/forgot-password', { email });
            setMessage(response.data.message);
            alert('Reset password link sent. Please check your email.');
        } catch (err) {
            setError(err.response?.data?.message || 'Error sending reset link');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main>
            <section className="d-flex align-items-center my-5 mt-lg-6 mb-lg-5">
                <Container>
                    <Row className="justify-content-center">
                        <Col xs={12} className="d-flex align-items-center justify-content-center">
                            <div className="bg-white shadow-soft border rounded border-light p-4 p-lg-5 w-100 fmxw-500">
                                <div className="text-center text-md-center mb-4 mt-md-0">
                                    <h3 className="mb-0">Forgot Password</h3>
                                </div>

                                {message && <Alert variant="success">{message}</Alert>}
                                {error && <Alert variant="danger">{error}</Alert>}

                                <Form onSubmit={handleSubmit}>
                                    <Form.Group id="email" className="mb-4">
                                        <Form.Label>Your Email</Form.Label>
                                        <InputGroup>
                                            <Form.Control 
                                                type="email" 
                                                placeholder="Enter your email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required 
                                            />
                                        </InputGroup>
                                    </Form.Group>

                                    <Button 
                                        variant="primary" 
                                        type="submit" 
                                        className="w-100" 
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Sending...' : 'Send Reset Link'}
                                    </Button>
                                </Form>

                                <div className="d-flex justify-content-center align-items-center mt-4">
                                    <span className="fw-normal">
                                        Remember your password?{" "}
                                        <Card.Link onClick={() => navigate('/')} className="fw-bold">
                                            Login here
                                        </Card.Link>
                                    </span>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        </main>
    );
}

export default LostPassword;