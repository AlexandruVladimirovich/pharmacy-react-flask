import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(localStorage.getItem('token') || null);
  const [role, setRole] = useState(localStorage.getItem('role') || 'user');
  const [firstName, setFirstName] = useState(localStorage.getItem('firstName') || '');  

  const handleLogin = (token, userRole, userFirstName) => {
    setAuthToken(token);
    setRole(userRole);
    setFirstName(userFirstName);  
    localStorage.setItem('token', token);
    localStorage.setItem('role', userRole);
    localStorage.setItem('firstName', userFirstName);  
  };
  

  const handleLogout = () => {
    setAuthToken(null);
    setRole('user');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedRole = localStorage.getItem('role');


    if (storedToken && storedRole) {
      setAuthToken(storedToken);
      setRole(storedRole);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ authToken, onLogin: handleLogin, onLogout: handleLogout, role, firstName }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};