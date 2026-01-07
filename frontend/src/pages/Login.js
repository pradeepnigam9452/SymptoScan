import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const submit = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });
      login(res.data.token, res.data.user);
      setMsg('Login successful.');
      navigate('/check');
    } catch (err) {
      setMsg(err.response?.data?.message || 'Login failed.');
    }
  };

  return (
    <div className="login-page">
      <div className="login-card animate-fade-in">
        <h3 className="login-title">Welcome Back 👋</h3>
        <p className="login-subtitle">Log in to continue checking your health.</p>

        {msg && (
          <div
            className={`alert ${
              msg.includes('success') ? 'success' : 'error'
            } animate-shake`}
          >
            {msg}
          </div>
        )}

        <form onSubmit={submit} className="login-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn">
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
