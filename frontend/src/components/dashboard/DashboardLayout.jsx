import React from 'react';
import { Home, Users, BarChart2, Settings, Bell, Search, Plus } from 'lucide-react';

const DashboardLayout = ({ children }) => {
    return (
        <div className="dashboard-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="sidebar-logo">
                    <span style={{ color: 'var(--hs-lorax)' }}>●</span> HPCL Intel
                </div>

                <nav>
                    <a href="#" className="nav-item active">
                        <Home size={20} /> Dashboard
                    </a>
                    <a href="#" className="nav-item">
                        <Users size={20} /> Leads
                    </a>
                    <a href="#" className="nav-item">
                        <BarChart2 size={20} /> Reports
                    </a>
                    <a href="#" className="nav-item">
                        <Settings size={20} /> Settings
                    </a>
                </nav>
            </aside>

            {/* Main Content Area */}
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                {/* Top Nav */}
                <header className="top-nav">
                    <div className="search-bar">
                        <Search size={16} style={{ position: 'absolute', marginLeft: '12px', marginTop: '10px', color: '#999' }} />
                        <input type="text" placeholder="Search leads, companies..." style={{ paddingLeft: '35px' }} />
                    </div>

                    <div className="user-profile">
                        <button className="btn-icon" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#33475b' }}>
                            <Bell size={20} />
                        </button>
                        <div className="avatar">JD</div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="main-content">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
