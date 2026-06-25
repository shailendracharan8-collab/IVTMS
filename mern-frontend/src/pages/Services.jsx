import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Services = () => {
  useEffect(() => {
    AOS.init({ once: true, offset: 100 });
  }, []);

  return (
    <>
      <Navbar />

      <div className="page-hero" style={{ background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)', padding: '80px 0 60px', color: '#fff', textAlign: 'center' }}>
        <div className="container" data-aos="zoom-in">
          <h1 className="display-5 fw-bold mb-3 text-white">Our Services</h1>
          <p className="lead text-white-50">Everything you need to manage your vehicle compliance in one place.</p>
        </div>
      </div>

      <section className="py-5">
        <div className="container">
          <div className="row g-4 mt-3">
            <div className="col-md-4" data-aos="fade-up" data-aos-delay="100">
              <div className="card h-100 feature-card text-center p-5">
                <div className="card-body">
                  <i className="bi bi-card-heading text-primary-custom mb-3" style={{ fontSize: '3rem' }}></i>
                  <h4 className="card-title fw-bold">Vehicle Registration</h4>
                  <p className="card-text text-muted-custom mt-3">Apply for new registration, transfer ownership, and track RC status effortlessly with integrated RTO data streams.</p>
                  <Link to="/login" className="btn btn-outline-primary mt-3 rounded-pill px-4">Access Service</Link>
                </div>
              </div>
            </div>
            
            <div className="col-md-4" data-aos="fade-up" data-aos-delay="200">
              <div className="card h-100 feature-card text-center p-5">
                <div className="card-body">
                  <i className="bi bi-shield-shaded text-primary-custom mb-3" style={{ fontSize: '3rem' }}></i>
                  <h4 className="card-title fw-bold">Insurance Tracking</h4>
                  <p className="card-text text-muted-custom mt-3">Link your vehicle insurance, track expiry, and get automated renewal alerts directly to your registered mobile.</p>
                  <Link to="/login" className="btn btn-outline-primary mt-3 rounded-pill px-4">Access Service</Link>
                </div>
              </div>
            </div>

            <div className="col-md-4" data-aos="fade-up" data-aos-delay="300">
              <div className="card h-100 feature-card text-center p-5">
                <div className="card-body">
                  <i className="bi bi-wind text-primary-custom mb-3" style={{ fontSize: '3rem' }}></i>
                  <h4 className="card-title fw-bold">PUC & Eco Status</h4>
                  <p className="card-text text-muted-custom mt-3">Monitor Pollution Under Control validity and check real-time AQI impact with verified inspector testing centers.</p>
                  <Link to="/login" className="btn btn-outline-primary mt-3 rounded-pill px-4">Access Service</Link>
                </div>
              </div>
            </div>

            <div className="col-md-4" data-aos="fade-up" data-aos-delay="100">
              <div className="card h-100 feature-card text-center p-5">
                <div className="card-body">
                  <i className="bi bi-cash-coin text-primary-custom mb-3" style={{ fontSize: '3rem' }}></i>
                  <h4 className="card-title fw-bold">Road Tax Payment</h4>
                  <p className="card-text text-muted-custom mt-3">Transparent and quick online payment portal for state and central road taxes with instant receipt generation.</p>
                  <Link to="/login" className="btn btn-outline-primary mt-3 rounded-pill px-4">Access Service</Link>
                </div>
              </div>
            </div>

            <div className="col-md-4" data-aos="fade-up" data-aos-delay="200">
              <div className="card h-100 feature-card text-center p-5">
                <div className="card-body">
                  <i className="bi bi-file-earmark-text text-primary-custom mb-3" style={{ fontSize: '3rem' }}></i>
                  <h4 className="card-title fw-bold">Transport Permits</h4>
                  <p className="card-text text-muted-custom mt-3">Apply for commercial permits and track application processing status securely via the citizen dashboard.</p>
                  <Link to="/login" className="btn btn-outline-primary mt-3 rounded-pill px-4">Access Service</Link>
                </div>
              </div>
            </div>

            <div className="col-md-4" data-aos="fade-up" data-aos-delay="300">
              <div className="card h-100 feature-card text-center p-5">
                <div className="card-body">
                  <i className="bi bi-bell text-primary-custom mb-3" style={{ fontSize: '3rem' }}></i>
                  <h4 className="card-title fw-bold">Smart Alerts</h4>
                  <p className="card-text text-muted-custom mt-3">Receive proactive SMS and email reminders before any of your vehicular documents expire to stay compliant.</p>
                  <Link to="/login" className="btn btn-outline-primary mt-3 rounded-pill px-4">Access Service</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Services;
