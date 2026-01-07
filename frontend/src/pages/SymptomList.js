import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SymptomList.css';

function SymptomList() {
  const [list, setList] = useState([]);
  const [msg, setMsg] = useState('');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/symptoms/all')
      .then((res) => setList(res.data.symptoms || []))
      .catch((err) => setMsg(err.response?.data?.message || 'Error fetching symptoms'));

    // 2.5 second delay before showing content
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  const filteredList = list.filter((item) =>
    item.name?.toLowerCase().includes(search.toLowerCase())
  );

  const toggleExpand = (id) => {
    setExpanded(expanded === id ? null : id);
  };

  return (
    <div className="symptom-list-page">
      {loading ? (
        <div className="loading-screen animate-fade-in">
          <div className="spinner"></div>
          <h2>Loading symptoms...</h2>
        </div>
      ) : (
        <>
          <div className="symptom-header animate-fade-in">
            <h2 className="text-gradient">🌿 Symptom Knowledge Base</h2>
            <p className="text-light">Explore common symptoms and their possible treatments.</p>

            <input
              type="text"
              placeholder="🔍 Search symptoms..."
              className="search-bar"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {msg && <div className="alert alert-danger animate-shake">{msg}</div>}

          <div className="symptom-grid">
            {filteredList.length > 0 ? (
              filteredList.map((s, i) => (
                <div
                  key={s._id || i}
                  className={`symptom-card animate-slide-in ${expanded === s._id ? 'expanded' : ''}`}
                  style={{ animationDelay: `${i * 0.1}s` }}
                  onClick={() => toggleExpand(s._id)}
                >
                  <h4>{s.name}</h4>

                  {expanded === s._id && (
                    <div className="symptom-details animate-fade-in">
                      <p><strong>Causes:</strong> {s.causes?.join(', ') || 'N/A'}</p>
                      <p><strong>Remedies:</strong> {s.remedies?.join(', ') || 'N/A'}</p>
                      <p><strong>Medicines:</strong> {s.medicines?.join(', ') || 'N/A'}</p>
                      <p>
                        <strong>Doctor required:</strong>{' '}
                        <span className={s.doctorRequired ? 'text-danger' : 'text-success'}>
                          {s.doctorRequired ? 'Yes' : 'No'}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="no-results text-light">No symptoms found matching your search.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default SymptomList;
