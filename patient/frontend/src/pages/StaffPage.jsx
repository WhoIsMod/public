import { useState, useEffect } from 'react';
import { staffAPI } from '../services/api';

export default function StaffPage() {
  const [staff, setStaff] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    staffAPI.getList().then(({ data }) => {
      const list = data.results || data || [];
      setStaff(list);
      setFiltered(list);
    });
  }, []);

  useEffect(() => {
    if (!search) setFiltered(staff);
    else {
      const q = search.toLowerCase();
      setFiltered(staff.filter((s) =>
        (s.name || '').toLowerCase().includes(q) ||
        (s.specialty || '').toLowerCase().includes(q) ||
        (s.department || '').toLowerCase().includes(q)
      ));
    }
  }, [search, staff]);

  return (
    <div className="page">
      <h2>Medical Staff</h2>
      <input
        type="search"
        placeholder="Search by name, specialty, department"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />
      {filtered.map((s) => (
        <div key={s.id} className="card">
          <div className="card-head">
            <strong>{s.name}</strong>
            {s.is_available && <span className="chip chip-success">Available</span>}
          </div>
          <span className="chip chip-default">{s.specialty}</span>
          <p className="muted">{s.department}</p>
          {s.qualification && <p className="muted">{s.qualification}</p>}
          {s.bio && <p className="muted italic">{s.bio}</p>}
          <div className="contact-row">
            {s.email && <span>Email: {s.email}</span>}
            {s.phone && <span>Phone: {s.phone}</span>}
          </div>
        </div>
      ))}
      {filtered.length === 0 && <div className="card"><p className="muted">No staff found</p></div>}
      <style>{`
        .search-input { width: 100%; padding: var(--space-sm) var(--space-md); margin-bottom: var(--space-md); border: 2px solid rgba(15,118,110,0.2); border-radius: var(--radius-md); }
        .card-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-sm); }
        .contact-row { margin-top: var(--space-sm); padding-top: var(--space-sm); border-top: 1px solid rgba(0,0,0,0.06); font-size: 0.9rem; color: var(--color-text-muted); }
        .italic { font-style: italic; }
      `}</style>
    </div>
  );
}
