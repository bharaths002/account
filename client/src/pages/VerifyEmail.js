
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
        
        const res = await axios.get(`http://localhost:8000/api/auth/verify/${token}`);
        
        
        setMessage(res.data);
        setIsSuccess(true);
      } catch (err) {
        
        setMessage(err.response?.data || 'Verification failed. The link might be invalid or expired.');
        setIsSuccess(false);
      }
    };

    
    if (token) {
      verifyUserEmail();
    }
  }, [token]); 

  return (
    <div>
      <h2>Email Verification</h2>
    
      <p style={{ color: isSuccess ? 'green' : 'red', fontWeight: 'bold' }}>{message}</p>
    </div>
  );
};

export default VerifyEmail;
