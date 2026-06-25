import React, { useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import AOS from 'aos';
import 'aos/dist/aos.css';

const About = () => {
  useEffect(() => {
    AOS.init({ once: true, offset: 100 });
  }, []);

  return (
    <>
      <Navbar />

      <div className="page-hero" style={{ background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)', padding: '80px 0 60px', color: '#fff', textAlign: 'center' }}>
        <div className="container" data-aos="zoom-in">
          <h1 className="display-5 fw-bold mb-3 text-white">About IVTMS</h1>
          <p className="lead text-white-50">Modernizing vehicle transport integration for a smarter, cleaner future.</p>
        </div>
      </div>

      <section className="py-5 my-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4" data-aos="fade-right">
              <h2 className="fw-bold text-primary-custom mb-3">Our Mission</h2>
              <p className="lead text-muted-custom">To establish a resilient, entirely digital framework for managing vehicles to guarantee uniform compliance throughout the nation.</p>
              <p className="text-muted-custom">We aim to remove the long queues at RTOs and place control directly in the hands of the citizens. With a unified datastore, law enforcement, inspectors, and citizens can operate seamlessly in the same ecosystem.</p>
            </div>
            <div className="col-lg-6" data-aos="fade-left">
              <div className="row g-3">
                <div className="col-6">
                  <div className="card stat-card p-4 text-center rounded-4 h-100" style={{ background: 'rgba(var(--surface-color), 0.5)', backdropFilter: 'blur(10px)', border: '1px solid var(--border-color)' }}>
                    <h2 className="fw-bold text-primary-custom mb-0">1.2M+</h2>
                    <p className="text-muted-custom small mb-0">Registered Vehicles</p>
                  </div>
                </div>
                <div className="col-6">
                  <div className="card stat-card p-4 text-center rounded-4 h-100" style={{ background: 'rgba(var(--surface-color), 0.5)', backdropFilter: 'blur(10px)', border: '1px solid var(--border-color)' }}>
                    <h2 className="fw-bold text-success mb-0">850K+</h2>
                    <p className="text-muted-custom small mb-0">Active Citizens</p>
                  </div>
                </div>
                <div className="col-6">
                  <div className="card stat-card p-4 text-center rounded-4 h-100" style={{ background: 'rgba(var(--surface-color), 0.5)', backdropFilter: 'blur(10px)', border: '1px solid var(--border-color)' }}>
                    <h2 className="fw-bold text-warning mb-0">99.8%</h2>
                    <p className="text-muted-custom small mb-0">System Uptime</p>
                  </div>
                </div>
                <div className="col-6">
                  <div className="card stat-card p-4 text-center rounded-4 h-100" style={{ background: 'rgba(var(--surface-color), 0.5)', backdropFilter: 'blur(10px)', border: '1px solid var(--border-color)' }}>
                    <h2 className="fw-bold text-danger mb-0">₹142Cr</h2>
                    <p className="text-muted-custom small mb-0">Tax Transacted</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5" style={{ backgroundColor: 'var(--surface-color)' }}>
        <div className="container">
          <div className="text-center mb-5" data-aos="fade-up">
            <h2 className="fw-bold">How It Works</h2>
          </div>
          <div className="row text-center">
            <div className="col-md-4 mb-4" data-aos="fade-up" data-aos-delay="100">
              <div className="d-inline-flex border border-primary text-primary-custom rounded-circle p-3 mb-3 justify-content-center align-items-center" style={{ width: '80px', height: '80px', transition: '0.3s' }} onMouseOver={(e) => e.currentTarget.style.transform='scale(1.1)'} onMouseOut={(e) => e.currentTarget.style.transform='scale(1)'}>
                <i className="bi bi-person-plus-fill" style={{ fontSize: '2rem' }}></i>
              </div>
              <h5 className="fw-bold">1. Register</h5>
              <p className="text-muted-custom">Sign up using your Aadhaar or Email to create a secure citizen profile.</p>
            </div>
            <div className="col-md-4 mb-4" data-aos="fade-up" data-aos-delay="200">
              <div className="d-inline-flex border border-primary text-primary-custom rounded-circle p-3 mb-3 justify-content-center align-items-center" style={{ width: '80px', height: '80px', transition: '0.3s' }} onMouseOver={(e) => e.currentTarget.style.transform='scale(1.1)'} onMouseOut={(e) => e.currentTarget.style.transform='scale(1)'}>
                <i className="bi bi-car-front-fill" style={{ fontSize: '2rem' }}></i>
              </div>
              <h5 className="fw-bold">2. Link Vehicles</h5>
              <p className="text-muted-custom">Add your vehicle registration numbers to instantly pull all compliance records.</p>
            </div>
            <div className="col-md-4 mb-4" data-aos="fade-up" data-aos-delay="300">
              <div className="d-inline-flex border border-primary text-primary-custom rounded-circle p-3 mb-3 justify-content-center align-items-center" style={{ width: '80px', height: '80px', transition: '0.3s' }} onMouseOver={(e) => e.currentTarget.style.transform='scale(1.1)'} onMouseOut={(e) => e.currentTarget.style.transform='scale(1)'}>
                <i className="bi bi-check-circle-fill" style={{ fontSize: '2rem' }}></i>
              </div>
              <h5 className="fw-bold">3. Stay Compliant</h5>
              <p className="text-muted-custom">Pay taxes, renew insurance, and get PUC done before alerts turn red.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default About;
