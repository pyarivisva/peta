import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useTheme } from '../hooks/useTheme';
import { DEFAULT_CENTER, CUSTOM_ICON } from '../constants/mapConfig';

const MapEvents = ({ onMapClick }) => {
  useMapEvents({ click(e) { onMapClick(e.latlng.lat, e.latlng.lng); } });
  return null;
};

export default function InteractiveMap({ markers, onAddMarker, onDeleteMarker }) {
  const { themeData } = useTheme();

  return (
    <MapContainer center={DEFAULT_CENTER} zoom={13} style={{ height: '400px', width: '100%', borderRadius: '8px', zIndex: 0 }}>
      <TileLayer key={themeData.url} attribution={themeData.attribution} url={themeData.url} />
      <MapEvents onMapClick={onAddMarker} />

      {markers.map((marker) => (
        <Marker key={marker.id} position={[marker.lat, marker.lng]} icon={CUSTOM_ICON}>
          <Popup>
            <div style={{ textAlign: 'center' }}>
              <strong>Marker Terpilih</strong><br/>
              Lat: {marker.lat.toFixed(5)}<br/>
              Lng: {marker.lng.toFixed(5)}<br/><br/>
              <button 
                onClick={() => onDeleteMarker(marker.id)} 
                style={{ background: '#ff4d4f', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
              >
                Hapus
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}