/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from 'react';
import { 
  FoodDetailView, 
  NatureDetailView, 
  AccommodationDetailView, 
  HealthcareDetailView, 
  EducationDetailView 
} from './clusters/DetailViews';

const BASE_URL = 'http://localhost:3000';
const FALLBACK_IMAGE = 'https://placehold.co/420x250?text=Gambar+Tidak+Tersedia';

export default function InfoPanel({ location, onBack, isOpen, onSave, isSaved, isAdmin, onEdit, onDelete }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [location]);

  if (!location) return null;

  const getImageUrl = (url) => {
    if (!url) return FALLBACK_IMAGE;
    if (url.startsWith('/uploads')) {
      return `${BASE_URL}${url}`;
    }
    return url;
  };

  const images = (location.images || [location.image_url]).filter(img => img !== null && img !== '');
  const displayImages = images.length > 0 ? images : [null];

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % displayImages.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length);
  };

  const renderClusterDetails = () => {
    if (!location.details) return null;
    
    const props = { details: location.details };
    switch (location.cluster_name) {
      case 'Restoran':
      case 'Food & Beverage':
      case 'Food':
        return <FoodDetailView {...props} />;
      case 'Alam':
      case 'Nature & Outdoor':
      case 'Nature':
        return <NatureDetailView {...props} />;
      case 'Accommodation':
        return <AccommodationDetailView {...props} />;
      case 'Healthcare':
        return <HealthcareDetailView {...props} />;
      case 'Education':
        return <EducationDetailView {...props} />;
      default:
        return null;
    }
  };

  return (
    <>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0, 
        width: isOpen ? '400px' : '0px',
        height: '100%',
        backgroundColor: 'white',
        zIndex: 1050,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
        boxShadow: isOpen ? '5px 0 15px rgba(0,0,0,0.1)' : 'none',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{ minWidth: '400px', height: '100%', overflowY: 'auto' }} className="custom-scrollbar">
          
          {/* BATAS IMAGE HERO CAROUSEL */}
          <div style={{ position: 'relative', width: '100%', height: '260px', flexShrink: 0 }}>
            <button 
              onClick={onBack} 
              style={{ 
                position: 'absolute', top: '15px', left: '15px', zIndex: 10,
                width: '36px', height: '36px', borderRadius: '50%', border: 'none', 
                backgroundColor: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(4px)',
                color: '#1890ff', cursor: 'pointer', display: 'flex', alignItems: 'center', 
                justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
              }}
              title="Kembali"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>

            <img 
              src={getImageUrl(displayImages[currentImageIndex])} 
              alt={`${location.name} - ${currentImageIndex + 1}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
            />

            {/* Carousel Navigation */}
            {displayImages.length > 1 && (
              <>
                <button onClick={prevImage} style={{ position: 'absolute', top: '50%', left: '10px', transform: 'translateY(-50%)', backgroundColor: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', zIndex: 5 }}>❮</button>
                <button onClick={nextImage} style={{ position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%)', backgroundColor: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', zIndex: 5 }}>❯</button>
                
                <div style={{ position: 'absolute', bottom: '15px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '5px', zIndex: 5 }}>
                  {displayImages.map((_, i) => (
                    <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: i === currentImageIndex ? 'white' : 'rgba(255,255,255,0.5)' }} />
                  ))}
                </div>

                <button 
                  onClick={(e) => { e.stopPropagation(); setIsLightboxOpen(true); }}
                  style={{ position: 'absolute', bottom: '15px', right: '15px', backgroundColor: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(4px)', padding: '6px 12px', borderRadius: '20px', border: 'none', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer', zIndex: 5, boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}
                >
                  Lihat Semua
                </button>
              </>
            )}
          </div>
          {/* SELESAI HERO */}
          
          <div style={{ padding: '24px' }}>
            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <button 
                onClick={(e) => { e.stopPropagation(); onSave(); }} 
                style={{
                  flex: 1, padding: '10px', borderRadius: '12px', border: 'none', fontWeight: 'bold', cursor: 'pointer',
                  backgroundColor: isSaved ? '#fffbe6' : '#f0f2f5', color: isSaved ? '#faad14' : '#555',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', 
                  boxShadow: isSaved ? '0 4px 12px rgba(250, 173, 20, 0.2)' : 'none'
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill={isSaved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                </svg>
                {isSaved ? 'Tersimpan' : 'Simpan'}
              </button>
              
              {isAdmin && (
                <>
                  <button onClick={(e) => { e.stopPropagation(); onEdit(); }} style={{ flex: 1, padding: '10px', borderRadius: '12px', border: 'none', backgroundColor: '#e6f7ff', color: '#1890ff', fontWeight: 'bold', cursor: 'pointer' }}>
                    Edit
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); onDelete(); }} style={{ flex: 1, padding: '10px', borderRadius: '12px', border: 'none', backgroundColor: '#fff1f0', color: '#ff4d4f', fontWeight: 'bold', cursor: 'pointer' }}>
                    Hapus
                  </button>
                </>
              )}
            </div>

            <div className="flex items-center gap-2 mb-3">
              <span style={{ backgroundColor: '#e6f7ff', color: '#1890ff', padding: '4px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }}>
                {location.type_name}
              </span>
              <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-1 rounded font-bold uppercase tracking-widest">
                {location.cluster_name || 'General'}
              </span>
            </div>

            <h2 style={{ marginTop: '0px', fontSize: '24px', color: '#1a1a1a', fontWeight: '800' }}>{location.name}</h2>
            <p style={{ color: '#555', lineHeight: '1.7', fontSize: '14px', marginBottom: '20px' }}>{location.description}</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {location.address && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', borderTop: '1px solid #f0f0f0', paddingTop: '20px' }}>
                  <span style={{ color: '#1890ff' }}>📍</span>
                  <div style={{ fontSize: '13px', color: '#333', lineHeight: '1.5' }}>{location.address}</div>
                </div>
              )}
              
              {location.phone && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ color: '#1890ff' }}>📞</span>
                  <div style={{ fontSize: '13px', color: '#333' }}>{location.phone}</div>
                </div>
              )}

              {location.status && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ color: '#1890ff' }}>ℹ️</span>
                  <div style={{ fontSize: '13px', fontWeight: 'bold', color: location.status === 'Open' ? '#52c41a' : '#faad14' }}>
                    {location.status === 'Open' ? 'Buka (Open)' : location.status}
                  </div>
                </div>
              )}

              {/* DYNAMIC CLUSTER DETAILS */}
              <div className="mt-2">
                {renderClusterDetails()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LIGHTBOX OVERLAY UNTUK "LIHAT SEMUA" */}
      {isLightboxOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.95)', zIndex: 9999,
          display: 'flex', flexDirection: 'column', overflowY: 'auto'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 30px', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)', position: 'sticky', top: 0, zIndex: 10 }}>
            <h3 style={{ color: 'white', margin: 0 }}>Semua Foto ({displayImages.length})</h3>
            <button onClick={() => setIsLightboxOpen(false)} style={{ background: 'none', border: 'none', color: 'white', fontSize: '30px', cursor: 'pointer' }}>✕</button>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: '20px', 
            padding: '30px',
            maxWidth: '1200px',
            margin: '0 auto',
            width: '100%'
          }}>
            {displayImages.map((img, idx) => (
              <div key={idx} style={{ width: '100%', height: '300px', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}>
                <img 
                  src={getImageUrl(img)} 
                  alt={`Galeri ${idx}`} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}