import React from "react";
import { Button} from '@themesberg/react-bootstrap';
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

function Dashboard(){
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('jwt'); // Clear JWT token
        alert('You have been logged out');
        navigate('/'); // Redirect to login page
      };

    return(
        <>
        <Sidebar />
            <p>This is dashboard</p>

            <Button className="btn btn-danger" onClick={handleLogout}>
                LogOut
            </Button>
        </>
    )
}

export default Dashboard