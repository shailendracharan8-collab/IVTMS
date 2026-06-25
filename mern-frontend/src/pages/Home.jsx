import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Home = () => {
  useEffect(() => {
    AOS.init({ once: true, offset: 100 });
  }, []);

  return (
    <>
      <Navbar />
      
      <section className="home-hero text-center text-lg-start">
        <div className="container position-relative z-1">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-5 mb-lg-0" data-aos="fade-right" data-aos-duration="1000">
              <span className="badge bg-light text-primary-custom px-3 py-2 rounded-pill mb-3 shadow-sm d-inline-flex align-items-center gap-2">
                <span className="spinner-grow spinner-grow-sm text-success" role="status"></span>
                Live Nationwide
              </span>
              <h1 className="display-4 fw-bold mb-3 fadeInUp text-white">Drive the Future of Digital Mobility</h1>
              <p className="lead mb-4 fadeInUp text-white-50" style={{ animationDelay: '0.2s' }}>
                Join India's unified vehicle compliance ecosystem. Instantly manage registrations, renewals, and eco-certifications from anywhere.
              </p>
              <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-lg-start fadeInUp" style={{ animationDelay: '0.4s' }}>
                <Link to="/register" className="btn btn-light btn-lg px-5 shadow rounded-pill fw-bold text-primary-custom" onMouseOver={(e) => e.currentTarget.style.transform='scale(1.05)'} onMouseOut={(e) => e.currentTarget.style.transform='scale(1)'}>Get Started</Link>
                <Link to="/about" className="btn btn-outline-light btn-lg px-5 rounded-pill"><i className="bi bi-play-circle me-2"></i> How it Works</Link>
              </div>
            </div>
            <div className="col-lg-6 position-relative" data-aos="fade-left" data-aos-duration="1200" data-aos-delay="200">
              <div className="position-relative">
                <img src="https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=600" alt="Dashboard Illustration" className="img-fluid rounded-4 shadow-lg border border-3 border-white border-opacity-25 w-100" style={{ objectFit: 'cover', height: '350px' }} />
                
                <div className="position-absolute bottom-0 start-0 translate-middle-y ms-minus-4 d-none d-md-block p-3 bg-white rounded-4 shadow-lg float-anim">
                  <div className="d-flex align-items-center gap-3">
                    <div className="bg-success bg-opacity-10 p-3 rounded-circle text-success">
                      <i className="bi bi-check-circle-fill fs-3"></i>
                    </div>
                    <div className="text-dark">
                      <h6 className="fw-bold mb-0">PUC Status</h6>
                      <small className="text-secondary text-muted-custom">Valid till 2027</small>
                    </div>
                  </div>
                </div>

                <div className="position-absolute top-0 end-0 translate-middle-y me-minus-4 mt-5 d-none d-md-block p-3 bg-white rounded-4 shadow-lg float-anim-delayed">
                  <div className="d-flex align-items-center gap-3">
                    <div className="bg-primary bg-opacity-10 p-3 rounded-circle text-primary-custom">
                      <i className="bi bi-bell-fill fs-3"></i>
                    </div>
                    <div className="text-dark">
                      <h6 className="fw-bold mb-0">Tax Alert</h6>
                      <small className="text-secondary text-muted-custom">Paid Successfully</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-5 my-3">
        <div className="container mb-4">
          <div className="row align-items-center mb-4">
            <div className="col-md-8" data-aos="fade-right">
              <h2 className="fw-bold">Popular Services</h2>
              <p className="text-muted-custom">Quickly navigate directly to what you need.</p>
            </div>
            <div className="col-md-4 text-md-end" data-aos="fade-left">
              <Link to="/services" className="btn btn-outline-primary rounded-pill">View All Services <i className="bi bi-arrow-right"></i></Link>
            </div>
          </div>
          
          <div className="row g-4">
            <div className="col-md-3" data-aos="fade-up" data-aos-delay="50">
              <Link to="/login" className="text-decoration-none text-dark">
                <div className="card card-scale h-100 border-0 shadow-sm rounded-4 p-4 text-center bg-white">
                  <div className="bg-primary bg-opacity-10 p-3 rounded-circle d-inline-block mx-auto mb-3">
                    <i className="bi bi-car-front-fill fs-2 text-primary-custom"></i>
                  </div>
                  <h5 className="fw-bold">Add Vehicle</h5>
                </div>
              </Link>
            </div>
            <div className="col-md-3" data-aos="fade-up" data-aos-delay="150">
              <Link to="/login" className="text-decoration-none text-dark">
                <div className="card card-scale h-100 border-0 shadow-sm rounded-4 p-4 text-center bg-white">
                  <div className="bg-success bg-opacity-10 p-3 rounded-circle d-inline-block mx-auto mb-3">
                    <i className="bi bi-wind fs-2 text-success"></i>
                  </div>
                  <h5 className="fw-bold">Check PUC</h5>
                </div>
              </Link>
            </div>
            <div className="col-md-3" data-aos="fade-up" data-aos-delay="250">
              <Link to="/login" className="text-decoration-none text-dark">
                <div className="card card-scale h-100 border-0 shadow-sm rounded-4 p-4 text-center bg-white">
                  <div className="bg-warning bg-opacity-10 p-3 rounded-circle d-inline-block mx-auto mb-3">
                    <i className="bi bi-shield-shaded fs-2 text-warning"></i>
                  </div>
                  <h5 className="fw-bold">Insurance</h5>
                </div>
              </Link>
            </div>
            <div className="col-md-3" data-aos="fade-up" data-aos-delay="350">
              <Link to="/login" className="text-decoration-none text-dark">
                <div className="card card-scale h-100 border-0 shadow-sm rounded-4 p-4 text-center bg-white">
                  <div className="bg-danger bg-opacity-10 p-3 rounded-circle d-inline-block mx-auto mb-3">
                    <i className="bi bi-cash-coin fs-2 text-danger"></i>
                  </div>
                  <h5 className="fw-bold">Pay Taxes</h5>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Home;
