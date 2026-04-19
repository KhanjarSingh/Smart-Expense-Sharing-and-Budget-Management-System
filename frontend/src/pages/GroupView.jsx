import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function GroupView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('expenses'); // 'expenses', 'history', 'settlements'
  const [members, setMembers] = useState([]);
  const [balances, setBalances] = useState({});
  const [history, setHistory] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [splitType, setSplitType] = useState('equal');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
      const [membersRes, balancesRes, historyRes, settlementsRes] = await Promise.all([
        axios.get(`${baseUrl}/groups/${id}/members`, config),
        axios.get(`${baseUrl}/groups/${id}/balances`, config),
        axios.get(`${baseUrl}/groups/${id}/expenses`, config),
        axios.get(`${baseUrl}/groups/${id}/settlements`, config)
      ]);
      
      setMembers(membersRes.data.members);
      setBalances(balancesRes.data);
      setHistory(historyRes.data);
      setSettlements(settlementsRes.data);
    } catch (err) {
      alert('Error fetching group data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
      await axios.post(`${baseUrl}/expenses`, {
        groupId: parseInt(id),
        amount: parseFloat(amount),
        description,
        splitType,
        splitData: []
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAmount('');
      setDescription('');
      fetchData();
      setActiveTab('history');
    } catch (err) {
      alert('Error adding expense');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Loading Group...</div>;
  }

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <button className="secondary" onClick={() => navigate('/dashboard')} style={{ width: 'auto', marginBottom: '1rem' }}>&larr; Back</button>
          <h1>Group Detail <span className="badge" style={{ verticalAlign: 'middle' }}>#{id}</span></h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className={activeTab === 'expenses' ? '' : 'secondary'} onClick={() => setActiveTab('expenses')} style={{ width: 'auto' }}>Add Expense</button>
          <button className={activeTab === 'history' ? '' : 'secondary'} onClick={() => setActiveTab('history')} style={{ width: 'auto' }}>History</button>
          <button className={activeTab === 'settlements' ? '' : 'secondary'} onClick={() => setActiveTab('settlements')} style={{ width: 'auto' }}>Settlements</button>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
        <main>
          {activeTab === 'expenses' && (
            <div className="glass-container animate-fade-in" style={{ margin: 0 }}>
              <h2 style={{ marginBottom: '1.5rem' }}>Record New Expense</h2>
              <form onSubmit={handleAddExpense}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>How much was spent?</label>
                <input type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} required disabled={submitting} />
                
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>What was it for?</label>
                <input type="text" placeholder="e.g. Weekly Groceries" value={description} onChange={(e) => setDescription(e.target.value)} required disabled={submitting} />
                
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Splitting Strategy</label>
                <select value={splitType} onChange={(e) => setSplitType(e.target.value)} disabled={submitting}>
                  <option value="equal">Split Equally</option>
                  <option value="percentage">Split by Percentage</option>
                </select>
                
                <button type="submit" style={{ marginTop: '1rem' }} disabled={submitting}>
                  {submitting ? 'Recording...' : 'Save Expense'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="animate-fade-in">
              <h2 style={{ marginBottom: '1.5rem' }}>Transaction History</h2>
              {history.length === 0 ? (
                <div className="glass-card" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No transactions yet.</div>
              ) : (
                history.map(exp => (
                  <div key={exp.id} className="glass-card" style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h4 style={{ fontSize: '1.1rem' }}>{exp.description}</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Paid by {exp.payer?.name || 'User ' + exp.paidBy}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>${exp.amount.toFixed(2)}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{new Date(exp.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'settlements' && (
            <div className="animate-fade-in">
              <h2 style={{ marginBottom: '1.5rem' }}>Optimization Strategy</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                We've calculated the minimum number of transactions to settle all debts in this group.
              </p>
              {settlements.length === 0 ? (
                <div className="glass-card" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Everything is settled!</div>
              ) : (
                settlements.map((s, idx) => (
                  <div key={idx} className="glass-card" style={{ marginBottom: '1rem', borderLeft: '4px solid var(--primary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ fontWeight: 600 }}>User {s.from}</span>
                      <span style={{ color: 'var(--text-muted)' }}>&rarr;</span>
                      <span style={{ fontWeight: 600 }}>User {s.to}</span>
                      <div style={{ marginLeft: 'auto', fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary)' }}>
                        ${s.amount.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </main>

        <aside>
          <div className="glass-container" style={{ margin: 0, padding: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Group Members</h3>
            <ul style={{ listStyle: 'none' }}>
              {members.map(m => (
                <li key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700 }}>
                    {m.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{m.name}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ID: {m.id}</div>
                  </div>
                </li>
              ))}
            </ul>

            <h3 style={{ marginTop: '2rem', marginBottom: '1rem', fontSize: '1.1rem' }}>Net Balances</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {members.map(m => {
                const bal = balances[m.id] || 0;
                return (
                  <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px' }}>
                    <span style={{ fontSize: '0.85rem' }}>{m.name}</span>
                    <span style={{ 
                      fontSize: '0.85rem', 
                      fontWeight: 700,
                      color: bal > 0 ? 'var(--success)' : bal < 0 ? 'var(--danger)' : 'var(--text-muted)'
                    }}>
                      {bal > 0 ? `+ $${bal.toFixed(2)}` : bal < 0 ? `- $${Math.abs(bal).toFixed(2)}` : '$0.00'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
