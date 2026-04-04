import { useState, useEffect, useCallback, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig'; 
import InteractiveMap from '../components/InteractiveMap';
import InfoPanel from '../components/InfoPanel'; 
import NavRail from '../components/NavRail'; 
import Navbar from '../components/Navbar';
import SavedPanel from '../components/SavedPanel';
import HistoryPanel from '../components/HistoryPanel';
import { useLocalStorage } from '../hooks/useLocalStorage';
import SettingsPanel from '../components/SettingsPanel';
import { ThemeContext } from '../context/ThemeContext';

export default function MapPage({ isAdmin = false }) {
  const [markers, setMarkers] = useState([]);
  const [filteredMarkers, setFilteredMarkers] = useState([]);
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);
  
  // State untuk Detail Lokasi
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  
  // State untuk Navigasi Kiri
  const [isRailExpanded, setIsRailExpanded] = useState(false); 

  const [activeSidePanel, setActiveSidePanel] = useState(null);
  const [savedIds, setSavedIds] = useLocalStorage('bali_gis_saved', []);
  const [historyIds, setHistoryIds] = useLocalStorage('bali_gis_history', []);  
  
  const mapRef = useRef(null);
  const navigate = useNavigate();
  const { activeTheme, setActiveTheme } = useContext(ThemeContext);

  // 1. Load Data Awal
  const fetchData = useCallback(async () => {
    try {
      const res = await api.get('/public/objects');
      setMarkers(res.data);
      setFilteredMarkers(res.data);
    } catch (err) { console.error(err); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // 2. Fungsi Seleksi (Dipakai saat klik marker atau pilih hasil search)
  const handleSelectLocation = (location) => {
    setSelectedLocation(location);
    setIsPanelOpen(true);
    setActiveSidePanel(null);
    addToHistory(location.id);
    // Geser peta ke lokasi tersebut
    if (mapRef.current && location.latitude && location.longitude) {
        mapRef.current.flyTo([location.latitude, location.longitude], 15);
    }
  };

  // 3. Fungsi Search (Hanya memfilter data, tidak otomatis buka panel detail)
  const handleSearch = (query) => {
    const filtered = markers.filter(m => 
      m.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredMarkers(filtered);
  };

  const handleSelectCategory = (category) => {
    const filtered = category === 'Semua' 
      ? markers 
      : markers.filter(m => m.type_name === category);
    setFilteredMarkers(filtered);
  };

  const addToHistory = (id) => {
    setHistoryIds((prev) => {
      const filtered = prev.filter(item => item !== id); // Hapus jika sudah ada (biar tidak duplikat)
      return [id, ...filtered].slice(0, 10); // Tambah ke paling atas, batasi 10 item
    });
  };

  // Fungsi untuk toggle simpan (Like/Unlike)
  const toggleSave = (id) => {
    setSavedIds((prev) => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Invalidate peta agar ukurannya pas saat UI berubah
  useEffect(() => {
    if (mapRef.current) {
      setTimeout(() => mapRef.current.invalidateSize(), 300);
    }
  }, [isPanelOpen, isRailExpanded]);

  return (
  <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
    
    {/* LAYER PALING ATAS: MODAL SETTINGS */}
    <SettingsPanel 
      isOpen={isSettingsPanelOpen} 
      onClose={() => setIsSettingsPanelOpen(false)} 
      activeTheme={activeTheme}
      setActiveTheme={setActiveTheme}
    />

    <SavedPanel 
        isOpen={activeSidePanel === 'saved'}
        onClose={() => setActiveSidePanel(null)}
        savedIds={savedIds}
        allMarkers={markers}
        onSelectLocation={handleSelectLocation}
        // Atur posisi left agar tidak tertutup Rail
        style={{ left: isRailExpanded ? '280px' : '84px' }} 
      />

      <HistoryPanel 
        isOpen={activeSidePanel === 'history'}
        onClose={() => setActiveSidePanel(null)}
        historyIds={historyIds}
        allMarkers={markers}
        onSelectLocation={handleSelectLocation}
        style={{ left: isRailExpanded ? '280px' : '84px' }}
      />
      
    {/* LAYER 1: NAV RAIL (Z-index 1100) */}
    <div style={{ position: 'absolute', left: 0, top: 0, zIndex: 1100 }}>
      <NavRail 
        isExpanded={isRailExpanded}
        onToggleExpand={() => setIsRailExpanded(!isRailExpanded)} 
        onSettingsClick={() => setIsSettingsPanelOpen(true)}
        onSavedClick={() => { setActiveSidePanel('saved'); setIsPanelOpen(false); }}
        onHistoryClick={() => { setActiveSidePanel('history'); setIsPanelOpen(false); }}
      />
    </div>

    {/* LAYER 2: INFO PANEL (Z-index 1050) */}
    <div style={{ 
      position: 'absolute', 
      top: '80px', 
      left: isPanelOpen ? (isRailExpanded ? '280px' : '84px') : '-410px', 
      zIndex: 1050, 
      width: '390px',
      height: 'calc(100vh - 90px)', 
      backgroundColor: 'white',
      borderRadius: '12px 12px 0 0',
      boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      overflow: 'hidden'
    }}>
      <InfoPanel 
        location={selectedLocation} 
        isOpen={isPanelOpen} 
        onBack={() => setIsPanelOpen(false)} 
        onSave={() => toggleSave(selectedLocation.id)}
        isSaved={savedIds.includes(selectedLocation?.id)}
      />
    </div>

    {/* LAYER 3: AREA MAP & NAVBAR (Z-index default/rendah) */}
    <div style={{ width: '100%', height: '100%', position: 'relative', zIndex: 1 }}>
      <Navbar 
        onSearch={handleSearch}
        results={filteredMarkers}
        onSelectResult={handleSelectLocation}
        categories={['Semua', ...new Set(markers.map(m => m.type_name))]}
        onSelectCategory={handleSelectCategory}
        isRailExpanded={isRailExpanded}
        onLoginClick={() => navigate('/login')}
      />

      <InteractiveMap 
        markers={filteredMarkers} 
        isAdmin={isAdmin} 
        setMapRef={(map) => mapRef.current = map} 
        onDetailClick={handleSelectLocation}
        theme={activeTheme}
        setActiveTheme={setActiveTheme}
      />
    </div>
  </div>
);
}