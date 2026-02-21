import { useState, useEffect } from 'react';
import { paymentAPI } from '../services/api';

export default function PaymentsPage() {
  const [tab, setTab] = useState('bills');
  const [bills, setBills] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    Promise.all([paymentAPI.getBills(), paymentAPI.getPayments()]).then(([b, p]) => {
      setBills(b.data.results || b.data || []);
      setPayments(p.data.results || p.data || []);
    });
  }, []);

  const handlePay = async (bill) => {
    if (!confirm(`Pay P${bill.total_amount}?`)) return;
    try {
      await paymentAPI.processPayment(bill.id, {
        payment_method: 'CARD',
        transaction_id: `TXN-${Date.now()}`,
      });
      alert('Payment processed');
      const [b, p] = await Promise.all([paymentAPI.getBills(), paymentAPI.getPayments()]);
      setBills(b.data.results || b.data || []);
      setPayments(p.data.results || p.data || []);
    } catch (e) {
      alert('Failed to process payment');
    }
  };

  return (
    <div className="page">
      <h2>Payments</h2>
      <div className="tab-row">
        <button className={`tab-btn ${tab === 'bills' ? 'active' : ''}`} onClick={() => setTab('bills')}>Bills</button>
        <button className={`tab-btn ${tab === 'payments' ? 'active' : ''}`} onClick={() => setTab('payments')}>Payments</button>
      </div>
      {tab === 'bills' && bills.map((b) => (
        <div key={b.id} className="card">
          <div className="card-head">
            <strong>Bill #{b.bill_number}</strong>
            <span className={`chip chip-${b.status === 'PAID' ? 'success' : b.status === 'OVERDUE' ? 'error' : 'warning'}`}>{b.status}</span>
          </div>
          <p>{b.bill_type}</p>
          <p className="muted">{b.description}</p>
          <div className="card-foot">
            <span className="price">P{b.total_amount}</span>
            {b.status === 'PENDING' && <button className="btn btn-primary btn-sm" onClick={() => handlePay(b)}>Pay Now</button>}
          </div>
          <p className="muted">Due: {new Date(b.due_date).toLocaleDateString()}</p>
        </div>
      ))}
      {tab === 'payments' && payments.map((p) => (
        <div key={p.id} className="card">
          <strong>Payment #{p.payment_number}</strong>
          <p>Bill: {p.bill_details?.bill_number}</p>
          <p>P{p.amount} — {p.payment_method}</p>
          <span className={`chip chip-${p.status === 'COMPLETED' ? 'success' : 'default'}`}>{p.status}</span>
          <p className="muted">{new Date(p.payment_date).toLocaleDateString()}</p>
        </div>
      ))}
      <style>{`
        .tab-row { display: flex; gap: var(--space-xs); margin-bottom: var(--space-md); }
        .tab-btn { padding: var(--space-sm) var(--space-md); border: none; background: rgba(15,118,110,0.1); color: var(--color-primary); border-radius: var(--radius-md); font-weight: 600; cursor: pointer; }
        .tab-btn.active { background: var(--color-primary); color: white; }
        .card-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-sm); }
        .card-foot { display: flex; align-items: center; gap: var(--space-sm); margin-top: var(--space-sm); }
        .price { font-weight: 700; color: var(--color-primary); }
        .btn-sm { padding: var(--space-xs) var(--space-md); font-size: 0.85rem; }
      `}</style>
    </div>
  );
}
