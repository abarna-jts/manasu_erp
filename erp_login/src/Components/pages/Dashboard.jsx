import React from "react";
import { Button, Form } from '@themesberg/react-bootstrap';
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
import Cookies from 'js-cookie';

function Dashboard() {
    const [totalRescue, setTotalRescue] = useState(0);
    const [totalResident, setTotalResident] = useState(0);
    const [totalReunion, setTotalReunion] = useState(0);
    const [nurseRecordData, setNurseRecordData] = useState([]);
    const [admissionData, setAdmissionData] = useState([]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

    const userType = Cookies.get('usertype');

    useEffect(() => {
        const fetchTotalRescue = async () => {
            try {
                const response = await apiRoute.get("/dashboard/totalRescue",{
                     headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setTotalRescue(response.data.totalRescue);
            } catch (error) {
                console.error("Failed to fetch rescue data:", error);
            }
        };

        fetchTotalRescue(); // Call the async function
    }, []);

    useEffect(() => {
        const fetchTotalResident = async () => {
            try {
                const response = await apiRoute.get("/dashboard/totalResident",{
                     headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setTotalResident(response.data.totalResident);
            } catch (error) {
                console.error("Failed to fetch Resident data:", error);
            }
        };

        fetchTotalResident(); // Call the async function
    }, []);

    useEffect(() => {
        const fetchTotalReunion = async () => {
            try {
                const response = await apiRoute.get("/dashboard/totalReunion",{
                     headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setTotalReunion(response.data.totalReunion);
            } catch (error) {
                console.error("Failed to fetch Resident data:", error);
            }
        };

        fetchTotalReunion(); // Call the async function
    }, []);

    useEffect(() => {
        const fetchNurseRecord = async () => {
            try {
                const res = await apiRoute.get("/dashboard/getMonthlyResidentConditions",{
                     headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                // console.log("API response for nurse record:", res.data);

                // Normalize and align the data
                const fullData = MONTHS.map(monthShort => {
                    const found = res.data.find(item =>
                        item.month.toLowerCase().startsWith(monthShort.toLowerCase())
                    );
                    return {
                        month: monthShort,
                        value: found ? found.value : 0
                    };
                });

                setNurseRecordData(fullData);
            } catch (error) {
                console.error("Error fetching nurse record data:", error);
            }
        };

        fetchNurseRecord();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await apiRoute.get(`/dashboard/getMonthlyAdmissionsByYear/${selectedYear}`,{
                     headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setAdmissionData(res.data.data);
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        };

        fetchData();
    }, [selectedYear]);

    const COLORS = ["#fe7096", "#90caf9", "#84d9d2", "#92a6f8", "#ffc7ad", "#ffbccc"];

    // const admissionData = [
    //     { month: 'Jan', value: 4 },
    //     { month: 'Feb', value: 3 },
    //     { month: 'Mar', value: 0 },
    //     { month: 'Apr', value: 0 },
    //     { month: 'May', value: 4 },
    //     { month: 'Jun', value: 0 },
    //     { month: 'Jul', value: 5 },
    //     { month: 'Aug', value: 4 },
    //     { month: 'Sep', value: 0 },
    //     { month: 'Oct', value: 3 },
    //     { month: 'Nov', value: 4 },
    //     { month: 'Dec', value: 1 },
    // ];

    const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const [rescues, setRescues] = useState([]);

    const navigate = useNavigate();

    const handleChange = () => {
        navigate('/rescue_details');
    }

    const apiRoute = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL,
    });

    const token = localStorage.getItem('jwt');


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiRoute.get("/dashboard/get_recent_rescue", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
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
                                <h2 className="mb-3">{totalRescue}</h2>
                                <h6 className="card-text">Increased by 60%</h6>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4 stretch-card grid-margin">
                        <div className="card bg-gradient-info card-img-holder text-white">
                            <div className="card-body">
                                <img src={circle} className="card-img-absolute" alt="circle" />
                                <h4 className="font-weight-normal mb-2">
                                    No. of Resident <FontAwesomeIcon icon={faSitemap} className="float-end" size="lg" style={{ fontSize: "2rem" }} />
                                </h4>
                                <h2 className="mb-3">{totalResident}</h2>
                                <h6 className="card-text">Increased by 80%</h6>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-4 stretch-card grid-margin">
                        <div className="card bg-gradient-success card-img-holder text-white">
                            <div className="card-body">
                                <img src={circle} className="card-img-absolute" alt="circle" />
                                <h4 className="font-weight-normal mb-2">
                                    No. of Reunion <FontAwesomeIcon icon={faClipboardList} className="float-end" size="lg" style={{ fontSize: "2rem" }} />
                                </h4>
                                <h2 className="mb-3">{totalReunion}</h2>
                                <h6 className="card-text">Increased by 10%</h6>
                            </div>
                        </div>
                    </div>
                </div>
                <Row className="d-flex align-items-center justify-content-center mb-3">
                    <Col md={5} className="rescue_report">
                        <h5>Monthly Health Report by Nurse</h5>
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={nurseRecordData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis
                                    ticks={[0, 2, 4, 6, 8, 10]}
                                    domain={[0, 'dataMax + 2']}
                                />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="value" fill="#92a6f8" name="Monthly Entries" />
                            </BarChart>
                        </ResponsiveContainer>

                    </Col>
                    <Col md={5} className="admission_report">
                        <h5>Year-wise Admission Report</h5>
                        <Row className="d-flex align-items-center justify-content-center mt-3">
                            <Col md={3}>
                                <Form.Select onChange={(e) => setSelectedYear(e.target.value)} value={selectedYear}>
                                    {Array.from({ length: new Date().getFullYear() - 2009 }, (_, i) => {
                                        const year = new Date().getFullYear() - i;
                                        return (
                                            <option key={year} value={year}>
                                                {year}
                                            </option>
                                        );
                                    })}
                                </Form.Select>

                            </Col>
                        </Row>


                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "2rem" }} className="piechart_class">
                            <div style={{ width: 350, height: 350 }} className="piechart_diagram">

                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={admissionData}
                                            dataKey="value"
                                            nameKey="month"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={40}
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

                            <div style={{ display: "flex", flexWrap: "wrap", width: 200 }}>
                                {admissionData.length > 0 ? (
                                    admissionData.map((entry, index) => (
                                        <div
                                            key={`legend-${index}`}
                                            style={{ width: "50%", display: "flex", alignItems: "center", marginBottom: 8 }}
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
                                                {entry.month}
                                            </span>
                                        </div>
                                    ))
                                ) : (
                                    <span style={{ fontSize: "0.875rem", color: "#888" }}>No Data Available</span>
                                )}

                            </div>
                        </div>
                    </Col>
                </Row>
                {(userType === "1" || userType === "2") && (
                <Row className="d-flex align-items-center justify-content-center mb-3">
                    <Col md={7} className="rescue_detailsClass">
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
                )}

            </Container>
        </>
    )
}

export default Dashboard