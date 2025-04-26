import React, { useState } from "react";;
import { Row, Col, Nav, Form, Image, Dropdown, Container, Navbar, ListGroup, InputGroup } from '@themesberg/react-bootstrap';
import m_logo from "../img/logo/manasu_logo.png";


export default function TopNavbar() {
  const [notifications, setNotifications] = useState([]);
  const areNotificationsRead = notifications.reduce((acc, notif) => acc && notif.read, true);

  const markNotificationsAsRead = () => {
    setTimeout(() => {
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    }, 300);
  };

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
    <Navbar variant="dark p-2 mb-4" expanded >
      <Container fluid className="px-0">
        <div className="d-flex justify-content-between w-100">
          <div className="d-flex align-items-center px-3">
            <img src={m_logo} alt="" />
          </div>
          <Nav className="align-items-center px-3 d-flex flex-row">
            <Dropdown as={Nav.Item} onToggle={markNotificationsAsRead}>
              <Dropdown.Toggle as={Nav.Link} className="text-dark icon-notifications me-lg-3">
                <span className="icon icon-sm">
                  
                  {!areNotificationsRead && <span className="icon-badge rounded-circle unread-notifications" />}
                </span>
              </Dropdown.Toggle>
              <Dropdown.Menu className="dashboard-dropdown notifications-dropdown dropdown-menu-lg dropdown-menu-center mt-2 py-0">
                <ListGroup className="list-group-flush">
                  <Nav.Link href="#" className="text-center text-primary fw-bold border-bottom border-light py-3">
                    Notifications
                  </Nav.Link>
                  {notifications.map(n => <Notification key={`notification-${n.id}`} {...n} />)}
                  <Dropdown.Item className="text-center text-primary fw-bold py-3">
                    View all
                  </Dropdown.Item>
                </ListGroup>
              </Dropdown.Menu>
            </Dropdown>

            <Dropdown as={Nav.Item}>
              <Dropdown.Toggle as={Nav.Link} className="pt-1 px-0">
                <div className="media d-flex align-items-center">
                  <Image src={m_logo} className="user-avatar md-avatar rounded-circle" />
                  <div className="media-body ms-2 text-dark align-items-center d-none d-lg-block">
                    <span className="mb-0 font-small fw-bold">Admin</span>
                  </div>
                </div>
              </Dropdown.Toggle>
              <Dropdown.Menu className="user-dropdown dropdown-menu-right mt-2">
                <Dropdown.Item className="fw-bold">
                   My Profile
                </Dropdown.Item>
                <Dropdown.Item className="fw-bold">
                   Settings
                </Dropdown.Item>
                <Dropdown.Item className="fw-bold">
                   Messages
                </Dropdown.Item>
                <Dropdown.Item className="fw-bold">
                  Support
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item className="fw-bold">
                  Logout
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </div>
      </Container>
    </Navbar>
  );
}
