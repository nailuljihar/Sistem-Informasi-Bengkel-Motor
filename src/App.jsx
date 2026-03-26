import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Mechanics from './pages/Mechanics';
import Vehicles from './pages/Vehicles';
import Spareparts from './pages/Spareparts';
import Payments from './pages/Payments';
import { Reports, FinancialReports } from './pages/Reports';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true'
  );
  const [userRole, setUserRole] = useState(
    localStorage.getItem('userRole') || null
  );

  const handleLogin = (role) => {
    setIsAuthenticated(true);
    setUserRole(role);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userRole', role);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
  };

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="*" element={<Login onLogin={handleLogin} />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Layout userRole={userRole} onLogout={handleLogout} />}>
        <Route index element={<Dashboard userRole={userRole} />} />
        <Route path="pelanggan" element={<Customers />} />
        <Route path="mekanik" element={<Mechanics />} />
        <Route path="sparepart" element={<Spareparts />} />
        <Route path="kendaraan" element={<Vehicles />} />
        <Route path="pembayaran" element={<Payments />} />
        <Route path="laporan" element={<Reports />} />
        <Route path="laporan-keuangan" element={<FinancialReports />} />
        <Route path="stok" element={<Spareparts />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
