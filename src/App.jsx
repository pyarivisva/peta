import { useCallback } from 'react';
import InteractiveMap from './components/InteractiveMap';
import CoordinateTable from './components/CoordinateTable';
import { ThemeProvider } from './context/ThemeContext';
import { useTheme } from './hooks/useTheme';
import { useLocalStorage } from './hooks/useLocalStorage';
import { MAP_THEMES } from './constants/mapConfig';

function MapDashboard() {
  const [markers, setMarkers] = useLocalStorage('dataMarkerDenpasar', []);
  const { activeTheme, setActiveTheme } = useTheme();

  const handleAddMarker = useCallback((lat, lng) => {
    setMarkers((prev) => [...prev, { id: Date.now(), lat, lng }]);
  }, [setMarkers]);

  const handleDeleteMarker = useCallback((id) => {
    setMarkers((prev) => prev.filter(marker => marker.id !== id));
  }, [setMarkers]);

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h2 style={{ margin: 0 }}>Peta</h2>
          
          <div>
            <label htmlFor="theme" style={{ marginRight: '10px', fontWeight: 'bold' }}>Tema:</label>
            <select 
              id="theme" value={activeTheme} onChange={(e) => setActiveTheme(e.target.value)}
              style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              {Object.entries(MAP_THEMES).map(([key, theme]) => (
                <option key={key} value={key}>{theme.name}</option>
              ))}
            </select>
          </div>
        </div>
        
        <InteractiveMap markers={markers} onAddMarker={handleAddMarker} onDeleteMarker={handleDeleteMarker} />
      </div>

      <CoordinateTable markers={markers} onDeleteMarker={handleDeleteMarker} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <MapDashboard />
    </ThemeProvider>
  );
}