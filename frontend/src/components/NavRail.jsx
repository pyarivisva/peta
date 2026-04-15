import React from 'react';

export default function NavRail({ 
  isExpanded, 
  onToggleExpand, 
  onSavedClick, 
  onHistoryClick,
  onSettingsClick,
  isAdmin,
  onManagementClick,
  onRulerClick,
  isRulerActive
}) {
  return (
    <div style={{
      width: isExpanded ? '260px' : '64px',
      height: '100vh',
      backgroundColor: 'rgba(255, 255, 255, 0.85)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      flexDirection: 'column',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      boxShadow: '4px 0 24px rgba(0,0,0,0.1)',
      zIndex: 1100, 
      borderRight: '1px solid rgba(255,255,255,0.5)',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Container Atas: Hamburger & Judul */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '10px 9px', height: '64px' }}>
        <button onClick={onToggleExpand} style={iconButtonStyle}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        {isExpanded && <span style={{ marginLeft: '15px', fontWeight: '800', color: '#1890ff', fontSize: '18px', whiteSpace: 'nowrap' }}>Geographic</span>}
      </div>
      
      <div style={{ height: '1px', width: '100%', backgroundColor: '#eee', margin: '5px 0' }}></div>
      
      {/* Menu Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '10px 9px' }}>
        
        {/* TOMBOL MANAJEMEN DATA (HANYA UNTUK ADMIN) */}
        {isAdmin && (
          <button onClick={onManagementClick} style={isExpanded ? expandedButtonStyle : iconButtonStyle} title="Manajemen Data">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="3" y1="9" x2="21" y2="9"></line>
              <line x1="9" y1="21" x2="9" y2="9"></line>
            </svg>
            {isExpanded && <span style={{ marginLeft: '15px' }}>Manajemen Data</span>}
          </button>
        )}

        <button onClick={onSavedClick} style={isExpanded ? expandedButtonStyle : iconButtonStyle} title="Lokasi Disimpan">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
          </svg>
          {isExpanded && <span style={{ marginLeft: '15px' }}>Lokasi Disimpan</span>}
        </button>

        <button onClick={onHistoryClick} style={isExpanded ? expandedButtonStyle : iconButtonStyle} title="Baru Dilihat">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          {isExpanded && <span style={{ marginLeft: '15px' }}>Baru Dilihat</span>}
        </button>

        {/* Ruler Mode Toggle */}
        <button onClick={onRulerClick} style={isExpanded ? {...expandedButtonStyle, backgroundColor: isRulerActive ? '#e6f7ff' : 'transparent', color: isRulerActive ? '#1890ff' : '#555'} : {...iconButtonStyle, backgroundColor: isRulerActive ? '#e6f7ff' : 'transparent', color: isRulerActive ? '#1890ff' : '#555'}} title="Ukur Jarak">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 17v1c0 .5-.5 1-1 1H3c-.5 0-1-.5-1-1v-1"></path>
            <line x1="7" y1="14" x2="7" y2="19"></line>
            <line x1="12" y1="16" x2="12" y2="19"></line>
            <line x1="17" y1="14" x2="17" y2="19"></line>
          </svg>
          {isExpanded && <span style={{ marginLeft: '15px', color: isRulerActive ? '#1890ff' : 'inherit' }}>Ukur Jarak</span>}
        </button>
      </div>
      
      <div style={{ flex: 1 }}></div>
      
      {/* Bottom Item */}
      <div style={{ padding: '10px 9px', position: 'relative' }}>
        <button 
          onClick={onSettingsClick} 
          style={isExpanded ? expandedButtonStyle : iconButtonStyle}
          title="Pengaturan"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
          </svg>
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