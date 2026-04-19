import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Dashboard() {
  const [groups, setGroups] = useState([]);
  const [newGroupName, setNewGroupName] = useState('');
  const [joinGroupId, setJoinGroupId] = useState('');
  const [budgetStatus, setBudgetStatus] = useState({ budget: 0, totalSpent: 0 });
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const navigate = useNavigate();

  const currentMonth = new Date().toISOString().slice(0, 7);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) { navigate('/login'); return; }
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      try {
        const groupsRes = await axios.get('http://localhost:5001/api/groups', config);
        setGroups(groupsRes.data);
      } catch (err) {
        console.error('Groups fetch failed', err);
      }

      try {
        const budgetRes = await axios.get(`http://localhost:5001/api/budget/status?month=${currentMonth}`, config);
        setBudgetStatus(budgetRes.data);
      } catch (err) {
        console.error('Budget fetch failed', err);
      }
      
      setLoading(false);
    };
    fetchData();
  }, [navigate, currentMonth, baseUrl]);

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${baseUrl}/groups`, { name: newGroupName }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGroups([...groups, res.data]);
      setNewGroupName('');
    } catch (err) {
      alert('Error creating group');
    } finally {
      setActionLoading(false);
    }
  };

  const handleJoinGroup = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const token = localStorage.getItem('token');
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
      await axios.post(`${baseUrl}/groups/join`, { groupId: joinGroupId }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      window.location.reload(); 
    } catch (err) {
      alert('Error joining group: ' + (err.response?.data?.error || 'Invalid ID'));
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="animate-pulse">Loading Workspace...</div>
    </div>;
  }

  const budgetPercent = budgetStatus.budget > 0 ? Math.min(100, (budgetStatus.totalSpent / budgetStatus.budget) * 100) : 0;

  return (
    <div style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem' }}>Expense Hub</h1>
          <p style={{ color: 'var(--text-muted)' }}>Welcome back to your financial control center.</p>
        </div>
        <button className="secondary" onClick={() => { localStorage.removeItem('token'); navigate('/login'); }}>Sign Out</button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
        <div className="glass-container" style={{ margin: 0, padding: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>Monthly Budget</h2>
          <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Spent: ${budgetStatus.totalSpent.toFixed(2)}</span>
            <span style={{ fontWeight: 700 }}>Limit: ${budgetStatus.budget.toFixed(2)}</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ 
              width: `${budgetPercent}%`, 
              backgroundColor: budgetPercent > 90 ? 'var(--danger)' : 'var(--primary)' 
            }}></div>
          </div>
          <p style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {budgetStatus.budget === 0 ? "No budget set for this month." : `${budgetPercent.toFixed(1)}% of limit reached.`}
          </p>
        </div>

        <div className="glass-container" style={{ margin: 0, padding: '2rem' }}>
          <h2 style={{ marginBottom: '1.5rem' }}>Quick Actions</h2>
          <div style={{ display: 'flex', gap: '10px', flexDirection: 'column' }}>
            <form onSubmit={handleCreateGroup} style={{ display: 'flex', gap: '10px' }}>
              <input style={{ marginBottom: 0 }} type="text" placeholder="New Group Name" value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} required />
              <button type="submit" disabled={actionLoading} style={{ width: '120px' }}>Create</button>
            </form>
            <form onSubmit={handleJoinGroup} style={{ display: 'flex', gap: '10px' }}>
              <input style={{ marginBottom: 0 }} type="text" placeholder="Enter Group ID" value={joinGroupId} onChange={(e) => setJoinGroupId(e.target.value)} required />
              <button type="submit" className="secondary" disabled={actionLoading} style={{ width: '120px' }}>Join</button>
            </form>
          </div>
        </div>
      </div>

      <section>
        <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
          My Groups <span className="badge badge-success">{groups.length}</span>
        </h2>
        {groups.length === 0 ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ opacity: 0.6 }}>No active groups found. Create one to get started!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {groups.map(g => (
              <div key={g.id} className="glass-card animate-fade-in" onClick={() => navigate(`/groups/${g.id}`)} style={{ cursor: 'pointer' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3>{g.name}</h3>
                  <span className="badge" style={{ background: 'rgba(139, 92, 246, 0.1)', color: 'var(--primary)' }}>ID: {g.id}</span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '1rem' }}>Click to manage expenses and settlements.</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
