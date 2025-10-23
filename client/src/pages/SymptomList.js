import React, { useEffect, useState } from 'react';
import axios from 'axios';

function SymptomList(){
  const [list, setList] = useState([]);
  const [msg, setMsg] = useState('');

  useEffect(()=>{
    axios.get('http://localhost:5000/api/symptoms/all').then(res=>{
      setList(res.data.symptoms || []);
    }).catch(err=> setMsg(err.response?.data?.message || 'Error'))
  },[])

  return (
    <div>
      <h3>Seeded Symptoms</h3>
      {msg && <div className="alert alert-danger">{msg}</div>}
      <ul className="list-group">
        {list.map(s => (
          <li key={s._id} className="list-group-item">
            <strong>{s.name}</strong>
            <div>Causes: {s.causes?.join(', ')}</div>
            <div>Remedies: {s.remedies?.join(', ')}</div>
            <div>Medicines: {s.medicines?.join(', ')}</div>
            <div>Doctor required: {s.doctorRequired ? 'Yes' : 'No'}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SymptomList;