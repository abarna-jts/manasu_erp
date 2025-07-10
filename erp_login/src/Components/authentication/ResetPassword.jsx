// ResetPassword.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Col, Row, Form, Card, Button, FormCheck, Container, InputGroup } from '@themesberg/react-bootstrap';

function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');

    const apiRoute = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
    });

    const handleReset = async (e) => {
        e.preventDefault();
        try {
            const response = await apiRoute.post(`/api/reset-password`, {
                token,
                newPassword,
            });

            console.log("Response from backend:", response.data.message);

            setMessage(response.data.message);
            alert('Password changed successfully');
            setTimeout(() => navigate('/'), 1000);

        } catch (err) {
            console.error("Reset Password Error:", err);
            console.log("Full Error Response:", err.response);
            setMessage(err.response?.data?.message || "Failed to reset password.");
        }
    };


    return (
        // <form onSubmit={handleReset}>
        //     <input
        //         type="password"
        //         placeholder="Enter new password"
        //         value={newPassword}
        //         onChange={(e) => setNewPassword(e.target.value)}
        //         required
        //     />
        //     <button type="submit">Reset Password</button>
        //     {message && <p>{message}</p>}
        // </form>
        <section className="d-flex align-items-center my-5 mt-lg-6 mb-lg-5">
            <Container>
                <Row className="justify-content-center">
                    <Col xs={12} className="d-flex align-items-center justify-content-center flex-column">
                        <Col md={8} className="text-start mb-4">
                            <h3 className="section_title text-center">Reset Password</h3>
                        </Col>
                        <Form onSubmit={handleReset}>
                            <Form.Group>
                                <Form.Label>
                                    Enter New Password
                                </Form.Label>
                                <Form.Control
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required />
                            </Form.Group>
                            <Button variant="primary" type="submit" className="w-50 mt-2">
                                Submit
                            </Button>
                            {message && <p>{message}</p>}
                        </Form>
                    </Col>

                </Row>
            </Container>
        </section>

    );
}

export default ResetPassword;
