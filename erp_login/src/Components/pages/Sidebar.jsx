import React, { useState } from "react";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import '@fortawesome/fontawesome-free/css/all.min.css';
import {
  faBook,
  faUsers,
  faChartPie,
  faFileAlt,
  faCalendarAlt,
  faMapPin,
  faInbox,
  faRocket
} from "@fortawesome/free-solid-svg-icons";

import { Nav, Badge, Image, Button, Accordion, Navbar} from "react-bootstrap";
import { useNavigate } from "react-router-dom";


const Sidebar = () => {
  const [show, setShow] = useState(false);
  const onCollapse = () => setShow(!show);

  const navigate = useNavigate();

  const CollapsableNavItem = ({ title, icon, children }) => (
    <Accordion as={Nav.Item}>
      <Accordion.Item eventKey={title}>
        <Accordion.Button as={Nav.Link} className="d-flex justify-content-between align-items-center">
          <span className="d-flex align-items-center">
            {icon && <FontAwesomeIcon icon={icon} className="me-2" />} {/* <- Add icon */}
            <span className="sidebar-text">{title}</span>
          </span>
        </Accordion.Button>
        <Accordion.Body className="multi-level">
          <Nav className="flex-column">
            {children}
          </Nav>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );

  const NavItem = ({ title, icon, badgeText, badgeBg = "secondary", badgeColor = "primary", to }) => {
    return (
      <Nav.Item>
        <Nav.Link
          className="d-flex justify-content-between align-items-center"
          onClick={() => to && navigate(to)}
          style={{ cursor: 'pointer' }}
        >
          <span className="d-flex align-items-center">
            {icon && <FontAwesomeIcon icon={icon} className="me-2" />} {/* <- Add icon */}
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
  };
  

  return (
    <>
      

      <SimpleBar className={`sidebar d-md-block bg-primary text-white ${show ? "show" : ""}`}>
        <div className="sidebar-inner px-4 pt-3">
          <div className="user-card d-flex d-md-none align-items-center justify-content-between pb-4">
            <div className="d-flex align-items-center">
              <div className="user-avatar lg-avatar me-4">
                {/* <Image src={ProfilePicture} className="rounded-circle border-white" /> */}
              </div>
              <div>
                <h6>Hi, User</h6>
                
              </div>
            </div>
            <Nav.Link className="collapse-close d-md-none" onClick={onCollapse}>
              
            </Nav.Link>
          </div>

          <Nav className="flex-column pt-3">
            <NavItem title="Dashboard" to="/dashboard" icon={faChartPie} />

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
    </>
  );
};

export default Sidebar;