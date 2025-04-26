
import { Route, BrowserRouter, Routes } from 'react-router-dom'
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
import Rescue_articles_form from './Components/pages/Admission/Rescue_articles_form';
import Rescue_details_1 from './Components/pages/Admission/Rescue_details_1';

function App() {

  return (
    <>
      <BrowserRouter>
      <Routes>
        {/* Routes without sidebar */}
        <Route path='/' element={<Login />} />
        <Route path='/register' element={<Register />} />

        
        <Route path='/dashboard' element={<MainLayout><Dashboard /></MainLayout>} />

        <Route
          path='/first_info_form'
          element={<MainLayout><First_info_form /></MainLayout>}
        />

        <Route
          path='/rescue_details'
          element={<MainLayout><Rescue_details /></MainLayout>}
        />

        <Route
          path='/rescue_articles'
          element={<MainLayout><Rescue_articles_form /></MainLayout>}
        />

        <Route
          path='/rescue_articles_1'
          element={<MainLayout><Rescue_details_1 /></MainLayout>}
        />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
