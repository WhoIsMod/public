import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import '../styles/Auth.css';

const INIT_FORM = {
  username: '', email: '', password: '', password2: '',
  first_name: '', last_name: '', omang: '', cellphone: '',
  medical_aid: '', medical_aid_number: '',
  next_of_kin_name: '', next_of_kin_contact: '', location: '', address: '',
};

export default function RegisterPage() {
  const [form, setForm] = useState(INIT_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleChange = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!form.omang || !form.password || !form.first_name || !form.last_name) {
      setError('Please fill in all required fields');
      return;
    }
    if (form.password !== form.password2) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { password2, ...data } = form;
      await authAPI.register(data);
      const { data: loginData } = await authAPI.login({ omang: form.omang, password: form.password });
      signIn(loginData.access, loginData.patient);
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.error ||
        (err.response?.data && Object.values(err.response.data)[0]?.[0]) ||
        'Registration failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card card auth-card-wide">
        <h1 className="auth-title">Register</h1>
        <form onSubmit={handleRegister}>
          <div className="form-row">
            <div className="form-group"><label>First Name *</label><input value={form.first_name} onChange={(e) => handleChange('first_name', e.target.value)} required /></div>
            <div className="form-group"><label>Last Name *</label><input value={form.last_name} onChange={(e) => handleChange('last_name', e.target.value)} required /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>OMANG *</label><input type="text" inputMode="numeric" value={form.omang} onChange={(e) => handleChange('omang', e.target.value)} required /></div>
            <div className="form-group"><label>Cellphone *</label><input type="tel" value={form.cellphone} onChange={(e) => handleChange('cellphone', e.target.value)} required /></div>
          </div>
          <div className="form-group"><label>Email</label><input type="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} /></div>
          <div className="form-group"><label>Username</label><input value={form.username} onChange={(e) => handleChange('username', e.target.value)} /></div>
          <div className="form-row">
            <div className="form-group"><label>Medical Aid</label><input value={form.medical_aid} onChange={(e) => handleChange('medical_aid', e.target.value)} /></div>
            <div className="form-group"><label>Medical Aid Number</label><input value={form.medical_aid_number} onChange={(e) => handleChange('medical_aid_number', e.target.value)} /></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label>Next of Kin Name *</label><input value={form.next_of_kin_name} onChange={(e) => handleChange('next_of_kin_name', e.target.value)} required /></div>
            <div className="form-group"><label>Next of Kin Contact *</label><input type="tel" value={form.next_of_kin_contact} onChange={(e) => handleChange('next_of_kin_contact', e.target.value)} required /></div>
          </div>
          <div className="form-group"><label>Location *</label><input value={form.location} onChange={(e) => handleChange('location', e.target.value)} required /></div>
          <div className="form-group"><label>Address *</label><textarea value={form.address} onChange={(e) => handleChange('address', e.target.value)} rows={3} required /></div>
          <div className="form-row">
            <div className="form-group"><label>Password *</label><input type="password" value={form.password} onChange={(e) => handleChange('password', e.target.value)} required /></div>
            <div className="form-group"><label>Confirm Password *</label><input type="password" value={form.password2} onChange={(e) => handleChange('password2', e.target.value)} required /></div>
          </div>
          {error && <p className="error-msg">{error}</p>}
          <button type="submit" className="btn btn-primary full" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="auth-link">Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
}
