// File: src/Pages/DashboardPage.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import {
  FaAngleDoubleLeft,
  FaUserCircle,
  FaHome,
  FaUsers,
  FaBriefcase,
  FaMoneyCheck,
  FaSignOutAlt,
  FaCog,
  FaUser,
  FaEdit,
  FaTrash,
  FaCamera,
  FaUpload,
  FaTimesCircle
} from 'react-icons/fa';
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
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const currentPath = location.pathname.replace('/dashboard', '').replace(/^\/?/, '');
  const currentTitle =
    sidebarItems.find(item => item.path === currentPath)?.name || 'Dashboard';

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/signup');
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setSelectedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

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
          <FaAngleDoubleLeft
            style={{
              transform: collapsed ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.3s ease',
              color: 'black',
            }}
          />
        </div>
        <div className="sidebar-nav">
          <ul onMouseLeave={() => setHoveredIndex(null)}>
            {sidebarItems.map((item, index) => (
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
            <div className="hover-indicator" style={{ top: `${hoveredIndex * 48}px` }} />
          )}
        </div>
      </aside>

      <main className="main-content">
        <header className="dashboard-header">
          <h2>{currentTitle}</h2>
          <div className="profile-menu" ref={dropdownRef}>
            <FaUserCircle className="profile-icon" onClick={() => setDropdownOpen(!dropdownOpen)} />
            {dropdownOpen && (
              <div className="dropdown">
                <button onClick={() => setProfileModalOpen(true)}>
                  <FaUser /> Profile
                </button>
                <hr />
                <button onClick={() => alert('Settings clicked')}>
                  <FaCog /> Settings
                </button>
                <hr />
                <button onClick={handleLogout} style={{ color: 'red' }}>
                  <FaSignOutAlt /> Logout
                </button>
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

      {/* Profile Modal */}
      {profileModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="close-icon" onClick={() => setProfileModalOpen(false)}>
              <FaTimesCircle />
            </div>
            <div className="profile-image-container">
              {selectedImage ? (
                <img src={selectedImage} alt="Profile Preview" className="profile-preview" />
              ) : (
                <FaUserCircle size={100} color="#94a3b8" />
              )}
              <div className="modal-actions">
                <button className="edit-btn" onClick={handleUploadClick}>
                  <FaCamera /> Camera / Upload Photo
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                  accept="image/*"
                />
                <button className="remove-btn" onClick={handleRemoveImage}>
                  <FaTrash /> Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
