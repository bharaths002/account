// client/src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail'; // <-- Don't forget to import this!
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        {/* We've removed the navigation links as requested */}
        <Routes>
          {/* This is the new line. It redirects the root path to /register */}
          <Route path="/" element={<Navigate to="/register" />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset/:token" element={<ResetPassword />} />
          <Route path="/verify/:token" element={<VerifyEmail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;