import React, { useState } from "react";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import '@fortawesome/fontawesome-free/css/all.min.css';
import Cookies from 'js-cookie';
import m_logo from "../img/logo/manasu_logo.png";
import {
  faBook,
  faUsers,
  faChartPie,
  faFileAlt,
  faCalendarAlt,
  faMapPin,
  faClipboard,
  faClipboardCheck,
  faInbox,
  faRocket,
  faSignOutAlt,
  faBrain,
  faStethoscope,
  faHome,
  faHandshake,
  faUserMd,
  faUserNurse,
  faPenSquare,
  faVideo,
  faClipboardList,
  faChartLine,
  faUserGraduate,
  faNotesMedical
} from "@fortawesome/free-solid-svg-icons";

import { Nav, Badge, Button, Accordion } from "react-bootstrap";
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
          onClick={() => {
            to && navigate(to);
            setShow(false); // auto-close sidebar on mobile
          }}
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

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      localStorage.removeItem('jwt'); 
      navigate('/'); // Redirect to login page
    }
  };


  return (
    <>

      {/* Toggle Button for Mobile - Now on LEFT */}
      <Button
        variant="link"
        className="d-md-none text-primary position-fixed top-0 end-0 my-3 z-3"
        onClick={onCollapse}
        style={{ zIndex: 2000 }}
      >
        <i className="fas fa-bars fa-lg"></i>
      </Button>

      <SimpleBar className={`sidebar d-md-block text-white ${show ? "show" : ""}`}>
        <div className="sidebar-inner px-2 pt-3">


          {/* Close button (mobile) - Now on LEFT */}
          {/* Top Bar with Logo and Close Button (Mobile) */}
          <div className="d-flex justify-content-between align-items-center">
            <img src={m_logo} alt="Logo" className="img-fluid sidebar_logo" style={{ maxWidth: "150px" }} />
            <div className="media-body sidebar_mediaBody ms-2">
              <span className="mb-0 font-small fw-bold">
                {userType === "1" ? "Office Admin" : userType === "2" ? "Director" : userType === "3" ? "Nurse" : userType === "4" ? "Social Worker" : "User"}
              </span>
            </div>
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
            {/* Common menu for all users */}
            <NavItem title="Dashboard" to="/dashboard" icon={faChartPie} />

            {/* Admin-only menus */}
            {userType === '1' && (
              <>
                {/* Admission Form Menu */}
                <CollapsableNavItem title="Admission" icon={faBook}>
                  <NavItem title="1. Resident Intake Form" to="/first_info_form" icon={faFileAlt} />
                  <NavItem title="2. Resident Report" to="/rescue_details" icon={faUsers} />
                </CollapsableNavItem>

                {/* Essential Records Menu */}
                <NavItem title="Resident Document" to="/essential_record" icon={faClipboardList} />

                {/* SCRB Form Menu */}
                <NavItem title="SCRB Form" to="/scrb_form" icon={faClipboard} />
                {/* <CollapsableNavItem title="SCRB Form" icon={faBook}>
                  <NavItem title="Form 2" to="/scrb_form" icon={faFileAlt} />
                    <NavItem title="Form 2A" to="/scrb_form2A" icon={faFileAlt} />
                    <NavItem title="Form 2B" to="/scrb_form2B" icon={faFileAlt} />
                    <NavItem title="Form 2C" to="/scrb_form2C" icon={faFileAlt} />
                </CollapsableNavItem> */}

                {/* Residency Time menu */}
                {/* <CollapsableNavItem title="Residency Time" icon={faCalendarAlt}>
                  <NavItem title="Doctor Consultant Form" to="/Dr_consultant" icon={faUserMd} />
                  <NavItem title="Nurse Record Sheet" to="/nurse_sheet" icon={faUserNurse} />
                  <NavItem title="First Consultation Report" to="/rescue_record_sheet" icon={faStethoscope} />
                </CollapsableNavItem> */}

                {/* Recovery menus */}
                <CollapsableNavItem title="Recovery" icon={faHome}>
                  {/* <NavItem title="Family Identification Form" to="/family_request_letter" icon={faFileAlt} />
                  <NavItem title="Articles carried Form" to="/articles_form" icon={faSuitcase} /> */}
                  <CollapsableNavItem title="1. Nurse User" icon={faMapPin}>
                    <NavItem title="1. Consultation Report" to="/rescue_record_sheet" icon={faUserMd} />
                    <NavItem title="2. Doctor Visit" to="/dr_visitView" icon={faStethoscope} />
                    <NavItem title="3. Nurse Record Sheet" to="/nurse_sheet" icon={faUserNurse} />
                    <NavItem title="4. Prescription Form" to="/prescription_form" icon={faNotesMedical} />
                    <NavItem title="5. Medical Camp" to="/medical_camp" icon={faNotesMedical} />
                  </CollapsableNavItem>

                  <CollapsableNavItem title="2. Social Worker User" icon={faMapPin}>
                    <NavItem title="1. Observation Report" to="/observation_report" icon={faUserNurse} />
                    <NavItem title="2. Psychatrics Case History" to="/psychatrics_form" icon={faBrain} />
                    <NavItem title="3. MSE Form" to="/mseform" icon={faNotesMedical} />
                    <NavItem title="4. Reunion Summary" to="/reunion_summary" icon={faNotesMedical} />
                  </CollapsableNavItem>

                </CollapsableNavItem>

                {/* Reunion Menus */}
                <CollapsableNavItem title="Reunion/Discharge" icon={faMapPin}>
                  <NavItem title="1.Family Request Letter" to="/family_request_letter" icon={faFileAlt} />
                  <NavItem title="2.Self Declaration Form" to="/self_declaration" icon={faPenSquare} />
                  <NavItem title="3.Media Consent" to="/media_consent" icon={faVideo} />
                  <NavItem title="4.Essential Documents" to="/essential_record" icon={faClipboardList} />
                  <NavItem title="5.Handover Form" to="/formality_declaration" icon={faPenSquare} />
                  <NavItem title="Discharge Checklist" to="/reunion_checklist" icon={faClipboardCheck} />
                </CollapsableNavItem>

                {/* Fomality Menus */}
                <NavItem title="Activites & Annual Report" to="/annual_report" icon={faChartLine} />
                <NavItem title="Discharge Details" to="/admin_rescueDetails" icon={faUsers} />

                {/* Residency Details */}


                {/* Internship Form */}
                <NavItem title="Intern Information" to="/internship_form" icon={faUserGraduate} />

                {/* Reunion Member Details */}
                <NavItem title="Discharge People" to="/reunited_people" icon={faHandshake} />

                {/* Logout */}
                {/* <NavItem title="Logout" className="logout_class" onClick={handleLogout} icon={faSignOutAlt} /> */}
                <div className="nav-item logout_class" onClick={handleLogout}>
                  <a role="button" className="d-flex justify-content-between align-items-center nav-link" href="#">
                    <span className="d-flex align-items-center">
                      <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                      Logout
                    </span>
                  </a>
                </div>


              </>
            )}

            {/* Directors menus */}
            {userType === '2' && (
              <>

                {/* Admission Form Menu */}
                <CollapsableNavItem title="Admission" icon={faBook}>
                  {/* <NavItem title="1. Resident Intake Form" to="/first_info_form" icon={faFileAlt} /> */}
                  <NavItem title="Resident Report" to="/rescue_details" icon={faUsers} />
                </CollapsableNavItem>

                {/* SCRB Form Menu */}
                <NavItem title="Document Information" to="/director_Document" icon={faClipboardList} />
                <NavItem title="SCRB Form" to="/scrb_form" icon={faClipboard} />
                {/* <CollapsableNavItem title="SCRB Form" icon={faBook}>
                  <NavItem title="Form 2" to="/scrb_form" icon={faFileAlt} />
                    <NavItem title="Form 2A" to="/scrb_form2A" icon={faFileAlt} />
                    <NavItem title="Form 2B" to="/scrb_form2B" icon={faFileAlt} />
                    <NavItem title="Form 2C" to="/scrb_form2C" icon={faFileAlt} />
                </CollapsableNavItem> */}

                {/* Recovery menus */}
                <CollapsableNavItem title="Recovery" icon={faHome}>
                  {/* <NavItem title="Family Identification Form" to="/family_request_letter" icon={faFileAlt} />
                  <NavItem title="Articles carried Form" to="/articles_form" icon={faSuitcase} /> */}
                  <CollapsableNavItem title="1. Nurse User" icon={faMapPin}>
                    <NavItem title="1. Consultation Report" to="/rescue_record_sheet" icon={faUserMd} />
                    <NavItem title="2. Doctor Visit" to="/dr_visitView" icon={faStethoscope} />
                    <NavItem title="3. Nurse Record Sheet" to="/nurse_sheet" icon={faUserNurse} />
                    <NavItem title="4. Prescription Form" to="/prescription_form" icon={faNotesMedical} />
                    <NavItem title="5. Medical Camp" to="/medical_camp" icon={faNotesMedical} />
                  </CollapsableNavItem>

                  <CollapsableNavItem title="2. Social Worker User" icon={faMapPin}>
                    <NavItem title="1. Observation Report" to="/observation_report" icon={faUserNurse} />
                    <NavItem title="2. Psychiatric Case History" to="" icon={faBrain} />
                    <NavItem title="3. MSE Form" to="/mseform" icon={faNotesMedical} />
                    <NavItem title="4. Reunion Summary" to="/reunion_summary" icon={faNotesMedical} />
                  </CollapsableNavItem>

                </CollapsableNavItem>


                {/* Reunion Menus */}
                <CollapsableNavItem title="Reunion/Discharge" icon={faMapPin}>
                  <NavItem title="1.Family Request Letter" to="/family_request_letter" icon={faFileAlt} />
                  <NavItem title="2.Self Declaration Form" to="/self_declaration" icon={faPenSquare} />
                  <NavItem title="3.Media Consent" to="/media_consent" icon={faVideo} />
                  <NavItem title="4.Essential Records" to="/essential_record" icon={faClipboardList} />
                  <NavItem title="5.Handover Form" to="/formality_declaration" icon={faPenSquare} />
                  <NavItem title="Discharge Checklist" to="/reunion_checklist" icon={faClipboardCheck} />
                </CollapsableNavItem>

                {/* Fomality Menus */}
                <NavItem title="Activites & Annual Report" to="/annual_report" icon={faChartLine} />
                <NavItem title="Discharge Details" to="/admin_rescueDetails" icon={faUsers} />

                {/* Internship Form */}
                <NavItem title="Intern Information" to="/allStudentDetails" icon={faUserGraduate} />

                {/* Reunion Member Details */}
                <NavItem title="Reunited Member Details" to="/reunited_people" icon={faHandshake} />
              </>
            )}

            {/* Nurse-only menus */}
            {userType === '3' && (
              <>
                {/* <NavItem title="Doctor Consultants Form" to="/Dr_consultant" icon={faStethoscope} /> */}
                <NavItem title="First Consultation Report" to="/rescue_record_sheet" icon={faUserMd} />
                <NavItem title="Nurse Record Sheet" to="/nurse_sheet" icon={faUserNurse} />
                <NavItem title="Prescription Form" to="/prescription_form" icon={faNotesMedical} />
                <NavItem title="Doctor Visit" to="/dr_visit" icon={faStethoscope} />
                <NavItem title="Medical Camp" to="/medical_camp" icon={faNotesMedical} />
              </>
            )}

            {userType === '4' && (
              <>
                <NavItem title="Observation Report" to="/observation_report" icon={faUserNurse} />
                <NavItem title="Psychatrics Case History" to="" icon={faBrain} />
                <NavItem title="MSE Form" to="/mseform" icon={faNotesMedical} />
                <NavItem title="Reunion Summary" to="/reunion_summary" icon={faNotesMedical} />
              </>
            )}

            {/* Menus common to admin and nurse */}
            {/* {(userType === '6' || userType === '3') && (
              <NavItem title="Rescue Details" to="/rescue_details" icon={faUsers} />
            )} */}
          </Nav>
        </div>
      </SimpleBar>

      {/* Sidebar CSS */}
      <style>{`
 
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