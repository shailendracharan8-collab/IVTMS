import React, { useState } from 'react';
import axios from 'axios';
import Navbar from './layout/Navbar';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';
import '../pages/Auth.css';

const Contact = () => {
  const [sent, setSent] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5050/api/messages', formData);
      setSent(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setSent(false), 3000);
    } catch (error) {
      alert('Failed to send message');
    }
  };

  return (
    <div className="auth-page" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div className="container" style={{ flex: 1, padding: '4rem 1rem', maxWidth: '1000px' }}>
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ width: '100%', height: '300px', borderRadius: '24px', overflow: 'hidden', marginBottom: '3rem', position: 'relative', border: '1px solid var(--glass-border)' }}>
          <img src="/images/contact_hero.png" alt="Futuristic Network Support" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to right, var(--bg-primary) 10%, transparent 50%, var(--bg-primary) 90%)' }}></div>
        </motion.div>

        <div className="text-center mb-5">
          <h1 style={{ fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem' }}>Contact Global Support</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>We're here to help with any system issues or feedback.</p>
        </div>

        <div className="row g-5">
          <div className="col-lg-5">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '2rem' }}>Get in Touch</h3>
              
              <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(13, 110, 253, 0.1)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Mail /></div>
                <div>
                  <h5 style={{ margin: '0 0 0.25rem 0', color: 'var(--text-primary)' }}>Email Support</h5>
                  <p style={{ margin: 0, color: 'var(--text-muted)' }}>support@ivtms.gov.in</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(13, 110, 253, 0.1)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Phone /></div>
                <div>
                  <h5 style={{ margin: '0 0 0.25rem 0', color: 'var(--text-primary)' }}>Toll-Free Helpline</h5>
                  <p style={{ margin: 0, color: 'var(--text-muted)' }}>1800-111-2222</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1.5rem' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(13, 110, 253, 0.1)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MapPin /></div>
                <div>
                  <h5 style={{ margin: '0 0 0.25rem 0', color: 'var(--text-primary)' }}>Headquarters</h5>
                  <p style={{ margin: 0, color: 'var(--text-muted)' }}>Central RTO Building,<br/>New Delhi, India 110001</p>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="col-lg-7">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ background: 'var(--bg-secondary)', padding: '3rem', borderRadius: '24px', border: '1px solid var(--glass-border)' }}>
              {sent ? (
                <div className="text-center" style={{ padding: '3rem 0' }}>
                  <div style={{ width: '80px', height: '80px', background: 'var(--status-success)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem auto', fontSize: '2rem' }}>✓</div>
                  <h3 style={{ color: 'var(--text-primary)' }}>Message Sent!</h3>
                  <p style={{ color: 'var(--text-muted)' }}>We'll get back to you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Your Name</label>
                    <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Email Address</label>
                    <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Message</label>
                    <textarea value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} required rows="4" style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid var(--glass-border)', background: 'var(--bg-primary)', color: 'var(--text-primary)', outline: 'none', resize: 'vertical' }}></textarea>
                  </div>
                  <button type="submit" style={{ padding: '1rem', background: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 600, cursor: 'pointer', fontSize: '1.1rem', marginTop: '0.5rem' }}>
                    Send Message
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
