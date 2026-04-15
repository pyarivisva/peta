import { useState, useEffect, useCallback, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig'; 
import InteractiveMap from '../components/common/InteractiveMap';
import InfoPanel from '../components/InfoPanel'; 
import NavRail from '../components/NavRail'; 
import Navbar from '../components/Navbar';
import SavedPanel from '../components/SavedPanel';
import HistoryPanel from '../components/HistoryPanel';
import ManagementPanel from '../components/admin/ManagementPanel';
import ObjectFormModal from '../components/admin/ObjectFormModal';
import { useLocalStorage } from '../hooks/useLocalStorage';
import SettingsPanel from '../components/SettingsPanel';
import FeedbackModal from '../components/common/FeedbackModal';
import Loading from '../components/common/Loading';
import { ThemeContext } from '../context/ThemeContext';

export default function MapPage({ isAdmin = false }) {
  const [markers, setMarkers] = useState([]);
  const [filteredMarkers, setFilteredMarkers] = useState([]);
  const [types, setTypes] = useState([]); 
  const [activeCategory, setActiveCategory] = useState('Semua'); 
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // State UI & Side Panels
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isRailExpanded, setIsRailExpanded] = useState(false); 
  const [activeSidePanel, setActiveSidePanel] = useState(null);

  // State Ruler Mode
  const [isRulerMode, setIsRulerMode] = useState(false);
  const [rulerPoints, setRulerPoints] = useState([]);
  const [rulerDistance, setRulerDistance] = useState(null);

  // State Admin CRUD
  const [formModal, setFormModal] = useState({ isOpen: false, mode: 'create', data: null });
  const [feedback, setFeedback] = useState({ isOpen: false, isConfirm: false, title: '', message: '', onConfirm: null });

  const [localSavedIds, setLocalSavedIds] = useLocalStorage('bali_gis_saved', []);
  const [localHistoryIds, setLocalHistoryIds] = useLocalStorage('bali_gis_history', []);   
  
  const [dbSavedIds, setDbSavedIds] = useState([]);
  const [dbHistoryIds, setDbHistoryIds] = useState([]);

  const savedIds = isAdmin ? dbSavedIds : localSavedIds;
  const historyIds = isAdmin ? dbHistoryIds : localHistoryIds;
  
  const mapRef = useRef(null);
  const navigate = useNavigate();
  const { activeTheme, setActiveTheme } = useContext(ThemeContext);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const endpoint = isAdmin ? '/objects' : '/public/objects';
      const requests = [
        api.get(endpoint),
        api.get('/types')
      ];

      if (isAdmin) {
        requests.push(api.get('/user/saved'));
        requests.push(api.get('/user/history'));
      }

      const results = await Promise.all(requests);
      
      setMarkers(results[0].data);
      setFilteredMarkers(results[0].data);
      setTypes(results[1].data);

      if (isAdmin) {
        setDbSavedIds(results[2].data);
        setDbHistoryIds(results[3].data);
      }
    } catch (err) { 
      console.error('Fetch Data Error:', err); 
      const errMsg = err.response?.data?.message || err.message || "Unknown Start Error";
      setFeedback({ isOpen: true, title: 'Network Initialization Error', message: errMsg, isConfirm: false });
    } finally {
      setIsLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Haversine Distance Formula
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const handleMapRulerClick = (lat, lng) => {
    setRulerPoints(prev => {
      let newPts = [...prev, { lat, lng }];
      if (newPts.length > 2) {
        newPts = [{ lat, lng }];
        setRulerDistance(null);
      } else if (newPts.length === 2) {
        const dist = calculateDistance(newPts[0].lat, newPts[0].lng, newPts[1].lat, newPts[1].lng);
        setRulerDistance(dist.toFixed(2));
      }
      return newPts;
    });
  };

  const toggleRulerMode = () => {
    setIsRulerMode(!isRulerMode);
    setRulerPoints([]);
    setRulerDistance(null);
  };

  const handleSelectLocation = (location) => {
    setSelectedLocation(location);
    setIsPanelOpen(true);
    setActiveSidePanel(null);
    addToHistory(location.id);
    if (mapRef.current && location.latitude && location.longitude) {
        mapRef.current.flyTo([location.latitude, location.longitude], 15);
    }
  };

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
      await api.post('/objects', formData);
      setFeedback({
        isOpen: true,
        title: 'Berhasil!',
        message: 'Lokasi baru telah berhasil ditambahkan ke peta.',
        isConfirm: false
      });

      } else {
      await api.put(`/objects/${formModal.data.id}`, formData);
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
    setActiveCategory('Semua');
  };

  const handleSelectCategory = (category) => {
    const filtered = category === 'Semua' ? markers : markers.filter(m => m.type_name === category);
    setFilteredMarkers(filtered);
    setActiveCategory(category);
  };

  const addToHistory = async (id) => {
    if (isAdmin) {
      try {
        await api.post(`/user/history/${id}`);
        setDbHistoryIds(prev => [id, ...prev.filter(item => item !== id)].slice(0, 10));
      } catch (err) { 
        console.error(err);
        const errMsg = err.response?.data?.message || err.message || "Unknown Error";
        setFeedback({ isOpen: true, title: 'History Sync Error', message: errMsg, isConfirm: false });
      }
    } else {
      setLocalHistoryIds(prev => [id, ...prev.filter(item => item !== id)].slice(0, 10));
    }
  };

  const toggleSave = async (id) => {
    if (isAdmin) {
      try {
        await api.post(`/user/saved/${id}`);
        setDbSavedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
      } catch (err) { 
        console.error(err); 
        const errMsg = err.response?.data?.message || err.message || "Unknown Error";
        setFeedback({ isOpen: true, title: 'Save Sync Error', message: errMsg, isConfirm: false });
      }
    } else {
      setLocalSavedIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
    }
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
          isAdmin={isAdmin}
          onManagementClick={() => { setActiveSidePanel('management'); setIsPanelOpen(false); }}
          onRulerClick={toggleRulerMode}
          isRulerActive={isRulerMode}
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

      {isRulerMode && (
        <div style={{
          position: 'absolute', top: '100px', right: '30px', zIndex: 1200,
          backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)',
          padding: '15px 20px', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          border: '1px solid #1890ff', textAlign: 'center', minWidth: '200px'
        }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#1890ff' }}>Mode Ukur Jarak</h4>
          {rulerPoints.length === 0 && <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>Klik titik pertama di peta</p>}
          {rulerPoints.length === 1 && <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>Klik titik kedua di peta</p>}
          {rulerDistance && (
            <div>
              <p style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#333' }}>{rulerDistance} <span style={{fontSize: '14px'}}>km</span></p>
              <button 
                onClick={() => { setRulerPoints([]); setRulerDistance(null); }}
                style={{ marginTop: '10px', background: '#f5f5f5', border: 'none', padding: '5px 15px', borderRadius: '20px', cursor: 'pointer', fontSize: '12px' }}
              >Reset Titik</button>
            </div>
          )}
        </div>
      )}

      <div style={{ width: '100%', height: '100%', position: 'relative', zIndex: 0 }}>
        <Navbar 
          onSearch={handleSearch} results={filteredMarkers} onSelectResult={handleSelectLocation}
          categories={['Semua', ...new Set(markers.map(m => m.type_name))]}
          activeCategory={activeCategory}
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
          isRulerMode={isRulerMode}
          onRulerClick={handleMapRulerClick}
          rulerPoints={rulerPoints}
        />
      </div>
    </div>
  );
}