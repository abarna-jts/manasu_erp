
import { Route, BrowserRouter, Routes } from 'react-router-dom';
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

function App() {

  const userType = Cookies.get('usertype');

  return (

    <>
      <BrowserRouter>
        <Routes>
          {/* Routes without sidebar */}
          <Route path='/' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/forgot_password' element={<LostPassword />} />

          <Route path='/dashboard' element={<MainLayout><Dashboard /></MainLayout>} />

          {userType === '1' && (
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
      </BrowserRouter>
    </>
  )
}

export default App
