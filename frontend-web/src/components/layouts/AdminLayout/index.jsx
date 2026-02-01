import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../AdminSidebar';
import AdminNavbar from '../AdminNavbar';

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    return (
        <div className="d-flex w-100 overflow-hidden">
            <AdminSidebar isOpen={isSidebarOpen} />
            <div className="d-flex flex-column flex-grow-1 bg-light" style={{ height: '100vh', overflowY: 'auto' }}>
                <AdminNavbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
                <div className="p-4">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;