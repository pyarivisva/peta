import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';
import { AuthContext } from '../context/AuthContext';
import FeedbackModal from '../components/common/FeedbackModal';
import Loading from '../components/common/Loading';

export default function AuthPage() {
  const [isLoginView, setIsLoginView] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState({ isOpen: false, title: '', message: '' });

  const showFeedback = (title, message) => {
    setFeedback({ isOpen: true, title, message });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const endpoint = isLoginView ? '/auth/login' : '/auth/register';
      const res = await api.post(endpoint, { username, password });
      
      if (isLoginView) {
        login(res.data.token, { username }); 
        navigate('/admin');
      } else {
        showFeedback("Registrasi Berhasil", "Silakan masuk.");
        setIsLoginView(true);
        setPassword('');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Gagal menghubungi server.";
      showFeedback("Terjadi Kesalahan", errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] relative overflow-hidden px-4">
      {/* Dekorasi Background - Bulatan Abstrak */}
      <div className="absolute top-[-10%] left-[-5%] w-100 h-100 bg-blue-100 rounded-full blur-[80px] opacity-60"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-100 h-100 bg-indigo-100 rounded-full blur-[80px] opacity-60"></div>

      <FeedbackModal 
        isOpen={feedback.isOpen} 
        title={feedback.title} 
        message={feedback.message} 
        onClose={() => setFeedback({ ...feedback, isOpen: false })} 
      />

      {isLoading && <Loading fullScreen={true} />}

      <div className="relative z-10 w-full max-w-110">
        {/* Card Utama */}
        <div className="bg-white/70 backdrop-blur-xl p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white/50">
          
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
              {isLoginView ? 'Welcome Back' : 'Get Started'}
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Username</label>
              <input 
                type="text" 
                value={username} 
                onChange={e => setUsername(e.target.value)} 
                required 
                className="w-full px-5 py-4 rounded-2xl bg-white border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300 placeholder:text-slate-300 text-slate-700 font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Password</label>
              <input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
                className="w-full px-5 py-4 rounded-2xl bg-white border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300 placeholder:text-slate-300 text-slate-700 font-medium"
              />
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full py-4.5 bg-slate-900 hover:bg-blue-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-slate-200 transition-all duration-300 transform active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoginView ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-100">
            <p className="text-center text-slate-500 font-medium">
              {isLoginView ? "Belum punya akses?" : "Sudah punya akun?"}
              <button 
                onClick={() => setIsLoginView(!isLoginView)} 
                className="ml-2 text-blue-600 font-bold hover:text-blue-700 transition-colors underline-offset-4 hover:underline"
              >
                {isLoginView ? 'Daftar' : 'Login'}
              </button>
            </p>
          </div>
        </div>

        {/* Tombol Kembali */}
        <button 
          onClick={() => navigate('/')} 
          className="w-full mt-8 flex items-center justify-center gap-2 text-slate-400 hover:text-slate-600 font-bold text-sm tracking-widest uppercase transition-all"
        >
          <span>←</span> Back to Map
        </button>
      </div>
    </div>
  );
}