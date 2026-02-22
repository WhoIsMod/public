import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import StaffLoginPage from './pages/StaffLoginPage';
import MainLayout from './layout/MainLayout';
import StaffLayout from './layout/StaffLayout';
import DashboardPage from './pages/DashboardPage';
import MedicalPage from './pages/MedicalPage';
import AppointmentsPage from './pages/AppointmentsPage';
import StaffPage from './pages/StaffPage';
import PharmacyPage from './pages/PharmacyPage';
import PaymentsPage from './pages/PaymentsPage';
import DocumentsPage from './pages/DocumentsPage';
import AIInterpreterPage from './pages/AIInterpreterPage';
import ProfilePage from './pages/ProfilePage';
import StaffDashboardPage from './pages/StaffDashboardPage';
import StaffPatientsPage from './pages/StaffPatientsPage';

function PrivateRoute({ children }) {
  const { token, isStaff, loading } = useAuth();
  if (loading) return <div className="loading">Loading...</div>;
  if (!token) return <Navigate to="/login" replace />;
  if (isStaff) return <Navigate to="/staff" replace />;
  return children;
}

function StaffRoute({ children }) {
  const { token, isStaff, loading } = useAuth();
  if (loading) return <div className="loading">Loading...</div>;
  if (!token) return <Navigate to="/staff-login" replace />;
  if (!isStaff) return <Navigate to="/staff-login" replace />;
  return children;
}

function PublicRoute({ children }) {
  const { token, isStaff, loading } = useAuth();
  if (loading) return <div className="loading">Loading...</div>;
  if (token) return <Navigate to={isStaff ? "/staff" : "/"} replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/staff-login" element={<PublicRoute><StaffLoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
        <Route
          path="/staff/*"
          element={
            <StaffRoute>
              <StaffLayout>
                <Routes>
                  <Route path="/" element={<StaffDashboardPage />} />
                  <Route path="patients" element={<StaffPatientsPage />} />
                  <Route path="medical" element={<MedicalPage />} />
                  <Route path="appointments" element={<AppointmentsPage />} />
                  <Route path="documents" element={<DocumentsPage />} />
                  <Route path="ai" element={<AIInterpreterPage />} />
                </Routes>
              </StaffLayout>
            </StaffRoute>
          }
        />
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
