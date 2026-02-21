import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MainLayout from './layout/MainLayout';
import DashboardPage from './pages/DashboardPage';
import MedicalPage from './pages/MedicalPage';
import AppointmentsPage from './pages/AppointmentsPage';
import StaffPage from './pages/StaffPage';
import PharmacyPage from './pages/PharmacyPage';
import PaymentsPage from './pages/PaymentsPage';
import DocumentsPage from './pages/DocumentsPage';
import AIInterpreterPage from './pages/AIInterpreterPage';
import ProfilePage from './pages/ProfilePage';

function PrivateRoute({ children }) {
  const { token, loading } = useAuth();
  if (loading) return <div className="loading">Loading...</div>;
  return token ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { token, loading } = useAuth();
  if (loading) return <div className="loading">Loading...</div>;
  return !token ? children : <Navigate to="/" replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <MainLayout>
                <Routes>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="/medical" element={<MedicalPage />} />
                  <Route path="/appointments" element={<AppointmentsPage />} />
                  <Route path="/staff" element={<StaffPage />} />
                  <Route path="/pharmacy" element={<PharmacyPage />} />
                  <Route path="/payments" element={<PaymentsPage />} />
                  <Route path="/documents" element={<DocumentsPage />} />
                  <Route path="/ai" element={<AIInterpreterPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                </Routes>
              </MainLayout>
            </PrivateRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}
