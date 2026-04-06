import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Printer } from 'lucide-react';

export const Reports = () => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('transaksi')
        .select('*, transaksi_item(*)')
        .order('tanggal', { ascending: false });

      if (error) throw error;
      if (data) {
        setTransactions(data.map(t => ({
          ...t,
          pelangganName: t.pelanggan_name,
          kendaraanName: t.kendaraan_name,
          serviceBiaya: t.service_biaya,
          items: t.transaksi_item.map(i => ({
            nama: i.nama,
            qty: i.qty
          }))
        })));
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

      {/* Area yang khusus akan tercetak (isolated) */}
      <div className="print-area">
        <div className="hidden print-block mb-8 text-center" style={{ display: 'none', textAlign: 'center', marginBottom: '20px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>BENGKEL MOTOR FATIA KAMAL</h1>
          <p>Laporan Service Pelanggan</p>
          <hr className="my-4" style={{ borderTop: '2px dashed #000', margin: '20px 0' }} />
        </div>

        <div className="glass-panel print-panel" style={{ padding: '1.5rem' }}>
          <div className="table-container">
            <table className="data-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>No/ID</th>
                  <th>Tanggal</th>
                  <th>Nama Pelanggan</th>
                  <th>Kendaraan</th>
                  <th>Jasa Service</th>
                  <th>Detail Sparepart</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8">Memuat data...</td>
                  </tr>
                ) : transactions.length > 0 ? transactions.map((t, index) => (
                  <tr key={t.id}>
                    <td data-label="No/ID" style={{ fontWeight: '500' }}>#{t.id}</td>
                    <td data-label="Tanggal">{new Date(t.tanggal).toLocaleDateString('id-ID')}</td>
                    <td data-label="Nama Pelanggan" style={{ fontWeight: '600' }}>{t.pelangganName}</td>
                    <td data-label="Kendaraan">{t.kendaraanName}</td>
                    <td data-label="Jasa Service">Rp {(t.serviceBiaya || 0).toLocaleString('id-ID')}</td>
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
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          html, body { margin: 0 !important; padding: 0 !important; background: white !important; color: black !important; }
          body * { visibility: hidden; }
          .print-area, .print-area * { visibility: visible; }
          .print-area { position: absolute; left: 0; top: 0; width: 100%; display: block !important; padding: 20px; }
          .print-block { display: block !important; }
          .print-panel { background: white !important; border: none !important; box-shadow: none !important; backdrop-filter: none !important; padding: 0 !important; }
          .data-table th, .data-table td { color: black !important; border: 1px solid #cbd5e1 !important; padding: 12px !important; }
          .data-table th { background-color: #f1f5f9 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          td span { color: black !important; }
        }
      `}} />
    </div>
  );
};

export const FinancialReports = () => {
    const [transactions, setTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchFinances = async () => {
            try {
                setIsLoading(true);
                const { data, error } = await supabase
                    .from('transaksi')
                    .select('*')
                    .order('tanggal', { ascending: false });

                if (error) throw error;
                if (data) setTransactions(data);
            } catch (error) {
                console.error('Error fetching finances:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchFinances();
    }, []);
    
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
  
        <div className="print-area">
            <div className="hidden print-block mb-8 text-center" style={{ display: 'none', textAlign: 'center', marginBottom: '20px' }}>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>BENGKEL MOTOR FATIA KAMAL</h1>
              <p>Laporan Keuangan</p>
              <hr className="my-4" style={{ borderTop: '2px dashed #000', margin: '20px 0' }} />
            </div>
      
            <div className="grid grid-cols-2 mb-8 print-hidden">
              <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                 <p className="text-secondary">Total Pendapatan Terdata</p>
                 <h2 className="text-primary mt-2" style={{ fontSize: '2.5rem', fontWeight: '800' }}>Rp {totalIncome.toLocaleString('id-ID')}</h2>
              </div>
            </div>
      
            <div className="glass-panel print-panel" style={{ padding: '1.5rem' }}>
              <div className="table-container">
                <table className="data-table" style={{ width: '100%' }}>
                  <thead>
                    <tr>
                      <th>No/ID</th>
                      <th>Tanggal</th>
                      <th>Pendapatan Servis</th>
                      <th>Pendapatan Sparepart</th>
                      <th>Total Transaksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan="5" className="text-center py-8">Memuat data keuangan...</td>
                      </tr>
                    ) : transactions.length > 0 ? transactions.map((t, index) => {
                      const partTotal = t.total - (t.service_biaya || 0);
                      return (
                        <tr key={t.id}>
                          <td data-label="No/ID" style={{ fontWeight: '500' }}>#{t.id}</td>
                          <td data-label="Tanggal">{new Date(t.tanggal).toLocaleDateString('id-ID')}</td>
                          <td data-label="Pendapatan Servis">Rp {(t.service_biaya || 0).toLocaleString('id-ID')}</td>
                          <td data-label="Pendapatan Sparepart">Rp {partTotal.toLocaleString('id-ID')}</td>
                          <td data-label="Total Transaksi" style={{ fontWeight: '700', color: 'var(--primary-color)' }}>Rp {t.total?.toLocaleString('id-ID')}</td>
                        </tr>
                      )
                    }) : (
                      <tr>
                        <td colSpan="5" className="text-center py-8">Belum ada data keuangan.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
        </div>

        <style dangerouslySetInnerHTML={{__html: `
        @media print {
          html, body { margin: 0 !important; padding: 0 !important; background: white !important; color: black !important; }
          body * { visibility: hidden; }
          .print-area, .print-area * { visibility: visible; }
          .print-hidden { display: none !important; }
          .print-area { position: absolute; left: 0; top: 0; width: 100%; display: block !important; padding: 20px; }
          .print-block { display: block !important; }
          .print-panel { background: white !important; border: none !important; box-shadow: none !important; backdrop-filter: none !important; padding: 0 !important; }
          .data-table th, .data-table td { color: black !important; border: 1px solid #cbd5e1 !important; padding: 12px !important; }
          .data-table th { background-color: #f1f5f9 !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          td span { color: black !important; }
        }
      `}} />
      </div>
    );
  };
