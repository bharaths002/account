// client/src/pages/VerifyEmail.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const VerifyEmail = () => {
  const { token } = useParams();
  
  const [message, setMessage] = useState('Verifying your email...');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const verifyUserEmail = async () => {
      try {
        // We make a GET request to our backend's verification endpoint.
        const res = await axios.get(`http://localhost:8000/api/auth/verify/${token}`);
        
        // If the request is successful, update the message and set success to true.
        setMessage(res.data);
        setIsSuccess(true);
      } catch (err) {
        // If there's an error, update the message and set success to false.
        setMessage(err.response?.data || 'Verification failed. The link might be invalid or expired.');
        setIsSuccess(false);
      }
    };

    // Only run the verification function if a token exists.
    if (token) {
      verifyUserEmail();
    }
  }, [token]); // The `[token]` dependency array makes sure this effect re-runs if the token changes.

  return (
    <div>
      <h2>Email Verification</h2>
      {/* Conditionally style the message based on success or failure */}
      <p style={{ color: isSuccess ? 'green' : 'red', fontWeight: 'bold' }}>{message}</p>
    </div>
  );
};

export default VerifyEmail;