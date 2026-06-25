import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, X, Bell, Moon, Sun, LogOut, User, 
  Settings, ChevronRight 
} from 'lucide-react';

const Layout = ({ 
  children, 
  userInfo, 
  onLogout, 
  sidebarItems, 
  activeSection, 
  setActiveSection,
  title,
  notificationsCount = 0,
  onNotificationClick
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="dashboard-layout">
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mobile-overlay"
            onClick={closeMobileMenu}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 998
            }}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside 
        className="sidebar glass-panel"
        initial={false}
        animate={{ 
          x: isMobileMenuOpen ? 0 : (window.innerWidth <= 1024 ? -300 : 0)
        }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        style={{
          width: 'var(--sidebar-width)',
          position: 'fixed',
          top: '1rem',
          bottom: '1rem',
          left: '1rem',
          zIndex: 999,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        <div style={{ padding: '2rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '40px', height: '40px', borderRadius: '12px',
            background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 'bold', fontSize: '1.2rem',
            boxShadow: '0 0 20px var(--accent-glow)'
          }}>
            IV
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--text-primary)' }}>IVTMS</h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {userInfo?.role || 'Portal'} Console
            </p>
          </div>
          <button 
            onClick={closeMobileMenu}
            style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: window.innerWidth <= 1024 ? 'block' : 'none' }}
          >
            <X size={20} />
          </button>
        </div>

        <nav style={{ flex: 1, padding: '0 1rem', overflowY: 'auto' }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              
              return (
                <li key={item.id}>
                  <button
                    onClick={() => { setActiveSection(item.id); closeMobileMenu(); }}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: '1rem',
                      padding: '0.875rem 1rem', borderRadius: '12px', border: 'none',
                      background: isActive ? 'var(--accent-glow)' : 'transparent',
                      color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                      cursor: 'pointer', fontSize: '0.95rem', fontWeight: isActive ? 600 : 500,
                      position: 'relative', overflow: 'hidden', textAlign: 'left'
                    }}
                  >
                    <Icon size={20} />
                    {item.label}
                    {isActive && (
                      <motion.div 
                        layoutId="activeTab"
                        style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: 'var(--accent-primary)' }}
                      />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div style={{ padding: '1.5rem', borderTop: '1px solid var(--glass-border)' }}>
          <button
            onClick={onLogout}
            style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '1rem',
              padding: '0.875rem 1rem', borderRadius: '12px', border: 'none',
              background: 'rgba(239, 68, 68, 0.1)', color: 'var(--status-danger)',
              cursor: 'pointer', fontSize: '0.95rem', fontWeight: 600
            }}
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="dashboard-main" style={{ padding: '1rem 2rem' }}>
        {/* Topbar */}
        <header className="glass-panel" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1rem 1.5rem', marginBottom: '2rem', zIndex: 50,
          position: 'sticky', top: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              className="d-lg-none"
              onClick={() => setIsMobileMenuOpen(true)}
              style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}
            >
              <Menu size={24} />
            </button>
            <h1 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--text-primary)' }}>{title}</h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button 
              onClick={toggleTheme}
              style={{
                width: '40px', height: '40px', borderRadius: '50%',
                background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--text-primary)', cursor: 'pointer'
              }}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            
            <button onClick={onNotificationClick} style={{
                width: '40px', height: '40px', borderRadius: '50%', position: 'relative',
                background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--text-primary)', cursor: 'pointer'
              }}>
              <Bell size={18} />
              {notificationsCount > 0 && (
                <span style={{
                  position: 'absolute', top: '2px', right: '2px', width: '16px', height: '16px',
                  background: 'var(--status-danger)', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.65rem', color: 'white', fontWeight: 'bold'
                }}>{notificationsCount}</span>
              )}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.25rem 1rem 0.25rem 0.25rem', background: 'var(--bg-secondary)', borderRadius: '99px', border: '1px solid var(--glass-border)' }}>
              <img 
                src={`https://ui-avatars.com/api/?name=${userInfo?.fullName || 'User'}&background=6366f1&color=fff`} 
                alt="Avatar" 
                style={{ width: '32px', height: '32px', borderRadius: '50%' }}
              />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{userInfo?.fullName || 'User'}</span>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{userInfo?.role || 'Guest'}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          style={{ flex: 1 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};

export default Layout;
