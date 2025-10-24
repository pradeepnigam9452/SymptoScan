

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './SymptomInput.css'; // import custom styles

function SymptomInput() {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    symptom: ''
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const { symptom } = formData;

      try {
        // Authenticated request
        const res = await axios.post(
          'http://localhost:5000/api/symptoms/check',
          { symptom },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        localStorage.setItem('lastResult', JSON.stringify(res.data));
        navigate('/results');
      } catch (innerErr) {
        // Fallback for unauthorized users
        if (innerErr.response?.status === 401) {
          const publicRes = await axios.post(
            'http://localhost:5000/api/symptoms/check-public',
            { symptom }
          );
          localStorage.setItem('lastResult', JSON.stringify(publicRes.data));
          navigate('/results');
        } else {
          throw innerErr;
        }
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'An unexpected error occurred.');
    }
  };

  return (
    <div className="symptom-container">
      <div className="form-card animate-fade-in">
        <h3 className="text-center mb-4 text-gradient">Check Your Symptom</h3>

        {message && <div className="alert alert-danger animate-shake">{message}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your name"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="contact" className="form-label">Contact</label>
            <input
              id="contact"
              name="contact"
              type="text"
              className="form-control"
              value={formData.contact}
              onChange={handleChange}
              required
              placeholder="Enter your phone or email"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="symptom" className="form-label">
              Symptom (e.g., headache, fever, cold)
            </label>
            <input
              id="symptom"
              name="symptom"
              type="text"
              className="form-control"
              value={formData.symptom}
              onChange={handleChange}
              required
              placeholder="Describe your symptom"
            />
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-animated">
              Check Symptom
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SymptomInput;
