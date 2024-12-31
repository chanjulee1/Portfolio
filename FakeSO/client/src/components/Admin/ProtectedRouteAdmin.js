import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRouteAdmin = () => {
  const userType = localStorage.getItem("Usertype");

  if (userType === 'admin') {
    return <Outlet />;
  }

  return (
    <Navigate to="/" />
  );
};
export default ProtectedRouteAdmin;