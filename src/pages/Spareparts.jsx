import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import Modal from '../components/Modal';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const Spareparts = () => {
  const [spareparts, setSpareparts] = useLocalStorage('bengkel_spareparts', []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    nama: '',
    stok: 0,
    harga: 0
  });

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingId(item.id);
      setFormData(item);
    } else {
      setEditingId(null);
      setFormData({ nama: '', stok: 0, harga: 0 });
    }
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Yakin ingin menghapus data sparepart ini?')) {
      setSpareparts(spareparts.filter(s => s.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      setSpareparts(spareparts.map(s => s.id === editingId ? { ...formData, id: editingId } : s));
    } else {
      setSpareparts([...spareparts, { ...formData, id: Date.now().toString() }]);
    }
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Data Sparepart</h1>
          <p className="text-secondary mt-2">Kelola persediaan stok barang dan harga.</p>
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
                <th>Nama Sparepart</th>
                <th>Stok</th>
                <th>Harga Satuan (Rp)</th>
                <th>Kategori</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {spareparts.length > 0 ? spareparts.map((item, index) => (
                <tr key={item.id}>
                  <td data-label="No">{index + 1}</td>
                  <td data-label="Nama Sparepart" style={{ fontWeight: '600' }}>{item.nama}</td>
                  <td data-label="Harga">Rp {item.harga?.toLocaleString('id-ID')}</td>
                  <td data-label="Stok">
                    <span className={`badge ${item.stok <= 5 ? 'badge-danger' : 'badge-success'}`}>
                      {item.stok}
                    </span>
                  </td>
                  <td data-label="Kategori">{item.kategori || 'Umum'}</td>
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
                    Belum ada data sparepart.
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
        title={editingId ? 'EDIT DATA SPAREPART' : 'TAMBAH DATA SPAREPART'}
      >
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nama Sparepart</label>
            <input required type="text" className="form-input" value={formData.nama} onChange={e => setFormData({...formData, nama: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Jumlah Stok</label>
            <input required type="number" min="0" className="form-input" value={formData.stok} onChange={e => setFormData({...formData, stok: parseInt(e.target.value) || 0})} />
          </div>
          <div className="form-group">
            <label className="form-label">Harga Satuan (Rp)</label>
            <input required type="number" min="0" className="form-input" value={formData.harga} onChange={e => setFormData({...formData, harga: parseInt(e.target.value) || 0})} />
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

export default Spareparts;
