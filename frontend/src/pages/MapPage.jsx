import { useState, useEffect, useCallback, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig'; 
import InteractiveMap from '../components/common/InteractiveMap'; // Path disesuaikan
import InfoPanel from '../components/InfoPanel'; 
import NavRail from '../components/NavRail'; 
import Navbar from '../components/Navbar';
import SavedPanel from '../components/SavedPanel';
import HistoryPanel from '../components/HistoryPanel';
import ManagementPanel from '../components/admin/ManagementPanel'; // Komponen baru
import ObjectFormModal from '../components/admin/ObjectFormModal'; // Komponen baru
import { useLocalStorage } from '../hooks/useLocalStorage';
import SettingsPanel from '../components/SettingsPanel';
import FeedbackModal from '../components/common/FeedbackModal'; // Reuse
import Loading from '../components/common/Loading'; // Reuse
import { ThemeContext } from '../context/ThemeContext';

export default function MapPage({ isAdmin = false }) {
  const [markers, setMarkers] = useState([]);
  const [filteredMarkers, setFilteredMarkers] = useState([]);
  const [types, setTypes] = useState([]); // State untuk kategori dari DB
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // State UI & Side Panels
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isRailExpanded, setIsRailExpanded] = useState(false); 
  const [activeSidePanel, setActiveSidePanel] = useState(null);

  // State Admin CRUD
  const [formModal, setFormModal] = useState({ isOpen: false, mode: 'create', data: null });
  const [feedback, setFeedback] = useState({ isOpen: false, isConfirm: false, title: '', message: '', onConfirm: null });

  const [savedIds, setSavedIds] = useLocalStorage('bali_gis_saved', []);
  const [historyIds, setHistoryIds] = useLocalStorage('bali_gis_history', []);   
  
  const mapRef = useRef(null);
  const navigate = useNavigate();
  const { activeTheme, setActiveTheme } = useContext(ThemeContext);

  // 1. Load Data (Admin ambil data private, Public ambil data public)
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const endpoint = isAdmin ? '/objects' : '/public/objects';
      const [resMarkers, resTypes] = await Promise.all([
        api.get(endpoint),
        api.get('/types')
      ]);
      setMarkers(resMarkers.data);
      setFilteredMarkers(resMarkers.data);
      setTypes(resTypes.data);
    } catch (err) { 
      console.error(err); 
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // 2. Handler Seleksi & History
  const handleSelectLocation = (location) => {
    setSelectedLocation(location);
    setIsPanelOpen(true);
    setActiveSidePanel(null);
    if (!isAdmin) addToHistory(location.id);
    if (mapRef.current && location.latitude && location.longitude) {
        mapRef.current.flyTo([location.latitude, location.longitude], 15);
    }
  };

  // 3. Handler Admin (Create, Update, Delete)
  const handleMapClick = (lat, lng) => {
    if (!isAdmin) return;
    setFormModal({ 
    isOpen: true, 
    mode: 'create', 
    data: { 
      latitude: lat, 
      longitude: lng,
      name: '',
      type_id: '',
      address: '',
      description: ''
    } 
  });
  };

  const handleEditRequest = (location) => {
    setFormModal({ isOpen: true, mode: 'edit', data: location });
  };

  const handleDeleteRequest = (id) => {
    setFeedback({
      isOpen: true,
      isConfirm: true,
      title: 'Hapus Lokasi?',
      message: 'Data ini akan dihapus permanen dari server.',
      onConfirm: async () => {
        try {
          setIsLoading(true);
          await api.delete(`/objects/${id}`);
          fetchData();
          setFeedback({
          isOpen: true,
          title: 'Terhapus',
          message: 'Lokasi telah berhasil dihapus.',
          isConfirm: false,
          onConfirm: null
          });
          // setFeedback({ isOpen: false });
        } catch (err) {
          console.error(err);
          setFeedback({
          isOpen: true,
          isConfirm: false,
          title: 'Gagal',
          message: 'Gagal menghapus data dari server.',
        });
      } finally {
        setIsLoading(false);
      }
      }
    });
  };

  const handleFormSubmit = async (formData) => {
    setFormModal({ ...formModal, isOpen: false });
    try {
      setIsLoading(true);
      const payload = {
      name: formData.name,
      description: formData.description || '',
      address: formData.address || '',
      latitude: parseFloat(formData.latitude),       
      longitude: parseFloat(formData.longitude),   
      type_id: parseInt(formData.type_id),          
      tags: []                                      
    };

      if (formModal.mode === 'create') {
      await api.post('/objects', payload);
      setFeedback({
        isOpen: true,
        title: 'Berhasil!',
        message: 'Lokasi baru telah berhasil ditambahkan ke peta.',
        isConfirm: false
      });

      } else {
      await api.put(`/objects/${formModal.data.id}`, payload);
      setFeedback({
        isOpen: true,
        title: 'Update Berhasil',
        message: 'Data lokasi telah diperbarui.',
        isConfirm: false
      });
      }

      fetchData();
      setFormModal({ isOpen: false, mode: 'create', data: null });
    } catch (err) {
    console.error(err);
    setFeedback({
      isOpen: true,
      title: 'Gagal',
      message: err.response?.data?.message || 'Terjadi kesalahan pada server.',
      isConfirm: false
    });
  } finally {
    setIsLoading(false);
  }
};

  // Filter & Search Logic
  const handleSearch = (query) => {
    const filtered = markers.filter(m => m.name.toLowerCase().includes(query.toLowerCase()));
    setFilteredMarkers(filtered);
  };

  const handleSelectCategory = (category) => {
    const filtered = category === 'Semua' ? markers : markers.filter(m => m.type_name === category);
    setFilteredMarkers(filtered);
  };

  const addToHistory = (id) => {
    setHistoryIds((prev) => {
      const filtered = prev.filter(item => item !== id);
      return [id, ...filtered].slice(0, 10);
    });
  };

  const toggleSave = (id) => {
    setSavedIds((prev) => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  useEffect(() => {
    if (mapRef.current) setTimeout(() => mapRef.current.invalidateSize(), 300);
  }, [isPanelOpen, isRailExpanded, activeSidePanel]);

  const leftPos = isRailExpanded ? '280px' : '84px';

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {isLoading && <Loading fullScreen />}
      
      <SettingsPanel isOpen={isSettingsPanelOpen} onClose={() => setIsSettingsPanelOpen(false)} activeTheme={activeTheme} setActiveTheme={setActiveTheme} />

      <FeedbackModal {...feedback} onClose={() => setFeedback({ ...feedback, isOpen: false })} onConfirm={feedback.onConfirm} />
      
      {isAdmin && (
        <ObjectFormModal 
          {...formModal} 
          types={types} 
          onClose={() => setFormModal({ ...formModal, isOpen: false })} 
          onSubmit={handleFormSubmit} 
        />
      )}

      {/* Side Panels */}
      <SavedPanel isOpen={activeSidePanel === 'saved'} onClose={() => setActiveSidePanel(null)} savedIds={savedIds} allMarkers={markers} onSelectLocation={handleSelectLocation} style={{ left: leftPos }} />
      <HistoryPanel isOpen={activeSidePanel === 'history'} onClose={() => setActiveSidePanel(null)} historyIds={historyIds} allMarkers={markers} onSelectLocation={handleSelectLocation} style={{ left: leftPos }} />
      
      {isAdmin && (
        <ManagementPanel 
          isOpen={activeSidePanel === 'management'} 
          onClose={() => setActiveSidePanel(null)} 
          markers={markers} 
          onEdit={handleEditRequest} 
          onDelete={handleDeleteRequest} 
          onSelect={handleSelectLocation}
          style={{ left: leftPos }} 
        />
      )}
      
      <div style={{ position: 'absolute', left: 0, top: 0, zIndex: 1100 }}>
        <NavRail 
          isExpanded={isRailExpanded}
          onToggleExpand={() => setIsRailExpanded(!isRailExpanded)} 
          onSettingsClick={() => setIsSettingsPanelOpen(true)}
          onSavedClick={() => { setActiveSidePanel('saved'); setIsPanelOpen(false); }}
          onHistoryClick={() => { setActiveSidePanel('history'); setIsPanelOpen(false); }}
          // Fitur khusus admin di Rail
          isAdmin={isAdmin}
          onManagementClick={() => { setActiveSidePanel('management'); setIsPanelOpen(false); }}
        />
      </div>

      {/* Detail Lokasi */}
      <div style={{ 
        position: 'absolute', top: '80px', left: isPanelOpen ? leftPos : '-410px', 
        zIndex: 1050, width: '390px', height: 'calc(100vh - 90px)', backgroundColor: 'white',
        borderRadius: '12px 12px 0 0', boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', overflow: 'hidden'
      }}>
        <InfoPanel 
          location={selectedLocation} 
          isOpen={isPanelOpen} 
          onBack={() => setIsPanelOpen(false)} 
          onSave={() => toggleSave(selectedLocation.id)}
          isSaved={savedIds.includes(selectedLocation?.id)}
          isAdmin={isAdmin}
          onEdit={() => handleEditRequest(selectedLocation)}
          onDelete={() => handleDeleteRequest(selectedLocation.id)}
        />
      </div>

      <div style={{ width: '100%', height: '100%', position: 'relative', zIndex: 1 }}>
        <Navbar 
          onSearch={handleSearch} results={filteredMarkers} onSelectResult={handleSelectLocation}
          categories={['Semua', ...new Set(markers.map(m => m.type_name))]}
          onSelectCategory={handleSelectCategory} isRailExpanded={isRailExpanded}
          onLoginClick={() => navigate('/login')}
          isAdmin={isAdmin}
        />

        <InteractiveMap 
          markers={filteredMarkers} 
          isAdmin={isAdmin} 
          setMapRef={(map) => mapRef.current = map} 
          onDetailClick={handleSelectLocation}
          onMapClick={handleMapClick}
          theme={activeTheme}
          setActiveTheme={setActiveTheme}
        />
      </div>
    </div>
  );
}