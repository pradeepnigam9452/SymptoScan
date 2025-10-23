import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }){
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(()=>{
    const saved = localStorage.getItem('user');
    const t = localStorage.getItem('token');
    if (saved && t){
      try{
        setUser(JSON.parse(saved));
        setToken(t);
      }catch(e){
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
  }, []);

  function login(newToken, newUser){
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  }

  function logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(){
  return useContext(AuthContext);
}

export default AuthProvider;
