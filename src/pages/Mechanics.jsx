import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Modal from '../components/Modal';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const Mechanics = () => {
  const [mechanics, setMechanics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  
  const [formData, setFormData] = useState({
    nama: '',
    alamat: '',
    noTelp: ''
  });

  useEffect(() => {
    fetchMechanics();
  }, []);

  const fetchMechanics = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('mekanik')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      if (data) {
        setMechanics(data.map(m => ({
          ...m,
          noTelp: m.no_telp || m.noTelp
        })));
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Gagal mengambil data mekanik!');
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
      setFormData({ nama: '', alamat: '', noTelp: '' });
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Yakin ingin menghapus data mekanik ini?')) {
      try {
        const { error } = await supabase.from('mekanik').delete().eq('id', id);
        if (error) throw error;
        setMechanics(mechanics.filter(m => m.id !== id));
      } catch (error) {
        console.error('Error deleting:', error);
        alert('Gagal menghapus data mekanik!');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const { error } = await supabase
          .from('mekanik')
          .update({
            nama: formData.nama,
            alamat: formData.alamat,
            no_telp: formData.noTelp
          })
          .eq('id', editingId);
        if (error) throw error;
        
        setMechanics(mechanics.map(m => m.id === editingId ? { ...formData, id: editingId } : m));
      } else {
        const { data, error } = await supabase
          .from('mekanik')
          .insert([{
            nama: formData.nama,
            alamat: formData.alamat,
            no_telp: formData.noTelp
          }])
          .select();
        if (error) throw error;
        if (data) {
          setMechanics([{
            ...data[0],
            noTelp: data[0].no_telp
          }, ...mechanics]);
        }
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Gagal menyimpan data mekanik!');
    }
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
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="text-secondary" style={{ textAlign: 'center', padding: '2rem 0' }}>
                    Memuat data...
                  </td>
                </tr>
              ) : mechanics.length > 0 ? mechanics.map((item, index) => (
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
