// src/Components/layouts/MainLayout.jsx
import React from 'react';
import Sidebar from '../pages/Sidebar';
import Navbar from '../pages/Navbar';


const MainLayout = ({ children }) => {
  return (
    <>
      <div className="d-flex">
      <div className="sidebar-wrapper" style={{ width: "260px", minHeight: "100vh" }}>
          <Sidebar />
        </div>
        <div className="flex-grow-1">
          <Navbar />
          {children}
        </div>
      </div>
    </>
    
  );
};

export default MainLayout;
