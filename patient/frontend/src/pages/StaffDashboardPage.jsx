import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI, medicalAPI, appointmentAPI, documentAPI } from '../services/api';

export default function StaffDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ patients: 0, records: 0, appointments: 0, documents: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const [p, r, a, d] = await Promise.all([
        authAPI.getPatients(),
        medicalAPI.getRecords(),
        appointmentAPI.getList(),
        documentAPI.getList(),
      ]);
      const patients = p.data?.results || p.data || [];
      const records = r.data?.results || r.data || [];
      const appointments = a.data?.results || a.data || [];
      const documents = d.data?.results || d.data || [];
      setStats({
        patients: Array.isArray(patients) ? patients.length : 0,
        records: Array.isArray(records) ? records.length : 0,
        appointments: Array.isArray(appointments) ? appointments.length : 0,
        documents: Array.isArray(documents) ? documents.length : 0,
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <header className="dash-header">
        <div className="avatar staff-avatar">{user?.first_name?.[0]}{user?.last_name?.[0]}</div>
        <div>
          <p className="greeting">Staff Portal</p>
          <h2>{user?.first_name} {user?.last_name}</h2>
        </div>
      </header>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="stats-grid">
            <Link to="/staff/patients" className="card stat-card"><span className="stat-icon">👥</span><span className="stat-num">{stats.patients}</span><span>Patients</span></Link>
            <Link to="/staff/medical" className="card stat-card"><span className="stat-icon">⚕</span><span className="stat-num">{stats.records}</span><span>Medical Records</span></Link>
            <Link to="/staff/appointments" className="card stat-card"><span className="stat-icon">📅</span><span className="stat-num">{stats.appointments}</span><span>Appointments</span></Link>
            <Link to="/staff/documents" className="card stat-card"><span className="stat-icon">📄</span><span className="stat-num">{stats.documents}</span><span>Documents</span></Link>
          </div>
          <div className="card">
            <h3>Quick Actions</h3>
            <div className="action-btns">
              <Link to="/staff/medical" className="btn btn-primary">Add Medical Record</Link>
              <Link to="/staff/appointments" className="btn btn-outline">Manage Appointments</Link>
              <Link to="/staff/ai" className="btn btn-outline">AI Document Interpreter</Link>
            </div>
          </div>
        </>
      )}
      <style>{`
        .page h2 { margin: 0; font-size: 1.25rem; }
        .greeting { color: var(--color-text-muted); margin: 0; font-size: 0.9rem; }
        .dash-header { display: flex; align-items: center; gap: var(--space-md); margin-bottom: var(--space-lg); }
        .avatar { width: 56px; height: 56px; border-radius: 50%; background: var(--color-primary); color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.2rem; }
        .staff-avatar { background: #0d9488; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: var(--space-md); margin-bottom: var(--space-lg); }
        .stat-card { text-align: center; text-decoration: none; color: inherit; }
        .stat-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .stat-icon { font-size: 1.5rem; display: block; margin-bottom: var(--space-xs); }
        .stat-num { font-size: 1.5rem; font-weight: 700; display: block; color: var(--color-primary); }
        .action-btns { display: flex; flex-direction: column; gap: var(--space-sm); }
      `}</style>
    </div>
  );
}
