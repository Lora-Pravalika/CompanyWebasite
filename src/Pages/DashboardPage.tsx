// src/Pages/DashboardPage.tsx
import React, { useRef, useState } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import {
  FaAngleDoubleLeft, FaUserCircle, FaSignOutAlt, FaCog,
  FaTachometerAlt, FaUsers, FaBriefcase, FaMoneyBillWave, FaUser
} from 'react-icons/fa';
import Dashboard from '../layouts/Dashboard';
import Employees from '../layouts/Exployees';
import HRServices from '../layouts/HrServices';
import Payroll from '../layouts/Payroll';
import ProfileModal from '../Ui/profileAvatar';
import './DashboardPage.css';

const sidebarItems = [
  { name: 'Dashboard', path: '', icon: <FaTachometerAlt /> },
  { name: 'Employees', path: 'employees', icon: <FaUsers /> },
  { name: 'HR Services', path: 'hr', icon: <FaBriefcase /> },
  { name: 'Payroll', path: 'payroll', icon: <FaMoneyBillWave /> }
];

const DashboardPage = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname.replace('/dashboard', '').replace(/^\/?/, '');
  const currentTitle = sidebarItems.find(item => item.path === currentPath)?.name || 'Dashboard';

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/signup');
  };

  return (
    <div className="dashboard-container">
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-toggle" onClick={() => setCollapsed(!collapsed)}>
          <FaAngleDoubleLeft />
        </div>
        <ul className="sidebar-nav">
          {sidebarItems.map((item) => (
            <li
              key={item.path}
              className={currentPath === item.path ? 'active' : ''}
              onClick={() => navigate(`/dashboard/${item.path}`)}
            >
              {item.icon} {!collapsed && <span>{item.name}</span>}
            </li>
          ))}
        </ul>
      </aside>

      <main className="main-content">
        <header className="dashboard-header">
          <h2>{currentTitle}</h2>
          <div className="profile-menu" ref={dropdownRef}>
            {avatar ? (
              <img src={avatar} alt="Avatar" className="avatar-preview" onClick={() => setDropdownOpen(!dropdownOpen)} />
            ) : (
              <FaUserCircle className="profile-icon" onClick={() => setDropdownOpen(!dropdownOpen)} />
            )}
            {dropdownOpen && (
              <div className="dropdown">
                <button onClick={() => setProfileModalOpen(true)}><FaUser /> Profile</button>
                <hr />
                <button><FaCog /> Settings</button>
                <hr />
                <button onClick={handleLogout} style={{ color: 'red' }}><FaSignOutAlt /> Logout</button>
              </div>
            )}
          </div>
        </header>

        <section className="content-section">
          <Routes>
            <Route path="" element={<Dashboard />} />
            <Route path="employees" element={<Employees />} />
            <Route path="hr" element={<HRServices />} />
            <Route path="payroll" element={<Payroll />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </section>
      </main>

      {profileModalOpen && (
        <ProfileModal
          onClose={() => setProfileModalOpen(false)}
          currentImage={avatar}
          onSaveImage={(img) => {
            setAvatar(img);
            setProfileModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default DashboardPage;
