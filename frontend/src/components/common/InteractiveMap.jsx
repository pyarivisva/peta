import { useContext, useEffect } from 'react'; // Tambahkan useEffect
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, ZoomControl, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { DEFAULT_CENTER } from '../../constants/mapConfig';
import { ThemeContext } from '../../context/ThemeContext';

function MapEvents({ onMapClick, isAdmin, isRulerMode, onRulerClick }) {
  const map = useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      if (isRulerMode && onRulerClick) {
        onRulerClick(lat, lng);
        return;
      }
      if (isAdmin && onMapClick) {
        onMapClick(lat, lng);
      }
    },
  });

  useEffect(() => {
    const container = map.getContainer();
    if (isAdmin) {
      container.classList.add('admin-map-mode');
    } else {
      container.classList.remove('admin-map-mode');
    }
  }, [isAdmin, map]);

  return null;
}

export default function InteractiveMap({ markers, onMapClick, isAdmin, setMapRef, onDetailClick, isRulerMode, onRulerClick, rulerPoints = [] }) {
  // Ambil config tema dari context
  const { themeData } = useContext(ThemeContext);
  

  const MapInstanceCapture = () => {
    const map = useMapEvents({});
    useEffect(() => {
      if (setMapRef) setMapRef(map);
    }, [map]);
    return null;
  };
  
  const createCustomIcon = (iconUrl, name) => {
    return L.divIcon({
      className: 'custom-div-icon',
      html: `
        <div style="
          background-color: white;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 2px solid #1890ff;
          box-shadow: 0 4px 8px rgba(0,0,0,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        ">
          <img src="${iconUrl || 'https://cdn-icons-png.flaticon.com/512/684/684908.png'}" style="width: 20px; height: 20px; object-fit: contain;" />
        </div>
      `,
      iconSize: [36, 36],
      iconAnchor: [18, 36],
      popupAnchor: [0, -36]
    });
  };

  const createRulerIcon = () => {
    return L.divIcon({
      className: 'ruler-div-icon',
      html: `
        <div style="
          width: 16px;
          height: 16px;
          background-color: #1890ff;
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 0 0 1px #1890ff, 0 4px 8px rgba(0,0,0,0.3);
        "></div>
      `,
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });
  };

//   useEffect(() => {
//   console.log("DEBUG: Tema Aktif Saat Ini ->", themeData?.name);
//   console.log("DEBUG: URL Peta ->", themeData?.url);
  
//   if (!themeData) {
//     console.error("ERROR: themeData TIDAK DITEMUKAN! Periksa ThemeContext.");
//   }
// }, [themeData]);

  return (
    <MapContainer 
      center={DEFAULT_CENTER} 
      zoom={13} 
      zoomControl={false}  
      style={{ height: '100%', width: '100%', zIndex: 0 }} // z-0 untuk absolute map canvas
    >
      {/* KUNCI: Key harus unik (url) agar TileLayer re-render saat tema ganti */}
      <TileLayer 
        key={themeData.url} 
        url={themeData.url} 
        attribution={themeData.attribution} 
      />

      <ZoomControl position="bottomright" />
      
      <MapInstanceCapture />
      <MapEvents onMapClick={onMapClick} isAdmin={isAdmin} isRulerMode={isRulerMode} onRulerClick={onRulerClick} />

      {/* Render Polyline Jarak (Ruler) */}
      {rulerPoints.length > 0 && (
        <Polyline positions={rulerPoints.map(p => [p.lat, p.lng])} color="#1890ff" weight={4} dashArray="5, 10" />
      )}
      {rulerPoints.map((p, idx) => (
        <Marker key={`ruler-p-${idx}`} position={[p.lat, p.lng]} icon={createRulerIcon()} />
      ))}

      {markers.map(m => (
        <Marker 
          key={m.id} 
          position={[parseFloat(m.latitude), parseFloat(m.longitude)]} 
          icon={createCustomIcon(m.type_icon, m.name)}
          eventHandlers={{
            click: () => {
              if (onDetailClick) onDetailClick(m);
            },
          }}
        >
          <Popup>
            <div style={{ textAlign: 'center', minWidth: '150px' }}>
              <strong style={{ fontSize: '14px', display: 'block' }}>{m.name}</strong>
              <span style={{ fontSize: '11px', color: '#1890ff', fontWeight: 'bold' }}>{m.type_name}</span>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}