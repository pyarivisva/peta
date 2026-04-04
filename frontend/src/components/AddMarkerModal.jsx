import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import Loading from './Loading';

export default function AddMarkerModal({ isOpen, onClose, onSuccess, coords }) {
  const [name, setName] = useState('');
  const [typeId, setTypeId] = useState('');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('');
  const [types, setTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingTypes, setIsFetchingTypes] = useState(true);

  // Ambil daftar kategori dari backend saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      const fetchTypes = async () => {
        setIsFetchingTypes(true);
        try {
          const res = await api.get('/types');
          setTypes(res.data);
        } catch (error) {
          console.error("Gagal mengambil data kategori:", error);
        } finally {
          setIsFetchingTypes(false);
        }
      };
      fetchTypes();
    }
  }, [isOpen]);

  if (!isOpen || !coords) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !typeId) {
      alert("Nama dan Kategori wajib diisi!");
      return;
    }

    setIsLoading(true);
    try {
      await api.post('/objects', {
        name,
        type_id: parseInt(typeId),
        latitude: coords.lat,
        longitude: coords.lng,
        description,
        address
      });
      
      setName('');
      setTypeId('');
      setDescription('');
      setAddress('');
      
      onSuccess();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Terjadi kesalahan saat menyimpan lokasi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-[9999] px-4">
      
      {isLoading && <Loading fullScreen={true} />}

      <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl relative">
        <h3 className="text-xl font-bold text-gray-800 mb-2">Tambah Titik Baru</h3>
        
        <div className="text-sm text-gray-600 bg-gray-100 p-3 rounded-lg mb-5 flex items-center gap-2">
          <span>📍</span>
          <span>
            Koordinat: <strong className="text-blue-600">{coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}</strong>
          </span>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Nama Lokasi / Objek <span className="text-red-500">*</span></label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              required 
              placeholder="Contoh: Pantai Kuta" 
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Kategori <span className="text-red-500">*</span></label>
            <select 
              value={typeId} 
              onChange={e => setTypeId(e.target.value)} 
              required 
              disabled={isFetchingTypes}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none bg-white disabled:bg-gray-100"
            >
              {isFetchingTypes ? (
                <option value="">Memuat kategori...</option>
              ) : (
                <>
                  <option value="" disabled>-- Pilih Kategori --</option>
                  {types.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </>
              )}
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Alamat Singkat</label>
            <input 
              type="text" 
              value={address} 
              onChange={e => setAddress(e.target.value)} 
              placeholder="Contoh: Jl. Pantai Kuta, Badung" 
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none" 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Deskripsi</label>
            <textarea 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              placeholder="Tambahkan detail informasi tempat ini..." 
              rows="2"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none resize-none" 
            ></textarea>
          </div>

          <div className="flex gap-3 justify-end pt-4 mt-2 border-t">
            <button 
              type="button" 
              onClick={onClose}
              disabled={isLoading}
              className="px-5 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-bold transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button 
              type="submit" 
              disabled={isLoading || isFetchingTypes}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold transition-colors disabled:opacity-50"
            >
              Simpan Lokasi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}