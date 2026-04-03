import React from 'react';

export default function CoordinateTable({ markers, onDeleteMarker }) {
  return (
    <div style={{ marginTop: '20px', backgroundColor: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h3 style={{ marginTop: 0 }}>Data Titik Lokasi</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>No</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Latitude</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Longitude</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {markers.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center', padding: '15px' }}>Belum ada marker. Silakan klik pada peta.</td>
            </tr>
          ) : (
            markers.map((marker, index) => (
              <tr key={marker.id}>
                <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{index + 1}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{marker.latitude.toFixed(6)}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{marker.longitude.toFixed(6)}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                  <button 
                    onClick={() => onDeleteMarker(marker.id)}
                    style={{ background: '#ff4d4f', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}