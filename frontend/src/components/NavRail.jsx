import React from 'react';

export default function NavRail({ 
  isExpanded, 
  onToggleExpand, 
  onSavedClick, 
  onHistoryClick,
  onSettingsClick,
  isAdmin,
  onManagementClick 
}) {
  return (
    <div style={{
      width: isExpanded ? '260px' : '64px',
      height: '100vh',
      backgroundColor: 'white',
      display: 'flex',
      flexDirection: 'column',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: '2px 0 10px rgba(0,0,0,0.05)',
      zIndex: 1100, 
      borderRight: '1px solid #eee',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Container Atas: Hamburger & Judul */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '10px 9px', height: '64px' }}>
        <button onClick={onToggleExpand} style={iconButtonStyle}>☰</button>
        {isExpanded && <span style={{ marginLeft: '15px', fontWeight: '800', color: '#1890ff', fontSize: '18px', whiteSpace: 'nowrap' }}>Bali GIS</span>}
      </div>
      
      <div style={{ height: '1px', width: '100%', backgroundColor: '#eee', margin: '5px 0' }}></div>
      
      {/* Menu Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '10px 9px' }}>
        
        {/* TOMBOL MANAJEMEN DATA (HANYA UNTUK ADMIN) */}
        {isAdmin && (
          <button onClick={onManagementClick} style={isExpanded ? expandedButtonStyle : iconButtonStyle}>
            <span>🛠️</span>
            {isExpanded && <span style={{ marginLeft: '15px' }}>Manajemen Data</span>}
          </button>
        )}

        <button onClick={onSavedClick} style={isExpanded ? expandedButtonStyle : iconButtonStyle}>
          <span>🔖</span>
          {isExpanded && <span style={{ marginLeft: '15px' }}>Lokasi Disimpan</span>}
        </button>

        <button onClick={onHistoryClick} style={isExpanded ? expandedButtonStyle : iconButtonStyle}>
          <span>🕒</span>
          {isExpanded && <span style={{ marginLeft: '15px' }}>Baru Dilihat</span>}
        </button>
      </div>
      
      <div style={{ flex: 1 }}></div>
      
      {/* Bottom Item */}
      <div style={{ padding: '10px 9px', position: 'relative' }}>
        <button 
          onClick={onSettingsClick} 
          style={isExpanded ? expandedButtonStyle : iconButtonStyle}
        >
          <span>⚙️</span>
          {isExpanded && <span style={{ marginLeft: '15px' }}>Pengaturan</span>}
        </button>
      </div>
    </div>
  );
}

const iconButtonStyle = {
  background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer',
  borderRadius: '8px', transition: 'all 0.2s', color: '#555',
  width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center',
  flexShrink: 0
};

const expandedButtonStyle = {
  ...iconButtonStyle,
  width: '100%',
  justifyContent: 'flex-start',
  paddingLeft: '12px',
  fontSize: '14px',
  fontWeight: '500',
  whiteSpace: 'nowrap'
};