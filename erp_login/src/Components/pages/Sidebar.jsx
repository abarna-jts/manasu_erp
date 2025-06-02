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
  faClipboard,
  faClipboardCheck,
  faInbox,
  faRocket,
  faBrain,
  faHome,
  faSuitcase,
  faStethoscope,
  faUserMd ,
  faUserNurse ,
  faPenSquare,
  faVideo,
  faClipboardList,
  faChartLine,
  faUserGraduate,
  faNotesMedical 
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
                  <NavItem title="Reunion Checklist" to="/reunion_checklist" icon={faClipboardCheck} />
                  <NavItem title="Psychatrics Care History" to="" icon={faBrain } />
                  <NavItem title="MSE Form" to="/mseform" icon={faNotesMedical  } />
                  <NavItem title="Activity Details" to="/annual_report" icon={faCalendarAlt } />
                </CollapsableNavItem>

                {/* Reunion Menus */}
                <CollapsableNavItem title="Reunion/Discharge" icon={faMapPin}>
                  <NavItem title="1.Family Request Letter" to="/family_request_letter" icon={faFileAlt} />
                  <NavItem title="2.Self Declaration Form" to="/self_declaration" icon={faPenSquare} />
                  <NavItem title="3.Media Consent" to="/media_consent" icon={faVideo } />
                  <NavItem title="4.Essential Records" to="/essential_record" icon={faClipboardList} />
                  <NavItem title="5.Handover Form" to="/formality_declaration" icon={faPenSquare} />
                </CollapsableNavItem>

                {/* Fomality Menus */}
                <CollapsableNavItem title="Admin Formality" icon={faMapPin}>
                  <NavItem title="Annual Report" to="/annual_report" icon={faChartLine } />
                  <NavItem title="Discharge Details" to="/admin_rescueDetails" icon={faUsers } />
                </CollapsableNavItem>

                {/* Residency Details */}
                <NavItem title="Rescue Details" to="/rescue_details" icon={faUsers} />

                {/* Internship Form */}
                <NavItem title="Intern Information" to="/internship_form" icon={faUserGraduate } />

                 
                
              </>
            )}

            {/* Directors menus */}
            {userType === '2' && (
              <>

                {/* Admission Form Menu */}
                <CollapsableNavItem title="Admission" icon={faBook}>
                  <NavItem title="First Information Form" to="/first_info_form" icon={faFileAlt} />
                </CollapsableNavItem>

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

                {/* Reunion Menus */}
                <CollapsableNavItem title="Reunion" icon={faMapPin}>
                  <NavItem title="Family Request Letter" to="/family_request_letter" icon={faFileAlt} />
                  <NavItem title="Self Declaration Form" to="/self_declaration" icon={faPenSquare} />
                  <NavItem title="Media Consent" to="/media_consent" icon={faVideo } />
                </CollapsableNavItem>

                {/* Fomality Menus */}
                <CollapsableNavItem title="Admin Formality" icon={faMapPin}>
                  <NavItem title="Formality Self Declaration" to="/formality_declaration" icon={faPenSquare} />
                  <NavItem title="Essential Records" to="/essential_record" icon={faClipboardList} />
                  <NavItem title="Annual Report" to="/annual_report" icon={faChartLine } />
                  <NavItem title="Discharge Details" to="/admin_rescueDetails" icon={faUsers } />
                </CollapsableNavItem>

                {/* Residency Details */}
                <NavItem title="Rescue Details" to="/rescue_details" icon={faUsers} />
              </>
            )}

            {/* Nurse-only menus */}
            {userType === '3' && (
              <>
                {/* <NavItem title="Doctor Consultants Form" to="/Dr_consultant" icon={faStethoscope} /> */}
                <NavItem title="First Consultation Report" to="/rescue_record_sheet" icon={faUserMd} />
                <NavItem title="Nurse Record Sheet" to="/nurse_sheet" icon={faUserNurse} />
                <NavItem title="Prescription Form" to="/prescription_form" icon={faNotesMedical} />
                
              </>
            )}

            {userType === '4' &&(
              <>
                <NavItem title="Observation Report" to="/observation_report" icon={faUserNurse} />
                <NavItem title="Psychatrics Care History" to="" icon={faBrain } />
                <NavItem title="MSE Form" to="mse_form" icon={faNotesMedical  } />
                {/* <NavItem title="Rescue Details" to="/rescue_details" icon={faUsers} /> */}
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