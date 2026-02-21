import { NavLink, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/', icon: '◉', label: 'Dashboard' },
  { path: '/medical', icon: '⚕', label: 'Medical' },
  { path: '/appointments', icon: '📅', label: 'Appointments' },
  { path: '/staff', icon: '👥', label: 'Staff' },
  { path: '/pharmacy', icon: '💊', label: 'Pharmacy' },
  { path: '/payments', icon: '💳', label: 'Payments' },
  { path: '/documents', icon: '📄', label: 'Documents' },
  { path: '/ai', icon: '🤖', label: 'AI' },
  { path: '/profile', icon: '👤', label: 'Profile' },
];

export default function MainLayout({ children }) {
  const location = useLocation();
  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <div className="layout">
      <main className="main">{children}</main>
      <nav className="bottom-nav" role="navigation">
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
      </nav>
      <style>{`
        .layout { display: flex; flex-direction: column; min-height: 100vh; padding-bottom: 70px; }
        .main { flex: 1; padding: var(--space-md); }
        .loading { display: flex; align-items: center; justify-content: center; min-height: 100vh; font-size: 1.2rem; }
        .bottom-nav {
          position: fixed; bottom: 0; left: 0; right: 0;
          display: flex; justify-content: space-around; align-items: center;
          background: var(--color-surface); box-shadow: 0 -2px 12px rgba(0,0,0,0.08);
          padding: var(--space-sm); z-index: 100;
          overflow-x: auto; -webkit-overflow-scrolling: touch;
        }
        .nav-item {
          display: flex; flex-direction: column; align-items: center; gap: 2px;
          padding: var(--space-xs) var(--space-sm); min-width: 52px;
          color: var(--color-text-muted); text-decoration: none; border-radius: var(--radius-md);
          transition: all 0.2s; font-size: 0.7rem; font-weight: 500;
        }
        .nav-item:hover { color: var(--color-primary); }
        .nav-item.active { color: var(--color-primary); background: rgba(15,118,110,0.1); }
        .nav-icon { font-size: 1.2rem; }
        @media (min-width: 768px) {
          .layout { flex-direction: row; padding-bottom: 0; }
          .main { padding: var(--space-lg); padding-left: 220px; }
          .bottom-nav {
            top: 0; bottom: 0; left: 0; right: auto; width: 200px;
            flex-direction: column; justify-content: flex-start; padding-top: var(--space-lg);
          }
          .nav-item { flex-direction: row; width: 100%; min-width: 0; justify-content: flex-start; gap: var(--space-sm); }
        }
      `}</style>
    </div>
  );
}
