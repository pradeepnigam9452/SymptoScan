import React, { useEffect, useState } from 'react';
import axios from 'axios';

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

        // Sort by most recent
        setHistory((res.data.history || []).sort((a, b) => new Date(b.checkedAt) - new Date(a.checkedAt)));
      } catch (err) {
        setMsg(err.response?.data?.message || 'Error loading history');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-2xl rounded-2xl p-8">
        <h3 className="text-3xl font-bold text-center text-indigo-700 mb-6">
          🩺 Your Health History
        </h3>

        {/* Status messages */}
        {loading && (
          <div className="text-center text-indigo-500 font-medium animate-pulse">
            Loading your history...
          </div>
        )}
        {!loading && msg && (
          <div className="bg-red-100 text-red-800 border border-red-300 rounded-md p-3 mb-4 text-center">
            {msg}
          </div>
        )}
        {!loading && history.length === 0 && !msg && (
          <div className="bg-blue-100 text-blue-800 border border-blue-300 rounded-md p-3 text-center">
            No history yet. Start by checking your symptoms!
          </div>
        )}

        {/* History list */}
        <ul className="space-y-4">
          {history.map((h, idx) => (
            <li
              key={idx}
              className={`p-5 rounded-xl shadow-md transition-transform transform hover:scale-[1.02] ${
                h.result?.doctorRequired
                  ? 'bg-red-50 border-l-4 border-red-400'
                  : 'bg-green-50 border-l-4 border-green-400'
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <h4 className="text-xl font-semibold text-gray-800">{h.symptom}</h4>
                <span className="text-sm text-gray-500">
                  {new Date(h.checkedAt).toLocaleString()}
                </span>
              </div>
              <div className="text-gray-700 mt-1">
                {h.result?.message ? (
                  <em
                    className={`${
                      h.result?.doctorRequired ? 'text-red-600' : 'text-green-600'
                    } font-medium`}
                  >
                    {h.result.message}
                  </em>
                ) : (
                  <span>
                    Doctor required:{' '}
                    <span
                      className={
                        h.result?.doctorRequired
                          ? 'text-red-600 font-semibold'
                          : 'text-green-600 font-semibold'
                      }
                    >
                      {h.result?.doctorRequired ? 'Yes' : 'No'}
                    </span>
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
