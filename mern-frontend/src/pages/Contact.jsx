import React, { useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Contact = () => {
  useEffect(() => {
    AOS.init({ once: true, offset: 100 });
  }, []);

  return (
    <>
      <Navbar />

      <div className="page-hero" style={{ background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%)', padding: '80px 0 60px', color: '#fff', textAlign: 'center' }}>
        <div className="container" data-aos="zoom-in">
          <h1 className="display-5 fw-bold mb-3 text-white">Contact Support</h1>
          <p className="lead text-white-50">Reach out for help regarding vehicle compliance and portal issues.</p>
        </div>
      </div>

      <section className="py-5 my-3">
        <div className="container">
          <div className="row g-5">
            <div className="col-lg-4" data-aos="fade-right">
              <div className="card h-100 p-4 shadow-sm border-0 bg-light">
                <h4 className="fw-bold mb-4">Get in Touch</h4>
                
                <div className="d-flex align-items-center mb-4">
                  <div className="bg-white p-3 rounded-circle shadow-sm me-3 text-primary-custom">
                    <i className="bi bi-geo-alt-fill fs-4"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1">Head Office</h6>
                    <p className="text-muted-custom mb-0 small">Block 4, Central Transport Bhawan, New Delhi</p>
                  </div>
                </div>
                
                <div className="d-flex align-items-center mb-4">
                  <div className="bg-white p-3 rounded-circle shadow-sm me-3 text-primary-custom">
                    <i className="bi bi-envelope-fill fs-4"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1">Email Us</h6>
                    <p className="text-muted-custom mb-0 small">support@ivtms.gov</p>
                  </div>
                </div>

                <div className="d-flex align-items-center mb-4">
                  <div className="bg-white p-3 rounded-circle shadow-sm me-3 text-primary-custom">
                    <i className="bi bi-telephone-fill fs-4"></i>
                  </div>
                  <div>
                    <h6 className="fw-bold mb-1">Helpline</h6>
                    <p className="text-muted-custom mb-0 small">1800-111-2222 (Toll Free)</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-8" data-aos="fade-left">
              <div className="card p-4 p-md-5 shadow-sm border-0 border-top border-primary border-4">
                <h3 className="fw-bold mb-4">Send a Message</h3>
                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Full Name</label>
                      <input type="text" className="form-control py-2" placeholder="John Doe" />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Email Address</label>
                      <input type="email" className="form-control py-2" placeholder="john@example.com" />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">Subject</label>
                    <select className="form-select py-2">
                      <option>Technical Issue with Portal</option>
                      <option>RC Application Status</option>
                      <option>Tax Payment Failed</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="form-label fw-semibold">Message Detail</label>
                    <textarea className="form-control" rows="5" placeholder="Enter details of your inquiry..."></textarea>
                  </div>
                  <button type="submit" className="btn btn-primary btn-lg rounded-pill px-5">Submit Request</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Contact;
