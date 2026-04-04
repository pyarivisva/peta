import { useRef, useState } from 'react';
import InfoPanel from './InfoPanel';

export default function Navbar({ onSearch, results, onSelectResult, categories, onSelectCategory, isRailExpanded, onLoginClick }) {
  const [isFocused, setIsFocused] = useState(false);
  const scrollRef = useRef(null);

  const scroll = (offset) => {
    if (scrollRef.current) scrollRef.current.scrollLeft += offset;
  };

  return (
    <div style={{ 
      position: 'absolute', 
      top: '20px', 
      // Sesuaikan jarak dari kiri berdasarkan lebar Rail
      left: isRailExpanded ? '280px' : '84px', 
      // Beri jarak dari kanan layar agar Login tidak terlalu mepet
      right: '20px', 
      zIndex: 1200, 
      display: 'flex', 
      justifyContent: 'space-between', // Mendorong Login ke kanan
      alignItems: 'flex-start',
      transition: 'left 0.3s ease' 
    }}>
      
      {/* GRUP KIRI: SEARCH & CATEGORY */}
      <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Box Input Pencarian */}
          <div style={{ 
            display: 'flex', alignItems: 'center', backgroundColor: 'white', 
            padding: '6px 18px', borderRadius: '30px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', 
            width: '390px', height: '48px', border: '1px solid #eee' 
          }}>
            <span style={{ marginRight: '12px', color: '#999' }}>🔍</span>
            <input 
              type="text" 
              placeholder="Cari lokasi wisata..." 
              onFocus={() => setIsFocused(true)}
              onChange={(e) => onSearch(e.target.value)}
              style={{ border: 'none', outline: 'none', width: '100%', fontSize: '15px' }}
            />
            {isFocused && (
              <button onClick={() => setIsFocused(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#999' }}>✕</button>
            )}
          </div>

          {/* PANEL HASIL PENCARIAN (Floating) */}
          {isFocused && results.length > 0 && (
            <div style={{ 
              width: '390px', backgroundColor: 'white', borderRadius: '12px', 
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)', maxHeight: '400px', 
              overflowY: 'auto', padding: '15px 0'
            }}>
              <div style={{ padding: '0 20px 10px 20px', borderBottom: '1px solid #f0f0f0' }}>
                <span style={{ fontSize: '11px', color: '#999', fontWeight: 'bold' }}>DITEMUKAN {results.length} TITIK</span>
              </div>
              {results.map(m => (
                <div key={m.id} onClick={() => { onSelectResult(m); setIsFocused(false); }} 
                  style={{ padding: '12px 20px', cursor: 'pointer' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                  <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{m.name}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>{m.type_name}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FILTER KATEGORI */}
        <div style={{ 
          display: 'flex', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.9)', 
          padding: '6px 10px', borderRadius: '30px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', 
          border: '1px solid #eee', backdropFilter: 'blur(4px)'
        }}>
          <button onClick={() => scroll(-120)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>❮</button>
          <div ref={scrollRef} style={{ display: 'flex', gap: '8px', overflowX: 'hidden', scrollBehavior: 'smooth', whiteSpace: 'nowrap' }}>
            {categories.map(cat => (
              <button key={cat} onClick={() => onSelectCategory(cat)} style={{ padding: '8px 16px', borderRadius: '20px', border: '1px solid #eee', background: 'white', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}>
                {cat}
              </button>
            ))}
          </div>
          <button onClick={() => scroll(120)} style={{ border: 'none', background: 'none', cursor: 'pointer' }}>❯</button>
        </div>
      </div>

      {/* GRUP KANAN: BRANDING & LOGIN (INI YANG HILANG) */}
      <div style={{ 
        display: 'flex', alignItems: 'center', gap: '15px', 
        backgroundColor: '#1890ff', padding: '8px 20px', 
        borderRadius: '30px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', color: 'white'
      }}>
        <h2 style={{ margin: 0, fontSize: '15px', fontWeight: '800' }}>GIS Bali</h2>
        <div style={{ width: '1px', height: '20px', backgroundColor: 'rgba(255,255,255,0.3)' }}></div>
        <button 
          onClick={onLoginClick}
          style={{ background: 'white', color: '#1890ff', border: 'none', padding: '6px 18px', borderRadius: '20px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' }}
        >
          Login
        </button>
      </div>
    </div>
  );
}