import { NavLink, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { path: '/staff', icon: '◉', label: 'Dashboard' },
  { path: '/staff/patients', icon: '👥', label: 'Patients' },
  { path: '/staff/medical', icon: '⚕', label: 'Medical' },
  { path: '/staff/appointments', icon: '📅', label: 'Appointments' },
  { path: '/staff/documents', icon: '📄', label: 'Documents' },
  { path: '/staff/ai', icon: '🤖', label: 'AI' },
];

export default function StaffLayout({ children }) {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const isActive = (path) =>
    path === '/staff' ? location.pathname === '/staff' : location.pathname.startsWith(path);

  return (
    <div className="layout staff-layout">
      <header className="staff-header">
        <span>Staff Portal</span>
        <div className="staff-user">
          {user?.first_name} {user?.last_name}
          <button type="button" className="btn btn-outline btn-sm" onClick={signOut}>Sign Out</button>
        </div>
      </header>
      <aside className="staff-sidebar">
        {navItems.map(({ path, icon, label }) => (
          <NavLink
            key={path}
            to={path}
            className={`nav-item ${isActive(path) ? 'active' : ''}`}
          >
            <span className="nav-icon">{icon}</span>
            <span className="nav-label">{label}</span>
          </NavLink>
        ))}
        <div className="nav-divider" />
        <Link to="/login" className="nav-item nav-link-muted">← Patient Portal</Link>
      </aside>
      <main className="main staff-main">{children}</main>
      <style>{`
        .staff-layout { display: flex; flex-direction: column; min-height: 100vh; }
        .staff-header {
          display: flex; justify-content: space-between; align-items: center;
          padding: var(--space-md) var(--space-lg); background: var(--color-primary); color: white;
          font-weight: 600;
        }
        .staff-user { display: flex; align-items: center; gap: var(--space-md); }
        .staff-user .btn { background: rgba(255,255,255,0.2); color: white; border-color: rgba(255,255,255,0.5); }
        .staff-user .btn:hover { background: rgba(255,255,255,0.3); }
        .staff-sidebar {
          display: flex;
          flex-direction: row; flex-wrap: wrap; gap: 2px; padding: var(--space-md);
          background: var(--color-surface); border-bottom: 1px solid rgba(0,0,0,0.08);
        }
        .staff-main { flex: 1; padding: var(--space-lg); }
        @media (min-width: 768px) {
          .staff-layout { flex-direction: row; flex-wrap: wrap; }
          .staff-header { width: 100%; }
          .staff-sidebar {
            flex-direction: column; width: 200px; min-height: calc(100vh - 52px);
            border-bottom: none; border-right: 1px solid rgba(0,0,0,0.08);
          }
          .staff-main { padding: var(--space-lg); }
        }
        .nav-item {
          display: flex; align-items: center; gap: var(--space-sm);
          padding: var(--space-sm) var(--space-md); border-radius: var(--radius-md);
          color: var(--color-text-muted); text-decoration: none;
          transition: all 0.2s; font-weight: 500;
        }
        .nav-item:hover { color: var(--color-primary); background: rgba(15,118,110,0.08); }
        .nav-item.active { color: var(--color-primary); background: rgba(15,118,110,0.12); }
        .nav-icon { font-size: 1.1rem; }
        .nav-divider { height: 1px; background: rgba(0,0,0,0.1); margin: var(--space-sm) 0; }
        .nav-link-muted { font-size: 0.9rem; color: var(--color-text-muted); }
      `}</style>
    </div>
  );
}
