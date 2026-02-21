import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '', cellphone: '',
    medical_aid: '', medical_aid_number: '', next_of_kin_name: '', next_of_kin_contact: '',
    location: '', address: '',
  });

  useEffect(() => {
    if (user) {
      setForm({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        cellphone: user.cellphone || '',
        medical_aid: user.medical_aid || '',
        medical_aid_number: user.medical_aid_number || '',
        next_of_kin_name: user.next_of_kin_name || '',
        next_of_kin_contact: user.next_of_kin_contact || '',
        location: user.location || '',
        address: user.address || '',
      });
    }
  }, [user]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await authAPI.updateProfile(form);
      alert('Profile updated');
      setEditMode(false);
    } catch (e) {
      alert('Failed to update profile');
    }
  };

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="page">
      <div className="profile-header card">
        <div className="avatar">{user?.first_name?.[0]}{user?.last_name?.[0]}</div>
        <h2>{user?.first_name} {user?.last_name}</h2>
        <p className="muted">OMANG: {user?.omang}</p>
      </div>
      <div className="card">
        <h3>Personal Information</h3>
        {editMode ? (
          <form onSubmit={handleSave}>
            <div className="form-row">
              <div className="form-group"><label>First Name</label><input value={form.first_name} onChange={(e) => update('first_name', e.target.value)} /></div>
              <div className="form-group"><label>Last Name</label><input value={form.last_name} onChange={(e) => update('last_name', e.target.value)} /></div>
            </div>
            <div className="form-group"><label>Email</label><input type="email" value={form.email} onChange={(e) => update('email', e.target.value)} /></div>
            <div className="form-group"><label>Cellphone</label><input type="tel" value={form.cellphone} onChange={(e) => update('cellphone', e.target.value)} /></div>
            <div className="form-row">
              <div className="form-group"><label>Medical Aid</label><input value={form.medical_aid} onChange={(e) => update('medical_aid', e.target.value)} /></div>
              <div className="form-group"><label>Medical Aid #</label><input value={form.medical_aid_number} onChange={(e) => update('medical_aid_number', e.target.value)} /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Next of Kin</label><input value={form.next_of_kin_name} onChange={(e) => update('next_of_kin_name', e.target.value)} /></div>
              <div className="form-group"><label>Kin Contact</label><input type="tel" value={form.next_of_kin_contact} onChange={(e) => update('next_of_kin_contact', e.target.value)} /></div>
            </div>
            <div className="form-group"><label>Location</label><input value={form.location} onChange={(e) => update('location', e.target.value)} /></div>
            <div className="form-group"><label>Address</label><textarea value={form.address} onChange={(e) => update('address', e.target.value)} rows={3} /></div>
            <div className="profile-actions">
              <button type="submit" className="btn btn-primary">Save</button>
              <button type="button" className="btn btn-outline" onClick={() => setEditMode(false)}>Cancel</button>
            </div>
          </form>
        ) : (
          <>
            <div className="info-row"><span>Email</span><span>{user?.email || 'N/A'}</span></div>
            <div className="info-row"><span>Cellphone</span><span>{user?.cellphone || 'N/A'}</span></div>
            <div className="info-row"><span>Medical Aid</span><span>{user?.medical_aid || 'N/A'}</span></div>
            <div className="info-row"><span>Next of Kin</span><span>{user?.next_of_kin_name || 'N/A'}</span></div>
            <div className="info-row"><span>Location</span><span>{user?.location || 'N/A'}</span></div>
            <div className="info-row"><span>Address</span><span>{user?.address || 'N/A'}</span></div>
            <button className="btn btn-primary" onClick={() => setEditMode(true)}>Edit Profile</button>
          </>
        )}
      </div>
      <button className="btn btn-outline btn-danger" onClick={() => confirm('Logout?') && signOut()} style={{ borderColor: 'var(--color-error)', color: 'var(--color-error)' }}>
        Logout
      </button>
      <style>{`
        .profile-header { text-align: center; }
        .profile-header .avatar { width: 80px; height: 80px; margin: 0 auto var(--space-md); border-radius: 50%; background: var(--color-primary); color: white; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 700; }
        .info-row { display: flex; justify-content: space-between; padding: var(--space-sm) 0; border-bottom: 1px solid rgba(0,0,0,0.06); }
        .profile-actions { display: flex; gap: var(--space-sm); margin-top: var(--space-md); }
      `}</style>
    </div>
  );
}
