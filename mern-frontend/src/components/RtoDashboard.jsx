import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { 
  Inbox, AlertTriangle, Search, FileSignature, 
  Settings, CheckCircle, XCircle, Wallet, FileText, Activity,
  ChevronDown, ChevronUp, AlertCircle
} from 'lucide-react';
import Layout from './layout/Layout';

const API_URL = 'http://localhost:5050/api';

const RtoDashboard = ({ userInfo, onLogout }) => {
  const [activeSection, setActiveSection] = useState('command');
  const [applications, setApplications] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [alertForm, setAlertForm] = useState({ vehicleId: null, type: 'Insurance', message: '' });
  const [expandedVehicleId, setExpandedVehicleId] = useState(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editProfileData, setEditProfileData] = useState({ fullName: userInfo?.fullName, email: userInfo?.email });

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

  const sidebarItems = [
    { id: 'command', label: 'Command Center', icon: Inbox },
    { id: 'applications', label: 'Applications Queue', icon: FileText },
    { id: 'fraud', label: 'Fraud Detection', icon: AlertTriangle },
    { id: 'database', label: 'Vehicle Database', icon: Search },
    { id: 'permits', label: 'Permits Management', icon: FileSignature },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const [appRes, vehRes] = await Promise.all([
        axios.get(`${API_URL}/applications`, config),
        axios.get(`${API_URL}/vehicles`, config)
      ]);
      setApplications(appRes.data);
      setVehicles(vehRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusUpdate = async (id, status, remarks) => {
    try {
      await axios.put(`${API_URL}/applications/${id}/status`, { status, remarks }, {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      fetchData();
    } catch (error) {
      alert('Error updating application');
    }
  };

  const handleSendAlert = async (e, citizenId) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.post(`${API_URL}/alerts`, {
        citizenId,
        vehicleId: alertForm.vehicleId,
        type: alertForm.type,
        message: alertForm.message
      }, config);
      alert('Alert sent successfully!');
      setAlertForm({ vehicleId: null, type: 'Insurance', message: '' });
    } catch (error) {
      alert('Error sending alert');
    }
  };

  const pendingApps = applications.filter(a => a.status === 'Pending');
  const approvedApps = applications.filter(a => a.status === 'Approved');
  const rejectedApps = applications.filter(a => a.status === 'Rejected');

  const kpis = [
    { title: 'Pending Applications', value: pendingApps.length, icon: Inbox, color: 'var(--status-warning)' },
    { title: 'Approved', value: approvedApps.length, icon: CheckCircle, color: 'var(--status-success)' },
    { title: 'Rejected', value: rejectedApps.length, icon: XCircle, color: 'var(--status-danger)' },
    { title: 'Total Vehicles', value: vehicles.length, icon: Search, color: 'var(--accent-primary)' },
  ];

  const renderContent = () => {
    if (loading) return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading Data...</div>;

    switch (activeSection) {
      case 'command':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
              {kpis.map((kpi, index) => (
                <motion.div 
                  key={kpi.title}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}
                  className="glass-panel"
                  style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}
                >
                  <div style={{ width: '60px', height: '60px', borderRadius: '16px', background: `${kpi.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: kpi.color }}>
                    <kpi.icon size={32} />
                  </div>
                  <div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 0.25rem 0', fontWeight: 600 }}>{kpi.title}</p>
                    <h3 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>{kpi.value}</h3>
                  </div>
                </motion.div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
              <motion.div className="glass-panel" style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Pending Queue</h3>
                  <button onClick={() => setActiveSection('applications')} style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', fontWeight: 600 }}>View All</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {pendingApps.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>No pending applications!</p> : pendingApps.slice(0, 4).map((app) => (
                    <div key={app._id} style={{ display: 'flex', alignItems: 'center', padding: '1.25rem', borderRadius: '16px', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', gap: '1rem' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                          <span style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>{app.appId}</span>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>• {app.user?.fullName}</span>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.9rem' }}>{app.type} <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>({new Date(app.createdAt).toLocaleDateString()})</span></p>
                        {app.details?.rcNumber && <p style={{ margin: '0.25rem 0 0 0', color: 'var(--accent-primary)', fontSize: '0.85rem', fontWeight: 600 }}>Vehicle: {app.details.rcNumber}</p>}
                      </div>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => handleStatusUpdate(app._id, 'Approved', 'Verified successfully.')} style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--status-success)20', color: 'var(--status-success)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Approve"><CheckCircle size={18} /></button>
                        <button onClick={() => handleStatusUpdate(app._id, 'Rejected', 'Missing documents.')} style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--status-danger)20', color: 'var(--status-danger)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Reject"><XCircle size={18} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div className="glass-panel" style={{ padding: '2rem', borderLeft: '4px solid var(--status-danger)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <AlertTriangle color="var(--status-danger)" size={28} />
                  <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--status-danger)' }}>Fraud / Flagged</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <p style={{ color: 'var(--text-muted)' }}>Integration with Inspector module pending.</p>
                </div>
              </motion.div>
            </div>
          </div>
        );

      case 'applications':
        const filteredApps = applications.filter(a => 
          a.appId?.toLowerCase().includes(searchTerm.toLowerCase()) || 
          a.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          a.details?.rcNumber?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return (
          <div className="glass-panel" style={{ padding: '2rem', minHeight: '60vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h2 style={{ margin: 0 }}>All Applications</h2>
              <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '0.5rem 1rem', width: '300px' }}>
                <Search size={18} color="var(--text-muted)" style={{ marginRight: '0.5rem' }} />
                <input 
                  type="text" 
                  placeholder="Search App ID, Name, or RC..." 
                  value={searchTerm} 
                  onChange={e => setSearchTerm(e.target.value)} 
                  style={{ border: 'none', background: 'transparent', color: 'var(--text-primary)', outline: 'none', width: '100%' }} 
                />
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filteredApps.map(app => (
                <div key={app._id} style={{ display: 'flex', alignItems: 'center', padding: '1.25rem', borderRadius: '16px', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>{app.appId}</span>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>• {app.user?.fullName}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.9rem' }}>{app.type}</p>
                    {app.details?.rcNumber && <p style={{ margin: '0.25rem 0 0 0', color: 'var(--accent-primary)', fontSize: '0.85rem', fontWeight: 600 }}>Vehicle: {app.details.rcNumber}</p>}
                    {app.remarks && <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Note: {app.remarks}</p>}
                  </div>
                  
                  {app.status === 'Pending' ? (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => handleStatusUpdate(app._id, 'Approved', 'Verified')} style={{ padding: '0.5rem 1rem', borderRadius: '8px', background: 'var(--status-success)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Approve</button>
                      <button onClick={() => handleStatusUpdate(app._id, 'Rejected', 'Invalid')} style={{ padding: '0.5rem 1rem', borderRadius: '8px', background: 'var(--status-danger)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Reject</button>
                    </div>
                  ) : (
                    <span style={{ padding: '0.35rem 1rem', borderRadius: '99px', background: app.status === 'Approved' ? 'var(--status-success)20' : 'var(--status-danger)20', color: app.status === 'Approved' ? 'var(--status-success)' : 'var(--status-danger)', fontWeight: 600 }}>{app.status}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'fraud': {
        const flaggedVehicles = vehicles.filter(v => {
          const now = new Date();
          const pExp = v.pucExpiry ? new Date(v.pucExpiry) : null;
          const iExp = v.insuranceExpiry ? new Date(v.insuranceExpiry) : null;
          const matchesSearch = v.rcNumber?.toLowerCase().includes(searchTerm.toLowerCase()) || v.owner?.fullName?.toLowerCase().includes(searchTerm.toLowerCase());
          const isFlagged = (!v.documents || v.documents.length === 0) || (pExp && pExp < now) || (iExp && iExp < now);
          return isFlagged && matchesSearch;
        });

        return (
          <div className="glass-panel" style={{ padding: '2rem', minHeight: '60vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <AlertTriangle color="var(--status-danger)" /> Fraud & Compliance Detection
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '0.5rem 1rem', width: '300px' }}>
                <Search size={18} color="var(--text-muted)" style={{ marginRight: '0.5rem' }} />
                <input 
                  type="text" 
                  placeholder="Search by RC or Name..." 
                  value={searchTerm} 
                  onChange={e => setSearchTerm(e.target.value)} 
                  style={{ border: 'none', background: 'transparent', color: 'var(--text-primary)', outline: 'none', width: '100%' }} 
                />
              </div>
            </div>
            {flaggedVehicles.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No flagged vehicles found. All compliant!</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {flaggedVehicles.map(v => {
                  const now = new Date();
                  const pExp = v.pucExpiry ? new Date(v.pucExpiry) : null;
                  const iExp = v.insuranceExpiry ? new Date(v.insuranceExpiry) : null;
                  let reasons = [];
                  if (!v.documents || v.documents.length === 0) reasons.push('Missing Documents');
                  if (pExp && pExp < now) reasons.push('Expired PUC');
                  if (iExp && iExp < now) reasons.push('Expired Insurance');

                  return (
                    <div key={v._id} style={{ padding: '1.5rem', borderRadius: '16px', background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--status-danger)' }}>{v.rcNumber} - {v.owner?.fullName}</h4>
                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Flags: <strong>{reasons.join(', ')}</strong></p>
                      </div>
                      <button onClick={() => { setActiveSection('database'); setAlertForm({ vehicleId: v._id, type: 'Document', message: `Please resolve: ${reasons.join(', ')}` }); }} style={{ padding: '0.5rem 1rem', background: 'var(--status-danger)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Action</button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      }

      case 'permits': {
        const permitApps = applications.filter(a => 
          (a.type === 'Commercial Permit' || a.type === 'Ownership Transfer') &&
          (a.appId?.toLowerCase().includes(searchTerm.toLowerCase()) || 
           a.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
           a.details?.rcNumber?.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        return (
          <div className="glass-panel" style={{ padding: '2rem', minHeight: '60vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <FileSignature color="var(--accent-primary)" /> Permit & Transfer Requests
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '0.5rem 1rem', width: '300px' }}>
                <Search size={18} color="var(--text-muted)" style={{ marginRight: '0.5rem' }} />
                <input 
                  type="text" 
                  placeholder="Search App ID, Name, or RC..." 
                  value={searchTerm} 
                  onChange={e => setSearchTerm(e.target.value)} 
                  style={{ border: 'none', background: 'transparent', color: 'var(--text-primary)', outline: 'none', width: '100%' }} 
                />
              </div>
            </div>
            {permitApps.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No pending permit applications.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {permitApps.map(app => (
                  <div key={app._id} style={{ display: 'flex', alignItems: 'center', padding: '1.25rem', borderRadius: '16px', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <span style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>{app.appId}</span>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>• {app.user?.fullName}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: '0.9rem' }}>{app.type}</p>
                      {app.details?.rcNumber && <p style={{ margin: '0.25rem 0 0 0', color: 'var(--accent-primary)', fontSize: '0.85rem', fontWeight: 600 }}>Vehicle: {app.details.rcNumber}</p>}
                    </div>
                    {app.status === 'Pending' ? (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => handleStatusUpdate(app._id, 'Approved', 'Permit Granted')} style={{ padding: '0.5rem 1rem', borderRadius: '8px', background: 'var(--status-success)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Grant</button>
                        <button onClick={() => handleStatusUpdate(app._id, 'Rejected', 'Permit Denied')} style={{ padding: '0.5rem 1rem', borderRadius: '8px', background: 'var(--status-danger)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Deny</button>
                      </div>
                    ) : (
                      <span style={{ padding: '0.35rem 1rem', borderRadius: '99px', background: app.status === 'Approved' ? 'var(--status-success)20' : 'var(--status-danger)20', color: app.status === 'Approved' ? 'var(--status-success)' : 'var(--status-danger)', fontWeight: 600 }}>{app.status}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      }

      case 'settings':
        return (
          <div className="glass-panel" style={{ padding: '2rem', minHeight: '60vh' }}>
            <h2 style={{ margin: 0, marginBottom: '2rem' }}>Account Settings</h2>
            <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h4 style={{ margin: 0 }}>RTO Officer Profile</h4>
                {!isEditingProfile && (
                  <button onClick={() => setIsEditingProfile(true)} style={{ padding: '0.5rem 1rem', background: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Edit Profile</button>
                )}
              </div>
              
              {isEditingProfile ? (
                <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Full Name</label>
                    <input type="text" value={editProfileData.fullName} onChange={e => setEditProfileData({...editProfileData, fullName: e.target.value})} required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--bg-primary)' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Email Address</label>
                    <input type="email" value={editProfileData.email} onChange={e => setEditProfileData({...editProfileData, email: e.target.value})} required style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--bg-primary)' }} />
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button type="submit" style={{ padding: '0.75rem 1.5rem', background: 'var(--status-success)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Save</button>
                    <button type="button" onClick={() => { setIsEditingProfile(false); setEditProfileData({ fullName: userInfo.fullName, email: userInfo.email }); }} style={{ padding: '0.75rem 1.5rem', background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--glass-border)', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                  </div>
                </form>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <p style={{ margin: 0 }}><strong>Name:</strong> {userInfo.fullName}</p>
                  <p style={{ margin: 0 }}><strong>Email:</strong> {userInfo.email}</p>
                  <p style={{ margin: 0 }}><strong>Role:</strong> <span style={{ color: 'var(--status-danger)', fontWeight: 600 }}>{userInfo.role}</span></p>
                </div>
              )}
            </div>
          </div>
        );

      case 'database':
        const filteredDatabaseVehicles = vehicles.filter(v => 
          v.rcNumber?.toLowerCase().includes(searchTerm.toLowerCase()) || 
          v.owner?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          v.make?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          v.model?.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return (
          <div className="glass-panel" style={{ padding: '2rem', minHeight: '60vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h2 style={{ margin: 0 }}>Vehicle Database</h2>
              <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '0.5rem 1rem', width: '300px' }}>
                <Search size={18} color="var(--text-muted)" style={{ marginRight: '0.5rem' }} />
                <input 
                  type="text" 
                  placeholder="Search RC, Name, Make, or Model..." 
                  value={searchTerm} 
                  onChange={e => setSearchTerm(e.target.value)} 
                  style={{ border: 'none', background: 'transparent', color: 'var(--text-primary)', outline: 'none', width: '100%' }} 
                />
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filteredDatabaseVehicles.map(v => (
                <div key={v._id} style={{ padding: '1.5rem', borderRadius: '16px', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => setExpandedVehicleId(expandedVehicleId === v._id ? null : v._id)}>
                    <div>
                      <h3 style={{ margin: 0, color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {v.rcNumber}
                        {expandedVehicleId === v._id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </h3>
                      <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-muted)' }}>{v.make} {v.model} ({v.year}) - Owner: {v.owner?.fullName}</p>
                    </div>
                    <span style={{ padding: '0.25rem 0.75rem', borderRadius: '99px', background: 'var(--status-success)20', color: 'var(--status-success)', fontSize: '0.75rem', fontWeight: 600 }}>{v.status}</span>
                  </div>

                  {expandedVehicleId === v._id && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ overflow: 'hidden' }}>
                      <div style={{ padding: '1rem', background: 'var(--bg-primary)', borderRadius: '12px', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', marginBottom: '1rem', marginTop: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Fuel Type:</span>
                          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{v.fuelType}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Permit Scope:</span>
                          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{v.permitScope}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Insurance Expiry:</span>
                          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{v.insuranceExpiry ? new Date(v.insuranceExpiry).toLocaleDateString() : 'N/A'}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-muted)' }}>PUC Expiry:</span>
                          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{v.pucExpiry ? new Date(v.pucExpiry).toLocaleDateString() : 'N/A'}</span>
                        </div>
                      </div>

                      <div style={{ marginTop: '1rem', borderTop: '1px solid var(--glass-border)', paddingTop: '1rem' }}>
                        <h5 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-muted)' }}>Vehicle Documents</h5>
                        {v.documents && v.documents.length > 0 ? (
                          <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.85rem', marginBottom: '1rem' }}>
                            {v.documents.map(doc => (
                              <li key={doc._id}>
                                <a href={`http://localhost:5050${doc.url}`} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-primary)', textDecoration: 'none', fontWeight: 500 }}>
                                  {doc.docType} Document
                                </a>
                              </li>
                            ))}
                          </ul>
                        ) : <p style={{ fontSize: '0.85rem', margin: '0 0 1rem 0', color: 'var(--status-danger)' }}>No documents available.</p>}
                      </div>

                      <div style={{ marginTop: '1rem', background: 'var(--bg-primary)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                        <h5 style={{ margin: '0 0 1rem 0', color: 'var(--text-primary)' }}>Take Action</h5>
                        {alertForm.vehicleId === v._id ? (
                          <form onSubmit={(e) => handleSendAlert(e, v.owner._id)} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                            <select value={alertForm.type} onChange={e => setAlertForm({...alertForm, type: e.target.value})} style={{ flex: 1, minWidth: '150px', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
                              <option value="Insurance">Insurance Alert</option>
                              <option value="PUC">PUC Alert</option>
                              <option value="Document">Document Update</option>
                              <option value="Compliance">General Compliance</option>
                            </select>
                            <input type="text" placeholder="Message details..." required value={alertForm.message} onChange={e => setAlertForm({...alertForm, message: e.target.value})} style={{ flex: 2, minWidth: '200px', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }} />
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button type="submit" style={{ padding: '0.75rem 1.5rem', background: 'var(--status-danger)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Send Alert</button>
                              <button type="button" onClick={() => setAlertForm({ vehicleId: null, type: 'Insurance', message: '' })} style={{ padding: '0.75rem 1rem', background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--glass-border)', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                            </div>
                          </form>
                        ) : (
                          <button onClick={() => setAlertForm({ vehicleId: v._id, type: 'Insurance', message: '' })} style={{ padding: '0.75rem 1.5rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--status-danger)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <AlertTriangle size={18} /> Issue Warning Alert
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </div>
              ))}
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
    <Layout userInfo={userInfo} onLogout={onLogout} sidebarItems={sidebarItems} activeSection={activeSection} setActiveSection={setActiveSection} title="RTO Dashboard">
      {renderContent()}
    </Layout>
  );
};

export default RtoDashboard;
