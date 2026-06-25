import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { 
  Users, Activity, ShieldCheck, Database, 
  Settings, AlertTriangle, Car, FileText, Mail, CheckCircle, Search as SearchIcon
} from 'lucide-react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import Layout from './layout/Layout';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050/api';

const AdminDashboard = ({ userInfo, onLogout }) => {
  const [activeSection, setActiveSection] = useState('overview');
  
  const [vehicles, setVehicles] = useState([]);
  const [applications, setApplications] = useState([]);
  const [challans, setChallans] = useState([]);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  
  const [searchTerm, setSearchTerm] = useState('');
  
  const [userRoleFilter, setUserRoleFilter] = useState('ALL');
  const [dbActiveTab, setDbActiveTab] = useState('vehicles');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editProfileData, setEditProfileData] = useState({ fullName: userInfo?.fullName, email: userInfo?.email });

  const sidebarItems = [
    { id: 'overview', label: 'System Overview', icon: Activity },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'messages', label: 'Support Inbox', icon: Mail },
    { id: 'database', label: 'Database Status', icon: Database },
    { id: 'settings', label: 'System Settings', icon: Settings },
  ];

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        const [v, a, c, u, m] = await Promise.all([
          axios.get(`${API_URL}/vehicles`, config),
          axios.get(`${API_URL}/applications`, config),
          axios.get(`${API_URL}/challans`, config),
          axios.get(`${API_URL}/auth/users`, config),
          axios.get(`${API_URL}/messages`, config)
        ]);
        setVehicles(v.data);
        setApplications(a.data);
        setChallans(c.data);
        setUsers(u.data);
        setMessages(m.data);
      } catch (err) {
        console.error('Error fetching admin data', err);
      }
    };
    fetchAdminData();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const res = await axios.put(`${API_URL}/auth/profile`, editProfileData, config);
      localStorage.setItem('userInfo', JSON.stringify(res.data));
      window.location.reload();
    } catch (error) {
      alert('Error updating profile');
    }
  };

  const kpis = [
    { title: 'Registered Vehicles', value: vehicles.length, icon: Car, color: 'var(--accent-primary)' },
    { title: 'Total Applications', value: applications.length, icon: FileText, color: 'var(--status-info)' },
    { title: 'Pending RTO Apps', value: applications.filter(a=>a.status==='Pending').length, icon: ShieldCheck, color: 'var(--status-warning)' },
    { title: 'Challans Issued', value: challans.length, icon: AlertTriangle, color: 'var(--status-danger)' },
  ];

  const performanceData = {
    labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
    datasets: [{
      label: 'API Requests / min',
      data: [120, 80, 450, 890, 720, 300, 150],
      borderColor: '#4f46e5',
      backgroundColor: 'rgba(79, 70, 229, 0.1)',
      fill: true,
      tension: 0.4,
      borderWidth: 2
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: { grid: { color: 'rgba(148,163,184,0.1)' }, ticks: { color: 'var(--text-muted)' } },
      x: { grid: { display: false }, ticks: { color: 'var(--text-muted)' } }
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
              {kpis.map((kpi, index) => (
                <motion.div key={kpi.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: `${kpi.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: kpi.color }}><kpi.icon size={32} /></div>
                  <div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 0.25rem 0', fontWeight: 600 }}>{kpi.title}</p>
                    <h3 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>{kpi.value}</h3>
                  </div>
                </motion.div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
              <motion.div className="glass-panel" style={{ padding: '2rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', marginBottom: '1.5rem' }}>System Traffic</h3>
                <div style={{ height: '300px', width: '100%' }}>
                  <Line data={performanceData} options={chartOptions} />
                </div>
              </motion.div>
            </div>
          </div>
        );

      case 'users':
        const filteredUsers = (userRoleFilter === 'ALL' ? users : users.filter(u => u.role === userRoleFilter))
          .filter(u => 
            u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
            u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.aadhaarNumber?.includes(searchTerm)
          );

        return (
          <div className="glass-panel" style={{ padding: '2rem', minHeight: '60vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Users color="var(--accent-primary)" /> User Management</h2>
              
              <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '0.5rem 1rem', flex: 1, maxWidth: '300px' }}>
                <SearchIcon size={18} color="var(--text-muted)" style={{ marginRight: '0.5rem' }} />
                <input 
                  type="text" 
                  placeholder="Search name, email, or aadhaar..." 
                  value={searchTerm} 
                  onChange={e => setSearchTerm(e.target.value)} 
                  style={{ border: 'none', background: 'transparent', color: 'var(--text-primary)', outline: 'none', width: '100%' }} 
                />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {['ALL', 'CITIZEN', 'RTO', 'INSPECTOR', 'ADMIN'].map(role => (
                  <button key={role} onClick={() => setUserRoleFilter(role)} style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: userRoleFilter === role ? 'var(--accent-primary)' : 'var(--bg-secondary)', color: userRoleFilter === role ? 'white' : 'var(--text-primary)', cursor: 'pointer', fontWeight: 600 }}>
                    {role}
                  </button>
                ))}
              </div>
            </div>
            
            <div style={{ background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--glass-border)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead style={{ background: 'rgba(255,255,255,0.05)', borderBottom: '1px solid var(--glass-border)' }}>
                  <tr>
                    <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Name</th>
                    <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Email</th>
                    <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Role</th>
                    <th style={{ padding: '1rem', color: 'var(--text-muted)' }}>Aadhaar</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(u => (
                    <tr key={u._id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                      <td style={{ padding: '1rem', fontWeight: 600 }}>{u.fullName}</td>
                      <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{u.email}</td>
                      <td style={{ padding: '1rem' }}>
                        <span style={{ padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 700, background: u.role === 'ADMIN' ? 'var(--status-danger)20' : u.role === 'RTO' ? 'var(--status-warning)20' : u.role === 'INSPECTOR' ? 'var(--status-info)20' : 'var(--status-success)20', color: u.role === 'ADMIN' ? 'var(--status-danger)' : u.role === 'RTO' ? 'var(--status-warning)' : u.role === 'INSPECTOR' ? 'var(--status-info)' : 'var(--status-success)' }}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>{u.aadhaarNumber || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'messages':
        return (
          <div className="glass-panel" style={{ padding: '2rem', minHeight: '60vh' }}>
            <h2 style={{ margin: 0, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Mail color="var(--accent-primary)" /> Support Inbox</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {messages.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>No messages found.</p> : messages.map(msg => (
                <div key={msg._id} style={{ padding: '1.5rem', borderRadius: '16px', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4 style={{ margin: '0 0 0.25rem 0', color: 'var(--text-primary)' }}>{msg.name}</h4>
                      <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>{msg.email} • {new Date(msg.createdAt).toLocaleString()}</p>
                    </div>
                    <span style={{ padding: '0.25rem 0.75rem', borderRadius: '99px', background: msg.status === 'Read' ? 'var(--status-success)20' : 'var(--status-warning)20', color: msg.status === 'Read' ? 'var(--status-success)' : 'var(--status-warning)', fontSize: '0.75rem', fontWeight: 700 }}>
                      {msg.status}
                    </span>
                  </div>
                  <p style={{ margin: 0, color: 'var(--text-primary)', lineHeight: '1.6', background: 'var(--bg-primary)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                    {msg.message}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'database':
        const filteredVehicles = vehicles.filter(v => v.rcNumber?.toLowerCase().includes(searchTerm.toLowerCase()) || v.owner?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()));
        const filteredApps = applications.filter(a => a.appId?.toLowerCase().includes(searchTerm.toLowerCase()) || a.type?.toLowerCase().includes(searchTerm.toLowerCase()) || a.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()));
        const filteredChallans = challans.filter(c => c.challanId?.toLowerCase().includes(searchTerm.toLowerCase()) || c.vehicle?.rcNumber?.toLowerCase().includes(searchTerm.toLowerCase()));

        return (
          <div className="glass-panel" style={{ padding: '2rem', minHeight: '60vh' }}>
            <h2 style={{ margin: 0, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Database color="var(--accent-primary)" /> Raw Database Viewer</h2>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button onClick={() => setDbActiveTab('vehicles')} style={{ padding: '0.75rem 1.5rem', background: dbActiveTab === 'vehicles' ? 'var(--accent-primary)' : 'var(--bg-secondary)', color: dbActiveTab === 'vehicles' ? 'white' : 'var(--text-primary)', border: '1px solid var(--glass-border)', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Vehicles ({filteredVehicles.length})</button>
                <button onClick={() => setDbActiveTab('applications')} style={{ padding: '0.75rem 1.5rem', background: dbActiveTab === 'applications' ? 'var(--accent-primary)' : 'var(--bg-secondary)', color: dbActiveTab === 'applications' ? 'white' : 'var(--text-primary)', border: '1px solid var(--glass-border)', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Applications ({filteredApps.length})</button>
                <button onClick={() => setDbActiveTab('challans')} style={{ padding: '0.75rem 1.5rem', background: dbActiveTab === 'challans' ? 'var(--accent-primary)' : 'var(--bg-secondary)', color: dbActiveTab === 'challans' ? 'white' : 'var(--text-primary)', border: '1px solid var(--glass-border)', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Challans ({filteredChallans.length})</button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '0.5rem 1rem', width: '300px' }}>
                <SearchIcon size={18} color="var(--text-muted)" style={{ marginRight: '0.5rem' }} />
                <input 
                  type="text" 
                  placeholder="Search by RC, Name, or ID..." 
                  value={searchTerm} 
                  onChange={e => setSearchTerm(e.target.value)} 
                  style={{ border: 'none', background: 'transparent', color: 'var(--text-primary)', outline: 'none', width: '100%' }} 
                />
              </div>
            </div>

            <div style={{ background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--glass-border)', padding: '1rem', maxHeight: '500px', overflowY: 'auto' }}>
              {dbActiveTab === 'vehicles' && filteredVehicles.map(v => (
                <div key={v._id} style={{ padding: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
                  <strong>{v.rcNumber}</strong> - {v.make} {v.model} <span style={{ color: 'var(--text-muted)' }}>({v.status})</span> - Owner: {v.owner?.fullName || 'N/A'}
                </div>
              ))}
              {dbActiveTab === 'applications' && filteredApps.map(a => (
                <div key={a._id} style={{ padding: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
                  <strong>{a.appId || a.applicationId}</strong> - {a.type} <span style={{ color: 'var(--text-muted)' }}>({a.status})</span> - By: {a.user?.fullName || 'N/A'}
                </div>
              ))}
              {dbActiveTab === 'challans' && filteredChallans.map(c => (
                <div key={c._id} style={{ padding: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
                  <strong>{c.challanId}</strong> - {c.reason} - ₹{c.amount} <span style={{ color: 'var(--text-muted)' }}>({c.status})</span> - RC: {c.vehicle?.rcNumber || 'N/A'}
                </div>
              ))}
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="glass-panel" style={{ padding: '2rem', minHeight: '60vh' }}>
            <h2 style={{ margin: 0, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Settings color="var(--accent-primary)" /> System Settings</h2>
            
            <div style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0 }}>Admin Profile</h3>
                {!isEditingProfile && (
                  <button onClick={() => setIsEditingProfile(true)} style={{ padding: '0.5rem 1rem', background: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Edit Profile</button>
                )}
              </div>

              {isEditingProfile ? (
                <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Full Name</label>
                    <input type="text" value={editProfileData.fullName} onChange={e => setEditProfileData({...editProfileData, fullName: e.target.value})} required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--bg-primary)' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Email Address</label>
                    <input type="email" value={editProfileData.email} onChange={e => setEditProfileData({...editProfileData, email: e.target.value})} required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--bg-primary)' }} />
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button type="submit" style={{ padding: '0.75rem 1.5rem', background: 'var(--status-success)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Save Changes</button>
                    <button type="button" onClick={() => { setIsEditingProfile(false); setEditProfileData({ fullName: userInfo.fullName, email: userInfo.email }); }} style={{ padding: '0.75rem 1.5rem', background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--glass-border)', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                  </div>
                </form>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <p style={{ margin: 0, fontSize: '1.1rem' }}><strong>Name:</strong> {userInfo.fullName}</p>
                  <p style={{ margin: 0, fontSize: '1.1rem' }}><strong>Email:</strong> {userInfo.email}</p>
                  <p style={{ margin: 0, fontSize: '1.1rem' }}><strong>System Role:</strong> <span style={{ color: 'var(--status-danger)', fontWeight: 700 }}>SUPER ADMIN</span></p>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return (
          <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <Activity size={64} color="var(--text-muted)" style={{ opacity: 0.5, marginBottom: '1rem' }} />
            <h2 style={{ color: 'var(--text-muted)' }}>{sidebarItems.find(i => i.id === activeSection)?.label} Content Under Construction</h2>
          </div>
        );
    }
  };

  return (
    <Layout userInfo={userInfo} onLogout={onLogout} sidebarItems={sidebarItems} activeSection={activeSection} setActiveSection={setActiveSection} title="Admin Control Center">
      {renderContent()}
    </Layout>
  );
};

export default AdminDashboard;
