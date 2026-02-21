import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = localStorage.getItem('userToken');
    const u = localStorage.getItem('userData');
    setToken(t);
    setUser(u ? JSON.parse(u) : null);
    setLoading(false);
  }, []);

  const signIn = (t, userData) => {
    localStorage.setItem('userToken', t);
    localStorage.setItem('userData', JSON.stringify(userData));
    setToken(t);
    setUser(userData);
  };

  const signOut = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
