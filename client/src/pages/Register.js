import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';

function Register(){
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  // const submit = async (e) => {
  //   e.preventDefault();
  //   try{
  //   const res = await axios.post('http:localhost:5000/api/auth/register', { name, email, password });
  //   login(res.data.token, res.data.user);
  //   setMsg('Registered and logged in');
  //   navigate('/check');
  //   }catch(err){
  //     setMsg(err.response?.data?.message || 'Error');
  //   }
  // }
  const submit = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post('http://localhost:5000/api/auth/register', { name, email, password });
    login(res.data.token, res.data.user);
    setMsg('Registered and logged in');
    navigate('/check');
  } catch (err) {
    setMsg(err.response?.data?.message || 'Error');
  }
};


  return (
     <div className="d-flex justify-content-center">
       <div className="auth-card fade-in">
         <h3>Register</h3>
         {msg && <div className="alert alert-info">{msg}</div>}
         <form onSubmit={submit}>
           <div className="mb-3">
             <label>Name</label>
             <input className="form-control" value={name} onChange={e=>setName(e.target.value)} />
           </div>
           <div className="mb-3">
             <label>Email</label>
             <input className="form-control" value={email} onChange={e=>setEmail(e.target.value)} />
           </div>
           <div className="mb-3">
             <label>Password</label>
             <input type="password" className="form-control" value={password} onChange={e=>setPassword(e.target.value)} />
           </div>
           <button className="btn btn-primary">Register</button>
         </form>
       </div>

    
    </div>
  );
}

export default Register;