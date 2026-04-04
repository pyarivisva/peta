import { useState, useEffect, useCallback } from 'react';
import api from '../api/axiosConfig';
import InteractiveMap from '../components/admin/InteractiveMap';
import CoordinateTable from '../components/CoordinateTable';
import AddMarkerModal from '../components/AddMarkerModal';
import FeedbackModal from '../components/FeedbackModal';
import Loading from '../components/Loading';

export default function Dashboard() {
  const [markers, setMarkers] = useState([]);
  const [types, setTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalCoords, setModalCoords] = useState({ lat: null, lng: null });
  const [feedback, setFeedback] = useState({ isOpen: false, isConfirm: false, title: '', message: '', onConfirmAction: null });

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [resMarkers, resTypes] = await Promise.all([
        api.get('/public/objects'),
        api.get('/types')
      ]);
      setMarkers(resMarkers.data);
      setTypes(resTypes.data);
    } catch (err) { console.error(err); }
    finally { setIsLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleMapClick = (lat, lng) => {
    setModalCoords({ lat, lng });
    setIsModalOpen(true);
  };

  const handleAddMarker = async (name, typeId, lat, lng) => {
    try {
      await api.post('/objects', { name, latitude: lat, longitude: lng, type_id: parseInt(typeId) });
      fetchData();
      setIsModalOpen(false);
    } catch (err) { setFeedback({ isOpen: true, title: 'Gagal', message: 'Gagal simpan data.' }); }
  };

  const handleDeleteRequest = (id) => {
    setFeedback({
      isOpen: true, isConfirm: true, title: 'Hapus?', message: 'Yakin hapus lokasi ini?',
      onConfirmAction: async () => {
        try {
          await api.delete(`/objects/${id}`);
          fetchData();
        } catch (err) { console.error(err); }
      }
    });
  };

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden' }}>
      <FeedbackModal {...feedback} onClose={() => setFeedback({ ...feedback, isOpen: false })} onConfirm={feedback.onConfirmAction} />
      <AddMarkerModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleAddMarker} {...modalCoords} types={types} />

      <div style={{ width: '450px', backgroundColor: 'white', borderRight: '1px solid #ddd', display: 'flex', flexDirection: 'column', padding: '20px', overflowY: 'auto' }}>
        <h2 style={{ marginBottom: '10px' }}>Manajemen Peta</h2>
        {isLoading && <Loading />}
        <CoordinateTable markers={markers} onDeleteMarker={handleDeleteRequest} isAdmin={true} />
      </div>

      <div style={{ flex: 1, position: 'relative' }}>
        <InteractiveMap markers={markers} onAddMarker={handleMapClick} isAdmin={true} />
      </div>
    </div>
  );
}