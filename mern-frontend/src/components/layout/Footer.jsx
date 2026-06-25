import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer id="contact">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-4" data-aos="fade-right">
            <h5 className="text-white mb-3 d-flex align-items-center gap-2">
              <i className="bi bi-shield-check text-white"></i> IVTMS
            </h5>
            <p className="text-secondary">Integrated Vehicle & Transport Management System is a modern initiative to digitize automotive compliance.</p>
          </div>
          <div className="col-md-4 mb-4" data-aos="fade-up">
            <h5 className="text-white mb-3">Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="#">Terms & Conditions</Link></li>
              <li className="mb-2"><Link to="#">Privacy Policy</Link></li>
              <li className="mb-2"><Link to="/contact">Help & Support</Link></li>
            </ul>
          </div>
          <div className="col-md-4 mb-4" data-aos="fade-left">
            <h5 className="text-white mb-3">Contact Us</h5>
            <p className="text-secondary mb-1"><i className="bi bi-envelope me-2"></i> support@ivtms.gov</p>
            <p className="text-secondary"><i className="bi bi-telephone me-2"></i> 1800-111-2222</p>
          </div>
        </div>
        <div className="border-top border-secondary mt-3 pt-3 text-center text-secondary">
          <p className="mb-0">&copy; 2026 IVTMS Authority. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
