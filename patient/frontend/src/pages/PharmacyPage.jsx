import { useState, useEffect } from 'react';
import { pharmacyAPI } from '../services/api';

export default function PharmacyPage() {
  const [tab, setTab] = useState('medications');
  const [medications, setMedications] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    Promise.all([
      pharmacyAPI.getMedications(),
      pharmacyAPI.getPrescriptions(),
      pharmacyAPI.getOrders(),
    ]).then(([m, p, o]) => {
      setMedications(m.data.results || m.data || []);
      setPrescriptions(p.data.results || p.data || []);
      setOrders(o.data.results || o.data || []);
    });
  }, []);

  const filtered = medications.filter((m) =>
    (m.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (m.generic_name || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleOrder = async (med) => {
    if (!confirm(`Order ${med.name}?`)) return;
    try {
      await pharmacyAPI.createOrder({
        items: [{ medication: med.id, quantity: 1 }],
        total_amount: med.price?.toString(),
        shipping_address: 'Patient Address',
      });
      alert('Order placed');
      const { data } = await pharmacyAPI.getOrders();
      setOrders(data.results || data || []);
    } catch (e) {
      alert('Failed to place order');
    }
  };

  return (
    <div className="page">
      <h2>Pharmacy</h2>
      <div className="tab-row">
        {['medications', 'prescriptions', 'orders'].map((t) => (
          <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>
      {tab === 'medications' && (
        <>
          <input type="search" placeholder="Search medications" value={search} onChange={(e) => setSearch(e.target.value)} className="search-input" />
          {filtered.map((m) => (
            <div key={m.id} className="card">
              <strong>{m.name}</strong>
              {m.generic_name && <p className="muted">{m.generic_name}</p>}
              <p>{m.description}</p>
              <p className="muted">Dosage: {m.dosage}</p>
              <div className="card-foot">
                <span className="price">P{m.price}</span>
                {m.requires_prescription && <span className="chip chip-warning">Prescription</span>}
                <button className="btn btn-primary btn-sm" onClick={() => handleOrder(m)}>Order</button>
              </div>
            </div>
          ))}
        </>
      )}
      {tab === 'prescriptions' && prescriptions.map((p) => (
        <div key={p.id} className="card">
          <strong>{p.medication_details?.name}</strong>
          <p>Quantity: {p.quantity}</p>
          <p>{p.instructions}</p>
          <p className="muted">Prescribed by: {p.prescribed_by}</p>
          <span className="chip chip-default">{p.status}</span>
        </div>
      ))}
      {tab === 'orders' && orders.map((o) => (
        <div key={o.id} className="card">
          <strong>Order #{o.order_number}</strong>
          <p>Total: P{o.total_amount}</p>
          <p className="muted">{o.shipping_address}</p>
          <span className="chip chip-default">{o.status}</span>
          <p className="muted">{new Date(o.created_at).toLocaleDateString()}</p>
        </div>
      ))}
      <style>{`
        .tab-row { display: flex; gap: var(--space-xs); margin-bottom: var(--space-md); }
        .tab-btn { padding: var(--space-sm) var(--space-md); border: none; background: rgba(15,118,110,0.1); color: var(--color-primary); border-radius: var(--radius-md); font-weight: 600; cursor: pointer; }
        .tab-btn.active { background: var(--color-primary); color: white; }
        .search-input { width: 100%; padding: var(--space-sm) var(--space-md); margin-bottom: var(--space-md); border: 2px solid rgba(15,118,110,0.2); border-radius: var(--radius-md); }
        .card-foot { display: flex; align-items: center; gap: var(--space-sm); margin-top: var(--space-sm); flex-wrap: wrap; }
        .price { font-weight: 700; color: var(--color-primary); }
        .btn-sm { padding: var(--space-xs) var(--space-md); font-size: 0.85rem; }
      `}</style>
    </div>
  );
}
