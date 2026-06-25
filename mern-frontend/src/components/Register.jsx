import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import '../pages/Auth.css';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('CITIZEN');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const fullName = `${firstName} ${lastName}`.trim();
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050/api';
      const response = await axios.post(`${API_URL}/auth/register`, {
        fullName,
        email,
        aadhaarNumber,
        password,
        role
      });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="auth-page">
      <Navbar />
      <div className="auth-container">
        <div className="auth-card text-center" style={{ maxWidth: '520px' }}>
          <div className="auth-logo">
            <i className="bi bi-person-plus-fill"></i>
          </div>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join the IVTMS ecosystem. Please provide your details.</p>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="role-toggle-container">
            <button type="button" className={`role-btn ${role === 'CITIZEN' ? 'active' : ''}`} onClick={() => setRole('CITIZEN')}>Citizen</button>
            <button type="button" className={`role-btn ${role === 'RTO' ? 'active' : ''}`} onClick={() => setRole('RTO')}>RTO Officer</button>
            <button type="button" className={`role-btn ${role === 'INSPECTOR' ? 'active' : ''}`} onClick={() => setRole('INSPECTOR')}>Inspector</button>
            <button type="button" className={`role-btn ${role === 'ADMIN' ? 'active' : ''}`} onClick={() => setRole('ADMIN')}>Admin</button>
          </div>

          <form onSubmit={handleRegister} className="text-start">
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label">First Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required 
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Last Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Aadhaar Number</label>
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-fingerprint"></i></span>
                <input 
                  type="text" 
                  className="form-control with-icon" 
                  placeholder="12-digit Aadhaar Number"
                  pattern="\d{12}"
                  title="Aadhaar must be exactly 12 digits"
                  value={aadhaarNumber}
                  onChange={(e) => setAadhaarNumber(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-envelope"></i></span>
                <input 
                  type="email" 
                  className="form-control with-icon" 
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Secure Password</label>
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-lock"></i></span>
                <input 
                  type="password" 
                  className="form-control with-icon" 
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-100 btn-register">Complete Registration</button>
          </form>

          <div className="footer-text">
            Already have an account?<br/>
            <Link to="/login" className="create-link" style={{ color: 'var(--primary-color, #0d47a1)', fontWeight: 700, textDecoration: 'none' }}>Sign In Here</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
