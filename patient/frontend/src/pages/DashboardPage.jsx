import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { medicalAPI, appointmentAPI, paymentAPI } from '../services/api';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ medicalRecords: 0, appointments: 0, pendingBills: 0 });
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const [r, a, b] = await Promise.all([
        medicalAPI.getRecords(),
        appointmentAPI.getList(),
        paymentAPI.getBills(),
      ]);
      const records = r.data.results || r.data || [];
      const apps = a.data.results || a.data || [];
      const bills = b.data.results || b.data || [];
      setStats({
        medicalRecords: records.length,
        appointments: apps.length,
        pendingBills: bills.filter((x) => x.status === 'PENDING').length,
      });
      setUpcoming(
        apps.filter((x) => x.status === 'CONFIRMED' || x.status === 'PENDING').slice(0, 3)
      );
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <header className="dash-header">
        <div className="avatar">{user?.first_name?.[0]}{user?.last_name?.[0]}</div>
        <div>
          <p className="greeting">Welcome back,</p>
          <h2>{user?.first_name} {user?.last_name}</h2>
        </div>
      </header>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="stats-grid">
            <div className="card stat-card"><span className="stat-icon">⚕</span><span className="stat-num">{stats.medicalRecords}</span><span>Medical Records</span></div>
            <div className="card stat-card"><span className="stat-icon">📅</span><span className="stat-num">{stats.appointments}</span><span>Appointments</span></div>
            <div className="card stat-card"><span className="stat-icon">💳</span><span className="stat-num">{stats.pendingBills}</span><span>Pending Bills</span></div>
          </div>
          <div className="card">
            <h3>Quick Actions</h3>
            <div className="action-btns">
              <Link to="/medical" className="btn btn-primary">Add Medical Record</Link>
              <Link to="/appointments" className="btn btn-outline">Book Appointment</Link>
              <Link to="/documents" className="btn btn-outline">Upload Document</Link>
            </div>
          </div>
          {upcoming.length > 0 && (
            <div className="card">
              <h3>Upcoming Appointments</h3>
              {upcoming.map((apt) => (
                <div key={apt.id} className="apt-row">
                  <div>
                    <strong>{new Date(apt.appointment_date).toLocaleDateString()}</strong>
                    <span> {new Date(apt.appointment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <p className="muted">{apt.staff_details?.name}</p>
                  </div>
                  <span className={`chip chip-${apt.status === 'CONFIRMED' ? 'success' : 'warning'}`}>{apt.status}</span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
      <style>{`
        .page h2 { margin: 0; font-size: 1.25rem; }
        .greeting { color: var(--color-text-muted); margin: 0; font-size: 0.9rem; }
        .dash-header { display: flex; align-items: center; gap: var(--space-md); margin-bottom: var(--space-lg); }
        .avatar { width: 56px; height: 56px; border-radius: 50%; background: var(--color-primary); color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 1.2rem; }
        .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-md); margin-bottom: var(--space-lg); }
        .stat-card { text-align: center; }
        .stat-icon { font-size: 1.5rem; display: block; margin-bottom: var(--space-xs); }
        .stat-num { font-size: 1.5rem; font-weight: 700; display: block; color: var(--color-primary); }
        .action-btns { display: flex; flex-direction: column; gap: var(--space-sm); }
        .apt-row { display: flex; justify-content: space-between; align-items: center; padding: var(--space-sm) 0; border-bottom: 1px solid rgba(0,0,0,0.06); }
        .apt-row:last-child { border-bottom: none; }
        .muted { color: var(--color-text-muted); margin: 2px 0 0; font-size: 0.9rem; }
      `}</style>
    </div>
  );
}
