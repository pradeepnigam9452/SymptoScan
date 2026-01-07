import React from 'react';
import './Results.css';
function Results(){
  const raw = localStorage.getItem('lastResult');
  const data = raw ? JSON.parse(raw) : null;

  if (!data) return <div className="alert alert-info">No result to show. Please check a symptom first.</div>;

  return (
    <div>
      <h3>Results for {data.symptom} {data.source && <small className="badge bg-secondary ms-2">{data.source}{data.suggested ? ' (suggested)' : ''}</small>} {data.suggestionScore && <small className="text-muted ms-2">Score: {Math.round(data.suggestionScore * 100)}%</small>}</h3>
      {data.doctorRequired && <div className="alert alert-warning">This symptom may require a doctor's attention. Please consult a doctor.</div>}

      {data.message && <div className="alert alert-info">{data.message}</div>}

      <h5>Possible Causes</h5>
      <ul>{(data.causes || []).map((c, i) => <li key={i}>{c}</li>)}</ul>

      <h5>Home Remedies</h5>
      <ul>{(data.remedies || []).map((r, i) => <li key={i}>{r}</li>)}</ul>

      <h5>Suggested OTC Medicines</h5>
      <ul>{(data.medicines && data.medicines.length) ? data.medicines.map((m, i) => <li key={i}>{m}</li>) : <li>None suggested</li>}</ul>
    </div>
  );
}

export default Results;