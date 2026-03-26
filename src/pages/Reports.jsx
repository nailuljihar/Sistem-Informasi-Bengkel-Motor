import React from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Printer } from 'lucide-react';

export const Reports = () => {
  const [transactions] = useLocalStorage('bengkel_transactions', []);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <div className="page-header print:hidden">
        <div>
          <h1 className="page-title">Laporan Service</h1>
          <p className="text-secondary mt-2">Daftar layanan service yang telah diselesaikan.</p>
        </div>
        <button className="btn btn-primary" onClick={handlePrint}>
          <Printer size={20} />
          CETAK PDF
        </button>
      </div>

      {/* Print-only Header */}
      <div className="hidden print:block mb-8 text-center" style={{ display: 'none' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>BENGKEL MOTOR FATIA KAMAL</h1>
        <p>Laporan Service Pelanggan</p>
        <hr className="my-4" style={{ borderColor: '#000', margin: '16px 0' }} />
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div className="table-container">
          <table className="data-table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>No</th>
                <th>Tanggal</th>
                <th>Nama Pelanggan</th>
                <th>Kendaraan</th>
                <th>Jasa Service</th>
                <th>Detail Sparepart</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length > 0 ? transactions.map((t, index) => (
                <tr key={t.id}>
                  <td data-label="No">{index + 1}</td>
                  <td data-label="Tanggal">{new Date(t.tanggal).toLocaleDateString('id-ID')}</td>
                  <td data-label="Nama Pelanggan" style={{ fontWeight: '600' }}>{t.pelangganName}</td>
                  <td data-label="Kendaraan">{t.kendaraanName}</td>
                  <td data-label="Jasa Service">Rp {t.serviceBiaya?.toLocaleString('id-ID')}</td>
                  <td data-label="Detail Sparepart">
                    {t.items.length > 0 
                      ? t.items.map(i => `${i.nama} (${i.qty})`).join(', ') 
                      : 'Tidak ada'}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="text-center py-8">Belum ada data service.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body { background: white !important; color: black !important; }
          .sidebar, .page-header, .print\\:hidden, button { display: none !important; }
          .main-content { margin-left: 0 !important; padding: 0 !important; }
          .glass-panel { background: white !important; border: none !important; box-shadow: none !important; }
          .data-table th, .data-table td { border-color: #ddd !important; color: black !important; }
          .hidden.print\\:block { display: block !important; }
        }
      `}} />
    </div>
  );
};

export const FinancialReports = () => {
    const [transactions] = useLocalStorage('bengkel_transactions', []);
    
    // Calculate grouped by month simply for demo
    const totalIncome = transactions.reduce((sum, t) => sum + (t.total || 0), 0);
  
    return (
      <div>
        <div className="page-header print:hidden">
          <div>
            <h1 className="page-title">Laporan Keuangan</h1>
            <p className="text-secondary mt-2">Daftar pendapatan transaksi servis dan penjualan.</p>
          </div>
          <button className="btn btn-primary" onClick={() => window.print()}>
            <Printer size={20} />
            CETAK PDF
          </button>
        </div>
  
        <div className="hidden print:block mb-8 text-center" style={{ display: 'none' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>BENGKEL MOTOR FATIA KAMAL</h1>
          <p>Laporan Keuangan</p>
          <hr className="my-4" style={{ borderColor: '#000', margin: '16px 0' }} />
        </div>
  
        <div className="grid grid-cols-2 mb-8 print:hidden">
          <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
             <p className="text-secondary">Total Pendapatan Terdata</p>
             <h2 className="text-primary mt-2" style={{ fontSize: '2.5rem', fontWeight: '800' }}>Rp {totalIncome.toLocaleString('id-ID')}</h2>
          </div>
        </div>
  
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div className="table-container">
            <table className="data-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>No</th>
                  <th>ID Transaksi</th>
                  <th>Tanggal</th>
                  <th>Pendapatan Servis</th>
                  <th>Pendapatan Sparepart</th>
                  <th>Total Transaksi</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length > 0 ? transactions.map((t, index) => {
                  const partTotal = t.total - t.serviceBiaya;
                  return (
                    <tr key={t.id}>
                      <td data-label="No">{index + 1}</td>
                      <td data-label="ID Transaksi"><span style={{ fontFamily: 'monospace', opacity: 0.7 }}>{t.id.slice(-6)}</span></td>
                      <td data-label="Tanggal">{new Date(t.tanggal).toLocaleDateString('id-ID')}</td>
                      <td data-label="Pendapatan Servis">Rp {t.serviceBiaya?.toLocaleString('id-ID')}</td>
                      <td data-label="Pendapatan Sparepart">Rp {partTotal.toLocaleString('id-ID')}</td>
                      <td data-label="Total Transaksi" style={{ fontWeight: '700', color: 'var(--primary-color)' }}>Rp {t.total?.toLocaleString('id-ID')}</td>
                    </tr>
                  )
                }) : (
                  <tr>
                    <td colSpan="6" className="text-center py-8">Belum ada data keuangan.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body { background: white !important; color: black !important; }
          .sidebar, .page-header, .print\\:hidden, button { display: none !important; }
          .main-content { margin-left: 0 !important; padding: 0 !important; }
          .glass-panel { background: white !important; border: none !important; box-shadow: none !important; }
          .data-table th, .data-table td { border-color: #ddd !important; color: black !important; padding: 8px !important; }
          .hidden.print\\:block { display: block !important; }
        }
      `}} />
      </div>
    );
  };
