const BASE_URL = 'http://localhost:3000';

const FALLBACK_IMAGE = 'https://placehold.co/420x250?text=Gambar+Tidak+Tersedia';

export default function InfoPanel({ location, onBack, isOpen }) {
  if (!location) return null;

  const getImageUrl = (url) => {
    if (!url) return FALLBACK_IMAGE;
    
    // Jika data dari DB diawali /uploads, gabungkan dengan BASE_URL
    if (url.startsWith('/uploads')) {
      return `${BASE_URL}${url}`;
    }
    
    // Jika sudah berupa URL lengkap (http...), gunakan langsung
    return url;
  };

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0, 
      width: isOpen ? '400px' : '0px',
      height: '100vh',
      backgroundColor: 'white',
      zIndex: 1050,
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      overflow: 'hidden',
      boxShadow: isOpen ? '5px 0 15px rgba(0,0,0,0.1)' : 'none',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{ minWidth: '400px', flex: 1, overflowY: 'auto' }}>
        <button 
          onClick={onBack} 
          style={{ margin: '20px', border: 'none', background: '#f0f2f5', color: '#1890ff', padding: '8px 15px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
        >
          ← Kembali
        </button>
        
        <img 
          src={getImageUrl(location.image_url)} 
          alt={location.name}
          style={{ width: '100%', height: '240px', objectFit: 'cover' }} 
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/420x250?text=Image+Not+Found';
          }}
        />
        
        <div style={{ padding: '24px' }}>
          <span style={{ backgroundColor: '#e6f7ff', color: '#1890ff', padding: '4px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }}>
            {location.type_name}
          </span>
          <h2 style={{ marginTop: '12px', fontSize: '24px', color: '#1a1a1a' }}>{location.name}</h2>
          <p style={{ color: '#555', lineHeight: '1.7', fontSize: '14px' }}>{location.description}</p>
        </div>
      </div>
    </div>
  );
}