import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wrench } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate API call and SRS logic
    setTimeout(() => {
      setLoading(false);
      // Hardcoded for demo as per SRS simulation logic
      if (username === 'admin' && password === 'admin') {
        onLogin('admin');
        navigate('/');
      } else if (username === 'owner' && password === 'owner') {
        onLogin('owner');
        navigate('/');
      } else {
        setError('Username atau Password salah!');
      }
    }, 1500); // simulate loading screen from SRS
  };

  return (
    <div className="app-layout justify-center items-center" style={{ minHeight: '100vh', background: 'var(--bg-dark)' }}>
      {loading ? (
        <div className="glass-card flex-col items-center justify-center" style={{ padding: '4rem', width: '100%', maxWidth: '500px', textAlign: 'center' }}>
          <div className="mb-4" style={{ position: 'relative', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto' }}>
            <div style={{ position: 'absolute', width: '100%', height: '100%', border: '4px solid var(--border-color)', borderRadius: '50%', borderTopColor: 'var(--primary-color)', animation: 'spin 1s linear infinite' }}></div>
            <Wrench size={32} className="text-primary" />
          </div>
          <h2 className="text-primary" style={{ fontSize: '1.5rem', fontWeight: '600' }}>MEMUAT...</h2>
          <p className="text-secondary mt-2">Memverifikasi data Anda</p>
        </div>
      ) : (
        <div className="grid grid-cols-2" style={{ maxWidth: '1000px', width: '90%', background: 'var(--bg-card)', borderRadius: '24px', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
          <div style={{ padding: '3rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'rgba(16, 185, 129, 0.05)' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '1rem', color: 'var(--text-primary)' }}>
              Selamat Datang di
              <span className="text-primary" style={{ display: 'block' }}>Sistem Bengkel Fatia</span>
            </h1>
            <p className="text-secondary" style={{ fontSize: '1.1rem', lineHeight: '1.6' }}>
              Silakan masuk menggunakan akun Anda untuk mengelola transaksi, sparepart, dan laporan operasional.
            </p>
          </div>
          
          <div style={{ padding: '3rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderLeft: '1px solid var(--border-color)' }}>
            <h2 style={{ fontSize: '1.8rem', fontWeight: '600', marginBottom: '2rem' }}>Login Account</h2>
            
            {error && (
              <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderLeft: '4px solid var(--danger-color)', color: 'var(--text-primary)', marginBottom: '1.5rem', borderRadius: '4px' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Username</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  placeholder="Masukkan username Anda"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input 
                  type="password" 
                  className="form-input" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="Masukkan password Anda"
                  required
                />
              </div>
              
              <button type="submit" className="btn btn-primary w-full mt-4" style={{ padding: '1rem', fontSize: '1.1rem' }}>
                MASUK
              </button>
            </form>
          </div>
        </div>
      )}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
};

export default Login;
