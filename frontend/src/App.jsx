import { useState } from 'react';
import MapPage from './pages/MapPage';
import AuthPage from './pages/AuthPage';
import { ThemeProvider } from './context/ThemeContext';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [showAuth, setShowAuth] = useState(false);

  // Fungsi untuk menangani login sukses
  const handleLoginSuccess = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
    setShowAuth(false);
  };

  // Fungsi untuk menangani logout
  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
    setShowAuth(false);
  };

  return (
    <ThemeProvider>
      <div style={{ backgroundColor: '#f4f7f9', minHeight: '100vh' }}>
        
        {/* Header Navigasi */}
        <header style={{ backgroundColor: 'white', padding: '15px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 2px 10px rgba(0,0,0,0.04)', marginBottom: '30px' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '22px', color: '#1890ff', letterSpacing: '-0.5px' }}>GeoMap Denpasar</h1>
            <p style={{ margin: 0, color: '#8c8c8c', fontSize: '13px' }}>Monitoring Objek Geografis</p>
          </div>
          <div>
            {token ? (
              <button onClick={handleLogout} style={{ background: '#ff4d4f', color: 'white', border: 'none', padding: '9px 22px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
                Logout Admin
              </button>
            ) : (
              !showAuth && (
                <button onClick={() => setShowAuth(true)} style={{ background: '#1890ff', color: 'white', border: 'none', padding: '9px 22px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }}>
                  Login Admin
                </button>
              )
            )}
          </div>
        </header>

        {/* Konten Dinamis (Router Manual) */}
        <main style={{ paddingBottom: '50px' }}>
          {showAuth && !token ? (
            <AuthPage onLoginSuccess={handleLoginSuccess} onCancel={() => setShowAuth(false)} />
          ) : (
            <MapPage token={token} isAdmin={!!token} />
          )}
        </main>
      </div>
    </ThemeProvider>
  );
}