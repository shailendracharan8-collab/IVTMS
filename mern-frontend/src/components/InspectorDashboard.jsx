import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { 
  Activity, Clock, BarChart2, ShieldCheck, 
  Settings, CheckCircle, AlertOctagon, Terminal, PlayCircle,
  Search, FileText, ChevronDown, ChevronUp, AlertCircle
} from 'lucide-react';
import Layout from './layout/Layout';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050/api';

const InspectorDashboard = ({ userInfo, onLogout }) => {
  const [activeSection, setActiveSection] = useState('test');
  const [rcInput, setRcInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [challans, setChallans] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [expandedVehicleId, setExpandedVehicleId] = useState(null);
  const [manualChallanForm, setManualChallanForm] = useState({ vehicleId: null, reason: '', amount: '' });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editProfileData, setEditProfileData] = useState({ fullName: userInfo?.fullName, email: userInfo?.email });

  const sidebarItems = [
    { id: 'test', label: 'Live Test', icon: Activity },
    { id: 'database', label: 'Vehicle Database', icon: Search },
    { id: 'history', label: 'Challan History', icon: Clock },
    { id: 'stats', label: 'Performance', icon: BarChart2 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const fetchData = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const [chRes, vehRes] = await Promise.all([
        axios.get(`${API_URL}/challans`, config),
        axios.get(`${API_URL}/vehicles`, config)
      ]);
      setChallans(chRes.data);
      setVehicles(vehRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
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

  const handleManualChallan = async (e, rcNumber) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/challans`, {
        rcNumber,
        reason: manualChallanForm.reason,
        amount: Number(manualChallanForm.amount)
      }, {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      alert('Manual Challan Issued!');
      setManualChallanForm({ vehicleId: null, reason: '', amount: '' });
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error issuing challan');
    }
  };

  const handleGenerateCertificate = async () => {
    try {
      await axios.put(`${API_URL}/vehicles/puc/${scanResult.rc}`, {}, {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      alert('Certificate Generated! PUC Extended by 6 Months.');
      fetchData();
      setScanResult(null);
      setRcInput('');
    } catch (error) {
      alert(error.response?.data?.message || 'Error generating certificate');
    }
  };

  const handleScan = async () => {
    if (!rcInput) return;
    setIsScanning(true);
    setScanResult(null);
    
    // Simulate scan delay
    setTimeout(async () => {
      setIsScanning(false);
      // Let's assume high CO means fail
      const coVal = (Math.random() * 2).toFixed(2);
      const isFail = parseFloat(coVal) > 1.2;

      setScanResult({
        rc: rcInput,
        fuel: 'Petrol',
        co: coVal,
        hc: Math.floor(Math.random() * 800),
        status: isFail ? 'Fail' : 'Pass',
        isFail
      });
    }, 1500);
  };

  const handleIssueChallan = async () => {
    try {
      await axios.post(`${API_URL}/challans`, {
        rcNumber: scanResult.rc,
        reason: 'Emission test failed (High CO/HC levels)',
        amount: 1500
      }, {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      alert('Challan Issued Successfully!');
      fetchData();
      setScanResult(null);
      setRcInput('');
    } catch (error) {
      alert(error.response?.data?.message || 'Error issuing challan');
    }
  };

  const kpis = [
    { title: 'Challans Issued', value: challans.length, icon: AlertOctagon, color: 'var(--status-danger)' },
    { title: 'Revenue (Fines)', value: `₹${challans.reduce((a, c) => a + c.amount, 0)}`, icon: Activity, color: 'var(--status-info)' },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'test':
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                  <Terminal color="var(--accent-primary)" size={28} />
                  <h3 style={{ margin: 0, fontSize: '1.25rem' }}>Emission Protocol Scanner</h3>
                </div>
                
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                  <input type="text" placeholder="Enter RC Number (e.g., MH12AB1234)" value={rcInput} onChange={(e) => setRcInput(e.target.value.toUpperCase())} style={{ flex: 1, padding: '1rem', borderRadius: '12px', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', color: 'var(--text-primary)', outline: 'none', fontSize: '1rem', textTransform: 'uppercase' }} />
                  <button onClick={handleScan} disabled={isScanning || !rcInput} style={{ background: 'var(--accent-primary)', color: 'white', border: 'none', padding: '0 2rem', borderRadius: '12px', fontWeight: 600, cursor: isScanning || !rcInput ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: isScanning || !rcInput ? 0.7 : 1 }}>
                    {isScanning ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}><Activity size={20} /></motion.div> : <PlayCircle size={20} />}
                    {isScanning ? 'Analyzing...' : 'Analyze'}
                  </button>
                </div>

                {scanResult && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ background: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--glass-border)', overflow: 'hidden' }}>
                    <div style={{ padding: '1.5rem', background: scanResult.isFail ? 'var(--status-danger)15' : 'var(--status-success)15', borderBottom: '1px solid var(--glass-border)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '1.2rem', fontFamily: 'JetBrains Mono, monospace' }}>{scanResult.rc}</h4>
                        </div>
                        <span style={{ padding: '0.35rem 1rem', borderRadius: '99px', background: scanResult.isFail ? 'var(--status-danger)' : 'var(--status-success)', color: 'white', fontWeight: 700, fontSize: '0.85rem' }}>{scanResult.status}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', padding: '1.5rem', gap: '2rem' }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 600 }}>CO (% vol)</p>
                        <h3 style={{ margin: 0, fontSize: '1.5rem', fontFamily: 'JetBrains Mono, monospace', color: scanResult.isFail ? 'var(--status-danger)' : 'inherit' }}>{scanResult.co}</h3>
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 600 }}>HC (ppm)</p>
                        <h3 style={{ margin: 0, fontSize: '1.5rem', fontFamily: 'JetBrains Mono, monospace' }}>{scanResult.hc}</h3>
                      </div>
                    </div>
                    
                    {scanResult.isFail ? (
                      <button onClick={handleIssueChallan} style={{ width: '100%', padding: '1rem', background: 'var(--status-danger)', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        <AlertOctagon size={20} /> Issue Fine (₹1500)
                      </button>
                    ) : (
                       <button onClick={handleGenerateCertificate} style={{ width: '100%', padding: '1rem', background: 'var(--accent-primary)', color: 'white', border: 'none', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        <CheckCircle size={20} /> Generate Certificate
                      </button>
                    )}
                  </motion.div>
                )}
              </motion.div>

              <motion.div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', marginBottom: '1.5rem' }}>Recent Challans Issued</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
                  {challans.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>No challans issued.</p> : challans.slice(0, 3).map((ch) => (
                    <div key={ch._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', borderRadius: '16px', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)' }}>
                      <div>
                        <h4 style={{ margin: 0, fontFamily: 'JetBrains Mono, monospace', fontSize: '1rem' }}>{ch.challanId}</h4>
                        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.8rem' }}>RC: {ch.vehicle?.rcNumber}</p>
                      </div>
                      <span style={{ padding: '0.25rem 0.75rem', borderRadius: '99px', background: ch.status === 'Paid' ? 'var(--status-success)20' : 'var(--status-danger)20', color: ch.status === 'Paid' ? 'var(--status-success)' : 'var(--status-danger)', fontSize: '0.75rem', fontWeight: 700 }}>{ch.status}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
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
              <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Search color="var(--accent-primary)" /> Vehicle Database</h2>
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

                      <div style={{ marginTop: '1rem', background: 'rgba(239, 68, 68, 0.05)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                        <h5 style={{ margin: '0 0 1rem 0', color: 'var(--status-danger)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><AlertOctagon size={18} /> Issue Manual Challan</h5>
                        {manualChallanForm.vehicleId === v._id ? (
                          <form onSubmit={(e) => handleManualChallan(e, v.rcNumber)} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                            <input type="text" placeholder="Reason (e.g., No Helmet)" required value={manualChallanForm.reason} onChange={e => setManualChallanForm({...manualChallanForm, reason: e.target.value})} style={{ flex: 2, minWidth: '200px', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }} />
                            <input type="number" placeholder="Amount (₹)" required value={manualChallanForm.amount} onChange={e => setManualChallanForm({...manualChallanForm, amount: e.target.value})} style={{ flex: 1, minWidth: '100px', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--bg-primary)', color: 'var(--text-primary)' }} />
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button type="submit" style={{ padding: '0.75rem 1.5rem', background: 'var(--status-danger)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Submit Fine</button>
                              <button type="button" onClick={() => setManualChallanForm({ vehicleId: null, reason: '', amount: '' })} style={{ padding: '0.75rem 1rem', background: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--glass-border)', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
                            </div>
                          </form>
                        ) : (
                          <button onClick={() => setManualChallanForm({ vehicleId: v._id, reason: '', amount: '' })} style={{ padding: '0.75rem 1.5rem', background: 'var(--status-danger)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
                            Create Challan
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

      case 'history':
        const filteredChallans = challans.filter(c => 
          c.challanId?.toLowerCase().includes(searchTerm.toLowerCase()) || 
          c.vehicle?.rcNumber?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return (
          <div className="glass-panel" style={{ padding: '2rem', minHeight: '60vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Clock color="var(--accent-primary)" /> Complete Challan History</h2>
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
              {filteredChallans.length === 0 ? <p style={{ color: 'var(--text-muted)' }}>No challans found.</p> : filteredChallans.map(ch => (
                <div key={ch._id} style={{ padding: '1.5rem', borderRadius: '16px', background: 'var(--bg-secondary)', border: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: '0 0 0.5rem 0', fontFamily: 'JetBrains Mono, monospace', fontSize: '1.1rem', color: 'var(--text-primary)' }}>{ch.challanId}</h4>
                    <p style={{ margin: 0, color: 'var(--text-muted)' }}>Vehicle: <strong style={{ color: 'var(--accent-primary)' }}>{ch.vehicle?.rcNumber}</strong></p>
                    <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Reason: {ch.reason}</p>
                    <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-muted)', fontSize: '0.8rem' }}>Issued on: {new Date(ch.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--status-danger)' }}>₹{ch.amount}</h3>
                    <span style={{ padding: '0.35rem 1rem', borderRadius: '99px', background: ch.status === 'Paid' ? 'var(--status-success)20' : 'var(--status-warning)20', color: ch.status === 'Paid' ? 'var(--status-success)' : 'var(--status-warning)', fontSize: '0.85rem', fontWeight: 700 }}>{ch.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'stats':
        const totalRevenue = challans.reduce((acc, curr) => acc + curr.amount, 0);
        const paidChallans = challans.filter(c => c.status === 'Paid');
        const unpaidChallans = challans.filter(c => c.status === 'Unpaid');
        const paidRevenue = paidChallans.reduce((acc, curr) => acc + curr.amount, 0);

        return (
          <div className="glass-panel" style={{ padding: '2rem', minHeight: '60vh' }}>
            <h2 style={{ margin: 0, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><BarChart2 color="var(--accent-primary)" /> Performance Stats</h2>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              <div style={{ padding: '1.5rem', background: 'var(--status-info)15', borderRadius: '16px', border: '1px solid var(--status-info)30' }}>
                <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-muted)' }}>Total Challans Issued</p>
                <h2 style={{ margin: 0, color: 'var(--status-info)' }}>{challans.length}</h2>
              </div>
              <div style={{ padding: '1.5rem', background: 'var(--status-success)15', borderRadius: '16px', border: '1px solid var(--status-success)30' }}>
                <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-muted)' }}>Paid Challans</p>
                <h2 style={{ margin: 0, color: 'var(--status-success)' }}>{paidChallans.length}</h2>
              </div>
              <div style={{ padding: '1.5rem', background: 'var(--status-warning)15', borderRadius: '16px', border: '1px solid var(--status-warning)30' }}>
                <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-muted)' }}>Pending Challans</p>
                <h2 style={{ margin: 0, color: 'var(--status-warning)' }}>{unpaidChallans.length}</h2>
              </div>
            </div>

            <div style={{ padding: '2rem', background: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--glass-border)' }}>
              <h3 style={{ margin: '0 0 1.5rem 0', color: 'var(--text-primary)' }}>Revenue Tracking</h3>
              <div style={{ display: 'flex', gap: '2rem' }}>
                <div>
                  <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-muted)' }}>Total Billed</p>
                  <h2 style={{ margin: 0, color: 'var(--status-info)' }}>₹{totalRevenue}</h2>
                </div>
                <div>
                  <p style={{ margin: '0 0 0.5rem 0', color: 'var(--text-muted)' }}>Collected Revenue</p>
                  <h2 style={{ margin: 0, color: 'var(--status-success)' }}>₹{paidRevenue}</h2>
                </div>
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="glass-panel" style={{ padding: '2rem', minHeight: '60vh' }}>
            <h2 style={{ margin: 0, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Settings color="var(--accent-primary)" /> Account Settings</h2>
            <div style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h4 style={{ margin: 0 }}>Inspector Profile</h4>
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
                  <p style={{ margin: 0 }}><strong>Role:</strong> <span style={{ color: 'var(--status-info)', fontWeight: 600 }}>{userInfo.role}</span></p>
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
    <Layout userInfo={userInfo} onLogout={onLogout} sidebarItems={sidebarItems} activeSection={activeSection} setActiveSection={setActiveSection} title="Inspector Command Center">
      {renderContent()}
    </Layout>
  );
};

export default InspectorDashboard;
