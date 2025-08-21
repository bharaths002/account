import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      setMessage(res.data.msg); // Show the success message from the backend.
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to send reset link.');
    }
  };

  return (
    <div className='form-container'>
      <h2 className='form-title'>Forgot Password</h2>
      <p>Enter your email address to receive a password reset link.</p>
      <form onSubmit={onSubmit}>
        <div>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit">Send Reset Link</button>
      </form>
      {message && <p style={{ color: 'green', fontWeight: 'bold' }}>{message}</p>}
      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
      <p>
        Remember your password? <Link to="/login">Sign In</Link>
      </p>
    </div>
  );
};

export default ForgotPassword;