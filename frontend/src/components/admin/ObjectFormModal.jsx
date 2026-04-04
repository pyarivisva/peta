import React, { useState, useEffect } from 'react';

export default function ObjectFormModal({ isOpen, onClose, onSubmit, mode, data, types }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    latitude: '',
    longitude: '',
    type_id: '',
    phone: '',
    status: 'Open',
    image_url: ''
  });

  // Sinkronisasi data saat modal dibuka (untuk Edit atau Klik Peta)
  useEffect(() => {
    if (data) {
      setFormData({
        name: data.name || '',
        description: data.description || '',
        address: data.address || '',
        latitude: data.latitude || '',
        longitude: data.longitude || '',
        type_id: data.type_id || '',
        phone: data.phone || '',
        status: data.status || 'Open',
        image_url: data.image_url || ''
      });
    } else {
      // Reset jika Create murni
      setFormData({
        name: '', description: '', address: '', latitude: '', 
        longitude: '', type_id: '', phone: '', status: 'Open', image_url: ''
      });
    }
  }, [data, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800">
            {mode === 'create' ? 'Tambah Lokasi Baru 📍' : 'Edit Lokasi 📝'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl">✕</button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nama & Tipe */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Nama Lokasi</label>
              <input 
                type="text" required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none transition-all"
                placeholder="Contoh: Pura Uluwatu"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Kategori</label>
              <select 
                required
                value={formData.type_id}
                onChange={(e) => setFormData({...formData, type_id: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none bg-white"
              >
                <option value="">Pilih Kategori</option>
                {types.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            {/* Koordinat (Readonly jika dari Klik Peta) */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Latitude</label>
              <input 
                type="number" step="any" required
                value={formData.latitude}
                onChange={(e) => setFormData({...formData, latitude: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Longitude</label>
              <input 
                type="number" step="any" required
                value={formData.longitude}
                onChange={(e) => setFormData({...formData, longitude: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none"
              />
            </div>
          </div>

          {/* Alamat & Deskripsi */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Alamat Lengkap</label>
            <textarea 
              rows="2"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none resize-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Deskripsi</label>
            <textarea 
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Nomor Telepon</label>
              <input 
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                placeholder="0812..."
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Status Operasional</label>
              <select 
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none bg-white"
              >
                <option value="Open">Buka (Open)</option>
                <option value="Closed">Tutup (Closed)</option>
                <option value="Under Renovation">Renovasi</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">URL Gambar Utama</label>
            <input 
              type="url"
              value={formData.image_url}
              onChange={(e) => setFormData({...formData, image_url: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 flex gap-3">
            <button 
              type="button" onClick={onClose}
              className="flex-1 py-4 px-6 rounded-2xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-all"
            >
              Batal
            </button>
            <button 
              type="submit"
              className="flex-[2] py-4 px-6 rounded-2xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all active:scale-95"
            >
              {mode === 'create' ? 'Simpan Lokasi' : 'Perbarui Data'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}