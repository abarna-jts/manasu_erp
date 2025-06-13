import React from "react";
import { Button } from '@themesberg/react-bootstrap';
import { useNavigate } from "react-router-dom";
import circle from "../img/icons/circle.png";
import Sidebar from "./Sidebar";
import { Container, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faUsers, faSitemap, faClipboardList } from "@fortawesome/free-solid-svg-icons";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart,
    Pie, Cell
} from "recharts";
import { useState, useEffect } from "react";
import axios from "axios";


function Dashboard() {
    const handleLogout = () => {
        localStorage.removeItem('jwt'); // Clear JWT token
        alert('You have been logged out');
        navigate('/'); // Redirect to login page
    };

    const data = [
        { month: 'Jan', rescues: 10 },
        { month: 'Feb', rescues: 15 },
        { month: 'Mar', rescues: 8 },
        { month: 'Apr', rescues: 20 },
        { month: 'May', rescues: 12 },
        { month: 'Jun', rescues: 18 },
        { month: 'Jul', rescues: 25 },
        { month: 'Aug', rescues: 17 },
        { month: 'Sep', rescues: 9 },
        { month: 'Oct', rescues: 14 },
        { month: 'Nov', rescues: 22 },
        { month: 'Dec', rescues: 19 },
    ];

    const COLORS = ["#fe7096", "#90caf9", "#84d9d2", "#92a6f8", "#ffc7ad", "#ffbccc"];

    const admissionData = [
        { month: "Jan", value: 30 },
        { month: "Feb", value: 40 },
        { month: "Mar", value: 25 },
        { month: "Apr", value: 35 },
        { month: "May", value: 20 },
        { month: "Jun", value: 50 },
        { month: "Jul", value: 30 },
        { month: "Aug", value: 40 },
        { month: "Sep", value: 20 },
        { month: "Oct", value: 20 },
        { month: "Nov", value: 30 },
        { month: "Dec", value: 20 },
    ];

    const [rescues, setRescues] = useState([]);

    const navigate = useNavigate();

    const handleChange = () =>{
        navigate('/rescue_details');
    }

      const apiRoute = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
            const response = await apiRoute.get("/dashboard/get_recent_rescue");
            setRescues(response.data);
            } catch (error) {
            console.error("Failed to fetch rescue data:", error);
            }
        };

        fetchData(); // Call the async function
        }, []);

    return (
        <>
            <Sidebar />
            <Container fluid>
                <Row>
                    <Col md={12}>
                        <div className="text-start col-md-3 d-flex align-items-center mb-3">
                            <div className="dashboard_icon">
                                <FontAwesomeIcon icon={faHome} className="me-2 homeIcon" />
                            </div>
                            <h3 className="section_title" style={{ fontSize: "1.6rem", marginBottom: "0px" }}>Dashboard</h3>
                        </div>
                    </Col>
                </Row>
                <div className="row dashboard_body">
                    <div className="col-md-4 stretch-card grid-margin">
                        <div className="card bg-gradient-danger card-img-holder text-white">
                            <div className="card-body">
                                <img src={circle} className="card-img-absolute" alt="circle" />
                                <h4 className="font-weight-normal mb-2">
                                    No. of Rescue <FontAwesomeIcon icon={faUsers} className="float-end" size="lg" style={{ fontSize: "2rem" }} />
                                </h4>
                                <h2 className="mb-3">30</h2>
                                <h6 className="card-text">Increased by 60%</h6>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4 stretch-card grid-margin">
                        <div className="card bg-gradient-info card-img-holder text-white">
                            <div className="card-body">
                                <img src={circle} className="card-img-absolute" alt="circle" />
                                <h4 className="font-weight-normal mb-2">
                                    No. of Organisation <FontAwesomeIcon icon={faSitemap} className="float-end" size="lg" style={{ fontSize: "2rem" }} />
                                </h4>
                                <h2 className="mb-3">4</h2>
                                <h6 className="card-text">Increased by 80%</h6>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4 stretch-card grid-margin">
                        <div className="card bg-gradient-success card-img-holder text-white">
                            <div className="card-body">
                                <img src={circle} className="card-img-absolute" alt="circle" />
                                <h4 className="font-weight-normal mb-2">
                                    No. of Admission <FontAwesomeIcon icon={faClipboardList} className="float-end" size="lg" style={{ fontSize: "2rem" }} />
                                </h4>
                                <h2 className="mb-3">20</h2>
                                <h6 className="card-text">Increased by 10%</h6>
                            </div>
                        </div>
                    </div>
                </div>
                <Row className="d-flex align-items-center justify-content-center mb-3">
                    <Col md={5} className="rescue_report">
                        <h5>Monthly Rescue Report</h5>
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis label={{ value: 'Rescues', angle: -90, position: 'insideLeft' }} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="rescues" fill="#92a6f8" name="Monthly Rescues" barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Col>
                    <Col md={5} className="admission_report">
                        <h5>Monthly Admission Report</h5>
                        <div style={{ display: "flex", alignItems: "center", justifyContent:"center", gap: "2rem" }}>
                            {/* Pie Chart */}
                            <div style={{ width: 350, height: 350 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={admissionData}
                                            dataKey="value"
                                            nameKey="month"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={40} // Makes it a donut
                                            outerRadius={100}
                                            fill="#8884d8"
                                            label
                                        >
                                            {admissionData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Custom Legend with 2 columns of 6 months */}
                            <div style={{ display: "flex", flexWrap: "wrap", width: 200 }}>
                                {admissionData.map((entry, index) => (
                                    <div
                                        key={`legend-${index}`}
                                        style={{
                                            width: "50%", // 2 columns
                                            display: "flex",
                                            alignItems: "center",
                                            marginBottom: 8,
                                        }}
                                    >
                                        <div
                                            style={{
                                                width: 16,
                                                height: 16,
                                                backgroundColor: COLORS[index % COLORS.length],
                                                marginRight: 8,
                                                borderRadius: 4,
                                            }}
                                        />
                                        <span style={{ fontSize: "0.875rem" }}>
                                            {entry.month} ({entry.value})
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Col>
                </Row>
                <Row className="d-flex align-items-center justify-content-center mb-3">
                    <Col md={7}className="rescue_detailsClass">
                    <h5 className="text-start">Recent Rescue Details</h5>
                    <div className="table-responsive">
                        <table className="table table-bordered">
                            <thead>
                            <tr>
                                <th>S.no</th>
                                <th>Admission No</th>
                                <th>Rescue Name</th>
                                <th>Referred By</th>
                                <th>Admission Date</th>
                                <th>Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {rescues.map((rescue, index) => (
                                <tr key={rescue.id || index}>
                                <th scope="row">{index + 1}</th>
                                <td>{rescue.admission_no}</td>
                                <td>{rescue.rescue_name}</td>
                                <td>{rescue.referred_by}</td>
                                <td>
                                    {new Date(rescue.admission_date).toLocaleDateString("en-GB", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric"
                                    })}
                                    </td>
                                <td><button className="btn btn-primary" onClick={handleChange}>View All</button></td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        </div>
                    </Col>
                    <Col md={4}>
                    </Col>
                </Row>

            </Container>
        </>
    )
}

export default Dashboard