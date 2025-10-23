import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SymptomInput(){
  const [symptom, setSymptom] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    try{
      const token = localStorage.getItem('token');
      // Try authenticated endpoint first
      try {
        const res = await axios.post('http://localhost:5000/api/symptoms/check', { symptom }, { headers: { Authorization: `Bearer ${token}` } });
        localStorage.setItem('lastResult', JSON.stringify(res.data));
        navigate('/results');
        return;
      } catch (innerErr) {
        // If unauthorized, fallback to public endpoint
        if (innerErr.response && innerErr.response.status === 401) {
          const publicRes = await axios.post('http://localhost:5000/api/symptoms/check-public', { symptom });
          localStorage.setItem('lastResult', JSON.stringify(publicRes.data));
          navigate('/results');
          return;
        }
        throw innerErr; // rethrow others
      }
    }catch(err){
      setMsg(err.response?.data?.message || 'Error');
    }
  }

  return (
    <div className="col-md-6 offset-md-3">
      <h3>Check Symptom</h3>
      {msg && <div className="alert alert-danger">{msg}</div>}
      <form onSubmit={submit}>
        <div className="mb-3">
          <label>Symptom (e.g., headache, fever, cold)</label>
          <input className="form-control" value={symptom} onChange={e=>setSymptom(e.target.value)} />
        </div>
        <button className="btn btn-primary">Check</button>
      </form>
    </div>
  );
}

export default SymptomInput;