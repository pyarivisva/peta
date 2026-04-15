import React, { useState } from 'react';

export default function ManagementPanel({ isOpen, onClose, markers, onEdit, onDelete, onSelect, style }) {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filteredData = markers.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.type_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ ...panelStyle, ...style }}>
      <div style={headerStyle}>
        <h3 style={{ margin: 0 }}>Manajemen Data</h3>
        <button onClick={onClose} style={closeButtonStyle}>✕</button>
      </div>

      <div style={{ padding: '15px', borderBottom: '1px solid #eee' }}>
        <input 
          type="text"
          placeholder="Cari nama atau tipe..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={searchInputStyle}
        />
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {filteredData.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#999', marginTop: '20px' }}>Data tidak ditemukan.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ position: 'sticky', top: 0, backgroundColor: '#f9f9f9', zIndex: 1 }}>
              <tr>
                <th style={thStyle}>Nama</th>
                <th style={thStyle}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((m) => (
                <tr key={m.id} style={trStyle} onClick={() => onSelect(m)}>
                  <td style={tdStyle}>
                    <div style={{ fontWeight: 'bold' }}>{m.name}</div>
                    <div style={{ fontSize: '11px', color: '#1890ff' }}>{m.type_name}</div>
                  </td>
                  <td style={tdStyle} onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => onEdit(m)} style={actionButtonStyle}>📝</button>
                      <button onClick={() => onDelete(m.id)} style={{ ...actionButtonStyle, color: 'red' }}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

// --- Styles ---
const panelStyle = {
  position: 'absolute', top: '80px', zIndex: 1040, width: '390px', 
  height: 'calc(100vh - 90px)', backgroundColor: 'white', borderRadius: '12px 12px 0 0',
  boxShadow: '0 8px 24px rgba(0,0,0,0.15)', transition: 'all 0.3s ease',
  display: 'flex', flexDirection: 'column', overflow: 'hidden'
};

const headerStyle = { display: 'flex', justifyContent: 'space-between', padding: '20px', borderBottom: '1px solid #eee' };
const closeButtonStyle = { border: 'none', background: 'none', cursor: 'pointer', fontSize: '18px' };
const searchInputStyle = { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', outline: 'none', boxSizing: 'border-box' };
const thStyle = { textAlign: 'left', padding: '12px 15px', fontSize: '12px', color: '#666', borderBottom: '1px solid #eee' };
const tdStyle = { padding: '12px 15px', borderBottom: '1px solid #f5f5f5', cursor: 'pointer' };
const trStyle = { transition: 'background 0.2s' };
const actionButtonStyle = { background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', padding: '5px' };