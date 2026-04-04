import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Loading from './common/Loading';

const ProtectedRoute = ({ children }) => {
  const { token, loading } = useContext(AuthContext);

  // Jika AuthContext masih loading (sedang cek token di localStorage)
  if (loading) {
    return <Loading fullScreen={true} />;
  }

  // Jika tidak ada token, tendang ke halaman login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Jika ada token, izinkan akses ke komponen anak (Dashboard)
  return children;
};

export default ProtectedRoute;