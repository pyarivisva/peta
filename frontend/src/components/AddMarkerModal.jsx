import { useState } from 'react';

export default function AddMarkerModal({ isOpen, onClose, onSubmit, lat, lng, types }) {
  const [name, setName] = useState('');
  const [typeId, setTypeId] = useState('');

  // Jika modal tidak disuruh buka, jangan tampilkan apa-apa
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !typeId) {
      alert("Mohon isi semua data!");
      return;
    }
    // Kirim data ke fungsi handleAddMarker di MapPage
    onSubmit(name, typeId, lat, lng);
    
    // Reset form setelah kirim
    setName('');
    setTypeId('');
  };

  return (
    <div style={{ 
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', 
      backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', 
      justifyContent: 'center', alignItems: 'center', zIndex: 9999,
      backdropFilter: 'blur(2px)'
    }}>
      <div style={{ 
        backgroundColor: 'white', padding: '30px', borderRadius: '16px', 
        width: '100%', maxWidth: '400px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
        position: 'relative'
      }}>
        <h3 style={{ marginTop: 0, marginBottom: '10px', color: '#1a1a1a' }}>Tambah Titik Baru</h3>
        <p style={{ fontSize: '13px', color: '#666', marginBottom: '20px', backgroundColor: '#f5f5f5', padding: '8px', borderRadius: '6px' }}>
          📍 Koordinat: <span style={{ fontWeight: 'bold' }}>{lat?.toFixed(6)}, {lng?.toFixed(6)}</span>
        </p>
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
              Nama Lokasi / Objek
            </label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              required 
              placeholder="Masukkan nama tempat..." 
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box', fontSize: '15px' }} 
            />
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', fontSize: '14px', marginBottom: '8px', fontWeight: 'bold', color: '#333' }}>
              Kategori
            </label>
            <select 
              value={typeId} 
              onChange={e => setTypeId(e.target.value)} 
              required 
              style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box', fontSize: '15px', backgroundColor: 'white' }}
            >
              <option value="" disabled>-- Pilih Kategori --</option>
              {types.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button 
              type="button" 
              onClick={onClose} 
              style={{ padding: '10px 20px', border: 'none', background: '#f0f0f0', color: '#555', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Batal
            </button>
            <button 
              type="submit" 
              style={{ padding: '10px 20px', border: 'none', background: '#1890ff', color: 'white', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Simpan Lokasi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}