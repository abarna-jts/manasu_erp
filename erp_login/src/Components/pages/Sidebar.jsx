import React, { useState } from "react";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import '@fortawesome/fontawesome-free/css/all.min.css';
import Cookies from 'js-cookie';
import {
  faBook,
  faUsers,
  faChartPie,
  faFileAlt,
  faCalendarAlt,
  faMapPin,
  faInbox,
  faRocket,
  faStethoscope,
  faUserMd ,
  faUserNurse ,
  faPenSquare,
  faVideo 
} from "@fortawesome/free-solid-svg-icons";

import { Nav, Badge, Accordion} from "react-bootstrap";
import { useNavigate } from "react-router-dom";


const Sidebar = () => {
  const [show, setShow] = useState(false);
  const onCollapse = () => setShow(!show);

  const navigate = useNavigate();

  const userType = Cookies.get('usertype'); 

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
      

      <SimpleBar className={`sidebar d-md-block text-white ${show ? "show" : ""}`}>
        <div className="sidebar-inner px-4 pt-3">
          <Nav className="flex-column pt-3">
            {/* Common menu for all users */}
            <NavItem title="Dashboard" to="/dashboard" icon={faChartPie} />

            {/* Admin-only menus */}
            {userType === '1' && (
              <>

                {/* Admission Form Menu */}
                <CollapsableNavItem title="Admission" icon={faBook}>
                  <NavItem title="First Information Form" to="/first_info_form" icon={faFileAlt} />
                </CollapsableNavItem>

                {/* SCRB Form Menu */}
                <CollapsableNavItem title="SCRB Form" icon={faBook}>
                  <NavItem title="Form 2" to="/scrb_form" icon={faFileAlt} />
                    <NavItem title="Form 2A" to="/scrb_form2A" icon={faFileAlt} />
                    <NavItem title="Form 2B" to="/scrb_form2B" icon={faFileAlt} />
                    <NavItem title="Form 2C" to="/scrb_form2C" icon={faFileAlt} />
                </CollapsableNavItem>

                 {/* Residency Time menu */}
                <CollapsableNavItem title="Residency Time" icon={faCalendarAlt}>
                  <NavItem title="Track Time" icon={faRocket} />
                  <NavItem title="View History" icon={faInbox} />
                </CollapsableNavItem>

                {/* Reunion Menus */}
                <CollapsableNavItem title="Reunion" icon={faMapPin}>
                  <NavItem title="Family Request Letter" to="/family_request_letter" icon={faFileAlt} />
                  <NavItem title="Self Declaration Form" icon={faPenSquare} />
                  <NavItem title="Media Consent" icon={faVideo } />
                </CollapsableNavItem>

                {/* Residency Details */}
                <NavItem title="Rescue Details" to="/rescue_details" icon={faUsers} />
              </>
            )}

            {/* Nurse-only menus */}
            {userType === '3' && (
              <>
                <NavItem title="Doctor Consultants Form" to="/Dr_consultant" icon={faStethoscope} />
                <NavItem title="Nurse Record Sheet" to="/nurse_sheet" icon={faUserNurse} />
                <NavItem title="First Consultation Report" to="/rescue_record_sheet" icon={faUserMd} />
                

              </>
            )}

            {userType === '4' &&(
              <>
                <NavItem title="Observation Report" to="/observation_report" icon={faUserNurse} />
                <NavItem title="Rescue Details" to="/rescue_details" icon={faUsers} />
              </>
            )}

            {/* Menus common to admin and nurse */}
            {/* {(userType === '6' || userType === '3') && (
              <NavItem title="Rescue Details" to="/rescue_details" icon={faUsers} />
            )} */}
          </Nav>
        </div>
      </SimpleBar>
    </>
  );
};

export default Sidebar;