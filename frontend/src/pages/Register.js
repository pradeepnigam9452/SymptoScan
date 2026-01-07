
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import './Register.css';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  // ✅ Use environment variable for API
  const API_URL = process.env.REACT_APP_API_URL || 'https://sympto-scan-red.vercel.app';

  const submit = async (e) => {
    e.preventDefault();
    setMsg('');
    try {
      const res = await axios.post(`${API_URL}/api/auth/register`, {
        name,
        email,
        password,
      });

      // Login user after registration
      login(res.data.token, res.data.user);
      setMsg('Registered successfully.');
      navigate('/check');
    } catch (err) {
      setMsg(err.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <div className="register-page">
      <div className="register-card animate-fade-in">
        <h3 className="register-title">Create Your Account 👤</h3>
        <p className="register-subtitle">Join us to start tracking your health.</p>

        {msg && (
          <div
            className={`alert ${msg.includes('success') ? 'success' : 'error'} animate-shake`}
          >
            {msg}
          </div>
        )}

        <form onSubmit={submit} className="register-form">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="register-btn">
            Register
          </button>

          <p className="register-footer">
            Already have an account?{' '}
            <span className="link" onClick={() => navigate('/login')}>
              Log in
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;



// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../auth/AuthProvider';
// import './Register.css';

// function Register() {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [msg, setMsg] = useState('');
//   const navigate = useNavigate();
//   const { login } = useAuth();

//   const submit = async (e) => {
//     e.preventDefault();
//     setMsg('');
//     try {
//       const res = await axios.post('http://localhost:5000/api/auth/register', {
//         name,
//         email,
//         password,
//       });
//       login(res.data.token, res.data.user);
//       setMsg('Registered successfully.');
//       navigate('/check');
//     } catch (err) {
//       setMsg(err.response?.data?.message || 'Registration failed.');
//     }
//   };

//   return (
//     <div className="register-page">
//       <div className="register-card animate-fade-in">
//         <h3 className="register-title">Create Your Account 👤</h3>
//         <p className="register-subtitle">Join us to start tracking your health.</p>

//         {msg && (
//           <div
//             className={`alert ${
//               msg.includes('success') ? 'success' : 'error'
//             } animate-shake`}
//           >
//             {msg}
//           </div>
//         )}

//         <form onSubmit={submit} className="register-form">
//           <div className="form-group">
//             <label>Full Name</label>
//             <input
//               type="text"
//               placeholder="Enter your full name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               required
//             />
//           </div>

//           <div className="form-group">
//             <label>Email Address</label>
//             <input
//               type="email"
//               placeholder="Enter your email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>

//           <div className="form-group">
//             <label>Password</label>
//             <input
//               type="password"
//               placeholder="Enter a strong password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>

//           <button type="submit" className="register-btn">
//             Register
//           </button>

//           <p className="register-footer">
//             Already have an account?{' '}
//             <span className="link" onClick={() => navigate('/login')}>
//               Log in
//             </span>
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default Register;
