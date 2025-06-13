import React, { useState } from "react";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import m_logo from "../img/logo/manasu_logo.png";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import '@fortawesome/fontawesome-free/css/all.min.css';
import {
  faBook,
  faUsers,
  faFileAlt,
  faCalendarAlt,
  faMapPin,
  faInbox,
  faRocket
} from "@fortawesome/free-solid-svg-icons";

import { Nav, Badge, Button, Accordion } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const [show, setShow] = useState(false);
  const onCollapse = () => setShow(!show);

  const navigate = useNavigate();

  const CollapsableNavItem = ({ title, icon, children }) => (
    <Accordion as={Nav.Item} flush>
      <Accordion.Item eventKey={title}>
        <Accordion.Button as={Nav.Link} className="d-flex justify-content-between align-items-center text-white">
          <span className="d-flex align-items-center">
            {icon && <FontAwesomeIcon icon={icon} className="me-2" />}
            <span className="sidebar-text">{title}</span>
          </span>
        </Accordion.Button>
        <Accordion.Body className="multi-level">
          <Nav className="flex-column">{children}</Nav>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );

  const NavItem = ({ title, icon, badgeText, badgeBg = "secondary", badgeColor = "primary", to }) => (
    <Nav.Item>
      <Nav.Link
        className="d-flex justify-content-between align-items-center text-white"
        onClick={() => {
          to && navigate(to);
          setShow(false); // auto-close sidebar on mobile
        }}
        style={{ cursor: "pointer" }}
      >
        <span className="d-flex align-items-center">
          {icon && <FontAwesomeIcon icon={icon} className="me-2" />}
          <span className="sidebar-text">{title}</span>
        </span>
        {badgeText && (
          <Badge pill bg={badgeBg} text={badgeColor} className="badge-md notification-count ms-2">
            {badgeText}
          </Badge>
        )}
      </Nav.Link>
    </Nav.Item>
  );

  return (
    <>
      {/* Toggle Button for Mobile - Now on LEFT */}
      <Button
        variant="link"
        className="d-md-none text-primary position-fixed top-0 start-0 m-3 z-3"
        onClick={onCollapse}
        style={{ zIndex: 2000 }}
      >
        <i className="fas fa-bars fa-lg"></i>
      </Button>

      <SimpleBar className={`sidebar bg-primary text-white ${show ? "show" : ""}`}>
        <div className="sidebar-inner px-4 pt-3">


          {/* Close button (mobile) - Now on LEFT */}
          {/* Top Bar with Logo and Close Button (Mobile) */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <img src={m_logo} alt="Logo" className="img-fluid" style={{ maxWidth: "150px" }} />
            {/* Show only on mobile */}
            <Button
              variant="link"
              onClick={onCollapse}
              className="d-md-none text-white"
              style={{ fontSize: '1.5rem' }}
            >
              <i className="fas fa-times" />
            </Button>
          </div>


          <Nav className="flex-column pt-3">
            <CollapsableNavItem title="Admission" icon={faBook}>
              <NavItem title="First Information Form" to="/first_info_form" icon={faFileAlt} />
              <CollapsableNavItem title="SCRB Form" icon={faBook}>
                <NavItem title="Form 2" to="/scrb_form" icon={faFileAlt} />
                <NavItem title="Form 2A" to="/scrb_form2A" icon={faFileAlt} />
                <NavItem title="Form 2B" to="/scrb_form2B" icon={faFileAlt} />
                <NavItem title="Form 2C" to="/scrb_form2C" icon={faFileAlt} />
              </CollapsableNavItem>
            </CollapsableNavItem>

            <CollapsableNavItem title="Residency Time" icon={faCalendarAlt}>
              <NavItem title="Track Time" icon={faRocket} />
              <NavItem title="View History" icon={faInbox} />
            </CollapsableNavItem>

            <CollapsableNavItem title="Reunion" icon={faMapPin}>
              <NavItem title="Upcoming Events" icon={faCalendarAlt} />
              <NavItem title="Past Events" icon={faCalendarAlt} />
            </CollapsableNavItem>

            <NavItem title="Rescue Details" to="/rescue_details" icon={faUsers} />
          </Nav>
        </div>
      </SimpleBar>

      {/* Sidebar CSS */}
      <style>{`
        .sidebar {
          width: 250px;
          min-height: 100vh;
          transition: transform 0.3s ease;
        }
 
        @media (max-width: 768px) {
          .sidebar {
            position: fixed;
            top: 0;
            left: 0;
            z-index: 1040;
            transform: translateX(-100%);
          }
 
          .sidebar.show {
            transform: translateX(0);
          }
        }
 
        .sidebar-inner {
          padding-bottom: 2rem;
        }
      `}</style>
    </>
  );
};

export default Sidebar;