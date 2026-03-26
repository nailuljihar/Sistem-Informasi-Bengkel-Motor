import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import Modal from '../components/Modal';
import CustomSelect from '../components/CustomSelect';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const Customers = () => {
  const [customers, setCustomers] = useLocalStorage('bengkel_customers', []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    nama: '',
    alamat: '',
    noTelp: '',
    jenisKelamin: 'Laki-Laki'
  });

  const handleOpenModal = (customer = null) => {
    if (customer) {
      setEditingId(customer.id);
      setFormData(customer);
    } else {
      setEditingId(null);
      setFormData({ nama: '', alamat: '', noTelp: '', jenisKelamin: 'Laki-Laki' });
    }
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Yakin ingin menghapus data pelanggan ini?')) {
      setCustomers(customers.filter(c => c.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setCustomers(customers.map(c => c.id === editingId ? { ...formData, id: editingId } : c));
    } else {
      setCustomers([...customers, { ...formData, id: Date.now().toString() }]);
    }
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Data Pelanggan</h1>
          <p className="text-secondary mt-2">Kelola data pelanggan yang terdaftar.</p>
        </div>
        <div className="flex gap-4">
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            <Plus size={20} />
            CREATE DATA
          </button>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama Pelanggan</th>
                <th>Alamat</th>
                <th>No Telp</th>
                <th>Jenis Kelamin</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {customers.length > 0 ? customers.map((customer, index) => (
                <tr key={customer.id}>
                  <td data-label="No">{index + 1}</td>
                  <td data-label="Nama Pelanggan" style={{ fontWeight: '600' }}>{customer.nama}</td>
                  <td data-label="Alamat">{customer.alamat}</td>
                  <td data-label="No Telp">{customer.noTelp}</td>
                  <td data-label="Jenis Kelamin">{customer.jenisKelamin}</td>
                  <td data-label="Aksi">
                    <div className="flex gap-2">
                      <button className="btn btn-outline" style={{ padding: '0.5rem' }} onClick={() => handleOpenModal(customer)}>
                        <Edit2 size={16} />
                      </button>
                      <button className="btn btn-danger" style={{ padding: '0.5rem' }} onClick={() => handleDelete(customer.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-secondary" style={{ textAlign: 'center', padding: '2rem 0' }}>
                    Belum ada data pelanggan.
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
        title={editingId ? 'EDIT DATA PELANGGAN' : 'TAMBAH DATA PELANGGAN'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nama Lengkap</label>
            <input required type="text" className="form-input" value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Alamat</label>
            <input required type="text" className="form-input" value={formData.alamat} onChange={e => setFormData({...formData, alamat: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">No Telp</label>
            <input required type="text" className="form-input" value={formData.noTelp} onChange={e => setFormData({...formData, noTelp: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Jenis Kelamin</label>
            <CustomSelect 
               required
               value={formData.jenisKelamin} 
               onChange={e => setFormData({...formData, jenisKelamin: e.target.value})}
               options={[
                 { value: 'Laki-Laki', label: 'Laki-Laki' },
                 { value: 'Perempuan', label: 'Perempuan' }
               ]}
               placeholder="Pilih Jenis Kelamin"
            />
          </div>
          <div className="flex justify-between mt-4">
            <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>BACK</button>
            <button type="submit" className="btn btn-primary">SUBMIT</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Customers;
