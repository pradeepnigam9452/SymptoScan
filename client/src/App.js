import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import SymptomInput from './pages/SymptomInput';
import Results from './pages/Results';
import History from './pages/History';
import SymptomList from './pages/SymptomList';
import Home from './pages/Home';
import { AuthProvider } from './auth/AuthProvider';
import ProtectedRoute from './auth/ProtectedRoute';
import TopNav from './components/TopNav';

function App(){
  return (
    <AuthProvider>
      <BrowserRouter>
        <TopNav />
        <div className="container">
          <Routes>
            {/* Show Login first when visiting root so users must login or register */}
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/results" element={<Results />} />
            <Route path="/check" element={<ProtectedRoute><SymptomInput /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
            <Route path="/symptoms" element={<SymptomList />} />
            <Route path="/home" element={<Home />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;