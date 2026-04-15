import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const url = isRegister ? 'http://localhost:5001/api/register' : 'http://localhost:5001/api/login';
      const payload = isRegister ? { name, email, password } : { email, password };
      const res = await axios.post(url, payload);
      
      if (!isRegister) {
        localStorage.setItem('token', res.data.token);
        navigate('/dashboard');
      } else {
        alert('Registration successful! Please login.');
        setIsRegister(false);
      }
    } catch (err) {
      alert('Error: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '20px' }}>
      <div className="glass-container">
        <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>{isRegister ? 'Create Account' : 'Welcome Back'}</h1>
        <form onSubmit={handleSubmit}>
          {isRegister && (
            <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required disabled={loading} />
          )}
          <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={loading} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={loading} />
          <button type="submit" style={{ marginTop: '10px' }} disabled={loading}>
            {loading ? 'Processing...' : (isRegister ? 'Register' : 'Login')}
          </button>
        </form>
        {!loading && (
          <button className="secondary" onClick={() => setIsRegister(!isRegister)} style={{ marginTop: '15px' }}>
            {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
          </button>
        )}
      </div>
    </div>
  );
}
