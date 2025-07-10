// File: src/Pages/DashboardPage.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { FaAngleDoubleLeft, FaUserCircle, FaHome, FaUsers, FaBriefcase, FaMoneyCheck } from 'react-icons/fa';
import Dashboard from '../layouts/Dashboard';
import Employees from '../layouts/Exployees';
import HRServices from '../layouts/HrServices';
import Payroll from '../layouts/Payroll';
import './DashboardPage.css';

const sidebarItems = [
  { name: 'Dashboard', path: '', icon: <FaHome /> },
  { name: 'Employees', path: 'employees', icon: <FaUsers /> },
  { name: 'HR Services', path: 'hr', icon: <FaBriefcase /> },
  { name: 'Payroll', path: 'payroll', icon: <FaMoneyCheck /> },
];

const DashboardPage: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const currentPath = location.pathname.replace('/dashboard', '').replace(/^\/?/, '');
  const currentTitle =
    sidebarItems.find(item => item.path === currentPath)?.name || 'Dashboard';

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };
  const dropdownRef = useRef<HTMLDivElement>(null);

// Close dropdown if clicked outside
useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setDropdownOpen(false);
    }
  };

  window.addEventListener('mousedown', handleClickOutside);
  return () => {
    window.removeEventListener('mousedown', handleClickOutside);
  };
}, []);


  return (
    <div className="dashboard-container">
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-toggle" onClick={() => setCollapsed(!collapsed)}>
          <FaAngleDoubleLeft style={{ transform: collapsed ? 'rotate(180deg)' : 'none',transition: 'transform 0.3s ease',
      color: 'black', }} />
        </div>
        <div className="sidebar-nav">
        <ul
           onMouseLeave={() => setHoveredIndex(null)}
    >
          {sidebarItems.map((item,index) => (
            <li
              key={item.path}
              onClick={() => navigate(`/dashboard/${item.path}`)}
                        onMouseEnter={() => setHoveredIndex(index)}

              className={currentPath === item.path ? 'active' : ''}
            >
              {item.icon} {!collapsed && <span>{item.name}</span>}
            </li>
          ))}
        </ul>
         {!collapsed && hoveredIndex !== null && (
      <div
        className="hover-indicator"
        style={{ top: `${hoveredIndex * 48}px` }}
      />
    )}
  </div>
      </aside>

      <main className="main-content">
        <header className="dashboard-header">
          <h2>{currentTitle}</h2>
          <div className="profile-menu">
            <FaUserCircle className="profile-icon" onClick={() => setDropdownOpen(!dropdownOpen)} />
            {dropdownOpen && (
              <div className="dropdown">
                <button onClick={() => alert('Profile clicked')}>Profile</button>
                <hr/>
                <button onClick={() => alert('Settings clicked')}>Settings</button>
                <hr/>
                <button onClick={handleLogout} style={{color:'red'}}>Logout</button>
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
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </section>
      </main>
    </div>
  );
};

export default DashboardPage;
