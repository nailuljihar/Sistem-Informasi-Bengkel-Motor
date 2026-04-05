import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Modal from '../components/Modal';
import CustomSelect from '../components/CustomSelect';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const Vehicles = () => {
  const [vehicles, setVehicles] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    customerId: '',
    namaKendaraan: '',
    noPlat: '',
    keluhan: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [vehiclesRes, customersRes] = await Promise.all([
        supabase.from('kendaraan').select('*').order('created_at', { ascending: false }),
        supabase.from('pelanggan').select('id, nama')
      ]);

      if (vehiclesRes.error) throw vehiclesRes.error;
      if (customersRes.error) throw customersRes.error;

      if (vehiclesRes.data) {
        setVehicles(vehiclesRes.data.map(v => ({
          ...v,
          customerId: v.customer_id || v.customerId,
          namaKendaraan: v.nama_kendaraan || v.namaKendaraan,
          noPlat: v.no_plat || v.noPlat
        })));
      }
      if (customersRes.data) setCustomers(customersRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Gagal mengambil data kendaraan atau pelanggan!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingId(item.id);
      setFormData(item);
    } else {
      setEditingId(null);
      setFormData({ customerId: customers[0]?.id || '', namaKendaraan: '', noPlat: '', keluhan: '' });
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus data kendaraan ini?')) {
      try {
        const { error } = await supabase.from('kendaraan').delete().eq('id', id);
        if (error) throw error;
        setVehicles(vehicles.filter(v => v.id !== id));
      } catch (error) {
        console.error('Error deleting:', error);
        alert('Gagal menghapus data kendaraan!');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const { error } = await supabase
          .from('kendaraan')
          .update({
            customer_id: formData.customerId,
            nama_kendaraan: formData.namaKendaraan,
            no_plat: formData.noPlat,
            keluhan: formData.keluhan
          })
          .eq('id', editingId);
        if (error) throw error;
        setVehicles(vehicles.map(v => v.id === editingId ? { ...formData, id: editingId } : v));
      } else {
        const { data, error } = await supabase
          .from('kendaraan')
          .insert([{
            customer_id: formData.customerId,
            nama_kendaraan: formData.namaKendaraan,
            no_plat: formData.noPlat,
            keluhan: formData.keluhan
          }])
          .select();
        if (error) throw error;
        if (data) {
           setVehicles([{
             ...data[0],
             customerId: data[0].customer_id,
             namaKendaraan: data[0].nama_kendaraan,
             noPlat: data[0].no_plat
           }, ...vehicles]);
        }
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Gagal menyimpan data kendaraan!');
    }
  };

  const getCustomerName = (id) => {
    const customer = customers.find(c => c.id === id);
    return customer ? customer.nama : 'Unknown';
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Data Kendaraan</h1>
          <p className="text-secondary mt-2">Kelola data kendaraan dan keluhan pelanggan.</p>
        </div>
        <button className="btn btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={20} />
          CREATE DATA
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Pemilik</th>
                <th>Nama Kendaraan</th>
                <th>No Plat</th>
                <th>Keluhan</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="text-secondary" style={{ textAlign: 'center', padding: '2rem 0' }}>
                    Memuat data...
                  </td>
                </tr>
              ) : vehicles.length > 0 ? vehicles.map((item, index) => {
                const customer = customers.find(c => c.id === item.customerId);
                return (
                <tr key={item.id}>
                  <td data-label="No">{index + 1}</td>
                  <td data-label="Pemilik" style={{ fontWeight: '600', color: 'var(--primary-color)' }}>{customer ? customer.nama : 'Unknown'}</td>
                  <td data-label="Kendaraan">{item.namaKendaraan}</td>
                  <td data-label="No Plat"><span className="badge">{item.noPlat}</span></td>
                  <td data-label="Keluhan">{item.keluhan}</td>
                  <td data-label="Aksi">
                    <div className="flex gap-2">
                      <button className="btn btn-outline" style={{ padding: '0.5rem' }} onClick={() => handleOpenModal(item)}>
                        <Edit2 size={16} />
                      </button>
                      <button className="btn btn-danger" style={{ padding: '0.5rem' }} onClick={() => handleDelete(item.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )}) : (
                <tr>
                  <td colSpan="6" className="text-secondary" style={{ textAlign: 'center', padding: '2rem 0' }}>
                    Belum ada data kendaraan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingId ? 'EDIT DATA KENDARAAN' : 'TAMBAH DATA KENDARAAN'}
      >
        <form onSubmit={handleSubmit}>
          {customers.length === 0 && (
            <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderLeft: '4px solid var(--danger-color)', color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
              Anda belum menambahkan pelanggan. Silakan tambah pelanggan terlebih dahulu.
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Pemilik (Pelanggan)</label>
            <CustomSelect 
               required 
               value={formData.customerId} 
               onChange={e => setFormData({...formData, customerId: e.target.value})}
               options={customers.map(c => ({ value: c.id, label: c.nama }))}
               placeholder="Pilih Pelanggan"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Nama Kendaraan (Merek/Tipe)</label>
            <input required type="text" className="form-input" value={formData.namaKendaraan} onChange={e => setFormData({...formData, namaKendaraan: e.target.value})} placeholder="Misal: Honda Beat" />
          </div>
          <div className="form-group">
            <label className="form-label">No Plat</label>
            <input required type="text" className="form-input" value={formData.noPlat} onChange={e => setFormData({...formData, noPlat: e.target.value})} placeholder="Misal: L 1234 XY" />
          </div>
          <div className="form-group">
            <label className="form-label">Keluhan</label>
            <textarea required className="form-input" value={formData.keluhan} onChange={e => setFormData({...formData, keluhan: e.target.value})} rows="3"></textarea>
          </div>
          <div className="flex justify-between mt-4">
            <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>BACK</button>
            <button type="submit" className="btn btn-primary" disabled={customers.length === 0}>SUBMIT</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Vehicles;
