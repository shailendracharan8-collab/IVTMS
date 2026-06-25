import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import '../pages/Auth.css';

const Login = () => {
  const [loginType, setLoginType] = useState('email');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('CITIZEN');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050/api';
      const response = await axios.post(`${API_URL}/auth/login`, {
        identifier: username, 
        password,
        role
      });
      localStorage.setItem('userInfo', JSON.stringify(response.data));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <div className="auth-page">
      <Navbar />
      <div className="auth-container">
        <div className="auth-card text-center">
          <div className="auth-logo">
            <i className="bi bi-shield-lock-fill"></i>
          </div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Login to access your personalized vehicle dashboard</p>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleLogin} className="text-start">
            <div className="mb-3">
              <label className="form-label">Login As</label>
              <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)} required>
                <option value="CITIZEN">Citizen User</option>
                <option value="RTO">RTO Officer</option>
                <option value="INSPECTOR">Inspector</option>
                <option value="ADMIN">System Administrator</option>
              </select>
            </div>

            <div className="toggle-container">
              <button type="button" className={`toggle-btn ${loginType === 'aadhaar' ? 'active' : ''}`} onClick={() => setLoginType('aadhaar')}>Aadhaar</button>
              <button type="button" className={`toggle-btn ${loginType === 'email' ? 'active' : ''}`} onClick={() => setLoginType('email')}>Email</button>
            </div>

            <div className="mb-3">
              <div className="input-group">
                <span className="input-group-text"><i className={loginType === 'aadhaar' ? 'bi bi-card-text' : 'bi bi-envelope'}></i></span>
                <input 
                  type="text" 
                  className="form-control with-icon" 
                  placeholder={loginType === 'aadhaar' ? '12-digit Aadhaar Number' : 'Email Address'} 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required 
                />
              </div>
            </div>

            <div className="mb-3">
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-lock"></i></span>
                <input 
                  type={showPassword ? "text" : "password"} 
                  className="form-control with-icon" 
                  placeholder="Password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
                <span className="input-group-text bg-white" style={{ borderLeft: 'none', borderRadius: '0 0.75rem 0.75rem 0', cursor: 'pointer' }} onClick={() => setShowPassword(!showPassword)}>
                  <i className={showPassword ? "bi bi-eye-slash password-toggle" : "bi bi-eye password-toggle"}></i>
                </span>
              </div>
            </div>

            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="rememberMe" />
                <label className="form-check-label" htmlFor="rememberMe" style={{fontSize: '0.85rem', color: '#6c757d'}}>Remember me</label>
              </div>
              <Link to="#" className="forgot-link">Forgot Password?</Link>
            </div>

            <button type="submit" className="btn btn-primary w-100 btn-signin">Sign In Securely</button>
          </form>

          <div className="footer-text">
            Don't have an account yet?<br/>
            <Link to="/register" className="create-link">Create an Account</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
