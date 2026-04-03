import { useState } from 'react';
import axios from 'axios';
import FeedbackModal from '../components/FeedbackModal'; // Import Modal

const API_URL = 'http://localhost:3000/api';

export default function AuthPage({ onLoginSuccess, onCancel }) {
  const [isLoginView, setIsLoginView] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // State untuk Modal Alert
  const [feedback, setFeedback] = useState({ isOpen: false, title: '', message: '' });

  const showFeedback = (title, message) => {
    setFeedback({ isOpen: true, title, message });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const endpoint = isLoginView ? '/auth/login' : '/auth/register';
      const res = await axios.post(`${API_URL}${endpoint}`, { username, password });
      
      if (isLoginView) {
        onLoginSuccess(res.data.token);
      } else {
        showFeedback("Registrasi Berhasil", "Silakan masuk menggunakan akun baru Anda.");
        setIsLoginView(true);
        setPassword('');
      }
    } catch (err) {
      console.error(err);
      showFeedback("Terjadi Kesalahan", err.response?.data?.message || "Gagal menghubungi server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <FeedbackModal 
        isOpen={feedback.isOpen} 
        title={feedback.title} 
        message={feedback.message} 
        onClose={() => setFeedback({ ...feedback, isOpen: false })} 
      />

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '16px', width: '100%', maxWidth: '350px', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#1a1a1a' }}>
            {isLoginView ? 'Admin Login' : 'Buat Akun Admin'}
          </h2>
          
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '15px' }}>
              <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box', outline: 'none' }} />
            </div>
            <div style={{ marginBottom: '25px' }}>
              <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box', outline: 'none' }} />
            </div>
            <button type="submit" disabled={isLoading} style={{ width: '100%', padding: '14px', background: '#1890ff', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px', transition: '0.3s' }}>
              {isLoading ? 'Memproses...' : (isLoginView ? 'Masuk Sekarang' : 'Daftar Akun')}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '25px', fontSize: '14px' }}>
            <span style={{ color: '#666' }}>{isLoginView ? "Belum memiliki akses? " : "Sudah memiliki akun? "}</span>
            <button onClick={() => setIsLoginView(!isLoginView)} style={{ background: 'none', border: 'none', color: '#1890ff', cursor: 'pointer', fontWeight: 'bold', padding: 0 }}>
              {isLoginView ? 'Daftar Admin' : 'Login'}
            </button>
          </div>
          
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button onClick={onCancel} style={{ background: 'none', border: 'none', color: '#999', cursor: 'pointer', textDecoration: 'underline', fontSize: '13px' }}>
              Kembali ke Peta Publik
            </button>
          </div>
        </div>
      </div>
    </>
  );
}