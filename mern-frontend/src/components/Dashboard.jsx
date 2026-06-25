import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CitizenDashboard from './CitizenDashboard';
import AdminDashboard from './AdminDashboard';
import RtoDashboard from './RtoDashboard';
import InspectorDashboard from './InspectorDashboard';

const Dashboard = () => {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem('userInfo');
    if (user) {
      setUserInfo(JSON.parse(user));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/login');
  };

  if (!userInfo) return <div>Loading...</div>;

  if (userInfo.role === 'ADMIN') {
    return <AdminDashboard userInfo={userInfo} onLogout={handleLogout} />;
  }

  if (userInfo.role === 'RTO') {
    return <RtoDashboard userInfo={userInfo} onLogout={handleLogout} />;
  }

  if (userInfo.role === 'INSPECTOR') {
    return <InspectorDashboard userInfo={userInfo} onLogout={handleLogout} />;
  }

  return <CitizenDashboard userInfo={userInfo} onLogout={handleLogout} />;
};

export default Dashboard;
