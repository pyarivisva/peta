export default function SidebarDetail({ location, onBack }) {
  if (!location) return null;

  return (
    <div style={{ flex: 1, overflowY: 'auto', backgroundColor: 'white' }}>
      <button 
        onClick={onBack} 
        style={{ margin: '20px', border: 'none', background: '#f0f2f5', color: '#1890ff', padding: '8px 15px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}
      >
        ← Kembali
      </button>
      
      <img 
        src={location.image_url || 'https://via.placeholder.com/420x250?text=No+Image'} 
        style={{ width: '100%', height: '240px', objectFit: 'cover' }} 
      />
      
      <div style={{ padding: '24px' }}>
        <span style={{ backgroundColor: '#e6f7ff', color: '#1890ff', padding: '4px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }}>
          {location.type_name}
        </span>
        <h2 style={{ marginTop: '12px', fontSize: '24px', color: '#1a1a1a' }}>{location.name}</h2>
        <p style={{ color: '#555', lineHeight: '1.7', fontSize: '14px' }}>{location.description}</p>

      </div>
    </div>
  );
}