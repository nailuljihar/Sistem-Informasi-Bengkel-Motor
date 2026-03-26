import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import Modal from '../components/Modal';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const Mechanics = () => {
  const [mechanics, setMechanics] = useLocalStorage('bengkel_mechanics', []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    nama: '',
    alamat: '',
    noTelp: ''
  });

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingId(item.id);
      setFormData(item);
    } else {
      setEditingId(null);
      setFormData({ nama: '', alamat: '', noTelp: '' });
    }
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Yakin ingin menghapus data mekanik ini?')) {
      setMechanics(mechanics.filter(m => m.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setMechanics(mechanics.map(m => m.id === editingId ? { ...formData, id: editingId } : m));
    } else {
      setMechanics([...mechanics, { ...formData, id: Date.now().toString() }]);
    }
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Data Mekanik</h1>
          <p className="text-secondary mt-2">Kelola informasi staf mekanik.</p>
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
                <th>Nama Mekanik</th>
                <th>Alamat</th>
                <th>No Telp</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {mechanics.length > 0 ? mechanics.map((item, index) => (
                <tr key={item.id}>
                  <td data-label="No">{index + 1}</td>
                  <td data-label="Nama Mekanik" style={{ fontWeight: '600' }}>{item.nama}</td>
                  <td data-label="Alamat">{item.alamat}</td>
                  <td data-label="No Telp">{item.noTelp}</td>
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
              )) : (
                <tr>
                  <td colSpan="5" className="text-secondary" style={{ textAlign: 'center', padding: '2rem 0' }}>
                    Belum ada data mekanik.
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
        title={editingId ? 'EDIT DATA MEKANIK' : 'TAMBAH DATA MEKANIK'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nama Mekanik</label>
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
          <div className="flex justify-between mt-4">
            <button type="button" className="btn btn-outline" onClick={() => setIsModalOpen(false)}>BACK</button>
            <button type="submit" className="btn btn-primary">SUBMIT</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Mechanics;
