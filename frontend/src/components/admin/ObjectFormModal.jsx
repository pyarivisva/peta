import React, { useState, useEffect } from 'react';

const BASE_URL = 'http://localhost:3000';

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
  const [imageFiles, setImageFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

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
      // Filter out nulls
      let rawImages = data.images || (data.image_url ? [data.image_url] : []);
      rawImages = rawImages.filter(img => img !== null && img !== '');
      setExistingImages(rawImages);
      setPreviewUrls([]);
      setImageFiles([]);
    } else {
      setFormData({
        name: '', description: '', address: '', latitude: '', 
        longitude: '', type_id: '', phone: '', status: 'Open'
      });
      setPreviewUrls([]);
      setImageFiles([]);
      setExistingImages([]);
    }
  }, [data, isOpen]);

  const getImageUrl = (url) => url && url.startsWith('/uploads') ? `${BASE_URL}${url}` : url;

  // 2. Fungsi untuk menangani perubahan file (Cumulatif/Append)
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setImageFiles(prev => [...prev, ...files]);
      // Membuat URL sementara untuk menampilkan gambar di UI
      const urls = files.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...urls]);
    }
    // Mengosongkan input file agar file yang sama bisa di-drag/pilih lagi jika dihapus
    e.target.value = null; 
  };

  const removeNewFile = (idxToRemove) => {
    setImageFiles(prev => prev.filter((_, i) => i !== idxToRemove));
    setPreviewUrls(prev => prev.filter((_, i) => i !== idxToRemove));
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
    if (imageFiles && imageFiles.length > 0) {
      imageFiles.forEach(file => {
        dataToSend.append('images', file);
      });
    }

    // Mengirim array gambar lama yang masih dipertahankan
    dataToSend.append('kept_images', JSON.stringify(existingImages));

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
            <div className="flex flex-col gap-4">
              {(existingImages.length > 0 || previewUrls.length > 0) && (
                <div className="flex gap-2 flex-wrap">
                  {existingImages.map((url, idx) => (
                    <div key={`exist-${idx}`} className="relative w-24 h-24 rounded-2xl overflow-hidden border border-slate-200 flex-shrink-0 group">
                      <img src={getImageUrl(url)} alt={`Existing ${idx}`} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setExistingImages(prev => prev.filter((_, i) => i !== idx))} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                    </div>
                  ))}
                  {previewUrls.map((url, idx) => (
                    <div key={`new-${idx}`} className="relative w-24 h-24 rounded-2xl overflow-hidden border-blue-400 border-2 border-dashed flex-shrink-0 group">
                      <img src={url} alt={`New Preview ${idx}`} className="w-full h-full object-cover opacity-80" />
                      <div className="absolute top-1 left-1 bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-md">Baru</div>
                      <button type="button" onClick={() => removeNewFile(idx)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow">✕</button>
                    </div>
                  ))}
                </div>
              )}
              <input 
                type="file"
                accept="image/*"
                multiple
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