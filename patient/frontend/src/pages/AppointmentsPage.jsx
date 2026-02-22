import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { appointmentAPI, staffAPI, authAPI } from '../services/api';

export default function AppointmentsPage() {
  const { isStaff } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [staff, setStaff] = useState([]);
  const [patients, setPatients] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ patient: '', staff: '', appointment_date: new Date().toISOString().slice(0, 16), duration_minutes: '30', reason: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    load();
    staffAPI.getList().then(({ data }) => setStaff(data.results || data || []));
  }, []);
  useEffect(() => {
    if (isStaff) authAPI.getPatients().then(r => setPatients(r.data?.results || r.data || []));
  }, [isStaff]);

  const load = async () => {
    try {
      const { data } = await appointmentAPI.getList();
      setAppointments(data.results || data || []);
    } catch (e) {
      alert('Failed to load appointments');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.staff || !form.reason) { alert('Fill required fields'); return; }
    setLoading(true);
    try {
      await appointmentAPI.create({
        ...(isStaff && form.patient ? { patient: form.patient } : {}),
        staff: form.staff,
        appointment_date: new Date(form.appointment_date).toISOString(),
        duration_minutes: parseInt(form.duration_minutes),
        reason: form.reason,
      });
      alert('Appointment booked');
      setShowForm(false);
      setForm({ patient: '', staff: '', appointment_date: new Date().toISOString().slice(0, 16), duration_minutes: '30', reason: '' });
      load();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to book');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!confirm('Cancel this appointment?')) return;
    try {
      await appointmentAPI.cancel(id);
      load();
    } catch (e) {
      alert('Failed to cancel');
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>Appointments</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Book</button>
      </div>
      {appointments.map((apt) => (
        <div key={apt.id} className="card">
          <strong>{new Date(apt.appointment_date).toLocaleDateString()} at {new Date(apt.appointment_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong>
          {isStaff && apt.patient_details && <p>Patient: {apt.patient_details.first_name} {apt.patient_details.last_name}</p>}
          <p>{apt.staff_details?.name} — {apt.staff_details?.specialty}</p>
          <p className="muted">{apt.reason}</p>
          <div className="card-foot">
            <span className={`chip chip-${apt.status === 'CONFIRMED' ? 'success' : apt.status === 'CANCELLED' ? 'error' : 'warning'}`}>{apt.status}</span>
            {apt.status !== 'CANCELLED' && apt.status !== 'COMPLETED' && (
              <button className="btn btn-outline btn-sm" onClick={() => handleCancel(apt.id)}>Cancel</button>
            )}
          </div>
        </div>
      ))}
      {appointments.length === 0 && <div className="card"><p className="muted">No appointments</p></div>}

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal card" onClick={(e) => e.stopPropagation()}>
            <h3>Book Appointment</h3>
            <form onSubmit={handleSubmit}>
              {isStaff && patients.length > 0 && (
                <div className="form-group">
                  <label>Patient *</label>
                  <select value={form.patient} onChange={(e) => setForm((f) => ({ ...f, patient: e.target.value }))} required>
                    <option value="">Select patient</option>
                    {patients.map((p) => <option key={p.id} value={p.id}>{p.first_name} {p.last_name}</option>)}
                  </select>
                </div>
              )}
              <div className="form-group">
                <label>Staff *</label>
                <select value={form.staff} onChange={(e) => setForm((f) => ({ ...f, staff: e.target.value }))} required>
                  <option value="">Select staff</option>
                  {staff.map((s) => <option key={s.id} value={s.id}>{s.name} — {s.specialty}</option>)}
                </select>
              </div>
              <div className="form-group"><label>Date & Time</label><input type="datetime-local" value={form.appointment_date} onChange={(e) => setForm((f) => ({ ...f, appointment_date: e.target.value }))} /></div>
              <div className="form-group"><label>Duration (min)</label><input type="number" value={form.duration_minutes} onChange={(e) => setForm((f) => ({ ...f, duration_minutes: e.target.value }))} /></div>
              <div className="form-group"><label>Reason *</label><textarea value={form.reason} onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))} rows={4} required /></div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>Book</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <style>{`
        .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-md); }
        .card-foot { display: flex; justify-content: space-between; align-items: center; margin-top: var(--space-sm); }
        .btn-sm { padding: var(--space-xs) var(--space-md); font-size: 0.85rem; }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: var(--space-md); overflow-y: auto; }
        .modal { max-width: 420px; max-height: 90vh; overflow-y: auto; }
        .modal-actions { display: flex; gap: var(--space-sm); margin-top: var(--space-md); }
      `}</style>
    </div>
  );
}
