import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  // `useParams` is used to access the URL parameters, specifically the reset token.
  const { token } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const { password, confirmPassword } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      // The API call uses the `token` from the URL to identify the user.
      const res = await axios.post(`http://localhost:8000/api/auth/reset-password/${token}`, { password });
      setMessage(res.data.msg);
      
      // Redirect to the login page after a short delay so the user can see the success message.
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.msg || 'Password reset failed. The link might be invalid or expired.');
    }
  };

  return (
    <div className='form-container'>
      <h2>Reset Password</h2>
      <form onSubmit={onSubmit}>
        <div>
          <input
            type="password"
            placeholder="New Password"
            name="password"
            value={password}
            onChange={onChange}
            required
            minLength="6"
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Confirm New Password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={onChange}
            required
            minLength="6"
          />
        </div>
        <button type="submit">Reset Password</button>
      </form>
      {message && <p style={{ color: 'green', fontWeight: 'bold' }}>{message}</p>}
      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
    </div>
  );
};

export default ResetPassword;