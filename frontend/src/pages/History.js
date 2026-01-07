import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './History.css';

export default function History() {
  const [history, setHistory] = useState([]);
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setMsg('No authentication token found.');
          setLoading(false);
          return;
        }

        const res = await axios.get('http://localhost:5000/api/user/history', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setHistory(
          (res.data.history || []).sort(
            (a, b) => new Date(b.checkedAt) - new Date(a.checkedAt)
          )
        );
      } catch (err) {
        setMsg(err.response?.data?.message || 'Error loading history');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="history-page">
      <div className="history-card animate-fade-in">
        <h3 className="history-title">🩺 Your Health History</h3>

        {/* Status messages */}
        {loading && <div className="loading-placeholder">Loading history...</div>}
        {!loading && msg && <div className="alert error animate-shake">{msg}</div>}
        {!loading && history.length === 0 && !msg && (
          <div className="alert info">No history yet. Start by checking your symptoms!</div>
        )}

        {/* History list */}
        <ul className="history-list">
          {history.map((h, idx) => (
            <li
              key={idx}
              className={`history-item animate-slide-in ${
                h.result?.doctorRequired ? 'urgent' : 'normal'
              }`}
              style={{ animationDelay: `${idx * 0.08}s` }}
            >
              <div className="history-header">
                <h4>{h.symptom}</h4>
                <span>{new Date(h.checkedAt).toLocaleString()}</span>
              </div>

              <div className="history-body">
                {h.result?.message ? (
                  <em
                    className={`${
                      h.result?.doctorRequired ? 'text-danger' : 'text-success'
                    }`}
                  >
                    {h.result.message}
                  </em>
                ) : (
                  <span>
                    Doctor required:{' '}
                    <strong
                      className={
                        h.result?.doctorRequired ? 'text-danger' : 'text-success'
                      }
                    >
                      {h.result?.doctorRequired ? 'Yes' : 'No'}
                    </strong>
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
