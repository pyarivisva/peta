import React from 'react';

export default function SettingsPanel({ isOpen, onClose, activeTheme, setActiveTheme }) {
  if (!isOpen) return null;

  const themes = [
    { id: 'standard', name: 'Standard Light', icon: '🗺️' },
    { id: 'satellite', name: 'Satellite View', icon: '🛰️' },
    { id: 'dark', name: 'Dark Mode', icon: '🌙' },
  ];

  return (
    <>
      <div 
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 2000,
          animation: 'fadeIn 0.2s ease-out'
        }}
      />

      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '400px',
        backgroundColor: 'white',
        borderRadius: '16px',
        boxShadow: '0 12px 40px rgba(0,0,0,0.3)',
        zIndex: 2001,
        padding: '30px',
        animation: 'zoomIn 0.3s ease-out',
        border: '1px solid #eee'
      }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '800', color: '#333' }}>
            Pengaturan Tampilan
          </h2>
          <button 
            onClick={onClose}
            style={{ 
              border: 'none', 
              background: '#f0f2f5', 
              color: '#999', 
              width: '32px', 
              height: '32px', 
              borderRadius: '50%', 
              cursor: 'pointer', 
              fontSize: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => { e.target.style.background = '#e2e5e9'; e.target.style.color = '#333'; }}
            onMouseLeave={(e) => { e.target.style.background = '#f0f2f5'; e.target.style.color = '#999'; }}
          >
            ✕
          </button>
        </div>

        {/* List Pilihan Tema */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <span style={{ fontSize: '12px', color: '#999', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Pilih Tema Peta
          </span>
          
          {themes.map((t) => (
            <div 
              key={t.id}
              onClick={() => {
                setActiveTheme(t.id);
                // console.log("Mencoba mengganti tema ke:", t.id);
                onClose();
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                padding: '16px',
                borderRadius: '12px',
                cursor: 'pointer',
                border: activeTheme === t.id ? '2px solid #1890ff' : '1px solid #eee',
                backgroundColor: activeTheme === t.id ? '#e6f7ff' : 'white',
                transition: 'all 0.2s ease',
                boxShadow: activeTheme === t.id ? '0 4px 12px rgba(24,144,255,0.1)' : 'none'
              }}
              onMouseEnter={(e) => { if(activeTheme !== t.id) e.currentTarget.style.borderColor = '#d9d9d9'; }}
              onMouseLeave={(e) => { if(activeTheme !== t.id) e.currentTarget.style.borderColor = '#eee'; }}
            >
              <span style={{ fontSize: '24px' }}>{t.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '15px', fontWeight: activeTheme === t.id ? 'bold' : '600', color: activeTheme === t.id ? '#1890ff' : '#333' }}>
                  {t.name}
                </div>
                {activeTheme === t.id && <span style={{ fontSize: '12px', color: '#1890ff' }}>Sedang Aktif</span>}
              </div>
              {activeTheme === t.id && <span style={{ color: '#1890ff', fontSize: '18px' }}>✓</span>}
            </div>
          ))}
        </div>

        <button 
          onClick={onClose}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#1890ff',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            marginTop: '25px',
            fontWeight: 'bold',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Selesai
        </button>
      </div>
    </>
  );
}