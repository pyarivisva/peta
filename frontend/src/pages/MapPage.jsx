import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import InteractiveMap from '../components/InteractiveMap';
import CoordinateTable from '../components/CoordinateTable';
import AddMarkerModal from '../components/AddMarkerModal';
import FeedbackModal from '../components/FeedbackModal';

const API_URL = 'http://localhost:3000/api';

export default function MapPage({ token, isAdmin }) {
  const [markers, setMarkers] = useState([]);
  const [types, setTypes] = useState([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalCoords, setModalCoords] = useState({ lat: null, lng: null });

  const [feedback, setFeedback] = useState({ isOpen: false, isConfirm: false, title: '', message: '', onConfirmAction: null });

  const fetchMarkers = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/public/objects`);
      setMarkers(res.data);
    } catch (err) { console.error('Error load markers:', err); }
  }, []);

  const fetchTypes = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/types`);
      setTypes(res.data);
    } catch (err) { console.error('Error load types:', err); }
  }, []);

  // FIX ESLint Error: Membungkus dalam async function
  useEffect(() => {
    const loadInitialData = async () => {
      await fetchMarkers();
      await fetchTypes();
    };
    loadInitialData();
  }, [fetchMarkers, fetchTypes]);

  const showAlert = (title, message) => {
    setFeedback({ isOpen: true, isConfirm: false, title, message, onConfirmAction: null });
  };

  const showConfirm = (title, message, action) => {
    setFeedback({ isOpen: true, isConfirm: true, title, message, onConfirmAction: () => action() });
  };

  const handleMapClick = (lat, lng) => {
    if (isAdmin) {
      setModalCoords({ lat, lng });
      setIsModalOpen(true);
    } else {
      showAlert("Akses Ditolak", "Mode Publik aktif. Silakan login sebagai Admin untuk menandai lokasi baru di peta.");
    }
  };

  const handleAddMarker = async (name, typeId, lat, lng) => {
    try {
      await axios.post(`${API_URL}/objects`, 
        { name, latitude: lat, longitude: lng, type_id: parseInt(typeId) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchMarkers();
      setIsModalOpen(false);
    } catch (err) {
      console.error(err); // FIX ESLint Error: err digunakan
      showAlert("Gagal", "Tidak dapat menyimpan data lokasi. Periksa koneksi ke server.");
    }
  };

  const executeDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/objects/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMarkers();
    } catch (err) { 
      console.error(err); // FIX ESLint Error: err digunakan
      showAlert("Gagal", "Terjadi kesalahan saat menghapus data."); 
    }
  };

  const handleDeleteRequest = (id) => {
    if (!isAdmin) return;
    showConfirm("Hapus Lokasi", "Tindakan ini tidak dapat dibatalkan. Yakin ingin menghapus titik lokasi ini?", () => executeDelete(id));
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      
      <FeedbackModal 
        isOpen={feedback.isOpen}
        isConfirm={feedback.isConfirm}
        title={feedback.title}
        message={feedback.message}
        onClose={() => setFeedback({ ...feedback, isOpen: false })}
        onConfirm={feedback.onConfirmAction}
      />

      <AddMarkerModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleAddMarker}
        lat={modalCoords.lat}
        lng={modalCoords.lng}
        types={types}
      />

      <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
        {isAdmin && (
          <div style={{ marginBottom: '20px', padding: '12px 18px', backgroundColor: '#e6f7ff', border: '1px solid #91d5ff', borderRadius: '8px', color: '#0050b3', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>📍</span> <strong>Mode Admin:</strong> Klik pada peta untuk menandai objek baru secara presisi.
          </div>
        )}
        
        <InteractiveMap 
          markers={markers} 
          onAddMarker={handleMapClick} 
          onDeleteMarker={handleDeleteRequest}
          isAdmin={isAdmin} 
        />
      </div>

      <CoordinateTable 
        markers={markers} 
        onDeleteMarker={handleDeleteRequest}
        isAdmin={isAdmin} 
      />
    </div>
  );
}