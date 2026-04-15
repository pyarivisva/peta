import React from 'react';

export default function HistoryPanel({ isOpen, onClose, historyIds, allMarkers, onSelectLocation, style }) {
  if (!isOpen) return null;
  
  // Ambil data marker berdasarkan urutan di historyIds
  const historyData = historyIds
    .map(id => allMarkers.find(m => m.id === id))
    .filter(Boolean);

  return (
    <div style={{ ...panelBaseStyle, ...style }}>
       <div style={headerStyle}>
         <h3 style={{ margin: 0, fontSize: '18px' }}>Terakhir Dilihat</h3>
         <button onClick={onClose} style={closeButtonStyle}>✕</button>
       </div>
       <div style={{ padding: '10px', overflowY: 'auto', flex: 1 }}>
         {historyData.length === 0 ? (
           <p style={{ textAlign: 'center', color: '#999', marginTop: '20px' }}>
             Belum ada riwayat pencarian.
           </p>
         ) : (
           historyData.map(m => (
             <div 
               key={m.id} 
               onClick={() => onSelectLocation(m)} 
               style={cardStyle}
               onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
               onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
             >
               <strong style={{ display: 'block', color: '#333' }}>{m.name}</strong>
               <span style={{ fontSize: '11px', color: '#555' }}>
                 {m.type_name}
               </span>
             </div>
           ))
         )}
       </div>
    </div>
  );
}

const panelBaseStyle = {
  position: 'absolute',
  top: '80px',
  zIndex: 1040,
  width: '390px',
  height: 'calc(100vh - 90px)',
  backgroundColor: 'white',
  borderRadius: '12px 12px 0 0',
  boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden'
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '15px 20px',
  borderBottom: '1px solid #eee'
};

const closeButtonStyle = {
  border: 'none',
  background: 'none',
  fontSize: '18px',
  cursor: 'pointer',
  color: '#999'
};

const cardStyle = {
  padding: '15px',
  borderBottom: '1px solid #f0f0f0',
  cursor: 'pointer',
  transition: 'background 0.2s',
  borderRadius: '8px'
};