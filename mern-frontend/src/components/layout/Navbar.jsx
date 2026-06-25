import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  useEffect(() => {
    // Theme toggle logic (similar to theme.js)
    const toggleBtn = document.getElementById('theme-toggle');
    const root = document.documentElement;
    const isDark = localStorage.getItem('theme') === 'dark';
    
    if (isDark) {
      root.setAttribute('data-theme', 'dark');
      if (toggleBtn) toggleBtn.innerHTML = '<i class="bi bi-sun-fill"></i>';
    }

    const handleThemeToggle = () => {
      if (root.getAttribute('data-theme') === 'dark') {
        root.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        if (toggleBtn) toggleBtn.innerHTML = '<i class="bi bi-moon-stars-fill"></i>';
      } else {
        root.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        if (toggleBtn) toggleBtn.innerHTML = '<i class="bi bi-sun-fill"></i>';
      }
    };

    if (toggleBtn) {
      toggleBtn.addEventListener('click', handleThemeToggle);
    }

    return () => {
      if (toggleBtn) toggleBtn.removeEventListener('click', handleThemeToggle);
    };
  }, []);

  return (
    <nav className="navbar navbar-expand-lg sticky-top">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <i className="bi bi-shield-check text-primary-custom" style={{ fontSize: '1.8rem' }}></i>
          IVTMS
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === '/services' ? 'active' : ''}`} to="/services">Services</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`} to="/about">About</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`} to="/contact">Contact</Link>
            </li>
          </ul>
          <div className="d-flex gap-2 align-items-center">
            <button id="theme-toggle" className="me-2" title="Toggle Light/Dark Mode" style={{ border: 'none', background: 'transparent' }}>
              <i className="bi bi-moon-stars-fill"></i>
            </button>
            <Link to="/login" className="btn btn-outline-primary rounded-pill px-4 shadow-sm">Login</Link>
            <Link to="/register" className="btn btn-primary rounded-pill px-4 shadow-sm">Register</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
