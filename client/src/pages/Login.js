import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';

function Login(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const submit = async (e) => {
    e.preventDefault();
    try{
    const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
    login(res.data.token, res.data.user);
    setMsg('Logged in');
    navigate('/check');
    }catch(err){
      setMsg(err.response?.data?.message || 'Error');
    }
  }

  return (
    <div className="d-flex justify-content-center">
      <div className="auth-card fade-in">
        <h3>Login</h3>
        <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
        <form onSubmit={submit}>
          <div className="mb-3">
            <label>Email</label>
            <input className="form-control" value={email} onChange={e=>setEmail(e.target.value)} />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input type="password" className="form-control" value={password} onChange={e=>setPassword(e.target.value)} />
          </div>
          <button className="btn btn-primary">Login</button>
        </form>
      </div>
    
   
    </div>
  );
}

export default Login;