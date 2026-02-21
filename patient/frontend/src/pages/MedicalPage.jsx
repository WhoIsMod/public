import { useState, useEffect } from 'react';
import { medicalAPI } from '../services/api';

const RACES = ['AFRICAN', 'CAUCASIAN', 'ASIAN', 'MIXED', 'OTHER'];
const SEXES = ['M', 'F', 'O'];

const INIT = {
  record_id: '', heart_rate: '', underlying_condition: '', chronic_illness: '', features: '',
  race: '', sex: '', blood_pressure_systolic: '', blood_pressure_diastolic: '',
  temperature: '', weight: '', height: '', notes: '',
};

export default function MedicalPage() {
  const [records, setRecords] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(INIT);
  const [loading, setLoading] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const { data } = await medicalAPI.getRecords();
      setRecords(data.results || data || []);
    } catch (e) {
      alert('Failed to load records');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.record_id) { alert('Record ID is required'); return; }
    setLoading(true);
    try {
      const submit = {
        ...form,
        heart_rate: form.heart_rate ? parseInt(form.heart_rate) : null,
        blood_pressure_systolic: form.blood_pressure_systolic ? parseInt(form.blood_pressure_systolic) : null,
        blood_pressure_diastolic: form.blood_pressure_diastolic ? parseInt(form.blood_pressure_diastolic) : null,
        temperature: form.temperature ? parseFloat(form.temperature) : null,
        weight: form.weight ? parseFloat(form.weight) : null,
        height: form.height ? parseFloat(form.height) : null,
      };
      await medicalAPI.createRecord(submit);
      alert('Record created');
      setForm(INIT);
      setShowForm(false);
      load();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to create record');
    } finally {
      setLoading(false);
    }
  };

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="page">
      <div className="page-header">
        <h2>Medical Records</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>+ Add</button>
      </div>
      {records.map((r) => (
        <div key={r.id} className="card">
          <div className="card-head"><strong>ID: {r.record_id}</strong><span className="chip chip-default">{r.status || 'Active'}</span></div>
          {r.heart_rate && <p>Heart Rate: {r.heart_rate} bpm</p>}
          {r.chronic_illness && <p>Chronic: {r.chronic_illness}</p>}
          {r.race && <p>Race: {r.race}</p>}
          {r.sex && <p>Sex: {r.sex}</p>}
          <p className="muted">{new Date(r.created_at).toLocaleDateString()}</p>
        </div>
      ))}
      {records.length === 0 && <div className="card"><p className="muted">No records</p></div>}

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal card" onClick={(e) => e.stopPropagation()}>
            <h3>Add Medical Record</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group"><label>Record ID *</label><input value={form.record_id} onChange={(e) => update('record_id', e.target.value)} required /></div>
              <div className="form-row">
                <div className="form-group"><label>Heart Rate</label><input type="number" value={form.heart_rate} onChange={(e) => update('heart_rate', e.target.value)} /></div>
                <div className="form-group"><label>Chronic Illness</label><input value={form.chronic_illness} onChange={(e) => update('chronic_illness', e.target.value)} /></div>
              </div>
              <div className="form-group"><label>Underlying Condition</label><textarea value={form.underlying_condition} onChange={(e) => update('underlying_condition', e.target.value)} rows={2} /></div>
              <div className="form-group"><label>Race</label>
                <div className="chip-group">{RACES.map((x) => <button key={x} type="button" className={`chip ${form.race === x ? 'chip-default' : ''}`} onClick={() => update('race', x)}>{x}</button>)}</div>
              </div>
              <div className="form-group"><label>Sex</label>
                <div className="chip-group">{SEXES.map((x) => <button key={x} type="button" className={`chip ${form.sex === x ? 'chip-default' : ''}`} onClick={() => update('sex', x)}>{x === 'M' ? 'Male' : x === 'F' ? 'Female' : 'Other'}</button>)}</div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>BP Systolic</label><input type="number" value={form.blood_pressure_systolic} onChange={(e) => update('blood_pressure_systolic', e.target.value)} /></div>
                <div className="form-group"><label>BP Diastolic</label><input type="number" value={form.blood_pressure_diastolic} onChange={(e) => update('blood_pressure_diastolic', e.target.value)} /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Temp</label><input type="number" step="0.1" value={form.temperature} onChange={(e) => update('temperature', e.target.value)} /></div>
                <div className="form-group"><label>Weight (kg)</label><input type="number" step="0.1" value={form.weight} onChange={(e) => update('weight', e.target.value)} /></div>
                <div className="form-group"><label>Height (cm)</label><input type="number" value={form.height} onChange={(e) => update('height', e.target.value)} /></div>
              </div>
              <div className="form-group"><label>Notes</label><textarea value={form.notes} onChange={(e) => update('notes', e.target.value)} rows={2} /></div>
              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Saving...' : 'Submit'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
      <style>{`
        .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-md); }
        .card-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-sm); }
        .chip-group { display: flex; flex-wrap: wrap; gap: var(--space-xs); }
        .chip-group .chip { cursor: pointer; }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: var(--space-md); overflow-y: auto; }
        .modal { max-width: 480px; max-height: 90vh; overflow-y: auto; }
        .modal-actions { display: flex; gap: var(--space-sm); margin-top: var(--space-md); }
      `}</style>
    </div>
  );
}
