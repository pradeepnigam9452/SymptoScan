import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import './TopNav.css';

export default function TopNav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function doLogout() {
    logout();
    navigate('/login');
  }

  return (
    <nav className="topnav-container animate-fade-in">
      <div className="topnav-content">
        <Link to="/symptoms" className="brand">
          🩺 Symptom Checker
        </Link>

        <div className="nav-links">
          {user ? (

            <>
             <span className="user-name">Hello, {user.name}</span>
             <Link className="nav-item" to="/home">
                Home
              </Link>
             
               <Link className="nav-item" to="/symptoms">
                Symptoms
              </Link>
              <Link className="nav-item" to="/check">
                Check
              </Link>
              <Link className="nav-item" to="/history">
                History
              </Link>
             
              <button className="logout-btn" onClick={doLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="nav-item" to="/login">
                Login
              </Link>
              <Link className="nav-item" to="/register">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
