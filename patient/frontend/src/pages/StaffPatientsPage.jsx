import { useState, useEffect } from 'react';
import { authAPI } from '../services/api';

export default function StaffPatientsPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const { data } = await authAPI.getPatients();
      setPatients(data?.results || data || []);
    } catch (e) {
      alert('Failed to load patients');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="page">
      <h2>All Patients</h2>
      <div className="card-list">
        {patients.map((p) => (
          <div key={p.id} className="card">
            <strong>{p.first_name} {p.last_name}</strong>
            <p className="muted">ID: {p.id} · {p.email || '—'}</p>
            {p.cellphone && <p className="muted">{p.cellphone}</p>}
          </div>
        ))}
      </div>
      {patients.length === 0 && <div className="card"><p className="muted">No patients</p></div>}
    </div>
  );
}
