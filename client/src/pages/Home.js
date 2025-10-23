import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';

export default function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/check', { replace: true });
    } else if (user === null) {
      navigate('/login', { replace: true });
    }
  }, [user, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to Symptom Checker</h2>
        <p className="text-gray-600 mb-4">
          Please{' '}
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Login
          </Link>{' '}
          or{' '}
          <Link to="/register" className="text-blue-600 hover:underline font-medium">
            Register
          </Link>{' '}
          to continue.
        </p>
        <p className="text-sm text-gray-400">
          After login, you'll be redirected to the Symptom Check page.
        </p>
      </div>
    </div>
  );
}
