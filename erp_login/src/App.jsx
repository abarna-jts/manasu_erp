
import { Route, HashRouter, Routes } from 'react-router-dom';
import Cookies from 'js-cookie';
import './App.css'
import Login from './Components/authentication/login';
import Register from './Components/authentication/Register';
import Dashboard from './Components/pages/Dashboard';
import First_info_form from './Components/pages/Admission/First_info_form';
// core styles
import "./scss/volt.scss";
import "./css/main.css";
import MainLayout from './Components/layouts/MainLayout';
import Rescue_details from './Components/pages/Admission/Rescue_details';
import SCRB_form from './Components/pages/Admission/SCRB_form';
import SCRB_Form2A from './Components/pages/Admission/SCRB_Form2A';
import SCRB_Form2B from './Components/pages/Admission/SCRB_Form2B';
import SCRB_Form2C from './Components/pages/Admission/SCRB_Form2C';
import ImagePDF from './Components/pages/Admission/ImagePDF';
import Edit_Rescue_details from './Components/pages/Admission/Edit_Rescue_details';
import LostPassword from './Components/authentication/LostPassword';
import Dr_consultants from './Components/pages/Residency_time/Dr_consultants';
import Rescue_Record_Sheet from './Components/pages/Residency_time/Rescue_Record_Sheet';
import Nurse_Record_sheet from './Components/pages/Residency_time/Nurse_Record_sheet';
import Observation_report from './Components/pages/Residency_time/Observation_report';
import Family_Request_form from './Components/pages/Reunion/Family_Request_form';
import Self_Declaration_form from './Components/pages/Reunion/Self_Declaration_form';
import Media_consent_form from './Components/pages/Reunion/Media_consent_form';
import Formality_declaration from './Components/pages/Admin_Formality/Formality_declaration';
import Essential_record from './Components/pages/Admin_Formality/Essential_record';
import Annual_Report from './Components/pages/Admin_Formality/Annual_Report';
import View_annualReport from './Components/pages/Admin_Formality/View_annualReport';
import Edit_Annual_Report from './Components/pages/Admin_Formality/Edit_Annual_Report';
import Admin_RescueDetails from './Components/pages/Admin_Formality/Admin_RescueDetails';
import Profile from './Components/pages/Profile';
import InternshipForm from './Components/pages/Admin_Formality/InternshipForm';
import AllStudentDetails from './Components/pages/Admin_Formality/AllStudentDetails';
import Prescription_form from './Components/pages/Residency_time/prescription_form';
import MSE_form from './Components/pages/Recovery/MSE_form';

function App() {

  const userType = Cookies.get('usertype');

  return (

    <>
      <HashRouter>
        <Routes>
          {/* Routes without sidebar */}
          <Route path='/' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/forgot_password' element={<LostPassword />} />

          <Route path='/dashboard' element={<MainLayout><Dashboard /></MainLayout>} />
          <Route path='/profile' element={<MainLayout><Profile /></MainLayout>} />

          {(userType === '1' || userType === '2') && (
            <>
              <Route
                path='/first_info_form'
                element={<MainLayout><First_info_form /></MainLayout>}
              />

              <Route
                path='/rescue_details'
                element={<MainLayout><Rescue_details /></MainLayout>}
              />

              <Route
                path='/edit_rescue_details/:id'
                element={<MainLayout><Edit_Rescue_details /></MainLayout>}
              />

              <Route
                path='/scrb_form'
                element={<MainLayout><SCRB_form /></MainLayout>}
              />

              <Route
                path='/scrb_form2A'
                element={<MainLayout><SCRB_Form2A /></MainLayout>}
              />

              <Route
                path='/scrb_form2B'
                element={<MainLayout><SCRB_Form2B /></MainLayout>}
              />

              <Route
                path='/scrb_form2C'
                element={<MainLayout><SCRB_Form2C /></MainLayout>}
              />

              <Route
                path='/family_request_letter'
                element={<MainLayout><Family_Request_form /></MainLayout>}
              />

              <Route
                path='/self_declaration'
                element={<MainLayout><Self_Declaration_form /></MainLayout>}
              />

              <Route
                path='/media_consent'
                element={<MainLayout><Media_consent_form /></MainLayout>}
              />

              <Route
                path='/formality_declaration'
                element={<MainLayout><Formality_declaration /></MainLayout>}
              />

              <Route
                path='/essential_record'
                element={<MainLayout><Essential_record /></MainLayout>}
              />

              <Route
                path='/mseform'
                element={<MainLayout><MSE_form /></MainLayout>}
              />

               <Route
                path='/annual_report'
                element={<MainLayout><Annual_Report /></MainLayout>}
              />
              <Route
                path='/internship_form'
                element={<MainLayout><InternshipForm /></MainLayout>}
              />
              <Route
                path='/allStudentDetails'
                element={<MainLayout><AllStudentDetails /></MainLayout>}
              />
               <Route
                path='/view_annualReport'
                element={<MainLayout><View_annualReport /></MainLayout>}
              />

              <Route
                path='/edit_annual_report/:id'
                element={<MainLayout><Edit_Annual_Report /></MainLayout>}
              />

              <Route
                path='/admin_rescueDetails'
                element={<MainLayout><Admin_RescueDetails /></MainLayout>}
              />

              <Route
                path='/imagepdf'
                element={<MainLayout><ImagePDF /></MainLayout>}
              />

            </>

          )}


          {userType === '3' && (
            <>
              <Route
                path='/Dr_consultant'
                element={<MainLayout><Dr_consultants /></MainLayout>}
              />
              <Route
                path='/prescription_form'
                element={<MainLayout><Prescription_form /></MainLayout>}
              />
              <Route
                path='/rescue_record_sheet'
                element={<MainLayout><Rescue_Record_Sheet /></MainLayout>}
              />
              <Route
                path='/nurse_sheet'
                element={<MainLayout><Nurse_Record_sheet /></MainLayout>}
              />
            </>

          )}

          {userType === '4' && (
            <>
              <Route
                path='/rescue_details'
                element={<MainLayout><Rescue_details /></MainLayout>}
              />
              
              <Route
                path='/observation_report'
                element={<MainLayout><Observation_report /></MainLayout>}
              />
            </>
          )}

        </Routes>
      </HashRouter>
    </>
  )
}

export default App
