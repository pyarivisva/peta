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
  });

  // 1. Tambahkan state untuk menampung file fisik
  const [imageFile, setImageFile] = useState(null);
  // State untuk preview gambar agar user bisa melihat apa yang dia pilih
  const [previewUrl, setPreviewUrl] = useState(null);

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
      });
      // Jika edit, tampilkan gambar lama sebagai preview jika ada
      setPreviewUrl(data.image_url || null);
    } else {
      setFormData({
        name: '', description: '', address: '', latitude: '', 
        longitude: '', type_id: '', phone: '', status: 'Open'
      });
      setPreviewUrl(null);
      setImageFile(null);
    }
  }, [data, isOpen]);

  // 2. Fungsi untuk menangani perubahan file
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Membuat URL sementara untuk menampilkan gambar di UI
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  if (!isOpen) return null;

  // 3. Modifikasi handleSubmit untuk menggunakan FormData
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const dataToSend = new FormData();
    dataToSend.append('name', formData.name);
    dataToSend.append('type_id', formData.type_id);
    dataToSend.append('latitude', formData.latitude);
    dataToSend.append('longitude', formData.longitude);
    dataToSend.append('description', formData.description);
    dataToSend.append('address', formData.address);
    dataToSend.append('phone', formData.phone);
    dataToSend.append('status', formData.status);
    
    // Kirim file hanya jika ada file yang dipilih
    if (imageFile) {
      dataToSend.append('image', imageFile);
    }

    onSubmit(dataToSend);
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="p-6 border-b flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-800">
            {mode === 'create' ? 'Tambah Lokasi Baru' : 'Edit Lokasi'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Nama Lokasi</label>
              <input 
                type="text" required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none transition-all"
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

          {/* 4. Bagian Upload Gambar Baru */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Foto Lokasi</label>
            <div className="flex items-center gap-4">
              {previewUrl && (
                <div className="w-24 h-24 rounded-2xl overflow-hidden border border-slate-200 flex-shrink-0">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <input 
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none bg-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
          </div>

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