import React from 'react';
import Navbar from './layout/Navbar';
import { motion } from 'framer-motion';
import { ShieldCheck, Activity, Search, Database } from 'lucide-react';
import '../pages/Auth.css';

const Services = () => {
  const services = [
    { title: 'Vehicle Registration', desc: 'Register your new or transferred vehicles entirely online without visiting the RTO office.', icon: ShieldCheck },
    { title: 'PUC & Emissions', desc: 'Live emission testing and automated certificate generation powered by smart sensors.', icon: Activity },
    { title: 'Smart Search', desc: 'Instantly verify RC details and vehicle history with our global database integration.', icon: Search },
    { title: 'E-Challan System', desc: 'Automated traffic fine generation and seamless online payment portal.', icon: Database },
  ];

  return (
    <div className="auth-page" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div className="container" style={{ flex: 1, padding: '4rem 1rem' }}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ width: '100%', height: '350px', borderRadius: '24px', overflow: 'hidden', marginBottom: '3rem', position: 'relative', border: '1px solid var(--glass-border)', boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}>
          <img src="/images/services_hero.png" alt="Digital Services Network" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to bottom, transparent, var(--bg-primary))' }}></div>
        </motion.div>

        <div className="text-center mb-5">
          <h1 style={{ fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>Our Premium Services</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>Discover the comprehensive suite of digital tools designed to modernize vehicle and traffic management.</p>
        </div>

        <div className="row g-4 justify-content-center">
          {services.map((svc, i) => (
            <div key={i} className="col-md-6 col-lg-5">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--glass-border)', height: '100%' }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '12px', background: 'rgba(13, 110, 253, 0.1)', color: 'var(--primary-color, #0d6efd)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                  <svc.icon size={32} />
                </div>
                <h3 style={{ margin: '0 0 1rem 0', color: 'var(--text-primary)' }}>{svc.title}</h3>
                <p style={{ margin: 0, color: 'var(--text-muted)', lineHeight: '1.6' }}>{svc.desc}</p>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
