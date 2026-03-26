import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import Modal from '../components/Modal';
import CustomSelect from '../components/CustomSelect';
import { Plus, CreditCard } from 'lucide-react';

const Payments = () => {
  const [transactions, setTransactions] = useLocalStorage('bengkel_transactions', []);
  const [customers] = useLocalStorage('bengkel_customers', []);
  const [vehicles] = useLocalStorage('bengkel_vehicles', []);
  const [spareparts, setSpareparts] = useLocalStorage('bengkel_spareparts', []);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [printingData, setPrintingData] = useState(null);
  
  const [formData, setFormData] = useState({
    customerId: '',
    vehicleId: '',
    serviceBiaya: 0,
    selectedItems: [] // { sparepartId, qty, price }
  });

  const handleOpenModal = () => {
    setFormData({ customerId: '', vehicleId: '', serviceBiaya: 0, selectedItems: [] });
    setIsModalOpen(true);
  };

  const handleAddItem = (partId) => {
    if(!partId) return;
    const part = spareparts.find(s => s.id === partId);
    if (!part) return;

    const existingItem = formData.selectedItems.find(i => i.sparepartId === partId);
    if (existingItem) {
      if (existingItem.qty >= part.stok) return alert('Stok tidak mencukupi!');
      setFormData({
        ...formData,
        selectedItems: formData.selectedItems.map(i => 
          i.sparepartId === partId ? { ...i, qty: i.qty + 1 } : i
        )
      });
    } else {
      if (part.stok < 1) return alert('Stok kosong!');
      setFormData({
        ...formData,
        selectedItems: [...formData.selectedItems, { sparepartId: partId, nama: part.nama, qty: 1, price: part.harga }]
      });
    }
  };

  const handleRemoveItem = (partId) => {
    setFormData({
      ...formData,
      selectedItems: formData.selectedItems.filter(i => i.sparepartId !== partId)
    });
  };

  const calculateTotal = () => {
    const itemsTotal = formData.selectedItems.reduce((sum, item) => sum + (item.price * item.qty), 0);
    return itemsTotal + (parseInt(formData.serviceBiaya) || 0);
  };

  const confirmPayment = (e) => {
    e.preventDefault();
    if (!formData.customerId || !formData.vehicleId) {
      return alert('Pilih pelanggan dan kendaraan!');
    }
    setIsModalOpen(false);
    setIsConfirmOpen(true);
  };

  const executePayment = () => {
    // Reduce Stock
    let newSpareparts = [...spareparts];
    formData.selectedItems.forEach(item => {
      newSpareparts = newSpareparts.map(sp => 
        sp.id === item.sparepartId ? { ...sp, stok: sp.stok - item.qty } : sp
      );
    });
    setSpareparts(newSpareparts);

    // Save Transaction
    const customer = customers.find(c => c.id === formData.customerId);
    const vehicle = vehicles.find(v => v.id === formData.vehicleId);
    
    const newTransaction = {
      id: Date.now().toString(),
      tanggal: new Date().toISOString(),
      customerId: formData.customerId,
      pelangganName: customer ? customer.nama : 'Unknown',
      kendaraanName: vehicle ? vehicle.namaKendaraan : 'Unknown',
      items: formData.selectedItems,
      serviceBiaya: parseInt(formData.serviceBiaya) || 0,
      total: calculateTotal()
    };

    setTransactions([newTransaction, ...transactions]);
    setIsConfirmOpen(false);
  };

  const handlePrintReceipt = (t) => {
    setPrintingData(t);
    setTimeout(() => {
      window.print();
    }, 100);
  };

  return (
    <div>
      <div className="print-hidden">
        <div className="page-header">
          <div>
            <h1 className="page-title">Pembayaran & Transaksi</h1>
            <p className="text-secondary mt-2">Catat transaksi servis dan penjualan suku cadang.</p>
          </div>
          <button className="btn btn-primary" onClick={handleOpenModal}>
            <Plus size={20} />
            BUAT TRANSAKSI BARU
          </button>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Tanggal</th>
                  <th>Pelanggan</th>
                  <th>Kendaraan</th>
                  <th>Sparepart Digunakan</th>
                  <th>Total Nominal</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length > 0 ? transactions.map((t, index) => (
                  <tr key={t.id}>
                    <td data-label="No">{index + 1}</td>
                    <td data-label="Tanggal">{new Date(t.tanggal).toLocaleDateString('id-ID')}</td>
                    <td data-label="Pelanggan" style={{ fontWeight: '600' }}>{t.pelangganName}</td>
                    <td data-label="Kendaraan">{t.kendaraanName}</td>
                    <td data-label="Sparepart Digunakan">
                      {t.items.length > 0 
                        ? t.items.map(i => `${i.nama} (x${i.qty})`).join(', ') 
                        : '-'}
                    </td>
                    <td data-label="Total Nominal" style={{ color: 'var(--primary-color)', fontWeight: '700' }}>
                      Rp {t.total?.toLocaleString('id-ID')}
                    </td>
                    <td data-label="Aksi">
                      <button className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => handlePrintReceipt(t)}>
                        Cetak Nota
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="7" className="text-center text-secondary py-8" style={{ padding: '2rem 0', textAlign: 'center' }}>Belum ada data transaksi.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Transaction Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="BUAT TRANSAKSI BARU">
          <form onSubmit={confirmPayment}>
            <div className="form-group">
            <label className="form-label">Pelanggan</label>
            <CustomSelect 
               required 
               value={formData.customerId} 
               onChange={e => setFormData({...formData, customerId: e.target.value, vehicleId: ''})}
               options={customers.map(c => ({ value: c.id, label: c.nama }))}
               placeholder="Pilih Pelanggan"
            />
          </div>
            
            <div className="form-group">
            <label className="form-label">Kendaraan</label>
            <CustomSelect 
               required 
               value={formData.vehicleId} 
               onChange={e => setFormData({...formData, vehicleId: e.target.value})}
               disabled={!formData.customerId}
               options={vehicles.filter(v => v.customerId === formData.customerId).map(v => ({ value: v.id, label: `${v.namaKendaraan} - ${v.noPlat}` }))}
               placeholder="Pilih Kendaraan"
            />
            {formData.customerId && vehicles.filter(v => v.customerId === formData.customerId).length === 0 && (
               <p className="text-danger mt-2 text-sm">Pelanggan ini belum memiliki data kendaraan.</p>
            )}
          </div>

            <div className="form-group" style={{ padding: '1rem', background: 'rgba(51, 65, 85, 0.3)', borderRadius: '8px' }}>
              <label className="form-label flex justify-between mb-2">
              <span>Tambahkan Sparepart</span>
            </label>
            <CustomSelect 
               value="" 
               onChange={e => { handleAddItem(e.target.value); }}
               options={spareparts.filter(s => s.stok > 0).map(s => ({ value: s.id, label: `${s.nama} - Rp ${s.harga?.toLocaleString('id-ID')} (Sisa: ${s.stok})` }))}
               placeholder="-- Pilih Sparepart --"
            />
              
              {formData.selectedItems.length > 0 && (
                <div className="mt-2 text-sm">
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                      {formData.selectedItems.map(item => (
                        <tr key={item.sparepartId} style={{ borderBottom: '1px solid var(--border-color)' }}>
                          <td className="py-2">{item.nama}</td>
                          <td className="py-2 text-center">x{item.qty}</td>
                          <td className="py-2 text-right">Rp {(item.price * item.qty).toLocaleString('id-ID')}</td>
                          <td className="py-2 text-right">
                            <button type="button" onClick={() => handleRemoveItem(item.sparepartId)} className="text-danger" style={{ background: 'none', border: 'none', cursor: 'pointer' }}>Hapus</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Biaya Jasa Servis (Rp)</label>
              <input type="number" min="0" className="form-input" value={formData.serviceBiaya} onChange={e => setFormData({...formData, serviceBiaya: e.target.value})} />
            </div>

            <div className="flex justify-between items-center mt-4 pt-4" style={{ borderTop: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Total: Rp {calculateTotal().toLocaleString('id-ID')}</h3>
              <button type="submit" className="btn btn-primary">LANJUTKAN</button>
            </div>
          </form>
        </Modal>

        {/* Confirmation Modal */}
        <Modal isOpen={isConfirmOpen} onClose={() => setIsConfirmOpen(false)} title="KONFIRMASI PEMBAYARAN">
          <div className="flex-col items-center justify-center text-center p-4">
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <CreditCard size={40} className="text-primary" />
            </div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Selesaikan Pembayaran?</h2>
            <p className="text-secondary mb-4">Pastikan nominal uang yang diterima sesuai dengan total pembayaran.</p>
            <div style={{ background: 'var(--bg-dark)', padding: '1rem', borderRadius: '8px', fontSize: '2rem', fontWeight: '800', color: 'var(--primary-color)', marginBottom: '2rem' }}>
              Rp {calculateTotal().toLocaleString('id-ID')}
            </div>
            
            <div className="flex justify-center gap-4 w-full">
              <button className="btn btn-outline" onClick={() => setIsConfirmOpen(false)} style={{ flex: 1 }}>BATAL</button>
              <button className="btn btn-primary" onClick={executePayment} style={{ flex: 1 }}>YA, SELESAI</button>
            </div>
          </div>
        </Modal>
      </div>

      {/* Hidden Print Receipt Template */}
      {printingData && (
        <div className="print-receipt" style={{ display: 'none' }}>
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold' }}>BENGKEL MOTOR FATIA KAMAL</h2>
            <p>Sistem Informasi & Manajemen Bengkel</p>
          </div>
          <hr style={{ borderTop: '2px dashed #000', margin: '20px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <p><strong>Pelanggan:</strong> {printingData.pelangganName}</p>
              <p><strong>Kendaraan:</strong> {printingData.kendaraanName}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p><strong>Tanggal:</strong> {new Date(printingData.tanggal).toLocaleString('id-ID')}</p>
              <p><strong>ID Nota:</strong> {printingData.id.slice(-6).toUpperCase()}</p>
            </div>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #000' }}>
                <th style={{ textAlign: 'left', padding: '8px 0' }}>Item</th>
                <th style={{ textAlign: 'center', padding: '8px 0' }}>Qty</th>
                <th style={{ textAlign: 'right', padding: '8px 0' }}>Harga</th>
                <th style={{ textAlign: 'right', padding: '8px 0' }}>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {printingData.items.map(item => (
                <tr key={item.sparepartId}>
                  <td style={{ padding: '8px 0' }}>{item.nama}</td>
                  <td style={{ textAlign: 'center', padding: '8px 0' }}>{item.qty}</td>
                  <td style={{ textAlign: 'right', padding: '8px 0' }}>Rp {item.price.toLocaleString('id-ID')}</td>
                  <td style={{ textAlign: 'right', padding: '8px 0' }}>Rp {(item.price * item.qty).toLocaleString('id-ID')}</td>
                </tr>
              ))}
              <tr>
                <td colSpan="3" style={{ padding: '8px 0', borderTop: '1px solid #ddd' }}>Jasa Service</td>
                <td style={{ textAlign: 'right', padding: '8px 0', borderTop: '1px solid #ddd' }}>Rp {(printingData.serviceBiaya || 0).toLocaleString('id-ID')}</td>
              </tr>
            </tbody>
          </table>
          <hr style={{ borderTop: '2px dashed #000', margin: '20px 0' }} />
          <div style={{ textAlign: 'right', fontSize: '18px', fontWeight: 'bold' }}>
            <p>TOTAL: Rp {printingData.total.toLocaleString('id-ID')}</p>
          </div>
          <div style={{ textAlign: 'center', marginTop: '40px', fontSize: '14px' }}>
            <p>Terima kasih atas kepercayaan Anda!</p>
            <p>Semoga kendaraan Anda selalu dalam kondisi prima.</p>
          </div>
        </div>
      )}

      {/* Global Print Styles for this page */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body { background: white !important; color: black !important; margin: 0; padding: 0; }
          .sidebar, .page-header, .print-hidden, button, .modal-overlay { display: none !important; }
          .main-content { margin-left: 0 !important; padding: 20px !important; }
          .print-receipt { display: block !important; width: 100%; color: black; font-family: monospace; }
        }
      `}} />
    </div>
  );
};

export default Payments;
