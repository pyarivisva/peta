import React, { useState, useEffect } from 'react';
import api from '../../api/axiosConfig';
import { 
  FoodFormFields, 
  NatureFormFields, 
  AccommodationFormFields, 
  HealthcareFormFields, 
  EducationFormFields 
} from '../clusters/FormFields';

const BASE_URL = 'http://localhost:3000';

export default function ObjectFormModal({ isOpen, onClose, onSubmit, mode, data, types, clusters }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    address: '',
    latitude: '',
    longitude: '',
    type_id: '',
    phone: '',
    status: 'Open',
    details: {}
  });

  const [clusterName, setClusterName] = useState('');
  const [selectedClusterId, setSelectedClusterId] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  // PRD-2: State for new fields
  const [menuImageFile, setMenuImageFile] = useState(null);
  const [menuPreviewUrl, setMenuPreviewUrl] = useState('');
  
  // Master data for checklists
  const [masterFacilities, setMasterFacilities] = useState([]);
  const [masterHealthcareTypes, setMasterHealthcareTypes] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetchMasterData();
    }
  }, [isOpen]);

  const fetchMasterData = async () => {
    try {
      const [resF, resH] = await Promise.all([
        api.get('/facilities'),
        api.get('/healthcare-master-types')
      ]);
      setMasterFacilities(resF.data);
      setMasterHealthcareTypes(resH.data);
    } catch (err) {
      console.error("Gagal memuat data master checklist:", err);
    }
  };

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
        details: data.details || {}
      });
      setClusterName(data.cluster_name || '');
      
      const foundType = types.find(t => t.id === data.type_id);
      setSelectedClusterId(foundType ? foundType.cluster_id : '');
      
      let rawImages = data.images || (data.image_url ? [data.image_url] : []);
      rawImages = rawImages.filter(img => img !== null && img !== '');
      setExistingImages(rawImages);
      setPreviewUrls([]);
      setImageFiles([]);

      // Reset menu image
      setMenuImageFile(null);
      setMenuPreviewUrl(data.details?.menu_image_url || '');
    } else {
      setFormData({
        name: '', description: '', address: '', latitude: '', 
        longitude: '', type_id: '', phone: '', status: 'Open',
        details: {
          facility_ids: [],
          healthcare_type_ids: [],
          open_time: '08:00',
          close_time: '22:00'
        }
      });
      setClusterName('');
      setSelectedClusterId('');
      setPreviewUrls([]);
      setImageFiles([]);
      setExistingImages([]);
      setMenuImageFile(null);
      setMenuPreviewUrl('');
    }
  }, [data, isOpen]);

  const handleClusterChange = (e) => {
    const clusterId = parseInt(e.target.value);
    const selectedCluster = clusters.find(c => c.id === clusterId);
    
    setSelectedClusterId(clusterId);
    setClusterName(selectedCluster ? selectedCluster.name : '');
    
    // Reset specific category when cluster changes
    setFormData(prev => ({
        ...prev,
        type_id: '',
        details: {
            ...prev.details,
            facility_ids: [],
            healthcare_type_ids: []
        }
    }));
  };

  const handleTypeChange = (e) => {
    const val = e.target.value;
    setFormData(prev => ({ 
      ...prev, 
      type_id: val
    }));
  };

  const handleDetailChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      details: {
        ...prev.details,
        [key]: value
      }
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setImageFiles(prev => [...prev, ...files]);
      const urls = files.map(file => URL.createObjectURL(file));
      setPreviewUrls(prev => [...prev, ...urls]);
    }
    e.target.value = null; 
  };

  const handleMenuImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMenuImageFile(file);
      setMenuPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeNewFile = (idxToRemove) => {
    setImageFiles(prev => prev.filter((_, i) => i !== idxToRemove));
    setPreviewUrls(prev => prev.filter((_, i) => i !== idxToRemove));
  };

  if (!isOpen) return null;

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
    dataToSend.append('cluster_name', clusterName);
    
    // Ensure detail fields are consistent
    const finalDetails = { ...formData.details };
    // Remove temporary objects if any
    delete finalDetails.facility_list;
    delete finalDetails.healthcare_type_list;
    
    dataToSend.append('details', JSON.stringify(finalDetails));
    
    if (imageFiles && imageFiles.length > 0) {
      imageFiles.forEach(file => {
        dataToSend.append('images', file);
      });
    }

    if (menuImageFile) {
      dataToSend.append('menu_image', menuImageFile);
    }

    dataToSend.append('kept_images', JSON.stringify(existingImages));

    onSubmit(dataToSend);
  };

  const renderClusterFields = () => {
    const props = { 
      details: formData.details, 
      onChange: handleDetailChange,
      onMenuImageChange: handleMenuImageChange,
      menuPreviewUrl: menuPreviewUrl,
      masterFacilities,
      masterHealthcareTypes
    };
    switch (clusterName) {
      case 'Restoran':
      case 'Food & Beverage':
      case 'Food':
        return <FoodFormFields {...props} />;
      case 'Alam':
      case 'Nature & Outdoor':
      case 'Nature':
        return <NatureFormFields {...props} />;
      case 'Accommodation':
        return <AccommodationFormFields {...props} />;
      case 'Healthcare':
        return <HealthcareFormFields {...props} />;
      case 'Education':
        return <EducationFormFields {...props} />;
      default:
        return null;
    }
  };

  const getImageUrl = (url) => url && url.startsWith('/uploads') ? `${BASE_URL}${url}` : url;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        
        <div className="p-6 border-b flex justify-between items-center bg-slate-50">
          <div className="flex flex-col">
            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">
              {mode === 'create' ? 'Tambah Lokasi Baru' : 'Perbarui Lokasi'}
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Sistem Informasi Geografis Bali</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all font-bold">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 overflow-y-auto space-y-8 custom-scrollbar">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Lokasi</label>
              <input 
                type="text" required
                placeholder="Masukkan nama resmi lokasi"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-semibold text-slate-700"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Pilih Rumpun (Cluster)</label>
              <select 
                required
                value={selectedClusterId}
                onChange={handleClusterChange}
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none bg-white font-semibold text-slate-700 cursor-pointer"
              >
                <option value="">-- Pilih Rumpun --</option>
                {clusters.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Pilih Kategori Spesifik</label>
              <select 
                required
                disabled={!selectedClusterId}
                value={formData.type_id}
                onChange={handleTypeChange}
                className={`w-full px-5 py-4 rounded-2xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none bg-white font-semibold text-slate-700 cursor-pointer ${!selectedClusterId ? 'opacity-50 cursor-not-allowed bg-slate-50' : ''}`}
              >
                <option value="">{selectedClusterId ? '-- Pilih Kategori --' : 'Pilih Rumpun Dahulu'}</option>
                {types.filter(t => t.cluster_id === parseInt(selectedClusterId)).map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Koordinat Latitude</label>
              <input 
                type="number" step="any" required
                value={formData.latitude}
                onChange={(e) => setFormData({...formData, latitude: e.target.value})}
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 outline-none font-mono text-sm text-slate-500 focus:bg-white transition-all focus:border-blue-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Koordinat Longitude</label>
              <input 
                type="number" step="any" required
                value={formData.longitude}
                onChange={(e) => setFormData({...formData, longitude: e.target.value})}
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50 outline-none font-mono text-sm text-slate-500 focus:bg-white transition-all focus:border-blue-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Alamat Lengkap</label>
            <textarea 
              rows="2"
              placeholder="Jl. Raya Utama No. 123, Denpasar, Bali"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none resize-none font-medium text-slate-700"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nomor Telepon / WhatsApp</label>
              <input 
                type="text"
                placeholder="+62 812 XXXX"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none font-semibold text-slate-700"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Status Operasional</label>
              <select 
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none bg-white font-semibold text-slate-700 cursor-pointer"
              >
                <option value="Open">Beroperasi (Open)</option>
                <option value="Closed">Tutup Sementara (Closed)</option>
                <option value="Under Renovation">Dalam Renovasi</option>
              </select>
            </div>
          </div>

          {/* DYNAMIC CLUSTER FIELDS */}
          <div className="bg-slate-50/50 p-6 rounded-[2rem] border border-slate-100 shadow-inner">
            {renderClusterFields()}
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Deskripsi Tambahan</label>
            <textarea 
              rows="3"
              placeholder="Tambahkan informasi penting seperti daya tarik utama atau tips berkunjung..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none resize-none font-medium text-slate-700"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Galeri Foto Lokasi (Maks. 5)</label>
            <div className="flex flex-col gap-4">
              {(existingImages.length > 0 || previewUrls.length > 0) && (
                <div className="flex gap-3 flex-wrap">
                  {existingImages.map((url, idx) => (
                    <div key={`exist-${idx}`} className="relative w-28 h-28 rounded-2xl overflow-hidden border border-slate-200 flex-shrink-0 group shadow-md">
                      <img src={getImageUrl(url)} alt={`Existing ${idx}`} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setExistingImages(prev => prev.filter((_, i) => i !== idx))} className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">✕</button>
                    </div>
                  ))}
                  {previewUrls.map((url, idx) => (
                    <div key={`new-${idx}`} className="relative w-28 h-28 rounded-2xl overflow-hidden border-blue-400 border-2 border-dashed flex-shrink-0 group shadow-md bg-blue-50/50">
                      <img src={url} alt={`New Preview ${idx}`} className="w-full h-full object-cover opacity-80" />
                      <div className="absolute top-2 left-2 bg-blue-500 text-white text-[8px] px-2 py-0.5 rounded-full font-black shadow-md uppercase tracking-wider">Baru</div>
                      <button type="button" onClick={() => removeNewFile(idx)} className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-lg">✕</button>
                    </div>
                  ))}
                </div>
              )}
              <div className="relative">
                <input 
                    type="file" accept="image/*" multiple
                    onChange={handleFileChange}
                    id="file-upload"
                    className="hidden"
                />
                <label htmlFor="file-upload" className="flex items-center justify-center gap-3 w-full px-5 py-4 rounded-2xl border-2 border-dashed border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all cursor-pointer group text-slate-400 hover:text-blue-600">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                    <span className="font-bold text-sm">Klik untuk mengunggah foto galeri</span>
                </label>
              </div>
            </div>
          </div>

          <div className="pt-6 flex gap-4">
            <button 
              type="button" onClick={onClose}
              className="flex-1 py-4 px-6 rounded-2xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 hover:text-slate-800 transition-all active:scale-95"
            >
              Batalkan
            </button>
            <button 
              type="submit"
              className="flex-[2] py-4 px-6 rounded-2xl bg-blue-600 text-white font-black uppercase tracking-widest text-sm hover:bg-blue-700 shadow-xl shadow-blue-300 transition-all active:scale-95"
            >
              {mode === 'create' ? 'Simpan Lokasi' : 'Perbarui Data'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}