import React from 'react';
import { Users, Cog, Package, TrendingUp, Wrench } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const Dashboard = ({ userRole }) => {
  // Pull simulation data from localStorage to show realistic summaries
  const [customers] = useLocalStorage('bengkel_customers', []);
  const [mechanics] = useLocalStorage('bengkel_mechanics', []);
  const [spareparts] = useLocalStorage('bengkel_spareparts', []);
  const [transactions] = useLocalStorage('bengkel_transactions', []);

  const totalIncome = transactions?.reduce((sum, t) => sum + (t.total || 0), 0) || 0;

  const stats = [
    { title: 'Total Pelanggan', value: customers?.length || 0, icon: Users, color: '#3B82F6' },
    { title: 'Mekanik Aktif', value: mechanics?.length || 0, icon: Cog, color: '#10B981' },
    { title: 'Stok Sparepart', value: spareparts?.reduce((sum, item) => sum + parseInt(item.stok || 0), 0) || 0, icon: Package, color: '#F59E0B' },
    { title: 'Pendapatan (Bulan Ini)', value: `Rp ${totalIncome.toLocaleString('id-ID')}`, icon: TrendingUp, color: '#8B5CF6' },
  ];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard {userRole === 'owner' ? 'Owner' : 'Admin'}</h1>
          <p className="text-secondary mt-2">Ringkasan aktivitas dan operasional bengkel.</p>
        </div>
      </div>

      <div className="grid grid-cols-4" style={{ marginBottom: '2rem' }}>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ background: `${stat.color}20`, padding: '1rem', borderRadius: '12px', color: stat.color }}>
                <Icon size={28} />
              </div>
              <div>
                <p className="text-secondary text-sm" style={{ marginBottom: '0.25rem' }}>{stat.title}</p>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '700' }}>{stat.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2">
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>Transaksi Terbaru</h3>
          {transactions?.length > 0 ? (
            <div className="flex-col gap-4">
              {transactions.slice(0, 5).map((t, index) => (
                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'rgba(51, 65, 85, 0.3)', borderRadius: '8px' }}>
                  <div>
                    <h4 style={{ fontWeight: '600' }}>{t.pelangganName}</h4>
                    <p className="text-secondary text-sm">{new Date(t.tanggal).toLocaleDateString('id-ID')}</p>
                  </div>
                  <div style={{ fontWeight: '700', color: 'var(--primary-color)' }}>
                    Rp {t.total?.toLocaleString('id-ID')}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-secondary text-center py-8">Belum ada transaksi tercatat.</p>
          )}
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
          <div style={{ width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <Wrench size={64} className="text-primary" />
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>Sistem Operasional Aktif</h3>
          <p className="text-secondary" style={{ maxWidth: '300px' }}>
            {userRole === 'admin' 
              ? 'Kelola data pelanggan, kendaraan, dan transaksi dengan mudah dari menu sidebar.'
              : 'Pantau laporan keuangan dan aktivitas servis kendaraan bengkel secara real-time.'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
