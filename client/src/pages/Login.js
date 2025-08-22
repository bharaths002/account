import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  // `useState` hook for managing the form data.
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState(''); // State to hold any error messages.
  const navigate = useNavigate(); // `useNavigate` is a hook to programmatically redirect the user.

  // Destructure `email` and `password` from the form data state.
  const { email, password } = formData;

  // Handles input changes and updates the state.
  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Handles form submission.
  const onSubmit = async e => {
    e.preventDefault(); // Prevents the default form submission (page reload).
    setError('');       // Clear any previous errors.

    try {
      // Prepare the request body.
      const body = { email, password };
      
      // Make the POST request to the login API endpoint.
      const res = await axios.post('http://localhost:8000/api/auth/login', body);
      
      // --- Success Handling ---
      // On success, the backend returns a JWT token.
      // We store this token in the browser's local storage. This is a simple
      // way to save a user's session.
      localStorage.setItem('token', res.data.token);
      
      // Redirect the user to the dashboard page.
      navigate('/dashboard');

    } catch (err) {
      // --- Error Handling ---
      // If the login fails (e.g., incorrect credentials), set the error message.
      setError(err.response?.data?.msg || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className='form-container'>
      <h2 className='form-title'>User Login</h2>
      <form onSubmit={onSubmit}>
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
          />
        </div>
        <button type="submit">Login</button>
      </form>

      {/* Conditionally display the error message. */}
      {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
      
      <p>
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
      <p>
        <Link to="/forgot-password">Forgot Password?</Link>
      </p>
    </div>
  );
};

export default Login;