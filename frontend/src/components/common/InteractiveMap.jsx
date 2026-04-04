import { useContext, useEffect } from 'react'; // Tambahkan useEffect
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { DEFAULT_CENTER } from '../../constants/mapConfig';
import { ThemeContext } from '../../context/ThemeContext';

const MapEvents = ({ onMapClick, isAdmin }) => {
  useMapEvents({
    click(e) { 
      if (isAdmin && onMapClick) onMapClick(e.latlng.lat, e.latlng.lng); 
    }
  });
  return null;
};

export default function InteractiveMap({ markers, onAddMarker, isAdmin, setMapRef, onDetailClick }) {
  // Ambil config tema dari context
  const { themeData } = useContext(ThemeContext);
  

  const MapInstanceCapture = () => {
    const map = useMapEvents({});
    useEffect(() => {
      if (setMapRef) setMapRef(map);
    }, [map]);
    return null;
  };
  
  const customIcon = (url) => new L.Icon({
    iconUrl: url || 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconSize: [32, 32], 
    iconAnchor: [16, 32], 
    popupAnchor: [0, -32]
  });

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
      style={{ height: '100%', width: '100%', zIndex: 1 }} // Ubah ke 1 agar tidak tenggelam
    >
      {/* KUNCI: Key harus unik (url) agar TileLayer re-render saat tema ganti */}
      <TileLayer 
        key={themeData.url} 
        url={themeData.url} 
        attribution={themeData.attribution} 
      />

      <ZoomControl position="bottomright" />
      
      <MapInstanceCapture />
      <MapEvents onMapClick={onAddMarker} isAdmin={isAdmin} />

      {markers.map(m => (
        <Marker 
          key={m.id} 
          position={[parseFloat(m.latitude), parseFloat(m.longitude)]} 
          icon={customIcon(m.type_icon)}
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