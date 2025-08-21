import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate(); // Hook for redirection.

  // `useEffect` runs code after the component renders. It's perfect for checking
  // for a token and handling the redirection logic.
  useEffect(() => {
    // Get the token from local storage.
    const token = localStorage.getItem('token');

    // If the token doesn't exist, redirect the user to the login page.
    if (!token) {
      navigate('/login');
    }
  }, [navigate]); // The dependency array ensures this effect runs only when the component mounts.

  // This function handles logging the user out.
  const onLogout = () => {
    // Remove the token from local storage. This is how we "log out" the user.
    localStorage.removeItem('token');
    
    // Redirect the user back to the login page.
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