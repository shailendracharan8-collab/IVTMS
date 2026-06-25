import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { 
  Home, FileText, Settings, Clock, 
  Car, Activity, FileCheck, Plus, Bell, AlertTriangle, Trash2, ChevronDown, ChevronUp, Search, Receipt
} from 'lucide-react';
import Layout from './layout/Layout';

const API_URL = 'http://localhost:5050/api';

const CitizenDashboard = ({ userInfo, onLogout }) => {
  const [activeSection, setActiveSection] = useState('overview');
  const [vehicles, setVehicles] = useState([]);
  const [applications, setApplications] = useState([]);
  const [challans, setChallans] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // Form states
  const [newVehicle, setNewVehicle] = useState({ rcNumber: '', make: '', model: '', year: '', fuelType: 'Petrol', permitScope: 'State' });
  const [newApp, setNewApp] = useState({ type: 'New Registration', vehicleId: '' });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editProfileData, setEditProfileData] = useState({ fullName: userInfo?.fullName, email: userInfo?.email });
  const [uploadDoc, setUploadDoc] = useState({ vehicleId: null, docType: 'RC', file: null });
  const [alerts, setAlerts] = useState([]);
  const [expandedVehicleId, setExpandedVehicleId] = useState(null);
  const [quickApp, setQuickApp] = useState({ vehicleId: null, type: 'Insurance Renewal' });

  const handleQuickApply = async (e, vehicleId) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const selectedVehicle = vehicles.find(v => v._id === vehicleId);
      
      const payload = { 
        type: quickApp.type,
        details: {
          vehicleId: selectedVehicle._id,
          rcNumber: selectedVehicle.rcNumber
        }
      };

      await axios.post(`${API_URL}/applications`, payload, config);
      fetchData();
      alert(`Application for ${quickApp.type} Submitted!`);
      setQuickApp({ vehicleId: null, type: 'Insurance Renewal' });
    } catch (error) {
      alert('Error submitting application');
    }
  };

  const handleRemoveVehicle = async (id) => {
    if (!window.confirm('Are you sure you want to permanently remove this vehicle?')) return;
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.delete(`${API_URL}/vehicles/${id}`, config);
      fetchData();
      alert('Vehicle removed successfully!');
    } catch (error) {
      alert('Error removing vehicle');
    }
  };

  const handleUploadDocument = async (e, vehicleId) => {
    e.preventDefault();
    if (!uploadDoc.file) return alert('Please select a file');
    
    const formData = new FormData();
    formData.append('document', uploadDoc.file);
    formData.append('docType', uploadDoc.docType);

    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}`, 'Content-Type': 'multipart/form-data' } };
      await axios.post(`${API_URL}/vehicles/${vehicleId}/documents`, formData, config);
      fetchData();
      setUploadDoc({ vehicleId: null, docType: 'RC', file: null });
      alert('Document Uploaded Successfully!');
    } catch (error) {
      alert('Error uploading document');
    }
  };

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

  const handleDismissAlert = async (alertId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.put(`${API_URL}/alerts/${alertId}/read`, {}, config);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'vehicles', label: 'My Vehicles', icon: Car },
    { id: 'applications', label: 'Applications', icon: FileText },
    { id: 'challans', label: 'My Challans', icon: Receipt },
    { id: 'alerts', label: 'Alerts', icon: Bell },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      
      const [vehRes, appRes, alertRes, challanRes] = await Promise.all([
        axios.get(`${API_URL}/vehicles/my`, config),
        axios.get(`${API_URL}/applications/my`, config),
        axios.get(`${API_URL}/alerts/my`, config).catch(() => ({ data: [] })),
        axios.get(`${API_URL}/challans/my`, config)
      ]);
      
      setVehicles(vehRes.data);
      setApplications(appRes.data);
      setAlerts(alertRes.data || []);
      setChallans(challanRes.data);
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddVehicle = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.post(`${API_URL}/vehicles`, newVehicle, config);
      fetchData();
      setNewVehicle({ rcNumber: '', make: '', model: '', year: '', fuelType: 'Petrol', permitScope: 'State' });
      alert('Vehicle Added Successfully!');
    } catch (error) {
      alert('Error adding vehicle');
    }
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      
      const payload = { type: newApp.type };
      
      if (newApp.type !== 'New Registration') {
        if (!newApp.vehicleId) return alert('Please select a registered vehicle.');
        const selectedVehicle = vehicles.find(v => v._id === newApp.vehicleId);
        payload.details = {
          vehicleId: selectedVehicle._id,
          rcNumber: selectedVehicle.rcNumber
        };
      }

      await axios.post(`${API_URL}/applications`, payload, config);
      fetchData();
      alert('Application Submitted!');
      setNewApp({ type: 'New Registration', vehicleId: '' });
    } catch (error) {
      alert('Error submitting application');
    }
  };

  const handlePayChallan = async (challanId) => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.put(`${API_URL}/challans/${challanId}/pay`, {}, config);
      fetchData();
      alert('Challan Paid Successfully!');
    } catch (error) {
      alert('Error paying challan');
    }
  };

  const kpis = [
    { title: 'Registered Vehicles', value: vehicles.length, icon: Car, color: 'var(--accent-primary)' },
    { title: 'Pending Applications', value: applications.filter(a => a.status === 'Pending').length, icon: Clock, color: 'var(--status-warning)' },
    { title: 'Unpaid Fines', value: challans.filter(c => c.status === 'Unpaid').length, icon: Receipt, color: 'var(--status-danger)' },
  ];

  const renderContent = () => {
    if (loading) return <div style={{ padding: '3rem', textAlign: 'center' }}>Loading your data...</div>;

    switch (activeSection) {
      case 'overview':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {alerts && alerts.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {alerts.map(alert => (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} key={alert._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem', background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '12px', color: 'var(--text-primary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <AlertTriangle color="var(--status-danger)" size={24} />
                      <div>
                        <h4 style={{ margin: 0, color: 'var(--status-danger)' }}>ACTION REQUIRED: {alert.type} Update</h4>
                        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.9rem' }}>{alert.message} (Vehicle: {alert.vehicle?.rcNumber})</p>
                      </div>
                    </div>
                    <button onClick={() => handleDismissAlert(alert._id)} style={{ padding: '0.5rem 1rem', background: 'var(--status-danger)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Dismiss</button>
                  </motion.div>
                ))}
              </div>
            )}
            
            {/* KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
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
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 0.25rem 0', fontWeight: 600 }}>{kpi.title}</p>
                    <h3 style={{ margin: 0, fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>{kpi.value}</h3>
                  </div>
                </motion.div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
              
              {/* Add Vehicle Section */}
              <motion.div className="glass-panel" style={{ padding: '2rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--accent-primary)' }}>Register New Vehicle</h3>
                <form onSubmit={handleAddVehicle} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '12px' }}>
                  <input type="text" placeholder="Vehicle No. (e.g. MH12AB1234)" required value={newVehicle.rcNumber} onChange={e => setNewVehicle({...newVehicle, rcNumber: e.target.value})} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }} />
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <input type="text" placeholder="Make (e.g. Honda)" required value={newVehicle.make} onChange={e => setNewVehicle({...newVehicle, make: e.target.value})} style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }} />
                    <input type="text" placeholder="Model (e.g. City)" required value={newVehicle.model} onChange={e => setNewVehicle({...newVehicle, model: e.target.value})} style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }} />
                  </div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <input type="number" placeholder="Year" required value={newVehicle.year} onChange={e => setNewVehicle({...newVehicle, year: e.target.value})} style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }} />
                    <select value={newVehicle.fuelType} onChange={e => setNewVehicle({...newVehicle, fuelType: e.target.value})} style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                      <option value="Petrol">Petrol</option>
                      <option value="Diesel">Diesel</option>
                      <option value="EV">EV</option>
                    </select>
                  </div>
                  <select value={newVehicle.permitScope} onChange={e => setNewVehicle({...newVehicle, permitScope: e.target.value})} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                    <option value="State">State Only Permit</option>
                    <option value="All India">All India Permit</option>
                  </select>
                  <button type="submit" style={{ padding: '0.75rem', background: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}><Plus size={18} /> Add Vehicle</button>
                </form>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '2rem 0 1rem 0' }}>
                  <h3 style={{ margin: 0, fontSize: '1.25rem' }}>My Garage ({vehicles.length})</h3>
                  <button onClick={() => setActiveSection('vehicles')} style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', fontWeight: 600 }}>View All</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {vehicles.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>No vehicles found.</p> : vehicles.slice(0, 3).map(v => (
                    <div key={v._id} style={{ padding: '1rem', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '40px', height: '40px', background: 'var(--bg-primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Car size={20} color="var(--accent-primary)" /></div>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: 0 }}>{v.rcNumber}</h4>
                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>{v.make} {v.model} ({v.year})</p>
                      </div>
                      <span style={{ padding: '0.25rem 0.75rem', borderRadius: '99px', background: 'var(--status-success)20', color: 'var(--status-success)', fontSize: '0.75rem', fontWeight: 600 }}>{v.status}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Applications Section */}
              <motion.div className="glass-panel" style={{ padding: '2rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', marginBottom: '1.5rem', color: 'var(--status-warning)' }}>Submit RTO Application</h3>
                
                <form onSubmit={handleSubmitApplication} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem' }}>
                  <select value={newApp.type} onChange={e => setNewApp({...newApp, type: e.target.value})} style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                    <option value="New Registration">New Registration</option>
                    <option value="Ownership Transfer">Ownership Transfer</option>
                    <option value="PUC Renewal">PUC Renewal</option>
                    <option value="Commercial Permit">Commercial Permit</option>
                    <option value="Insurance Renewal">Insurance Renewal</option>
                  </select>
                  
                  {newApp.type !== 'New Registration' && (
                    <select value={newApp.vehicleId} onChange={e => setNewApp({...newApp, vehicleId: e.target.value})} required style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                      <option value="" disabled>Select a Registered Vehicle</option>
                      {vehicles.map(v => (
                        <option key={v._id} value={v._id}>{v.rcNumber} - {v.make} {v.model}</option>
                      ))}
                    </select>
                  )}

                  <button type="submit" style={{ padding: '0.75rem', background: 'var(--status-warning)', color: 'black', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}><FileCheck size={18} /> Submit to RTO</button>
                </form>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Application Status ({applications.length})</h3>
                  <button onClick={() => setActiveSection('applications')} style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', fontWeight: 600 }}>View All</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {applications.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>No applications submitted.</p> : applications.slice(0, 3).map(app => (
                    <div key={app._id} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '1rem', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h4 style={{ margin: 0, fontSize: '1rem' }}>{app.appId}</h4>
                        <span style={{ padding: '0.25rem 0.75rem', borderRadius: '99px', background: app.status === 'Approved' ? 'var(--status-success)20' : app.status === 'Rejected' ? 'var(--status-danger)20' : 'var(--status-warning)20', color: app.status === 'Approved' ? 'var(--status-success)' : app.status === 'Rejected' ? 'var(--status-danger)' : 'var(--status-warning)', fontSize: '0.75rem', fontWeight: 600 }}>{app.status}</span>
                      </div>
                      <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Type: {app.type}</p>
                      {app.details?.rcNumber && <p style={{ margin: 0, color: 'var(--text-primary)', fontSize: '0.85rem' }}>Vehicle: <strong>{app.details.rcNumber}</strong></p>}
                      <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.8rem' }}>Submitted: {new Date(app.createdAt).toLocaleDateString()}</p>
                      {app.remarks && <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: 'var(--bg-primary)', borderRadius: '6px', fontSize: '0.85rem' }}><strong>RTO Remark:</strong> {app.remarks}</div>}
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        );

      case 'vehicles':
        const filteredVehicles = vehicles.filter(v => 
          v.rcNumber?.toLowerCase().includes(searchTerm.toLowerCase()) || 
          v.make?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          v.model?.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return (
          <div className="glass-panel" style={{ padding: '2rem', minHeight: '60vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h2 style={{ margin: 0 }}>All Registered Vehicles</h2>
              <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '0.5rem 1rem', width: '300px' }}>
                <Search size={18} color="var(--text-muted)" style={{ marginRight: '0.5rem' }} />
                <input 
                  type="text" 
                  placeholder="Search RC, Make, or Model..." 
                  value={searchTerm} 
                  onChange={e => setSearchTerm(e.target.value)} 
                  style={{ border: 'none', background: 'transparent', color: 'var(--text-primary)', outline: 'none', width: '100%' }} 
                />
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {filteredVehicles.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>No vehicles found.</p> : filteredVehicles.map((v) => (
                <div key={v._id} style={{ padding: '1.5rem', borderRadius: '20px', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '1rem', transition: 'all 0.3s ease' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }} onClick={() => setExpandedVehicleId(expandedVehicleId === v._id ? null : v._id)}>
                    <div>
                      <h3 style={{ margin: 0, color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {v.rcNumber}
                        {expandedVehicleId === v._id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </h3>
                      <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>{v.make} {v.model} ({v.year}) - {v.fuelType}</p>
                    </div>
                    <span style={{ padding: '0.25rem 0.75rem', borderRadius: '99px', background: 'var(--status-success)20', color: 'var(--status-success)', fontSize: '0.75rem', fontWeight: 600 }}>{v.status}</span>
                  </div>

                  {/* Expanded Details Section */}
                  {expandedVehicleId === v._id && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ overflow: 'hidden' }}>
                      <div style={{ padding: '1rem', background: 'var(--bg-primary)', borderRadius: '12px', border: '1px solid var(--glass-border)', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Owner:</span>
                          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{userInfo.fullName}</span>
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
                                <span style={{ color: 'var(--text-muted)', marginLeft: '0.5rem', fontSize: '0.75rem' }}>({new Date(doc.uploadedAt).toLocaleDateString()})</span>
                              </li>
                            ))}
                          </ul>
                        ) : <p style={{ fontSize: '0.85rem', margin: '0 0 1rem 0', color: 'var(--text-muted)' }}>No documents uploaded yet.</p>}
                        
                        {uploadDoc.vehicleId === v._id ? (
                          <form onSubmit={(e) => handleUploadDocument(e, v._id)} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', background: 'var(--bg-primary)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
                            <select value={uploadDoc.docType} onChange={e => setUploadDoc({...uploadDoc, docType: e.target.value})} style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
                              <option value="RC">Registration Certificate (RC)</option>
                              <option value="Insurance">Insurance Policy</option>
                              <option value="PUC">PUC Certificate</option>
                              <option value="Other">Other Document</option>
                            </select>
                            <input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={e => setUploadDoc({...uploadDoc, file: e.target.files[0]})} required style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }} />
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button type="submit" style={{ flex: 1, padding: '0.5rem', background: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 600 }}>Upload</button>
                              <button type="button" onClick={() => setUploadDoc({ vehicleId: null, docType: 'RC', file: null })} style={{ padding: '0.5rem', background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--glass-border)', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
                            </div>
                          </form>
                        ) : (
                          <button onClick={() => setUploadDoc({ vehicleId: v._id, docType: 'RC', file: null })} style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FileCheck size={16} /> Add Document</button>
                        )}
                      </div>

                      {/* Quick Apply Section */}
                      <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--bg-primary)', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                        <h5 style={{ margin: '0 0 1rem 0', color: 'var(--accent-primary)', fontSize: '1rem' }}>Quick Apply</h5>
                        {quickApp.vehicleId === v._id ? (
                          <form onSubmit={(e) => handleQuickApply(e, v._id)} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                            <select value={quickApp.type} onChange={e => setQuickApp({...quickApp, type: e.target.value})} style={{ flex: 1, minWidth: '150px', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
                              <option value="Ownership Transfer">Ownership Transfer</option>
                              <option value="PUC Renewal">PUC Renewal</option>
                              <option value="Commercial Permit">Commercial Permit</option>
                              <option value="Insurance Renewal">Insurance Renewal</option>
                            </select>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button type="submit" style={{ padding: '0.75rem 1.5rem', background: 'var(--status-warning)', color: 'black', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Submit</button>
                              <button type="button" onClick={() => setQuickApp({ vehicleId: null, type: 'Insurance Renewal' })} style={{ padding: '0.75rem 1rem', background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--glass-border)', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                            </div>
                          </form>
                        ) : (
                          <button onClick={() => setQuickApp({ vehicleId: v._id, type: 'Insurance Renewal' })} style={{ width: '100%', padding: '0.75rem 1.5rem', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--status-warning)', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            <FileCheck size={18} /> Apply for RTO Services
                          </button>
                        )}
                      </div>

                      {/* Remove Button */}
                      <button onClick={() => handleRemoveVehicle(v._id)} style={{ marginTop: '1rem', width: '100%', padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--status-danger)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        <Trash2 size={16} /> Remove Vehicle
                      </button>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'applications':
        const filteredApps = applications.filter(a => 
          a.appId?.toLowerCase().includes(searchTerm.toLowerCase()) || 
          a.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
                  placeholder="Search App ID, Type, or RC..." 
                  value={searchTerm} 
                  onChange={e => setSearchTerm(e.target.value)} 
                  style={{ border: 'none', background: 'transparent', color: 'var(--text-primary)', outline: 'none', width: '100%' }} 
                />
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filteredApps.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>No applications found.</p> : filteredApps.map(app => (
                <div key={app._id} style={{ display: 'flex', alignItems: 'center', padding: '1.25rem', borderRadius: '16px', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)' }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 0.25rem 0' }}>{app.appId} <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>- {app.type}</span></h4>
                    {app.details?.rcNumber && <p style={{ margin: '0 0 0.25rem 0', color: 'var(--text-primary)', fontSize: '0.85rem' }}>Vehicle: <strong>{app.details.rcNumber}</strong></p>}
                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Submitted: {new Date(app.createdAt).toLocaleString()}</p>
                    {app.remarks && <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.85rem', color: 'var(--status-info)' }}>Remark: {app.remarks}</p>}
                  </div>
                  <span style={{ padding: '0.35rem 1rem', borderRadius: '99px', background: app.status === 'Approved' ? 'var(--status-success)20' : app.status === 'Rejected' ? 'var(--status-danger)20' : 'var(--status-warning)20', color: app.status === 'Approved' ? 'var(--status-success)' : app.status === 'Rejected' ? 'var(--status-danger)' : 'var(--status-warning)', fontWeight: 600 }}>{app.status}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'challans':
        const filteredChallans = challans.filter(c => 
          c.challanId?.toLowerCase().includes(searchTerm.toLowerCase()) || 
          c.vehicle?.rcNumber?.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return (
          <div className="glass-panel" style={{ padding: '2rem', minHeight: '60vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h2 style={{ margin: 0 }}>My Challans & Fines</h2>
              <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '0.5rem 1rem', width: '300px' }}>
                <Search size={18} color="var(--text-muted)" style={{ marginRight: '0.5rem' }} />
                <input 
                  type="text" 
                  placeholder="Search Challan ID or RC..." 
                  value={searchTerm} 
                  onChange={e => setSearchTerm(e.target.value)} 
                  style={{ border: 'none', background: 'transparent', color: 'var(--text-primary)', outline: 'none', width: '100%' }} 
                />
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filteredChallans.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>No challans found. You are all clear!</p> : filteredChallans.map(ch => (
                <div key={ch._id} style={{ display: 'flex', alignItems: 'center', padding: '1.25rem', borderRadius: '16px', background: ch.status === 'Unpaid' ? 'rgba(239, 68, 68, 0.05)' : 'var(--bg-secondary)', border: ch.status === 'Unpaid' ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid var(--glass-border)' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', color: 'var(--text-primary)' }}>{ch.challanId}</span>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>• {new Date(ch.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)' }}>Violation: <strong>{ch.reason}</strong></p>
                    {ch.vehicle?.rcNumber && <p style={{ margin: '0.25rem 0 0 0', color: 'var(--accent-primary)', fontSize: '0.85rem', fontWeight: 600 }}>Vehicle: {ch.vehicle.rcNumber}</p>}
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Fine Amount</p>
                      <h4 style={{ margin: 0, fontSize: '1.25rem', color: ch.status === 'Unpaid' ? 'var(--status-danger)' : 'var(--text-primary)' }}>₹{ch.amount}</h4>
                    </div>
                    {ch.status === 'Unpaid' ? (
                      <button onClick={() => handlePayChallan(ch._id)} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', background: 'var(--accent-primary)', color: 'white', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Pay Now</button>
                    ) : (
                      <span style={{ padding: '0.35rem 1rem', borderRadius: '99px', background: 'var(--status-success)20', color: 'var(--status-success)', fontWeight: 600 }}>Paid</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'alerts':
        return (
          <div className="glass-panel" style={{ padding: '2rem', minHeight: '60vh' }}>
            <h2 style={{ margin: 0, marginBottom: '2rem' }}>My Alerts & Notifications</h2>
            {alerts && alerts.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {alerts.map(alert => (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} key={alert._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                      <div style={{ padding: '1rem', background: 'var(--status-danger)', borderRadius: '12px', color: 'white' }}>
                        <AlertTriangle size={24} />
                      </div>
                      <div>
                        <h3 style={{ margin: 0, color: 'var(--status-danger)' }}>ACTION REQUIRED: {alert.type}</h3>
                        <p style={{ margin: '0.5rem 0', fontSize: '1rem', color: 'var(--text-primary)' }}>{alert.message}</p>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Vehicle Affected: <strong style={{ color: 'var(--accent-primary)' }}>{alert.vehicle?.rcNumber}</strong></p>
                      </div>
                    </div>
                    <button onClick={() => handleDismissAlert(alert._id)} style={{ padding: '0.75rem 1.5rem', background: 'var(--status-danger)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Dismiss Alert</button>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '40vh', gap: '1rem' }}>
                <CheckCircle size={64} color="var(--status-success)" style={{ opacity: 0.5 }} />
                <h3 style={{ margin: 0, color: 'var(--text-muted)' }}>You're all caught up!</h3>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.9rem' }}>You have no pending alerts from the RTO.</p>
              </div>
            )}
          </div>
        );

      case 'settings':
        return (
          <div className="glass-panel" style={{ padding: '2rem', minHeight: '60vh' }}>
            <h2 style={{ margin: 0, marginBottom: '2rem' }}>Account Settings</h2>
            <p style={{ color: 'var(--text-muted)' }}>Update your personal profile, notification preferences, and security settings here.</p>
            <div style={{ marginTop: '2rem', background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h4 style={{ margin: 0 }}>Profile Information</h4>
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
                  <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>Role (Unchangeable)</label>
                    <input type="text" value={userInfo.role} disabled style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--bg-primary)', opacity: 0.6 }} />
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                    <button type="submit" style={{ padding: '0.75rem 1.5rem', background: 'var(--status-success)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Save Changes</button>
                    <button type="button" onClick={() => { setIsEditingProfile(false); setEditProfileData({ fullName: userInfo.fullName, email: userInfo.email }); }} style={{ padding: '0.75rem 1.5rem', background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--glass-border)', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Cancel</button>
                  </div>
                </form>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <p style={{ margin: 0 }}><strong>Name:</strong> {userInfo.fullName}</p>
                  <p style={{ margin: 0 }}><strong>Email:</strong> {userInfo.email}</p>
                  <p style={{ margin: 0 }}><strong>Role:</strong> <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>{userInfo.role}</span></p>
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
    <Layout 
      userInfo={userInfo} 
      onLogout={onLogout} 
      sidebarItems={sidebarItems} 
      activeSection={activeSection} 
      setActiveSection={setActiveSection} 
      title="Citizen Dashboard"
      notificationsCount={alerts.length}
      onNotificationClick={() => setActiveSection('alerts')}
    >
      {renderContent()}
    </Layout>
  );
};

export default CitizenDashboard;
