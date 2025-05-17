import React, { useState } from "react";;
import { Navbar, Container, Nav, Dropdown, ListGroup, Image, Row } from 'react-bootstrap';
import m_logo from "../img/logo/manasu_logo.png";
import 'bootstrap/dist/js/bootstrap.bundle.min';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';


export default function TopNavbar() {
  const [notifications, setNotifications] = useState([]);
  const areNotificationsRead = notifications.reduce((acc, notif) => acc && notif.read, true);

  const userType = Cookies.get('usertype');

  const markNotificationsAsRead = () => {
    setTimeout(() => {
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    }, 300);
  };

  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('jwt'); // Clear JWT token
    alert('You have been logged out');
    navigate('/'); // Redirect to login page
  };

  const handleProfile = () => {
    navigate('/profile');
  }

  const Notification = ({ link, sender, image, time, message, read = false }) => {
    const readClassName = read ? "" : "text-danger";

    return (
      <ListGroup.Item action href={link} className="border-bottom border-light p-0">
        <Row className="align-items-center p-0">
          <Col className="col-auto">
            <Image src={image} className="user-avatar lg-avatar rounded-circle" />
          </Col>
          <Col className="p-0">
            <div className="d-flex justify-content-between align-items-center">
              <h4 className="h6 mb-0 text-small">{sender}</h4>
              <small className={readClassName}>{time}</small>
            </div>
            <p className="font-small mt-1 mb-0">{message}</p>
          </Col>
        </Row>
      </ListGroup.Item>
    );
  };

  return (
    <Navbar variant="dark p-2 mb-1" expanded >
      <Container fluid className="px-0">
        <div className="d-flex justify-content-between w-100">
          <div className="d-flex align-items-center px-3">
            <img src={m_logo} alt="" />
            <div className="logo_text">
              <h4><span>MANASU</span> <br />Mental Health Charity Home</h4>
            </div>
          </div>
          <Nav className="align-items-center px-3 d-flex flex-row">
            <Nav.Item as="li" className="me-lg-3">
              <Nav.Link href="#" className="text-dark icon-notifications" onClick={markNotificationsAsRead}>
                <span className="icon icon-sm position-relative">
                  <i className="bi bi-bell-fill fs-5"></i>
                  {!areNotificationsRead && (
                    <span className="icon-badge rounded-circle unread-notifications position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle"></span>
                  )}
                </span>
              </Nav.Link>
            </Nav.Item>


            <Dropdown >
              <Dropdown.Toggle variant="link" className="pt-1 px-0 text-dark d-flex align-items-center">
                <div className="media d-flex align-items-center">
                  <Image src={m_logo} className="user-avatar md-avatar rounded-circle" />
                  <div className="media-body ms-2 d-none d-lg-block">
                    <span className="mb-0 font-small fw-bold">
                      {userType === "1" ? "Admin" : userType === "2" ? "Director" : userType === "3" ? "Nurse": userType === "4" ? "Social Worker" : "User"}
                    </span>
                  </div>
                </div>
              </Dropdown.Toggle>

              <Dropdown.Menu className="user-dropdown mt-2">
                <Dropdown.Item className="fw-bold" onClick={handleProfile}>My Profile</Dropdown.Item>
                <Dropdown.Item className="fw-bold">Settings</Dropdown.Item>
                <Dropdown.Item className="fw-bold">Messages</Dropdown.Item>
                <Dropdown.Item className="fw-bold">Support</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item className="fw-bold" onClick={handleLogout}>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </div>
      </Container>
    </Navbar>
  );
}
