import { Navigate, BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import MapPage from './pages/MapPage';
import AdminDataPage from './pages/AdminDataPage';
import AuthPage from './pages/AuthPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/" element={<MapPage />} />
            <Route path="/login" element={<AuthPage />} />

            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <MapPage isAdmin={true} />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/admin/data" 
              element={
                <ProtectedRoute>
                  <AdminDataPage />
                </ProtectedRoute>
              } 
            />

            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;