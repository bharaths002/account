// client/src/pages/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';


const Register = () => {
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [message, setMessage] = useState(''); 
  const [error, setError] = useState('');     

  
  const { name, email, password, confirmPassword } = formData;

  const onChange = e => setFormData({ 
    ...formData,
    [e.target.name]: e.target.value
  });

  const onSubmit = async e => {
    e.preventDefault(); 
    setMessage('');
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.'); 
      return; 
    }

    try {
      
      const body = { name, email, password };

      const res = await axios.post('http://localhost:8000/api/auth/register', body);
      
      
      setMessage(res.data.msg); 
      
      setFormData({ name: '', email: '', password: '', confirmPassword: '' });

    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed. Please try again.');
    }
  };

  // The JSX that defines the form and other elements.
  return (
    <div className='form-container'>
      <h2 className='form-title'>User Registration</h2>
      <form onSubmit={onSubmit}>
        <div>
          <input
            type="text"
            placeholder="Name"
            name="name" 
            value={name}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Password"
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
            placeholder="Confirm Password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={onChange}
            required
            minLength="6"
          />
        </div>
        <button type="submit">Register</button>
      </form>

      
      {message && <p style={{ color: 'green', fontWeight: 'bold' }}>{message}</p>}
      
      
      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
      
      <p>
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </div>
  );
};

export default Register;
