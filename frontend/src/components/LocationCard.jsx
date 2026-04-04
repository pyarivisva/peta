// src/components/LocationCard.jsx
import React from 'react';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=500&q=80';

export default function LocationCard({ marker, onDetailClick }) {
  return (
    <div style={{ 
      backgroundColor: 'white', 
      borderRadius: '16px', 
      marginBottom: '20px', 
      overflow: 'hidden',
      boxShadow: '0 10px 20px rgba(0,0,0,0.05)',
      border: '1px solid #f0f0f0',
      transition: 'all 0.3s ease'
    }}>
      {/* Gambar Lokasi */}
      <div style={{ width: '100%', height: '180px', position: 'relative' }}>
        <img 
          src={marker.image_url || DEFAULT_IMAGE} 
          alt={marker.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={(e) => { e.target.src = DEFAULT_IMAGE; }}
        />
        <div style={{ 
          position: 'absolute', top: '12px', right: '12px', 
          backgroundColor: 'rgba(255,255,255,0.9)', padding: '4px 10px', 
          borderRadius: '20px', fontSize: '11px', fontWeight: '800', color: '#1890ff' 
        }}>
          {marker.type_name}
        </div>
      </div>

      {/* Detail Teks */}
      <div style={{ padding: '20px' }}>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#2d3436' }}>{marker.name}</h4>
        <p style={{ fontSize: '14px', color: '#636e72', lineHeight: '1.6', margin: '0 0 20px 0' }}>
          {marker.description || 'Nikmati pengalaman tak terlupakan di lokasi ini.'}
        </p>
        
        <button 
          onClick={() => onDetailClick(marker)}
          style={{ 
            width: '100%', padding: '12px', borderRadius: '10px', border: 'none', 
            backgroundColor: '#1890ff', color: 'white', fontWeight: 'bold', 
            cursor: 'pointer', transition: 'background 0.2s' 
          }}
        >
          Lihat Detail
        </button>
      </div>
    </div>
  );
}