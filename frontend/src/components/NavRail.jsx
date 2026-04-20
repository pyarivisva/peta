import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Menu, 
  Database, 
  Bookmark, 
  Clock, 
  Ruler, 
  Settings,
  ChevronRight,
  Map as MapIcon
} from 'lucide-react';

export default function NavRail({ 
  isExpanded, 
  onToggleExpand, 
  onSavedClick, 
  onHistoryClick,
  onSettingsClick,
  isAdmin,
  onRulerClick,
  isRulerActive
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const isDataPage = location.pathname === '/admin/data';

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
          <Menu size={24} />
        </button>
        {isExpanded && (
          <span style={{ marginLeft: '15px', fontWeight: '800', color: '#1890ff', fontSize: '18px', whiteSpace: 'nowrap', transition: 'opacity 0.2s' }}>
            Geographic
          </span>
        )}
      </div>
      
      <div style={{ height: '1px', width: '100%', backgroundColor: '#eee', margin: '5px 0' }}></div>
      
      {/* Menu Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '10px 9px' }}>
        
        {/* TOMBOL PETA (JIKA DI DATA PAGE) */}
        {isDataPage && (
          <button 
            onClick={() => navigate('/admin')} 
            style={isExpanded ? expandedButtonStyle : iconButtonStyle} 
            title="Buka Peta"
          >
            <MapIcon size={20} />
            {isExpanded && <span style={{ marginLeft: '15px' }}>Buka Peta</span>}
          </button>
        )}

        {/* TOMBOL MANAJEMEN DATA (HANYA UNTUK ADMIN) */}
        {isAdmin && (
          <button 
            onClick={() => navigate('/admin/data')} 
            style={isExpanded ? {...expandedButtonStyle, backgroundColor: isDataPage ? '#e6f7ff' : 'transparent', color: isDataPage ? '#1890ff' : '#555'} : {...iconButtonStyle, backgroundColor: isDataPage ? '#e6f7ff' : 'transparent', color: isDataPage ? '#1890ff' : '#555'}} 
            title="Database"
          >
            <Database size={20} />
            {isExpanded && <span style={{ marginLeft: '15px' }}>Database</span>}
          </button>
        )}

        {!isDataPage && (
          <>
            <button onClick={onSavedClick} style={isExpanded ? expandedButtonStyle : iconButtonStyle} title="Lokasi Disimpan">
              <Bookmark size={20} />
              {isExpanded && <span style={{ marginLeft: '15px' }}>Lokasi Disimpan</span>}
            </button>

            <button onClick={onHistoryClick} style={isExpanded ? expandedButtonStyle : iconButtonStyle} title="Baru Dilihat">
              <Clock size={20} />
              {isExpanded && <span style={{ marginLeft: '15px' }}>Baru Dilihat</span>}
            </button>

            <button 
              onClick={onRulerClick} 
              style={isExpanded ? {...expandedButtonStyle, backgroundColor: isRulerActive ? '#e6f7ff' : 'transparent', color: isRulerActive ? '#1890ff' : '#555'} : {...iconButtonStyle, backgroundColor: isRulerActive ? '#e6f7ff' : 'transparent', color: isRulerActive ? '#1890ff' : '#555'}} 
              title="Ukur Jarak"
            >
              <Ruler size={20} />
              {isExpanded && <span style={{ marginLeft: '15px' }}>Ukur Jarak</span>}
            </button>
          </>
        )}
      </div>
      
      <div style={{ flex: 1 }}></div>
      
      {/* Bottom Item */}
      <div style={{ padding: '10px 9px', position: 'relative' }}>
        <button 
          onClick={onSettingsClick} 
          style={isExpanded ? expandedButtonStyle : iconButtonStyle}
          title="Pengaturan"
        >
          <Settings size={20} />
          {isExpanded && <span style={{ marginLeft: '15px' }}>Pengaturan</span>}
        </button>
      </div>
    </div>
  );
}

const iconButtonStyle = {
  background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer',
  borderRadius: '12px', transition: 'all 0.2s', color: '#555',
  width: '46px', height: '46px', display: 'flex', alignItems: 'center', justifyContent: 'center',
  flexShrink: 0
};

const expandedButtonStyle = {
  ...iconButtonStyle,
  width: '100%',
  justifyContent: 'flex-start',
  paddingLeft: '13px',
  fontSize: '14px',
  fontWeight: '600',
  whiteSpace: 'nowrap'
};