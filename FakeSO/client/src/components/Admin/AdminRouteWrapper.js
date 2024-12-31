import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

const AdminRouteWrapper = ({ children }) => {
  const userType = localStorage.getItem('Usertype');
  const isAdmin = userType === 'admin';
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      navigate('/', { replace: true });
    }
  }, [isAdmin, navigate]);

  return isAdmin ? children : <Navigate to="/" />;
};

export default AdminRouteWrapper;
