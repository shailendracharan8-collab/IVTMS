import React from 'react';
import Navbar from './layout/Navbar';
import { motion } from 'framer-motion';
import '../pages/Auth.css';

const About = () => {
  return (
    <div className="auth-page" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div className="container" style={{ flex: 1, padding: '4rem 1rem', maxWidth: '900px' }}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ width: '100%', height: '400px', borderRadius: '24px', overflow: 'hidden', marginBottom: '3rem', border: '1px solid var(--glass-border)', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
          <img src="/images/about_hero.png" alt="Smart City Future" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-5">
          <h1 style={{ fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>About IVTMS</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>Intelligent Vehicle & Traffic Management System</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ background: 'var(--bg-secondary)', padding: '3rem', borderRadius: '24px', border: '1px solid var(--glass-border)' }}>
          <h3 style={{ color: 'var(--accent-primary)', marginBottom: '1rem' }}>Our Mission</h3>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.8', marginBottom: '2rem' }}>
            IVTMS is designed to bridge the gap between citizens, RTO authorities, and traffic inspectors. 
            By centralizing vehicle registration, emission tracking, and fine management into a single, highly secure digital ecosystem, 
            we aim to eliminate physical paperwork and reduce bureaucratic delays.
          </p>

          <h3 style={{ color: 'var(--accent-primary)', marginBottom: '1rem' }}>Key Capabilities</h3>
          <ul style={{ color: 'var(--text-muted)', lineHeight: '1.8', margin: 0, paddingLeft: '1.5rem' }}>
            <li>Real-time automated fraud detection for expired documents.</li>
            <li>Role-based access controls for Citizens, RTOs, Inspectors, and Admins.</li>
            <li>Direct integration with live Emission Testing hardware simulators.</li>
            <li>Responsive, beautiful, and accessible dark/light mode interfaces.</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
