import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Bike,
  Wrench,
  Package,
  CreditCard,
  FileText,
  LogOut,
  Menu,
  X
} from 'lucide-react';

const Layout = ({ userRole, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    if (window.confirm("Apakah anda yakin ingin keluar?")) {
      onLogout();
      navigate('/login');
    }
  };

  const menuItems = userRole === 'admin' ? [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/pelanggan', label: 'Data Pelanggan', icon: Users },
    { path: '/mekanik', label: 'Data Mekanik', icon: Wrench },
    { path: '/sparepart', label: 'Data Sparepart', icon: Package },
    { path: '/kendaraan', label: 'Data Kendaraan', icon: Bike },
    { path: '/pembayaran', label: 'Pembayaran', icon: CreditCard },
  ] : [
    { path: '/', label: 'Dashboard Owner', icon: LayoutDashboard },
    { path: '/laporan', label: 'Laporan Service', icon: FileText },
    { path: '/laporan-keuangan', label: 'Laporan Keuangan', icon: FileText },
    { path: '/stok', label: 'Mengelola Stok', icon: Package },
  ];

  return (
    <div className="app-layout">
      {/* Mobile Header */}
      <div className="mobile-header">
        <div className="sidebar-logo" style={{ fontSize: '1.2rem', margin: 0 }}>BENGKEL FATIA</div>
        <button className="btn-icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>}

      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">BENGKEL FATIA</div>
          <p className="text-secondary text-sm">Sistem Informasi</p>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                end={item.path === '/'}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-color" style={{ padding: '1.5rem 1rem', borderTop: '1px solid var(--border-color)' }}>
          <button className="nav-item w-full" onClick={handleLogout} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
            <LogOut size={20} className="text-danger" />
            <span className="text-danger">Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
