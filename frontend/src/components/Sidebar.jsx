import { useState } from 'react';
import LocationCard from './LocationCard';
import SidebarDetail from './SidebarDetail';

export default function Sidebar({ 
  markers, 
  isOpen, 
  view, 
  setView, 
  selectedLocation, 
  setSelectedLocation, 
  activeTheme, 
  setActiveTheme
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMarkers = markers.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenDetail = (marker) => {
    setSelectedLocation(marker);
    setView('detail');
  };

  return (
    <div style={{ 
      width: isOpen ? '420px' : '0px', 
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      overflow: 'hidden',
      backgroundColor: 'white', 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100vh', 
      boxShadow: isOpen ? '10px 0 30px rgba(0,0,0,0.05)' : 'none', 
      zIndex: 30,
      position: 'relative'
    }}>
      <div style={{ minWidth: '420px', display: 'flex', flexDirection: 'column', height: '100%' }}>
        {view === 'list' ? (
          <>
            <div style={{ padding: '15px 20px', borderBottom: '1px solid #eee' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                 <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#666' }}>Tema:</span>
                 <select value={activeTheme} onChange={(e) => setActiveTheme(e.target.value)} style={{ padding: '5px', flex: 1, borderRadius: '4px', border: '1px solid #ddd' }}>
                    <option value="standard">Standard Light</option>
                    <option value="dark">Dark Mode</option>
                    <option value="satellite">Satellite View</option>
                 </select>
              </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '20px', backgroundColor: '#f8f9fa' }}>
              <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#999', marginBottom: '15px' }}>DITEMUKAN {filteredMarkers.length} TITIK</p>
              {filteredMarkers.map(m => (
                <LocationCard key={m.id} marker={m} onDetailClick={() => handleOpenDetail(m)} />
              ))}
            </div>
          </>
        ) : (
          <SidebarDetail 
            location={selectedLocation} 
            onBack={() => setView('list')} 
          />
        )}
      </div>
    </div>
  );
}