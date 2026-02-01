import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaTachometerAlt, FaTree, FaDna, FaLeaf, FaSeedling, FaUsers } from 'react-icons/fa';
import { useAuthContext } from '../../../context/useAuthContext';

import './AdminSidebar.css';

const AdminSidebar = ({ isOpen }) => {
  const { user } = useAuthContext();
  const menuItems = [
    { path: '/admin/dashboard', name: 'Tổng quan', icon: <FaTachometerAlt /> },
    { path: '/admin/families', name: 'Họ thực vật (Family)', icon: <FaTree /> },
    { path: '/admin/genera', name: 'Chi thực vật (Genus)', icon: <FaDna /> },
    { path: '/admin/species', name: 'Loài (Species)', icon: <FaLeaf /> },
    { 
            path: '/admin/varieties', 
            name: 'Thứ & Giống (Varieties & Cultivars)', // Term chuẩn: Varieties & Cultivars
            icon: <FaSeedling /> 
    },
    ...((user?.role === 'admin')
    ? [{ path: '/admin/users', name: 'Người dùng hệ thống', icon: <FaUsers /> }]
    : []),
  ];

  return (
    <div
      className={`bg-dark text-white border-end ${isOpen ? 'd-block' : 'd-none d-md-block'}`}
      style={{
        width: isOpen ? 'auto' : '80px',
        minHeight: '100vh',
        transition: 'width 0.3s ease',
      }}
    >
      <div className="p-3 text-center border-bottom border-secondary">
        <h4 className="fw-bold text-success m-0">
          {isOpen ? 'PLANT DB' : '🌱'}
        </h4>
      </div>

      <div className="py-3">
        {menuItems.map((item, index) => (
          <NavLink
            key={index}
            to={item.path}
            className={({ isActive }) =>
              `sidebar-link d-flex align-items-center px-3 py-3 text-decoration-none text-white ${
                isActive ? 'active' : ''
              }`
            }
            title={item.name}
          >
            <span className="fs-5">{item.icon}</span>
            {isOpen && (
              <span className="ms-3 fw-medium sidebar-text">
                {item.name}
              </span>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default AdminSidebar;
