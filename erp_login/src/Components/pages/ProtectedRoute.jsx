import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const isTokenValid = () => {
  const token = localStorage.getItem('jwt');
  if (!token) return false;

  try {
    const { exp } = jwtDecode(token);
    if (Date.now() >= exp * 1000) {
      localStorage.removeItem('jwt');
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
};

const ProtectedRoute = () => {
  return isTokenValid() ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;
