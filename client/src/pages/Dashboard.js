import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate(); 

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      navigate('/login');
    }
  }, [navigate]); 
  

  const onLogout = () => {
    localStorage.removeItem('token');
    
    navigate('/login');
  };

  return (
    <div>
      <h2>Welcome to your Dashboard!</h2>
      <p>You have successfully logged in.</p>
      <button onClick={onLogout}>Logout</button>
    </div>
  );
};

export default Dashboard;
