import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';

export default function TopNav(){
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function doLogout(){
    logout();
    navigate('/login');
  }

  return (
    <nav className="navbar navbar-expand bg-light mb-3">
      <div className="container">
        <Link to="/" className="navbar-brand">Symptom Checker</Link>
        <div className="navbar-nav">
          {user ? (
            <>
              <span className="navbar-text me-2">Hello, {user.name}</span>
              <Link className="nav-link" to="/check">Check</Link>
              <Link className="nav-link" to="/history">History</Link>
              <Link className="nav-link" to="/symptoms">Seeded</Link>
              <button className="btn btn-sm btn-outline-secondary ms-2" onClick={doLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link className="nav-link" to="/login">Login</Link>
              <Link className="nav-link" to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
